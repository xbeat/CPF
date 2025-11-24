
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
 * Inizializza il database creando le tabelle se non esistono e aggiungendo le colonne necessarie.
 * Questa funzione viene eseguita una sola volta all'avvio dell'applicazione.
 */
async function initialize() {
  if (isInitialized) {
    return;
  }

  console.log('[DB-PG] Inizializzazione del database PostgreSQL...');
  const client = await pool.connect();

  try {
    // Creazione delle tabelle base se non esistono
    await client.query(`CREATE TABLE IF NOT EXISTS organizations (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      industry VARCHAR(100),
      size VARCHAR(50),
      country VARCHAR(2),
      language VARCHAR(10),
      created_by VARCHAR(255),
      notes TEXT,
      sede_sociale TEXT,
      partita_iva VARCHAR(50),
      is_deleted BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );`);

    await client.query(`CREATE TABLE IF NOT EXISTS assessments (
      id SERIAL PRIMARY KEY,
      org_id VARCHAR(50) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      indicator_id VARCHAR(10) NOT NULL,
      title TEXT,
      category VARCHAR(100),
      maturity_level VARCHAR(20),
      bayesian_score DECIMAL(5, 4),
      confidence DECIMAL(5, 4),
      assessor VARCHAR(255),
      assessment_date TIMESTAMPTZ,
      raw_data JSONB,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(org_id, indicator_id)
    );`);

    console.log('[DB-PG] Tabelle base assicurate.');

    // Aggiunta delle nuove colonne alla tabella 'organizations' in modo idempotente
    console.log('[DB-PG] Verifica e aggiunta delle colonne mancanti a `organizations`...');
    await client.query(`ALTER TABLE organizations ADD COLUMN IF NOT EXISTS language VARCHAR(10);`);
    await client.query(`ALTER TABLE organizations ADD COLUMN IF NOT EXISTS created_by VARCHAR(255);`);
    await client.query(`ALTER TABLE organizations ADD COLUMN IF NOT EXISTS notes TEXT;`);
    await client.query(`ALTER TABLE organizations ADD COLUMN IF NOT EXISTS sede_sociale TEXT;`);
    await client.query(`ALTER TABLE organizations ADD COLUMN IF NOT EXISTS partita_iva VARCHAR(50);`);
    await client.query(`ALTER TABLE organizations ADD COLUMN IF NOT EXISTS aggregates JSONB;`);
    console.log('[DB-PG] Colonne della tabella `organizations` aggiornate.');

    // Aggiunta delle nuove colonne alla tabella 'assessments' in modo idempotente
    console.log('[DB-PG] Verifica e aggiunta delle colonne mancanti a `assessments`...');
    await client.query(`ALTER TABLE assessments ADD COLUMN IF NOT EXISTS title TEXT;`);
    await client.query(`ALTER TABLE assessments ADD COLUMN IF NOT EXISTS category VARCHAR(100);`);
    await client.query(`ALTER TABLE assessments ADD COLUMN IF NOT EXISTS maturity_level VARCHAR(20);`);
    console.log('[DB-PG] Colonne della tabella `assessments` aggiornate.');

    isInitialized = true;
  } catch (error) {
    console.error('[DB-PG] Errore durante l\'inizializzazione del database:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Sovrascrive completamente la funzione createOrganization per gestire l'intero oggetto orgData,
 * comprese le valutazioni, in un'unica transazione.
 * Questo rende lo script di seeding robusto e idempotente.
 */
async function createOrganization(orgData) {
  await initialize();

  const { id: orgId, name, metadata, assessments, aggregates } = orgData;
  const { industry, size, country, language, created_by, notes, sede_sociale, partita_iva, created_at, updated_at } = metadata;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Inserisce o aggiorna l'organizzazione
    const orgQuery = `
      INSERT INTO organizations (id, name, industry, size, country, language, created_by, notes, sede_sociale, partita_iva, aggregates, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        industry = EXCLUDED.industry,
        size = EXCLUDED.size,
        country = EXCLUDED.country,
        language = EXCLUDED.language,
        created_by = EXCLUDED.created_by,
        notes = EXCLUDED.notes,
        sede_sociale = EXCLUDED.sede_sociale,
        partita_iva = EXCLUDED.partita_iva,
        aggregates = EXCLUDED.aggregates,
        updated_at = CURRENT_TIMESTAMP;
    `;
    await client.query(orgQuery, [orgId, name, industry, size, country, language, created_by, notes, sede_sociale, partita_iva, aggregates, created_at, updated_at]);

    // 2. Inserisce o aggiorna tutte le valutazioni associate
    if (assessments) {
      for (const indicatorId in assessments) {
        const assessment = assessments[indicatorId];
        const assessmentQuery = `
          INSERT INTO assessments (org_id, indicator_id, title, category, maturity_level, bayesian_score, confidence, assessor, assessment_date, raw_data, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)
          ON CONFLICT (org_id, indicator_id) DO UPDATE SET
            title = EXCLUDED.title,
            category = EXCLUDED.category,
            maturity_level = EXCLUDED.maturity_level,
            bayesian_score = EXCLUDED.bayesian_score,
            confidence = EXCLUDED.confidence,
            assessor = EXCLUDED.assessor,
            assessment_date = EXCLUDED.assessment_date,
            raw_data = EXCLUDED.raw_data,
            updated_at = CURRENT_TIMESTAMP;
        `;
        await client.query(assessmentQuery, [
          orgId,
          indicatorId,
          assessment.title,
          assessment.category,
          assessment.maturity_level,
          assessment.bayesian_score,
          assessment.confidence,
          assessment.assessor,
          assessment.assessment_date,
          assessment.raw_data
        ]);
      }
    }

    await client.query('COMMIT');
    console.log(`[DB-PG] Organization ${orgId} saved successfully.`);
    return orgData;

  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`[DB-PG] Error saving organization ${orgId}. Transaction rolled back.`, error);
    throw error;
  } finally {
    client.release();
  }
}


// --- Funzioni Esistenti (mantenute per compatibilità dove necessario) ---

// Import calculateAggregates for computing aggregates from assessments
const { calculateAggregates } = require('./db_json');

async function readOrganizationsIndex() {
  await initialize();
  try {
    const { rows } = await pool.query('SELECT * FROM organizations WHERE is_deleted = false ORDER BY name ASC');
    const organizations = [];

    for (const row of rows) {
      // Get assessments for this organization to calculate stats
      const assessRes = await pool.query('SELECT * FROM assessments WHERE org_id = $1', [row.id]);
      const assessmentRows = assessRes.rows;

      // Convert assessments to object format
      const assessments = assessmentRows.reduce((acc, a) => {
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
    console.error('[DB-PG] Error reading organizations index:', error);
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

async function readOrganization(orgId) {
  await initialize();
  try {
    const orgRes = await pool.query('SELECT * FROM organizations WHERE id = $1 AND is_deleted = false', [orgId]);
    const orgRow = orgRes.rows[0];

    if (!orgRow) return null;

    const assessRes = await pool.query('SELECT * FROM assessments WHERE org_id = $1', [orgId]);

    // Convert decimal fields from string to number for consistency
    const assessments = assessRes.rows.reduce((acc, a) => {
      if (a.bayesian_score) {
        a.bayesian_score = parseFloat(a.bayesian_score);
      }
      if (a.confidence) {
        a.confidence = parseFloat(a.confidence);
      }
      acc[a.indicator_id] = a;
      return acc;
    }, {});

    // Calculate aggregates from assessments if not already stored
    let aggregates = orgRow.aggregates;
    if (!aggregates || Object.keys(aggregates).length === 0) {
      aggregates = calculateAggregates(assessments, orgRow.industry);
    }

    // Return organization with proper structure
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
      aggregates: aggregates
    };

    console.log(`[DB-PG] Successfully read organization ${orgId}.`);
    return result;
  } catch (error) {
    console.error(`[DB-PG] Error reading organization ${orgId}:`, error);
    throw error;
  }
}

async function updateOrganization(orgId, data) {
  await initialize();
  const { name, industry, size, country, language, notes, sede_sociale, partita_iva } = data;
  const query = `UPDATE organizations SET
    name = $1, industry = $2, size = $3, country = $4, language = $5, notes = $6, sede_sociale = $7, partita_iva = $8, updated_at = CURRENT_TIMESTAMP
    WHERE id = $9;`;
  try {
    await pool.query(query, [name, industry, size, country, language, notes, sede_sociale, partita_iva, orgId]);
    console.log(`[DB-PG] Successfully updated organization ${orgId}.`);
    return { id: orgId, ...data };
  } catch (error) {
    console.error(`[DB-PG] Error updating organization ${orgId}:`, error);
    throw error;
  }
}

async function deleteOrganization(orgId) {
  await initialize();
  try {
    await pool.query('UPDATE organizations SET is_deleted = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1;', [orgId]);
    console.log(`[DB-PG] Successfully marked organization ${orgId} as deleted.`);
    return { success: true };
  } catch (error) {
    console.error(`[DB-PG] Error deleting organization ${orgId}:`, error);
    throw error;
  }
}

async function saveAssessment(orgId, indicatorId, data) {
  await initialize();
  const { title, category, maturity_level, bayesian_score, confidence, assessor, assessment_date, raw_data } = data;
  const query = `
    INSERT INTO assessments (org_id, indicator_id, title, category, maturity_level, bayesian_score, confidence, assessor, assessment_date, raw_data, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)
    ON CONFLICT (org_id, indicator_id) DO UPDATE SET
      title = EXCLUDED.title, category = EXCLUDED.category, maturity_level = EXCLUDED.maturity_level,
      bayesian_score = EXCLUDED.bayesian_score, confidence = EXCLUDED.confidence, assessor = EXCLUDED.assessor,
      assessment_date = EXCLUDED.assessment_date, raw_data = EXCLUDED.raw_data, updated_at = CURRENT_TIMESTAMP;
  `;
  try {
    await pool.query(query, [orgId, indicatorId, title, category, maturity_level, bayesian_score, confidence, assessor, assessment_date, raw_data]);
    console.log(`[DB-PG] Successfully saved assessment for organization ${orgId}, indicator ${indicatorId}.`);
    return { success: true };
  } catch (error) {
    console.error(`[DB-PG] Error saving assessment for organization ${orgId}, indicator ${indicatorId}:`, error);
    throw error;
  }
}

async function getAssessment(orgId, indicatorId) {
    await initialize();
    try {
        const { rows } = await pool.query('SELECT * FROM assessments WHERE org_id = $1 AND indicator_id = $2', [orgId, indicatorId]);
        if (rows.length > 0) {
            const assessment = rows[0];
            if (assessment.bayesian_score) {
                assessment.bayesian_score = parseFloat(assessment.bayesian_score);
            }
            if (assessment.confidence) {
                assessment.confidence = parseFloat(assessment.confidence);
            }
            return assessment;
        }
        return undefined;
    } catch (error) {
        console.error(`[DB-PG] Error getting assessment for organization ${orgId}, indicator ${indicatorId}:`, error);
        throw error;
    }
}

async function deleteAssessment(orgId, indicatorId) {
    await initialize();
    try {
        await pool.query('DELETE FROM assessments WHERE org_id = $1 AND indicator_id = $2', [orgId, indicatorId]);
        console.log(`[DB-PG] Successfully deleted assessment for organization ${orgId}, indicator ${indicatorId}.`);
        return { success: true };
    } catch (error) {
        console.error(`[DB-PG] Error deleting assessment for organization ${orgId}, indicator ${indicatorId}:`, error);
        throw error;
    }
}


module.exports = {
  initialize,
  createOrganization,
  readOrganizationsIndex,
  readOrganization,
  updateOrganization,
  deleteOrganization,
  saveAssessment,
  getAssessment,
  deleteAssessment,
  // Funzioni alias o non più necessarie mantenute per retrocompatibilità
  writeOrganization: updateOrganization, 
  saveIndicatorMetadata: async () => { console.warn('[DB-PG] saveIndicatorMetadata non è implementata in modo granulare, i dati vengono salvati con l\'intera organizzazione.'); },
  saveSocIndicator: async () => { console.warn('[DB-PG] saveSocIndicator non è implementata.'); },
  writeOrganizationsIndex: async () => {},
  updateOrganizationInIndex: async () => {},
  removeOrganizationFromIndex: async () => {},
};
