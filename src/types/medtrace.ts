export type OrgType = 'RETAILER' | 'DISTRIBUTOR' | 'MANUFACTURER' | 'WASTE_FACILITY';
export type UserRole = 'RETAILER' | 'DISTRIBUTOR' | 'MANUFACTURER' | 'WASTE_FACILITY';

export type BatchStatus =
  | 'ACTIVE'
  | 'EXPIRING_SOON'
  | 'EXPIRED'
  | 'RETURN_REQUESTED'
  | 'DISTRIBUTOR_RECEIVED'
  | 'MANUFACTURER_RECEIVED'
  | 'PENDING_DESTRUCTION'
  | 'DESTROYED'
  | 'DISPUTED'
  | 'FRAUD_ALERT';

export type EventType =
  | 'MANUFACTURED'
  | 'EXPIRY_WARNING'
  | 'EXPIRED'
  | 'RETURN_CREATED'
  | 'PICKUP_ASSIGNED'
  | 'DISTRIBUTOR_RECEIVED'
  | 'MANUFACTURER_RECEIVED'
  | 'SENT_FOR_DESTRUCTION'
  | 'DESTROYED'
  | 'REENTRY_DETECTED'
  | 'DISPUTE_CREATED'
  | 'TRUST_GATE_BLOCK';

export type ReturnStatus = 'REQUESTED' | 'PICKUP_ASSIGNED' | 'RECEIVED' | 'DISPUTED' | 'RESOLVED' | 'COMPLETED';
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'MISMATCH' | 'REJECTED';

export type AlertType =
  | 'DESTROYED_BATCH_REENTRY'
  | 'QUANTITY_DISCREPANCY'
  | 'CERTIFICATE_MISMATCH'
  | 'DUPLICATE_BATCH'
  | 'SUSPICIOUS_ACTIVITY'
  | 'IDENTITY_MISMATCH'
  | 'UNKNOWN_PACKAGE';

export type AlertStatus = 'OPEN' | 'INVESTIGATING' | 'DISMISSED' | 'ESCALATED' | 'RESOLVED';
export type TrustGateDecision = 'ALLOW' | 'WARNING' | 'INVESTIGATE' | 'BLOCK';

export interface Organization {
  id: string;
  name: string;
  type: OrgType;
  location: string;
  created_at?: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization_id?: string;
  organization?: Organization;
  created_at?: string;
}

export interface Batch {
  id: string;
  batch_number: string;
  medicine_name: string;
  manufacturer_id: string;
  quantity: number;
  current_quantity: number;
  expiry_date: string;
  status: BatchStatus;
  created_at: string;
  updated_at: string;
  manufacturer?: Organization;
}

export interface QrPayload {
  gtin: string;
  batch: string;
  serial: string;
  expiry: string;
}

export interface PackageItem {
  id: string;
  batch_id: string;
  serial_number: string;
  qr_payload: QrPayload;
  status: string;
  current_organization_id?: string;
  created_at: string;
  updated_at: string;
}

export interface BatchEvent {
  id: string;
  batch_id: string;
  event_type: EventType;
  actor_id?: string;
  organization_id?: string;
  quantity?: number;
  location?: string;
  metadata?: Record<string, any>;
  timestamp: string;
  organization?: Organization;
}

export interface ReturnRequest {
  id: string;
  batch_id: string;
  retailer_id: string;
  distributor_id: string;
  expected_quantity: number;
  received_quantity?: number;
  status: ReturnStatus;
  return_reason?: string;
  created_at: string;
  updated_at: string;
  batch?: Batch;
  retailer?: Organization;
  distributor?: Organization;
}

export interface DestructionCertificate {
  id: string;
  batch_id: string;
  certificate_number: string;
  facility_id: string;
  quantity_destroyed: number;
  destruction_date: string;
  document_url?: string;
  verification_status: VerificationStatus;
  created_at: string;
  facility?: Organization;
  batch?: Batch;
}

export interface FraudAlert {
  id: string;
  batch_id: string;
  alert_type: AlertType;
  risk_score: number;
  description: string;
  detected_location?: string;
  status: AlertStatus;
  detected_at: string;
  batch?: Batch;
}

export interface TrustGateCheckItem {
  key: string;
  label: string;
  passed: boolean;
  details?: string;
}

export interface TrustGateScanResult {
  decision: TrustGateDecision;
  risk_score: number;
  batch_number: string;
  serial_number?: string;
  medicine_name?: string;
  status?: BatchStatus;
  reason?: string;
  checks: TrustGateCheckItem[];
  alert?: FraudAlert;
  batch?: Batch;
}

export interface ManufacturerStats {
  total_batches: number;
  active_batches: number;
  expiring_soon: number;
  expired: number;
  in_reverse_chain: number;
  pending_destruction: number;
  destroyed: number;
  fraud_alerts_open: number;
  disputes_open: number;
}
