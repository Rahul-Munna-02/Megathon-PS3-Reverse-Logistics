"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

type ReturnRecord = {
  id: string;
  batch_id: string;
  expected_quantity: number;
  status: string;
  created_at: string;
  batches:
    | {
        batch_number: string;
        medicine_name: string;
      }
    | {
        batch_number: string;
        medicine_name: string;
      }[]
    | null;
};

function StatusBadge({ status }: { status: string }) {
  if (status === "REQUESTED") {
    return (
      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
        RETURN REQUESTED
      </span>
    );
  }

  if (status === "PICKUP_ASSIGNED") {
    return (
      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
        PICKUP ASSIGNED
      </span>
    );
  }

  if (status === "RECEIVED") {
    return (
      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        RECEIVED
      </span>
    );
  }

  if (status === "DISPUTED") {
    return (
      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
        DISPUTED
      </span>
    );
  }

  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
      {status}
    </span>
  );
}

function getBatchInfo(
  batches: ReturnRecord["batches"]
): { batch_number: string; medicine_name: string } | null {
  if (!batches) {
    return null;
  }

  if (Array.isArray(batches)) {
    return batches[0] || null;
  }

  return batches;
}

export default function IncomingReturnsPage() {
  const [returns, setReturns] = useState<ReturnRecord[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadReturns() {
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("returns")
          .select(`
            id,
            batch_id,
            expected_quantity,
            status,
            created_at,
            batches (
              batch_number,
              medicine_name
            )
          `)
          .order("created_at", { ascending: false });

        if (error) {
          setErrorMessage(
            `Failed to load incoming returns: ${error.message}`
          );
          return;
        }

        setReturns((data as ReturnRecord[]) || []);
      } catch (error) {
        console.error(error);
        setErrorMessage(
          "Something went wrong while loading incoming returns."
        );
      } finally {
        setLoading(false);
      }
    }

    loadReturns();
  }, []);

  const filteredReturns = returns.filter((item) => {
    const batch = getBatchInfo(item.batches);

    const matchesSearch =
      batch?.batch_number
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All Statuses" ||
      item.status === statusFilter;

    return Boolean(matchesSearch) && matchesStatus;
  });

  const awaitingActionCount = returns.filter(
    (item) =>
      item.status === "REQUESTED" ||
      item.status === "PICKUP_ASSIGNED"
  ).length;

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
              className="block rounded-lg bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-900"
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
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Incoming Returns
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Review return requests received from retailers.
                </p>
              </div>

              <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800">
                {awaitingActionCount} returns awaiting action
              </div>

            </div>

            {/* Filters */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <input
                type="text"
                placeholder="Search batch number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 sm:max-w-sm"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-700"
              >
                <option value="All Statuses">
                  All Statuses
                </option>

                <option value="REQUESTED">
                  RETURN REQUESTED
                </option>

                <option value="PICKUP_ASSIGNED">
                  PICKUP ASSIGNED
                </option>

                <option value="RECEIVED">
                  RECEIVED
                </option>

                <option value="DISPUTED">
                  DISPUTED
                </option>

              </select>

            </div>

            {/* Error */}
            {errorMessage && (
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-800">
                  {errorMessage}
                </p>
              </div>
            )}

            {/* Table */}
            <div className="mt-6 overflow-hidden rounded-xl border bg-white shadow-sm">

              <div className="border-b px-6 py-5">

                <h3 className="font-semibold text-slate-900">
                  Return Requests
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Select a return to verify and receive the batch.
                </p>

              </div>

              <div className="overflow-x-auto">

                <table className="w-full min-w-[1000px]">

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
                        Status
                      </th>

                      <th className="px-6 py-4">
                        Created
                      </th>

                      <th className="px-6 py-4">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y">

                    {loading && (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-6 py-12 text-center text-sm text-slate-500"
                        >
                          Loading incoming returns...
                        </td>
                      </tr>
                    )}

                    {!loading &&
                      filteredReturns.map((item) => {
                        const batch = getBatchInfo(item.batches);

                        return (
                          <tr
                            key={item.id}
                            className="hover:bg-slate-50"
                          >

                            <td className="px-6 py-5 text-sm font-semibold text-slate-900">
                              {item.id}
                            </td>

                            <td className="px-6 py-5 text-sm font-semibold text-blue-800">
                              {batch?.batch_number || "Unknown"}
                            </td>

                            <td className="px-6 py-5 text-sm text-slate-700">
                              {batch?.medicine_name || "Unknown"}
                            </td>

                            <td className="px-6 py-5 text-sm text-slate-700">
                              {item.expected_quantity} units
                            </td>

                            <td className="px-6 py-5">
                              <StatusBadge status={item.status} />
                            </td>

                            <td className="px-6 py-5 text-sm text-slate-600">
                              {new Date(
                                item.created_at
                              ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>

                            <td className="px-6 py-5">

                              <Link
                                href={`/distributor/incoming/${item.id}`}
                                className="rounded-lg bg-blue-900 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800"
                              >
                                View Return
                              </Link>

                            </td>

                          </tr>
                        );
                      })}

                    {!loading &&
                      filteredReturns.length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-6 py-12 text-center text-sm text-slate-500"
                          >
                            No incoming returns found.
                          </td>
                        </tr>
                      )}

                  </tbody>

                </table>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}