export function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export function capitalizeFirst(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        // Integrazione con eventuale stack manager globale se esiste
        if (window.pushModal) window.pushModal(modalId);
    }
}

export function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        if (window.popModal) window.popModal(modalId);
    }
}

// QUESTA È LA FUNZIONE CHE MANCAVA
export function showAlert(message, type = 'info') {
    // 1. Cerca o crea il container delle notifiche
    let container = document.getElementById('notification-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-toast-container';
        // Stile inline per garantire che sia visibile sopra tutto
        container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 99999; display: flex; flex-direction: column; gap: 10px;';
        document.body.appendChild(container);
    }

    // 2. Definisci i colori
    const colors = {
        success: '#10b981', // Verde
        error: '#ef4444',   // Rosso
        info: '#3b82f6',    // Blu
        warning: '#f59e0b'  // Arancione
    };

    // 3. Crea il toast
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        background-color: ${colors[type] || colors.info};
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-family: sans-serif;
        font-size: 14px;
        min-width: 250px;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
    `;

    container.appendChild(toast);

    // 4. Anima l'entrata
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });

    // 5. Rimuovi dopo 3 secondi
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 300);
    }, 3000);
}