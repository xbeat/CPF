/**
 * CPF Auth Module - Input Validation Utilities
 * Comprehensive validation for all user inputs
 */

const validator = require('validator');
const security = require('../config/security');

// =============================================================================
// Email Validation
// =============================================================================

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {Object} { valid: boolean, error?: string }
 */
function validateEmail(email) {
    if (!email || typeof email !== 'string') {
        return { valid: false, error: { en: 'Email is required', it: 'Email richiesta' } };
    }

    const normalized = email.trim().toLowerCase();

    if (!validator.isEmail(normalized)) {
        return { valid: false, error: { en: 'Invalid email format', it: 'Formato email non valido' } };
    }

    if (normalized.length > 255) {
        return { valid: false, error: { en: 'Email is too long', it: 'Email troppo lunga' } };
    }

    // Check allowed domains if configured
    if (!security.registration.validateEmailDomain(normalized)) {
        return {
            valid: false,
            error: {
                en: 'Email domain is not allowed for registration',
                it: 'Il dominio email non è consentito per la registrazione'
            }
        };
    }

    return { valid: true, normalized };
}

// =============================================================================
// Password Validation
// =============================================================================

/**
 * Validate password against security policy
 * @param {string} password - Password to validate
 * @returns {Object} { valid: boolean, errors?: Array }
 */
function validatePassword(password) {
    if (!password || typeof password !== 'string') {
        return { valid: false, errors: [{ en: 'Password is required', it: 'Password richiesta' }] };
    }

    return security.passwordPolicy.validate(password);
}

/**
 * Check if new password is different from old
 * @param {string} newPassword - New password
 * @param {string} oldPassword - Old password
 * @returns {Object} { valid: boolean, error?: string }
 */
function validatePasswordChange(newPassword, oldPassword) {
    if (newPassword === oldPassword) {
        return {
            valid: false,
            error: {
                en: 'New password must be different from current password',
                it: 'La nuova password deve essere diversa dalla password attuale'
            }
        };
    }
    return { valid: true };
}

// =============================================================================
// Name Validation
// =============================================================================

/**
 * Validate a name (first or last)
 * @param {string} name - Name to validate
 * @param {string} fieldName - Field name for error messages
 * @returns {Object} { valid: boolean, error?: string, sanitized?: string }
 */
function validateName(name, fieldName = 'Name') {
    if (!name || typeof name !== 'string') {
        return {
            valid: false,
            error: {
                en: `${fieldName} is required`,
                it: `${fieldName === 'First name' ? 'Nome' : 'Cognome'} richiesto`
            }
        };
    }

    const sanitized = validator.escape(name.trim());

    if (sanitized.length < 1) {
        return {
            valid: false,
            error: {
                en: `${fieldName} is required`,
                it: `${fieldName === 'First name' ? 'Nome' : 'Cognome'} richiesto`
            }
        };
    }

    if (sanitized.length > 100) {
        return {
            valid: false,
            error: {
                en: `${fieldName} is too long (max 100 characters)`,
                it: `${fieldName === 'First name' ? 'Nome' : 'Cognome'} troppo lungo (max 100 caratteri)`
            }
        };
    }

    // Check for invalid characters (only letters, spaces, hyphens, apostrophes)
    if (!/^[\p{L}\s\-']+$/u.test(name)) {
        return {
            valid: false,
            error: {
                en: `${fieldName} contains invalid characters`,
                it: `${fieldName === 'First name' ? 'Nome' : 'Cognome'} contiene caratteri non validi`
            }
        };
    }

    return { valid: true, sanitized };
}

// =============================================================================
// UUID Validation
// =============================================================================

/**
 * Validate UUID format
 * @param {string} uuid - UUID to validate
 * @returns {Object} { valid: boolean, error?: string }
 */
function validateUUID(uuid) {
    if (!uuid || typeof uuid !== 'string') {
        return { valid: false, error: { en: 'Invalid ID format', it: 'Formato ID non valido' } };
    }

    if (!validator.isUUID(uuid, 4)) {
        return { valid: false, error: { en: 'Invalid ID format', it: 'Formato ID non valido' } };
    }

    return { valid: true };
}

// =============================================================================
// Role Validation
// =============================================================================

/**
 * Validate user role
 * @param {string} role - Role to validate
 * @returns {Object} { valid: boolean, error?: string }
 */
function validateRole(role) {
    const validRoles = ['super_admin', 'admin', 'auditor', 'viewer'];

    if (!role || typeof role !== 'string') {
        return { valid: false, error: { en: 'Role is required', it: 'Ruolo richiesto' } };
    }

    if (!validRoles.includes(role)) {
        return {
            valid: false,
            error: {
                en: `Invalid role. Must be one of: ${validRoles.join(', ')}`,
                it: `Ruolo non valido. Deve essere uno tra: ${validRoles.join(', ')}`
            }
        };
    }

    return { valid: true };
}

// =============================================================================
// Language Validation
// =============================================================================

/**
 * Validate language code
 * @param {string} language - Language code
 * @returns {Object} { valid: boolean, normalized?: string }
 */
function validateLanguage(language) {
    const validLanguages = ['en-US', 'it-IT'];

    if (!language) {
        return { valid: true, normalized: 'en-US' }; // Default
    }

    const normalized = language.trim();

    if (!validLanguages.includes(normalized)) {
        // Try to match partial
        if (normalized.toLowerCase().startsWith('it')) {
            return { valid: true, normalized: 'it-IT' };
        }
        return { valid: true, normalized: 'en-US' };
    }

    return { valid: true, normalized };
}

// =============================================================================
// Phone Validation
// =============================================================================

/**
 * Validate phone number
 * @param {string} phone - Phone number
 * @returns {Object} { valid: boolean, error?: string, sanitized?: string }
 */
function validatePhone(phone) {
    if (!phone) {
        return { valid: true, sanitized: null }; // Optional field
    }

    const sanitized = phone.replace(/[^\d+\-\s()]/g, '').trim();

    if (sanitized.length < 7 || sanitized.length > 20) {
        return {
            valid: false,
            error: {
                en: 'Invalid phone number',
                it: 'Numero di telefono non valido'
            }
        };
    }

    return { valid: true, sanitized };
}

// =============================================================================
// Pagination Validation
// =============================================================================

/**
 * Validate pagination parameters
 * @param {any} page - Page number
 * @param {any} limit - Items per page
 * @param {number} maxLimit - Maximum allowed limit
 * @returns {Object} { page: number, limit: number, offset: number }
 */
function validatePagination(page, limit, maxLimit = 100) {
    let validPage = parseInt(page) || 1;
    let validLimit = parseInt(limit) || 20;

    if (validPage < 1) validPage = 1;
    if (validLimit < 1) validLimit = 1;
    if (validLimit > maxLimit) validLimit = maxLimit;

    return {
        page: validPage,
        limit: validLimit,
        offset: (validPage - 1) * validLimit
    };
}

// =============================================================================
// Token Validation
// =============================================================================

/**
 * Validate token format
 * @param {string} token - Token to validate
 * @param {number} expectedLength - Expected length in hex chars
 * @returns {Object} { valid: boolean, error?: string }
 */
function validateToken(token, expectedLength = 64) {
    if (!token || typeof token !== 'string') {
        return {
            valid: false,
            error: {
                en: 'Token is required',
                it: 'Token richiesto'
            }
        };
    }

    if (!/^[a-fA-F0-9]+$/.test(token) && !/^[a-zA-Z0-9_-]+$/.test(token)) {
        return {
            valid: false,
            error: {
                en: 'Invalid token format',
                it: 'Formato token non valido'
            }
        };
    }

    return { valid: true };
}

// =============================================================================
// Organization ID Validation
// =============================================================================

/**
 * Validate organization ID
 * @param {string} orgId - Organization ID
 * @returns {Object} { valid: boolean, error?: string }
 */
function validateOrgId(orgId) {
    if (!orgId || typeof orgId !== 'string') {
        return { valid: true, sanitized: null }; // Optional field
    }

    const sanitized = orgId.trim();

    if (sanitized.length > 50) {
        return {
            valid: false,
            error: {
                en: 'Organization ID is too long',
                it: 'ID organizzazione troppo lungo'
            }
        };
    }

    // Allow alphanumeric, hyphens, underscores
    if (!/^[a-zA-Z0-9_-]+$/.test(sanitized)) {
        return {
            valid: false,
            error: {
                en: 'Invalid organization ID format',
                it: 'Formato ID organizzazione non valido'
            }
        };
    }

    return { valid: true, sanitized };
}

// =============================================================================
// Sanitization Helpers
// =============================================================================

/**
 * Sanitize a string to prevent XSS
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeString(input) {
    if (!input || typeof input !== 'string') return '';
    return validator.escape(input.trim());
}

/**
 * Sanitize an object's string values
 * @param {Object} obj - Object to sanitize
 * @param {Array} fields - Fields to sanitize
 * @returns {Object} Sanitized object
 */
function sanitizeObject(obj, fields) {
    const sanitized = { ...obj };
    for (const field of fields) {
        if (sanitized[field] && typeof sanitized[field] === 'string') {
            sanitized[field] = sanitizeString(sanitized[field]);
        }
    }
    return sanitized;
}

// =============================================================================
// Complete Registration Validation
// =============================================================================

/**
 * Validate complete registration data
 * @param {Object} data - Registration data
 * @returns {Object} { valid: boolean, errors?: Array, sanitized?: Object }
 */
function validateRegistration(data) {
    const errors = [];
    const sanitized = {};

    // Email
    const emailResult = validateEmail(data.email);
    if (!emailResult.valid) {
        errors.push(emailResult.error);
    } else {
        sanitized.email = emailResult.normalized;
    }

    // Password
    const passwordResult = validatePassword(data.password);
    if (!passwordResult.valid) {
        errors.push(...passwordResult.errors);
    }

    // First name
    const firstNameResult = validateName(data.firstName, 'First name');
    if (!firstNameResult.valid) {
        errors.push(firstNameResult.error);
    } else {
        sanitized.firstName = firstNameResult.sanitized;
    }

    // Last name
    const lastNameResult = validateName(data.lastName, 'Last name');
    if (!lastNameResult.valid) {
        errors.push(lastNameResult.error);
    } else {
        sanitized.lastName = lastNameResult.sanitized;
    }

    // Language (optional)
    const langResult = validateLanguage(data.language);
    sanitized.language = langResult.normalized;

    // Phone (optional)
    const phoneResult = validatePhone(data.phone);
    if (!phoneResult.valid) {
        errors.push(phoneResult.error);
    } else {
        sanitized.phone = phoneResult.sanitized;
    }

    // Organization (optional)
    const orgResult = validateOrgId(data.orgId);
    if (!orgResult.valid) {
        errors.push(orgResult.error);
    } else {
        sanitized.orgId = orgResult.sanitized;
    }

    return {
        valid: errors.length === 0,
        errors,
        sanitized
    };
}

// =============================================================================
// Complete Login Validation
// =============================================================================

/**
 * Validate login data
 * @param {Object} data - Login data
 * @returns {Object} { valid: boolean, errors?: Array, sanitized?: Object }
 */
function validateLogin(data) {
    const errors = [];
    const sanitized = {};

    // Email
    const emailResult = validateEmail(data.email);
    if (!emailResult.valid) {
        errors.push(emailResult.error);
    } else {
        sanitized.email = emailResult.normalized;
    }

    // Password - basic check only (don't validate policy on login)
    if (!data.password || typeof data.password !== 'string' || data.password.length < 1) {
        errors.push({ en: 'Password is required', it: 'Password richiesta' });
    }

    return {
        valid: errors.length === 0,
        errors,
        sanitized
    };
}

// =============================================================================
// Exports
// =============================================================================

module.exports = {
    validateEmail,
    validatePassword,
    validatePasswordChange,
    validateName,
    validateUUID,
    validateRole,
    validateLanguage,
    validatePhone,
    validatePagination,
    validateToken,
    validateOrgId,
    sanitizeString,
    sanitizeObject,
    validateRegistration,
    validateLogin
};
