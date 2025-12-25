/**
 * CPF Auth Module - Authentication Service
 * Core authentication logic: login, logout, registration, password reset
 */

const db = require('../config/database');
const security = require('../config/security');
const userService = require('./user.service');
const tokenService = require('./token.service');
const emailService = require('./email.service');
const { verifyPassword, hashPassword, needsRehash } = require('../utils/crypto');
const { validateLogin, validateRegistration } = require('../utils/validation');

// =============================================================================
// Login
// =============================================================================

/**
 * Authenticate a user with email and password
 * @param {Object} credentials - { email, password }
 * @param {Object} sessionInfo - { ip, userAgent, deviceInfo }
 * @param {string} baseUrl - Base URL for emails
 * @returns {Promise<Object>} { user, accessToken, refreshToken, expiresIn }
 */
async function login(credentials, sessionInfo = {}, baseUrl = '') {
    // Validate input
    const validation = validateLogin(credentials);
    if (!validation.valid) {
        throw { type: 'validation', errors: validation.errors };
    }

    const { email } = validation.sanitized;
    const { password } = credentials;

    // Check rate limiting
    const rateLimited = await checkRateLimit(sessionInfo.ip, 'login');
    if (rateLimited) {
        throw {
            type: 'rate_limit',
            error: {
                en: 'Too many login attempts. Please try again later.',
                it: 'Troppi tentativi di accesso. Riprova più tardi.'
            },
            retryAfter: rateLimited.retryAfter
        };
    }

    // Get user
    const user = await userService.getUserByEmail(email, true);

    if (!user) {
        await recordFailedAttempt(sessionInfo.ip, 'login');
        throw {
            type: 'auth',
            error: { en: 'Invalid email or password', it: 'Email o password non validi' }
        };
    }

    // Check account status
    const statusCheck = checkAccountStatus(user);
    if (!statusCheck.canLogin) {
        // Log the attempt
        await logAuditEvent('login_failure', user.id, null, sessionInfo, {
            reason: statusCheck.reason
        });
        throw statusCheck.error;
    }

    // Verify password
    const isValidPassword = await verifyPassword(user.password_hash, password);

    if (!isValidPassword) {
        await handleFailedLogin(user, sessionInfo, baseUrl);
        throw {
            type: 'auth',
            error: { en: 'Invalid email or password', it: 'Email o password non validi' }
        };
    }

    // Check if password needs rehash (security params changed)
    if (await needsRehash(user.password_hash)) {
        const newHash = await hashPassword(password);
        await db.query('UPDATE auth_users SET password_hash = $1 WHERE id = $2', [newHash, user.id]);
    }

    // Clear failed attempts
    await clearFailedAttempts(user.id);
    await clearRateLimit(sessionInfo.ip, 'login');

    // Generate tokens
    const { token: accessToken, expiresIn } = tokenService.generateAccessToken(user);
    const { token: refreshToken, sessionId, expiresAt } = await tokenService.generateRefreshToken(user, sessionInfo);

    // Update last login
    await db.query(`
        UPDATE auth_users
        SET last_login_at = NOW(), last_activity_at = NOW()
        WHERE id = $1
    `, [user.id]);

    // Log successful login
    await logAuditEvent('login_success', user.id, null, sessionInfo, { sessionId });

    // Remove sensitive data
    delete user.password_hash;

    return {
        user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
            orgId: user.org_id,
            language: user.language,
            mustChangePassword: user.must_change_password
        },
        accessToken,
        refreshToken,
        expiresIn
    };
}

/**
 * Check if account status allows login
 * @param {Object} user - User object
 * @returns {Object} { canLogin, reason?, error? }
 */
function checkAccountStatus(user) {
    switch (user.status) {
        case 'pending_verification':
            return {
                canLogin: false,
                reason: 'email_not_verified',
                error: {
                    type: 'account_status',
                    status: 'pending_verification',
                    error: {
                        en: 'Please verify your email address before logging in',
                        it: 'Verifica il tuo indirizzo email prima di accedere'
                    }
                }
            };

        case 'pending_approval':
            return {
                canLogin: false,
                reason: 'pending_approval',
                error: {
                    type: 'account_status',
                    status: 'pending_approval',
                    error: {
                        en: 'Your account is pending administrator approval',
                        it: 'Il tuo account è in attesa di approvazione'
                    }
                }
            };

        case 'suspended':
            return {
                canLogin: false,
                reason: 'suspended',
                error: {
                    type: 'account_status',
                    status: 'suspended',
                    error: {
                        en: 'Your account has been suspended. Please contact your administrator.',
                        it: 'Il tuo account è stato sospeso. Contatta il tuo amministratore.'
                    }
                }
            };

        case 'locked':
            // Check if lockout period has expired
            if (user.locked_until && new Date(user.locked_until) > new Date()) {
                const lockedUntil = new Date(user.locked_until);
                return {
                    canLogin: false,
                    reason: 'locked',
                    error: {
                        type: 'account_status',
                        status: 'locked',
                        lockedUntil: lockedUntil.toISOString(),
                        error: {
                            en: `Account is locked until ${lockedUntil.toLocaleString('en-US')}`,
                            it: `Account bloccato fino a ${lockedUntil.toLocaleString('it-IT')}`
                        }
                    }
                };
            }
            // Lockout expired, will be unlocked on successful login
            break;

        case 'expired':
            return {
                canLogin: false,
                reason: 'expired',
                error: {
                    type: 'account_status',
                    status: 'expired',
                    error: {
                        en: 'Your account has expired. Please contact your administrator.',
                        it: 'Il tuo account è scaduto. Contatta il tuo amministratore.'
                    }
                }
            };

        case 'deactivated':
            return {
                canLogin: false,
                reason: 'deactivated',
                error: {
                    type: 'account_status',
                    status: 'deactivated',
                    error: {
                        en: 'This account has been deactivated',
                        it: 'Questo account è stato disattivato'
                    }
                }
            };

        case 'active':
            // Check expiration
            if (user.expires_at && new Date(user.expires_at) < new Date()) {
                // Mark as expired
                db.query(`UPDATE auth_users SET status = 'expired' WHERE id = $1`, [user.id]);
                return {
                    canLogin: false,
                    reason: 'expired',
                    error: {
                        type: 'account_status',
                        status: 'expired',
                        error: {
                            en: 'Your account has expired. Please contact your administrator.',
                            it: 'Il tuo account è scaduto. Contatta il tuo amministratore.'
                        }
                    }
                };
            }
            break;
    }

    return { canLogin: true };
}

/**
 * Handle failed login attempt
 * @param {Object} user - User object
 * @param {Object} sessionInfo - Session info
 * @param {string} baseUrl - Base URL for emails
 */
async function handleFailedLogin(user, sessionInfo, baseUrl) {
    const newAttempts = (user.failed_login_attempts || 0) + 1;

    await db.query(`
        UPDATE auth_users
        SET failed_login_attempts = $1, last_failed_login_at = NOW()
        WHERE id = $2
    `, [newAttempts, user.id]);

    // Log the attempt
    await logAuditEvent('login_failure', user.id, null, sessionInfo, {
        attempts: newAttempts
    });

    // Check if should lock
    if (newAttempts >= security.lockout.threshold) {
        let lockDuration = security.lockout.durationMinutes;

        // Progressive lockout
        if (security.lockout.progressive.enabled) {
            const lockIndex = Math.min(
                Math.floor((newAttempts - security.lockout.threshold) / security.lockout.threshold),
                security.lockout.progressive.durations.length - 1
            );
            lockDuration = security.lockout.progressive.durations[lockIndex];
        }

        const lockedUntil = new Date(Date.now() + lockDuration * 60 * 1000);

        await db.query(`
            UPDATE auth_users
            SET status = 'locked', locked_until = $1
            WHERE id = $2
        `, [lockedUntil, user.id]);

        // Log lockout
        await logAuditEvent('account_locked', user.id, null, sessionInfo, {
            attempts: newAttempts,
            lockedUntil: lockedUntil.toISOString()
        });

        // Send notification email
        await emailService.sendAccountLockedEmail(user, {
            failedAttempts: newAttempts,
            lockedUntil,
            ip: sessionInfo.ip
        });
    }

    await recordFailedAttempt(sessionInfo.ip, 'login');
}

/**
 * Clear failed login attempts for a user
 * @param {string} userId - User ID
 */
async function clearFailedAttempts(userId) {
    await db.query(`
        UPDATE auth_users
        SET failed_login_attempts = 0, last_failed_login_at = NULL
        WHERE id = $1
    `, [userId]);
}

// =============================================================================
// Registration
// =============================================================================

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {Object} sessionInfo - { ip, userAgent }
 * @param {string} baseUrl - Base URL for verification email
 * @returns {Promise<Object>} { user, message }
 */
async function register(userData, sessionInfo = {}, baseUrl = '') {
    // Check rate limiting
    const rateLimited = await checkRateLimit(sessionInfo.ip, 'register');
    if (rateLimited) {
        throw {
            type: 'rate_limit',
            error: {
                en: 'Too many registration attempts. Please try again later.',
                it: 'Troppi tentativi di registrazione. Riprova più tardi.'
            },
            retryAfter: rateLimited.retryAfter
        };
    }

    // Create user
    const user = await userService.createUser(userData);

    // Log registration
    await logAuditEvent('register', user.id, null, sessionInfo);

    // Get settings
    const settings = await userService.getSettings();

    let message = { en: '', it: '' };

    // Send verification email if required
    if (settings.registration_requires_email_verification || security.registration.requiresEmailVerification) {
        const { token } = await tokenService.generateEmailVerificationToken(user.id, user.email);
        await emailService.sendVerificationEmail(user, token, baseUrl);

        message = {
            en: 'Registration successful. Please check your email to verify your account.',
            it: 'Registrazione completata. Controlla la tua email per verificare il tuo account.'
        };
    } else if (settings.registration_requires_approval) {
        // Notify admins
        const admins = await userService.getAdminsForNotification(user.org_id);
        for (const admin of admins) {
            await emailService.sendPendingApprovalEmail(
                admin.email,
                user,
                `${baseUrl}/admin/approvals`,
                admin.language
            );
        }

        message = {
            en: 'Registration successful. Your account is pending administrator approval.',
            it: 'Registrazione completata. Il tuo account è in attesa di approvazione.'
        };
    } else {
        // Direct activation
        await emailService.sendWelcomeEmail(user, `${baseUrl}/login`);

        message = {
            en: 'Registration successful. You can now log in.',
            it: 'Registrazione completata. Puoi ora accedere.'
        };
    }

    return {
        user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            status: user.status
        },
        message
    };
}

// =============================================================================
// Email Verification
// =============================================================================

/**
 * Verify email with token
 * @param {string} token - Verification token
 * @param {string} baseUrl - Base URL for emails
 * @returns {Promise<Object>} { user, message }
 */
async function verifyEmail(token, baseUrl = '') {
    // Verify token
    const tokenData = await tokenService.verifyEmailToken(token);
    if (!tokenData) {
        throw {
            type: 'invalid_token',
            error: {
                en: 'Invalid or expired verification link',
                it: 'Link di verifica non valido o scaduto'
            }
        };
    }

    // Update user
    const user = await userService.verifyEmail(tokenData.user_id);

    // Log
    await logAuditEvent('email_verified', user.id);

    // Get settings
    const settings = await userService.getSettings();

    let message;
    if (settings.registration_requires_approval && user.status === 'pending_approval') {
        // Notify admins
        const admins = await userService.getAdminsForNotification(user.org_id);
        for (const admin of admins) {
            await emailService.sendPendingApprovalEmail(
                admin.email,
                user,
                `${baseUrl}/admin/approvals`,
                admin.language
            );
        }

        message = {
            en: 'Email verified. Your account is now pending administrator approval.',
            it: 'Email verificata. Il tuo account è ora in attesa di approvazione.'
        };
    } else {
        await emailService.sendWelcomeEmail(user, `${baseUrl}/login`);

        message = {
            en: 'Email verified successfully. You can now log in.',
            it: 'Email verificata con successo. Puoi ora accedere.'
        };
    }

    return { user, message };
}

/**
 * Resend verification email
 * @param {string} email - User email
 * @param {string} baseUrl - Base URL
 * @returns {Promise<Object>} { message }
 */
async function resendVerificationEmail(email, baseUrl) {
    const user = await userService.getUserByEmail(email);

    if (!user) {
        // Don't reveal if email exists
        return {
            message: {
                en: 'If this email is registered, a verification link has been sent.',
                it: 'Se questa email è registrata, è stato inviato un link di verifica.'
            }
        };
    }

    if (user.is_email_verified) {
        throw {
            type: 'already_verified',
            error: {
                en: 'This email is already verified',
                it: 'Questa email è già verificata'
            }
        };
    }

    const { token } = await tokenService.generateEmailVerificationToken(user.id, user.email);
    await emailService.sendVerificationEmail(user, token, baseUrl);

    return {
        message: {
            en: 'Verification email sent. Please check your inbox.',
            it: 'Email di verifica inviata. Controlla la tua casella di posta.'
        }
    };
}

// =============================================================================
// Password Reset
// =============================================================================

/**
 * Request password reset
 * @param {string} email - User email
 * @param {Object} sessionInfo - { ip, userAgent }
 * @param {string} baseUrl - Base URL for reset link
 * @returns {Promise<Object>} { message }
 */
async function requestPasswordReset(email, sessionInfo = {}, baseUrl = '') {
    // Check rate limiting
    const rateLimited = await checkRateLimit(sessionInfo.ip, 'passwordReset');
    if (rateLimited) {
        throw {
            type: 'rate_limit',
            error: {
                en: 'Too many reset requests. Please try again later.',
                it: 'Troppe richieste di reset. Riprova più tardi.'
            },
            retryAfter: rateLimited.retryAfter
        };
    }

    const user = await userService.getUserByEmail(email);

    // Always return success to not reveal if email exists
    const successMessage = {
        en: 'If this email is registered, a password reset link has been sent.',
        it: 'Se questa email è registrata, è stato inviato un link per reimpostare la password.'
    };

    if (!user) {
        await recordFailedAttempt(sessionInfo.ip, 'passwordReset');
        return { message: successMessage };
    }

    // Generate reset token
    const { token } = await tokenService.generatePasswordResetToken(user.id, sessionInfo);

    // Send email
    await emailService.sendPasswordResetEmail(user, token, baseUrl, sessionInfo);

    // Log
    await logAuditEvent('password_reset_request', user.id, null, sessionInfo);

    return { message: successMessage };
}

/**
 * Reset password with token
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @param {Object} sessionInfo - { ip, userAgent }
 * @returns {Promise<Object>} { message }
 */
async function resetPassword(token, newPassword, sessionInfo = {}) {
    // Verify token
    const tokenData = await tokenService.verifyPasswordResetToken(token);
    if (!tokenData) {
        throw {
            type: 'invalid_token',
            error: {
                en: 'Invalid or expired reset link',
                it: 'Link di reset non valido o scaduto'
            }
        };
    }

    // Reset password
    await userService.resetPassword(tokenData.user_id, newPassword);

    // Mark token as used
    await tokenService.markPasswordResetUsed(token);

    // Revoke all sessions
    await tokenService.revokeAllSessions(tokenData.user_id, 'password_reset');

    // Get user for email
    const user = await userService.getUserById(tokenData.user_id);

    // Send confirmation email
    await emailService.sendPasswordChangedEmail(user, sessionInfo);

    // Log
    await logAuditEvent('password_reset_success', tokenData.user_id, null, sessionInfo);

    return {
        message: {
            en: 'Password reset successfully. You can now log in with your new password.',
            it: 'Password reimpostata con successo. Puoi ora accedere con la nuova password.'
        }
    };
}

// =============================================================================
// Logout
// =============================================================================

/**
 * Logout user (revoke current session)
 * @param {string} userId - User ID
 * @param {string} refreshToken - Refresh token to revoke
 * @param {Object} sessionInfo - Session info
 * @returns {Promise<Object>} { message }
 */
async function logout(userId, refreshToken, sessionInfo = {}) {
    if (refreshToken) {
        const session = await tokenService.findSessionByToken(refreshToken);
        if (session && session.user_id === userId) {
            await tokenService.revokeSession(session.id, 'user_logout');
        }
    }

    // Log
    await logAuditEvent('logout', userId, null, sessionInfo);

    return {
        message: {
            en: 'Logged out successfully',
            it: 'Disconnessione effettuata'
        }
    };
}

/**
 * Logout from all devices
 * @param {string} userId - User ID
 * @param {string} currentSessionId - Current session to keep (optional)
 * @param {Object} sessionInfo - Session info
 * @returns {Promise<Object>} { message, revokedCount }
 */
async function logoutAll(userId, currentSessionId = null, sessionInfo = {}) {
    // Get count before revoking
    const sessions = await tokenService.getActiveSessions(userId);
    const revokedCount = currentSessionId
        ? sessions.filter(s => s.id !== currentSessionId).length
        : sessions.length;

    await tokenService.revokeAllSessions(userId, 'logout_all_devices', currentSessionId);

    // Log
    await logAuditEvent('logout_all_devices', userId, null, sessionInfo, { revokedCount });

    return {
        message: {
            en: `Logged out from ${revokedCount} device(s)`,
            it: `Disconnesso da ${revokedCount} dispositivo/i`
        },
        revokedCount
    };
}

// =============================================================================
// Token Refresh
// =============================================================================

/**
 * Refresh access token
 * @param {string} refreshToken - Refresh token
 * @param {Object} sessionInfo - Session info
 * @returns {Promise<Object>} { accessToken, refreshToken, expiresIn }
 */
async function refreshTokens(refreshToken, sessionInfo = {}) {
    const result = await tokenService.verifyAndRotateRefreshToken(refreshToken, sessionInfo);

    if (!result) {
        throw {
            type: 'invalid_token',
            error: {
                en: 'Invalid or expired refresh token',
                it: 'Token di refresh non valido o scaduto'
            }
        };
    }

    const { token: accessToken, expiresIn } = tokenService.generateAccessToken(result.user);

    return {
        user: result.user,
        accessToken,
        refreshToken: result.newToken,
        expiresIn
    };
}

// =============================================================================
// Rate Limiting
// =============================================================================

/**
 * Check rate limit for an action
 * @param {string} identifier - IP address or user ID
 * @param {string} action - Action type
 * @returns {Promise<Object|null>} Null if not limited, or { retryAfter }
 */
async function checkRateLimit(identifier, action) {
    const limits = security.rateLimit.limits[action] || security.rateLimit.limits.api;

    const result = await db.query(`
        SELECT * FROM auth_rate_limits
        WHERE identifier = $1 AND action_type = $2
    `, [identifier, action]);

    if (result.rows.length === 0) {
        return null;
    }

    const record = result.rows[0];

    // Check if blocked
    if (record.blocked_until && new Date(record.blocked_until) > new Date()) {
        return {
            retryAfter: Math.ceil((new Date(record.blocked_until) - new Date()) / 1000)
        };
    }

    // Check window
    const windowStart = new Date(Date.now() - limits.windowMs);
    if (new Date(record.first_attempt_at) < windowStart) {
        // Window expired, reset
        await db.query(`
            DELETE FROM auth_rate_limits
            WHERE identifier = $1 AND action_type = $2
        `, [identifier, action]);
        return null;
    }

    // Check attempts
    if (record.attempts >= limits.max) {
        const blockUntil = new Date(Date.now() + limits.windowMs);
        await db.query(`
            UPDATE auth_rate_limits
            SET blocked_until = $1
            WHERE identifier = $2 AND action_type = $3
        `, [blockUntil, identifier, action]);

        return {
            retryAfter: Math.ceil(limits.windowMs / 1000)
        };
    }

    return null;
}

/**
 * Record a failed attempt for rate limiting
 * @param {string} identifier - IP or user ID
 * @param {string} action - Action type
 */
async function recordFailedAttempt(identifier, action) {
    await db.query(`
        INSERT INTO auth_rate_limits (identifier, action_type, attempts, first_attempt_at, last_attempt_at)
        VALUES ($1, $2, 1, NOW(), NOW())
        ON CONFLICT (identifier, action_type)
        DO UPDATE SET
            attempts = auth_rate_limits.attempts + 1,
            last_attempt_at = NOW()
    `, [identifier, action]);
}

/**
 * Clear rate limit for an identifier
 * @param {string} identifier - IP or user ID
 * @param {string} action - Action type
 */
async function clearRateLimit(identifier, action) {
    await db.query(`
        DELETE FROM auth_rate_limits
        WHERE identifier = $1 AND action_type = $2
    `, [identifier, action]);
}

// =============================================================================
// Audit Logging
// =============================================================================

/**
 * Log an audit event
 * @param {string} action - Action type
 * @param {string} userId - User performing action
 * @param {string} targetUserId - Target user (for admin actions)
 * @param {Object} sessionInfo - Session info
 * @param {Object} details - Additional details
 */
async function logAuditEvent(action, userId, targetUserId = null, sessionInfo = {}, details = {}) {
    if (!security.audit.enabled) return;

    // Remove sensitive fields from details
    const sanitizedDetails = { ...details };
    for (const field of security.audit.sensitiveFields) {
        delete sanitizedDetails[field];
    }

    try {
        await db.query(`
            INSERT INTO auth_audit_log (
                user_id, target_user_id, action,
                ip_address, user_agent, session_id, org_id, details
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
            userId,
            targetUserId,
            action,
            sessionInfo.ip || null,
            sessionInfo.userAgent || null,
            sessionInfo.sessionId || null,
            sessionInfo.orgId || null,
            JSON.stringify(sanitizedDetails)
        ]);
    } catch (error) {
        console.error('[AUDIT] Failed to log event:', error.message);
    }
}

/**
 * Get audit log entries
 * @param {Object} options - Query options
 * @returns {Promise<Object>} { entries, total }
 */
async function getAuditLog(options = {}) {
    const {
        userId = null,
        action = null,
        startDate = null,
        endDate = null,
        page = 1,
        limit = 50
    } = options;

    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (userId) {
        conditions.push(`(user_id = $${paramIndex} OR target_user_id = $${paramIndex})`);
        params.push(userId);
        paramIndex++;
    }

    if (action) {
        conditions.push(`action = $${paramIndex++}`);
        params.push(action);
    }

    if (startDate) {
        conditions.push(`created_at >= $${paramIndex++}`);
        params.push(startDate);
    }

    if (endDate) {
        conditions.push(`created_at <= $${paramIndex++}`);
        params.push(endDate);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count
    const countResult = await db.query(
        `SELECT COUNT(*) FROM auth_audit_log ${whereClause}`,
        params
    );
    const total = parseInt(countResult.rows[0].count);

    // Get entries
    const offset = (page - 1) * limit;
    params.push(limit, offset);

    const result = await db.query(`
        SELECT a.*, u.email as user_email, t.email as target_email
        FROM auth_audit_log a
        LEFT JOIN auth_users u ON a.user_id = u.id
        LEFT JOIN auth_users t ON a.target_user_id = t.id
        ${whereClause}
        ORDER BY a.created_at DESC
        LIMIT $${paramIndex++} OFFSET $${paramIndex}
    `, params);

    return {
        entries: result.rows,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
}

// =============================================================================
// Exports
// =============================================================================

module.exports = {
    login,
    register,
    verifyEmail,
    resendVerificationEmail,
    requestPasswordReset,
    resetPassword,
    logout,
    logoutAll,
    refreshTokens,
    getAuditLog,
    logAuditEvent
};
