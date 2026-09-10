--Organisations Table
CREATE TYPE org_type AS ENUM ('RETAILER', 'DISTRIBUTOR', 'MANUFACTURER', 'WASTE_FACILITY', 'AUTHORITY');

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type org_type NOT NULL,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
--Profile tables(links to auth users)
CREATE TYPE user_role AS ENUM ('RETAILER', 'DISTRIBUTOR', 'MANUFACTURER', 'AUTHORITY');

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role user_role NOT NULL,
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TYPE batch_status AS ENUM (
  'ACTIVE', 'EXPIRING_SOON', 'EXPIRED', 'RETURN_REQUESTED',
  'DISTRIBUTOR_RECEIVED', 'MANUFACTURER_RECEIVED', 'PENDING_DESTRUCTION',
  'DESTROYED', 'DISPUTED', 'FRAUD_ALERT'
);
INSERT INTO profiles (id, name, email, role, organization_id) VALUES
  ('1b1ec2a6-bf5d-43b3-b822-43f09362819a', 'Retailer Demo', 'retailer@medtrace.demo', 'RETAILER', '11111111-1111-1111-1111-111111111111'),
  ('f953de2f-56da-4c48-9c72-ce8124e78d7a', 'Distributor Demo', 'distributor@medtrace.demo', 'DISTRIBUTOR', '33333333-3333-3333-3333-333333333333'),
  ('00d2a0cf-a9cb-40db-97bf-e53bfb7081c7', 'Manufacturer Demo', 'manufacturer@medtrace.demo', 'MANUFACTURER', '44444444-4444-4444-4444-444444444444'),
  ('ca06a6a6-2506-4dac-aa1e-2191664b5215', 'Authority Demo', 'authority@medtrace.demo', 'AUTHORITY', '66666666-6666-6666-6666-666666666666');
--Batches Table-most important one
CREATE TABLE batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_number TEXT NOT NULL UNIQUE,
  medicine_name TEXT NOT NULL,
  manufacturer_id UUID REFERENCES organizations(id),
  quantity INTEGER NOT NULL,
  current_quantity INTEGER NOT NULL,
  expiry_date DATE NOT NULL,
  status batch_status NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TYPE event_type AS ENUM (
  'MANUFACTURED', 'EXPIRY_WARNING', 'EXPIRED', 'RETURN_CREATED',
  'PICKUP_ASSIGNED', 'DISTRIBUTOR_RECEIVED', 'MANUFACTURER_RECEIVED',
  'SENT_FOR_DESTRUCTION', 'DESTROYED', 'REENTRY_DETECTED', 'DISPUTE_CREATED'
);
--Batch events-append only backbone
CREATE TABLE batch_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  event_type event_type NOT NULL,
  actor_id UUID REFERENCES profiles(id),
  organization_id UUID REFERENCES organizations(id),
  quantity INTEGER,
  location TEXT,
  metadata JSONB,
  timestamp TIMESTAMPTZ DEFAULT now()
);
--Returns Table
CREATE TYPE return_status AS ENUM ('REQUESTED', 'PICKUP_ASSIGNED', 'RECEIVED', 'DISPUTED', 'RESOLVED', 'COMPLETED');

CREATE TABLE returns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  retailer_id UUID REFERENCES organizations(id),
  distributor_id UUID REFERENCES organizations(id),
  expected_quantity INTEGER NOT NULL,
  received_quantity INTEGER,
  status return_status NOT NULL DEFAULT 'REQUESTED',
  return_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
--Destruction certificates
CREATE TYPE verification_status AS ENUM ('PENDING', 'VERIFIED', 'MISMATCH', 'REJECTED');

CREATE TABLE destruction_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  certificate_number TEXT NOT NULL,
  facility_id UUID REFERENCES organizations(id),
  quantity_destroyed INTEGER NOT NULL,
  destruction_date DATE NOT NULL,
  document_url TEXT,
  verification_status verification_status NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT now()
);
--Fraud alerts
CREATE TYPE alert_type AS ENUM ('DESTROYED_BATCH_REENTRY', 'QUANTITY_DISCREPANCY', 'CERTIFICATE_MISMATCH', 'DUPLICATE_BATCH', 'SUSPICIOUS_ACTIVITY');
CREATE TYPE alert_status AS ENUM ('OPEN', 'INVESTIGATING', 'DISMISSED', 'ESCALATED', 'RESOLVED');

CREATE TABLE fraud_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  alert_type alert_type NOT NULL,
  risk_score INTEGER DEFAULT 0,
  description TEXT,
  detected_location TEXT,
  status alert_status NOT NULL DEFAULT 'OPEN',
  detected_at TIMESTAMPTZ DEFAULT now()
);
--Indexes(run after tables exist)
CREATE INDEX idx_batches_batch_number ON batches(batch_number);
CREATE INDEX idx_batches_status ON batches(status);
CREATE INDEX idx_batches_expiry ON batches(expiry_date);
CREATE INDEX idx_batch_events_batch_id ON batch_events(batch_id);
CREATE INDEX idx_returns_batch_id ON returns(batch_id);
CREATE INDEX idx_fraud_alerts_batch_id ON fraud_alerts(batch_id);
CREATE INDEX idx_fraud_alerts_status ON fraud_alerts(status);

SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';