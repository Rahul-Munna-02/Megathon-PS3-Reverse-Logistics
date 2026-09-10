import Link from "next/link";

export default function DistributorDashboardPage() {
  const kpis = [
    {
      title: "Incoming Returns",
      value: "24",
      description: "Awaiting distributor action",
    },
    {
      title: "Pickup Assigned",
      value: "8",
      description: "Scheduled for pickup",
    },
    {
      title: "Received Today",
      value: "11",
      description: "Batches received",
    },
    {
      title: "Disputes",
      value: "2",
      description: "Require attention",
    },
  ];

  const incomingReturns = [
    {
      id: "RET-2026-001",
      batch: "MED-2026-001",
      medicine: "OncoSafe 500",
      quantity: 100,
      retailer: "Pharmacy A",
      status: "RETURN REQUESTED",
    },
    {
      id: "RET-2026-002",
      batch: "MED-2026-014",
      medicine: "CardioSafe 20",
      quantity: 50,
      retailer: "Pharmacy B",
      status: "PICKUP ASSIGNED",
    },
    {
      id: "RET-2026-003",
      batch: "MED-2026-021",
      medicine: "NeuroCalm 10",
      quantity: 75,
      retailer: "Pharmacy C",
      status: "RETURN REQUESTED",
    },
  ];

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

        <div className="flex items-center gap-4 text-sm text-slate-600">
          <span>🔔</span>

          <span>Distributor</span>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 font-semibold">
            D
          </div>
        </div>
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
              className="block rounded-lg bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-900"
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
              className="block rounded-lg px-4 py-3 text-sm text-slate-600 hover:bg-slate-100"
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

          <div className="mx-auto max-w-6xl">

            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Distributor Dashboard
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage incoming medicine returns and verify batch handoffs.
              </p>
            </div>

            {/* KPI Cards */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {kpis.map((kpi) => (
                <div
                  key={kpi.title}
                  className="rounded-xl border bg-white p-5 shadow-sm"
                >
                  <p className="text-sm text-slate-500">
                    {kpi.title}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {kpi.value}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    {kpi.description}
                  </p>
                </div>
              ))}

            </div>

            {/* Incoming Returns */}
            <section className="mt-8 overflow-hidden rounded-xl border bg-white shadow-sm">

              <div className="flex flex-col justify-between gap-3 border-b px-6 py-5 sm:flex-row sm:items-center">

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Incoming Returns
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Returns waiting for distributor processing.
                  </p>
                </div>

                <Link
                  href="/distributor/incoming"
                  className="text-sm font-semibold text-blue-800 hover:underline"
                >
                  View All →
                </Link>

              </div>

              <div className="overflow-x-auto">

                <table className="w-full min-w-[900px]">

                  <thead className="bg-slate-50">

                    <tr className="text-left text-xs uppercase tracking-wide text-slate-500">

                      <th className="px-6 py-4">
                        Return ID
                      </th>

                      <th className="px-6 py-4">
                        Batch
                      </th>

                      <th className="px-6 py-4">
                        Medicine
                      </th>

                      <th className="px-6 py-4">
                        Expected Qty
                      </th>

                      <th className="px-6 py-4">
                        Retailer
                      </th>

                      <th className="px-6 py-4">
                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y">

                    {incomingReturns.map((item) => (

                      <tr
                        key={item.id}
                        className="hover:bg-slate-50"
                      >

                        <td className="px-6 py-5 text-sm font-semibold text-slate-900">
                          {item.id}
                        </td>

                        <td className="px-6 py-5 text-sm font-semibold text-blue-800">
                          {item.batch}
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-700">
                          {item.medicine}
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-700">
                          {item.quantity} units
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-700">
                          {item.retailer}
                        </td>

                        <td className="px-6 py-5">

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              item.status === "PICKUP ASSIGNED"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {item.status}
                          </span>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </section>

            {/* Quick Actions */}
            <section className="mt-8">

              <h3 className="font-semibold text-slate-900">
                Quick Actions
              </h3>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">

                <Link
                  href="/distributor/incoming"
                  className="rounded-xl border bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow"
                >
                  <p className="font-semibold text-slate-900">
                    Review Incoming Returns
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Review batches waiting for receipt.
                  </p>
                </Link>

                <Link
                  href="/distributor/received"
                  className="rounded-xl border bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow"
                >
                  <p className="font-semibold text-slate-900">
                    Received Batches
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    View recently received batches.
                  </p>
                </Link>

                <Link
                  href="/distributor/disputes"
                  className="rounded-xl border bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow"
                >
                  <p className="font-semibold text-slate-900">
                    Review Disputes
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Investigate quantity discrepancies.
                  </p>
                </Link>

              </div>

            </section>

          </div>

        </main>

      </div>

    </div>
  );
}