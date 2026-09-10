"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronRight, Link2, PanelLeftClose, PanelLeftOpen, ShieldCheck } from "lucide-react";
import { navigation } from "@/src/lib/navigation";
import { Button, Tooltip } from "../ui/primitives";

export default function Sidebar({ collapsed = false, onToggle, onNavigate, mobile = false }: { collapsed?: boolean; onToggle?: () => void; onNavigate?: () => void; mobile?: boolean }) {
  const pathname = usePathname();
  return <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""} ${mobile ? "sidebar-mobile" : ""}`} aria-label="Workspace sidebar">
    <div className="sidebar-brand"><Link href="/app" className="wordmark" aria-label="MEDTRACE overview" onClick={onNavigate}><span className="brand-symbol"><Link2 size={19} /></span>{!collapsed && <span>MEDTRACE.</span>}</Link></div>
    <div className="sidebar-workspace"><span className="workspace-mark"><ShieldCheck size={18} /></span>{!collapsed && <div><strong>Compliance workspace</strong><span>Demo environment</span></div>}</div>
    <div className="sidebar-nav-area">{!collapsed && <div className="sidebar-nav-label">Workspace</div>}<nav aria-label={mobile ? "Mobile workspace navigation" : "Workspace navigation"}>{navigation.map(item => { const Icon = item.icon; const active = pathname === item.href; const link = <Link href={item.href} onClick={onNavigate} aria-label={item.label} aria-current={active ? "page" : undefined} className={`sidebar-link ${active ? "active" : ""}`}><Icon size={18} strokeWidth={1.6} />{!collapsed && <><span>{item.label}</span>{active && <ChevronRight size={14} />}</>}</Link>; return collapsed ? <Tooltip key={item.href} label={item.label}>{link}</Tooltip> : <div key={item.href}>{link}</div>; })}</nav></div>
    <div className="sidebar-footer"><Link href="/" className="sidebar-product-link" aria-label="Back to MEDTRACE website" onClick={onNavigate}><ArrowUpRight size={16} />{!collapsed && <span>About MEDTRACE</span>}</Link>{!mobile && <Tooltip label={collapsed ? "Expand sidebar" : "Collapse sidebar"}><Button variant="ghost" className="sidebar-toggle" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} aria-expanded={!collapsed} onClick={onToggle}>{collapsed ? <PanelLeftOpen size={18} /> : <><PanelLeftClose size={18} /><span>Collapse sidebar</span></>}</Button></Tooltip>}</div>
  </aside>;
}