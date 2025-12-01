import { selectedOrgData, selectedOrgId, setSelectedOrgId } from './state.js';
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
    const modalActions = document.querySelector('#indicatorModal .modal-actions');

    if(modalTitle) modalTitle.style.display = 'none';
    if(modalDialog) modalDialog.classList.add('fullscreen-client');
    if(modalActions) modalActions.style.display = 'none'; // Hide bottom action bar

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
                                <button class="btn btn-primary" data-action="view-assessment-details-from-edit" data-indicator-id="${indicatorId}">📋 View Details</button>
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
                             <div class="modal-content">
                                <div class="modal-header">
                                    <h2>📚 CPF Indicators Quick Reference</h2>
                                    <button class="modal-close" data-action="close-quick-reference">✕</button>
                                </div>
                                <div class="modal-body" id="reference-content">Loading...</div>
                            </div>
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

        // Always set client name from dashboard's selected organization
        currentData.metadata.client = selectedOrgData.name;

        if (existing && existing.raw_data?.client_conversation) {
            currentData.responses = existing.raw_data.client_conversation.responses || {};
            if(existing.raw_data.client_conversation.metadata) {
                // Merge metadata but preserve client name from dashboard
                const { client, ...otherMetadata } = existing.raw_data.client_conversation.metadata;
                currentData.metadata = { ...currentData.metadata, ...otherMetadata };
            }
            if(existing.raw_data.client_conversation.scores) {
                currentData.score = existing.raw_data.client_conversation.scores;
            }
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
    const modalTitle = document.getElementById('indicatorModalTitle');
    const modalActions = document.querySelector('#indicatorModal .modal-actions');

    if(modalDialog) modalDialog.classList.remove('fullscreen-client');
    if(modalTitle) modalTitle.style.display = 'block';
    if(modalActions) modalActions.style.display = 'flex'; // Restore bottom action bar
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
        const success = await deleteOrganizationAPI(orgId);
        if (success) {
            // Close the delete confirmation modal
            closeDeleteModal();

            // Reload all organizations
            await loadAllData();

            // If the deleted org was selected, clear selection
            if(selectedOrgId === orgId) {
                 setSelectedOrgId(null);
                 document.getElementById('assessmentSection')?.classList.add('hidden');
                 document.getElementById('emptyState')?.style.display = 'block';

                 // Hide export buttons
                 ['exportXLSXBtn', 'exportPDFBtn', 'exportZIPBtn'].forEach(id => {
                     const el = document.getElementById(id);
                     if(el) el.style.display = 'none';
                 });
            }
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
    if(!confirm(`Revert to version ${version}?\n\nThis will create a new version based on the selected one.`)) return;

    const orgId = currentHistoryOrgId || organizationContext?.orgId || selectedOrgId;
    const indicatorId = currentHistoryIndicatorId || currentData?.fieldKit?.indicator;

    if (!orgId || !indicatorId) {
        showAlert('Cannot revert: missing organization or indicator context', 'error');
        return;
    }

    try {
        const response = await fetch(`/api/organizations/${orgId}/assessments/${indicatorId}/revert`, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({version: version, user: 'Dashboard User'})
        });
        const result = await response.json();

        if(result.success && result.data) {
            closeHistoryModal();

            // Update selectedOrgData with data from server (DON'T reload from database!)
            selectedOrgData.assessments[indicatorId] = result.data;

            // If form is open, update it with reverted data
            if (currentData && currentData.fieldKit && selectedOrgData) {
                const revertedAssessment = selectedOrgData.assessments[indicatorId];

                if (revertedAssessment?.raw_data?.client_conversation) {
                    const conv = revertedAssessment.raw_data.client_conversation;

                    // Update responses - ensure it's a valid object
                    if (conv.responses && typeof conv.responses === 'object') {
                        currentData.responses = conv.responses;
                    } else {
                        currentData.responses = {};
                    }

                    currentData.score = conv.scores || null;

                    // Merge metadata carefully to preserve existing properties
                    if (conv.metadata && typeof conv.metadata === 'object') {
                        currentData.metadata = { ...currentData.metadata, ...conv.metadata };
                    }

                    // Force complete re-render by temporarily clearing fieldKit
                    const tempFieldKit = currentData.fieldKit;
                    currentData.fieldKit = null;

                    // Use setTimeout to ensure DOM is cleared before re-rendering
                    setTimeout(() => {
                        currentData.fieldKit = tempFieldKit;
                        renderFieldKit(currentData.fieldKit);
                        showAlert(`✅ Reverted to version ${version} - Form updated`, 'success');
                    }, 50);
                } else {
                    showAlert('⚠️ No data to restore', 'warning');
                }
            } else {
                showAlert('Reverted', 'success');
            }

            // Reload only dashboard/sidebar to update stats
            if (window.dashboardReloadOrganization) {
                await window.dashboardReloadOrganization();
            }
        } else {
            throw new Error(result.error || 'No data returned');
        }
    } catch(error) {
        console.error('Error reverting version:', error);
        showAlert(`Failed to revert: ${error.message}`, 'error');
    }
}

// --- ASSESSMENT DETAILS MODAL ---
export async function viewAssessmentDetailsFromEdit(indicatorId) {
    if (!selectedOrgData || !selectedOrgData.assessments?.[indicatorId]) return;
    const assessment = selectedOrgData.assessments[indicatorId];

    const title = document.getElementById('assessmentDetailsTitle');
    if(title) title.textContent = `Indicator ${indicatorId} - Assessment Details`;

    showModal('assessmentDetailsModal');
    const content = document.getElementById('assessmentDetailsContent');

    const riskClass = assessment.bayesian_score < 0.33 ? 'risk-low' :
                        assessment.bayesian_score < 0.66 ? 'risk-medium' : 'risk-high';
    const riskLabel = assessment.bayesian_score < 0.33 ? '🟢 Low Risk' :
                        assessment.bayesian_score < 0.66 ? '🟡 Medium Risk' : '🔴 High Risk';

    // Show loading state first
    content.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <div class="loading-spinner" style="margin: 0 auto 20px;"></div>
            <p>Loading Field Kit details...</p>
        </div>
    `;

    // Try to load Field Kit from GitHub
    try {
        const [categoryNum, indicatorNum] = indicatorId.split('.');
        const categoryName = CATEGORY_MAP[categoryNum];
        const language = selectedOrgData.metadata?.language || 'en-US';
        const url = `/auditor-field-kit/interactive/${language}/${categoryNum}.x-${categoryName}/indicator_${indicatorId}.json`;

        const response = await fetch(url);
        let fieldKit = null;
        if (response.ok) {
            fieldKit = await response.json();
        }

        // Render full details with Field Kit
        content.innerHTML = `
            <div style="display: grid; gap: 20px;">
                <!-- Assessment Summary -->
                <div>
                    <h4 style="margin: 0 0 10px 0; color: var(--primary);">${fieldKit?.title || assessment.title || 'Indicator ' + indicatorId}</h4>
                    <p style="margin: 0; color: var(--text-light); font-size: 14px;">${fieldKit?.category || assessment.category || 'Category'}</p>
                </div>

                <!-- Risk Stats -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
                    <div class="stat-box">
                        <div class="stat-label">Risk Score</div>
                        <div class="stat-value ${riskClass}">${(assessment.bayesian_score * 100).toFixed(1)}%</div>
                        <div style="font-size: 12px; color: var(--text-light); margin-top: 5px;">${riskLabel}</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">Confidence</div>
                        <div class="stat-value">${(assessment.confidence * 100).toFixed(1)}%</div>
                        <div style="font-size: 12px; color: var(--text-light); margin-top: 5px;">Assessment reliability</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">Maturity Level</div>
                        <div class="stat-value" style="text-transform: uppercase;">${assessment.maturity_level || 'N/A'}</div>
                        <div style="font-size: 12px; color: var(--text-light); margin-top: 5px;">Control maturity</div>
                    </div>
                </div>

                <!-- Assessment Information -->
                <div style="background: var(--bg-gray); padding: 15px; border-radius: 8px;">
                    <div style="font-weight: 600; margin-bottom: 10px;">Assessment Information</div>
                    <div style="display: grid; gap: 8px; font-size: 14px;">
                        <div><strong>Assessor:</strong> ${assessment.assessor || 'Unknown'}</div>
                        <div><strong>Assessment Date:</strong> ${new Date(assessment.assessment_date).toLocaleString()}</div>
                    </div>
                </div>

                ${fieldKit && fieldKit.description ? `
                <!-- Field Kit Description -->
                <div style="background: #dbeafe; padding: 15px; border-radius: 8px; border-left: 4px solid var(--primary);">
                    <h4 style="margin: 0 0 10px 0; color: var(--primary);">📚 Description</h4>
                    <p style="margin: 0 0 10px 0; line-height: 1.6;">${fieldKit.description.short || ''}</p>
                    ${fieldKit.description.context ? `
                        <div style="margin-top: 15px;">
                            <strong>Context:</strong>
                            <p style="margin: 5px 0 0 0; line-height: 1.6;">${fieldKit.description.context}</p>
                        </div>
                    ` : ''}
                    ${fieldKit.description.impact ? `
                        <div style="margin-top: 15px;">
                            <strong>Impact:</strong>
                            <p style="margin: 5px 0 0 0; line-height: 1.6;">${fieldKit.description.impact}</p>
                        </div>
                    ` : ''}
                </div>
                ` : ''}

                ${fieldKit && fieldKit.description && fieldKit.description.psychological_basis ? `
                <!-- Psychological Basis -->
                <div style="background: #e0e7ff; padding: 15px; border-radius: 8px; border-left: 4px solid #6366f1;">
                    <h4 style="margin: 0 0 10px 0; color: #4338ca;">🧠 Psychological Basis</h4>
                    <p style="margin: 0; line-height: 1.6; color: #1e1b4b;">${fieldKit.description.psychological_basis}</p>
                </div>
                ` : ''}

                ${fieldKit && fieldKit.scoring && fieldKit.scoring.maturity_levels ? `
                <!-- Maturity Levels -->
                <div style="background: var(--bg-gray); padding: 15px; border-radius: 8px;">
                    <h4 style="margin: 0 0 15px 0; color: var(--primary);">📊 Maturity Levels</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                        ${Object.entries(fieldKit.scoring.maturity_levels).map(([level, data]) => {
                            const bgColor = level === 'green' ? '#d4edda' : level === 'yellow' ? '#fff3cd' : '#f8d7da';
                            const textColor = level === 'green' ? '#155724' : level === 'yellow' ? '#856404' : '#721c24';
                            return '<div style="background: ' + bgColor + '; padding: 15px; border-radius: 8px;">' +
                                '<h5 style="margin: 0 0 10px 0; color: ' + textColor + '; text-transform: capitalize;">' +
                                    level + ' (' + (data.score_range ? data.score_range.join(' - ') : 'N/A') + ')' +
                                '</h5>' +
                                '<p style="margin: 0; font-size: 14px; color: ' + textColor + '; line-height: 1.5;">' +
                                    (data.description || 'No description') +
                                '</p>' +
                            '</div>';
                        }).join('')}
                    </div>
                </div>
                ` : ''}

                ${fieldKit && fieldKit.risk_scenarios && fieldKit.risk_scenarios.length > 0 ? `
                <!-- Risk Scenarios -->
                <div style="background: var(--bg-gray); padding: 15px; border-radius: 8px;">
                    <h4 style="margin: 0 0 15px 0; color: #856404;">🔥 Risk Scenarios</h4>
                    ${fieldKit.risk_scenarios.map((scenario, idx) => `
                        <div style="background: #fff3cd; padding: 20px; border-left: 4px solid #f39c12; margin-bottom: 15px; border-radius: 6px;">
                            <h5 style="margin: 0 0 10px 0; color: #856404; font-size: 16px;">
                                ${scenario.title || 'Scenario ' + (idx + 1)}
                            </h5>
                            <p style="margin: 0 0 10px 0; line-height: 1.6; color: #856404;">
                                ${scenario.description || ''}
                            </p>
                            ${scenario.likelihood ? '<p style="margin: 0; font-size: 14px;"><strong>Likelihood:</strong> ' + scenario.likelihood + '</p>' : ''}
                            ${scenario.impact ? '<p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Impact:</strong> ' + scenario.impact + '</p>' : ''}
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                ${assessment.raw_data && assessment.raw_data.client_conversation && assessment.raw_data.client_conversation.metadata && assessment.raw_data.client_conversation.metadata.notes ? `
                <div style="background: var(--bg-gray); padding: 15px; border-radius: 8px;">
                    <div style="font-weight: 600; margin-bottom: 10px;">📝 Notes</div>
                    <p style="margin: 0; font-size: 14px; line-height: 1.6;">${assessment.raw_data.client_conversation.metadata.notes}</p>
                </div>
                ` : ''}

                ${assessment.raw_data && assessment.raw_data.client_conversation && assessment.raw_data.client_conversation.red_flags && assessment.raw_data.client_conversation.red_flags.length > 0 ? `
                <div style="background: #fee2e2; padding: 15px; border-radius: 8px; border: 1px solid var(--danger);">
                    <div style="font-weight: 600; margin-bottom: 10px; color: var(--danger);">🚩 Red Flags Identified (${assessment.raw_data.client_conversation.red_flags.length})</div>
                    <ul style="margin: 0; padding-left: 20px; font-size: 14px;">
                        ${assessment.raw_data.client_conversation.red_flags.map(flag => `<li>${typeof flag === 'object' ? flag.flag : flag}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}

                ${fieldKit ? `
                <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid var(--border);">
                    <a href="${url}" target="_blank" style="color: var(--primary); text-decoration: none; font-weight: 600;">
                        📄 View Full Field Kit JSON on GitHub →
                    </a>
                </div>
                ` : ''}
            </div>
        `;

    } catch (error) {
        console.error('Error loading Field Kit:', error);

        // Fallback to basic info if Field Kit not available
        content.innerHTML = `
            <div style="display: grid; gap: 20px;">
                <div>
                    <h4 style="margin: 0 0 10px 0; color: var(--primary);">${assessment.title || 'Indicator ' + indicatorId}</h4>
                    <p style="margin: 0; color: var(--text-light); font-size: 14px;">${assessment.category || 'Category'}</p>
                </div>

                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
                    <div class="stat-box">
                        <div class="stat-label">Risk Score</div>
                        <div class="stat-value ${riskClass}">${(assessment.bayesian_score * 100).toFixed(1)}%</div>
                        <div style="font-size: 12px; color: var(--text-light); margin-top: 5px;">${riskLabel}</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">Confidence</div>
                        <div class="stat-value">${(assessment.confidence * 100).toFixed(1)}%</div>
                        <div style="font-size: 12px; color: var(--text-light); margin-top: 5px;">Assessment reliability</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">Maturity Level</div>
                        <div class="stat-value" style="text-transform: uppercase;">${assessment.maturity_level || 'N/A'}</div>
                        <div style="font-size: 12px; color: var(--text-light); margin-top: 5px;">Control maturity</div>
                    </div>
                </div>

                <div style="background: var(--bg-gray); padding: 15px; border-radius: 8px;">
                    <div style="font-weight: 600; margin-bottom: 10px;">Assessment Information</div>
                    <div style="display: grid; gap: 8px; font-size: 14px;">
                        <div><strong>Assessor:</strong> ${assessment.assessor || 'Unknown'}</div>
                        <div><strong>Assessment Date:</strong> ${new Date(assessment.assessment_date).toLocaleString()}</div>
                    </div>
                </div>

                <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid var(--warning);">
                    <strong>⚠️ Field Kit Details Not Available</strong>
                    <p style="margin-top: 10px;">Could not load full Field Kit from GitHub: ${error.message}</p>
                </div>
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

    // Import categoryDescriptions from state
    import('./state.js').then(state => {
        const categoryDescriptions = state.categoryDescriptions;

        if (!categoryDescriptions || !categoryDescriptions.categories || !categoryDescriptions.categories[catKey]) {
            if(title) title.textContent = `Category ${catKey}`;
            if(body) body.innerHTML = `<p>Category descriptions not loaded yet.</p>`;
            return;
        }

        // Detect current language (default to 'en')
        const currentLang = getCurrentLanguage();
        const langKey = currentLang === 'it' ? 'it' : 'en';
        const cat = categoryDescriptions.categories[catKey][langKey];

        if (!cat) {
            if(title) title.textContent = `Category ${catKey}`;
            if(body) body.innerHTML = `<p>No data available for this category.</p>`;
            return;
        }

        if(title) title.textContent = `${catKey}. ${cat.name}`;

        if(body) {
            body.innerHTML = `
                <div style="line-height: 1.6;">
                    <!-- Short Description -->
                    <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid var(--primary); margin-bottom: 20px;">
                        <strong style="color: var(--primary);">📌 Overview:</strong>
                        <p style="margin: 8px 0 0 0;">${cat.short_description}</p>
                    </div>

                    <!-- Full Description -->
                    <h4 style="margin: 0 0 10px 0; color: var(--primary);">Description</h4>
                    <p style="margin: 0 0 20px 0; color: var(--text-dark);">${cat.description}</p>

                    <!-- Examples -->
                    ${cat.examples && cat.examples.length > 0 ? `
                    <h4 style="margin: 0 0 10px 0; color: var(--primary);">Common Attack Examples</h4>
                    <ul style="margin: 0 0 20px 0; padding-left: 20px;">
                        ${cat.examples.map(ex => `<li style="margin-bottom: 8px;">${ex}</li>`).join('')}
                    </ul>
                    ` : ''}

                    <!-- Mitigation -->
                    ${cat.mitigation ? `
                    <h4 style="margin: 0 0 10px 0; color: var(--success);">🛡️ Mitigation Strategies</h4>
                    <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid var(--success);">
                        <p style="margin: 0;">${cat.mitigation}</p>
                    </div>
                    ` : ''}
                </div>
            `;
        }
    });
}

export function closeCategoryModal() { closeModal('categoryModal'); }

// Helper per ottenere la lingua corrente
function getCurrentLanguage() {
    // Controlla localStorage o default 'en'
    return localStorage.getItem('language') || 'en';
}