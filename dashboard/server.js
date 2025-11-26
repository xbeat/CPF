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

// Error handlers for uncaught errors
process.on('uncaughtException', (error) => {
  console.error('\n❌ [FATAL] Uncaught Exception:', error.message);
  console.error(error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\n❌ [FATAL] Unhandled Promise Rejection:', reason);
  console.error('Promise:', promise);
  process.exit(1);
});

console.log('[Server] Starting CPF Dashboard Server...');
// Load environment variables from .env file
require('dotenv').config({ path: './.env' });

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const http = require('http');
const { Server } = require('socket.io');
const { Octokit } = require('@octokit/rest');

// --- GitHub Configuration ---
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;

const octokit = new Octokit({ auth: GITHUB_TOKEN });

console.log('[Server] Core modules loaded');

// Import data manager
console.log('[Server] Loading data manager...');
const dataManager = require('./lib/dataManager');
const db = require('./db'); // Dynamic database abstraction layer
console.log('[Server] Data manager loaded successfully');

// Initialize data structure (directories, sample orgs) - async
const { initialize } = require('./lib/init');
initialize().catch(err => {
  console.error('❌ [FATAL] Initialization failed:', err.message);
  process.exit(1);
});

// SOC (lazy-loaded on first use)
let simulator = null;

function getSimulator() {
  if (!simulator) {
    const { getInstance } = require('./simulator/generators');
    simulator = getInstance();
    console.log('🎭 [SOC] Initialized on-demand');
  }
  return simulator;
}

const app = express();
const PORT = process.env.PORT || 3000;

// Create HTTP server and attach Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  serveClient: true,
  path: '/socket.io/'
});

// Global Socket.io instance (accessible by other modules)
global.io = io;

// Socket.io connection handling
io.on('connection', (socket) => {
  socket.on('disconnect', () => {});

  socket.on('subscribe', (orgId) => {
    socket.join(`org:${orgId}`);
  });

  socket.on('unsubscribe', (orgId) => {
    socket.leave(`org:${orgId}`);
  });
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from dashboard folder
app.use('/dashboard', express.static(__dirname));

// Serve Card Editor files
app.use('/dashboard/card-editor', express.static(path.join(__dirname, 'card-editor')));

// Serve data files for SOC dashboard (static JSON files)
app.use('/data', express.static(path.join(__dirname, 'data')));

// Serve Auditor Field Kit interactive indicator files
// Auto-detect the correct path based on working directory
const auditorKitPath = (() => {
  // Check if environment variable is set
  if (process.env.AUDITOR_KIT_PATH) {
    const envPath = process.env.AUDITOR_KIT_PATH;
    const interactivePath = path.join(envPath, 'interactive');
    if (fs.existsSync(interactivePath)) {
      console.log('✅ Using AUDITOR_KIT_PATH from environment:', envPath);
      return envPath;
    } else {
      console.warn('⚠️  AUDITOR_KIT_PATH set but interactive folder not found:', interactivePath);
    }
  }

  // Try relative paths
  const pathsToTry = [
    path.join(__dirname, '..', 'auditor field kit'),  // Standard: dashboard/../auditor field kit
    path.join(__dirname, '..', '..', 'auditor field kit'),  // Nested deployment
  ];

  console.log('🔍 Auto-detecting Auditor Field Kit path...');
  for (const testPath of pathsToTry) {
    const interactivePath = path.join(testPath, 'interactive');
    console.log(`   Trying: ${testPath}`);
    if (fs.existsSync(testPath) && fs.existsSync(interactivePath)) {
      console.log(`✅ Found Auditor Field Kit at: ${testPath}`);
      return testPath;
    }
  }

  console.error('❌ Auditor Field Kit directory not found at any expected location!');
  console.error('   Paths tried:', pathsToTry);
  console.error('   Set AUDITOR_KIT_PATH environment variable to specify the location.');

  // Return first path as fallback (will fail but give better error messages)
  return pathsToTry[0];
})();

console.log('📁 Auditor Field Kit path:', auditorKitPath);
console.log('📁 Interactive folder exists:', fs.existsSync(path.join(auditorKitPath, 'interactive')));
app.use('/auditor-field-kit', express.static(auditorKitPath));

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
// CARD EDITOR API
// ============================================

app.get('/api/cards', async (req, res) => {
    // Return empty array if GitHub is not configured (local mode)
    if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
        console.log('[Card Editor] GitHub not configured, returning empty list');
        return res.json([]);
    }
    try {
        const { data } = await octokit.git.getTree({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            tree_sha: 'main', // or your default branch
            recursive: '1'
        });

        const cardFiles = data.tree
            .map(item => item.path)
            .filter(path =>
                path.startsWith('auditor field kit/interactive/') &&
                path.endsWith('.json') &&
                !path.includes('/proposals/')
            );

        res.json(cardFiles);
    } catch (error) {
        console.error('[Card Editor API] Error listing cards:', error);
        res.status(500).json({ error: 'Failed to fetch card list from GitHub.' });
    }
});

app.get('/api/cards/contents', async (req, res) => {
    const { path } = req.query;
    if (!path) {
        return res.status(400).json({ error: 'Path query parameter is required.' });
    }

    try {
        const { data } = await octokit.repos.getContent({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path: path,
            ref: 'main'
        });

        const content = Buffer.from(data.content, 'base64').toString('utf8');
        res.json(JSON.parse(content));

    } catch (error) {
        console.error(`[Card Editor API] Error fetching card content for ${path}:`, error);
        res.status(500).json({ error: `Failed to fetch card content for ${path} from GitHub.` });
    }
});

app.post('/api/cards/propose', async (req, res) => {
    const { originalPath, newContent, user } = req.body;

    if (!originalPath || !newContent || !user) {
        return res.status(400).json({ error: 'Missing required fields: originalPath, newContent, user' });
    }

    try {
        const mainBranch = await octokit.repos.getBranch({ owner: GITHUB_OWNER, repo: GITHUB_REPO, branch: 'main' });
        const latestSha = mainBranch.data.commit.sha;

        const timestamp = Date.now();
        const cardId = originalPath.split('/').pop().replace('.json', '');
        const newBranchName = `proposal-${cardId}-${user}-${timestamp}`.replace(/[^a-zA-Z0-9-]/g, '-');

        await octokit.git.createRef({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            ref: `refs/heads/${newBranchName}`,
            sha: latestSha
        });

        const proposalPath = originalPath.replace('/interactive/', '/interactive/proposals/');

        await octokit.repos.createOrUpdateFileContents({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path: proposalPath,
            message: `Propose changes for ${cardId} by ${user}`,
            content: Buffer.from(JSON.stringify(newContent, null, 2)).toString('base64'),
            branch: newBranchName,
        });

        res.status(201).json({
            success: true,
            message: 'Proposal branch created successfully!',
            branch: newBranchName
        });

    } catch (error) {
        console.error('[Card Editor API] Error creating proposal:', error);
        res.status(500).json({ error: 'Failed to create proposal branch on GitHub.' });
    }
});

// ============================================
// API ENDPOINTS - ORGANIZATIONS
// ============================================

/**
 * GET /api/organizations
 * Returns organizations index with stats
 */
app.get('/api/organizations', async (req, res) => {
  try {
    const index = await db.readOrganizationsIndex();

    // Filter out deleted organizations from main list
    const filteredOrgs = index.organizations.filter(org => !org.deleted_at);

    res.json({
      metadata: {
        ...index.metadata,
        total_organizations: filteredOrgs.length
      },
      organizations: filteredOrgs
    });
  } catch (error) {
    console.error('[API] Error reading organizations index:', error.message);
    res.json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/organizations/:orgId
 * Returns complete organization data (metadata + assessments + aggregates)
 */
app.get('/api/organizations/:orgId', async (req, res) => {
  try {
    const { orgId } = req.params;

    const orgData = await db.readOrganization(orgId);
    if (!orgData) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        orgId
      });
    }

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
 * Body: { id, name, industry, size, country, language, created_by, notes, sede_sociale, partita_iva, fetch_indicators }
 */
app.post('/api/organizations', async (req, res) => {
  try {
    const { id, name, industry, size, country, language, created_by, notes, sede_sociale, partita_iva, fetch_indicators } = req.body;

    // Validate required fields
    if (!id || !name || !industry || !size || !country) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: id, name, industry, size, country'
      });
    }

    // Check if organization already exists
    if (await db.organizationExists(id)) {
      return res.status(409).json({
        success: false,
        error: 'Organization already exists',
        orgId: id
      });
    }

    // Create organization using dataManager
    const orgData = await dataManager.createOrganization({
      id,
      name,
      industry,
      size,
      country,
      language: language || 'en-US',
      created_by: created_by || 'System',
      notes: notes || '',
      sede_sociale: sede_sociale || '',
      partita_iva: partita_iva || ''
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
app.put('/api/organizations/:orgId', async (req, res) => {
  try {
    const { orgId } = req.params;
    const updates = req.body;

    if (!(await db.organizationExists(orgId))) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        orgId
      });
    }

    // Update using updateOrganization with flat data structure
    const updateData = {
      name: updates.name,
      industry: updates.industry,
      size: updates.size,
      country: updates.country,
      language: updates.language,
      notes: updates.notes,
      sede_sociale: updates.sede_sociale,
      partita_iva: updates.partita_iva,
      created_by: updates.created_by
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const updatedOrg = await db.updateOrganization(orgId, updateData);

    console.log(`\n✅ [API] Updated organization: ${orgId}\n`);

    res.json({
      success: true,
      message: 'Organization updated successfully',
      data: updatedOrg
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
app.delete('/api/organizations/:orgId', async (req, res) => {
  try {
    const { orgId } = req.params;
    const user = req.query.user || req.body.user || 'System';

    if (!(await db.organizationExists(orgId))) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        orgId
      });
    }

    // Soft delete using dataManager for trash system
    const orgData = await dataManager.deleteOrganization(orgId, user);

    console.log(`\n🗑️  [API] Moved to trash: ${orgId}\n`);

    res.json({
      success: true,
      message: 'Organization moved to trash',
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
app.get('/api/organizations/:orgId/assessments/:indicatorId', async (req, res) => {
  try {
    const { orgId, indicatorId } = req.params;

    if (!(await dataManager.organizationExists(orgId))) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        orgId
      });
    }

    const assessment = await dataManager.getAssessment(orgId, indicatorId);

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
app.post('/api/organizations/:orgId/assessments', async (req, res) => {
  try {
    const { orgId } = req.params;
    const assessmentData = req.body;
    const user = assessmentData.assessor || req.body.user || 'System';

    if (!(await dataManager.organizationExists(orgId))) {
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
    const orgData = await dataManager.saveAssessment(orgId, assessmentData, user);

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
app.delete('/api/organizations/:orgId/assessments/:indicatorId', async (req, res) => {
  try {
    const { orgId, indicatorId } = req.params;
    const user = req.query.user || req.body.user || 'System';

    if (!(await dataManager.organizationExists(orgId))) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        orgId
      });
    }

    // Delete assessment (this also recalculates aggregates, saves version, and logs)
    const orgData = await dataManager.deleteAssessment(orgId, indicatorId, user);

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
app.post('/api/organizations/:orgId/recalculate', async (req, res) => {
  try {
    const { orgId } = req.params;

    if (!(await dataManager.organizationExists(orgId))) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        orgId
      });
    }

    const orgData = await dataManager.recalculateAggregates(orgId);

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
app.get('/api/trash', async (req, res) => {
  try {
    const trashOrgs = await dataManager.getTrash();

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

    // Return organization data in index format for frontend
    const organization = {
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
        overall_risk: orgData.aggregates.overall_risk || 0.5,
        avg_confidence: orgData.aggregates.overall_confidence || 0
      }
    };

    res.json({
      success: true,
      message: 'Organization restored successfully',
      orgId,
      organization
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
app.post('/api/organizations/:orgId/assessments/:indicatorId/revert', async (req, res) => {
  try {
    const { orgId, indicatorId } = req.params;
    const { version, user } = req.body;

    if (!version) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: version'
      });
    }

    if (!(await dataManager.organizationExists(orgId))) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        orgId
      });
    }

    const orgData = await dataManager.revertAssessment(orgId, indicatorId, parseInt(version), user || 'System');

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
// API ENDPOINTS - EXPORTS (XLSX & PDF)
// ============================================

/**
 * GET /api/organizations/:orgId/export/xlsx
 * Export organization's entire matrix as XLSX file
 */
app.get('/api/organizations/:orgId/export/xlsx', async (req, res) => {
  try {
    const { orgId } = req.params;
    const user = req.query.user || 'Dashboard User';

    if (!dataManager.organizationExists(orgId)) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        orgId
      });
    }

    const workbook = await dataManager.generateXLSXExport(orgId, user);
    const orgData = dataManager.readOrganization(orgId);

    console.log(`\n📊 [API] Generating XLSX export for: ${orgId}\n`);

    // Set headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="CPF_Audit_${orgData.name.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx"`);

    // Write to response
    await workbook.xlsx.write(res);
    res.end();

    console.log(`\n✅ [API] XLSX export completed: ${orgId}\n`);

  } catch (error) {
    console.error(`[API] Error generating XLSX export for ${req.params.orgId}:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/organizations/:orgId/export/pdf
 * Export organization's entire matrix as PDF file
 */
app.get('/api/organizations/:orgId/export/pdf', async (req, res) => {
  try {
    const { orgId } = req.params;
    const user = req.query.user || 'Dashboard User';

    if (!dataManager.organizationExists(orgId)) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        orgId
      });
    }

    const doc = await dataManager.generatePDFExport(orgId, user);
    const orgData = dataManager.readOrganization(orgId);

    console.log(`\n📄 [API] Generating PDF export for: ${orgId}\n`);

    // Set headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="CPF_Audit_${orgData.name.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf"`);

    // Pipe PDF to response
    doc.pipe(res);
    doc.end();

    console.log(`\n✅ [API] PDF export completed: ${orgId}\n`);

  } catch (error) {
    console.error(`[API] Error generating PDF export for ${req.params.orgId}:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/organizations/:orgId/export/zip
 * Export all organization's assessment cards (schede) as ZIP file
 */
app.get('/api/organizations/:orgId/export/zip', async (req, res) => {
  try {
    const { orgId } = req.params;
    const user = req.query.user || 'Dashboard User';

    if (!dataManager.organizationExists(orgId)) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        orgId
      });
    }

    const { stream } = await dataManager.generateZIPExport(orgId, user);
    const orgData = dataManager.readOrganization(orgId);

    console.log(`\n📦 [API] Generating ZIP export for: ${orgId}\n`);

    // Set headers for file download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="CPF_Audit_${orgData.name.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.zip"`);

    // Pipe ZIP stream to response
    stream.pipe(res);

    stream.on('end', () => {
      console.log(`\n✅ [API] ZIP export completed: ${orgId}\n`);
    });

  } catch (error) {
    console.error(`[API] Error generating ZIP export for ${req.params.orgId}:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// API ENDPOINTS - SOC DATA
// ============================================

/**
 * GET /api/soc/:orgId
 * Get SOC indicator data using database abstraction layer
 */
app.get('/api/soc/:orgId', async (req, res) => {
  try {
    const { orgId } = req.params;

    // Check if organization exists
    if (!(await dataManager.organizationExists(orgId))) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        orgId
      });
    }

    // Get SOC data using db abstraction layer
    const db = require('./db');
    const socData = await db.getSocData(orgId);

    if (!socData) {
      return res.status(404).json({
        success: false,
        error: 'SOC data not found',
        message: 'No SOC data available for this organization',
        orgId
      });
    }

    res.json({
      success: true,
      data: socData
    });

  } catch (error) {
    console.error(`[API] Error reading SOC data for ${req.params.orgId}:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/indicators/:indicatorId/metadata/:lang
 * Get indicator metadata from GitHub (auditor field kit interactive)
 */
app.get('/api/indicators/:indicatorId/metadata/:lang', (req, res) => {
  try {
    const { indicatorId, lang } = req.params;

    // Parse indicator ID (es. "1.1" -> category=1, indicator=1)
    const parts = indicatorId.split('.');
    if (parts.length !== 2) {
      return res.status(400).json({
        success: false,
        error: 'Invalid indicator ID format. Expected format: X.Y'
      });
    }

    const category = parts[0];
    const indicator = parts[1];

    // Map category to folder name
    const categoryMap = {
      '1': '1.x-authority',
      '2': '2.x-temporal',
      '3': '3.x-social',
      '4': '4.x-affective',
      '5': '5.x-cognitive',
      '6': '6.x-group',
      '7': '7.x-stress',
      '8': '8.x-unconscious',
      '9': '9.x-ai',
      '10': '10.x-convergent'
    };

    const categoryFolder = categoryMap[category];
    if (!categoryFolder) {
      return res.status(400).json({
        success: false,
        error: `Invalid category: ${category}`
      });
    }

    // Costruisci il path al file JSON usando il path auto-detected
    const metadataPath = path.join(
      auditorKitPath,
      'interactive',
      lang,
      categoryFolder,
      `indicator_${indicatorId}.json`
    );

    // Verifica se il file esiste
    if (!fs.existsSync(metadataPath)) {
      return res.status(404).json({
        success: false,
        error: 'Indicator metadata not found',
        indicatorId,
        lang,
        expectedPath: `auditor field kit/interactive/${lang}/${categoryFolder}/indicator_${indicatorId}.json`
      });
    }

    // Leggi il file JSON
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

    res.json({
      success: true,
      data: metadata
    });

  } catch (error) {
    console.error(`[API] Error reading indicator metadata:`, error.message);
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
// SIMULATOR API ENDPOINTS
// ============================================

/**
 * GET /api/simulator/status
 * Get simulator status
 */
app.get('/api/simulator/status', (req, res) => {
  try {
    const sim = getSimulator();
    const status = sim.getStatus();

      // Load sources config
      const sourcesPath = path.join(__dirname, 'simulator/config/sources.json');
      const sourcesData = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));
      const availableSources = sourcesData.sources
        .filter(s => s.enabled)
        .map(s => s.id);

      res.json({
        enabled: true,
        ...status,
        availableSources
      });
    } catch (error) {
      console.error('[SOC] Error getting status:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * POST /api/simulator/start
   * Start SOC for organization
   * Body: { orgId, sources?, scenario?, rate? }
   */
  app.post('/api/simulator/start', async (req, res) => {
    try {
      const { orgId, sources, scenario, rate, duration } = req.body;

      if (!orgId) {
        return res.status(400).json({
          success: false,
          error: 'Missing required field: orgId'
        });
      }

      // Verify organization exists
      if (!(await dataManager.organizationExists(orgId))) {
        return res.status(404).json({
          success: false,
          error: 'Organization not found',
          orgId
        });
      }

      // Setup callback per salvare assessments generati nel file SOC
      const sim = getSimulator();
      sim.setAssessmentsCallback(async (orgId, assessments) => {
        for (const assessment of assessments) {
          try {
            await dataManager.saveSocIndicator(orgId, assessment);
          } catch (error) {
            console.error(`Failed to save SOC indicator for ${orgId}:`, error.message);
          }
        }
      });

      // Start simulator
      const result = sim.start(orgId, {
        sources,
        scenario: scenario || 'normal',
        rate: rate || 10,
        duration: duration || 0
      });

      console.log(`\n✅ [API] SOC started for ${orgId}\n`);

      res.json({
        success: true,
        message: 'SOC started',
        ...result
      });

    } catch (error) {
      console.error('[SOC] Error starting:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * POST /api/simulator/stop
   * Stop SOC for organization
   * Body: { orgId }
   */
  app.post('/api/simulator/stop', (req, res) => {
    try {
      const { orgId } = req.body;

      if (!orgId) {
        return res.status(400).json({
          success: false,
          error: 'Missing required field: orgId'
        });
      }

      const sim = getSimulator();
      const result = sim.stop(orgId);

      console.log(`\n✅ [API] SOC stopped for ${orgId}\n`);

      res.json(result);

    } catch (error) {
      console.error('[SOC] Error stopping:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * GET /api/simulator/sources
   * List available SIEM/SOC/EDR sources
   */
  app.get('/api/simulator/sources', (req, res) => {
    try {
      const sourcesPath = path.join(__dirname, 'simulator/config/sources.json');
      const data = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));

      res.json({
        success: true,
        sources: data.sources.map(s => ({
          id: s.id,
          name: s.name,
          type: s.type,
          vendor: s.vendor,
          version: s.version,
          enabled: s.enabled,
          description: s.description
        })),
        metadata: data.metadata
      });

    } catch (error) {
      console.error('[SOC] Error reading sources:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * GET /api/simulator/scenarios
   * List available attack scenarios
   */
  app.get('/api/simulator/scenarios', (req, res) => {
    try {
      const sim = getSimulator();
      const scenarios = sim.getAvailableScenarios();

      res.json({
        success: true,
        scenarios,
        count: scenarios.length
      });

    } catch (error) {
      console.error('[Simulator] Error reading scenarios:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * POST /api/simulator/scenario
   * Execute specific scenario
   * Body: { orgId, scenario, duration?, intensity? }
   */
  app.post('/api/simulator/scenario', async (req, res) => {
    try {
      const { orgId, scenario, duration, intensity } = req.body;

      if (!orgId || !scenario) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: orgId, scenario'
        });
      }

      // Verify organization exists
      if (!dataManager.organizationExists(orgId)) {
        return res.status(404).json({
          success: false,
          error: 'Organization not found',
          orgId
        });
      }

      // Start simulator with scenario
      const sim = getSimulator();
      sim.setAssessmentsCallback(async (orgId, assessments) => {
        for (const assessment of assessments) {
          try {
            await dataManager.saveAssessment(orgId, assessment, 'SIEM-Simulator');
          } catch (error) {
            console.error(`Failed to save assessment for ${orgId}:`, error.message);
          }
        }
      });

      const result = sim.start(orgId, {
        scenario,
        duration: duration || 3600,
        intensity: intensity || 'high'
      });

      console.log(`\n🎬 [API] Scenario "${scenario}" started for ${orgId}\n`);

      res.json({
        success: true,
        message: `Scenario "${scenario}" started`,
        ...result
      });

    } catch (error) {
      console.error('[Simulator] Error executing scenario:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * GET /api/simulator/scenario/:orgId
   * Get scenario report for organization
   */
  app.get('/api/simulator/scenario/:orgId', (req, res) => {
    try {
      const { orgId } = req.params;

      const sim = getSimulator();
      const report = sim.getScenarioReport(orgId);

      if (!report) {
        return res.status(404).json({
          success: false,
          error: 'No active scenario for this organization',
          orgId
        });
      }

      res.json({
        success: true,
        report
      });

    } catch (error) {
      console.error('[Simulator] Error getting scenario report:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

/**
 * POST /api/simulator/emit
 * Emit manual events
 * Body: { orgId, eventType, severity, count, sources }
 */
app.post('/api/simulator/emit', async (req, res) => {
  try {
    const { orgId, eventType, severity, count, sources } = req.body;

    if (!orgId || !eventType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: orgId, eventType'
      });
    }

    // Verify organization exists
    if (!dataManager.organizationExists(orgId)) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
        orgId
      });
    }

    const sim = getSimulator();
    const SIEMDataGenerator = require('./simulator/generators/siem-data-generator');
    const CPFAdapter = require('./simulator/adapters/cpf-adapter');
    const { getInstance: getDenseLoader } = require('./simulator/generators/dense-loader');

    const siemGenerator = new SIEMDataGenerator();
    const denseLoader = getDenseLoader();
    const cpfAdapter = new CPFAdapter(denseLoader);

    // Generate events
    const eventSources = sources && sources.length > 0 ? sources : ['splunk'];
    const events = [];

    for (let i = 0; i < (count || 1); i++) {
      const source = eventSources[Math.floor(Math.random() * eventSources.length)];
      const event = siemGenerator.generateEvent(source, eventType, 'manual', severity || 'medium');
      events.push(event);
    }

    // Convert to assessments
    const assessments = await cpfAdapter.convertEventsToAssessments(events, orgId, 'manual');

    // Save assessments
    for (const assessment of assessments) {
      try {
        await dataManager.saveAssessment(orgId, assessment, 'Manual-Simulator');
      } catch (error) {
        console.error(`Failed to save assessment:`, error.message);
      }
    }

    console.log(`\n⚡ [API] Emitted ${events.length} manual event(s) for ${orgId}\n`);

    res.json({
      success: true,
      message: `Emitted ${events.length} event(s)`,
      eventsGenerated: events.length,
      assessmentsCreated: assessments.length
    });

  } catch (error) {
    console.error('[Simulator] Error emitting event:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// SERVER START
// ============================================

console.log('[Server] Initializing HTTP server on port', PORT);

server.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║          🛡️  CPF Dashboard Server - RUNNING                 ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  console.log(`📡 Server listening on: http://localhost:${PORT}`);
  console.log(`🔌 WebSocket server ready\n`);
  console.log('📂 Available endpoints:\n');
  console.log('   🌐 Dashboards:');
  console.log(`      → http://localhost:${PORT}/dashboard/auditing/`);
  console.log(`        (Auditing Progress + Risk Analysis Dashboard - with integrated client)`);
  console.log(`      → http://localhost:${PORT}/dashboard/soc/`);
  console.log(`        (SOC + Bayesian Analysis Dashboard)`);
  console.log(`      → http://localhost:${PORT}/dashboard/simulator/`);
  console.log(`        (SIEM/SOC Simulator Control Dashboard)\n`);
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
  console.log(`        POST   /api/generate-synthetic`);
  console.log(`\n   🎭 Simulator (Lazy-loaded on first use):`);
  console.log(`        GET    /api/simulator/status`);
  console.log(`        POST   /api/simulator/start`);
  console.log(`        POST   /api/simulator/stop`);
  console.log(`        POST   /api/simulator/emit`);
  console.log(`        GET    /api/simulator/sources`);
  console.log(`        GET    /api/simulator/scenarios`);
  console.log(`        POST   /api/simulator/scenario`);
  console.log(`        GET    /api/simulator/scenario/:orgId`);

  console.log('\n⚙️  Press CTRL+C to stop the server\n');
});

// Handle server listen errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`\n❌ [FATAL] Port ${PORT} is already in use`);
    console.error('   Please stop the other process or use a different port\n');
  } else {
    console.error('\n❌ [FATAL] Server error:', error.message);
    console.error(error.stack);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Server shutting down gracefully...\n');
  process.exit(0);
});
