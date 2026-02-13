
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

// =============================================================================
// In-memory cache for organizations index (invalidated on writes)
// =============================================================================
let orgIndexCache = null;
let orgIndexCacheTime = 0;
const ORG_INDEX_CACHE_TTL = 60 * 1000; // 60 seconds

function invalidateOrgIndexCache() {
  orgIndexCache = null;
  orgIndexCacheTime = 0;
}

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

    // Create soc_indicators table (separate from assessments/auditing)
    await client.query(`CREATE TABLE IF NOT EXISTS soc_indicators (
      id SERIAL PRIMARY KEY,
      org_id VARCHAR(50) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      indicator_id VARCHAR(10) NOT NULL,
      value DECIMAL(5, 4),
      previous_value DECIMAL(5, 4),
      event_count INT DEFAULT 0,
      last_event_type VARCHAR(100),
      last_event_severity VARCHAR(20),
      source VARCHAR(50) DEFAULT 'simulator',
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
    await client.query(`ALTER TABLE organizations ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;`);
    await client.query(`ALTER TABLE organizations ADD COLUMN IF NOT EXISTS deleted_by VARCHAR(255);`);
    console.log('[DB-PG] Colonne della tabella `organizations` aggiornate.');

    // Aggiunta delle nuove colonne alla tabella 'assessments' in modo idempotente
    console.log('[DB-PG] Verifica e aggiunta delle colonne mancanti a `assessments`...');
    await client.query(`ALTER TABLE assessments ADD COLUMN IF NOT EXISTS title TEXT;`);
    await client.query(`ALTER TABLE assessments ADD COLUMN IF NOT EXISTS category VARCHAR(100);`);
    await client.query(`ALTER TABLE assessments ADD COLUMN IF NOT EXISTS maturity_level VARCHAR(20);`);
    console.log('[DB-PG] Colonne della tabella `assessments` aggiornate.');

    // Create indexes for frequently queried columns
    await client.query(`CREATE INDEX IF NOT EXISTS idx_assessments_org_id ON assessments(org_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_soc_indicators_org_id ON soc_indicators(org_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_organizations_is_deleted ON organizations(is_deleted);`);
    console.log('[DB-PG] Indici creati/verificati.');

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
    invalidateOrgIndexCache();
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

  // Return cached result if still valid
  if (orgIndexCache && (Date.now() - orgIndexCacheTime) < ORG_INDEX_CACHE_TTL) {
    return orgIndexCache;
  }

  try {
    // Single query with JOIN instead of N+1 pattern
    // Selects only needed columns (NO raw_data which is the heaviest column)
    const { rows } = await pool.query(`
      SELECT
        o.id, o.name, o.industry, o.size, o.country, o.language,
        o.sede_sociale, o.partita_iva, o.created_at, o.updated_at,
        o.deleted_at, o.deleted_by,
        a.indicator_id, a.bayesian_score, a.confidence, a.maturity_level,
        a.category, a.assessment_date
      FROM organizations o
      LEFT JOIN assessments a ON a.org_id = o.id
      ORDER BY o.name ASC, a.indicator_id ASC
    `);

    // Group rows by organization
    const orgMap = new Map();
    for (const row of rows) {
      if (!orgMap.has(row.id)) {
        orgMap.set(row.id, {
          id: row.id,
          name: row.name,
          industry: row.industry,
          size: row.size,
          country: row.country,
          language: row.language,
          sede_sociale: row.sede_sociale || '',
          partita_iva: row.partita_iva || '',
          created_at: row.created_at,
          updated_at: row.updated_at,
          deleted_at: row.deleted_at || undefined,
          deleted_by: row.deleted_by || undefined,
          assessmentRows: [],
          assessments: {}
        });
      }
      if (row.indicator_id) {
        const org = orgMap.get(row.id);
        org.assessmentRows.push(row);
        org.assessments[row.indicator_id] = {
          indicator_id: row.indicator_id,
          bayesian_score: row.bayesian_score ? parseFloat(row.bayesian_score) : null,
          confidence: row.confidence ? parseFloat(row.confidence) : null,
          maturity_level: row.maturity_level,
          category: row.category,
          assessment_date: row.assessment_date
        };
      }
    }

    const organizations = [];
    for (const [, org] of orgMap) {
      const aggregates = calculateAggregates(org.assessments, org.industry);
      organizations.push({
        id: org.id,
        name: org.name,
        industry: org.industry,
        size: org.size,
        country: org.country,
        language: org.language,
        sede_sociale: org.sede_sociale,
        partita_iva: org.partita_iva,
        created_at: org.created_at,
        updated_at: org.updated_at,
        deleted_at: org.deleted_at,
        deleted_by: org.deleted_by,
        stats: {
          total_assessments: aggregates.completion.assessed_indicators,
          completion_percentage: aggregates.completion.percentage,
          overall_risk: aggregates.overall_risk,
          avg_confidence: aggregates.overall_confidence,
          last_assessment_date: org.assessmentRows.length > 0
            ? org.assessmentRows.sort((a, b) => new Date(b.assessment_date) - new Date(a.assessment_date))[0]?.assessment_date
            : null
        }
      });
    }

    const result = {
      metadata: {
        version: '2.0',
        last_updated: new Date().toISOString(),
        total_organizations: organizations.length
      },
      organizations
    };

    // Cache the result
    orgIndexCache = result;
    orgIndexCacheTime = Date.now();

    return result;
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
    // Select specific columns (exclude heavy aggregates JSONB from org, keep raw_data for assessment detail)
    const orgRes = await pool.query(
      'SELECT id, name, industry, size, country, language, created_by, notes, sede_sociale, partita_iva, aggregates, created_at, updated_at, deleted_at, deleted_by FROM organizations WHERE id = $1',
      [orgId]
    );
    const orgRow = orgRes.rows[0];
    if (!orgRow) return null;

    const assessRes = await pool.query(
      'SELECT indicator_id, title, category, maturity_level, bayesian_score, confidence, assessor, assessment_date, raw_data FROM assessments WHERE org_id = $1',
      [orgId]
    );
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
        deleted_at: orgRow.deleted_at || undefined,
        deleted_by: orgRow.deleted_by || undefined
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

async function organizationExists(orgId) {
  await initialize();
  try {
    const result = await pool.query('SELECT id FROM organizations WHERE id = $1 AND is_deleted = false', [orgId]);
    return result.rows.length > 0;
  } catch (error) {
    console.error(`[DB-PG] Error checking if organization exists ${orgId}:`, error);
    return false;
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
    sede_sociale: fullOrgData.metadata.sede_sociale || '',
    partita_iva: fullOrgData.metadata.partita_iva || '',
    created_by: fullOrgData.metadata.created_by || '',
    created_at: fullOrgData.metadata.created_at || new Date().toISOString(),
    deleted_at: fullOrgData.metadata.deleted_at || null,
    deleted_by: fullOrgData.metadata.deleted_by || null
  };

  // Serialize aggregates to JSON string if present
  const aggregatesJson = fullOrgData.aggregates ? JSON.stringify(fullOrgData.aggregates) : null;

  // is_deleted flag is true if deleted_at is present
  const isDeleted = !!data.deleted_at;

  // UPSERT: Insert if not exists, update if exists
  const query = `
    INSERT INTO organizations (id, name, industry, size, country, language, notes, created_by, partita_iva, sede_sociale, aggregates, deleted_at, deleted_by, is_deleted, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, CURRENT_TIMESTAMP)
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      industry = EXCLUDED.industry,
      size = EXCLUDED.size,
      country = EXCLUDED.country,
      language = EXCLUDED.language,
      notes = EXCLUDED.notes,
      created_by = EXCLUDED.created_by,
      partita_iva = EXCLUDED.partita_iva,
      sede_sociale = EXCLUDED.sede_sociale,
      aggregates = EXCLUDED.aggregates,
      deleted_at = EXCLUDED.deleted_at,
      deleted_by = EXCLUDED.deleted_by,
      is_deleted = EXCLUDED.is_deleted,
      updated_at = CURRENT_TIMESTAMP;
  `;

  try {
    await pool.query(query, [orgId, data.name, data.industry, data.size, data.country, data.language,
                              data.notes, data.created_by, data.partita_iva, data.sede_sociale, aggregatesJson,
                              data.deleted_at, data.deleted_by, isDeleted, data.created_at]);
    invalidateOrgIndexCache();
    console.log(`[DB-PG] Successfully written organization ${orgId} (UPSERT).`);
    return fullOrgData;
  } catch (error) {
    console.error(`[DB-PG] Error writing organization ${orgId}:`, error);
    throw error;
  }
}

async function updateOrganization(orgId, data) {
  await initialize();

  // Build dynamic UPDATE query with only provided fields
  const fields = [];
  const values = [];
  let paramIndex = 1;

  if (data.name !== undefined) {
    fields.push(`name = $${paramIndex++}`);
    values.push(data.name);
  }
  if (data.industry !== undefined) {
    fields.push(`industry = $${paramIndex++}`);
    values.push(data.industry);
  }
  if (data.size !== undefined) {
    fields.push(`size = $${paramIndex++}`);
    values.push(data.size);
  }
  if (data.country !== undefined) {
    fields.push(`country = $${paramIndex++}`);
    values.push(data.country);
  }
  if (data.language !== undefined) {
    fields.push(`language = $${paramIndex++}`);
    values.push(data.language);
  }
  if (data.notes !== undefined) {
    fields.push(`notes = $${paramIndex++}`);
    values.push(data.notes);
  }
  if (data.sede_sociale !== undefined) {
    fields.push(`sede_sociale = $${paramIndex++}`);
    values.push(data.sede_sociale);
  }
  if (data.partita_iva !== undefined) {
    fields.push(`partita_iva = $${paramIndex++}`);
    values.push(data.partita_iva);
  }

  // Always update updated_at
  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(orgId); // Last parameter for WHERE clause

  const query = `UPDATE organizations SET ${fields.join(', ')} WHERE id = $${paramIndex};`;

  try {
    await pool.query(query, values);
    invalidateOrgIndexCache();
    console.log(`[DB-PG] Successfully updated organization ${orgId}.`);
    return await readOrganization(orgId);
  } catch (error) {
    console.error(`[DB-PG] Error updating organization ${orgId}:`, error);
    throw error;
  }
}

async function deleteOrganization(orgId) {
  await initialize();
  try {
    await pool.query('UPDATE organizations SET is_deleted = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1;', [orgId]);
    invalidateOrgIndexCache();
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
    invalidateOrgIndexCache();
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

/**
 * Get SOC indicator data for an organization
 * Returns SOC indicators (NOT assessments/auditing data)
 */
async function getSocData(orgId) {
    await initialize();
    try {
        // Don't filter by is_deleted - caller already validates org existence
        const orgRes = await pool.query('SELECT id, name FROM organizations WHERE id = $1', [orgId]);
        const orgRow = orgRes.rows[0];

        if (!orgRow) {
            return null;
        }

        // Read from soc_indicators table (NOT assessments table)
        const socRes = await pool.query('SELECT indicator_id, value, previous_value, event_count, last_event_type, last_event_severity, updated_at FROM soc_indicators WHERE org_id = $1 ORDER BY indicator_id', [orgId]);
        // Return empty indicators object if no data (not null - allows dashboard to render)
        const indicators = {};
        for (const row of socRes.rows) {
            indicators[row.indicator_id] = {
                indicator_id: row.indicator_id,
                value: parseFloat(row.value),
                previous_value: row.previous_value ? parseFloat(row.previous_value) : null,
                event_count: row.event_count,
                last_event_type: row.last_event_type,
                last_event_severity: row.last_event_severity,
                last_updated: row.updated_at
            };
        }

        return {
            org_id: orgRow.id,
            org_name: orgRow.name,
            indicators,
            has_data: socRes.rows.length > 0
        };
    } catch (error) {
        console.error(`[DB-PG] Error reading SOC data for ${orgId}:`, error);
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

    const lastEventType = assessmentData.event_type || assessmentData.raw_data?.event_type || null;
    const lastEventSeverity = assessmentData.severity || assessmentData.raw_data?.severity || null;
    const source = assessmentData.source || 'simulator';

    // Single UPSERT query with RETURNING to get previous value (avoids 2 round-trips)
    const query = `
        INSERT INTO soc_indicators (org_id, indicator_id, value, previous_value, event_count, last_event_type, last_event_severity, source, updated_at)
        VALUES ($1, $2, $3, NULL, 1, $4, $5, $6, CURRENT_TIMESTAMP)
        ON CONFLICT (org_id, indicator_id) DO UPDATE SET
            previous_value = soc_indicators.value,
            value = EXCLUDED.value,
            event_count = soc_indicators.event_count + 1,
            last_event_type = EXCLUDED.last_event_type,
            last_event_severity = EXCLUDED.last_event_severity,
            source = EXCLUDED.source,
            updated_at = CURRENT_TIMESTAMP
        RETURNING previous_value, event_count;
    `;

    const result = await pool.query(query, [orgId, indicatorId, value, lastEventType, lastEventSeverity, source]);
    const previousValue = result.rows[0]?.previous_value ? parseFloat(result.rows[0].previous_value) : null;
    const eventCount = result.rows[0]?.event_count || 1;

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
  readOrganizationsIndex,
  readOrganization,
  organizationExists,
  updateOrganization,
  writeOrganization,
  deleteOrganization,
  saveAssessment,
  getAssessment,
  deleteAssessment,
  getSocData,
  saveSocIndicator,
  invalidateOrgIndexCache,
  // Funzioni alias o non più necessarie mantenute per retrocompatibilità
  saveIndicatorMetadata: async () => { console.warn('[DB-PG] saveIndicatorMetadata non è implementata in modo granulare, i dati vengono salvati con l\'intera organizzazione.'); },
  writeOrganizationsIndex: async () => {},
  updateOrganizationInIndex: async () => {},
  removeOrganizationFromIndex: async (orgId) => {
    await initialize();
    try {
      const result = await pool.query('DELETE FROM organizations WHERE id = $1', [orgId]);
      console.log(`[DB-PG] Permanently deleted organization ${orgId} from database (${result.rowCount} rows affected)`);
      return { success: true, deletedCount: result.rowCount };
    } catch (error) {
      console.error(`[DB-PG] Error permanently deleting organization ${orgId}:`, error);
      throw error;
    }
  },
};
