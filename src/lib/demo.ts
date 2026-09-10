export const demoBatch = { id: "MED-2026-001", medicine: "OncoSafe 500", quantity: "100 units", expiry: "30 Jun 2026" };

export const traceStages = [
  { title: "Pharmacy", location: "Pharmacy A", status: "EXPIRED", event: "Expired stock identified", date: "30 JUN 2026", description: "Expired inventory is separated from saleable stock. The batch begins its return journey with its identity intact.", evidence: "Expiry recorded", eventId: "EVT-001" },
  { title: "Distributor", location: "Regional Distributor", status: "RETURN RECEIVED", event: "Return received and reconciled", date: "02 JUL 2026", description: "The receiving distributor reconciles all 100 units against the original batch. A new handoff, the same trace.", evidence: "100 / 100 units reconciled", eventId: "EVT-002" },
  { title: "Manufacturer", location: "Manufacturer Facility", status: "VERIFIED", event: "Batch identity verified", date: "04 JUL 2026", description: "The manufacturer verifies the returned batch and releases it for disposal through an authorized waste facility.", evidence: "Disposal authorized", eventId: "EVT-003" },
  { title: "Authorized Waste Facility", location: "Authorized Waste Facility", status: "AWAITING DESTRUCTION", event: "Custody accepted for disposal", date: "06 JUL 2026", description: "The authorized facility accepts custody. The batch remains accounted for while it awaits verified destruction.", evidence: "Custody recorded", eventId: "EVT-004" },
  { title: "Verified Destruction", location: "Authorized Waste Facility", status: "DESTROYED", event: "Destruction evidence attached", date: "07 JUL 2026", description: "Destruction closes the physical journey, not the record. Evidence remains attached to the batch for every future verification.", evidence: "Certificate linked", eventId: "EVT-005" },
] as const;

export const demoRoles = ["Authority", "Manufacturer", "Distributor", "Retailer"] as const;
export type DemoRole = typeof demoRoles[number];
export const demoPassword = "Medtrace@2026";
export function demoEmail(role: DemoRole) { return `${role.toLowerCase()}@demo.medtrace.com`; }