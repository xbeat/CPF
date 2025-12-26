/**
 * CPF Auth Module - Audit Logging Middleware
 * Automatic request/response logging for security audit trail
 */

const security = require('../config/security');
const { getClientIP } = require('./auth');

/**
 * Request logging middleware
 * Logs incoming requests with timing
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
function requestLogger(req, res, next) {
    if (!security.audit.enabled) {
        return next();
    }

    // Skip health checks and static files
    if (req.path === '/health' ||
        req.path === '/api/health' ||
        req.path.startsWith('/css/') ||
        req.path.startsWith('/js/') ||
        req.path.endsWith('.ico')) {
        return next();
    }

    const startTime = Date.now();

    // Store start time on request
    req._startTime = startTime;

    // Log request
    const logData = {
        requestId: req.requestId,
        method: req.method,
        path: req.path,
        query: Object.keys(req.query).length > 0 ? req.query : undefined,
        ip: getClientIP(req),
        userAgent: req.headers['user-agent'],
        userId: req.user?.id,
        contentLength: req.headers['content-length']
    };

    // Sanitize sensitive data from log
    if (logData.query) {
        logData.query = sanitizeForLog(logData.query);
    }

    console.log(`[AUDIT REQUEST] ${req.method} ${req.path}`, JSON.stringify(logData));

    // Log response when finished
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const responseLog = {
            requestId: req.requestId,
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            userId: req.user?.id
        };

        const logLevel = res.statusCode >= 500 ? 'ERROR' :
                        res.statusCode >= 400 ? 'WARN' : 'INFO';

        console.log(`[AUDIT RESPONSE ${logLevel}] ${req.method} ${req.path} ${res.statusCode}`, JSON.stringify(responseLog));
    });

    next();
}

/**
 * Sanitize object for logging (remove sensitive fields)
 * @param {Object} obj - Object to sanitize
 * @returns {Object} Sanitized object
 */
function sanitizeForLog(obj) {
    const sanitized = { ...obj };

    for (const field of security.audit.sensitiveFields) {
        if (sanitized[field]) {
            sanitized[field] = '[REDACTED]';
        }
    }

    return sanitized;
}

/**
 * Error logging middleware
 * @param {Error} err - Error
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
function errorLogger(err, req, res, next) {
    const errorLog = {
        requestId: req.requestId,
        method: req.method,
        path: req.path,
        ip: getClientIP(req),
        userId: req.user?.id,
        error: {
            name: err.name,
            message: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        }
    };

    console.error('[AUDIT ERROR]', JSON.stringify(errorLog));

    next(err);
}

/**
 * Security event logger
 * Log important security events to database
 * @param {string} event - Event type
 * @param {Object} data - Event data
 * @param {Object} req - Express request (optional)
 */
async function logSecurityEvent(event, data, req = null) {
    if (!security.audit.enabled) return;

    const db = require('../config/database');

    const logEntry = {
        event,
        data: sanitizeForLog(data),
        timestamp: new Date().toISOString(),
        ip: req ? getClientIP(req) : null,
        userAgent: req?.headers['user-agent'],
        userId: req?.user?.id || data.userId,
        requestId: req?.requestId
    };

    try {
        // Log to database if it's an important auth event
        const authEvents = [
            'login_success', 'login_failure', 'logout', 'register',
            'password_change', 'password_reset', 'account_locked',
            'account_unlocked', 'role_changed', 'suspicious_activity'
        ];

        if (authEvents.includes(event)) {
            const authService = require('../services/auth.service');
            await authService.logAuditEvent(
                event,
                logEntry.userId,
                data.targetUserId || null,
                {
                    ip: logEntry.ip,
                    userAgent: logEntry.userAgent,
                    sessionId: data.sessionId
                },
                logEntry.data
            );
        }

        console.log(`[SECURITY EVENT] ${event}`, JSON.stringify(logEntry));
    } catch (error) {
        console.error('[SECURITY EVENT ERROR] Failed to log:', error.message);
    }
}

/**
 * Detect suspicious activity
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
function detectSuspiciousActivity(req, res, next) {
    const suspicious = [];

    // Check for SQL injection attempts
    const sqlPatterns = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)\b|--|;|\bOR\b.*=.*\bOR\b)/i;
    const checkValue = (val) => {
        if (typeof val === 'string' && sqlPatterns.test(val)) {
            return true;
        }
        return false;
    };

    // Check query parameters
    for (const [key, value] of Object.entries(req.query)) {
        if (checkValue(value)) {
            suspicious.push({ type: 'sql_injection', location: 'query', key });
        }
    }

    // Check body parameters
    if (req.body && typeof req.body === 'object') {
        for (const [key, value] of Object.entries(req.body)) {
            if (checkValue(value)) {
                suspicious.push({ type: 'sql_injection', location: 'body', key });
            }
        }
    }

    // Check for XSS attempts
    const xssPatterns = /<script|javascript:|on\w+\s*=/i;
    const checkXSS = (val) => {
        if (typeof val === 'string' && xssPatterns.test(val)) {
            return true;
        }
        return false;
    };

    for (const [key, value] of Object.entries(req.query)) {
        if (checkXSS(value)) {
            suspicious.push({ type: 'xss', location: 'query', key });
        }
    }

    if (req.body && typeof req.body === 'object') {
        for (const [key, value] of Object.entries(req.body)) {
            if (checkXSS(value)) {
                suspicious.push({ type: 'xss', location: 'body', key });
            }
        }
    }

    // Check for path traversal
    if (req.path.includes('../') || req.path.includes('..\\')) {
        suspicious.push({ type: 'path_traversal', location: 'path' });
    }

    // Log suspicious activity
    if (suspicious.length > 0) {
        logSecurityEvent('suspicious_activity', {
            attempts: suspicious,
            path: req.path,
            method: req.method
        }, req);

        // Optionally block the request
        if (suspicious.some(s => s.type === 'path_traversal')) {
            return res.status(400).json({
                error: {
                    en: 'Invalid request',
                    it: 'Richiesta non valida'
                },
                code: 'INVALID_REQUEST'
            });
        }
    }

    next();
}

/**
 * Create audit trail for admin actions
 * @param {string} action - Action description
 * @returns {Function} Middleware
 */
function auditAdminAction(action) {
    return async (req, res, next) => {
        // Store original json method
        const originalJson = res.json.bind(res);

        // Override json to capture response
        res.json = async (body) => {
            // Log the admin action
            if (res.statusCode < 400) {
                try {
                    await logSecurityEvent(action, {
                        targetUserId: req.params.userId || req.body?.userId,
                        targetOrgId: req.params.orgId || req.body?.orgId,
                        changes: sanitizeForLog(req.body),
                        result: 'success'
                    }, req);
                } catch (error) {
                    console.error('[AUDIT] Failed to log admin action:', error.message);
                }
            }

            return originalJson(body);
        };

        next();
    };
}

// =============================================================================
// Exports
// =============================================================================

module.exports = {
    requestLogger,
    errorLogger,
    logSecurityEvent,
    detectSuspiciousActivity,
    auditAdminAction,
    sanitizeForLog
};
