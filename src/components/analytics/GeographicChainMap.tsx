import React, { useState } from 'react';
import { ShieldAlert, Building2, Truck, Factory, Flame, Radio } from 'lucide-react';

interface GeographicChainMapProps {
  highlightReentry?: boolean;
}

export const GeographicChainMap: React.FC<GeographicChainMapProps> = ({ highlightReentry = true }) => {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);

  const nodes = [
    { id: 'mfg', name: 'CarePlus Pharma Plant', type: 'Manufacturer', city: 'Hyderabad', coords: { x: '68%', y: '35%' }, color: '#6366f1', icon: Factory },
    { id: 'wf', name: 'GreenCycle Waste Facility', type: 'Waste Facility', city: 'Hyderabad', coords: { x: '75%', y: '42%' }, color: '#a855f7', icon: Flame },
    { id: 'dist', name: 'SunRise Logistics Hub', type: 'Distributor', city: 'Chennai', coords: { x: '45%', y: '68%' }, color: '#38bdf8', icon: Truck },
    { id: 'retA', name: 'MedPlus Pharmacy #104', type: 'Retailer A', city: 'Salem', coords: { x: '25%', y: '78%' }, color: '#10b981', icon: Building2 },
    { id: 'retB', name: 'Apollo Pharmacy #42', type: 'Retailer B (Fraud Target)', city: 'Chennai', coords: { x: '52%', y: '75%' }, color: '#f43f5e', icon: ShieldAlert, alert: true }
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl relative text-slate-100 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            <h3 className="text-base font-bold text-white tracking-wide">REVERSE SUPPLY CHAIN GEOGRAPHIC MAP</h3>
          </div>
          <p className="text-xs text-slate-400">Live spatial traceability between Salem, Chennai and Hyderabad hubs</p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-slate-300">Legitimate Route</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <span className="text-rose-400 font-bold">Re-Entry Incident</span>
          </div>
        </div>
      </div>

      {/* SVG Interactive Map Container */}
      <div className="relative w-full h-[380px] bg-slate-950/80 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center p-4">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-25"></div>

        {/* SVG Route Connection Vectors */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="normalFlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="fraudFlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Reverse Chain Path: Retailer A (Salem) -> Distributor (Chennai) */}
          <path d="M 25% 78% Q 35% 70% 45% 68%" fill="none" stroke="url(#normalFlow)" strokeWidth="2.5" strokeDasharray="6,6" className="animate-[dash_12s_linear_infinite]" />

          {/* Path: Distributor (Chennai) -> Manufacturer (Hyderabad) */}
          <path d="M 45% 68% Q 55% 50% 68% 35%" fill="none" stroke="url(#normalFlow)" strokeWidth="2.5" strokeDasharray="6,6" />

          {/* Path: Manufacturer -> Waste Facility (Hyderabad) */}
          <path d="M 68% 35% L 75% 42%" fill="none" stroke="#a855f7" strokeWidth="3" />

          {/* ILLICIT RE-ENTRY ATTACK VECTOR: Waste Facility (Hyderabad) -> Retailer B (Chennai) */}
          {highlightReentry && (
            <g>
              <path d="M 75% 42% Q 65% 60% 52% 75%" fill="none" stroke="url(#fraudFlow)" strokeWidth="3" strokeDasharray="4,4" className="animate-pulse" />
            </g>
          )}
        </svg>

        {/* Map Nodes */}
        {nodes.map((n) => {
          const Icon = n.icon;
          const isSelected = selectedEntity === n.id;

          return (
            <div
              key={n.id}
              onClick={() => setSelectedEntity(n.id)}
              style={{ left: n.coords.x, top: n.coords.y }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
            >
              {/* Radar pulse for fraud node */}
              {n.alert && highlightReentry && (
                <div className="absolute inset-0 -m-3 rounded-full bg-rose-500/30 animate-ping"></div>
              )}

              <div
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border backdrop-blur-md transition-all shadow-lg ${
                  n.alert
                    ? 'bg-rose-950/90 border-rose-500 text-rose-200 shadow-rose-950/50'
                    : isSelected
                    ? 'bg-slate-800 border-white text-white scale-110'
                    : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <Icon className={`w-4 h-4 ${n.alert ? 'text-rose-400 animate-bounce' : 'text-emerald-400'}`} />
                <div>
                  <div className="text-xs font-bold leading-tight truncate">{n.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{n.city}</div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Highlight Callout Box */}
        {highlightReentry && (
          <div className="absolute bottom-3 left-3 bg-rose-950/90 border border-rose-600/80 rounded-xl p-3 max-w-xs text-xs shadow-2xl z-20">
            <div className="flex items-center space-x-2 text-rose-300 font-bold mb-1">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>RE-ENTRY FRAUD ANOMALY</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Batch <span className="font-mono font-bold text-white">MED-2026-001</span> destroyed at GreenCycle (Hyderabad) was scanned at Apollo Pharmacy (Chennai).
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
