// Account locked page functionality
document.addEventListener('DOMContentLoaded', () => {
    initI18n();

    // Get locked until from URL params
    const params = new URLSearchParams(window.location.search);
    const lockedUntil = params.get('until');

    if (lockedUntil) {
        const date = new Date(lockedUntil);
        const lang = getCurrentLanguage();
        document.getElementById('lockedUntil').textContent = date.toLocaleString(
            lang === 'it-IT' ? 'it-IT' : 'en-US',
            {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }
        );

        // Start countdown
        updateCountdown(date);
        setInterval(() => updateCountdown(date), 1000);
    } else {
        document.getElementById('lockInfo').classList.add('hidden');
    }
});

function updateCountdown(targetDate) {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
        window.location.href = '/login';
        return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const countdown = document.getElementById('lockedUntil');
    if (countdown) {
        countdown.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} remaining`;
    }
}
