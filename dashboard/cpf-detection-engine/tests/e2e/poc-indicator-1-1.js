#!/usr/bin/env node
/**
 * Proof-of-Concept: End-to-End Test for Indicator 1.1
 *
 * This script demonstrates the complete workflow:
 * 1. Generate 1 day of realistic email data (50K events)
 * 2. Inject 50 hidden authority compliance signals
 * 3. Store data in TimescaleDB
 * 4. Create a baseline for the organization
 * 5. Run Indicator 1.1 detection
 * 6. Validate against ground truth
 * 7. Print MCC, precision, recall metrics
 *
 * Expected result: MCC >= 0.7, Recall >= 0.8
 */

const TimescaleClient = require('../../storage/timescale-client');
const EmailGenerator = require('../../data-generator/generators/email-generator');
const Indicator_1_1 = require('../../detection-engine/indicators/indicator-1-1');
const Validator = require('../../validation/validator');

async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('CPF Detection Engine - Proof of Concept: Indicator 1.1');
  console.log('='.repeat(70) + '\n');

  const orgId = 'org-poc-001';
  const orgName = 'POC Organization';

  // Step 1: Connect to database
  console.log('Step 1: Connecting to TimescaleDB...');
  const db = new TimescaleClient();

  try {
    const health = await db.healthCheck();
    if (!health.healthy) {
      throw new Error(`Database unhealthy: ${health.error}`);
    }
    console.log(`✓ Connected to TimescaleDB`);
    console.log(`  Time: ${health.time}`);
  } catch (err) {
    console.error('\n❌ Failed to connect to database.');
    console.error('Make sure TimescaleDB is running: docker-compose up -d');
    console.error(`Error: ${err.message}\n`);
    process.exit(1);
  }

  // Step 2: Generate realistic email data
  console.log('\nStep 2: Generating realistic email data...');

  const generator = new EmailGenerator({
    orgId: orgId,
    userCount: 1000,
    emailsPerUserPerDay: 50
  });

  const today = new Date();
  const events = generator.generateDayWithSignals(today, 50);  // 50K emails + 50 signals

  console.log(`✓ Generated ${events.length} email events`);

  // Step 3: Ingest to database
  console.log('\nStep 3: Ingesting events to TimescaleDB...');

  const batchSize = 1000;
  let totalIngested = 0;

  for (let i = 0; i < events.length; i += batchSize) {
    const batch = events.slice(i, i + batchSize);
    const result = await db.batchInsertEvents(batch);
    totalIngested += result.inserted;

    if ((i + batchSize) % 10000 === 0) {
      console.log(`  Ingested ${i + batchSize}/${events.length}...`);
    }
  }

  console.log(`✓ Ingested ${totalIngested} events to raw_events table`);

  // Step 4: Store ground truth
  console.log('\nStep 4: Storing ground truth records...');

  const groundTruthRecords = generator.getGroundTruth();
  let gtStored = 0;

  for (const gt of groundTruthRecords) {
    await db.insertGroundTruth(gt);
    gtStored++;
  }

  console.log(`✓ Stored ${gtStored} ground truth records`);
  console.log(`  Should detect: ${groundTruthRecords.filter(g => g.shouldDetect).length}`);
  console.log(`  Should NOT detect: ${groundTruthRecords.filter(g => !g.shouldDetect).length}`);

  // Step 5: Create baseline for organization
  console.log('\nStep 5: Creating baseline for Indicator 1.1...');

  // For POC, we use default baseline from config
  // In production, this would be calibrated from 30 days of real data
  const baseline = {
    org_id: orgId,
    indicator_id: '1.1',
    version: 1,
    calibration_start: new Date(Date.now() - 30 * 24 * 3600 * 1000),  // 30 days ago
    calibration_end: new Date(),
    sample_size: 50000,

    // Mean vector: [complianceRate, verificationRate, responseTime]
    mean_vector: [0.72, 0.35, 300],

    // Std vector
    std_vector: [0.08, 0.12, 120],

    // Covariance matrix (simplified - diagonal)
    covariance_matrix: [
      [0.0064, 0, 0],        // 0.08^2
      [0, 0.0144, 0],        // 0.12^2
      [0, 0, 14400]          // 120^2
    ],

    distribution_type: 'normal',

    p50: 0.72,
    p75: 0.78,
    p90: 0.85,
    p95: 0.89,
    p99: 0.94,

    threshold_k: 2.0,
    threshold_value: 0.72 + (2.0 * 0.08),  // μ + 2σ = 0.88

    weights: {
      w1: 0.4,  // Rule-based
      w2: 0.4,  // Anomaly
      w3: 0.2   // Context
    },

    persistence_tau: 14400,  // 4 hours

    circadian_params: null,
    priors: null,

    is_active: true
  };

  await db.upsertBaseline(baseline);

  console.log(`✓ Created baseline for Indicator 1.1`);
  console.log(`  Mean compliance: ${(baseline.mean_vector[0] * 100).toFixed(1)}%`);
  console.log(`  Std: ${(baseline.std_vector[0] * 100).toFixed(1)}%`);
  console.log(`  Threshold: ${(baseline.threshold_value * 100).toFixed(1)}% (μ + 2σ)`);

  // Step 6: Run detection
  console.log('\nStep 6: Running Indicator 1.1 detection...');

  const detector = new Indicator_1_1(db);
  const detectionResult = await detector.detect(orgId, 86400);  // 24-hour window

  if (detectionResult.triggered) {
    console.log(`🚨 Alert triggered!`);
    console.log(`  Score: ${(detectionResult.score * 100).toFixed(1)}% (${detectionResult.severity})`);
    console.log(`  Compliance: ${(detectionResult.details.compliance_rate * 100).toFixed(1)}%`);
    console.log(`  Baseline: ${(detectionResult.baseline.mean * 100).toFixed(1)}%`);
    console.log(`  Deviation: ${detectionResult.details.sigmas_above_baseline.toFixed(2)}σ`);
  } else {
    console.log(`✓ No alert (score: ${(detectionResult.score * 100).toFixed(1)}%)`);
  }

  // Step 7: Validate against ground truth
  console.log('\nStep 7: Validating detection against ground truth...');

  const validator = new Validator(db);
  const validationReport = await validator.validate(orgId, '1.1', 86400);

  // Step 8: Summary
  console.log('\n' + '='.repeat(70));
  console.log('POC SUMMARY');
  console.log('='.repeat(70));

  console.log(`\nData Generation:`);
  console.log(`  Total events: ${events.length}`);
  console.log(`  Hidden signals: ${groundTruthRecords.length}`);
  console.log(`  Signal strength: 3σ above baseline`);

  console.log(`\nDetection Performance:`);
  console.log(`  MCC: ${validationReport.metrics.MCC.toFixed(3)} (${validationReport.quality})`);
  console.log(`  Precision: ${(validationReport.metrics.precision * 100).toFixed(1)}%`);
  console.log(`  Recall: ${(validationReport.metrics.recall * 100).toFixed(1)}%`);
  console.log(`  F1 Score: ${validationReport.metrics.f1.toFixed(3)}`);

  console.log(`\nResult: ${validationReport.passed ? '✅ PASSED' : '❌ FAILED'}`);

  if (!validationReport.passed) {
    console.log('\nThis POC demonstrates the detection approach, but performance');
    console.log('can be improved by:');
    console.log('  1. Tuning detection weights (w1, w2, w3)');
    console.log('  2. Calibrating baseline from real organizational data');
    console.log('  3. Implementing full Mahalanobis distance (vs simplified)');
    console.log('  4. Adding temporal decay for multi-period detection');
  }

  console.log('\n' + '='.repeat(70) + '\n');

  // Cleanup
  await db.close();

  process.exit(validationReport.passed ? 0 : 1);
}

// Run
main().catch(err => {
  console.error('\n❌ POC failed with error:');
  console.error(err);
  process.exit(1);
});
