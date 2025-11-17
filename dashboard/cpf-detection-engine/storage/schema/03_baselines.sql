-- CPF Detection Engine - Baselines Schema
-- Stores calibrated baselines for each organization and indicator

CREATE TABLE IF NOT EXISTS baselines (
  org_id TEXT NOT NULL,
  indicator_id TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,

  -- Calibration period
  calibration_start TIMESTAMPTZ NOT NULL,
  calibration_end TIMESTAMPTZ NOT NULL,
  sample_size INTEGER NOT NULL,

  -- Statistical parameters (arrays for multi-dimensional observations)
  mean_vector DOUBLE PRECISION[] NOT NULL,
  std_vector DOUBLE PRECISION[] NOT NULL,
  covariance_matrix DOUBLE PRECISION[][] NOT NULL,

  -- Distribution info
  distribution_type TEXT,  -- 'normal', 'exponential', 'poisson', 'unknown'

  -- Percentiles for threshold setting
  p50 DOUBLE PRECISION,
  p75 DOUBLE PRECISION,
  p90 DOUBLE PRECISION,
  p95 DOUBLE PRECISION,
  p99 DOUBLE PRECISION,

  -- Detection parameters
  threshold_k DOUBLE PRECISION DEFAULT 2.0,  -- For μ + k·σ
  threshold_value DOUBLE PRECISION,

  -- Weights for detection formula: Di = w1·Ri + w2·Ai + w3·Ci
  weights JSONB,  -- {w1: 0.4, w2: 0.4, w3: 0.2}

  -- Temporal parameters
  persistence_tau INTEGER,  -- seconds - from config or calibrated
  circadian_params JSONB,   -- {E0, A, phi} - if circadian pattern detected

  -- Bayesian priors for context scoring
  priors JSONB,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,

  PRIMARY KEY (org_id, indicator_id, version)
);

-- Index for fetching active baselines (most common query)
CREATE INDEX IF NOT EXISTS idx_baselines_active
  ON baselines (org_id, indicator_id)
  WHERE is_active = TRUE;

-- Index for version history queries
CREATE INDEX IF NOT EXISTS idx_baselines_versions
  ON baselines (org_id, indicator_id, version DESC);

-- Function to automatically set updated_at on updates
CREATE OR REPLACE FUNCTION update_baseline_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER baseline_updated_at
  BEFORE UPDATE ON baselines
  FOR EACH ROW
  EXECUTE FUNCTION update_baseline_timestamp();

-- Comments
COMMENT ON TABLE baselines IS 'Calibrated statistical baselines for each org/indicator pair. Used for anomaly detection.';
COMMENT ON COLUMN baselines.mean_vector IS 'Mean values for each observable (e.g., [complianceRate_mean, verificationRate_mean])';
COMMENT ON COLUMN baselines.covariance_matrix IS 'Covariance matrix for multi-dimensional Mahalanobis distance calculation';
COMMENT ON COLUMN baselines.threshold_k IS 'Multiplier for threshold: threshold = mean + k*std (typically 2.0 for 2-sigma)';
COMMENT ON COLUMN baselines.weights IS 'Detection weights: w1=rule-based, w2=anomaly, w3=context';
COMMENT ON COLUMN baselines.persistence_tau IS 'Temporal decay half-life in seconds for Ti(t) = α·Xi(t) + (1-α)·Ti(t-1)';
