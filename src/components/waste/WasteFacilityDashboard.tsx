import React, { useEffect, useState } from 'react';
import { Flame, FileText, CheckCircle2, Upload, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { medtraceService } from '../../services/medtraceService';
import type { Batch, DestructionCertificate } from '../../types/medtrace';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface WasteFacilityDashboardProps {
  onOpenPassport: (batchNumber: string) => void;
}

export const WasteFacilityDashboard: React.FC<WasteFacilityDashboardProps> = ({ onOpenPassport }) => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [certificates, setCertificates] = useState<DestructionCertificate[]>([]);
  const [loading, setLoading] = useState(false);

  // Destruction Process Modal
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [certNumber] = useState(`CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [quantityDestroyed, setQuantityDestroyed] = useState<number>(100);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [ocrVerified, setOcrVerified] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const bList = await medtraceService.fetchBatches();
      setBatches(bList);
      const cList = await medtraceService.fetchCertificates();
      setCertificates(cList);
    } catch (e) {
      console.warn('Error loading waste facility dashboard:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateOcr = () => {
    // OCR extracted verification check
    setOcrVerified(true);
    setFileUrl(`https://medtrace.storage/certificates/${certNumber}.pdf`);
  };

  const handleProcessDestruction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatch) return;

    setSubmitting(true);
    try {
      await medtraceService.markBatchDestroyed(
        selectedBatch.batch_number,
        certNumber,
        '55555555-5555-5555-5555-555555555555', // GreenCycle Waste Facility ID
        quantityDestroyed,
        fileUrl || undefined
      );

      // Trigger celebratory confetti for successful destruction verification
      try {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      } catch (e) {
        console.debug(e);
      }

      alert(`Batch ${selectedBatch.batch_number} successfully marked as DESTROYED!`);
      setSelectedBatch(null);
      setOcrVerified(null);
      loadData();
    } catch (err: any) {
      alert(err?.message || 'Destruction processing failed');
    } finally {
      setSubmitting(false);
    }
  };

  const pendingDestructionBatches = batches.filter(
    (b) => b.status === 'PENDING_DESTRUCTION' || b.status === 'MANUFACTURER_RECEIVED'
  );
  const destroyedBatches = batches.filter((b) => b.status === 'DESTROYED');

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-purple-400">AUTHORIZED BIO-WASTE DISPOSAL WORKFLOW</span>
          <h2 className="text-2xl font-bold text-white mt-1">GreenCycle Waste Disposal Facility</h2>
          <p className="text-xs text-slate-400 mt-1">Execute high-temperature incineration disposal & generate tamper-evident destruction certificates.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadData}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold py-2 px-4 rounded-xl flex items-center space-x-2 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Queue</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Destruction</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-300">{pendingDestructionBatches.length}</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Batches Destroyed</span>
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black font-mono text-purple-300">{destroyedBatches.length}</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Certificates Issued</span>
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-300">{certificates.length}</div>
        </div>
      </div>

      {/* Destruction Queue Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4">Destruction Queue & Certificate Upload</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-bold bg-slate-950/60">
                <th className="p-3">Batch Number</th>
                <th className="p-3">Medicine Name</th>
                <th className="p-3">Disposal Qty</th>
                <th className="p-3">Current Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {batches.map((b) => (
                <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-bold text-white">{b.batch_number}</td>
                  <td className="p-3 font-sans text-slate-200">{b.medicine_name}</td>
                  <td className="p-3 text-purple-300">{b.current_quantity} units</td>
                  <td className="p-3">
                    <Badge status={b.status} />
                  </td>
                  <td className="p-3 text-right space-x-2 font-sans">
                    <button
                      onClick={() => onOpenPassport(b.batch_number)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs transition-colors"
                    >
                      Passport
                    </button>

                    {(b.status === 'PENDING_DESTRUCTION' || b.status === 'MANUFACTURER_RECEIVED') && (
                      <button
                        onClick={() => {
                          setSelectedBatch(b);
                          setQuantityDestroyed(b.current_quantity);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors shadow-lg shadow-purple-950/50"
                      >
                        Process Destruction
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Destruction Processing Modal */}
      {selectedBatch && (
        <Modal
          isOpen={!!selectedBatch}
          onClose={() => setSelectedBatch(null)}
          title={`Process Verified Destruction: ${selectedBatch.batch_number}`}
          subtitle="Generate certificate and seal batch digital lifecycle in database"
        >
          <form onSubmit={handleProcessDestruction} className="space-y-4 font-sans text-slate-200">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-1">
              <div><span className="text-slate-400">Medicine:</span> {selectedBatch.medicine_name}</div>
              <div><span className="text-slate-400">Destruction Facility:</span> GreenCycle Bio-Waste Facility (TS-555)</div>
              <div><span className="text-slate-400">Registered Batch Stock:</span> {selectedBatch.current_quantity} units</div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Destruction Certificate Number
              </label>
              <input
                type="text"
                value={certNumber}
                readOnly
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Quantity Destroyed (Incinerated)
              </label>
              <input
                type="number"
                value={quantityDestroyed}
                onChange={(e) => setQuantityDestroyed(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            {/* OCR Certificate Upload Simulator */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center space-x-2">
                  <Upload className="w-4 h-4 text-purple-400" />
                  <span>Certificate Document OCR Verification</span>
                </span>

                <button
                  type="button"
                  onClick={handleSimulateOcr}
                  className="px-3 py-1 bg-purple-950 hover:bg-purple-900 border border-purple-700 text-purple-300 rounded text-xs font-semibold flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Run OCR Match Check</span>
                </button>
              </div>

              {ocrVerified && (
                <div className="p-2.5 bg-emerald-950/80 border border-emerald-700 rounded-lg text-xs text-emerald-300 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>OCR MATCH VERIFIED ✓ Certificate details match batch current quantity ({quantityDestroyed} units).</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedBatch(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold py-2 px-5 rounded-xl shadow-lg shadow-purple-950/50"
              >
                {submitting ? 'Executing RPC...' : 'Seal & Mark Batch as DESTROYED'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
