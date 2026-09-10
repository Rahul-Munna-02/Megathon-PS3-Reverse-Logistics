"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Eye, EyeOff, Fingerprint, Link2, LockKeyhole, ShieldCheck } from "lucide-react";
import { Badge, Button, ErrorState, Input } from "@/src/components/ui/primitives";
import { demoEmail, demoPassword, demoRoles, traceStages, type DemoRole } from "@/src/lib/demo";
import { signInDemo } from "@/src/lib/demo-auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<DemoRole | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; if (timer.current) clearTimeout(timer.current); };
  }, []);
  const busy = status !== "idle";

  function selectRole(role: DemoRole) {
    setSelectedRole(role);
    setEmail(demoEmail(role));
    setPassword(demoPassword);
    setErrors({});
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const nextErrors = {
      email: !email.trim() ? "Enter your email address." : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? "Enter a valid email address." : undefined,
      password: !password ? "Enter your password." : undefined,
    };
    setErrors(nextErrors);
    setError("");
    if (nextErrors.email || nextErrors.password) {
      document.getElementById(nextErrors.email ? "login-email" : "login-password")?.focus();
      return;
    }
    setStatus("loading");
    try {
      await signInDemo(email, password);
      if (!mounted.current) return;
      setStatus("success");
      timer.current = setTimeout(() => router.replace("/app"), 650);
    } catch (reason) {
      if (!mounted.current) return;
      setError(reason instanceof Error ? reason.message : "Unable to sign in. Please try again.");
      setStatus("idle");
    }
  }

  return <main className="login-page route-enter">
    <section className="login-brand" aria-label="MEDTRACE pharmaceutical reverse chain">
      <Image src="/medicine.jpg" alt="Pharmaceutical blister packs and tablets" fill sizes="(max-width: 900px) 100vw, 50vw" priority />
      <div className="login-brand-wash" />
      <Link href="/" className="wordmark"><span className="brand-symbol"><Link2 size={19} /></span>MEDTRACE.</Link>
      <div className="login-brand-content"><span className="eyebrow">Connected custody. Continuous accountability.</span><h2>Every handoff.<br />{" "}Every batch.<br />{" "}<span>Accounted for.</span></h2><p>Track. Verify. Prevent Re-entry.</p><div className="login-trace"><div className="login-trace-heading"><Fingerprint size={19} /><span className="mono">MED-2026-001</span><Badge>SAMPLE TRACE</Badge></div><ol>{traceStages.map((stage, index) => <li key={stage.title}><span className="login-trace-node">{index === 4 ? <ShieldCheck size={15} /> : <Check size={12} />}</span><span>{stage.title}</span><span className="mono">0{index + 1}</span></li>)}</ol></div></div>
      <div className="login-brand-footer"><ShieldCheck size={15} /><span>The physical journey ends. The record remains.</span></div>
    </section>
    <section className="login-interface" aria-labelledby="login-title">
      <div className="login-top"><Link href="/" className="back-link"><ArrowLeft size={15} />Back to MEDTRACE</Link><Badge>DEMO ENVIRONMENT</Badge></div>
      <div className="login-form-wrap"><div className="login-heading"><div className="login-emblem"><LockKeyhole size={23} strokeWidth={1.5} /></div><span className="eyebrow muted">Your compliance workspace</span><h1 id="login-title">Welcome back.</h1><p>Sign in to your MEDTRACE workspace.</p></div>
        <form onSubmit={submit} noValidate className="login-form" aria-label="Sign in to MEDTRACE">
          <Input id="login-email" label="Email address" type="email" autoComplete="username" placeholder="you@organization.com" value={email} disabled={busy} error={errors.email} onChange={event => { setEmail(event.target.value); setSelectedRole(null); }} required />
          <div className="password-field"><Input id="login-password" label="Password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" value={password} disabled={busy} error={errors.password} onChange={event => setPassword(event.target.value)} required /><Button type="button" variant="ghost" className="btn-icon password-toggle" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword(value => !value)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</Button></div>
          {error && <ErrorState title="Sign-in unsuccessful" message={error} />}
          <Button type="submit" className="btn-wide" loading={status === "loading"} disabled={status === "success"}>{status === "success" ? <><CheckCircle2 size={17} />Signed in</> : status === "loading" ? "Signing in..." : <>Sign in <ArrowRight size={17} /></>}</Button>
          <div className="login-status" role="status">{status === "success" ? "Opening your workspace..." : "Demo access only. No live compliance data."}</div>
        </form>
        <fieldset className="demo-role-fieldset" disabled={busy}><legend>Explore with a demo role</legend><div className="demo-roles">{demoRoles.map(role => <label key={role} className={`demo-role ${selectedRole === role ? "selected" : ""}`}><input type="radio" name="demo-role" value={role} checked={selectedRole === role} onChange={() => selectRole(role)} /><span>{role}</span>{selectedRole === role && <Check size={12} />}</label>)}</div><p aria-live="polite">{selectedRole ? `${selectedRole} demo credentials are ready.` : "Choose your place in the reverse chain."}</p></fieldset>
      </div>
      <footer className="login-footer"><span>MEDTRACE · Phase 01</span><span><LockKeyhole size={12} />Local demo session</span></footer>
    </section>
  </main>;
}
