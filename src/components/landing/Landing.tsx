"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Check, CheckCheck, ChevronRight, Factory, FileCheck2, Fingerprint, Link2, Menu, Package, RotateCcw, ScanLine, ShieldAlert, ShieldCheck, Truck } from "lucide-react";
import { Badge, Button, Drawer, Modal } from "../ui/primitives";
import StatusBadge from "../ui/StatusBadge";
import { demoBatch, traceStages } from "@/src/lib/demo";

const stageIcons = [Package, Truck, Factory, ShieldCheck, CheckCheck];
const sectionLinks = [{ href: "#problem", label: "The problem" }, { href: "#trace", label: "The trace" }, { href: "#accountability", label: "Beyond destruction" }];

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reducedMotion = useReducedMotion();
  return <motion.div className={className} initial={reducedMotion ? false : { opacity: .5, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: .6 }} viewport={{ once: true, amount: .12 }}>{children}</motion.div>;
}

function SectionLabel({ number, children }: { number: string; children: ReactNode }) {
  return <div className="section-label"><span className="mono">{number}</span><span>{children}</span></div>;
}

export default function Landing() {
  const [activeStage, setActiveStage] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [criticalState, setCriticalState] = useState<0 | 1 | 2>(0);
  const reducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOffset = useTransform(scrollYProgress, [0, 1], [0, 65]);
  const currentStage = traceStages[activeStage];

  useEffect(() => {
    if (criticalState !== 1) return;
    const timer = setTimeout(() => setCriticalState(2), reducedMotion ? 250 : 1600);
    return () => clearTimeout(timer);
  }, [criticalState, reducedMotion]);

  return <div className="landing">
    <a href="#main-content" className="skip-link">Skip to content</a>
    <header className="site-header">
      <Link href="/" className="wordmark" aria-label="MEDTRACE home"><span className="brand-symbol"><Link2 size={19} /></span>MEDTRACE<span className="brand-period">.</span></Link>
      <nav className="desktop-nav" aria-label="Main navigation">{sectionLinks.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav>
      <div className="header-actions"><Link href="/login" className="header-signin">Sign in <ArrowUpRight size={15} /></Link><Button variant="ghost" className="btn-icon mobile-menu-button" aria-label="Open navigation" onClick={() => setMobileMenu(true)}><Menu size={21} /></Button></div>
    </header>
    <Drawer open={mobileMenu} onClose={() => setMobileMenu(false)} title="MEDTRACE"><nav className="mobile-site-nav" aria-label="Mobile navigation">{sectionLinks.map(link => <a key={link.href} href={link.href} onClick={() => setMobileMenu(false)}>{link.label}<ArrowUpRight size={18} /></a>)}<Link href="/login" className="btn btn-primary">Enter MEDTRACE <ArrowRight size={17} /></Link></nav></Drawer>
    <main id="main-content">
      <section ref={heroRef} className="hero">
        <motion.div className="hero-image" style={{ y: reducedMotion ? 0 : heroOffset }}><Image src="/medicine.jpg" alt="Medicine blister packs, tablets and pharmaceutical packaging" fill priority sizes="100vw" /></motion.div>
        <div className="hero-wash" />
        <div className="container hero-inner">
          <div className="hero-kicker"><span className="status-dot" /> Pharmaceutical reverse-chain compliance</div>
          <div className="hero-body">
            <div className="hero-title-group"><h1>MED<br />TRACE<span>.</span></h1><p className="hero-tagline">Track. Verify. Prevent Re-entry.</p></div>
            <div className="hero-note"><span className="mono">ONE BATCH. A CONTINUOUS RECORD.</span><p>Medicine has an expiry date.<br />Accountability doesn&apos;t.</p><span className="hero-note-rule" /><div className="hero-batch"><Fingerprint size={22} strokeWidth={1.3} /><div><span className="mono">MED-2026-001</span><small>OncoSafe 500 · 100 units</small></div></div></div>
          </div>
          <div className="hero-bottom"><p>From the pharmacy shelf to verified destruction.<br />Every handoff connected. Every batch accounted for.</p><a href="#trace" className="btn btn-primary">Follow a batch <ArrowDownRight size={18} /></a><a href="#problem" className="scroll-link" aria-label="Scroll to the problem"><ArrowDown size={18} /><span>Scroll to explore</span></a></div>
        </div>
      </section>
      <div className="chain-strip"><div className="container"><span className="eyebrow">The reverse chain</span><div>{traceStages.map((stage, index) => <span key={stage.title}>{stage.title}{index < 4 && <ArrowRight size={13} />}</span>)}</div></div></div>
      <section id="problem" className="section problem-section"><div className="container"><Reveal><SectionLabel number="01">The problem</SectionLabel><div className="section-intro"><h2>The medicine stops.<br /><span className="muted">The responsibility doesn&apos;t.</span></h2><p>Expired and unused medicines move backwards through a system built to move them forwards. Across disconnected records and separate organizations, accountability gets lost between handoffs.</p></div></Reveal><div className="problem-columns"><Reveal><span className="problem-number mono">01 /</span><h3>Disconnected handoffs.</h3><p>A return leaves one organization. Another receives it. The records rarely make the journey together.</p></Reveal><Reveal><span className="problem-number mono">02 /</span><h3>Evidence without context.</h3><p>A disposal document is only useful when it connects to the exact batch and its complete custody history.</p></Reveal><Reveal><span className="problem-number mono">03 /</span><h3>A dangerous second life.</h3><p>Without a persistent batch identity, medicine marked as destroyed can find its way back into circulation.</p></Reveal></div><div className="problem-conclusion"><Link2 size={20} /><p>One identity. Every handoff. <strong>No missing chapter.</strong></p><a href="#trace" aria-label="Explore the connected trace"><ArrowDownRight size={23} /></a></div></div></section>
      <section id="trace" className="section trace-section"><div className="container"><Reveal><SectionLabel number="02">The trace</SectionLabel><div className="section-intro"><h2>A journey backwards.<br /><span className="muted">A clear way forward.</span></h2><div><Badge>INTERACTIVE DEMO</Badge><p className="intro-description">One batch. Five stages. An unbroken chain of custody.</p></div></div></Reveal>
        <div className="trace-workbench"><div className="trace-batch-heading"><div><span className="mono">{demoBatch.id}</span><h3>{demoBatch.medicine}</h3></div><div className="trace-batch-meta"><span>{demoBatch.quantity}</span><span>Expiry: {demoBatch.expiry}</span></div><Badge tone="neutral">DEMONSTRATION RECORD</Badge></div>
          <div className="trace-stages" aria-label="Batch custody stages">{traceStages.map((stage, index) => { const Icon = stageIcons[index]; return <button key={stage.title} type="button" onClick={() => setActiveStage(index)} aria-pressed={activeStage === index} className={`trace-stage ${activeStage === index ? "is-active" : ""} ${activeStage > index ? "is-complete" : ""}`}><span className="stage-node">{activeStage > index ? <Check size={20} /> : <Icon size={21} strokeWidth={1.5} />}</span><span className="stage-number mono">0{index + 1}</span><span className="stage-title">{stage.title}</span></button>; })}</div>
          <div className="trace-detail" aria-live="polite" aria-atomic="true"><div className="trace-detail-main" key={currentStage.title}><span className="eyebrow muted">Current custody · stage 0{activeStage + 1}</span><h3>{currentStage.location}</h3><p>{currentStage.description}</p></div><dl><div><dt>Batch state</dt><dd><StatusBadge status={currentStage.status} tone={activeStage === 0 || activeStage === 3 ? "warning" : "success"} /></dd></div><div><dt>Latest event</dt><dd>{currentStage.evidence}</dd></div><div><dt>Recorded</dt><dd className="mono">{currentStage.date}</dd></div></dl></div>
          <div className="trace-controls"><span className="mono">0{activeStage + 1} <span className="muted">/ 05</span></span><div><Button variant="ghost" className="btn-icon" aria-label="Reset batch trace" disabled={activeStage === 0} onClick={() => setActiveStage(0)}><RotateCcw size={16} /></Button><Button variant="secondary" disabled={activeStage === 4} onClick={() => setActiveStage(stage => Math.min(4, stage + 1))}>{activeStage === 4 ? "Journey complete" : "Next handoff"}{activeStage === 4 ? <Check size={16} /> : <ArrowRight size={16} />}</Button></div></div>
        </div>
      </div></section>
      <section id="passport" className="section passport-section"><div className="container passport-grid"><Reveal><SectionLabel number="03">The batch passport</SectionLabel><h2>Not just a status.<br /><span className="muted">The whole story.</span></h2><p className="section-copy">Every batch carries its history. Where it came from. Who held it. What happened next. The record stays connected, even after the medicine is gone.</p><ul className="passport-points"><li><Fingerprint size={19} /> A persistent, unique batch identity</li><li><Link2 size={19} /> A chronological chain of custody</li><li><FileCheck2 size={19} /> Destruction evidence, linked to the source</li></ul><Button variant="secondary" onClick={() => setEvidenceOpen(true)}>Inspect sample evidence <ArrowUpRight size={16} /></Button></Reveal><Reveal><article className="passport"><div className="passport-head"><span className="eyebrow">Batch passport</span><Fingerprint size={24} /></div><h3 className="mono">{demoBatch.id}</h3><p>{demoBatch.medicine} <span className="muted">/ {demoBatch.quantity}</span></p><div className="passport-separator"><span>Custody history</span><span className="mono">05 EVENTS</span></div><ol className="passport-history">{traceStages.map((stage, index) => <li key={stage.eventId}><span className="history-node"><Check size={11} /></span><div><span className="mono history-date">{stage.date}</span><h4>{stage.event}</h4><span className="history-location">{index === 4 ? "Verified destruction" : stage.location}</span></div><span className="mono history-id">{stage.eventId}</span></li>)}</ol><div className="passport-footer"><ShieldCheck size={17} /><span>The journey ends. The record remains.</span><Badge>SAMPLE</Badge></div></article></Reveal></div></section>
      <section id="accountability" className={`section critical-section ${criticalState === 2 ? "critical-alert" : ""}`}><div className="container"><SectionLabel number="04">The critical moment</SectionLabel><div className="critical-grid"><div><h2>Destroyed should<br />mean <span>never again.</span></h2><p className="section-copy">What happens when a batch that no longer exists appears on a pharmacy shelf?</p><div className="critical-context"><span className="eyebrow">A simulated re-entry scenario</span><p>No live scan. No real patient or batch data.</p></div></div><div className="critical-display" aria-live="polite" aria-atomic="true"><div className="critical-display-top"><span className="mono">{demoBatch.id}</span><span className="eyebrow">Demo event</span></div>{criticalState === 0 ? <div className="destroyed-state"><ShieldCheck size={40} strokeWidth={1} /><span className="eyebrow">07 Jul 2026 · Disposal verified</span><h3>DESTROYED</h3><p>100 units. Physical journey complete.</p></div> : <div className="scan-state"><div className="scan-detected"><ScanLine size={18} />NEW SCAN DETECTED</div><dl><div><dt>Batch identity</dt><dd className="mono">MED-2026-001</dd></div><div><dt>Current location</dt><dd>Pharmacy B</dd></div><div><dt>Previous status</dt><dd>DESTROYED</dd></div></dl>{criticalState === 2 ? <div className="fraud-banner"><ShieldAlert size={25} /><div><strong>DESTROYED BATCH RE-ENTRY</strong><p>This batch was destroyed. It should not be here.</p></div></div> : <div className="scan-comparing"><ScanLine size={17} />Comparing with the batch passport...</div>}</div>}<div className="critical-display-bottom"><span>{criticalState === 0 ? "The record is still watching." : criticalState === 1 ? "Checking previous custody events" : "The trace makes the contradiction visible."}</span><Button variant={criticalState === 2 ? "danger" : "secondary"} loading={criticalState === 1} onClick={() => setCriticalState(criticalState === 2 ? 0 : 1)}>{criticalState === 2 ? <><RotateCcw size={15} />Replay</> : <><ScanLine size={16} />Simulate a new scan</>}</Button></div></div></div><div className="critical-bottom-line"><span>Destruction is an event.</span><strong>Accountability is continuous.</strong><ArrowDownRight size={24} /></div></div></section>
      <section id="enter" className="section enter-section"><div className="container"><SectionLabel number="05">Enter MEDTRACE</SectionLabel><Reveal><div className="enter-content"><h2>A closed loop.<br />An open record.</h2><div><p>Bring the reverse chain into view.<br />Keep what&apos;s expired out of circulation.</p><Link href="/login" className="btn btn-primary">Enter MEDTRACE <ArrowUpRight size={18} /></Link><span className="enter-note">Demo access for every role in the chain.</span></div></div></Reveal></div></section>
    </main>
    <footer className="site-footer container"><Link href="/" className="wordmark">MEDTRACE.</Link><p>Track. Verify. Prevent Re-entry.</p><span>Phase 01 · Product demonstration</span><a href="#main-content" aria-label="Back to top"><ArrowUpRight size={20} /></a></footer>
    <Modal open={evidenceOpen} onClose={() => setEvidenceOpen(false)} title="Sample destruction evidence"><Badge>DEMONSTRATION ONLY</Badge><div className="evidence-details"><FileCheck2 size={32} /><h3 className="mono">CERT-DEMO-001</h3><p>Linked batch: <span className="mono">MED-2026-001</span></p><dl><div><dt>Facility</dt><dd>Authorized Waste Facility</dd></div><div><dt>Quantity</dt><dd>100 units</dd></div><div><dt>Recorded destruction</dt><dd>07 Jul 2026</dd></div></dl><p className="muted">Illustrative evidence for the product demonstration. This is not a regulatory certificate or proof of real-world destruction.</p></div><Button className="btn-wide" onClick={() => setEvidenceOpen(false)}>Return to the passport <ChevronRight size={16} /></Button></Modal>
  </div>;
}