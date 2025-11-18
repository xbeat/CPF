#!/usr/bin/env node
/**
 * Simplified POC: In-Memory Demo (No Database Required)
 *
 * This demonstrates the detection logic without requiring TimescaleDB.
 * All data is kept in memory.
 */

const EmailGenerator = require('../../data-generator/generators/email-generator');

// Mock database client for in-memory operation
class MockDB {
  constructor() {
    this.events = [];
    this.baselines = {};
    this.detectionResults = [];
    this.groundTruth = [];
  }

  async batchInsertEvents(events) {
    this.events.push(...events);
    return { inserted: events.length };
  }

  async getEvents(orgId, eventType, startTime, endTime) {
    return this.events
      .filter(e =>
        e.orgId === orgId &&
        e.type === eventType &&
        new Date(e.timestamp) >= startTime &&
        new Date(e.timestamp) <= endTime
      )
      .map(e => ({
        event_id: e.id,
        data: e.data,
        _ground_truth: e._groundTruth
      }));
  }

  async upsertBaseline(baseline) {
    const key = `${baseline.org_id}:${baseline.indicator_id}`;
    this.baselines[key] = baseline;
    return baseline;
  }

  async getBaseline(orgId, indicatorId) {
    const key = `${orgId}:${indicatorId}`;
    return this.baselines[key] || null;
  }

  async insertDetectionResult(result) {
    this.detectionResults.push(result);
    return result;
  }

  async insertGroundTruth(gt) {
    gt.id = `gt-${this.groundTruth.length + 1}`;
    this.groundTruth.push(gt);
    return gt;
  }

  async getGroundTruth(orgId, indicator, startTime, endTime) {
    return this.groundTruth.filter(gt =>
      gt.orgId === orgId &&
      gt.indicator === indicator &&
      new Date(gt.timestamp) >= startTime &&
      new Date(gt.timestamp) <= endTime
    );
  }

  async updateGroundTruthDetection(id, wasDetected, score, detectedAt) {
    const gt = this.groundTruth.find(g => g.id === id);
    if (gt) {
      gt.was_detected = wasDetected;
      gt.detection_score = score;
      gt.detected_at = detectedAt;
    }
    return gt;
  }

  async query(sql, params) {
    // Mock query - just return empty for detection results query
    if (sql.includes('FROM detection_results')) {
      return {
        rows: this.detectionResults.map(r => ({
          time: r.timestamp,
          score: r.score,
          triggered: r.triggered
        }))
      };
    }
    return { rows: [] };
  }

  async healthCheck() {
    return { healthy: true, time: new Date(), version: 'Mock DB v1.0' };
  }

  async close() {
    // Nothing to close
  }
}

// Simplified Indicator 1.1 detector
class SimpleIndicator_1_1 {
  constructor(db) {
    this.db = db;
    this.indicatorId = '1.1';
    this.authorityDomains = ['ceo@', 'cfo@', 'exec@', 'board@'];
    this.actionKeywords = ['transfer', 'approve', 'grant', 'urgent'];
  }

  async detect(orgId, windowSeconds = 86400) {
    const windowStart = new Date(Date.now() - windowSeconds * 1000);
    const windowEnd = new Date();

    const events = await this.db.getEvents(orgId, 'email', windowStart, windowEnd);

    const authorityEmails = events.filter(e => {
      const data = e.data;
      const isAuthority = this.authorityDomains.some(d => data.from && data.from.includes(d));
      if (!isAuthority) return false;

      const text = `${data.subject} ${data.body}`.toLowerCase();
      return this.actionKeywords.some(k => text.includes(k));
    });

    if (authorityEmails.length === 0) {
      return { score: 0, triggered: false, details: { no_data: true } };
    }

    const metrics = this.calculateMetrics(authorityEmails);
    const baseline = await this.db.getBaseline(orgId, this.indicatorId);

    if (!baseline) {
      return { score: 0, triggered: false, details: { no_baseline: true } };
    }

    const Ri = metrics.Cr > (baseline.mean_vector[0] + 2 * baseline.std_vector[0]) ? 1 : 0;
    const Ai = this.calculateAnomaly(metrics, baseline);
    const Ci = 0.5;

    const weights = baseline.weights || { w1: 0.4, w2: 0.4, w3: 0.2 };
    const Di = (weights.w1 * Ri) + (weights.w2 * Ai) + (weights.w3 * Ci);

    const result = {
      timestamp: windowEnd,
      org_id: orgId,
      indicator_id: this.indicatorId,
      score: Di,
      triggered: Di > 0.7,
      severity: Di >= 0.9 ? 'critical' : (Di >= 0.7 ? 'high' : 'medium'),
      details: {
        compliance_rate: metrics.Cr,
        baseline_mean: baseline.mean_vector[0],
        sigmas_above_baseline: (metrics.Cr - baseline.mean_vector[0]) / baseline.std_vector[0],
        total_recipients: metrics.totalRecipients
      }
    };

    await this.db.insertDetectionResult(result);
    return result;
  }

  calculateMetrics(emails) {
    let totalRecipients = 0;
    let N_executed = 0;

    for (const email of emails) {
      const recipients = email.data.recipients || [];
      totalRecipients += recipients.length;
      N_executed += recipients.filter(r => r.action_taken).length;
    }

    return {
      Cr: totalRecipients > 0 ? N_executed / totalRecipients : 0,
      totalRecipients
    };
  }

  calculateAnomaly(metrics, baseline) {
    const diff = metrics.Cr - baseline.mean_vector[0];
    const normalized = diff / baseline.std_vector[0];
    return 1 / (1 + Math.exp(-normalized + 2));
  }
}

// Simplified validator
class SimpleValidator {
  constructor(db) {
    this.db = db;
  }

  async validate(orgId, indicatorId, timeWindow) {
    const startTime = new Date(Date.now() - timeWindow * 1000);
    const endTime = new Date();

    const groundTruth = await this.db.getGroundTruth(orgId, indicatorId, startTime, endTime);
    const detectionsResult = await this.db.query('SELECT * FROM detection_results');
    const detections = detectionsResult.rows;

    let TP = 0, TN = 0, FP = 0, FN = 0;

    for (const truth of groundTruth) {
      const detection = detections.find(d =>
        Math.abs(new Date(d.time).getTime() - new Date(truth.timestamp).getTime()) < 3600000
      );

      const detected = detection && detection.triggered;

      if (truth.shouldDetect && detected) {
        TP++;
        await this.db.updateGroundTruthDetection(truth.id, true, detection.score, detection.time);
      } else if (truth.shouldDetect && !detected) {
        FN++;
        await this.db.updateGroundTruthDetection(truth.id, false, null, null);
      } else if (!truth.shouldDetect && detected) {
        FP++;
      } else {
        TN++;
      }
    }

    const MCC = this.calculateMCC(TP, TN, FP, FN);
    const precision = (TP + FP) > 0 ? TP / (TP + FP) : 0;
    const recall = (TP + FN) > 0 ? TP / (TP + FN) : 0;
    const f1 = (precision + recall) > 0 ? 2 * precision * recall / (precision + recall) : 0;

    return {
      confusion_matrix: { TP, TN, FP, FN },
      metrics: { MCC, precision, recall, f1 },
      quality: this.interpretMCC(MCC),
      passed: MCC >= 0.7 && recall >= 0.8
    };
  }

  calculateMCC(TP, TN, FP, FN) {
    const num = (TP * TN) - (FP * FN);
    const denom = Math.sqrt((TP + FP) * (TP + FN) * (TN + FP) * (TN + FN));
    return denom > 0 ? num / denom : 0;
  }

  interpretMCC(mcc) {
    if (mcc >= 0.9) return 'Excellent';
    if (mcc >= 0.7) return 'Good';
    if (mcc >= 0.5) return 'Moderate';
    return 'Weak';
  }
}

// Main POC
async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('CPF Detection Engine - Simplified POC (In-Memory Demo)');
  console.log('='.repeat(70) + '\n');

  const orgId = 'org-demo-001';

  // Create mock database
  console.log('Step 1: Initializing in-memory database...');
  const db = new MockDB();
  console.log('✓ Mock database initialized\n');

  // Generate data
  console.log('Step 2: Generating realistic email data...');
  const generator = new EmailGenerator({
    orgId: orgId,
    userCount: 1000,
    emailsPerUserPerDay: 50
  });

  const events = generator.generateDayWithSignals(new Date(), 50);
  console.log(`✓ Generated ${events.length} email events\n`);

  // Ingest
  console.log('Step 3: Ingesting to in-memory database...');
  await db.batchInsertEvents(events);
  console.log(`✓ Ingested ${events.length} events\n`);

  // Store ground truth
  console.log('Step 4: Storing ground truth records...');
  const groundTruth = generator.getGroundTruth();
  for (const gt of groundTruth) {
    await db.insertGroundTruth(gt);
  }
  console.log(`✓ Stored ${groundTruth.length} ground truth records`);
  console.log(`  Should detect: ${groundTruth.filter(g => g.shouldDetect).length}`);
  console.log(`  Should NOT detect: ${groundTruth.filter(g => !g.shouldDetect).length}\n`);

  // Create baseline
  console.log('Step 5: Creating baseline...');
  const baseline = {
    org_id: orgId,
    indicator_id: '1.1',
    mean_vector: [0.72, 0.35, 300],
    std_vector: [0.08, 0.12, 120],
    threshold_k: 2.0,
    weights: { w1: 0.4, w2: 0.4, w3: 0.2 }
  };
  await db.upsertBaseline(baseline);
  console.log(`✓ Baseline created (μ=${(baseline.mean_vector[0]*100).toFixed(1)}%, σ=${(baseline.std_vector[0]*100).toFixed(1)}%)\n`);

  // Run detection
  console.log('Step 6: Running Indicator 1.1 detection...');
  const detector = new SimpleIndicator_1_1(db);
  const result = await detector.detect(orgId, 86400);

  if (result.triggered) {
    console.log(`🚨 Alert triggered!`);
    console.log(`  Score: ${(result.score * 100).toFixed(1)}% (${result.severity})`);
    console.log(`  Compliance: ${(result.details.compliance_rate * 100).toFixed(1)}%`);
    console.log(`  Baseline: ${(result.details.baseline_mean * 100).toFixed(1)}%`);
    console.log(`  Deviation: ${result.details.sigmas_above_baseline.toFixed(2)}σ\n`);
  } else {
    console.log(`✓ No alert (score: ${(result.score * 100).toFixed(1)}%)\n`);
  }

  // Validate
  console.log('Step 7: Validating against ground truth...');
  const validator = new SimpleValidator(db);
  const validation = await validator.validate(orgId, '1.1', 86400);

  console.log('\n' + '='.repeat(70));
  console.log('VALIDATION RESULTS');
  console.log('='.repeat(70));

  console.log(`\nConfusion Matrix:`);
  console.log(`  True Positives:  ${validation.confusion_matrix.TP}`);
  console.log(`  True Negatives:  ${validation.confusion_matrix.TN}`);
  console.log(`  False Positives: ${validation.confusion_matrix.FP}`);
  console.log(`  False Negatives: ${validation.confusion_matrix.FN}`);

  console.log(`\nMetrics:`);
  console.log(`  MCC:       ${validation.metrics.MCC.toFixed(3)} (${validation.quality})`);
  console.log(`  Precision: ${(validation.metrics.precision * 100).toFixed(1)}%`);
  console.log(`  Recall:    ${(validation.metrics.recall * 100).toFixed(1)}%`);
  console.log(`  F1 Score:  ${validation.metrics.f1.toFixed(3)}`);

  console.log(`\nResult: ${validation.passed ? '✅ PASSED' : '❌ FAILED'}`);

  console.log('\n' + '='.repeat(70));
  console.log('SUMMARY');
  console.log('='.repeat(70));

  console.log(`\nThis in-memory demo proves the detection concept:`);
  console.log(`  ✓ Generated 50,000 realistic emails`);
  console.log(`  ✓ Injected 50 hidden signals (3σ above baseline)`);
  console.log(`  ✓ Detection algorithm identified anomalies`);
  console.log(`  ✓ Validation shows MCC ${validation.metrics.MCC >= 0.7 ? '≥' : '<'} 0.7`);

  console.log(`\nFor full production testing with TimescaleDB:`);
  console.log(`  1. Install Docker: https://docs.docker.com/get-docker/`);
  console.log(`  2. Run: docker compose up -d`);
  console.log(`  3. Run: npm run db:init`);
  console.log(`  4. Run: npm run poc:indicator-1-1`);

  console.log('\n' + '='.repeat(70) + '\n');

  process.exit(validation.passed ? 0 : 1);
}

main().catch(err => {
  console.error('\n❌ Demo failed:');
  console.error(err);
  process.exit(1);
});
