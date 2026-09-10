"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  CircleAlert,
  MapPin,
  Package,
  ScanLine,
  ShieldCheck,
  Truck,
} from "lucide-react";

const traceStages = [
  {
    number: "01",
    label: "Retail Shelf",
    status: "EXPIRED",
    title: "Expiry detected",
    description:
      "The batch reaches its expiry date and is automatically flagged for reverse-chain processing.",
    location: "Pharmacy A · Chennai",
    icon: Package,
  },
  {
    number: "02",
    label: "Return Created",
    status: "RETURN REQUESTED",
    title: "Return initiated",
    description:
      "The expired batch is registered and a traceable return movement is created.",
    location: "Pharmacy A → Distributor",
    icon: ArrowUpRight,
  },
  {
    number: "03",
    label: "Distributor",
    status: "RECEIVED",
    title: "Quantity verified",
    description:
      "The distributor scans the batch and verifies the physical quantity against the expected quantity.",
    location: "Distributor Hub · Chennai",
    icon: Truck,
  },
  {
    number: "04",
    label: "Manufacturer",
    status: "RECEIVED",
    title: "Batch authenticated",
    description:
      "The manufacturer confirms receipt and prepares the batch for verified destruction.",
    location: "Manufacturer Facility",
    icon: ShieldCheck,
  },
  {
    number: "05",
    label: "Destruction",
    status: "DESTROYED",
    title: "Destruction verified",
    description:
      "A destruction certificate is linked directly to the batch, permanently closing its lifecycle.",
    location: "Authorized Waste Facility",
    icon: Check,
  },
];

function TracePoint({
  stage,
  active,
  onClick,
}: {
  stage: (typeof traceStages)[0];
  active: boolean;
  onClick: () => void;
}) {
  const Icon = stage.icon;

  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-4 text-left"
    >
      <div
        className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
          active
            ? "border-[#111111] bg-[#111111] text-white"
            : "border-black/15 bg-white text-black/35 group-hover:border-black/40 group-hover:text-black"
        }`}
      >
        <Icon size={16} strokeWidth={1.7} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <span
            className={`text-xs font-medium ${
              active ? "text-black" : "text-black/50"
            }`}
          >
            {stage.label}
          </span>

          <span className="font-mono text-[9px] text-black/25">
            {stage.number}
          </span>
        </div>

        <div className="mt-1 h-px bg-black/10 transition-all group-hover:bg-black/20" />
      </div>
    </button>
  );
}

function StoryCard({
  number,
  eyebrow,
  title,
  description,
  children,
}: {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
      className="grid gap-10 border-t border-black/10 py-20 lg:grid-cols-[0.35fr_0.65fr]"
    >
      <div>
        <div className="font-mono text-xs text-black/25">{number}</div>

        <div className="mt-4 text-[10px] uppercase tracking-[0.25em] text-black/35">
          {eyebrow}
        </div>
      </div>

      <div>
        <h2 className="max-w-3xl text-4xl font-medium leading-[0.95] tracking-[-0.055em] md:text-6xl">
          {title}
        </h2>

        <p className="mt-6 max-w-xl text-sm leading-7 text-black/45">
          {description}
        </p>

        {children}
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [activeStage, setActiveStage] = useState(0);

  const active = traceStages[activeStage];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f5f4ef] text-[#111111]">
      {/* NAVIGATION */}
      <nav className="fixed left-1/2 top-5 z-50 flex w-[calc(100%-32px)] max-w-5xl -translate-x-1/2 items-center justify-between rounded-full border border-black/10 bg-[#f5f4ef]/85 px-5 py-3 backdrop-blur-xl">
        <a
          href="#top"
          className="text-sm font-semibold tracking-[-0.04em]"
        >
          MED<span className="text-black/35">TRACE</span>
        </a>

        <div className="hidden items-center gap-7 text-[10px] uppercase tracking-[0.15em] text-black/45 md:flex">
          <a
            href="#problem"
            className="transition hover:text-black"
          >
            Problem
          </a>

          <a
            href="#trace"
            className="transition hover:text-black"
          >
            Trace
          </a>

          <a
            href="#security"
            className="transition hover:text-black"
          >
            Security
          </a>
        </div>

        <a
          href="/login"
          className="flex items-center gap-2 rounded-full bg-[#111111] px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-white transition hover:scale-[1.03]"
        >
          Enter platform
          <ArrowUpRight size={13} />
        </a>
      </nav>

      {/* HERO */}
      <section
        id="top"
        className="relative flex min-h-screen items-center px-5 pb-16 pt-32 md:px-10 lg:px-16"
      >
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.07) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="relative mx-auto grid w-full max-w-[1500px] items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Hero typography */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mb-7 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-black/35"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Pharmaceutical reverse-chain intelligence
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="text-[clamp(4.5rem,12vw,11rem)] font-medium leading-[0.76] tracking-[-0.085em]"
            >
              MED
              <br />
              <span className="text-black/25">TRACE.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="mt-10 max-w-lg text-base leading-7 text-black/50 md:text-lg"
            >
              Track expired and unused medicines from retail shelf to
              verified destruction — with batch-level traceability and
              re-entry fraud detection at every handoff.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <a
                href="#trace"
                className="group flex items-center gap-3 rounded-full bg-[#111111] px-6 py-3.5 text-xs font-medium text-white"
              >
                Explore the trace
                <ArrowDown
                  size={15}
                  className="transition-transform group-hover:translate-y-1"
                />
              </a>

              <a
                href="/login"
                className="flex items-center gap-2 rounded-full border border-black/15 px-6 py-3.5 text-xs font-medium transition hover:bg-white"
              >
                Open platform
                <ArrowUpRight size={14} />
              </a>
            </motion.div>
          </div>

          {/* Hero live trace */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="relative"
          >
            <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_30px_100px_rgba(0,0,0,0.08)] md:p-8">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[9px] uppercase tracking-[0.25em] text-black/35">
                    Live batch trace
                  </div>

                  <div className="mt-3 font-mono text-lg">
                    MED-2026-001
                  </div>

                  <div className="mt-1 text-xs text-black/35">
                    OncoSafe 500 · 100 units
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-black/10 px-3 py-1.5 text-[9px] uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Tracked
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {traceStages.map((stage, index) => (
                  <TracePoint
                    key={stage.number}
                    stage={stage}
                    active={index === activeStage}
                    onClick={() => setActiveStage(index)}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={active.number}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="mt-7 rounded-2xl bg-[#f5f4ef] p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-black/35">
                      Current state
                    </span>

                    <span className="rounded-full bg-white px-3 py-1 text-[9px] font-medium">
                      {active.status}
                    </span>
                  </div>

                  <div className="mt-4 text-xl font-medium tracking-[-0.03em]">
                    {active.title}
                  </div>

                  <p className="mt-2 text-xs leading-5 text-black/45">
                    {active.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-[10px] text-black/35">
                    <MapPin size={12} />
                    {active.location}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-black/10 bg-[#111111] px-5 py-4 text-white shadow-xl sm:block"
            >
              <div className="flex items-center gap-3">
                <ScanLine size={17} />

                <div>
                  <div className="text-[9px] uppercase tracking-wider text-white/40">
                    Trace integrity
                  </div>

                  <div className="mt-1 text-xs">
                    Continuously verified
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* PROBLEM */}
      <section
        id="problem"
        className="mx-auto max-w-[1500px] px-5 md:px-10 lg:px-16"
      >
        <StoryCard
          number="01"
          eyebrow="The problem"
          title="A medicine can disappear long before its lifecycle ends."
          description="Expired and unused medicines pass through multiple organizations. Without a shared trace, quantities can be disputed, destruction can be difficult to verify, and previously destroyed batches can potentially re-enter circulation."
        >
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              ["01", "Fragmented records"],
              ["02", "Unverified handoffs"],
              ["03", "Re-entry risk"],
            ].map(([number, text]) => (
              <div
                key={number}
                className="rounded-2xl border border-black/10 bg-white p-5 transition hover:-translate-y-1"
              >
                <div className="font-mono text-[10px] text-black/25">
                  {number}
                </div>

                <div className="mt-10 text-sm font-medium">
                  {text}
                </div>
              </div>
            ))}
          </div>
        </StoryCard>
      </section>

      {/* TRACE */}
      <section
        id="trace"
        className="mx-auto max-w-[1500px] px-5 md:px-10 lg:px-16"
      >
        <StoryCard
          number="02"
          eyebrow="One batch · one history"
          title="Every handoff becomes part of the batch passport."
          description="MEDTRACE creates a continuous event history around the batch. Each movement, quantity verification, certificate and destruction event is tied to the same traceable identity."
        >
          <div className="mt-12 overflow-hidden rounded-[28px] border border-black/10 bg-[#111111] text-white">
            <div className="border-b border-white/10 px-6 py-5 md:px-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-[9px] uppercase tracking-[0.25em] text-white/30">
                    Batch passport
                  </div>

                  <div className="mt-2 font-mono text-sm">
                    MED-2026-001
                  </div>
                </div>

                <div className="rounded-full border border-white/10 px-3 py-1.5 text-[9px] uppercase tracking-wider text-white/45">
                  05 recorded stages
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-[0.8fr_1.2fr]">
              <div className="border-b border-white/10 p-6 md:border-b-0 md:border-r md:p-8">
                <div className="text-[9px] uppercase tracking-[0.2em] text-white/30">
                  Medicine
                </div>

                <div className="mt-3 text-2xl tracking-[-0.04em]">
                  OncoSafe 500
                </div>

                <div className="mt-8 space-y-5">
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-white/25">
                      Original quantity
                    </div>

                    <div className="mt-1 font-mono text-sm">
                      100 units
                    </div>
                  </div>

                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-white/25">
                      Expiry
                    </div>

                    <div className="mt-1 font-mono text-sm">
                      30 JUN 2026
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="mb-6 text-[9px] uppercase tracking-[0.2em] text-white/30">
                  Event history
                </div>

                <div className="space-y-0">
                  {traceStages.map((stage, index) => {
                    const Icon = stage.icon;

                    return (
                      <button
                        key={stage.number}
                        onClick={() => setActiveStage(index)}
                        className="group flex w-full items-start gap-4 text-left"
                      >
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
                              index === activeStage
                                ? "border-white bg-white text-black"
                                : "border-white/15 text-white/35 group-hover:border-white/35"
                            }`}
                          >
                            <Icon size={14} />
                          </div>

                          {index < traceStages.length - 1 && (
                            <div className="h-10 w-px bg-white/10" />
                          )}
                        </div>

                        <div className="flex-1 pb-7">
                          <div className="flex items-center justify-between">
                            <div className="text-xs">
                              {stage.title}
                            </div>

                            <div className="text-[9px] text-white/25">
                              {stage.number}
                            </div>
                          </div>

                          <div className="mt-1 text-[10px] text-white/30">
                            {stage.location}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </StoryCard>
      </section>

      {/* SECURITY */}
      <section
        id="security"
        className="mx-auto max-w-[1500px] px-5 md:px-10 lg:px-16"
      >
        <StoryCard
          number="03"
          eyebrow="The critical moment"
          title="What happens when a destroyed batch appears again?"
          description="This is where MEDTRACE moves from passive tracking to active compliance intelligence."
        >
          <div className="relative mt-12 overflow-hidden rounded-[28px] border border-red-200 bg-[#fff8f7] p-7 md:p-10">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-red-100/50 blur-3xl" />

            <div className="relative">
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-red-600">
                <CircleAlert size={15} />
                Critical trace anomaly
              </div>

              <div className="mt-6 font-mono text-2xl tracking-[-0.03em] md:text-4xl">
                MED-2026-001
              </div>

              <div className="mt-3 max-w-xl text-sm leading-6 text-black/50">
                This batch was previously marked as destroyed. A new
                scan has detected the same batch number at another
                pharmacy.
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-red-200 bg-white p-4">
                  <div className="text-[9px] uppercase tracking-wider text-black/30">
                    Previous state
                  </div>

                  <div className="mt-3 text-sm font-medium text-red-600">
                    DESTROYED
                  </div>
                </div>

                <div className="rounded-xl border border-red-200 bg-white p-4">
                  <div className="text-[9px] uppercase tracking-wider text-black/30">
                    Current scan
                  </div>

                  <div className="mt-3 text-sm font-medium">
                    Pharmacy B
                  </div>
                </div>

                <div className="rounded-xl border border-red-200 bg-white p-4">
                  <div className="text-[9px] uppercase tracking-wider text-black/30">
                    Risk score
                  </div>

                  <div className="mt-3 text-sm font-medium text-red-600">
                    94 / 100
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/login"
                  className="flex items-center gap-2 rounded-full bg-[#111111] px-5 py-3 text-xs font-medium text-white"
                >
                  Investigate alert
                  <ArrowUpRight size={14} />
                </a>

                <div className="flex items-center gap-2 rounded-full border border-red-200 bg-white px-5 py-3 text-[10px] uppercase tracking-wider text-red-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  Re-entry detected
                </div>
              </div>
            </div>
          </div>
        </StoryCard>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-black/10 px-5 py-10 md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="text-2xl font-semibold tracking-[-0.05em]">
              MEDTRACE
            </div>

            <div className="mt-2 text-[9px] uppercase tracking-[0.2em] text-black/30">
              Track · Verify · Prevent Re-entry
            </div>
          </div>

          <div className="text-[9px] uppercase tracking-[0.15em] text-black/25">
            Pharmaceutical reverse-chain compliance
          </div>
        </div>
      </footer>
    </main>
  );
}