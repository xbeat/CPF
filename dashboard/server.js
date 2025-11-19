#!/usr/bin/env node

/**
 * CPF Dashboard Server
 *
 * Unified Node.js server for:
 * - Dashboard SOC (dashboard.html)
 * - Dashboard Auditing (dashboard_auditing.html)
 * - Client Field Kit (cpf_client_json.html)
 * - API endpoints for organization and assessment management
 * - Card Editor
 *
 * Version: 2.1 - GitHub Integration for Card Editor
 */

// Load environment variables from .env.github file
require('dotenv').config({ path: './.env.github' });

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

// Import data manager
const dataManager = require('./lib/dataManager');

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
const PORT = 3000;

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
app.use('/auditor-field-kit', express.static(path.join(__dirname, '../auditor field kit')));

// ============================================
// LANDING PAGE ROUTE
// ============================================

// Main landing page
app.get('/', (req, res) => {
  res.redirect(301, '/dashboard/');
});

// ============================================
// CARD EDITOR API
// ============================================

app.get('/api/cards', async (req, res) => {
    if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
        return res.status(500).json({ error: 'GitHub integration is not configured on the server.' });
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
// ORGANIZATION MANAGEMENT API
// ============================================

// Recalculate aggregates for a specific organization
app.post('/api/organizations/:orgId/recalculate', async (req, res) => {
  try {
    const { orgId } = req.params;
    const result = await dataManager.recalculateAggregates(orgId);
    res.json({ success: true, message: 'Aggregates recalculated successfully', data: result });
  } catch (error) {
    console.error('[API] Error recalculating aggregates:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Recalculate aggregates for all organizations
app.post('/api/organizations/recalculate-all', async (req, res) => {
  try {
    const results = await dataManager.recalculateAllAggregates();
    res.json({ success: true, message: 'All aggregates recalculated', results });
  } catch (error) {
    console.error('[API] Error recalculating all aggregates:', error);
    res.status(500).json({ success: false, error: error.message });
  }
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

// ... (rest of the server.js file remains the same)

