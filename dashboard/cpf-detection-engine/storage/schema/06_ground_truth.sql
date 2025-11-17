-- CPF Detection Engine - Ground Truth Schema
-- Tracks injected signals for validation

CREATE TABLE IF NOT EXISTS ground_truth (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL,
  indicator TEXT NOT NULL,

  timestamp TIMESTAMPTZ NOT NULL,
  event_ids TEXT[] NOT NULL,

  signal_strength DOUBLE PRECISION NOT NULL,  -- In standard deviations (sigmas)
  should_detect BOOLEAN NOT NULL,             -- TRUE if signal_strength >= 2.0

  -- Detection outcome (filled after detection runs)
  was_detected BOOLEAN,
  detected_at TIMESTAMPTZ,
  detection_score DOUBLE PRECISION,

  -- Metadata
  injection_method TEXT,                      -- 'authority_compliance', 'alert_fatigue', etc.
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for validation queries
CREATE INDEX IF NOT EXISTS idx_ground_truth_org_indicator
  ON ground_truth (org_id, indicator, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_ground_truth_pending
  ON ground_truth (timestamp)
  WHERE was_detected IS NULL;

CREATE INDEX IF NOT EXISTS idx_ground_truth_detection_outcome
  ON ground_truth (should_detect, was_detected);

-- View for validation metrics (TP, TN, FP, FN)
CREATE OR REPLACE VIEW ground_truth_validation AS
SELECT
  org_id,
  indicator,
  COUNT(*) AS total_signals,
  COUNT(*) FILTER (WHERE should_detect = TRUE AND was_detected = TRUE) AS true_positives,
  COUNT(*) FILTER (WHERE should_detect = FALSE AND was_detected = FALSE) AS true_negatives,
  COUNT(*) FILTER (WHERE should_detect = FALSE AND was_detected = TRUE) AS false_positives,
  COUNT(*) FILTER (WHERE should_detect = TRUE AND was_detected = FALSE) AS false_negatives,
  -- Matthews Correlation Coefficient
  CASE
    WHEN (
      (COUNT(*) FILTER (WHERE should_detect = TRUE AND was_detected = TRUE) + COUNT(*) FILTER (WHERE should_detect = FALSE AND was_detected = TRUE)) *
      (COUNT(*) FILTER (WHERE should_detect = TRUE AND was_detected = TRUE) + COUNT(*) FILTER (WHERE should_detect = TRUE AND was_detected = FALSE)) *
      (COUNT(*) FILTER (WHERE should_detect = FALSE AND was_detected = FALSE) + COUNT(*) FILTER (WHERE should_detect = FALSE AND was_detected = TRUE)) *
      (COUNT(*) FILTER (WHERE should_detect = FALSE AND was_detected = FALSE) + COUNT(*) FILTER (WHERE should_detect = TRUE AND was_detected = FALSE))
    ) > 0
    THEN (
      (COUNT(*) FILTER (WHERE should_detect = TRUE AND was_detected = TRUE) * COUNT(*) FILTER (WHERE should_detect = FALSE AND was_detected = FALSE)) -
      (COUNT(*) FILTER (WHERE should_detect = FALSE AND was_detected = TRUE) * COUNT(*) FILTER (WHERE should_detect = TRUE AND was_detected = FALSE))
    ) / SQRT(
      (COUNT(*) FILTER (WHERE should_detect = TRUE AND was_detected = TRUE) + COUNT(*) FILTER (WHERE should_detect = FALSE AND was_detected = TRUE)) *
      (COUNT(*) FILTER (WHERE should_detect = TRUE AND was_detected = TRUE) + COUNT(*) FILTER (WHERE should_detect = TRUE AND was_detected = FALSE)) *
      (COUNT(*) FILTER (WHERE should_detect = FALSE AND was_detected = FALSE) + COUNT(*) FILTER (WHERE should_detect = FALSE AND was_detected = TRUE)) *
      (COUNT(*) FILTER (WHERE should_detect = FALSE AND was_detected = FALSE) + COUNT(*) FILTER (WHERE should_detect = TRUE AND was_detected = FALSE))
    )
    ELSE NULL
  END AS mcc,
  -- Precision
  CASE
    WHEN (COUNT(*) FILTER (WHERE should_detect = TRUE AND was_detected = TRUE) + COUNT(*) FILTER (WHERE should_detect = FALSE AND was_detected = TRUE)) > 0
    THEN COUNT(*) FILTER (WHERE should_detect = TRUE AND was_detected = TRUE)::DOUBLE PRECISION /
         (COUNT(*) FILTER (WHERE should_detect = TRUE AND was_detected = TRUE) + COUNT(*) FILTER (WHERE should_detect = FALSE AND was_detected = TRUE))
    ELSE NULL
  END AS precision,
  -- Recall
  CASE
    WHEN (COUNT(*) FILTER (WHERE should_detect = TRUE AND was_detected = TRUE) + COUNT(*) FILTER (WHERE should_detect = TRUE AND was_detected = FALSE)) > 0
    THEN COUNT(*) FILTER (WHERE should_detect = TRUE AND was_detected = TRUE)::DOUBLE PRECISION /
         (COUNT(*) FILTER (WHERE should_detect = TRUE AND was_detected = TRUE) + COUNT(*) FILTER (WHERE should_detect = TRUE AND was_detected = FALSE))
    ELSE NULL
  END AS recall
FROM ground_truth
WHERE was_detected IS NOT NULL
GROUP BY org_id, indicator;

-- Comments
COMMENT ON TABLE ground_truth IS 'Tracks injected test signals for validation. Used to calculate MCC, precision, recall.';
COMMENT ON COLUMN ground_truth.signal_strength IS 'Injected signal strength in standard deviations. 2.0 = 2σ above baseline.';
COMMENT ON COLUMN ground_truth.should_detect IS 'TRUE if signal strong enough to be detected (typically >= 2σ)';
COMMENT ON COLUMN ground_truth.was_detected IS 'Filled by validation process after detection runs';
