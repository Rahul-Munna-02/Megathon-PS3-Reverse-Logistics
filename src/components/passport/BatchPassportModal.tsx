import React, { useEffect, useState } from 'react';
import { QrCode, Clock, MapPin, Package, Activity } from 'lucide-react';
import { medtraceService } from '../../services/medtraceService';
import type { Batch, BatchEvent, PackageItem } from '../../types/medtrace';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface BatchPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchNumber: string;
}

export const BatchPassportModal: React.FC<BatchPassportModalProps> = ({
  isOpen,
  onClose,
  batchNumber
}) => {
  const [batch, setBatch] = useState<Batch | null>(null);
  const [timeline, setTimeline] = useState<BatchEvent[]>([]);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && batchNumber) {
      loadBatchPassportData();
    }
  }, [isOpen, batchNumber]);

  const loadBatchPassportData = async () => {
    setLoading(true);
    try {
      const b = await medtraceService.getBatchByNumber(batchNumber);
      setBatch(b);
      if (b) {
        const events = await medtraceService.getBatchTimeline(batchNumber);
        setTimeline(events);
        const pkgs = await medtraceService.getBatchPackages(b.id);
        setPackages(pkgs);
      }
    } catch (err) {
      console.warn('Error loading batch passport data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`BATCH PASSPORT: ${batchNumber}`}
      subtitle="Complete Digital Chain of Custody & Verification History"
      maxWidth="max-w-4xl"
    >
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-3">
          <Activity className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-xs text-slate-400 font-mono">Fetching full chain ledger from PostgreSQL database...</p>
        </div>
      ) : !batch ? (
        <div className="py-8 text-center text-slate-400">Batch record not found in system.</div>
      ) : (
        <div className="space-y-6 text-slate-100">
          {/* Header Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Medicine</div>
              <div className="text-sm font-bold text-white mt-0.5">{batch.medicine_name}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Qty</div>
              <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5">
                {batch.current_quantity} / {batch.quantity} units
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Expiry Date</div>
              <div className="text-sm font-mono text-amber-300 mt-0.5">{batch.expiry_date}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</div>
              <div className="mt-0.5">
                <Badge status={batch.status} />
              </div>
            </div>
          </div>

          {/* Chain of Custody Timeline */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Chain of Custody Event Ledger ({timeline.length} Hand-offs)</span>
            </h4>

            {timeline.length === 0 ? (
              <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl text-xs text-slate-400">
                Initial manufacturing event recorded.
              </div>
            ) : (
              <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
                {timeline.map((evt, idx) => {
                  const isFraudEvt = evt.event_type === 'REENTRY_DETECTED';
                  const isDestruction = evt.event_type === 'DESTROYED';

                  return (
                    <div key={evt.id || idx} className="relative group">
                      {/* Timeline node marker */}
                      <div
                        className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isFraudEvt
                            ? 'bg-rose-600 border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.5)]'
                            : isDestruction
                            ? 'bg-purple-600 border-purple-400'
                            : 'bg-emerald-600 border-emerald-400'
                        }`}
                      />

                      <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                          <span
                            className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                              isFraudEvt
                                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                : isDestruction
                                ? 'bg-purple-950 text-purple-300 border border-purple-800'
                                : 'bg-slate-800 text-emerald-300'
                            }`}
                          >
                            {evt.event_type}
                          </span>

                          <span className="text-[11px] font-mono text-slate-400">
                            {new Date(evt.timestamp).toLocaleString()}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 mt-2 font-mono">
                          {evt.location && (
                            <div className="flex items-center space-x-1.5 text-slate-300">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span>Location: {evt.location}</span>
                            </div>
                          )}

                          {evt.quantity !== undefined && evt.quantity !== null && (
                            <div className="flex items-center space-x-1.5 text-slate-300">
                              <Package className="w-3.5 h-3.5 text-slate-400" />
                              <span>Quantity Handled: {evt.quantity} units</span>
                            </div>
                          )}
                        </div>

                        {evt.metadata && Object.keys(evt.metadata).length > 0 && (
                          <div className="mt-2 text-[11px] font-mono bg-slate-900/80 p-2 rounded border border-slate-800 text-slate-400">
                            {JSON.stringify(evt.metadata)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Serialized Package Items */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-2">
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>Serialized Packages ({packages.length} Tracked Serial Units)</span>
            </h4>

            {packages.length === 0 ? (
              <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl text-xs text-slate-400 font-mono">
                No individual package serial numbers registered for this batch.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl font-mono text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">{pkg.serial_number}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {pkg.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">GTIN: {pkg.qr_payload?.gtin || 'N/A'}</div>
                    <div className="text-[10px] text-slate-400 truncate">Expiry: {pkg.qr_payload?.expiry || 'N/A'}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
