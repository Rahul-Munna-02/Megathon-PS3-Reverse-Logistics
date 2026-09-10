"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase";

type Batch = {
  id: string;
  batch_number: string;
  medicine_name: string;
  quantity: number;
  current_quantity: number;
  expiry_date: string;
  status: string;
};

type BatchEvent = {
  id: string;
  event_type: string;
  quantity: number | null;
  timestamp: string;
  location: string | null;
};

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatExpiry(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function eventTitle(eventType: string) {
  const titles: Record<string, string> = {
    BATCH_CREATED: "Batch Created",
    MANUFACTURED: "Manufactured",
    RETAILER_RECEIVED: "Retailer Received",
    EXPIRY_WARNING: "Expiry Warning",
    EXPIRED: "Expired",
    RETURN_CREATED: "Return Created",
    PICKUP_ASSIGNED: "Pickup Assigned",
    DISTRIBUTOR_RECEIVED: "Distributor Received",
    DISPUTE_CREATED: "Dispute Created",
    MANUFACTURER_RECEIVED: "Manufacturer Received",
    DESTROYED: "Destroyed",
    REENTRY_DETECTED: "Re-entry Detected",
  };

  return titles[eventType] || eventType.replaceAll("_", " ");
}

function eventDescription(eventType: string) {
  const descriptions: Record<string, string> = {
    BATCH_CREATED: "Batch was registered in MEDTRACE.",
    MANUFACTURED: "Batch was manufactured and registered.",
    RETAILER_RECEIVED: "Batch was received by the retailer.",
    EXPIRY_WARNING: "Batch is approaching its expiry date.",
    EXPIRED: "Batch passed its expiry date.",
    RETURN_CREATED:
      "Return request was created for reverse logistics.",
    PICKUP_ASSIGNED:
      "Pickup was assigned to the distributor.",
    DISTRIBUTOR_RECEIVED:
      "Distributor received and verified the returned batch.",
    DISPUTE_CREATED:
      "A quantity discrepancy was detected.",
    MANUFACTURER_RECEIVED:
      "Batch was handed over to the manufacturer.",
    DESTROYED:
      "Batch was destroyed through the authorized destruction workflow.",
    REENTRY_DETECTED:
      "A destroyed batch was detected during scanning.",
  };

  return (
    descriptions[eventType] ||
    "A traceability event was recorded for this batch."
  );
}

function isCritical(eventType: string) {
  return eventType === "REENTRY_DETECTED";
}

function isWarning(eventType: string) {
  return (
    eventType === "EXPIRED" ||
    eventType === "DISPUTE_CREATED"
  );
}

function statusClasses(status: string) {
  if (status === "FRAUD_ALERT") {
    return "bg-red-50 text-red-700";
  }

  if (status === "DESTROYED") {
    return "bg-red-50 text-red-700";
  }

  if (status === "EXPIRED") {
    return "bg-amber-50 text-amber-700";
  }

  if (status === "DISTRIBUTOR_RECEIVED") {
    return "bg-blue-50 text-blue-700";
  }

  if (status === "MANUFACTURER_RECEIVED") {
    return "bg-purple-50 text-purple-700";
  }

  return "bg-green-50 text-green-700";
}

export default function BatchDetailsPage() {
  const params = useParams();

  const batchNumber = decodeURIComponent(
    String(params.batchNumber || "")
  );

  const [batch, setBatch] = useState<Batch | null>(null);
  const [events, setEvents] = useState<BatchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadBatch() {
      setLoading(true);
      setErrorMessage("");

      try {
        const supabase = createClient();

        // Load batch information.
        // IMPORTANT: id is included because batch_events uses batch_id.
        const { data: batchData, error: batchError } =
          await supabase
            .from("batches")
            .select(
              "id, batch_number, medicine_name, quantity, current_quantity, expiry_date, status"
            )
            .eq("batch_number", batchNumber)
            .single();

        if (batchError) {
          setErrorMessage(
            `Could not load batch: ${batchError.message}`
          );
          return;
        }

        if (!batchData) {
          setErrorMessage("Batch was not found.");
          return;
        }

        setBatch(batchData);

        // Load the real batch timeline.
        const { data: eventData, error: eventError } =
          await supabase
            .from("batch_events")
            .select(
              "id, event_type, quantity, timestamp, location"
            )
            .eq("batch_id", batchData.id)
            .order("timestamp", { ascending: true });

        if (eventError) {
          setErrorMessage(
            `Could not load timeline: ${eventError.message}`
          );
          return;
        }

        setEvents(eventData || []);
      } catch (error) {
        console.error(error);
        setErrorMessage(
          "Something went wrong while loading the batch."
        );
      } finally {
        setLoading(false);
      }
    }

    if (batchNumber) {
      loadBatch();
    }
  }, [batchNumber]);

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

          {/* BACK */}
          <Link
            href="/retailer/inventory"
            className="mb-6 inline-flex text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Back to Inventory
          </Link>

          {/* LOADING */}
          {loading && (
            <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">

              <div className="animate-pulse space-y-4">

                <div className="h-4 w-32 rounded bg-slate-200" />

                <div className="h-8 w-64 rounded bg-slate-200" />

                <div className="h-4 w-40 rounded bg-slate-200" />

                <div className="grid gap-4 md:grid-cols-4">

                  <div className="h-28 rounded-xl bg-slate-200" />
                  <div className="h-28 rounded-xl bg-slate-200" />
                  <div className="h-28 rounded-xl bg-slate-200" />
                  <div className="h-28 rounded-xl bg-slate-200" />

                </div>

              </div>

            </div>
          )}

          {/* ERROR */}
          {!loading && errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5">

              <p className="font-semibold text-red-800">
                Unable to load batch
              </p>

              <p className="mt-1 text-sm text-red-700">
                {errorMessage}
              </p>

            </div>
          )}

          {/* BATCH */}
          {!loading && !errorMessage && batch && (
            <>

              {/* PAGE HEADER */}
              <div className="mb-8">

                <p className="text-sm font-medium text-slate-500">
                  Batch Details
                </p>

                <h2 className="mt-1 text-3xl font-bold tracking-tight">
                  {batch.batch_number}
                </h2>

                <p className="mt-2 text-base text-slate-500">
                  {batch.medicine_name}
                </p>

              </div>

              {/* BATCH SUMMARY */}
              <div className="grid gap-4 md:grid-cols-4">

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                  <p className="text-sm text-slate-500">
                    Original Quantity
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    {batch.quantity}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Units
                  </p>

                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                  <p className="text-sm text-slate-500">
                    Current Quantity
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    {batch.current_quantity}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Units remaining
                  </p>

                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                  <p className="text-sm text-slate-500">
                    Expiry
                  </p>

                  <p className="mt-2 text-lg font-semibold">
                    {formatExpiry(batch.expiry_date)}
                  </p>

                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                  <p className="text-sm text-slate-500">
                    Current Status
                  </p>

                  <span
                    className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-sm font-semibold ${statusClasses(
                      batch.status
                    )}`}
                  >
                    {batch.status.replaceAll("_", " ")}
                  </span>

                </div>

              </div>

              {/* RETURN ACTION */}
              {(batch.status === "EXPIRED" ||
                batch.status === "EXPIRING_SOON") && (

                <div className="mt-6 flex flex-col justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center">

                  <div>

                    <p className="font-semibold text-amber-900">
                      Return required
                    </p>

                    <p className="mt-1 text-sm text-amber-800">
                      This batch should enter the reverse logistics
                      workflow.
                    </p>

                  </div>

                  <Link
                    href={`/retailer/returns/create?batch=${encodeURIComponent(
                      batch.batch_number
                    )}`}
                    className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Create Return
                  </Link>

                </div>

              )}

              {/* FRAUD ALERT */}
              {batch.status === "FRAUD_ALERT" && (

                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">

                  <p className="font-semibold text-red-800">
                    🚨 FRAUD / RE-ENTRY ALERT
                  </p>

                  <p className="mt-1 text-sm text-red-700">
                    This batch has been flagged because a destroyed
                    batch was detected during re-entry scanning.
                  </p>

                  <p className="mt-3 text-sm font-semibold text-red-800">
                    DO NOT ACCEPT THIS BATCH
                  </p>

                </div>

              )}

              {/* TIMELINE */}
              <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="mb-6">

                  <h3 className="text-lg font-semibold">
                    Batch Timeline
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Complete traceability history for this batch.
                  </p>

                </div>

                {events.length === 0 ? (

                  <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">

                    <p className="font-medium text-slate-700">
                      No timeline events yet
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Events will appear here as the batch moves
                      through the supply chain.
                    </p>

                  </div>

                ) : (

                  <div className="space-y-6">

                    {events.map((event, index) => {

                      const critical = isCritical(
                        event.event_type
                      );

                      const warning = isWarning(
                        event.event_type
                      );

                      return (

                        <div
                          key={event.id}
                          className="relative flex gap-4"
                        >

                          {/* CONNECTING LINE */}
                          {index !== events.length - 1 && (
                            <div className="absolute left-[11px] top-7 h-full w-px bg-slate-200" />
                          )}

                          {/* EVENT DOT */}
                          <div
                            className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                              critical
                                ? "border-red-600 bg-red-50"
                                : warning
                                  ? "border-amber-500 bg-amber-50"
                                  : "border-green-600 bg-green-50"
                            }`}
                          >

                            <div
                              className={`h-2 w-2 rounded-full ${
                                critical
                                  ? "bg-red-600"
                                  : warning
                                    ? "bg-amber-500"
                                    : "bg-green-600"
                              }`}
                            />

                          </div>

                          {/* EVENT CONTENT */}
                          <div className="min-w-0 flex-1 pb-2">

                            <div className="flex flex-col justify-between gap-1 sm:flex-row">

                              <p
                                className={`text-sm font-semibold ${
                                  critical
                                    ? "text-red-700"
                                    : "text-slate-900"
                                }`}
                              >
                                {eventTitle(event.event_type)}
                              </p>

                              <p className="text-xs text-slate-400">
                                {formatDate(event.timestamp)}
                              </p>

                            </div>

                            <p className="mt-1 text-sm text-slate-500">
                              {eventDescription(
                                event.event_type
                              )}
                            </p>

                            <div className="mt-2 flex flex-wrap gap-2">

                              {event.location && (
                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                                  {event.location}
                                </span>
                              )}

                              {event.quantity !== null && (
                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                                  Quantity: {event.quantity}
                                </span>
                              )}

                            </div>

                            {/* RE-ENTRY WARNING */}
                            {critical && (
                              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">

                                <p className="text-sm font-semibold text-red-800">
                                  🚨 Re-entry detected
                                </p>

                                <p className="mt-1 text-xs text-red-700">
                                  This batch must not be accepted,
                                  distributed, or re-entered into
                                  normal inventory.
                                </p>

                              </div>
                            )}

                          </div>

                        </div>

                      );
                    })}

                  </div>

                )}

              </div>

            </>
          )}

        </section>

      </div>

    </main>
  );
}