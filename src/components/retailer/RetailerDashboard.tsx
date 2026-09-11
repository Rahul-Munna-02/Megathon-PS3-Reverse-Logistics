import React, { useEffect, useState } from 'react';
import { Package, AlertCircle, Clock, Send, Search, ShieldCheck, RefreshCw } from 'lucide-react';
import { medtraceService } from '../../services/medtraceService';
import type { Batch, Organization, ReturnRequest } from '../../types/medtrace';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface RetailerDashboardProps {
  onOpenTrustGate: (batchNumber?: string) => void;
  onOpenPassport: (batchNumber: string) => void;
}

export const RetailerDashboard: React.FC<RetailerDashboardProps> = ({
  onOpenTrustGate,
  onOpenPassport
}) => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [distributors, setDistributors] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  // Return Modal State
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [distributorId, setDistributorId] = useState('33333333-3333-3333-3333-333333333333');
  const [returnQty, setReturnQty] = useState<number>(100);
  const [returnReason, setReturnReason] = useState('Expired retail stock');
  const [submittingReturn, setSubmittingReturn] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const bList = await medtraceService.fetchBatches();
      setBatches(bList);
      const rList = await medtraceService.fetchReturns();
      setReturns(rList);
      const orgs = await medtraceService.fetchOrganizations();
      setDistributors(orgs.filter((o) => o.type === 'DISTRIBUTOR'));
    } catch (e) {
      console.warn('Error loading retailer dashboard:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatch) return;

    setSubmittingReturn(true);
    try {
      await medtraceService.createReturn(
        selectedBatch.batch_number,
        '11111111-1111-1111-1111-111111111111', // MedPlus Retailer ID
        distributorId,
        returnQty,
        returnReason
      );
      alert(`Return request submitted for Batch ${selectedBatch.batch_number}`);
      setSelectedBatch(null);
      loadData();
    } catch (err: any) {
      alert(err?.message || 'Return creation failed');
    } finally {
      setSubmittingReturn(false);
    }
  };

  const filteredBatches = batches.filter(
    (b) =>
      b.batch_number.toLowerCase().includes(search.toLowerCase()) ||
      b.medicine_name.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = batches.filter((b) => b.status === 'ACTIVE').length;
  const expiringCount = batches.filter((b) => b.status === 'EXPIRING_SOON').length;
  const expiredCount = batches.filter((b) => b.status === 'EXPIRED').length;
  const returnCount = returns.length;

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Banner & Quick Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-400">RETAIL PHARMACY WORKFLOW</span>
          <h2 className="text-2xl font-bold text-white mt-1">MedPlus Pharmacy #104</h2>
          <p className="text-xs text-slate-400 mt-1">Manage retail shelf inventory, track expiring medicines & issue reverse supply chain returns.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onOpenTrustGate('MED-2026-001')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center space-x-2 shadow-lg shadow-emerald-950/50 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Trust Gate Scan</span>
          </button>

          <button
            onClick={loadData}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold p-2.5 rounded-xl transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Inventory</span>
            <Package className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white">{activeCount}</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Expiring Soon</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-300">{expiringCount}</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Expired Stock</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black font-mono text-rose-400">{expiredCount}</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Returns Created</span>
            <Send className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black font-mono text-sky-300">{returnCount}</div>
        </div>
      </div>

      {/* Main Inventory Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <h3 className="text-base font-bold text-white tracking-wide">Shelf Medicine Batches</h3>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search batch or medicine..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-bold bg-slate-950/60">
                <th className="p-3">Batch #</th>
                <th className="p-3">Medicine Name</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Expiry Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredBatches.map((b) => {
                const canReturn = ['ACTIVE', 'EXPIRING_SOON', 'EXPIRED'].includes(b.status);

                return (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-bold text-white">{b.batch_number}</td>
                    <td className="p-3 font-sans text-slate-200">{b.medicine_name}</td>
                    <td className="p-3">{b.current_quantity} units</td>
                    <td className="p-3 text-amber-300">{b.expiry_date}</td>
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

                      {canReturn && (
                        <button
                          onClick={() => {
                            setSelectedBatch(b);
                            setReturnQty(b.current_quantity);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                        >
                          Initiate Return
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

      {/* Return Request Modal */}
      {selectedBatch && (
        <Modal
          isOpen={!!selectedBatch}
          onClose={() => setSelectedBatch(null)}
          title={`Initiate Reverse Return: ${selectedBatch.batch_number}`}
          subtitle="Flag expired/unused inventory for distributor pickup"
        >
          <form onSubmit={handleCreateReturnSubmit} className="space-y-4 font-sans text-slate-200">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-1">
              <div><span className="text-slate-400">Medicine:</span> {selectedBatch.medicine_name}</div>
              <div><span className="text-slate-400">Batch Expiry:</span> {selectedBatch.expiry_date}</div>
              <div><span className="text-slate-400">Current Stock:</span> {selectedBatch.current_quantity} units</div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Assign Distributor for Pickup
              </label>
              <select
                value={distributorId}
                onChange={(e) => setDistributorId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                {distributors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.location})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Expected Return Quantity
              </label>
              <input
                type="number"
                value={returnQty}
                onChange={(e) => setReturnQty(parseInt(e.target.value) || 0)}
                max={selectedBatch.current_quantity}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Return Reason / Compliance Notes
              </label>
              <textarea
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
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
                disabled={submittingReturn}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 px-5 rounded-xl shadow-lg shadow-emerald-950/50"
              >
                {submittingReturn ? 'Submitting RPC...' : 'Confirm Return Request'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
