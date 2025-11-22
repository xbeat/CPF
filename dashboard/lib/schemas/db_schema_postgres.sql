/**
 * Questo file contiene lo schema SQL per il database del CPF Dashboard.
 * Versione per PostgreSQL - CORRETTA E COMPLETA
 */

-- ============================================================================
-- Table: organizations
-- Stores all monitored organizations
-- ============================================================================
DROP TABLE IF EXISTS organizations CASCADE;
CREATE TABLE organizations (
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- Table: assessments
-- Stores indicator assessments (schede) for each organization
-- ============================================================================
DROP TABLE IF EXISTS assessments CASCADE;
CREATE TABLE assessments (
    id SERIAL PRIMARY KEY,
    org_id VARCHAR(50) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    indicator_id VARCHAR(10) NOT NULL,
    title TEXT,
    category VARCHAR(100),
    maturity_level VARCHAR(20),
    bayesian_score DECIMAL(5,4) CHECK (bayesian_score >= 0 AND bayesian_score <= 1),
    confidence DECIMAL(5,4) CHECK (confidence >= 0 AND confidence <= 1),
    assessor VARCHAR(255),
    assessment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    raw_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Ensure one assessment per org+indicator combination
    UNIQUE(org_id, indicator_id)
);

-- ============================================================================
-- Table: indicators_metadata (simplified)
-- Snapshot of indicator definitions.
-- ============================================================================
DROP TABLE IF EXISTS indicators_metadata CASCADE;
CREATE TABLE indicators_metadata (
    indicator_id VARCHAR(10) PRIMARY KEY,
    category VARCHAR(100),
    title TEXT,
    language VARCHAR(10) DEFAULT 'en-US',
    full_data JSONB,
    snapshot_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(indicator_id, language)
);

-- ============================================================================
-- Indici per migliorare le performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_organizations_name ON organizations(name);
CREATE INDEX IF NOT EXISTS idx_assessments_org_id ON assessments(org_id);
CREATE INDEX IF NOT EXISTS idx_assessments_indicator_id ON assessments(indicator_id);

-- ============================================================================
-- Trigger per aggiornare il campo `updated_at` in `organizations`
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
CREATE TRIGGER update_organizations_updated_at
BEFORE UPDATE ON organizations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
