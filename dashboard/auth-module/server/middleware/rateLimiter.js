/**
 * CPF Auth Module - Rate Limiting Middleware
 * Protect against brute force and abuse
 */

const rateLimit = require('express-rate-limit');
const security = require('../config/security');
const { getClientIP } = require('./auth');

// =============================================================================
// Memory Store (default, use Redis in production for scaling)
// =============================================================================

/**
 * Create a rate limiter with custom options
 * @param {Object} options - Rate limit options
 * @returns {Function} Express middleware
 */
function createRateLimiter(options = {}) {
    const config = {
        windowMs: options.windowMs || security.rateLimit.windowMs,
        max: options.max || security.rateLimit.maxRequests,
        message: options.message || {
            error: {
                en: 'Too many requests, please try again later',
                it: 'Troppe richieste, riprova più tardi'
            },
            code: 'RATE_LIMITED'
        },
        standardHeaders: true,  // Return rate limit info in headers
        legacyHeaders: false,   // Disable X-RateLimit headers
        keyGenerator: (req) => getClientIP(req),
        handler: (req, res) => {
            res.status(429).json(config.message);
        },
        skip: (req) => {
            // Skip rate limiting for health checks
            return req.path === '/health' || req.path === '/api/health';
        }
    };

    return rateLimit(config);
}

// =============================================================================
// Specific Rate Limiters
// =============================================================================

/**
 * General API rate limiter
 * 100 requests per minute
 */
const apiLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 100,
    message: {
        error: {
            en: 'Too many API requests, please slow down',
            it: 'Troppe richieste API, rallenta'
        },
        code: 'API_RATE_LIMITED'
    }
});

/**
 * Login rate limiter
 * 5 attempts per 15 minutes
 */
const loginLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        error: {
            en: 'Too many login attempts. Please try again in 15 minutes.',
            it: 'Troppi tentativi di accesso. Riprova tra 15 minuti.'
        },
        code: 'LOGIN_RATE_LIMITED'
    }
});

/**
 * Registration rate limiter
 * 3 registrations per hour per IP
 */
const registerLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: {
        error: {
            en: 'Too many registration attempts. Please try again in an hour.',
            it: 'Troppi tentativi di registrazione. Riprova tra un\'ora.'
        },
        code: 'REGISTER_RATE_LIMITED'
    }
});

/**
 * Password reset rate limiter
 * 3 requests per hour
 */
const passwordResetLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: {
        error: {
            en: 'Too many password reset requests. Please try again in an hour.',
            it: 'Troppe richieste di reset password. Riprova tra un\'ora.'
        },
        code: 'RESET_RATE_LIMITED'
    }
});

/**
 * Email verification rate limiter
 * 5 requests per 5 minutes
 */
const verificationLimiter = createRateLimiter({
    windowMs: 5 * 60 * 1000,
    max: 5,
    message: {
        error: {
            en: 'Too many verification requests. Please wait a few minutes.',
            it: 'Troppe richieste di verifica. Attendi qualche minuto.'
        },
        code: 'VERIFICATION_RATE_LIMITED'
    }
});

/**
 * Token refresh rate limiter
 * 30 requests per minute (normal usage)
 */
const refreshLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 30,
    message: {
        error: {
            en: 'Too many token refresh requests',
            it: 'Troppe richieste di refresh token'
        },
        code: 'REFRESH_RATE_LIMITED'
    }
});

/**
 * Admin operations rate limiter
 * More generous but still protected
 * 50 requests per minute
 */
const adminLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 50,
    message: {
        error: {
            en: 'Too many admin operations. Please slow down.',
            it: 'Troppe operazioni admin. Rallenta.'
        },
        code: 'ADMIN_RATE_LIMITED'
    }
});

/**
 * Strict rate limiter for sensitive operations
 * 10 requests per 10 minutes
 */
const strictLimiter = createRateLimiter({
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: {
        error: {
            en: 'Rate limit exceeded for sensitive operation',
            it: 'Limite superato per operazione sensibile'
        },
        code: 'STRICT_RATE_LIMITED'
    }
});

// =============================================================================
// Dynamic Rate Limiter
// =============================================================================

/**
 * Create a dynamic rate limiter based on action type
 * @param {string} actionType - Action type from security config
 * @returns {Function} Express middleware
 */
function dynamicLimiter(actionType) {
    const limits = security.rateLimit.limits[actionType] || security.rateLimit.limits.api;
    return createRateLimiter({
        windowMs: limits.windowMs,
        max: limits.max
    });
}

// =============================================================================
// Exports
// =============================================================================

module.exports = {
    createRateLimiter,
    apiLimiter,
    loginLimiter,
    registerLimiter,
    passwordResetLimiter,
    verificationLimiter,
    refreshLimiter,
    adminLimiter,
    strictLimiter,
    dynamicLimiter
};
