"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

const BATCH_NUMBER = "MED-2026-001";
const FACILITY_ID = "44444444-4444-4444-4444-444444444444";

type Batch = {
  batch_number: string;
  medicine_name: string;
  current_quantity: number;
  status: string;
};

export default function DestructionPage() {
  const [batch, setBatch] = useState<Batch | null>(null);

  const [certificateNumber, setCertificateNumber] =
    useState("CERT-2026-001");

  const [quantity, setQuantity] = useState("100");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState("");
  const [verification, setVerification] = useState("");

  useEffect(() => {
    async function loadBatch() {
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("batches")
          .select(
            "batch_number, medicine_name, current_quantity, status"
          )
          .eq("batch_number", BATCH_NUMBER)
          .single();

        if (error) {
          setMessage(
            `Could not load batch: ${error.message}`
          );
          return;
        }

        setBatch(data);
        setQuantity(String(data.current_quantity));
      } catch (error) {
        console.error(error);
        setMessage(
          "Something went wrong while loading the batch."
        );
      } finally {
        setLoading(false);
      }
    }

    loadBatch();
  }, []);

  async function handleDestroy() {
    if (!batch) {
      setMessage("Batch information is not available.");
      return;
    }

    const destroyedQuantity = Number(quantity);

    if (
      !Number.isInteger(destroyedQuantity) ||
      destroyedQuantity <= 0
    ) {
      setMessage(
        "Please enter a valid destruction quantity."
      );
      return;
    }

    if (!certificateNumber.trim()) {
      setMessage("Please enter a certificate number.");
      return;
    }

    setSubmitting(true);
    setMessage("");
    setVerification("");

    try {
      const supabase = createClient();

      const { data, error } = await supabase.rpc(
        "mark_batch_destroyed",
        {
          p_batch_number: batch.batch_number,
          p_certificate_number:
            certificateNumber.trim(),
          p_facility_id: FACILITY_ID,
          p_quantity_destroyed: destroyedQuantity,
          p_document_url: null,
        }
      );

      if (error) {
        setMessage(
          `Destruction failed: ${error.message}`
        );
        return;
      }

      if (!data?.success) {
        setMessage(
          `Destruction failed: ${
            data?.error ||
            "Unknown backend error"
          }`
        );
        return;
      }

      const result = data?.data;

      setVerification(
        result?.verification || ""
      );

      if (result?.verification === "VERIFIED") {
        setMessage(
          "✓ Destruction recorded and quantity verified."
        );

        setBatch({
          ...batch,
          status: "DESTROYED",
          current_quantity: 0,
        });
      } else {
        setMessage(
          "⚠ Destruction recorded, but a quantity mismatch was detected."
        );
      }
    } catch (error) {
      console.error(error);

      setMessage(
        "Something went wrong while recording destruction."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const expectedQuantity =
    batch?.current_quantity ?? 0;

  const declaredQuantity = Number(quantity) || 0;

  const difference =
    expectedQuantity - declaredQuantity;

  const hasMismatch =
    declaredQuantity > 0 &&
    declaredQuantity !== expectedQuantity;

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
              Manufacturer
            </span>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
              M
            </div>

          </div>

        </div>
      </header>

      {/* MAIN */}
      <section className="mx-auto max-w-4xl p-6 md:p-10">

        <div className="mb-8">

          <p className="text-sm font-medium text-slate-500">
            Destruction & Compliance
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Batch Destruction
          </h1>

          <p className="mt-2 text-slate-500">
            Record and verify the destruction certificate
            for a manufacturer-received batch.
          </p>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">

            <div className="animate-pulse space-y-4">

              <div className="h-5 w-40 rounded bg-slate-200" />

              <div className="h-8 w-64 rounded bg-slate-200" />

              <div className="h-24 rounded bg-slate-200" />

            </div>

          </div>
        )}

        {/* BATCH */}
        {!loading && batch && (
          <>

            {/* BATCH INFORMATION */}
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Batch Number
                  </p>

                  <p className="mt-1 text-xl font-bold">
                    {batch.batch_number}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {batch.medicine_name}
                  </p>

                </div>

                <span className="inline-flex w-fit rounded-full bg-purple-50 px-3 py-1.5 text-sm font-semibold text-purple-700">
                  {batch.status.replaceAll("_", " ")}
                </span>

              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                <div className="rounded-lg bg-slate-50 p-4">

                  <p className="text-sm text-slate-500">
                    Expected Quantity
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {expectedQuantity}
                  </p>

                  <p className="text-xs text-slate-400">
                    Units
                  </p>

                </div>

                <div className="rounded-lg bg-slate-50 p-4">

                  <p className="text-sm text-slate-500">
                    Facility
                  </p>

                  <p className="mt-1 font-semibold">
                    CarePlus Pharma Ltd
                  </p>

                  <p className="text-xs text-slate-400">
                    Authorized destruction facility
                  </p>

                </div>

              </div>

            </section>

            {/* CERTIFICATE */}
            <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="text-lg font-semibold">
                Destruction Certificate
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Enter the certificate details and the
                quantity actually recorded as destroyed.
              </p>

              {/* CERTIFICATE NUMBER */}
              <label className="mt-6 block text-sm font-medium text-slate-700">
                Certificate Number
              </label>

              <input
                type="text"
                value={certificateNumber}
                onChange={(e) =>
                  setCertificateNumber(e.target.value)
                }
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-100"
                disabled={submitting}
              />

              {/* QUANTITY */}
              <label className="mt-5 block text-sm font-medium text-slate-700">
                Quantity Destroyed
              </label>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
                className={`mt-2 w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 ${
                  hasMismatch
                    ? "border-red-400 focus:border-red-600 focus:ring-red-100"
                    : "border-slate-300 focus:border-slate-600 focus:ring-slate-100"
                }`}
                disabled={submitting}
              />

              {/* LIVE VERIFICATION */}
              <div
                className={`mt-4 rounded-lg border p-4 ${
                  hasMismatch
                    ? "border-red-200 bg-red-50"
                    : "border-green-200 bg-green-50"
                }`}
              >

                <div className="flex items-center justify-between">

                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        hasMismatch
                          ? "text-red-800"
                          : "text-green-800"
                      }`}
                    >
                      {hasMismatch
                        ? "⚠ QUANTITY DISCREPANCY"
                        : "✓ QUANTITY MATCH"}
                    </p>

                    <p
                      className={`mt-1 text-sm ${
                        hasMismatch
                          ? "text-red-700"
                          : "text-green-700"
                      }`}
                    >
                      Expected: {expectedQuantity} units
                    </p>

                    <p
                      className={`text-sm ${
                        hasMismatch
                          ? "text-red-700"
                          : "text-green-700"
                      }`}
                    >
                      Declared destroyed:{" "}
                      {declaredQuantity} units
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-xs text-slate-500">
                      Difference
                    </p>

                    <p
                      className={`text-2xl font-bold ${
                        hasMismatch
                          ? "text-red-700"
                          : "text-green-700"
                      }`}
                    >
                      {Math.abs(difference)}
                    </p>

                    <p className="text-xs text-slate-500">
                      units
                    </p>

                  </div>

                </div>

              </div>

              {/* DEMO WARNING */}
              {hasMismatch && (
                <div className="mt-4 rounded-lg border border-red-300 bg-red-50 p-4">

                  <p className="font-semibold text-red-800">
                    🚨 DESTRUCTION DISCREPANCY DETECTED
                  </p>

                  <p className="mt-1 text-sm text-red-700">
                    The declared destruction quantity does
                    not match the verified batch quantity.
                  </p>

                  <p className="mt-2 text-sm font-semibold text-red-800">
                    {Math.abs(difference)} units require
                    investigation.
                  </p>

                </div>
              )}

              {/* SUBMIT */}
              <button
                type="button"
                onClick={handleDestroy}
                disabled={submitting}
                className="mt-6 w-full rounded-lg bg-red-700 px-5 py-3 text-sm font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Recording Destruction..."
                  : "Confirm Destruction"}
              </button>

              {/* RESULT */}
              {message && (
                <div
                  className={`mt-6 rounded-lg border p-5 ${
                    verification === "VERIFIED"
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >

                  <p
                    className={`font-semibold ${
                      verification === "VERIFIED"
                        ? "text-green-800"
                        : "text-red-800"
                    }`}
                  >
                    {message}
                  </p>

                  {verification && (
                    <p className="mt-2 text-sm text-slate-700">
                      Verification:{" "}
                      <strong>{verification}</strong>
                    </p>
                  )}

                </div>
              )}

            </section>

          </>
        )}

        {/* LOAD ERROR */}
        {!loading && !batch && message && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5">

            <p className="font-semibold text-red-800">
              Unable to load batch
            </p>

            <p className="mt-1 text-sm text-red-700">
              {message}
            </p>

          </div>
        )}

      </section>

    </main>
  );
}