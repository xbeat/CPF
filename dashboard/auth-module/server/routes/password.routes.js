/**
 * CPF Auth Module - Password Routes
 * Password reset and change operations
 */

const express = require('express');
const router = express.Router();

const authService = require('../services/auth.service');
const userService = require('../services/user.service');
const emailService = require('../services/email.service');
const { authenticate, getClientIP } = require('../middleware/auth');
const { passwordResetLimiter, strictLimiter } = require('../middleware/rateLimiter');

// Get base URL from environment
const getBaseUrl = (req) => {
    return process.env.AUTH_BASE_URL ||
           `${req.protocol}://${req.get('host')}`;
};

// =============================================================================
// Forgot Password
// =============================================================================

/**
 * POST /api/auth/password/forgot
 * Request password reset email
 */
router.post('/forgot', passwordResetLimiter, async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                error: {
                    en: 'Email is required',
                    it: 'Email richiesta'
                },
                code: 'EMAIL_REQUIRED'
            });
        }

        const result = await authService.requestPasswordReset(
            email,
            {
                ip: getClientIP(req),
                userAgent: req.headers['user-agent']
            },
            getBaseUrl(req)
        );

        // Always return success to not reveal if email exists
        res.json({
            success: true,
            message: result.message
        });
    } catch (error) {
        handlePasswordError(error, res);
    }
});

/**
 * POST /api/auth/password/reset
 * Reset password with token
 */
router.post('/reset', passwordResetLimiter, async (req, res, next) => {
    try {
        const { token, password, confirmPassword } = req.body;

        // Validate inputs
        if (!token) {
            return res.status(400).json({
                success: false,
                error: {
                    en: 'Reset token is required',
                    it: 'Token di reset richiesto'
                },
                code: 'TOKEN_REQUIRED'
            });
        }

        if (!password) {
            return res.status(400).json({
                success: false,
                error: {
                    en: 'New password is required',
                    it: 'Nuova password richiesta'
                },
                code: 'PASSWORD_REQUIRED'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                error: {
                    en: 'Passwords do not match',
                    it: 'Le password non corrispondono'
                },
                code: 'PASSWORD_MISMATCH'
            });
        }

        const result = await authService.resetPassword(
            token,
            password,
            {
                ip: getClientIP(req),
                userAgent: req.headers['user-agent']
            }
        );

        res.json({
            success: true,
            message: result.message
        });
    } catch (error) {
        handlePasswordError(error, res);
    }
});

/**
 * GET /api/auth/password/verify-token
 * Verify if reset token is valid (without using it)
 */
router.get('/verify-token', async (req, res, next) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({
                success: false,
                valid: false,
                error: {
                    en: 'Token is required',
                    it: 'Token richiesto'
                }
            });
        }

        const tokenService = require('../services/token.service');
        const tokenData = await tokenService.verifyPasswordResetToken(token);

        if (!tokenData) {
            return res.json({
                success: true,
                valid: false,
                error: {
                    en: 'Invalid or expired reset link',
                    it: 'Link di reset non valido o scaduto'
                }
            });
        }

        res.json({
            success: true,
            valid: true
        });
    } catch (error) {
        handlePasswordError(error, res);
    }
});

// =============================================================================
// Change Password (Authenticated)
// =============================================================================

/**
 * POST /api/auth/password/change
 * Change password for authenticated user
 */
router.post('/change', authenticate, strictLimiter, async (req, res, next) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        // Validate inputs
        if (!currentPassword) {
            return res.status(400).json({
                success: false,
                error: {
                    en: 'Current password is required',
                    it: 'Password attuale richiesta'
                },
                code: 'CURRENT_PASSWORD_REQUIRED'
            });
        }

        if (!newPassword) {
            return res.status(400).json({
                success: false,
                error: {
                    en: 'New password is required',
                    it: 'Nuova password richiesta'
                },
                code: 'NEW_PASSWORD_REQUIRED'
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                error: {
                    en: 'Passwords do not match',
                    it: 'Le password non corrispondono'
                },
                code: 'PASSWORD_MISMATCH'
            });
        }

        // Change password
        await userService.changePassword(req.user.id, currentPassword, newPassword);

        // Get user for email
        const user = await userService.getUserById(req.user.id);

        // Send notification email
        await emailService.sendPasswordChangedEmail(user, {
            ip: getClientIP(req)
        });

        // Log the action
        await authService.logAuditEvent(
            'password_change',
            req.user.id,
            null,
            {
                ip: getClientIP(req),
                userAgent: req.headers['user-agent']
            }
        );

        res.json({
            success: true,
            message: {
                en: 'Password changed successfully',
                it: 'Password modificata con successo'
            }
        });
    } catch (error) {
        handlePasswordError(error, res);
    }
});

// =============================================================================
// Password Policy
// =============================================================================

/**
 * GET /api/auth/password/policy
 * Get password policy requirements
 */
router.get('/policy', (req, res) => {
    const security = require('../config/security');

    res.json({
        success: true,
        policy: {
            minLength: security.passwordPolicy.minLength,
            maxLength: security.passwordPolicy.maxLength,
            requireUppercase: security.passwordPolicy.requireUppercase,
            requireLowercase: security.passwordPolicy.requireLowercase,
            requireNumber: security.passwordPolicy.requireNumber,
            requireSpecial: security.passwordPolicy.requireSpecial,
            specialCharacters: security.passwordPolicy.specialCharacters,
            messages: {
                en: {
                    minLength: `Password must be at least ${security.passwordPolicy.minLength} characters`,
                    maxLength: `Password must be at most ${security.passwordPolicy.maxLength} characters`,
                    uppercase: 'Must contain at least one uppercase letter',
                    lowercase: 'Must contain at least one lowercase letter',
                    number: 'Must contain at least one number',
                    special: `Must contain at least one special character (${security.passwordPolicy.specialCharacters})`
                },
                it: {
                    minLength: `La password deve essere di almeno ${security.passwordPolicy.minLength} caratteri`,
                    maxLength: `La password deve essere al massimo di ${security.passwordPolicy.maxLength} caratteri`,
                    uppercase: 'Deve contenere almeno una lettera maiuscola',
                    lowercase: 'Deve contenere almeno una lettera minuscola',
                    number: 'Deve contenere almeno un numero',
                    special: `Deve contenere almeno un carattere speciale (${security.passwordPolicy.specialCharacters})`
                }
            }
        }
    });
});

/**
 * POST /api/auth/password/validate
 * Validate a password against policy (without storing)
 */
router.post('/validate', (req, res) => {
    const { password } = req.body;
    const security = require('../config/security');

    if (!password) {
        return res.status(400).json({
            success: false,
            valid: false,
            error: {
                en: 'Password is required',
                it: 'Password richiesta'
            }
        });
    }

    const result = security.passwordPolicy.validate(password);

    res.json({
        success: true,
        valid: result.valid,
        errors: result.errors,
        strength: calculatePasswordStrength(password)
    });
});

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Calculate password strength score
 * @param {string} password - Password to check
 * @returns {Object} { score: 0-100, label }
 */
function calculatePasswordStrength(password) {
    if (!password) {
        return { score: 0, label: { en: 'None', it: 'Nessuna' } };
    }

    let score = 0;

    // Length
    if (password.length >= 8) score += 10;
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;
    if (password.length >= 20) score += 10;

    // Character variety
    if (/[a-z]/.test(password)) score += 10;
    if (/[A-Z]/.test(password)) score += 10;
    if (/[0-9]/.test(password)) score += 10;
    if (/[^a-zA-Z0-9]/.test(password)) score += 15;

    // Mixed case
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 5;

    // Numbers and special
    if (/[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password)) score += 10;

    // Normalize to 100
    score = Math.min(100, score);

    // Label
    let label;
    if (score < 25) {
        label = { en: 'Weak', it: 'Debole' };
    } else if (score < 50) {
        label = { en: 'Fair', it: 'Discreta' };
    } else if (score < 75) {
        label = { en: 'Good', it: 'Buona' };
    } else {
        label = { en: 'Strong', it: 'Forte' };
    }

    return { score, label };
}

/**
 * Handle password-related errors
 * @param {Object} error - Error object
 * @param {Object} res - Express response
 */
function handlePasswordError(error, res) {
    console.error('[PASSWORD ERROR]', error);

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

        case 'invalid_token':
            return res.status(400).json({
                success: false,
                error: error.error,
                code: 'INVALID_TOKEN'
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
