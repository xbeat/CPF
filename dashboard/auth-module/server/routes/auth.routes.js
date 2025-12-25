/**
 * CPF Auth Module - Authentication Routes
 * Login, logout, registration, token refresh
 */

const express = require('express');
const router = express.Router();

const authService = require('../services/auth.service');
const tokenService = require('../services/token.service');
const { authenticate, optionalAuth, getClientIP } = require('../middleware/auth');
const { loginLimiter, registerLimiter, refreshLimiter, verificationLimiter } = require('../middleware/rateLimiter');
const { auditAdminAction } = require('../middleware/auditLog');
const security = require('../config/security');

// Get base URL from environment
const getBaseUrl = (req) => {
    return process.env.AUTH_BASE_URL ||
           `${req.protocol}://${req.get('host')}`;
};

// =============================================================================
// Registration
// =============================================================================

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', registerLimiter, async (req, res, next) => {
    try {
        const result = await authService.register(
            req.body,
            {
                ip: getClientIP(req),
                userAgent: req.headers['user-agent']
            },
            getBaseUrl(req)
        );

        res.status(201).json({
            success: true,
            user: result.user,
            message: result.message
        });
    } catch (error) {
        handleAuthError(error, res);
    }
});

// =============================================================================
// Login
// =============================================================================

/**
 * POST /api/auth/login
 * Authenticate user and return tokens
 */
router.post('/login', loginLimiter, async (req, res, next) => {
    try {
        const result = await authService.login(
            req.body,
            {
                ip: getClientIP(req),
                userAgent: req.headers['user-agent'],
                deviceInfo: parseUserAgent(req.headers['user-agent'])
            },
            getBaseUrl(req)
        );

        // Set refresh token in HTTP-only cookie
        res.cookie(security.session.cookieName, result.refreshToken, {
            ...security.session.cookieOptions,
            maxAge: security.jwt.parseExpiry(security.jwt.refreshExpiresIn)
        });

        res.json({
            success: true,
            user: result.user,
            accessToken: result.accessToken,
            expiresIn: result.expiresIn
        });
    } catch (error) {
        handleAuthError(error, res);
    }
});

// =============================================================================
// Token Refresh
// =============================================================================

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', refreshLimiter, async (req, res, next) => {
    try {
        // Get refresh token from cookie or body
        const refreshToken = req.cookies?.[security.session.cookieName] || req.body.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                error: {
                    en: 'Refresh token required',
                    it: 'Token di refresh richiesto'
                },
                code: 'REFRESH_TOKEN_REQUIRED'
            });
        }

        const result = await authService.refreshTokens(
            refreshToken,
            {
                ip: getClientIP(req),
                userAgent: req.headers['user-agent']
            }
        );

        // Update refresh token cookie
        res.cookie(security.session.cookieName, result.refreshToken, {
            ...security.session.cookieOptions,
            maxAge: security.jwt.parseExpiry(security.jwt.refreshExpiresIn)
        });

        res.json({
            success: true,
            user: result.user,
            accessToken: result.accessToken,
            expiresIn: result.expiresIn
        });
    } catch (error) {
        // Clear invalid cookie
        res.clearCookie(security.session.cookieName);
        handleAuthError(error, res);
    }
});

// =============================================================================
// Logout
// =============================================================================

/**
 * POST /api/auth/logout
 * Logout current session
 */
router.post('/logout', authenticate, async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.[security.session.cookieName] || req.body.refreshToken;

        const result = await authService.logout(
            req.user.id,
            refreshToken,
            {
                ip: getClientIP(req),
                userAgent: req.headers['user-agent']
            }
        );

        // Clear cookie
        res.clearCookie(security.session.cookieName);

        res.json({
            success: true,
            message: result.message
        });
    } catch (error) {
        handleAuthError(error, res);
    }
});

/**
 * POST /api/auth/logout-all
 * Logout from all devices
 */
router.post('/logout-all', authenticate, async (req, res, next) => {
    try {
        const keepCurrent = req.body.keepCurrent === true;
        const currentSession = keepCurrent
            ? await getCurrentSessionId(req)
            : null;

        const result = await authService.logoutAll(
            req.user.id,
            currentSession,
            {
                ip: getClientIP(req),
                userAgent: req.headers['user-agent']
            }
        );

        if (!keepCurrent) {
            res.clearCookie(security.session.cookieName);
        }

        res.json({
            success: true,
            message: result.message,
            revokedCount: result.revokedCount
        });
    } catch (error) {
        handleAuthError(error, res);
    }
});

// =============================================================================
// Email Verification
// =============================================================================

/**
 * POST /api/auth/verify-email
 * Verify email with token
 */
router.post('/verify-email', verificationLimiter, async (req, res, next) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                error: {
                    en: 'Verification token required',
                    it: 'Token di verifica richiesto'
                },
                code: 'TOKEN_REQUIRED'
            });
        }

        const result = await authService.verifyEmail(token, getBaseUrl(req));

        res.json({
            success: true,
            message: result.message,
            status: result.user.status
        });
    } catch (error) {
        handleAuthError(error, res);
    }
});

/**
 * POST /api/auth/resend-verification
 * Resend verification email
 */
router.post('/resend-verification', verificationLimiter, async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                error: {
                    en: 'Email is required',
                    it: 'Email richiesta'
                },
                code: 'EMAIL_REQUIRED'
            });
        }

        const result = await authService.resendVerificationEmail(email, getBaseUrl(req));

        res.json({
            success: true,
            message: result.message
        });
    } catch (error) {
        handleAuthError(error, res);
    }
});

// =============================================================================
// Session Management
// =============================================================================

/**
 * GET /api/auth/sessions
 * Get active sessions for current user
 */
router.get('/sessions', authenticate, async (req, res, next) => {
    try {
        const sessions = await tokenService.getActiveSessions(req.user.id);

        // Find current session
        const refreshToken = req.cookies?.[security.session.cookieName];
        let currentSessionId = null;

        if (refreshToken) {
            const currentSession = await tokenService.findSessionByToken(refreshToken);
            currentSessionId = currentSession?.id;
        }

        // Format sessions for response
        const formattedSessions = sessions.map(s => ({
            id: s.id,
            ipAddress: s.ip_address,
            userAgent: s.user_agent,
            deviceInfo: s.device_info ? JSON.parse(s.device_info) : null,
            createdAt: s.created_at,
            lastUsedAt: s.last_used_at,
            expiresAt: s.expires_at,
            isCurrent: s.id === currentSessionId
        }));

        res.json({
            success: true,
            sessions: formattedSessions
        });
    } catch (error) {
        handleAuthError(error, res);
    }
});

/**
 * DELETE /api/auth/sessions/:sessionId
 * Revoke a specific session
 */
router.delete('/sessions/:sessionId', authenticate, async (req, res, next) => {
    try {
        const { sessionId } = req.params;

        // Verify session belongs to user
        const sessions = await tokenService.getActiveSessions(req.user.id);
        const session = sessions.find(s => s.id === sessionId);

        if (!session) {
            return res.status(404).json({
                error: {
                    en: 'Session not found',
                    it: 'Sessione non trovata'
                },
                code: 'SESSION_NOT_FOUND'
            });
        }

        await tokenService.revokeSession(sessionId, 'user_revoked');

        res.json({
            success: true,
            message: {
                en: 'Session revoked successfully',
                it: 'Sessione revocata con successo'
            }
        });
    } catch (error) {
        handleAuthError(error, res);
    }
});

// =============================================================================
// Current User
// =============================================================================

/**
 * GET /api/auth/me
 * Get current user info
 */
router.get('/me', authenticate, async (req, res, next) => {
    try {
        const userService = require('../services/user.service');
        const user = await userService.getUserById(req.user.id);

        if (!user) {
            return res.status(404).json({
                error: {
                    en: 'User not found',
                    it: 'Utente non trovato'
                },
                code: 'USER_NOT_FOUND'
            });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                phone: user.phone,
                avatarUrl: user.avatar_url,
                language: user.language,
                timezone: user.timezone,
                role: user.role,
                orgId: user.org_id,
                status: user.status,
                isEmailVerified: user.is_email_verified,
                mustChangePassword: user.must_change_password,
                expiresAt: user.expires_at,
                lastLoginAt: user.last_login_at,
                createdAt: user.created_at
            }
        });
    } catch (error) {
        handleAuthError(error, res);
    }
});

/**
 * PATCH /api/auth/me
 * Update current user profile
 */
router.patch('/me', authenticate, async (req, res, next) => {
    try {
        const userService = require('../services/user.service');

        // Only allow updating certain fields
        const allowedUpdates = ['first_name', 'last_name', 'phone', 'language', 'timezone'];
        const updates = {};

        for (const key of allowedUpdates) {
            const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
            if (req.body[camelKey] !== undefined) {
                updates[key] = req.body[camelKey];
            }
            if (req.body[key] !== undefined) {
                updates[key] = req.body[key];
            }
        }

        const user = await userService.updateUser(req.user.id, updates);

        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                phone: user.phone,
                language: user.language,
                timezone: user.timezone,
                role: user.role,
                orgId: user.org_id,
                updatedAt: user.updated_at
            }
        });
    } catch (error) {
        handleAuthError(error, res);
    }
});

// =============================================================================
// Settings (Public)
// =============================================================================

/**
 * GET /api/auth/settings/public
 * Get public auth settings (for registration form)
 */
router.get('/settings/public', async (req, res, next) => {
    try {
        const userService = require('../services/user.service');
        const settings = await userService.getSettings();

        res.json({
            success: true,
            settings: {
                requiresApproval: settings.registration_requires_approval,
                requiresEmailVerification: settings.registration_requires_email_verification,
                allowedDomains: settings.allowed_email_domains || [],
                passwordPolicy: {
                    minLength: security.passwordPolicy.minLength,
                    requireUppercase: security.passwordPolicy.requireUppercase,
                    requireLowercase: security.passwordPolicy.requireLowercase,
                    requireNumber: security.passwordPolicy.requireNumber,
                    requireSpecial: security.passwordPolicy.requireSpecial
                }
            }
        });
    } catch (error) {
        handleAuthError(error, res);
    }
});

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get current session ID from refresh token
 * @param {Object} req - Express request
 * @returns {Promise<string|null>} Session ID
 */
async function getCurrentSessionId(req) {
    const refreshToken = req.cookies?.[security.session.cookieName];
    if (!refreshToken) return null;

    const session = await tokenService.findSessionByToken(refreshToken);
    return session?.id || null;
}

/**
 * Parse user agent string
 * @param {string} userAgent - User agent string
 * @returns {Object} Parsed info
 */
function parseUserAgent(userAgent) {
    if (!userAgent) return null;

    // Basic parsing - in production use a proper library
    const info = {
        raw: userAgent.substring(0, 255)
    };

    // Detect browser
    if (userAgent.includes('Chrome')) info.browser = 'Chrome';
    else if (userAgent.includes('Firefox')) info.browser = 'Firefox';
    else if (userAgent.includes('Safari')) info.browser = 'Safari';
    else if (userAgent.includes('Edge')) info.browser = 'Edge';

    // Detect OS
    if (userAgent.includes('Windows')) info.os = 'Windows';
    else if (userAgent.includes('Mac')) info.os = 'macOS';
    else if (userAgent.includes('Linux')) info.os = 'Linux';
    else if (userAgent.includes('Android')) info.os = 'Android';
    else if (userAgent.includes('iOS') || userAgent.includes('iPhone')) info.os = 'iOS';

    // Detect device type
    if (userAgent.includes('Mobile')) info.device = 'Mobile';
    else if (userAgent.includes('Tablet')) info.device = 'Tablet';
    else info.device = 'Desktop';

    return info;
}

/**
 * Handle authentication errors
 * @param {Object} error - Error object
 * @param {Object} res - Express response
 */
function handleAuthError(error, res) {
    console.error('[AUTH ERROR]', error);

    switch (error.type) {
        case 'validation':
            return res.status(400).json({
                success: false,
                error: error.error || error.errors?.[0] || { en: 'Validation error', it: 'Errore di validazione' },
                errors: error.errors,
                code: 'VALIDATION_ERROR'
            });

        case 'auth':
            return res.status(401).json({
                success: false,
                error: error.error,
                code: 'AUTH_FAILED'
            });

        case 'conflict':
            return res.status(409).json({
                success: false,
                error: error.error,
                code: 'CONFLICT'
            });

        case 'not_found':
            return res.status(404).json({
                success: false,
                error: error.error,
                code: 'NOT_FOUND'
            });

        case 'rate_limit':
            return res.status(429).json({
                success: false,
                error: error.error,
                retryAfter: error.retryAfter,
                code: 'RATE_LIMITED'
            });

        case 'account_status':
            return res.status(403).json({
                success: false,
                error: error.error,
                status: error.status,
                lockedUntil: error.lockedUntil,
                code: `ACCOUNT_${error.status?.toUpperCase()}`
            });

        case 'invalid_token':
            return res.status(401).json({
                success: false,
                error: error.error,
                code: 'INVALID_TOKEN'
            });

        case 'already_verified':
            return res.status(400).json({
                success: false,
                error: error.error,
                code: 'ALREADY_VERIFIED'
            });

        default:
            return res.status(500).json({
                success: false,
                error: {
                    en: 'An unexpected error occurred',
                    it: 'Si è verificato un errore imprevisto'
                },
                code: 'INTERNAL_ERROR'
            });
    }
}

module.exports = router;
