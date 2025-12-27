import {
    loadAllData, loadOrganizationDetails, saveOrganizationAPI
} from './api.js';
import {
    setSelectedOrgId, selectedOrgData, getEditingOrgId, setEditingOrgId
} from './state.js';
import {
    renderOrganizations, filterAndSortOrganizations
} from './render-list.js';
import {
    closeOrgModal, openTrashModal, // <--- CORRETTO: openOrgModal RIMOSSO
    closeTrashModal, openCategoryModal,
    closeCategoryModal, closeIndicatorModal, openIntegratedClient,
    closeDeleteModal, confirmDelete, openHistoryModal,
    closeHistoryModal, revertToVersion, openCreateOrgModal,
    editOrganization, deleteOrganization,
    viewAssessmentDetailsFromEdit, closeAssessmentDetailsModal,
    deleteAssessmentFromDetails, openHistoryModalFromDetails
} from './modals.js';
import {
    exportCurrentOrgXLSX, exportCurrentOrgPDF, exportCurrentOrgZIP
} from './export.js';
import {
    setMatrixZoom
} from './render-details.js';
import {
    loadIndicatorForCompile, resetCompileForm, saveAssessmentToOrg
} from './compile.js';
import {
    toggleDetailedAnalysis, toggleScoreDetails
} from '../client/render.js';
import {
    saveToAPI, exportData, generateReport, importJSON, resetIntegratedClientData
} from '../client/api.js';
import {
    renderMaturityTab
} from './maturity.js';
import {
    renderPredictiveTab,
    toggleSimulationMode,
    resetSimulation,
    zoomIn,
    zoomOut,
    resetView
} from './predictive-dynamics.js';
import {
    renderInterventionTab,
    selectCpifPhase,
    toggleResistanceSources,
    generateInterventionReport
} from './intervention.js';
import {
    closeModal
} from '../shared/utils.js';

export function setupDashboardEventDelegation() {
    
    // --- CLICK DELEGATION ---
    document.addEventListener('click', async (e) => {
        const target = e.target.closest('[data-action]');
        if (!target) return;
        
        const action = target.dataset.action;
        
        // Prevent default for buttons
        if (target.tagName === 'BUTTON') e.preventDefault();

        // Sidebar Toggles
        if (action === 'open-sidebar') {
            const sidebar = document.querySelector('.sidebar');
            const dashboardMain = document.querySelector('.dashboard-main');
            const openBtn = document.getElementById('sidebarOpenBtn');
            if(sidebar) sidebar.classList.remove('sidebar-hidden');
            if(dashboardMain) dashboardMain.classList.remove('sidebar-collapsed');
            if(openBtn) openBtn.style.display = 'none';
            return;
        }
        if (action === 'close-sidebar') {
            const sidebar = document.querySelector('.sidebar');
            const dashboardMain = document.querySelector('.dashboard-main');
            const openBtn = document.getElementById('sidebarOpenBtn');
            if(sidebar) sidebar.classList.add('sidebar-hidden');
            if(dashboardMain) dashboardMain.classList.add('sidebar-collapsed');
            if(openBtn) openBtn.style.display = 'inline-flex';
            return;
        }

        // 1. Sidebar & Org Selection
        if (action === 'select-organization') {
            const orgId = target.dataset.orgId;
            setSelectedOrgId(orgId);
            renderOrganizations(); // Update active class
            await loadOrganizationDetails(orgId);

            const emptyState = document.getElementById('emptyState');
            if(emptyState) emptyState.style.display = 'none';

            const assessmentSection = document.getElementById('assessmentSection');
            if(assessmentSection) assessmentSection.classList.remove('hidden');

            // Show export buttons
            ['exportXLSXBtn', 'exportPDFBtn', 'exportZIPBtn'].forEach(id => {
                const btn = document.getElementById(id);
                if(btn) btn.style.display = 'inline-block';
            });
        }
        
        // 2. Org CRUD Modals
        if (action === 'open-create-org-modal') openCreateOrgModal();
        if (action === 'edit-organization') editOrganization(target.dataset.orgId);
        if (action === 'delete-organization') deleteOrganization(target.dataset.orgId, target.dataset.orgName);
        if (action === 'close-org-modal') closeOrgModal();
        if (action === 'close-delete-modal') closeDeleteModal();
        if (action === 'confirm-delete') confirmDelete();

        // 3. Trash Modals
        if (action === 'open-trash-modal') openTrashModal();
        if (action === 'close-trash-modal') closeTrashModal();
        if (action === 'restore-from-trash') {
            import('./modals.js').then(m => m.restoreFromTrash(target.dataset.orgId));
        }
        if (action === 'permanent-delete-org') {
            import('./modals.js').then(m => m.permanentDeleteOrg(target.dataset.orgId, target.dataset.orgName));
        }

        // 4. Indicator & Assessment Details
        if (action === 'open-indicator-detail') {
            const indId = target.dataset.indicatorId;
            const orgId = target.dataset.orgId;
            openIntegratedClient(indId, orgId);
        }
        if (action === 'close-indicator-modal') closeIndicatorModal();
        if (action === 'view-assessment-details-from-edit') {
            viewAssessmentDetailsFromEdit(target.dataset.indicatorId);
        }
        if (action === 'close-assessment-details-modal') closeAssessmentDetailsModal();
        if (action === 'delete-assessment-from-details') deleteAssessmentFromDetails();

        // 5. Category Modals & Filters
        if (action === 'open-category-modal') openCategoryModal(target.dataset.categoryKey);
        if (action === 'close-category-modal') closeCategoryModal();
        if (action === 'filter-by-category') {
            const catKey = target.dataset.categoryKey;
            import('./state.js').then(s => {
                if (s.categoryFilter === catKey) s.setCategoryFilter(null);
                else s.setCategoryFilter(catKey);
                import('./render-details.js').then(r => r.renderProgressMatrix(selectedOrgData));
            });
        }
        if (action === 'clear-category-filter') {
            import('./state.js').then(s => {
                s.setCategoryFilter(null);
                import('./render-details.js').then(r => r.renderProgressMatrix(selectedOrgData));
            });
        }

        // 6. History
        if (action === 'open-history-modal') openHistoryModal();
        if (action === 'open-history-modal-from-details') openHistoryModalFromDetails();
        if (action === 'close-history-modal') closeHistoryModal();
        if (action === 'revert-to-version') revertToVersion(target.dataset.version);

        // 6b. Confirm Dialog (for reset and revert confirmations)
        if (action === 'close-confirm-dialog') closeModal('confirmDialog');
        if (action === 'cancel-confirm-dialog') closeModal('confirmDialog');
        if (action === 'confirm-confirm-dialog') {
            // Handled internally by showConfirm() promise
            // This is just here for documentation
        }

        // 6c. Permanent Delete Dialog
        if (action === 'close-permanent-delete-dialog') closeModal('permanentDeleteDialog');
        if (action === 'cancel-permanent-delete-dialog') closeModal('permanentDeleteDialog');
        // Note: confirm button doesn't use data-action, handled by addEventListener in utils.js

        // 7. Exports
        if (action === 'export-xlsx') exportCurrentOrgXLSX();
        if (action === 'export-pdf') exportCurrentOrgPDF();
        if (action === 'export-zip') exportCurrentOrgZIP();

        // 8. Sorting & Filtering List
        if (action === 'toggle-sort-direction') {
            import('./state.js').then(s => {
                s.setSortDirection(s.sortDirection === 'desc' ? 'asc' : 'desc');
                const btn = document.getElementById('sort-direction');
                if(btn) btn.textContent = s.sortDirection === 'desc' ? '⬇️' : '⬆️';
                filterAndSortOrganizations();
            });
        }
        if (action === 'reset-filters') {
             const searchInput = document.getElementById('org-search');
             if(searchInput) searchInput.value = '';
             
             const sortSelect = document.getElementById('org-sort');
             if(sortSelect) sortSelect.value = 'created_at';
             
             import('./state.js').then(s => {
                s.setSortDirection('desc');
                renderOrganizations();
             });
        }

        // 9. Tabs
        if (action === 'switch-tab') {
            const tabId = target.dataset.tab;
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            target.classList.add('active');

            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            const content = document.getElementById(tabId + 'Tab');
            if(content) content.classList.add('active');

            if (tabId === 'maturity') {
                renderMaturityTab(); // Call directly like in original code
            }
            if (tabId === 'predictive') {
                renderPredictiveTab(); // Render Predictive Dynamics graph
            }
            if (tabId === 'intervention') {
                renderInterventionTab(); // Render CPIF Intervention tab
            }
        }

        // 9c. Intervention Tab Actions
        if (action === 'select-cpif-phase') {
            const phaseId = target.dataset.phase;
            selectCpifPhase(phaseId);
        }
        if (action === 'toggle-resistance-sources') {
            toggleResistanceSources();
        }
        if (action === 'generate-intervention-report') {
            generateInterventionReport();
        }
        if (action === 'export-intervention-plan') {
            // Export intervention plan as JSON
            generateInterventionReport(); // Reuse report generation for now
        }

        // 9b. Predictive Dynamics Controls
        if (action === 'zoom-in-graph') zoomIn();
        if (action === 'zoom-out-graph') zoomOut();
        if (action === 'reset-graph-view') resetView();
        if (action === 'reset-simulation') resetSimulation();

        // 10. Zoom Controls
        if (action === 'set-matrix-zoom') {
            setMatrixZoom(target.dataset.matrixType, parseInt(target.dataset.zoomLevel));
        }

        // 11. Compile Manual Tab
        if (action === 'load-indicator-for-compile') loadIndicatorForCompile();
        if (action === 'reset-compile-form') resetCompileForm();
        if (action === 'save-assessment-to-org') saveAssessmentToOrg();

        // 12. File Inputs
        if (action === 'trigger-file-input') {
            const inputId = target.dataset.fileInputId;
            if(inputId) {
                const el = document.getElementById(inputId);
                if(el) el.click();
            }
        }

        // 13. Client Actions
        if (action === 'save-data') {
             saveToAPI().catch(e => console.error(e)); // FIXED: Removed unnecessary alert (toast already shown)
        }
        if (action === 'reset-integrated-client') {
             resetIntegratedClientData(); // FIXED: Reset only clears fields, doesn't close modal
        }
        if (action === 'export-data') exportData();
        if (action === 'generate-report') generateReport();
        // Note: toggle-detailed-analysis and toggle-score-details are handled by client/events.js
    });

    // --- CHANGE DELEGATION ---
    document.addEventListener('change', (e) => {
        const target = e.target;

        // Handle simulation mode toggle (no data-action attribute)
        if (target.id === 'simulationModeToggle') {
            toggleSimulationMode(target.checked);
            return;
        }

        const action = target.dataset.action;
        if (!action) return;

        if (action === 'filter-and-sort') filterAndSortOrganizations();
        if (action === 'import-json') importJSON(e);
    });

    // --- INPUT DELEGATION ---
    document.addEventListener('input', (e) => {
        const target = e.target;
        
        // Org Search
        if (target.id === 'org-search') filterAndSortOrganizations();
        
        // Org Name Auto-ID Generation
        if (target.id === 'orgName' && !getEditingOrgId()) {
            const name = target.value.trim();
            if (name) {
                import('./state.js').then(({organizations}) => {
                    let slug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').substring(0, 30);
                    let finalId = `org-${slug}`;
                    let counter = 1;
                    while (organizations && organizations.some(o => o.id === finalId)) {
                        counter++;
                        finalId = `org-${slug}-${counter}`;
                    }
                    const idInput = document.getElementById('orgId');
                    if(idInput) idInput.value = finalId;
                });
            }
        }
    });

    // --- FORM SUBMIT ---
    const orgForm = document.getElementById('orgForm');
    if (orgForm) {
        orgForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const editingId = getEditingOrgId();

            // Get all values from form inputs (like original code)
            const orgId = document.getElementById('orgId').value.trim();
            const orgName = document.getElementById('orgName').value.trim();
            const orgIndustry = document.getElementById('orgIndustry').value;
            const orgSize = document.getElementById('orgSize').value;
            const orgCountry = document.getElementById('orgCountry').value.trim().toUpperCase();
            const orgLanguage = document.getElementById('orgLanguage').value;
            const orgSedeSociale = document.getElementById('orgSedeSociale') ? document.getElementById('orgSedeSociale').value.trim() : '';
            const orgPartitaIva = document.getElementById('orgPartitaIva') ? document.getElementById('orgPartitaIva').value.trim() : '';
            const orgNotes = document.getElementById('orgNotes') ? document.getElementById('orgNotes').value.trim() : '';

            const orgData = {
                id: orgId, // Use value from input field like original code
                name: orgName,
                industry: orgIndustry,
                size: orgSize,
                country: orgCountry,
                language: orgLanguage,
                sede_sociale: orgSedeSociale,
                partita_iva: orgPartitaIva,
                notes: orgNotes
            };

            const fetchEl = document.getElementById('fetchIndicators');
            const fetchIndicators = fetchEl ? fetchEl.checked : false;
            const saveBtn = document.getElementById('saveOrgBtn');

            if(saveBtn) {
                saveBtn.disabled = true;
                saveBtn.textContent = 'Saving...';
            }

            saveOrganizationAPI(orgData, editingId, fetchIndicators).then(success => {
                if (!success && saveBtn) {
                    saveBtn.disabled = false;
                    saveBtn.textContent = editingId ? 'Save Changes' : 'Create Organization';
                }
            });
        });
    }

    // --- ESC KEY HANDLER FOR MODALS ---
    // Close modals on ESC key - always close the most recently opened modal
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && window.modalStack && window.modalStack.length > 0) {
            // Get the most recently opened modal (last in stack)
            const topModal = window.modalStack[window.modalStack.length - 1];

            // Close it based on its ID
            switch (topModal) {
                case 'orgModal':
                    closeOrgModal();
                    break;
                case 'deleteModal':
                    closeDeleteModal();
                    break;
                case 'indicatorModal':
                    closeIndicatorModal();
                    break;
                case 'assessmentDetailsModal':
                    closeAssessmentDetailsModal();
                    break;
                case 'trashModal':
                    closeTrashModal();
                    break;
                case 'historyModal':
                    closeHistoryModal();
                    break;
                case 'category-modal':
                    closeCategoryModal();
                    break;
                case 'permanentDeleteDialog':
                    closeModal('permanentDeleteDialog');
                    break;
                case 'confirmDialog':
                    closeModal('confirmDialog');
                    break;
                case 'reference-modal':
                    // This is the Quick Reference modal inside the integrated client
                    // We need to find and call its close function from client context
                    const closeBtn = document.querySelector('[data-action="close-quick-reference"]');
                    if (closeBtn) closeBtn.click();
                    break;
            }
        }
    });
}