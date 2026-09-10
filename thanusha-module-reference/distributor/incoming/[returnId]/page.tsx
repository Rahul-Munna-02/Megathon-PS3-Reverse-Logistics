"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

const BATCH_NUMBER = "MED-2026-001";
const EXPECTED_QUANTITY = 100;

export default function ReceiveBatchPage() {
  const [receivedQuantity, setReceivedQuantity] = useState("100");
  const [verified, setVerified] = useState(false);
  const [disputed, setDisputed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleVerify() {
    const received = Number(receivedQuantity);

    if (!Number.isInteger(received) || received < 0) {
      setMessage("Please enter a valid received quantity.");
      return;
    }

    setLoading(true);
    setMessage("");
    setVerified(false);
    setDisputed(false);

    try {
      const supabase = createClient();

      const { data, error } = await supabase.rpc(
        "confirm_distributor_receipt",
        {
          p_batch_number: BATCH_NUMBER,
          p_received_quantity: received,
        }
      );

      if (error) {
        setMessage(`Verification failed: ${error.message}`);
        return;
      }

      if (!data?.success) {
        setMessage(
          `Verification failed: ${
            data?.error || "Unknown backend error"
          }`
        );
        return;
      }

      // Backend detected a quantity mismatch
      if (received !== EXPECTED_QUANTITY) {
        setDisputed(true);
        setMessage(
          `Quantity discrepancy detected. Expected ${EXPECTED_QUANTITY}, received ${received}.`
        );
        return;
      }

      // Backend verified the quantity
      setVerified(true);
      setMessage("Batch received successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong while verifying the batch.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
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

      <div className="mx-auto max-w-4xl px-6 py-10">
        <Link
          href="/distributor/incoming"
          className="text-sm font-medium text-blue-800 hover:underline"
        >
          ← Back to Incoming Returns
        </Link>

        <h2 className="mt-6 text-2xl font-bold text-slate-900">
          Receive Batch
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Verify the physical quantity received against the return request.
        </p>

        {/* Batch Information */}
        <section className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
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
                {BATCH_NUMBER}
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
                Expected Quantity
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {EXPECTED_QUANTITY}
              </p>

              <p className="text-xs text-slate-500">
                units
              </p>
            </div>
          </div>
        </section>

        {/* Quantity Verification */}
        <section className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">
            Quantity Verification
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Enter the actual quantity physically received.
          </p>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700">
              Received Quantity
            </label>

            <input
              type="number"
              min="0"
              value={receivedQuantity}
              onChange={(e) => {
                setReceivedQuantity(e.target.value);
                setVerified(false);
                setDisputed(false);
                setMessage("");
              }}
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              disabled={loading}
            />
          </div>

          <div className="mt-6 rounded-lg bg-slate-50 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">
                Expected
              </span>

              <span className="font-semibold">
                {EXPECTED_QUANTITY} units
              </span>
            </div>

            <div className="mt-2 flex justify-between text-sm">
              <span className="text-slate-500">
                Received
              </span>

              <span className="font-semibold">
                {receivedQuantity || 0} units
              </span>
            </div>

            <div className="mt-2 flex justify-between border-t pt-2 text-sm">
              <span className="text-slate-500">
                Difference
              </span>

              <span
                className={`font-semibold ${
                  EXPECTED_QUANTITY -
                    Number(receivedQuantity || 0) !==
                  0
                    ? "text-red-700"
                    : "text-slate-900"
                }`}
              >
                {EXPECTED_QUANTITY -
                  Number(receivedQuantity || 0)}{" "}
                units
              </span>
            </div>
          </div>

          {!verified && !disputed && (
            <button
              onClick={handleVerify}
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-blue-900 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify Quantity"}
            </button>
          )}

          {message && !disputed && !verified && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="font-semibold text-red-800">
                Verification Failed
              </p>

              <p className="mt-1 text-sm text-red-700">
                {message}
              </p>
            </div>
          )}

          {disputed && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-5">
              <p className="font-semibold text-red-800">
                QUANTITY DISCREPANCY DETECTED
              </p>

              <p className="mt-1 text-sm text-red-700">
                Expected {EXPECTED_QUANTITY} units, but received{" "}
                {receivedQuantity} units.
              </p>

              <p className="mt-2 text-sm font-medium text-red-700">
                The backend has marked this return as disputed.
              </p>
            </div>
          )}

          {verified && (
            <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-5">
              <p className="font-semibold text-green-800">
                ✓ Quantity Verified
              </p>

              <p className="mt-1 text-sm text-green-700">
                Batch received successfully. Expected and received
                quantities match.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}