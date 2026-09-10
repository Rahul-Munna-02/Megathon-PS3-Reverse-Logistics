"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

type Batch = {
  id: string;
  batch_number: string;
  medicine_name: string;
  current_quantity: number;
  expiry_date: string;
  status: string;
};

type ReturnRecord = {
  id: string;
  status: string;
  batch_id: string;
  expected_quantity: number;
  received_quantity: number | null;
  created_at: string;
  batches:
    | {
        batch_number: string;
        medicine_name: string;
      }
    | null;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function displayStatus(status: string) {
  return status.replaceAll("_", " ");
}

function statusClasses(status: string) {
  if (status === "EXPIRED") {
    return "bg-red-50 text-red-700";
  }

  if (status === "EXPIRING_SOON") {
    return "bg-amber-50 text-amber-700";
  }

  if (status === "FRAUD_ALERT") {
    return "bg-red-50 text-red-700";
  }

  if (status === "DESTROYED") {
    return "bg-slate-100 text-slate-700";
  }

  if (status === "RETURN_REQUESTED") {
    return "bg-blue-50 text-blue-700";
  }

  if (status === "DISTRIBUTOR_RECEIVED") {
    return "bg-indigo-50 text-indigo-700";
  }

  return "bg-green-50 text-green-700";
}

export default function RetailerDashboard() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [returns, setReturns] = useState<ReturnRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      setErrorMessage("");

      try {
        const supabase = createClient();

        // Load real inventory.
        const { data: batchData, error: batchError } =
          await supabase
            .from("batches")
            .select(
              "id, batch_number, medicine_name, current_quantity, expiry_date, status"
            )
            .order("expiry_date", { ascending: true });

        if (batchError) {
          setErrorMessage(
            `Could not load inventory: ${batchError.message}`
          );
          return;
        }

        // Load real retailer returns.
        const { data: returnData, error: returnError } =
          await supabase
            .from("returns")
            .select(
              `
                id,
                status,
                batch_id,
                expected_quantity,
                received_quantity,
                created_at,
                batches (
                  batch_number,
                  medicine_name
                )
              `
            )
            .order("created_at", { ascending: false });

        if (returnError) {
          setErrorMessage(
            `Could not load returns: ${returnError.message}`
          );
          return;
        }

        setBatches(batchData || []);
        setReturns((returnData as ReturnRecord[]) || []);
      } catch (error) {
        console.error(error);
        setErrorMessage(
          "Something went wrong while loading the dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const totalBatches = batches.length;

  const expiringSoon = batches.filter(
    (batch) => batch.status === "EXPIRING_SOON"
  ).length;

  const expired = batches.filter(
    (batch) => batch.status === "EXPIRED"
  ).length;

  const pendingReturns = returns.filter((item) =>
    ["REQUESTED", "PICKUP_ASSIGNED", "DISPUTED"].includes(
      item.status
    )
  ).length;

  const recentBatches = batches.slice(0, 5);

  const expiredBatches = batches.filter(
    (batch) => batch.status === "EXPIRED"
  );

  const latestExpiredBatch = expiredBatches[0];

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
              className="block rounded-lg bg-slate-100 px-3 py-2.5 text-sm font-semibold text-slate-900"
            >
              Dashboard
            </Link>

            <Link
              href="/retailer/inventory"
              className="block rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
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

            <Link
              href="#"
              className="block rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              Settings
            </Link>

            <Link
              href="#"
              className="block rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              Logout
            </Link>

          </nav>

        </aside>

        {/* MAIN CONTENT */}
        <section className="min-w-0 flex-1 p-6 md:p-8">

          {/* PAGE HEADER */}
          <div className="mb-8">

            <h2 className="text-3xl font-bold tracking-tight">
              Retailer Dashboard
            </h2>

            <p className="mt-2 text-slate-500">
              Monitor inventory and initiate compliant medicine returns.
            </p>

          </div>

          {/* LOADING */}
          {loading && (
            <div className="space-y-6">

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-32 animate-pulse rounded-xl bg-slate-200"
                  />
                ))}

              </div>

              <div className="h-80 animate-pulse rounded-xl bg-slate-200" />

            </div>
          )}

          {/* ERROR */}
          {!loading && errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5">

              <p className="font-semibold text-red-800">
                Unable to load dashboard
              </p>

              <p className="mt-1 text-sm text-red-700">
                {errorMessage}
              </p>

            </div>
          )}

          {/* DASHBOARD */}
          {!loading && !errorMessage && (
            <>

              {/* KPI CARDS */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                  <p className="text-sm text-slate-500">
                    Total Batches
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {totalBatches}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Active inventory records
                  </p>

                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                  <p className="text-sm text-slate-500">
                    Expiring Soon
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {expiringSoon}
                  </p>

                  <p className="mt-1 text-xs text-amber-600">
                    Requires monitoring
                  </p>

                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                  <p className="text-sm text-slate-500">
                    Expired
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {expired}
                  </p>

                  <p className="mt-1 text-xs text-red-600">
                    Requires action
                  </p>

                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                  <p className="text-sm text-slate-500">
                    Pending Returns
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {pendingReturns}
                  </p>

                  <p className="mt-1 text-xs text-blue-600">
                    Reverse logistics
                  </p>

                </div>

              </div>

              {/* RECENT BATCHES */}
              <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center">

                  <div>

                    <h3 className="text-lg font-semibold">
                      Recent Batches
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Monitor medicine inventory and expiry status.
                    </p>

                  </div>

                  <Link
                    href="/retailer/inventory"
                    className="rounded-lg bg-slate-900 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-slate-800"
                  >
                    View Inventory
                  </Link>

                </div>

                {recentBatches.length === 0 ? (

                  <div className="p-10 text-center">

                    <p className="font-medium text-slate-700">
                      No batches found
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Inventory records will appear here.
                    </p>

                  </div>

                ) : (

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
                            Expiry
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

                        {recentBatches.map((item) => (

                          <tr
                            key={item.id}
                            className="hover:bg-slate-50"
                          >

                            <td className="whitespace-nowrap px-5 py-5 text-sm font-semibold">
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

                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(
                                  item.status
                                )}`}
                              >
                                {displayStatus(item.status)}
                              </span>

                            </td>

                            <td className="whitespace-nowrap px-5 py-5">

                              <Link
                                href={`/retailer/inventory/${encodeURIComponent(
                                  item.batch_number
                                )}`}
                                className="text-sm font-semibold text-slate-900 hover:underline"
                              >
                                View
                              </Link>

                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>

                )}

              </div>

              {/* ACTION REQUIRED */}
              {latestExpiredBatch && (
                <div className="mt-6 flex flex-col justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center">

                  <div>

                    <p className="text-sm font-semibold text-amber-900">
                      Action Required
                    </p>

                    <p className="mt-1 text-sm text-amber-800">
                      {latestExpiredBatch.batch_number} (
                      {latestExpiredBatch.medicine_name}) has expired
                      and should enter the reverse logistics workflow.
                    </p>

                  </div>

                  <div className="flex flex-wrap gap-3">

                    <Link
                      href={`/retailer/inventory/${encodeURIComponent(
                        latestExpiredBatch.batch_number
                      )}`}
                      className="rounded-lg border border-amber-300 bg-white px-4 py-2.5 text-sm font-semibold text-amber-900 hover:bg-amber-100"
                    >
                      View Batch
                    </Link>

                    <Link
                      href={`/retailer/returns/create?batch=${encodeURIComponent(
                        latestExpiredBatch.batch_number
                      )}`}
                      className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Create Return
                    </Link>

                  </div>

                </div>
              )}

            </>
          )}

        </section>

      </div>

    </main>
  );
}