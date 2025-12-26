/**
 * CPF Auth Module - Forgot Password Page Script
 */

document.addEventListener('DOMContentLoaded', () => {
    initI18n();

    const form = document.getElementById('forgotForm');
    const submitBtn = document.getElementById('submitBtn');
    const successState = document.getElementById('successState');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();

        const email = document.getElementById('email').value.trim();

        if (!email) {
            showFieldError('email', getText('validation.emailRequired'));
            return;
        }

        if (!isValidEmail(email)) {
            showFieldError('email', getText('validation.emailInvalid'));
            return;
        }

        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            await authApi.forgotPassword(email);

            // Always show success (don't reveal if email exists)
            form.classList.add('hidden');
            successState.classList.remove('hidden');

        } catch (error) {
            // Still show success for security
            form.classList.add('hidden');
            successState.classList.remove('hidden');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
});
