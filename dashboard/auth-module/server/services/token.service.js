/**
 * CPF Auth Module - Token Service
 * JWT access tokens and refresh token management
 */

const jwt = require('jsonwebtoken');
const db = require('../config/database');
const security = require('../config/security');
const { generateToken, generateUUID, hashToken, compareTokenHash } = require('../utils/crypto');

// =============================================================================
// JWT Token Generation
// =============================================================================

/**
 * Generate an access token
 * @param {Object} user - User object
 * @returns {Object} { token, expiresIn }
 */
function generateAccessToken(user) {
    const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        orgId: user.org_id,
        type: 'access'
    };

    const token = jwt.sign(payload, security.jwt.accessSecret, {
        expiresIn: security.jwt.accessExpiresIn,
        issuer: 'cpf-auth',
        audience: 'cpf-dashboard'
    });

    const expiresIn = security.jwt.parseExpiry(security.jwt.accessExpiresIn);

    return { token, expiresIn };
}

/**
 * Generate a refresh token and store in database
 * @param {Object} user - User object
 * @param {Object} sessionInfo - Session info (ip, userAgent)
 * @returns {Promise<Object>} { token, sessionId, expiresAt }
 */
async function generateRefreshToken(user, sessionInfo = {}) {
    // Check max sessions per user
    const activeSessions = await getActiveSessions(user.id);
    if (activeSessions.length >= security.session.maxSessionsPerUser) {
        // Revoke oldest session
        const oldest = activeSessions.reduce((min, s) =>
            new Date(s.created_at) < new Date(min.created_at) ? s : min
        );
        await revokeSession(oldest.id, 'max_sessions_exceeded');
    }

    const token = generateToken(32);
    const tokenHash = hashToken(token);
    const tokenFamily = generateUUID();
    const expiresAt = new Date(Date.now() + security.jwt.parseExpiry(security.jwt.refreshExpiresIn));

    const result = await db.query(`
        INSERT INTO auth_sessions (
            user_id, refresh_token_hash, token_family,
            ip_address, user_agent, device_info, expires_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
    `, [
        user.id,
        tokenHash,
        tokenFamily,
        sessionInfo.ip || null,
        sessionInfo.userAgent || null,
        sessionInfo.deviceInfo ? JSON.stringify(sessionInfo.deviceInfo) : null,
        expiresAt
    ]);

    return {
        token,
        sessionId: result.rows[0].id,
        expiresAt
    };
}

/**
 * Generate email verification token
 * @param {string} userId - User ID
 * @param {string} email - Email to verify
 * @returns {Promise<Object>} { token, expiresAt }
 */
async function generateEmailVerificationToken(userId, email) {
    const token = generateToken(32);
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + security.jwt.parseExpiry(security.jwt.emailExpiresIn));

    await db.query(`
        INSERT INTO auth_email_verifications (user_id, email, token_hash, expires_at)
        VALUES ($1, $2, $3, $4)
    `, [userId, email, tokenHash, expiresAt]);

    return { token, expiresAt };
}

/**
 * Generate password reset token
 * @param {string} userId - User ID
 * @param {Object} requestInfo - Request info (ip, userAgent)
 * @returns {Promise<Object>} { token, expiresAt }
 */
async function generatePasswordResetToken(userId, requestInfo = {}) {
    // Invalidate any existing tokens
    await db.query(`
        UPDATE auth_password_resets
        SET used_at = NOW()
        WHERE user_id = $1 AND used_at IS NULL
    `, [userId]);

    const token = generateToken(32);
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + security.jwt.parseExpiry(security.jwt.resetExpiresIn));

    await db.query(`
        INSERT INTO auth_password_resets (user_id, token_hash, expires_at, ip_address, user_agent)
        VALUES ($1, $2, $3, $4, $5)
    `, [userId, tokenHash, expiresAt, requestInfo.ip || null, requestInfo.userAgent || null]);

    return { token, expiresAt };
}

// =============================================================================
// Token Verification
// =============================================================================

/**
 * Verify an access token
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded payload or null if invalid
 */
function verifyAccessToken(token) {
    try {
        const decoded = jwt.verify(token, security.jwt.accessSecret, {
            issuer: 'cpf-auth',
            audience: 'cpf-dashboard'
        });

        if (decoded.type !== 'access') {
            return null;
        }

        return decoded;
    } catch (error) {
        return null;
    }
}

/**
 * Verify and rotate a refresh token
 * @param {string} token - Refresh token
 * @param {Object} sessionInfo - New session info
 * @returns {Promise<Object|null>} { user, newToken, sessionId } or null
 */
async function verifyAndRotateRefreshToken(token, sessionInfo = {}) {
    const tokenHash = hashToken(token);

    // Find the session
    const sessionResult = await db.query(`
        SELECT s.*, u.id as user_id, u.email, u.role, u.org_id, u.status,
               u.first_name, u.last_name
        FROM auth_sessions s
        JOIN auth_users u ON s.user_id = u.id
        WHERE s.refresh_token_hash = $1
          AND s.revoked_at IS NULL
          AND s.expires_at > NOW()
    `, [tokenHash]);

    if (sessionResult.rows.length === 0) {
        // Check if token was already used (potential token theft)
        const usedToken = await db.query(`
            SELECT token_family FROM auth_sessions
            WHERE refresh_token_hash = $1 AND revoked_at IS NOT NULL
        `, [tokenHash]);

        if (usedToken.rows.length > 0) {
            // Token reuse detected - revoke all sessions in this family
            await db.query(`
                UPDATE auth_sessions
                SET revoked_at = NOW(), revoked_reason = 'token_reuse_detected'
                WHERE token_family = $1
            `, [usedToken.rows[0].token_family]);
        }

        return null;
    }

    const session = sessionResult.rows[0];

    // Check user status
    if (session.status !== 'active') {
        await revokeSession(session.id, 'user_not_active');
        return null;
    }

    // Rotate: revoke old token and create new one
    await db.query(`
        UPDATE auth_sessions
        SET revoked_at = NOW(), revoked_reason = 'rotated'
        WHERE id = $1
    `, [session.id]);

    // Generate new refresh token in same family
    const newToken = generateToken(32);
    const newTokenHash = hashToken(newToken);
    const newExpiresAt = new Date(Date.now() + security.jwt.parseExpiry(security.jwt.refreshExpiresIn));

    const newSession = await db.query(`
        INSERT INTO auth_sessions (
            user_id, refresh_token_hash, token_family,
            ip_address, user_agent, device_info, expires_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
    `, [
        session.user_id,
        newTokenHash,
        session.token_family,  // Keep same family
        sessionInfo.ip || session.ip_address,
        sessionInfo.userAgent || session.user_agent,
        sessionInfo.deviceInfo ? JSON.stringify(sessionInfo.deviceInfo) : session.device_info,
        newExpiresAt
    ]);

    // Update last_used_at for the family
    await db.query(`
        UPDATE auth_users SET last_activity_at = NOW() WHERE id = $1
    `, [session.user_id]);

    return {
        user: {
            id: session.user_id,
            email: session.email,
            role: session.role,
            org_id: session.org_id,
            first_name: session.first_name,
            last_name: session.last_name
        },
        newToken,
        sessionId: newSession.rows[0].id,
        expiresAt: newExpiresAt
    };
}

/**
 * Verify email verification token
 * @param {string} token - Verification token
 * @returns {Promise<Object|null>} { userId, email } or null
 */
async function verifyEmailToken(token) {
    const tokenHash = hashToken(token);

    const result = await db.query(`
        SELECT user_id, email
        FROM auth_email_verifications
        WHERE token_hash = $1
          AND expires_at > NOW()
          AND verified_at IS NULL
    `, [tokenHash]);

    if (result.rows.length === 0) {
        return null;
    }

    // Mark as used
    await db.query(`
        UPDATE auth_email_verifications
        SET verified_at = NOW()
        WHERE token_hash = $1
    `, [tokenHash]);

    return result.rows[0];
}

/**
 * Verify password reset token
 * @param {string} token - Reset token
 * @returns {Promise<Object|null>} { userId } or null
 */
async function verifyPasswordResetToken(token) {
    const tokenHash = hashToken(token);

    const result = await db.query(`
        SELECT user_id
        FROM auth_password_resets
        WHERE token_hash = $1
          AND expires_at > NOW()
          AND used_at IS NULL
    `, [tokenHash]);

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
}

/**
 * Mark password reset token as used
 * @param {string} token - Reset token
 */
async function markPasswordResetUsed(token) {
    const tokenHash = hashToken(token);
    await db.query(`
        UPDATE auth_password_resets
        SET used_at = NOW()
        WHERE token_hash = $1
    `, [tokenHash]);
}

// =============================================================================
// Session Management
// =============================================================================

/**
 * Get active sessions for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Active sessions
 */
async function getActiveSessions(userId) {
    const result = await db.query(`
        SELECT id, ip_address, user_agent, device_info, created_at, last_used_at, expires_at
        FROM auth_sessions
        WHERE user_id = $1
          AND revoked_at IS NULL
          AND expires_at > NOW()
        ORDER BY last_used_at DESC
    `, [userId]);

    return result.rows;
}

/**
 * Revoke a specific session
 * @param {string} sessionId - Session ID
 * @param {string} reason - Revocation reason
 */
async function revokeSession(sessionId, reason = 'user_logout') {
    await db.query(`
        UPDATE auth_sessions
        SET revoked_at = NOW(), revoked_reason = $2
        WHERE id = $1
    `, [sessionId, reason]);
}

/**
 * Revoke all sessions for a user
 * @param {string} userId - User ID
 * @param {string} reason - Revocation reason
 * @param {string} exceptSessionId - Session to keep (optional)
 */
async function revokeAllSessions(userId, reason = 'logout_all', exceptSessionId = null) {
    if (exceptSessionId) {
        await db.query(`
            UPDATE auth_sessions
            SET revoked_at = NOW(), revoked_reason = $2
            WHERE user_id = $1
              AND id != $3
              AND revoked_at IS NULL
        `, [userId, reason, exceptSessionId]);
    } else {
        await db.query(`
            UPDATE auth_sessions
            SET revoked_at = NOW(), revoked_reason = $2
            WHERE user_id = $1 AND revoked_at IS NULL
        `, [userId, reason]);
    }
}

/**
 * Find session by refresh token
 * @param {string} token - Refresh token
 * @returns {Promise<Object|null>} Session or null
 */
async function findSessionByToken(token) {
    const tokenHash = hashToken(token);

    const result = await db.query(`
        SELECT id, user_id, token_family, ip_address, user_agent,
               created_at, last_used_at, expires_at
        FROM auth_sessions
        WHERE refresh_token_hash = $1
          AND revoked_at IS NULL
          AND expires_at > NOW()
    `, [tokenHash]);

    return result.rows[0] || null;
}

// =============================================================================
// Cleanup
// =============================================================================

/**
 * Clean up expired tokens and sessions
 * @returns {Promise<Object>} Cleanup stats
 */
async function cleanupExpiredTokens() {
    const sessions = await db.query(`SELECT cleanup_expired_sessions()`);
    const tokens = await db.query(`SELECT cleanup_expired_tokens()`);
    const rateLimits = await db.query(`SELECT cleanup_rate_limits()`);

    return {
        sessionsDeleted: sessions.rows[0]?.cleanup_expired_sessions || 0,
        tokensDeleted: tokens.rows[0]?.cleanup_expired_tokens || 0,
        rateLimitsDeleted: rateLimits.rows[0]?.cleanup_rate_limits || 0
    };
}

// =============================================================================
// Exports
// =============================================================================

module.exports = {
    // Generation
    generateAccessToken,
    generateRefreshToken,
    generateEmailVerificationToken,
    generatePasswordResetToken,

    // Verification
    verifyAccessToken,
    verifyAndRotateRefreshToken,
    verifyEmailToken,
    verifyPasswordResetToken,
    markPasswordResetUsed,

    // Session management
    getActiveSessions,
    revokeSession,
    revokeAllSessions,
    findSessionByToken,

    // Cleanup
    cleanupExpiredTokens
};
