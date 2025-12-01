import { loadAllData, loadOrganizationDetails } from './api.js';
import { setupDashboardEventDelegation } from './events.js';
import { setupClientEventDelegation } from '../client/index.js'; // Importante! Attiva eventi client

// Global callback for client to refresh dashboard
window.dashboardReloadOrganization = async function() {
    // Re-imports needed because this is global scope
    // We assume selectedOrgId is managed in state
    const { selectedOrgId } = await import('./state.js'); 
    if (selectedOrgId) {
        await loadOrganizationDetails(selectedOrgId);
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Setup Events
    setupDashboardEventDelegation();
    setupClientEventDelegation(); // Client logic listeners

    // 2. Load Initial Data
    await loadAllData();
});