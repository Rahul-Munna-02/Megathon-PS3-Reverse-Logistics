"use client";

import { createContext, useContext, useEffect, useId, useRef, useState, type ButtonHTMLAttributes, type HTMLAttributes, type InputHTMLAttributes, type ReactNode } from "react";
import { CheckCircle2, Inbox, LoaderCircle, X } from "lucide-react";

export function Button({ variant = "primary", loading = false, className = "", children, disabled, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger"; loading?: boolean }) {
  return <button className={`btn btn-${variant} ${className}`} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>{loading && <LoaderCircle size={16} className="spin" />}{children}</button>;
}

export function Input({ label, error, hint, id, className = "", ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: string }) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return <div className="field"><label className="field-label" htmlFor={inputId}>{label}</label><input id={inputId} className={`input ${className}`} aria-invalid={error ? true : undefined} aria-describedby={error || hint ? `${inputId}-message` : undefined} {...props} />{(error || hint) && <p id={`${inputId}-message`} className={error ? "field-message" : "muted"}>{error || hint}</p>}</div>;
}

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`card ${className}`} {...props} />;
}

export type BadgeTone = "neutral" | "success" | "warning" | "danger";
export function Badge({ tone = "neutral", className = "", ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return <span className={`badge badge-${tone} ${className}`} {...props} />;
}

type OverlayProps = { open: boolean; onClose: () => void; title: string; children: ReactNode; className?: string };
function Overlay({ open, onClose, title, children, className = "" }: OverlayProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open]);
  return <dialog ref={ref} className={`overlay ${className}`} aria-labelledby={headingId} onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); onClose(); } }} onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === event.currentTarget) { const bounds = event.currentTarget.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose(); } }}><div className="overlay-head"><h2 id={headingId}>{title}</h2><Button variant="ghost" className="btn-icon" aria-label="Close dialog" onClick={onClose}><X size={20} /></Button></div>{children}</dialog>;
}

export function Modal(props: OverlayProps) { return <Overlay {...props} />; }
export function Drawer({ side = "right", ...props }: OverlayProps & { side?: "left" | "right" }) { return <Overlay {...props} className={`drawer drawer-${side} ${props.className ?? ""}`} />; }

export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  return <span className="tooltip-wrap">{children}<span className="tooltip-text" role="tooltip">{label}</span></span>;
}

export function Skeleton({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={`skeleton ${className}`} aria-hidden="true" {...props} />; }
export function EmptyState({ title, description, action, icon = <Inbox size={30} strokeWidth={1.4} /> }: { title: string; description: string; action?: ReactNode; icon?: ReactNode }) { return <div className="empty-state">{icon}<h2>{title}</h2><p>{description}</p>{action}</div>; }
export function ErrorState({ title = "Something needs your attention", message, onRetry }: { title?: string; message: string; onRetry?: () => void }) { return <div className="error-state" role="alert"><strong>{title}</strong><p>{message}</p>{onRetry && <Button variant="secondary" onClick={onRetry}>Try again</Button>}</div>; }

const ToastContext = createContext<(message: string) => void>(() => {});
export function useToast() { return useContext(ToastContext); }
export function Toast({ message, onDismiss }: { message: string; onDismiss: () => void }) { return <div className="toast" role="status"><CheckCircle2 size={18} /><span>{message}</span><Button variant="ghost" className="btn-icon" aria-label="Dismiss notification" onClick={onDismiss}><X size={16} /></Button></div>; }
export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");
  useEffect(() => { if (!message) return; const timer = setTimeout(() => setMessage(""), 5500); return () => clearTimeout(timer); }, [message]);
  return <ToastContext.Provider value={setMessage}>{children}<div className="toast-stack">{message && <Toast message={message} onDismiss={() => setMessage("")} />}</div></ToastContext.Provider>;
}