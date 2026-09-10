const batches = [
  {
    batch: "MED-2026-001",
    medicine: "OncoSafe 500",
    quantity: 100,
    expiry: "30 Jun 2026",
    status: "EXPIRED",
  },
  {
    batch: "MED-2026-002",
    medicine: "PharmaX 250",
    quantity: 250,
    expiry: "14 Oct 2026",
    status: "ACTIVE",
  },
  {
    batch: "MED-2026-003",
    medicine: "MedPlus 100",
    quantity: 150,
    expiry: "20 Sep 2026",
    status: "EXPIRING SOON",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navbar */}
      <header className="border-b border-slate-200 bg-white">
        <div className="flex h-16 items-center justify-between px-8">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              MEDTRACE
            </h1>
            <p className="text-xs text-slate-500">
              Track. Verify. Prevent Re-entry.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">
              Thanusha
            </span>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
              T
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden min-h-[calc(100vh-64px)] w-60 border-r border-slate-200 bg-white md:block">
          <nav className="space-y-1 p-4">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Retailer
            </p>

            <a
              href="#"
              className="block rounded-lg bg-slate-100 px-3 py-2.5 text-sm font-semibold text-slate-900"
            >
              Dashboard
            </a>

            <a
              href="#"
              className="block rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              Inventory
            </a>

            <a
              href="#"
              className="block rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              Returns
            </a>

            <a
              href="#"
              className="block rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              Scan Batch
            </a>

            <div className="my-6 border-t border-slate-100" />

            <a
              href="#"
              className="block rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              Settings
            </a>

            <a
              href="#"
              className="block rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              Logout
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <section className="flex-1 p-6 md:p-8">
          {/* Page heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Retailer Dashboard
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Monitor inventory and initiate compliant medicine returns.
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Total Batches</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                124
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Expiring Soon</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                12
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Expired</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                7
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Pending Returns</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                5
              </p>
            </div>
          </div>

          {/* Inventory */}
          <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <h3 className="font-semibold text-slate-900">
                  Recent Batches
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Monitor medicine inventory and expiry status.
                </p>
              </div>

              <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
                View Inventory
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Batch Number
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Medicine
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Quantity
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Expiry
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {batches.map((item) => (
                    <tr
                      key={item.batch}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                        {item.batch}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {item.medicine}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {item.quantity}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {item.expiry}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            item.status === "EXPIRED"
                              ? "bg-red-50 text-red-700"
                              : item.status === "EXPIRING SOON"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-green-50 text-green-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <button className="text-sm font-medium text-slate-900 hover:underline">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Demo alert */}
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm font-semibold text-amber-900">
              Action Required
            </p>

            <p className="mt-1 text-sm text-amber-800">
              MED-2026-001 has expired and should enter the reverse
              logistics workflow.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}