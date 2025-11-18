/**
 * Validation Framework
 * Compares detection results to ground truth and calculates metrics
 *
 * Metrics:
 * - MCC (Matthews Correlation Coefficient) - primary quality metric
 * - Precision - how many detected are real?
 * - Recall - how many real signals caught?
 * - F1 Score - harmonic mean of precision and recall
 */

class Validator {
  constructor(dbClient) {
    this.db = dbClient;
  }

  /**
   * Validate indicator detection against ground truth
   */
  async validate(orgId, indicatorId, timeWindow = 86400) {
    console.log(`\n[Validator] Validating Indicator ${indicatorId} for ${orgId} over ${timeWindow}s...`);

    const startTime = new Date(Date.now() - timeWindow * 1000);
    const endTime = new Date();

    // Step 1: Get ground truth
    const groundTruth = await this.db.getGroundTruth(orgId, indicatorId, startTime, endTime);

    console.log(`[Validator] Found ${groundTruth.length} ground truth records`);

    if (groundTruth.length === 0) {
      return {
        indicator: indicatorId,
        org_id: orgId,
        error: 'No ground truth data found',
        metrics: null
      };
    }

    // Step 2: Get detection results
    const query = `
      SELECT *
      FROM detection_results
      WHERE org_id = $1
        AND indicator_id = $2
        AND time >= $3
        AND time <= $4
      ORDER BY time DESC
    `;

    const detectionsResult = await this.db.query(query, [orgId, indicatorId, startTime, endTime]);
    const detections = detectionsResult.rows;

    console.log(`[Validator] Found ${detections.length} detection results`);

    // Step 3: Match ground truth to detections
    const { TP, TN, FP, FN, matches } = this.matchGroundTruthToDetections(groundTruth, detections);

    // Step 4: Update ground truth records with detection outcomes
    for (const match of matches) {
      if (match.groundTruthId && match.detected !== null) {
        await this.db.updateGroundTruthDetection(
          match.groundTruthId,
          match.detected,
          match.detectionScore,
          match.detectedAt
        );
      }
    }

    // Step 5: Calculate metrics
    const metrics = this.calculateMetrics(TP, TN, FP, FN);

    // Step 6: Generate report
    const report = {
      indicator: indicatorId,
      org_id: orgId,
      timeWindow: timeWindow,
      timestamp: new Date(),

      confusion_matrix: { TP, TN, FP, FN },

      metrics: metrics,

      quality: this.interpretMCC(metrics.MCC),

      passed: metrics.MCC >= 0.7 && metrics.recall >= 0.8,

      recommendations: this.generateRecommendations(metrics, FP, FN),

      details: {
        ground_truth_count: groundTruth.length,
        detections_count: detections.length,
        signals_detected: TP,
        signals_missed: FN,
        false_alarms: FP,
        true_negatives: TN
      }
    };

    // Print report
    this.printReport(report);

    return report;
  }

  /**
   * Match ground truth records to detection results
   * A detection matches if it occurs within 1 hour of the signal
   */
  matchGroundTruthToDetections(groundTruth, detections) {
    let TP = 0, TN = 0, FP = 0, FN = 0;
    const matches = [];

    const oneHour = 3600000; // milliseconds

    for (const truth of groundTruth) {
      const truthTime = new Date(truth.timestamp).getTime();

      // Find detection within ±1 hour
      const detection = detections.find(d => {
        const detectionTime = new Date(d.time).getTime();
        return Math.abs(detectionTime - truthTime) < oneHour;
      });

      const detected = detection && detection.triggered;

      if (truth.should_detect && detected) {
        TP++;
        console.log(`✓ TP: Signal at ${new Date(truth.timestamp).toISOString()} detected (${truth.signal_strength.toFixed(1)}σ)`);

        matches.push({
          groundTruthId: truth.id,
          detected: true,
          detectionScore: detection.score,
          detectedAt: detection.time,
          outcome: 'TP'
        });

      } else if (truth.should_detect && !detected) {
        FN++;
        console.warn(`✗ FN: Signal at ${new Date(truth.timestamp).toISOString()} MISSED (${truth.signal_strength.toFixed(1)}σ)`);

        matches.push({
          groundTruthId: truth.id,
          detected: false,
          detectionScore: detection ? detection.score : null,
          detectedAt: detection ? detection.time : null,
          outcome: 'FN'
        });

      } else if (!truth.should_detect && detected) {
        FP++;
        console.warn(`✗ FP: False alarm at ${new Date(detection.time).toISOString()}`);

        matches.push({
          groundTruthId: truth.id,
          detected: true,
          detectionScore: detection.score,
          detectedAt: detection.time,
          outcome: 'FP'
        });

      } else {
        TN++;
        matches.push({
          groundTruthId: truth.id,
          detected: false,
          detectionScore: detection ? detection.score : null,
          detectedAt: detection ? detection.time : null,
          outcome: 'TN'
        });
      }
    }

    return { TP, TN, FP, FN, matches };
  }

  /**
   * Calculate validation metrics
   */
  calculateMetrics(TP, TN, FP, FN) {
    // Matthews Correlation Coefficient (from Dense Paper p.4)
    // V = (TP·TN - FP·FN) / sqrt((TP+FP)(TP+FN)(TN+FP)(TN+FN))
    const numerator = (TP * TN) - (FP * FN);
    const denominator = Math.sqrt(
      (TP + FP) * (TP + FN) * (TN + FP) * (TN + FN)
    );

    const MCC = denominator > 0 ? numerator / denominator : 0;

    // Precision = TP / (TP + FP)
    const precision = (TP + FP) > 0 ? TP / (TP + FP) : 0;

    // Recall = TP / (TP + FN)
    const recall = (TP + FN) > 0 ? TP / (TP + FN) : 0;

    // F1 Score = 2 * (precision * recall) / (precision + recall)
    const f1 = (precision + recall) > 0 ?
      2 * (precision * recall) / (precision + recall) : 0;

    // Accuracy = (TP + TN) / (TP + TN + FP + FN)
    const accuracy = (TP + TN + FP + FN) > 0 ?
      (TP + TN) / (TP + TN + FP + FN) : 0;

    return {
      MCC: MCC,
      precision: precision,
      recall: recall,
      f1: f1,
      accuracy: accuracy
    };
  }

  /**
   * Interpret MCC value
   */
  interpretMCC(mcc) {
    if (mcc >= 0.9) return 'Excellent';
    if (mcc >= 0.7) return 'Good';
    if (mcc >= 0.5) return 'Moderate';
    if (mcc >= 0.3) return 'Weak';
    return 'Poor';
  }

  /**
   * Generate recommendations based on metrics
   */
  generateRecommendations(metrics, FP, FN) {
    const recommendations = [];

    if (metrics.MCC < 0.7) {
      recommendations.push('⚠️  Overall detection quality below threshold - review baseline calibration');
    }

    if (metrics.precision < 0.8) {
      recommendations.push(`⚠️  High false positive rate (${FP} FP) - increase detection threshold or refine rule-based component`);
    }

    if (metrics.recall < 0.8) {
      recommendations.push(`⚠️  Missing signals (${FN} FN) - decrease detection threshold or improve anomaly detection sensitivity`);
    }

    if (FP > FN * 2) {
      recommendations.push('💡 Too many false alarms - prioritize precision by increasing threshold');
    }

    if (FN > FP * 2) {
      recommendations.push('💡 Missing too many signals - prioritize recall by decreasing threshold');
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ Detection quality meets requirements');
    }

    return recommendations;
  }

  /**
   * Print validation report
   */
  printReport(report) {
    console.log('\n' + '='.repeat(60));
    console.log(`Validation Results for Indicator ${report.indicator}`);
    console.log('='.repeat(60));

    console.log('\nConfusion Matrix:');
    console.log(`  True Positives (TP):  ${report.confusion_matrix.TP}`);
    console.log(`  True Negatives (TN):  ${report.confusion_matrix.TN}`);
    console.log(`  False Positives (FP): ${report.confusion_matrix.FP}`);
    console.log(`  False Negatives (FN): ${report.confusion_matrix.FN}`);

    console.log('\nMetrics:');
    console.log(`  MCC:       ${report.metrics.MCC.toFixed(3)} (${report.quality})`);
    console.log(`  Precision: ${(report.metrics.precision * 100).toFixed(1)}%`);
    console.log(`  Recall:    ${(report.metrics.recall * 100).toFixed(1)}%`);
    console.log(`  F1 Score:  ${report.metrics.f1.toFixed(3)}`);
    console.log(`  Accuracy:  ${(report.metrics.accuracy * 100).toFixed(1)}%`);

    console.log('\nResult:');
    console.log(`  ${report.passed ? '✅ PASSED' : '❌ FAILED'}`);

    if (report.recommendations.length > 0) {
      console.log('\nRecommendations:');
      report.recommendations.forEach(rec => console.log(`  ${rec}`));
    }

    console.log('\n' + '='.repeat(60) + '\n');
  }
}

module.exports = Validator;
