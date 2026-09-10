-- FRAUD RE-ENTRY DETECTION — the core function
CREATE OR REPLACE FUNCTION check_batch_reentry(p_batch_number TEXT, p_location TEXT DEFAULT 'Unknown')
RETURNS JSONB AS $$
DECLARE
  v_batch batches%ROWTYPE;
BEGIN
  SELECT * INTO v_batch FROM batches WHERE batch_number = p_batch_number;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('result', 'UNKNOWN_BATCH'), 'error', null);
  END IF;

  IF v_batch.status = 'DESTROYED' THEN
    INSERT INTO fraud_alerts (batch_id, alert_type, risk_score, description, detected_location, status)
    VALUES (v_batch.id, 'DESTROYED_BATCH_REENTRY', 90, 'Destroyed batch scanned again at ' || p_location, p_location, 'OPEN');

    INSERT INTO batch_events (batch_id, event_type, location, metadata)
    VALUES (v_batch.id, 'REENTRY_DETECTED', p_location, jsonb_build_object('batch_number', p_batch_number));

    UPDATE batches SET status = 'FRAUD_ALERT', updated_at = now() WHERE id = v_batch.id;

    RETURN jsonb_build_object('success', true, 'data', jsonb_build_object(
      'result', 'FRAUD',
      'batch_number', p_batch_number,
      'medicine_name', v_batch.medicine_name,
      'message', 'Destroyed batch re-entry detected'
    ), 'error', null);
  END IF;

  IF v_batch.status = 'PENDING_DESTRUCTION' THEN
    RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('result', 'WARNING', 'message', 'Batch pending destruction'), 'error', null);
  END IF;

  IF v_batch.status = 'EXPIRED' THEN
    RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('result', 'EXPIRED', 'message', 'Batch is expired'), 'error', null);
  END IF;

  RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('result', 'VALID', 'status', v_batch.status), 'error', null);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- CREATE RETURN — retailer flags expired stock
CREATE OR REPLACE FUNCTION create_return(
  p_batch_number TEXT,
  p_retailer_id UUID,
  p_distributor_id UUID,
  p_expected_quantity INTEGER,
  p_reason TEXT DEFAULT 'Expired stock'
)
RETURNS JSONB AS $$
DECLARE
  v_batch batches%ROWTYPE;
  v_return_id UUID;
BEGIN
  SELECT * INTO v_batch FROM batches WHERE batch_number = p_batch_number;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'data', null, 'error', 'Batch not found');
  END IF;

  IF v_batch.status NOT IN ('ACTIVE', 'EXPIRING_SOON', 'EXPIRED') THEN
    RETURN jsonb_build_object('success', false, 'data', null, 'error', format('Batch is in %s state, not eligible for return', v_batch.status));
  END IF;

  INSERT INTO returns (batch_id, retailer_id, distributor_id, expected_quantity, status, return_reason)
  VALUES (v_batch.id, p_retailer_id, p_distributor_id, p_expected_quantity, 'REQUESTED', p_reason)
  RETURNING id INTO v_return_id;

  UPDATE batches SET status = 'RETURN_REQUESTED', updated_at = now() WHERE id = v_batch.id;

  INSERT INTO batch_events (batch_id, event_type, organization_id, quantity)
  VALUES (v_batch.id, 'RETURN_CREATED', p_retailer_id, p_expected_quantity);

  RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('return_id', v_return_id, 'status', 'RETURN_REQUESTED'), 'error', null);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- DISTRIBUTOR CONFIRMS RECEIPT (with quantity mismatch check) — FIXED with status guard
CREATE OR REPLACE FUNCTION confirm_distributor_receipt(
  p_batch_number TEXT,
  p_received_quantity INTEGER
)
RETURNS JSONB AS $$
DECLARE
  v_batch batches%ROWTYPE;
  v_return returns%ROWTYPE;
  v_final_status return_status;
  v_batch_status batch_status;
BEGIN
  SELECT * INTO v_batch FROM batches WHERE batch_number = p_batch_number;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'data', null, 'error', 'Batch not found');
  END IF;

  IF v_batch.status != 'RETURN_REQUESTED' THEN
    RETURN jsonb_build_object('success', false, 'data', null, 'error', format('Batch is in %s state, cannot confirm receipt', v_batch.status));
  END IF;

  SELECT * INTO v_return FROM returns WHERE batch_id = v_batch.id ORDER BY created_at DESC LIMIT 1;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'data', null, 'error', 'No return request found for this batch');
  END IF;

  IF p_received_quantity != v_return.expected_quantity THEN
    v_final_status := 'DISPUTED';
    v_batch_status := 'DISPUTED';
  ELSE
    v_final_status := 'RECEIVED';
    v_batch_status := 'DISTRIBUTOR_RECEIVED';
  END IF;

  UPDATE returns SET received_quantity = p_received_quantity, status = v_final_status, updated_at = now() WHERE id = v_return.id;
  UPDATE batches SET status = v_batch_status, updated_at = now() WHERE id = v_batch.id;

  INSERT INTO batch_events (batch_id, event_type, organization_id, quantity)
  VALUES (v_batch.id, 'DISTRIBUTOR_RECEIVED', v_return.distributor_id, p_received_quantity);

  IF v_final_status = 'DISPUTED' THEN
    INSERT INTO batch_events (batch_id, event_type, metadata)
    VALUES (v_batch.id, 'DISPUTE_CREATED', jsonb_build_object('expected', v_return.expected_quantity, 'received', p_received_quantity));

    INSERT INTO fraud_alerts (batch_id, alert_type, risk_score, description, status)
    VALUES (v_batch.id, 'QUANTITY_DISCREPANCY', 20, format('Expected %s, received %s', v_return.expected_quantity, p_received_quantity), 'OPEN');
  END IF;

  RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('status', v_batch_status, 'return_status', v_final_status), 'error', null);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- MANUFACTURER RECEIVES BATCH — FIXED with status guard
CREATE OR REPLACE FUNCTION mark_manufacturer_received(p_batch_number TEXT)
RETURNS JSONB AS $$
DECLARE
  v_batch batches%ROWTYPE;
BEGIN
  SELECT * INTO v_batch FROM batches WHERE batch_number = p_batch_number;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'data', null, 'error', 'Batch not found');
  END IF;

  IF v_batch.status != 'DISTRIBUTOR_RECEIVED' THEN
    RETURN jsonb_build_object('success', false, 'data', null, 'error', format('Batch is in %s state, cannot mark manufacturer received', v_batch.status));
  END IF;

  UPDATE batches SET status = 'MANUFACTURER_RECEIVED', updated_at = now() WHERE id = v_batch.id;

  INSERT INTO batch_events (batch_id, event_type, organization_id)
  VALUES (v_batch.id, 'MANUFACTURER_RECEIVED', v_batch.manufacturer_id);

  RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('status', 'MANUFACTURER_RECEIVED'), 'error', null);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- MARK BATCH DESTROYED — error message now shows actual current status for debugging
CREATE OR REPLACE FUNCTION mark_batch_destroyed(
  p_batch_number TEXT,
  p_certificate_number TEXT,
  p_facility_id UUID,
  p_quantity_destroyed INTEGER,
  p_document_url TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_batch batches%ROWTYPE;
  v_verification verification_status;
BEGIN
  SELECT * INTO v_batch FROM batches WHERE batch_number = p_batch_number;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'data', null, 'error', 'Batch not found');
  END IF;

  IF v_batch.status != 'MANUFACTURER_RECEIVED' THEN
    RETURN jsonb_build_object('success', false, 'data', null, 'error',
      format('Batch must be received by manufacturer before destruction (current status: %s)', v_batch.status));
  END IF;

  v_verification := CASE WHEN p_quantity_destroyed = v_batch.current_quantity THEN 'VERIFIED' ELSE 'MISMATCH' END;

  INSERT INTO destruction_certificates (batch_id, certificate_number, facility_id, quantity_destroyed, destruction_date, document_url, verification_status)
  VALUES (v_batch.id, p_certificate_number, p_facility_id, p_quantity_destroyed, CURRENT_DATE, p_document_url, v_verification);

  UPDATE batches SET status = 'DESTROYED', updated_at = now() WHERE id = v_batch.id;

  INSERT INTO batch_events (batch_id, event_type, organization_id, quantity)
  VALUES (v_batch.id, 'DESTROYED', p_facility_id, p_quantity_destroyed);

  IF v_verification = 'MISMATCH' THEN
    INSERT INTO fraud_alerts (batch_id, alert_type, risk_score, description, status)
    VALUES (v_batch.id, 'CERTIFICATE_MISMATCH', 20, format('Certificate claims %s destroyed, batch had %s', p_quantity_destroyed, v_batch.current_quantity), 'OPEN');
  END IF;

  RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('status', 'DESTROYED', 'verification', v_verification), 'error', null);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- RESET DEMO — restores MED-2026-001 to ACTIVE for repeated demo/rehearsal runs
CREATE OR REPLACE FUNCTION reset_demo()
RETURNS JSONB AS $$
DECLARE
  v_batch_id UUID;
BEGIN
  SELECT id INTO v_batch_id FROM batches WHERE batch_number = 'MED-2026-001';

  DELETE FROM fraud_alerts WHERE batch_id = v_batch_id;
  DELETE FROM batch_events WHERE batch_id = v_batch_id;
  DELETE FROM destruction_certificates WHERE batch_id = v_batch_id;
  DELETE FROM returns WHERE batch_id = v_batch_id;

  UPDATE batches SET status = 'ACTIVE', current_quantity = quantity, updated_at = now() WHERE id = v_batch_id;

  INSERT INTO batch_events (batch_id, event_type, organization_id, quantity, location)
  VALUES (v_batch_id, 'MANUFACTURED', '44444444-4444-4444-4444-444444444444', 100, 'Hyderabad');

  RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('message', 'MED-2026-001 reset to ACTIVE'), 'error', null);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;