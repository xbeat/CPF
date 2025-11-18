-- CPF Detection Engine - Detection Results Schema
-- Stores output from detection algorithms

CREATE TABLE IF NOT EXISTS detection_results (
  time TIMESTAMPTZ NOT NULL,
  org_id TEXT NOT NULL,
  indicator_id TEXT NOT NULL,

  -- Scores
  score DOUBLE PRECISION NOT NULL,           -- Final temporal-adjusted score [0,1]
  raw_score DOUBLE PRECISION,                -- Before temporal decay
  confidence DOUBLE PRECISION,               -- Based on sample size

  -- Components (from Di = w1·Ri + w2·Ai + w3·Ci)
  rule_based_score DOUBLE PRECISION,         -- Ri
  anomaly_score DOUBLE PRECISION,            -- Ai (Mahalanobis)
  context_score DOUBLE PRECISION,            -- Ci (Bayesian)

  -- Observations that were analyzed
  observations JSONB NOT NULL,

  -- Baseline comparison
  baseline_mean DOUBLE PRECISION,
  baseline_std DOUBLE PRECISION,
  sigmas_above_baseline DOUBLE PRECISION,    -- How many σ above baseline

  -- Metadata
  triggered BOOLEAN NOT NULL,                 -- score > threshold?
  severity TEXT,                              -- 'low', 'medium', 'high', 'critical'

  -- Raw event references (for drill-down)
  raw_event_ids TEXT[],
  event_count INTEGER,

  PRIMARY KEY (time, org_id, indicator_id)
);

-- Convert to hypertable
SELECT create_hypertable('detection_results', 'time', if_not_exists => TRUE);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_detection_org
  ON detection_results (org_id, time DESC);

CREATE INDEX IF NOT EXISTS idx_detection_indicator
  ON detection_results (indicator_id, time DESC);

CREATE INDEX IF NOT EXISTS idx_detection_triggered
  ON detection_results (org_id, time DESC)
  WHERE triggered = TRUE;

CREATE INDEX IF NOT EXISTS idx_detection_severity
  ON detection_results (severity, time DESC)
  WHERE severity IN ('high', 'critical');

-- Retention: keep detection results for 1 year
SELECT add_retention_policy('detection_results', INTERVAL '365 days', if_not_exists => TRUE);

-- Compression after 30 days
ALTER TABLE detection_results SET (
  timescaledb.compress,
  timescaledb.compress_segmentby = 'org_id,indicator_id'
);

SELECT add_compression_policy('detection_results', INTERVAL '30 days', if_not_exists => TRUE);

-- Continuous aggregate: 1-hour summary
CREATE MATERIALIZED VIEW IF NOT EXISTS detection_results_1h
WITH (timescaledb.continuous) AS
SELECT
  time_bucket('1 hour', time) AS bucket,
  org_id,
  indicator_id,
  AVG(score) AS avg_score,
  MAX(score) AS max_score,
  STDDEV(score) AS score_volatility,
  COUNT(*) FILTER (WHERE triggered) AS trigger_count,
  AVG(sigmas_above_baseline) AS avg_sigmas,
  AVG(confidence) AS avg_confidence
FROM detection_results
GROUP BY bucket, org_id, indicator_id;

-- Refresh policy: update every 30 minutes
SELECT add_continuous_aggregate_policy('detection_results_1h',
  start_offset => INTERVAL '2 hours',
  end_offset => INTERVAL '30 minutes',
  schedule_interval => INTERVAL '30 minutes',
  if_not_exists => TRUE
);

-- Comments
COMMENT ON TABLE detection_results IS 'Time-series of detection algorithm outputs. One row per indicator per detection cycle.';
COMMENT ON COLUMN detection_results.score IS 'Final detection score [0,1] after temporal decay';
COMMENT ON COLUMN detection_results.sigmas_above_baseline IS 'Standard deviations above baseline - key metric for anomaly strength';
COMMENT ON COLUMN detection_results.raw_event_ids IS 'Array of event IDs that contributed to this detection (for drill-down)';
