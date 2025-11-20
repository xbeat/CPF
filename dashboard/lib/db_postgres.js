
/**
 * CPF Data Manager - Specialista per lo storage basato su PostgreSQL.
 * Implementa l'interfaccia del data manager usando un database PostgreSQL.
 */

const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');

// Configurazione del pool di connessioni PostgreSQL
const pool = new Pool(config.database.postgres);

let isInitialized = false;

/**
 * Inizializza il database creando le tabelle se non esistono.
 * Questa funzione viene eseguita una sola volta all'avvio dell'applicazione.
 */
async function initialize() {
  if (isInitialized) {
    return;
  }

  console.log('[DB-PG] Inizializzazione del database PostgreSQL...');
  const client = await pool.connect();

  try {
    const createOrganizationsTable = `
      CREATE TABLE IF NOT EXISTS organizations (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        industry VARCHAR(100),
        size VARCHAR(50),
        country VARCHAR(2),
        is_deleted BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createAssessmentsTable = `
      CREATE TABLE IF NOT EXISTS assessments (
        id SERIAL PRIMARY KEY,
        org_id VARCHAR(50) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
        indicator_id VARCHAR(10) NOT NULL,
        bayesian_score DECIMAL(5, 4),
        confidence DECIMAL(5, 4),
        assessor VARCHAR(255),
        assessment_date TIMESTAMPTZ,
        raw_data JSONB,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(org_id, indicator_id)
      );
    `;

    const createIndicatorsMetadataTable = `
      CREATE TABLE IF NOT EXISTS indicators_metadata (
        id SERIAL PRIMARY KEY,
        org_id VARCHAR(50) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
        indicator_id VARCHAR(10) NOT NULL,
        category VARCHAR(100),
        title TEXT,
        language VARCHAR(5) DEFAULT 'en-US',
        full_data JSONB,
        snapshot_date TIMESTAMPTZ,
        UNIQUE(org_id, indicator_id)
      );
    `;
    
    await client.query(createOrganizationsTable);
    await client.query(createAssessmentsTable);
    await client.query(createIndicatorsMetadataTable);

    console.log('[DB-PG] Tabelle assicurate: organizations, assessments, indicators_metadata.');
    isInitialized = true;
  } catch (error) {
    console.error('[DB-PG] Errore durante l\'inizializzazione del database:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Implementazione delle funzioni dell'interfaccia...

async function readOrganizationsIndex() {
  await initialize();
  const { rows } = await pool.query('SELECT id, name, industry, size, country, updated_at FROM organizations WHERE is_deleted = false ORDER BY name ASC');
  return rows;
}

async function createOrganization(data) {
  await initialize();
  const orgId = `org-${uuidv4()}`;
  const { name, industry, size, country } = data;
  const query = 'INSERT INTO organizations (id, name, industry, size, country, updated_at) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING id;';
  const { rows } = await pool.query(query, [orgId, name, industry, size, country]);
  return { id: rows[0].id, ...data };
}

async function readOrganization(orgId) {
  await initialize();
  const orgRes = await pool.query('SELECT * FROM organizations WHERE id = $1 AND is_deleted = false', [orgId]);
  const org = orgRes.rows[0];

  if (!org) return null;

  const assessRes = await pool.query('SELECT * FROM assessments WHERE org_id = $1', [orgId]);
  org.assessments = assessRes.rows.reduce((acc, a) => ({ ...acc, [a.indicator_id]: a }), {});

  const metaRes = await pool.query('SELECT * FROM indicators_metadata WHERE org_id = $1', [orgId]);
  org.indicators_metadata = metaRes.rows.reduce((acc, m) => ({ ...acc, [m.indicator_id]: m }), {});

  return org;
}

async function updateOrganization(orgId, data) {
  await initialize();
  const { name, industry, size, country } = data;
  const query = 'UPDATE organizations SET name = $1, industry = $2, size = $3, country = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5;';
  await pool.query(query, [name, industry, size, country, orgId]);
  return { id: orgId, ...data };
}

async function deleteOrganization(orgId) {
  await initialize();
  const query = 'UPDATE organizations SET is_deleted = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1;';
  await pool.query(query, [orgId]);
  return { success: true };
}

async function saveAssessment(orgId, indicatorId, data) {
  await initialize();
  const { bayesian_score, confidence, assessor, assessment_date, raw_data } = data;
  const query = `
    INSERT INTO assessments (org_id, indicator_id, bayesian_score, confidence, assessor, assessment_date, raw_data, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
    ON CONFLICT (org_id, indicator_id) DO UPDATE SET
      bayesian_score = EXCLUDED.bayesian_score, confidence = EXCLUDED.confidence, assessor = EXCLUDED.assessor,
      assessment_date = EXCLUDED.assessment_date, raw_data = EXCLUDED.raw_data, updated_at = CURRENT_TIMESTAMP;
  `;
  await pool.query(query, [orgId, indicatorId, bayesian_score, confidence, assessor, assessment_date, raw_data]);
  return { success: true };
}

async function getAssessment(orgId, indicatorId) {
    await initialize();
    const { rows } = await pool.query('SELECT * FROM assessments WHERE org_id = $1 AND indicator_id = $2', [orgId, indicatorId]);
    return rows[0];
}

async function deleteAssessment(orgId, indicatorId) {
    await initialize();
    await pool.query('DELETE FROM assessments WHERE org_id = $1 AND indicator_id = $2', [orgId, indicatorId]);
    return { success: true };
}

async function saveIndicatorMetadata(orgId, indicatorId, data) {
  await initialize();
  const { category, title, language, full_data, snapshot_date } = data;
  const query = `
    INSERT INTO indicators_metadata (org_id, indicator_id, category, title, language, full_data, snapshot_date)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (org_id, indicator_id) DO UPDATE SET
      category = EXCLUDED.category, title = EXCLUDED.title, language = EXCLUDED.language,
      full_data = EXCLUDED.full_data, snapshot_date = EXCLUDED.snapshot_date;
  `;
  await pool.query(query, [orgId, indicatorId, category, title, language, full_data, snapshot_date]);
  return { success: true };
}

module.exports = {
  initialize,
  readOrganizationsIndex,
  createOrganization,
  readOrganization,
  updateOrganization,
  deleteOrganization,
  writeOrganization: updateOrganization, // Alias
  saveAssessment,
  getAssessment,
  deleteAssessment,
  saveIndicatorMetadata,
  saveSocIndicator: saveIndicatorMetadata, // Alias
  // Funzioni non più necessarie in un'implementazione DB
  writeOrganizationsIndex: async () => {},
  updateOrganizationInIndex: async () => {},
  removeOrganizationFromIndex: async () => {},
};
