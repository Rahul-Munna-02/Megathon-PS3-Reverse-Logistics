"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, Bell, ChevronRight, LogOut, Search, ShieldCheck } from "lucide-react";
import { signOutDemo, useDemoSession } from "@/src/lib/demo-auth";
import { navigation } from "@/src/lib/navigation";
import { Badge, Button, Drawer, EmptyState, Input, Modal, Skeleton, ToastProvider, useToast } from "../ui/primitives";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function Shell({ children }: { children: ReactNode }) {
  const { session, ready } = useDemoSession();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [query, setQuery] = useState("");
  const toast = useToast();
  const role = session?.role;
  const title = navigation.find(item => item.href === pathname)?.label ?? "Workspace";
  useEffect(() => { if (ready && !session) router.replace("/login"); }, [ready, session, router]);
  useEffect(() => { if (role) toast(`Signed in as ${role}. Demo session active.`); }, [role, toast]);

  if (!ready || !session) return <main className="session-loading" aria-busy="true"><ShieldCheck size={30} /><p role="status">Opening your workspace...</p><Skeleton className="session-skeleton" /><Skeleton className="session-skeleton-short" /></main>;
  const results = navigation.filter(item => item.label.toLowerCase().includes(query.trim().toLowerCase()));
  return <div className={`application-shell ${collapsed ? "shell-collapsed" : ""}`}><a href="#workspace-content" className="skip-link">Skip to workspace content</a><div className="desktop-sidebar"><Sidebar collapsed={collapsed} onToggle={() => setCollapsed(value => !value)} /></div><div className="shell-main"><Topbar title={title} session={session} onMenu={() => setDrawer(true)} onSearch={() => setSearchOpen(true)} onNotifications={() => setNotifications(true)} onUser={() => setUserOpen(true)} /><div className="demo-environment-bar"><span className="status-dot" /><span>Demo workspace</span><span className="environment-divider">/</span><span>No live compliance data</span><Badge>PHASE 01</Badge></div><main id="workspace-content" className="workspace-content" key={pathname}><div className="route-enter">{children}</div></main><footer className="workspace-footer"><span>MEDTRACE · Reverse-chain compliance</span><span>Track. Verify. Prevent Re-entry.</span></footer></div>
    <Drawer open={drawer} onClose={() => setDrawer(false)} title="Workspace" side="left" className="navigation-drawer"><Sidebar mobile onNavigate={() => setDrawer(false)} /></Drawer>
    <Modal open={searchOpen} onClose={() => { setSearchOpen(false); setQuery(""); }} title="Search workspace"><Input label="Find a workspace destination" placeholder="Search navigation..." value={query} onChange={event => setQuery(event.target.value)} type="search" /><nav className="search-results" aria-label="Search results">{results.map(item => { const Icon = item.icon; return <Link key={item.href} href={item.href} onClick={() => { setSearchOpen(false); setQuery(""); }}><Icon size={17} /><span>{item.label}</span>{item.href !== "/app" && <small>Future phase</small>}<ChevronRight size={15} /></Link>; })}{results.length === 0 && <EmptyState title="No matching destinations" description="Try a different workspace name." icon={<Search size={28} />} />}</nav></Modal>
    <Drawer open={notifications} onClose={() => setNotifications(false)} title="Notifications"><Badge>DEMO ENVIRONMENT</Badge><EmptyState title="Nothing requires your attention" description="This demo has no live notifications. Compliance alerts will appear here when the platform is connected." icon={<Bell size={28} />} action={<Button variant="secondary" onClick={() => setNotifications(false)}>Back to workspace <ArrowRight size={16} /></Button>} /></Drawer>
    <Modal open={userOpen} onClose={() => setUserOpen(false)} title="Your account"><div className="account-summary"><span className="avatar avatar-large">{session.role.slice(0, 1)}</span><div><h3>Demo operator</h3><p>{session.email}</p><Badge>{session.role}</Badge></div></div><p className="account-note">Frontend demonstration only. This session is local to this tab and expires after eight hours. No production permissions are granted.</p><Button variant="secondary" className="btn-wide" onClick={() => { setUserOpen(false); signOutDemo(); router.replace("/login"); }}><LogOut size={16} />Sign out</Button></Modal>
  </div>;
}

export default function ApplicationShell({ children }: { children: ReactNode }) {
  return <ToastProvider><Shell>{children}</Shell></ToastProvider>;
}