/**
 * CPF Auth Module - Profile Page Script
 */

let currentUser = null;
let isEditingPersonal = false;

document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    if (!authApi.isAuthenticated()) {
        window.location.href = '/login';
        return;
    }

    // Initialize i18n
    initI18n();

    // Load user data
    await loadUserData();

    // Load sessions
    await loadSessions();

    // Setup event listeners
    setupUserMenu();
    setupLogout();
    setupPersonalForm();
    setupPasswordForm();
    setupPasswordToggles();
    setupSessionManagement();
});

/**
 * Load user data from API
 */
async function loadUserData() {
    try {
        const response = await authApi.getMe();

        if (response.success && response.user) {
            currentUser = response.user;

            // Update header
            const initials = getInitials(currentUser);
            document.getElementById('userAvatar').textContent = initials;
            document.getElementById('profileAvatar').textContent = initials;
            document.getElementById('userName').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
            document.getElementById('profileName').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
            document.getElementById('profileRole').textContent = formatRole(currentUser.role);

            // Fill form
            document.getElementById('firstName').value = currentUser.firstName || '';
            document.getElementById('lastName').value = currentUser.lastName || '';
            document.getElementById('email').value = currentUser.email || '';
            document.getElementById('phone').value = currentUser.phone || '';
            document.getElementById('language').value = currentUser.language || 'en-US';

            // Account info
            document.getElementById('memberSince').textContent = formatDate(currentUser.createdAt);
            document.getElementById('lastLogin').textContent = currentUser.lastLoginAt
                ? formatDate(currentUser.lastLoginAt)
                : '-';
            document.getElementById('accountExpires').textContent = currentUser.expiresAt
                ? formatDate(currentUser.expiresAt)
                : getText('profile.never') || 'Never';
            document.getElementById('accountStatus').textContent = formatStatus(currentUser.status);

            // Show admin link if applicable
            if (currentUser.role === 'super_admin' || currentUser.role === 'admin') {
                document.getElementById('adminLink').style.display = 'flex';
            }

            // Store user
            authApi.setUser(currentUser);
        }
    } catch (error) {
        console.error('Failed to load user data:', error);
        if (error.code === 'UNAUTHORIZED' || error.code === 'TOKEN_EXPIRED') {
            authApi.clearTokens();
            window.location.href = '/login?expired=true';
        }
    }
}

/**
 * Load active sessions
 */
async function loadSessions() {
    const sessionList = document.getElementById('sessionList');

    try {
        const response = await authApi.getSessions();

        if (response.success && response.sessions) {
            if (response.sessions.length === 0) {
                sessionList.innerHTML = `<p class="text-secondary">${getText('profile.noSessions') || 'No active sessions'}</p>`;
                return;
            }

            sessionList.innerHTML = response.sessions.map(session => `
                <div class="session-item" data-id="${session.id}">
                    <div class="session-info">
                        <div class="session-device">
                            <span>${getDeviceIcon(session.userAgent)}</span>
                            <span>${parseUserAgent(session.userAgent)}</span>
                            ${session.isCurrent ? `<span class="session-current">(${getText('profile.currentSession') || 'Current'})</span>` : ''}
                        </div>
                        <div class="session-details">
                            ${session.ipAddress || 'Unknown IP'} - ${getText('profile.lastActive') || 'Last active'}: ${formatDate(session.lastActivityAt || session.createdAt)}
                        </div>
                    </div>
                    ${!session.isCurrent ? `
                        <button class="btn btn-revoke" data-session-id="${session.id}">
                            ${getText('profile.revoke') || 'Revoke'}
                        </button>
                    ` : ''}
                </div>
            `).join('');

            // Add revoke handlers
            document.querySelectorAll('.btn-revoke').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const sessionId = e.target.dataset.sessionId;
                    await revokeSession(sessionId);
                });
            });
        }
    } catch (error) {
        console.error('Failed to load sessions:', error);
        sessionList.innerHTML = `<p class="text-error">${getText('profile.sessionsError') || 'Failed to load sessions'}</p>`;
    }
}

/**
 * Setup user menu
 */
function setupUserMenu() {
    const userMenu = document.getElementById('userMenu');
    const userMenuBtn = document.getElementById('userMenuBtn');

    userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userMenu.classList.toggle('open');
    });

    document.addEventListener('click', () => {
        userMenu.classList.remove('open');
    });

    document.getElementById('userDropdown').addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

/**
 * Setup logout
 */
function setupLogout() {
    document.getElementById('logoutBtn').addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            await authApi.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            authApi.clearTokens();
            window.location.href = '/login?logout=true';
        }
    });
}

/**
 * Setup personal information form
 */
function setupPersonalForm() {
    const editBtn = document.getElementById('editPersonalBtn');
    const cancelBtn = document.getElementById('cancelPersonalBtn');
    const form = document.getElementById('personalForm');
    const actions = document.getElementById('personalActions');
    const inputs = form.querySelectorAll('input:not([readonly]), select');

    // Edit button
    editBtn.addEventListener('click', () => {
        isEditingPersonal = true;
        inputs.forEach(input => input.disabled = false);
        actions.classList.remove('hidden');
        editBtn.classList.add('hidden');
    });

    // Cancel button
    cancelBtn.addEventListener('click', () => {
        isEditingPersonal = false;
        inputs.forEach(input => input.disabled = true);
        actions.classList.add('hidden');
        editBtn.classList.remove('hidden');
        clearErrors();

        // Restore original values
        document.getElementById('firstName').value = currentUser.firstName || '';
        document.getElementById('lastName').value = currentUser.lastName || '';
        document.getElementById('phone').value = currentUser.phone || '';
        document.getElementById('language').value = currentUser.language || 'en-US';
    });

    // Form submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();

        const updates = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            phone: document.getElementById('phone').value.trim() || null,
            language: document.getElementById('language').value
        };

        // Validation
        let valid = true;
        if (!updates.firstName) {
            showFieldError('firstName', getText('validation.firstNameRequired'));
            valid = false;
        }
        if (!updates.lastName) {
            showFieldError('lastName', getText('validation.lastNameRequired'));
            valid = false;
        }
        if (!valid) return;

        const saveBtn = document.getElementById('savePersonalBtn');
        saveBtn.disabled = true;
        saveBtn.classList.add('loading');

        try {
            const response = await authApi.updateProfile(updates);

            if (response.success) {
                currentUser = { ...currentUser, ...updates };
                authApi.setUser(currentUser);

                // Update display
                const initials = getInitials(currentUser);
                document.getElementById('userAvatar').textContent = initials;
                document.getElementById('profileAvatar').textContent = initials;
                document.getElementById('userName').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
                document.getElementById('profileName').textContent = `${currentUser.firstName} ${currentUser.lastName}`;

                // Update language if changed
                if (updates.language !== getCurrentLanguage()) {
                    setLanguage(updates.language);
                }

                showAlert('success', getText('profile.updateSuccess') || 'Profile updated successfully');

                // Exit edit mode
                cancelBtn.click();
            }
        } catch (error) {
            handleApiError(error);
        } finally {
            saveBtn.disabled = false;
            saveBtn.classList.remove('loading');
        }
    });
}

/**
 * Setup password form
 */
function setupPasswordForm() {
    const form = document.getElementById('passwordForm');
    const newPasswordInput = document.getElementById('newPassword');

    // Password strength indicator
    newPasswordInput.addEventListener('input', () => {
        const password = newPasswordInput.value;
        updatePasswordRequirements(password);
    });

    // Form submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();

        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validation
        let valid = true;

        if (!currentPassword) {
            showFieldError('currentPassword', getText('profile.currentPasswordRequired') || 'Current password is required');
            valid = false;
        }

        if (!newPassword) {
            showFieldError('newPassword', getText('validation.passwordRequired'));
            valid = false;
        } else if (!isValidPassword(newPassword)) {
            showFieldError('newPassword', getText('validation.passwordWeak'));
            valid = false;
        }

        if (!confirmPassword) {
            showFieldError('confirmPassword', getText('validation.passwordRequired'));
            valid = false;
        } else if (newPassword !== confirmPassword) {
            showFieldError('confirmPassword', getText('validation.passwordMismatch'));
            valid = false;
        }

        if (!valid) return;

        const submitBtn = document.getElementById('changePasswordBtn');
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        try {
            const response = await authApi.changePassword({
                currentPassword,
                newPassword,
                confirmPassword
            });

            if (response.success) {
                showAlert('success', getText('profile.passwordChanged') || 'Password changed successfully');
                form.reset();
                resetPasswordRequirements();
            }
        } catch (error) {
            handleApiError(error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    });
}

/**
 * Update password requirements display
 */
function updatePasswordRequirements(password) {
    const requirements = {
        reqLength: password.length >= 12,
        reqUppercase: /[A-Z]/.test(password),
        reqLowercase: /[a-z]/.test(password),
        reqNumber: /[0-9]/.test(password),
        reqSpecial: /[^a-zA-Z0-9]/.test(password)
    };

    Object.entries(requirements).forEach(([id, met]) => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.toggle('met', met);
            el.querySelector('.req-icon').textContent = met ? '✓' : '○';
        }
    });
}

/**
 * Reset password requirements
 */
function resetPasswordRequirements() {
    ['reqLength', 'reqUppercase', 'reqLowercase', 'reqNumber', 'reqSpecial'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove('met');
            el.querySelector('.req-icon').textContent = '○';
        }
    });
}

/**
 * Setup password toggle buttons
 */
function setupPasswordToggles() {
    document.querySelectorAll('.password-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const input = document.getElementById(targetId);
            if (input) {
                const type = input.type === 'password' ? 'text' : 'password';
                input.type = type;
                btn.textContent = type === 'password' ? '👁️' : '🙈';
            }
        });
    });
}

/**
 * Setup session management
 */
function setupSessionManagement() {
    // Refresh sessions
    document.getElementById('refreshSessionsBtn').addEventListener('click', () => {
        loadSessions();
    });

    // Logout all
    document.getElementById('logoutAllBtn').addEventListener('click', async () => {
        if (!confirm(getText('profile.confirmLogoutAll') || 'Are you sure you want to logout from all other devices?')) {
            return;
        }

        try {
            const response = await authApi.logoutAll(true); // Keep current session

            if (response.success) {
                showAlert('success', getText('profile.logoutAllSuccess') || 'Logged out from all other devices');
                loadSessions();
            }
        } catch (error) {
            handleApiError(error);
        }
    });
}

/**
 * Revoke a session
 */
async function revokeSession(sessionId) {
    try {
        const response = await authApi.revokeSession(sessionId);

        if (response.success) {
            showAlert('success', getText('profile.sessionRevoked') || 'Session revoked');
            loadSessions();
        }
    } catch (error) {
        handleApiError(error);
    }
}

/**
 * Get device icon based on user agent
 */
function getDeviceIcon(userAgent) {
    if (!userAgent) return '💻';
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) return '📱';
    if (ua.includes('tablet') || ua.includes('ipad')) return '📱';
    return '💻';
}

/**
 * Parse user agent to readable string
 */
function parseUserAgent(userAgent) {
    if (!userAgent) return 'Unknown Device';

    // Simple parsing
    let browser = 'Unknown Browser';
    let os = 'Unknown OS';

    if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';

    return `${browser} on ${os}`;
}

/**
 * Get initials from user
 */
function getInitials(user) {
    const first = user.firstName?.[0] || '';
    const last = user.lastName?.[0] || '';
    return (first + last).toUpperCase() || '??';
}

/**
 * Format role
 */
function formatRole(role) {
    const roles = {
        'super_admin': 'Super Admin',
        'admin': 'Admin',
        'auditor': 'Auditor',
        'viewer': 'Viewer'
    };
    return roles[role] || role;
}

/**
 * Format status
 */
function formatStatus(status) {
    const statusKey = `status.${status}`;
    return getText(statusKey) || status;
}

/**
 * Format date
 */
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const lang = getCurrentLanguage ? getCurrentLanguage() : 'en-US';
    return date.toLocaleDateString(lang, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
