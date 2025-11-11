/**
 * CPF Data Manager - Utility functions for organization and assessment management
 * Handles all file I/O operations for JSON-based storage
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// Configuration
// ============================================================================

const DATA_DIR = path.join(__dirname, '..', 'data');
const ORGS_DIR = path.join(DATA_DIR, 'organizations');
const INDEX_FILE = path.join(DATA_DIR, 'organizations_index.json');

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

// ============================================================================
// File I/O Helpers
// ============================================================================

/**
 * Read JSON file safely
 */
function readJsonFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content);
}

/**
 * Write JSON file safely (atomic write with temp file)
 */
function writeJsonFile(filePath, data) {
  const tempPath = `${filePath}.tmp`;
  const content = JSON.stringify(data, null, 2);

  // Write to temp file first
  fs.writeFileSync(tempPath, content, 'utf8');

  // Atomic rename
  fs.renameSync(tempPath, filePath);
}

/**
 * Ensure directory exists
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// ============================================================================
// Organizations Index Management
// ============================================================================

/**
 * Read organizations index
 */
function readOrganizationsIndex() {
  if (!fs.existsSync(INDEX_FILE)) {
    return {
      metadata: {
        version: '2.0',
        last_updated: new Date().toISOString(),
        total_organizations: 0
      },
      organizations: []
    };
  }
  return readJsonFile(INDEX_FILE);
}

/**
 * Write organizations index
 */
function writeOrganizationsIndex(index) {
  ensureDir(DATA_DIR);
  index.metadata.last_updated = new Date().toISOString();
  index.metadata.total_organizations = index.organizations.length;
  writeJsonFile(INDEX_FILE, index);
}

/**
 * Update organization in index
 */
function updateOrganizationInIndex(orgData) {
  const index = readOrganizationsIndex();

  const existingIndex = index.organizations.findIndex(o => o.id === orgData.id);

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
      avg_confidence: orgData.aggregates.overall_confidence,
      last_assessment_date: getLastAssessmentDate(orgData.assessments)
    }
  };

  if (existingIndex >= 0) {
    index.organizations[existingIndex] = indexEntry;
  } else {
    index.organizations.push(indexEntry);
  }

  writeOrganizationsIndex(index);
}

/**
 * Remove organization from index
 */
function removeOrganizationFromIndex(orgId) {
  const index = readOrganizationsIndex();
  index.organizations = index.organizations.filter(o => o.id !== orgId);
  writeOrganizationsIndex(index);
}

/**
 * Get last assessment date from assessments object
 */
function getLastAssessmentDate(assessments) {
  const dates = Object.values(assessments).map(a => new Date(a.assessment_date));
  if (dates.length === 0) return null;
  return new Date(Math.max(...dates)).toISOString();
}

// ============================================================================
// Organization Management
// ============================================================================

/**
 * Read single organization
 */
function readOrganization(orgId) {
  const filePath = path.join(ORGS_DIR, `${orgId}.json`);
  return readJsonFile(filePath);
}

/**
 * Write single organization
 */
function writeOrganization(orgData) {
  ensureDir(ORGS_DIR);
  const filePath = path.join(ORGS_DIR, `${orgData.id}.json`);
  orgData.metadata.updated_at = new Date().toISOString();
  writeJsonFile(filePath, orgData);

  // Update index
  updateOrganizationInIndex(orgData);
}

/**
 * Check if organization exists
 */
function organizationExists(orgId) {
  const filePath = path.join(ORGS_DIR, `${orgId}.json`);
  return fs.existsSync(filePath);
}

/**
 * Delete organization
 */
function deleteOrganization(orgId) {
  const filePath = path.join(ORGS_DIR, `${orgId}.json`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  removeOrganizationFromIndex(orgId);
}

/**
 * Create new organization
 */
function createOrganization(orgConfig) {
  const now = new Date().toISOString();

  const orgData = {
    id: orgConfig.id,
    name: orgConfig.name,
    metadata: {
      industry: orgConfig.industry,
      size: orgConfig.size,
      country: orgConfig.country,
      language: orgConfig.language || 'en-US',
      created_at: now,
      updated_at: now,
      created_by: orgConfig.created_by || 'System',
      notes: orgConfig.notes || ''
    },
    assessments: {},
    aggregates: {
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
      last_calculated: now
    }
  };

  writeOrganization(orgData);
  return orgData;
}

// ============================================================================
// Assessment Management
// ============================================================================

/**
 * Save assessment to organization
 */
function saveAssessment(orgId, assessmentData) {
  const orgData = readOrganization(orgId);

  // Add or update assessment
  orgData.assessments[assessmentData.indicator_id] = assessmentData;

  // Recalculate aggregates
  orgData.aggregates = calculateAggregates(orgData.assessments);

  // Save
  writeOrganization(orgData);

  return orgData;
}

/**
 * Get assessment from organization
 */
function getAssessment(orgId, indicatorId) {
  const orgData = readOrganization(orgId);
  return orgData.assessments[indicatorId] || null;
}

/**
 * Delete assessment from organization
 */
function deleteAssessment(orgId, indicatorId) {
  const orgData = readOrganization(orgId);

  if (orgData.assessments[indicatorId]) {
    delete orgData.assessments[indicatorId];

    // Recalculate aggregates
    orgData.aggregates = calculateAggregates(orgData.assessments);

    // Save
    writeOrganization(orgData);
  }

  return orgData;
}

// ============================================================================
// Aggregates Calculation
// ============================================================================

/**
 * Generate all indicator IDs (1.1 to 10.10)
 */
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
 * Calculate aggregates for organization
 */
function calculateAggregates(assessments) {
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
  const assessedIndicators = Object.keys(assessments);
  const missingIndicators = allIndicators.filter(id => !assessedIndicators.includes(id));

  return {
    overall_risk: parseFloat(overallRisk.toFixed(4)),
    overall_confidence: parseFloat(overallConfidence.toFixed(4)),
    trend: 'stable', // For now, set as stable
    by_category: byCategory,
    completion: {
      total_indicators: 100,
      assessed_indicators: assessedIndicators.length,
      percentage: parseFloat((assessedIndicators.length / 100 * 100).toFixed(2)),
      missing_indicators: missingIndicators
    },
    last_calculated: new Date().toISOString()
  };
}

/**
 * Recalculate aggregates for organization
 */
function recalculateAggregates(orgId) {
  const orgData = readOrganization(orgId);
  orgData.aggregates = calculateAggregates(orgData.assessments);
  writeOrganization(orgData);
  return orgData;
}

// ============================================================================
// Exports
// ============================================================================

module.exports = {
  // Index operations
  readOrganizationsIndex,
  writeOrganizationsIndex,
  updateOrganizationInIndex,
  removeOrganizationFromIndex,

  // Organization operations
  readOrganization,
  writeOrganization,
  createOrganization,
  deleteOrganization,
  organizationExists,

  // Assessment operations
  saveAssessment,
  getAssessment,
  deleteAssessment,

  // Aggregates
  calculateAggregates,
  recalculateAggregates,

  // Helpers
  generateAllIndicatorIds,

  // Constants
  DATA_DIR,
  ORGS_DIR,
  INDEX_FILE,
  CATEGORY_NAMES
};
