import React, { useState } from 'react';
import { Building2, Truck, Factory, Flame, Lock } from 'lucide-react';

export const InteractiveFlowchart: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const stages = [
    {
      id: 'pharmacy',
      title: 'PHARMACY',
      sub: 'Expired / Unused Batch',
      icon: Building2,
      details: 'Retailer scans batch GTIN & serial, logs expiry reason, and creates digital return request.',
      color: 'border-emerald-500 text-emerald-400 bg-emerald-950/40'
    },
    {
      id: 'distributor',
      title: 'DISTRIBUTOR',
      sub: 'Pickup & Quantity Check',
      icon: Truck,
      details: 'Logistics partner collects physical stock, verifies count against manifest, and flags any quantity discrepancy.',
      color: 'border-sky-500 text-sky-400 bg-sky-950/40'
    },
    {
      id: 'manufacturer',
      title: 'MANUFACTURER',
      sub: 'Batch & Identity Verify',
      icon: Factory,
      details: 'Pharma manufacturer confirms receipt, verifies serial numbers, and assigns batch for authorized waste disposal.',
      color: 'border-indigo-500 text-indigo-400 bg-indigo-950/40'
    },
    {
      id: 'waste',
      title: 'WASTE FACILITY',
      sub: 'Scan, Destroy & Certify',
      icon: Flame,
      details: 'Disposal facility incinerates batch, uploads signed destruction certificate, and updates database state to DESTROYED.',
      color: 'border-purple-500 text-purple-400 bg-purple-950/40'
    },
    {
      id: 'trustgate',
      title: 'TRUST GATE™',
      sub: '8-Point Security Layer',
      icon: Lock,
      details: 'Identity • Batch • Package • Quantity • Lifecycle • History • Location • Transaction verification engine.',
      color: 'border-rose-500 text-rose-400 bg-rose-950/40 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
    }
  ];

  return (
    <div className="my-16 bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl relative text-slate-100">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-2 mb-10">
        <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-widest">
          INTERACTIVE ARCHITECTURE
        </span>
        <h2 className="text-3xl font-black text-white">One Medicine. One Trace. Zero Blind Spots.</h2>
        <p className="text-sm text-slate-300 font-normal">
          MEDTRACE follows every returned medicine from the pharmacy shelf to verified destruction — recording every handoff, quantity, identity and decision along the way.
        </p>
      </div>

      {/* Interactive Horizontal Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-8">
        {stages.map((stg, idx) => {
          const Icon = stg.icon;
          const isSelected = activeStep === idx;

          return (
            <div
              key={stg.id}
              onClick={() => setActiveStep(idx)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${stg.color} ${
                isSelected ? 'scale-105 shadow-2xl ring-2 ring-white/20' : 'opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold font-mono text-slate-400">0{idx + 1}</span>
                <Icon className="w-5 h-5" />
              </div>

              <div className="text-sm font-bold text-white">{stg.title}</div>
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">{stg.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Detail Explanatory Box for Active Stage */}
      <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
        <div>
          <span className="text-slate-400 font-bold uppercase">ACTIVE STAGE INSPECTION:</span>
          <p className="text-sm font-sans text-slate-200 mt-1">{stages[activeStep].details}</p>
        </div>

        <div className="flex items-center space-x-2 text-emerald-400 font-bold">
          <span>VERIFIED OUTCOMES:</span>
          <span className="px-2 py-1 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded text-[10px]">ALLOW</span>
          <span className="px-2 py-1 bg-amber-950 border border-amber-800 text-amber-300 rounded text-[10px]">WARNING</span>
          <span className="px-2 py-1 bg-rose-950 border border-rose-800 text-rose-300 rounded text-[10px]">BLOCK</span>
        </div>
      </div>
    </div>
  );
};
