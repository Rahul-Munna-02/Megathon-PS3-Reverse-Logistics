"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

type Batch = {
  batch_number: string;
  medicine_name: string;
  current_quantity: number;
  expiry_date: string;
  status: string;
};

function StatusBadge({ status }: { status: string }) {
  if (status === "EXPIRED") {
    return (
      <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
        EXPIRED
      </span>
    );
  }

  if (status === "EXPIRING_SOON") {
    return (
      <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
        EXPIRING SOON
      </span>
    );
  }

  if (status === "FRAUD_ALERT") {
    return (
      <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
        FRAUD ALERT
      </span>
    );
  }

  if (status === "RETURN_REQUESTED") {
    return (
      <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
        RETURN REQUESTED
      </span>
    );
  }

  if (status === "DESTROYED") {
    return (
      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
        DESTROYED
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
      ACTIVE
    </span>
  );
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function InventoryPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadBatches() {
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("batches")
          .select(
            "batch_number, medicine_name, current_quantity, expiry_date, status"
          )
          .order("expiry_date", { ascending: true });

        if (error) {
          setErrorMessage(`Failed to load inventory: ${error.message}`);
          return;
        }

        setBatches(data || []);
      } catch (error) {
        console.error(error);
        setErrorMessage("Something went wrong while loading inventory.");
      } finally {
        setLoading(false);
      }
    }

    loadBatches();
  }, []);

  const filteredBatches = batches.filter((item) => {
    const matchesSearch = item.batch_number
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All Statuses" ||
      item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* NAVBAR */}
      <header className="border-b border-slate-200 bg-white">
        <div className="flex h-16 items-center justify-between px-8">

          <div>
            <h1 className="text-xl font-bold tracking-tight">
              MEDTRACE
            </h1>

            <p className="text-xs text-slate-500">
              Track. Verify. Prevent Re-entry.
            </p>
          </div>

          <div className="flex items-center gap-3">
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

        {/* SIDEBAR */}
        <aside className="hidden min-h-[calc(100vh-64px)] w-60 border-r border-slate-200 bg-white md:block">

          <nav className="space-y-1 p-4">

            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Retailer
            </p>

            <Link
              href="/retailer/dashboard"
              className="block rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              Dashboard
            </Link>

            <Link
              href="/retailer/inventory"
              className="block rounded-lg bg-slate-100 px-3 py-2.5 text-sm font-semibold text-slate-900"
            >
              Inventory
            </Link>

            <Link
              href="/retailer/returns"
              className="block rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              Returns
            </Link>

            <Link
              href="/retailer/scan"
              className="block rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              Scan Batch
            </Link>

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

        {/* CONTENT */}
        <section className="min-w-0 flex-1 p-6 md:p-8">

          {/* HEADER */}
          <div className="mb-8">

            <h2 className="text-3xl font-bold tracking-tight">
              Inventory
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              View and monitor all medicine batches assigned to your pharmacy.
            </p>

          </div>

          {/* SEARCH + FILTER */}
          <div className="mb-5 flex flex-col gap-3 sm:flex-row">

            <input
              type="text"
              placeholder="Search batch number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-500 sm:max-w-md"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="EXPIRING_SOON">Expiring Soon</option>
              <option value="EXPIRED">Expired</option>
              <option value="RETURN_REQUESTED">
                Return Requested
              </option>
              <option value="FRAUD_ALERT">Fraud Alert</option>
              <option value="DESTROYED">Destroyed</option>
            </select>

          </div>

          {/* ERROR */}
          {errorMessage && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-800">
                {errorMessage}
              </p>
            </div>
          )}

          {/* TABLE */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="min-w-[900px] w-full text-left">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Batch Number
                    </th>

                    <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Medicine
                    </th>

                    <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Quantity
                    </th>

                    <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Expiry Date
                    </th>

                    <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {loading && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-12 text-center text-sm text-slate-500"
                      >
                        Loading inventory...
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    filteredBatches.map((item) => (

                      <tr
                        key={item.batch_number}
                        className="hover:bg-slate-50"
                      >

                        <td className="whitespace-nowrap px-5 py-5 text-sm font-semibold text-slate-900">
                          {item.batch_number}
                        </td>

                        <td className="whitespace-nowrap px-5 py-5 text-sm text-slate-600">
                          {item.medicine_name}
                        </td>

                        <td className="whitespace-nowrap px-5 py-5 text-sm text-slate-600">
                          {item.current_quantity}
                        </td>

                        <td className="whitespace-nowrap px-5 py-5 text-sm text-slate-600">
                          {formatDate(item.expiry_date)}
                        </td>

                        <td className="whitespace-nowrap px-5 py-5">
                          <StatusBadge status={item.status} />
                        </td>

                        <td className="whitespace-nowrap px-5 py-5">

                          <Link
                            href={`/retailer/inventory/${item.batch_number}`}
                            className="text-sm font-semibold text-slate-900 hover:underline"
                          >
                            View Details
                          </Link>

                        </td>

                      </tr>

                    ))}

                  {!loading && filteredBatches.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-12 text-center text-sm text-slate-500"
                      >
                        No batches found.
                      </td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}