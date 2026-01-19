/**
 * CPF Dashboard - PostgreSQL Database Schema
 * Complete schema matching production database structure
 * Generated: 2026-01-19
 */

-- ============================================================================
-- EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

-- User roles enum
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'manager', 'analyst', 'viewer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Account status enum
DO $$ BEGIN
    CREATE TYPE account_status AS ENUM (
        'active',
        'inactive',
        'suspended',
        'pending_verification',
        'pending_approval',
        'expired'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Audit action enum
DO $$ BEGIN
    CREATE TYPE audit_action AS ENUM (
        'login',
        'logout',
        'login_failed',
        'password_reset_requested',
        'password_reset_completed',
        'password_changed',
        'email_verified',
        'account_created',
        'account_updated',
        'account_deleted',
        'account_locked',
        'account_unlocked',
        'role_changed',
        'permissions_changed',
        'session_revoked',
        'org_assigned',
        'org_removed'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to normalize email addresses
CREATE OR REPLACE FUNCTION normalize_email()
RETURNS TRIGGER AS $$
BEGIN
    NEW.email_normalized = LOWER(TRIM(NEW.email));
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- TABLE: organizations
-- Stores all monitored organizations
-- ============================================================================
DROP TABLE IF EXISTS organizations CASCADE;
CREATE TABLE organizations (
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
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    aggregates JSONB,
    deleted_at TIMESTAMPTZ,
    deleted_by VARCHAR(255)
);

-- ============================================================================
-- TABLE: assessments
-- Stores indicator assessments (schede) for each organization
-- ============================================================================
DROP TABLE IF EXISTS assessments CASCADE;
CREATE TABLE assessments (
    id SERIAL PRIMARY KEY,
    org_id VARCHAR(50) NOT NULL,
    indicator_id VARCHAR(10) NOT NULL,
    title TEXT,
    category VARCHAR(100),
    maturity_level VARCHAR(20),
    bayesian_score NUMERIC(5,4),
    confidence NUMERIC(5,4),
    assessor VARCHAR(255),
    assessment_date TIMESTAMPTZ,
    raw_data JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT assessments_org_id_indicator_id_key UNIQUE (org_id, indicator_id),
    CONSTRAINT assessments_org_id_fkey FOREIGN KEY (org_id)
        REFERENCES organizations(id) ON DELETE CASCADE
);

-- ============================================================================
-- TABLE: soc_indicators
-- Stores SOC (Security Operations Center) indicators
-- ============================================================================
DROP TABLE IF EXISTS soc_indicators CASCADE;
CREATE TABLE soc_indicators (
    id SERIAL PRIMARY KEY,
    org_id VARCHAR(50) NOT NULL,
    indicator_id VARCHAR(10) NOT NULL,
    value NUMERIC(5,4),
    previous_value NUMERIC(5,4),
    event_count INT DEFAULT 0,
    last_event_type VARCHAR(100),
    last_event_severity VARCHAR(20),
    source VARCHAR(50) DEFAULT 'simulator',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT soc_indicators_org_id_indicator_id_key UNIQUE (org_id, indicator_id),
    CONSTRAINT soc_indicators_org_id_fkey FOREIGN KEY (org_id)
        REFERENCES organizations(id) ON DELETE CASCADE
);

-- ============================================================================
-- TABLE: auth_users
-- Authentication and user management
-- ============================================================================
DROP TABLE IF EXISTS auth_users CASCADE;
CREATE TABLE auth_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    email_normalized VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    avatar_url TEXT,
    language VARCHAR(10) DEFAULT 'en-US',
    timezone VARCHAR(50) DEFAULT 'UTC',
    role user_role NOT NULL DEFAULT 'viewer',
    org_id VARCHAR(50),
    status account_status NOT NULL DEFAULT 'pending_verification',
    is_email_verified BOOLEAN DEFAULT false,
    email_verified_at TIMESTAMPTZ,
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMPTZ,
    last_failed_login_at TIMESTAMPTZ,
    password_changed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    must_change_password BOOLEAN DEFAULT false,
    expires_at TIMESTAMPTZ,
    expiry_warning_sent BOOLEAN DEFAULT false,
    last_login_at TIMESTAMPTZ,
    last_activity_at TIMESTAMPTZ,
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    approval_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,

    CONSTRAINT auth_users_email_key UNIQUE (email),
    CONSTRAINT auth_users_email_normalized_key UNIQUE (email_normalized),
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT auth_users_org_id_fkey FOREIGN KEY (org_id)
        REFERENCES organizations(id) ON DELETE SET NULL,
    CONSTRAINT auth_users_approved_by_fkey FOREIGN KEY (approved_by)
        REFERENCES auth_users(id) ON DELETE NO ACTION,
    CONSTRAINT auth_users_created_by_fkey FOREIGN KEY (created_by)
        REFERENCES auth_users(id) ON DELETE NO ACTION
);

-- ============================================================================
-- TABLE: auth_sessions
-- User session management with refresh tokens
-- ============================================================================
DROP TABLE IF EXISTS auth_sessions CASCADE;
CREATE TABLE auth_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    refresh_token_hash TEXT NOT NULL,
    token_family UUID NOT NULL,
    ip_address INET,
    user_agent TEXT,
    device_info JSONB,
    location JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    revoked_reason TEXT,

    CONSTRAINT valid_expiry CHECK (expires_at > created_at),
    CONSTRAINT auth_sessions_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES auth_users(id) ON DELETE CASCADE
);

-- ============================================================================
-- TABLE: auth_user_organizations
-- Many-to-many relationship between users and organizations
-- ============================================================================
DROP TABLE IF EXISTS auth_user_organizations CASCADE;
CREATE TABLE auth_user_organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    org_id VARCHAR(50) NOT NULL,
    role user_role NOT NULL DEFAULT 'viewer',
    assigned_by UUID,
    assigned_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ,
    notes TEXT,

    CONSTRAINT auth_user_organizations_user_id_org_id_key UNIQUE (user_id, org_id),
    CONSTRAINT auth_user_organizations_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES auth_users(id) ON DELETE CASCADE,
    CONSTRAINT auth_user_organizations_org_id_fkey FOREIGN KEY (org_id)
        REFERENCES organizations(id) ON DELETE CASCADE,
    CONSTRAINT auth_user_organizations_assigned_by_fkey FOREIGN KEY (assigned_by)
        REFERENCES auth_users(id) ON DELETE NO ACTION
);

-- ============================================================================
-- TABLE: auth_email_verifications
-- Email verification tokens
-- ============================================================================
DROP TABLE IF EXISTS auth_email_verifications CASCADE;
CREATE TABLE auth_email_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    email VARCHAR(255) NOT NULL,
    token_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ NOT NULL,
    verified_at TIMESTAMPTZ,

    CONSTRAINT valid_verification_expiry CHECK (expires_at > created_at),
    CONSTRAINT auth_email_verifications_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES auth_users(id) ON DELETE CASCADE
);

-- ============================================================================
-- TABLE: auth_password_resets
-- Password reset tokens
-- ============================================================================
DROP TABLE IF EXISTS auth_password_resets CASCADE;
CREATE TABLE auth_password_resets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    token_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    ip_address INET,
    user_agent TEXT,

    CONSTRAINT valid_reset_expiry CHECK (expires_at > created_at),
    CONSTRAINT auth_password_resets_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES auth_users(id) ON DELETE CASCADE
);

-- ============================================================================
-- TABLE: auth_rate_limits
-- Rate limiting for authentication attempts
-- ============================================================================
DROP TABLE IF EXISTS auth_rate_limits CASCADE;
CREATE TABLE auth_rate_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    identifier VARCHAR(255) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    attempts INT DEFAULT 1,
    first_attempt_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_attempt_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    blocked_until TIMESTAMPTZ,

    CONSTRAINT auth_rate_limits_identifier_action_type_key UNIQUE (identifier, action_type)
);

-- ============================================================================
-- TABLE: auth_audit_log
-- Audit log for authentication and authorization events
-- ============================================================================
DROP TABLE IF EXISTS auth_audit_log CASCADE;
CREATE TABLE auth_audit_log (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID,
    target_user_id UUID,
    action audit_action NOT NULL,
    ip_address INET,
    user_agent TEXT,
    session_id UUID,
    org_id VARCHAR(50),
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT auth_audit_log_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES auth_users(id) ON DELETE SET NULL,
    CONSTRAINT auth_audit_log_target_user_id_fkey FOREIGN KEY (target_user_id)
        REFERENCES auth_users(id) ON DELETE SET NULL,
    CONSTRAINT auth_audit_log_session_id_fkey FOREIGN KEY (session_id)
        REFERENCES auth_sessions(id) ON DELETE SET NULL
);

-- ============================================================================
-- TABLE: auth_settings
-- Global authentication settings (singleton)
-- ============================================================================
DROP TABLE IF EXISTS auth_settings CASCADE;
CREATE TABLE auth_settings (
    id INT PRIMARY KEY DEFAULT 1,
    registration_requires_approval BOOLEAN DEFAULT false,
    registration_requires_email_verification BOOLEAN DEFAULT true,
    allowed_email_domains TEXT[],
    account_expiry_days INT DEFAULT 365,
    lockout_threshold INT DEFAULT 5,
    lockout_duration_minutes INT DEFAULT 30,
    max_sessions_per_user INT DEFAULT 5,
    password_min_length INT DEFAULT 12,
    password_require_uppercase BOOLEAN DEFAULT true,
    password_require_lowercase BOOLEAN DEFAULT true,
    password_require_number BOOLEAN DEFAULT true,
    password_require_special BOOLEAN DEFAULT true,
    session_absolute_timeout_hours INT DEFAULT 24,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT auth_settings_id_check CHECK (id = 1)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Organizations indexes
CREATE INDEX IF NOT EXISTS idx_organizations_name ON organizations(name);

-- Assessments indexes
CREATE INDEX IF NOT EXISTS idx_assessments_org_id ON assessments(org_id);
CREATE INDEX IF NOT EXISTS idx_assessments_indicator_id ON assessments(indicator_id);

-- SOC indicators indexes
CREATE INDEX IF NOT EXISTS idx_soc_indicators_org_id ON soc_indicators(org_id);
CREATE INDEX IF NOT EXISTS idx_soc_indicators_indicator_id ON soc_indicators(indicator_id);

-- Auth users indexes
CREATE INDEX IF NOT EXISTS idx_auth_users_email ON auth_users(email);
CREATE INDEX IF NOT EXISTS idx_auth_users_email_normalized ON auth_users(email_normalized);
CREATE INDEX IF NOT EXISTS idx_auth_users_org_id ON auth_users(org_id);
CREATE INDEX IF NOT EXISTS idx_auth_users_role ON auth_users(role);
CREATE INDEX IF NOT EXISTS idx_auth_users_status ON auth_users(status);
CREATE INDEX IF NOT EXISTS idx_auth_users_expires_at ON auth_users(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_auth_users_pending_approval ON auth_users(status) WHERE status = 'pending_approval';

-- Auth sessions indexes
CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON auth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_token_family ON auth_sessions(token_family);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_expires_at ON auth_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_active ON auth_sessions(user_id, expires_at) WHERE revoked_at IS NULL;

-- Auth user organizations indexes
CREATE INDEX IF NOT EXISTS idx_auth_user_organizations_user_id ON auth_user_organizations(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_user_organizations_org_id ON auth_user_organizations(org_id);

-- Auth email verifications indexes
CREATE INDEX IF NOT EXISTS idx_auth_email_verifications_user_id ON auth_email_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_email_verifications_expires ON auth_email_verifications(expires_at) WHERE verified_at IS NULL;

-- Auth password resets indexes
CREATE INDEX IF NOT EXISTS idx_auth_password_resets_user_id ON auth_password_resets(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_password_resets_expires ON auth_password_resets(expires_at) WHERE used_at IS NULL;

-- Auth rate limits indexes
CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_identifier ON auth_rate_limits(identifier, action_type);
CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_blocked ON auth_rate_limits(blocked_until) WHERE blocked_until IS NOT NULL;

-- Auth audit log indexes
CREATE INDEX IF NOT EXISTS idx_auth_audit_log_user_id ON auth_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_audit_log_target_user_id ON auth_audit_log(target_user_id);
CREATE INDEX IF NOT EXISTS idx_auth_audit_log_action ON auth_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_auth_audit_log_created_at ON auth_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_auth_audit_log_org_id ON auth_audit_log(org_id);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger to update updated_at on organizations
DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
CREATE TRIGGER update_organizations_updated_at
BEFORE UPDATE ON organizations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update updated_at on assessments
DROP TRIGGER IF EXISTS update_assessments_updated_at ON assessments;
CREATE TRIGGER update_assessments_updated_at
BEFORE UPDATE ON assessments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update updated_at on soc_indicators
DROP TRIGGER IF EXISTS update_soc_indicators_updated_at ON soc_indicators;
CREATE TRIGGER update_soc_indicators_updated_at
BEFORE UPDATE ON soc_indicators
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update updated_at on auth_users
DROP TRIGGER IF EXISTS update_auth_users_updated_at ON auth_users;
CREATE TRIGGER update_auth_users_updated_at
BEFORE UPDATE ON auth_users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger to normalize email on auth_users
DROP TRIGGER IF EXISTS normalize_auth_users_email ON auth_users;
CREATE TRIGGER normalize_auth_users_email
BEFORE INSERT OR UPDATE OF email ON auth_users
FOR EACH ROW
EXECUTE FUNCTION normalize_email();

-- Trigger to update updated_at on auth_settings
DROP TRIGGER IF EXISTS update_auth_settings_updated_at ON auth_settings;
CREATE TRIGGER update_auth_settings_updated_at
BEFORE UPDATE ON auth_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert default auth settings (singleton row)
INSERT INTO auth_settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;
