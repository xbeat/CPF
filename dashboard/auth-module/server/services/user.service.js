/**
 * CPF Auth Module - User Service
 * User management, CRUD operations, and user-related business logic
 */

const db = require('../config/database');
const security = require('../config/security');
const { hashPassword, verifyPassword, needsRehash } = require('../utils/crypto');
const { validateRegistration, validateEmail, validateRole } = require('../utils/validation');

// =============================================================================
// User CRUD Operations
// =============================================================================

/**
 * Create a new user
 * @param {Object} userData - User data
 * @param {string} createdBy - ID of user creating (optional, for admin creation)
 * @returns {Promise<Object>} Created user
 */
async function createUser(userData, createdBy = null) {
    // Validate input
    const validation = validateRegistration(userData);
    if (!validation.valid) {
        throw { type: 'validation', errors: validation.errors };
    }

    const { email, firstName, lastName, language, phone, orgId } = validation.sanitized;

    // Check if email already exists
    const existing = await db.query(
        'SELECT id FROM auth_users WHERE email_normalized = $1',
        [email]
    );
    if (existing.rows.length > 0) {
        throw {
            type: 'conflict',
            error: { en: 'Email already registered', it: 'Email già registrata' }
        };
    }

    // Hash password
    const passwordHash = await hashPassword(userData.password);

    // Determine initial status
    let status = 'pending_verification';
    if (!security.registration.requiresEmailVerification) {
        status = security.registration.requiresApproval ? 'pending_approval' : 'active';
    }

    // Calculate expiry date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + security.accountExpiry.defaultDays);

    const result = await db.query(`
        INSERT INTO auth_users (
            email, password_hash, first_name, last_name,
            language, phone, org_id, role, status,
            expires_at, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id, email, first_name, last_name, role, status, language,
                  org_id, created_at, expires_at
    `, [
        email,
        passwordHash,
        firstName,
        lastName,
        language,
        phone,
        orgId,
        'viewer',  // Default role
        status,
        expiresAt,
        createdBy
    ]);

    return result.rows[0];
}

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @param {boolean} includePassword - Include password hash (default false)
 * @returns {Promise<Object|null>} User or null
 */
async function getUserById(userId, includePassword = false) {
    const fields = includePassword
        ? '*'
        : `id, email, first_name, last_name, phone, avatar_url, language, timezone,
           role, org_id, status, is_email_verified, email_verified_at,
           failed_login_attempts, locked_until, password_changed_at, must_change_password,
           expires_at, expiry_warning_sent, last_login_at, last_activity_at,
           approved_by, approved_at, created_at, updated_at`;

    const result = await db.query(
        `SELECT ${fields} FROM auth_users WHERE id = $1`,
        [userId]
    );

    return result.rows[0] || null;
}

/**
 * Get user by email
 * @param {string} email - User email
 * @param {boolean} includePassword - Include password hash
 * @returns {Promise<Object|null>} User or null
 */
async function getUserByEmail(email, includePassword = false) {
    const normalizedEmail = email.trim().toLowerCase();

    const fields = includePassword
        ? '*'
        : `id, email, first_name, last_name, phone, avatar_url, language, timezone,
           role, org_id, status, is_email_verified, failed_login_attempts, locked_until,
           password_changed_at, must_change_password, expires_at, last_login_at,
           created_at, updated_at`;

    const result = await db.query(
        `SELECT ${fields} FROM auth_users WHERE email_normalized = $1`,
        [normalizedEmail]
    );

    return result.rows[0] || null;
}

/**
 * Update user
 * @param {string} userId - User ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated user
 */
async function updateUser(userId, updates) {
    const allowedFields = [
        'first_name', 'last_name', 'phone', 'avatar_url',
        'language', 'timezone', 'org_id'
    ];

    const setClause = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updates)) {
        if (allowedFields.includes(key)) {
            setClause.push(`${key} = $${paramIndex}`);
            values.push(value);
            paramIndex++;
        }
    }

    if (setClause.length === 0) {
        throw { type: 'validation', error: { en: 'No valid fields to update', it: 'Nessun campo valido da aggiornare' } };
    }

    values.push(userId);

    const result = await db.query(`
        UPDATE auth_users
        SET ${setClause.join(', ')}, updated_at = NOW()
        WHERE id = $${paramIndex}
        RETURNING id, email, first_name, last_name, phone, avatar_url,
                  language, timezone, role, org_id, status, updated_at
    `, values);

    if (result.rows.length === 0) {
        throw { type: 'not_found', error: { en: 'User not found', it: 'Utente non trovato' } };
    }

    return result.rows[0];
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<boolean>} Success
 */
async function changePassword(userId, currentPassword, newPassword) {
    const user = await getUserById(userId, true);
    if (!user) {
        throw { type: 'not_found', error: { en: 'User not found', it: 'Utente non trovato' } };
    }

    // Verify current password
    const isValid = await verifyPassword(user.password_hash, currentPassword);
    if (!isValid) {
        throw { type: 'auth', error: { en: 'Current password is incorrect', it: 'Password attuale non corretta' } };
    }

    // Validate new password
    const passwordValidation = security.passwordPolicy.validate(newPassword);
    if (!passwordValidation.valid) {
        throw { type: 'validation', errors: passwordValidation.errors };
    }

    // Check password is different
    if (currentPassword === newPassword) {
        throw {
            type: 'validation',
            error: { en: 'New password must be different from current', it: 'La nuova password deve essere diversa dalla attuale' }
        };
    }

    // Hash and update
    const newHash = await hashPassword(newPassword);
    await db.query(`
        UPDATE auth_users
        SET password_hash = $1, password_changed_at = NOW(), must_change_password = false
        WHERE id = $2
    `, [newHash, userId]);

    return true;
}

/**
 * Reset password (admin or forgot password flow)
 * @param {string} userId - User ID
 * @param {string} newPassword - New password
 * @returns {Promise<boolean>} Success
 */
async function resetPassword(userId, newPassword) {
    // Validate new password
    const passwordValidation = security.passwordPolicy.validate(newPassword);
    if (!passwordValidation.valid) {
        throw { type: 'validation', errors: passwordValidation.errors };
    }

    const newHash = await hashPassword(newPassword);
    await db.query(`
        UPDATE auth_users
        SET password_hash = $1, password_changed_at = NOW(),
            failed_login_attempts = 0, locked_until = NULL, must_change_password = false
        WHERE id = $2
    `, [newHash, userId]);

    return true;
}

/**
 * Change user role (admin only)
 * @param {string} userId - Target user ID
 * @param {string} newRole - New role
 * @param {string} changedBy - Admin user ID
 * @returns {Promise<Object>} Updated user
 */
async function changeRole(userId, newRole, changedBy) {
    const roleValidation = validateRole(newRole);
    if (!roleValidation.valid) {
        throw { type: 'validation', error: roleValidation.error };
    }

    // Get the admin making the change
    const admin = await getUserById(changedBy);
    if (!admin || !security.roles.canManageRole(admin.role, newRole)) {
        throw {
            type: 'forbidden',
            error: { en: 'Cannot assign this role', it: 'Non puoi assegnare questo ruolo' }
        };
    }

    const result = await db.query(`
        UPDATE auth_users
        SET role = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING id, email, first_name, last_name, role, status
    `, [newRole, userId]);

    if (result.rows.length === 0) {
        throw { type: 'not_found', error: { en: 'User not found', it: 'Utente non trovato' } };
    }

    return result.rows[0];
}

// =============================================================================
// User Status Management
// =============================================================================

/**
 * Activate user (after email verification or admin approval)
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Updated user
 */
async function activateUser(userId) {
    const result = await db.query(`
        UPDATE auth_users
        SET status = 'active', updated_at = NOW()
        WHERE id = $1
        RETURNING id, email, first_name, last_name, role, status
    `, [userId]);

    if (result.rows.length === 0) {
        throw { type: 'not_found', error: { en: 'User not found', it: 'Utente non trovato' } };
    }

    return result.rows[0];
}

/**
 * Verify user email
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Updated user
 */
async function verifyEmail(userId) {
    // Get current settings
    const settings = await getSettings();

    let newStatus = 'active';
    if (settings.registration_requires_approval) {
        newStatus = 'pending_approval';
    }

    const result = await db.query(`
        UPDATE auth_users
        SET is_email_verified = true, email_verified_at = NOW(),
            status = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING id, email, first_name, last_name, role, status, language
    `, [newStatus, userId]);

    if (result.rows.length === 0) {
        throw { type: 'not_found', error: { en: 'User not found', it: 'Utente non trovato' } };
    }

    return result.rows[0];
}

/**
 * Lock user account
 * @param {string} userId - User ID
 * @param {number} minutes - Lock duration in minutes
 * @param {string} reason - Lock reason
 * @returns {Promise<Object>} Updated user
 */
async function lockUser(userId, minutes = null, reason = 'admin_action') {
    const lockedUntil = minutes
        ? new Date(Date.now() + minutes * 60 * 1000)
        : null;  // Indefinite

    const result = await db.query(`
        UPDATE auth_users
        SET status = 'locked', locked_until = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING id, email, first_name, last_name, status, locked_until
    `, [lockedUntil, userId]);

    if (result.rows.length === 0) {
        throw { type: 'not_found', error: { en: 'User not found', it: 'Utente non trovato' } };
    }

    return result.rows[0];
}

/**
 * Unlock user account
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Updated user
 */
async function unlockUser(userId) {
    const result = await db.query(`
        UPDATE auth_users
        SET status = 'active', locked_until = NULL,
            failed_login_attempts = 0, updated_at = NOW()
        WHERE id = $1
        RETURNING id, email, first_name, last_name, status
    `, [userId]);

    if (result.rows.length === 0) {
        throw { type: 'not_found', error: { en: 'User not found', it: 'Utente non trovato' } };
    }

    return result.rows[0];
}

/**
 * Suspend user account
 * @param {string} userId - User ID
 * @param {string} reason - Suspension reason
 * @returns {Promise<Object>} Updated user
 */
async function suspendUser(userId, reason = null) {
    const result = await db.query(`
        UPDATE auth_users
        SET status = 'suspended', updated_at = NOW()
        WHERE id = $1
        RETURNING id, email, first_name, last_name, status
    `, [userId]);

    if (result.rows.length === 0) {
        throw { type: 'not_found', error: { en: 'User not found', it: 'Utente non trovato' } };
    }

    return result.rows[0];
}

/**
 * Deactivate user permanently
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} Success
 */
async function deactivateUser(userId) {
    await db.query(`
        UPDATE auth_users
        SET status = 'deactivated', updated_at = NOW()
        WHERE id = $1
    `, [userId]);

    // Revoke all sessions
    const tokenService = require('./token.service');
    await tokenService.revokeAllSessions(userId, 'account_deactivated');

    return true;
}

/**
 * Extend user expiration
 * @param {string} userId - User ID
 * @param {number} days - Days to add
 * @returns {Promise<Object>} Updated user
 */
async function extendExpiry(userId, days) {
    const result = await db.query(`
        UPDATE auth_users
        SET expires_at = COALESCE(expires_at, NOW()) + ($1 || ' days')::INTERVAL,
            expiry_warning_sent = false, status = 'active', updated_at = NOW()
        WHERE id = $2
        RETURNING id, email, first_name, last_name, status, expires_at
    `, [days, userId]);

    if (result.rows.length === 0) {
        throw { type: 'not_found', error: { en: 'User not found', it: 'Utente non trovato' } };
    }

    return result.rows[0];
}

// =============================================================================
// User Approval
// =============================================================================

/**
 * Approve a pending user
 * @param {string} userId - User ID to approve
 * @param {string} approvedBy - Admin user ID
 * @param {string} notes - Approval notes (optional)
 * @returns {Promise<Object>} Approved user
 */
async function approveUser(userId, approvedBy, notes = null) {
    const result = await db.query(`
        UPDATE auth_users
        SET status = 'active', approved_by = $1, approved_at = NOW(),
            approval_notes = $2, updated_at = NOW()
        WHERE id = $3 AND status = 'pending_approval'
        RETURNING id, email, first_name, last_name, role, status, language, org_id
    `, [approvedBy, notes, userId]);

    if (result.rows.length === 0) {
        throw { type: 'not_found', error: { en: 'User not found or not pending approval', it: 'Utente non trovato o non in attesa di approvazione' } };
    }

    return result.rows[0];
}

/**
 * Reject a pending user
 * @param {string} userId - User ID to reject
 * @param {string} rejectedBy - Admin user ID
 * @param {string} reason - Rejection reason
 * @returns {Promise<Object>} Rejected user info
 */
async function rejectUser(userId, rejectedBy, reason = null) {
    const user = await getUserById(userId);
    if (!user || user.status !== 'pending_approval') {
        throw { type: 'not_found', error: { en: 'User not found or not pending approval', it: 'Utente non trovato o non in attesa di approvazione' } };
    }

    await db.query(`
        UPDATE auth_users
        SET status = 'deactivated', approval_notes = $1, updated_at = NOW()
        WHERE id = $2
    `, [reason, userId]);

    return { ...user, rejectionReason: reason };
}

/**
 * Get pending approvals
 * @param {string} orgId - Filter by organization (optional)
 * @returns {Promise<Array>} Pending users
 */
async function getPendingApprovals(orgId = null) {
    let query = `
        SELECT id, email, first_name, last_name, phone, language, org_id, created_at
        FROM auth_users
        WHERE status = 'pending_approval'
    `;
    const params = [];

    if (orgId) {
        query += ' AND org_id = $1';
        params.push(orgId);
    }

    query += ' ORDER BY created_at ASC';

    const result = await db.query(query, params);
    return result.rows;
}

// =============================================================================
// User Listing and Search
// =============================================================================

/**
 * Get all users with pagination and filters
 * @param {Object} options - Query options
 * @returns {Promise<Object>} { users, total, page, limit }
 */
async function getUsers(options = {}) {
    const {
        page = 1,
        limit = 20,
        status = null,
        role = null,
        orgId = null,
        search = null,
        sortBy = 'created_at',
        sortOrder = 'DESC'
    } = options;

    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (status) {
        conditions.push(`status = $${paramIndex++}`);
        params.push(status);
    }

    if (role) {
        conditions.push(`role = $${paramIndex++}`);
        params.push(role);
    }

    if (orgId) {
        conditions.push(`org_id = $${paramIndex++}`);
        params.push(orgId);
    }

    if (search) {
        conditions.push(`(
            email ILIKE $${paramIndex} OR
            first_name ILIKE $${paramIndex} OR
            last_name ILIKE $${paramIndex}
        )`);
        params.push(`%${search}%`);
        paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Valid sort columns
    const validSortColumns = ['created_at', 'email', 'first_name', 'last_name', 'role', 'status', 'last_login_at'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Get total count
    const countResult = await db.query(
        `SELECT COUNT(*) FROM auth_users ${whereClause}`,
        params
    );
    const total = parseInt(countResult.rows[0].count);

    // Get users
    params.push(limit, offset);
    const result = await db.query(`
        SELECT id, email, first_name, last_name, phone, avatar_url, language,
               role, org_id, status, is_email_verified, expires_at,
               last_login_at, created_at, updated_at
        FROM auth_users
        ${whereClause}
        ORDER BY ${sortColumn} ${order}
        LIMIT $${paramIndex++} OFFSET $${paramIndex}
    `, params);

    return {
        users: result.rows,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
}

/**
 * Get users by organization
 * @param {string} orgId - Organization ID
 * @returns {Promise<Array>} Users
 */
async function getUsersByOrganization(orgId) {
    const result = await db.query(`
        SELECT id, email, first_name, last_name, role, status, last_login_at
        FROM auth_users
        WHERE org_id = $1 AND status != 'deactivated'
        ORDER BY role, last_name, first_name
    `, [orgId]);

    return result.rows;
}

// =============================================================================
// Settings Management
// =============================================================================

/**
 * Get auth settings
 * @returns {Promise<Object>} Settings
 */
async function getSettings() {
    const result = await db.query('SELECT * FROM auth_settings WHERE id = 1');
    return result.rows[0] || {};
}

/**
 * Update auth settings
 * @param {Object} settings - Settings to update
 * @returns {Promise<Object>} Updated settings
 */
async function updateSettings(settings) {
    const allowedFields = [
        'registration_requires_approval',
        'registration_requires_email_verification',
        'allowed_email_domains',
        'account_expiry_days',
        'lockout_threshold',
        'lockout_duration_minutes',
        'max_sessions_per_user'
    ];

    const updates = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(settings)) {
        if (allowedFields.includes(key)) {
            updates.push(`${key} = $${paramIndex++}`);
            values.push(value);
        }
    }

    if (updates.length === 0) {
        return getSettings();
    }

    const result = await db.query(`
        UPDATE auth_settings
        SET ${updates.join(', ')}, updated_at = NOW()
        WHERE id = 1
        RETURNING *
    `, values);

    return result.rows[0];
}

/**
 * Get admins for notification (when new user registers with approval required)
 * @param {string} orgId - Organization ID (optional)
 * @returns {Promise<Array>} Admin users
 */
async function getAdminsForNotification(orgId = null) {
    let query = `
        SELECT id, email, first_name, language
        FROM auth_users
        WHERE role IN ('super_admin', 'admin')
          AND status = 'active'
    `;
    const params = [];

    if (orgId) {
        query += ' AND (org_id = $1 OR role = \'super_admin\')';
        params.push(orgId);
    }

    const result = await db.query(query, params);
    return result.rows;
}

// =============================================================================
// Exports
// =============================================================================

module.exports = {
    // CRUD
    createUser,
    getUserById,
    getUserByEmail,
    updateUser,
    changePassword,
    resetPassword,
    changeRole,

    // Status management
    activateUser,
    verifyEmail,
    lockUser,
    unlockUser,
    suspendUser,
    deactivateUser,
    extendExpiry,

    // Approval
    approveUser,
    rejectUser,
    getPendingApprovals,

    // Listing
    getUsers,
    getUsersByOrganization,

    // Settings
    getSettings,
    updateSettings,
    getAdminsForNotification
};
