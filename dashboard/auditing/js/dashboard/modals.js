import { selectedOrgData, selectedOrgId } from './state.js';
import { showModal, closeModal, showAlert, escapeHtml } from '../shared/utils.js';
import { CATEGORY_MAP } from '../shared/config.js';
import { organizationContext, currentData, renderFieldKit, resetCurrentData } from '../client/index.js';
import { loadAllData, deleteOrganizationAPI, loadOrganizationDetails } from './api.js';
import { renderOrganizations } from './render-list.js';

// --- INTEGRATED CLIENT MODAL ---
export async function openIntegratedClient(indicatorId, orgId) {
    if (!indicatorId || !selectedOrgData) return;

    // 1. Prepare UI
    const modalTitle = document.getElementById('indicatorModalTitle');
    const modalContent = document.getElementById('indicatorModalContent');
    const modalDialog = document.querySelector('#indicatorModal .modal-content');
    
    if(modalTitle) modalTitle.style.display = 'none';
    if(modalDialog) modalDialog.classList.add('fullscreen-client');
    
    showModal('indicatorModal');
    if(modalContent) modalContent.innerHTML = `<div class="loading-spinner"></div> Loading Indicator ${indicatorId}...`;

    // 2. Fetch Indicator JSON
    const lang = selectedOrgData.metadata?.language || 'en-US';
    const [catNum] = indicatorId.split('.');
    const catName = CATEGORY_MAP[catNum];
    const url = `/auditor-field-kit/interactive/${lang}/${catNum}.x-${catName}/indicator_${indicatorId}.json`;

    try {
        const response = await fetch(url);
        if(!response.ok) throw new Error('Field Kit JSON not found');
        const indicatorData = await response.json();

        // 3. Inject Client HTML Structure
        if(modalContent) {
            modalContent.innerHTML = `
                <div class="cpf-client">
                    <div class="container" id="client-integrated-container" style="max-width:100%;margin:0;box-shadow:none;">
                        <div class="header" id="header"></div>
                        <div class="toolbar" style="justify-content: space-between; flex-wrap: wrap; gap: 10px;">
                            <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
                                <button class="btn btn-info" data-action="show-quick-reference">📚 Quick Reference</button>
                                <button class="btn btn-info" data-action="toggle-detailed-analysis">📊 Show/Hide Analysis</button>
                                <button class="btn btn-light" data-action="trigger-file-input" data-file-input-id="file-input-integrated">📂 Import Data</button>
                                <input type="file" id="file-input-integrated" accept=".json" data-action="import-json" style="display: none;">
                                <button class="btn btn-danger" data-action="reset-compile-form" title="Reset assessment">🗑️ Reset</button>
                                <button class="btn btn-warning" data-action="open-history-modal-from-details">📜 History</button>
                            </div>
                            <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
                                <button class="btn btn-secondary" data-action="save-data">💾 Save</button>
                                <button class="btn btn-success" data-action="export-data">💾 Export Data</button>
                                <button class="btn btn-primary" data-action="generate-report">📊 Report</button>
                                <button class="btn btn-secondary" data-action="close-indicator-modal">Close</button>
                            </div>
                        </div>
                        <div id="auto-save-status" class="hide">Auto-saved</div>
                        <div class="metadata-bar" id="metadata-bar" style="display:none;"></div>
                        <div class="content" id="content"></div>
                        <div class="action-bar" id="action-bar" style="display:none;"></div>
                        
                        <div id="reference-modal" class="cpf-client modal" style="display:none;z-index:1100;">
                             <div class="modal-content"><div class="modal-header"><h2>Reference</h2><button data-action="close-quick-reference">X</button></div><div class="modal-body" id="reference-content">Loading...</div></div>
                        </div>
                    </div>
                </div>
            `;
        }

        // 4. Initialize Client State
        organizationContext.orgId = orgId;
        organizationContext.orgName = selectedOrgData.name;
        organizationContext.language = lang;

        // 5. Load Data (Merge existing or Reset)
        const existing = selectedOrgData.assessments?.[indicatorId];
        
        resetCurrentData(); 
        
        if (existing && existing.raw_data?.client_conversation) {
            currentData.responses = existing.raw_data.client_conversation.responses || {};
            if(existing.raw_data.client_conversation.metadata) {
                currentData.metadata = { ...currentData.metadata, ...existing.raw_data.client_conversation.metadata };
            }
            if(existing.raw_data.client_conversation.scores) {
                currentData.score = existing.raw_data.client_conversation.scores;
            }
        } else {
            currentData.metadata.client = selectedOrgData.name;
        }
        
        currentData.fieldKit = indicatorData;

        // 6. Render Client
        renderFieldKit(indicatorData);

    } catch (error) {
        console.error(error);
        if(modalContent) modalContent.innerHTML = `<div style="padding:20px;color:red">Error: ${error.message}</div><button class="btn btn-secondary" data-action="close-indicator-modal">Close</button>`;
    }
}

export function closeIndicatorModal() {
    closeModal('indicatorModal');
    const modalDialog = document.querySelector('#indicatorModal .modal-content');
    if(modalDialog) modalDialog.classList.remove('fullscreen-client');
    const modalTitle = document.getElementById('indicatorModalTitle');
    if(modalTitle) modalTitle.style.display = 'block';
}

// --- ORGANIZATION MODALS ---

export function openCreateOrgModal() {
    import('./events.js').then(m => m.setEditingOrgId(null));
    const title = document.getElementById('orgModalTitle');
    if(title) title.textContent = 'Create New Organization';
    
    // Reset form
    const form = document.getElementById('orgForm');
    if(form) form.reset();
    
    const idInput = document.getElementById('orgId');
    if(idInput) idInput.disabled = false;
    
    // Reset save button
    const saveBtn = document.getElementById('saveOrgBtn');
    if(saveBtn) {
        saveBtn.textContent = 'Create Organization';
        saveBtn.disabled = false;
    }
    
    const fetchContainer = document.getElementById('fetchIndicators')?.parentElement?.parentElement;
    if(fetchContainer) fetchContainer.classList.remove('hidden');
    
    showModal('orgModal');
}

export function editOrganization(orgId) {
    import('./state.js').then(({organizations}) => {
        const org = organizations.find(o => o.id === orgId);
        if(!org) return;
        
        import('./events.js').then(m => m.setEditingOrgId(orgId));
        
        const title = document.getElementById('orgModalTitle');
        if(title) title.textContent = 'Edit Organization';
        
        const saveBtn = document.getElementById('saveOrgBtn');
        if(saveBtn) {
            saveBtn.textContent = 'Save Changes';
            saveBtn.disabled = false;
        }
        
        document.getElementById('orgId').value = org.id;
        document.getElementById('orgId').disabled = true;
        document.getElementById('orgName').value = org.name;
        document.getElementById('orgIndustry').value = org.industry || 'Technology';
        document.getElementById('orgSize').value = org.size || 'Medium';
        document.getElementById('orgCountry').value = org.country || '';
        document.getElementById('orgLanguage').value = org.language || 'en-US';
        
        // Optional fields
        if(document.getElementById('orgSedeSociale')) document.getElementById('orgSedeSociale').value = org.sede_sociale || '';
        if(document.getElementById('orgPartitaIva')) document.getElementById('orgPartitaIva').value = org.partita_iva || '';
        if(document.getElementById('orgNotes')) document.getElementById('orgNotes').value = org.notes || '';

        const fetchContainer = document.getElementById('fetchIndicators')?.parentElement?.parentElement;
        if(fetchContainer) fetchContainer.classList.add('hidden');
        
        showModal('orgModal');
    });
}

export function closeOrgModal() {
    closeModal('orgModal');
    const fetchProgress = document.getElementById('fetchProgress');
    if(fetchProgress) fetchProgress.classList.add('hidden');
}

// --- DELETE MODALS ---

export function deleteOrganization(orgId, orgName) {
    const el = document.getElementById('deleteOrgName');
    if(el) el.textContent = orgName;
    const btn = document.querySelector('[data-action="confirm-delete"]');
    if(btn) btn.dataset.deleteId = orgId;
    showModal('deleteModal');
}

export async function confirmDelete() {
    const btn = document.querySelector('[data-action="confirm-delete"]');
    const orgId = btn ? btn.dataset.deleteId : null;
    if(orgId) {
        await deleteOrganizationAPI(orgId);
        // If the deleted org was selected, clear selection
        if(selectedOrgId === orgId) {
             document.getElementById('assessmentSection').classList.add('hidden');
             document.getElementById('emptyState').style.display = 'block';
        }
    }
}

export function closeDeleteModal() {
    closeModal('deleteModal');
}

// --- TRASH MODALS ---

export async function openTrashModal() {
    showModal('trashModal');
    try {
        const response = await fetch('/api/trash');
        const data = await response.json();
        const content = document.getElementById('trashContent');
        
        if (!data.success || data.count === 0) {
            content.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🗑️</div><div class="empty-state-title">Empty</div></div>`;
            return;
        }

        let html = '<div style="padding:20px;">';
        data.organizations.forEach(org => {
            const daysLeft = org.days_until_permanent_delete || 0;
            html += `
                <div style="background:var(--bg-gray);border:1px solid var(--border);border-radius:8px;padding:15px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;">
                    <div>
                        <strong>${org.name}</strong> (${org.id})<br>
                        <small>Expires in ${daysLeft} days</small>
                    </div>
                    <div>
                        <button class="btn btn-primary btn-small" data-action="restore-from-trash" data-org-id="${org.id}">Restore</button>
                        <button class="btn btn-danger btn-small" data-action="permanent-delete-org" data-org-id="${org.id}" data-org-name="${org.name}">Delete</button>
                    </div>
                </div>`;
        });
        html += '</div>';
        content.innerHTML = html;
    } catch(e) {
        console.error(e);
    }
}

export function closeTrashModal() { closeModal('trashModal'); }

export async function restoreFromTrash(orgId) {
    try {
        await fetch(`/api/organizations/${orgId}/restore`, { method: 'POST', body: JSON.stringify({user:'Dashboard'}) });
        showAlert('Restored!', 'success');
        openTrashModal(); // Refresh list
        loadAllData(); // Refresh main list
    } catch(e) { showAlert(e.message, 'error'); }
}

export async function permanentDeleteOrg(orgId, orgName) {
    if(!confirm(`Delete ${orgName} forever?`)) return;
    try {
        await fetch(`/api/organizations/${orgId}/permanent?user=Dashboard`, { method: 'DELETE' });
        showAlert('Deleted forever', 'success');
        openTrashModal();
    } catch(e) { showAlert(e.message, 'error'); }
}

// --- HISTORY MODALS ---

// Variabili locali per tracciare il contesto della history
let currentHistoryOrgId = null;
let currentHistoryIndicatorId = null;

export async function openHistoryModal() {
    // Usiamo variabili importate da state.js ma dobbiamo accedervi puntualmente se lo script è caricato
    // Per sicurezza usiamo le variabili globali del modulo se impostate
    // Qui assumiamo che openHistoryModal venga chiamato quando c'è un indicatore selezionato in Client o Dashboard
    
    // Per semplicità, recuperiamo l'ID dall'ultimo client aperto o dall'elemento UI se disponibile
    // In questo refactoring, openHistoryModal è chiamato dalla UI che ha i dataset
    
    // NOTA: Se openHistoryModal è chiamato da un bottone generico, dobbiamo sapere "di chi" stiamo guardando la history.
    // Assumiamo che venga chiamato dal contesto del Client Integrato (che ha organizationContext)
    
    let orgId = organizationContext?.orgId || selectedOrgId;
    let indicatorId = currentData?.fieldKit?.indicator;
    
    if (!orgId || !indicatorId) {
        // Fallback: prova a vedere se siamo in modalità dettagli dashboard
        // Non abbiamo un modo facile qui senza argomenti. 
        // Modifichiamo il chiamante in events.js per passare argomenti se necessario?
        // Per ora mostriamo errore se non troviamo il contesto
        showAlert('No indicator selected context found', 'error');
        return;
    }

    currentHistoryOrgId = orgId;
    currentHistoryIndicatorId = indicatorId;

    showModal('historyModal');
    const content = document.getElementById('historyContent');
    const title = document.getElementById('historyModalTitle');
    if(title) title.textContent = `📜 Version History - ${indicatorId}`;

    content.innerHTML = '<div class="loading-spinner"></div> Loading...';

    try {
        const response = await fetch(`/api/organizations/${orgId}/assessments/${indicatorId}/history`);
        const data = await response.json();

        if (!data.success || data.history.versions.length === 0) {
            content.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📜</div>
                    <div class="empty-state-title">No History</div>
                    <div class="empty-state-text">No previous versions found</div>
                </div>
            `;
            return;
        }

        // Render history (newest first)
        const versions = [...data.history.versions].reverse();

        let html = '<div style="padding: 20px;">';

        versions.forEach((version, index) => {
            const isCurrent = index === 0;
            const score = version.data.bayesian_score;
            const confidence = version.data.confidence;
            const timestamp = new Date(version.timestamp).toLocaleString();
            const isReset = score === 0;

            const resetBadgeRight = isCurrent ? '120px' : '10px';
            html += `
                <div style="background: ${isCurrent ? '#eff6ff' : 'var(--bg-gray)'}; border: 2px solid ${isCurrent ? 'var(--primary)' : 'var(--border)'}; border-radius: 10px; padding: 20px; margin-bottom: 15px; position: relative;">
                    ${isCurrent ? '<div style="position: absolute; top: 10px; right: 10px; background: var(--primary); color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 600;">CURRENT</div>' : ''}
                    ${isReset ? `<div style="position: absolute; top: 10px; right: ${resetBadgeRight}; background: var(--warning); color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 600;">🔄 RESET</div>` : ''}
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="flex: 1;">
                            <div style="font-size: 18px; font-weight: 600; color: var(--primary); margin-bottom: 8px;">
                                Version ${version.version}
                            </div>
                            <div style="font-size: 13px; color: var(--text-light); margin-bottom: 12px;">
                                <div>⏰ ${timestamp}</div>
                                <div>👤 ${escapeHtml(version.user)}</div>
                            </div>
                            <div style="display: flex; gap: 20px; margin-top: 15px;">
                                <div>
                                    <div style="font-size: 11px; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.5px;">Score</div>
                                    <div style="font-size: 20px; font-weight: 700; color: var(--primary);">${score.toFixed(3)}</div>
                                </div>
                                <div>
                                    <div style="font-size: 11px; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.5px;">Confidence</div>
                                    <div style="font-size: 20px; font-weight: 700; color: var(--primary);">${confidence.toFixed(2)}</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button class="btn ${isCurrent ? 'btn-primary' : 'btn-warning'} btn-small" data-action="revert-to-version" data-version="${version.version}">
                                ${isCurrent ? '🔄 Reload This' : '↩️ Revert to This'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        content.innerHTML = html;

    } catch (error) {
        console.error('Error loading history:', error);
        showAlert('Failed to load history', 'error');
        content.innerHTML = `<div style="padding:20px;color:red;">Error: ${error.message}</div>`;
    }
}

export function closeHistoryModal() {
    closeModal('historyModal');
    currentHistoryOrgId = null;
    currentHistoryIndicatorId = null;
}

export async function revertToVersion(version) {
    if(!confirm(`Revert to version ${version}?`)) return;
    try {
        const response = await fetch(`/api/organizations/${currentHistoryOrgId}/assessments/${currentHistoryIndicatorId}/revert`, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({version: version, user: 'Dashboard'})
        });
        const res = await response.json();
        if(res.success) {
            showAlert('Reverted successfully', 'success');
            closeHistoryModal();
            // Reload the integrated client with new data
            openIntegratedClient(currentHistoryIndicatorId, currentHistoryOrgId);
            // Refresh dashboard background
            loadOrganizationDetails(currentHistoryOrgId);
        } else {
            throw new Error(res.error);
        }
    } catch(e) { showAlert(e.message, 'error'); }
}

// --- ASSESSMENT DETAILS MODAL ---
export function viewAssessmentDetailsFromEdit(indicatorId) {
    // This is the read-only view modal
    if (!selectedOrgData || !selectedOrgData.assessments?.[indicatorId]) return;
    const assessment = selectedOrgData.assessments[indicatorId];
    
    showModal('assessmentDetailsModal');
    const content = document.getElementById('assessmentDetailsContent');
    if(content) {
        content.innerHTML = `
            <h3>${assessment.title}</h3>
            <p>Score: ${(assessment.bayesian_score*100).toFixed(1)}%</p>
            <p>Confidence: ${(assessment.confidence*100).toFixed(1)}%</p>
            <p>Date: ${new Date(assessment.assessment_date).toLocaleString()}</p>
            <hr>
            <div>${JSON.stringify(assessment.raw_data?.client_conversation?.responses || {}, null, 2)}</div>
            <div style="margin-top:20px;">
                <button class="btn btn-danger" data-action="delete-assessment-from-details" data-indicator-id="${indicatorId}">Delete Assessment</button>
            </div>
        `;
    }
}

export function closeAssessmentDetailsModal() { closeModal('assessmentDetailsModal'); }

export async function deleteAssessmentFromDetails() {
    // Logic to delete assessment currently viewed
    // This requires us to know which indicator is open. 
    // We can grab it from the button data attribute we set in viewAssessmentDetailsFromEdit
    const btn = document.querySelector('[data-action="delete-assessment-from-details"]');
    const indicatorId = btn ? btn.dataset.indicatorId : null;
    
    if(indicatorId && selectedOrgId) {
        if(!confirm('Delete this assessment?')) return;
        try {
            await fetch(`/api/organizations/${selectedOrgId}/assessments/${indicatorId}`, {method:'DELETE'});
            showAlert('Deleted', 'success');
            closeAssessmentDetailsModal();
            loadOrganizationDetails(selectedOrgId);
        } catch(e) { showAlert(e.message, 'error'); }
    }
}

export async function openHistoryModalFromDetails() {
    // When called from the client integrated modal, organizationContext and currentData
    // should already be set by openIntegratedClient. Just delegate to openHistoryModal.
    if (!organizationContext?.orgId || !currentData?.fieldKit?.indicator) {
        showAlert('No assessment context found. Please open an indicator first.', 'error');
        return;
    }

    // Keep the client modal open and show history on top
    await openHistoryModal();
}

// Category modal
export function openCategoryModal(catKey) { 
    showModal('categoryModal');
    const title = document.getElementById('category-modal-title');
    const body = document.getElementById('category-modal-body');
    if(title) title.textContent = `Category ${catKey}`;
    // Load content dynamically or static...
    if(body) body.innerHTML = `<p>Details for category ${catKey}...</p>`;
}
export function closeCategoryModal() { closeModal('categoryModal'); }