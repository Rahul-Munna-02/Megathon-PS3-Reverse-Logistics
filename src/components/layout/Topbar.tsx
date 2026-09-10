"use client";

import { Bell, ChevronDown, Menu, Search } from "lucide-react";
import type { DemoSession } from "@/src/lib/demo-auth";
import { Button, Tooltip } from "../ui/primitives";

export default function Topbar({ title, session, onMenu, onSearch, onNotifications, onUser }: { title: string; session: DemoSession; onMenu: () => void; onSearch: () => void; onNotifications: () => void; onUser: () => void }) {
  return <header className="topbar"><Button variant="ghost" className="btn-icon shell-menu-button" aria-label="Open workspace navigation" onClick={onMenu}><Menu size={21} /></Button><div className="topbar-title"><span>Workspace</span><strong>{title}</strong></div><div className="topbar-actions"><Button variant="secondary" className="shell-search-button" aria-label="Search workspace navigation" onClick={onSearch}><Search size={16} /><span>Search workspace</span></Button><Tooltip label="Notifications"><Button variant="ghost" className="btn-icon" aria-label="Open notifications" onClick={onNotifications}><Bell size={18} /></Button></Tooltip><button className="user-button" aria-label={`Open ${session.role} account`} onClick={onUser}><span className="avatar">{session.role.slice(0, 1)}</span><span className="user-button-text"><strong>Demo operator</strong><small>{session.role}</small></span><ChevronDown size={14} /></button></div></header>;
}