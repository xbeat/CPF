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
    
    organization.assessments[indicatorId] = assessmentData;
    organization.aggregates = calculateAggregates(organization.assessments);
    organization.metadata.updated_at = new Date().toISOString();

    await writeOrganization(orgId, organization);
    return { success: true };
}

// ============================================================================
// Aggregates Calculation (copied from generator)
// ============================================================================

const CATEGORY_NAMES = {
  '1': 'Authority-Based Vulnerabilities', '2': 'Temporal-Based Vulnerabilities', '3': 'Social-Based Vulnerabilities', '4': 'Affective-Based Vulnerabilities', '5': 'Cognitive-Based Vulnerabilities', '6': 'Group-Based Vulnerabilities', '7': 'Stress-Based Vulnerabilities', '8': 'Unconscious-Based Vulnerabilities', '9': 'AI-Enhanced Vulnerabilities', '10': 'Convergent Vulnerabilities'
};
function generateAllIndicatorIds() {
  const i = []; for (let c = 1; c <= 10; c++) for (let n = 1; n <= 10; n++) i.push(`${c}.${n}`); return i;
}
function calculateAggregates(assessments) {
  const a = Object.values(assessments); if (a.length === 0) return { overall_risk: 0.5, overall_confidence: 0.0, trend: 'stable', by_category: {}, completion: { total_indicators: 100, assessed_indicators: 0, percentage: 0.0, missing_indicators: generateAllIndicatorIds() }, last_calculated: new Date().toISOString() };
  const r = a.reduce((s, i) => s + i.bayesian_score, 0) / a.length, c = a.reduce((s, i) => s + i.confidence, 0) / a.length, b = {};
  for (let i=1;i<=10;i++) { const k=i.toString(), f=a.filter(x=>x.indicator_id.startsWith(`${k}.`)); if (f.length > 0) { const s=f.reduce((_,x)=>_+x.bayesian_score,0)/f.length,d=f.reduce((_,x)=>_+x.confidence,0)/f.length; b[k]={category_name:CATEGORY_NAMES[k],avg_score:parseFloat(s.toFixed(4)),avg_confidence:parseFloat(d.toFixed(4)),total_assessments:f.length,completion_percentage:parseFloat((f.length/10*100).toFixed(2))}; } }
  const d=generateAllIndicatorIds(), e=Object.keys(assessments), m=d.filter(id=>!e.includes(id));
  return { overall_risk:parseFloat(r.toFixed(4)), overall_confidence:parseFloat(c.toFixed(4)), trend:'stable', by_category:b, completion:{total_indicators:100,assessed_indicators:e.length,percentage:parseFloat((e.length/100*100).toFixed(2)),missing_indicators:m}, last_calculated:new Date().toISOString() };
}

module.exports = {
  createOrganization,
  readOrganization,
  saveAssessment,
  calculateAggregates,
  readOrganizationsIndex,
  writeOrganizationsIndex,
  writeOrganization,
  // Placeholder for other potential functions to avoid breaking require()
  updateOrganizationInIndex: async () => {},
  removeOrganizationFromIndex: async () => {},
};
