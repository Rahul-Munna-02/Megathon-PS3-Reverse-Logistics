import Link from "next/link";

export default function ReturnDetailsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="flex h-16 items-center justify-between border-b bg-white px-8">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            MEDTRACE
          </h1>
          <p className="text-xs text-slate-500">
            Track. Verify. Prevent Re-entry.
          </p>
        </div>

        <div className="text-sm text-slate-600">
          Retailer
        </div>
      </nav>

      <div className="flex">
        <aside className="hidden min-h-[calc(100vh-4rem)] w-64 border-r bg-white p-5 md:block">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Retailer
          </p>

          <div className="space-y-1">
            <Link
              href="/retailer/dashboard"
              className="block rounded-lg px-4 py-3 text-sm text-slate-600 hover:bg-slate-100"
            >
              Dashboard
            </Link>

            <Link
              href="/retailer/inventory"
              className="block rounded-lg px-4 py-3 text-sm text-slate-600 hover:bg-slate-100"
            >
              Inventory
            </Link>

            <Link
              href="/retailer/returns"
              className="block rounded-lg bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-900"
            >
              Returns
            </Link>

            <Link
              href="/retailer/scan"
              className="block rounded-lg px-4 py-3 text-sm text-slate-600 hover:bg-slate-100"
            >
              Scan Batch
            </Link>
          </div>
        </aside>

        <main className="w-full px-6 py-8 md:px-10">
          <div className="mx-auto max-w-5xl">

            <Link
              href="/retailer/returns"
              className="text-sm font-medium text-blue-800 hover:underline"
            >
              ← Back to Returns
            </Link>

            <div className="mt-6 flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Return Request
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  RET-2026-001
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Reverse logistics tracking
                </p>
              </div>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                RETURN REQUESTED
              </span>
            </div>

            {/* Summary */}
            <section className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900">
                Return Summary
              </h3>

              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-xs text-slate-500">
                    Batch Number
                  </p>
                  <p className="mt-1 font-semibold text-blue-800">
                    MED-2026-001
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Medicine
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    OncoSafe 500
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Expected Quantity
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    100 units
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Reason
                  </p>
                  <p className="mt-1 font-semibold text-red-600">
                    Expired
                  </p>
                </div>
              </div>
            </section>

            {/* Pickup */}
            <section className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900">
                Pickup Information
              </h3>

              <div className="mt-5 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-500">
                    Pickup Location
                  </p>

                  <p className="mt-1 font-medium text-slate-900">
                    Pharmacy A - Main Store
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Pickup Status
                  </p>

                  <p className="mt-1 font-medium text-amber-600">
                    Pending Assignment
                  </p>
                </div>
              </div>
            </section>

            {/* Timeline */}
            <section className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900">
                Return Timeline
              </h3>

              <div className="mt-6 space-y-7">

                <div className="flex gap-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                    ✓
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      Return Created
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Retailer created a return request for the expired batch.
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                      10 Sep 2026 • 10:30 AM
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    •
                  </div>

                  <div>
                    <p className="font-semibold text-slate-400">
                      Pickup Assigned
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Waiting for distributor pickup assignment.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    •
                  </div>

                  <div>
                    <p className="font-semibold text-slate-400">
                      Distributor Received
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Batch receipt will appear here after handoff.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    •
                  </div>

                  <div>
                    <p className="font-semibold text-slate-400">
                      Quantity Verified
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Distributor will verify the received quantity.
                    </p>
                  </div>
                </div>

              </div>
            </section>

            <div className="mt-6">
              <Link
                href="/retailer/inventory/MED-2026-001"
                className="text-sm font-semibold text-blue-800 hover:underline"
              >
                View Batch Details →
              </Link>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}