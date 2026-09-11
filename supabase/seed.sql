-- ORGANIZATIONS
INSERT INTO organizations (id, name, type, location) VALUES
  ('11111111-1111-1111-1111-111111111111', 'MedPlus Pharmacy', 'RETAILER', 'Salem'),
  ('22222222-2222-2222-2222-222222222222', 'Apollo Pharmacy', 'RETAILER', 'Chennai'),
  ('33333333-3333-3333-3333-333333333333', 'SunRise Distributors', 'DISTRIBUTOR', 'Chennai'),
  ('44444444-4444-4444-4444-444444444444', 'CarePlus Pharma Ltd', 'MANUFACTURER', 'Hyderabad'),
  ('55555555-5555-5555-5555-555555555555', 'GreenCycle Waste Facility', 'WASTE_FACILITY', 'Hyderabad'),
  ('66666666-6666-6666-6666-666666666666', 'State Drug Control Authority', 'AUTHORITY', 'Chennai');

-- HERO BATCH
INSERT INTO batches (id, batch_number, medicine_name, manufacturer_id, quantity, current_quantity, expiry_date, status) VALUES
  ('aaaaaaaa-1111-1111-1111-111111111111', 'MED-2026-001', 'OncoSafe 500', '44444444-4444-4444-4444-444444444444', 100, 100, '2026-06-30', 'ACTIVE');

INSERT INTO batch_events (batch_id, event_type, organization_id, quantity, location) VALUES
  ('aaaaaaaa-1111-1111-1111-111111111111', 'MANUFACTURED', '44444444-4444-4444-4444-444444444444', 100, 'Hyderabad');

-- SUPPORTING BATCHES (for realistic dashboards)
INSERT INTO batches (batch_number, medicine_name, manufacturer_id, quantity, current_quantity, expiry_date, status) VALUES
  ('MED-2026-002', 'Paracetamol 500', '44444444-4444-4444-4444-444444444444', 200, 200, '2027-01-15', 'ACTIVE'),
  ('MED-2026-003', 'Amoxicillin 250', '44444444-4444-4444-4444-444444444444', 150, 150, '2026-10-20', 'ACTIVE'),
  ('MED-2026-004', 'Metformin 500', '44444444-4444-4444-4444-444444444444', 300, 300, '2026-09-25', 'EXPIRING_SOON'),
  ('MED-2026-005', 'Insulin Glargine', '44444444-4444-4444-4444-444444444444', 80, 80, '2026-08-30', 'EXPIRING_SOON'),
  ('MED-2026-006', 'Azithromycin 500', '44444444-4444-4444-4444-444444444444', 120, 120, '2026-07-01', 'EXPIRED'),
  ('MED-2026-007', 'Cetirizine 10', '44444444-4444-4444-4444-444444444444', 250, 250, '2026-06-15', 'EXPIRED'),
  ('MED-2026-008', 'Omeprazole 20', '44444444-4444-4444-4444-444444444444', 100, 100, '2026-06-01', 'RETURN_REQUESTED'),
  ('MED-2026-009', 'Losartan 50', '44444444-4444-4444-4444-444444444444', 90, 90, '2026-05-20', 'RETURN_REQUESTED'),
  ('MED-2026-010', 'Atorvastatin 10', '44444444-4444-4444-4444-444444444444', 110, 105, '2026-05-10', 'DISTRIBUTOR_RECEIVED'),
  ('MED-2026-011', 'Ibuprofen 400', '44444444-4444-4444-4444-444444444444', 200, 200, '2026-04-28', 'MANUFACTURER_RECEIVED'),
  ('MED-2026-012', 'Cefixime 200', '44444444-4444-4444-4444-444444444444', 150, 150, '2026-04-15', 'PENDING_DESTRUCTION'),
  ('MED-2026-013', 'Doxycycline 100', '44444444-4444-4444-4444-444444444444', 130, 130, '2026-03-30', 'PENDING_DESTRUCTION'),
  ('MED-2026-014', 'Pantoprazole 40', '44444444-4444-4444-4444-444444444444', 100, 100, '2026-03-01', 'DESTROYED'),
  ('MED-2026-015', 'Clopidogrel 75', '44444444-4444-4444-4444-444444444444', 95, 95, '2026-02-15', 'DESTROYED'),
  ('MED-2026-016', 'Levothyroxine 50', '44444444-4444-4444-4444-444444444444', 100, 92, '2026-06-05', 'DISPUTED');

-- DEMO USER PROFILES (linked to Supabase Auth users)
-- NOTE: these UUIDs are specific to this project's Supabase Auth instance —
-- if rebuilding from scratch, create the 4 auth users first, then update these IDs
INSERT INTO profiles (id, name, email, role, organization_id) VALUES
  ('1b1ec2a6-bf5d-43b3-b822-43f09362819a', 'Retailer Demo', 'retailer@medtrace.demo', 'RETAILER', '11111111-1111-1111-1111-111111111111'),
  ('f953de2f-56da-4c48-9c72-ce8124e78d7a', 'Distributor Demo', 'distributor@medtrace.demo', 'DISTRIBUTOR', '33333333-3333-3333-3333-333333333333'),
  ('00d2a0cf-a9cb-40db-97bf-e53bfb7081c7', 'Manufacturer Demo', 'manufacturer@medtrace.demo', 'MANUFACTURER', '44444444-4444-4444-4444-444444444444'),
  ('ca06a6a6-2506-4dac-aa1e-2191664b5215', 'Authority Demo', 'authority@medtrace.demo', 'AUTHORITY', '66666666-6666-6666-6666-666666666666');