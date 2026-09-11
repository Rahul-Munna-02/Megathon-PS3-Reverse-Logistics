import React, { useState } from 'react';
import { Play, RotateCcw, AlertTriangle, ShieldAlert, CheckCircle2, ArrowRight, Activity, Zap } from 'lucide-react';
import { medtraceService } from '../../services/medtraceService';
import type { TrustGateScanResult } from '../../types/medtrace';

interface ReentrySimulatorProps {
  onOpenPassport?: (batchNumber: string) => void;
}

export const ReentrySimulator: React.FC<ReentrySimulatorProps> = ({ onOpenPassport }) => {
  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [simResult, setSimResult] = useState<TrustGateScanResult | null>(null);

  const runSimulation = async () => {
    setLoading(true);
    setStep(1); // Return requested

    setTimeout(async () => {
      setStep(2); // Distributor received

      setTimeout(async () => {
        setStep(3); // Manufacturer received

        setTimeout(async () => {
          setStep(4); // Destroyed at Waste Facility

          setTimeout(async () => {
            // Force status to DESTROYED for demo simulation
            try {
              const res = await medtraceService.runTrustGateInspection(
                'MED-2026-001',
                'PKG-847291',
                'Apollo Pharmacy, Store #42, Chennai'
              );
              setSimResult(res);
              setStep(5); // RE-ENTRY FRAUD DETECTED!
            } catch {
              setStep(0);
            } finally {
              setLoading(false);
            }
          }, 800);
        }, 800);
      }, 800);
    }, 800);
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      await medtraceService.resetDemo();
      setStep(0);
      setSimResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden text-slate-100">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
            <h3 className="text-lg font-bold text-white tracking-wide">RE-ENTRY FRAUD SIMULATOR</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate a destroyed medicine batch (<span className="font-mono text-emerald-400 font-bold">MED-2026-001</span>) re-entering retail supply chain.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {step === 0 ? (
            <button
              onClick={runSimulation}
              disabled={loading}
              className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl flex items-center space-x-2 shadow-lg shadow-rose-950/50 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>SIMULATE RE-ENTRY ATTACK</span>
            </button>
          ) : (
            <button
              onClick={handleReset}
              disabled={loading}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold py-2 px-4 rounded-xl flex items-center space-x-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Demo State</span>
            </button>
          )}
        </div>
      </div>

      {/* Pipeline Stage Tracker */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
        {[
          { num: 1, label: 'Pharmacy Return', sub: 'Expired Stock' },
          { num: 2, label: 'Distributor Pickup', sub: 'Receipt Verified' },
          { num: 3, label: 'Manufacturer Recv', sub: 'Queued Disposal' },
          { num: 4, label: 'Waste Facility', sub: 'Cert Uploaded' },
          { num: 5, label: 'Illicit Rescan', sub: 'Pharmacy B' }
        ].map((stg) => {
          const isActive = step >= stg.num;
          const isFraud = stg.num === 5 && step === 5;

          return (
            <div
              key={stg.num}
              className={`p-3 rounded-xl border text-center transition-all ${
                isFraud
                  ? 'bg-rose-950 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)] animate-pulse'
                  : isActive
                  ? 'bg-slate-800/80 border-emerald-500/60 text-white'
                  : 'bg-slate-950/40 border-slate-800 text-slate-500'
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center justify-center space-x-1">
                {isActive ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : (
                  <span className="w-3 h-3 rounded-full border border-slate-700 text-[9px] flex items-center justify-center">
                    {stg.num}
                  </span>
                )}
                <span>{stg.label}</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 truncate">{stg.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Live Simulation Triggered Screen */}
      {loading && step < 5 && (
        <div className="py-8 flex flex-col items-center justify-center space-y-3 bg-slate-950/50 rounded-xl border border-slate-800">
          <Activity className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-xs font-mono text-slate-300">Processing reverse chain transition step {step} of 5...</p>
        </div>
      )}

      {step === 5 && simResult && (
        <div className="bg-rose-950/80 border-2 border-rose-600 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-rose-600 text-white rounded-xl shadow-lg animate-bounce">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-black text-rose-200 tracking-wider">
                  🚨 DESTROYED BATCH RE-ENTRY DETECTED
                </h4>
                <p className="text-xs text-rose-300/80">
                  Batch <span className="font-mono font-bold text-white">MED-2026-001</span> scanned at illegal entry point after verified destruction.
                </p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-rose-700/60 rounded-xl px-4 py-2 text-right">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Risk Level</div>
              <div className="text-2xl font-black font-mono text-rose-400">CRITICAL 92/100</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/80 p-3 rounded-xl border border-rose-900/60 text-xs mb-4 font-mono">
            <div><span className="text-slate-400">Target Batch:</span> MED-2026-001</div>
            <div><span className="text-slate-400">Medicine:</span> OncoSafe 500</div>
            <div><span className="text-slate-400">Scan Location:</span> Pharmacy B, Chennai</div>
            <div><span className="text-slate-400">Original State:</span> DESTROYED</div>
            <div><span className="text-slate-400">Action Taken:</span> BLOCKED & REPORTED</div>
            <div><span className="text-slate-400">Alert Status:</span> OPEN INCIDENT</div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-rose-900/60">
            <span className="text-xs text-rose-300/90 flex items-center space-x-1">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Trust Gate automatically blocked transaction and notified Manufacturer Intelligence.</span>
            </span>

            {onOpenPassport && (
              <button
                onClick={() => onOpenPassport('MED-2026-001')}
                className="bg-white text-rose-950 font-bold text-xs py-2 px-4 rounded-xl hover:bg-slate-200 transition-colors flex items-center space-x-1 shadow-lg"
              >
                <span>View Full Batch Passport</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
