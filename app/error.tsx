"use client";

import { ErrorState } from "@/src/components/ui/primitives";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="not-found"><div className="wordmark">MEDTRACE.</div><ErrorState title="This page could not be opened" message="Your demo data has not been changed. Please try loading the page again." onRetry={reset} /></main>;
}