import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { manufacturerFraudService } from "./services/manufacturerFraudService";
import type { Batch } from "./types/medtrace";
import RetailerDashboard from "./components/retailer/RetailerDashboard";

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "retailer" | "manufacturer" | "scanner"
  >("retailer");

  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(false);

  // Manufacturer modal states
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [certNumber, setCertNumber] = useState("CERT-2026-8831");
  const [facilityId, setFacilityId] = useState("Waste Facility A");
  const [certVerified, setCertVerified] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Scanner states
  const [scanBatchNum, setScanBatchNum] = useState("MED-2026-001");
  const [scanLocation, setScanLocation] = useState("Pharmacy B");
  const [scanResult, setScanResult] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    const { data } = await supabase
      .from("batches")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setBatches(data);
    }
  };

  const handleVerifyReceipt = async (b: Batch) => {
    setLoading(true);

    try {
      await manufacturerFraudService.markManufacturerReceived(
        b.id,
        b.quantity,
        "mfg-user",
        b.manufacturer_id,
        "Manufacturer Facility A"
      );

      setFeedback(`Batch ${b.batch_number} verified and received.`);
      fetchBatches();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleDestruction = async (b: Batch) => {
    setLoading(true);

    try {
      await manufacturerFraudService.scheduleDestruction(
        b.id,
        facilityId,
        "mfg-user",
        b.manufacturer_id
      );

      setFeedback(`Batch ${b.batch_number} queued for destruction.`);
      fetchBatches();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCert = () => {
    if (certNumber.trim().toUpperCase() === "CERT-2026-8831") {
      setCertVerified(true);
    } else {
      setCertVerified(false);
    }
  };

  const handleMarkDestroyed = async () => {
    if (!selectedBatch || !certVerified) return;

    setLoading(true);

    try {
      await manufacturerFraudService.markBatchDestroyed(
        selectedBatch.id,
        {
          batch_id: selectedBatch.id,
          certificate_number: certNumber,
          facility_id: facilityId,
          quantity_destroyed: selectedBatch.quantity,
          destruction_date: "2026-09-10",
          document_url: "https://placeholder.storage/cert.pdf",
          verification_status: "VERIFIED",
        },
        "mfg-user",
        selectedBatch.manufacturer_id
      );

      setFeedback(
        `Batch ${selectedBatch.batch_number} marked as DESTROYED.`
      );

      setSelectedBatch(null);
      setCertVerified(null);
      fetchBatches();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async () => {
    setLoading(true);
    setScanResult(null);
    setTimeline([]);

    try {
      const result = await manufacturerFraudService.checkBatchForReentry(
        scanBatchNum.trim(),
        scanLocation.trim()
      );

      setScanResult(result);

      if (result.batch) {
        const events =
          await manufacturerFraudService.getBatchTimeline(result.batch.id);

        setTimeline(events || []);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "30px auto",
        fontFamily: "system-ui, sans-serif",
        padding: "0 20px",
      }}
    >
      <header
        style={{
          borderBottom: "2px solid #e5e7eb",
          paddingBottom: "16px",
          marginBottom: "24px",
        }}
      >
        <h1 style={{ margin: 0, color: "#111827" }}>MEDTRACE</h1>

        <p
          style={{
            margin: "4px 0 16px 0",
            color: "#6b7280",
          }}
        >
          Track. Verify. Prevent Re-entry.
        </p>

        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          {/* RETAILER */}
          <button
            onClick={() => setActiveTab("retailer")}
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              background:
                activeTab === "retailer" ? "#1f2937" : "#e5e7eb",
              color:
                activeTab === "retailer" ? "#fff" : "#1f2937",
              fontWeight: 600,
            }}
          >
            Retailer Dashboard
          </button>

          {/* MANUFACTURER */}
          <button
            onClick={() => setActiveTab("manufacturer")}
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              background:
                activeTab === "manufacturer"
                  ? "#1f2937"
                  : "#e5e7eb",
              color:
                activeTab === "manufacturer"
                  ? "#fff"
                  : "#1f2937",
              fontWeight: 600,
            }}
          >
            Manufacturer Dashboard
          </button>

          {/* RE-ENTRY SCANNER */}
          <button
            onClick={() => setActiveTab("scanner")}
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              background:
                activeTab === "scanner" ? "#dc2626" : "#fee2e2",
              color:
                activeTab === "scanner" ? "#fff" : "#991b1b",
              fontWeight: 600,
            }}
          >
            Re-entry Scanner
          </button>
        </div>
      </header>

      {feedback && (
        <div
          style={{
            background: "#ecfdf5",
            border: "1px solid #10b981",
            color: "#065f46",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "20px",
          }}
        >
          {feedback}
        </div>
      )}

      {/* =========================
          RETAILER DASHBOARD
         ========================= */}
      {activeTab === "retailer" && <RetailerDashboard />}

      {/* =========================
          MANUFACTURER DASHBOARD
         ========================= */}
      {activeTab === "manufacturer" && (
        <div>
          <h2>Manufacturer & Destruction Workflow</h2>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              marginTop: "16px",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "2px solid #e5e7eb",
                  background: "#f9fafb",
                }}
              >
                <th style={{ padding: "10px" }}>Batch</th>
                <th style={{ padding: "10px" }}>Medicine</th>
                <th style={{ padding: "10px" }}>Qty</th>
                <th style={{ padding: "10px" }}>Status</th>
                <th style={{ padding: "10px" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {batches.map((b) => (
                <tr
                  key={b.id}
                  style={{
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <td
                    style={{
                      padding: "10px",
                      fontWeight: 600,
                    }}
                  >
                    {b.batch_number}
                  </td>

                  <td style={{ padding: "10px" }}>
                    {b.medicine_name}
                  </td>

                  <td style={{ padding: "10px" }}>
                    {b.quantity}
                  </td>

                  <td style={{ padding: "10px" }}>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: 600,
                        background:
                          b.status === "DESTROYED"
                            ? "#fee2e2"
                            : "#e0e7ff",
                        color:
                          b.status === "DESTROYED"
                            ? "#991b1b"
                            : "#3730a3",
                      }}
                    >
                      {b.status}
                    </span>
                  </td>

                  <td style={{ padding: "10px" }}>
                    {b.status === "DISTRIBUTOR_RECEIVED" && (
                      <button
                        onClick={() => handleVerifyReceipt(b)}
                        disabled={loading}
                        style={{
                          padding: "6px 12px",
                        }}
                      >
                        Confirm Receipt
                      </button>
                    )}

                    {b.status === "MANUFACTURER_RECEIVED" && (
                      <button
                        onClick={() =>
                          handleScheduleDestruction(b)
                        }
                        disabled={loading}
                        style={{
                          padding: "6px 12px",
                        }}
                      >
                        Schedule Destruction
                      </button>
                    )}

                    {b.status === "PENDING_DESTRUCTION" && (
                      <button
                        onClick={() => setSelectedBatch(b)}
                        disabled={loading}
                        style={{
                          padding: "6px 12px",
                          background: "#d97706",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                        }}
                      >
                        Process Destruction
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedBatch && (
            <div
              style={{
                marginTop: "24px",
                padding: "20px",
                border: "2px solid #d97706",
                borderRadius: "8px",
                background: "#fffbeb",
              }}
            >
              <h3>
                Destruction Processing:{" "}
                {selectedBatch.batch_number}
              </h3>

              <p>
                Medicine: {selectedBatch.medicine_name} | Quantity:{" "}
                {selectedBatch.quantity}
              </p>

              <div style={{ marginBottom: "12px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Waste Facility:
                </label>

                <input
                  type="text"
                  value={facilityId}
                  onChange={(e) =>
                    setFacilityId(e.target.value)
                  }
                  style={{
                    padding: "6px",
                    width: "300px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Certificate Number:
                </label>

                <input
                  type="text"
                  value={certNumber}
                  onChange={(e) =>
                    setCertNumber(e.target.value)
                  }
                  style={{
                    padding: "6px",
                    width: "300px",
                  }}
                />

                <button
                  onClick={handleVerifyCert}
                  style={{
                    marginLeft: "8px",
                    padding: "6px 12px",
                  }}
                >
                  Verify
                </button>

                {certVerified === true && (
                  <span
                    style={{
                      color: "green",
                      marginLeft: "8px",
                      fontWeight: "bold",
                    }}
                  >
                    ✓ VERIFIED
                  </span>
                )}

                {certVerified === false && (
                  <span
                    style={{
                      color: "red",
                      marginLeft: "8px",
                      fontWeight: "bold",
                    }}
                  >
                    ⚠️ MISMATCH
                  </span>
                )}
              </div>

              <button
                onClick={handleMarkDestroyed}
                disabled={!certVerified || loading}
                style={{
                  background: certVerified
                    ? "#dc2626"
                    : "#9ca3af",
                  color: "#fff",
                  padding: "10px 18px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: certVerified
                    ? "pointer"
                    : "not-allowed",
                  fontWeight: 600,
                }}
              >
                Mark Batch as Destroyed
              </button>

              <button
                onClick={() => setSelectedBatch(null)}
                style={{
                  marginLeft: "10px",
                  padding: "10px 18px",
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {/* =========================
          RE-ENTRY SCANNER
         ========================= */}
      {activeTab === "scanner" && (
        <div>
          <h2>Supply Chain Re-entry Scanner</h2>

          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "20px",
            }}
          >
            <input
              type="text"
              value={scanBatchNum}
              onChange={(e) =>
                setScanBatchNum(e.target.value)
              }
              placeholder="Batch Number"
              style={{
                flex: 1,
                padding: "10px",
                fontSize: "16px",
              }}
            />

            <input
              type="text"
              value={scanLocation}
              onChange={(e) =>
                setScanLocation(e.target.value)
              }
              placeholder="Scan Location"
              style={{
                width: "200px",
                padding: "10px",
                fontSize: "16px",
              }}
            />

            <button
              onClick={handleScan}
              disabled={loading}
              style={{
                padding: "10px 20px",
                background: "#dc2626",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {loading ? "Checking..." : "Scan Batch"}
            </button>
          </div>

          {scanResult && (
            <div>
              {scanResult.status === "FRAUD" && (
                <div
                  style={{
                    background: "#fef2f2",
                    border: "2px solid #ef4444",
                    borderRadius: "8px",
                    padding: "24px",
                  }}
                >
                  <h1
                    style={{
                      color: "#991b1b",
                      margin: "0 0 10px 0",
                    }}
                  >
                    🚨 DESTROYED BATCH RE-ENTRY DETECTED
                  </h1>

                  <h3
                    style={{
                      margin: "0 0 16px 0",
                      color: "#b91c1c",
                    }}
                  >
                    Risk Score: 92 / 100
                  </h3>

                  <p>
                    <strong>Batch:</strong>{" "}
                    {scanResult.batch.batch_number}
                  </p>

                  <p>
                    <strong>Medicine:</strong>{" "}
                    {scanResult.batch.medicine_name}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {scanResult.batch.status}
                  </p>

                  <p>
                    <strong>Detected Location:</strong>{" "}
                    {scanResult.alert.detected_location}
                  </p>

                  <div
                    style={{
                      marginTop: "20px",
                      padding: "16px",
                      background: "#fff",
                      borderRadius: "6px",
                    }}
                  >
                    <h4>Chain of Custody Timeline</h4>

                    <ul
                      style={{
                        paddingLeft: "20px",
                      }}
                    >
                      {timeline.map((evt, idx) => (
                        <li
                          key={idx}
                          style={{
                            marginBottom: "8px",
                          }}
                        >
                          <strong>{evt.event_type}</strong> —{" "}
                          {evt.location} (
                          {new Date(
                            evt.timestamp
                          ).toLocaleString()}
                          )
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {scanResult.status === "VALID" && (
                <div
                  style={{
                    background: "#ecfdf5",
                    border: "1px solid #10b981",
                    padding: "20px",
                    borderRadius: "8px",
                  }}
                >
                  <h2
                    style={{
                      color: "#065f46",
                      margin: 0,
                    }}
                  >
                    ✓ VALID BATCH
                  </h2>

                  <p>Status: ACTIVE</p>
                </div>
              )}

              {scanResult.status === "UNKNOWN_BATCH" && (
                <div
                  style={{
                    background: "#f3f4f6",
                    border: "1px solid #9ca3af",
                    padding: "20px",
                    borderRadius: "8px",
                  }}
                >
                  <h2>UNKNOWN BATCH</h2>

                  <p>No registered batch found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}