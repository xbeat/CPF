/**
 * CPF Auth Module - Security Headers Middleware
 * Helmet.js configuration and additional security headers
 */

const helmet = require('helmet');
const security = require('../config/security');

/**
 * Configure Helmet with security headers
 * @returns {Function} Express middleware
 */
function securityHeaders() {
    return helmet({
        contentSecurityPolicy: security.helmet.contentSecurityPolicy,
        crossOriginEmbedderPolicy: security.helmet.crossOriginEmbedderPolicy,
        crossOriginOpenerPolicy: security.helmet.crossOriginOpenerPolicy,
        crossOriginResourcePolicy: security.helmet.crossOriginResourcePolicy,
        dnsPrefetchControl: security.helmet.dnsPrefetchControl,
        frameguard: security.helmet.frameguard,
        hidePoweredBy: security.helmet.hidePoweredBy,
        hsts: security.helmet.hsts,
        ieNoOpen: security.helmet.ieNoOpen,
        noSniff: security.helmet.noSniff,
        originAgentCluster: security.helmet.originAgentCluster,
        permittedCrossDomainPolicies: security.helmet.permittedCrossDomainPolicies,
        referrerPolicy: security.helmet.referrerPolicy,
        xssFilter: security.helmet.xssFilter
    });
}

/**
 * Additional custom security headers
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
function additionalSecurityHeaders(req, res, next) {
    // Prevent caching of authenticated responses
    if (req.headers.authorization || req.cookies?.cpf_access_token) {
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
    }

    // Feature Policy / Permissions Policy
    res.set('Permissions-Policy',
        'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()'
    );

    // Prevent MIME type sniffing
    res.set('X-Content-Type-Options', 'nosniff');

    // Prevent clickjacking
    res.set('X-Frame-Options', 'DENY');

    // XSS Protection (legacy but still useful)
    res.set('X-XSS-Protection', '1; mode=block');

    // Expect-CT header for Certificate Transparency
    if (process.env.NODE_ENV === 'production') {
        res.set('Expect-CT', 'max-age=86400, enforce');
    }

    next();
}

/**
 * CORS configuration middleware
 * @returns {Function} Express middleware
 */
function corsConfig() {
    const cors = require('cors');

    return cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl)
            if (!origin) {
                return callback(null, true);
            }

            // Check if origin is in allowed list
            if (security.cors.origins.includes(origin)) {
                return callback(null, true);
            }

            // In development, allow localhost variants
            if (process.env.NODE_ENV === 'development' &&
                (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
                return callback(null, true);
            }

            callback(new Error('Not allowed by CORS'));
        },
        credentials: security.cors.credentials,
        methods: security.cors.methods,
        allowedHeaders: security.cors.allowedHeaders,
        exposedHeaders: ['X-Total-Count', 'X-Total-Pages'],
        maxAge: 600  // 10 minutes
    });
}

/**
 * Handle CORS errors
 * @param {Error} err - Error
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
function corsErrorHandler(err, req, res, next) {
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({
            error: {
                en: 'Cross-origin request blocked',
                it: 'Richiesta cross-origin bloccata'
            },
            code: 'CORS_BLOCKED'
        });
    }
    next(err);
}

/**
 * Request ID middleware for tracing
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
function requestId(req, res, next) {
    const { v4: uuidv4 } = require('uuid');
    req.requestId = req.headers['x-request-id'] || uuidv4();
    res.set('X-Request-ID', req.requestId);
    next();
}

/**
 * Sanitize request body to prevent injection
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
function sanitizeInput(req, res, next) {
    if (req.body && typeof req.body === 'object') {
        sanitizeObject(req.body);
    }
    if (req.query && typeof req.query === 'object') {
        sanitizeObject(req.query);
    }
    next();
}

/**
 * Recursively sanitize object values
 * @param {Object} obj - Object to sanitize
 */
function sanitizeObject(obj) {
    for (const key in obj) {
        if (typeof obj[key] === 'string') {
            // Remove null bytes
            obj[key] = obj[key].replace(/\0/g, '');
            // Trim excessive whitespace
            obj[key] = obj[key].trim();
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            sanitizeObject(obj[key]);
        }
    }
}

/**
 * Content-Type validation for API requests
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
function validateContentType(req, res, next) {
    // Skip for GET, HEAD, OPTIONS
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }

    // Skip if no body
    if (!req.body || Object.keys(req.body).length === 0) {
        return next();
    }

    const contentType = req.headers['content-type'];

    // Require content-type for POST/PUT/PATCH with body
    if (!contentType) {
        return res.status(415).json({
            error: {
                en: 'Content-Type header is required',
                it: 'Header Content-Type richiesto'
            },
            code: 'CONTENT_TYPE_REQUIRED'
        });
    }

    // Only allow JSON for API
    if (!contentType.includes('application/json')) {
        return res.status(415).json({
            error: {
                en: 'Content-Type must be application/json',
                it: 'Content-Type deve essere application/json'
            },
            code: 'INVALID_CONTENT_TYPE'
        });
    }

    next();
}

// =============================================================================
// Exports
// =============================================================================

module.exports = {
    securityHeaders,
    additionalSecurityHeaders,
    corsConfig,
    corsErrorHandler,
    requestId,
    sanitizeInput,
    validateContentType
};
