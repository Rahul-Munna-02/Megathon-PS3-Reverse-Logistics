# MedTrace — Backend API Contract

Everything below is tested and confirmed working against the Supabase database.

## How to call these from the frontend

All functions are Postgres RPC functions. Call them via the Supabase client:

```javascript
const { data, error } = await supabase.rpc('function_name', {
  p_param_name: value
});
```

Every function returns the same consistent shape:
```json
{
  "success": true | false,
  "data": { ... } | null,
  "error": null | "error message string"
}
```

Always check `success` first. If `false`, show `error` to the user.

---

## Write Functions (change state)

### 1. `create_return` — Retailer flags a batch for return
**Who calls this:** Thanu (Retailer module)

```javascript
const { data } = await supabase.rpc('create_return', {
  p_batch_number: 'MED-2026-001',
  p_retailer_id: '11111111-1111-1111-1111-111111111111',
  p_distributor_id: '33333333-3333-3333-3333-333333333333',
  p_expected_quantity: 100,
  p_reason: 'Expired stock'
});
```

**Success:** `{ "success": true, "data": { "return_id": "uuid", "status": "RETURN_REQUESTED" }, "error": null }`

**Fails if:** batch not found, or not in `ACTIVE`/`EXPIRING_SOON`/`EXPIRED` status.

---

### 2. `confirm_distributor_receipt` — Distributor confirms pickup
**Who calls this:** Thanu (Distributor module)

```javascript
const { data } = await supabase.rpc('confirm_distributor_receipt', {
  p_batch_number: 'MED-2026-001',
  p_received_quantity: 100
});
```

**Success:** `{ "success": true, "data": { "status": "DISTRIBUTOR_RECEIVED", "return_status": "RECEIVED" }, "error": null }`

**If quantity mismatches**, auto-flags dispute: `{ "data": { "status": "DISPUTED", "return_status": "DISPUTED" } }` — also auto-creates a `QUANTITY_DISCREPANCY` fraud alert.

**Fails if:** batch not in `RETURN_REQUESTED` status, or no return request exists.

---

### 3. `mark_manufacturer_received` — Manufacturer confirms receipt
**Who calls this:** Syed (Manufacturer module)

```javascript
const { data } = await supabase.rpc('mark_manufacturer_received', {
  p_batch_number: 'MED-2026-001'
});
```

**Success:** `{ "success": true, "data": { "status": "MANUFACTURER_RECEIVED" }, "error": null }`

**Fails if:** batch not in `DISTRIBUTOR_RECEIVED` status.

---

### 4. `mark_batch_destroyed` — Upload certificate, mark destroyed
**Who calls this:** Syed (Destruction module)

```javascript
const { data } = await supabase.rpc('mark_batch_destroyed', {
  p_batch_number: 'MED-2026-001',
  p_certificate_number: 'CERT-2026-001',
  p_facility_id: '55555555-5555-5555-5555-555555555555',
  p_quantity_destroyed: 100,
  p_document_url: null
});
```

**Success:** `{ "success": true, "data": { "status": "DESTROYED", "verification": "VERIFIED" }, "error": null }`

**If quantity mismatches batch's current_quantity:** `verification` becomes `"MISMATCH"`, auto-creates `CERTIFICATE_MISMATCH` fraud alert.

**Fails if:** batch not in `MANUFACTURER_RECEIVED` status — error shows actual current status.

---

### 5. `check_batch_reentry` — The fraud scan (CORE FEATURE)
**Who calls this:** Syed (Fraud module) — fires when any pharmacy scans a batch number

```javascript
const { data } = await supabase.rpc('check_batch_reentry', {
  p_batch_number: 'MED-2026-001',
  p_location: 'Apollo Pharmacy, Chennai'
});
```

**Possible `data.result` values:**
| Result | Meaning |
|---|---|
| `"FRAUD"` | Batch was DESTROYED and rescanned — alert auto-created |
| `"WARNING"` | Batch is `PENDING_DESTRUCTION` |
| `"EXPIRED"` | Batch expired, not yet in return pipeline |
| `"VALID"` | Normal status |
| `"UNKNOWN_BATCH"` | Batch number doesn't exist |

**Fraud response:** `{ "data": { "result": "FRAUD", "batch_number": "...", "medicine_name": "...", "message": "Destroyed batch re-entry detected" } }`

**This is the demo climax — build the UI around this response.**

---

### 6. `reset_demo` — Resets MED-2026-001 back to ACTIVE
**Who calls this:** Anyone testing, or an admin "Reset Demo" button

```javascript
const { data } = await supabase.rpc('reset_demo');
```

No parameters. Wipes MED-2026-001's events/returns/certificates/alerts, resets to `ACTIVE`, quantity 100.

---

## Read Functions (dashboards, no state change)

### 7. `get_batch_timeline` — Full event history for one batch
**Who calls this:** Afreen (batch detail / timeline component)

```javascript
const { data } = await supabase.rpc('get_batch_timeline', {
  p_batch_number: 'MED-2026-001'
});
```

**Response:** `{ "data": { "batch_number": "...", "events": [ { "event_type": "...", "organization_id": "...", "quantity": ..., "location": "...", "metadata": ..., "timestamp": "..." }, ... ] } }`

Events ordered oldest → newest. `events` always an array (empty if none).

**Fails if:** batch doesn't exist.

---

### 8. `get_authority_dashboard_stats` — KPI numbers for Command Center
**Who calls this:** Afreen (dashboard KPI cards)

```javascript
const { data } = await supabase.rpc('get_authority_dashboard_stats');
```

**Response:**
```json
{
  "data": {
    "total_batches": 16, "expiring_soon": 2, "expired": 2,
    "in_reverse_chain": 3, "pending_destruction": 3, "destroyed": 1,
    "fraud_alerts_open": 1, "disputes_open": 0
  }
}
```
No parameters.

---

### 9. `get_fraud_alert_detail` — Full evidence for one fraud alert
**Who calls this:** Afreen / Syed (evidence drawer when clicking an alert)

```javascript
const { data } = await supabase.rpc('get_fraud_alert_detail', {
  p_alert_id: 'uuid-of-the-alert'
});
```

**Response:** `{ "data": { "alert_type": "...", "risk_score": 90, "description": "...", "detected_location": "...", "status": "OPEN", "batch_number": "...", "medicine_name": "...", "current_status": "...", "timeline": [...] } }`

**Fails if:** alert ID doesn't exist.

---

## Direct table reads (no function needed)

**Get all open fraud alerts (for the alert list, before clicking into detail):**
```javascript
const { data } = await supabase
  .from('fraud_alerts')
  .select('*, batches(batch_number, medicine_name)')
  .eq('status', 'OPEN')
  .order('detected_at', { ascending: false });
```

**Get all batches with a specific status:**
```javascript
const { data } = await supabase
  .from('batches')
  .select('*')
  .eq('status', 'EXPIRING_SOON');
```

**Look up a batch by number (retailer search/scan input):**
```javascript
const { data } = await supabase
  .from('batches')
  .select('*')
  .eq('batch_number', batchNumberInput)
  .single();
```

---

## Reference data
MedPlus Pharmacy (Retailer): 11111111-1111-1111-1111-111111111111
Apollo Pharmacy (Retailer): 22222222-2222-2222-2222-222222222222
SunRise Distributors: 33333333-3333-3333-3333-333333333333
CarePlus Pharma Ltd (Mfr): 44444444-4444-4444-4444-444444444444
GreenCycle Waste Facility: 55555555-5555-5555-5555-555555555555
State Drug Control Authority: 66666666-6666-6666-6666-666666666666

Hero batch: MED-2026-001 (OncoSafe 500)


**Demo logins:**

retailer@medtrace.demo
distributor@medtrace.demo
manufacturer@medtrace.demo
authority@medtrace.demo


---

## Rules

- Field names are frozen: `batch_number`, not `batchNo`/`batchCode`
- Need a new field or table? Ask Munna first
- Test against `MED-2026-001` — the shared hero batch
- If your testing messes up the demo state, call `reset_demo()`