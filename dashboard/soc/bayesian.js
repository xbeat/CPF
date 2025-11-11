/**
 * CPF Bayesian Inference Engine
 *
 * Cross-indicator Bayesian analysis for organizational risk assessment
 * Merges SOC machine data + Field Kit human assessments
 */

const BAYESIAN = {
  // Category weights for overall risk calculation
  CATEGORY_WEIGHTS: {
    authority: 0.12,
    temporal: 0.10,
    social: 0.11,
    affective: 0.09,
    cognitive: 0.10,
    group: 0.08,
    stress: 0.11,
    unconscious: 0.09,
    ai: 0.12,
    convergent: 0.08
  },

  // Category dependencies (influence matrix)
  // If category A is high, it increases likelihood of category B being high
  DEPENDENCIES: {
    authority: { social: 0.3, group: 0.2, unconscious: 0.15 },
    temporal: { stress: 0.4, affective: 0.25, cognitive: 0.2 },
    social: { group: 0.35, affective: 0.2, authority: 0.15 },
    affective: { cognitive: 0.3, stress: 0.25, unconscious: 0.15 },
    cognitive: { affective: 0.2, unconscious: 0.25 },
    group: { social: 0.3, authority: 0.2 },
    stress: { temporal: 0.3, affective: 0.35, cognitive: 0.2 },
    unconscious: { cognitive: 0.25, affective: 0.2 },
    ai: { cognitive: 0.3, unconscious: 0.2, convergent: 0.25 },
    convergent: { ai: 0.2, authority: 0.15, temporal: 0.15 }
  },

  /**
   * Merge SOC and human values for a single indicator using Bayesian approach
   * @param {Array} socValues - SOC assessment history
   * @param {Array} humanValues - Human assessment history
   * @returns {Object} - {value, confidence, sources}
   */
  mergeIndicatorValues(socValues, humanValues) {
    if (socValues.length === 0 && humanValues.length === 0) {
      return { value: 0.5, confidence: 0, sources: { soc: 0, human: 0 } };
    }

    let totalWeight = 0;
    let weightedSum = 0;
    let socCount = 0;
    let humanCount = 0;

    // Latest SOC value (weighted by confidence)
    if (socValues.length > 0) {
      const latest = socValues[socValues.length - 1];
      const weight = latest.confidence || 0.8;
      weightedSum += latest.value * weight;
      totalWeight += weight;
      socCount = socValues.length;
    }

    // Latest human value (humans get 1.5x weight - more trustworthy)
    if (humanValues.length > 0) {
      const latest = humanValues[humanValues.length - 1];
      const weight = 1.5; // Human assessments weighted higher
      weightedSum += latest.value * weight;
      totalWeight += weight;
      humanCount = humanValues.length;
    }

    const value = totalWeight > 0 ? weightedSum / totalWeight : 0.5;
    const confidence = Math.min(totalWeight / 2.5, 1.0); // Max confidence when both sources present

    return {
      value: parseFloat(value.toFixed(3)),
      confidence: parseFloat(confidence.toFixed(3)),
      sources: { soc: socCount, human: humanCount }
    };
  },

  /**
   * Calculate category-level risk from 10 indicators
   * @param {Object} indicators - All 100 organization indicators
   * @param {Number} categoryNum - Category number (1-10)
   * @returns {Object} - {value, confidence, variance}
   */
  calculateCategoryRisk(indicators, categoryNum) {
    let sum = 0;
    let confidenceSum = 0;
    let count = 0;
    const values = [];

    for (let ind = 1; ind <= 10; ind++) {
      const id = `${categoryNum}.${ind}`;
      const indicator = indicators[id];

      if (indicator && indicator.current_bayesian !== undefined) {
        sum += indicator.current_bayesian;
        values.push(indicator.current_bayesian);
        count++;

        // Estimate confidence from data availability
        const socCount = indicator.soc_values?.length || 0;
        const humanCount = indicator.human_values?.length || 0;
        const indConfidence = Math.min((socCount + humanCount * 1.5) / 40, 1.0);
        confidenceSum += indConfidence;
      }
    }

    if (count === 0) {
      return { value: 0.5, confidence: 0, variance: 0 };
    }

    const mean = sum / count;
    const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / count;
    const confidence = confidenceSum / count;

    return {
      value: parseFloat(mean.toFixed(3)),
      confidence: parseFloat(confidence.toFixed(3)),
      variance: parseFloat(variance.toFixed(4))
    };
  },

  /**
   * Apply Bayesian network inference across categories
   * Adjusts category risks based on dependencies
   * @param {Object} categoryRisks - Initial category risk values
   * @returns {Object} - Adjusted category risks after Bayesian inference
   */
  applyBayesianNetwork(categoryRisks) {
    const CATEGORIES = ['authority', 'temporal', 'social', 'affective', 'cognitive',
      'group', 'stress', 'unconscious', 'ai', 'convergent'];

    const adjusted = {};

    for (const category of CATEGORIES) {
      const baseRisk = categoryRisks[category]?.value || 0.5;
      let adjustment = 0;
      let adjustmentWeight = 0;

      // Check dependencies: if dependent categories are high, increase this category's risk
      for (const [sourceCategory, dependencies] of Object.entries(this.DEPENDENCIES)) {
        if (dependencies[category]) {
          const sourceRisk = categoryRisks[sourceCategory]?.value || 0.5;
          const influence = dependencies[category];

          // If source is high-risk, it pulls this category up
          adjustment += (sourceRisk - 0.5) * influence;
          adjustmentWeight += influence;
        }
      }

      // Apply adjustment (dampened to avoid over-correction)
      const adjustedRisk = adjustmentWeight > 0
        ? baseRisk + (adjustment / adjustmentWeight) * 0.3 // 30% max adjustment
        : baseRisk;

      // Clamp to [0, 1]
      adjusted[category] = {
        value: parseFloat(Math.max(0, Math.min(1, adjustedRisk)).toFixed(3)),
        confidence: categoryRisks[category]?.confidence || 0.5,
        variance: categoryRisks[category]?.variance || 0
      };
    }

    return adjusted;
  },

  /**
   * Calculate overall organizational risk score
   * @param {Object} categoryRisks - Bayesian-adjusted category risks
   * @returns {Number} - Overall risk score [0, 1]
   */
  calculateOverallRisk(categoryRisks) {
    let weightedSum = 0;
    let totalWeight = 0;

    for (const [category, weight] of Object.entries(this.CATEGORY_WEIGHTS)) {
      const risk = categoryRisks[category]?.value || 0.5;
      const confidence = categoryRisks[category]?.confidence || 0.5;

      // Weight by both category importance and data confidence
      const effectiveWeight = weight * confidence;
      weightedSum += risk * effectiveWeight;
      totalWeight += effectiveWeight;
    }

    return totalWeight > 0
      ? parseFloat((weightedSum / totalWeight).toFixed(3))
      : 0.5;
  },

  /**
   * Generate prioritization insights
   * Identifies which indicators to fix first for maximum impact
   * @param {Object} categoryRisks - Category risk scores
   * @returns {Array} - Prioritized list of categories to address
   */
  generatePrioritization(categoryRisks) {
    const priorities = [];

    for (const [category, data] of Object.entries(categoryRisks)) {
      // Priority score = (risk × weight) + downstream_impact
      const weight = this.CATEGORY_WEIGHTS[category] || 0.1;
      const risk = data.value;

      // Calculate downstream impact (how many categories this influences)
      const dependencies = this.DEPENDENCIES[category] || {};
      const downstreamImpact = Object.values(dependencies).reduce((sum, inf) => sum + inf, 0);

      const priorityScore = (risk * weight) + (downstreamImpact * 0.1);

      priorities.push({
        category: category,
        risk: risk,
        confidence: data.confidence,
        priority_score: parseFloat(priorityScore.toFixed(3)),
        downstream_impact: parseFloat(downstreamImpact.toFixed(2)),
        recommendation: risk > 0.66 ? 'critical' : risk > 0.33 ? 'review' : 'monitor'
      });
    }

    // Sort by priority score descending
    priorities.sort((a, b) => b.priority_score - a.priority_score);

    return priorities;
  },

  /**
   * Calculate trend direction
   * @param {Array} values - Time series of risk values
   * @returns {String} - 'improving', 'stable', or 'deteriorating'
   */
  calculateTrend(values) {
    if (values.length < 2) return 'stable';

    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));

    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    const change = secondAvg - firstAvg;

    if (change > 0.05) return 'deteriorating';
    if (change < -0.05) return 'improving';
    return 'stable';
  },

  /**
   * Full Bayesian analysis for an organization
   * @param {Object} orgData - Organization data from organizations.json
   * @returns {Object} - Complete Bayesian analysis
   */
  analyzeOrganization(orgData) {
    const CATEGORIES = ['authority', 'temporal', 'social', 'affective', 'cognitive',
      'group', 'stress', 'unconscious', 'ai', 'convergent'];

    // Step 1: Calculate category risks
    const categoryRisks = {};
    CATEGORIES.forEach((name, idx) => {
      const categoryNum = idx + 1;
      categoryRisks[name] = this.calculateCategoryRisk(orgData.indicators, categoryNum);
    });

    // Step 2: Apply Bayesian network inference
    const adjustedRisks = this.applyBayesianNetwork(categoryRisks);

    // Step 3: Calculate overall risk
    const overallRisk = this.calculateOverallRisk(adjustedRisks);

    // Step 4: Generate prioritization
    const prioritization = this.generatePrioritization(adjustedRisks);

    // Step 5: Calculate overall confidence
    const avgConfidence = Object.values(adjustedRisks)
      .reduce((sum, cat) => sum + cat.confidence, 0) / CATEGORIES.length;

    // Step 6: Determine trend (using SOC data timeline)
    const socTimeline = [];
    for (const [id, indicator] of Object.entries(orgData.indicators)) {
      if (indicator.soc_values && indicator.soc_values.length > 0) {
        indicator.soc_values.forEach(soc => {
          socTimeline.push({ timestamp: soc.timestamp, value: soc.value });
        });
      }
    }
    socTimeline.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const timelineValues = socTimeline.map(t => t.value);
    const trend = this.calculateTrend(timelineValues);

    return {
      overall_risk: overallRisk,
      confidence: parseFloat(avgConfidence.toFixed(3)),
      trend: trend,
      by_category: adjustedRisks,
      prioritization: prioritization,
      last_calculated: new Date().toISOString()
    };
  }
};

// Export for use in browser or Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BAYESIAN;
}
