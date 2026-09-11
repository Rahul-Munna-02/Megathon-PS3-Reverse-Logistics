import React, { useEffect, useState } from 'react';
import { Truck, AlertTriangle, PackageCheck, RefreshCw } from 'lucide-react';
import { medtraceService } from '../../services/medtraceService';
import type { ReturnRequest } from '../../types/medtrace';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface DistributorDashboardProps {
  onOpenPassport: (batchNumber: string) => void;
}

export const DistributorDashboard: React.FC<DistributorDashboardProps> = ({ onOpenPassport }) => {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(false);

  // Receive modal
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const [receivedQty, setReceivedQty] = useState<number>(100);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const rList = await medtraceService.fetchReturns();
      setReturns(rList);
    } catch (e) {
      console.warn('Error loading distributor dashboard:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReceiptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReturn || !selectedReturn.batch) return;

    setSubmitting(true);
    try {
      await medtraceService.confirmDistributorReceipt(
        selectedReturn.batch.batch_number,
        receivedQty
      );

      if (receivedQty !== selectedReturn.expected_quantity) {
        alert(
          `⚠️ QUANTITY DISCREPANCY DETECTED!\nExpected: ${selectedReturn.expected_quantity}, Received: ${receivedQty}.\nReturn status updated to DISPUTED and Fraud Alert created in database.`
        );
      } else {
        alert(`Receipt confirmed for Batch ${selectedReturn.batch.batch_number}`);
      }

      setSelectedReturn(null);
      loadData();
    } catch (err: any) {
      alert(err?.message || 'Receipt confirmation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const pendingPickups = returns.filter((r) => r.status === 'REQUESTED' || r.status === 'PICKUP_ASSIGNED');
  const receivedReturns = returns.filter((r) => r.status === 'RECEIVED');
  const disputedReturns = returns.filter((r) => r.status === 'DISPUTED');

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-sky-400">DISTRIBUTION LOGISTICS WORKFLOW</span>
          <h2 className="text-2xl font-bold text-white mt-1">SunRise Logistics & Distributors</h2>
          <p className="text-xs text-slate-400 mt-1">Verify retail pickup quantities, reconcile physical handoffs & forward stock to manufacturer.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadData}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold py-2 px-4 rounded-xl flex items-center space-x-2 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Handoffs</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Pickups</span>
            <Truck className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white">{pendingPickups.length}</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Received Returns</span>
            <PackageCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-300">{receivedReturns.length}</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Quantity Disputes</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black font-mono text-rose-400">{disputedReturns.length}</div>
        </div>
      </div>

      {/* Pending Pickups & Quantity Inspection Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4">Retail Return Pickup Verification Queue</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-bold bg-slate-950/60">
                <th className="p-3">Batch Number</th>
                <th className="p-3">Retailer Store</th>
                <th className="p-3">Expected Qty</th>
                <th className="p-3">Received Qty</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {returns.map((r) => {
                const batchNum = r.batch?.batch_number || 'MED-2026-001';
                const retailerName = r.retailer?.name || 'MedPlus Pharmacy';

                return (
                  <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-bold text-white">{batchNum}</td>
                    <td className="p-3 font-sans text-slate-300">{retailerName}</td>
                    <td className="p-3 text-sky-300">{r.expected_quantity} units</td>
                    <td className="p-3">
                      {r.received_quantity !== undefined && r.received_quantity !== null ? (
                        <span className={r.received_quantity !== r.expected_quantity ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                          {r.received_quantity} units
                        </span>
                      ) : (
                        <span className="text-slate-500">Unverified</span>
                      )}
                    </td>
                    <td className="p-3">
                      <Badge status={r.status} />
                    </td>
                    <td className="p-3 text-right space-x-2 font-sans">
                      <button
                        onClick={() => onOpenPassport(batchNum)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs transition-colors"
                      >
                        Passport
                      </button>

                      {r.status === 'REQUESTED' && (
                        <button
                          onClick={() => {
                            setSelectedReturn(r);
                            setReceivedQty(r.expected_quantity);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors"
                        >
                          Verify Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verify Return Receipt Modal */}
      {selectedReturn && (
        <Modal
          isOpen={!!selectedReturn}
          onClose={() => setSelectedReturn(null)}
          title={`Verify Distributor Receipt: ${selectedReturn.batch?.batch_number || 'MED-2026-001'}`}
          subtitle="Confirm physical count against retailer manifest"
        >
          <form onSubmit={handleConfirmReceiptSubmit} className="space-y-4 font-sans text-slate-200">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
              <div><span className="text-slate-400">Retail Manifest Expected:</span> <strong className="text-sky-300">{selectedReturn.expected_quantity} units</strong></div>
              <div><span className="text-slate-400">Return Reason:</span> {selectedReturn.return_reason || 'Expired retail stock'}</div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Actual Physical Received Quantity
              </label>
              <input
                type="number"
                value={receivedQty}
                onChange={(e) => setReceivedQty(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500 font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Tip: Enter <span className="font-mono text-rose-400 font-bold">96</span> (instead of 100) to simulate an automatic quantity discrepancy alert.
              </p>
            </div>

            {receivedQty !== selectedReturn.expected_quantity && (
              <div className="p-3 bg-rose-950/80 border border-rose-600 rounded-xl text-xs text-rose-200 flex items-center space-x-2 animate-pulse">
                <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                <span>
                  <strong>DISCREPANCY WARNING:</strong> Received count ({receivedQty}) differs from expected count ({selectedReturn.expected_quantity}). This action will auto-create a QUANTITY_DISCREPANCY fraud alert.
                </span>
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedReturn(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold py-2 px-5 rounded-xl shadow-lg shadow-sky-950/50"
              >
                {submitting ? 'Confirming RPC...' : 'Save Handoff Verification'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
