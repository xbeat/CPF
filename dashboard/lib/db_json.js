/**
 * CPF Data Manager - Specialista per lo storage basato su File JSON
 * Gestisce tutte le operazioni I/O per i file JSON.
 */

const fs = require('fs');
const path = require('path');
const config = require('../config');

const { dataDir, orgsDir, indexFile } = config.database.json;

// ============================================================================
// Helper Functions
// ============================================================================

function readJsonFile(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading or parsing JSON file: ${filePath}`, error);
    return null;
  }
}

function writeJsonFile(filePath, data) {
  ensureDir(path.dirname(filePath));
  const tempPath = `${filePath}.tmp`;
  const content = JSON.stringify(data, null, 2);
  fs.writeFileSync(tempPath, content, 'utf8');
  fs.renameSync(tempPath, filePath);
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// ============================================================================
// Initialization
// ============================================================================

/**
 * Initialize JSON storage - create necessary directories and files
 */
async function initialize() {
  console.log('[DB-JSON] Initializing JSON storage...');

  // Ensure all necessary directories exist
  ensureDir(dataDir);
  ensureDir(orgsDir);

  // Create organizations index if it doesn't exist
  const indexExists = fs.existsSync(indexFile);
  if (!indexExists) {
    console.log('[DB-JSON] Creating organizations index...');
    const emptyIndex = {
      metadata: {
        version: '2.0',
        last_updated: new Date().toISOString(),
        total_organizations: 0
      },
      organizations: []
    };
    await writeOrganizationsIndex(emptyIndex);
  }

  console.log('[DB-JSON] JSON storage initialized successfully');
  console.log(`[DB-JSON] Data directory: ${dataDir}`);
  console.log(`[DB-JSON] Organizations directory: ${orgsDir}`);
  console.log(`[DB-JSON] Index file: ${indexFile}`);
}

// ============================================================================
// Main Data Functions
// ============================================================================

async function readOrganizationsIndex() {
  const index = readJsonFile(indexFile);
  if (index) return index;
  // If index doesn't exist, create a new one
  return {
    metadata: { version: '2.0', last_updated: new Date().toISOString(), total_organizations: 0 },
    organizations: []
  };
}

async function writeOrganizationsIndex(data) {
  writeJsonFile(indexFile, data);
}

async function readOrganization(orgId) {
  const orgPath = path.join(orgsDir, `${orgId}.json`);
  return readJsonFile(orgPath);
}

async function writeOrganization(orgId, data) {
    const orgPath = path.join(orgsDir, `${orgId}.json`);
    writeJsonFile(orgPath, data);
    return data;
}

async function organizationExists(orgId) {
  const orgPath = path.join(orgsDir, `${orgId}.json`);
  return fs.existsSync(orgPath);
}

async function updateOrganization(orgId, updates) {
  const organization = await readOrganization(orgId);
  if (!organization) throw new Error(`Organization with ID ${orgId} not found.`);

  // Update metadata fields
  if (updates.name !== undefined) organization.name = updates.name;
  if (updates.industry !== undefined) organization.metadata.industry = updates.industry;
  if (updates.size !== undefined) organization.metadata.size = updates.size;
  if (updates.country !== undefined) organization.metadata.country = updates.country;
  if (updates.language !== undefined) organization.metadata.language = updates.language;
  if (updates.notes !== undefined) organization.metadata.notes = updates.notes;
  if (updates.sede_sociale !== undefined) organization.metadata.sede_sociale = updates.sede_sociale;
  if (updates.partita_iva !== undefined) organization.metadata.partita_iva = updates.partita_iva;
  if (updates.created_by !== undefined) organization.metadata.created_by = updates.created_by;

  organization.metadata.updated_at = new Date().toISOString();

  await writeOrganization(orgId, organization);
  return organization;
}

async function createOrganization(orgData) {
  await writeOrganization(orgData.id, orgData);

  const index = await readOrganizationsIndex();
  const existingIndex = index.organizations.findIndex(o => o.id === orgData.id);
  if (existingIndex !== -1) index.organizations.splice(existingIndex, 1);

  const indexEntry = {
    id: orgData.id,
    name: orgData.name,
    industry: orgData.metadata.industry,
    size: orgData.metadata.size,
    country: orgData.metadata.country,
    language: orgData.metadata.language,
    created_at: orgData.metadata.created_at,
    updated_at: orgData.metadata.updated_at,
    stats: {
        total_assessments: orgData.aggregates.completion.assessed_indicators,
        completion_percentage: orgData.aggregates.completion.percentage,
        overall_risk: orgData.aggregates.overall_risk,
    }
  };

  index.organizations.push(indexEntry);
  index.metadata.total_organizations = index.organizations.length;
  index.metadata.last_updated = new Date().toISOString();
  await writeOrganizationsIndex(index);

  return orgData;
}

async function saveAssessment(orgId, indicatorId, assessmentData) {
    const organization = await readOrganization(orgId);
    if (!organization) throw new Error(`Organization with ID ${orgId} not found.`);

    // Only save the assessment data - aggregates calculation is handled by dataManager
    organization.assessments[indicatorId] = assessmentData;
    organization.metadata.updated_at = new Date().toISOString();

    await writeOrganization(orgId, organization);
    return { success: true };
}

// ============================================================================
// Aggregates Calculation + CPF Maturity Model
// ============================================================================

const CATEGORY_NAMES = {
  '1': 'Authority-Based Vulnerabilities',
  '2': 'Temporal-Based Vulnerabilities',
  '3': 'Social-Based Vulnerabilities',
  '4': 'Affective-Based Vulnerabilities',
  '5': 'Cognitive-Based Vulnerabilities',
  '6': 'Group-Based Vulnerabilities',
  '7': 'Stress-Based Vulnerabilities',
  '8': 'Unconscious-Based Vulnerabilities',
  '9': 'AI-Enhanced Vulnerabilities',
  '10': 'Convergent Vulnerabilities'
};

/**
 * CPF Domain Weights (from CPF Maturity Model documentation)
 */
const CPF_DOMAIN_WEIGHTS = {
  '1': 0.15,  // Authority-Based
  '2': 0.12,  // Temporal-Based
  '3': 0.11,  // Social Influence
  '4': 0.10,  // Affective
  '5': 0.11,  // Cognitive Overload
  '6': 0.09,  // Group Dynamics
  '7': 0.10,  // Stress Response
  '8': 0.08,  // Unconscious Process
  '9': 0.07,  // AI-Specific
  '10': 0.07  // Convergent States
};

/**
 * Sector Benchmarks (from CPF Maturity Model documentation)
 */
const SECTOR_BENCHMARKS = {
  'Technology': { mean: 71, std_dev: 11 },
  'Finance': { mean: 68, std_dev: 12 },
  'Healthcare': { mean: 52, std_dev: 15 },
  'Government': { mean: 58, std_dev: 14 },
  'Retail': { mean: 48, std_dev: 13 },
  'Education': { mean: 55, std_dev: 14 },
  'Manufacturing': { mean: 60, std_dev: 13 },
  'Energy': { mean: 62, std_dev: 12 },
  'Transportation': { mean: 57, std_dev: 13 },
  'Other': { mean: 58, std_dev: 15 }
};

/**
 * ROI Data for maturity level transitions
 */
const ROI_TRANSITIONS = {
  '0_to_1': { investment: 50000, annual_benefit: 200000, payback_months: 3, npv_5yr: 850000 },
  '1_to_2': { investment: 250000, annual_benefit: 600000, payback_months: 5, npv_5yr: 2500000 },
  '2_to_3': { investment: 750000, annual_benefit: 1500000, payback_months: 6, npv_5yr: 5800000 },
  '3_to_4': { investment: 1500000, annual_benefit: 3000000, payback_months: 6, npv_5yr: 12000000 },
  '4_to_5': { investment: 2500000, annual_benefit: 5000000, payback_months: 6, npv_5yr: 20000000 }
};

function generateAllIndicatorIds() {
  const indicators = [];
  for (let category = 1; category <= 10; category++) {
    for (let num = 1; num <= 10; num++) {
      indicators.push(`${category}.${num}`);
    }
  }
  return indicators;
}

/**
 * Calculate overall CPF Score (0-100)
 */
function calculateCPFScore(assessments, byCategory) {
  let weightedSum = 0;
  for (let cat = 1; cat <= 10; cat++) {
    const catKey = cat.toString();
    const weight = CPF_DOMAIN_WEIGHTS[catKey] || 0;
    if (byCategory[catKey] && byCategory[catKey].avg_score !== undefined) {
      const domainScore = byCategory[catKey].avg_score * 40;
      weightedSum += weight * domainScore;
    }
  }
  const cpfScore = 100 - (weightedSum * 2.5);
  return Math.max(0, Math.min(100, parseFloat(cpfScore.toFixed(2))));
}

/**
 * Calculate Convergence Index
 */
function calculateConvergenceIndex(byCategory) {
  const categories = Object.keys(byCategory);
  let convergenceIndex = 0;
  const highRiskDomains = categories.filter(cat => byCategory[cat].avg_score > 0.66);
  for (let i = 0; i < highRiskDomains.length; i++) {
    for (let j = i + 1; j < highRiskDomains.length; j++) {
      const risk_i = byCategory[highRiskDomains[i]].avg_score;
      const risk_j = byCategory[highRiskDomains[j]].avg_score;
      convergenceIndex += risk_i * risk_j;
    }
  }
  return parseFloat(convergenceIndex.toFixed(4));
}

/**
 * Determine maturity level (0-5)
 */
function determineMaturityLevel(cpfScore, convergenceIndex, redDomainsCount) {
  const levelNames = ['Unaware', 'Initial', 'Developing', 'Defined', 'Managed', 'Optimizing'];
  if (cpfScore >= 90 && redDomainsCount === 0 && convergenceIndex < 2) {
    return { level: 5, name: levelNames[5] };
  }
  if (cpfScore >= 80 && redDomainsCount === 0 && convergenceIndex < 3) {
    return { level: 4, name: levelNames[4] };
  }
  if (cpfScore >= 60 && redDomainsCount <= 2 && convergenceIndex < 5) {
    return { level: 3, name: levelNames[3] };
  }
  if (cpfScore >= 40 && redDomainsCount <= 5 && convergenceIndex < 8) {
    return { level: 2, name: levelNames[2] };
  }
  if (cpfScore >= 20 && redDomainsCount <= 8 && convergenceIndex < 10) {
    return { level: 1, name: levelNames[1] };
  }
  return { level: 0, name: levelNames[0] };
}

/**
 * Count domains by maturity level
 */
function countDomainsByMaturity(byCategory) {
  let greenCount = 0, yellowCount = 0, redCount = 0;
  Object.values(byCategory).forEach(cat => {
    const score = cat.avg_score;
    if (score <= 0.33) greenCount++;
    else if (score <= 0.66) yellowCount++;
    else redCount++;
  });
  return { greenCount, yellowCount, redCount };
}

/**
 * Check regulatory compliance
 */
function checkCompliance(maturityLevel) {
  return {
    gdpr: {
      status: maturityLevel >= 1 ? 'compliant' : 'non_compliant',
      min_level_required: 1,
      recommended_level: 2
    },
    nis2: {
      status: maturityLevel >= 2 ? 'compliant' : (maturityLevel >= 1 ? 'at_risk' : 'non_compliant'),
      min_level_required: 2,
      recommended_level: 3
    },
    dora: {
      status: maturityLevel >= 2 ? 'compliant' : (maturityLevel >= 1 ? 'at_risk' : 'non_compliant'),
      min_level_required: 2,
      recommended_level: 3
    },
    iso27001: {
      status: maturityLevel >= 1 ? 'compliant' : 'non_compliant',
      min_level_required: 1,
      recommended_level: 2
    }
  };
}

/**
 * Get sector benchmark comparison
 */
function getSectorBenchmark(industry, cpfScore) {
  const benchmark = SECTOR_BENCHMARKS[industry] || SECTOR_BENCHMARKS['Other'];
  const gap = cpfScore - benchmark.mean;
  const zScore = gap / benchmark.std_dev;
  let percentile = 50;
  if (zScore > 0) percentile = 50 + (zScore * 19.1);
  else if (zScore < 0) percentile = 50 + (zScore * 19.1);
  percentile = Math.max(0, Math.min(100, percentile));
  return {
    sector_mean: benchmark.mean,
    sector_std_dev: benchmark.std_dev,
    percentile: parseFloat(percentile.toFixed(1)),
    gap: parseFloat(gap.toFixed(2))
  };
}

/**
 * Determine certification eligibility
 */
function determineCertificationPath(maturityLevel) {
  const eligibleFor = [];
  if (maturityLevel >= 1) eligibleFor.push('CPF-F');
  if (maturityLevel >= 2) eligibleFor.push('CPF-P');
  if (maturityLevel >= 4) eligibleFor.push('CPF-E');
  if (maturityLevel >= 5) eligibleFor.push('CPF-M');
  const currentCertification = eligibleFor.length > 0 ? eligibleFor[eligibleFor.length - 1] : 'none';
  return { current_certification: currentCertification, eligible_for: eligibleFor };
}

/**
 * Calculate ROI for next level
 */
function calculateROI(currentLevel) {
  if (currentLevel >= 5) return null;
  const transitionKey = `${currentLevel}_to_${currentLevel + 1}`;
  const roiData = ROI_TRANSITIONS[transitionKey];
  if (!roiData) return null;
  return {
    next_level: currentLevel + 1,
    estimated_investment: roiData.investment,
    annual_benefit: roiData.annual_benefit,
    payback_months: roiData.payback_months,
    npv_5yr: roiData.npv_5yr
  };
}

/**
 * Calculate complete maturity model
 */
function calculateMaturityModel(assessments, byCategory, industry) {
  try {
    const cpfScore = calculateCPFScore(assessments, byCategory);
    const convergenceIndex = calculateConvergenceIndex(byCategory);
    const { greenCount, yellowCount, redCount } = countDomainsByMaturity(byCategory);
    const maturityLevel = determineMaturityLevel(cpfScore, convergenceIndex, redCount);
    const compliance = checkCompliance(maturityLevel.level);
    const sectorBenchmark = getSectorBenchmark(industry, cpfScore);
    const certificationPath = determineCertificationPath(maturityLevel.level);
    const roiAnalysis = calculateROI(maturityLevel.level);
    return {
      cpf_score: cpfScore,
      maturity_level: maturityLevel.level,
      level_name: maturityLevel.name,
      convergence_index: convergenceIndex,
      red_domains_count: redCount,
      yellow_domains_count: yellowCount,
      green_domains_count: greenCount,
      compliance: compliance,
      sector_benchmark: sectorBenchmark,
      certification_path: certificationPath,
      roi_analysis: roiAnalysis
    };
  } catch (error) {
    console.error('Error calculating maturity model:', error);
    // Return a basic maturity model with safe defaults
    return {
      cpf_score: 50,
      maturity_level: 0,
      level_name: 'Unaware',
      convergence_index: 0,
      red_domains_count: 0,
      yellow_domains_count: 0,
      green_domains_count: 0,
      compliance: { gdpr: {}, nis2: {}, dora: {}, iso27001: {} },
      sector_benchmark: { industry: industry || 'Other', percentile: 0, z_score: 0 },
      certification_path: { eligible: [], required_improvements: [] },
      roi_analysis: { current_level: 0, next_level: 1, estimated_roi: '0%' }
    };
  }
}

/**
 * Calculate aggregates for organization
 */
function calculateAggregates(assessments, industry = 'Other') {
  const assessmentArray = Object.values(assessments);
  if (assessmentArray.length === 0) {
    return {
      overall_risk: 0.5,
      overall_confidence: 0.0,
      trend: 'stable',
      by_category: {},
      completion: {
        total_indicators: 100,
        assessed_indicators: 0,
        percentage: 0.0,
        missing_indicators: generateAllIndicatorIds()
      },
      last_calculated: new Date().toISOString()
    };
  }

  // Overall stats
  const overallRisk = assessmentArray.reduce((sum, a) => sum + a.bayesian_score, 0) / assessmentArray.length;
  const overallConfidence = assessmentArray.reduce((sum, a) => sum + a.confidence, 0) / assessmentArray.length;

  // By category
  const byCategory = {};
  for (let cat = 1; cat <= 10; cat++) {
    const catKey = cat.toString();
    const catAssessments = assessmentArray.filter(a => a.indicator_id.startsWith(`${cat}.`));
    if (catAssessments.length > 0) {
      const avgScore = catAssessments.reduce((sum, a) => sum + a.bayesian_score, 0) / catAssessments.length;
      const avgConfidence = catAssessments.reduce((sum, a) => sum + a.confidence, 0) / catAssessments.length;
      byCategory[catKey] = {
        category_name: CATEGORY_NAMES[catKey],
        avg_score: parseFloat(avgScore.toFixed(4)),
        avg_confidence: parseFloat(avgConfidence.toFixed(4)),
        total_assessments: catAssessments.length,
        completion_percentage: parseFloat((catAssessments.length / 10 * 100).toFixed(2))
      };
    }
  }

  // Completion
  const allIndicators = generateAllIndicatorIds();
  const assessedIndicators = Object.keys(assessments).filter(id =>
    assessments[id] && assessments[id].bayesian_score > 0
  );
  const missingIndicators = allIndicators.filter(id => !assessedIndicators.includes(id));

  // Maturity model - only calculate if we have category data
  const maturityModel = Object.keys(byCategory).length > 0
    ? calculateMaturityModel(assessments, byCategory, industry || 'Other')
    : null;

  return {
    overall_risk: parseFloat(overallRisk.toFixed(4)),
    overall_confidence: parseFloat(overallConfidence.toFixed(4)),
    trend: 'stable',
    by_category: byCategory,
    completion: {
      total_indicators: 100,
      assessed_indicators: assessedIndicators.length,
      percentage: parseFloat((assessedIndicators.length / 100 * 100).toFixed(2)),
      missing_indicators: missingIndicators
    },
    maturity_model: maturityModel,
    last_calculated: new Date().toISOString()
  };
}

/**
 * Recalculate aggregates for an organization (useful for migration or data repair)
 */
async function recalculateAggregates(orgId) {
  const organization = await readOrganization(orgId);
  if (!organization) throw new Error(`Organization with ID ${orgId} not found.`);

  organization.aggregates = calculateAggregates(
    organization.assessments,
    organization.metadata.industry || 'Other'
  );
  organization.metadata.updated_at = new Date().toISOString();

  await writeOrganization(orgId, organization);
  return { success: true, aggregates: organization.aggregates };
}

/**
 * Recalculate aggregates for all organizations
 */
async function recalculateAllAggregates() {
  const index = await readOrganizationsIndex();
  if (!index || !index.organizations) return [];

  const results = [];

  for (const orgSummary of index.organizations) {
    try {
      const result = await recalculateAggregates(orgSummary.id);
      results.push({ id: orgSummary.id, name: orgSummary.name, success: true });
    } catch (error) {
      results.push({ id: orgSummary.id, name: orgSummary.name, success: false, error: error.message });
    }
  }

  return results;
}

/**
 * Get SOC indicator data for an organization
 * Returns SOC indicators from {org-name}-soc.json file (NOT assessments)
 */
async function getSocData(orgId) {
  const organization = await readOrganization(orgId);
  if (!organization) {
    return null;
  }

  // Normalize organization name for SOC filename
  const normalizedOrgName = organization.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const socFilePath = path.join(orgsDir, `${normalizedOrgName}-soc.json`);

  // Read SOC file (separate from organization.json)
  let socData = readJsonFile(socFilePath);

  // If no SOC file exists or no indicators, return null (to trigger "generate data" message in dashboard)
  if (!socData || !socData.indicators || Object.keys(socData.indicators).length === 0) {
    return null;
  }

  return socData;
}

/**
 * Save SOC indicator to {org-name}-soc.json file (SEPARATE from assessments)
 */
async function saveSocIndicator(orgId, assessmentData) {
  const indicatorId = assessmentData.indicator_id;
  const value = assessmentData.bayesian_score;

  const organization = await readOrganization(orgId);
  if (!organization) {
    throw new Error(`Organization ${orgId} not found`);
  }

  // Normalize organization name for SOC filename
  const normalizedOrgName = organization.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const socFilePath = path.join(orgsDir, `${normalizedOrgName}-soc.json`);

  // Read existing SOC file or create new one
  let socData = readJsonFile(socFilePath);
  if (!socData) {
    socData = {
      org_id: organization.id,
      org_name: organization.name,
      indicators: {}
    };
  }

  // Get previous value
  const previousValue = socData.indicators[indicatorId]
    ? socData.indicators[indicatorId].value
    : null;

  const eventCount = socData.indicators[indicatorId]
    ? (socData.indicators[indicatorId].event_count || 0) + 1
    : 1;

  // Update indicator value
  socData.indicators[indicatorId] = {
    indicator_id: indicatorId,
    value: value,
    previous_value: previousValue,
    event_count: eventCount,
    last_event_type: assessmentData.event_type || assessmentData.raw_data?.event_type || null,
    last_event_severity: assessmentData.severity || assessmentData.raw_data?.severity || null,
    last_updated: new Date().toISOString()
  };

  // Write SOC file (separate from organization.json!)
  writeJsonFile(socFilePath, socData);

  console.log(`[DB-JSON] Successfully saved SOC indicator ${indicatorId} for organization ${orgId} (value: ${value}, previous: ${previousValue}).`);

  return {
    orgId,
    indicatorId,
    previousValue,
    newValue: value,
    eventCount
  };
}

module.exports = {
  initialize,
  createOrganization,
  readOrganization,
  updateOrganization,
  writeOrganization,
  organizationExists,
  saveAssessment,
  getSocData,
  saveSocIndicator,
  calculateAggregates,
  recalculateAggregates,
  recalculateAllAggregates,
  readOrganizationsIndex,
  writeOrganizationsIndex,
  // Placeholder for other potential functions to avoid breaking require()
  updateOrganizationInIndex: async () => {},
  removeOrganizationFromIndex: async () => {},
  getAssessment: async () => null,
  deleteAssessment: async () => ({ success: true }),
  saveIndicatorMetadata: async () => ({ success: true }),
};
