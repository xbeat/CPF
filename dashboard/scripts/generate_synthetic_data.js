#!/usr/bin/env node

/**
 * CPF Synthetic Data Generator
 *
 * Generates realistic SOC + Human assessment data for dashboard testing
 * Output: ../data/organizations.json
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  num_organizations: 8,
  days_history: 30,
  soc_frequency_days: 1,      // SOC assesses daily
  human_frequency_days: 7,     // Human audits weekly
  base_date: new Date('2025-10-09T00:00:00Z')
};

const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Retail', 'Government', 'Education'];
const SIZES = ['small', 'medium', 'enterprise'];
const COUNTRIES = ['US', 'IT', 'GB', 'DE', 'FR', 'ES', 'CA', 'AU'];
const SOC_SOURCES = ['siem-analyzer', 'ids-correlator', 'edr-agent', 'behavioral-analytics'];
const ASSESSORS = ['Alice Johnson', 'Bob Smith', 'Carol White', 'David Brown', 'Emma Davis'];

const CATEGORIES = {
  1: 'authority',
  2: 'temporal',
  3: 'social',
  4: 'affective',
  5: 'cognitive',
  6: 'group',
  7: 'stress',
  8: 'unconscious',
  9: 'ai',
  10: 'convergent'
};

// Helper: Random number in range
function random(min, max) {
  return Math.random() * (max - min) + min;
}

// Helper: Random integer in range
function randomInt(min, max) {
  return Math.floor(random(min, max + 1));
}

// Helper: Pick random from array
function randomChoice(arr) {
  return arr[randomInt(0, arr.length - 1)];
}

// Helper: Generate realistic vulnerability value with org bias
function generateValue(orgBias, variance = 0.15) {
  let value = orgBias + random(-variance, variance);
  return Math.max(0, Math.min(1, value)); // Clamp to [0, 1]
}

// Helper: ISO timestamp
function isoTimestamp(date) {
  return date.toISOString();
}

// Generate organization profile
function generateOrgProfile(id) {
  const orgBias = random(0.2, 0.8); // Organization-wide vulnerability baseline

  return {
    id: `org-${String(id).padStart(3, '0')}`,
    name: `Organization ${id}`,
    industry: randomChoice(INDUSTRIES),
    size: randomChoice(SIZES),
    country: randomChoice(COUNTRIES),
    orgBias: orgBias // Used for generating consistent data, not stored
  };
}

// Generate SOC values for an indicator over time
function generateSOCValues(orgBias, categoryBias) {
  const values = [];
  const indicatorBias = orgBias * 0.6 + categoryBias * 0.4; // Mix org and category factors

  for (let day = 0; day <= CONFIG.days_history; day += CONFIG.soc_frequency_days) {
    const date = new Date(CONFIG.base_date);
    date.setDate(date.getDate() + day);

    // Add some temporal drift (vulnerability increasing over time slightly)
    const drift = day / CONFIG.days_history * 0.05;

    values.push({
      timestamp: isoTimestamp(date),
      value: generateValue(indicatorBias + drift, 0.1),
      confidence: random(0.75, 0.95),
      source: randomChoice(SOC_SOURCES)
    });
  }

  return values;
}

// Generate human assessment values
function generateHumanValues(orgBias, categoryBias) {
  const values = [];
  const indicatorBias = orgBias * 0.6 + categoryBias * 0.4;

  for (let day = 0; day <= CONFIG.days_history; day += CONFIG.human_frequency_days) {
    const date = new Date(CONFIG.base_date);
    date.setDate(date.getDate() + day);
    date.setHours(14, 30, 0); // Audits happen at 2:30 PM

    const drift = day / CONFIG.days_history * 0.05;

    values.push({
      timestamp: isoTimestamp(date),
      value: generateValue(indicatorBias + drift, 0.12), // Humans have slightly more variance
      assessor: randomChoice(ASSESSORS),
      assessment_id: `as-${String(randomInt(1000, 9999))}`
    });
  }

  return values;
}

// Simple Bayesian merge (weighted average by confidence)
function calculateBayesian(socValues, humanValues) {
  if (socValues.length === 0 && humanValues.length === 0) return 0.5;

  let totalWeight = 0;
  let weightedSum = 0;

  // Latest SOC value (more recent = higher weight)
  if (socValues.length > 0) {
    const latest = socValues[socValues.length - 1];
    const weight = latest.confidence;
    weightedSum += latest.value * weight;
    totalWeight += weight;
  }

  // Latest human value (humans get 1.5x weight)
  if (humanValues.length > 0) {
    const latest = humanValues[humanValues.length - 1];
    const weight = 1.5;
    weightedSum += latest.value * weight;
    totalWeight += weight;
  }

  return totalWeight > 0 ? weightedSum / totalWeight : 0.5;
}

// Generate all 100 indicators for an organization
function generateIndicators(orgProfile) {
  const indicators = {};
  const categoryBiases = {};

  // Generate category biases (some categories are worse than others per org)
  for (let cat = 1; cat <= 10; cat++) {
    categoryBiases[cat] = random(0.2, 0.8);
  }

  for (let category = 1; category <= 10; category++) {
    for (let indicator = 1; indicator <= 10; indicator++) {
      const id = `${category}.${indicator}`;

      const socValues = generateSOCValues(orgProfile.orgBias, categoryBiases[category]);
      const humanValues = generateHumanValues(orgProfile.orgBias, categoryBiases[category]);
      const currentBayesian = calculateBayesian(socValues, humanValues);

      const lastSOC = socValues[socValues.length - 1]?.timestamp;
      const lastHuman = humanValues[humanValues.length - 1]?.timestamp;
      const lastUpdated = lastHuman > lastSOC ? lastHuman : lastSOC;

      indicators[id] = {
        soc_values: socValues,
        human_values: humanValues,
        current_bayesian: parseFloat(currentBayesian.toFixed(3)),
        last_updated: lastUpdated
      };
    }
  }

  return indicators;
}

// Calculate aggregates
function calculateAggregates(indicators) {
  const byCategory = {};

  // Calculate per-category averages
  for (let cat = 1; cat <= 10; cat++) {
    const categoryName = CATEGORIES[cat];
    let sum = 0;
    let count = 0;

    for (let ind = 1; ind <= 10; ind++) {
      const id = `${cat}.${ind}`;
      sum += indicators[id].current_bayesian;
      count++;
    }

    byCategory[categoryName] = parseFloat((sum / count).toFixed(3));
  }

  // Overall risk (weighted average of categories)
  const categoryWeights = {
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
  };

  let overallRisk = 0;
  for (const [category, weight] of Object.entries(categoryWeights)) {
    overallRisk += byCategory[category] * weight;
  }

  // Determine trend (comparing first week vs last week)
  const firstWeekAvg = Object.values(indicators).reduce((sum, ind) => {
    const firstSOC = ind.soc_values[0]?.value || 0.5;
    return sum + firstSOC;
  }, 0) / 100;

  const lastWeekAvg = Object.values(indicators).reduce((sum, ind) => {
    const lastSOC = ind.soc_values[ind.soc_values.length - 1]?.value || 0.5;
    return sum + lastSOC;
  }, 0) / 100;

  let trend = 'stable';
  if (lastWeekAvg > firstWeekAvg + 0.05) trend = 'deteriorating';
  if (lastWeekAvg < firstWeekAvg - 0.05) trend = 'improving';

  return {
    overall_risk: parseFloat(overallRisk.toFixed(3)),
    by_category: byCategory,
    confidence: random(0.80, 0.92),
    trend: trend,
    last_calculated: isoTimestamp(new Date())
  };
}

// Main generation
function generateData() {
  console.log('🔧 Generating synthetic CPF data...\n');

  const organizations = {};

  for (let i = 1; i <= CONFIG.num_organizations; i++) {
    const profile = generateOrgProfile(i);
    console.log(`  [${i}/${CONFIG.num_organizations}] ${profile.id} - ${profile.name} (${profile.industry}, ${profile.size})`);

    const indicators = generateIndicators(profile);
    const aggregates = calculateAggregates(indicators);

    organizations[profile.id] = {
      name: profile.name,
      industry: profile.industry,
      size: profile.size,
      country: profile.country,
      indicators: indicators,
      aggregates: aggregates
    };
  }

  const data = {
    metadata: {
      version: '1.0',
      generated: isoTimestamp(new Date()),
      total_organizations: CONFIG.num_organizations
    },
    organizations: organizations
  };

  return data;
}

// Save to file
function saveData(data) {
  const outputPath = path.join(__dirname, '../data/organizations.json');

  // Ensure data directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

  const sizeKB = (fs.statSync(outputPath).size / 1024).toFixed(2);
  console.log(`\n✅ Generated ${outputPath}`);
  console.log(`📊 Size: ${sizeKB} KB`);
  console.log(`🏢 Organizations: ${data.metadata.total_organizations}`);
  console.log(`📈 Indicators per org: 100 (1.1 - 10.10)`);
  console.log(`📅 History: ${CONFIG.days_history} days`);
}

// Run
try {
  const data = generateData();
  saveData(data);
  console.log('\n✨ Done!\n');
} catch (error) {
  console.error('❌ Error generating data:', error);
  process.exit(1);
}
