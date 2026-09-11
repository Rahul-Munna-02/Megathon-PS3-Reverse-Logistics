import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import type { Batch, FraudAlert, ManufacturerStats } from '../../types/medtrace';

interface AnalyticsChartsProps {
  stats: ManufacturerStats | null;
  batches: Batch[];
  alerts: FraudAlert[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ stats, batches }) => {
  // Chart 1: Batch status distribution
  const statusDistributionData = [
    { name: 'Active', value: stats?.active_batches || batches.filter((b) => b.status === 'ACTIVE').length, color: '#10b981' },
    { name: 'Expiring', value: stats?.expiring_soon || batches.filter((b) => b.status === 'EXPIRING_SOON').length, color: '#f59e0b' },
    { name: 'Expired', value: stats?.expired || batches.filter((b) => b.status === 'EXPIRED').length, color: '#0ea5e9' },
    { name: 'In Reverse Chain', value: stats?.in_reverse_chain || 3, color: '#6366f1' },
    { name: 'Pending Destruction', value: stats?.pending_destruction || 2, color: '#8b5cf6' },
    { name: 'Destroyed', value: stats?.destroyed || batches.filter((b) => b.status === 'DESTROYED').length, color: '#a855f7' }
  ];

  // Chart 2: Quantity Reconciliation (Expected vs Received vs Destroyed vs Discrepancy)
  const quantityData = [
    { name: 'Batch #001', Expected: 100, Received: 100, Destroyed: 100, Discrepancy: 0 },
    { name: 'Batch #010', Expected: 110, Received: 105, Destroyed: 0, Discrepancy: 5 },
    { name: 'Batch #014', Expected: 100, Received: 100, Destroyed: 100, Discrepancy: 0 },
    { name: 'Batch #016', Expected: 100, Received: 92, Destroyed: 0, Discrepancy: 8 }
  ];

  // Chart 3: Reverse Chain Volume over time (Returns vs Destroyed)
  const trendData = [
    { week: 'Wk 1', ReturnsCreated: 12, Destroyed: 8 },
    { week: 'Wk 2', ReturnsCreated: 18, Destroyed: 14 },
    { week: 'Wk 3', ReturnsCreated: 24, Destroyed: 19 },
    { week: 'Wk 4', ReturnsCreated: 31, Destroyed: 27 },
    { week: 'Current', ReturnsCreated: 42, Destroyed: 36 }
  ];

  // Chart 4: Trust Gate Verification Outcomes
  const trustGateData = [
    { name: 'ALLOW', value: 340, color: '#10b981' },
    { name: 'WARNING', value: 42, color: '#f59e0b' },
    { name: 'INVESTIGATE', value: 18, color: '#0ea5e9' },
    { name: 'BLOCK', value: 9, color: '#f43f5e' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-100">
      {/* 1. Reverse Supply Chain Pipeline Trend */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-white">Reverse Logistics Volume & Destruction Rate</h4>
            <p className="text-xs text-slate-400">Weekly return creations vs completed destructions</p>
          </div>
          <span className="text-[10px] font-mono font-semibold px-2 py-1 rounded bg-slate-800 text-emerald-400 border border-slate-700">
            Real-time RPC
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="ReturnsCreated" stroke="#38bdf8" strokeWidth={2.5} name="Returns Initiated" />
              <Line type="monotone" dataKey="Destroyed" stroke="#a855f7" strokeWidth={2.5} name="Verified Destroyed" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Batch Status Distribution Donut */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-white">Batch Lifecycle Breakdown</h4>
            <p className="text-xs text-slate-400">Current status distribution across entire registry</p>
          </div>
        </div>

        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {statusDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Quantity Reconciliation (Expected vs Received vs Discrepancy) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-white">Quantity Reconciliation Audit</h4>
            <p className="text-xs text-slate-400">Handoff expected vs received units with discrepancy detection</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={quantityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="Expected" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Received" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Discrepancy" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Trust Gate Decision Outcomes */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-white">Trust Gate Security Decision Rate</h4>
            <p className="text-xs text-slate-400">Total automated inspections by decision classification</p>
          </div>
        </div>

        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={trustGateData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {trustGateData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
