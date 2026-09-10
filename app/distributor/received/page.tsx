"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

type ReceivedReturn = {
  id: string;
  batch_id: string;
  expected_quantity: number;
  received_quantity: number | null;
  status: string;
  created_at: string;
  batches:
    | {
        batch_number: string;
        medicine_name: string;
        status: string;
      }
    | {
        batch_number: string;
        medicine_name: string;
        status: string;
      }[]
    | null;
};

function getBatchInfo(batches: ReceivedReturn["batches"]) {
  if (!batches) return null;
  if (Array.isArray(batches)) return batches[0] || null;
  return batches;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "RECEIVED" || status === "RESOLVED" || status === "COMPLETED") {
    return (
      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        {status}
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

export default function ReceivedPage() {
  const [receivedReturns, setReceivedReturns] = useState<ReceivedReturn[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [handoffLoading, setHandoffLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadReceivedReturns() {
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("returns")
          .select(`
            id,
            batch_id,
            expected_quantity,
            received_quantity,
            status,
            created_at,
            batches (
              batch_number,
              medicine_name,
              status
            )
          `)
          .order("created_at", { ascending: false });

        if (error) {
          setErrorMessage(
            `Failed to load received history: ${error.message}`
          );
          return;
        }

        // Received History is an audit/history view.
        // Keep any return where the distributor actually recorded
        // a received quantity, regardless of its later status.
        const received = ((data || []) as ReceivedReturn[]).filter(
          (item) => item.received_quantity !== null
        );

        setReceivedReturns(received);
      } catch (error) {
        console.error(error);
        setErrorMessage(
          "Something went wrong while loading received history."
        );
      } finally {
        setLoading(false);
      }
    }

    loadReceivedReturns();
  }, []);

  const demoBatch = receivedReturns.find((item) => {
    const batch = getBatchInfo(item.batches);
    return batch?.batch_number === "MED-2026-001";
  });

  const demoBatchInfo = demoBatch
    ? getBatchInfo(demoBatch.batches)
    : null;

  const demoBatchStatus = demoBatchInfo?.status || "";

  const canSendToManufacturer =
    demoBatchStatus === "DISTRIBUTOR_RECEIVED";

  async function sendToManufacturer() {
    if (!canSendToManufacturer) {
      setErrorMessage(
        `Manufacturer handoff is not available. Current batch status: ${
          demoBatchStatus || "UNKNOWN"
        }`
      );
      return;
    }

    setHandoffLoading(true);
    setMessage("");
    setErrorMessage("");

    try {
      const supabase = createClient();

      const { data, error } = await supabase.rpc(
        "mark_manufacturer_received",
        {
          p_batch_number: "MED-2026-001",
        }
      );

      if (error) {
        setErrorMessage(`Failed: ${error.message}`);
        return;
      }

      if (!data?.success) {
        setErrorMessage(
          `Failed: ${data?.error || "Unknown backend error"}`
        );
        return;
      }

      setMessage("✓ Batch received by manufacturer.");
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "Something went wrong while sending the batch."
      );
    } finally {
      setHandoffLoading(false);
    }
  }

  const filteredReturns = receivedReturns.filter((item) => {
    const batch = getBatchInfo(item.batches);
    const query = search.toLowerCase();

    return (
      batch?.batch_number?.toLowerCase().includes(query) ||
      batch?.medicine_name?.toLowerCase().includes(query)
    );
  });

  const totalUnitsReceived = receivedReturns.reduce(
    (total, item) =>
      total + (item.received_quantity ?? 0),
    0
  );

  const verifiedCount = receivedReturns.filter(
    (item) =>
      item.received_quantity !== null &&
      item.received_quantity === item.expected_quantity
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
              className="block rounded-lg bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-900"
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
                Received Batches
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                View batches successfully received and quantity verified.
              </p>
            </div>

            {/* Manufacturer Handoff */}
            <section className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900">
                Manufacturer Handoff
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Send the verified demo batch to the manufacturer.
              </p>

              <div className="mt-4 flex items-center gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    MED-2026-001
                  </p>

                  <p className="text-xs text-slate-500">
                    OncoSafe 500 · 100 units
                  </p>

                  {demoBatchStatus && (
                    <p className="mt-1 text-xs text-slate-500">
                      Current status:{" "}
                      <span className="font-semibold">
                        {demoBatchStatus}
                      </span>
                    </p>
                  )}
                </div>

                {canSendToManufacturer ? (
                  <button
                    type="button"
                    onClick={sendToManufacturer}
                    disabled={handoffLoading}
                    className="ml-auto rounded-lg bg-blue-900 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {handoffLoading
                      ? "Sending..."
                      : "Send to Manufacturer"}
                  </button>
                ) : (
                  <div className="ml-auto rounded-lg border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-600">
                    Handoff already processed
                  </div>
                )}
              </div>

              {message && (
                <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
                  <p className="text-sm font-semibold text-green-800">
                    {message}
                  </p>
                </div>
              )}

              {errorMessage && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-semibold text-red-800">
                    {errorMessage}
                  </p>
                </div>
              )}
            </section>

            {/* Summary */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Received Batches
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {receivedReturns.length}
                </p>
              </div>

              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Quantity Verified
                </p>

                <p className="mt-2 text-3xl font-bold text-green-700">
                  {verifiedCount}
                </p>
              </div>

              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Total Units Received
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {totalUnitsReceived}
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="mt-8">
              <input
                type="text"
                placeholder="Search batch number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-sm rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Table */}
            <section className="mt-6 overflow-hidden rounded-xl border bg-white shadow-sm">
              <div className="border-b px-6 py-5">
                <h3 className="font-semibold text-slate-900">
                  Received History
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Verified distributor handoffs.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-6 py-4">Batch</th>
                      <th className="px-6 py-4">Medicine</th>
                      <th className="px-6 py-4">Expected</th>
                      <th className="px-6 py-4">Received</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {loading && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-12 text-center text-sm text-slate-500"
                        >
                          Loading received history...
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
                            <td className="px-6 py-5 text-sm font-semibold text-blue-800">
                              {batch?.batch_number || "Unknown"}
                            </td>

                            <td className="px-6 py-5 text-sm text-slate-700">
                              {batch?.medicine_name || "Unknown"}
                            </td>

                            <td className="px-6 py-5 text-sm text-slate-700">
                              {item.expected_quantity} units
                            </td>

                            <td className="px-6 py-5 text-sm font-semibold text-green-700">
                              {item.received_quantity ?? 0} units
                            </td>

                            <td className="px-6 py-5 text-sm text-slate-500">
                              {new Date(
                                item.created_at
                              ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>

                            <td className="px-6 py-5">
                              <StatusBadge status={item.status} />
                            </td>
                          </tr>
                        );
                      })}

                    {!loading &&
                      filteredReturns.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-12 text-center text-sm text-slate-500"
                          >
                            No received batches found.
                          </td>
                        </tr>
                      )}
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