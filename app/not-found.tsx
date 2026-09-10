import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { EmptyState } from "@/src/components/ui/primitives";

export default function NotFound() {
  return <main className="not-found"><div className="wordmark">MEDTRACE.</div><EmptyState title="This page is outside the trace." description="The address may have changed, or the page does not exist." icon={<Search size={32} />} action={<Link href="/" className="btn btn-primary"><ArrowLeft size={17} />Return to MEDTRACE</Link>} /></main>;
}