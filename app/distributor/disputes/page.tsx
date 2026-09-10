import Link from "next/link";

const disputes = [
  {
    id: "DSP-2026-001",
    returnId: "RET-2026-001",
    batch: "MED-2026-001",
    medicine: "OncoSafe 500",
    expected: 100,
    received: 96,
    discrepancy: 4,
    status: "DISPUTED",
  },
  {
    id: "DSP-2026-002",
    returnId: "RET-2026-008",
    batch: "MED-2026-044",
    medicine: "CardioSafe 20",
    expected: 80,
    received: 75,
    discrepancy: 5,
    status: "DISPUTED",
  },
];

export default function DisputesPage() {
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

          <div className="mx-auto max-w-6xl">

            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Disputes
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review quantity discrepancies detected during batch receipt.
              </p>
            </div>

            {/* Summary */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">

              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Open Disputes
                </p>

                <p className="mt-2 text-3xl font-bold text-red-600">
                  2
                </p>
              </div>

              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Missing Units
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  9
                </p>
              </div>

              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Requires Attention
                </p>

                <p className="mt-2 text-3xl font-bold text-amber-600">
                  2
                </p>
              </div>

            </div>

            {/* Table */}
            <section className="mt-8 overflow-hidden rounded-xl border bg-white shadow-sm">

              <div className="border-b px-6 py-5">

                <h3 className="font-semibold text-slate-900">
                  Quantity Disputes
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Discrepancies found during distributor verification.
                </p>

              </div>

              <div className="overflow-x-auto">

                <table className="w-full min-w-[1100px]">

                  <thead className="bg-slate-50">

                    <tr className="text-left text-xs uppercase tracking-wide text-slate-500">

                      <th className="px-6 py-4">
                        Dispute ID
                      </th>

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
                        Expected
                      </th>

                      <th className="px-6 py-4">
                        Received
                      </th>

                      <th className="px-6 py-4">
                        Difference
                      </th>

                      <th className="px-6 py-4">
                        Status
                      </th>

                      <th className="px-6 py-4">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y">

                    {disputes.map((item) => (

                      <tr
                        key={item.id}
                        className="hover:bg-slate-50"
                      >

                        <td className="px-6 py-5 text-sm font-semibold text-slate-900">
                          {item.id}
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-700">
                          {item.returnId}
                        </td>

                        <td className="px-6 py-5 text-sm font-semibold text-blue-800">
                          {item.batch}
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-700">
                          {item.medicine}
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-700">
                          {item.expected}
                        </td>

                        <td className="px-6 py-5 text-sm font-semibold text-red-600">
                          {item.received}
                        </td>

                        <td className="px-6 py-5 text-sm font-bold text-red-600">
                          -{item.discrepancy}
                        </td>

                        <td className="px-6 py-5">

                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                            {item.status}
                          </span>

                        </td>

                        <td className="px-6 py-5">

                          <Link
                            href={`/distributor/disputes/${item.id}`}
                            className="text-sm font-semibold text-blue-800 hover:underline"
                          >
                            View Details
                          </Link>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </section>

          </div>

        </main>

      </div>

    </div>
  );
}