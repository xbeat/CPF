/**
 * CPF Auth Module - Email Service
 * Email sending with Resend and template management
 */

const { Resend } = require('resend');
const resendConfig = require('../config/resend');

// Initialize Resend client
let resend = null;

function getResendClient() {
    if (!resend && resendConfig.apiKey) {
        resend = new Resend(resendConfig.apiKey);
    }
    return resend;
}

// =============================================================================
// Core Email Sending
// =============================================================================

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text content (optional)
 * @returns {Promise<Object>} Send result
 */
async function sendEmail({ to, subject, html, text }) {
    const client = getResendClient();

    if (!client) {
        console.warn('[EMAIL] Resend not configured, email not sent:', { to, subject });
        // In development, log the email content
        if (process.env.NODE_ENV === 'development') {
            console.log('[EMAIL DEV] Would send email:');
            console.log('  To:', to);
            console.log('  Subject:', subject);
            console.log('  HTML length:', html?.length || 0);
        }
        return { success: true, dev: true };
    }

    try {
        const result = await client.emails.send({
            from: `${resendConfig.from.name} <${resendConfig.from.email}>`,
            to: [to],
            subject,
            html,
            text: text || stripHtml(html)
        });

        console.log('[EMAIL] Email sent successfully:', { to, subject, id: result.id });
        return { success: true, id: result.id };
    } catch (error) {
        console.error('[EMAIL] Failed to send email:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Strip HTML tags for plain text version
 * @param {string} html - HTML content
 * @returns {string} Plain text
 */
function stripHtml(html) {
    return html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

// =============================================================================
// Template-Based Emails
// =============================================================================

/**
 * Send verification email
 * @param {Object} user - User object
 * @param {string} token - Verification token
 * @param {string} baseUrl - Base URL for verification link
 * @returns {Promise<Object>} Send result
 */
async function sendVerificationEmail(user, token, baseUrl) {
    const lang = user.language || 'en-US';
    const verifyUrl = `${baseUrl}/verify-email?token=${token}`;

    const html = resendConfig.getEmailHtml('verification', lang, {
        firstName: user.first_name,
        verifyUrl
    });

    return sendEmail({
        to: user.email,
        subject: resendConfig.getSubject('verify', lang),
        html
    });
}

/**
 * Send welcome email
 * @param {Object} user - User object
 * @param {string} loginUrl - Login URL
 * @param {boolean} approved - Whether user was approved (vs just verified)
 * @param {string} orgName - Organization name (optional)
 * @returns {Promise<Object>} Send result
 */
async function sendWelcomeEmail(user, loginUrl, approved = false, orgName = null) {
    const lang = user.language || 'en-US';

    const html = resendConfig.getEmailHtml('welcome', lang, {
        firstName: user.first_name,
        email: user.email,
        role: user.role,
        loginUrl,
        approved,
        orgName
    });

    return sendEmail({
        to: user.email,
        subject: resendConfig.getSubject('welcome', lang),
        html
    });
}

/**
 * Send password reset email
 * @param {Object} user - User object
 * @param {string} token - Reset token
 * @param {string} baseUrl - Base URL for reset link
 * @param {Object} requestInfo - Request info (ip, timestamp)
 * @returns {Promise<Object>} Send result
 */
async function sendPasswordResetEmail(user, token, baseUrl, requestInfo = {}) {
    const lang = user.language || 'en-US';
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    const html = resendConfig.getEmailHtml('resetPassword', lang, {
        firstName: user.first_name,
        resetUrl,
        ipAddress: requestInfo.ip,
        timestamp: new Date().toLocaleString(lang === 'it-IT' ? 'it-IT' : 'en-US')
    });

    return sendEmail({
        to: user.email,
        subject: resendConfig.getSubject('reset', lang),
        html
    });
}

/**
 * Send account locked notification
 * @param {Object} user - User object
 * @param {Object} lockInfo - Lock info (attempts, lockedUntil, ip)
 * @returns {Promise<Object>} Send result
 */
async function sendAccountLockedEmail(user, lockInfo) {
    const lang = user.language || 'en-US';

    const html = resendConfig.getEmailHtml('accountLocked', lang, {
        firstName: user.first_name,
        failedAttempts: lockInfo.failedAttempts,
        lockedUntil: new Date(lockInfo.lockedUntil).toLocaleString(lang === 'it-IT' ? 'it-IT' : 'en-US'),
        ipAddress: lockInfo.ip
    });

    return sendEmail({
        to: user.email,
        subject: resendConfig.getSubject('locked', lang),
        html
    });
}

/**
 * Send account expiry warning
 * @param {Object} user - User object
 * @param {Date} expiryDate - Expiry date
 * @param {number} daysRemaining - Days until expiry
 * @returns {Promise<Object>} Send result
 */
async function sendExpiryWarningEmail(user, expiryDate, daysRemaining) {
    const lang = user.language || 'en-US';

    const html = resendConfig.getEmailHtml('expiryWarning', lang, {
        firstName: user.first_name,
        expiryDate: expiryDate.toLocaleDateString(lang === 'it-IT' ? 'it-IT' : 'en-US'),
        daysRemaining
    });

    return sendEmail({
        to: user.email,
        subject: resendConfig.getSubject('expiryWarning', lang),
        html
    });
}

/**
 * Send password changed notification
 * @param {Object} user - User object
 * @param {Object} changeInfo - Change info (ip, timestamp)
 * @returns {Promise<Object>} Send result
 */
async function sendPasswordChangedEmail(user, changeInfo = {}) {
    const lang = user.language || 'en-US';

    const html = resendConfig.getEmailHtml('passwordChanged', lang, {
        firstName: user.first_name,
        ipAddress: changeInfo.ip,
        timestamp: new Date().toLocaleString(lang === 'it-IT' ? 'it-IT' : 'en-US')
    });

    return sendEmail({
        to: user.email,
        subject: resendConfig.getSubject('passwordChanged', lang),
        html
    });
}

/**
 * Send pending approval notification to admins
 * @param {string} adminEmail - Admin email
 * @param {Object} newUser - New user object
 * @param {string} approvalUrl - Approval management URL
 * @param {string} lang - Admin language preference
 * @returns {Promise<Object>} Send result
 */
async function sendPendingApprovalEmail(adminEmail, newUser, approvalUrl, lang = 'en-US') {
    const html = resendConfig.getEmailHtml('pendingApproval', lang, {
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        email: newUser.email,
        timestamp: new Date().toLocaleString(lang === 'it-IT' ? 'it-IT' : 'en-US'),
        approvalUrl
    });

    return sendEmail({
        to: adminEmail,
        subject: lang === 'it-IT' ? 'Nuovo utente in attesa di approvazione' : 'New user pending approval',
        html
    });
}

/**
 * Send approval granted email
 * @param {Object} user - Approved user
 * @param {string} loginUrl - Login URL
 * @param {string} orgName - Organization name (optional)
 * @returns {Promise<Object>} Send result
 */
async function sendApprovalGrantedEmail(user, loginUrl, orgName = null) {
    const lang = user.language || 'en-US';

    const html = resendConfig.getEmailHtml('approved', lang, {
        firstName: user.first_name,
        email: user.email,
        role: user.role,
        loginUrl,
        orgName
    });

    return sendEmail({
        to: user.email,
        subject: resendConfig.getSubject('approved', lang),
        html
    });
}

/**
 * Send approval rejected email
 * @param {Object} user - Rejected user
 * @param {string} reason - Rejection reason (optional)
 * @returns {Promise<Object>} Send result
 */
async function sendApprovalRejectedEmail(user, reason = null) {
    const lang = user.language || 'en-US';

    const html = resendConfig.getEmailHtml('rejected', lang, {
        firstName: user.first_name,
        reason
    });

    return sendEmail({
        to: user.email,
        subject: resendConfig.getSubject('rejected', lang),
        html
    });
}

// =============================================================================
// Batch Operations
// =============================================================================

/**
 * Send expiry warning emails to all users expiring soon
 * @param {number} daysAhead - Days before expiry to warn
 * @returns {Promise<Object>} Results summary
 */
async function sendExpiryWarnings(daysAhead = 7) {
    const db = require('../config/database');

    const result = await db.query(`
        SELECT * FROM get_accounts_expiring_soon($1)
    `, [daysAhead]);

    const sent = [];
    const failed = [];

    for (const user of result.rows) {
        try {
            // Get full user data
            const userData = await db.query(`
                SELECT * FROM auth_users WHERE id = $1
            `, [user.user_id]);

            if (userData.rows[0]) {
                await sendExpiryWarningEmail(
                    userData.rows[0],
                    new Date(user.expires_at),
                    user.days_remaining
                );

                // Mark warning as sent
                await db.query(`
                    UPDATE auth_users SET expiry_warning_sent = true WHERE id = $1
                `, [user.user_id]);

                sent.push(user.email);
            }
        } catch (error) {
            console.error(`[EMAIL] Failed to send expiry warning to ${user.email}:`, error.message);
            failed.push({ email: user.email, error: error.message });
        }
    }

    return { sent, failed };
}

// =============================================================================
// Exports
// =============================================================================

module.exports = {
    sendEmail,
    sendVerificationEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendAccountLockedEmail,
    sendExpiryWarningEmail,
    sendPasswordChangedEmail,
    sendPendingApprovalEmail,
    sendApprovalGrantedEmail,
    sendApprovalRejectedEmail,
    sendExpiryWarnings
};
