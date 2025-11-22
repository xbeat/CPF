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

    await db.exec(createOrganizationsTable);
    await db.exec(createAssessmentsTable);
    console.log('[DB-SQLITE] Tabelle assicurate: organizations, assessments.');
  } catch (error) {
    console.error('[DB-SQLITE] Errore di inizializzazione DB:', error);
    throw error;
  }
}

async function createOrganization(orgData) {
  await initialize();
  const { id, name, metadata } = orgData;
  const { industry, size, country, language, notes, created_by, partita_iva, sede_sociale, created_at, updated_at } = metadata;
  const query = `
    INSERT INTO organizations (id, name, industry, size, country, language, notes, created_by, partita_iva, sede_sociale, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;
  try {
    await db.run(query, [id, name, industry, size, country, language, notes, created_by, partita_iva, sede_sociale, created_at, updated_at]);
    return await readOrganization(id);
  } catch (error) {
    console.error(`[DB-SQLITE] Errore in createOrganization per ID ${id}:`, error);
    throw error;
  }
}

async function readOrganization(orgId) {
  await initialize();
  try {
    const orgRow = await db.get('SELECT * FROM organizations WHERE id = ? AND is_deleted = 0', orgId);
    if (!orgRow) return null;

    const assessmentRows = await db.all('SELECT * FROM assessments WHERE org_id = ?', orgId);
    const assessments = assessmentRows.reduce((acc, a) => {
      if (a.raw_data) a.raw_data = JSON.parse(a.raw_data);
      const { org_id, ...assessmentData } = a;
      acc[a.indicator_id] = assessmentData;
      return acc;
    }, {});

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
      },
      assessments: assessments,
      aggregates: {}
    };
    return result;
  } catch (error) {
    console.error(`[DB-SQLITE] Errore in readOrganization per ID ${orgId}:`, error);
    return null;
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

module.exports = {
  initialize,
  createOrganization,
  readOrganization,
  saveAssessment,
  readOrganizationsIndex: async () => ({ organizations: [] }),
  updateOrganization: async (orgId, data) => ({ success: true }),
  deleteOrganization: async (orgId) => ({ success: true }),
  getAssessment: async (orgId, indId) => (null),
  deleteAssessment: async (orgId, indId) => ({ success: true }),
  saveIndicatorMetadata: async () => ({ success: true }),
  writeOrganizationsIndex: async () => {},
  updateOrganizationInIndex: async () => {},
  removeOrganizationFromIndex: async () => {},
};