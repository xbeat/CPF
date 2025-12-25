/**
 * CPF Auth Module - Login Page Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize i18n
    initI18n();

    // Toggle password visibility
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    togglePassword.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
    });

    // Handle form submission
    const form = document.getElementById('loginForm');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear previous errors
        clearErrors();

        // Get form data
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Basic validation
        let valid = true;

        if (!email) {
            showFieldError('email', getText('validation.emailRequired'));
            valid = false;
        } else if (!isValidEmail(email)) {
            showFieldError('email', getText('validation.emailInvalid'));
            valid = false;
        }

        if (!password) {
            showFieldError('password', getText('validation.passwordRequired'));
            valid = false;
        }

        if (!valid) return;

        // Submit
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            const response = await authApi.login({ email, password });

            if (response.success) {
                // Store tokens
                authApi.setTokens(response.accessToken);

                // Check if password change required
                if (response.user.mustChangePassword) {
                    showAlert('warning', getText('login.mustChangePassword'));
                    setTimeout(() => {
                        window.location.href = '/change-password';
                    }, 2000);
                    return;
                }

                // Redirect to dashboard
                showAlert('success', getText('login.success'));
                setTimeout(() => {
                    // Redirect based on role
                    const dashboardUrl = getDashboardUrl(response.user.role);
                    window.location.href = dashboardUrl;
                }, 1000);
            }
        } catch (error) {
            handleApiError(error);
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });

    // Check for messages from URL params
    const params = new URLSearchParams(window.location.search);
    if (params.get('verified') === 'true') {
        showAlert('success', getText('login.emailVerified'));
    }
    if (params.get('reset') === 'true') {
        showAlert('success', getText('login.passwordReset'));
    }
    if (params.get('expired') === 'true') {
        showAlert('warning', getText('login.sessionExpired'));
    }
    if (params.get('logout') === 'true') {
        showAlert('info', getText('login.loggedOut'));
    }
});

function getDashboardUrl(role) {
    const dashboardBaseUrl = localStorage.getItem('dashboardUrl') || 'http://localhost:3000';

    switch (role) {
        case 'super_admin':
        case 'admin':
            return '/admin';
        default:
            return dashboardBaseUrl + '/auditing/';
    }
}
