/**
 * CPF Auth Module - Verify Email Page Script
 */

document.addEventListener('DOMContentLoaded', async () => {
    initI18n();

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    const loadingState = document.getElementById('loadingState');
    const successState = document.getElementById('successState');
    const pendingState = document.getElementById('pendingState');
    const errorState = document.getElementById('errorState');

    if (!token) {
        loadingState.classList.add('hidden');
        errorState.classList.remove('hidden');
        return;
    }

    try {
        const response = await authApi.verifyEmail(token);

        loadingState.classList.add('hidden');

        if (response.success) {
            if (response.status === 'pending_approval') {
                pendingState.classList.remove('hidden');
            } else {
                successState.classList.remove('hidden');
                document.getElementById('successMessage').textContent =
                    response.message[getCurrentLanguage()] || response.message.en;
            }
        }
    } catch (error) {
        loadingState.classList.add('hidden');
        errorState.classList.remove('hidden');

        if (error.error) {
            document.getElementById('errorMessage').textContent =
                error.error[getCurrentLanguage()] || error.error.en || error.error;
        }
    }

    // Resend form
    const resendForm = document.getElementById('resendForm');
    resendForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        if (!email || !isValidEmail(email)) {
            return;
        }

        const resendBtn = document.getElementById('resendBtn');
        resendBtn.classList.add('loading');
        resendBtn.disabled = true;

        try {
            await authApi.resendVerification(email);
            errorState.classList.add('hidden');
            document.getElementById('resendSuccess').classList.remove('hidden');
        } catch (error) {
            // Still show success for security
            errorState.classList.add('hidden');
            document.getElementById('resendSuccess').classList.remove('hidden');
        } finally {
            resendBtn.classList.remove('loading');
            resendBtn.disabled = false;
        }
    });
});
