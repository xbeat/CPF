/**
 * TimescaleDB Client
 * Wrapper for PostgreSQL/TimescaleDB connection with helper methods
 */

const { Pool } = require('pg');
require('dotenv').config();

class TimescaleClient {
  constructor(config = {}) {
    this.pool = new Pool({
      host: config.host || process.env.DB_HOST || 'localhost',
      port: config.port || process.env.DB_PORT || 5432,
      database: config.database || process.env.DB_NAME || 'cpf_detection',
      user: config.user || process.env.DB_USER || 'cpf_user',
      password: config.password || process.env.DB_PASSWORD || 'cpf_password',
      max: config.maxConnections || 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.pool.on('error', (err) => {
      console.error('Unexpected database error:', err);
    });
  }

  /**
   * Execute a query
   */
  async query(text, params = []) {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;

      if (duration > 1000) {
        console.warn(`Slow query (${duration}ms): ${text.substring(0, 100)}...`);
      }

      return res;
    } catch (err) {
      console.error('Query error:', err.message);
      console.error('Query:', text);
      throw err;
    }
  }

  /**
   * Batch insert events (optimized for high-volume ingestion)
   */
  async batchInsertEvents(events) {
    if (!events || events.length === 0) return { inserted: 0 };

    const values = events.map((e, idx) => {
      const paramOffset = idx * 7;
      return `($${paramOffset + 1}, $${paramOffset + 2}, $${paramOffset + 3}, $${paramOffset + 4}, $${paramOffset + 5}, $${paramOffset + 6}, $${paramOffset + 7})`;
    }).join(',');

    const params = events.flatMap(e => [
      e.timestamp || new Date(),
      e.orgId,
      e.id,
      e.type,
      e.source || 'simulator',
      JSON.stringify(e.data || e),
      e._groundTruth ? JSON.stringify(e._groundTruth) : null
    ]);

    const query = `
      INSERT INTO raw_events (time, org_id, event_id, event_type, source_system, data, _ground_truth)
      VALUES ${values}
      ON CONFLICT (time, org_id, event_id) DO NOTHING
    `;

    try {
      const result = await this.query(query, params);
      return { inserted: result.rowCount };
    } catch (err) {
      console.error('Batch insert failed:', err.message);
      throw err;
    }
  }

  /**
   * Get events by type and time range
   */
  async getEvents(orgId, eventType, startTime, endTime = new Date()) {
    const query = `
      SELECT
        time,
        event_id,
        data,
        _ground_truth
      FROM raw_events
      WHERE org_id = $1
        AND event_type = $2
        AND time >= $3
        AND time <= $4
      ORDER BY time DESC
    `;

    const result = await this.query(query, [orgId, eventType, startTime, endTime]);
    return result.rows;
  }

  /**
   * Insert or update baseline
   */
  async upsertBaseline(baseline) {
    const query = `
      INSERT INTO baselines (
        org_id, indicator_id, version,
        calibration_start, calibration_end, sample_size,
        mean_vector, std_vector, covariance_matrix,
        distribution_type, p50, p75, p90, p95, p99,
        threshold_k, threshold_value, weights,
        persistence_tau, circadian_params, priors,
        is_active
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21, $22
      )
      ON CONFLICT (org_id, indicator_id, version)
      DO UPDATE SET
        calibration_end = EXCLUDED.calibration_end,
        sample_size = EXCLUDED.sample_size,
        mean_vector = EXCLUDED.mean_vector,
        std_vector = EXCLUDED.std_vector,
        covariance_matrix = EXCLUDED.covariance_matrix,
        threshold_value = EXCLUDED.threshold_value,
        weights = EXCLUDED.weights,
        updated_at = NOW()
      RETURNING *
    `;

    const params = [
      baseline.org_id,
      baseline.indicator_id,
      baseline.version || 1,
      baseline.calibration_start,
      baseline.calibration_end,
      baseline.sample_size,
      baseline.mean_vector,
      baseline.std_vector,
      baseline.covariance_matrix,
      baseline.distribution_type || 'normal',
      baseline.p50, baseline.p75, baseline.p90, baseline.p95, baseline.p99,
      baseline.threshold_k || 2.0,
      baseline.threshold_value,
      JSON.stringify(baseline.weights),
      baseline.persistence_tau,
      baseline.circadian_params ? JSON.stringify(baseline.circadian_params) : null,
      baseline.priors ? JSON.stringify(baseline.priors) : null,
      baseline.is_active !== false
    ];

    const result = await this.query(query, params);
    return result.rows[0];
  }

  /**
   * Get active baseline for org/indicator
   */
  async getBaseline(orgId, indicatorId) {
    const query = `
      SELECT *
      FROM baselines
      WHERE org_id = $1
        AND indicator_id = $2
        AND is_active = TRUE
      ORDER BY version DESC
      LIMIT 1
    `;

    const result = await this.query(query, [orgId, indicatorId]);

    if (result.rows.length === 0) return null;

    const row = result.rows[0];

    // Parse JSONB fields
    return {
      ...row,
      weights: typeof row.weights === 'string' ? JSON.parse(row.weights) : row.weights,
      circadian_params: row.circadian_params ?
        (typeof row.circadian_params === 'string' ? JSON.parse(row.circadian_params) : row.circadian_params) : null,
      priors: row.priors ?
        (typeof row.priors === 'string' ? JSON.parse(row.priors) : row.priors) : null
    };
  }

  /**
   * Insert detection result
   */
  async insertDetectionResult(result) {
    const query = `
      INSERT INTO detection_results (
        time, org_id, indicator_id,
        score, raw_score, confidence,
        rule_based_score, anomaly_score, context_score,
        observations,
        baseline_mean, baseline_std, sigmas_above_baseline,
        triggered, severity,
        raw_event_ids, event_count
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
      )
      ON CONFLICT (time, org_id, indicator_id)
      DO UPDATE SET
        score = EXCLUDED.score,
        confidence = EXCLUDED.confidence,
        triggered = EXCLUDED.triggered,
        severity = EXCLUDED.severity
      RETURNING *
    `;

    const params = [
      result.timestamp || new Date(),
      result.org_id,
      result.indicator_id,
      result.score,
      result.raw_score,
      result.confidence,
      result.components?.rule_based || 0,
      result.components?.anomaly || 0,
      result.components?.context || 0,
      JSON.stringify(result.observations),
      result.baseline?.mean,
      result.baseline?.std,
      result.details?.sigmas_above_baseline,
      result.triggered,
      result.severity,
      result.raw_event_ids || [],
      result.details?.requests_analyzed || 0
    ];

    const res = await this.query(query, params);
    return res.rows[0];
  }

  /**
   * Insert ground truth record
   */
  async insertGroundTruth(groundTruth) {
    const query = `
      INSERT INTO ground_truth (
        org_id, indicator, timestamp, event_ids,
        signal_strength, should_detect,
        injection_method, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const params = [
      groundTruth.orgId,
      groundTruth.indicator,
      groundTruth.timestamp,
      groundTruth.eventIds,
      groundTruth.signalStrength,
      groundTruth.shouldDetect,
      groundTruth.injectionMethod || null,
      groundTruth.notes || null
    ];

    const result = await this.query(query, params);
    return result.rows[0];
  }

  /**
   * Get ground truth for validation
   */
  async getGroundTruth(orgId, indicator, startTime, endTime = new Date()) {
    const query = `
      SELECT *
      FROM ground_truth
      WHERE org_id = $1
        AND indicator = $2
        AND timestamp >= $3
        AND timestamp <= $4
      ORDER BY timestamp DESC
    `;

    const result = await this.query(query, [orgId, indicator, startTime, endTime]);
    return result.rows;
  }

  /**
   * Update ground truth with detection outcome
   */
  async updateGroundTruthDetection(groundTruthId, wasDetected, detectionScore, detectedAt) {
    const query = `
      UPDATE ground_truth
      SET was_detected = $2,
          detection_score = $3,
          detected_at = $4
      WHERE id = $1
      RETURNING *
    `;

    const result = await this.query(query, [groundTruthId, wasDetected, detectionScore, detectedAt]);
    return result.rows[0];
  }

  /**
   * Get validation metrics (from view)
   */
  async getValidationMetrics(orgId, indicator) {
    const query = `
      SELECT *
      FROM ground_truth_validation
      WHERE org_id = $1
        AND indicator = $2
    `;

    const result = await this.query(query, [orgId, indicator]);
    return result.rows[0] || null;
  }

  /**
   * Close connection pool
   */
  async close() {
    await this.pool.end();
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      const result = await this.query('SELECT NOW() as time, version() as version');
      return {
        healthy: true,
        time: result.rows[0].time,
        version: result.rows[0].version
      };
    } catch (err) {
      return {
        healthy: false,
        error: err.message
      };
    }
  }
}

module.exports = TimescaleClient;
