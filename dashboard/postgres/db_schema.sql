-- ============================================================================
-- CPF Database Schema
-- Cyber Psychology Framework - PostgreSQL Schema
-- Version: 1.0
-- Date: 2025-01-11
-- ============================================================================

-- Drop existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS indicators_metadata CASCADE;
DROP TABLE IF EXISTS assessments CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- ============================================================================
-- Table: organizations
-- Stores all monitored organizations
-- ============================================================================
CREATE TABLE organizations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    size VARCHAR(50) CHECK (size IN ('small', 'medium', 'enterprise')),
    country VARCHAR(2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups by name and industry
CREATE INDEX idx_organizations_name ON organizations(name);
CREATE INDEX idx_organizations_industry ON organizations(industry);
CREATE INDEX idx_organizations_created ON organizations(created_at DESC);

-- Comments
COMMENT ON TABLE organizations IS 'Organizations monitored by CPF system';
COMMENT ON COLUMN organizations.id IS 'Unique organization ID (e.g., org-001, org-demo)';
COMMENT ON COLUMN organizations.name IS 'Organization display name';
COMMENT ON COLUMN organizations.industry IS 'Industry sector (Technology, Finance, Healthcare, etc.)';
COMMENT ON COLUMN organizations.size IS 'Organization size: small (<50), medium (50-500), enterprise (>500)';
COMMENT ON COLUMN organizations.country IS 'ISO 3166-1 alpha-2 country code';

-- ============================================================================
-- Table: assessments
-- Stores indicator assessments for each organization
-- ============================================================================
CREATE TABLE assessments (
    id SERIAL PRIMARY KEY,
    org_id VARCHAR(50) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    indicator_id VARCHAR(10) NOT NULL,
    bayesian_score DECIMAL(5,4) CHECK (bayesian_score >= 0 AND bayesian_score <= 1),
    confidence DECIMAL(5,4) CHECK (confidence >= 0 AND confidence <= 1),
    assessor VARCHAR(255),
    assessment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    raw_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Ensure one assessment per org+indicator combination
    UNIQUE(org_id, indicator_id)
);

-- Indexes for faster queries
CREATE INDEX idx_assessments_org_id ON assessments(org_id);
CREATE INDEX idx_assessments_indicator_id ON assessments(indicator_id);
CREATE INDEX idx_assessments_score ON assessments(bayesian_score DESC);
CREATE INDEX idx_assessments_date ON assessments(assessment_date DESC);
CREATE INDEX idx_assessments_raw_data ON assessments USING GIN(raw_data);

-- Comments
COMMENT ON TABLE assessments IS 'Indicator assessments for organizations';
COMMENT ON COLUMN assessments.id IS 'Auto-incrementing primary key';
COMMENT ON COLUMN assessments.org_id IS 'Foreign key to organizations table';
COMMENT ON COLUMN assessments.indicator_id IS 'Indicator ID (1.1 to 10.10, total 100 indicators)';
COMMENT ON COLUMN assessments.bayesian_score IS 'Bayesian computed score (0.0000 = low risk, 1.0000 = high risk)';
COMMENT ON COLUMN assessments.confidence IS 'Confidence level of assessment (0.0000 = low, 1.0000 = high)';
COMMENT ON COLUMN assessments.assessor IS 'Name or ID of person who performed assessment';
COMMENT ON COLUMN assessments.assessment_date IS 'When the assessment was performed';
COMMENT ON COLUMN assessments.raw_data IS 'Complete assessment form data (Quick Assessment + Conversation)';

-- ============================================================================
-- Table: indicators_metadata
-- Snapshot of indicator definitions when organization was created
-- This allows tracking changes to indicators over time
-- ============================================================================
CREATE TABLE indicators_metadata (
    id SERIAL PRIMARY KEY,
    org_id VARCHAR(50) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    indicator_id VARCHAR(10) NOT NULL,
    category VARCHAR(100),
    title TEXT,
    language VARCHAR(5) DEFAULT 'en-US',
    full_data JSONB,
    snapshot_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- One snapshot per org+indicator+language
    UNIQUE(org_id, indicator_id, language)
);

-- Indexes
CREATE INDEX idx_indicators_metadata_org_id ON indicators_metadata(org_id);
CREATE INDEX idx_indicators_metadata_indicator_id ON indicators_metadata(indicator_id);
CREATE INDEX idx_indicators_metadata_language ON indicators_metadata(language);
CREATE INDEX idx_indicators_metadata_full_data ON indicators_metadata USING GIN(full_data);

-- Comments
COMMENT ON TABLE indicators_metadata IS 'Snapshot of indicator definitions from GitHub at org creation time';
COMMENT ON COLUMN indicators_metadata.org_id IS 'Foreign key to organizations table';
COMMENT ON COLUMN indicators_metadata.indicator_id IS 'Indicator ID (1.1 to 10.10)';
COMMENT ON COLUMN indicators_metadata.category IS 'Category name (Authority-Based, Temporal-Based, etc.)';
COMMENT ON COLUMN indicators_metadata.title IS 'Indicator title from JSON';
COMMENT ON COLUMN indicators_metadata.language IS 'Language code (en-US, it-IT, etc.)';
COMMENT ON COLUMN indicators_metadata.full_data IS 'Complete indicator JSON from GitHub';
COMMENT ON COLUMN indicators_metadata.snapshot_date IS 'When this snapshot was taken';

-- ============================================================================
-- Triggers: Auto-update updated_at on organizations
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Views: Useful aggregated views
-- ============================================================================

-- View: Organization risk summary
CREATE OR REPLACE VIEW v_organization_risk_summary AS
SELECT
    o.id,
    o.name,
    o.industry,
    o.size,
    COUNT(a.id) as total_assessments,
    ROUND(AVG(a.bayesian_score)::numeric, 4) as avg_risk_score,
    ROUND(AVG(a.confidence)::numeric, 4) as avg_confidence,
    MAX(a.assessment_date) as last_assessment_date,
    ROUND((COUNT(a.id)::decimal / 100 * 100), 2) as completion_percentage
FROM organizations o
LEFT JOIN assessments a ON o.id = a.org_id
GROUP BY o.id, o.name, o.industry, o.size;

COMMENT ON VIEW v_organization_risk_summary IS 'Summary of risk metrics per organization';

-- View: Indicator statistics across all organizations
CREATE OR REPLACE VIEW v_indicator_statistics AS
SELECT
    indicator_id,
    COUNT(*) as assessment_count,
    ROUND(AVG(bayesian_score)::numeric, 4) as avg_score,
    ROUND(MIN(bayesian_score)::numeric, 4) as min_score,
    ROUND(MAX(bayesian_score)::numeric, 4) as max_score,
    ROUND(STDDEV(bayesian_score)::numeric, 4) as stddev_score,
    ROUND(AVG(confidence)::numeric, 4) as avg_confidence
FROM assessments
GROUP BY indicator_id
ORDER BY indicator_id;

COMMENT ON VIEW v_indicator_statistics IS 'Statistical analysis of each indicator across all organizations';

-- View: Recent assessments activity
CREATE OR REPLACE VIEW v_recent_assessments AS
SELECT
    a.id,
    o.name as organization_name,
    a.indicator_id,
    a.bayesian_score,
    a.confidence,
    a.assessor,
    a.assessment_date
FROM assessments a
JOIN organizations o ON a.org_id = o.id
ORDER BY a.assessment_date DESC
LIMIT 50;

COMMENT ON VIEW v_recent_assessments IS 'Last 50 assessments performed across all organizations';

-- ============================================================================
-- Functions: Useful database functions
-- ============================================================================

-- Function: Get organization completion rate
CREATE OR REPLACE FUNCTION get_org_completion_rate(org_identifier VARCHAR)
RETURNS DECIMAL AS $$
DECLARE
    assessment_count INTEGER;
    completion_rate DECIMAL;
BEGIN
    SELECT COUNT(*) INTO assessment_count
    FROM assessments
    WHERE org_id = org_identifier;

    completion_rate := (assessment_count::DECIMAL / 100.0) * 100.0;
    RETURN ROUND(completion_rate, 2);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_org_completion_rate IS 'Calculate assessment completion percentage for an organization (out of 100 indicators)';

-- Function: Get organization overall risk
CREATE OR REPLACE FUNCTION get_org_overall_risk(org_identifier VARCHAR)
RETURNS DECIMAL AS $$
DECLARE
    avg_risk DECIMAL;
BEGIN
    SELECT AVG(bayesian_score) INTO avg_risk
    FROM assessments
    WHERE org_id = org_identifier;

    RETURN COALESCE(ROUND(avg_risk, 4), 0.5000);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_org_overall_risk IS 'Calculate overall risk score for an organization (average of all assessments)';

-- Function: Get missing indicators for organization
CREATE OR REPLACE FUNCTION get_missing_indicators(org_identifier VARCHAR)
RETURNS TABLE(indicator_id VARCHAR) AS $$
BEGIN
    RETURN QUERY
    SELECT CONCAT(category_num::text, '.', indicator_num::text)::VARCHAR
    FROM generate_series(1, 10) as category_num
    CROSS JOIN generate_series(1, 10) as indicator_num
    EXCEPT
    SELECT a.indicator_id
    FROM assessments a
    WHERE a.org_id = org_identifier;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_missing_indicators IS 'Get list of indicator IDs not yet assessed for an organization';

-- ============================================================================
-- Sample Queries (commented out - for reference)
-- ============================================================================

/*
-- Get all organizations with their risk summary
SELECT * FROM v_organization_risk_summary;

-- Get completion rate for specific org
SELECT get_org_completion_rate('org-001');

-- Get overall risk for specific org
SELECT get_org_overall_risk('org-001');

-- Get missing indicators for specific org
SELECT * FROM get_missing_indicators('org-001');

-- Find high-risk organizations (avg score > 0.7)
SELECT name, avg_risk_score, completion_percentage
FROM v_organization_risk_summary
WHERE avg_risk_score > 0.7
ORDER BY avg_risk_score DESC;

-- Get all assessments for specific organization
SELECT
    indicator_id,
    bayesian_score,
    confidence,
    assessor,
    assessment_date
FROM assessments
WHERE org_id = 'org-001'
ORDER BY indicator_id;

-- Get risk distribution by category (assumes indicator format X.Y)
SELECT
    SUBSTRING(indicator_id, 1, 1) as category,
    COUNT(*) as count,
    ROUND(AVG(bayesian_score)::numeric, 4) as avg_score
FROM assessments
GROUP BY category
ORDER BY category;

-- Find indicators with highest variance across organizations
SELECT * FROM v_indicator_statistics
WHERE stddev_score > 0.2
ORDER BY stddev_score DESC;

-- Get organizations by industry with risk stats
SELECT
    industry,
    COUNT(*) as org_count,
    ROUND(AVG(avg_risk_score)::numeric, 4) as industry_avg_risk
FROM v_organization_risk_summary
GROUP BY industry
ORDER BY industry_avg_risk DESC;
*/

-- ============================================================================
-- Grants (optional - for production with dedicated user)
-- ============================================================================

-- Uncomment these if using a dedicated cpf_user
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO cpf_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO cpf_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO cpf_user;

-- ============================================================================
-- Schema Version Info
-- ============================================================================

CREATE TABLE IF NOT EXISTS schema_version (
    version VARCHAR(10) PRIMARY KEY,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

INSERT INTO schema_version (version, description)
VALUES ('1.0', 'Initial schema: organizations, assessments, indicators_metadata');

-- ============================================================================
-- End of Schema
-- ============================================================================

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ CPF Database Schema created successfully!';
    RAISE NOTICE '   - 3 tables: organizations, assessments, indicators_metadata';
    RAISE NOTICE '   - 3 views: v_organization_risk_summary, v_indicator_statistics, v_recent_assessments';
    RAISE NOTICE '   - 3 functions: get_org_completion_rate, get_org_overall_risk, get_missing_indicators';
    RAISE NOTICE ' ';
    RAISE NOTICE 'Next step: Run seed script to generate demo data';
    RAISE NOTICE '   node dashboard/db_seed_demo.js';
END $$;
