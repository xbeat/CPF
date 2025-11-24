/**
 * CPF Dashboard Initialization
 * Creates required directories and sample organizations on first run
 * Supports JSON, SQLite, and PostgreSQL backends
 */

const fs = require('fs');
const path = require('path');
const config = require('../config');

const DATA_DIR = path.join(__dirname, '..', 'data');
const ORGS_DIR = path.join(DATA_DIR, 'organizations');
const TRASH_DIR = path.join(DATA_DIR, 'trash');
const HISTORY_DIR = path.join(DATA_DIR, 'history');
const MATH_FORMALIZATION_DIR = path.join(__dirname, '../..', 'math-formalization');

/**
 * Ensure directory exists
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ [Init] Created directory: ${dirPath}`);
  }
}

/**
 * Create sample organizations if none exist
 * Uses the dynamic db driver (supports JSON, SQLite, PostgreSQL)
 */
async function createSampleOrganizations() {
  const db = require('../db');

  // Initialize database (important for PostgreSQL)
  if (db.initialize) {
    await db.initialize();
  }

  // Check if any organizations exist
  // For JSON backend: verify files exist, not just index
  // For DB backends: trust the index
  const index = await db.readOrganizationsIndex();

  if (config.database.type === 'json') {
    // For JSON, verify actual files exist
    const fs = require('fs');
    const path = require('path');
    const orgsDir = config.database.json.orgsDir;

    if (fs.existsSync(orgsDir)) {
      const orgFiles = fs.readdirSync(orgsDir).filter(f => f.endsWith('.json'));
      if (orgFiles.length > 0) {
        console.log(`ℹ️  [Init] Found ${orgFiles.length} organization files, skipping sample creation`);
        return;
      }
    }
    // If index says there are orgs but files don't exist, create them
    console.log('📝 [Init] No organization files found, creating sample organizations...');
  } else {
    // For database backends (SQLite, PostgreSQL), trust the index
    if (index.metadata.total_organizations > 0) {
      console.log(`ℹ️  [Init] Found ${index.metadata.total_organizations} existing organizations, skipping sample creation`);
      return;
    }
    console.log('📝 [Init] No organizations found, creating sample organizations...');
  }

  const sampleOrgs = [
    {
      name: 'TechCorp Solutions',
      industry: 'Technology',
      size: 'Large',
      country: 'US',
      language: 'en-US',
      sede_sociale: 'San Francisco, CA',
      partita_iva: 'US123456789'
    },
    {
      name: 'FinanceFirst Bank',
      industry: 'Finance',
      size: 'Large',
      country: 'US',
      language: 'en-US',
      sede_sociale: 'New York, NY',
      partita_iva: 'US987654321'
    },
    {
      name: 'MediCare Health',
      industry: 'Healthcare',
      size: 'Medium',
      country: 'IT',
      language: 'it-IT',
      sede_sociale: 'Milano, Italia',
      partita_iva: 'IT12345678901'
    }
  ];

  for (const org of sampleOrgs) {
    try {
      // Generate org ID from name
      const orgId = org.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      // Create organization structure
      const orgData = {
        id: orgId,
        name: org.name,
        metadata: {
          industry: org.industry,
          size: org.size,
          country: org.country,
          language: org.language,
          sede_sociale: org.sede_sociale,
          partita_iva: org.partita_iva,
          created_by: 'System',
          notes: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        assessments: {},
        aggregates: {
          overall_risk: 0,
          overall_confidence: 0,
          completion: {
            assessed_indicators: 0,
            total_indicators: 100,
            percentage: 0
          },
          by_category: {}
        }
      };

      // Initialize category aggregates
      for (let i = 1; i <= 10; i++) {
        orgData.aggregates.by_category[i.toString()] = {
          avg_score: 0,
          avg_confidence: 0,
          total_assessments: 0,
          total_indicators: 10
        };
      }

      await db.createOrganization(orgData);
      console.log(`   ✅ Created: ${org.name} (${orgId})`);
    } catch (error) {
      console.error(`   ❌ Failed to create ${org.name}:`, error.message);
    }
  }

  console.log('✅ [Init] Sample organizations created');
}

/**
 * Initialize dashboard data structure
 * Async function to support all database backends
 */
async function initialize() {
  console.log('\n🚀 [Init] Initializing CPF Dashboard...');

  // Create required directories (only for JSON backend)
  if (config.database.type === 'json') {
    ensureDir(DATA_DIR);
    ensureDir(ORGS_DIR);
    ensureDir(TRASH_DIR);
    ensureDir(HISTORY_DIR);
  }

  // Always create math-formalization directory
  ensureDir(MATH_FORMALIZATION_DIR);

  // Create sample organizations if needed (all backends)
  await createSampleOrganizations();

  console.log('✅ [Init] Dashboard initialization complete\n');
}

module.exports = { initialize };
