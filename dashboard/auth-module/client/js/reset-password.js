/**
 * CPF Auth Module - Reset Password Page Script
 */

let resetToken = null;

document.addEventListener('DOMContentLoaded', async () => {
    initI18n();

    // Get token from URL
    const params = new URLSearchParams(window.location.search);
    resetToken = params.get('token');

    const loadingState = document.getElementById('loadingState');
    const invalidToken = document.getElementById('invalidToken');
    const resetForm = document.getElementById('resetForm');

    if (!resetToken) {
        loadingState.classList.add('hidden');
        invalidToken.classList.remove('hidden');
        return;
    }

    // Verify token
    try {
        const response = await authApi.verifyResetToken(resetToken);

        loadingState.classList.add('hidden');

        if (response.valid) {
            resetForm.classList.remove('hidden');
        } else {
            invalidToken.classList.remove('hidden');
        }
    } catch (error) {
        loadingState.classList.add('hidden');
        invalidToken.classList.remove('hidden');
    }

    // Password toggles
    setupPasswordToggle('togglePassword', 'password');
    setupPasswordToggle('toggleConfirmPassword', 'confirmPassword');

    // Password validation
    const passwordInput = document.getElementById('password');
    passwordInput.addEventListener('input', (e) => {
        const password = e.target.value;
        updateRequirement('reqLength', password.length >= 12);
        updateRequirement('reqUppercase', /[A-Z]/.test(password));
        updateRequirement('reqLowercase', /[a-z]/.test(password));
        updateRequirement('reqNumber', /[0-9]/.test(password));
        updateRequirement('reqSpecial', /[^a-zA-Z0-9]/.test(password));
    });

    // Form submission
    resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();

        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const submitBtn = document.getElementById('submitBtn');

        let valid = true;

        if (!isValidPasswordStrength(password)) {
            showFieldError('password', getText('validation.passwordWeak'));
            valid = false;
        }

        if (password !== confirmPassword) {
            showFieldError('confirmPassword', getText('validation.passwordMismatch'));
            valid = false;
        }

        if (!valid) return;

        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            const response = await authApi.resetPassword(resetToken, password, confirmPassword);

            if (response.success) {
                resetForm.classList.add('hidden');
                document.getElementById('successState').classList.remove('hidden');
            }
        } catch (error) {
            handleApiError(error);
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
});

function setupPasswordToggle(toggleId, inputId) {
    const toggle = document.getElementById(toggleId);
    const input = document.getElementById(inputId);
    if (toggle && input) {
        toggle.addEventListener('click', () => {
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
            toggle.textContent = type === 'password' ? '👁️' : '🙈';
        });
    }
}

function updateRequirement(id, valid) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.toggle('valid', valid);
        el.classList.toggle('invalid', !valid);
    }
}

function isValidPasswordStrength(password) {
    return password.length >= 12 &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password) &&
           /[0-9]/.test(password) &&
           /[^a-zA-Z0-9]/.test(password);
}
