import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Search, Activity, Lock, ArrowRight } from 'lucide-react';
import { medtraceService } from '../../services/medtraceService';
import type { TrustGateScanResult } from '../../types/medtrace';
import { Badge } from '../common/Badge';

interface TrustGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBatchNumber?: string;
  onSelectBatchForPassport?: (batchNumber: string) => void;
}

export const TrustGateModal: React.FC<TrustGateModalProps> = ({
  isOpen,
  onClose,
  initialBatchNumber = 'MED-2026-001',
  onSelectBatchForPassport
}) => {
  const [batchInput, setBatchInput] = useState(initialBatchNumber);
  const [serialInput, setSerialInput] = useState('PKG-847291');
  const [locationInput, setLocationInput] = useState('Pharmacy B (Apollo), Chennai');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrustGateScanResult | null>(null);

  if (!isOpen) return null;

  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!batchInput.trim()) return;

    setLoading(true);
    try {
      const res = await medtraceService.runTrustGateInspection(
        batchInput.trim(),
        serialInput.trim() || undefined,
        locationInput.trim()
      );
      setResult(res);
    } catch (err: any) {
      alert(err?.message || 'Inspection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 my-8 text-slate-100 ring-1 ring-emerald-500/20">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">MEDTRACE TRUST GATE™ SECURITY LAYER</h2>
              <p className="text-xs text-slate-400">8-Point Real-Time Chain of Custody & Re-Entry Verification Engine</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs font-semibold">
            Close Esc
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Scanner Input Controls */}
          <form onSubmit={handleScan} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Batch Number</label>
              <input
                type="text"
                value={batchInput}
                onChange={(e) => setBatchInput(e.target.value)}
                placeholder="e.g. MED-2026-001"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Package Serial (Optional)</label>
              <input
                type="text"
                value={serialInput}
                onChange={(e) => setSerialInput(e.target.value)}
                placeholder="e.g. PKG-847291"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Scan Location</label>
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Scan location"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-950/50 disabled:opacity-50"
              >
                {loading ? (
                  <Activity className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Run Verification</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Pre-fill presets */}
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Quick Test Scans:</span>
            <button
              onClick={() => { setBatchInput('MED-2026-001'); setSerialInput('PKG-847291'); }}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono"
            >
              MED-2026-001 (Hero)
            </button>
            <button
              onClick={() => { setBatchInput('MED-2026-014'); setSerialInput('PKG-994100'); }}
              className="px-2 py-1 bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 rounded font-mono"
            >
              MED-2026-014 (Destroyed)
            </button>
            <button
              onClick={() => { setBatchInput('MED-2026-004'); setSerialInput(''); }}
              className="px-2 py-1 bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-800/40 rounded font-mono"
            >
              MED-2026-004 (Expiring)
            </button>
          </div>

          {/* Verification Results Display */}
          {result && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Main Decision Banner */}
              <div
                className={`p-6 rounded-2xl border ${
                  result.decision === 'BLOCK'
                    ? 'bg-rose-950/70 border-rose-600/80 shadow-[0_0_30px_rgba(225,29,72,0.25)]'
                    : result.decision === 'WARNING'
                    ? 'bg-amber-950/70 border-amber-600/80'
                    : 'bg-emerald-950/70 border-emerald-600/80 shadow-[0_0_30px_rgba(16,185,129,0.15)]'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    {result.decision === 'BLOCK' ? (
                      <div className="p-3 bg-rose-600 rounded-xl text-white shadow-lg animate-pulse">
                        <ShieldAlert className="w-8 h-8" />
                      </div>
                    ) : result.decision === 'WARNING' ? (
                      <div className="p-3 bg-amber-600 rounded-xl text-white">
                        <AlertTriangle className="w-8 h-8" />
                      </div>
                    ) : (
                      <div className="p-3 bg-emerald-600 rounded-xl text-white">
                        <ShieldCheck className="w-8 h-8" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl font-black tracking-wide text-white uppercase">
                          DECISION: {result.decision}
                        </span>
                        <Badge status={result.decision} />
                      </div>
                      <p className="text-sm font-medium mt-1 text-slate-200">{result.reason}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 border-t md:border-t-0 md:border-l border-slate-700/60 pt-3 md:pt-0 md:pl-6">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Risk Score</div>
                      <div className={`text-3xl font-black font-mono ${result.risk_score > 70 ? 'text-rose-400' : result.risk_score > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {result.risk_score} <span className="text-xs text-slate-500 font-normal">/ 100</span>
                      </div>
                    </div>
                    {onSelectBatchForPassport && result.batch_number && (
                      <button
                        onClick={() => onSelectBatchForPassport(result.batch_number)}
                        className="bg-slate-800 hover:bg-slate-700 text-xs font-semibold py-2 px-3 rounded-lg text-white border border-slate-700 flex items-center space-x-1"
                      >
                        <span>Passport</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 8 Check Items Grid */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-2">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>8-Point Security Verification Protocol</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {result.checks.map((c) => (
                    <div
                      key={c.key}
                      className={`p-3 rounded-xl border ${
                        c.passed
                          ? 'bg-slate-950/40 border-slate-800/80 text-slate-200'
                          : 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold">{c.label}</span>
                        {c.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-500 animate-pulse" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{c.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
