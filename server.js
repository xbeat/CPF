#!/usr/bin/env node

/**
 * CPF Dashboard Server
 *
 * Unified Node.js server for:
 * - Dashboard SOC (dashboard.html)
 * - Dashboard Auditing (dashboard_auditing.html)
 * - Client Field Kit (cpf_client_json.html)
 * - API endpoints for batch import and data access
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from dashboard folder
app.use('/dashboard', express.static(path.join(__dirname, 'dashboard')));

// Serve static files from auditor field kit
app.use('/client', express.static(path.join(__dirname, 'auditor field kit/interactive')));

// ============================================
// API ENDPOINTS
// ============================================

/**
 * GET /api/organizations
 * Returns organizations.json data
 */
app.get('/api/organizations', (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'dashboard/data/organizations.json');

    if (!fs.existsSync(dataPath)) {
      return res.status(404).json({
        error: 'Organizations data not found',
        message: 'Run generate_synthetic_data.js first or import Field Kit assessments'
      });
    }

    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/auditing-results
 * Returns auditing_results.json data
 */
app.get('/api/auditing-results', (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'dashboard/data/auditing_results.json');

    if (!fs.existsSync(dataPath)) {
      return res.status(404).json({
        error: 'Auditing results not found',
        message: 'Run batch import to generate auditing results'
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
 * Lists available export files in field_kit_exports folder
 */
app.get('/api/list-exports', (req, res) => {
  try {
    const exportsPath = path.join(__dirname, 'field_kit_exports');

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
 * Retrieves a specific export file for an organization and indicator
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

    const exportsPath = path.join(__dirname, 'field_kit_exports');

    if (!fs.existsSync(exportsPath)) {
      return res.status(404).json({
        success: false,
        error: 'Export folder not found'
      });
    }

    console.log(`\n🔍 [API] Looking for export: org_id=${org_id}, indicator_id=${indicator_id}`);

    // Find export file matching org_id and indicator_id
    // Filename pattern: dashboard_export_{org_id}_{indicator_id}_{timestamp}.json
    const files = fs.readdirSync(exportsPath)
      .filter(f => {
        const matches = f.startsWith(`dashboard_export_${org_id}_${indicator_id}_`) &&
               f.endsWith('.json');
        if (matches) {
          console.log(`   ✅ Found: ${f}`);
        }
        return matches;
      })
      .sort((a, b) => {
        // Sort by timestamp (most recent first)
        const timeA = parseInt(a.split('_').pop().replace('.json', ''));
        const timeB = parseInt(b.split('_').pop().replace('.json', ''));
        return timeB - timeA;
      });

    if (files.length === 0) {
      console.log(`   ❌ No export found`);
      console.log(`   Available files in directory:`);
      const allFiles = fs.readdirSync(exportsPath).filter(f => f.endsWith('.json'));
      allFiles.slice(0, 5).forEach(f => console.log(`      - ${f}`));

      return res.status(404).json({
        success: false,
        error: 'Export not found',
        org_id,
        indicator_id
      });
    }

    // Read most recent export
    const filePath = path.join(exportsPath, files[0]);
    const exportData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    console.log(`   ✅ Loaded: ${files[0]}\n`);

    res.json({
      success: true,
      filename: files[0],
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
 * Executes batch import of Field Kit exports
 * Body: { folderPath: string } (optional, defaults to ../field_kit_exports)
 */
app.post('/api/batch-import', (req, res) => {
  try {
    const folderPath = req.body.folderPath || path.join(__dirname, 'field_kit_exports');

    console.log(`\n🔧 [API] Batch import requested for: ${folderPath}`);

    // Check if folder exists
    if (!fs.existsSync(folderPath)) {
      return res.status(400).json({
        success: false,
        error: 'Folder not found',
        path: folderPath,
        message: 'The specified export folder does not exist'
      });
    }

    // Check if there are export files
    const files = fs.readdirSync(folderPath)
      .filter(f => f.startsWith('dashboard_export_') && f.endsWith('.json'));

    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No export files found',
        path: folderPath,
        message: 'No dashboard_export_*.json files found in the specified folder'
      });
    }

    console.log(`   Found ${files.length} export files`);

    // Execute batch import script
    const scriptPath = path.join(__dirname, 'dashboard/scripts/batch_import.js');
    const command = `node "${scriptPath}" "${folderPath}"`;

    console.log(`   Executing: ${command}`);

    const output = execSync(command, {
      encoding: 'utf8',
      cwd: path.join(__dirname, 'dashboard')
    });

    console.log(`   ✅ Import completed successfully\n`);

    // Return success with output
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
 * Saves Field Kit export directly to field_kit_exports folder
 * Body: { exportData: object } - The complete export JSON
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

    // Validate required fields
    if (!exportData.organization_id || !exportData.indicator_id) {
      return res.status(400).json({
        success: false,
        error: 'Export data must include organization_id and indicator_id'
      });
    }

    // Create field_kit_exports folder if it doesn't exist
    const exportsPath = path.join(__dirname, 'field_kit_exports');
    if (!fs.existsSync(exportsPath)) {
      fs.mkdirSync(exportsPath, { recursive: true });
      console.log(`✅ Created field_kit_exports directory`);
    }

    // Generate filename
    const timestamp = Date.now();
    const filename = `dashboard_export_${exportData.organization_id}_${exportData.indicator_id}_${timestamp}.json`;
    const filePath = path.join(exportsPath, filename);

    // Save file
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
 * Generates synthetic Field Kit export files
 * Body: { orgId, orgName, industry, size, auditor } (all optional)
 */
app.post('/api/generate-synthetic', (req, res) => {
  try {
    console.log('\n🔧 [API] Generating synthetic Field Kit assessments...');

    const scriptPath = path.join(__dirname, 'dashboard/scripts/generate_field_kit_assessments.js');

    // Execute generator script
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
  console.log('║          🛡️  CPF Dashboard Server - RUNNING                ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  console.log(`📡 Server listening on: http://localhost:${PORT}\n`);
  console.log('📂 Available endpoints:\n');
  console.log('   🌐 Dashboards:');
  console.log(`      → http://localhost:${PORT}/dashboard/dashboard.html`);
  console.log(`        (SOC + Bayesian Analysis Dashboard)`);
  console.log(`      → http://localhost:${PORT}/dashboard/dashboard_auditing.html`);
  console.log(`        (Auditing Progress + Risk Analysis Dashboard)`);
  console.log(`      → http://localhost:${PORT}/client/cpf_client_json.html`);
  console.log(`        (Field Kit Assessment Client)\n`);
  console.log('   🔌 API Endpoints:');
  console.log(`      GET  /api/organizations`);
  console.log(`      GET  /api/auditing-results`);
  console.log(`      GET  /api/list-exports`);
  console.log(`      POST /api/save-export`);
  console.log(`      POST /api/batch-import`);
  console.log(`      POST /api/generate-synthetic\n`);
  console.log('⚙️  Press CTRL+C to stop the server\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Server shutting down gracefully...\n');
  process.exit(0);
});
