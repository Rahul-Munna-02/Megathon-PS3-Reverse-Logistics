"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowUpRight,
  Package,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

const stats = [
  {
    label: "Tracked batches",
    value: "1,284",
    change: "+12.4%",
    icon: Package,
  },
  {
    label: "Reverse chain",
    value: "186",
    change: "+8.2%",
    icon: RotateCcw,
  },
  {
    label: "Destroyed",
    value: "842",
    change: "+16.8%",
    icon: ShieldCheck,
  },
  {
    label: "Fraud alerts",
    value: "07",
    change: "3 critical",
    icon: AlertTriangle,
    danger: true,
  },
];

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-[1500px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 flex items-end justify-between"
      >
        <div>
          <div className="mb-3 text-[10px] uppercase tracking-[0.25em] text-black/35">
            Authority / Overview
          </div>

          <h1 className="text-5xl font-medium tracking-[-0.055em]">
            Compliance Command Center
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-black/45">
            Real-time visibility across the pharmaceutical reverse
            chain, from expired inventory to verified destruction.
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-full bg-black px-5 py-3 text-xs font-medium text-white transition hover:scale-[1.02]">
          View live trace
          <ArrowUpRight size={15} />
        </button>
      </motion.div>

      {/* KPI */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
              }}
              className={`rounded-2xl border p-6 ${
                stat.danger
                  ? "border-red-200 bg-red-50"
                  : "border-black/10 bg-white"
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                    stat.danger
                      ? "bg-red-100 text-red-600"
                      : "bg-black/5 text-black"
                  }`}
                >
                  <Icon size={17} strokeWidth={1.7} />
                </div>

                <span
                  className={`text-[10px] uppercase tracking-wider ${
                    stat.danger
                      ? "text-red-600"
                      : "text-black/35"
                  }`}
                >
                  {stat.change}
                </span>
              </div>

              <div className="mt-8">
                <div className="text-4xl font-medium tracking-[-0.05em]">
                  {stat.value}
                </div>

                <div className="mt-2 text-xs text-black/40">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main content */}
      <div className="mt-4 grid grid-cols-[1.5fr_1fr] gap-4">
        <div className="min-h-[420px] rounded-2xl border border-black/10 bg-white p-7">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-black/35">
                Network activity
              </div>

              <h2 className="mt-2 text-xl font-medium">
                Reverse chain movement
              </h2>
            </div>

            <span className="rounded-full border border-black/10 px-3 py-1.5 text-[10px] uppercase tracking-wider text-black/40">
              Live
            </span>
          </div>

          <div className="flex h-[300px] items-center justify-center text-sm text-black/30">
            Activity visualization will connect to Supabase
          </div>
        </div>

        <div className="min-h-[420px] rounded-2xl border border-black/10 bg-[#111111] p-7 text-white">
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/35">
            Threat feed
          </div>

          <h2 className="mt-2 text-xl font-medium">
            Live anomalies
          </h2>

          <div className="mt-8 space-y-3">
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
              <div className="text-xs font-medium text-red-300">
                DESTROYED BATCH RE-ENTRY
              </div>

              <div className="mt-2 text-sm text-white">
                MED-2026-001
              </div>

              <div className="mt-1 text-[11px] text-white/40">
                Pharmacy B · 14:32:08
              </div>
            </div>

            <div className="rounded-xl border border-white/10 p-4">
              <div className="text-xs font-medium">
                Quantity discrepancy
              </div>

              <div className="mt-2 text-sm">
                MED-2026-017
              </div>

              <div className="mt-1 text-[11px] text-white/40">
                Expected 100 · Received 96
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}