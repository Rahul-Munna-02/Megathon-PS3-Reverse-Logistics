import React, { useState } from 'react';
import { HeroSection } from './HeroSection';
import { CinematicIntro } from './CinematicIntro';
import { InteractiveFlowchart } from './InteractiveFlowchart';
import { ReentrySimulator } from '../trustgate/ReentrySimulator';
import { ArrowRight, BarChart2 } from 'lucide-react';

interface LandingPageProps {
  onExplore: () => void;
  onOpenTrustGate: (batchNumber?: string) => void;
  onOpenPassport: (batchNumber: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onExplore,
  onOpenPassport
}) => {
  const [showCinematic, setShowCinematic] = useState(false);

  return (
    <div className="space-y-16 text-slate-100 pb-20">
      {/* Section 1: Hero */}
      <HeroSection
        onExploreClick={onExplore}
        onSeeHowItWorksClick={() => setShowCinematic(true)}
      />

      {/* Cinematic Intro Modal/Container */}
      {showCinematic && (
        <div className="max-w-6xl mx-auto px-4">
          <CinematicIntro onComplete={() => setShowCinematic(false)} />
        </div>
      )}

      {/* Section 2: The Problem */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold font-mono text-rose-400 uppercase tracking-widest">
              SECTION 2 • THE INDUSTRY CHALLENGE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
              When a medicine leaves the shelf, the chain shouldn't disappear.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2">
              Every year, millions of expired or unused drug units enter an unmonitored reverse supply chain in India. Without batch-level digital custody, repackaging fraud and illicit market re-entry flourish.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="text-rose-400 font-bold mb-1">01. Fragmented Handoffs</div>
              <p className="text-slate-400">Paper manifests & unverified manual receipts allow physical leakage between retail shelf and disposal.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="text-rose-400 font-bold mb-1">02. Quantity Discrepancies</div>
              <p className="text-slate-400">Unnoticed volume drops during distributor pickup remain unflagged without automated reconciliation.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="text-rose-400 font-bold mb-1">03. Missing Destruction Proof</div>
              <p className="text-slate-400">Destruction certificates are unverified PDFs easily forged without serial-level cryptographic hashing.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="text-rose-400 font-bold mb-1">04. Re-Entry Risk</div>
              <p className="text-slate-400">Supposedly incinerated medicine batches appear back in retail pharmacies, threatening public safety.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 & 4: Interactive Flowchart & How MEDTRACE Works */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <InteractiveFlowchart />
      </section>

      {/* Section 5 & 6: Trust Gate & Re-entry Fraud Scenario Simulator */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <ReentrySimulator onOpenPassport={onOpenPassport} />
      </section>

      {/* Section 7: Analytics & Operational Intelligence Preview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <span className="text-xs font-bold font-mono text-indigo-400 uppercase tracking-widest">
            SECTION 7 • OPERATIONAL INTELLIGENCE
          </span>
          <h2 className="text-3xl font-black text-white">Informative Compliance Analytics</h2>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto">
            Real-time PostgreSQL telemetry measuring reverse logistics volume, batch lifecycle distribution, handoff quantity reconciliation, and automated Trust Gate decision outcomes.
          </p>

          <div className="pt-4 flex justify-center">
            <button
              onClick={onExplore}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3 px-6 rounded-xl flex items-center space-x-2 shadow-lg"
            >
              <BarChart2 className="w-4 h-4" />
              <span>Launch Intelligence Command Center</span>
            </button>
          </div>
        </div>
      </section>

      {/* Section 8: Role-Based Stakeholder Workflows Preview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          {[
            { role: 'RETAILER', desc: 'Active/expiring inventory management, GTIN scanning, and digital return creation.', color: 'border-emerald-500/50' },
            { role: 'DISTRIBUTOR', desc: 'Pickup verification, expected vs received quantity audit, and discrepancy alerts.', color: 'border-sky-500/50' },
            { role: 'MANUFACTURER', desc: 'Full reverse chain oversight, Batch Passport timeline, and Fraud Command Center.', color: 'border-indigo-500/50' },
            { role: 'WASTE FACILITY', desc: 'Incineration processing, destruction certificate upload, and digital sealing.', color: 'border-purple-500/50' }
          ].map((r) => (
            <div key={r.role} className={`p-5 rounded-2xl bg-slate-900/80 border ${r.color} shadow-xl space-y-2`}>
              <div className="font-bold text-white uppercase tracking-wider">{r.role} WORKFLOW</div>
              <p className="text-slate-400 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 9: Final CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-500/30 rounded-3xl p-10 shadow-2xl space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white">Make Every Medicine Traceable.</h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Experience the competition-winning MEDTRACE prototype operating live on Supabase database architecture.
          </p>

          <button
            onClick={onExplore}
            className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 inline-flex items-center space-x-2"
          >
            <span>Launch Live App</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};
