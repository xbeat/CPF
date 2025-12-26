/**
 * CPF Auth Module - Authentication Middleware
 * JWT validation and access control
 */

const tokenService = require('../services/token.service');
const userService = require('../services/user.service');
const security = require('../config/security');

/**
 * Extract token from Authorization header or cookie
 * @param {Object} req - Express request
 * @returns {string|null} Token or null
 */
function extractToken(req) {
    // Check Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }

    // Check cookie
    if (req.cookies && req.cookies.cpf_access_token) {
        return req.cookies.cpf_access_token;
    }

    return null;
}

/**
 * Get client IP address
 * @param {Object} req - Express request
 * @returns {string} IP address
 */
function getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0].trim() ||
           req.headers['x-real-ip'] ||
           req.connection?.remoteAddress ||
           req.socket?.remoteAddress ||
           'unknown';
}

/**
 * Authentication middleware - requires valid access token
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
function authenticate(req, res, next) {
    const token = extractToken(req);

    if (!token) {
        return res.status(401).json({
            error: {
                en: 'Authentication required',
                it: 'Autenticazione richiesta'
            },
            code: 'AUTH_REQUIRED'
        });
    }

    const decoded = tokenService.verifyAccessToken(token);

    if (!decoded) {
        return res.status(401).json({
            error: {
                en: 'Invalid or expired token',
                it: 'Token non valido o scaduto'
            },
            code: 'INVALID_TOKEN'
        });
    }

    // Attach user info to request
    req.user = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
        orgId: decoded.orgId
    };

    // Attach session info
    req.sessionInfo = {
        ip: getClientIP(req),
        userAgent: req.headers['user-agent'],
        userId: decoded.sub,
        orgId: decoded.orgId
    };

    next();
}

/**
 * Optional authentication - attach user if token present
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
function optionalAuth(req, res, next) {
    const token = extractToken(req);

    if (token) {
        const decoded = tokenService.verifyAccessToken(token);
        if (decoded) {
            req.user = {
                id: decoded.sub,
                email: decoded.email,
                role: decoded.role,
                orgId: decoded.orgId
            };
        }
    }

    req.sessionInfo = {
        ip: getClientIP(req),
        userAgent: req.headers['user-agent'],
        userId: req.user?.id,
        orgId: req.user?.orgId
    };

    next();
}

/**
 * Require specific role(s)
 * @param  {...string} allowedRoles - Allowed roles
 * @returns {Function} Middleware
 */
function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: {
                    en: 'Authentication required',
                    it: 'Autenticazione richiesta'
                },
                code: 'AUTH_REQUIRED'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: {
                    en: 'Insufficient permissions',
                    it: 'Permessi insufficienti'
                },
                code: 'FORBIDDEN'
            });
        }

        next();
    };
}

/**
 * Require specific permission
 * @param {string} permission - Required permission
 * @returns {Function} Middleware
 */
function requirePermission(permission) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: {
                    en: 'Authentication required',
                    it: 'Autenticazione richiesta'
                },
                code: 'AUTH_REQUIRED'
            });
        }

        if (!security.roles.hasPermission(req.user.role, permission)) {
            return res.status(403).json({
                error: {
                    en: 'Insufficient permissions',
                    it: 'Permessi insufficienti'
                },
                code: 'FORBIDDEN'
            });
        }

        next();
    };
}

/**
 * Require same organization (or super_admin)
 * @param {Function} getOrgId - Function to get target org ID from request
 * @returns {Function} Middleware
 */
function requireSameOrg(getOrgId = (req) => req.params.orgId) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: {
                    en: 'Authentication required',
                    it: 'Autenticazione richiesta'
                },
                code: 'AUTH_REQUIRED'
            });
        }

        // Super admins can access any org
        if (req.user.role === 'super_admin') {
            return next();
        }

        const targetOrgId = getOrgId(req);
        if (targetOrgId && req.user.orgId !== targetOrgId) {
            return res.status(403).json({
                error: {
                    en: 'Access denied to this organization',
                    it: 'Accesso negato a questa organizzazione'
                },
                code: 'ORG_ACCESS_DENIED'
            });
        }

        next();
    };
}

/**
 * Require user owns the resource or is admin
 * @param {Function} getUserId - Function to get resource owner ID from request
 * @returns {Function} Middleware
 */
function requireOwnerOrAdmin(getUserId = (req) => req.params.userId) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: {
                    en: 'Authentication required',
                    it: 'Autenticazione richiesta'
                },
                code: 'AUTH_REQUIRED'
            });
        }

        const targetUserId = getUserId(req);

        // User accessing their own resource
        if (req.user.id === targetUserId) {
            return next();
        }

        // Admin roles can access
        if (['super_admin', 'admin'].includes(req.user.role)) {
            return next();
        }

        return res.status(403).json({
            error: {
                en: 'Access denied',
                it: 'Accesso negato'
            },
            code: 'ACCESS_DENIED'
        });
    };
}

/**
 * Check if user must change password
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
async function checkPasswordChange(req, res, next) {
    if (!req.user) {
        return next();
    }

    try {
        const user = await userService.getUserById(req.user.id);
        if (user && user.must_change_password) {
            // Allow only password change endpoint
            if (!req.path.includes('/password') && req.method !== 'POST') {
                return res.status(403).json({
                    error: {
                        en: 'You must change your password before continuing',
                        it: 'Devi cambiare la password prima di continuare'
                    },
                    code: 'PASSWORD_CHANGE_REQUIRED'
                });
            }
        }
        next();
    } catch (error) {
        next(error);
    }
}

/**
 * Refresh user activity timestamp
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
async function updateActivity(req, res, next) {
    if (req.user) {
        // Fire and forget - don't wait for this
        const db = require('../config/database');
        db.query('UPDATE auth_users SET last_activity_at = NOW() WHERE id = $1', [req.user.id])
            .catch(err => console.error('[AUTH] Failed to update activity:', err.message));
    }
    next();
}

// =============================================================================
// Exports
// =============================================================================

module.exports = {
    extractToken,
    getClientIP,
    authenticate,
    optionalAuth,
    requireRole,
    requirePermission,
    requireSameOrg,
    requireOwnerOrAdmin,
    checkPasswordChange,
    updateActivity
};
