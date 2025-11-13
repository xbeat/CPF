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
const TRASH_DIR = path.join(DATA_DIR, 'trash');
const HISTORY_DIR = path.join(DATA_DIR, 'history');
const AUDIT_LOG_FILE = path.join(DATA_DIR, 'audit_log.json');

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
// Audit Log Management
// ============================================================================

/**
 * Read audit log
 */
function readAuditLog() {
  if (!fs.existsSync(AUDIT_LOG_FILE)) {
    return {
      metadata: {
        version: '1.0',
        created_at: new Date().toISOString()
      },
      entries: []
    };
  }
  return readJsonFile(AUDIT_LOG_FILE);
}

/**
 * Write audit log entry
 */
function logAuditEvent(action, entityType, entityId, details = {}, user = 'System') {
  ensureDir(DATA_DIR);

  const log = readAuditLog();

  const entry = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    user: user,
    action: action, // create, update, delete, restore, export, revert
    entity_type: entityType, // organization, assessment
    entity_id: entityId,
    details: details
  };

  log.entries.unshift(entry); // Add to beginning

  // Keep last 1000 entries
  if (log.entries.length > 1000) {
    log.entries = log.entries.slice(0, 1000);
  }

  writeJsonFile(AUDIT_LOG_FILE, log);
  return entry;
}

/**
 * Get audit log entries with filters
 */
function getAuditLog(filters = {}) {
  const log = readAuditLog();
  let entries = log.entries;

  // Filter by entity_type
  if (filters.entity_type) {
    entries = entries.filter(e => e.entity_type === filters.entity_type);
  }

  // Filter by entity_id
  if (filters.entity_id) {
    entries = entries.filter(e => e.entity_id === filters.entity_id);
  }

  // Filter by action
  if (filters.action) {
    entries = entries.filter(e => e.action === filters.action);
  }

  // Filter by user
  if (filters.user) {
    entries = entries.filter(e => e.user === filters.user);
  }

  // Filter by date range
  if (filters.from_date) {
    entries = entries.filter(e => new Date(e.timestamp) >= new Date(filters.from_date));
  }
  if (filters.to_date) {
    entries = entries.filter(e => new Date(e.timestamp) <= new Date(filters.to_date));
  }

  // Limit results
  const limit = filters.limit || 100;
  return entries.slice(0, limit);
}

/**
 * Fetch indicator metadata from GitHub
 */
async function fetchIndicatorFromGitHub(indicatorId, language = 'en-US') {
  const [category, indicator] = indicatorId.split('.');
  const categoryNames = {
    '1': '1.x-authority', '2': '2.x-temporal', '3': '3.x-social', '4': '4.x-affective',
    '5': '5.x-cognitive', '6': '6.x-group', '7': '7.x-stress', '8': '8.x-unconscious',
    '9': '9.x-ai', '10': '10.x-convergent'
  };

  const url = `https://raw.githubusercontent.com/xbeat/CPF/main/auditor%20field%20kit/interactive/${language}/${categoryNames[category]}/indicator_${indicatorId}.json`;

  try {
    const https = require('https');
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(new Error(`Failed to parse JSON for ${indicatorId}`));
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode} for ${indicatorId}`));
          }
        });
      }).on('error', reject);
    });
  } catch (error) {
    throw new Error(`Failed to fetch indicator ${indicatorId}: ${error.message}`);
  }
}

// ============================================================================
// Organizations Index Management
// ============================================================================

/**
 * Read organizations index (excludes soft-deleted organizations by default)
 */
function readOrganizationsIndex(includeDeleted = false) {
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
  const index = readJsonFile(INDEX_FILE);

  if (!includeDeleted) {
    index.organizations = index.organizations.filter(o => !o.deleted_at);
  }

  return index;
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
    deleted_at: orgData.metadata.deleted_at || null,
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
 * Soft delete organization (moves to trash)
 */
function deleteOrganization(orgId, user = 'System') {
  const orgData = readOrganization(orgId);

  // Mark as deleted
  orgData.metadata.deleted_at = new Date().toISOString();
  orgData.metadata.deleted_by = user;

  // Save to main location (with deleted flag)
  writeOrganization(orgData);

  // Log audit event
  logAuditEvent('delete', 'organization', orgId, {
    name: orgData.name,
    assessments_count: Object.keys(orgData.assessments).length
  }, user);

  return orgData;
}

/**
 * Restore organization from trash
 */
function restoreOrganization(orgId, user = 'System') {
  const orgData = readOrganization(orgId);

  if (!orgData.metadata.deleted_at) {
    throw new Error('Organization is not in trash');
  }

  // Remove deleted flag
  delete orgData.metadata.deleted_at;
  delete orgData.metadata.deleted_by;

  // Save
  writeOrganization(orgData);

  // Log audit event
  logAuditEvent('restore', 'organization', orgId, {
    name: orgData.name
  }, user);

  return orgData;
}

/**
 * Permanently delete organization (cannot be undone)
 */
function permanentlyDeleteOrganization(orgId, user = 'System') {
  const orgData = readOrganization(orgId);

  if (!orgData.metadata.deleted_at) {
    throw new Error('Organization must be in trash before permanent deletion');
  }

  const filePath = path.join(ORGS_DIR, `${orgId}.json`);

  // Log audit event before deletion
  logAuditEvent('permanent_delete', 'organization', orgId, {
    name: orgData.name,
    assessments_count: Object.keys(orgData.assessments).length
  }, user);

  // Delete file
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // Remove from index
  removeOrganizationFromIndex(orgId);

  return { success: true, orgId };
}

/**
 * Get organizations in trash
 */
function getTrash() {
  const index = readOrganizationsIndex(true); // Include deleted
  const trashOrgs = index.organizations.filter(o => o.deleted_at);

  // Calculate days until auto-delete (30 days retention)
  trashOrgs.forEach(org => {
    const deletedDate = new Date(org.deleted_at);
    const now = new Date();
    const daysElapsed = Math.floor((now - deletedDate) / (1000 * 60 * 60 * 24));
    org.days_until_permanent_delete = Math.max(0, 30 - daysElapsed);
  });

  return trashOrgs;
}

/**
 * Auto-delete organizations older than 30 days in trash
 */
function cleanupTrash(user = 'System') {
  const trashOrgs = getTrash();
  let deletedCount = 0;

  trashOrgs.forEach(org => {
    if (org.days_until_permanent_delete === 0) {
      try {
        permanentlyDeleteOrganization(org.id, user);
        deletedCount++;
      } catch (error) {
        console.error(`Failed to auto-delete ${org.id}:`, error.message);
      }
    }
  });

  return { deletedCount };
}

/**
 * Create new organization
 */
function createOrganization(orgConfig) {
  const now = new Date().toISOString();
  const user = orgConfig.created_by || 'System';

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
      created_by: user,
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

  // Log audit event
  logAuditEvent('create', 'organization', orgData.id, {
    name: orgData.name,
    industry: orgData.metadata.industry,
    country: orgData.metadata.country
  }, user);

  return orgData;
}

// ============================================================================
// Assessment Versioning
// ============================================================================

/**
 * Save assessment version to history
 */
function saveAssessmentVersion(orgId, indicatorId, assessmentData, user = 'System') {
  ensureDir(HISTORY_DIR);

  const historyFile = path.join(HISTORY_DIR, `${orgId}_${indicatorId}.json`);

  let history = {
    org_id: orgId,
    indicator_id: indicatorId,
    versions: []
  };

  if (fs.existsSync(historyFile)) {
    history = readJsonFile(historyFile);
  }

  const version = {
    version: history.versions.length + 1,
    timestamp: new Date().toISOString(),
    user: user,
    data: assessmentData
  };

  history.versions.push(version);

  // Keep last 50 versions
  if (history.versions.length > 50) {
    history.versions = history.versions.slice(-50);
  }

  writeJsonFile(historyFile, history);
  return version;
}

/**
 * Get assessment version history
 */
function getAssessmentHistory(orgId, indicatorId) {
  const historyFile = path.join(HISTORY_DIR, `${orgId}_${indicatorId}.json`);

  if (!fs.existsSync(historyFile)) {
    return {
      org_id: orgId,
      indicator_id: indicatorId,
      versions: []
    };
  }

  return readJsonFile(historyFile);
}

/**
 * Revert assessment to specific version
 */
function revertAssessment(orgId, indicatorId, versionNumber, user = 'System') {
  const history = getAssessmentHistory(orgId, indicatorId);

  const targetVersion = history.versions.find(v => v.version === versionNumber);

  if (!targetVersion) {
    throw new Error(`Version ${versionNumber} not found for ${indicatorId}`);
  }

  // Save current as new version before reverting
  const orgData = readOrganization(orgId);
  const currentAssessment = orgData.assessments[indicatorId];

  if (currentAssessment) {
    saveAssessmentVersion(orgId, indicatorId, currentAssessment, user);
  }

  // Restore old version
  orgData.assessments[indicatorId] = targetVersion.data;
  orgData.aggregates = calculateAggregates(orgData.assessments);
  writeOrganization(orgData);

  // Log audit event
  logAuditEvent('revert', 'assessment', `${orgId}/${indicatorId}`, {
    reverted_to_version: versionNumber,
    previous_score: currentAssessment?.bayesian_score,
    new_score: targetVersion.data.bayesian_score
  }, user);

  return orgData;
}

// ============================================================================
// Assessment Management
// ============================================================================

/**
 * Save assessment to organization
 */
function saveAssessment(orgId, assessmentData, user = 'System') {
  const orgData = readOrganization(orgId);
  const indicatorId = assessmentData.indicator_id;

  // Check if this is an update (save previous version)
  const isUpdate = !!orgData.assessments[indicatorId];
  const previousScore = isUpdate ? orgData.assessments[indicatorId].bayesian_score : null;

  if (isUpdate) {
    // Save previous version to history
    saveAssessmentVersion(orgId, indicatorId, orgData.assessments[indicatorId], user);
  }

  // Add or update assessment
  orgData.assessments[indicatorId] = assessmentData;

  // Recalculate aggregates
  orgData.aggregates = calculateAggregates(orgData.assessments);

  // Save
  writeOrganization(orgData);

  // Log audit event
  logAuditEvent(isUpdate ? 'update' : 'create', 'assessment', `${orgId}/${indicatorId}`, {
    indicator_id: indicatorId,
    previous_score: previousScore,
    new_score: assessmentData.bayesian_score,
    confidence: assessmentData.confidence
  }, user);

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
function deleteAssessment(orgId, indicatorId, user = 'System') {
  const orgData = readOrganization(orgId);

  if (orgData.assessments[indicatorId]) {
    const deletedScore = orgData.assessments[indicatorId].bayesian_score;

    // Save final version to history before deleting
    saveAssessmentVersion(orgId, indicatorId, orgData.assessments[indicatorId], user);

    delete orgData.assessments[indicatorId];

    // Recalculate aggregates
    orgData.aggregates = calculateAggregates(orgData.assessments);

    // Save
    writeOrganization(orgData);

    // Log audit event
    logAuditEvent('delete', 'assessment', `${orgId}/${indicatorId}`, {
      indicator_id: indicatorId,
      score: deletedScore
    }, user);
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
  restoreOrganization,
  permanentlyDeleteOrganization,
  getTrash,
  cleanupTrash,

  // Assessment operations
  saveAssessment,
  getAssessment,
  deleteAssessment,

  // Assessment versioning
  saveAssessmentVersion,
  getAssessmentHistory,
  revertAssessment,

  // Audit log
  logAuditEvent,
  getAuditLog,

  // Aggregates
  calculateAggregates,
  recalculateAggregates,

  // Helpers
  generateAllIndicatorIds,
  fetchIndicatorFromGitHub,

  // Constants
  DATA_DIR,
  ORGS_DIR,
  INDEX_FILE,
  TRASH_DIR,
  HISTORY_DIR,
  AUDIT_LOG_FILE,
  CATEGORY_NAMES
};
