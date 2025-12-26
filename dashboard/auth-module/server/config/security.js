/**
 * CPF Auth Module - Security Configuration
 * All security-related constants and settings
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

module.exports = {
    // ==========================================================================
    // JWT Configuration
    // ==========================================================================
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-in-production',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production',
        emailSecret: process.env.JWT_EMAIL_SECRET || 'dev-email-secret-change-in-production',
        resetSecret: process.env.JWT_RESET_SECRET || 'dev-reset-secret-change-in-production',

        accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
        emailExpiresIn: process.env.JWT_EMAIL_EXPIRES_IN || '24h',
        resetExpiresIn: process.env.JWT_RESET_EXPIRES_IN || '1h',

        // Parse duration to milliseconds
        parseExpiry(duration) {
            const match = duration.match(/^(\d+)(s|m|h|d)$/);
            if (!match) return 900000; // Default 15 minutes

            const value = parseInt(match[1]);
            const unit = match[2];

            switch (unit) {
                case 's': return value * 1000;
                case 'm': return value * 60 * 1000;
                case 'h': return value * 60 * 60 * 1000;
                case 'd': return value * 24 * 60 * 60 * 1000;
                default: return 900000;
            }
        }
    },

    // ==========================================================================
    // Argon2 Password Hashing
    // ==========================================================================
    argon2: {
        memoryCost: parseInt(process.env.ARGON2_MEMORY_COST) || 65536,  // 64 MB
        timeCost: parseInt(process.env.ARGON2_TIME_COST) || 3,
        parallelism: parseInt(process.env.ARGON2_PARALLELISM) || 4,
        type: 2,  // Argon2id (hybrid of Argon2i and Argon2d)
        hashLength: 32
    },

    // ==========================================================================
    // Password Policy
    // ==========================================================================
    passwordPolicy: {
        minLength: parseInt(process.env.PASSWORD_MIN_LENGTH) || 12,
        maxLength: 128,
        requireUppercase: process.env.PASSWORD_REQUIRE_UPPERCASE !== 'false',
        requireLowercase: process.env.PASSWORD_REQUIRE_LOWERCASE !== 'false',
        requireNumber: process.env.PASSWORD_REQUIRE_NUMBER !== 'false',
        requireSpecial: process.env.PASSWORD_REQUIRE_SPECIAL !== 'false',
        specialCharacters: '!@#$%^&*()_+-=[]{}|;:,.<>?',

        // Common password list (abbreviated, expand in production)
        commonPasswords: [
            'password', 'password123', '123456789', 'qwerty123',
            'admin123', 'letmein', 'welcome', 'monkey', 'dragon',
            'master', 'login', 'abc123', 'admin', 'root'
        ],

        validate(password) {
            const errors = [];

            if (password.length < this.minLength) {
                errors.push({ en: `Password must be at least ${this.minLength} characters`, it: `La password deve essere di almeno ${this.minLength} caratteri` });
            }
            if (password.length > this.maxLength) {
                errors.push({ en: `Password must be at most ${this.maxLength} characters`, it: `La password deve essere al massimo di ${this.maxLength} caratteri` });
            }
            if (this.requireUppercase && !/[A-Z]/.test(password)) {
                errors.push({ en: 'Password must contain at least one uppercase letter', it: 'La password deve contenere almeno una lettera maiuscola' });
            }
            if (this.requireLowercase && !/[a-z]/.test(password)) {
                errors.push({ en: 'Password must contain at least one lowercase letter', it: 'La password deve contenere almeno una lettera minuscola' });
            }
            if (this.requireNumber && !/[0-9]/.test(password)) {
                errors.push({ en: 'Password must contain at least one number', it: 'La password deve contenere almeno un numero' });
            }
            if (this.requireSpecial && !new RegExp(`[${this.specialCharacters.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`).test(password)) {
                errors.push({ en: 'Password must contain at least one special character', it: 'La password deve contenere almeno un carattere speciale' });
            }
            if (this.commonPasswords.some(common => password.toLowerCase().includes(common))) {
                errors.push({ en: 'Password is too common, please choose a more secure password', it: 'La password è troppo comune, scegli una password più sicura' });
            }

            return {
                valid: errors.length === 0,
                errors
            };
        }
    },

    // ==========================================================================
    // Rate Limiting
    // ==========================================================================
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,  // 15 minutes
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
        loginMaxAttempts: parseInt(process.env.RATE_LIMIT_LOGIN_MAX) || 5,

        // Specific limits per action
        limits: {
            login: { windowMs: 900000, max: 5 },           // 5 per 15 min
            register: { windowMs: 3600000, max: 3 },       // 3 per hour
            passwordReset: { windowMs: 3600000, max: 3 },  // 3 per hour
            emailVerification: { windowMs: 300000, max: 5 }, // 5 per 5 min
            api: { windowMs: 60000, max: 100 }              // 100 per minute
        }
    },

    // ==========================================================================
    // Account Lockout
    // ==========================================================================
    lockout: {
        threshold: parseInt(process.env.LOCKOUT_THRESHOLD) || 5,
        durationMinutes: parseInt(process.env.LOCKOUT_DURATION_MINUTES) || 30,

        // Progressive lockout (optional)
        progressive: {
            enabled: true,
            durations: [5, 15, 30, 60, 1440]  // minutes: 5min, 15min, 30min, 1h, 24h
        }
    },

    // ==========================================================================
    // Session Management
    // ==========================================================================
    session: {
        absoluteTimeoutHours: parseInt(process.env.SESSION_ABSOLUTE_TIMEOUT_HOURS) || 24,
        maxSessionsPerUser: parseInt(process.env.MAX_SESSIONS_PER_USER) || 5,
        cookieName: 'cpf_refresh_token',
        cookieOptions: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
            path: '/api/auth'
        }
    },

    // ==========================================================================
    // Account Expiration
    // ==========================================================================
    accountExpiry: {
        defaultDays: parseInt(process.env.ACCOUNT_EXPIRY_DEFAULT_DAYS) || 365,
        warningDaysBefore: 7,
        gracePeriodDays: 0  // Extra days after expiry before full lockout
    },

    // ==========================================================================
    // Registration
    // ==========================================================================
    registration: {
        requiresApproval: process.env.REGISTRATION_REQUIRES_APPROVAL === 'true',
        requiresEmailVerification: process.env.REGISTRATION_REQUIRES_EMAIL_VERIFICATION !== 'false',
        allowedDomains: process.env.ALLOWED_EMAIL_DOMAINS
            ? process.env.ALLOWED_EMAIL_DOMAINS.split(',').map(d => d.trim().toLowerCase())
            : [],  // Empty = all allowed

        validateEmailDomain(email) {
            if (this.allowedDomains.length === 0) return true;
            const domain = email.split('@')[1].toLowerCase();
            return this.allowedDomains.includes(domain);
        }
    },

    // ==========================================================================
    // CORS
    // ==========================================================================
    cors: {
        origins: process.env.CORS_ALLOWED_ORIGINS
            ? process.env.CORS_ALLOWED_ORIGINS.split(',').map(o => o.trim())
            : ['http://localhost:3000', 'http://localhost:3001'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token', 'Accept-Language']
    },

    // ==========================================================================
    // Security Headers (Helmet.js configuration)
    // ==========================================================================
    helmet: {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", 'data:', 'https:'],
                connectSrc: ["'self'"],
                fontSrc: ["'self'"],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'"],
                frameSrc: ["'none'"]
            }
        },
        crossOriginEmbedderPolicy: false,
        crossOriginOpenerPolicy: { policy: 'same-origin' },
        crossOriginResourcePolicy: { policy: 'same-origin' },
        dnsPrefetchControl: { allow: false },
        frameguard: { action: 'deny' },
        hidePoweredBy: true,
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true
        },
        ieNoOpen: true,
        noSniff: true,
        originAgentCluster: true,
        permittedCrossDomainPolicies: { permittedPolicies: 'none' },
        referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
        xssFilter: true
    },

    // ==========================================================================
    // Audit Logging
    // ==========================================================================
    audit: {
        enabled: process.env.LOG_AUDIT_ENABLED !== 'false',
        retentionDays: parseInt(process.env.LOG_AUDIT_RETENTION_DAYS) || 90,
        sensitiveFields: ['password', 'password_hash', 'token', 'refresh_token', 'secret']
    },

    // ==========================================================================
    // User Roles and Permissions
    // ==========================================================================
    roles: {
        hierarchy: ['viewer', 'auditor', 'admin', 'super_admin'],

        permissions: {
            super_admin: [
                'users:read', 'users:create', 'users:update', 'users:delete',
                'users:approve', 'users:lock', 'users:unlock',
                'orgs:read', 'orgs:create', 'orgs:update', 'orgs:delete',
                'settings:read', 'settings:update',
                'audit:read',
                'assessments:read', 'assessments:create', 'assessments:update', 'assessments:delete'
            ],
            admin: [
                'users:read', 'users:create', 'users:update',
                'users:approve', 'users:lock', 'users:unlock',
                'orgs:read',
                'audit:read',
                'assessments:read', 'assessments:create', 'assessments:update', 'assessments:delete'
            ],
            auditor: [
                'users:read',
                'orgs:read',
                'assessments:read', 'assessments:create', 'assessments:update'
            ],
            viewer: [
                'orgs:read',
                'assessments:read'
            ]
        },

        canManageRole(managerRole, targetRole) {
            const managerLevel = this.hierarchy.indexOf(managerRole);
            const targetLevel = this.hierarchy.indexOf(targetRole);
            return managerLevel > targetLevel;
        },

        hasPermission(role, permission) {
            return this.permissions[role]?.includes(permission) || false;
        }
    }
};
