import React, { useEffect, useState } from 'react';
import { ShieldAlert, RefreshCw, BarChart2, Eye, Lock } from 'lucide-react';
import { medtraceService } from '../../services/medtraceService';
import type { Batch, FraudAlert, ManufacturerStats } from '../../types/medtrace';
import { Badge } from '../common/Badge';
import { AnalyticsCharts } from '../analytics/AnalyticsCharts';
import { GeographicChainMap } from '../analytics/GeographicChainMap';
import { Modal } from '../common/Modal';

interface ManufacturerDashboardProps {
  onOpenPassport: (batchNumber: string) => void;
  onOpenTrustGate: (batchNumber?: string) => void;
}

export const ManufacturerDashboard: React.FC<ManufacturerDashboardProps> = ({
  onOpenPassport,
  onOpenTrustGate
}) => {
  const [stats, setStats] = useState<ManufacturerStats | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<FraudAlert | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'intelligence' | 'analytics'>('pipeline');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const st = await medtraceService.getManufacturerStats();
      setStats(st);
      const bList = await medtraceService.fetchBatches();
      setBatches(bList);
      const aList = await medtraceService.fetchFraudAlerts();
      setAlerts(aList);
    } catch (e) {
      console.warn('Error loading manufacturer dashboard:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmManufacturerReceipt = async (batchNumber: string) => {
    try {
      await medtraceService.markManufacturerReceived(batchNumber);
      alert(`Manufacturer receipt confirmed for Batch ${batchNumber}`);
      loadData();
    } catch (err: any) {
      alert(err?.message || 'Receipt confirmation failed');
    }
  };

  const handleAlertAction = async (alertId: string, newStatus: 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED') => {
    try {
      await medtraceService.updateAlertStatus(alertId, newStatus);
      alert(`Alert status updated to ${newStatus}`);
      setSelectedAlert(null);
      loadData();
    } catch (err: any) {
      alert(err?.message || 'Alert status update failed');
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-indigo-400">MANUFACTURER COMMAND CENTER</span>
          <h2 className="text-2xl font-bold text-white mt-1">CarePlus Pharma Ltd (HQ)</h2>
          <p className="text-xs text-slate-400 mt-1">Reverse chain compliance engine, Batch Passport verification & Manufacturer Intelligence.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onOpenTrustGate('MED-2026-001')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center space-x-2 shadow-lg shadow-indigo-950/50 transition-all"
          >
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Trust Gate Inspector</span>
          </button>

          <button
            onClick={loadData}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold p-2.5 rounded-xl transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Batches</div>
          <div className="text-2xl font-black font-mono text-white mt-1">{stats?.total_batches || batches.length}</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">In Reverse Chain</div>
          <div className="text-2xl font-black font-mono text-sky-300 mt-1">{stats?.in_reverse_chain || 3}</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Verified Destroyed</div>
          <div className="text-2xl font-black font-mono text-purple-300 mt-1">{stats?.destroyed || 2}</div>
        </div>

        <div className="bg-slate-900/90 border border-rose-900/60 bg-rose-950/20 p-4 rounded-2xl">
          <div className="text-[10px] font-bold uppercase tracking-wider text-rose-300 flex items-center justify-between">
            <span>Open Fraud Incidents</span>
            <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
          </div>
          <div className="text-2xl font-black font-mono text-rose-400 mt-1">{alerts.filter((a) => a.status === 'OPEN').length}</div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'pipeline'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Reverse Logistics Pipeline
        </button>

        <button
          onClick={() => setActiveTab('intelligence')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'intelligence'
              ? 'bg-rose-950/80 text-rose-200 border border-rose-800'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span>Manufacturer Intelligence</span>
          {alerts.filter((a) => a.status === 'OPEN').length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px]">
              {alerts.filter((a) => a.status === 'OPEN').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
            activeTab === 'analytics'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Operational Analytics</span>
        </button>
      </div>

      {/* Tab 1: Pipeline View */}
      {activeTab === 'pipeline' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white mb-2">Reverse Chain Batches Pipeline</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-bold bg-slate-950/60">
                  <th className="p-3">Batch Number</th>
                  <th className="p-3">Medicine</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Expiry</th>
                  <th className="p-3">Lifecycle Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {batches.map((b) => (
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

                      {b.status === 'DISTRIBUTOR_RECEIVED' && (
                        <button
                          onClick={() => handleConfirmManufacturerReceipt(b.batch_number)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                        >
                          Confirm Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Manufacturer Intelligence Command Center */}
      {activeTab === 'intelligence' && (
        <div className="space-y-6">
          {/* Incident Queue */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
                <h3 className="text-base font-bold text-white">Open Incident Investigation Queue</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">Deterministic Fraud Verification</span>
            </div>

            <div className="space-y-3">
              {alerts.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-950/40 rounded-xl">
                  No active fraud alerts detected.
                </div>
              ) : (
                alerts.map((alt) => (
                  <div
                    key={alt.id}
                    className="p-4 rounded-xl bg-slate-950/60 border border-rose-900/40 hover:border-rose-600/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-lg bg-rose-950 border border-rose-800 text-rose-400 font-mono font-bold text-xs">
                        {alt.risk_score} SCORE
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white">{alt.alert_type}</span>
                          <span className="text-slate-400 font-mono">({alt.batch?.batch_number || 'MED-2026-001'})</span>
                        </div>
                        <p className="text-slate-300 mt-0.5">{alt.description}</p>
                        <div className="text-[10px] font-mono text-slate-400 mt-1 flex items-center space-x-2">
                          <span>Detected: {new Date(alt.detected_at).toLocaleString()}</span>
                          {alt.detected_location && <span>• Location: {alt.detected_location}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-end md:self-center">
                      <button
                        onClick={() => setSelectedAlert(alt)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Investigate Incident</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Spatial Supply Chain Map */}
          <GeographicChainMap highlightReentry={true} />
        </div>
      )}

      {/* Tab 3: Operational Analytics */}
      {activeTab === 'analytics' && (
        <AnalyticsCharts stats={stats} batches={batches} alerts={alerts} />
      )}

      {/* Fraud Alert Incident Investigation Drawer/Modal */}
      {selectedAlert && (
        <Modal
          isOpen={!!selectedAlert}
          onClose={() => setSelectedAlert(null)}
          title={`INCIDENT INVESTIGATION: ${selectedAlert.alert_type}`}
          subtitle={`Batch: ${selectedAlert.batch?.batch_number || 'MED-2026-001'}`}
        >
          <div className="space-y-4 text-xs font-sans text-slate-200">
            <div className="p-4 bg-rose-950/70 border border-rose-600 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-200 text-sm">RISK LEVEL: CRITICAL ({selectedAlert.risk_score}/100)</span>
                <span className="px-2 py-0.5 rounded bg-rose-900 text-white font-mono text-[10px]">
                  {selectedAlert.status}
                </span>
              </div>
              <p className="text-slate-300">{selectedAlert.description}</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
              <div><span className="text-slate-400">Target Medicine:</span> {selectedAlert.batch?.medicine_name || 'OncoSafe 500'}</div>
              <div><span className="text-slate-400">Detected Location:</span> {selectedAlert.detected_location || 'Pharmacy B, Chennai'}</div>
              <div><span className="text-slate-400">Timestamp:</span> {new Date(selectedAlert.detected_at).toLocaleString()}</div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => onOpenPassport(selectedAlert.batch?.batch_number || 'MED-2026-001')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold"
              >
                Inspect Batch Passport
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleAlertAction(selectedAlert.id, 'DISMISSED')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => handleAlertAction(selectedAlert.id, 'RESOLVED')}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 text-xs font-bold"
                >
                  Mark Resolved
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
