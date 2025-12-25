/**
 * CPF Auth Module - Internationalization (i18n)
 * Supports English (en-US) and Italian (it-IT)
 */

// =============================================================================
// Translation Strings
// =============================================================================

const translations = {
    'en-US': {
        // Login
        'login.title': 'CPF Dashboard',
        'login.subtitle': 'Cognitive Psychological Framework',
        'login.email': 'Email',
        'login.password': 'Password',
        'login.rememberMe': 'Remember me on this device',
        'login.submit': 'Sign In',
        'login.forgotPassword': 'Forgot your password?',
        'login.noAccount': "Don't have an account?",
        'login.register': 'Register here',
        'login.success': 'Login successful! Redirecting...',
        'login.mustChangePassword': 'You must change your password before continuing.',
        'login.emailVerified': 'Email verified successfully! You can now log in.',
        'login.passwordReset': 'Password reset successfully! You can now log in.',
        'login.sessionExpired': 'Your session has expired. Please log in again.',
        'login.loggedOut': 'You have been logged out successfully.',

        // Register
        'register.title': 'Create Account',
        'register.subtitle': 'Join CPF Dashboard',
        'register.firstName': 'First Name',
        'register.lastName': 'Last Name',
        'register.email': 'Email',
        'register.password': 'Password',
        'register.confirmPassword': 'Confirm Password',
        'register.acceptTerms': 'I accept the terms of service and privacy policy',
        'register.submit': 'Create Account',
        'register.hasAccount': 'Already have an account?',
        'register.login': 'Sign in here',
        'register.approvalRequired': 'Note: New accounts require administrator approval.',
        'register.reqLength': 'At least 12 characters',
        'register.reqUppercase': 'One uppercase letter',
        'register.reqLowercase': 'One lowercase letter',
        'register.reqNumber': 'One number',
        'register.reqSpecial': 'One special character',
        'register.strength.weak': 'Weak',
        'register.strength.fair': 'Fair',
        'register.strength.good': 'Good',
        'register.strength.strong': 'Strong',

        // Forgot Password
        'forgot.title': 'Forgot Password',
        'forgot.subtitle': "We'll send you a reset link",
        'forgot.email': 'Email Address',
        'forgot.helper': 'Enter the email address associated with your account',
        'forgot.submit': 'Send Reset Link',
        'forgot.sent': 'Email Sent!',
        'forgot.sentMessage': 'If an account exists with that email, you will receive a password reset link shortly.',
        'forgot.checkSpam': "Don't forget to check your spam folder.",
        'forgot.remember': 'Remember your password?',
        'forgot.login': 'Sign in here',

        // Reset Password
        'reset.title': 'Reset Password',
        'reset.subtitle': 'Create a new secure password',
        'reset.newPassword': 'New Password',
        'reset.confirmPassword': 'Confirm New Password',
        'reset.submit': 'Reset Password',
        'reset.invalidToken': 'Invalid or Expired Link',
        'reset.invalidTokenMessage': 'This password reset link is invalid or has expired. Please request a new one.',
        'reset.requestNew': 'Request New Link',
        'reset.verifying': 'Verifying link...',
        'reset.success': 'Password Reset!',
        'reset.successMessage': 'Your password has been successfully reset. You can now log in with your new password.',
        'reset.login': 'Go to Login',
        'reset.backToLogin': '← Back to Login',

        // Verify Email
        'verify.title': 'Email Verification',
        'verify.subtitle': 'Confirming your email address',
        'verify.verifying': 'Verifying your email...',
        'verify.success': 'Email Verified!',
        'verify.pending': 'Pending Approval',
        'verify.pendingMessage': "Your email has been verified. Your account is now pending administrator approval. You'll receive an email when your account is activated.",
        'verify.error': 'Verification Failed',
        'verify.errorMessage': 'This verification link is invalid or has expired.',
        'verify.or': 'or',
        'verify.resendLabel': 'Request a new verification email:',
        'verify.resend': 'Resend Verification Email',
        'verify.resendSuccess': 'Email Sent!',
        'verify.resendSuccessMessage': 'If that email is registered, a new verification link has been sent.',
        'verify.login': 'Go to Login',
        'verify.backToLogin': '← Back to Login',

        // Account Locked
        'locked.title': 'Account Locked',
        'locked.subtitle': 'Security protection activated',
        'locked.message': 'Your account has been temporarily locked due to multiple failed login attempts.',
        'locked.until': 'Locked until:',
        'locked.contact': 'If you need immediate access, please contact your administrator.',
        'locked.tryAgain': 'Try Again',

        // Validation
        'validation.emailRequired': 'Email is required',
        'validation.emailInvalid': 'Please enter a valid email address',
        'validation.passwordRequired': 'Password is required',
        'validation.passwordWeak': 'Password does not meet requirements',
        'validation.passwordMismatch': 'Passwords do not match',
        'validation.firstNameRequired': 'First name is required',
        'validation.lastNameRequired': 'Last name is required',
        'validation.termsRequired': 'You must accept the terms of service',

        // Errors
        'error.generic': 'An error occurred. Please try again.',
        'error.network': 'Network error. Please check your connection.',
        'error.rateLimit': 'Too many attempts. Please try again later.',
        'error.unauthorized': 'Invalid credentials. Please try again.',
        'error.forbidden': 'Access denied.',
        'error.notFound': 'Resource not found.',

        // Admin
        'admin.title': 'User Management',
        'admin.users': 'Users',
        'admin.pendingApprovals': 'Pending Approvals',
        'admin.settings': 'Settings',
        'admin.auditLog': 'Audit Log',
        'admin.logout': 'Logout',
        'admin.approve': 'Approve',
        'admin.reject': 'Reject',
        'admin.lock': 'Lock',
        'admin.unlock': 'Unlock',
        'admin.delete': 'Delete',
        'admin.edit': 'Edit',
        'admin.save': 'Save',
        'admin.cancel': 'Cancel',
        'admin.confirm': 'Confirm',
        'admin.close': 'Close',
        'admin.refresh': 'Refresh',
        'admin.view': 'View',
        'admin.changeRole': 'Change Role',
        'admin.extend': 'Extend',
        'admin.suspend': 'Suspend',
        'admin.activate': 'Activate',
        'admin.navigation': 'Navigation',
        'admin.administration': 'Administration',
        'admin.account': 'Account',
        'admin.allUsers': 'All Users',
        'admin.noUsers': 'No users found',
        'admin.noPending': 'No Pending Approvals',
        'admin.noPendingDesc': 'All user registrations have been processed.',
        'admin.noAudit': 'No Audit Entries',
        'admin.noAuditDesc': 'No activity has been recorded yet.',
        'admin.saveSettings': 'Save Settings',

        // Admin Stats
        'admin.stats.totalUsers': 'Total Users',
        'admin.stats.activeUsers': 'Active Users',
        'admin.stats.pendingApproval': 'Pending Approval',
        'admin.stats.lockedUsers': 'Locked Users',

        // Admin Table
        'admin.table.user': 'User',
        'admin.table.role': 'Role',
        'admin.table.status': 'Status',
        'admin.table.lastLogin': 'Last Login',
        'admin.table.expiresAt': 'Expires',
        'admin.table.actions': 'Actions',
        'admin.table.registeredAt': 'Registered',

        // Admin Filters
        'admin.filter.allStatuses': 'All Statuses',
        'admin.filter.active': 'Active',
        'admin.filter.pendingVerification': 'Pending Verification',
        'admin.filter.pendingApproval': 'Pending Approval',
        'admin.filter.locked': 'Locked',
        'admin.filter.suspended': 'Suspended',
        'admin.filter.expired': 'Expired',
        'admin.filter.deactivated': 'Deactivated',
        'admin.filter.allRoles': 'All Roles',
        'admin.filter.allActions': 'All Actions',

        // Admin Pagination
        'admin.pagination.prev': 'Previous',
        'admin.pagination.next': 'Next',

        // Admin Modals
        'admin.modal.userDetails': 'User Details',
        'admin.modal.changeRole': 'Change Role',
        'admin.modal.newRole': 'New Role',
        'admin.modal.extendExpiry': 'Extend Account Expiry',
        'admin.modal.days': 'Days',
        'admin.modal.reason': 'Reason (optional)',
        'admin.confirmReject': 'Reject User',
        'admin.confirmRejectMessage': 'Are you sure you want to reject this user?',
        'admin.confirmLock': 'Lock User',
        'admin.confirmLockMessage': 'Are you sure you want to lock this user?',
        'admin.confirmSuspend': 'Suspend User',
        'admin.confirmSuspendMessage': 'Are you sure you want to suspend this user?',
        'admin.confirmDelete': 'Delete User',
        'admin.confirmDeleteMessage': 'Are you sure you want to permanently delete this user? This action cannot be undone.',

        // Admin Settings
        'admin.settings.registration': 'Registration',
        'admin.settings.allowRegistration': 'Allow Registration',
        'admin.settings.allowRegistrationDesc': 'Enable public user registration',
        'admin.settings.requireApproval': 'Require Approval',
        'admin.settings.requireApprovalDesc': 'New users need admin approval',
        'admin.settings.requireEmailVerification': 'Require Email Verification',
        'admin.settings.requireEmailVerificationDesc': 'Users must verify email before access',
        'admin.settings.defaultRole': 'Default Role',
        'admin.settings.defaultRoleDesc': 'Role assigned to new users',
        'admin.settings.security': 'Security',
        'admin.settings.maxLoginAttempts': 'Max Login Attempts',
        'admin.settings.maxLoginAttemptsDesc': 'Before account lockout',
        'admin.settings.sessionTimeout': 'Session Timeout (hours)',
        'admin.settings.sessionTimeoutDesc': 'Auto-logout after inactivity',
        'admin.settings.passwordExpiry': 'Password Expiry (days)',
        'admin.settings.passwordExpiryDesc': '0 = never expires',
        'admin.settings.accounts': 'Accounts',
        'admin.settings.defaultExpiry': 'Default Account Expiry (days)',
        'admin.settings.defaultExpiryDesc': '0 = never expires',
        'admin.settings.expiryWarning': 'Expiry Warning (days)',
        'admin.settings.expiryWarningDesc': 'Days before expiry to warn user',
        'admin.settings.notifications': 'Notifications',
        'admin.settings.notifyNewUser': 'Notify on New Registration',
        'admin.settings.notifyNewUserDesc': 'Email admins when new user registers',
        'admin.settings.notifyLocked': 'Notify on Account Lock',
        'admin.settings.notifyLockedDesc': 'Email admins when account is locked',

        // Status labels
        'status.active': 'Active',
        'status.pendingVerification': 'Pending Verification',
        'status.pendingApproval': 'Pending Approval',
        'status.locked': 'Locked',
        'status.suspended': 'Suspended',
        'status.expired': 'Expired',
        'status.deactivated': 'Deactivated'
    },

    'it-IT': {
        // Login
        'login.title': 'CPF Dashboard',
        'login.subtitle': 'Cognitive Psychological Framework',
        'login.email': 'Email',
        'login.password': 'Password',
        'login.rememberMe': 'Ricordami su questo dispositivo',
        'login.submit': 'Accedi',
        'login.forgotPassword': 'Password dimenticata?',
        'login.noAccount': 'Non hai un account?',
        'login.register': 'Registrati qui',
        'login.success': 'Accesso effettuato! Reindirizzamento...',
        'login.mustChangePassword': 'Devi cambiare la password prima di continuare.',
        'login.emailVerified': 'Email verificata con successo! Ora puoi accedere.',
        'login.passwordReset': 'Password reimpostata con successo! Ora puoi accedere.',
        'login.sessionExpired': 'La tua sessione è scaduta. Accedi nuovamente.',
        'login.loggedOut': 'Disconnessione effettuata con successo.',

        // Register
        'register.title': 'Crea Account',
        'register.subtitle': 'Unisciti a CPF Dashboard',
        'register.firstName': 'Nome',
        'register.lastName': 'Cognome',
        'register.email': 'Email',
        'register.password': 'Password',
        'register.confirmPassword': 'Conferma Password',
        'register.acceptTerms': 'Accetto i termini di servizio e la privacy policy',
        'register.submit': 'Crea Account',
        'register.hasAccount': 'Hai già un account?',
        'register.login': 'Accedi qui',
        'register.approvalRequired': 'Nota: I nuovi account richiedono approvazione dell\'amministratore.',
        'register.reqLength': 'Almeno 12 caratteri',
        'register.reqUppercase': 'Una lettera maiuscola',
        'register.reqLowercase': 'Una lettera minuscola',
        'register.reqNumber': 'Un numero',
        'register.reqSpecial': 'Un carattere speciale',
        'register.strength.weak': 'Debole',
        'register.strength.fair': 'Discreta',
        'register.strength.good': 'Buona',
        'register.strength.strong': 'Forte',

        // Forgot Password
        'forgot.title': 'Password Dimenticata',
        'forgot.subtitle': 'Ti invieremo un link per reimpostarla',
        'forgot.email': 'Indirizzo Email',
        'forgot.helper': 'Inserisci l\'email associata al tuo account',
        'forgot.submit': 'Invia Link di Reset',
        'forgot.sent': 'Email Inviata!',
        'forgot.sentMessage': 'Se esiste un account con questa email, riceverai un link per reimpostare la password.',
        'forgot.checkSpam': 'Non dimenticare di controllare la cartella spam.',
        'forgot.remember': 'Ricordi la password?',
        'forgot.login': 'Accedi qui',

        // Reset Password
        'reset.title': 'Reimposta Password',
        'reset.subtitle': 'Crea una nuova password sicura',
        'reset.newPassword': 'Nuova Password',
        'reset.confirmPassword': 'Conferma Nuova Password',
        'reset.submit': 'Reimposta Password',
        'reset.invalidToken': 'Link Non Valido o Scaduto',
        'reset.invalidTokenMessage': 'Questo link di reset è non valido o scaduto. Richiedi un nuovo link.',
        'reset.requestNew': 'Richiedi Nuovo Link',
        'reset.verifying': 'Verifica del link...',
        'reset.success': 'Password Reimpostata!',
        'reset.successMessage': 'La tua password è stata reimpostata con successo. Ora puoi accedere con la nuova password.',
        'reset.login': 'Vai al Login',
        'reset.backToLogin': '← Torna al Login',

        // Verify Email
        'verify.title': 'Verifica Email',
        'verify.subtitle': 'Conferma del tuo indirizzo email',
        'verify.verifying': 'Verifica email in corso...',
        'verify.success': 'Email Verificata!',
        'verify.pending': 'In Attesa di Approvazione',
        'verify.pendingMessage': 'La tua email è stata verificata. Il tuo account è ora in attesa di approvazione. Riceverai un\'email quando il tuo account sarà attivato.',
        'verify.error': 'Verifica Fallita',
        'verify.errorMessage': 'Questo link di verifica è non valido o scaduto.',
        'verify.or': 'oppure',
        'verify.resendLabel': 'Richiedi una nuova email di verifica:',
        'verify.resend': 'Reinvia Email di Verifica',
        'verify.resendSuccess': 'Email Inviata!',
        'verify.resendSuccessMessage': 'Se l\'email è registrata, è stato inviato un nuovo link di verifica.',
        'verify.login': 'Vai al Login',
        'verify.backToLogin': '← Torna al Login',

        // Account Locked
        'locked.title': 'Account Bloccato',
        'locked.subtitle': 'Protezione di sicurezza attivata',
        'locked.message': 'Il tuo account è stato temporaneamente bloccato a causa di molteplici tentativi di accesso falliti.',
        'locked.until': 'Bloccato fino a:',
        'locked.contact': 'Se hai bisogno di accesso immediato, contatta il tuo amministratore.',
        'locked.tryAgain': 'Riprova',

        // Validation
        'validation.emailRequired': 'Email richiesta',
        'validation.emailInvalid': 'Inserisci un indirizzo email valido',
        'validation.passwordRequired': 'Password richiesta',
        'validation.passwordWeak': 'La password non soddisfa i requisiti',
        'validation.passwordMismatch': 'Le password non corrispondono',
        'validation.firstNameRequired': 'Nome richiesto',
        'validation.lastNameRequired': 'Cognome richiesto',
        'validation.termsRequired': 'Devi accettare i termini di servizio',

        // Errors
        'error.generic': 'Si è verificato un errore. Riprova.',
        'error.network': 'Errore di rete. Controlla la connessione.',
        'error.rateLimit': 'Troppi tentativi. Riprova più tardi.',
        'error.unauthorized': 'Credenziali non valide. Riprova.',
        'error.forbidden': 'Accesso negato.',
        'error.notFound': 'Risorsa non trovata.',

        // Admin
        'admin.title': 'Gestione Utenti',
        'admin.users': 'Utenti',
        'admin.pendingApprovals': 'In Attesa di Approvazione',
        'admin.settings': 'Impostazioni',
        'admin.auditLog': 'Log Audit',
        'admin.logout': 'Esci',
        'admin.approve': 'Approva',
        'admin.reject': 'Rifiuta',
        'admin.lock': 'Blocca',
        'admin.unlock': 'Sblocca',
        'admin.delete': 'Elimina',
        'admin.edit': 'Modifica',
        'admin.save': 'Salva',
        'admin.cancel': 'Annulla',
        'admin.confirm': 'Conferma',
        'admin.close': 'Chiudi',
        'admin.refresh': 'Aggiorna',
        'admin.view': 'Visualizza',
        'admin.changeRole': 'Cambia Ruolo',
        'admin.extend': 'Estendi',
        'admin.suspend': 'Sospendi',
        'admin.activate': 'Attiva',
        'admin.navigation': 'Navigazione',
        'admin.administration': 'Amministrazione',
        'admin.account': 'Account',
        'admin.allUsers': 'Tutti gli Utenti',
        'admin.noUsers': 'Nessun utente trovato',
        'admin.noPending': 'Nessuna Approvazione in Attesa',
        'admin.noPendingDesc': 'Tutte le registrazioni sono state processate.',
        'admin.noAudit': 'Nessuna Voce nel Log',
        'admin.noAuditDesc': 'Nessuna attività registrata.',
        'admin.saveSettings': 'Salva Impostazioni',

        // Admin Stats
        'admin.stats.totalUsers': 'Utenti Totali',
        'admin.stats.activeUsers': 'Utenti Attivi',
        'admin.stats.pendingApproval': 'In Attesa',
        'admin.stats.lockedUsers': 'Utenti Bloccati',

        // Admin Table
        'admin.table.user': 'Utente',
        'admin.table.role': 'Ruolo',
        'admin.table.status': 'Stato',
        'admin.table.lastLogin': 'Ultimo Accesso',
        'admin.table.expiresAt': 'Scadenza',
        'admin.table.actions': 'Azioni',
        'admin.table.registeredAt': 'Registrato',

        // Admin Filters
        'admin.filter.allStatuses': 'Tutti gli Stati',
        'admin.filter.active': 'Attivo',
        'admin.filter.pendingVerification': 'Verifica in Attesa',
        'admin.filter.pendingApproval': 'Approvazione in Attesa',
        'admin.filter.locked': 'Bloccato',
        'admin.filter.suspended': 'Sospeso',
        'admin.filter.expired': 'Scaduto',
        'admin.filter.deactivated': 'Disattivato',
        'admin.filter.allRoles': 'Tutti i Ruoli',
        'admin.filter.allActions': 'Tutte le Azioni',

        // Admin Pagination
        'admin.pagination.prev': 'Precedente',
        'admin.pagination.next': 'Successivo',

        // Admin Modals
        'admin.modal.userDetails': 'Dettagli Utente',
        'admin.modal.changeRole': 'Cambia Ruolo',
        'admin.modal.newRole': 'Nuovo Ruolo',
        'admin.modal.extendExpiry': 'Estendi Scadenza Account',
        'admin.modal.days': 'Giorni',
        'admin.modal.reason': 'Motivo (opzionale)',
        'admin.confirmReject': 'Rifiuta Utente',
        'admin.confirmRejectMessage': 'Sei sicuro di voler rifiutare questo utente?',
        'admin.confirmLock': 'Blocca Utente',
        'admin.confirmLockMessage': 'Sei sicuro di voler bloccare questo utente?',
        'admin.confirmSuspend': 'Sospendi Utente',
        'admin.confirmSuspendMessage': 'Sei sicuro di voler sospendere questo utente?',
        'admin.confirmDelete': 'Elimina Utente',
        'admin.confirmDeleteMessage': 'Sei sicuro di voler eliminare permanentemente questo utente? Questa azione non può essere annullata.',

        // Admin Settings
        'admin.settings.registration': 'Registrazione',
        'admin.settings.allowRegistration': 'Consenti Registrazione',
        'admin.settings.allowRegistrationDesc': 'Abilita registrazione pubblica',
        'admin.settings.requireApproval': 'Richiedi Approvazione',
        'admin.settings.requireApprovalDesc': 'I nuovi utenti richiedono approvazione admin',
        'admin.settings.requireEmailVerification': 'Richiedi Verifica Email',
        'admin.settings.requireEmailVerificationDesc': 'Gli utenti devono verificare l\'email',
        'admin.settings.defaultRole': 'Ruolo Predefinito',
        'admin.settings.defaultRoleDesc': 'Ruolo assegnato ai nuovi utenti',
        'admin.settings.security': 'Sicurezza',
        'admin.settings.maxLoginAttempts': 'Max Tentativi Login',
        'admin.settings.maxLoginAttemptsDesc': 'Prima del blocco account',
        'admin.settings.sessionTimeout': 'Timeout Sessione (ore)',
        'admin.settings.sessionTimeoutDesc': 'Logout automatico per inattività',
        'admin.settings.passwordExpiry': 'Scadenza Password (giorni)',
        'admin.settings.passwordExpiryDesc': '0 = mai',
        'admin.settings.accounts': 'Account',
        'admin.settings.defaultExpiry': 'Scadenza Account Predefinita (giorni)',
        'admin.settings.defaultExpiryDesc': '0 = mai',
        'admin.settings.expiryWarning': 'Avviso Scadenza (giorni)',
        'admin.settings.expiryWarningDesc': 'Giorni prima della scadenza per avvisare',
        'admin.settings.notifications': 'Notifiche',
        'admin.settings.notifyNewUser': 'Notifica Nuova Registrazione',
        'admin.settings.notifyNewUserDesc': 'Email agli admin per nuove registrazioni',
        'admin.settings.notifyLocked': 'Notifica Blocco Account',
        'admin.settings.notifyLockedDesc': 'Email agli admin quando un account viene bloccato',

        // Status labels
        'status.active': 'Attivo',
        'status.pendingVerification': 'Verifica in Attesa',
        'status.pendingApproval': 'Approvazione in Attesa',
        'status.locked': 'Bloccato',
        'status.suspended': 'Sospeso',
        'status.expired': 'Scaduto',
        'status.deactivated': 'Disattivato'
    }
};

// =============================================================================
// i18n Functions
// =============================================================================

let currentLanguage = 'en-US';

/**
 * Initialize i18n
 */
function initI18n() {
    // Get saved language or detect from browser
    const savedLang = localStorage.getItem('cpf_language');
    const browserLang = navigator.language || navigator.userLanguage;

    if (savedLang && translations[savedLang]) {
        currentLanguage = savedLang;
    } else if (browserLang.startsWith('it')) {
        currentLanguage = 'it-IT';
    } else {
        currentLanguage = 'en-US';
    }

    // Apply translations
    applyTranslations();

    // Setup language selector
    setupLanguageSelector();

    // Update HTML lang attribute
    document.documentElement.lang = currentLanguage.split('-')[0];
}

/**
 * Apply translations to page
 */
function applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');

    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = getText(key);
        if (translation) {
            el.textContent = translation;
        }
    });

    // Update placeholders
    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const translation = getText(key);
        if (translation) {
            el.placeholder = translation;
        }
    });

    // Update language button
    const langBtn = document.getElementById('currentLang');
    if (langBtn) {
        langBtn.textContent = currentLanguage.split('-')[0].toUpperCase();
    }

    // Update active class on dropdown
    const options = document.querySelectorAll('.language-option');
    options.forEach(opt => {
        opt.classList.toggle('active', opt.dataset.lang === currentLanguage);
    });
}

/**
 * Get translated text
 * @param {string} key - Translation key
 * @returns {string} Translated text or key
 */
function getText(key) {
    return translations[currentLanguage]?.[key] || translations['en-US']?.[key] || key;
}

/**
 * Get current language
 * @returns {string} Current language code
 */
function getCurrentLanguage() {
    return currentLanguage;
}

/**
 * Set language
 * @param {string} lang - Language code
 */
function setLanguage(lang) {
    if (!translations[lang]) return;

    currentLanguage = lang;
    localStorage.setItem('cpf_language', lang);
    applyTranslations();
    document.documentElement.lang = lang.split('-')[0];
}

/**
 * Setup language selector dropdown
 */
function setupLanguageSelector() {
    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');

    if (!langBtn || !langDropdown) return;

    // Toggle dropdown
    langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown.classList.toggle('show');
    });

    // Close on outside click
    document.addEventListener('click', () => {
        langDropdown.classList.remove('show');
    });

    // Language option click
    const options = document.querySelectorAll('.language-option');
    options.forEach(opt => {
        opt.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = opt.dataset.lang;
            setLanguage(lang);
            langDropdown.classList.remove('show');
        });
    });
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initI18n, getText, getCurrentLanguage, setLanguage };
}
