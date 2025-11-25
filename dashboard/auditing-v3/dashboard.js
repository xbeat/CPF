// ===== ES6 IMPORTS =====
import {
    organizationContext,
    currentData,
    renderFieldKit,
    calculateIndicatorScore,
    showQuickReference,
    closeQuickReference,
    toggleDetailedAnalysis,
    importJSON,
    saveData,
    exportData,
    generateReport
} from './client-integrated.js';

// ===== GLOBAL STATE =====
let organizations = [];
let selectedOrgId = null;
let selectedOrgData = null;
let editingOrgId = null;
let deletingOrgId = null;
let selectedIndicatorId = null;
let categoryFilter = null;
let sortDirection = 'desc'; // 'asc' or 'desc'
let categoryDescriptions = null; // Category descriptions (multilingual)
let currentOrgLanguage = 'en-US'; // Current organization language
// Note: modalStack is now in ui-utils.js as window.modalStack

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    loadAllData();
});

// Modal stack management
// Note: pushModal() and popModal() are now in shared/ui-utils.js

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
            case 'reference-modal':
                closeQuickReference();
                break;
            case 'category-modal':
                closeCategoryModal();
                break;
        }
    }
});

// ===== DATA LOADING =====
async function loadAllData() {
    try {
        const response = await fetch('/api/organizations');
        const data = await response.json();

        organizations = data.organizations || [];

        // Load category descriptions
        await loadCategoryDescriptions();

        // Load trash count for badge
        await loadTrashCount();
        renderOrganizations();

        // If there's a selected org, reload its data
        if (selectedOrgId) {
            await loadOrganizationDetails(selectedOrgId);
        }
    } catch (error) {
        console.error('Error loading organizations:', error);
        showAlert('Failed to load organizations: ' + error.message, 'error');
    }
}

async function loadOrganizationDetails(orgId) {
    try {
        const response = await fetch(`/api/organizations/${orgId}`);
        const result = await response.json();

        if (result.success) {
            selectedOrgData = result.data;
            // Update current organization language for category modal
            // Language is stored in metadata.language, not in language field
            currentOrgLanguage = selectedOrgData.metadata?.language || 'en-US';
            renderAssessmentDetails();
        } else {
            showAlert('Failed to load organization details', 'error');
        }
    } catch (error) {
        console.error('Error loading organization details:', error);
        showAlert('Failed to load organization details: ' + error.message, 'error');
    }
}

function refreshData() {
    showAlert('Refreshing data...', 'info');
    loadAllData();
}

// ===== SIDEBAR FUNCTIONS =====
// Note: openSidebar() and closeSidebar() are now in shared/ui-utils.js

// ===== RENDERING =====
function renderOrganizations() {
    const orgList = document.getElementById('org-list');
    const countEl = document.getElementById('org-count');

    countEl.textContent = organizations.length;

    if (organizations.length === 0) {
        orgList.innerHTML = `
            <div style="padding: 1rem; text-align: center; color: var(--text-light);">
                <p>No organizations found</p>
            </div>
        `;
        return;
    }

    orgList.innerHTML = '';

    organizations.forEach(org => {
        const item = document.createElement('div');
        item.className = 'org-item';
        if (selectedOrgId === org.id) {
            item.classList.add('active');
        }
        item.dataset.action = 'select-organization';
        item.dataset.orgId = org.id;

        const overallRisk = org.stats?.overall_risk || 0;
        const riskClass = overallRisk > 0.66 ? 'high' :
            overallRisk > 0.33 ? 'medium' : 'low';
        const riskLabel = overallRisk > 0.66 ? 'High' :
            overallRisk > 0.33 ? 'Medium' : 'Low';
        const completion = org.stats?.completion_percentage || 0;
        const totalAssessments = org.stats?.total_assessments || 0;

        // Get country flag using ISO codes
        const country = org.country || 'Unknown';
        const countryFlag = country === 'IT' ? '🇮🇹' :
                           country === 'US' ? '🇺🇸' :
                           country === 'GB' ? '🇬🇧' :
                           country === 'DE' ? '🇩🇪' :
                           country === 'FR' ? '🇫🇷' :
                           country === 'ES' ? '🇪🇸' : '🌐';

        // Get language info
        const language = org.language || 'en-US';

        // Format creation date
        const createdDate = org.created_at ? new Date(org.created_at).toLocaleDateString() : 'N/A';

        item.innerHTML = `
            <div class="org-card-header">
                <div style="flex: 1; min-width: 0;">
                    <div class="org-name">${escapeHtml(org.name)}</div>
                    <div class="org-meta">
                        ${org.industry} • ${capitalizeFirst(org.size)} • ${countryFlag} ${org.country}
                    </div>
                </div>
                <div class="org-card-actions">
                    <button class="icon-btn" data-action="edit-organization" data-org-id="${org.id}" title="Edit">✏️</button>
                    <button class="icon-btn" data-action="delete-organization" data-org-id="${org.id}" data-org-name="${escapeHtml(org.name)}" title="Delete">🗑️</button>
                </div>
            </div>
            <div class="org-stats-detailed">
                <div class="stat-row">
                    <span class="stat-label">Created</span>
                    <span class="stat-value">${createdDate}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Language</span>
                    <span class="stat-value">${language}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Assessments</span>
                    <span class="stat-value">${totalAssessments}/100 (${completion}%)</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Risk Level</span>
                    <span class="stat-value ${riskClass}">${riskLabel} (${(overallRisk * 100).toFixed(0)}%)</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Confidence</span>
                    <span class="stat-value">${org.stats?.avg_confidence ? (org.stats.avg_confidence * 100).toFixed(0) + '%' : 'N/A'}</span>
                </div>
            </div>
        `;

        orgList.appendChild(item);
    });
}

// Toggle sort direction
function toggleSortDirection() {
    sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    const btn = document.getElementById('sort-direction');
    btn.textContent = sortDirection === 'desc' ? '⬇️' : '⬆️';
    filterAndSortOrganizations();
}

// Filter and sort organizations based on search and sort criteria
function filterAndSortOrganizations() {
    if (!organizations || organizations.length === 0) return;

    const searchValue = document.getElementById('org-search').value.toLowerCase().trim();
    const sortValue = document.getElementById('org-sort').value;

    // Store all organizations if not already stored
    if (!window.allOrganizations) {
        window.allOrganizations = [...organizations];
    }

    // Filter organizations - search by name only
    let filtered = window.allOrganizations.filter(org => {
        if (!searchValue) return true;

        // Search only in organization name
        return org.name.toLowerCase().includes(searchValue);
    });

    // Sort organizations with direction support
    filtered.sort((a, b) => {
        let result = 0;

        switch (sortValue) {
            case 'name':
                result = a.name.localeCompare(b.name);
                break;

            case 'risk':
                result = (a.stats?.overall_risk || 0) - (b.stats?.overall_risk || 0);
                break;

            case 'completion':
                result = (a.stats?.completion_percentage || 0) - (b.stats?.completion_percentage || 0);
                break;

            case 'updated_at':
                result = new Date(a.updated_at || 0) - new Date(b.updated_at || 0);
                break;

            case 'assessments':
                result = (a.stats?.total_assessments || 0) - (b.stats?.total_assessments || 0);
                break;

            case 'industry':
                result = a.industry.localeCompare(b.industry);
                break;

            case 'country':
                result = a.country.localeCompare(b.country);
                break;

            case 'created_at':
            default:
                result = new Date(a.created_at || 0) - new Date(b.created_at || 0);
                break;
        }

        // Apply sort direction
        return sortDirection === 'desc' ? -result : result;
    });

    // Update global organizations array and re-render
    organizations = filtered;
    renderOrganizations();
}

// Reset all filters to default
function resetFilters() {
    // Restore all organizations
    if (window.allOrganizations) {
        organizations = [...window.allOrganizations];
    }

    document.getElementById('org-search').value = '';
    document.getElementById('org-sort').value = 'created_at';
    sortDirection = 'desc';
    document.getElementById('sort-direction').textContent = '⬇️';
    renderOrganizations();
}

function selectOrganization(orgId) {
    selectedOrgId = orgId;
    renderOrganizations();
    loadOrganizationDetails(orgId);

    // Hide empty state and show assessment section
    const emptyState = document.getElementById('emptyState');
    if (emptyState) emptyState.style.display = 'none';
    document.getElementById('assessmentSection').classList.remove('hidden');

    // Show export buttons (if they exist)
    const xlsxBtn = document.getElementById('exportXLSXBtn');
    const pdfBtn = document.getElementById('exportPDFBtn');
    const zipBtn = document.getElementById('exportZIPBtn');
    if (xlsxBtn) xlsxBtn.style.display = 'inline-block';
    if (pdfBtn) pdfBtn.style.display = 'inline-block';
    if (zipBtn) zipBtn.style.display = 'inline-block';

    // Scroll to assessment section
    document.getElementById('assessmentSection').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Prepara assessments per la dashboard auditing
 * Mostra TUTTI gli assessments (come dashboard SOC)
 */
function filterAuditingAssessments(org) {
    // Ritorna tutto senza filtri - stessa logica della dashboard SOC
    return org;
}

function renderAssessmentDetails() {
    if (!selectedOrgData) return;

    // IMPORTANTE: Filtra SOLO assessments con human_values (auditor)
    const org = filterAuditingAssessments(selectedOrgData);

    // Update titles
    document.getElementById('progressTitle').textContent = `${selectedOrgData.name} - Assessment Progress Matrix`;
    document.getElementById('riskTitle').textContent = `${selectedOrgData.name} - Risk Analysis by Category`;

    // Render summaries
    renderProgressSummary(org);
    renderRiskSummary(org);

    // Render matrix and heatmap
    renderProgressMatrix(org);
    renderRiskHeatmap(org);
    renderSecurityRadarChart(org);
    renderPrioritizationTable(org);

    // CRITICAL: Auto-refresh maturity model when organization changes
    // Check if maturity tab is currently active and refresh it
    const maturityTabBtn = document.querySelector('.tab[data-tab="maturity"]');
    const isMaturityTabActive = maturityTabBtn && maturityTabBtn.classList.contains('active');
    if (isMaturityTabActive) {
        renderMaturityTab();
    }

    // Restore zoom preferences
    restoreMatrixZoom();
}

function renderProgressSummary(org) {
    const el = document.getElementById('progressSummary');
    const completion = org.aggregates?.completion?.percentage ?? 0;
    const assessed = org.aggregates?.completion?.assessed_indicators ?? 0;
    const lang = getCategoryLanguage(currentOrgLanguage);
    const t = getTranslations(lang);

    el.innerHTML = `
        <div style="display: flex; gap: 30px; align-items: center; margin-top: 10px;">
            <div>
                <span style="font-size: 14px; color: var(--text-light);">${t.completion}</span>
                <span style="font-size: 24px; font-weight: 700; color: var(--primary); margin-left: 10px;">${completion}%</span>
            </div>
            <div>
                <span style="font-size: 14px; color: var(--text-light);">${t.assessed}</span>
                <span style="font-size: 24px; font-weight: 700; color: var(--primary); margin-left: 10px;">${assessed}/100</span>
            </div>
            <div style="flex: 1;">
                <div class="progress-bar-large">
                    <div class="progress-bar-large-fill" style="width: ${completion}%">${completion}%</div>
                </div>
            </div>
        </div>
    `;
}

function renderRiskSummary(org) {
    const el = document.getElementById('riskSummary');
    const risk = org.aggregates?.overall_risk ?? 0.5;
    const riskPercent = (risk * 100).toFixed(1);
    const riskClass = risk < 0.3 ? 'risk-low' : risk < 0.7 ? 'risk-medium' : 'risk-high';
    const lang = getCategoryLanguage(currentOrgLanguage);
    const t = getTranslations(lang);
    const riskLabel = risk < 0.3 ? t.lowRisk : risk < 0.7 ? t.mediumRisk : t.highRisk;

    el.innerHTML = `
        <div style="display: flex; gap: 30px; align-items: center; margin-top: 10px;">
            <div>
                <span style="font-size: 14px; color: var(--text-light);">${t.overallRisk}</span>
                <span style="font-size: 24px; font-weight: 700; margin-left: 10px;" class="${riskClass}">${riskLabel}</span>
            </div>
            <div>
                <span style="font-size: 14px; color: var(--text-light);">${t.riskScore}</span>
                <span style="font-size: 24px; font-weight: 700; color: var(--primary); margin-left: 10px;">${riskPercent}%</span>
            </div>
            <div style="flex: 1;">
                <div class="progress-bar-large">
                    <div class="progress-bar-large-fill" style="width: ${riskPercent}%; background: linear-gradient(90deg, var(--danger), #dc2626);">${riskPercent}%</div>
                </div>
            </div>
        </div>
    `;
}

function renderProgressMatrix(org) {
    const matrix = document.getElementById('progressMatrix');
    const filterDiv = document.getElementById('progressFilter');

    // AUDITING DASHBOARD: Usa SOLO assessments manuali (valutazioni dell'auditor umano)
    const assessments = org.assessments || {};
    const lang = getCategoryLanguage(currentOrgLanguage);
    const t = getTranslations(lang);

    // Render filter info if active
    if (categoryFilter) {
        const categoryNames = {
            '1': 'Authority-Based', '2': 'Temporal-Based', '3': 'Social-Based', '4': 'Affective-Based',
            '5': 'Cognitive-Based', '6': 'Group-Based', '7': 'Stress-Based', '8': 'Unconscious-Based',
            '9': 'AI-Enhanced', '10': 'Convergent'
        };
        filterDiv.innerHTML = `
            <div class="filter-active">
                <div class="filter-text">🔍 Filter active: Category ${categoryFilter} - ${categoryNames[categoryFilter]}</div>
                <button data-action="clear-category-filter" class="filter-clear-btn">Clear Filter</button>
            </div>
        `;
    } else {
        filterDiv.innerHTML = '';
    }

    let html = '';

    // Data rows (10x10 grid, no headers like SOC)
    for (let cat = 1; cat <= 10; cat++) {
        const catKey = cat.toString();
        const isFiltered = categoryFilter && categoryFilter !== catKey;

        for (let ind = 1; ind <= 10; ind++) {
            const indicatorId = `${cat}.${ind}`;

            // AUDITING DASHBOARD: Usa SOLO assessments manuali
            const assessment = assessments[indicatorId];

            // Un assessment è completato se:
            // 1. Esiste l'oggetto assessment E
            // 2. Ha un bayesian_score definito (anche 0 è valido!) E
            // 3. Ha qualche risposta O uno score > 0 (per distinguere da reset vuoto)
            const hasResponses = assessment?.raw_data?.client_conversation?.responses &&
                                 Object.keys(assessment.raw_data.client_conversation.responses).length > 0;
            const hasScore = assessment && typeof assessment.bayesian_score === 'number';
            const completed = hasScore && (hasResponses || assessment.bayesian_score > 0);

            let cellClass = '';
            let riskLevel = t.notAssessed;
            let score = null;

            if (completed) {
                score = assessment.bayesian_score;

                // Score 0 = Low Risk (green), not empty!
                if (score <= 0.33) {
                    cellClass = 'risk-low';
                    riskLevel = t.lowRisk;
                } else if (score <= 0.66) {
                    cellClass = 'risk-medium';
                    riskLevel = t.mediumRisk;
                } else {
                    cellClass = 'risk-high';
                    riskLevel = t.highRisk;
                }
            }

            const riskPercent = completed ? (score * 100).toFixed(0) : '';
            const title = completed ? `${indicatorId} - ${riskLevel} (${riskPercent}%)` : `${indicatorId} - ${t.notAssessed}`;
            const cellStyle = isFiltered ? 'opacity: 0.3; cursor: default;' : '';

            const dataAttributes = isFiltered ? '' : `data-action="open-indicator-detail" data-indicator-id="${indicatorId}" data-org-id="${org.id}"`;
            html += `
                <div class="matrix-cell indicator ${cellClass}"
                        title="${title}"
                        style="${cellStyle}"
                        ${dataAttributes}>
                    <div style="font-weight: 700; font-size: 13px;">${indicatorId}</div>
                    ${completed ? `<div style="font-weight: 600; font-size: 16px; margin-top: 4px;">${riskPercent}%</div>` : ''}
                </div>
            `;
        }
    }

    matrix.innerHTML = html;
}

function renderRiskHeatmap(org) {
    const heatmap = document.getElementById('riskHeatmap');
    const categories = org.aggregates.by_category || {};
    const lang = getCategoryLanguage(currentOrgLanguage);
    const t = getTranslations(lang);

    const categoryNames = {
        '1': 'Authority-Based',
        '2': 'Temporal-Based',
        '3': 'Social-Based',
        '4': 'Affective-Based',
        '5': 'Cognitive-Based',
        '6': 'Group-Based',
        '7': 'Stress-Based',
        '8': 'Unconscious-Based',
        '9': 'AI-Enhanced',
        '10': 'Convergent'
    };

    let html = '';

    for (let cat = 1; cat <= 10; cat++) {
        const catKey = cat.toString();
        const catData = categories[catKey];

        if (catData) {
            const riskPercent = (catData.avg_score * 100).toFixed(1);
            const riskClass = catData.avg_score < 0.3 ? 'risk-low' :
                                catData.avg_score < 0.7 ? 'risk-medium' : 'risk-high';

            html += `
                <div class="category-card" data-action="filter-by-category" data-category-key="${catKey}" style="position: relative;">
                    <div class="category-title">
                        ${cat}. ${categoryNames[catKey]}
                        <span data-action="open-category-modal" data-category-key="${catKey}"
                              class="category-info-icon"
                              title="${t.viewCategoryDetails}">❓</span>
                    </div>
                    <div class="category-stats">
                        <div class="category-risk ${riskClass}">${riskPercent}%</div>
                        <div class="category-completion">${catData.completion_percentage}% ${t.completeSuffix}</div>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${catData.completion_percentage}%"></div>
                    </div>
                    <div style="font-size: 12px; color: var(--text-light); margin-top: 8px;">
                        ${catData.total_assessments}/10 ${t.assessedSuffix} • ${t.confAbbr} ${(catData.avg_confidence * 100).toFixed(0)}%
                    </div>
                </div>
            `;
        } else {
            html += `
                <div class="category-card" style="opacity: 0.5; position: relative;">
                    <div class="category-title">
                        ${cat}. ${categoryNames[catKey]}
                        <span data-action="open-category-modal" data-category-key="${catKey}"
                              class="category-info-icon"
                              title="${t.viewCategoryDetails}">❓</span>
                    </div>
                    <div class="category-stats">
                        <div class="category-risk">--</div>
                        <div class="category-completion">${t.noData}</div>
                    </div>
                    <div style="font-size: 12px; color: var(--text-light); margin-top: 8px;">
                        ${t.noAssessmentsYet}
                    </div>
                </div>
            `;
        }
    }

    heatmap.innerHTML = html;
}

// Global chart instance to allow updates
let securityRadarChartInstance = null;

function renderSecurityRadarChart(org) {
    const canvas = document.getElementById('securityRadarChart');
    const statsDiv = document.getElementById('radarStats');
    const categories = org.aggregates.by_category || {};
    const lang = getCategoryLanguage(currentOrgLanguage);
    const t = getTranslations(lang);

    const categoryNames = {
        '1': 'Authority',
        '2': 'Temporal',
        '3': 'Social',
        '4': 'Affective',
        '5': 'Cognitive',
        '6': 'Group',
        '7': 'Stress',
        '8': 'Unconscious',
        '9': 'AI-Enhanced',
        '10': 'Convergent'
    };

    // Prepare data for radar chart
    const labels = [];
    const riskData = [];
    const confidenceData = [];
    const completionData = [];

    for (let cat = 1; cat <= 10; cat++) {
        const catKey = cat.toString();
        const catData = categories[catKey];

        labels.push(categoryNames[catKey]);
        riskData.push(catData ? (catData.avg_score * 100) : 0);
        confidenceData.push(catData ? (catData.avg_confidence * 100) : 0);
        completionData.push(catData ? catData.completion_percentage : 0);
    }

    // Destroy existing chart if it exists
    if (securityRadarChartInstance) {
        securityRadarChartInstance.destroy();
    }

    // Save translation for tooltip callback (must be outside callback scope)
    const completionLabel = t.completionTooltip;

    // Create radar chart
    const ctx = canvas.getContext('2d');
    securityRadarChartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: t.riskLevelPercent,
                    data: riskData,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: t.confidencePercent,
                    data: confidenceData,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
                    pointRadius: 4,
                    pointHoverRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.2,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 14,
                            weight: '600'
                        },
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.r.toFixed(1)}%`;
                        },
                        afterLabel: function(context) {
                            const catIndex = context.dataIndex;
                            return `${completionLabel} ${completionData[catIndex].toFixed(0)}%`;
                        }
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        font: {
                            size: 11
                        },
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    pointLabels: {
                        font: {
                            size: 12,
                            weight: '600'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            },
            interaction: {
                mode: 'point',
                intersect: true
            }
        }
    });

    // Render quick stats
    const avgRisk = riskData.reduce((a, b) => a + b, 0) / riskData.filter(r => r > 0).length || 0;
    const avgConfidence = confidenceData.reduce((a, b) => a + b, 0) / confidenceData.filter(c => c > 0).length || 0;
    const avgCompletion = completionData.reduce((a, b) => a + b, 0) / 10;

    const highRiskCategories = riskData.filter(r => r >= 70).length;
    const mediumRiskCategories = riskData.filter(r => r >= 40 && r < 70).length;
    const lowRiskCategories = riskData.filter(r => r > 0 && r < 40).length;

    statsDiv.innerHTML = `
        <div style="margin-bottom: 15px;">
            <div style="font-size: 12px; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">${t.averageRisk}</div>
            <div style="font-size: 28px; font-weight: 700; color: ${avgRisk >= 70 ? '#ff6b6b' : avgRisk >= 40 ? '#ffd93d' : '#6bcf7f'};">${avgRisk.toFixed(1)}%</div>
        </div>
        <div style="margin-bottom: 15px;">
            <div style="font-size: 12px; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">${t.averageConfidence}</div>
            <div style="font-size: 28px; font-weight: 700; color: var(--primary);">${avgConfidence.toFixed(1)}%</div>
        </div>
        <div style="margin-bottom: 20px;">
            <div style="font-size: 12px; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">${t.overallCompletion}</div>
            <div style="font-size: 28px; font-weight: 700; color: var(--primary);">${avgCompletion.toFixed(1)}%</div>
        </div>
        <hr style="border: 0; border-top: 1px solid var(--border); margin: 20px 0;">
        <div style="font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 10px;">${t.riskDistribution}</div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 13px;">${t.highRiskRange}</span>
                <span style="font-weight: 700; color: #ff6b6b;">${highRiskCategories}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 13px;">${t.mediumRiskRange}</span>
                <span style="font-weight: 700; color: #ffd93d;">${mediumRiskCategories}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 13px;">${t.lowRiskRange}</span>
                <span style="font-weight: 700; color: #6bcf7f;">${lowRiskCategories}</span>
            </div>
        </div>
    `;
}

function renderPrioritizationTable(org) {
    const tbody = document.getElementById('prioritizationTableBody');
    const categories = org.aggregates.by_category || {};

    const categoryNames = {
        '1': 'Authority-Based',
        '2': 'Temporal-Based',
        '3': 'Social-Based',
        '4': 'Affective-Based',
        '5': 'Cognitive-Based',
        '6': 'Group-Based',
        '7': 'Stress-Based',
        '8': 'Unconscious-Based',
        '9': 'AI-Enhanced',
        '10': 'Convergent'
    };

    // Category weights for priority calculation (can be adjusted)
    const categoryWeights = {
        '1': 1.2, '2': 1.0, '3': 1.1, '4': 1.0, '5': 1.1,
        '6': 1.0, '7': 1.0, '8': 1.1, '9': 1.3, '10': 1.2
    };

    // Calculate priority scores
    const priorityData = [];
    for (let cat = 1; cat <= 10; cat++) {
        const catKey = cat.toString();
        const catData = categories[catKey];

        if (catData && catData.total_assessments > 0) {
            const risk = catData.avg_score;
            const confidence = catData.avg_confidence;
            const weight = categoryWeights[catKey] || 1.0;
            const completion = catData.completion_percentage / 100;

            // Priority score = risk × weight × confidence × (1 + incomplete_factor)
            const incompleteFactor = (1 - completion) * 0.3; // Incomplete categories get higher priority
            const priorityScore = risk * weight * confidence * (1 + incompleteFactor);

            // Recommendation based on risk and completion
            let recommendation = 'monitor';
            if (risk >= 0.66 || (risk >= 0.5 && completion < 0.5)) {
                recommendation = 'critical';
            } else if (risk >= 0.33 || completion < 0.7) {
                recommendation = 'review';
            }

            priorityData.push({
                category: catKey,
                name: categoryNames[catKey],
                risk: risk,
                confidence: confidence,
                completion: catData.completion_percentage,
                priorityScore: priorityScore,
                recommendation: recommendation
            });
        }
    }

    // Sort by priority score (descending)
    priorityData.sort((a, b) => b.priorityScore - a.priorityScore);

    // Render table rows
    let html = '';
    priorityData.forEach((item, idx) => {
        const riskClass = item.risk < 0.33 ? 'risk-low' : item.risk < 0.66 ? 'risk-medium' : 'risk-high';
        html += `
            <tr data-action="open-category-modal" data-category-key="${item.category}" class="priority-table-row">
                <td style="font-weight: 600; color: var(--text-light);">${idx + 1}</td>
                <td style="font-weight: 600;">${item.category}. ${item.name}</td>
                <td><span class="stat-value ${riskClass}" style="font-size: 14px;">${(item.risk * 100).toFixed(1)}%</span></td>
                <td>${(item.confidence * 100).toFixed(0)}%</td>
                <td>${item.completion}%</td>
                <td style="font-weight: 700; color: var(--primary);">${item.priorityScore.toFixed(3)}</td>
                <td><span class="recommendation-badge ${item.recommendation}">${item.recommendation}</span></td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

// ===== CATEGORY DESCRIPTIONS & MODAL =====

/**
 * Load category descriptions from JSON file
 */
async function loadCategoryDescriptions() {
    try {
        const response = await fetch('category-descriptions.json');
        if (!response.ok) {
            console.warn('Failed to load category descriptions');
            return;
        }
        categoryDescriptions = await response.json();
    } catch (error) {
        console.error('Error loading category descriptions:', error);
    }
}

/**
 * Open category description modal
 */
function openCategoryModal(categoryId) {
    if (!categoryDescriptions || !categoryDescriptions.categories[categoryId]) {
        console.warn('Category description not found:', categoryId);
        return;
    }

    // Determine language based on current organization's language
    const lang = getCategoryLanguage(currentOrgLanguage);
    const category = categoryDescriptions.categories[categoryId][lang];

    // Set modal title
    document.getElementById('category-modal-title').textContent = category.name;

    // Build modal body with localized labels
    const labels = getCategoryLabels(lang);
    const body = document.getElementById('category-modal-body');
    body.innerHTML = `
        <div style="line-height: 1.6;">
            <p style="font-size: 16px; font-weight: 500; color: var(--primary); margin-bottom: 15px;">
                ${category.short_description}
            </p>
            <p style="margin-bottom: 20px; color: var(--text);">
                ${category.description}
            </p>

            <h4 style="color: var(--primary); margin: 20px 0 10px 0; font-size: 16px;">
                ${labels.examples}
            </h4>
            <ul style="margin: 0 0 20px 0; padding-left: 20px; color: var(--text);">
                ${category.examples.map(ex => `<li style="margin-bottom: 8px;">${ex}</li>`).join('')}
            </ul>

            <h4 style="color: var(--primary); margin: 20px 0 10px 0; font-size: 16px;">
                ${labels.mitigation}
            </h4>
            <p style="margin: 0; padding: 15px; background: #f0f9ff; border-left: 4px solid var(--primary); border-radius: 4px; color: var(--text);">
                ${category.mitigation}
            </p>
        </div>
    `;

    // Show modal
    const modal = document.getElementById('category-modal');
    modal.style.display = 'flex';
    window.pushModal('category-modal');
}

/**
 * Close category description modal
 */
function closeCategoryModal() {
    const modal = document.getElementById('category-modal');
    modal.style.display = 'none';
    window.popModal();
}

/**
 * Get language code from organization language setting
 * Supports: en, it (with fallback to en)
 */
function getCategoryLanguage(orgLanguage) {
    if (!orgLanguage) return 'en';

    // Extract language code from locale (e.g., 'it-IT' -> 'it')
    const langCode = orgLanguage.split('-')[0].toLowerCase();

    // Check if language is available in descriptions
    if (categoryDescriptions &&
        categoryDescriptions.categories &&
        Object.keys(categoryDescriptions.categories).length > 0) {
        const firstCategory = Object.values(categoryDescriptions.categories)[0];
        if (firstCategory[langCode]) {
            return langCode;
        }
    }

    // Fallback to English
    return 'en';
}

/**
 * Get all localized translations for the dashboard
 */
function getTranslations(lang) {
    const translations = {
        en: {
            // Category modal
            examples: '📌 Examples',
            mitigation: '🛡️ Mitigation',
            viewCategoryDetails: 'View category details',

            // Dashboard labels
            completion: 'Completion:',
            assessed: 'Assessed:',
            overallRisk: 'Overall Risk:',
            riskScore: 'Risk Score:',

            // Risk levels
            lowRisk: '🟢 Low Risk',
            mediumRisk: '🟡 Medium Risk',
            highRisk: '🔴 High Risk',

            // Status messages
            notAssessed: 'Not assessed',
            noData: 'No data',
            noAssessmentsYet: 'No assessments yet',

            // Suffixes
            completeSuffix: 'complete',
            assessedSuffix: 'assessed',
            confAbbr: 'Conf:',

            // Risk ranges for radar
            highRiskRange: '🔴 High Risk (≥70%)',
            mediumRiskRange: '🟡 Medium Risk (40-69%)',
            lowRiskRange: '🟢 Low Risk (<40%)',

            // Tooltips in radar chart
            completionTooltip: 'Completion:',

            // Radar chart stats
            averageRisk: 'Average Risk',
            averageConfidence: 'Average Confidence',
            overallCompletion: 'Overall Completion',
            riskDistribution: 'Risk Distribution:',

            // Chart labels
            riskLevelPercent: 'Risk Level (%)',
            confidencePercent: 'Confidence (%)'
        },
        it: {
            // Category modal
            examples: '📌 Esempi',
            mitigation: '🛡️ Mitigazione',
            viewCategoryDetails: 'Visualizza dettagli categoria',

            // Dashboard labels
            completion: 'Completamento:',
            assessed: 'Valutati:',
            overallRisk: 'Rischio Complessivo:',
            riskScore: 'Punteggio Rischio:',

            // Risk levels
            lowRisk: '🟢 Rischio Basso',
            mediumRisk: '🟡 Rischio Medio',
            highRisk: '🔴 Rischio Alto',

            // Status messages
            notAssessed: 'Non valutato',
            noData: 'Nessun dato',
            noAssessmentsYet: 'Nessuna valutazione',

            // Suffixes
            completeSuffix: 'completato',
            assessedSuffix: 'valutati',
            confAbbr: 'Conf:',

            // Risk ranges for radar
            highRiskRange: '🔴 Rischio Alto (≥70%)',
            mediumRiskRange: '🟡 Rischio Medio (40-69%)',
            lowRiskRange: '🟢 Rischio Basso (<40%)',

            // Tooltips in radar chart
            completionTooltip: 'Completamento:',

            // Radar chart stats
            averageRisk: 'Rischio Medio',
            averageConfidence: 'Confidenza Media',
            overallCompletion: 'Completamento Complessivo',
            riskDistribution: 'Distribuzione Rischio:',

            // Chart labels
            riskLevelPercent: 'Livello Rischio (%)',
            confidencePercent: 'Confidenza (%)'
        }
    };

    return translations[lang] || translations.en;
}

/**
 * Get localized labels for category modal UI elements (backward compatibility)
 */
function getCategoryLabels(lang) {
    const t = getTranslations(lang);
    return {
        examples: t.examples,
        mitigation: t.mitigation
    };
}

async function openIndicatorDetail(indicatorId, orgId) {
    console.log('🎯 openIndicatorDetail called with:', { indicatorId, orgId });

    selectedIndicatorId = indicatorId;
    const assessment = selectedOrgData.assessments[indicatorId];

    console.log('📊 Assessment exists?', !!assessment);

    // AUDITING DASHBOARD: Apre SEMPRE il client integrato (no SOC data)
    if (assessment) {
        // Apri client con assessment esistente
        await openIntegratedClient(indicatorId, orgId, assessment);
    } else {
        // No data available - apri client per nuovo assessment
        await openIntegratedClient(indicatorId, orgId, null);
    }
}

async function showAssessmentDetails(indicatorId, assessment) {
    document.getElementById('indicatorModalTitle').textContent = `Indicator ${indicatorId} - Assessment Details`;
    document.getElementById('indicatorModal').classList.add('active');
    pushModal('indicatorModal');

    const content = document.getElementById('indicatorModalContent');
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

                ${fieldKit && fieldKit.field_kit && fieldKit.field_kit.questions ? `
                <!-- Questions and Responses -->
                <div style="background: var(--bg-gray); padding: 15px; border-radius: 8px;">
                    <h4 style="margin: 0 0 15px 0; color: var(--primary);">❓ Assessment Questions & Responses</h4>
                    ${fieldKit.field_kit.questions.map((q, idx) => {
                        const responseKey = `q${idx + 1}`;
                        const response = assessment.raw_data?.responses?.[responseKey] || assessment.raw_data?.responses?.[`question_${idx}`];
                        return `
                            <div style="background: white; padding: 12px; border-radius: 6px; margin-bottom: 10px;">
                                <div style="font-weight: 600; margin-bottom: 8px;">${idx + 1}. ${q.text}</div>
                                ${response ? `
                                    <div style="padding: 8px; background: #e0f2fe; border-radius: 4px;">
                                        <strong>Response:</strong> ${response}
                                    </div>
                                ` : '<div style="color: var(--text-light); font-style: italic;">No response recorded</div>'}
                            </div>
                        `;
                    }).join('')}
                </div>
                ` : ''}

                ${assessment.raw_data && assessment.raw_data.client_conversation ? `
                <div style="background: var(--bg-gray); padding: 15px; border-radius: 8px;">
                    <div style="font-weight: 600; margin-bottom: 10px;">📝 Notes</div>
                    <p style="margin: 0; font-size: 14px; line-height: 1.6;">${assessment.raw_data.client_conversation.notes || 'No notes available'}</p>
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

    // Hide buttons in details view - use only Close button
    document.getElementById('deleteAssessmentBtn').style.display = 'none';
    document.getElementById('openIntegratedBtn').style.display = 'none';
    if (document.getElementById('historyBtn')) {
        document.getElementById('historyBtn').style.display = 'none';
    }
}

async function openIntegratedClient(indicatorId, orgId, existingAssessment = null) {
    console.log('🔍 openIntegratedClient called with:', { indicatorId, orgId, existingAssessment: !!existingAssessment });

    if (!indicatorId) {
        console.error('❌ ERROR: indicatorId is null or undefined!');
        showAlert('Error: Invalid indicator ID', 'error');
        return;
    }

    if (!selectedOrgData) {
        console.error('❌ ERROR: selectedOrgData is null!');
        showAlert('Error: No organization selected', 'error');
        return;
    }

    const isEditMode = !!existingAssessment;
    document.getElementById('indicatorModalTitle').textContent = `Indicator ${indicatorId} - ${isEditMode ? 'Edit' : 'New'} Assessment`;
    document.getElementById('indicatorModal').classList.add('active');
    pushModal('indicatorModal');

    // Add fullscreen class for client modal
    const modalContent = document.querySelector('#indicatorModal .modal-content');
    modalContent.classList.add('fullscreen-client');

    const content = document.getElementById('indicatorModalContent');

    // Get organization data
    const language = selectedOrgData.metadata?.language || 'en-US';

    // Load indicator from GitHub and render integrated form
    const [categoryNum, indicatorNum] = indicatorId.split('.');
    const categoryName = CATEGORY_MAP[categoryNum];
    const url = `/auditor-field-kit/interactive/${language}/${categoryNum}.x-${categoryName}/indicator_${indicatorId}.json`;

    // Show loading
    content.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <div class="loading-spinner" style="margin: 0 auto 20px;"></div>
            <p>Loading indicator...</p>
        </div>
    `;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Field Kit not found');

        const fieldKit = await response.json();

        // Render integrated form (with or without existing assessment)
        renderIntegratedClientForm(indicatorId, fieldKit, orgId, existingAssessment);
    } catch (error) {
        console.error('Error loading Field Kit:', error);
        content.innerHTML = `
            <div style="padding: 40px; text-align: center;">
                <div style="background: #fee2e2; padding: 20px; border-radius: 8px; border: 1px solid var(--danger);">
                    <strong>⚠️ Failed to load indicator</strong>
                    <p style="margin-top: 10px;">${error.message}</p>
                    <p style="margin-top: 10px; font-size: 14px;">The indicator definition might not exist yet in the repository.</p>
                </div>
            </div>
        `;
    }
}

async function openIntegratedVersion() {
    if (!selectedIndicatorId || !selectedOrgId) {
        showAlert('Error: No indicator or organization selected', 'error');
        return;
    }

    const indicatorId = selectedIndicatorId;
    const orgId = selectedOrgId;
    const language = selectedOrgData.metadata?.language || 'en-US';
    const assessment = selectedOrgData.assessments[indicatorId];

    console.log('🎨 openIntegratedVersion called with:', { indicatorId, orgId, assessment: !!assessment });

    // Close current modal
    closeIndicatorModal();

    // Reopen with integrated form
    document.getElementById('indicatorModalTitle').textContent = `Indicator ${indicatorId} - ${assessment ? 'Edit' : 'New'} Assessment (INTEGRATED)`;
    document.getElementById('indicatorModal').classList.add('active');
    pushModal('indicatorModal');

    // Add fullscreen class for client modal
    const modalContent = document.querySelector('#indicatorModal .modal-content');
    modalContent.classList.add('fullscreen-client');

    const content = document.getElementById('indicatorModalContent');

    // Load and render integrated form
    const [categoryNum, indicatorNum] = indicatorId.split('.');
    const categoryName = CATEGORY_MAP[categoryNum];
    const url = `/auditor-field-kit/interactive/${language}/${categoryNum}.x-${categoryName}/indicator_${indicatorId}.json`;

    // Show loading
    content.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <div class="loading-spinner" style="margin: 0 auto 20px;"></div>
            <p>Loading integrated form...</p>
        </div>
    `;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Field Kit not found');

        const fieldKit = await response.json();

        // Render integrated form with existing assessment data if available
        renderIntegratedClientForm(indicatorId, fieldKit, orgId, assessment);

        // Hide buttons since we're in the form now
        document.getElementById('deleteAssessmentBtn').style.display = 'none';
        document.getElementById('openIntegratedBtn').style.display = 'none';
    } catch (error) {
        console.error('Error loading Field Kit:', error);
        showAlert('Failed to load integrated form: ' + error.message, 'error');
        content.innerHTML = `
            <div style="padding: 40px; text-align: center;">
                <div style="background: #fee2e2; padding: 20px; border-radius: 8px; border: 1px solid var(--danger);">
                    <strong>⚠️ Failed to load indicator</strong>
                    <p style="margin-top: 10px;">${error.message}</p>
                </div>
            </div>
        `;
    }
}

function renderIntegratedClientForm(indicatorId, indicatorData, orgId, existingAssessment = null) {
    const content = document.getElementById('indicatorModalContent');
    const isEditMode = !!existingAssessment;

    // Hide modal title since client has its own header
    document.getElementById('indicatorModalTitle').style.display = 'none';

    // Insert the REAL client HTML structure
    const html = `
        <div class="cpf-client">
            <div class="container" id="client-integrated-container" style="max-width: 100%; margin: 0; box-shadow: none;">
                <div class="header" id="header">
                    <div class="header-content">
                        <h1>Indicator ${indicatorId} Field Kit</h1>
                        <div class="subtitle">${isEditMode ? 'Edit Mode' : 'New Assessment'}</div>
                        <div id="organization-info" style="margin-top: 10px; padding: 8px 15px; background: rgba(255,255,255,0.1); border-radius: 6px; display: block;">
                            <span style="opacity: 0.8;">Organization:</span>
                            <strong id="org-name-display">${selectedOrgData?.name || 'Unknown'}</strong>
                            <span style="margin-left: 20px; opacity: 0.8;">ID:</span>
                            <strong id="org-id-display">${orgId}</strong>
                        </div>
                    </div>
                </div>
                <div class="toolbar" style="justify-content: space-between; flex-wrap: wrap; gap: 10px;">
                    <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
                        <button class="btn btn-info" data-action="show-quick-reference">📚 Quick Reference</button>
                        <button class="btn btn-info" data-action="toggle-detailed-analysis">📊 Show/Hide Analysis</button>
                        <button class="btn btn-light" data-action="trigger-file-input" data-file-input-id="file-input-integrated">📂 Import Data</button>
                        <input type="file" id="file-input-integrated" accept=".json" data-action="import-json" style="display: none;">
                        <button class="btn btn-danger" data-action="reset-compile-form" title="Reset assessment">🗑️ Reset</button>
                        <button class="btn btn-primary" data-action="view-assessment-details-from-edit" data-indicator-id="${indicatorId}">📋 View Details</button>
                        <button class="btn btn-warning" data-action="open-history-modal">📜 History</button>
                    </div>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
                        <span id="auto-save-status" style="color: #4CAF50; font-size: 14px; display: none;">✓ Auto-saved</span>
                        <button class="btn btn-secondary" data-action="save-data">💾 Save</button>
                        <button class="btn btn-success" data-action="export-data">💾 Export Data</button>
                        <button class="btn btn-primary" data-action="generate-report">📊 Report</button>
                        <button class="btn btn-secondary" data-action="close-indicator-modal">Close</button>
                    </div>
                </div>
                <div class="metadata-bar" id="metadata-bar" style="display: none;"></div>
                <div class="content" id="content">
                    <div class="empty-state">
                        <h2>Loading Field Kit...</h2>
                        <p>Please wait</p>
                    </div>
                </div>
                <div class="action-bar" id="action-bar" style="display: none;"></div>
            </div>

            <!-- Quick Reference Modal -->
            <div id="reference-modal" class="cpf-client modal" style="display: none;" data-action="close-quick-reference-backdrop">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>📚 CPF Indicators Quick Reference</h2>
                        <button class="modal-close" data-action="close-quick-reference">✕</button>
                    </div>
                    <div class="modal-body" id="reference-content">
                        <p style="text-align: center; color: #7f8c8d; padding: 40px;">Loading reference guide...</p>
                    </div>
                </div>
            </div>

        </div>
    `;

    content.innerHTML = html;

    // Wait for DOM to be ready, then initialize client
    setTimeout(() => {
        if (typeof renderFieldKit === 'function') {
            // Initialize client's global variables with our data
            if (organizationContext) {
                organizationContext.orgId = orgId;
                organizationContext.orgName = selectedOrgData?.name || 'Unknown';
                organizationContext.language = selectedOrgData?.metadata?.language || 'en-US';
            }

            if (currentData) {
                currentData.fieldKit = indicatorData;
                currentData.metadata = {
                    date: new Date().toISOString().split('T')[0],
                    auditor: selectedOrgData?.metadata?.auditor || '',
                    client: selectedOrgData?.name || '',
                    status: 'in-progress',
                    notes: ''
                };
                currentData.responses = {};

                // If editing, populate with existing data from raw_data.client_conversation
                if (existingAssessment && existingAssessment.raw_data && existingAssessment.raw_data.client_conversation) {
                    // Load metadata from client_conversation (CORRECT location!)
                    if (existingAssessment.raw_data.client_conversation.metadata) {
                        currentData.metadata = {
                            ...currentData.metadata,
                            ...existingAssessment.raw_data.client_conversation.metadata
                        };
                    }

                    // Load notes separately (in case stored separately for compatibility)
                    if (existingAssessment.raw_data.client_conversation.notes) {
                        currentData.metadata.notes = existingAssessment.raw_data.client_conversation.notes;
                    }

                    // Load responses
                    if (existingAssessment.raw_data.client_conversation.responses) {
                        currentData.responses = existingAssessment.raw_data.client_conversation.responses;
                    }

                    console.log('✅ Existing assessment data loaded:', {
                        metadata: currentData.metadata,
                        responses: Object.keys(currentData.responses).length + ' items',
                        notes: currentData.metadata.notes
                    });
                }
            }

            console.log('🎨 Calling CPFClient.renderFieldKit with data:', indicatorData);
            console.log('📊 Organization context:', organizationContext);
            console.log('📝 Current data:', currentData);

            // Render the field kit
            renderFieldKit(indicatorData);

            // Note: Save behavior is handled in event delegation
            // See 'save-data' action in setupEventDelegation()

        } else {
            console.error('❌ renderFieldKit not available');
            content.innerHTML = `
                <div style="padding: 40px; text-align: center;">
                    <div style="background: #fee2e2; padding: 20px; border-radius: 8px;">
                        <strong>⚠️ Client script not loaded</strong>
                        <p style="margin-top: 10px;">CPFClient namespace not available. Please refresh the page.</p>
                    </div>
                </div>
            `;
        }
    }, 100);
}

// Old functions removed - now using real client functions from client-integrated.js

// REAL-TIME UPDATE: Update grid without full reload
function updateAssessmentRealtime(indicatorId, assessmentData) {
    if (!selectedOrgData) return;

    // Update local data
    if (!selectedOrgData.assessments) {
        selectedOrgData.assessments = {};
    }
    selectedOrgData.assessments[indicatorId] = assessmentData;

    // Update progress matrix cell
    const [categoryNum, indicatorNum] = indicatorId.split('.');
    const cellId = `progress-${categoryNum}-${indicatorNum}`;
    const cell = document.getElementById(cellId);

    if (cell) {
        cell.className = 'matrix-cell completed';
        cell.style.background = '#10b981';
        cell.style.color = 'white';
        cell.title = `${indicatorId} - Completed (${(assessmentData.bayesian_score * 100).toFixed(0)}% risk)`;
        cell.onclick = () => {
            selectedIndicatorId = indicatorId;
            showAssessmentDetails(indicatorId, assessmentData);
        };
    }

    // Update risk matrix cell
    const riskCellId = `risk-${categoryNum}-${indicatorNum}`;
    const riskCell = document.getElementById(riskCellId);

    if (riskCell) {
        const riskClass = assessmentData.bayesian_score < 0.33 ? 'risk-low' :
                         assessmentData.bayesian_score < 0.66 ? 'risk-medium' : 'risk-high';
        riskCell.className = `matrix-cell ${riskClass}`;
        riskCell.textContent = indicatorId;
        riskCell.title = `${indicatorId} - ${(assessmentData.bayesian_score * 100).toFixed(0)}% risk`;
        riskCell.onclick = () => {
            selectedIndicatorId = indicatorId;
            showAssessmentDetails(indicatorId, assessmentData);
        };
    }

    // Recalculate and update stats
    const totalAssessments = Object.keys(selectedOrgData.assessments).length;
    const completionPct = ((totalAssessments / 100) * 100).toFixed(0);

    // Update progress summary
    const progressSummary = document.getElementById('progressSummary');
    if (progressSummary) {
        progressSummary.innerHTML = `
            <div style="font-size: 14px; color: var(--text-light);">
                <strong>${totalAssessments}/100</strong> indicators completed (<strong>${completionPct}%</strong>)
            </div>
        `;
    }

    // Update risk summary if visible
    const riskSummary = document.getElementById('riskSummary');
    if (riskSummary) {
        let totalRisk = 0;
        let count = 0;
        for (const assessment of Object.values(selectedOrgData.assessments)) {
            if (assessment.bayesian_score !== undefined) {
                totalRisk += assessment.bayesian_score;
                count++;
            }
        }
        const avgRisk = count > 0 ? ((totalRisk / count) * 100).toFixed(1) : 0;
        const riskClass = avgRisk < 33 ? 'risk-low' : avgRisk < 66 ? 'risk-medium' : 'risk-high';

        riskSummary.innerHTML = `
            <div style="font-size: 14px; color: var(--text-light);">
                Average Risk: <strong class="${riskClass}">${avgRisk}%</strong>
            </div>
        `;
    }

    console.log('✅ Real-time update complete for', indicatorId);
}

function calculateSimplifiedScore(responses) {
    let riskCount = 0;
    let totalQuestions = 0;

    for (let [key, value] of Object.entries(responses)) {
        if (key.startsWith('q_') && !isNaN(value)) {
            totalQuestions++;
            riskCount += parseInt(value);
        }
    }

    if (totalQuestions === 0) return 0.5;
    return riskCount / (totalQuestions * 4);
}

function closeIndicatorModal() {
    document.getElementById('indicatorModal').classList.remove('active');

    // Remove fullscreen class when closing
    const modalContent = document.querySelector('#indicatorModal .modal-content');
    modalContent.classList.remove('fullscreen-client');

    // Restore modal title visibility
    document.getElementById('indicatorModalTitle').style.display = 'block';

    document.getElementById('deleteAssessmentBtn').style.display = 'none';
    document.getElementById('openIntegratedBtn').style.display = 'none';
    selectedIndicatorId = null;
    popModal('indicatorModal');
}

// Callback functions for client integration
window.dashboardReloadOrganization = async function() {
    if (selectedOrgId) {
        await loadOrganizationDetails(selectedOrgId);
    }
};

window.dashboardCloseModal = function() {
    closeIndicatorModal();
};

async function editAssessmentFromModal() {
    if (!selectedIndicatorId || !selectedOrgId) return;

    // CRITICAL: Save these values BEFORE closing modal
    const indicatorId = selectedIndicatorId;
    const orgId = selectedOrgId;

    // Get current assessment data
    const assessment = selectedOrgData.assessments[indicatorId];

    console.log('✏️ Edit Assessment (IFRAME):', { indicatorId, orgId, assessment });

    // Close the detail modal
    closeIndicatorModal();

    // Open OLD CLIENT in IFRAME
    document.getElementById('indicatorModalTitle').textContent = `Indicator ${indicatorId} - Edit Assessment (IFRAME)`;
    document.getElementById('indicatorModal').classList.add('active');
    pushModal('indicatorModal');

    // Add fullscreen class for client modal
    const modalContent = document.querySelector('#indicatorModal .modal-content');
    modalContent.classList.add('fullscreen-client');

    const content = document.getElementById('indicatorModalContent');

    // Show delete button only (hide edit since we're already editing)
    document.getElementById('deleteAssessmentBtn').style.display = 'inline-block';
    document.getElementById('openIntegratedBtn').style.display = 'none';

    // Create iframe with OLD client
    const iframeUrl = `/dashboard/client/index.html?org_id=${orgId}&indicator_id=${indicatorId}`;

    content.innerHTML = `
        <div style="width: 100%; height: 80vh; position: relative;">
            <iframe
                id="clientIframe"
                src="${iframeUrl}"
                style="width: 100%; height: 100%; border: none; border-radius: 8px;"
                onload="console.log('Iframe loaded')">
            </iframe>
        </div>
    `;

    // Pass assessment data to iframe via postMessage when it loads
    const iframe = document.getElementById('clientIframe');
    iframe.addEventListener('load', () => {
        console.log('📨 Sending assessment data to iframe:', assessment);
        iframe.contentWindow.postMessage({
            type: 'LOAD_ASSESSMENT',
            data: {
                indicatorId: indicatorId,
                orgId: orgId,
                assessment: assessment
            }
        }, '*');
    });
}

// View assessment details from edit form (opens in separate modal)
async function viewAssessmentDetailsFromEdit(indicatorId) {
    if (!selectedOrgId) return;

    // CRITICAL: Reload organization data FIRST to get latest changes
    console.log('🔄 Reloading organization data before viewing details...');
    await loadOrganizationDetails(selectedOrgId);

    let assessment = selectedOrgData.assessments[indicatorId];
    const isNewAssessment = !assessment;

    // If assessment doesn't exist, create a temporary one with default values
    if (!assessment) {
        assessment = {
            bayesian_score: 0,
            confidence: 0,
            maturity_level: 'Not assessed',
            assessor: 'N/A',
            assessment_date: new Date().toISOString(),
            title: `Indicator ${indicatorId}`,
            category: 'N/A'
        };
    }

    // Open details in SEPARATE modal (assessmentDetailsModal)
    document.getElementById('assessmentDetailsTitle').textContent = `Indicator ${indicatorId} - Assessment Details`;
    document.getElementById('assessmentDetailsModal').classList.add('active');
    pushModal('assessmentDetailsModal');

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

        // Render FULL details with ALL sections
        content.innerHTML = `
            <div style="display: grid; gap: 20px;">
                ${isNewAssessment ? `
                <!-- New Assessment Warning -->
                <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #f39c12;">
                    <div style="font-weight: 600; color: #856404; margin-bottom: 5px;">ℹ️ Assessment Not Yet Completed</div>
                    <p style="margin: 0; color: #856404; font-size: 14px;">This indicator has not been assessed yet. Complete the assessment to see risk scores and analysis.</p>
                </div>
                ` : ''}
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

                ${fieldKit && fieldKit.field_kit && fieldKit.field_kit.questions ? `
                <!-- Questions and Responses -->
                <div style="background: var(--bg-gray); padding: 15px; border-radius: 8px;">
                    <h4 style="margin: 0 0 15px 0; color: var(--primary);">❓ Assessment Questions & Responses</h4>
                    ${fieldKit.field_kit.questions.map((q, idx) => {
                        const responseKey = 'q' + (idx + 1);
                        const response = assessment.raw_data?.responses?.[responseKey] || assessment.raw_data?.responses?.['question_' + idx];
                        return '<div style="background: white; padding: 12px; border-radius: 6px; margin-bottom: 10px;">' +
                            '<div style="font-weight: 600; margin-bottom: 8px;">' + (idx + 1) + '. ' + q.text + '</div>' +
                            (response ?
                                '<div style="padding: 8px; background: #e0f2fe; border-radius: 4px;"><strong>Response:</strong> ' + response + '</div>'
                                : '<div style="color: var(--text-light); font-style: italic;">No response recorded</div>') +
                            '</div>';
                    }).join('')}
                </div>
                ` : ''}

                ${assessment.raw_data && assessment.raw_data.client_conversation ? `
                <div style="background: var(--bg-gray); padding: 15px; border-radius: 8px;">
                    <div style="font-weight: 600; margin-bottom: 10px;">📝 Notes</div>
                    <p style="margin: 0; font-size: 14px; line-height: 1.6;">${assessment.raw_data.client_conversation.notes || 'No notes available'}</p>
                </div>
                ` : ''}

                ${assessment.raw_data && assessment.raw_data.client_conversation && assessment.raw_data.client_conversation.red_flags && assessment.raw_data.client_conversation.red_flags.length > 0 ? `
                <div style="background: #fee2e2; padding: 15px; border-radius: 8px; border: 1px solid var(--danger);">
                    <div style="font-weight: 600; margin-bottom: 10px; color: var(--danger);">🚩 Red Flags Identified (${assessment.raw_data.client_conversation.red_flags.length})</div>
                    <ul style="margin: 0; padding-left: 20px; font-size: 14px;">
                        ${assessment.raw_data.client_conversation.red_flags.map(flag => '<li>' + (typeof flag === 'object' ? flag.flag : flag) + '</li>').join('')}
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

// Close assessment details modal (returns to edit form which is still open)
function closeAssessmentDetailsModal() {
    document.getElementById('assessmentDetailsModal').classList.remove('active');
    popModal('assessmentDetailsModal');
}

// Open history modal from assessment details
async function openHistoryModalFromDetails() {
    if (!selectedIndicatorId || !selectedOrgId) {
        showAlert('No assessment selected', 'error');
        return;
    }

    // Keep details modal open, just open history on top
    await openHistoryModal();
}

// Delete assessment from details view
async function deleteAssessmentFromDetails() {
    if (!selectedIndicatorId || !selectedOrgId) {
        showAlert('No assessment selected', 'error');
        return;
    }

    if (!confirm(`Are you sure you want to delete the assessment for indicator ${selectedIndicatorId}?`)) {
        return;
    }

    try {
        const response = await fetch(`/api/organizations/${selectedOrgId}/assessments/${selectedIndicatorId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            showAlert('Assessment deleted successfully!', 'success');

            // Close details modal
            closeAssessmentDetailsModal();

            // Reload organization to refresh UI
            await loadOrganizationDetails(selectedOrgId);
        } else {
            showAlert(`Failed to delete: ${result.error}`, 'error');
        }
    } catch (error) {
        console.error('Error deleting assessment:', error);
        showAlert(`Error: ${error.message}`, 'error');
    }
}

// Delete assessment from edit form
function filterByCategory(categoryId) {
    // Toggle filter
    if (categoryFilter === categoryId) {
        // Unfilter
        categoryFilter = null;
        showAlert('Filter removed', 'info');
    } else {
        // Apply filter
        categoryFilter = categoryId;
        showAlert(`Filtering by category ${categoryId}`, 'info');
    }

    // Re-render matrix with filter
    if (selectedOrgData) {
        renderProgressMatrix(selectedOrgData);
    }
}

function clearCategoryFilter() {
    categoryFilter = null;
    if (selectedOrgData) {
        renderProgressMatrix(selectedOrgData);
    }
}

// ===== ORGANIZATION CRUD =====
function openCreateOrgModal() {
    editingOrgId = null;
    document.getElementById('orgModalTitle').textContent = 'Create New Organization';

    // Reset button state
    const saveBtn = document.getElementById('saveOrgBtn');
    saveBtn.textContent = 'Create Organization';
    saveBtn.disabled = false;

    document.getElementById('orgForm').reset();
    document.getElementById('orgId').disabled = false;
    document.getElementById('fetchIndicators').parentElement.parentElement.classList.remove('hidden');
    document.getElementById('orgModal').classList.add('active');
    pushModal('orgModal');
}

function editOrganization(orgId) {
    editingOrgId = orgId;
    const org = organizations.find(o => o.id === orgId);
    if (!org) return;

    document.getElementById('orgModalTitle').textContent = 'Edit Organization';

    // Reset button state
    const saveBtn = document.getElementById('saveOrgBtn');
    saveBtn.textContent = 'Save Changes';
    saveBtn.disabled = false;

    document.getElementById('orgId').value = org.id;
    document.getElementById('orgId').disabled = true;
    document.getElementById('orgName').value = org.name;
    document.getElementById('orgIndustry').value = org.industry;
    document.getElementById('orgSize').value = org.size;
    document.getElementById('orgCountry').value = org.country;
    document.getElementById('orgLanguage').value = org.language;
    document.getElementById('orgSedeSociale').value = org.sede_sociale || '';
    document.getElementById('orgPartitaIva').value = org.partita_iva || '';
    // Note: we'd need to fetch full org data to get notes
    document.getElementById('fetchIndicators').parentElement.parentElement.classList.add('hidden');
    document.getElementById('orgModal').classList.add('active');
    pushModal('orgModal');
}

async function saveOrganization(event) {
    event.preventDefault();

    const orgId = document.getElementById('orgId').value.trim();
    const orgName = document.getElementById('orgName').value.trim();
    const orgIndustry = document.getElementById('orgIndustry').value;
    const orgSize = document.getElementById('orgSize').value;
    const orgCountry = document.getElementById('orgCountry').value.trim().toUpperCase();
    const orgLanguage = document.getElementById('orgLanguage').value;
    const orgSedeSociale = document.getElementById('orgSedeSociale').value.trim();
    const orgPartitaIva = document.getElementById('orgPartitaIva').value.trim();
    const orgNotes = document.getElementById('orgNotes').value.trim();
    const fetchIndicators = document.getElementById('fetchIndicators').checked;

    const orgData = {
        id: orgId,
        name: orgName,
        industry: orgIndustry,
        size: orgSize,
        country: orgCountry,
        language: orgLanguage,
        sede_sociale: orgSedeSociale,
        partita_iva: orgPartitaIva,
        notes: orgNotes
    };

    try {
        const saveBtn = document.getElementById('saveOrgBtn');
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';

        let response;
        if (editingOrgId) {
            // Update existing
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

            // If creating and fetch indicators is checked
            if (!editingOrgId && fetchIndicators) {
                await fetchIndicatorsFromGitHub(orgId, orgLanguage);
            }

            closeOrgModal();
            await loadAllData();

            // Select the new/edited org
            if (!editingOrgId) {
                selectOrganization(orgId);
            }
        } else {
            showAlert('Failed to save organization: ' + result.error, 'error');
            saveBtn.disabled = false;
            saveBtn.textContent = editingOrgId ? 'Save Changes' : 'Create Organization';
        }
    } catch (error) {
        console.error('Error saving organization:', error);
        showAlert('Failed to save organization: ' + error.message, 'error');
        saveBtn.disabled = false;
        saveBtn.textContent = editingOrgId ? 'Save Changes' : 'Create Organization';
    }
}

async function fetchIndicatorsFromGitHub(orgId, language) {
    const progressEl = document.getElementById('fetchProgress');
    const progressBar = document.getElementById('fetchProgressBar');
    progressEl.classList.remove('hidden');

    const GITHUB_BASE_URL = '/auditor-field-kit/interactive';

    const categories = [
        { id: 1, name: '1.x-authority' },
        { id: 2, name: '2.x-temporal' },
        { id: 3, name: '3.x-social' },
        { id: 4, name: '4.x-affective' },
        { id: 5, name: '5.x-cognitive' },
        { id: 6, name: '6.x-group' },
        { id: 7, name: '7.x-stress' },
        { id: 8, name: '8.x-unconscious' },
        { id: 9, name: '9.x-ai' },
        { id: 10, name: '10.x-convergent' }
    ];

    try {
        const totalIndicators = 100;
        let fetchedCount = 0;
        let successCount = 0;
        let failedCount = 0;

        // Fetch all 100 indicators
        for (const category of categories) {
            for (let ind = 1; ind <= 10; ind++) {
                const indicatorId = `${category.id}.${ind}`;
                const url = `${GITHUB_BASE_URL}/${language}/${category.name}/indicator_${indicatorId}.json`;

                try {
                    const response = await fetch(url);

                    if (response.ok) {
                        const indicatorData = await response.json();
                        // Successfully fetched - we could store this in indicators_metadata if needed
                        successCount++;
                        console.log(`✅ Fetched indicator ${indicatorId}`);
                    } else {
                        failedCount++;
                        console.warn(`⚠️ Failed to fetch indicator ${indicatorId}: ${response.status}`);
                    }
                } catch (error) {
                    failedCount++;
                    console.error(`❌ Error fetching indicator ${indicatorId}:`, error.message);
                }

                fetchedCount++;
                const percent = Math.round((fetchedCount / totalIndicators) * 100);
                progressBar.style.width = percent + '%';
                progressBar.textContent = `${percent}% (${fetchedCount}/${totalIndicators})`;

                // Small delay to avoid rate limiting
                if (fetchedCount % 10 === 0) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
            }
        }

        if (failedCount === 0) {
            showAlert(`✅ All ${successCount} indicators fetched successfully!`, 'success');
        } else {
            showAlert(`⚠️ Fetched ${successCount} indicators, ${failedCount} failed. Check console for details.`, 'info');
        }
    } catch (error) {
        console.error('Error fetching indicators:', error);
        showAlert('Failed to fetch indicators: ' + error.message, 'error');
    } finally {
        progressEl.classList.add('hidden');
        progressBar.style.width = '0%';
        progressBar.textContent = '0%';
    }
}

function deleteOrganization(orgId, orgName) {
    deletingOrgId = orgId;
    document.getElementById('deleteOrgName').textContent = orgName;
    document.getElementById('deleteModal').classList.add('active');
    pushModal('deleteModal');
}

async function confirmDelete() {
    if (!deletingOrgId) return;

    try {
        const response = await fetch(`/api/organizations/${deletingOrgId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            showAlert('Organization deleted successfully', 'success');
            closeDeleteModal();

            // If deleting selected org, clear selection
            if (selectedOrgId === deletingOrgId) {
                selectedOrgId = null;
                selectedOrgData = null;
                document.getElementById('assessmentSection').classList.add('hidden');
                const emptyState = document.getElementById('emptyState');
                if (emptyState) emptyState.style.display = 'block';
            }

            await loadAllData();
        } else {
            showAlert('Failed to delete organization: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Error deleting organization:', error);
        showAlert('Failed to delete organization: ' + error.message, 'error');
    }
}

function closeOrgModal() {
    document.getElementById('orgModal').classList.remove('active');
    document.getElementById('fetchProgress').classList.add('hidden');
    popModal('orgModal');
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    deletingOrgId = null;
    popModal('deleteModal');
}

// ===== TABS =====
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    if (tabName === 'progress') {
        document.getElementById('progressTab').classList.add('active');
    } else if (tabName === 'risk') {
        document.getElementById('riskTab').classList.add('active');
    } else if (tabName === 'maturity') {
        document.getElementById('maturityTab').classList.add('active');
        renderMaturityTab(); // Render maturity model data
    } else if (tabName === 'compile') {
        document.getElementById('compileTab').classList.add('active');
    }
}

// ===== MATURITY MODEL TAB =====
function renderMaturityTab() {
    if (!selectedOrgData) {
        console.warn('No organization data selected');
        document.getElementById('maturityTab').innerHTML = '<div style="padding: 40px; text-align: center;"><h3>⚠️ No organization selected</h3><p>Please select an organization to view maturity model.</p></div>';
        return;
    }
    if (!selectedOrgData.aggregates) {
        console.warn('No aggregates data available. Please generate assessment data first.');
        document.getElementById('maturityTab').innerHTML = '<div style="padding: 40px; text-align: center;"><h3>⚠️ No assessment data</h3><p>Please complete some assessments first to generate maturity model.</p></div>';
        return;
    }
    if (!selectedOrgData.aggregates.maturity_model) {
        // Check if we have any assessments at all
        const assessmentCount = selectedOrgData.assessments ? Object.keys(selectedOrgData.assessments).length : 0;

        console.warn('Maturity model not calculated. Debug info:', {
            hasAggregates: !!selectedOrgData.aggregates,
            assessmentCount: assessmentCount,
            industry: selectedOrgData.metadata?.industry,
            language: selectedOrgData.metadata?.language,
            aggregates: selectedOrgData.aggregates
        });

        // Different messages based on whether we have assessments or not
        if (assessmentCount === 0) {
            document.getElementById('maturityTab').innerHTML = '<div style="padding: 40px; text-align: center;"><h3>⚠️ No Field Kits available</h3><p>No assessment data found for this organization.</p><p style="margin-top: 10px; color: var(--text-light);">This may occur if Field Kit JSON files are not available in the organization\'s language (' + (selectedOrgData.metadata?.language || 'unknown') + ').</p></div>';
        } else {
            document.getElementById('maturityTab').innerHTML = '<div style="padding: 40px; text-align: center;"><h3>⚠️ Maturity model not calculated</h3><p>Assessment data exists but maturity model was not calculated.</p><p style="margin-top: 10px;">Please re-save an assessment to trigger recalculation.</p></div>';
        }
        return;
    }

    const mm = selectedOrgData.aggregates.maturity_model;

    // Maturity Level Descriptions
    const levelDescriptions = {
        0: 'Psychological blind spots are pervasive. No systematic approach to security awareness.',
        1: 'Initial awareness emerging. Ad-hoc security practices with significant gaps.',
        2: 'Foundational security culture developing. Documented processes being established.',
        3: 'Systematic approach in place. Processes are well-defined and followed consistently.',
        4: 'Quantitatively managed. Security metrics drive continuous improvement.',
        5: 'Adaptive excellence. Proactive optimization and industry-leading practices.'
    };

    // Level colors
    const levelColors = {
        0: '#dc2626', // red-600
        1: '#ea580c', // orange-600
        2: '#f59e0b', // amber-500
        3: '#eab308', // yellow-500
        4: '#84cc16', // lime-500
        5: '#22c55e'  // green-500
    };

    // 1. Update Maturity Level Badge
    const maturityLevelBadge = document.getElementById('maturityLevelBadge');
    const maturityLevelName = document.getElementById('maturityLevelName');
    const maturityLevelDescription = document.getElementById('maturityLevelDescription');

    if (maturityLevelBadge) {
        maturityLevelBadge.textContent = mm.maturity_level;
        maturityLevelBadge.style.color = levelColors[mm.maturity_level];
    }
    if (maturityLevelName) {
        maturityLevelName.textContent = mm.level_name;
        maturityLevelName.style.color = levelColors[mm.maturity_level];
    }
    if (maturityLevelDescription) {
        maturityLevelDescription.textContent = levelDescriptions[mm.maturity_level];
    }

    // 2. Update CPF Score Gauge
    const cpfScore = mm.cpf_score;
    const cpfScoreValue = document.getElementById('cpfScoreValue');
    if (cpfScoreValue) {
        cpfScoreValue.textContent = Math.round(cpfScore);
    }

    // Animate circular progress
    const circle = document.getElementById('cpfScoreCircle');
    if (circle) {
        const circumference = 2 * Math.PI * 80; // r=80
        const offset = circumference - (cpfScore / 100) * circumference;
        circle.style.strokeDashoffset = offset;

        // Color based on score
        if (cpfScore >= 80) {
            circle.style.stroke = 'var(--success)';
        } else if (cpfScore >= 60) {
            circle.style.stroke = 'var(--warning)';
        } else {
            circle.style.stroke = 'var(--danger)';
        }
    }

    // 3. Progress to Next Level
    const progressToNextLevel = document.getElementById('progressToNextLevel');
    if (progressToNextLevel) {
        if (mm.maturity_level < 5) {
            const currentLevelMin = mm.maturity_level * 20;
            const nextLevelMin = (mm.maturity_level + 1) * 20;
            const progress = ((cpfScore - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
            const progressClamped = Math.max(0, Math.min(100, progress));

            const levelNames = ['Unaware', 'Initial', 'Developing', 'Defined', 'Managed', 'Optimizing'];
            const nextLevelName = document.getElementById('nextLevelName');
            const progressBar = document.getElementById('progressBar');
            const progressText = document.getElementById('progressText');

            if (nextLevelName) {
                nextLevelName.textContent = `Level ${mm.maturity_level + 1}: ${levelNames[mm.maturity_level + 1]}`;
            }
            if (progressBar) {
                progressBar.style.width = progressClamped + '%';
            }
            if (progressText) {
                progressText.textContent = Math.round(progressClamped) + '%';
            }
            progressToNextLevel.style.display = 'block';
        } else {
            progressToNextLevel.style.display = 'none';
        }
    }

    // 4. Convergence Index
    const convergenceIndexValue = document.getElementById('convergenceIndexValue');
    const convergenceIndexStatus = document.getElementById('convergenceIndexStatus');

    if (convergenceIndexValue) {
        convergenceIndexValue.textContent = mm.convergence_index.toFixed(2);
    }

    if (convergenceIndexStatus) {
        let ciStatus = '';
        if (mm.convergence_index < 2) {
            ciStatus = '✅ Excellent - Low compound risk';
        } else if (mm.convergence_index < 5) {
            ciStatus = '⚠️ Moderate - Monitor closely';
        } else if (mm.convergence_index < 10) {
            ciStatus = '🔴 High - Remediation needed';
        } else {
            ciStatus = '🚨 Critical - Immediate action required';
        }
        convergenceIndexStatus.textContent = ciStatus;
        convergenceIndexStatus.style.color = mm.convergence_index < 2 ? 'var(--success)' :
            mm.convergence_index < 5 ? 'var(--warning)' : 'var(--danger)';
    }

    // 5. Domain Distribution
    const greenDomainsCount = document.getElementById('greenDomainsCount');
    const yellowDomainsCount = document.getElementById('yellowDomainsCount');
    const redDomainsCount = document.getElementById('redDomainsCount');

    if (greenDomainsCount) greenDomainsCount.textContent = mm.green_domains_count;
    if (yellowDomainsCount) yellowDomainsCount.textContent = mm.yellow_domains_count;
    if (redDomainsCount) redDomainsCount.textContent = mm.red_domains_count;

    // 6. Sector Percentile
    const sectorPercentileValue = document.getElementById('sectorPercentileValue');
    const sectorComparison = document.getElementById('sectorComparison');

    if (sectorPercentileValue) {
        sectorPercentileValue.textContent = mm.sector_benchmark.percentile.toFixed(0) + '%';
    }

    if (sectorComparison) {
        const gap = mm.sector_benchmark.gap;
        const gapText = gap >= 0 ?
            `+${gap.toFixed(1)} points above sector average` :
            `${gap.toFixed(1)} points below sector average`;
        sectorComparison.textContent = gapText;
        sectorComparison.style.color = gap >= 0 ? 'var(--success)' : 'var(--danger)';
    }

    // 7. Regulatory Compliance Table
    const complianceTableBody = document.getElementById('complianceTableBody');
    const regulations = [
        { name: 'GDPR Article 32', key: 'gdpr', description: 'Data Protection Regulation' },
        { name: 'NIS2 Directive', key: 'nis2', description: 'Network & Information Security' },
        { name: 'DORA', key: 'dora', description: 'Digital Operational Resilience (Financial)' },
        { name: 'ISO 27001:2022', key: 'iso27001', description: 'Information Security Management' }
    ];

    let complianceHTML = '';
    regulations.forEach(reg => {
        const compliance = mm.compliance[reg.key];
        const statusIcon = compliance.status === 'compliant' ? '✅' :
            compliance.status === 'at_risk' ? '⚠️' : '❌';
        const statusText = compliance.status === 'compliant' ? 'Compliant' :
            compliance.status === 'at_risk' ? 'At Risk' : 'Non-Compliant';
        const statusColor = compliance.status === 'compliant' ? 'var(--success)' :
            compliance.status === 'at_risk' ? 'var(--warning)' : 'var(--danger)';

        complianceHTML += `
            <tr style="border-bottom: 1px solid var(--border);">
                <td style="padding: 12px;">
                    <div style="font-weight: 600;">${reg.name}</div>
                    <div style="font-size: 12px; color: var(--text-light);">${reg.description}</div>
                </td>
                <td style="padding: 12px; text-align: center;">
                    <span style="color: ${statusColor}; font-weight: 600;">${statusIcon} ${statusText}</span>
                </td>
                <td style="padding: 12px; text-align: center;">Level ${compliance.min_level_required}</td>
                <td style="padding: 12px; text-align: center;">Level ${compliance.recommended_level}</td>
                <td style="padding: 12px; text-align: center; font-weight: 600; color: var(--primary);">Level ${mm.maturity_level}</td>
            </tr>
        `;
    });
    if (complianceTableBody) {
        complianceTableBody.innerHTML = complianceHTML;
    }

    // 8. Sector Benchmark Visualization
    const sectorMean = mm.sector_benchmark.sector_mean;
    const sectorMeanPercent = (sectorMean / 100) * 100;
    const yourScorePercent = (cpfScore / 100) * 100;

    document.getElementById('sectorMeanMarker').style.left = sectorMeanPercent + '%';
    document.getElementById('sectorMeanLabel').style.left = sectorMeanPercent + '%';
    document.getElementById('sectorMeanLabel').textContent = `Sector Mean: ${sectorMean}`;

    document.getElementById('yourScoreMarker').style.left = yourScorePercent + '%';
    document.getElementById('yourScoreLabel').style.left = yourScorePercent + '%';
    document.getElementById('yourScoreLabel').textContent = `Your Score: ${Math.round(cpfScore)}`;

    // Benchmark Stats
    const benchmarkStatsHTML = `
        <div style="padding: 10px; background: var(--bg-gray); border-radius: 6px;">
            <div style="font-size: 12px; color: var(--text-light);">Sector Mean</div>
            <div style="font-size: 20px; font-weight: 600;">${sectorMean}</div>
        </div>
        <div style="padding: 10px; background: var(--bg-gray); border-radius: 6px;">
            <div style="font-size: 12px; color: var(--text-light);">Your Score</div>
            <div style="font-size: 20px; font-weight: 600; color: var(--primary);">${Math.round(cpfScore)}</div>
        </div>
        <div style="padding: 10px; background: var(--bg-gray); border-radius: 6px;">
            <div style="font-size: 12px; color: var(--text-light);">Percentile Rank</div>
            <div style="font-size: 20px; font-weight: 600;">${mm.sector_benchmark.percentile.toFixed(0)}th</div>
        </div>
        <div style="padding: 10px; background: var(--bg-gray); border-radius: 6px;">
            <div style="font-size: 12px; color: var(--text-light);">Sector</div>
            <div style="font-size: 16px; font-weight: 600;">${selectedOrgData.industry || 'N/A'}</div>
        </div>
    `;
    document.getElementById('benchmarkStats').innerHTML = benchmarkStatsHTML;

    // 9. Certification Path
    const certifications = [
        { id: 'CPF-F', level: 1, name: 'Foundation', cost: '€500', duration: '2 days' },
        { id: 'CPF-P', level: 2, name: 'Practitioner', cost: '€1,500', duration: '5 days' },
        { id: 'CPF-E', level: 4, name: 'Expert', cost: '€3,500', duration: '10 days' },
        { id: 'CPF-M', level: 5, name: 'Master', cost: 'Invitation only', duration: 'Research required' }
    ];

    let certPathHTML = '';
    certifications.forEach(cert => {
        const isEligible = mm.certification_path.eligible_for.includes(cert.id);
        const isCurrent = mm.certification_path.current_certification === cert.id;

        certPathHTML += `
            <div style="text-align: center; padding: 20px; background: ${isEligible ? 'var(--bg-success)' : 'var(--bg-gray)'}; border-radius: 12px; min-width: 150px; position: relative;">
                ${isCurrent ? '<div style="position: absolute; top: -10px; right: -10px; background: var(--primary); color: white; padding: 5px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;">CURRENT</div>' : ''}
                <div style="font-size: 32px; margin-bottom: 10px;">${isEligible ? '🎖️' : '🔒'}</div>
                <div style="font-size: 18px; font-weight: 700; margin-bottom: 5px;">${cert.id}</div>
                <div style="font-size: 14px; color: var(--text-light); margin-bottom: 10px;">${cert.name}</div>
                <div style="font-size: 12px; color: var(--text-light);">Level ${cert.level}+</div>
                <div style="font-size: 12px; color: var(--text-light); margin-top: 5px;">${cert.cost}</div>
                <div style="font-size: 11px; color: var(--text-light);">${cert.duration}</div>
            </div>
        `;
    });
    document.getElementById('certificationPath').innerHTML = certPathHTML;

    // 10. ROI Analysis
    if (mm.roi_analysis && mm.maturity_level < 5) {
        const roi = mm.roi_analysis;
        document.getElementById('roiInvestment').textContent = `€${(roi.estimated_investment / 1000).toFixed(0)}k`;
        document.getElementById('roiAnnualBenefit').textContent = `€${(roi.annual_benefit / 1000).toFixed(0)}k`;
        document.getElementById('roiPayback').textContent = `${roi.payback_months} months`;
        document.getElementById('roiNPV').textContent = `€${(roi.npv_5yr / 1000000).toFixed(1)}M`;
        document.getElementById('roiAnalysisContainer').style.display = 'block';
    } else {
        document.getElementById('roiAnalysisContainer').style.display = 'none';
    }

    console.log('✅ Maturity Model tab rendered successfully');
}

// ===== UTILITIES =====
// Note: showAlert(), escapeHtml(), capitalizeFirst() are now in shared/ui-utils.js

// ===== COMPILE ASSESSMENT FUNCTIONS =====

// Global variable to store loaded indicator data
let currentIndicatorData = null;
let currentIndicatorId = null;

// Category mapping
const CATEGORY_MAP = {
    '1': 'authority',
    '2': 'temporal',
    '3': 'social',
    '4': 'affective',
    '5': 'cognitive',
    '6': 'group',
    '7': 'stress',
    '8': 'unconscious',
    '9': 'ai',
    '10': 'convergent'
};

// Update indicator preview
function updateIndicatorPreview() {
    const category = document.getElementById('compile-category-select').value;
    const indicator = document.getElementById('compile-indicator-select').value;
    const language = document.getElementById('compile-language-select').value;

    const indicatorId = `${category}.${indicator}`;
    const langShort = language.split('-')[0].toUpperCase();

    document.getElementById('indicatorPreviewText').textContent = `Indicator ${indicatorId} (${langShort})`;
    document.getElementById('indicatorPreview').style.display = 'block';
}

// Load indicator from GitHub
async function loadIndicatorForCompile() {
    const category = document.getElementById('compile-category-select').value;
    const indicator = document.getElementById('compile-indicator-select').value;
    const language = document.getElementById('compile-language-select').value;

    const indicatorId = `${category}.${indicator}`;
    const categoryName = CATEGORY_MAP[category];

    // Construct local URL
    const indicatorUrl = `/auditor-field-kit/interactive/${language}/${category}.x-${categoryName}/indicator_${indicatorId}.json`;

    try {
        showAlert('Loading indicator...', 'info');

        const response = await fetch(indicatorUrl);
        if (!response.ok) {
            throw new Error(`Indicator not found at ${indicatorUrl}`);
        }

        const data = await response.json();

        // Transform sections structure to field_kit structure for compatibility
        if (data.sections && !data.field_kit) {
            const quickSection = data.sections.find(s => s.id === 'quick-assessment');
            if (quickSection && quickSection.items) {
                data.field_kit = {
                    questions: quickSection.items.map(item => ({
                        text: item.question || item.title,
                        type: item.type === 'radio-list' ? 'single_choice' : item.type,
                        answer_scale: item.options || []
                    }))
                };
            }
        }

        currentIndicatorData = data;
        currentIndicatorId = indicatorId;

        // Render the form
        renderFieldKitForm(data);

        // Show form container, hide empty state
        document.getElementById('compileFormContainer').style.display = 'block';
        document.getElementById('compileEmptyState').style.display = 'none';
        document.getElementById('scoreDisplay').style.display = 'none';

        // Set today's date
        document.getElementById('compile-date').valueAsDate = new Date();

        showAlert(`Loaded indicator ${indicatorId} successfully!`, 'success');
    } catch (error) {
        showAlert(`Failed to load indicator: ${error.message}`, 'error');
        console.error('Load indicator error:', error);
    }
}

// Render field kit form
function renderFieldKitForm(data) {
    const container = document.getElementById('compileFormContent');
    container.innerHTML = '';

    if (!data.field_kit || !data.field_kit.questions) {
        container.innerHTML = '<p style="color: var(--danger);">Invalid indicator data: missing field_kit questions</p>';
        return;
    }

    // Display indicator title
    const title = document.createElement('div');
    title.style.cssText = 'margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid var(--border);';
    title.innerHTML = `
        <h3 style="margin: 0 0 5px 0; color: var(--primary);">${escapeHtml(data.title || 'Indicator')}</h3>
        <p style="margin: 0; color: var(--text-light); font-size: 14px;">${escapeHtml(data.description || '')}</p>
    `;
    container.appendChild(title);

    // Render questions
    data.field_kit.questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.style.cssText = 'margin-bottom: 25px; padding: 15px; background: var(--bg-gray); border-radius: 8px;';

        const questionText = document.createElement('div');
        questionText.style.cssText = 'font-weight: 600; margin-bottom: 10px; color: var(--text);';
        questionText.textContent = `${index + 1}. ${question.text}`;
        questionDiv.appendChild(questionText);

        // Render answer options
        if (question.type === 'single_choice' && question.answer_scale) {
            question.answer_scale.forEach(option => {
                const optionLabel = document.createElement('label');
                optionLabel.style.cssText = 'display: block; margin: 8px 0; padding: 8px 12px; background: white; border-radius: 6px; cursor: pointer;';
                optionLabel.innerHTML = `
                    <input type="radio" name="question_${index}" value="${option.value}" data-score="${option.score}" style="margin-right: 8px;">
                    <span style="font-weight: 600;">${option.value}:</span> ${escapeHtml(option.label)}
                `;
                questionDiv.appendChild(optionLabel);
            });
        } else if (question.type === 'text') {
            const textarea = document.createElement('textarea');
            textarea.id = `question_${index}`;
            textarea.className = 'form-input';
            textarea.rows = 3;
            textarea.placeholder = 'Enter your response...';
            questionDiv.appendChild(textarea);
        } else if (question.type === 'number') {
            const input = document.createElement('input');
            input.type = 'number';
            input.id = `question_${index}`;
            input.className = 'form-input';
            input.min = question.min || 0;
            input.max = question.max || 100;
            questionDiv.appendChild(input);
        }

        container.appendChild(questionDiv);
    });
}

// Calculate CPF Score
function calculateCPFScore() {
    if (!currentIndicatorData || !currentIndicatorData.field_kit) {
        showAlert('No indicator loaded', 'error');
        return;
    }

    const questions = currentIndicatorData.field_kit.questions;
    let totalScore = 0;
    let answeredCount = 0;

    questions.forEach((question, index) => {
        if (question.type === 'single_choice') {
            const selected = document.querySelector(`input[name="question_${index}"]:checked`);
            if (selected) {
                const score = parseFloat(selected.dataset.score);
                totalScore += score;
                answeredCount++;
            }
        } else if (question.type === 'number') {
            const input = document.getElementById(`question_${index}`);
            if (input && input.value) {
                const value = parseFloat(input.value);
                const normalized = (value - (question.min || 0)) / ((question.max || 100) - (question.min || 0));
                totalScore += normalized;
                answeredCount++;
            }
        }
    });

    if (answeredCount === 0) {
        showAlert('Please answer at least one question', 'error');
        return;
    }

    // Calculate average score (0-1 range)
    const avgScore = totalScore / answeredCount;
    const confidence = document.getElementById('compile-confidence').value;

    // Display score
    document.getElementById('scoreValue').textContent = avgScore.toFixed(3);
    document.getElementById('scoreConfidence').textContent = confidence;
    document.getElementById('scoreDisplay').style.display = 'block';

    showAlert('Score calculated successfully!', 'success');

    return { score: avgScore, confidence: parseFloat(confidence) };
}

// Save assessment to organization
async function saveAssessmentToOrg() {
    if (!selectedOrganization) {
        showAlert('No organization selected', 'error');
        return;
    }

    if (!currentIndicatorData || !currentIndicatorId) {
        showAlert('No indicator loaded', 'error');
        return;
    }

    // Calculate score first
    const scoreResult = calculateCPFScore();
    if (!scoreResult) {
        return; // Error already shown
    }

    // Collect all responses
    const responses = {};
    const questions = currentIndicatorData.field_kit.questions;
    questions.forEach((question, index) => {
        if (question.type === 'single_choice') {
            const selected = document.querySelector(`input[name="question_${index}"]:checked`);
            if (selected) {
                responses[`q${index + 1}`] = selected.value;
            }
        } else if (question.type === 'text') {
            const input = document.getElementById(`question_${index}`);
            if (input && input.value) {
                responses[`q${index + 1}`] = input.value;
            }
        } else if (question.type === 'number') {
            const input = document.getElementById(`question_${index}`);
            if (input && input.value) {
                responses[`q${index + 1}`] = input.value;
            }
        }
    });

    // Prepare assessment data for API (using same format as demo data for consistency)
    const assessor = document.getElementById('compile-assessor').value || 'Anonymous';
    const assessmentDate = document.getElementById('compile-date').value || new Date().toISOString().split('T')[0];

    const assessmentData = {
        indicator_id: currentIndicatorId,
        title: currentIndicatorData.title || `Indicator ${currentIndicatorId}`,
        category: currentIndicatorData.category || CATEGORY_MAP[currentIndicatorId.split('.')[0]],
        bayesian_score: scoreResult.score,
        confidence: scoreResult.confidence,
        maturity_level: getMaturityLevel(scoreResult.score),
        assessor: assessor,
        assessment_date: assessmentDate,
        raw_data: {
            client_conversation: {
                metadata: {
                    date: assessmentDate,
                    auditor: assessor,
                    status: 'completed'
                },
                responses: responses,
                notes: '',
                red_flags_identified: 0,
                red_flags: []
            },
            field_kit_version: '2.0',
            source: 'dashboard_auditing_v3'
        }
    };

    try {
        showAlert('Saving assessment...', 'info');

        const response = await fetch(`/api/organizations/${selectedOrganization}/assessments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(assessmentData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to save assessment');
        }

        const result = await response.json();

        showAlert(`Assessment saved successfully for indicator ${currentIndicatorId}!`, 'success');

        // Refresh organization details
        setTimeout(() => {
            loadOrganizationDetails(selectedOrganization);
        }, 1000);

        // Switch back to progress tab
        switchTab('progress');
        document.querySelector('.tab[onclick*="progress"]').click();

    } catch (error) {
        showAlert(`Failed to save assessment: ${error.message}`, 'error');
        console.error('Save assessment error:', error);
    }
}

// Get maturity level from score
function getMaturityLevel(score) {
    if (score >= 0.8) return 5;
    if (score >= 0.6) return 4;
    if (score >= 0.4) return 3;
    if (score >= 0.2) return 2;
    return 1;
}

// Reset Assessment - Clears form and saves empty values
async function resetCompileForm() {
    // Use selectedIndicatorId and selectedOrgId for integrated form
    const indicatorId = selectedIndicatorId || currentIndicatorId;
    const orgId = selectedOrgId || selectedOrganization;

    if (!indicatorId || !orgId) {
        console.warn('Reset: No indicator or organization selected');
        return;
    }

    // Show confirmation dialog
    if (!confirm('⚠️ Reset this assessment?\n\nThis will clear all form data and save an empty assessment.\n\nYou can undo this action using the History button.')) {
        return;
    }

    console.log('🗑️ Resetting assessment:', { indicatorId, orgId });

    // SAVE CURRENT STATE TO HISTORY BEFORE RESET
    // This ensures undo is possible via history
    if (currentData) {
        const currentResponses = currentData.responses || {};
        const hasData = Object.keys(currentResponses).length > 0;

        if (hasData) {
            console.log('💾 Saving current state to history before reset...');

            // Get indicator data from CPFClient if available
            const indicatorData = currentData?.fieldKit || currentIndicatorData;

            // Build current assessment data
            const currentAssessment = {
                indicator_id: indicatorId,
                title: indicatorData?.title || '',
                category: indicatorData?.category || '',
                bayesian_score: currentData.score?.bayesian_score || 0,
                confidence: currentData.score?.confidence || 0.5,
                maturity_level: currentData.score?.maturity_level || 'green',
                assessor: currentData.metadata?.auditor || '',
                assessment_date: new Date().toISOString(),
                raw_data: {
                    quick_assessment: {},
                    client_conversation: {
                        responses: currentResponses,
                        scores: currentData.score || null,
                        metadata: currentData.metadata || {
                            date: new Date().toISOString().split('T')[0],
                            auditor: '',
                            client: selectedOrgData?.name || '',
                            status: 'in-progress',
                            notes: ''
                        },
                        notes: currentData.notes || '',
                        red_flags: currentData.redFlags || []
                    }
                }
            };

            try {
                // Save current state first (this creates a history entry)
                const saveResponse = await fetch(`/api/organizations/${orgId}/assessments`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(currentAssessment)
                });

                const saveResult = await saveResponse.json();
                if (saveResult.success) {
                    console.log('✅ Current state saved to history before reset');
                } else {
                    console.warn('⚠️ Could not save current state to history:', saveResult.error);
                }
            } catch (error) {
                console.warn('⚠️ Error saving current state to history:', error);
            }
        }
    }

    // Clear all form inputs in both possible containers
    const containers = [
        document.getElementById('compileFormContent'),
        document.getElementById('indicatorModalContent'),
        document.getElementById('content')
    ];

    containers.forEach(container => {
        if (container) {
            const inputs = container.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = false;
                    // Also remove visual feedback
                    const parent = input.closest('.checkbox-item');
                    if (parent) parent.classList.remove('checked');
                } else if (input.type !== 'hidden') {
                    input.value = '';
                }
            });
        }
    });

    // Reset metadata fields
    const assessorField = document.getElementById('compile-assessor');
    const dateField = document.getElementById('compile-date');
    const confidenceField = document.getElementById('compile-confidence');
    if (assessorField) assessorField.value = '';
    if (dateField) dateField.value = '';
    if (confidenceField) confidenceField.value = '0.7';

    // Reset CPFClient data
    if (currentData) {
        currentData.responses = {};
        currentData.metadata = {
            date: new Date().toISOString().split('T')[0],
            auditor: '',
            client: selectedOrgData?.name || '',
            status: 'in-progress',
            notes: ''
        };
        currentData.score = null;

        console.log('✅ CPFClient data reset');
    }

    // REMOVE score displays entirely so they get recreated fresh by calculateIndicatorScore
    const scoreDisplay = document.getElementById('scoreDisplay');
    if (scoreDisplay) scoreDisplay.style.display = 'none';
    const scoreBar = document.getElementById('score-bar');
    if (scoreBar) {
        scoreBar.remove(); // Remove entirely so it gets recreated
        console.log('✅ Removed score-bar for fresh recreation');
    }
    const scoreSummary = document.getElementById('score-summary-section');
    if (scoreSummary) scoreSummary.remove();

    // Get indicator data from CPFClient if available
    const indicatorData = currentData?.fieldKit || currentIndicatorData;

    // Save empty assessment to API
    const emptyAssessment = {
        indicator_id: indicatorId,
        title: indicatorData?.title || '',
        category: indicatorData?.category || '',
        bayesian_score: 0,
        confidence: 0.5,
        maturity_level: 'green',
        assessor: '',
        assessment_date: new Date().toISOString(),
        raw_data: {
            quick_assessment: {},
            client_conversation: {
                responses: {},
                scores: null,
                metadata: {
                    date: new Date().toISOString().split('T')[0],
                    auditor: '',
                    client: selectedOrgData?.name || '',
                    status: 'in-progress',
                    notes: ''
                },
                notes: '',
                red_flags: []
            }
        }
    };

    try {
        console.log('💾 Saving empty assessment to API...');
        const response = await fetch(`/api/organizations/${orgId}/assessments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emptyAssessment)
        });

        const result = await response.json();

        if (result.success) {
            console.log('✅ Empty assessment saved successfully');
            showAlert('Assessment reset successfully!', 'success');

            // Refresh organization data to update matrix
            if (selectedOrgData) {
                await loadOrganizationDetails(orgId);
            }

            // Recalculate score to update UI
            if (typeof calculateIndicatorScore === 'function') {
                calculateIndicatorScore();
            }
        } else {
            throw new Error(result.error || 'Failed to save');
        }
    } catch (error) {
        console.error('❌ Error saving reset:', error);
        showAlert('Failed to reset assessment: ' + error.message, 'error');
    }
}

// Initialize compile tab on organization selection
function initializeCompileTab() {
    if (!selectedOrganization) return;

    // Set language based on organization
    const org = organizations.find(o => o.id === selectedOrganization);
    if (org && org.language) {
        document.getElementById('compile-language-select').value = org.language;
    }
}

// ===== TRASH & RESTORE FUNCTIONS =====

async function loadTrashCount() {
    try {
        const response = await fetch('/api/trash');
        const data = await response.json();

        if (data.success) {
            const count = data.count;
            const badge = document.getElementById('trashCount');

            if (badge) {
                if (count > 0) {
                    badge.textContent = count;
                    badge.style.display = 'inline-block';
                    badge.style.marginLeft = '5px';
                    badge.style.background = 'var(--danger)';
                    badge.style.color = 'white';
                    badge.style.padding = '2px 8px';
                    badge.style.borderRadius = '12px';
                    badge.style.fontSize = '11px';
                    badge.style.fontWeight = '600';
                } else {
                    badge.style.display = 'none';
                }
            }
        }
    } catch (error) {
        console.error('Error loading trash count:', error);
    }
}

async function openTrashModal() {
    document.getElementById('trashModal').classList.add('active');
    pushModal('trashModal');

    try {
        const response = await fetch('/api/trash');
        const data = await response.json();

        if (!data.success || data.count === 0) {
            document.getElementById('trashContent').innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🗑️</div>
                    <div class="empty-state-title">Trash is Empty</div>
                    <div class="empty-state-text">No deleted organizations</div>
                </div>
            `;
            return;
        }

        // Render trash items
        let html = '<div style="padding: 20px;">';
        html += '<p style="color: var(--text-light); font-size: 14px; margin-bottom: 20px;">Organizations will be automatically deleted after 30 days</p>';

        data.organizations.forEach(org => {
            const daysLeft = org.days_until_permanent_delete;
            const warningClass = daysLeft <= 5 ? 'var(--danger)' : 'var(--text-light)';

            html += `
                <div style="background: var(--bg-gray); border: 2px solid var(--border); border-radius: 10px; padding: 20px; margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                        <div style="flex: 1;">
                            <h4 style="margin: 0 0 8px 0; color: var(--primary);">${escapeHtml(org.name)}</h4>
                            <div style="font-size: 13px; color: var(--text-light);">
                                <div>ID: <code>${escapeHtml(org.id)}</code></div>
                                <div>Industry: ${escapeHtml(org.industry)}</div>
                                <div>Assessments: ${org.stats.total_assessments}/100</div>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 12px; color: ${warningClass}; font-weight: 600; margin-bottom: 10px;">
                                ${daysLeft > 0 ? `${daysLeft} days left` : 'Expires today'}
                            </div>
                            <div style="display: flex; gap: 8px;">
                                <button class="btn btn-primary btn-small" data-action="restore-from-trash" data-org-id="${escapeHtml(org.id)}">
                                    ♻️ Restore
                                </button>
                                <button class="btn btn-danger btn-small" data-action="permanent-delete-org" data-org-id="${escapeHtml(org.id)}" data-org-name="${escapeHtml(org.name)}">
                                    🔥 Delete Forever
                                </button>
                            </div>
                        </div>
                    </div>
                    <div style="font-size: 12px; color: var(--text-light); padding-top: 12px; border-top: 1px solid var(--border);">
                        Deleted: ${new Date(org.deleted_at).toLocaleString()}
                    </div>
                </div>
            `;
        });

        html += '</div>';
        document.getElementById('trashContent').innerHTML = html;

    } catch (error) {
        console.error('Error loading trash:', error);
        showAlert('Failed to load trash', 'error');
    }
}

function closeTrashModal() {
    document.getElementById('trashModal').classList.remove('active');
    popModal('trashModal');
}

async function restoreFromTrash(orgId) {
    if (!confirm('Restore this organization?')) return;

    try {
        const response = await fetch(`/api/organizations/${orgId}/restore`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: 'Dashboard User' })
        });

        const result = await response.json();

        if (result.success) {
            showAlert(`Organization restored successfully!`, 'success');
            closeTrashModal();
            await loadAllData();
            await loadTrashCount();
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Error restoring organization:', error);
        showAlert(`Failed to restore: ${error.message}`, 'error');
    }
}

async function permanentDeleteOrg(orgId, orgName) {
    if (!confirm(`⚠️ PERMANENTLY DELETE "${orgName}"?\n\nThis action CANNOT be undone!\n\nAll assessment data will be lost forever.`)) return;

    // Double confirmation
    if (!confirm(`Are you absolutely sure? Type the org ID to confirm: ${orgId}`)) return;

    try {
        const response = await fetch(`/api/organizations/${orgId}/permanent?user=Dashboard%20User`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            showAlert('Organization permanently deleted', 'success');
            closeTrashModal();
            await loadTrashCount();
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Error permanently deleting organization:', error);
        showAlert(`Failed to delete: ${error.message}`, 'error');
    }
}

// ===== ASSESSMENT HISTORY FUNCTIONS =====

let currentHistoryOrgId = null;
let currentHistoryIndicatorId = null;

async function openHistoryModal() {
    if (!selectedIndicatorId || !selectedOrgId) {
        showAlert('No assessment selected', 'error');
        return;
    }

    currentHistoryOrgId = selectedOrgId;
    currentHistoryIndicatorId = selectedIndicatorId;

    document.getElementById('historyModal').classList.add('active');
    pushModal('historyModal');
    document.getElementById('historyModalTitle').textContent = `📜 Version History - ${selectedIndicatorId}`;

    try {
        const response = await fetch(`/api/organizations/${selectedOrgId}/assessments/${selectedIndicatorId}/history`);
        const data = await response.json();

        if (!data.success || data.history.versions.length === 0) {
            document.getElementById('historyContent').innerHTML = `
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

            html += `
                <div style="background: ${isCurrent ? '#eff6ff' : 'var(--bg-gray)'}; border: 2px solid ${isCurrent ? 'var(--primary)' : 'var(--border)'}; border-radius: 10px; padding: 20px; margin-bottom: 15px; position: relative;">
                    ${isCurrent ? '<div style="position: absolute; top: 10px; right: 10px; background: var(--primary); color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 600;">CURRENT</div>' : ''}
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
                        ${!isCurrent ? `
                        <div>
                            <button class="btn btn-warning btn-small" data-action="revert-to-version" data-version="${version.version}">
                                ↩️ Revert to This
                            </button>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });

        html += '</div>';
        document.getElementById('historyContent').innerHTML = html;

    } catch (error) {
        console.error('Error loading history:', error);
        showAlert('Failed to load history', 'error');
    }
}

function closeHistoryModal() {
    document.getElementById('historyModal').classList.remove('active');
    currentHistoryOrgId = null;
    currentHistoryIndicatorId = null;
    popModal('historyModal');
}

async function revertToVersion(versionNumber) {
    if (!confirm(`Revert to version ${versionNumber}?\n\nThis will create a new version based on the selected one.`)) return;

    // IMPORTANT: Save IDs before closing modal (closeHistoryModal nullifies them!)
    const orgId = currentHistoryOrgId;
    const indicatorId = currentHistoryIndicatorId;

    try {
        const response = await fetch(`/api/organizations/${orgId}/assessments/${indicatorId}/revert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                version: versionNumber,
                user: 'Dashboard User'
            })
        });

        const result = await response.json();

        if (result.success) {
            showAlert(`Reverted to version ${versionNumber}`, 'success');
            closeHistoryModal();

            // Reload organization data
            await loadOrganizationDetails(orgId);
            renderAssessmentDetails();

            // CRITICAL: Reload the integrated form if it's open
            // Update CPFClient with reverted data
            if (currentData && selectedOrgData) {
                const revertedAssessment = selectedOrgData.assessments[indicatorId];

                if (revertedAssessment && revertedAssessment.raw_data && revertedAssessment.raw_data.client_conversation) {
                    // Update CPFClient internal data
                    currentData.responses = revertedAssessment.raw_data.client_conversation.responses || {};
                    currentData.score = revertedAssessment.raw_data.client_conversation.scores || null;

                    if (revertedAssessment.raw_data.client_conversation.metadata) {
                        currentData.metadata = {
                            ...currentData.metadata,
                            ...revertedAssessment.raw_data.client_conversation.metadata
                        };
                    }

                    // Re-render the form with reverted data
                    if (currentData.fieldKit) {
                        console.log('🔄 Reloading form with reverted data...');
                        renderFieldKit(currentData.fieldKit);
                        showAlert(`Form reloaded with version ${versionNumber} data`, 'info');
                    }
                }
            }
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Error reverting version:', error);
        showAlert(`Failed to revert: ${error.message}`, 'error');
    }
}

// ============================================================================
// EXPORT FUNCTIONS (XLSX, PDF & ZIP)
// ============================================================================

/**
 * Export current organization to XLSX
 */
async function exportCurrentOrgXLSX() {
    if (!selectedOrgData) {
        showAlert('No organization selected', 'error');
        return;
    }

    try {
        const orgId = selectedOrgData.id;
        const url = `/api/organizations/${orgId}/export/xlsx?user=Dashboard User`;

        showAlert('Generating XLSX export...', 'info');

        // Get organization name with fallbacks
        const orgName = (selectedOrgData.metadata?.name || selectedOrgData.name || orgId || 'Organization').replace(/\s/g, '_');

        // Create temporary link and trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = `CPF_Audit_${orgName}_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
            showAlert('XLSX export started! Check your downloads.', 'success');
        }, 1000);
    } catch (error) {
        console.error('Error exporting XLSX:', error);
        showAlert(`Failed to export XLSX: ${error.message}`, 'error');
    }
}

/**
 * Export current organization to PDF
 */
async function exportCurrentOrgPDF() {
    if (!selectedOrgData) {
        showAlert('No organization selected', 'error');
        return;
    }

    try {
        const orgId = selectedOrgData.id;
        const url = `/api/organizations/${orgId}/export/pdf?user=Dashboard User`;

        showAlert('Generating PDF export...', 'info');

        // Get organization name with fallbacks
        const orgName = (selectedOrgData.metadata?.name || selectedOrgData.name || orgId || 'Organization').replace(/\s/g, '_');

        // Create temporary link and trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = `CPF_Audit_${orgName}_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
            showAlert('PDF export started! Check your downloads.', 'success');
        }, 1000);
    } catch (error) {
        console.error('Error exporting PDF:', error);
        showAlert(`Failed to export PDF: ${error.message}`, 'error');
    }
}

/**
 * Export current organization to ZIP (all assessment cards/schede)
 */
async function exportCurrentOrgZIP() {
    if (!selectedOrgData) {
        showAlert('No organization selected', 'error');
        return;
    }

    try {
        const orgId = selectedOrgData.id;
        const url = `/api/organizations/${orgId}/export/zip?user=Dashboard User`;

        showAlert('Generating ZIP export with all assessment cards...', 'info');

        // Get organization name with fallbacks
        const orgName = (selectedOrgData.metadata?.name || selectedOrgData.name || orgId || 'Organization').replace(/\s/g, '_');

        // Create temporary link and trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = `CPF_Audit_${orgName}_${new Date().toISOString().split('T')[0]}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
            showAlert('ZIP export started! Check your downloads.', 'success');
        }, 1000);
    } catch (error) {
        console.error('Error exporting ZIP:', error);
        showAlert(`Failed to export ZIP: ${error.message}`, 'error');
    }
}

/**
 * Set matrix zoom level
 * @param {string} matrixType - Type of matrix ('progress', 'risk')
 * @param {number} zoomLevel - Zoom percentage (100, 50, 33)
 */
function setMatrixZoom(matrixType, zoomLevel) {
    let matrixElement;
    let buttonsContainer;

    // Get the correct matrix element based on type
    if (matrixType === 'progress') {
        matrixElement = document.getElementById('progressMatrix');
        buttonsContainer = document.querySelector('#progressTab .zoom-controls');
    } else if (matrixType === 'risk') {
        matrixElement = document.getElementById('riskHeatmap');
        buttonsContainer = document.querySelector('#riskTab .zoom-controls');
    }

    if (!matrixElement || !buttonsContainer) {
        console.error('Matrix element or buttons container not found');
        return;
    }

    // Remove all zoom classes
    matrixElement.classList.remove('zoom-100', 'zoom-75', 'zoom-50');

    // Add the new zoom class
    matrixElement.classList.add(`zoom-${zoomLevel}`);

    // Update button states
    const buttons = buttonsContainer.querySelectorAll('.zoom-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent === `${zoomLevel}%`) {
            btn.classList.add('active');
        }
    });

    // Save zoom preference in localStorage
    localStorage.setItem(`matrix-zoom-${matrixType}`, zoomLevel);
}

/**
 * Restore zoom level from localStorage
 */
function restoreMatrixZoom() {
    ['progress', 'risk'].forEach(matrixType => {
        const savedZoom = localStorage.getItem(`matrix-zoom-${matrixType}`);
        if (savedZoom) {
            setMatrixZoom(matrixType, parseInt(savedZoom));
        }
    });
}

// ===== EVENT DELEGATION SYSTEM =====
/**
 * Setup event delegation for all dashboard interactions
 * This eliminates inline onclick handlers for better CSP compliance and maintainability
 */
function setupEventDelegation() {
    // Delegate all clicks on document
    document.addEventListener('click', (e) => {
        // Find the closest element with data-action attribute
        const target = e.target.closest('[data-action]');

        if (!target) return;

        const action = target.dataset.action;

        // Prevent default for buttons
        if (target.tagName === 'BUTTON') {
            e.preventDefault();
        }

        switch (action) {
            // Sidebar actions
            case 'open-sidebar':
                openSidebar();
                break;
            case 'close-sidebar':
                closeSidebar();
                break;

            // Modal actions
            case 'open-create-org-modal':
                openCreateOrgModal();
                break;
            case 'close-org-modal':
                closeOrgModal();
                break;
            case 'open-trash-modal':
                openTrashModal();
                break;
            case 'close-trash-modal':
                closeTrashModal();
                break;
            case 'close-delete-modal':
                closeDeleteModal();
                break;
            case 'confirm-delete':
                confirmDelete();
                break;
            case 'close-indicator-modal':
                closeIndicatorModal();
                break;
            case 'open-history-modal':
                openHistoryModal();
                break;
            case 'open-integrated-version':
                openIntegratedVersion();
                break;
            case 'delete-assessment-from-modal':
                deleteAssessmentFromModal();
                break;
            case 'close-assessment-details-modal':
                closeAssessmentDetailsModal();
                break;
            case 'open-history-modal-from-details':
                openHistoryModalFromDetails();
                break;
            case 'delete-assessment-from-details':
                deleteAssessmentFromDetails();
                break;
            case 'close-history-modal':
                closeHistoryModal();
                break;
            case 'close-category-modal':
                closeCategoryModal();
                break;

            // Export actions
            case 'export-xlsx':
                exportCurrentOrgXLSX();
                break;
            case 'export-pdf':
                exportCurrentOrgPDF();
                break;
            case 'export-zip':
                exportCurrentOrgZIP();
                break;

            // Filter and sort actions
            case 'toggle-sort-direction':
                toggleSortDirection();
                break;
            case 'reset-filters':
                resetFilters();
                break;
            case 'clear-category-filter':
                clearCategoryFilter();
                break;

            // Tab actions
            case 'switch-tab':
                const tab = target.dataset.tab;
                if (tab) switchTab(tab);
                break;

            // Zoom actions
            case 'set-matrix-zoom':
                const matrixType = target.dataset.matrixType;
                const zoomLevel = parseInt(target.dataset.zoomLevel);
                if (matrixType && zoomLevel) setMatrixZoom(matrixType, zoomLevel);
                break;

            // Compile actions
            case 'load-indicator-for-compile':
                loadIndicatorForCompile();
                break;
            case 'reset-compile-form':
                resetCompileForm();
                break;
            case 'save-assessment-to-org':
                saveAssessmentToOrg();
                break;

            // Organization actions (with parameters)
            case 'edit-organization':
                const editOrgId = target.dataset.orgId;
                if (editOrgId) editOrganization(editOrgId);
                break;
            case 'delete-organization':
                const deleteOrgId = target.dataset.orgId;
                const deleteOrgName = target.dataset.orgName;
                if (deleteOrgId && deleteOrgName) deleteOrganization(deleteOrgId, deleteOrgName);
                break;
            case 'select-organization':
                const selectOrgId = target.dataset.orgId;
                if (selectOrgId) selectOrganization(selectOrgId);
                break;

            // Indicator actions (with parameters)
            case 'open-indicator-detail':
                const indicatorId = target.dataset.indicatorId;
                const orgId = target.dataset.orgId;
                if (indicatorId && orgId) openIndicatorDetail(indicatorId, orgId);
                break;
            case 'filter-by-category':
                const categoryKey = target.dataset.categoryKey;
                if (categoryKey) filterByCategory(categoryKey);
                break;
            case 'open-category-modal':
                const catKey = target.dataset.categoryKey;
                if (catKey) openCategoryModal(catKey);
                break;
            case 'view-assessment-details-from-edit':
                const viewIndicatorId = target.dataset.indicatorId;
                if (viewIndicatorId) viewAssessmentDetailsFromEdit(viewIndicatorId);
                break;

            // Trash actions (with parameters)
            case 'restore-from-trash':
                const restoreOrgId = target.dataset.orgId;
                if (restoreOrgId) restoreFromTrash(restoreOrgId);
                break;
            case 'permanent-delete-org':
                const permDeleteOrgId = target.dataset.orgId;
                const permDeleteOrgName = target.dataset.orgName;
                if (permDeleteOrgId && permDeleteOrgName) permanentDeleteOrg(permDeleteOrgId, permDeleteOrgName);
                break;

            // Version actions (with parameters)
            case 'revert-to-version':
                const version = parseInt(target.dataset.version);
                if (!isNaN(version)) revertToVersion(version);
                break;

            // File input triggers
            case 'trigger-file-input':
                const fileInputId = target.dataset.fileInputId;
                if (fileInputId) {
                    const fileInput = document.getElementById(fileInputId);
                    if (fileInput) fileInput.click();
                }
                break;

            // Client actions
            case 'show-quick-reference':
                showQuickReference();
                break;
            case 'close-quick-reference':
            case 'close-quick-reference-backdrop':
                if (action === 'close-quick-reference-backdrop' && e.target.id !== 'reference-modal') {
                    return; // Only close if clicking on backdrop
                }
                closeQuickReference();
                break;
            case 'toggle-detailed-analysis':
                toggleDetailedAnalysis();
                break;
            case 'save-data':
                // Call saveData and handle post-save if in indicator modal
                (async () => {
                    try {
                        await saveData();

                        // If we're in the indicator modal, reload org data
                        const modal = document.getElementById('indicatorModal');
                        if (modal && modal.style.display !== 'none' && selectedOrgId) {
                            showAlert('Assessment saved successfully!', 'success');

                            // Reload organization data after short delay
                            setTimeout(async () => {
                                await loadOrganizationDetails(selectedOrgId);
                            }, 1000);
                        }
                    } catch (error) {
                        console.error('Error saving assessment:', error);
                        showAlert('Failed to save assessment: ' + error.message, 'error');
                    }
                })();
                break;
            case 'export-data':
                exportData();
                break;
            case 'generate-report':
                generateReport();
                break;
        }
    });

    // Delegate change events (for selects and inputs)
    document.addEventListener('change', (e) => {
        const target = e.target;
        const action = target.dataset.action;

        if (!action) return;

        switch (action) {
            case 'filter-and-sort':
                filterAndSortOrganizations();
                break;
            case 'update-indicator-preview':
                updateIndicatorPreview();
                break;
            case 'import-json':
                importJSON(e);
                break;
        }
    });

    // Delegate input events (for search)
    document.addEventListener('input', (e) => {
        const target = e.target;
        const action = target.dataset.action;

        if (!action) return;

        switch (action) {
            case 'filter-and-sort':
                filterAndSortOrganizations();
                break;
        }
    });

    // Delegate submit events (for forms)
    document.addEventListener('submit', (e) => {
        const target = e.target;
        const action = target.dataset.action;

        if (!action) return;

        switch (action) {
            case 'save-organization':
                e.preventDefault();
                saveOrganization(e);
                break;
        }
    });
}

// Initialize event delegation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setupEventDelegation();
});