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
  | 'ALERT_ESCALATED'
  | 'ALERT_DISMISSED';

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
}

export interface BatchEvent {
  id: string;
  batch_id: string;
  event_type: EventType;
  actor_id: string;
  organization_id: string;
  quantity: number;
  timestamp: string;
  location: string;
  metadata?: Record<string, unknown>;
}

export interface DestructionCertificate {
  id: string;
  batch_id: string;
  certificate_number: string;
  facility_id: string;
  quantity_destroyed: number;
  destruction_date: string;
  document_url: string;
  verification_status: 'PENDING' | 'VERIFIED' | 'MISMATCH';
  created_at: string;
}

export interface FraudAlert {
  id: string;
  batch_id: string;
  alert_type: string;
  risk_score: number;
  description: string;
  detected_at: string;
  status: 'OPEN' | 'INVESTIGATING' | 'DISMISSED' | 'ESCALATED' | 'RESOLVED';
  detected_location: string;
}
