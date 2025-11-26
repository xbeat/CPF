/**
 * CPF Data Manager - Utility functions for organization and assessment management
 * Uses database abstraction layer to support JSON, SQLite, and PostgreSQL storage
 */

const fs = require('fs');
const path = require('path');
const db = require('../db');

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
// CPF Maturity Model Constants
// ============================================================================

const CPF_DOMAIN_WEIGHTS = {
  '1': 0.15, // Authority-Based
  '2': 0.12, // Temporal-Based
  '3': 0.11, // Social Influence
  '4': 0.10, // Affective
  '5': 0.11, // Cognitive Overload
  '6': 0.09, // Group Dynamics
  '7': 0.10, // Stress Response
  '8': 0.08, // Unconscious Process
  '9': 0.07, // AI-Specific
  '10': 0.07  // Convergent States
};

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

const ROI_TRANSITIONS = {
  '0_to_1': { investment: 50000, annual_benefit: 200000, payback_months: 3, npv_5yr: 850000 },
  '1_to_2': { investment: 250000, annual_benefit: 600000, payback_months: 5, npv_5yr: 2500000 },
  '2_to_3': { investment: 750000, annual_benefit: 1500000, payback_months: 6, npv_5yr: 5800000 },
  '3_to_4': { investment: 1500000, annual_benefit: 3000000, payback_months: 6, npv_5yr: 12000000 },
  '4_to_5': { investment: 2500000, annual_benefit: 5000000, payback_months: 6, npv_5yr: 20000000 }
};

// ============================================================================
// Maturity Model Calculation Functions
// ============================================================================

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

function determineMaturityLevel(cpfScore, convergenceIndex, redDomainsCount) {
  const levelNames = ['Unaware', 'Initial', 'Developing', 'Defined', 'Managed', 'Optimizing'];
  if (cpfScore >= 90 && redDomainsCount === 0 && convergenceIndex < 2) return { level: 5, name: levelNames[5] };
  if (cpfScore >= 80 && redDomainsCount === 0 && convergenceIndex < 3) return { level: 4, name: levelNames[4] };
  if (cpfScore >= 60 && redDomainsCount <= 2 && convergenceIndex < 5) return { level: 3, name: levelNames[3] };
  if (cpfScore >= 40 && redDomainsCount <= 5 && convergenceIndex < 8) return { level: 2, name: levelNames[2] };
  if (cpfScore >= 20 && redDomainsCount <= 8 && convergenceIndex < 10) return { level: 1, name: levelNames[1] };
  return { level: 0, name: levelNames[0] };
}

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

function getSectorBenchmark(industry, cpfScore) {
  const benchmark = SECTOR_BENCHMARKS[industry] || SECTOR_BENCHMARKS['Other'];
  const gap = cpfScore - benchmark.mean;
  const zScore = gap / benchmark.std_dev;
  let percentile = 50 + (zScore * 19.1);
  percentile = Math.max(0, Math.min(100, percentile));
  return {
    industry: industry,
    sector_mean: benchmark.mean,
    sector_std_dev: benchmark.std_dev,
    percentile: parseFloat(percentile.toFixed(1)),
    z_score: parseFloat(zScore.toFixed(2)),
    gap: parseFloat(gap.toFixed(2))
  };
}

function determineCertificationPath(maturityLevel) {
  const eligibleFor = [];
  const requiredImprovements = [];

  if (maturityLevel >= 1) eligibleFor.push('CPF-F');
  else requiredImprovements.push({ cert: 'CPF-F', required_level: 1 });

  if (maturityLevel >= 2) eligibleFor.push('CPF-P');
  else if (maturityLevel >= 1) requiredImprovements.push({ cert: 'CPF-P', required_level: 2 });

  if (maturityLevel >= 4) eligibleFor.push('CPF-E');
  else if (maturityLevel >= 2) requiredImprovements.push({ cert: 'CPF-E', required_level: 4 });

  if (maturityLevel >= 5) eligibleFor.push('CPF-M');
  else if (maturityLevel >= 4) requiredImprovements.push({ cert: 'CPF-M', required_level: 5 });

  return {
    current_certification: eligibleFor.length > 0 ? eligibleFor[eligibleFor.length - 1] : 'none',
    eligible: eligibleFor,
    required_improvements: requiredImprovements
  };
}

function calculateROI(currentLevel) {
  if (currentLevel >= 5) return null;
  const transitionKey = `${currentLevel}_to_${currentLevel + 1}`;
  const roiData = ROI_TRANSITIONS[transitionKey];
  if (!roiData) return null;
  const estimatedRoi = ((roiData.annual_benefit * 5 - roiData.investment) / roiData.investment * 100).toFixed(0);
  return {
    current_level: currentLevel,
    next_level: currentLevel + 1,
    estimated_investment: roiData.investment,
    annual_benefit: roiData.annual_benefit,
    payback_months: roiData.payback_months,
    npv_5yr: roiData.npv_5yr,
    estimated_roi: `${estimatedRoi}%`
  };
}

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
    sede_sociale: orgData.metadata.sede_sociale || '',
    partita_iva: orgData.metadata.partita_iva || '',
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
 * Read single organization using database abstraction layer
 */
async function readOrganization(orgId) {
  return await db.readOrganization(orgId);
}

/**
 * Write single organization using database abstraction layer
 */
async function writeOrganization(orgId, orgData) {
  // Ensure metadata exists before setting updated_at
  if (!orgData.metadata) {
    orgData.metadata = {};
  }
  orgData.metadata.updated_at = new Date().toISOString();
  return await db.writeOrganization(orgId, orgData);
}

/**
 * Check if organization exists using database abstraction layer
 */
async function organizationExists(orgId) {
  const org = await db.readOrganization(orgId);
  return org !== null && org !== undefined;
}

/**
 * Soft delete organization (moves to trash)
 */
async function deleteOrganization(orgId, user = 'System') {
  const orgData = await readOrganization(orgId);

  if (!orgData) {
    throw new Error(`Organization ${orgId} not found`);
  }

  // Mark as deleted
  orgData.metadata.deleted_at = new Date().toISOString();
  orgData.metadata.deleted_by = user;

  // Save to main location (with deleted flag)
  await writeOrganization(orgData.id, orgData);

  // Update index to reflect deletion (add deleted_at to index)
  updateOrganizationInIndex(orgData);

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
async function restoreOrganization(orgId, user = 'System') {
  const orgData = await readOrganization(orgId);

  if (!orgData.metadata.deleted_at) {
    throw new Error('Organization is not in trash');
  }

  // Remove deleted flag
  delete orgData.metadata.deleted_at;
  delete orgData.metadata.deleted_by;

  // Save
  await writeOrganization(orgData.id, orgData);

  // Update index to reflect restoration (remove deleted_at from index)
  updateOrganizationInIndex(orgData);

  // Log audit event
  logAuditEvent('restore', 'organization', orgId, {
    name: orgData.name
  }, user);

  return orgData;
}

/**
 * Permanently delete organization (cannot be undone)
 */
async function permanentlyDeleteOrganization(orgId, user = 'System') {
  const orgData = await readOrganization(orgId);

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
async function getTrash() {
  // Use db layer to get index (works for all storage backends)
  const index = await db.readOrganizationsIndex();

  // Filter only deleted organizations
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
async function cleanupTrash(user = 'System') {
  const trashOrgs = await getTrash();
  let deletedCount = 0;

  for (const org of trashOrgs) {
    if (org.days_until_permanent_delete === 0) {
      try {
        await permanentlyDeleteOrganization(org.id, user);
        deletedCount++;
      } catch (error) {
        console.error(`Failed to auto-delete ${org.id}:`, error.message);
      }
    }
  }

  return { deletedCount };
}

/**
 * Create new organization
 */
async function createOrganization(orgConfig) {
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
      notes: orgConfig.notes || '',
      sede_sociale: orgConfig.sede_sociale || '',
      partita_iva: orgConfig.partita_iva || ''
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

  await writeOrganization(orgData.id, orgData);

  // Update index with new organization
  updateOrganizationInIndex(orgData);

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
async function revertAssessment(orgId, indicatorId, versionNumber, user = 'System') {
  const history = getAssessmentHistory(orgId, indicatorId);

  const targetVersion = history.versions.find(v => v.version === versionNumber);

  if (!targetVersion) {
    throw new Error(`Version ${versionNumber} not found for ${indicatorId}`);
  }

  // Save current as new version before reverting
  const orgData = await readOrganization(orgId);

  if (!orgData) {
    throw new Error(`Organization ${orgId} not found - cannot revert assessment`);
  }

  if (!orgData.assessments) {
    orgData.assessments = {};
  }

  const currentAssessment = orgData.assessments[indicatorId];

  if (currentAssessment) {
    saveAssessmentVersion(orgId, indicatorId, currentAssessment, user);
  }

  // Restore old version
  orgData.assessments[indicatorId] = targetVersion.data;
  orgData.aggregates = calculateAggregates(orgData.assessments, orgData.metadata.industry);
  await writeOrganization(orgData.id, orgData);

  // Update index to reflect new stats/aggregates
  updateOrganizationInIndex(orgData);

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
async function saveAssessment(orgId, assessmentData, user = 'System') {
  const orgData = await readOrganization(orgId);

  if (!orgData) {
    throw new Error(`Organization ${orgId} not found - cannot save assessment`);
  }

  if (!orgData.assessments) {
    orgData.assessments = {};
  }

  const indicatorId = assessmentData.indicator_id;

  // Check if this is an update
  const isUpdate = !!orgData.assessments[indicatorId];
  const previousScore = isUpdate ? orgData.assessments[indicatorId].bayesian_score : null;

  // NOTE: We no longer save the previous version here
  // Instead, we save EVERY version (including the first) after updating the assessment
  // This ensures all changes are tracked in history

  // Add or update assessment in memory (for aggregate calculation)
  orgData.assessments[indicatorId] = assessmentData;

  // Recalculate aggregates
  orgData.aggregates = calculateAggregates(orgData.assessments, orgData.metadata.industry);

  // Save assessment to database using db layer
  // This handles the storage-specific logic (separate table for SQL, embedded for JSON)
  await db.saveAssessment(orgId, indicatorId, assessmentData);

  // Update organization metadata and aggregates
  // For JSON: this updates the file with new aggregates
  // For SQL: this updates the aggregates column in organizations table
  await writeOrganization(orgData.id, orgData);

  // Update index to reflect new stats/aggregates
  updateOrganizationInIndex(orgData);

  // CRITICAL: Save current version to history AFTER saving
  // This ensures every save (including the first one) is tracked in history
  await saveAssessmentVersion(orgId, indicatorId, assessmentData, user);

  // Log audit event
  logAuditEvent(isUpdate ? 'update' : 'create', 'assessment', `${orgId}/${indicatorId}`, {
    indicator_id: indicatorId,
    previous_score: previousScore,
    new_score: assessmentData.bayesian_score,
    confidence: assessmentData.confidence
  }, user);

  // Emit WebSocket event for real-time dashboard update
  if (global.io) {
    const category = indicatorId.split('.')[0];
    global.io.to(`org:${orgId}`).emit('indicator_update', {
      orgId,
      indicatorId,
      category,
      assessment: assessmentData,
      previousScore,
      newScore: assessmentData.bayesian_score,
      trend: previousScore !== null ? (assessmentData.bayesian_score > previousScore ? 'up' : assessmentData.bayesian_score < previousScore ? 'down' : 'stable') : null,
      aggregates: orgData.aggregates,
      timestamp: new Date().toISOString()
    });
  }

  return orgData;
}

/**
 * Get assessment from organization
 */
async function getAssessment(orgId, indicatorId) {
  const orgData = await readOrganization(orgId);

  if (!orgData || !orgData.assessments) {
    return null;
  }

  return orgData.assessments[indicatorId] || null;
}

/**
 * Delete assessment from organization
 */
async function deleteAssessment(orgId, indicatorId, user = 'System') {
  const orgData = await readOrganization(orgId);

  if (!orgData) {
    throw new Error(`Organization ${orgId} not found - cannot delete assessment`);
  }

  if (!orgData.assessments) {
    orgData.assessments = {};
  }

  if (orgData.assessments[indicatorId]) {
    const deletedScore = orgData.assessments[indicatorId].bayesian_score;

    // Save final version to history before deleting
    saveAssessmentVersion(orgId, indicatorId, orgData.assessments[indicatorId], user);

    delete orgData.assessments[indicatorId];

    // Recalculate aggregates
    orgData.aggregates = calculateAggregates(orgData.assessments, orgData.metadata.industry);

    // Save
    await writeOrganization(orgData.id, orgData);

    // Update index to reflect new stats/aggregates
    updateOrganizationInIndex(orgData);

    // Log audit event
    logAuditEvent('delete', 'assessment', `${orgId}/${indicatorId}`, {
      indicator_id: indicatorId,
      score: deletedScore
    }, user);
  }

  return orgData;
}

/**
 * Save SOC indicator value using database abstraction layer
 */
async function saveSocIndicator(orgId, assessmentData) {
  const indicatorId = assessmentData.indicator_id;

  // Use db abstraction layer to save SOC indicator
  const result = await db.saveSocIndicator(orgId, assessmentData);
  const previousValue = result.previousValue;

  // Emit WebSocket event for real-time dashboard update
  if (global.io) {
    const category = indicatorId.split('.')[0];
    const trend = previousValue !== null
      ? (assessmentData.bayesian_score > previousValue ? 'up' : assessmentData.bayesian_score < previousValue ? 'down' : 'stable')
      : null;

    global.io.to(`org:${orgId}`).emit('indicator_update', {
      orgId,
      indicatorId,
      category,
      assessment: assessmentData,
      previousScore: previousValue,
      newScore: assessmentData.bayesian_score,
      trend,
      source: 'soc',
      timestamp: new Date().toISOString()
    });
  }

  return result;
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
  // Conta solo assessment con score > 0 (score=0 significa reset/non valutato)
  const assessedIndicators = Object.keys(assessments).filter(id =>
    assessments[id] && assessments[id].bayesian_score > 0
  );
  const missingIndicators = allIndicators.filter(id => !assessedIndicators.includes(id));

  // Calculate maturity model if we have category data
  const maturityModel = Object.keys(byCategory).length > 0
    ? calculateMaturityModel(assessments, byCategory, industry || 'Other')
    : null;

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
    maturity_model: maturityModel,
    last_calculated: new Date().toISOString()
  };
}

/**
 * Recalculate aggregates for organization
 */
async function recalculateAggregates(orgId) {
  const orgData = await readOrganization(orgId);

  if (!orgData) {
    throw new Error(`Organization ${orgId} not found - cannot recalculate aggregates`);
  }

  if (!orgData.assessments) {
    orgData.assessments = {};
  }

  orgData.aggregates = calculateAggregates(orgData.assessments, orgData.metadata.industry);
  await writeOrganization(orgData.id, orgData);

  // Update index to reflect new stats/aggregates
  updateOrganizationInIndex(orgData);

  return orgData;
}

// ============================================================================
// Export Functions (XLSX and PDF)
// ============================================================================

/**
 * Generate XLSX export for organization's entire matrix
 */
async function generateXLSXExport(orgId, user = 'System') {
  const ExcelJS = require('exceljs');
  const orgData = await readOrganization(orgId);

  // Log audit event
  logAuditEvent('export', 'organization', orgId, { format: 'xlsx' }, user);

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'CPF Auditing Dashboard';
  workbook.created = new Date();

  // ===== SHEET 1: Organization Info =====
  const infoSheet = workbook.addWorksheet('Organization Info');

  infoSheet.columns = [
    { header: 'Field', key: 'field', width: 30 },
    { header: 'Value', key: 'value', width: 50 }
  ];

  infoSheet.addRows([
    { field: 'Organization Name', value: orgData.name },
    { field: 'ID', value: orgData.id },
    { field: 'Industry', value: orgData.metadata.industry },
    { field: 'Size', value: orgData.metadata.size },
    { field: 'Country', value: orgData.metadata.country },
    { field: 'Language', value: orgData.metadata.language },
    { field: 'Created At', value: orgData.metadata.created_at },
    { field: 'Updated At', value: orgData.metadata.updated_at },
    { field: '', value: '' },
    { field: 'Overall Risk Score', value: orgData.aggregates.overall_risk },
    { field: 'Overall Confidence', value: orgData.aggregates.overall_confidence },
    { field: 'Completion', value: `${orgData.aggregates.completion.percentage}% (${orgData.aggregates.completion.assessed_indicators}/100)` },
    { field: 'Last Calculated', value: orgData.aggregates.last_calculated }
  ]);

  // Style header row
  infoSheet.getRow(1).font = { bold: true, size: 12 };
  infoSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
  infoSheet.getRow(1).font.color = { argb: 'FFFFFFFF' };

  // ===== SHEET 2: Assessment Matrix =====
  const matrixSheet = workbook.addWorksheet('Assessment Matrix');

  matrixSheet.columns = [
    { header: 'Category', key: 'category', width: 35 },
    { header: 'Indicator ID', key: 'indicator_id', width: 15 },
    { header: 'Indicator Title', key: 'title', width: 50 },
    { header: 'Risk Score', key: 'risk_score', width: 12 },
    { header: 'Confidence', key: 'confidence', width: 12 },
    { header: 'Maturity', key: 'maturity', width: 12 },
    { header: 'Assessor', key: 'assessor', width: 20 },
    { header: 'Date', key: 'date', width: 20 }
  ];

  // Generate all 100 indicators
  const allIndicators = generateAllIndicatorIds();

  for (const indicatorId of allIndicators) {
    const catNum = indicatorId.split('.')[0];
    const assessment = orgData.assessments[indicatorId];

    const row = {
      category: CATEGORY_NAMES[catNum],
      indicator_id: indicatorId,
      title: assessment?.title || 'Not Assessed',
      risk_score: assessment?.bayesian_score ?? '',
      confidence: assessment?.confidence ?? '',
      maturity: assessment?.maturity_level || '',
      assessor: assessment?.assessor || '',
      date: assessment?.assessment_date || ''
    };

    matrixSheet.addRow(row);
  }

  // Style header
  matrixSheet.getRow(1).font = { bold: true, size: 11 };
  matrixSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
  matrixSheet.getRow(1).font.color = { argb: 'FFFFFFFF' };

  // Conditional formatting for risk scores
  matrixSheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      const riskCell = row.getCell('risk_score');
      const riskValue = riskCell.value;

      if (typeof riskValue === 'number') {
        if (riskValue >= 0.7) {
          riskCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF6B6B' } };
        } else if (riskValue >= 0.4) {
          riskCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFD93D' } };
        } else {
          riskCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF6BCF7F' } };
        }
      }

      // Color maturity levels
      const maturityCell = row.getCell('maturity');
      const maturity = maturityCell.value;
      if (maturity === 'red') {
        maturityCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF6B6B' } };
      } else if (maturity === 'yellow') {
        maturityCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFD93D' } };
      } else if (maturity === 'green') {
        maturityCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF6BCF7F' } };
      }
    }
  });

  // ===== SHEET 3: Category Statistics =====
  const statsSheet = workbook.addWorksheet('Category Statistics');

  statsSheet.columns = [
    { header: 'Category #', key: 'cat_num', width: 12 },
    { header: 'Category Name', key: 'category', width: 40 },
    { header: 'Avg Risk Score', key: 'avg_score', width: 15 },
    { header: 'Avg Confidence', key: 'avg_confidence', width: 15 },
    { header: 'Assessments', key: 'total', width: 15 },
    { header: 'Completion %', key: 'completion', width: 15 }
  ];

  for (let cat = 1; cat <= 10; cat++) {
    const catKey = cat.toString();
    const catData = orgData.aggregates.by_category[catKey];

    statsSheet.addRow({
      cat_num: cat,
      category: CATEGORY_NAMES[catKey],
      avg_score: catData?.avg_score ?? 'N/A',
      avg_confidence: catData?.avg_confidence ?? 'N/A',
      total: catData?.total_assessments ?? 0,
      completion: catData?.completion_percentage ?? 0
    });
  }

  // Style header
  statsSheet.getRow(1).font = { bold: true, size: 11 };
  statsSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
  statsSheet.getRow(1).font.color = { argb: 'FFFFFFFF' };

  return workbook;
}

/**
 * Generate PDF export for organization's entire matrix
 */
async function generatePDFExport(orgId, user = 'System') {
  const PDFDocument = require('pdfkit');
  const orgData = await readOrganization(orgId);

  // Log audit event
  logAuditEvent('export', 'organization', orgId, { format: 'pdf' }, user);

  const doc = new PDFDocument({
    size: 'A4',
    margin: 50,
    info: {
      Title: `CPF Audit Report - ${orgData.name}`,
      Author: 'CPF Auditing Dashboard',
      Subject: 'Social Engineering Vulnerability Assessment',
      Keywords: 'CPF, audit, compliance, security'
    }
  });

  // Helper functions for PDF generation
  const addHeader = () => {
    doc.fontSize(20).font('Helvetica-Bold')
       .text('CPF AUDIT REPORT', { align: 'center' })
       .moveDown(0.5);
    doc.fontSize(16).font('Helvetica')
       .text('Social Engineering Vulnerability Assessment', { align: 'center' })
       .moveDown(1);
  };

  const addOrganizationInfo = () => {
    doc.fontSize(14).font('Helvetica-Bold')
       .text('Organization Information', { underline: true })
       .moveDown(0.5);

    doc.fontSize(11).font('Helvetica');
    const info = [
      ['Organization:', orgData.name],
      ['ID:', orgData.id],
      ['Industry:', orgData.metadata.industry],
      ['Size:', orgData.metadata.size],
      ['Country:', orgData.metadata.country],
      ['Report Date:', new Date().toISOString().split('T')[0]]
    ];

    info.forEach(([label, value]) => {
      doc.font('Helvetica-Bold').text(label, { continued: true })
         .font('Helvetica').text(` ${value}`)
         .moveDown(0.3);
    });

    doc.moveDown(1);
  };

  const addExecutiveSummary = () => {
    doc.fontSize(14).font('Helvetica-Bold')
       .text('Executive Summary', { underline: true })
       .moveDown(0.5);

    doc.fontSize(11).font('Helvetica');

    const riskLevel = orgData.aggregates.overall_risk >= 0.7 ? 'HIGH' :
                      orgData.aggregates.overall_risk >= 0.4 ? 'MEDIUM' : 'LOW';
    const riskColor = riskLevel === 'HIGH' ? 'red' : riskLevel === 'MEDIUM' ? 'orange' : 'green';

    doc.text(`Overall Risk Level: `, { continued: true })
       .fillColor(riskColor).font('Helvetica-Bold').text(riskLevel)
       .fillColor('black').font('Helvetica')
       .text(`Overall Risk Score: ${(orgData.aggregates.overall_risk * 100).toFixed(1)}%`)
       .text(`Confidence Level: ${(orgData.aggregates.overall_confidence * 100).toFixed(1)}%`)
       .text(`Assessment Completion: ${orgData.aggregates.completion.percentage}% (${orgData.aggregates.completion.assessed_indicators}/100 indicators)`)
       .moveDown(1);
  };

  const addCategoryBreakdown = () => {
    doc.addPage();
    doc.fontSize(14).font('Helvetica-Bold')
       .text('Category Breakdown', { underline: true })
       .moveDown(0.5);

    doc.fontSize(10).font('Helvetica');

    for (let cat = 1; cat <= 10; cat++) {
      const catKey = cat.toString();
      const catData = orgData.aggregates.by_category[catKey];

      if (catData) {
        doc.font('Helvetica-Bold')
           .text(`${cat}. ${CATEGORY_NAMES[catKey]}`, { continued: false })
           .font('Helvetica')
           .text(`   Risk: ${(catData.avg_score * 100).toFixed(1)}% | Confidence: ${(catData.avg_confidence * 100).toFixed(1)}% | Completion: ${catData.completion_percentage}%`)
           .moveDown(0.3);
      } else {
        doc.font('Helvetica-Bold')
           .text(`${cat}. ${CATEGORY_NAMES[catKey]}`, { continued: false })
           .font('Helvetica')
           .text(`   Not assessed`)
           .moveDown(0.3);
      }
    }

    doc.moveDown(1);
  };

  const addDetailedMatrix = () => {
    doc.addPage();
    doc.fontSize(14).font('Helvetica-Bold')
       .text('Detailed Assessment Matrix', { underline: true })
       .moveDown(0.5);

    doc.fontSize(8).font('Helvetica');

    const allIndicators = generateAllIndicatorIds();
    let currentCategory = null;

    allIndicators.forEach(indicatorId => {
      const catNum = indicatorId.split('.')[0];
      const assessment = orgData.assessments[indicatorId];

      // Add category header
      if (currentCategory !== catNum) {
        currentCategory = catNum;
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica-Bold')
           .text(CATEGORY_NAMES[catNum], { underline: true })
           .moveDown(0.3);
        doc.fontSize(8).font('Helvetica');
      }

      // Add indicator line
      if (assessment) {
        const riskPercent = (assessment.bayesian_score * 100).toFixed(0);
        const confPercent = (assessment.confidence * 100).toFixed(0);
        doc.text(`  ${indicatorId} - Risk: ${riskPercent}% | Conf: ${confPercent}% | ${assessment.maturity_level || 'N/A'}`);
      } else {
        doc.fillColor('gray').text(`  ${indicatorId} - Not Assessed`).fillColor('black');
      }
    });
  };

  const addFooter = () => {
    doc.addPage();
    doc.fontSize(10).font('Helvetica-Oblique')
       .text('This report was generated automatically by the CPF Auditing Dashboard.', { align: 'center' })
       .text('For official audit and compliance purposes.', { align: 'center' })
       .moveDown(1)
       .fontSize(8)
       .text(`Generated: ${new Date().toISOString()}`, { align: 'center' });
  };

  // Generate PDF content
  addHeader();
  addOrganizationInfo();
  addExecutiveSummary();
  addCategoryBreakdown();
  addDetailedMatrix();
  addFooter();

  return doc;
}

/**
 * Generate ZIP export containing all assessment cards (schede) as separate JSON files
 */
async function generateZIPExport(orgId, user = 'System') {
  const archiver = require('archiver');
  const { PassThrough } = require('stream');
  const orgData = await readOrganization(orgId);

  // Log audit event
  logAuditEvent('export', 'organization', orgId, { format: 'zip' }, user);

  // Create a pass-through stream for the archive
  const archive = archiver('zip', {
    zlib: { level: 9 } // Maximum compression
  });

  const stream = new PassThrough();
  archive.pipe(stream);

  // 1. Add organization_info.json
  const orgInfo = {
    id: orgData.id,
    name: orgData.name,
    metadata: orgData.metadata,
    export_date: new Date().toISOString(),
    exported_by: user
  };
  archive.append(JSON.stringify(orgInfo, null, 2), { name: 'organization_info.json' });

  // 2. Add summary.json with aggregates
  const summary = {
    organization: orgData.name,
    organization_id: orgData.id,
    export_date: new Date().toISOString(),
    overall_risk: orgData.aggregates.overall_risk,
    overall_confidence: orgData.aggregates.overall_confidence,
    completion: orgData.aggregates.completion,
    category_breakdown: {}
  };

  // Add category statistics
  for (let cat = 1; cat <= 10; cat++) {
    const catKey = cat.toString();
    const catData = orgData.aggregates.by_category[catKey];
    summary.category_breakdown[catKey] = {
      name: CATEGORY_NAMES[catKey],
      ...catData
    };
  }
  archive.append(JSON.stringify(summary, null, 2), { name: 'summary.json' });

  // 3. Add individual assessment files organized by category
  const categoryFolders = {
    '1': '1_authority',
    '2': '2_temporal',
    '3': '3_social',
    '4': '4_affective',
    '5': '5_cognitive',
    '6': '6_group',
    '7': '7_stress',
    '8': '8_unconscious',
    '9': '9_ai_enhanced',
    '10': '10_convergent'
  };

  const allIndicators = generateAllIndicatorIds();
  let assessedCount = 0;

  allIndicators.forEach(indicatorId => {
    const catNum = indicatorId.split('.')[0];
    const assessment = orgData.assessments[indicatorId];

    if (assessment) {
      assessedCount++;
      const scheda = {
        indicator_id: indicatorId,
        category: CATEGORY_NAMES[catNum],
        ...assessment,
        organization_id: orgData.id,
        organization_name: orgData.name,
        export_timestamp: new Date().toISOString()
      };

      const folderName = categoryFolders[catNum];
      const fileName = `assessments/${folderName}/indicator_${indicatorId}.json`;
      archive.append(JSON.stringify(scheda, null, 2), { name: fileName });
    }
  });

  // 4. Add text report summary
  const reportLines = [
    '═══════════════════════════════════════════════════════════════',
    '                    CPF AUDIT EXPORT REPORT',
    '═══════════════════════════════════════════════════════════════',
    '',
    `Organization: ${orgData.name}`,
    `ID: ${orgData.id}`,
    `Industry: ${orgData.metadata.industry}`,
    `Size: ${orgData.metadata.size}`,
    `Country: ${orgData.metadata.country}`,
    `Export Date: ${new Date().toISOString()}`,
    `Exported By: ${user}`,
    '',
    '───────────────────────────────────────────────────────────────',
    '                      EXECUTIVE SUMMARY',
    '───────────────────────────────────────────────────────────────',
    '',
    `Overall Risk Score: ${(orgData.aggregates.overall_risk * 100).toFixed(1)}%`,
    `Overall Confidence: ${(orgData.aggregates.overall_confidence * 100).toFixed(1)}%`,
    `Assessment Completion: ${orgData.aggregates.completion.percentage.toFixed(1)}%`,
    `Indicators Assessed: ${assessedCount}/100`,
    '',
    '───────────────────────────────────────────────────────────────',
    '                    CATEGORY BREAKDOWN',
    '───────────────────────────────────────────────────────────────',
    ''
  ];

  for (let cat = 1; cat <= 10; cat++) {
    const catKey = cat.toString();
    const catData = orgData.aggregates.by_category[catKey];
    if (catData && catData.assessed_count > 0) {
      reportLines.push(`${cat}. ${CATEGORY_NAMES[catKey]}`);
      reportLines.push(`   Risk: ${(catData.avg_score * 100).toFixed(1)}% | Confidence: ${(catData.avg_confidence * 100).toFixed(1)}% | Completion: ${catData.completion_percentage.toFixed(1)}%`);
      reportLines.push('');
    } else {
      reportLines.push(`${cat}. ${CATEGORY_NAMES[catKey]}`);
      reportLines.push(`   Not assessed`);
      reportLines.push('');
    }
  }

  reportLines.push('───────────────────────────────────────────────────────────────');
  reportLines.push('                      CONTENTS OF ZIP');
  reportLines.push('───────────────────────────────────────────────────────────────');
  reportLines.push('');
  reportLines.push('This ZIP archive contains:');
  reportLines.push('');
  reportLines.push('• organization_info.json - Complete organization metadata');
  reportLines.push('• summary.json - Aggregated statistics and risk scores');
  reportLines.push('• assessments/ - Individual assessment cards (schede) by category');
  reportLines.push(`  └─ ${assessedCount} assessed indicators in categorized folders`);
  reportLines.push('• report.txt - This summary report');
  reportLines.push('');
  reportLines.push('═══════════════════════════════════════════════════════════════');
  reportLines.push('Generated by CPF Auditing Dashboard');
  reportLines.push('═══════════════════════════════════════════════════════════════');

  archive.append(reportLines.join('\n'), { name: 'report.txt' });

  // Finalize the archive
  archive.finalize();

  return { archive, stream };
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
  saveSocIndicator,

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

  // Export functions
  generateXLSXExport,
  generatePDFExport,
  generateZIPExport,

  // Constants
  DATA_DIR,
  ORGS_DIR,
  INDEX_FILE,
  TRASH_DIR,
  HISTORY_DIR,
  AUDIT_LOG_FILE,
  CATEGORY_NAMES
};
