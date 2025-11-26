/**
 * CPF Data Manager - Specialista per lo storage basato su SQLite.
 * Implementa l'interfaccia del data manager usando un database SQLite.
 */

const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const config = require('../config');

const DB_PATH = config.database.sqlite.path; // Corretto da dbPath a path
let db;

async function initialize() {
  if (db) return;
  try {
    db = await open({ filename: DB_PATH, driver: sqlite3.Database });
    console.log('[DB-SQLITE] Connessione al database SQLite stabilita.');
    await db.exec('PRAGMA foreign_keys = ON;');

    const createOrganizationsTable = `
      CREATE TABLE IF NOT EXISTS organizations (
        id VARCHAR(50) PRIMARY KEY, name VARCHAR(255) NOT NULL, industry VARCHAR(100),
        size VARCHAR(50), country VARCHAR(2), language VARCHAR(10), notes TEXT,
        partita_iva VARCHAR(50), sede_sociale VARCHAR(255), created_by VARCHAR(255),
        is_deleted BOOLEAN DEFAULT 0, created_at TIMESTAMP, updated_at TIMESTAMP
      );
    `;
    const createAssessmentsTable = `
      CREATE TABLE IF NOT EXISTS assessments (
        id INTEGER PRIMARY KEY AUTOINCREMENT, org_id VARCHAR(50) NOT NULL, indicator_id VARCHAR(10) NOT NULL,
        title TEXT, category VARCHAR(100), maturity_level VARCHAR(20),
        bayesian_score DECIMAL(5, 4), confidence DECIMAL(5, 4),
        assessor VARCHAR(255), assessment_date TIMESTAMP, raw_data TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE,
        UNIQUE(org_id, indicator_id)
      );
    `;

    const createSocIndicatorsTable = `
      CREATE TABLE IF NOT EXISTS soc_indicators (
        id INTEGER PRIMARY KEY AUTOINCREMENT, org_id VARCHAR(50) NOT NULL, indicator_id VARCHAR(10) NOT NULL,
        value DECIMAL(5, 4), previous_value DECIMAL(5, 4),
        event_count INTEGER DEFAULT 0, last_event_type VARCHAR(100), last_event_severity VARCHAR(20),
        source VARCHAR(50) DEFAULT 'simulator',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE,
        UNIQUE(org_id, indicator_id)
      );
    `;

    await db.exec(createOrganizationsTable);
    await db.exec(createAssessmentsTable);
    await db.exec(createSocIndicatorsTable);

    // Add missing columns if they don't exist (for storing calculated metrics and soft delete)
    const columnsToAdd = [
      { name: 'aggregates', type: 'TEXT' },
      { name: 'deleted_at', type: 'TIMESTAMP' },
      { name: 'deleted_by', type: 'VARCHAR(255)' }
    ];

    for (const col of columnsToAdd) {
      try {
        await db.exec(`ALTER TABLE organizations ADD COLUMN ${col.name} ${col.type};`);
        console.log(`[DB-SQLITE] Added ${col.name} column to organizations table.`);
      } catch (error) {
        // Column already exists, ignore error
        if (!error.message.includes('duplicate column name')) {
          console.warn(`[DB-SQLITE] Warning adding ${col.name} column:`, error.message);
        }
      }
    }

    console.log('[DB-SQLITE] Tabelle assicurate: organizations, assessments, soc_indicators.');
  } catch (error) {
    console.error('[DB-SQLITE] Errore di inizializzazione DB:', error);
    throw error;
  }
}

async function createOrganization(orgData) {
  await initialize();
  const { id: orgId, name, metadata, assessments } = orgData;
  const { industry, size, country, language, notes, created_by, partita_iva, sede_sociale, created_at, updated_at } = metadata;

  try {
    // Start transaction
    await db.exec('BEGIN TRANSACTION');

    // 1. Insert or replace the organization
    const orgQuery = `
      INSERT OR REPLACE INTO organizations (id, name, industry, size, country, language, notes, created_by, partita_iva, sede_sociale, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    await db.run(orgQuery, [orgId, name, industry, size, country, language, notes, created_by, partita_iva, sede_sociale, created_at, updated_at]);

    // 2. Insert or replace all assessments
    if (assessments) {
      const assessmentQuery = `
        INSERT OR REPLACE INTO assessments (org_id, indicator_id, title, category, bayesian_score, confidence, maturity_level, assessor, assessment_date, raw_data, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP);
      `;
      for (const indicatorId in assessments) {
        const assessment = assessments[indicatorId];
        await db.run(assessmentQuery, [
          orgId,
          indicatorId,
          assessment.title,
          assessment.category,
          assessment.bayesian_score,
          assessment.confidence,
          assessment.maturity_level,
          assessment.assessor,
          assessment.assessment_date,
          JSON.stringify(assessment.raw_data)
        ]);
      }
    }

    await db.exec('COMMIT');
    console.log(`[DB-SQLITE] Organization ${orgId} created with ${assessments ? Object.keys(assessments).length : 0} assessments.`);
    return orgData;

  } catch (error) {
    await db.exec('ROLLBACK');
    console.error(`[DB-SQLITE] Errore in createOrganization per ID ${orgId}:`, error);
    throw error;
  }
}

async function readOrganization(orgId) {
  await initialize();
  try {
    // Read organization including deleted ones (dataManager will handle filtering)
    const orgRow = await db.get('SELECT * FROM organizations WHERE id = ?', orgId);
    if (!orgRow) return null;

    const assessmentRows = await db.all('SELECT * FROM assessments WHERE org_id = ?', orgId);
    const assessments = assessmentRows.reduce((acc, a) => {
      if (a.raw_data) a.raw_data = JSON.parse(a.raw_data);
      const { org_id, ...assessmentData } = a;
      acc[a.indicator_id] = assessmentData;
      return acc;
    }, {});

    // Parse aggregates if it's a JSON string, or calculate from assessments
    let aggregates;
    if (orgRow.aggregates) {
      try {
        aggregates = JSON.parse(orgRow.aggregates);
      } catch (e) {
        console.warn('[DB-SQLITE] Failed to parse aggregates, recalculating...');
        aggregates = calculateAggregates(assessments, orgRow.industry);
      }
    } else {
      aggregates = calculateAggregates(assessments, orgRow.industry);
    }

    const result = {
      id: orgRow.id,
      name: orgRow.name,
      metadata: {
        industry: orgRow.industry,
        size: orgRow.size,
        country: orgRow.country,
        language: orgRow.language,
        created_at: orgRow.created_at,
        updated_at: orgRow.updated_at,
        created_by: orgRow.created_by,
        notes: orgRow.notes,
        sede_sociale: orgRow.sede_sociale,
        partita_iva: orgRow.partita_iva,
        deleted_at: orgRow.deleted_at || undefined,
        deleted_by: orgRow.deleted_by || undefined
      },
      assessments: assessments,
      aggregates: aggregates
    };
    return result;
  } catch (error) {
    console.error(`[DB-SQLITE] Errore in readOrganization per ID ${orgId}:`, error);
    return null;
  }
}

async function organizationExists(orgId) {
  await initialize();
  try {
    const row = await db.get('SELECT id FROM organizations WHERE id = ? AND is_deleted = 0', orgId);
    return row !== undefined;
  } catch (error) {
    console.error(`[DB-SQLITE] Errore in organizationExists per ID ${orgId}:`, error);
    return false;
  }
}

async function saveAssessment(orgId, indicatorId, data) {
  await initialize();
  const { title, category, bayesian_score, confidence, maturity_level, assessor, assessment_date, raw_data } = data;
  const query = `
    INSERT INTO assessments (org_id, indicator_id, title, category, bayesian_score, confidence, maturity_level, assessor, assessment_date, raw_data, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(org_id, indicator_id) DO UPDATE SET
      title = excluded.title,
      category = excluded.category,
      bayesian_score = excluded.bayesian_score,
      confidence = excluded.confidence,
      maturity_level = excluded.maturity_level,
      assessor = excluded.assessor,
      assessment_date = excluded.assessment_date,
      raw_data = excluded.raw_data,
      updated_at = CURRENT_TIMESTAMP;
  `;
  try {
    await db.run(query, [orgId, indicatorId, title, category, bayesian_score, confidence, maturity_level, assessor, assessment_date, JSON.stringify(raw_data)]);
    return { success: true };
  } catch (error) {
    console.error(`[DB-SQLITE] Errore in saveAssessment per org ${orgId}, indicatore ${indicatorId}:`, error);
    throw error;
  }
}

// Import calculateAggregates for computing aggregates from assessments
const { calculateAggregates } = require('./db_json');

async function readOrganizationsIndex() {
  await initialize();
  try {
    const rows = await db.all('SELECT * FROM organizations WHERE is_deleted = 0 ORDER BY name ASC');
    const organizations = [];

    for (const row of rows) {
      // Get assessments for this organization to calculate stats
      const assessmentRows = await db.all('SELECT * FROM assessments WHERE org_id = ?', row.id);

      // Convert assessments to object format
      const assessments = assessmentRows.reduce((acc, a) => {
        if (a.raw_data) a.raw_data = JSON.parse(a.raw_data);
        acc[a.indicator_id] = a;
        return acc;
      }, {});

      // Calculate aggregates
      const aggregates = calculateAggregates(assessments, row.industry);

      organizations.push({
        id: row.id,
        name: row.name,
        industry: row.industry,
        size: row.size,
        country: row.country,
        language: row.language,
        created_at: row.created_at,
        updated_at: row.updated_at,
        stats: {
          total_assessments: aggregates.completion.assessed_indicators,
          completion_percentage: aggregates.completion.percentage,
          overall_risk: aggregates.overall_risk,
          avg_confidence: aggregates.overall_confidence,
          last_assessment_date: assessmentRows.length > 0
            ? assessmentRows.sort((a, b) => new Date(b.assessment_date) - new Date(a.assessment_date))[0]?.assessment_date
            : null
        }
      });
    }

    return {
      metadata: {
        version: '2.0',
        last_updated: new Date().toISOString(),
        total_organizations: organizations.length
      },
      organizations
    };
  } catch (error) {
    console.error('[DB-SQLITE] Error in readOrganizationsIndex:', error);
    return {
      metadata: {
        version: '2.0',
        last_updated: new Date().toISOString(),
        total_organizations: 0
      },
      organizations: []
    };
  }
}

async function writeOrganization(orgId, fullOrgData) {
  await initialize();

  // Extract flat data from full organization structure
  const data = {
    name: fullOrgData.name,
    industry: fullOrgData.metadata.industry,
    size: fullOrgData.metadata.size,
    country: fullOrgData.metadata.country,
    language: fullOrgData.metadata.language,
    notes: fullOrgData.metadata.notes || '',
    created_by: fullOrgData.metadata.created_by || '',
    partita_iva: fullOrgData.metadata.partita_iva || '',
    sede_sociale: fullOrgData.metadata.sede_sociale || '',
    created_at: fullOrgData.metadata.created_at || new Date().toISOString(),
    deleted_at: fullOrgData.metadata.deleted_at || null,
    deleted_by: fullOrgData.metadata.deleted_by || null
  };

  // Serialize aggregates to JSON string if present
  const aggregatesJson = fullOrgData.aggregates ? JSON.stringify(fullOrgData.aggregates) : null;

  // is_deleted flag is 1 if deleted_at is present
  const isDeleted = data.deleted_at ? 1 : 0;

  // UPSERT: Insert if not exists, update if exists
  const query = `
    INSERT INTO organizations (id, name, industry, size, country, language, notes, created_by, partita_iva, sede_sociale, aggregates, deleted_at, deleted_by, is_deleted, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      industry = excluded.industry,
      size = excluded.size,
      country = excluded.country,
      language = excluded.language,
      notes = excluded.notes,
      created_by = excluded.created_by,
      partita_iva = excluded.partita_iva,
      sede_sociale = excluded.sede_sociale,
      aggregates = excluded.aggregates,
      deleted_at = excluded.deleted_at,
      deleted_by = excluded.deleted_by,
      is_deleted = excluded.is_deleted,
      updated_at = CURRENT_TIMESTAMP;
  `;

  try {
    await db.run(query, [orgId, data.name, data.industry, data.size, data.country, data.language,
                         data.notes, data.created_by, data.partita_iva, data.sede_sociale, aggregatesJson,
                         data.deleted_at, data.deleted_by, isDeleted, data.created_at]);
    console.log(`[DB-SQLITE] Organization ${orgId} written successfully (UPSERT).`);
    return fullOrgData;
  } catch (error) {
    console.error(`[DB-SQLITE] Error in writeOrganization for ID ${orgId}:`, error);
    throw error;
  }
}

async function updateOrganization(orgId, data) {
  await initialize();
  const { name, industry, size, country, language, notes, created_by, partita_iva, sede_sociale } = data;
  const query = `
    UPDATE organizations SET
      name = ?, industry = ?, size = ?, country = ?, language = ?,
      notes = ?, created_by = ?, partita_iva = ?, sede_sociale = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?;
  `;
  try {
    await db.run(query, [name, industry, size, country, language, notes || '', created_by || '', partita_iva || '', sede_sociale || '', orgId]);
    console.log(`[DB-SQLITE] Organization ${orgId} updated successfully.`);
    return await readOrganization(orgId);
  } catch (error) {
    console.error(`[DB-SQLITE] Error in updateOrganization for ID ${orgId}:`, error);
    throw error;
  }
}

async function deleteOrganization(orgId) {
  await initialize();
  try {
    await db.run('UPDATE organizations SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?', orgId);
    console.log(`[DB-SQLITE] Organization ${orgId} marked as deleted.`);
    return { success: true };
  } catch (error) {
    console.error(`[DB-SQLITE] Error in deleteOrganization for ID ${orgId}:`, error);
    throw error;
  }
}

async function getAssessment(orgId, indicatorId) {
  await initialize();
  try {
    const row = await db.get('SELECT * FROM assessments WHERE org_id = ? AND indicator_id = ?', [orgId, indicatorId]);
    if (row) {
      if (row.raw_data) row.raw_data = JSON.parse(row.raw_data);
      return row;
    }
    return null;
  } catch (error) {
    console.error(`[DB-SQLITE] Error in getAssessment for org ${orgId}, indicator ${indicatorId}:`, error);
    return null;
  }
}

async function deleteAssessment(orgId, indicatorId) {
  await initialize();
  try {
    await db.run('DELETE FROM assessments WHERE org_id = ? AND indicator_id = ?', [orgId, indicatorId]);
    console.log(`[DB-SQLITE] Assessment deleted for org ${orgId}, indicator ${indicatorId}.`);
    return { success: true };
  } catch (error) {
    console.error(`[DB-SQLITE] Error in deleteAssessment for org ${orgId}, indicator ${indicatorId}:`, error);
    throw error;
  }
}

/**
 * Get SOC indicator data for an organization
 * Returns SOC indicators (NOT assessments/auditing data)
 */
async function getSocData(orgId) {
  await initialize();
  try {
    const orgRow = await db.get('SELECT id, name FROM organizations WHERE id = ? AND is_deleted = 0', [orgId]);
    if (!orgRow) {
      return null;
    }

    // Read from soc_indicators table (NOT assessments table)
    const socRows = await db.all('SELECT indicator_id, value, previous_value, event_count, last_event_type, last_event_severity, updated_at FROM soc_indicators WHERE org_id = ? ORDER BY indicator_id', [orgId]);

    // If no SOC data exists, return null (to trigger "generate data" message in dashboard)
    if (socRows.length === 0) {
      return null;
    }

    const indicators = {};
    for (const row of socRows) {
      indicators[row.indicator_id] = {
        indicator_id: row.indicator_id,
        value: row.value,
        previous_value: row.previous_value,
        event_count: row.event_count,
        last_event_type: row.last_event_type,
        last_event_severity: row.last_event_severity,
        last_updated: row.updated_at
      };
    }

    return {
      org_id: orgRow.id,
      org_name: orgRow.name,
      indicators
    };
  } catch (error) {
    console.error(`[DB-SQLITE] Error reading SOC data for ${orgId}:`, error);
    throw error;
  }
}

/**
 * Save SOC indicator to soc_indicators table (SEPARATE from assessments/auditing)
 */
async function saveSocIndicator(orgId, assessmentData) {
  await initialize();
  const indicatorId = assessmentData.indicator_id;
  const value = assessmentData.bayesian_score;

  // Get previous value if exists
  let previousValue = null;
  let eventCount = 1;
  try {
    const prevRow = await db.get('SELECT value, event_count FROM soc_indicators WHERE org_id = ? AND indicator_id = ?', [orgId, indicatorId]);
    if (prevRow) {
      previousValue = prevRow.value;
      eventCount = (prevRow.event_count || 0) + 1;
    }
  } catch (error) {
    console.warn(`[DB-SQLITE] Could not fetch previous SOC value for ${orgId}/${indicatorId}:`, error.message);
  }

  // Save to soc_indicators table (NOT assessments!)
  const query = `
    INSERT OR REPLACE INTO soc_indicators (org_id, indicator_id, value, previous_value, event_count, last_event_type, last_event_severity, source, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'));
  `;

  const lastEventType = assessmentData.event_type || assessmentData.raw_data?.event_type || null;
  const lastEventSeverity = assessmentData.severity || assessmentData.raw_data?.severity || null;
  const source = assessmentData.source || 'simulator';

  await db.run(query, [orgId, indicatorId, value, previousValue, eventCount, lastEventType, lastEventSeverity, source]);

  console.log(`[DB-SQLITE] Successfully saved SOC indicator ${indicatorId} for organization ${orgId} (value: ${value}, previous: ${previousValue}).`);

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
  organizationExists,
  readOrganizationsIndex,
  saveAssessment,
  getSocData,
  saveSocIndicator,
  updateOrganization,
  writeOrganization,
  deleteOrganization,
  getAssessment,
  deleteAssessment,
  saveIndicatorMetadata: async () => ({ success: true }),
  writeOrganizationsIndex: async () => {},
  updateOrganizationInIndex: async () => {},
  removeOrganizationFromIndex: async () => {},
};