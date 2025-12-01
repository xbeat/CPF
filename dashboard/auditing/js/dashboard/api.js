import { 
    organizations, setOrganizations, 
    setSelectedOrgData, setCategoryDescriptions, 
    selectedOrgId 
} from './state.js';
import { renderOrganizations } from './render-list.js';
import { renderAssessmentDetails } from './render-details.js';
import { showAlert, closeModal } from '../shared/utils.js';

// --- Load Data ---
export async function loadAllData() {
    try {
        const response = await fetch('/api/organizations', {
            cache: 'no-cache',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
        const data = await response.json();

        setOrganizations(data.organizations || []);
        
        // Load auxiliary data
        await loadCategoryDescriptions();
        await loadTrashCount();

        renderOrganizations();

        // Reload selected org if present
        if (selectedOrgId) {
            await loadOrganizationDetails(selectedOrgId);
        }
    } catch (error) {
        console.error('Error loading organizations:', error);
        showAlert('Failed to load organizations: ' + error.message, 'error');
    }
}

export async function loadOrganizationDetails(orgId) {
    try {
        const response = await fetch(`/api/organizations/${orgId}`, {
            cache: 'no-cache',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
        const result = await response.json();

        if (result.success) {
            setSelectedOrgData(result.data);
            renderAssessmentDetails();
        } else {
            showAlert('Failed to load organization details', 'error');
        }
    } catch (error) {
        console.error('Error loading organization details:', error);
        showAlert('Failed to load organization details: ' + error.message, 'error');
    }
}

// --- Category Descriptions ---
async function loadCategoryDescriptions() {
    try {
        const response = await fetch('category-descriptions.json');
        if (response.ok) {
            const desc = await response.json();
            setCategoryDescriptions(desc);
        }
    } catch (error) {
        console.error('Error loading category descriptions:', error);
    }
}

// --- Trash Count ---
export async function loadTrashCount() {
    try {
        const response = await fetch('/api/trash', { cache: 'no-cache' });
        const data = await response.json();
        if (data.success) {
            const badge = document.getElementById('trashCount');
            if (badge) {
                if (data.count > 0) {
                    badge.textContent = data.count;
                    badge.style.display = 'inline-block';
                } else {
                    badge.style.display = 'none';
                }
            }
        }
    } catch (error) {
        console.error('Error loading trash count:', error);
    }
}

// --- CRUD Operations ---
export async function saveOrganizationAPI(orgData, editingOrgId, fetchIndicators) {
    try {
        let response;
        if (editingOrgId) {
            // Update existing - use editingOrgId from state, not from orgData
            response = await fetch(`/api/organizations/${editingOrgId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orgData)
            });
        } else {
            // Create new
            response = await fetch('/api/organizations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orgData)
            });
        }

        const result = await response.json();

        if (result.success) {
            showAlert(editingOrgId ? 'Organization updated successfully!' : 'Organization created successfully!', 'success');

            if (!editingOrgId && fetchIndicators) {
                await fetchIndicatorsFromGitHub(orgData.id, orgData.language);
            }

            closeModal('orgModal');
            await loadAllData();
            return true;
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Error saving organization:', error);
        showAlert('Failed to save organization: ' + error.message, 'error');
        return false;
    }
}

export async function deleteOrganizationAPI(orgId) {
    try {
        const response = await fetch(`/api/organizations/${orgId}`, { method: 'DELETE' });
        const result = await response.json();

        if (result.success) {
            showAlert('Organization deleted successfully', 'success');
            return true;
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Error deleting organization:', error);
        showAlert('Failed to delete organization: ' + error.message, 'error');
        return false;
    }
}

export async function fetchIndicatorsFromGitHub(orgId, language) {
    const progressEl = document.getElementById('fetchProgress');
    const progressBar = document.getElementById('fetchProgressBar');
    if (progressEl) progressEl.classList.remove('hidden');

    const GITHUB_BASE_URL = '/auditor-field-kit/interactive';
    const categories = [
        { id: 1, name: '1.x-authority' }, { id: 2, name: '2.x-temporal' },
        { id: 3, name: '3.x-social' }, { id: 4, name: '4.x-affective' },
        { id: 5, name: '5.x-cognitive' }, { id: 6, name: '6.x-group' },
        { id: 7, name: '7.x-stress' }, { id: 8, name: '8.x-unconscious' },
        { id: 9, name: '9.x-ai' }, { id: 10, name: '10.x-convergent' }
    ];

    try {
        const totalIndicators = 100;
        let fetchedCount = 0;
        let successCount = 0;

        for (const category of categories) {
            for (let ind = 1; ind <= 10; ind++) {
                const indicatorId = `${category.id}.${ind}`;
                const url = `${GITHUB_BASE_URL}/${language}/${category.name}/indicator_${indicatorId}.json`;

                try {
                    const response = await fetch(url);
                    if (response.ok) successCount++;
                } catch (error) {
                    console.error(`❌ Error fetching indicator ${indicatorId}`);
                }

                fetchedCount++;
                const percent = Math.round((fetchedCount / totalIndicators) * 100);
                if (progressBar) {
                    progressBar.style.width = percent + '%';
                    progressBar.textContent = `${percent}%`;
                }

                if (fetchedCount % 10 === 0) await new Promise(resolve => setTimeout(resolve, 200));
            }
        }
        showAlert(`✅ Fetched ${successCount} indicators successfully!`, 'success');
    } catch (error) {
        showAlert('Failed to fetch indicators: ' + error.message, 'error');
    } finally {
        if (progressEl) progressEl.classList.add('hidden');
    }
}