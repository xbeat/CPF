-- CPF Detection Engine - Raw Events Schema
-- TimescaleDB hypertable for all event types

-- Create TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Raw events table (all event types: email, auth, alert, ticket)
CREATE TABLE IF NOT EXISTS raw_events (
  time TIMESTAMPTZ NOT NULL,
  org_id TEXT NOT NULL,
  event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,  -- 'email', 'auth', 'alert', 'ticket'
  source_system TEXT,         -- 'exchange', 'ad', 'siem', 'servicenow', 'simulator'

  -- Event data (JSONB for flexibility)
  data JSONB NOT NULL,

  -- Metadata
  ingested_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ground truth (if this is an injected signal for testing)
  _ground_truth JSONB,  -- {indicator, signal_strength, should_detect}

  PRIMARY KEY (time, org_id, event_id)
);

-- Convert to hypertable (TimescaleDB magic for time-series optimization)
SELECT create_hypertable('raw_events', 'time', if_not_exists => TRUE);

-- Create indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_raw_events_org
  ON raw_events (org_id, time DESC);

CREATE INDEX IF NOT EXISTS idx_raw_events_type
  ON raw_events (event_type, time DESC);

CREATE INDEX IF NOT EXISTS idx_raw_events_source
  ON raw_events (source_system, time DESC);

CREATE INDEX IF NOT EXISTS idx_raw_events_org_type
  ON raw_events (org_id, event_type, time DESC);

-- GIN index for JSONB queries (allows fast JSON field searches)
CREATE INDEX IF NOT EXISTS idx_raw_events_data
  ON raw_events USING GIN (data);

CREATE INDEX IF NOT EXISTS idx_raw_events_ground_truth
  ON raw_events USING GIN (_ground_truth)
  WHERE _ground_truth IS NOT NULL;

-- Retention policy: raw events kept for 90 days
-- After 90 days, old data automatically deleted
SELECT add_retention_policy('raw_events', INTERVAL '90 days', if_not_exists => TRUE);

-- Compression policy: compress chunks older than 7 days
-- Saves 90%+ storage space
ALTER TABLE raw_events SET (
  timescaledb.compress,
  timescaledb.compress_segmentby = 'org_id,event_type'
);

SELECT add_compression_policy('raw_events', INTERVAL '7 days', if_not_exists => TRUE);

-- Comments for documentation
COMMENT ON TABLE raw_events IS 'Time-series storage for all CPF events (emails, auth, alerts, tickets). Hypertable optimized for high-volume ingestion.';
COMMENT ON COLUMN raw_events.time IS 'Event timestamp (when event occurred, not when ingested)';
COMMENT ON COLUMN raw_events.event_type IS 'Type: email, auth, alert, ticket';
COMMENT ON COLUMN raw_events.data IS 'Full event data as JSONB for flexibility';
COMMENT ON COLUMN raw_events._ground_truth IS 'For testing: marks signals injected by simulator with expected indicator and strength';
