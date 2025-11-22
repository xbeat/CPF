/**
 * Questo file contiene lo schema SQL per il database del CPF Dashboard.
 * È progettato per essere compatibile sia con PostgreSQL che con SQLite, con minime differenze.
 * Quando si apportano modifiche, assicurarsi che siano compatibili con entrambi i sistemi.
 */

-- ============================================================================
-- Table: organizations
-- Stores all monitored organizations
-- ============================================================================
CREATE TABLE IF NOT EXISTS organizations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    size VARCHAR(50) CHECK (size IN ('small', 'medium', 'enterprise')),
    country VARCHAR(2),
    language VARCHAR(10),
    created_by VARCHAR(255),
    notes TEXT,
    sede_sociale TEXT,
    partita_iva VARCHAR(50),
    is_deleted BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- Table: assessments
-- Stores indicator assessments for each organization
-- ============================================================================
CREATE TABLE IF NOT EXISTS assessments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    org_id VARCHAR(50) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    indicator_id VARCHAR(10) NOT NULL,
    title TEXT,
    category VARCHAR(100),
    maturity_level VARCHAR(20),
    bayesian_score DECIMAL(5,4) CHECK (bayesian_score >= 0 AND bayesian_score <= 1),
    confidence DECIMAL(5,4) CHECK (confidence >= 0 AND confidence <= 1),
    assessor VARCHAR(255),
    assessment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    raw_data TEXT, -- JSON stored as TEXT in SQLite
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    -- Ensure one assessment per org+indicator combination
    UNIQUE(org_id, indicator_id)
);

-- ============================================================================
-- Table: indicators_metadata
-- Snapshot of indicator definitions when an organization was created.
-- ============================================================================
CREATE TABLE IF NOT EXISTS indicators_metadata (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    org_id VARCHAR(50) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    indicator_id VARCHAR(10) NOT NULL,
    category VARCHAR(100),
    title TEXT,
    language VARCHAR(5) DEFAULT 'en-US',
    full_data TEXT, -- JSON stored as TEXT in SQLite
    snapshot_date DATETIME DEFAULT CURRENT_TIMESTAMP,

    -- One snapshot per org+indicator+language
    UNIQUE(org_id, indicator_id, language)
);

-- ============================================================================
-- Indici per migliorare le performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_organizations_name ON organizations(name);
CREATE INDEX IF NOT EXISTS idx_assessments_org_id ON assessments(org_id);
CREATE INDEX IF NOT EXISTS idx_assessments_indicator_id ON assessments(indicator_id);
CREATE INDEX IF NOT EXISTS idx_indicators_metadata_org_id ON indicators_metadata(org_id);

-- ============================================================================
-- Trigger per aggiornare il campo `updated_at` in `organizations` (SOLO SQLite)
-- ============================================================================

CREATE TRIGGER IF NOT EXISTS update_organizations_updated_at
    AFTER UPDATE ON organizations
    FOR EACH ROW
BEGIN
    UPDATE organizations SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
