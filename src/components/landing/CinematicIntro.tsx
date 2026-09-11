import { useState } from 'react';
import { Building2, Truck, Factory, Flame, ShieldAlert, Sparkles, ChevronRight } from 'lucide-react';

interface CinematicIntroProps {
  onComplete: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);

  const stages = [
    {
      id: 'pharmacy',
      title: 'STAGE 1: RETAIL PHARMACY',
      subtitle: 'MedPlus Pharmacy, Salem',
      description: 'Medicine batch MED-2026-001 (OncoSafe 500) reaches expiry date on retail shelf. Retailer initiates digital return manifest.',
      icon: Building2,
      badge: 'EXPIRED STOCK FLAGGED',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      environmentColor: 'from-amber-950/40 to-slate-950'
    },
    {
      id: 'distributor',
      title: 'STAGE 2: DISTRIBUTOR LOGISTICS',
      subtitle: 'SunRise Distributors, Chennai',
      description: 'Physical pickup executed. Distributor scans batch GTIN & verifies physical quantity against expected manifest.',
      icon: Truck,
      badge: 'QUANTITY RECONCILED',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
      environmentColor: 'from-sky-950/40 to-slate-950'
    },
    {
      id: 'manufacturer',
      title: 'STAGE 3: PHARMA MANUFACTURER',
      subtitle: 'CarePlus Pharma Ltd, Hyderabad',
      description: 'Reverse batch received at manufacturer plant. Product identity & serial numbers verified before waste assignment.',
      icon: Factory,
      badge: 'MANUFACTURER VERIFIED',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      environmentColor: 'from-indigo-950/40 to-slate-950'
    },
    {
      id: 'waste',
      title: 'STAGE 4: WASTE DISPOSAL FACILITY',
      subtitle: 'GreenCycle Bio-Waste Facility',
      description: 'High-temperature destruction completed. Facility issues digitally signed destruction certificate CERT-2026-8831.',
      icon: Flame,
      badge: 'VERIFIED DESTRUCTION',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      environmentColor: 'from-purple-950/40 to-slate-950'
    },
    {
      id: 'reentry',
      title: 'STAGE 5: ILLICIT RE-ENTRY ATTACK SCAN',
      subtitle: 'Apollo Pharmacy B, Chennai',
      description: 'The same destroyed batch MED-2026-001 is illicitly scanned again at an unauthorized pharmacy store.',
      icon: ShieldAlert,
      badge: '🚨 DESTROYED BATCH RE-ENTRY DETECTED',
      badgeColor: 'bg-rose-600 text-white border-rose-400 animate-pulse',
      environmentColor: 'from-rose-950/70 to-slate-950'
    }
  ];

  const current = stages[activeStageIndex];
  const Icon = current.icon;

  const handleNext = () => {
    if (activeStageIndex < stages.length - 1) {
      setActiveStageIndex(activeStageIndex + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="relative my-12 bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden text-slate-100">
      {/* Dynamic Background Environment Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${current.environmentColor} transition-all duration-700 pointer-events-none`} />

      <div className="relative z-10 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="text-xl font-black tracking-wide text-white">CINEMATIC REVERSE SUPPLY CHAIN JOURNEY</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Physical room-by-room handoff simulation across India's reverse supply chain</p>
          </div>

          <button
            onClick={onComplete}
            className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80"
          >
            Skip Intro →
          </button>
        </div>

        {/* Stage Progress Bar */}
        <div className="grid grid-cols-5 gap-2">
          {stages.map((stg, idx) => (
            <button
              key={stg.id}
              onClick={() => setActiveStageIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === activeStageIndex
                  ? idx === 4
                    ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)]'
                    : 'bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)]'
                  : idx < activeStageIndex
                  ? 'bg-slate-700'
                  : 'bg-slate-800/50'
              }`}
            />
          ))}
        </div>

        {/* Center Stage Presentation Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl transition-all duration-500">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start space-x-5">
              <div
                className={`p-4 rounded-2xl border shadow-xl ${
                  activeStageIndex === 4
                    ? 'bg-rose-600 border-rose-400 text-white animate-bounce'
                    : 'bg-slate-950 border-slate-700 text-emerald-400'
                }`}
              >
                <Icon className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${current.badgeColor}`}>
                  {current.badge}
                </span>

                <h4 className="text-2xl font-black text-white">{current.title}</h4>
                <p className="text-xs font-mono text-slate-400">{current.subtitle}</p>
                <p className="text-sm text-slate-300 max-w-xl font-normal leading-relaxed">{current.description}</p>
              </div>
            </div>

            <div className="w-full md:w-auto flex flex-col items-end space-y-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-800">
              <button
                onClick={handleNext}
                className={`w-full md:w-auto px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-xl ${
                  activeStageIndex === 4
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/50'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
                }`}
              >
                <span>{activeStageIndex === 4 ? 'Enter Intelligence Command Center' : 'Advance Next Stage'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
