import { Bell, FileCheck2, Flame, LayoutDashboard, PackageSearch, RotateCcw, ScanLine, Settings, ShieldAlert } from "lucide-react";

export const navigation = [
  { label: "Overview", href: "/app", icon: LayoutDashboard },
  { label: "Batch Registry", href: "/app/batches", icon: PackageSearch },
  { label: "Trace Scanner", href: "/app/scanner", icon: ScanLine },
  { label: "Returns", href: "/app/returns", icon: RotateCcw },
  { label: "Destruction", href: "/app/destruction", icon: Flame },
  { label: "Fraud Monitor", href: "/app/fraud", icon: ShieldAlert },
  { label: "Certificates", href: "/app/certificates", icon: FileCheck2 },
  { label: "Notifications", href: "/app/notifications", icon: Bell },
  { label: "Settings", href: "/app/settings", icon: Settings },
];