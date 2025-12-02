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

/**
 * Show a confirmation dialog with custom title, message and buttons
 * Returns a Promise that resolves to true if confirmed, false if cancelled
 *
 * @param {Object} options - Configuration options
 * @param {string} options.title - Dialog title
 * @param {string} options.message - Dialog message
 * @param {string} [options.confirmText='Confirm'] - Text for confirm button
 * @param {string} [options.cancelText='Cancel'] - Text for cancel button
 * @param {string} [options.confirmClass='btn-primary'] - CSS class for confirm button (btn-primary, btn-danger, btn-warning)
 * @returns {Promise<boolean>} - Resolves to true if confirmed, false if cancelled
 */
export function showConfirm({
    title = 'Confirm Action',
    message = 'Are you sure?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmClass = 'btn-primary'
}) {
    return new Promise((resolve) => {
        const modal = document.getElementById('confirmDialog');
        const titleEl = document.getElementById('confirmDialogTitle');
        const messageEl = document.getElementById('confirmDialogMessage');
        const confirmBtn = document.getElementById('confirmOkBtn');
        const cancelBtn = document.getElementById('confirmCancelBtn');

        if (!modal || !titleEl || !messageEl || !confirmBtn || !cancelBtn) {
            console.error('Confirm dialog elements not found');
            resolve(false);
            return;
        }

        // Set content
        titleEl.textContent = title;
        messageEl.textContent = message;
        confirmBtn.textContent = confirmText;
        cancelBtn.textContent = cancelText;

        // Update confirm button style
        confirmBtn.className = `btn ${confirmClass}`;

        // Handle confirm
        const handleConfirm = () => {
            cleanup();
            closeModal('confirmDialog');
            resolve(true);
        };

        // Handle cancel
        const handleCancel = () => {
            cleanup();
            closeModal('confirmDialog');
            resolve(false);
        };

        // Cleanup listeners
        const cleanup = () => {
            confirmBtn.removeEventListener('click', handleConfirm);
            cancelBtn.removeEventListener('click', handleCancel);
            modal.removeEventListener('click', handleBackdropClick);
        };

        // Handle backdrop click
        const handleBackdropClick = (e) => {
            if (e.target === modal) {
                handleCancel();
            }
        };

        // Add listeners
        confirmBtn.addEventListener('click', handleConfirm);
        cancelBtn.addEventListener('click', handleCancel);
        modal.addEventListener('click', handleBackdropClick);

        // Show modal
        showModal('confirmDialog');
    });
}

/**
 * Show a permanent delete confirmation dialog that requires typing the organization ID
 * Returns a Promise that resolves to true if confirmed (ID matches), false if cancelled
 *
 * @param {Object} options - Configuration options
 * @param {string} options.orgId - Organization ID that must be typed to confirm
 * @param {string} options.orgName - Organization name to display
 * @returns {Promise<boolean>} - Resolves to true if confirmed with correct ID, false if cancelled
 */
export function showPermanentDeleteDialog({ orgId, orgName }) {
    return new Promise((resolve) => {
        const modal = document.getElementById('permanentDeleteDialog');
        const orgNameEl = document.getElementById('permanentDeleteOrgName');
        const orgIdEl = document.getElementById('permanentDeleteOrgId');
        const inputEl = document.getElementById('permanentDeleteInput');
        const confirmBtn = document.getElementById('permanentDeleteConfirmBtn');
        const cancelBtn = document.getElementById('permanentDeleteCancelBtn');
        const hintEl = document.getElementById('permanentDeleteInputHint');

        if (!modal || !orgNameEl || !orgIdEl || !inputEl || !confirmBtn || !cancelBtn) {
            console.error('Permanent delete dialog elements not found');
            resolve(false);
            return;
        }

        // Set organization info
        orgNameEl.textContent = orgName;
        orgIdEl.textContent = orgId;

        // Reset input
        inputEl.value = '';
        confirmBtn.disabled = true;
        hintEl.textContent = 'Please type the ID exactly as shown above';
        hintEl.style.color = 'var(--text-light)';

        // Handle input validation
        const handleInput = () => {
            const inputValue = inputEl.value.trim();

            if (inputValue === orgId) {
                confirmBtn.disabled = false;
                hintEl.textContent = '✓ ID matches - you can proceed';
                hintEl.style.color = 'var(--success)';
            } else {
                confirmBtn.disabled = true;
                if (inputValue.length > 0) {
                    hintEl.textContent = '✗ ID does not match';
                    hintEl.style.color = 'var(--danger)';
                } else {
                    hintEl.textContent = 'Please type the ID exactly as shown above';
                    hintEl.style.color = 'var(--text-light)';
                }
            }
        };

        // Handle confirm
        const handleConfirm = () => {
            if (inputEl.value.trim() === orgId) {
                cleanup();
                closeModal('permanentDeleteDialog');
                resolve(true);
            }
        };

        // Handle cancel
        const handleCancel = () => {
            cleanup();
            closeModal('permanentDeleteDialog');
            resolve(false);
        };

        // Cleanup listeners and reset form
        const cleanup = () => {
            inputEl.removeEventListener('input', handleInput);
            confirmBtn.removeEventListener('click', handleConfirm);
            cancelBtn.removeEventListener('click', handleCancel);
            modal.removeEventListener('click', handleBackdropClick);
            inputEl.value = '';
            confirmBtn.disabled = true;
        };

        // Handle backdrop click
        const handleBackdropClick = (e) => {
            if (e.target === modal) {
                handleCancel();
            }
        };

        // Add listeners
        inputEl.addEventListener('input', handleInput);
        confirmBtn.addEventListener('click', handleConfirm);
        cancelBtn.addEventListener('click', handleCancel);
        modal.addEventListener('click', handleBackdropClick);

        // Show modal and focus input
        showModal('permanentDeleteDialog');

        // Focus input after a short delay to ensure modal is visible
        setTimeout(() => {
            inputEl.focus();
        }, 100);
    });
}