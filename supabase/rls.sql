-- HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_my_org()
RETURNS UUID AS $$
  SELECT organization_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ENABLE RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE destruction_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_alerts ENABLE ROW LEVEL SECURITY;

-- ORGANIZATIONS
CREATE POLICY "Anyone authenticated can view organizations"
  ON organizations FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only authority can modify organizations"
  ON organizations FOR ALL TO authenticated USING (get_my_role() = 'AUTHORITY');

-- PROFILES
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT TO authenticated USING (id = auth.uid() OR get_my_role() = 'AUTHORITY');

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE TO authenticated USING (id = auth.uid());

-- BATCHES
CREATE POLICY "Anyone authenticated can view batches"
  ON batches FOR SELECT TO authenticated USING (true);

CREATE POLICY "Retailer, distributor, manufacturer, authority can update batches"
  ON batches FOR UPDATE TO authenticated USING (get_my_role() IN ('RETAILER', 'DISTRIBUTOR', 'MANUFACTURER', 'AUTHORITY'));

CREATE POLICY "Manufacturer or authority can insert batches"
  ON batches FOR INSERT TO authenticated WITH CHECK (get_my_role() IN ('MANUFACTURER', 'AUTHORITY'));

-- BATCH EVENTS
CREATE POLICY "Anyone authenticated can view batch events"
  ON batch_events FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert batch events"
  ON batch_events FOR INSERT TO authenticated WITH CHECK (true);

-- RETURNS
CREATE POLICY "View returns relevant to your org"
  ON returns FOR SELECT TO authenticated
  USING (retailer_id = get_my_org() OR distributor_id = get_my_org() OR get_my_role() = 'AUTHORITY');

CREATE POLICY "Retailer can create returns for their org"
  ON returns FOR INSERT TO authenticated
  WITH CHECK (retailer_id = get_my_org() OR get_my_role() = 'AUTHORITY');

CREATE POLICY "Distributor can update returns assigned to them"
  ON returns FOR UPDATE TO authenticated
  USING (distributor_id = get_my_org() OR get_my_role() = 'AUTHORITY');

-- DESTRUCTION CERTIFICATES
CREATE POLICY "View certificates relevant to your org"
  ON destruction_certificates FOR SELECT TO authenticated
  USING (facility_id = get_my_org() OR get_my_role() IN ('MANUFACTURER', 'AUTHORITY'));

CREATE POLICY "Manufacturer can create certificates"
  ON destruction_certificates FOR INSERT TO authenticated
  WITH CHECK (get_my_role() IN ('MANUFACTURER', 'AUTHORITY'));

-- FRAUD ALERTS
CREATE POLICY "Anyone authenticated can view fraud alerts"
  ON fraud_alerts FOR SELECT TO authenticated USING (true);

CREATE POLICY "System can insert fraud alerts"
  ON fraud_alerts FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Only authority can update alert status"
  ON fraud_alerts FOR UPDATE TO authenticated USING (get_my_role() = 'AUTHORITY');