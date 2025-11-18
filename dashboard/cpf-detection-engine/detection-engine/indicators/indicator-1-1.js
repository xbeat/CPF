/**
 * Indicator 1.1: Unquestioning Compliance
 *
 * Monitors compliance patterns with perceived authority through analysis
 * of authentication logs, email headers, and approval chains.
 *
 * Formula: Cr = N_executed / N_requested
 * Detection: Cr > μ_baseline + 2σ
 *
 * From Dense Paper (p.2):
 * "Indicator 1.1 operationalizes through continuous monitoring of the compliance
 *  rate function Cr = N_executed / N_requested where requests originate from
 *  authority domain patterns. Detection triggers when Cr > μ_baseline + 2σ within window W = 3600s."
 */

class Indicator_1_1 {
  constructor(dbClient, config = {}) {
    this.db = dbClient;
    this.indicatorId = '1.1';
    this.indicatorName = 'Unquestioning Compliance';

    this.config = config;

    // Authority domain patterns
    this.authorityDomains = ['ceo@', 'cfo@', 'exec@', 'board@', 'president@'];

    // Action keywords
    this.actionKeywords = ['transfer', 'approve', 'grant', 'urgent', 'wire', 'exception'];
  }

  /**
   * Run detection for time window
   */
  async detect(orgId, windowSeconds = 3600) {
    console.log(`[Indicator 1.1] Running detection for ${orgId}, window=${windowSeconds}s`);

    const windowStart = new Date(Date.now() - (windowSeconds * 1000));
    const windowEnd = new Date();

    // Step 1: Query authority domain emails
    const authorityEmails = await this.queryAuthorityEmails(orgId, windowStart, windowEnd);

    if (authorityEmails.length === 0) {
      console.log(`[Indicator 1.1] No authority emails found in window`);
      return this.noDataResult(orgId);
    }

    console.log(`[Indicator 1.1] Found ${authorityEmails.length} authority emails`);

    // Step 2: Calculate compliance metrics
    const metrics = this.calculateComplianceMetrics(authorityEmails);

    console.log(`[Indicator 1.1] Metrics:`, {
      requests: metrics.N_requested,
      recipients: metrics.totalRecipients,
      compliance: `${(metrics.Cr * 100).toFixed(1)}%`,
      verification: `${(metrics.verificationRate * 100).toFixed(1)}%`
    });

    // Step 3: Get baseline
    const baseline = await this.db.getBaseline(orgId, this.indicatorId);

    if (!baseline) {
      console.warn(`[Indicator 1.1] No baseline for ${orgId} - using defaults`);
      return this.noBaselineResult(orgId, metrics);
    }

    // Step 4: Detection logic (Di = w1·Ri + w2·Ai + w3·Ci)

    // Rule-based detection (Ri)
    const Ri = this.calculateRuleBased(metrics, baseline);

    // Anomaly detection (Ai) - Mahalanobis distance
    const Ai = this.calculateAnomalyScore(metrics, baseline);

    // Contextual scoring (Ci) - Bayesian
    const Ci = this.calculateContextScore(authorityEmails);

    // Combined score
    const weights = baseline.weights || { w1: 0.4, w2: 0.4, w3: 0.2 };
    const Di = (weights.w1 * Ri) + (weights.w2 * Ai) + (weights.w3 * Ci);

    // Step 5: Temporal decay (if previous state exists)
    // For now, skip temporal decay in POC (would need temporal_state table)
    const Di_temporal = Di;

    // Step 6: Calculate confidence
    const confidence = this.calculateConfidence(metrics.totalRecipients, baseline.sample_size);

    // Step 7: Determine severity
    const triggered = Di_temporal > 0.7;
    const severity = this.calculateSeverity(Di_temporal);

    // Build result
    const result = {
      timestamp: windowEnd,
      org_id: orgId,
      indicator_id: this.indicatorId,
      score: Di_temporal,
      raw_score: Di,
      confidence: confidence,

      components: {
        rule_based: Ri,
        anomaly: Ai,
        context: Ci,
        weights: weights
      },

      observations: {
        complianceRate: metrics.Cr,
        verificationRate: metrics.verificationRate,
        responseTime: metrics.avgResponseTime
      },

      baseline: {
        mean: baseline.mean_vector[0],  // Compliance rate mean
        std: baseline.std_vector[0],    // Compliance rate std
        threshold: baseline.threshold_value
      },

      details: {
        requests_analyzed: metrics.N_requested,
        total_recipients: metrics.totalRecipients,
        executed: metrics.N_executed,
        verified: metrics.N_verified,
        compliance_rate: metrics.Cr,
        verification_rate: metrics.verificationRate,
        avg_response_time: metrics.avgResponseTime,
        sigmas_above_baseline: (metrics.Cr - baseline.mean_vector[0]) / baseline.std_vector[0]
      },

      triggered: triggered,
      severity: severity,

      raw_event_ids: authorityEmails.map(e => e.event_id)
    };

    console.log(`[Indicator 1.1] Detection result:`, {
      score: `${(Di_temporal * 100).toFixed(1)}%`,
      triggered: triggered,
      severity: severity,
      sigmas: result.details.sigmas_above_baseline.toFixed(2)
    });

    // Step 8: Store result
    await this.db.insertDetectionResult(result);

    return result;
  }

  /**
   * Query authority emails from database
   */
  async queryAuthorityEmails(orgId, startTime, endTime) {
    const events = await this.db.getEvents(orgId, 'email', startTime, endTime);

    // Filter for authority domains and action keywords
    return events.filter(e => {
      const data = e.data;

      // Check if from authority domain
      const isAuthority = this.authorityDomains.some(domain =>
        data.from && data.from.includes(domain)
      );

      if (!isAuthority) return false;

      // Check if contains action keywords
      const text = `${data.subject} ${data.body}`.toLowerCase();
      const hasAction = this.actionKeywords.some(keyword =>
        text.includes(keyword)
      );

      return hasAction;
    });
  }

  /**
   * Calculate compliance metrics from emails
   */
  calculateComplianceMetrics(emails) {
    const N_requested = emails.length;
    let N_executed = 0;
    let N_verified = 0;
    const responseTimes = [];
    let totalRecipients = 0;

    for (const email of emails) {
      const data = email.data;
      const recipients = data.recipients || [];

      totalRecipients += recipients.length;

      for (const recipient of recipients) {
        if (recipient.action_taken) {
          N_executed++;
          if (recipient.response_time) {
            responseTimes.push(recipient.response_time);
          }
        }
        if (recipient.verified) {
          N_verified++;
        }
      }
    }

    const Cr = totalRecipients > 0 ? N_executed / totalRecipients : 0;
    const verificationRate = totalRecipients > 0 ? N_verified / totalRecipients : 0;
    const avgResponseTime = responseTimes.length > 0 ?
      responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length : 0;

    return {
      N_requested,
      N_executed,
      N_verified,
      totalRecipients,
      Cr,
      verificationRate,
      avgResponseTime
    };
  }

  /**
   * Rule-based detection (Ri)
   * Returns 1 if Cr > threshold, 0 otherwise
   */
  calculateRuleBased(metrics, baseline) {
    const threshold = baseline.mean_vector[0] + (baseline.threshold_k * baseline.std_vector[0]);
    return metrics.Cr > threshold ? 1 : 0;
  }

  /**
   * Anomaly detection (Ai) - Mahalanobis distance
   *
   * From Dense Paper (p.1):
   * Ai = sqrt((xi - μi)^T * Σi^-1 * (xi - μi))
   *
   * Simplified for POC: Use normalized Euclidean distance
   */
  calculateAnomalyScore(metrics, baseline) {
    // Observation vector
    const x = [
      metrics.Cr,
      metrics.verificationRate,
      metrics.avgResponseTime / 1000  // Normalize to similar scale
    ];

    // Baseline mean vector
    const μ = baseline.mean_vector;

    // Baseline std vector
    const σ = baseline.std_vector;

    // Normalized Euclidean distance (simplified Mahalanobis)
    let sumSquared = 0;
    for (let i = 0; i < x.length; i++) {
      if (σ[i] > 0) {
        const normalized = (x[i] - μ[i]) / σ[i];
        sumSquared += normalized * normalized;
      }
    }

    const distance = Math.sqrt(sumSquared / x.length);

    // Normalize to [0, 1] using sigmoid
    const Ai = 1 / (1 + Math.exp(-distance + 2));

    return Math.min(Math.max(Ai, 0), 1);
  }

  /**
   * Context score (Ci) - Bayesian factors
   */
  calculateContextScore(emails) {
    const factors = [];

    // Time of day factor
    const hour = new Date().getHours();
    const afterHours = hour < 8 || hour > 18;
    if (afterHours) factors.push(0.7); // Suspicious

    // Urgency language factor
    const urgencyCount = emails.filter(e => {
      const data = e.data;
      return data.urgency_markers && data.urgency_markers.length > 0;
    }).length;
    const urgencyRatio = urgencyCount / emails.length;
    factors.push(urgencyRatio);

    // Average all factors
    if (factors.length === 0) return 0.5;
    return factors.reduce((a, b) => a + b, 0) / factors.length;
  }

  /**
   * Calculate confidence based on sample size
   */
  calculateConfidence(sampleSize, baselineSampleSize) {
    const n = sampleSize;
    const n0 = baselineSampleSize || 1000;

    if (n < 10) return 0.3;  // Low confidence
    if (n < 50) return 0.6;  // Medium
    if (n < n0 * 0.1) return 0.8;  // Good
    return 0.95;  // High confidence
  }

  /**
   * Calculate severity level
   */
  calculateSeverity(score) {
    if (score >= 0.9) return 'critical';
    if (score >= 0.7) return 'high';
    if (score >= 0.5) return 'medium';
    return 'low';
  }

  /**
   * No data result (no authority emails found)
   */
  noDataResult(orgId) {
    return {
      timestamp: new Date(),
      org_id: orgId,
      indicator_id: this.indicatorId,
      score: 0,
      confidence: 0,
      triggered: false,
      severity: 'low',
      details: {
        no_data: true,
        message: 'No authority emails found in time window'
      }
    };
  }

  /**
   * No baseline result (baseline not calibrated yet)
   */
  noBaselineResult(orgId, metrics) {
    return {
      timestamp: new Date(),
      org_id: orgId,
      indicator_id: this.indicatorId,
      score: 0,
      confidence: 0,
      triggered: false,
      severity: 'low',
      observations: {
        complianceRate: metrics.Cr,
        verificationRate: metrics.verificationRate,
        responseTime: metrics.avgResponseTime
      },
      details: {
        no_baseline: true,
        message: 'Baseline not calibrated - need 30-day calibration period',
        compliance_rate: metrics.Cr
      }
    };
  }
}

module.exports = Indicator_1_1;
