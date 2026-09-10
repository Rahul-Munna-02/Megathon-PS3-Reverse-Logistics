import { supabase } from '../lib/supabase';
import type { DestructionCertificate } from '../types/medtrace';

export const manufacturerFraudService = {
  async markManufacturerReceived(batchId: string, receivedQty: number, actorId: string, orgId: string, location: string) {
    const { data: batch, error: fetchErr } = await supabase
      .from('batches')
      .select('*')
      .eq('id', batchId)
      .single();

    if (fetchErr || !batch) throw new Error('Batch not found');
    if (batch.quantity !== receivedQty) {
      throw new Error(`Quantity discrepancy: Expected ${batch.quantity}, received ${receivedQty}`);
    }

    const { error: updateErr } = await supabase
      .from('batches')
      .update({
        status: 'MANUFACTURER_RECEIVED',
        current_quantity: receivedQty,
        updated_at: new Date().toISOString()
      })
      .eq('id', batchId);

    if (updateErr) throw updateErr;

    await supabase.from('batch_events').insert({
      batch_id: batchId,
      event_type: 'MANUFACTURER_RECEIVED',
      actor_id: actorId,
      organization_id: orgId,
      quantity: receivedQty,
      timestamp: new Date().toISOString(),
      location
    });

    return true;
  },

  async scheduleDestruction(batchId: string, facilityId: string, actorId: string, orgId: string) {
    const { error } = await supabase
      .from('batches')
      .update({
        status: 'PENDING_DESTRUCTION',
        updated_at: new Date().toISOString()
      })
      .eq('id', batchId);

    if (error) throw error;

    await supabase.from('batch_events').insert({
      batch_id: batchId,
      event_type: 'SENT_FOR_DESTRUCTION',
      actor_id: actorId,
      organization_id: orgId,
      quantity: 0,
      timestamp: new Date().toISOString(),
      location: facilityId
    });

    return true;
  },

  async uploadCertificateFile(file: File, batchNumber: string) {
    const filePath = `certificates/${batchNumber}/${Date.now()}_${file.name}`;
    const { error: uploadErr } = await supabase.storage
      .from('destruction-certificates')
      .upload(filePath, file, { upsert: true });

    if (uploadErr) throw uploadErr;

    const { data } = supabase.storage
      .from('destruction-certificates')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  async markBatchDestroyed(batchId: string, certData: Omit<DestructionCertificate, 'id' | 'created_at'>, actorId: string, orgId: string) {
    const { data: batch } = await supabase.from('batches').select('*').eq('id', batchId).single();
    if (!batch) throw new Error('Batch not found');
    if (batch.status === 'DESTROYED') throw new Error('Batch is already marked as destroyed.');

    if (certData.verification_status !== 'VERIFIED') {
      throw new Error('Cannot destroy batch without a verified certificate.');
    }

    const { data: cert, error: certErr } = await supabase
      .from('destruction_certificates')
      .insert({ ...certData, batch_id: batchId })
      .select()
      .single();

    if (certErr) throw certErr;

    const { error: batchErr } = await supabase
      .from('batches')
      .update({
        status: 'DESTROYED',
        updated_at: new Date().toISOString()
      })
      .eq('id', batchId);

    if (batchErr) throw batchErr;

    await supabase.from('batch_events').insert({
      batch_id: batchId,
      event_type: 'DESTROYED',
      actor_id: actorId,
      organization_id: orgId,
      quantity: certData.quantity_destroyed,
      timestamp: new Date().toISOString(),
      location: certData.facility_id,
      metadata: { certificate_number: certData.certificate_number }
    });

    return cert;
  },

  async checkBatchForReentry(batchNumber: string, scanLocation: string) {
    const { data: batch, error } = await supabase
      .from('batches')
      .select('*')
      .eq('batch_number', batchNumber)
      .maybeSingle();

    if (error || !batch) {
      return { status: 'UNKNOWN_BATCH', batch: null, alert: null };
    }

    if (batch.status === 'DESTROYED') {
      await supabase.from('batch_events').insert({
        batch_id: batch.id,
        event_type: 'REENTRY_DETECTED',
        actor_id: 'scanner-client',
        organization_id: 'system',
        quantity: batch.quantity,
        timestamp: new Date().toISOString(),
        location: scanLocation
      });

      const { data: alert } = await supabase
        .from('fraud_alerts')
        .insert({
          batch_id: batch.id,
          alert_type: 'DESTROYED_BATCH_REENTRY',
          risk_score: 92,
          description: `Destroyed batch detected again in supply chain at ${scanLocation}.`,
          detected_location: scanLocation,
          status: 'OPEN',
          detected_at: new Date().toISOString()
        })
        .select()
        .single();

      return { status: 'FRAUD', batch, alert };
    }

    if (batch.status === 'PENDING_DESTRUCTION') {
      return { status: 'WARNING', batch, alert: null };
    }

    if (batch.status === 'EXPIRED') {
      return { status: 'EXPIRED', batch, alert: null };
    }

    return { status: 'VALID', batch, alert: null };
  },

  async getBatchTimeline(batchId: string) {
    const { data, error } = await supabase
      .from('batch_events')
      .select('*')
      .eq('batch_id', batchId)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data;
  }
};
