"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";

const RETAILER_ID = "22222222-2222-2222-2222-222222222222";
const DISTRIBUTOR_ID = "33333333-3333-3333-3333-333333333333";

type Batch = {
  id: string;
  batch_number: string;
  medicine_name: string;
  current_quantity: number;
  expiry_date: string;
  status: string;
};

export default function CreateReturnPage() {
  const searchParams = useSearchParams();

  const batchFromUrl = searchParams.get("batch");

  const [batch, setBatch] = useState<Batch | null>(null);
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("Expired");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadBatch() {
      if (!batchFromUrl) {
        setMessage("No batch number was provided.");
        setLoading(false);
        return;
      }

      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("batches")
          .select(
            "id, batch_number, medicine_name, current_quantity, expiry_date, status"
          )
          .eq("batch_number", batchFromUrl)
          .single();

        if (error) {
          setMessage(`Could not load batch: ${error.message}`);
          return;
        }

        if (!data) {
          setMessage("Batch not found.");
          return;
        }

        setBatch(data);
        setQuantity(String(data.current_quantity));
      } catch (error) {
        console.error(error);
        setMessage("Something went wrong while loading the batch.");
      } finally {
        setLoading(false);
      }
    }

    loadBatch();
  }, [batchFromUrl]);

  async function handleSubmit() {
    if (!batch) {
      setMessage("Batch information is not available.");
      return;
    }

    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty <= 0) {
      setMessage("Please enter a valid quantity.");
      return;
    }

    if (qty > batch.current_quantity) {
      setMessage(
        `Quantity cannot exceed ${batch.current_quantity} units.`
      );
      return;
    }

    if (!reason) {
      setMessage("Please select a return reason.");
      return;
    }

    setSubmitting(true);
    setMessage("");
    setSuccess(false);

    try {
      const supabase = createClient();

      const { data, error } = await supabase.rpc("create_return", {
        p_batch_number: batch.batch_number,
        p_retailer_id: RETAILER_ID,
        p_distributor_id: DISTRIBUTOR_ID,
        p_expected_quantity: qty,
        p_reason: reason,
      });

      if (error) {
        setMessage(
          `Return creation failed: ${error.message}`
        );
        return;
      }

      if (!data?.success) {
        setMessage(
          `Return creation failed: ${
            data?.error || "Unknown backend error"
          }`
        );
        return;
      }

      setSuccess(true);
      setMessage("Return created successfully!");

      // Update the local batch state so the UI immediately
      // reflects that the return was created.
      setBatch({
        ...batch,
        status: "RETURN_REQUESTED",
      });
    } catch (error) {
      console.error(error);
      setMessage(
        "Something went wrong while creating the return."
      );
    } finally {
      setSubmitting(false);
    }
  }

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
              className="block rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              Inventory
            </Link>

            <Link
              href="/retailer/returns"
              className="block rounded-lg bg-slate-100 px-3 py-2.5 text-sm font-semibold text-slate-900"
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

        {/* MAIN */}
        <section className="min-w-0 flex-1 p-6 md:p-8">

          <Link
            href="/retailer/returns"
            className="mb-6 inline-flex text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Back to Returns
          </Link>

          {/* PAGE HEADER */}
          <div className="mb-8">

            <p className="text-sm font-medium text-slate-500">
              Reverse Logistics
            </p>

            <h2 className="mt-1 text-3xl font-bold tracking-tight">
              Create Return
            </h2>

            <p className="mt-2 text-slate-500">
              Create a compliant return request for an eligible batch.
            </p>

          </div>

          {/* LOADING */}
          {loading && (
            <div className="max-w-2xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm">

              <div className="animate-pulse space-y-5">

                <div className="h-5 w-32 rounded bg-slate-200" />

                <div className="h-8 w-64 rounded bg-slate-200" />

                <div className="h-12 rounded bg-slate-200" />

                <div className="h-12 rounded bg-slate-200" />

              </div>

            </div>
          )}

          {/* ERROR / MESSAGE BEFORE BATCH */}
          {!loading && !batch && (
            <div className="max-w-2xl rounded-xl border border-red-200 bg-red-50 p-5">

              <p className="font-semibold text-red-800">
                Unable to create return
              </p>

              <p className="mt-1 text-sm text-red-700">
                {message}
              </p>

            </div>
          )}

          {/* FORM */}
          {!loading && batch && (
            <div className="max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

              {/* BATCH INFO */}
              <div className="rounded-lg bg-slate-50 p-4">

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Batch Number
                </p>

                <p className="mt-1 text-lg font-bold">
                  {batch.batch_number}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {batch.medicine_name}
                </p>

              </div>

              {/* STATUS */}
              <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 p-4">

                <div>

                  <p className="text-sm text-slate-500">
                    Current Status
                  </p>

                  <p className="mt-1 font-semibold">
                    {batch.status.replaceAll("_", " ")}
                  </p>

                </div>

                <div>

                  <p className="text-right text-sm text-slate-500">
                    Available Quantity
                  </p>

                  <p className="mt-1 text-right text-xl font-bold">
                    {batch.current_quantity}
                  </p>

                </div>

              </div>

              {/* QUANTITY */}
              <label className="mt-6 block text-sm font-medium text-slate-700">
                Return Quantity
              </label>

              <input
                type="number"
                min="1"
                max={batch.current_quantity}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-slate-500"
                disabled={submitting || success}
              />

              <p className="mt-1 text-xs text-slate-500">
                Maximum return quantity: {batch.current_quantity} units
              </p>

              {/* REASON */}
              <label className="mt-5 block text-sm font-medium text-slate-700">
                Return Reason
              </label>

              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 outline-none focus:border-slate-500"
                disabled={submitting || success}
              >
                <option value="Expired">
                  Expired
                </option>

                <option value="Damaged">
                  Damaged
                </option>

                <option value="Unused">
                  Unused
                </option>

                <option value="Recall">
                  Recall
                </option>
              </select>

              {/* SUBMIT */}
              {!success && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="mt-6 w-full rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Creating Return..."
                    : "Submit Return"}
                </button>
              )}

              {/* MESSAGE */}
              {message && (
                <div
                  className={`mt-4 rounded-lg border p-4 ${
                    success
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >

                  <p
                    className={`text-sm font-semibold ${
                      success
                        ? "text-green-800"
                        : "text-red-800"
                    }`}
                  >
                    {message}
                  </p>

                </div>
              )}

              {/* SUCCESS ACTIONS */}
              {success && (
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">

                  <Link
                    href="/retailer/returns"
                    className="flex-1 rounded-lg bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    View Returns
                  </Link>

                  <Link
                    href={`/retailer/inventory/${encodeURIComponent(
                      batch.batch_number
                    )}`}
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    View Batch Timeline
                  </Link>

                </div>
              )}

            </div>
          )}

        </section>

      </div>

    </main>
  );
}