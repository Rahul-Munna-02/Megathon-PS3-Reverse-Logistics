"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Fingerprint, LockKeyhole, ShieldCheck } from "lucide-react";
import { useDemoSession } from "@/src/lib/demo-auth";
import { traceStages } from "@/src/lib/demo";
import PageHeader from "../ui/PageHeader";
import { Badge, Card, EmptyState } from "../ui/primitives";

export function WorkspaceWelcome() {
  const { session } = useDemoSession();
  return <><PageHeader eyebrow={`${session?.role ?? "Demo"} / Overview`} title="Your workspace is ready." description="A shared point of accountability for the pharmaceutical reverse chain." action={<Link href="/#trace" className="btn btn-primary">Explore the demo trace <ArrowUpRight size={16} /></Link>} /><section className="workspace-welcome"><div><span className="eyebrow muted">Connected from the first handoff</span><h2>A continuous record.<br /><span>Even after the journey ends.</span></h2><p>Every organization has a role in keeping expired medicine out of circulation. MEDTRACE brings those handoffs into one trace.</p><div className="welcome-batch"><Fingerprint size={22} /><span className="mono">MED-2026-001</span><Badge>SAMPLE BATCH</Badge></div></div><Card className="session-card"><ShieldCheck size={26} strokeWidth={1.4} /><h3>{session?.role} workspace</h3><p>Demo operator</p><dl><div><dt>Environment</dt><dd>Demonstration</dd></div><div><dt>Data connection</dt><dd>Not connected</dd></div><div><dt>Session</dt><dd><span className="status-dot" />Active in this tab</dd></div></dl></Card></section><section className="workspace-chain" aria-label="Pharmaceutical reverse chain"><div className="workspace-section-head"><h2>The reverse chain</h2><span className="muted">One identity across every handoff</span></div><ol>{traceStages.map((stage, index) => <li key={stage.title}><span className="mono">0{index + 1}</span><strong>{stage.title}</strong>{index < 4 ? <ArrowRight size={16} /> : <Check size={16} />}</li>)}</ol></section><div className="phase-notice"><LockKeyhole size={20} /><div><h3>Foundation in place. Operations come next.</h3><p>Batch, scanning, returns, destruction and regulatory workflows are reserved for future phases. No action is required in this demo workspace.</p></div><Badge>PHASE 01</Badge></div></>;
}

export function FutureModule({ title }: { title: string }) {
  return <><PageHeader eyebrow={`Workspace / ${title}`} title={title} description="This destination is reserved for a future phase of MEDTRACE." /><div className="future-module"><Badge>NOT AVAILABLE IN PHASE 01</Badge><EmptyState title="The foundation comes first." description={`${title} is not connected or operational yet. Your demo session is active; no compliance actions can be performed here.`} icon={<LockKeyhole size={32} strokeWidth={1.4} />} action={<Link href="/app" className="btn btn-primary">Return to overview <ArrowRight size={16} /></Link>} /></div></>;
}