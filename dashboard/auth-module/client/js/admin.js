// =============================================================================
// Admin Panel Application
// =============================================================================

const AdminApp = {
    currentUser: null,
    users: [],
    pendingUsers: [],
    auditLog: [],
    currentPage: 1,
    pageSize: 10,
    totalUsers: 0,
    auditPage: 1,
    selectedUserId: null,
    confirmCallback: null,

    // Initialize
    async init() {
        try {
            // Check authentication
            if (!authApi.isAuthenticated()) {
                window.location.href = '/login?redirect=/admin';
                return;
            }

            // Load current user
            await this.loadCurrentUser();

            // Check admin permission
            if (!['super_admin', 'admin'].includes(this.currentUser.role)) {
                showAlert('error', { en: 'Access denied. Admin privileges required.', it: 'Accesso negato. Privilegi admin richiesti.' });
                setTimeout(() => window.location.href = '/', 2000);
                return;
            }

            // Initialize i18n
            initI18n();

            // Setup event listeners
            this.setupEventListeners();

            // Load initial data
            await Promise.all([
                this.loadUsers(),
                this.loadPendingApprovals(),
                this.loadStats()
            ]);

            // Hide super admin elements if not super admin
            if (this.currentUser.role !== 'super_admin') {
                document.querySelectorAll('.super-admin-only').forEach(el => {
                    el.style.display = 'none';
                });
            }

            // Hide loading overlay
            document.getElementById('loadingOverlay').style.display = 'none';

        } catch (error) {
            console.error('Init error:', error);
            handleApiError(error);
            document.getElementById('loadingOverlay').style.display = 'none';
        }
    },

    // Load current user
    async loadCurrentUser() {
        const response = await authApi.getMe();
        this.currentUser = response.user;

        // Update sidebar user info
        const initials = (this.currentUser.first_name?.[0] || '') + (this.currentUser.last_name?.[0] || '');
        document.getElementById('userAvatar').textContent = initials.toUpperCase() || '??';
        document.getElementById('userName').textContent = `${this.currentUser.first_name || ''} ${this.currentUser.last_name || ''}`.trim() || this.currentUser.email;
        document.getElementById('userRole').textContent = this.currentUser.role.replace('_', ' ');
    },

    // Load stats
    async loadStats() {
        try {
            const response = await adminApi.getUsers({ limit: 1 });
            // These would come from a dedicated stats endpoint in production
            document.getElementById('statTotalUsers').textContent = response.total || '--';

            const activeResponse = await adminApi.getUsers({ status: 'active', limit: 1 });
            document.getElementById('statActiveUsers').textContent = activeResponse.total || '--';

            const lockedResponse = await adminApi.getUsers({ status: 'locked', limit: 1 });
            document.getElementById('statLockedUsers').textContent = lockedResponse.total || '--';

            document.getElementById('statPendingUsers').textContent = this.pendingUsers.length;
        } catch (error) {
            console.error('Stats error:', error);
        }
    },

    // Load users
    async loadUsers() {
        try {
            const search = document.getElementById('searchInput').value;
            const status = document.getElementById('statusFilter').value;
            const role = document.getElementById('roleFilter').value;

            const response = await adminApi.getUsers({
                page: this.currentPage,
                limit: this.pageSize,
                search,
                status,
                role
            });

            this.users = response.users || [];
            this.totalUsers = response.total || 0;
            this.renderUsersTable();
            this.updatePagination();
        } catch (error) {
            console.error('Load users error:', error);
            handleApiError(error);
        }
    },

    // Load pending approvals
    async loadPendingApprovals() {
        try {
            const response = await adminApi.getPendingApprovals();
            this.pendingUsers = response.users || [];
            this.renderPendingList();

            // Update badge
            const badge = document.getElementById('pendingBadge');
            if (this.pendingUsers.length > 0) {
                badge.textContent = this.pendingUsers.length;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        } catch (error) {
            console.error('Load pending error:', error);
        }
    },

    // Load audit log
    async loadAuditLog() {
        try {
            const action = document.getElementById('auditActionFilter').value;
            const response = await adminApi.getAuditLog({
                page: this.auditPage,
                limit: 20,
                action
            });

            this.auditLog = response.entries || [];
            this.renderAuditLog();
        } catch (error) {
            console.error('Load audit error:', error);
        }
    },

    // Render users table
    renderUsersTable() {
        const tbody = document.getElementById('usersTableBody');

        if (this.users.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-muted" style="padding: 40px;">
                        ${getText('admin.noUsers') || 'No users found'}
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.users.map(user => `
            <tr data-user-id="${user.id}">
                <td>
                    <div class="user-cell">
                        <div class="user-avatar">${this.getInitials(user)}</div>
                        <div class="user-info-cell">
                            <span class="user-name">${this.escapeHtml(user.first_name || '')} ${this.escapeHtml(user.last_name || '')}</span>
                            <span class="user-email">${this.escapeHtml(user.email)}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="badge role-${user.role}">${user.role.replace('_', ' ')}</span>
                </td>
                <td>
                    <span class="badge status-${user.status}">${this.formatStatus(user.status)}</span>
                </td>
                <td>
                    <span class="text-small">${user.last_login_at ? this.formatDate(user.last_login_at) : '--'}</span>
                </td>
                <td>
                    <span class="text-small ${this.isExpiringSoon(user.expires_at) ? 'text-warning' : ''}">${user.expires_at ? this.formatDate(user.expires_at) : 'Never'}</span>
                </td>
                <td>
                    <div class="actions-dropdown">
                        <button class="actions-btn" onclick="AdminApp.toggleActionsMenu(event, '${user.id}')">
                            Actions ▼
                        </button>
                        <div class="actions-menu" id="actions-${user.id}">
                            <button class="actions-menu-item" onclick="AdminApp.viewUser('${user.id}')">
                                View
                            </button>
                            <button class="actions-menu-item" onclick="AdminApp.showRoleModal('${user.id}')">
                                Change Role
                            </button>
                            <button class="actions-menu-item" onclick="AdminApp.showExtendModal('${user.id}')">
                                Extend
                            </button>
                            <div class="actions-menu-divider"></div>
                            ${user.status === 'locked' ? `
                                <button class="actions-menu-item" onclick="AdminApp.unlockUser('${user.id}')">
                                    Unlock
                                </button>
                            ` : `
                                <button class="actions-menu-item" onclick="AdminApp.lockUser('${user.id}')">
                                    Lock
                                </button>
                            `}
                            ${user.status === 'suspended' ? `
                                <button class="actions-menu-item" onclick="AdminApp.activateUser('${user.id}')">
                                    Activate
                                </button>
                            ` : `
                                <button class="actions-menu-item" onclick="AdminApp.suspendUser('${user.id}')">
                                    Suspend
                                </button>
                            `}
                            <div class="actions-menu-divider"></div>
                            <button class="actions-menu-item danger" onclick="AdminApp.deleteUser('${user.id}')">
                                Delete
                            </button>
                        </div>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    // Render pending list
    renderPendingList() {
        const container = document.getElementById('pendingList');
        const emptyState = document.getElementById('pendingEmpty');

        if (this.pendingUsers.length === 0) {
            container.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        container.innerHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>${getText('admin.table.user') || 'User'}</th>
                        <th>${getText('admin.table.registeredAt') || 'Registered'}</th>
                        <th>${getText('admin.table.actions') || 'Actions'}</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.pendingUsers.map(user => `
                        <tr>
                            <td>
                                <div class="user-cell">
                                    <div class="user-avatar">${this.getInitials(user)}</div>
                                    <div class="user-info-cell">
                                        <span class="user-name">${this.escapeHtml(user.first_name || '')} ${this.escapeHtml(user.last_name || '')}</span>
                                        <span class="user-email">${this.escapeHtml(user.email)}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="text-small">${this.formatDate(user.created_at)}</span>
                            </td>
                            <td>
                                <div class="flex gap-1">
                                    <button class="btn btn-primary btn-sm" onclick="AdminApp.approveUser('${user.id}')">
                                        Approve
                                    </button>
                                    <button class="btn btn-danger btn-sm" onclick="AdminApp.rejectUser('${user.id}')">
                                        Reject
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },

    // Render audit log
    renderAuditLog() {
        const container = document.getElementById('auditList');
        const emptyState = document.getElementById('auditEmpty');

        if (this.auditLog.length === 0) {
            container.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        container.innerHTML = this.auditLog.map(entry => `
            <div class="audit-entry">
                <div class="audit-icon ${this.getAuditIconClass(entry.action)}">
                    ${this.getAuditIcon(entry.action)}
                </div>
                <div class="audit-content">
                    <div class="audit-action">${this.formatAuditAction(entry.action)}</div>
                    <div class="audit-details">
                        ${entry.user_email || 'Unknown user'}
                        ${entry.target_user_email ? `→ ${entry.target_user_email}` : ''}
                        ${entry.details ? `<br><small>${this.escapeHtml(JSON.stringify(entry.details))}</small>` : ''}
                    </div>
                    <div class="audit-meta">
                        ${this.formatDate(entry.created_at)} • IP: ${entry.ip_address || 'Unknown'}
                    </div>
                </div>
            </div>
        `).join('');
    },

    // Update pagination
    updatePagination() {
        const totalPages = Math.ceil(this.totalUsers / this.pageSize);
        const start = (this.currentPage - 1) * this.pageSize + 1;
        const end = Math.min(this.currentPage * this.pageSize, this.totalUsers);

        document.getElementById('paginationInfo').textContent =
            `Showing ${start}-${end} of ${this.totalUsers} users`;

        document.getElementById('prevPageBtn').disabled = this.currentPage <= 1;
        document.getElementById('nextPageBtn').disabled = this.currentPage >= totalPages;
    },

    // Setup event listeners
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item[data-section]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection(item.dataset.section);
            });
        });

        // Mobile menu
        document.getElementById('mobileMenuToggle').addEventListener('click', () => {
            document.getElementById('adminSidebar').classList.toggle('open');
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', async (e) => {
            e.preventDefault();
            await authApi.logout();
            window.location.href = '/login';
        });

        // Search and filters
        let searchTimeout;
        document.getElementById('searchInput').addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.currentPage = 1;
                this.loadUsers();
            }, 300);
        });

        document.getElementById('statusFilter').addEventListener('change', () => {
            this.currentPage = 1;
            this.loadUsers();
        });

        document.getElementById('roleFilter').addEventListener('change', () => {
            this.currentPage = 1;
            this.loadUsers();
        });

        // Pagination
        document.getElementById('prevPageBtn').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.loadUsers();
            }
        });

        document.getElementById('nextPageBtn').addEventListener('click', () => {
            this.currentPage++;
            this.loadUsers();
        });

        // Refresh buttons
        document.getElementById('refreshUsersBtn').addEventListener('click', () => this.loadUsers());
        document.getElementById('refreshPendingBtn').addEventListener('click', () => this.loadPendingApprovals());
        document.getElementById('refreshAuditBtn').addEventListener('click', () => this.loadAuditLog());

        // Audit filter
        document.getElementById('auditActionFilter').addEventListener('change', () => {
            this.auditPage = 1;
            this.loadAuditLog();
        });

        // Modals
        document.getElementById('closeUserModal').addEventListener('click', () => this.closeModal('userModal'));
        document.getElementById('closeUserModalBtn').addEventListener('click', () => this.closeModal('userModal'));

        document.getElementById('closeConfirmModal').addEventListener('click', () => this.closeModal('confirmModal'));
        document.getElementById('cancelConfirmBtn').addEventListener('click', () => this.closeModal('confirmModal'));
        document.getElementById('confirmActionBtn').addEventListener('click', () => {
            if (this.confirmCallback) {
                const reason = document.getElementById('confirmReason').value;
                this.confirmCallback(reason);
            }
            this.closeModal('confirmModal');
        });

        document.getElementById('closeRoleModal').addEventListener('click', () => this.closeModal('roleModal'));
        document.getElementById('cancelRoleBtn').addEventListener('click', () => this.closeModal('roleModal'));
        document.getElementById('confirmRoleBtn').addEventListener('click', () => this.confirmRoleChange());

        document.getElementById('closeExtendModal').addEventListener('click', () => this.closeModal('extendModal'));
        document.getElementById('cancelExtendBtn').addEventListener('click', () => this.closeModal('extendModal'));
        document.getElementById('confirmExtendBtn').addEventListener('click', () => this.confirmExtend());

        // Settings
        document.getElementById('saveSettingsBtn').addEventListener('click', () => this.saveSettings());

        // Close menus on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.actions-dropdown')) {
                document.querySelectorAll('.actions-menu.show').forEach(menu => {
                    menu.classList.remove('show');
                });
            }
        });
    },

    // Show section
    showSection(section) {
        // Update nav
        document.querySelectorAll('.nav-item[data-section]').forEach(item => {
            item.classList.toggle('active', item.dataset.section === section);
        });

        // Show content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${section}Section`).classList.add('active');

        // Load data if needed
        if (section === 'audit' && this.auditLog.length === 0) {
            this.loadAuditLog();
        }
        if (section === 'settings') {
            this.loadSettings();
        }

        // Close mobile menu
        document.getElementById('adminSidebar').classList.remove('open');
    },

    // Toggle actions menu
    toggleActionsMenu(event, userId) {
        event.stopPropagation();
        const menu = document.getElementById(`actions-${userId}`);

        // Close other menus
        document.querySelectorAll('.actions-menu.show').forEach(m => {
            if (m !== menu) m.classList.remove('show');
        });

        menu.classList.toggle('show');
    },

    // User actions
    async viewUser(userId) {
        try {
            const response = await adminApi.getUser(userId);
            const user = response.user;

            document.getElementById('userModalBody').innerHTML = `
                <div class="user-cell mb-2" style="justify-content: center;">
                    <div class="user-avatar" style="width: 60px; height: 60px; font-size: 24px;">
                        ${this.getInitials(user)}
                    </div>
                </div>
                <div class="text-center mb-3">
                    <h3>${this.escapeHtml(user.first_name || '')} ${this.escapeHtml(user.last_name || '')}</h3>
                    <p class="text-muted">${this.escapeHtml(user.email)}</p>
                    <span class="badge role-${user.role}">${user.role.replace('_', ' ')}</span>
                    <span class="badge status-${user.status}">${this.formatStatus(user.status)}</span>
                </div>
                <table class="table">
                    <tr><td><strong>ID</strong></td><td>${user.id}</td></tr>
                    <tr><td><strong>Created</strong></td><td>${this.formatDate(user.created_at)}</td></tr>
                    <tr><td><strong>Last Login</strong></td><td>${user.last_login_at ? this.formatDate(user.last_login_at) : 'Never'}</td></tr>
                    <tr><td><strong>Expires</strong></td><td>${user.expires_at ? this.formatDate(user.expires_at) : 'Never'}</td></tr>
                    <tr><td><strong>Email Verified</strong></td><td>${user.email_verified_at ? 'Yes' : 'No'}</td></tr>
                    <tr><td><strong>Failed Logins</strong></td><td>${user.failed_login_attempts || 0}</td></tr>
                </table>
            `;

            this.showModal('userModal');
        } catch (error) {
            handleApiError(error);
        }
    },

    async approveUser(userId) {
        try {
            await adminApi.approveUser(userId);
            showAlert('success', { en: 'User approved successfully', it: 'Utente approvato con successo' });
            await Promise.all([this.loadPendingApprovals(), this.loadUsers(), this.loadStats()]);
        } catch (error) {
            handleApiError(error);
        }
    },

    rejectUser(userId) {
        this.selectedUserId = userId;
        document.getElementById('confirmModalTitle').textContent = getText('admin.confirmReject') || 'Reject User';
        document.getElementById('confirmModalMessage').textContent = getText('admin.confirmRejectMessage') || 'Are you sure you want to reject this user?';
        document.getElementById('confirmReasonGroup').classList.remove('hidden');
        document.getElementById('confirmReason').value = '';

        this.confirmCallback = async (reason) => {
            try {
                await adminApi.rejectUser(this.selectedUserId, reason);
                showAlert('success', { en: 'User rejected', it: 'Utente rifiutato' });
                await this.loadPendingApprovals();
            } catch (error) {
                handleApiError(error);
            }
        };

        this.showModal('confirmModal');
    },

    lockUser(userId) {
        this.selectedUserId = userId;
        document.getElementById('confirmModalTitle').textContent = getText('admin.confirmLock') || 'Lock User';
        document.getElementById('confirmModalMessage').textContent = getText('admin.confirmLockMessage') || 'Are you sure you want to lock this user?';
        document.getElementById('confirmReasonGroup').classList.remove('hidden');
        document.getElementById('confirmReason').value = '';

        this.confirmCallback = async (reason) => {
            try {
                await adminApi.lockUser(this.selectedUserId, null, reason);
                showAlert('success', { en: 'User locked', it: 'Utente bloccato' });
                await this.loadUsers();
            } catch (error) {
                handleApiError(error);
            }
        };

        this.showModal('confirmModal');
    },

    async unlockUser(userId) {
        try {
            await adminApi.unlockUser(userId);
            showAlert('success', { en: 'User unlocked', it: 'Utente sbloccato' });
            await this.loadUsers();
        } catch (error) {
            handleApiError(error);
        }
    },

    suspendUser(userId) {
        this.selectedUserId = userId;
        document.getElementById('confirmModalTitle').textContent = getText('admin.confirmSuspend') || 'Suspend User';
        document.getElementById('confirmModalMessage').textContent = getText('admin.confirmSuspendMessage') || 'Are you sure you want to suspend this user?';
        document.getElementById('confirmReasonGroup').classList.remove('hidden');
        document.getElementById('confirmReason').value = '';

        this.confirmCallback = async (reason) => {
            try {
                await adminApi.suspendUser(this.selectedUserId, reason);
                showAlert('success', { en: 'User suspended', it: 'Utente sospeso' });
                await this.loadUsers();
            } catch (error) {
                handleApiError(error);
            }
        };

        this.showModal('confirmModal');
    },

    async activateUser(userId) {
        try {
            await adminApi.activateUser(userId);
            showAlert('success', { en: 'User activated', it: 'Utente attivato' });
            await this.loadUsers();
        } catch (error) {
            handleApiError(error);
        }
    },

    deleteUser(userId) {
        this.selectedUserId = userId;
        document.getElementById('confirmModalTitle').textContent = getText('admin.confirmDelete') || 'Delete User';
        document.getElementById('confirmModalMessage').textContent = getText('admin.confirmDeleteMessage') || 'Are you sure you want to permanently delete this user? This action cannot be undone.';
        document.getElementById('confirmReasonGroup').classList.add('hidden');
        document.getElementById('confirmActionBtn').classList.add('btn-danger');

        this.confirmCallback = async () => {
            try {
                await adminApi.deleteUser(this.selectedUserId);
                showAlert('success', { en: 'User deleted', it: 'Utente eliminato' });
                await Promise.all([this.loadUsers(), this.loadStats()]);
            } catch (error) {
                handleApiError(error);
            }
        };

        this.showModal('confirmModal');
    },

    showRoleModal(userId) {
        this.selectedUserId = userId;
        const user = this.users.find(u => u.id === userId);
        if (user) {
            document.getElementById('newRoleSelect').value = user.role;
        }
        this.showModal('roleModal');
    },

    async confirmRoleChange() {
        const newRole = document.getElementById('newRoleSelect').value;
        try {
            await adminApi.changeRole(this.selectedUserId, newRole);
            showAlert('success', { en: 'Role updated', it: 'Ruolo aggiornato' });
            this.closeModal('roleModal');
            await this.loadUsers();
        } catch (error) {
            handleApiError(error);
        }
    },

    showExtendModal(userId) {
        this.selectedUserId = userId;
        document.getElementById('extendDays').value = 365;
        this.showModal('extendModal');
    },

    async confirmExtend() {
        const days = parseInt(document.getElementById('extendDays').value);
        try {
            await adminApi.extendExpiry(this.selectedUserId, days);
            showAlert('success', { en: 'Expiry extended', it: 'Scadenza estesa' });
            this.closeModal('extendModal');
            await this.loadUsers();
        } catch (error) {
            handleApiError(error);
        }
    },

    // Settings
    async loadSettings() {
        try {
            const response = await adminApi.getSettings();
            const settings = response.settings || {};

            document.getElementById('settingAllowRegistration').checked = settings.allow_registration !== false;
            document.getElementById('settingRequireApproval').checked = settings.require_approval !== false;
            document.getElementById('settingRequireEmailVerification').checked = settings.require_email_verification !== false;
            document.getElementById('settingDefaultRole').value = settings.default_role || 'viewer';
            document.getElementById('settingMaxLoginAttempts').value = settings.max_login_attempts || 5;
            document.getElementById('settingSessionTimeout').value = settings.session_timeout_hours || 24;
            document.getElementById('settingPasswordExpiry').value = settings.password_expiry_days || 0;
            document.getElementById('settingDefaultExpiry').value = settings.default_account_expiry_days || 365;
            document.getElementById('settingExpiryWarning').value = settings.expiry_warning_days || 14;
            document.getElementById('settingNotifyNewUser').checked = settings.notify_on_registration !== false;
            document.getElementById('settingNotifyLocked').checked = settings.notify_on_lockout !== false;
        } catch (error) {
            console.error('Load settings error:', error);
        }
    },

    async saveSettings() {
        try {
            const settings = {
                allow_registration: document.getElementById('settingAllowRegistration').checked,
                require_approval: document.getElementById('settingRequireApproval').checked,
                require_email_verification: document.getElementById('settingRequireEmailVerification').checked,
                default_role: document.getElementById('settingDefaultRole').value,
                max_login_attempts: parseInt(document.getElementById('settingMaxLoginAttempts').value),
                session_timeout_hours: parseInt(document.getElementById('settingSessionTimeout').value),
                password_expiry_days: parseInt(document.getElementById('settingPasswordExpiry').value),
                default_account_expiry_days: parseInt(document.getElementById('settingDefaultExpiry').value),
                expiry_warning_days: parseInt(document.getElementById('settingExpiryWarning').value),
                notify_on_registration: document.getElementById('settingNotifyNewUser').checked,
                notify_on_lockout: document.getElementById('settingNotifyLocked').checked
            };

            await adminApi.updateSettings(settings);
            showAlert('success', { en: 'Settings saved successfully', it: 'Impostazioni salvate con successo' });
        } catch (error) {
            handleApiError(error);
        }
    },

    // Modal helpers
    showModal(modalId) {
        document.getElementById(modalId).classList.add('show');
    },

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('show');
        this.confirmCallback = null;
    },

    // Utility functions
    getInitials(user) {
        return ((user.first_name?.[0] || '') + (user.last_name?.[0] || '')).toUpperCase() || '??';
    },

    escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;')
                 .replace(/</g, '&lt;')
                 .replace(/>/g, '&gt;')
                 .replace(/"/g, '&quot;')
                 .replace(/'/g, '&#039;');
    },

    formatDate(dateStr) {
        if (!dateStr) return '--';
        const date = new Date(dateStr);
        return date.toLocaleDateString(getCurrentLanguage(), {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    formatStatus(status) {
        const statusMap = {
            'active': getText('status.active') || 'Active',
            'pending_verification': getText('status.pendingVerification') || 'Pending Verification',
            'pending_approval': getText('status.pendingApproval') || 'Pending Approval',
            'locked': getText('status.locked') || 'Locked',
            'suspended': getText('status.suspended') || 'Suspended',
            'expired': getText('status.expired') || 'Expired',
            'deactivated': getText('status.deactivated') || 'Deactivated'
        };
        return statusMap[status] || status;
    },

    isExpiringSoon(dateStr) {
        if (!dateStr) return false;
        const days = (new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24);
        return days > 0 && days <= 30;
    },

    getAuditIcon(action) {
        const icons = {
            'login': '🔓',
            'logout': '🚪',
            'login_failed': '❌',
            'password_reset': '🔑',
            'password_changed': '🔐',
            'user_created': '👤',
            'user_approved': '✅',
            'user_rejected': '❌',
            'user_locked': '🔒',
            'user_unlocked': '🔓',
            'user_suspended': '⏸️',
            'user_activated': '▶️',
            'user_deleted': '🗑️',
            'role_changed': '🔑',
            'settings_updated': '⚙️'
        };
        return icons[action] || '📋';
    },

    getAuditIconClass(action) {
        if (['login', 'user_approved', 'user_activated', 'user_unlocked'].includes(action)) return 'login';
        if (['logout'].includes(action)) return 'logout';
        if (['login_failed', 'user_rejected', 'user_locked', 'user_suspended', 'user_deleted'].includes(action)) return 'failed';
        if (['password_reset', 'password_changed', 'role_changed', 'settings_updated'].includes(action)) return 'change';
        return 'admin';
    },

    formatAuditAction(action) {
        return action.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => AdminApp.init());
