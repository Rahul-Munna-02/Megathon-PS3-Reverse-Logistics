import React, { useState } from 'react';
import { ShieldCheck, RotateCcw, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { medtraceService } from '../../services/medtraceService';
import type { UserRole } from '../../types/medtrace';

interface AppShellProps {
  currentView: 'landing' | 'app';
  onNavigate: (view: 'landing' | 'app') => void;
  onOpenTrustGate: (batchNumber?: string) => void;
  onOpenPassport: (batchNumber: string) => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentView,
  onNavigate,
  onOpenTrustGate,
  children
}) => {
  const { role, setDemoRole } = useAuth();
  const [resetting, setResetting] = useState(false);

  const handleResetDemo = async () => {
    setResetting(true);
    try {
      await medtraceService.resetDemo();
      alert('MED-2026-001 demo state has been reset to ACTIVE (100 units).');
      window.location.reload();
    } catch (err: any) {
      alert(err?.message || 'Demo reset failed');
    } finally {
      setResetting(false);
    }
  };

  const demoRoles: { key: UserRole; label: string }[] = [
    { key: 'RETAILER', label: 'Retailer (MedPlus)' },
    { key: 'DISTRIBUTOR', label: 'Distributor (SunRise)' },
    { key: 'MANUFACTURER', label: 'Manufacturer (CarePlus)' },
    { key: 'WASTE_FACILITY', label: 'Waste Facility (GreenCycle)' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 flex flex-col">
      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Product Identity */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-sky-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white">MEDTRACE</span>
              <span className="hidden sm:inline-block text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60 ml-2">
                REVERSE CHAIN Compliance
              </span>
            </div>
          </div>

          {/* Navigation Links & Quick Role Selector */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('landing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                currentView === 'landing' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => onNavigate('app')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                currentView === 'app' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              App Workspace
            </button>

            {/* Quick Demo Role Switcher Dropdown */}
            <div className="relative inline-block">
              <select
                value={role}
                onChange={(e) => setDemoRole(e.target.value as UserRole)}
                className="bg-slate-900 border border-slate-700 hover:border-emerald-500 text-xs font-bold text-emerald-400 rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
              >
                {demoRoles.map((r) => (
                  <option key={r.key} value={r.key} className="bg-slate-900 text-white font-sans">
                    Role: {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Trust Gate Inspector Trigger */}
            <button
              onClick={() => onOpenTrustGate('MED-2026-001')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md transition-all flex items-center space-x-1"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Trust Gate</span>
            </button>

            {/* Reset Demo Button */}
            <button
              onClick={handleResetDemo}
              disabled={resetting}
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1"
              title="Reset hero batch MED-2026-001 state"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Reset Demo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Page Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>

      {/* Persistent Footer */}
      <footer className="border-t border-slate-800/80 py-6 bg-slate-950 text-slate-500 text-xs text-center font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>MEDTRACE Compliance Engine • Track. Verify. Prevent Re-entry.</div>
          <div>Built on Supabase PostgreSQL Architecture</div>
        </div>
      </footer>
    </div>
  );
};
