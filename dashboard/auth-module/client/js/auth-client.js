/**
 * CPF Auth Module - Client-Side Authentication Library
 * Handles API calls, token management, and common utilities
 */

// =============================================================================
// Configuration
// =============================================================================

const AUTH_CONFIG = {
    apiUrl: window.location.origin + '/api/auth',
    tokenKey: 'cpf_access_token',
    refreshKey: 'cpf_refresh_token',
    userKey: 'cpf_user'
};

// =============================================================================
// Auth API
// =============================================================================

const authApi = {
    /**
     * Login
     * @param {Object} credentials - { email, password }
     * @returns {Promise<Object>} Response
     */
    async login(credentials) {
        return apiRequest('/login', 'POST', credentials);
    },

    /**
     * Register
     * @param {Object} userData - User registration data
     * @returns {Promise<Object>} Response
     */
    async register(userData) {
        return apiRequest('/register', 'POST', userData);
    },

    /**
     * Forgot password
     * @param {string} email - User email
     * @returns {Promise<Object>} Response
     */
    async forgotPassword(email) {
        return apiRequest('/password/forgot', 'POST', { email });
    },

    /**
     * Verify reset token
     * @param {string} token - Reset token
     * @returns {Promise<Object>} Response
     */
    async verifyResetToken(token) {
        return apiRequest(`/password/verify-token?token=${encodeURIComponent(token)}`, 'GET');
    },

    /**
     * Reset password
     * @param {string} token - Reset token
     * @param {string} password - New password
     * @param {string} confirmPassword - Confirm password
     * @returns {Promise<Object>} Response
     */
    async resetPassword(token, password, confirmPassword) {
        return apiRequest('/password/reset', 'POST', { token, password, confirmPassword });
    },

    /**
     * Verify email
     * @param {string} token - Verification token
     * @returns {Promise<Object>} Response
     */
    async verifyEmail(token) {
        return apiRequest('/verify-email', 'POST', { token });
    },

    /**
     * Resend verification email
     * @param {string} email - User email
     * @returns {Promise<Object>} Response
     */
    async resendVerification(email) {
        return apiRequest('/resend-verification', 'POST', { email });
    },

    /**
     * Logout
     * @returns {Promise<Object>} Response
     */
    async logout() {
        try {
            await apiRequest('/logout', 'POST', {}, true);
        } finally {
            this.clearTokens();
        }
    },

    /**
     * Logout from all devices
     * @param {boolean} keepCurrent - Keep current session
     * @returns {Promise<Object>} Response
     */
    async logoutAll(keepCurrent = false) {
        return apiRequest('/logout-all', 'POST', { keepCurrent }, true);
    },

    /**
     * Refresh tokens
     * @returns {Promise<Object>} Response
     */
    async refresh() {
        return apiRequest('/refresh', 'POST', {});
    },

    /**
     * Get current user
     * @returns {Promise<Object>} Response
     */
    async getMe() {
        return apiRequest('/me', 'GET', null, true);
    },

    /**
     * Update profile
     * @param {Object} updates - Profile updates
     * @returns {Promise<Object>} Response
     */
    async updateProfile(updates) {
        return apiRequest('/me', 'PATCH', updates, true);
    },

    /**
     * Change password
     * @param {Object} data - { currentPassword, newPassword, confirmPassword }
     * @returns {Promise<Object>} Response
     */
    async changePassword(data) {
        return apiRequest('/password/change', 'POST', data, true);
    },

    /**
     * Get active sessions
     * @returns {Promise<Object>} Response
     */
    async getSessions() {
        return apiRequest('/sessions', 'GET', null, true);
    },

    /**
     * Revoke a session
     * @param {string} sessionId - Session ID
     * @returns {Promise<Object>} Response
     */
    async revokeSession(sessionId) {
        return apiRequest(`/sessions/${sessionId}`, 'DELETE', null, true);
    },

    /**
     * Get public settings
     * @returns {Promise<Object>} Response
     */
    async getPublicSettings() {
        return apiRequest('/settings/public', 'GET');
    },

    // Token management
    setTokens(accessToken) {
        localStorage.setItem(AUTH_CONFIG.tokenKey, accessToken);
    },

    getToken() {
        return localStorage.getItem(AUTH_CONFIG.tokenKey);
    },

    clearTokens() {
        localStorage.removeItem(AUTH_CONFIG.tokenKey);
        localStorage.removeItem(AUTH_CONFIG.userKey);
    },

    setUser(user) {
        localStorage.setItem(AUTH_CONFIG.userKey, JSON.stringify(user));
    },

    getUser() {
        const user = localStorage.getItem(AUTH_CONFIG.userKey);
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated() {
        return !!this.getToken();
    }
};

// =============================================================================
// API Request Helper
// =============================================================================

/**
 * Make an API request
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method
 * @param {Object} data - Request body
 * @param {boolean} requiresAuth - Whether to include auth token
 * @returns {Promise<Object>} Response data
 */
async function apiRequest(endpoint, method = 'GET', data = null, requiresAuth = false) {
    const url = AUTH_CONFIG.apiUrl + endpoint;

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Accept-Language': getCurrentLanguage ? getCurrentLanguage() : 'en-US'
        },
        credentials: 'include'  // Include cookies
    };

    // Add auth token if required
    if (requiresAuth) {
        const token = authApi.getToken();
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }
    }

    // Add body for non-GET requests
    if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        if (!response.ok) {
            // Handle token expiration
            if (response.status === 401 && requiresAuth) {
                // Try to refresh token
                try {
                    const refreshResult = await authApi.refresh();
                    if (refreshResult.accessToken) {
                        authApi.setTokens(refreshResult.accessToken);
                        // Retry original request
                        options.headers['Authorization'] = `Bearer ${refreshResult.accessToken}`;
                        const retryResponse = await fetch(url, options);
                        return retryResponse.json();
                    }
                } catch (refreshError) {
                    authApi.clearTokens();
                    window.location.href = '/login?expired=true';
                    throw refreshError;
                }
            }

            throw result;
        }

        return result;
    } catch (error) {
        if (error.error) {
            throw error;
        }
        throw {
            success: false,
            error: {
                en: 'Network error. Please check your connection.',
                it: 'Errore di rete. Controlla la connessione.'
            },
            code: 'NETWORK_ERROR'
        };
    }
}

// =============================================================================
// UI Helpers
// =============================================================================

/**
 * Show an alert message
 * @param {string} type - Alert type (success, error, warning, info)
 * @param {string|Object} message - Message to display
 */
function showAlert(type, message) {
    const container = document.getElementById('alertContainer');
    if (!container) return;

    const text = typeof message === 'object'
        ? (message[getCurrentLanguage ? getCurrentLanguage() : 'en-US'] || message.en || message)
        : message;

    const icons = {
        success: '✅',
        error: '⚠️',
        warning: '⚠️',
        info: 'ℹ️'
    };

    container.innerHTML = `
        <div class="alert alert-${type}">
            <span class="alert-icon">${icons[type] || ''}</span>
            <div class="alert-content">${text}</div>
        </div>
    `;

    // Auto-hide after 5 seconds for success/info
    if (type === 'success' || type === 'info') {
        setTimeout(() => {
            container.innerHTML = '';
        }, 5000);
    }
}

/**
 * Show field error
 * @param {string} fieldName - Field name
 * @param {string|Object} message - Error message
 */
function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const errorEl = document.getElementById(`${fieldName}Error`);

    const text = typeof message === 'object'
        ? (message[getCurrentLanguage ? getCurrentLanguage() : 'en-US'] || message.en || message)
        : message;

    if (field) {
        field.classList.add('error');
    }

    if (errorEl) {
        errorEl.textContent = text;
        errorEl.classList.remove('hidden');
    }
}

/**
 * Clear all errors
 */
function clearErrors() {
    // Clear alerts
    const alertContainer = document.getElementById('alertContainer');
    if (alertContainer) {
        alertContainer.innerHTML = '';
    }

    // Clear field errors
    document.querySelectorAll('.form-input.error').forEach(el => {
        el.classList.remove('error');
    });

    document.querySelectorAll('.form-error').forEach(el => {
        el.classList.add('hidden');
        el.textContent = '';
    });
}

/**
 * Handle API errors
 * @param {Object} error - Error object
 */
function handleApiError(error) {
    console.error('API Error:', error);

    let message = error.error || error.message || getText ? getText('error.generic') : 'An error occurred';

    if (error.code === 'RATE_LIMITED') {
        message = getText ? getText('error.rateLimit') : 'Too many attempts. Please try again later.';
    }

    showAlert('error', message);
}

// =============================================================================
// Validation Helpers
// =============================================================================

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid
 */
function isValidEmail(email) {
    const re = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return re.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {boolean} Is valid
 */
function isValidPassword(password) {
    return password.length >= 12 &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password) &&
           /[0-9]/.test(password) &&
           /[^a-zA-Z0-9]/.test(password);
}

// =============================================================================
// Admin API (for admin pages)
// =============================================================================

const adminApi = {
    /**
     * Get users list
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Response
     */
    async getUsers(options = {}) {
        const params = new URLSearchParams(options).toString();
        return apiRequest(`/users?${params}`, 'GET', null, true);
    },

    /**
     * Get pending approvals
     * @returns {Promise<Object>} Response
     */
    async getPendingApprovals() {
        return apiRequest('/users/pending', 'GET', null, true);
    },

    /**
     * Get user by ID
     * @param {string} userId - User ID
     * @returns {Promise<Object>} Response
     */
    async getUser(userId) {
        return apiRequest(`/users/${userId}`, 'GET', null, true);
    },

    /**
     * Approve user
     * @param {string} userId - User ID
     * @param {Object} data - Approval data
     * @returns {Promise<Object>} Response
     */
    async approveUser(userId, data = {}) {
        return apiRequest(`/users/${userId}/approve`, 'POST', data, true);
    },

    /**
     * Reject user
     * @param {string} userId - User ID
     * @param {string} reason - Rejection reason
     * @returns {Promise<Object>} Response
     */
    async rejectUser(userId, reason = null) {
        return apiRequest(`/users/${userId}/reject`, 'POST', { reason }, true);
    },

    /**
     * Lock user
     * @param {string} userId - User ID
     * @param {number} duration - Lock duration in minutes
     * @param {string} reason - Lock reason
     * @returns {Promise<Object>} Response
     */
    async lockUser(userId, duration = null, reason = null) {
        return apiRequest(`/users/${userId}/lock`, 'POST', { duration, reason }, true);
    },

    /**
     * Unlock user
     * @param {string} userId - User ID
     * @returns {Promise<Object>} Response
     */
    async unlockUser(userId) {
        return apiRequest(`/users/${userId}/unlock`, 'POST', {}, true);
    },

    /**
     * Suspend user
     * @param {string} userId - User ID
     * @param {string} reason - Suspension reason
     * @returns {Promise<Object>} Response
     */
    async suspendUser(userId, reason = null) {
        return apiRequest(`/users/${userId}/suspend`, 'POST', { reason }, true);
    },

    /**
     * Activate user
     * @param {string} userId - User ID
     * @returns {Promise<Object>} Response
     */
    async activateUser(userId) {
        return apiRequest(`/users/${userId}/activate`, 'POST', {}, true);
    },

    /**
     * Delete user
     * @param {string} userId - User ID
     * @returns {Promise<Object>} Response
     */
    async deleteUser(userId) {
        return apiRequest(`/users/${userId}`, 'DELETE', null, true);
    },

    /**
     * Change user role
     * @param {string} userId - User ID
     * @param {string} role - New role
     * @returns {Promise<Object>} Response
     */
    async changeRole(userId, role) {
        return apiRequest(`/users/${userId}/role`, 'PATCH', { role }, true);
    },

    /**
     * Extend user expiry
     * @param {string} userId - User ID
     * @param {number} days - Days to extend
     * @returns {Promise<Object>} Response
     */
    async extendExpiry(userId, days) {
        return apiRequest(`/users/${userId}/extend`, 'POST', { days }, true);
    },

    /**
     * Get audit log
     * @param {Object} options - Query options
     * @returns {Promise<Object>} Response
     */
    async getAuditLog(options = {}) {
        const params = new URLSearchParams(options).toString();
        return apiRequest(`/users/admin/audit?${params}`, 'GET', null, true);
    },

    /**
     * Get settings
     * @returns {Promise<Object>} Response
     */
    async getSettings() {
        return apiRequest('/users/admin/settings', 'GET', null, true);
    },

    /**
     * Update settings
     * @param {Object} settings - Settings to update
     * @returns {Promise<Object>} Response
     */
    async updateSettings(settings) {
        return apiRequest('/users/admin/settings', 'PUT', settings, true);
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { authApi, adminApi, showAlert, showFieldError, clearErrors, handleApiError, isValidEmail, isValidPassword };
}
