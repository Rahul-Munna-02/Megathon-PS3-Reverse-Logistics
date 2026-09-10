"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

type ReturnRecord = {
  id: string;
  batch_id: string;
  expected_quantity: number;
  status: string;
  return_reason: string | null;
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

  if (status === "RESOLVED") {
    return (
      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        RESOLVED
      </span>
    );
  }

  if (status === "COMPLETED") {
    return (
      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        COMPLETED
      </span>
    );
  }

  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
      {status}
    </span>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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

export default function ReturnsPage() {
  const [returns, setReturns] = useState<ReturnRecord[]>([]);
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
            return_reason,
            created_at,
            batches (
              batch_number,
              medicine_name
            )
          `)
          .order("created_at", { ascending: false });

        if (error) {
          setErrorMessage(
            `Failed to load returns: ${error.message}`
          );
          return;
        }

        setReturns((data as ReturnRecord[]) || []);
      } catch (error) {
        console.error(error);
        setErrorMessage(
          "Something went wrong while loading returns."
        );
      } finally {
        setLoading(false);
      }
    }

    loadReturns();
  }, []);

  const requestedCount = returns.filter(
    (item) => item.status === "REQUESTED"
  ).length;

  const pickupAssignedCount = returns.filter(
    (item) => item.status === "PICKUP_ASSIGNED"
  ).length;

  const completedCount = returns.filter(
    (item) => item.status === "COMPLETED"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* NAVBAR */}
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

          <span>Retailer</span>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 font-semibold">
            R
          </div>

        </div>

      </nav>

      <div className="flex">

        {/* SIDEBAR */}
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

        {/* MAIN CONTENT */}
        <main className="w-full px-6 py-8 md:px-10">

          <div className="mx-auto max-w-6xl">

            {/* PAGE HEADER */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Returns
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Track medicine batches moving through reverse logistics.
                </p>
              </div>

              <Link
                href="/retailer/returns/create"
                className="rounded-lg bg-blue-900 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-blue-800"
              >
                + Create Return
              </Link>

            </div>

            {/* SUMMARY CARDS */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Total Returns
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {returns.length}
                </p>
              </div>

              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Requested
                </p>

                <p className="mt-2 text-2xl font-bold text-blue-700">
                  {requestedCount}
                </p>
              </div>

              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Pickup Assigned
                </p>

                <p className="mt-2 text-2xl font-bold text-amber-600">
                  {pickupAssignedCount}
                </p>
              </div>

              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Completed
                </p>

                <p className="mt-2 text-2xl font-bold text-green-700">
                  {completedCount}
                </p>
              </div>

            </div>

            {/* ERROR */}
            {errorMessage && (
              <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-800">
                  {errorMessage}
                </p>
              </div>
            )}

            {/* TABLE */}
            <div className="mt-8 overflow-hidden rounded-xl border bg-white shadow-sm">

              <div className="border-b px-6 py-5">

                <h3 className="font-semibold text-slate-900">
                  Return Requests
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Recent reverse-logistics activity
                </p>

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
                        Quantity
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
                          Loading returns...
                        </td>
                      </tr>
                    )}

                    {!loading &&
                      returns.map((item) => {
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
                              {formatDate(item.created_at)}
                            </td>

                            <td className="px-6 py-5">

                              <Link
                                href={`/retailer/returns/${item.id}`}
                                className="text-sm font-semibold text-blue-800 hover:underline"
                              >
                                View Details
                              </Link>

                            </td>

                          </tr>
                        );
                      })}

                    {!loading && returns.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-6 py-12 text-center text-sm text-slate-500"
                        >
                          No return requests found.
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