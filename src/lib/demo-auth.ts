"use client";

import { useEffect, useSyncExternalStore } from "react";
import { demoEmail, demoPassword, demoRoles, type DemoRole } from "./demo";

const sessionKey = "medtrace.demo.session.v1";
const sessionEvent = "medtrace:session";
export type DemoSession = { role: DemoRole; email: string; expiresAt: number };

function subscribe(callback: () => void) {
  window.addEventListener(sessionEvent, callback);
  window.addEventListener("storage", callback);
  window.addEventListener("focus", callback);
  return () => {
    window.removeEventListener(sessionEvent, callback);
    window.removeEventListener("storage", callback);
    window.removeEventListener("focus", callback);
  };
}

function getSnapshot() {
  try { return sessionStorage.getItem(sessionKey); } catch { return null; }
}

function parseSession(raw: string | null): DemoSession | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<DemoSession>;
    if (!demoRoles.includes(value.role as DemoRole) || value.email !== demoEmail(value.role as DemoRole) || typeof value.expiresAt !== "number" || value.expiresAt <= Date.now()) return null;
    return value as DemoSession;
  } catch { return null; }
}

const serverSnapshot = () => null;
const clientReady = () => true;
const serverReady = () => false;

export function useDemoSession() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, serverSnapshot);
  const ready = useSyncExternalStore(subscribe, clientReady, serverReady);
  const session = parseSession(raw);
  const expiresAt = session?.expiresAt;
  useEffect(() => {
    if (!expiresAt) return;
    const timer = setTimeout(signOutDemo, Math.max(0, expiresAt - Date.now()));
    return () => clearTimeout(timer);
  }, [expiresAt]);
  return { session, ready };
}

export async function signInDemo(email: string, password: string): Promise<DemoSession> {
  await new Promise(resolve => setTimeout(resolve, 750));
  const role = demoRoles.find(candidate => demoEmail(candidate) === email.trim().toLowerCase());
  if (!role || password !== demoPassword) throw new Error("Those credentials do not match a demo account. Select a demo role below to try again.");
  const session = { role, email: demoEmail(role), expiresAt: Date.now() + 8 * 60 * 60 * 1000 };
  try { sessionStorage.setItem(sessionKey, JSON.stringify(session)); } catch { throw new Error("Browser session storage is unavailable. Allow site storage to enter the demo workspace."); }
  window.dispatchEvent(new Event(sessionEvent));
  return session;
}

export function signOutDemo() {
  try { sessionStorage.removeItem(sessionKey); } catch { /* Storage may be disabled by the browser. */ }
  window.dispatchEvent(new Event(sessionEvent));
}