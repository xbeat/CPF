/**
 * CPF Auth Module - User Management Routes
 * Admin operations for user management
 */

const express = require('express');
const router = express.Router();

const userService = require('../services/user.service');
const authService = require('../services/auth.service');
const tokenService = require('../services/token.service');
const emailService = require('../services/email.service');
const { authenticate, requireRole, requirePermission, requireOwnerOrAdmin, getClientIP } = require('../middleware/auth');
const { adminLimiter, strictLimiter } = require('../middleware/rateLimiter');
const { auditAdminAction } = require('../middleware/auditLog');

// Get base URL from environment
const getBaseUrl = (req) => {
    return process.env.AUTH_BASE_URL ||
           `${req.protocol}://${req.get('host')}`;
};

// Apply admin limiter to all routes
router.use(adminLimiter);

// =============================================================================
// User Listing
// =============================================================================

/**
 * GET /api/auth/users
 * List all users with pagination and filters
 */
router.get('/', authenticate, requirePermission('users:read'), async (req, res, next) => {
    try {
        const options = {
            page: parseInt(req.query.page) || 1,
            limit: Math.min(parseInt(req.query.limit) || 20, 100),
            status: req.query.status,
            role: req.query.role,
            orgId: req.user.role === 'super_admin' ? req.query.orgId : req.user.orgId,
            search: req.query.search,
            sortBy: req.query.sortBy || 'created_at',
            sortOrder: req.query.sortOrder || 'DESC'
        };

        // Non-super admins can only see their org
        if (req.user.role !== 'super_admin' && req.query.orgId && req.query.orgId !== req.user.orgId) {
            return res.status(403).json({
                success: false,
                error: {
                    en: 'Cannot access users from other organizations',
                    it: 'Non puoi accedere agli utenti di altre organizzazioni'
                },
                code: 'ORG_ACCESS_DENIED'
            });
        }

        const result = await userService.getUsers(options);

        res.set('X-Total-Count', result.total);
        res.set('X-Total-Pages', result.totalPages);

        res.json({
            success: true,
            users: result.users.map(formatUserForResponse),
            pagination: {
                page: result.page,
                limit: result.limit,
                total: result.total,
                totalPages: result.totalPages
            }
        });
    } catch (error) {
        handleUserError(error, res);
    }
});

/**
 * GET /api/auth/users/pending
 * Get users pending approval
 */
router.get('/pending', authenticate, requirePermission('users:approve'), async (req, res, next) => {
    try {
        const orgId = req.user.role === 'super_admin' ? req.query.orgId : req.user.orgId;
        const pendingUsers = await userService.getPendingApprovals(orgId);

        res.json({
            success: true,
            users: pendingUsers.map(formatUserForResponse)
        });
    } catch (error) {
        handleUserError(error, res);
    }
});

/**
 * GET /api/auth/users/:userId
 * Get a specific user
 */
router.get('/:userId', authenticate, requireOwnerOrAdmin(), async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    en: 'User not found',
                    it: 'Utente non trovato'
                },
                code: 'USER_NOT_FOUND'
            });
        }

        // Check org access for admins
        if (req.user.role === 'admin' && user.org_id !== req.user.orgId) {
            return res.status(403).json({
                success: false,
                error: {
                    en: 'Cannot access users from other organizations',
                    it: 'Non puoi accedere agli utenti di altre organizzazioni'
                },
                code: 'ORG_ACCESS_DENIED'
            });
        }

        res.json({
            success: true,
            user: formatUserForResponse(user)
        });
    } catch (error) {
        handleUserError(error, res);
    }
});

// =============================================================================
// User Creation (Admin)
// =============================================================================

/**
 * POST /api/auth/users
 * Create a new user (admin)
 */
router.post('/', authenticate, requirePermission('users:create'), strictLimiter, auditAdminAction('user_created'), async (req, res, next) => {
    try {
        const userData = {
            ...req.body,
            // Admins can bypass email verification
            skipEmailVerification: req.body.skipEmailVerification === true
        };

        // Non-super admins can only create users in their org
        if (req.user.role !== 'super_admin') {
            userData.orgId = req.user.orgId;
        }

        // Check role assignment permissions
        if (userData.role && !canAssignRole(req.user.role, userData.role)) {
            return res.status(403).json({
                success: false,
                error: {
                    en: 'Cannot assign this role',
                    it: 'Non puoi assegnare questo ruolo'
                },
                code: 'ROLE_FORBIDDEN'
            });
        }

        const user = await userService.createUser(userData, req.user.id);

        // If not skipping email verification, send verification email
        if (!userData.skipEmailVerification) {
            const { token } = await tokenService.generateEmailVerificationToken(user.id, user.email);
            await emailService.sendVerificationEmail(user, token, getBaseUrl(req));
        } else {
            // Directly activate and send welcome email
            await userService.activateUser(user.id);
            await emailService.sendWelcomeEmail(user, `${getBaseUrl(req)}/login`);
        }

        res.status(201).json({
            success: true,
            user: formatUserForResponse(user),
            message: userData.skipEmailVerification
                ? { en: 'User created and activated', it: 'Utente creato e attivato' }
                : { en: 'User created. Verification email sent.', it: 'Utente creato. Email di verifica inviata.' }
        });
    } catch (error) {
        handleUserError(error, res);
    }
});

// =============================================================================
// User Updates
// =============================================================================

/**
 * PUT /api/auth/users/:userId
 * Update a user
 */
router.put('/:userId', authenticate, requireOwnerOrAdmin(), auditAdminAction('user_updated'), async (req, res, next) => {
    try {
        const { userId } = req.params;
        const targetUser = await userService.getUserById(userId);

        if (!targetUser) {
            return res.status(404).json({
                success: false,
                error: {
                    en: 'User not found',
                    it: 'Utente non trovato'
                },
                code: 'USER_NOT_FOUND'
            });
        }

        // Check org access
        if (req.user.role === 'admin' && targetUser.org_id !== req.user.orgId) {
            return res.status(403).json({
                success: false,
                error: {
                    en: 'Cannot modify users from other organizations',
                    it: 'Non puoi modificare utenti di altre organizzazioni'
                },
                code: 'ORG_ACCESS_DENIED'
            });
        }

        // Non-admin users can only update their own profile
        if (!['super_admin', 'admin'].includes(req.user.role) && req.user.id !== userId) {
            return res.status(403).json({
                success: false,
                error: {
                    en: 'Access denied',
                    it: 'Accesso negato'
                },
                code: 'ACCESS_DENIED'
            });
        }

        const user = await userService.updateUser(userId, req.body);

        res.json({
            success: true,
            user: formatUserForResponse(user)
        });
    } catch (error) {
        handleUserError(error, res);
    }
});

/**
 * PATCH /api/auth/users/:userId/role
 * Change user role
 */
router.patch('/:userId/role', authenticate, requirePermission('users:update'), strictLimiter, auditAdminAction('role_changed'), async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!role) {
            return res.status(400).json({
                success: false,
                error: {
                    en: 'Role is required',
                    it: 'Ruolo richiesto'
                },
                code: 'ROLE_REQUIRED'
            });
        }

        // Check permissions
        if (!canAssignRole(req.user.role, role)) {
            return res.status(403).json({
                success: false,
                error: {
                    en: 'Cannot assign this role',
                    it: 'Non puoi assegnare questo ruolo'
                },
                code: 'ROLE_FORBIDDEN'
            });
        }

        const user = await userService.changeRole(userId, role, req.user.id);

        // Log the action
        await authService.logAuditEvent(
            'role_changed',
            req.user.id,
            userId,
            { ip: getClientIP(req), userAgent: req.headers['user-agent'] },
            { newRole: role }
        );

        res.json({
            success: true,
            user: formatUserForResponse(user),
            message: {
                en: `Role changed to ${role}`,
                it: `Ruolo cambiato in ${role}`
            }
        });
    } catch (error) {
        handleUserError(error, res);
    }
});

// =============================================================================
// User Status Management
// =============================================================================

/**
 * POST /api/auth/users/:userId/approve
 * Approve a pending user
 */
router.post('/:userId/approve', authenticate, requirePermission('users:approve'), auditAdminAction('user_approved'), async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { notes, role, orgId } = req.body;

        const user = await userService.approveUser(userId, req.user.id, notes);

        // Optionally update role and org
        if (role && canAssignRole(req.user.role, role)) {
            await userService.changeRole(userId, role, req.user.id);
            user.role = role;
        }

        if (orgId && req.user.role === 'super_admin') {
            await userService.updateUser(userId, { org_id: orgId });
            user.org_id = orgId;
        }

        // Send approval email
        await emailService.sendApprovalGrantedEmail(user, `${getBaseUrl(req)}/login`);

        res.json({
            success: true,
            user: formatUserForResponse(user),
            message: {
                en: 'User approved successfully',
                it: 'Utente approvato con successo'
            }
        });
    } catch (error) {
        handleUserError(error, res);
    }
});

/**
 * POST /api/auth/users/:userId/reject
 * Reject a pending user
 */
router.post('/:userId/reject', authenticate, requirePermission('users:approve'), auditAdminAction('user_rejected'), async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { reason } = req.body;

        const result = await userService.rejectUser(userId, req.user.id, reason);

        // Send rejection email
        await emailService.sendApprovalRejectedEmail(result, reason);

        res.json({
            success: true,
            message: {
                en: 'User registration rejected',
                it: 'Registrazione utente rifiutata'
            }
        });
    } catch (error) {
        handleUserError(error, res);
    }
});

/**
 * POST /api/auth/users/:userId/lock
 * Lock a user account
 */
router.post('/:userId/lock', authenticate, requirePermission('users:lock'), auditAdminAction('user_locked'), async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { duration, reason } = req.body;

        // Cannot lock yourself or higher-ranked users
        if (userId === req.user.id) {
            return res.status(400).json({
                success: false,
                error: {
                    en: 'Cannot lock your own account',
                    it: 'Non puoi bloccare il tuo account'
                },
                code: 'SELF_LOCK_FORBIDDEN'
            });
        }

        const targetUser = await userService.getUserById(userId);
        if (!targetUser) {
            return res.status(404).json({
                success: false,
                error: {
                    en: 'User not found',
                    it: 'Utente non trovato'
                },
                code: 'USER_NOT_FOUND'
            });
        }

        if (!canManageUser(req.user.role, targetUser.role)) {
            return res.status(403).json({
                success: false,
                error: {
                    en: 'Cannot lock this user',
                    it: 'Non puoi bloccare questo utente'
                },
                code: 'LOCK_FORBIDDEN'
            });
        }

        const user = await userService.lockUser(userId, duration, reason);

        // Revoke all sessions
        await tokenService.revokeAllSessions(userId, 'admin_lock');

        // Send notification email
        await emailService.sendAccountLockedEmail(targetUser, {
            failedAttempts: 0,
            lockedUntil: user.locked_until || 'Indefinite',
            ip: 'Admin action'
        });

        res.json({
            success: true,
            user: formatUserForResponse(user),
            message: {
                en: duration
                    ? `User locked for ${duration} minutes`
                    : 'User locked indefinitely',
                it: duration
                    ? `Utente bloccato per ${duration} minuti`
                    : 'Utente bloccato indefinitamente'
            }
        });
    } catch (error) {
        handleUserError(error, res);
    }
});

/**
 * POST /api/auth/users/:userId/unlock
 * Unlock a user account
 */
router.post('/:userId/unlock', authenticate, requirePermission('users:unlock'), auditAdminAction('user_unlocked'), async (req, res, next) => {
    try {
        const { userId } = req.params;

        const user = await userService.unlockUser(userId);

        res.json({
            success: true,
            user: formatUserForResponse(user),
            message: {
                en: 'User unlocked successfully',
                it: 'Utente sbloccato con successo'
            }
        });
    } catch (error) {
        handleUserError(error, res);
    }
});

/**
 * POST /api/auth/users/:userId/suspend
 * Suspend a user account
 */
router.post('/:userId/suspend', authenticate, requirePermission('users:lock'), auditAdminAction('user_suspended'), async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { reason } = req.body;

        const targetUser = await userService.getUserById(userId);
        if (!targetUser || !canManageUser(req.user.role, targetUser.role)) {
            return res.status(403).json({
                success: false,
                error: {
                    en: 'Cannot suspend this user',
                    it: 'Non puoi sospendere questo utente'
                },
                code: 'SUSPEND_FORBIDDEN'
            });
        }

        const user = await userService.suspendUser(userId, reason);
        await tokenService.revokeAllSessions(userId, 'admin_suspend');

        res.json({
            success: true,
            user: formatUserForResponse(user),
            message: {
                en: 'User suspended',
                it: 'Utente sospeso'
            }
        });
    } catch (error) {
        handleUserError(error, res);
    }
});

/**
 * POST /api/auth/users/:userId/activate
 * Activate a suspended user
 */
router.post('/:userId/activate', authenticate, requirePermission('users:unlock'), auditAdminAction('user_activated'), async (req, res, next) => {
    try {
        const { userId } = req.params;

        const user = await userService.activateUser(userId);

        res.json({
            success: true,
            user: formatUserForResponse(user),
            message: {
                en: 'User activated',
                it: 'Utente attivato'
            }
        });
    } catch (error) {
        handleUserError(error, res);
    }
});

/**
 * DELETE /api/auth/users/:userId
 * Deactivate a user permanently
 */
router.delete('/:userId', authenticate, requirePermission('users:delete'), strictLimiter, auditAdminAction('user_deleted'), async (req, res, next) => {
    try {
        const { userId } = req.params;

        if (userId === req.user.id) {
            return res.status(400).json({
                success: false,
                error: {
                    en: 'Cannot delete your own account',
                    it: 'Non puoi eliminare il tuo account'
                },
                code: 'SELF_DELETE_FORBIDDEN'
            });
        }

        const targetUser = await userService.getUserById(userId);
        if (!targetUser || !canManageUser(req.user.role, targetUser.role)) {
            return res.status(403).json({
                success: false,
                error: {
                    en: 'Cannot delete this user',
                    it: 'Non puoi eliminare questo utente'
                },
                code: 'DELETE_FORBIDDEN'
            });
        }

        await userService.deactivateUser(userId);

        res.json({
            success: true,
            message: {
                en: 'User deactivated',
                it: 'Utente disattivato'
            }
        });
    } catch (error) {
        handleUserError(error, res);
    }
});

/**
 * POST /api/auth/users/:userId/extend
 * Extend user expiration
 */
router.post('/:userId/extend', authenticate, requirePermission('users:update'), auditAdminAction('expiry_extended'), async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { days } = req.body;

        if (!days || days < 1 || days > 3650) {
            return res.status(400).json({
                success: false,
                error: {
                    en: 'Days must be between 1 and 3650',
                    it: 'I giorni devono essere tra 1 e 3650'
                },
                code: 'INVALID_DAYS'
            });
        }

        const user = await userService.extendExpiry(userId, days);

        res.json({
            success: true,
            user: formatUserForResponse(user),
            message: {
                en: `Expiration extended by ${days} days`,
                it: `Scadenza estesa di ${days} giorni`
            }
        });
    } catch (error) {
        handleUserError(error, res);
    }
});

// =============================================================================
// Admin Settings
// =============================================================================

/**
 * GET /api/auth/users/settings
 * Get auth settings
 */
router.get('/admin/settings', authenticate, requireRole('super_admin'), async (req, res, next) => {
    try {
        const settings = await userService.getSettings();

        res.json({
            success: true,
            settings
        });
    } catch (error) {
        handleUserError(error, res);
    }
});

/**
 * PUT /api/auth/users/settings
 * Update auth settings
 */
router.put('/admin/settings', authenticate, requireRole('super_admin'), strictLimiter, auditAdminAction('settings_changed'), async (req, res, next) => {
    try {
        const settings = await userService.updateSettings(req.body);

        res.json({
            success: true,
            settings,
            message: {
                en: 'Settings updated',
                it: 'Impostazioni aggiornate'
            }
        });
    } catch (error) {
        handleUserError(error, res);
    }
});

// =============================================================================
// Audit Log
// =============================================================================

/**
 * GET /api/auth/users/audit
 * Get audit log
 */
router.get('/admin/audit', authenticate, requirePermission('audit:read'), async (req, res, next) => {
    try {
        const options = {
            userId: req.query.userId,
            action: req.query.action,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            page: parseInt(req.query.page) || 1,
            limit: Math.min(parseInt(req.query.limit) || 50, 100)
        };

        const result = await authService.getAuditLog(options);

        res.set('X-Total-Count', result.total);
        res.set('X-Total-Pages', result.totalPages);

        res.json({
            success: true,
            entries: result.entries,
            pagination: {
                page: result.page,
                limit: result.limit,
                total: result.total,
                totalPages: result.totalPages
            }
        });
    } catch (error) {
        handleUserError(error, res);
    }
});

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Format user object for API response
 * @param {Object} user - User object
 * @returns {Object} Formatted user
 */
function formatUserForResponse(user) {
    return {
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
        expiresAt: user.expires_at,
        lastLoginAt: user.last_login_at,
        createdAt: user.created_at,
        updatedAt: user.updated_at
    };
}

/**
 * Check if a role can assign another role
 * @param {string} assignerRole - Role of the user assigning
 * @param {string} targetRole - Role to assign
 * @returns {boolean} Whether assignment is allowed
 */
function canAssignRole(assignerRole, targetRole) {
    const hierarchy = { viewer: 1, auditor: 2, admin: 3, super_admin: 4 };
    return hierarchy[assignerRole] > hierarchy[targetRole];
}

/**
 * Check if a role can manage another user
 * @param {string} managerRole - Role of the manager
 * @param {string} targetRole - Role of the target user
 * @returns {boolean} Whether management is allowed
 */
function canManageUser(managerRole, targetRole) {
    const hierarchy = { viewer: 1, auditor: 2, admin: 3, super_admin: 4 };
    return hierarchy[managerRole] >= hierarchy[targetRole];
}

/**
 * Handle user management errors
 * @param {Object} error - Error object
 * @param {Object} res - Express response
 */
function handleUserError(error, res) {
    console.error('[USER ERROR]', error);

    switch (error.type) {
        case 'validation':
            return res.status(400).json({
                success: false,
                error: error.error || error.errors?.[0] || { en: 'Validation error', it: 'Errore di validazione' },
                errors: error.errors,
                code: 'VALIDATION_ERROR'
            });

        case 'not_found':
            return res.status(404).json({
                success: false,
                error: error.error,
                code: 'NOT_FOUND'
            });

        case 'conflict':
            return res.status(409).json({
                success: false,
                error: error.error,
                code: 'CONFLICT'
            });

        case 'forbidden':
            return res.status(403).json({
                success: false,
                error: error.error,
                code: 'FORBIDDEN'
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
