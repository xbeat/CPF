/**
 * CPF Auth Module - Register Page Script
 */

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize i18n
    initI18n();

    // Check if approval is required
    try {
        const settings = await authApi.getPublicSettings();
        if (settings.settings && settings.settings.requiresApproval) {
            document.getElementById('approvalNotice').classList.remove('hidden');
        }
    } catch (e) {
        console.error('Failed to load settings:', e);
    }

    // Toggle password visibility
    setupPasswordToggle('togglePassword', 'password');
    setupPasswordToggle('toggleConfirmPassword', 'confirmPassword');

    // Password strength indicator
    const passwordInput = document.getElementById('password');
    const strengthIndicator = document.getElementById('passwordStrength');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');

    passwordInput.addEventListener('input', (e) => {
        const password = e.target.value;

        if (password.length > 0) {
            strengthIndicator.classList.remove('hidden');

            // Update requirements
            updateRequirement('reqLength', password.length >= 12);
            updateRequirement('reqUppercase', /[A-Z]/.test(password));
            updateRequirement('reqLowercase', /[a-z]/.test(password));
            updateRequirement('reqNumber', /[0-9]/.test(password));
            updateRequirement('reqSpecial', /[^a-zA-Z0-9]/.test(password));

            // Calculate strength
            const strength = calculateStrength(password);
            strengthFill.className = 'password-strength-fill ' + strength.class;
            strengthText.textContent = getText('register.strength.' + strength.label);
        } else {
            strengthIndicator.classList.add('hidden');
            resetRequirements();
        }
    });

    // Handle form submission
    const form = document.getElementById('registerForm');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear previous errors
        clearErrors();

        // Get form data
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const acceptTerms = document.getElementById('acceptTerms').checked;

        // Validation
        let valid = true;

        if (!firstName) {
            showFieldError('firstName', getText('validation.firstNameRequired'));
            valid = false;
        }

        if (!lastName) {
            showFieldError('lastName', getText('validation.lastNameRequired'));
            valid = false;
        }

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
        } else if (!isValidPasswordStrength(password)) {
            showFieldError('password', getText('validation.passwordWeak'));
            valid = false;
        }

        if (password !== confirmPassword) {
            showFieldError('confirmPassword', getText('validation.passwordMismatch'));
            valid = false;
        }

        if (!acceptTerms) {
            showFieldError('terms', getText('validation.termsRequired'));
            valid = false;
        }

        if (!valid) return;

        // Submit
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            const response = await authApi.register({
                firstName,
                lastName,
                email,
                password,
                language: getCurrentLanguage()
            });

            if (response.success) {
                showAlert('success', response.message[getCurrentLanguage()] || response.message.en);
                setTimeout(() => {
                    window.location.href = '/login?registered=true';
                }, 3000);
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

function resetRequirements() {
    ['reqLength', 'reqUppercase', 'reqLowercase', 'reqNumber', 'reqSpecial'].forEach(id => {
        updateRequirement(id, false);
    });
}

function calculateStrength(password) {
    let score = 0;

    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 2;

    if (score <= 2) return { class: 'weak', label: 'weak' };
    if (score <= 4) return { class: 'fair', label: 'fair' };
    if (score <= 6) return { class: 'good', label: 'good' };
    return { class: 'strong', label: 'strong' };
}

function isValidPasswordStrength(password) {
    return password.length >= 12 &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password) &&
           /[0-9]/.test(password) &&
           /[^a-zA-Z0-9]/.test(password);
}
