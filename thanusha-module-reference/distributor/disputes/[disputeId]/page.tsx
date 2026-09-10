import Link from "next/link";

export default function DisputeDetailsPage() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="flex h-16 items-center justify-between border-b bg-white px-8">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            MEDTRACE
          </h1>

          <p className="text-xs text-slate-500">
            Track. Verify. Prevent Re-entry.
          </p>
        </div>

        <span className="text-sm text-slate-600">
          Distributor
        </span>
      </nav>

      <div className="flex">

        {/* Sidebar */}
        <aside className="hidden min-h-[calc(100vh-4rem)] w-64 border-r bg-white p-5 md:block">

          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Distributor
          </p>

          <div className="space-y-1">

            <Link
              href="/distributor/dashboard"
              className="block rounded-lg px-4 py-3 text-sm text-slate-600 hover:bg-slate-100"
            >
              Dashboard
            </Link>

            <Link
              href="/distributor/incoming"
              className="block rounded-lg px-4 py-3 text-sm text-slate-600 hover:bg-slate-100"
            >
              Incoming Returns
            </Link>

            <Link
              href="/distributor/pickups"
              className="block rounded-lg px-4 py-3 text-sm text-slate-600 hover:bg-slate-100"
            >
              Pickup Queue
            </Link>

            <Link
              href="/distributor/received"
              className="block rounded-lg px-4 py-3 text-sm text-slate-600 hover:bg-slate-100"
            >
              Received
            </Link>

            <Link
              href="/distributor/disputes"
              className="block rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
            >
              Disputes
            </Link>

            <Link
              href="/distributor/scan"
              className="block rounded-lg px-4 py-3 text-sm text-slate-600 hover:bg-slate-100"
            >
              Scan Batch
            </Link>

          </div>
        </aside>

        {/* Main */}
        <main className="w-full px-6 py-8 md:px-10">

          <div className="mx-auto max-w-5xl">

            <Link
              href="/distributor/disputes"
              className="text-sm font-medium text-blue-800 hover:underline"
            >
              ← Back to Disputes
            </Link>

            {/* Header */}
            <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

              <div>
                <p className="text-sm text-slate-500">
                  Quantity Dispute
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  DSP-2026-001
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Created during distributor receipt verification
                </p>
              </div>

              <span className="w-fit rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                DISPUTED
              </span>

            </div>

            {/* Alert */}
            <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6">

              <h3 className="text-lg font-bold text-red-800">
                QUANTITY DISCREPANCY DETECTED
              </h3>

              <p className="mt-2 text-sm text-red-700">
                The quantity physically received does not match the
                quantity declared in the return request.
              </p>

            </div>

            {/* Batch Information */}
            <section className="mt-6 rounded-xl border bg-white p-6 shadow-sm">

              <h3 className="font-semibold text-slate-900">
                Batch Information
              </h3>

              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                <div>
                  <p className="text-xs text-slate-500">
                    Return ID
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    RET-2026-001
                  </p>
                </div>

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
                    Retailer
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    Pharmacy A
                  </p>
                </div>

              </div>

            </section>

            {/* Quantity Comparison */}
            <section className="mt-6 rounded-xl border bg-white p-6 shadow-sm">

              <h3 className="font-semibold text-slate-900">
                Quantity Comparison
              </h3>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">

                <div className="rounded-lg bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">
                    Expected Quantity
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    100
                  </p>

                  <p className="text-xs text-slate-500">
                    units
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">
                    Received Quantity
                  </p>

                  <p className="mt-2 text-3xl font-bold text-red-600">
                    96
                  </p>

                  <p className="text-xs text-slate-500">
                    units
                  </p>
                </div>

                <div className="rounded-lg bg-red-50 p-5">
                  <p className="text-sm text-red-600">
                    Discrepancy
                  </p>

                  <p className="mt-2 text-3xl font-bold text-red-700">
                    4
                  </p>

                  <p className="text-xs text-red-600">
                    units missing
                  </p>
                </div>

              </div>

            </section>

            {/* Event */}
            <section className="mt-6 rounded-xl border bg-white p-6 shadow-sm">

              <h3 className="font-semibold text-slate-900">
                Audit Event
              </h3>

              <div className="mt-5 rounded-lg bg-slate-50 p-5">

                <p className="font-semibold text-slate-900">
                  DISPUTE_CREATED
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Distributor quantity verification detected a
                  discrepancy of 4 units.
                </p>

                <p className="mt-3 text-xs text-slate-400">
                  10 Sep 2026 • Distributor • Receipt Verification
                </p>

              </div>

            </section>

          </div>

        </main>

      </div>

    </div>
  );
}