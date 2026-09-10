import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { Batch } from "../../types/medtrace";

const RETAILER_ID = "22222222-2222-2222-2222-222222222222";

export default function RetailerDashboard() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [returnCount, setReturnCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const { data: batchData, error: batchError } = await supabase
        .from("batches")
        .select(
          "id, batch_number, medicine_name, manufacturer_id, quantity, current_quantity, expiry_date, status, created_at, updated_at"
        )
        .order("expiry_date", { ascending: true });

      if (batchError) throw batchError;

      const { data: returnsData, error: returnsError } = await supabase
        .from("returns")
        .select("id, status")
        .eq("retailer_id", RETAILER_ID);

      if (returnsError) throw returnsError;

      setBatches(batchData || []);

      setReturnCount(
        (returnsData || []).filter(
          (item) =>
            item.status === "REQUESTED" ||
            item.status === "PICKUP_ASSIGNED"
        ).length
      );
    } catch (err: any) {
      setError(err.message || "Unable to load retailer dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const totalBatches = batches.length;

  const expiringSoon = batches.filter(
    (batch) => batch.status === "EXPIRING_SOON"
  ).length;

  const expired = batches.filter(
    (batch) => batch.status === "EXPIRED"
  ).length;

  const actionRequired = batches.filter(
    (batch) =>
      batch.status === "EXPIRED" ||
      batch.status === "EXPIRING_SOON"
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "32px",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "28px" }}>
          <p
            style={{
              margin: 0,
              fontSize: "13px",
              fontWeight: 700,
              color: "#64748b",
              letterSpacing: "0.08em",
            }}
          >
            MEDTRACE
          </p>

          <h1
            style={{
              margin: "6px 0 4px",
              fontSize: "30px",
              color: "#0f172a",
            }}
          >
            Retailer Dashboard
          </h1>

          <p style={{ margin: 0, color: "#64748b" }}>
            Monitor inventory, expiry and medicine returns.
          </p>
        </div>

        {error && (
          <div
            style={{
              marginBottom: "20px",
              padding: "14px 16px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "10px",
              color: "#991b1b",
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <div
            style={{
              padding: "40px",
              background: "#fff",
              borderRadius: "14px",
              border: "1px solid #e2e8f0",
              color: "#64748b",
            }}
          >
            Loading retailer dashboard...
          </div>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(210px, 1fr))",
                gap: "16px",
                marginBottom: "28px",
              }}
            >
              <KpiCard
                title="Total Batches"
                value={totalBatches}
                subtitle="Registered inventory"
              />

              <KpiCard
                title="Expiring Soon"
                value={expiringSoon}
                subtitle="Needs attention"
                warning
              />

              <KpiCard
                title="Expired"
                value={expired}
                subtitle="Return required"
                danger
              />

              <KpiCard
                title="Pending Returns"
                value={returnCount}
                subtitle="Awaiting processing"
              />
            </div>

            <div
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                overflow: "hidden",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  padding: "20px 22px",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    color: "#0f172a",
                  }}
                >
                  Recent Inventory
                </h2>
              </div>

              {batches.length === 0 ? (
                <div
                  style={{
                    padding: "32px",
                    color: "#64748b",
                  }}
                >
                  No batches found.
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                    }}
                  >
                    <thead>
                      <tr style={{ background: "#f8fafc" }}>
                        <th style={thStyle}>Batch</th>
                        <th style={thStyle}>Medicine</th>
                        <th style={thStyle}>Quantity</th>
                        <th style={thStyle}>Expiry</th>
                        <th style={thStyle}>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {batches.slice(0, 5).map((batch) => (
                        <tr key={batch.id}>
                          <td style={tdStyle}>
                            <strong>{batch.batch_number}</strong>
                          </td>

                          <td style={tdStyle}>
                            {batch.medicine_name}
                          </td>

                          <td style={tdStyle}>
                            {batch.current_quantity}
                          </td>

                          <td style={tdStyle}>
                            {new Date(
                              batch.expiry_date
                            ).toLocaleDateString()}
                          </td>

                          <td style={tdStyle}>
                            <StatusBadge status={batch.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                padding: "22px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 16px",
                  fontSize: "18px",
                  color: "#0f172a",
                }}
              >
                Action Required
              </h2>

              {actionRequired.length === 0 ? (
                <p style={{ margin: 0, color: "#64748b" }}>
                  No batches currently require action.
                </p>
              ) : (
                <div style={{ display: "grid", gap: "12px" }}>
                  {actionRequired.slice(0, 5).map((batch) => (
                    <div
                      key={batch.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "16px",
                        padding: "16px",
                        background:
                          batch.status === "EXPIRED"
                            ? "#fef2f2"
                            : "#fffbeb",
                        border:
                          batch.status === "EXPIRED"
                            ? "1px solid #fecaca"
                            : "1px solid #fde68a",
                        borderRadius: "10px",
                      }}
                    >
                      <div>
                        <strong style={{ color: "#0f172a" }}>
                          {batch.batch_number}
                        </strong>

                        <div
                          style={{
                            marginTop: "4px",
                            fontSize: "14px",
                            color: "#64748b",
                          }}
                        >
                          {batch.medicine_name} ·{" "}
                          {batch.current_quantity} units
                        </div>
                      </div>

                      <StatusBadge status={batch.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function KpiCard({
  title,
  value,
  subtitle,
  warning = false,
  danger = false,
}: {
  title: string;
  value: number;
  subtitle: string;
  warning?: boolean;
  danger?: boolean;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: "14px",
        padding: "20px",
      }}
    >
      <div
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "#64748b",
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: "8px",
          fontSize: "32px",
          fontWeight: 700,
          color: danger
            ? "#dc2626"
            : warning
              ? "#d97706"
              : "#0f172a",
        }}
      >
        {value}
      </div>

      <div
        style={{
          marginTop: "4px",
          fontSize: "13px",
          color: "#94a3b8",
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isDanger =
    status === "EXPIRED" ||
    status === "FRAUD_ALERT" ||
    status === "DESTROYED";

  const isWarning =
    status === "EXPIRING_SOON" ||
    status === "RETURN_REQUESTED" ||
    status === "DISPUTED";

  return (
    <span
      style={{
        display: "inline-block",
        padding: "5px 9px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 700,
        background: isDanger
          ? "#fee2e2"
          : isWarning
            ? "#fef3c7"
            : "#dcfce7",
        color: isDanger
          ? "#991b1b"
          : isWarning
            ? "#92400e"
            : "#166534",
      }}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

const thStyle: React.CSSProperties = {
  padding: "12px 16px",
  textAlign: "left",
  fontSize: "12px",
  color: "#64748b",
  fontWeight: 700,
};

const tdStyle: React.CSSProperties = {
  padding: "14px 16px",
  borderTop: "1px solid #f1f5f9",
  fontSize: "14px",
  color: "#334155",
};