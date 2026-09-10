"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

type ScanResult = {
  result: "VALID" | "WARNING" | "EXPIRED" | "FRAUD" | "UNKNOWN";
  batch_number?: string;
  medicine_name?: string;
  message?: string;
  status?: string;
};

export default function RetailerScanPage() {
  const [batchNumber, setBatchNumber] = useState("MED-2026-001");
  const [location, setLocation] = useState("Apollo Pharmacy");
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleScan() {
    if (!batchNumber.trim()) {
      setErrorMessage("Please enter a batch number.");
      return;
    }

    setLoading(true);
    setScanResult(null);
    setErrorMessage("");

    try {
      const supabase = createClient();

      const { data, error } = await supabase.rpc(
        "check_batch_reentry",
        {
          p_batch_number: batchNumber.trim(),
          p_location: location.trim() || "Unknown",
        }
      );

      if (error) {
        setErrorMessage(`Scan failed: ${error.message}`);
        return;
      }

      if (!data?.success) {
        setErrorMessage(
          `Scan failed: ${data?.error || "Unable to verify batch."}`
        );
        return;
      }

      setScanResult(data.data);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "Something went wrong while scanning the batch."
      );
    } finally {
      setLoading(false);
    }
  }

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
          <span>Retailer</span>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 font-semibold">
            R
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
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
              className="block rounded-lg px-4 py-3 text-sm text-slate-600 hover:bg-slate-100"
            >
              Returns
            </Link>

            <Link
              href="/retailer/scan"
              className="block rounded-lg bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-900"
            >
              Scan Batch
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="w-full px-6 py-8 md:px-10">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold text-slate-900">
              Scan Batch
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Verify a medicine batch before accepting or distributing it.
            </p>

            {/* Scan Form */}
            <section className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900">
                Batch Verification
              </h3>

              <label className="mt-6 block text-sm font-medium text-slate-700">
                Batch Number
              </label>

              <input
                type="text"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder="Enter batch number..."
                disabled={loading}
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              />

              <label className="mt-5 block text-sm font-medium text-slate-700">
                Scan Location
              </label>

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={loading}
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              />

              <button
                type="button"
                onClick={handleScan}
                disabled={loading}
                className="mt-6 w-full rounded-lg bg-blue-900 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Checking Batch..."
                  : "Scan / Verify Batch"}
              </button>
            </section>

            {/* Error */}
            {errorMessage && (
              <section className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6">
                <p className="font-semibold text-red-800">
                  {errorMessage}
                </p>
              </section>
            )}

            {/* Result */}
            {scanResult && (
              <section className="mt-6">
                {scanResult.result === "FRAUD" && (
                  <div className="rounded-xl border-2 border-red-300 bg-red-50 p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">🚨</div>

                      <div>
                        <p className="text-sm font-bold tracking-wide text-red-700">
                          FRAUD / RE-ENTRY ALERT
                        </p>

                        <h3 className="mt-2 text-2xl font-bold text-red-900">
                          Destroyed Batch Re-entry Detected
                        </h3>

                        <p className="mt-3 text-sm text-red-800">
                          {scanResult.message}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-lg bg-white p-4">
                        <p className="text-xs text-slate-500">
                          Batch Number
                        </p>

                        <p className="mt-1 font-semibold text-slate-900">
                          {scanResult.batch_number}
                        </p>
                      </div>

                      <div className="rounded-lg bg-white p-4">
                        <p className="text-xs text-slate-500">
                          Medicine
                        </p>

                        <p className="mt-1 font-semibold text-slate-900">
                          {scanResult.medicine_name}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 rounded-lg border border-red-200 bg-red-100 p-4">
                      <p className="font-semibold text-red-900">
                        DO NOT ACCEPT THIS BATCH
                      </p>

                      <p className="mt-1 text-sm text-red-800">
                        Do not distribute, accept, or re-enter this batch
                        into normal inventory.
                      </p>
                    </div>
                  </div>
                )}

                {scanResult.result === "VALID" && (
                  <div className="rounded-xl border border-green-200 bg-green-50 p-6">
                    <p className="text-sm font-bold text-green-700">
                      VALID BATCH
                    </p>

                    <h3 className="mt-2 text-2xl font-bold text-green-900">
                      Batch Verified
                    </h3>

                    <p className="mt-3 text-sm text-green-800">
                      {scanResult.message ||
                        "This batch is valid for normal processing."}
                    </p>

                    {scanResult.batch_number && (
                      <p className="mt-4 font-semibold text-slate-900">
                        {scanResult.batch_number}
                      </p>
                    )}
                  </div>
                )}

                {scanResult.result === "WARNING" && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
                    <p className="text-sm font-bold text-amber-700">
                      WARNING
                    </p>

                    <h3 className="mt-2 text-2xl font-bold text-amber-900">
                      Batch Requires Attention
                    </h3>

                    <p className="mt-3 text-sm text-amber-800">
                      {scanResult.message}
                    </p>
                  </div>
                )}

                {scanResult.result === "EXPIRED" && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
                    <p className="text-sm font-bold text-amber-700">
                      EXPIRED
                    </p>

                    <h3 className="mt-2 text-2xl font-bold text-amber-900">
                      Batch Is Expired
                    </h3>

                    <p className="mt-3 text-sm text-amber-800">
                      {scanResult.message}
                    </p>
                  </div>
                )}

                {scanResult.result === "UNKNOWN" && (
                  <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <p className="text-sm font-bold text-slate-600">
                      UNKNOWN BATCH
                    </p>

                    <h3 className="mt-2 text-2xl font-bold text-slate-900">
                      Batch Not Found
                    </h3>

                    <p className="mt-3 text-sm text-slate-600">
                      {scanResult.message ||
                        "No matching batch was found."}
                    </p>
                  </div>
                )}
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}