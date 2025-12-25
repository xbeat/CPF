/**
 * CPF Auth Module - Main Server
 * Standalone authentication server for CPF Dashboard
 *
 * Run with: npm start
 * Development: npm run dev
 */

const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Import configuration
const db = require('./config/database');
const security = require('./config/security');

// Import middleware
const { securityHeaders, additionalSecurityHeaders, corsConfig, corsErrorHandler, requestId, sanitizeInput, validateContentType } = require('./middleware/securityHeaders');
const { requestLogger, errorLogger, detectSuspiciousActivity } = require('./middleware/auditLog');
const { apiLimiter } = require('./middleware/rateLimiter');
const { optionalAuth, updateActivity } = require('./middleware/auth');

// Import routes
const authRoutes = require('./routes/auth.routes');
const passwordRoutes = require('./routes/password.routes');
const usersRoutes = require('./routes/users.routes');

// Create Express app
const app = express();

// =============================================================================
// Basic Configuration
// =============================================================================

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// =============================================================================
// Global Middleware (Order matters!)
// =============================================================================

// 1. Request ID for tracing
app.use(requestId);

// 2. Security headers (Helmet)
app.use(securityHeaders());
app.use(additionalSecurityHeaders);

// 3. CORS configuration
app.use(corsConfig());
app.use(corsErrorHandler);

// 4. Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Cookie parsing
app.use(cookieParser());

// 6. Input sanitization
app.use(sanitizeInput);
app.use(validateContentType);

// 7. Security detection
app.use(detectSuspiciousActivity);

// 8. Request logging (audit)
app.use(requestLogger);

// 9. Global rate limiting
app.use('/api', apiLimiter);

// 10. Optional auth (attach user if token present)
app.use(optionalAuth);

// 11. Activity tracking
app.use(updateActivity);

// =============================================================================
// Static Files (Frontend)
// =============================================================================

app.use(express.static(path.join(__dirname, '../client')));

// =============================================================================
// API Routes
// =============================================================================

// Health check (no auth)
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: require('../package.json').version
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: require('../package.json').version,
        database: 'connected'
    });
});

// Auth routes
app.use('/api/auth', authRoutes);
app.use('/api/auth/password', passwordRoutes);
app.use('/api/auth/users', usersRoutes);

// =============================================================================
// Frontend Routes (SPA fallback)
// =============================================================================

// Serve HTML pages
const pages = ['login', 'register', 'forgot-password', 'reset-password', 'verify-email', 'account-locked'];

pages.forEach(page => {
    app.get(`/${page}`, (req, res) => {
        res.sendFile(path.join(__dirname, `../client/${page}.html`));
    });
});

// Admin pages
app.get('/admin*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/admin.html'));
});

// Default: serve index
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// =============================================================================
// Error Handling
// =============================================================================

// Error logger middleware
app.use(errorLogger);

// 404 handler
app.use((req, res) => {
    // API requests get JSON
    if (req.path.startsWith('/api')) {
        return res.status(404).json({
            success: false,
            error: {
                en: 'Endpoint not found',
                it: 'Endpoint non trovato'
            },
            code: 'NOT_FOUND'
        });
    }

    // HTML requests get 404 page or redirect
    res.status(404).sendFile(path.join(__dirname, '../client/404.html'), (err) => {
        if (err) {
            res.status(404).send('Page not found');
        }
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('[SERVER ERROR]', {
        requestId: req.requestId,
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });

    // Validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: {
                en: 'Validation error',
                it: 'Errore di validazione'
            },
            details: err.details,
            code: 'VALIDATION_ERROR'
        });
    }

    // JSON parse errors
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            success: false,
            error: {
                en: 'Invalid JSON',
                it: 'JSON non valido'
            },
            code: 'INVALID_JSON'
        });
    }

    // Default error
    res.status(err.status || 500).json({
        success: false,
        error: {
            en: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
            it: process.env.NODE_ENV === 'development' ? err.message : 'Errore interno del server'
        },
        code: 'INTERNAL_ERROR'
    });
});

// =============================================================================
// Server Startup
// =============================================================================

const PORT = process.env.AUTH_PORT || 3001;
const HOST = process.env.AUTH_HOST || 'localhost';

async function startServer() {
    try {
        // Check database connection
        console.log('[AUTH] Checking database connection...');
        const connected = await db.checkConnection();

        if (!connected) {
            console.error('[AUTH] Failed to connect to database. Please check configuration.');
            process.exit(1);
        }

        // Initialize schema
        console.log('[AUTH] Initializing database schema...');
        await db.initializeSchema();

        // Start server
        app.listen(PORT, HOST, () => {
            console.log('');
            console.log('╔═══════════════════════════════════════════════════════════╗');
            console.log('║           CPF Auth Module - Server Started                 ║');
            console.log('╠═══════════════════════════════════════════════════════════╣');
            console.log(`║  URL:     http://${HOST}:${PORT}                           `);
            console.log(`║  Mode:    ${process.env.NODE_ENV || 'development'}                                  `);
            console.log(`║  API:     http://${HOST}:${PORT}/api/auth                  `);
            console.log('╠═══════════════════════════════════════════════════════════╣');
            console.log('║  Pages:                                                    ║');
            console.log(`║  - Login:     http://${HOST}:${PORT}/login                 `);
            console.log(`║  - Register:  http://${HOST}:${PORT}/register              `);
            console.log(`║  - Admin:     http://${HOST}:${PORT}/admin                 `);
            console.log('╚═══════════════════════════════════════════════════════════╝');
            console.log('');
        });

        // Graceful shutdown
        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGINT', gracefulShutdown);

    } catch (error) {
        console.error('[AUTH] Failed to start server:', error);
        process.exit(1);
    }
}

async function gracefulShutdown() {
    console.log('\n[AUTH] Shutting down gracefully...');

    try {
        await db.close();
        console.log('[AUTH] Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('[AUTH] Error during shutdown:', error);
        process.exit(1);
    }
}

// =============================================================================
// Scheduled Tasks
// =============================================================================

// Cleanup expired tokens every hour
setInterval(async () => {
    try {
        const tokenService = require('./services/token.service');
        const result = await tokenService.cleanupExpiredTokens();
        console.log('[AUTH CLEANUP]', result);
    } catch (error) {
        console.error('[AUTH CLEANUP ERROR]', error.message);
    }
}, 60 * 60 * 1000);

// Check for expiring accounts daily
setInterval(async () => {
    try {
        const emailService = require('./services/email.service');
        const result = await emailService.sendExpiryWarnings(7);
        if (result.sent.length > 0) {
            console.log('[AUTH EXPIRY WARNINGS] Sent to:', result.sent);
        }
    } catch (error) {
        console.error('[AUTH EXPIRY WARNINGS ERROR]', error.message);
    }
}, 24 * 60 * 60 * 1000);

// Start the server
startServer();

module.exports = app;
