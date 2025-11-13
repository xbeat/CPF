#!/usr/bin/env node

/**
 * CPF Dashboard Server
 *
 * Unified Node.js server for:
 * - Dashboard SOC (dashboard.html)
 * - Dashboard Auditing (dashboard_auditing.html)
 * - Client Field Kit (cpf_client_json.html)
 * - API endpoints for organization and assessment management
 *
 * Version: 2.0 - JSON file-based storage
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Import data manager
const dataManager = require('./lib/dataManager');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from dashboard folder
app.use('/dashboard', express.static(__dirname));

// Serve data files for SOC dashboard (static JSON files)
app.use('/data', express.static(path.join(__dirname, 'data')));

// Serve Auditor Field Kit interactive indicator files
app.use('/auditor-field-kit', express.static(path.join(__dirname, '../auditor field kit')));

// ============================================
// LANDING PAGE ROUTE
// ============================================

// Main landing page
app.get('/', (req, res) => {
  res.redirect(301, '/dashboard/');
});

// ============================================
// BACKWARD COMPATIBILITY REDIRECTS
// ============================================

// Redirect old dashboard URLs to new organized structure
app.get('/dashboard/dashboard_auditing.html', (req, res) => {
  res.redirect(301, '/dashboard/auditing/index.html');
});

app.get('/dashboard/dashboard.html', (req, res) => {
  res.redirect(301, '/dashboard/soc/index.html');
});

// ============================================
// API ENDPOINTS - ORGANIZATIONS
// ============================================

/**
 * GET /api/organizations
 * Returns organizations index with stats
 */
app.get('/api/organizations', (req, res) => {
  try {
    const index = dataManager.readOrganizationsIndex();
    res.json(index);
  } catch (error) {
    console.error('[API] Error reading organizations index:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/organizations/:orgId
 * Returns complete organization data (metadata + assessments + aggregates)
 */
app.get('/api/organizations/:orgId', (req, res) => {
  try {
    const { orgId } = req.params;

    if (!dataManager.organizationExists(orgId)) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        orgId
      });
    }

    const orgData = dataManager.readOrganization(orgId);
    res.json({
      success: true,
      data: orgData
    });
  } catch (error) {
    console.error(`[API] Error reading organization ${req.params.orgId}:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/organizations
 * Create new organization
 * Body: { id, name, industry, size, country, language, created_by, notes, fetch_indicators }
 */
app.post('/api/organizations', async (req, res) => {
  try {
    const { id, name, industry, size, country, language, created_by, notes, fetch_indicators } = req.body;

    // Validate required fields
    if (!id || !name || !industry || !size || !country) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: id, name, industry, size, country'
      });
    }

    // Check if organization already exists
    if (dataManager.organizationExists(id)) {
      return res.status(409).json({
        success: false,
        error: 'Organization already exists',
        orgId: id
      });
    }

    // Create organization
    const orgData = dataManager.createOrganization({
      id,
      name,
      industry,
      size,
      country,
      language: language || 'en-US',
      created_by: created_by || 'System',
      notes: notes || ''
    });

    console.log(`\n✅ [API] Created organization: ${id} (${name})`);

    // Fetch indicators if requested
    if (fetch_indicators) {
      console.log(`📥 [API] Fetching 100 indicators for ${id}...`);
      // This will be done asynchronously - return success immediately
      fetchIndicatorsForOrganization(id, language || 'en-US').catch(err => {
        console.error(`❌ [API] Failed to fetch indicators for ${id}:`, err.message);
      });
    }

    console.log('');

    res.status(201).json({
      success: true,
      message: 'Organization created successfully',
      data: orgData,
      indicators_fetching: fetch_indicators || false
    });
  } catch (error) {
    console.error('[API] Error creating organization:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Background task: Fetch all 100 indicators for organization
 */
async function fetchIndicatorsForOrganization(orgId, language) {
  const allIndicators = dataManager.generateAllIndicatorIds();
  let fetched = 0;
  let failed = 0;

  for (const indicatorId of allIndicators) {
    try {
      const indicatorData = await dataManager.fetchIndicatorFromGitHub(indicatorId, language);
      // Successfully fetched - could store metadata if needed
      fetched++;

      if (fetched % 10 === 0) {
        console.log(`   Progress: ${fetched}/100 indicators fetched`);
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 50));
    } catch (error) {
      failed++;
      console.warn(`   ⚠️ Failed to fetch ${indicatorId}: ${error.message}`);
    }
  }

  console.log(`\n✅ [API] Indicator fetch complete for ${orgId}: ${fetched} fetched, ${failed} failed\n`);
}

/**
 * PUT /api/organizations/:orgId
 * Update organization metadata
 * Body: { name, industry, size, country, language, notes }
 */
app.put('/api/organizations/:orgId', (req, res) => {
  try {
    const { orgId } = req.params;
    const updates = req.body;

    if (!dataManager.organizationExists(orgId)) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        orgId
      });
    }

    // Read current org data
    const orgData = dataManager.readOrganization(orgId);

    // Update metadata fields
    if (updates.name) orgData.name = updates.name;
    if (updates.industry) orgData.metadata.industry = updates.industry;
    if (updates.size) orgData.metadata.size = updates.size;
    if (updates.country) orgData.metadata.country = updates.country;
    if (updates.language) orgData.metadata.language = updates.language;
    if (updates.notes !== undefined) orgData.metadata.notes = updates.notes;

    // Save
    dataManager.writeOrganization(orgData);

    console.log(`\n✅ [API] Updated organization: ${orgId}\n`);

    res.json({
      success: true,
      message: 'Organization updated successfully',
      data: orgData
    });
  } catch (error) {
    console.error(`[API] Error updating organization ${req.params.orgId}:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/organizations/:orgId
 * Soft delete organization (moves to trash)
 * Query: ?user=username (optional)
 */
app.delete('/api/organizations/:orgId', (req, res) => {
  try {
    const { orgId } = req.params;
    const user = req.query.user || req.body.user || 'System';

    if (!dataManager.organizationExists(orgId)) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        orgId
      });
    }

    // Soft delete organization (moves to trash, logs audit)
    const orgData = dataManager.deleteOrganization(orgId, user);

    console.log(`\n🗑️  [API] Moved to trash: ${orgId}\n`);

    res.json({
      success: true,
      message: 'Organization moved to trash (recoverable for 30 days)',
      orgId,
      deleted_at: orgData.metadata.deleted_at
    });
  } catch (error) {
    console.error(`[API] Error deleting organization ${req.params.orgId}:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// API ENDPOINTS - ASSESSMENTS
// ============================================

/**
 * GET /api/organizations/:orgId/assessments
 * Get all assessments for organization
 */
app.get('/api/organizations/:orgId/assessments', (req, res) => {
  try {
    const { orgId } = req.params;

    if (!dataManager.organizationExists(orgId)) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        orgId
      });
    }

    const orgData = dataManager.readOrganization(orgId);

    res.json({
      success: true,
      orgId,
      assessments: orgData.assessments,
      count: Object.keys(orgData.assessments).length
    });
  } catch (error) {
    console.error(`[API] Error reading assessments for ${req.params.orgId}:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/organizations/:orgId/assessments/:indicatorId
 * Get specific assessment
 */
app.get('/api/organizations/:orgId/assessments/:indicatorId', (req, res) => {
  try {
    const { orgId, indicatorId } = req.params;

    if (!dataManager.organizationExists(orgId)) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        orgId
      });
    }

    const assessment = dataManager.getAssessment(orgId, indicatorId);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: 'Assessment not found',
        orgId,
        indicatorId
      });
    }

    res.json({
      success: true,
      data: assessment
    });
  } catch (error) {
    console.error(`[API] Error reading assessment ${req.params.indicatorId}:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/organizations/:orgId/assessments
 * Save or update assessment
 * Body: { indicator_id, title, category, bayesian_score, confidence, maturity_level, assessor, assessment_date, raw_data, user }
 */
app.post('/api/organizations/:orgId/assessments', (req, res) => {
  try {
    const { orgId } = req.params;
    const assessmentData = req.body;
    const user = assessmentData.assessor || req.body.user || 'System';

    if (!dataManager.organizationExists(orgId)) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        orgId
      });
    }

    // Validate required fields
    if (!assessmentData.indicator_id || assessmentData.bayesian_score === undefined || assessmentData.confidence === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: indicator_id, bayesian_score, confidence'
      });
    }

    // Save assessment (this also recalculates aggregates, saves version, and logs)
    const orgData = dataManager.saveAssessment(orgId, assessmentData, user);

    console.log(`\n✅ [API] Saved assessment: ${orgId} / ${assessmentData.indicator_id}\n`);

    res.json({
      success: true,
      message: 'Assessment saved successfully',
      orgId,
      indicator_id: assessmentData.indicator_id,
      aggregates: orgData.aggregates
    });
  } catch (error) {
    console.error(`[API] Error saving assessment for ${req.params.orgId}:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/organizations/:orgId/assessments/:indicatorId
 * Delete assessment
 * Query: ?user=username (optional)
 */
app.delete('/api/organizations/:orgId/assessments/:indicatorId', (req, res) => {
  try {
    const { orgId, indicatorId } = req.params;
    const user = req.query.user || req.body.user || 'System';

    if (!dataManager.organizationExists(orgId)) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        orgId
      });
    }

    // Delete assessment (this also recalculates aggregates, saves version, and logs)
    const orgData = dataManager.deleteAssessment(orgId, indicatorId, user);

    console.log(`\n🗑️  [API] Deleted assessment: ${orgId} / ${indicatorId}\n`);

    res.json({
      success: true,
      message: 'Assessment deleted successfully',
      orgId,
      indicatorId,
      aggregates: orgData.aggregates
    });
  } catch (error) {
    console.error(`[API] Error deleting assessment ${req.params.indicatorId}:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// API ENDPOINTS - AGGREGATES
// ============================================

/**
 * GET /api/organizations/:orgId/aggregates
 * Get organization aggregates (risk scores, completion, etc.)
 */
app.get('/api/organizations/:orgId/aggregates', (req, res) => {
  try {
    const { orgId } = req.params;

    if (!dataManager.organizationExists(orgId)) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        orgId
      });
    }

    const orgData = dataManager.readOrganization(orgId);

    res.json({
      success: true,
      orgId,
      aggregates: orgData.aggregates
    });
  } catch (error) {
    console.error(`[API] Error reading aggregates for ${req.params.orgId}:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/organizations/:orgId/recalculate
 * Recalculate aggregates for organization
 */
app.post('/api/organizations/:orgId/recalculate', (req, res) => {
  try {
    const { orgId } = req.params;

    if (!dataManager.organizationExists(orgId)) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        orgId
      });
    }

    const orgData = dataManager.recalculateAggregates(orgId);

    console.log(`\n🔄 [API] Recalculated aggregates: ${orgId}\n`);

    res.json({
      success: true,
      message: 'Aggregates recalculated successfully',
      orgId,
      aggregates: orgData.aggregates
    });
  } catch (error) {
    console.error(`[API] Error recalculating aggregates for ${req.params.orgId}:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/organizations/:orgId/missing
 * Get list of missing indicators
 */
app.get('/api/organizations/:orgId/missing', (req, res) => {
  try {
    const { orgId } = req.params;

    if (!dataManager.organizationExists(orgId)) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        orgId
      });
    }

    const orgData = dataManager.readOrganization(orgId);

    res.json({
      success: true,
      orgId,
      missing_indicators: orgData.aggregates.completion.missing_indicators,
      count: orgData.aggregates.completion.missing_indicators.length
    });
  } catch (error) {
    console.error(`[API] Error reading missing indicators for ${req.params.orgId}:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// API ENDPOINTS - TRASH & RESTORE
// ============================================

/**
 * GET /api/trash
 * Get all organizations in trash
 */
app.get('/api/trash', (req, res) => {
  try {
    const trashOrgs = dataManager.getTrash();

    res.json({
      success: true,
      count: trashOrgs.length,
      organizations: trashOrgs
    });
  } catch (error) {
    console.error('[API] Error reading trash:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/organizations/:orgId/restore
 * Restore organization from trash
 * Body: { user } (optional)
 */
app.post('/api/organizations/:orgId/restore', (req, res) => {
  try {
    const { orgId } = req.params;
    const user = req.body.user || 'System';

    if (!dataManager.organizationExists(orgId)) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        orgId
      });
    }

    const orgData = dataManager.restoreOrganization(orgId, user);

    console.log(`\n♻️  [API] Restored from trash: ${orgId}\n`);

    res.json({
      success: true,
      message: 'Organization restored successfully',
      orgId,
      data: orgData
    });
  } catch (error) {
    console.error(`[API] Error restoring organization ${req.params.orgId}:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/organizations/:orgId/permanent
 * Permanently delete organization (cannot be undone)
 * Query: ?user=username (optional)
 */
app.delete('/api/organizations/:orgId/permanent', (req, res) => {
  try {
    const { orgId } = req.params;
    const user = req.query.user || req.body.user || 'System';

    if (!dataManager.organizationExists(orgId)) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        orgId
      });
    }

    const result = dataManager.permanentlyDeleteOrganization(orgId, user);

    console.log(`\n🔥 [API] Permanently deleted: ${orgId}\n`);

    res.json({
      success: true,
      message: 'Organization permanently deleted',
      orgId
    });
  } catch (error) {
    console.error(`[API] Error permanently deleting organization ${req.params.orgId}:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/trash/cleanup
 * Auto-delete organizations in trash older than 30 days
 */
app.post('/api/trash/cleanup', (req, res) => {
  try {
    const user = req.body.user || 'System';
    const result = dataManager.cleanupTrash(user);

    console.log(`\n🧹 [API] Trash cleanup: ${result.deletedCount} organizations permanently deleted\n`);

    res.json({
      success: true,
      message: `Cleaned up ${result.deletedCount} expired organizations`,
      deleted_count: result.deletedCount
    });
  } catch (error) {
    console.error('[API] Error cleaning up trash:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// API ENDPOINTS - AUDIT LOG
// ============================================

/**
 * GET /api/audit-log
 * Get audit log entries
 * Query params: entity_type, entity_id, action, user, from_date, to_date, limit
 */
app.get('/api/audit-log', (req, res) => {
  try {
    const filters = {
      entity_type: req.query.entity_type,
      entity_id: req.query.entity_id,
      action: req.query.action,
      user: req.query.user,
      from_date: req.query.from_date,
      to_date: req.query.to_date,
      limit: req.query.limit ? parseInt(req.query.limit) : 100
    };

    const entries = dataManager.getAuditLog(filters);

    res.json({
      success: true,
      count: entries.length,
      entries: entries
    });
  } catch (error) {
    console.error('[API] Error reading audit log:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// API ENDPOINTS - ASSESSMENT VERSIONING
// ============================================

/**
 * GET /api/organizations/:orgId/assessments/:indicatorId/history
 * Get version history for assessment
 */
app.get('/api/organizations/:orgId/assessments/:indicatorId/history', (req, res) => {
  try {
    const { orgId, indicatorId } = req.params;

    if (!dataManager.organizationExists(orgId)) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        orgId
      });
    }

    const history = dataManager.getAssessmentHistory(orgId, indicatorId);

    res.json({
      success: true,
      orgId,
      indicator_id: indicatorId,
      version_count: history.versions.length,
      history: history
    });
  } catch (error) {
    console.error(`[API] Error reading assessment history ${req.params.indicatorId}:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/organizations/:orgId/assessments/:indicatorId/revert
 * Revert assessment to specific version
 * Body: { version, user } (version is required)
 */
app.post('/api/organizations/:orgId/assessments/:indicatorId/revert', (req, res) => {
  try {
    const { orgId, indicatorId } = req.params;
    const { version, user } = req.body;

    if (!version) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: version'
      });
    }

    if (!dataManager.organizationExists(orgId)) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        orgId
      });
    }

    const orgData = dataManager.revertAssessment(orgId, indicatorId, parseInt(version), user || 'System');

    console.log(`\n↩️  [API] Reverted assessment: ${orgId} / ${indicatorId} to version ${version}\n`);

    res.json({
      success: true,
      message: `Assessment reverted to version ${version}`,
      orgId,
      indicator_id: indicatorId,
      reverted_to_version: version,
      aggregates: orgData.aggregates
    });
  } catch (error) {
    console.error(`[API] Error reverting assessment ${req.params.indicatorId}:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// API ENDPOINTS - LEGACY (BACKWARD COMPATIBILITY)
// ============================================

/**
 * GET /api/auditing-results
 * LEGACY: Returns auditing_results.json data (if exists)
 */
app.get('/api/auditing-results', (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data/auditing_results.json');

    if (!fs.existsSync(dataPath)) {
      return res.status(404).json({
        error: 'Auditing results not found',
        message: 'Legacy auditing_results.json not available. Use /api/organizations instead.'
      });
    }

    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/list-exports
 * LEGACY: Lists available export files in field_kit_exports folder
 */
app.get('/api/list-exports', (req, res) => {
  try {
    const exportsPath = path.join(__dirname, '../field_kit_exports');

    if (!fs.existsSync(exportsPath)) {
      return res.json({ files: [], count: 0 });
    }

    const files = fs.readdirSync(exportsPath)
      .filter(f => f.startsWith('dashboard_export_') && f.endsWith('.json'))
      .map(f => ({
        filename: f,
        path: path.join(exportsPath, f),
        size: fs.statSync(path.join(exportsPath, f)).size,
        modified: fs.statSync(path.join(exportsPath, f)).mtime
      }));

    res.json({
      files: files,
      count: files.length,
      totalSize: files.reduce((sum, f) => sum + f.size, 0)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/get-export
 * Retrieves a specific assessment for an organization and indicator
 * Query params: org_id, indicator_id
 */
app.get('/api/get-export', (req, res) => {
  try {
    const { org_id, indicator_id } = req.query;

    if (!org_id || !indicator_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing required query parameters: org_id, indicator_id'
      });
    }

    console.log(`\n🔍 [API] Looking for assessment: org_id=${org_id}, indicator_id=${indicator_id}`);

    // Check if organization exists
    if (!dataManager.organizationExists(org_id)) {
      console.log(`   ❌ Organization not found: ${org_id}\n`);
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        org_id,
        indicator_id
      });
    }

    // Read organization data
    const orgData = dataManager.readOrganization(org_id);

    // Check if assessment exists for this indicator
    if (!orgData.assessments || !orgData.assessments[indicator_id]) {
      console.log(`   ❌ Assessment not found for indicator: ${indicator_id}\n`);
      return res.status(404).json({
        success: false,
        error: 'Assessment not found',
        org_id,
        indicator_id
      });
    }

    const assessment = orgData.assessments[indicator_id];

    console.log(`   ✅ Assessment loaded for ${indicator_id}\n`);

    // Format response to match expected structure from client
    const exportData = {
      organization_name: orgData.name,
      organization_id: org_id,
      indicator_id: indicator_id,
      metadata: orgData.metadata,
      full_assessment: assessment
    };

    res.json({
      success: true,
      data: exportData
    });

  } catch (error) {
    console.error(`   ❌ Error: ${error.message}\n`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/batch-import
 * LEGACY: Executes batch import of Field Kit exports
 */
app.post('/api/batch-import', (req, res) => {
  try {
    const folderPath = req.body.folderPath || path.join(__dirname, '../field_kit_exports');

    console.log(`\n🔧 [API] Batch import requested for: ${folderPath}`);

    if (!fs.existsSync(folderPath)) {
      return res.status(400).json({
        success: false,
        error: 'Folder not found',
        path: folderPath
      });
    }

    const files = fs.readdirSync(folderPath)
      .filter(f => f.startsWith('dashboard_export_') && f.endsWith('.json'));

    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No export files found',
        path: folderPath
      });
    }

    console.log(`   Found ${files.length} export files`);

    const scriptPath = path.join(__dirname, 'scripts/batch_import.js');
    const command = `node "${scriptPath}" "${folderPath}"`;

    console.log(`   Executing: ${command}`);

    const output = execSync(command, {
      encoding: 'utf8',
      cwd: __dirname
    });

    console.log(`   ✅ Import completed successfully\n`);

    res.json({
      success: true,
      message: 'Batch import completed successfully',
      filesProcessed: files.length,
      folderPath: folderPath,
      output: output
    });

  } catch (error) {
    console.error(`   ❌ Import failed: ${error.message}\n`);

    res.status(500).json({
      success: false,
      error: error.message,
      stderr: error.stderr ? error.stderr.toString() : null,
      stdout: error.stdout ? error.stdout.toString() : null
    });
  }
});

/**
 * POST /api/save-export
 * LEGACY: Saves Field Kit export directly to field_kit_exports folder
 */
app.post('/api/save-export', (req, res) => {
  try {
    const exportData = req.body.exportData;

    if (!exportData) {
      return res.status(400).json({
        success: false,
        error: 'Missing exportData in request body'
      });
    }

    if (!exportData.organization_id || !exportData.indicator_id) {
      return res.status(400).json({
        success: false,
        error: 'Export data must include organization_id and indicator_id'
      });
    }

    const exportsPath = path.join(__dirname, '../field_kit_exports');
    if (!fs.existsSync(exportsPath)) {
      fs.mkdirSync(exportsPath, { recursive: true });
      console.log(`✅ Created field_kit_exports directory`);
    }

    const timestamp = Date.now();
    const filename = `dashboard_export_${exportData.organization_id}_${exportData.indicator_id}_${timestamp}.json`;
    const filePath = path.join(exportsPath, filename);

    fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2), 'utf8');

    console.log(`\n📥 [API] Saved export: ${filename}`);
    console.log(`   Organization: ${exportData.organization_name || exportData.organization_id}`);
    console.log(`   Indicator: ${exportData.indicator_id}\n`);

    res.json({
      success: true,
      message: 'Export saved successfully',
      filename: filename,
      path: filePath,
      organization: exportData.organization_name || exportData.organization_id,
      indicator: exportData.indicator_id
    });

  } catch (error) {
    console.error(`   ❌ Save failed: ${error.message}\n`);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/generate-synthetic
 * LEGACY: Generates synthetic Field Kit export files
 */
app.post('/api/generate-synthetic', (req, res) => {
  try {
    console.log('\n🔧 [API] Generating synthetic Field Kit assessments...');

    const scriptPath = path.join(__dirname, 'scripts/generate_field_kit_assessments.js');

    const output = execSync(`node "${scriptPath}"`, {
      encoding: 'utf8',
      cwd: __dirname
    });

    console.log('   ✅ Synthetic data generated\n');

    res.json({
      success: true,
      message: 'Synthetic Field Kit assessments generated successfully',
      output: output
    });

  } catch (error) {
    console.error(`   ❌ Generation failed: ${error.message}\n`);

    res.status(500).json({
      success: false,
      error: error.message,
      stderr: error.stderr ? error.stderr.toString() : null
    });
  }
});

// ============================================
// SERVER START
// ============================================

app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║          🛡️  CPF Dashboard Server v2.0 - RUNNING           ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  console.log(`📡 Server listening on: http://localhost:${PORT}\n`);
  console.log('📂 Available endpoints:\n');
  console.log('   🌐 Dashboards:');
  console.log(`      → http://localhost:${PORT}/dashboard/auditing/`);
  console.log(`        (Auditing Progress + Risk Analysis Dashboard - with integrated client)`);
  console.log(`      → http://localhost:${PORT}/dashboard/soc/`);
  console.log(`        (SOC + Bayesian Analysis Dashboard)\n`);
  console.log('   📝 Legacy URLs (auto-redirect):');
  console.log(`      → /dashboard/dashboard_auditing.html → /dashboard/auditing/`);
  console.log(`      → /dashboard/dashboard.html → /dashboard/soc/\n`);
  console.log('   🔌 API Endpoints (v2.0 - JSON Storage):');
  console.log(`      Organizations:`);
  console.log(`        GET    /api/organizations`);
  console.log(`        GET    /api/organizations/:orgId`);
  console.log(`        POST   /api/organizations`);
  console.log(`        PUT    /api/organizations/:orgId`);
  console.log(`        DELETE /api/organizations/:orgId`);
  console.log(`      Assessments:`);
  console.log(`        GET    /api/organizations/:orgId/assessments`);
  console.log(`        GET    /api/organizations/:orgId/assessments/:indicatorId`);
  console.log(`        POST   /api/organizations/:orgId/assessments`);
  console.log(`        DELETE /api/organizations/:orgId/assessments/:indicatorId`);
  console.log(`      Aggregates:`);
  console.log(`        GET    /api/organizations/:orgId/aggregates`);
  console.log(`        GET    /api/organizations/:orgId/missing`);
  console.log(`        POST   /api/organizations/:orgId/recalculate`);
  console.log(`      Legacy (backward compatibility):`);
  console.log(`        GET    /api/auditing-results`);
  console.log(`        GET    /api/list-exports`);
  console.log(`        POST   /api/save-export`);
  console.log(`        POST   /api/batch-import`);
  console.log(`        POST   /api/generate-synthetic\n`);
  console.log('⚙️  Press CTRL+C to stop the server\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Server shutting down gracefully...\n');
  process.exit(0);
});
