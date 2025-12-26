/**
 * CPF Auth Module - Dashboard Page Script
 */

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

    // Setup user menu
    setupUserMenu();

    // Setup logout
    setupLogout();
});

/**
 * Load user data from API
 */
async function loadUserData() {
    try {
        const response = await authApi.getMe();

        if (response.success && response.user) {
            const user = response.user;

            // Update avatar and name
            const initials = getInitials(user);
            document.getElementById('userAvatar').textContent = initials;
            document.getElementById('userName').textContent = `${user.firstName} ${user.lastName}`;

            // Update info card
            document.getElementById('userEmail').textContent = user.email;
            document.getElementById('userRole').textContent = formatRole(user.role);
            document.getElementById('lastLogin').textContent = user.lastLoginAt
                ? formatDate(user.lastLoginAt)
                : getText('dashboard.never') || 'Never';
            document.getElementById('accountExpires').textContent = user.expiresAt
                ? formatDate(user.expiresAt)
                : getText('dashboard.never') || 'Never';

            // Show admin links if applicable
            if (user.role === 'super_admin' || user.role === 'admin') {
                document.getElementById('adminLink').style.display = 'flex';
                document.getElementById('adminCard').style.display = 'block';
            }

            // Show auditing card for auditors
            if (user.role === 'auditor' || user.role === 'super_admin' || user.role === 'admin') {
                document.getElementById('auditingCard').style.display = 'block';
            }

            // Store user for other uses
            authApi.setUser(user);
        }
    } catch (error) {
        console.error('Failed to load user data:', error);
        // If unauthorized, redirect to login
        if (error.code === 'UNAUTHORIZED' || error.code === 'TOKEN_EXPIRED') {
            authApi.clearTokens();
            window.location.href = '/login?expired=true';
        }
    }
}

/**
 * Setup user menu dropdown
 */
function setupUserMenu() {
    const userMenu = document.getElementById('userMenu');
    const userMenuBtn = document.getElementById('userMenuBtn');

    userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userMenu.classList.toggle('open');
    });

    // Close on outside click
    document.addEventListener('click', () => {
        userMenu.classList.remove('open');
    });

    // Prevent closing when clicking inside dropdown
    document.getElementById('userDropdown').addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

/**
 * Setup logout button
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
 * Get user initials
 */
function getInitials(user) {
    const first = user.firstName?.[0] || '';
    const last = user.lastName?.[0] || '';
    return (first + last).toUpperCase() || '??';
}

/**
 * Format role for display
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
 * Format date for display
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
