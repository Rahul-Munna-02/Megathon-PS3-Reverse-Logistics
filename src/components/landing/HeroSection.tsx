import React from 'react';
import { ShieldCheck, ArrowRight, Play } from 'lucide-react';

interface HeroSectionProps {
  onExploreClick: () => void;
  onSeeHowItWorksClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onSeeHowItWorksClick
}) => {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-950 text-slate-100">
      {/* Background Spatial Lighting & Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[300px] bg-sky-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center space-y-8 z-10">
        {/* Top Tagline Pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xl text-xs font-semibold text-emerald-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>India's Pharma Reverse Logistics Digital Chain of Custody</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span className="text-slate-300 font-mono">v1.0 Ready</span>
        </div>

        {/* Main Hero Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-none">
          Track. Verify.{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-400">
            Prevent Re-entry.
          </span>
        </h1>

        {/* Supporting Paragraph */}
        <p className="max-w-3xl mx-auto text-base sm:text-xl text-slate-300 font-normal leading-relaxed">
          MEDTRACE gives pharmaceutical reverse logistics a complete digital chain of custody — from expired medicine on the retail shelf through reverse supply chain to verified destruction.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
          >
            <span>Explore MEDTRACE Platform</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onSeeHowItWorksClick}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-base transition-all hover:border-slate-500 flex items-center justify-center space-x-2"
          >
            <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            <span>See How It Works</span>
          </button>
        </div>

        {/* Interactive Hero Visual - Spatial 3D Card Simulation */}
        <div className="pt-10 max-w-4xl mx-auto">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden group hover:border-emerald-500/50 transition-all duration-500">
            {/* Animated Data Stream Bar */}
            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden mb-6">
              <div className="h-full bg-gradient-to-r from-emerald-500 via-sky-500 to-purple-500 w-1/3 animate-[stream_3s_ease-in-out_infinite]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-left font-mono text-xs">
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">1. RETAILER</span>
                <span className="text-white font-bold block mt-1">Pharmacy Shelf</span>
                <span className="text-amber-400 text-[10px]">Expired Flagged</span>
              </div>

              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">2. DISTRIBUTOR</span>
                <span className="text-white font-bold block mt-1">Logistics Hub</span>
                <span className="text-sky-400 text-[10px]">Qty Verified</span>
              </div>

              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">3. MANUFACTURER</span>
                <span className="text-white font-bold block mt-1">Pharma Plant</span>
                <span className="text-indigo-400 text-[10px]">Identity Verified</span>
              </div>

              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">4. WASTE FACILITY</span>
                <span className="text-white font-bold block mt-1">Disposal Facility</span>
                <span className="text-purple-400 text-[10px]">Destroyed + Cert</span>
              </div>

              <div className="bg-rose-950/80 p-3.5 rounded-xl border border-rose-700 shadow-lg animate-pulse">
                <span className="text-[10px] text-rose-300 uppercase font-bold block">5. TRUST GATE</span>
                <span className="text-white font-bold block mt-1">Pharmacy B Scan</span>
                <span className="text-rose-400 text-[10px] font-bold">🚨 BLOCKED!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
