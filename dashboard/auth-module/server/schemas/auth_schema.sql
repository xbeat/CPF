-- =============================================================================
-- CPF AUTH MODULE - DATABASE SCHEMA
-- =============================================================================
-- Version: 1.0.0
-- Database: PostgreSQL 14+
-- Description: Complete authentication schema for multi-tenant CPF Dashboard
-- =============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- ENUM TYPES
-- -----------------------------------------------------------------------------

-- User roles with hierarchical permissions
CREATE TYPE user_role AS ENUM (
    'super_admin',  -- Full system access, can manage all orgs and users
    'admin',        -- Can manage users within their organization
    'auditor',      -- Can perform assessments and view reports
    'viewer'        -- Read-only access to dashboards
);

-- Account status
CREATE TYPE account_status AS ENUM (
    'pending_verification',  -- Email not yet verified
    'pending_approval',      -- Awaiting admin approval
    'active',                -- Fully active account
    'suspended',             -- Temporarily suspended by admin
    'locked',                -- Locked due to failed login attempts
    'expired',               -- Account expired
    'deactivated'            -- Permanently deactivated
);

-- Audit action types
CREATE TYPE audit_action AS ENUM (
    'login_success',
    'login_failure',
    'logout',
    'logout_all_devices',
    'register',
    'email_verified',
    'password_reset_request',
    'password_reset_success',
    'password_change',
    'profile_update',
    'account_locked',
    'account_unlocked',
    'account_suspended',
    'account_activated',
    'account_deactivated',
    'account_expired',
    'role_changed',
    'org_assigned',
    'org_removed',
    'session_revoked',
    'approval_granted',
    'approval_denied',
    'settings_changed',
    'mfa_enabled',
    'mfa_disabled'
);

-- -----------------------------------------------------------------------------
-- TABLES
-- -----------------------------------------------------------------------------

-- System settings table (singleton for global configuration)
CREATE TABLE IF NOT EXISTS auth_settings (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),  -- Ensures only one row
    registration_requires_approval BOOLEAN DEFAULT false,
    registration_requires_email_verification BOOLEAN DEFAULT true,
    allowed_email_domains TEXT[],  -- Empty array = all domains allowed
    account_expiry_days INTEGER DEFAULT 365,
    lockout_threshold INTEGER DEFAULT 5,
    lockout_duration_minutes INTEGER DEFAULT 30,
    max_sessions_per_user INTEGER DEFAULT 5,
    password_min_length INTEGER DEFAULT 12,
    password_require_uppercase BOOLEAN DEFAULT true,
    password_require_lowercase BOOLEAN DEFAULT true,
    password_require_number BOOLEAN DEFAULT true,
    password_require_special BOOLEAN DEFAULT true,
    session_absolute_timeout_hours INTEGER DEFAULT 24,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE IF NOT EXISTS auth_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    email_normalized VARCHAR(255) UNIQUE NOT NULL,  -- Lowercase, trimmed for lookups
    password_hash TEXT NOT NULL,

    -- Profile information
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    avatar_url TEXT,
    language VARCHAR(10) DEFAULT 'en-US',  -- Preferred language
    timezone VARCHAR(50) DEFAULT 'UTC',

    -- Role and organization
    role user_role NOT NULL DEFAULT 'viewer',
    org_id VARCHAR(50) REFERENCES organizations(id) ON DELETE SET NULL,

    -- Account status
    status account_status NOT NULL DEFAULT 'pending_verification',
    is_email_verified BOOLEAN DEFAULT false,
    email_verified_at TIMESTAMP WITH TIME ZONE,

    -- Security
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    last_failed_login_at TIMESTAMP WITH TIME ZONE,
    password_changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    must_change_password BOOLEAN DEFAULT false,

    -- Account lifecycle
    expires_at TIMESTAMP WITH TIME ZONE,  -- NULL = never expires
    expiry_warning_sent BOOLEAN DEFAULT false,
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_activity_at TIMESTAMP WITH TIME ZONE,

    -- Approval workflow
    approved_by UUID REFERENCES auth_users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    approval_notes TEXT,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth_users(id),

    -- Constraints
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Sessions table (for refresh tokens and active session management)
CREATE TABLE IF NOT EXISTS auth_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,

    -- Token management
    refresh_token_hash TEXT NOT NULL,  -- Hashed refresh token
    token_family UUID NOT NULL,  -- For refresh token rotation detection

    -- Session metadata
    ip_address INET,
    user_agent TEXT,
    device_info JSONB,  -- Parsed user agent info
    location JSONB,     -- Geo-location if available

    -- Lifecycle
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked_at TIMESTAMP WITH TIME ZONE,
    revoked_reason TEXT,

    -- Constraints
    CONSTRAINT valid_expiry CHECK (expires_at > created_at)
);

-- Password reset tokens
CREATE TABLE IF NOT EXISTS auth_password_resets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,  -- Hashed token

    -- Lifecycle
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,

    -- Security
    ip_address INET,
    user_agent TEXT,

    -- Constraints
    CONSTRAINT valid_reset_expiry CHECK (expires_at > created_at)
);

-- Email verification tokens
CREATE TABLE IF NOT EXISTS auth_email_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,  -- Email being verified (in case of change)
    token_hash TEXT NOT NULL,

    -- Lifecycle
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE,

    -- Constraints
    CONSTRAINT valid_verification_expiry CHECK (expires_at > created_at)
);

-- Audit log
CREATE TABLE IF NOT EXISTS auth_audit_log (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth_users(id) ON DELETE SET NULL,
    target_user_id UUID REFERENCES auth_users(id) ON DELETE SET NULL,  -- For admin actions on other users
    action audit_action NOT NULL,

    -- Context
    ip_address INET,
    user_agent TEXT,
    session_id UUID REFERENCES auth_sessions(id) ON DELETE SET NULL,
    org_id VARCHAR(50),

    -- Details
    details JSONB,  -- Additional action-specific data

    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User organization assignments (for multi-org access)
CREATE TABLE IF NOT EXISTS auth_user_organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
    org_id VARCHAR(50) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'viewer',  -- Role within this specific org

    -- Assignment details
    assigned_by UUID REFERENCES auth_users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,  -- Optional: temporary access
    notes TEXT,

    -- Unique constraint: one role per user per org
    UNIQUE(user_id, org_id)
);

-- Rate limiting table (for persistent rate limit data)
CREATE TABLE IF NOT EXISTS auth_rate_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    identifier VARCHAR(255) NOT NULL,  -- IP address or user ID
    action_type VARCHAR(50) NOT NULL,  -- 'login', 'register', 'password_reset', etc.
    attempts INTEGER DEFAULT 1,
    first_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    blocked_until TIMESTAMP WITH TIME ZONE,

    UNIQUE(identifier, action_type)
);

-- -----------------------------------------------------------------------------
-- INDEXES
-- -----------------------------------------------------------------------------

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_auth_users_email ON auth_users(email);
CREATE INDEX IF NOT EXISTS idx_auth_users_email_normalized ON auth_users(email_normalized);
CREATE INDEX IF NOT EXISTS idx_auth_users_status ON auth_users(status);
CREATE INDEX IF NOT EXISTS idx_auth_users_role ON auth_users(role);
CREATE INDEX IF NOT EXISTS idx_auth_users_org_id ON auth_users(org_id);
CREATE INDEX IF NOT EXISTS idx_auth_users_expires_at ON auth_users(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_auth_users_pending_approval ON auth_users(status) WHERE status = 'pending_approval';

-- Sessions indexes
CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON auth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_token_family ON auth_sessions(token_family);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_expires_at ON auth_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_active ON auth_sessions(user_id, expires_at) WHERE revoked_at IS NULL;

-- Password resets indexes
CREATE INDEX IF NOT EXISTS idx_auth_password_resets_user_id ON auth_password_resets(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_password_resets_expires ON auth_password_resets(expires_at) WHERE used_at IS NULL;

-- Email verifications indexes
CREATE INDEX IF NOT EXISTS idx_auth_email_verifications_user_id ON auth_email_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_email_verifications_expires ON auth_email_verifications(expires_at) WHERE verified_at IS NULL;

-- Audit log indexes
CREATE INDEX IF NOT EXISTS idx_auth_audit_log_user_id ON auth_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_audit_log_target_user_id ON auth_audit_log(target_user_id);
CREATE INDEX IF NOT EXISTS idx_auth_audit_log_action ON auth_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_auth_audit_log_created_at ON auth_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_auth_audit_log_org_id ON auth_audit_log(org_id);

-- User organizations indexes
CREATE INDEX IF NOT EXISTS idx_auth_user_organizations_user_id ON auth_user_organizations(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_user_organizations_org_id ON auth_user_organizations(org_id);

-- Rate limits indexes
CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_identifier ON auth_rate_limits(identifier, action_type);
CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_blocked ON auth_rate_limits(blocked_until) WHERE blocked_until IS NOT NULL;

-- -----------------------------------------------------------------------------
-- TRIGGERS
-- -----------------------------------------------------------------------------

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_auth_users_updated_at
    BEFORE UPDATE ON auth_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_auth_settings_updated_at
    BEFORE UPDATE ON auth_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Normalize email before insert/update
CREATE OR REPLACE FUNCTION normalize_email()
RETURNS TRIGGER AS $$
BEGIN
    NEW.email_normalized = LOWER(TRIM(NEW.email));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER normalize_auth_users_email
    BEFORE INSERT OR UPDATE OF email ON auth_users
    FOR EACH ROW
    EXECUTE FUNCTION normalize_email();

-- -----------------------------------------------------------------------------
-- INITIAL DATA
-- -----------------------------------------------------------------------------

-- Insert default settings
INSERT INTO auth_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- CLEANUP FUNCTIONS
-- -----------------------------------------------------------------------------

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM auth_sessions
    WHERE expires_at < CURRENT_TIMESTAMP
       OR revoked_at IS NOT NULL AND revoked_at < CURRENT_TIMESTAMP - INTERVAL '30 days';
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up expired tokens
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS INTEGER AS $$
DECLARE
    reset_deleted INTEGER;
    verify_deleted INTEGER;
BEGIN
    DELETE FROM auth_password_resets
    WHERE expires_at < CURRENT_TIMESTAMP
       OR used_at IS NOT NULL AND used_at < CURRENT_TIMESTAMP - INTERVAL '7 days';
    GET DIAGNOSTICS reset_deleted = ROW_COUNT;

    DELETE FROM auth_email_verifications
    WHERE expires_at < CURRENT_TIMESTAMP
       OR verified_at IS NOT NULL AND verified_at < CURRENT_TIMESTAMP - INTERVAL '7 days';
    GET DIAGNOSTICS verify_deleted = ROW_COUNT;

    RETURN reset_deleted + verify_deleted;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old rate limit entries
CREATE OR REPLACE FUNCTION cleanup_rate_limits()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM auth_rate_limits
    WHERE last_attempt_at < CURRENT_TIMESTAMP - INTERVAL '24 hours'
      AND (blocked_until IS NULL OR blocked_until < CURRENT_TIMESTAMP);
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old audit logs
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs(retention_days INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM auth_audit_log
    WHERE created_at < CURRENT_TIMESTAMP - (retention_days || ' days')::INTERVAL;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to handle expired accounts
CREATE OR REPLACE FUNCTION process_expired_accounts()
RETURNS TABLE(user_id UUID, email VARCHAR, action TEXT) AS $$
BEGIN
    -- Mark expired accounts
    UPDATE auth_users
    SET status = 'expired',
        updated_at = CURRENT_TIMESTAMP
    WHERE status = 'active'
      AND expires_at IS NOT NULL
      AND expires_at < CURRENT_TIMESTAMP
    RETURNING auth_users.id, auth_users.email, 'expired'::TEXT;

    -- Return affected users
    RETURN QUERY
    SELECT u.id, u.email, 'expired'::TEXT
    FROM auth_users u
    WHERE u.status = 'expired'
      AND u.updated_at > CURRENT_TIMESTAMP - INTERVAL '1 minute';
END;
$$ LANGUAGE plpgsql;

-- Function to check accounts expiring soon (for warning emails)
CREATE OR REPLACE FUNCTION get_accounts_expiring_soon(days_ahead INTEGER DEFAULT 7)
RETURNS TABLE(user_id UUID, email VARCHAR, expires_at TIMESTAMP WITH TIME ZONE, days_remaining INTEGER) AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.id,
        u.email,
        u.expires_at,
        EXTRACT(DAY FROM (u.expires_at - CURRENT_TIMESTAMP))::INTEGER as days_remaining
    FROM auth_users u
    WHERE u.status = 'active'
      AND u.expires_at IS NOT NULL
      AND u.expires_at BETWEEN CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP + (days_ahead || ' days')::INTERVAL
      AND u.expiry_warning_sent = false;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- VIEWS
-- -----------------------------------------------------------------------------

-- View for active sessions with user info
CREATE OR REPLACE VIEW auth_active_sessions_view AS
SELECT
    s.id as session_id,
    s.user_id,
    u.email,
    u.first_name,
    u.last_name,
    u.role,
    s.ip_address,
    s.user_agent,
    s.device_info,
    s.created_at as session_created,
    s.last_used_at,
    s.expires_at
FROM auth_sessions s
JOIN auth_users u ON s.user_id = u.id
WHERE s.revoked_at IS NULL
  AND s.expires_at > CURRENT_TIMESTAMP;

-- View for pending approval users
CREATE OR REPLACE VIEW auth_pending_approvals_view AS
SELECT
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.created_at,
    o.name as requested_org_name
FROM auth_users u
LEFT JOIN organizations o ON u.org_id = o.id
WHERE u.status = 'pending_approval'
ORDER BY u.created_at DESC;

-- View for user statistics per organization
CREATE OR REPLACE VIEW auth_org_user_stats_view AS
SELECT
    COALESCE(u.org_id, 'unassigned') as org_id,
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE u.status = 'active') as active_users,
    COUNT(*) FILTER (WHERE u.status = 'pending_approval') as pending_users,
    COUNT(*) FILTER (WHERE u.status = 'locked') as locked_users,
    COUNT(*) FILTER (WHERE u.role = 'admin') as admin_count,
    COUNT(*) FILTER (WHERE u.role = 'auditor') as auditor_count,
    COUNT(*) FILTER (WHERE u.role = 'viewer') as viewer_count
FROM auth_users u
WHERE u.status != 'deactivated'
GROUP BY u.org_id;

-- =============================================================================
-- END OF SCHEMA
-- =============================================================================
