import type { Metadata } from "next";
import ApplicationShell from "@/src/components/layout/ApplicationShell";

export const metadata: Metadata = { title: "Workspace", robots: { index: false, follow: false } };
export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return <ApplicationShell>{children}</ApplicationShell>;
}