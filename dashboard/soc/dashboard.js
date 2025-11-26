// Global state
let organizationsData = null;
let currentOrgId = null;
let currentOrgLanguage = 'en-US'; // Default language
let sortDirection = 'desc'; // 'asc' or 'desc'
let editingOrgId = null;
let deletingOrgId = null;
// Note: modalStack is now in ui-utils.js as window.modalStack
let securityRadarChartInstance = null; // Global chart instance to allow updates
let categoryDescriptions = null; // Category descriptions (bilingual)

// Note: openSidebar() and closeSidebar() are now in shared/ui-utils.js

// Load data on page load
window.addEventListener('DOMContentLoaded', async () => {
    await loadOrganizationsData();
    await loadCategoryDescriptions();
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
            case 'indicator-modal':
                closeIndicatorModal();
                break;
            case 'edit-org-modal':
                closeEditOrgModal();
                break;
            case 'delete-org-modal':
                closeDeleteOrgModal();
                break;
            case 'category-modal':
                closeCategoryModal();
                break;
            case 'org-modal':
                closeOrgModal();
                break;
        }
    }
});

async function loadOrganizationsData() {
    try {
        const response = await fetch('/api/organizations');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        organizationsData = data;

        document.getElementById('loading').style.display = 'none';
        renderOrganizationsList(data);
        document.getElementById('empty-state').style.display = 'block';

    } catch (error) {
        document.getElementById('loading').innerHTML = `
            <h2>⚠️ Error Loading Data</h2>
            <p>${error.message}</p>
            <p>Make sure server is running and organizations exist</p>
        `;
    }
}

function renderOrganizationsList(data) {
    const orgList = document.getElementById('org-list');
    const orgCount = document.getElementById('org-count');

    orgCount.textContent = data.metadata.total_organizations;

    const orgs = data.organizations;
    orgList.innerHTML = ''; // Clear existing list

    orgs.forEach((org) => {
        const item = document.createElement('div');
        item.className = 'org-item';
        if (currentOrgId === org.id) {
            item.classList.add('active');
        }
        item.onclick = () => selectOrganization(org.id);

        const overallRisk = org.stats?.overall_risk || 0;
        const riskClass = overallRisk > 0.66 ? 'high' :
            overallRisk > 0.33 ? 'medium' : 'low';
        const riskLabel = overallRisk > 0.66 ? 'High' :
            overallRisk > 0.33 ? 'Medium' : 'Low';
        const completion = org.stats?.completion_percentage || 0;
        const totalAssessments = org.stats?.total_assessments || 0;

        // Helper function to capitalize first letter
        const capitalizeFirst = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

        // Get country flag using ISO codes
        const country = org.country || 'Unknown';
        const countryFlag = country === 'IT' ? '🇮🇹' :
                           country === 'US' ? '🇺🇸' :
                           country === 'GB' ? '🇬🇧' :
                           country === 'DE' ? '🇩🇪' :
                           country === 'FR' ? '🇫🇷' :
                           country === 'ES' ? '🇪🇸' : '🌐';

        // Get language info (language is at org level, not in metadata)
        const language = org.language || 'en-US';

        // Format creation date
        const createdDate = org.created_at ? new Date(org.created_at).toLocaleDateString() : 'N/A';

        item.innerHTML = `
            <div class="org-card-header">
                <div style="flex: 1; min-width: 0;">
                    <div class="org-name">${org.name}</div>
                    <div class="org-meta">
                        ${org.industry} • ${capitalizeFirst(org.size)} • ${countryFlag} ${org.country}
                    </div>
                </div>
                <div class="org-card-actions" onclick="event.stopPropagation()">
                    <button class="icon-btn" onclick="editOrganization('${org.id}')" title="Edit">✏️</button>
                    <button class="icon-btn" onclick="deleteOrganization('${org.id}', '${org.name.replace(/'/g, "\\'")}')" title="Delete">🗑️</button>
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
    if (!organizationsData) return;

    const searchValue = document.getElementById('org-search').value.toLowerCase().trim();
    const sortValue = document.getElementById('org-sort').value;

    // Filter organizations - search by name only
    let filtered = organizationsData.organizations.filter(org => {
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

    // Update count and re-render
    const orgCount = document.getElementById('org-count');
    orgCount.textContent = filtered.length;

    const data = {
        metadata: {
            total_organizations: filtered.length
        },
        organizations: filtered
    };

    renderOrganizationsList(data);
}

// Reset all filters to default
function resetFilters() {
    document.getElementById('org-search').value = '';
    document.getElementById('org-sort').value = 'created_at';
    sortDirection = 'desc';
    document.getElementById('sort-direction').textContent = '⬇️';
    filterAndSortOrganizations();
}

// Edit organization - open modal with current data
async function editOrganization(orgId) {
    editingOrgId = orgId;

    try {
        // Fetch full organization data
        const response = await fetch(`/api/organizations/${orgId}`);
        if (!response.ok) throw new Error('Failed to load organization');

        const result = await response.json();
        const org = result.data;

        // Populate form
        document.getElementById('edit-org-name').value = org.name;
        document.getElementById('edit-org-industry').value = org.metadata.industry;
        document.getElementById('edit-org-size').value = org.metadata.size;
        document.getElementById('edit-org-country').value = org.metadata.country;
        document.getElementById('edit-org-language').value = org.metadata.language;
        document.getElementById('edit-org-sede-sociale').value = org.metadata.sede_sociale || '';
        document.getElementById('edit-org-partita-iva').value = org.metadata.partita_iva || '';
        document.getElementById('edit-org-notes').value = org.metadata.notes || '';

        // Show modal
        document.getElementById('edit-org-modal').style.display = 'block';
        pushModal('edit-org-modal');
    } catch (error) {
        console.error('Error loading organization:', error);
        showAlert('Failed to load organization data: ' + error.message, 'error');
    }
}

function closeEditOrgModal() {
    document.getElementById('edit-org-modal').style.display = 'none';
    document.getElementById('edit-org-form').reset();
    editingOrgId = null;
    popModal('edit-org-modal');
}

async function saveOrganizationEdit(event) {
    event.preventDefault();

    if (!editingOrgId) return;

    const data = {
        name: document.getElementById('edit-org-name').value,
        industry: document.getElementById('edit-org-industry').value,
        size: document.getElementById('edit-org-size').value,
        country: document.getElementById('edit-org-country').value.toUpperCase(),
        language: document.getElementById('edit-org-language').value,
        sede_sociale: document.getElementById('edit-org-sede-sociale').value.trim(),
        partita_iva: document.getElementById('edit-org-partita-iva').value.trim(),
        notes: document.getElementById('edit-org-notes').value
    };

    try {
        const response = await fetch(`/api/organizations/${editingOrgId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            showAlert('✅ Organization updated successfully!', 'success');
            closeEditOrgModal();
            await loadOrganizationsData();

            // If editing currently selected org, reload it
            if (currentOrgId === editingOrgId) {
                await loadAndRenderOrganization(editingOrgId);
            }
        } else {
            showAlert('Failed to update organization: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Error updating organization:', error);
        showAlert('Failed to update organization: ' + error.message, 'error');
    }
}

// Delete organization - open confirmation modal
function deleteOrganization(orgId, orgName) {
    deletingOrgId = orgId;
    document.getElementById('delete-org-name').textContent = orgName;
    document.getElementById('delete-org-modal').style.display = 'block';
    pushModal('delete-org-modal');
}

function closeDeleteOrgModal() {
    document.getElementById('delete-org-modal').style.display = 'none';
    deletingOrgId = null;
    popModal('delete-org-modal');
}

async function confirmDeleteOrganization() {
    if (!deletingOrgId) return;

    try {
        const response = await fetch(`/api/organizations/${deletingOrgId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            showAlert('✅ Organization deleted successfully!', 'success');
            closeDeleteOrgModal();

            // If deleting currently selected org, clear selection
            if (currentOrgId === deletingOrgId) {
                currentOrgId = null;
                document.getElementById('org-detail').style.display = 'none';
                document.getElementById('empty-state').style.display = 'block';
            }

            await loadOrganizationsData();
        } else {
            showAlert('Failed to delete organization: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Error deleting organization:', error);
        showAlert('Failed to delete organization: ' + error.message, 'error');
    }
}

async function selectOrganization(orgId) {
    currentOrgId = orgId;

    // Update active state
    document.querySelectorAll('.org-item').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget?.classList.add('active');

    // Hide empty state, show detail
    document.getElementById('empty-state').style.display = 'none';
    document.getElementById('org-detail').style.display = 'block';

    // Show export buttons
    const xlsxBtn = document.getElementById('exportXLSXBtn');
    const pdfBtn = document.getElementById('exportPDFBtn');
    if (xlsxBtn) xlsxBtn.style.display = 'inline-flex';
    if (pdfBtn) pdfBtn.style.display = 'inline-flex';

    // Setup WebSocket for real-time updates
    setupWebSocket(orgId);

    // Fetch and render organization analysis
    await loadAndRenderOrganization(orgId);
}

// Store original org-detail template on first load
let originalOrgDetailTemplate = null;

async function loadAndRenderOrganization(orgId) {
    const orgDetailEl = document.getElementById('org-detail');

    // Save original template on first call
    if (!originalOrgDetailTemplate) {
        originalOrgDetailTemplate = orgDetailEl.innerHTML;
    }

    try {
        // Restore original template before rendering (in case it was corrupted by previous error)
        orgDetailEl.innerHTML = originalOrgDetailTemplate;

        // Fetch SOC data (NON usare assessments di auditing)
        const socResponse = await fetch(`/api/soc/${orgId}`);
        if (!socResponse.ok) {
            throw new Error(`Failed to load SOC data: ${socResponse.status}`);
        }
        const socResult = await socResponse.json();

        if (!socResult.success) {
            throw new Error(socResult.error || 'No SOC data available');
        }

        renderOrganizationDetail(socResult.data);
    } catch (error) {
        console.error('Error loading organization:', error);
        orgDetailEl.innerHTML = `
            <div class="error-message" style="padding: 40px; text-align: center;">
                <h3 style="color: #d32f2f; margin-bottom: 16px;">⚠️ Error Loading SOC Data</h3>
                <p style="margin-bottom: 8px; color: #666;">${error.message}</p>
                <p style="color: #999;">Make sure the simulator has generated data for this organization</p>
                <button onclick="window.location.href='/dashboard/simulator/'" style="margin-top: 20px; padding: 10px 20px; background: var(--primary); color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Go to Simulator
                </button>
            </div>
        `;
    }
}

/**
 * Convert SOC data format to bayesian.js expected format
 * SOC format: {org_id, org_name, indicators: {indicatorId: {value, previous_value, last_updated}}}
 * Bayesian format: {indicators: {indicatorId: {soc_values: [...], human_values: [...], current_bayesian: value}}}
 */
function convertSocDataForBayesian(socData) {
    const indicators = {};

    if (socData.indicators) {
        for (const [indicatorId, socIndicator] of Object.entries(socData.indicators)) {
            // Create soc_values array with current and previous values
            const socValues = [];

            if (socIndicator.previous_value !== null && socIndicator.previous_value !== undefined) {
                // Add previous value (older timestamp)
                socValues.push({
                    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                    value: socIndicator.previous_value,
                    confidence: 0.8,
                    source: 'soc'
                });
            }

            if (socIndicator.value !== undefined) {
                // Add current value
                socValues.push({
                    timestamp: socIndicator.last_updated || new Date().toISOString(),
                    value: socIndicator.value,
                    confidence: 0.8,
                    source: 'soc'
                });
            }

            indicators[indicatorId] = {
                soc_values: socValues,
                human_values: [], // No human assessments in SOC data
                current_bayesian: socIndicator.value || 0
            };
        }
    }

    return {
        org_id: socData.org_id,
        org_name: socData.org_name,
        indicators
    };
}

/**
 * Convert API v2.0 organization format to bayesian.js expected format (DEPRECATED - use convertSocDataForBayesian)
 * API v2.0 has 'assessments' with bayesian_score
 * bayesian.js expects 'indicators' with current_bayesian, soc_values, human_values
 */
function convertOrgDataForBayesian(org) {
    const indicators = {};

    // Convert each assessment to indicator format
    if (org.assessments) {
        for (const [indicatorId, assessment] of Object.entries(org.assessments)) {
            // Use existing soc_values/human_values if available
            let socValues = assessment.raw_data?.soc_values || [];
            let humanValues = assessment.raw_data?.human_values || [];

            // If no data but we have a bayesian_score, create synthetic data point
            // This happens with demo data from generate_demo_organizations.js
            if (socValues.length === 0 && humanValues.length === 0 && assessment.bayesian_score) {
                socValues = [{
                    timestamp: assessment.assessment_date || new Date().toISOString(),
                    value: assessment.bayesian_score,
                    confidence: assessment.confidence || 0.8,
                    source: 'assessment-data'
                }];
            }

            indicators[indicatorId] = {
                current_bayesian: assessment.bayesian_score || 0.5,
                soc_values: socValues,
                human_values: humanValues
            };
        }
    }

    const result = {
        id: org.id,
        name: org.name,
        metadata: org.metadata,
        aggregates: org.aggregates,
        indicators: indicators
    };

    console.log('✅ Converted org data:', result);
    console.log('✅ Has indicators?', !!result.indicators);
    console.log('✅ Indicators count:', Object.keys(result.indicators).length);

    return result;
}

function renderOrganizationDetail(socData) {
    // SOC data format: {org_id, org_name, indicators: {indicatorId: {value, previous_value, ...}}}
    currentOrgLanguage = 'en-US'; // Default language (TODO: get from org metadata)

    // Save current org data for WebSocket updates
    currentOrgData = socData;

    // Convert SOC format to bayesian.js format (indicators)
    const orgDataForBayesian = convertSocDataForBayesian(socData);

    // Run Bayesian analysis
    const analysis = BAYESIAN.analyzeOrganization(orgDataForBayesian);

    // Update overall risk card
    const riskPct = (analysis.overall_risk * 100).toFixed(1);
    document.getElementById('overall-risk-value').textContent = riskPct + '%';
    document.getElementById('overall-risk-bar').style.width = riskPct + '%';

    const riskClass = analysis.overall_risk > 0.66 ? 'high' :
        analysis.overall_risk > 0.33 ? 'medium' : 'low';
    document.getElementById('overall-risk-bar').className = `risk-bar-fill ${riskClass}`;

    document.getElementById('confidence-value').textContent = (analysis.confidence * 100).toFixed(0) + '%';

    const trendEl = document.getElementById('trend-value');
    trendEl.textContent = analysis.trend;
    trendEl.className = `meta-value trend ${analysis.trend}`;

    const lastUpdated = new Date(analysis.last_calculated);
    document.getElementById('last-updated').textContent = lastUpdated.toLocaleString();

    // Render category heatmap
    renderCategoryHeatmap(analysis.by_category);

    // Render security radar chart
    renderSecurityRadarChart(analysis);

    // Render prioritization table
    renderPrioritizationTable(analysis.prioritization);

    // Render convergence chart
    renderConvergenceChart(orgDataForBayesian);

    // Render indicator grid
    renderIndicatorGrid(orgDataForBayesian.indicators);

    // Restore zoom preferences
    restoreMatrixZoom();
}

function renderCategoryHeatmap(categories) {
    const container = document.getElementById('category-heatmap');
    container.innerHTML = '';

    const CATEGORY_NAMES = {
        authority: 'Authority',
        temporal: 'Temporal',
        social: 'Social',
        affective: 'Affective',
        cognitive: 'Cognitive',
        group: 'Group',
        stress: 'Stress',
        unconscious: 'Unconscious',
        ai: 'AI',
        convergent: 'Convergent'
    };

    Object.entries(categories).forEach(([name, data]) => {
        const tile = document.createElement('div');
        const risk = data.value;
        const riskPct = (risk * 100).toFixed(0);

        const riskClass = risk > 0.66 ? 'high' : risk > 0.33 ? 'medium' : 'low';

        tile.className = `category-tile ${riskClass}`;
        tile.style.cursor = 'pointer';
        tile.innerHTML = `
            <div class="category-name">${CATEGORY_NAMES[name]}</div>
            <div class="category-risk">${riskPct}%</div>
            <div class="category-conf">conf: ${(data.confidence * 100).toFixed(0)}%</div>
        `;

        // Add click handler to open category description modal
        tile.addEventListener('click', () => openCategoryModal(name));

        container.appendChild(tile);
    });
}

function renderPrioritizationTable(priorities) {
    const tbody = document.querySelector('#prioritization-table tbody');
    tbody.innerHTML = '';

    priorities.forEach((item, idx) => {
        const row = document.createElement('tr');

        const recClass = item.recommendation === 'critical' ? 'critical' :
            item.recommendation === 'review' ? 'review' : 'monitor';

        row.style.cursor = 'pointer';
        row.innerHTML = `
            <td>${idx + 1}</td>
            <td><strong>${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</strong></td>
            <td>${(item.risk * 100).toFixed(0)}%</td>
            <td>${(item.confidence * 100).toFixed(0)}%</td>
            <td><strong>${item.priority_score.toFixed(2)}</strong></td>
            <td>${item.downstream_impact.toFixed(2)}</td>
            <td><span class="recommendation ${recClass}">${item.recommendation}</span></td>
        `;

        // Add click handler to open category description modal
        row.addEventListener('click', () => openCategoryModal(item.category));

        tbody.appendChild(row);
    });
}

function renderSecurityRadarChart(analysis) {
    const canvas = document.getElementById('securityRadarChart');
    const statsDiv = document.getElementById('radarStats');

    if (!canvas || !statsDiv) return;

    const categories = analysis.by_category || {};

    const categoryNames = {
        authority: 'Authority',
        temporal: 'Temporal',
        social: 'Social',
        affective: 'Affective',
        cognitive: 'Cognitive',
        group: 'Group',
        stress: 'Stress',
        unconscious: 'Unconscious',
        ai: 'AI-Enhanced',
        convergent: 'Convergent'
    };

    // Prepare data for radar chart
    const labels = [];
    const riskData = [];
    const confidenceData = [];

    Object.entries(categoryNames).forEach(([key, name]) => {
        const catData = categories[key];
        labels.push(name);
        riskData.push(catData ? (catData.value * 100) : 0);
        confidenceData.push(catData ? (catData.confidence * 100) : 0);
    });

    // Destroy existing chart if it exists
    if (securityRadarChartInstance) {
        securityRadarChartInstance.destroy();
    }

    // Create radar chart
    const ctx = canvas.getContext('2d');
    securityRadarChartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Risk Level (%)',
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
                    label: 'Confidence (%)',
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

    const highRiskCategories = riskData.filter(r => r >= 70).length;
    const mediumRiskCategories = riskData.filter(r => r >= 40 && r < 70).length;
    const lowRiskCategories = riskData.filter(r => r > 0 && r < 40).length;

    statsDiv.innerHTML = `
        <div style="margin-bottom: 15px;">
            <div style="font-size: 12px; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Average Risk</div>
            <div style="font-size: 28px; font-weight: 700; color: ${avgRisk >= 70 ? '#ff6b6b' : avgRisk >= 40 ? '#ffd93d' : '#6bcf7f'};">${avgRisk.toFixed(1)}%</div>
        </div>
        <div style="margin-bottom: 15px;">
            <div style="font-size: 12px; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Average Confidence</div>
            <div style="font-size: 28px; font-weight: 700; color: var(--primary);">${avgConfidence.toFixed(1)}%</div>
        </div>
        <hr style="border: 0; border-top: 1px solid var(--border); margin: 20px 0;">
        <div style="font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 10px;">Risk Distribution:</div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 13px;">🔴 High Risk (≥70%)</span>
                <span style="font-weight: 700; color: #ff6b6b;">${highRiskCategories}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 13px;">🟡 Medium Risk (40-69%)</span>
                <span style="font-weight: 700; color: #ffd93d;">${mediumRiskCategories}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 13px;">🟢 Low Risk (<40%)</span>
                <span style="font-weight: 700; color: #6bcf7f;">${lowRiskCategories}</span>
            </div>
        </div>
    `;
}

function renderIndicatorGrid(indicators) {
    const container = document.getElementById('indicator-grid');
    container.innerHTML = '';

    // Always render 10x10 grid (all 100 indicators)
    for (let cat = 1; cat <= 10; cat++) {
        for (let ind = 1; ind <= 10; ind++) {
            const id = `${cat}.${ind}`;
            const indicator = indicators[id];
            const tile = document.createElement('div');

            if (indicator) {
                // Indicator exists - show with risk color and percentage
                const risk = indicator.current_bayesian;
                const riskClass = risk > 0.66 ? 'high' : risk > 0.33 ? 'medium' : 'low';
                const percentage = (risk * 100).toFixed(0);

                tile.className = `indicator-tile ${riskClass}`;
                tile.innerHTML = `
                    <div style="font-weight: 700; font-size: 13px; display: block;">${id}</div>
                    <div style="font-weight: 600; font-size: 16px; display: block; margin-top: 4px;">${percentage}%</div>
                `;
                tile.title = `Indicator ${id}: ${percentage}%`;
                tile.onclick = () => showIndicatorDetail(id, indicator);
            } else {
                // Indicator missing - show gray placeholder
                tile.className = 'indicator-tile missing';
                tile.innerHTML = `<div style="font-weight: 600; font-size: 13px;">${id}</div>`;
                tile.title = `Indicator ${id}: No data`;
                tile.style.cursor = 'default';
                tile.style.opacity = '0.4';
            }

            container.appendChild(tile);
        }
    }
}

// Category mapping for GitHub URLs
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

async function showIndicatorDetail(id, indicator) {
    const modal = document.getElementById('indicator-modal');
    document.getElementById('modal-indicator-title').textContent = `Indicator ${id} - Quick Reference`;

    const socLatest = indicator.soc_values[indicator.soc_values.length - 1];
    const humanLatest = indicator.human_values[indicator.human_values.length - 1];

    const body = document.getElementById('modal-indicator-body');

    // Show loading state
    body.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <div class="spinner" style="margin: 0 auto 20px;"></div>
            <p>Loading Quick Reference from GitHub...</p>
        </div>
    `;

    modal.style.display = 'block';
    pushModal('indicator-modal');

    try {
        // Construct GitHub URL using current organization language
        const [categoryNum, indicatorNum] = id.split('.');
        const categoryName = CATEGORY_MAP[categoryNum];
        const url = `https://raw.githubusercontent.com/xbeat/CPF/main/auditor%20field%20kit/interactive/${currentOrgLanguage}/${categoryNum}.x-${categoryName}/indicator_${id}.json`;

        console.log('Fetching Quick Reference from:', url, '(Language:', currentOrgLanguage + ')');

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Quick Reference not found`);
        }

        const fieldKit = await response.json();

        // Render Bayesian Data + Quick Reference
        body.innerHTML = `
            <div class="indicator-detail">
                <!-- Bayesian Stats -->
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="margin: 0 0 15px 0; color: var(--primary);">📊 Bayesian Analysis</h3>
                    <div class="detail-row">
                        <strong>Merged Risk Value:</strong>
                        <span style="font-size: 24px; color: ${indicator.current_bayesian > 0.66 ? 'var(--danger)' : indicator.current_bayesian > 0.33 ? 'var(--warning)' : 'var(--success)'}">
                            ${(indicator.current_bayesian * 100).toFixed(1)}%
                        </span>
                    </div>
                    <div class="detail-row">
                        <strong>SOC Assessments:</strong> ${indicator.soc_values.length} data points
                        ${socLatest ? `<br><small>Latest: ${(socLatest.value * 100).toFixed(1)}% (${new Date(socLatest.timestamp).toLocaleString()})</small>` : ''}
                    </div>
                    <div class="detail-row">
                        <strong>Human Assessments:</strong> ${indicator.human_values.length} audits
                        ${humanLatest ? `<br><small>Latest: ${(humanLatest.value * 100).toFixed(1)}% by ${humanLatest.assessor} (${new Date(humanLatest.timestamp).toLocaleString()})</small>` : ''}
                    </div>
                    <div class="detail-row">
                        <strong>Last Updated:</strong> ${new Date(indicator.last_updated).toLocaleString()}
                    </div>
                </div>

                <!-- Quick Reference -->
                <div>
                    <h3 style="margin: 0 0 15px 0; color: var(--primary);">📚 Quick Reference</h3>

                    <div style="margin-bottom: 20px;">
                        <h4 style="color: var(--secondary); margin-bottom: 10px;">Title</h4>
                        <p style="font-size: 18px; font-weight: 600;">${fieldKit.title || 'N/A'}</p>
                        <p style="color: var(--text-light);">${fieldKit.subtitle || ''}</p>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <h4 style="color: var(--secondary); margin-bottom: 10px;">Category</h4>
                        <p>${fieldKit.category || 'N/A'}</p>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <h4 style="color: var(--secondary); margin-bottom: 10px;">Description</h4>
                        <p style="line-height: 1.6;">${fieldKit.description?.short || 'No description available'}</p>
                    </div>

                    ${fieldKit.description?.context ? `
                    <div style="margin-bottom: 20px;">
                        <h4 style="color: var(--secondary); margin-bottom: 10px;">Context</h4>
                        <p style="line-height: 1.6;">${fieldKit.description.context}</p>
                    </div>
                    ` : ''}

                    ${fieldKit.description?.impact ? `
                    <div style="margin-bottom: 20px;">
                        <h4 style="color: var(--secondary); margin-bottom: 10px;">Impact</h4>
                        <p style="line-height: 1.6;">${fieldKit.description.impact}</p>
                    </div>
                    ` : ''}

                    ${fieldKit.risk_scenarios && fieldKit.risk_scenarios.length > 0 ? `
                    <div style="margin-bottom: 20px;">
                        <h4 style="color: var(--secondary); margin-bottom: 10px;">Risk Scenarios</h4>
                        ${fieldKit.risk_scenarios.slice(0, 3).map((scenario, idx) => `
                            <div style="background: #fff3cd; padding: 15px; border-left: 4px solid var(--warning); margin-bottom: 10px;">
                                <strong>${scenario.title || 'Scenario ' + (idx + 1)}</strong>
                                <p style="margin-top: 5px;">${scenario.description || ''}</p>
                                ${scenario.likelihood ? `<small>Likelihood: ${scenario.likelihood}</small>` : ''}
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}

                    <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid var(--border);">
                        <a href="${url}" target="_blank" style="color: var(--primary); text-decoration: none; font-weight: 600;">
                            📄 View Full Field Kit JSON on GitHub →
                        </a>
                    </div>
                </div>
            </div>
        `;

    } catch (error) {
        console.error('Error loading Quick Reference:', error);

        // Fallback to basic info only
        body.innerHTML = `
            <div class="indicator-detail">
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="margin: 0 0 15px 0; color: var(--primary);">📊 Bayesian Analysis</h3>
                    <div class="detail-row">
                        <strong>Merged Risk Value:</strong>
                        <span style="font-size: 24px; color: ${indicator.current_bayesian > 0.66 ? 'var(--danger)' : indicator.current_bayesian > 0.33 ? 'var(--warning)' : 'var(--success)'}">
                            ${(indicator.current_bayesian * 100).toFixed(1)}%
                        </span>
                    </div>
                    <div class="detail-row">
                        <strong>SOC Assessments:</strong> ${indicator.soc_values.length} data points
                        ${socLatest ? `<br><small>Latest: ${(socLatest.value * 100).toFixed(1)}% (${new Date(socLatest.timestamp).toLocaleString()})</small>` : ''}
                    </div>
                    <div class="detail-row">
                        <strong>Human Assessments:</strong> ${indicator.human_values.length} audits
                        ${humanLatest ? `<br><small>Latest: ${(humanLatest.value * 100).toFixed(1)}% by ${humanLatest.assessor} (${new Date(humanLatest.timestamp).toLocaleString()})</small>` : ''}
                    </div>
                    <div class="detail-row">
                        <strong>Last Updated:</strong> ${new Date(indicator.last_updated).toLocaleString()}
                    </div>
                </div>

                <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid var(--warning);">
                    <strong>⚠️ Quick Reference Not Available</strong>
                    <p style="margin-top: 10px;">Could not load Quick Reference from GitHub: ${error.message}</p>
                    <p style="margin-top: 10px;">The Field Kit JSON might not exist yet for this indicator.</p>
                </div>
            </div>
        `;
    }
}

function closeIndicatorModal() {
    document.getElementById('indicator-modal').style.display = 'none';
    popModal('indicator-modal');
}

// Close modal on outside click
window.onclick = function (event) {
    const modal = document.getElementById('indicator-modal');
    if (event.target == modal) {
        closeIndicatorModal();
    }
};

// ============================================================================
// WEBSOCKET - REAL-TIME UPDATES
// ============================================================================

let socket = null;
let currentOrgData = null;

/**
 * Setup WebSocket connection for real-time indicator updates
 */
function setupWebSocket(orgId) {
    // Disconnect existing socket
    if (socket) {
        socket.disconnect();
    }

    // Connect to Socket.io server
    socket = io();

    socket.on('connect', () => {
        socket.emit('subscribe', orgId);
    });

    socket.on('disconnect', () => {});

    socket.on('indicator_update', (data) => {
        if (data.orgId === currentOrgId) {
            updateIndicatorCell(data.indicatorId, data.assessment, data.trend);
            if (data.aggregates && currentOrgData) {
                currentOrgData.aggregates = data.aggregates;
                updateOverallRiskDisplay(data.aggregates);
            }
        }
    });

    socket.on('error', (error) => {});
}

/**
 * Update a single indicator cell in real-time
 */
function updateIndicatorCell(indicatorId, assessment, trend) {
    // Find the tile in the grid
    const tiles = document.querySelectorAll('.indicator-tile');
    let targetTile = null;

    for (const tile of tiles) {
        if (tile.textContent.includes(indicatorId)) {
            targetTile = tile;
            break;
        }
    }

    if (!targetTile) {
        console.warn(`Could not find tile for indicator ${indicatorId}`);
        return;
    }

    const risk = assessment.bayesian_score;
    const riskClass = risk > 0.66 ? 'high' : risk > 0.33 ? 'medium' : 'low';
    const percentage = Math.round(risk * 100);

    // Remove old risk classes
    targetTile.classList.remove('high', 'medium', 'low', 'missing');

    // Add new risk class
    targetTile.classList.add(riskClass);

    // Update content with percentage and trend indicator
    let trendSymbol = '';
    let trendText = '';
    if (trend === 'up') {
        trendSymbol = '<span style="color: #fca5a5; font-size: 0.8em;">↑</span>';
        trendText = ' (increasing)';
    } else if (trend === 'down') {
        trendSymbol = '<span style="color: rgba(255,255,255,0.8); font-size: 0.8em;">↓</span>';
        trendText = ' (decreasing)';
    }

    targetTile.innerHTML = `
        <div style="font-weight: 700; font-size: 13px; display: block;">${indicatorId}${trendSymbol}</div>
        <div style="font-weight: 600; font-size: 16px; display: block; margin-top: 4px;">${percentage}%</div>
    `;
    targetTile.title = `Indicator ${indicatorId}: ${percentage}%${trendText}`;
    targetTile.style.cursor = 'pointer';
    targetTile.style.opacity = '1';

    // Update click handler with new assessment data
    const indicator = {
        current_bayesian: risk,
        soc_values: assessment.raw_data?.soc_values || [],
        human_values: assessment.raw_data?.human_values || [],
        last_updated: new Date().toISOString()
    };
    targetTile.onclick = () => showIndicatorDetail(indicatorId, indicator);

    console.log(`✅ Updated cell ${indicatorId}: ${percentage}% (${riskClass}) ${trend || ''}`);
}

/**
 * Update overall risk display
 */
function updateOverallRiskDisplay(aggregates) {
    const overallRisk = aggregates.overall_risk || 0;
    const riskClass = overallRisk > 0.66 ? 'high' : overallRisk > 0.33 ? 'medium' : 'low';
    const riskLabel = overallRisk > 0.66 ? 'High Risk' : overallRisk > 0.33 ? 'Medium Risk' : 'Low Risk';

    const riskValueElement = document.getElementById('risk-value');
    const riskLabelElement = document.getElementById('risk-label');

    if (riskValueElement) {
        riskValueElement.textContent = `${Math.round(overallRisk * 100)}%`;
    }

    if (riskLabelElement) {
        riskLabelElement.textContent = riskLabel;
        riskLabelElement.className = `risk-badge ${riskClass}`;
    }
}

/**
 * Set matrix zoom level
 * @param {string} matrixType - Type of matrix ('indicator')
 * @param {number} zoomLevel - Zoom percentage (100, 50, 33)
 */
function setMatrixZoom(matrixType, zoomLevel) {
    let matrixElement;
    let buttonsContainer;

    // Get the correct matrix element based on type
    if (matrixType === 'indicator') {
        matrixElement = document.getElementById('indicator-grid');
        buttonsContainer = document.querySelector('.section .zoom-controls');
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
    const savedZoom = localStorage.getItem('matrix-zoom-indicator');
    if (savedZoom) {
        setMatrixZoom('indicator', parseInt(savedZoom));
    }
}

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
function openCategoryModal(categoryName) {
    if (!categoryDescriptions || !categoryDescriptions.categories[categoryName]) {
        console.warn('Category description not found:', categoryName);
        return;
    }

    // Determine language based on current organization's language
    const lang = getCategoryLanguage(currentOrgLanguage);
    const category = categoryDescriptions.categories[categoryName][lang];

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
 * Get language code from organization language setting
 * Supports: en, it, es, fr, de (with fallback to en)
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
 * Get localized labels for category modal UI elements
 */
function getCategoryLabels(lang) {
    const labels = {
        en: {
            examples: '📌 Examples',
            mitigation: '🛡️ Mitigation'
        },
        it: {
            examples: '📌 Esempi',
            mitigation: '🛡️ Mitigazione'
        },
        es: {
            examples: '📌 Ejemplos',
            mitigation: '🛡️ Mitigación'
        },
        fr: {
            examples: '📌 Exemples',
            mitigation: '🛡️ Atténuation'
        },
        de: {
            examples: '📌 Beispiele',
            mitigation: '🛡️ Abhilfe'
        }
    };

    return labels[lang] || labels.en;
}

/**
 * Close category description modal
 */
function closeCategoryModal() {
    const modal = document.getElementById('category-modal');
    modal.style.display = 'none';
    window.popModal();
}

// ============================================================================
// CREATE ORGANIZATION FUNCTIONS
// ============================================================================

/**
 * Open the create organization modal
 */
function openCreateOrgModal() {
    document.getElementById('org-modal-title').textContent = 'Create New Organization';
    document.getElementById('org-form').reset();
    document.getElementById('org-id-input').disabled = false;
    document.getElementById('save-org-btn').textContent = 'Create Organization';
    document.getElementById('org-modal').style.display = 'flex';
    pushModal('org-modal');
}

/**
 * Close the organization modal
 */
function closeOrgModal() {
    document.getElementById('org-modal').style.display = 'none';
    popModal('org-modal');
}

/**
 * Save new organization
 */
async function saveOrganization(event) {
    event.preventDefault();

    const orgId = document.getElementById('org-id-input').value.trim();
    const orgName = document.getElementById('org-name-input').value.trim();
    const industry = document.getElementById('org-industry-input').value;
    const size = document.getElementById('org-size-input').value;
    const country = document.getElementById('org-country-input').value.toUpperCase();
    const language = document.getElementById('org-language-input').value;
    const sedeSociale = document.getElementById('org-sede-sociale-input').value.trim();
    const partitaIva = document.getElementById('org-partita-iva-input').value.trim();
    const notes = document.getElementById('org-notes-input').value.trim();

    // Validate org ID format
    if (!/^org-[-a-z0-9]+$/.test(orgId)) {
        showAlert('Organization ID must follow format: org-yourname-001 (lowercase, hyphens allowed)', 'warning');
        return;
    }

    const saveBtn = document.getElementById('save-org-btn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Creating...';

    try {
        const response = await fetch('/api/organizations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: orgId,
                name: orgName,
                industry: industry,
                size: size,
                country: country,
                language: language,
                sede_sociale: sedeSociale,
                partita_iva: partitaIva,
                notes: notes
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || `HTTP ${response.status}`);
        }

        const newOrg = await response.json();
        console.log('Created organization:', newOrg);

        // Refresh organizations list
        await loadOrganizationsData();

        closeOrgModal();
        showAlert(`Organization "${orgName}" created successfully!`, 'success');

    } catch (error) {
        console.error('Error creating organization:', error);
        showAlert(`Failed to create organization: ${error.message}`, 'error');
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Create Organization';
    }
}

// ===== EXPORT FUNCTIONS =====

/**
 * Export current organization data to XLSX format
 */
async function exportCurrentOrgXLSX() {
    if (!currentOrgId) {
        showAlert('Please select an organization first', 'warning');
        return;
    }

    try {
        const orgId = currentOrgId;
        const url = `/api/organizations/${orgId}/export/xlsx?user=SOC Dashboard User`;

        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        // Create download link
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;

        // Get org name for filename
        const org = organizationsData?.organizations?.find(o => o.id === orgId);
        const orgName = org ? org.name.replace(/[^a-zA-Z0-9]/g, '_') : orgId;
        const date = new Date().toISOString().split('T')[0];
        link.download = `CPF_SOC_${orgName}_${date}.xlsx`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);

        console.log('XLSX export successful');
    } catch (error) {
        console.error('Error exporting XLSX:', error);
        showAlert(`Failed to export XLSX: ${error.message}`, 'error');
    }
}

/**
 * Export current organization data to PDF format
 */
async function exportCurrentOrgPDF() {
    if (!currentOrgId) {
        showAlert('Please select an organization first', 'warning');
        return;
    }

    try {
        const orgId = currentOrgId;
        const url = `/api/organizations/${orgId}/export/pdf?user=SOC Dashboard User`;

        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        // Create download link
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;

        // Get org name for filename
        const org = organizationsData?.organizations?.find(o => o.id === orgId);
        const orgName = org ? org.name.replace(/[^a-zA-Z0-9]/g, '_') : orgId;
        const date = new Date().toISOString().split('T')[0];
        link.download = `CPF_SOC_${orgName}_${date}.pdf`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);

        console.log('PDF export successful');
    } catch (error) {
        console.error('Error exporting PDF:', error);
        showAlert(`Failed to export PDF: ${error.message}`, 'error');
    }
}

// ===== TRASH & RESTORE FUNCTIONS =====

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

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
    document.getElementById('trashModal').style.display = 'flex';

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
                                <button class="btn btn-primary btn-small" onclick="restoreFromTrash('${escapeHtml(org.id)}')" style="padding: 6px 12px; font-size: 12px;">
                                    Restore
                                </button>
                                <button class="btn btn-danger btn-small" onclick="permanentDeleteOrg('${escapeHtml(org.id)}', '${escapeHtml(org.name)}')" style="padding: 6px 12px; font-size: 12px;">
                                    Delete Forever
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
    document.getElementById('trashModal').style.display = 'none';
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
            showAlert('Organization restored successfully!', 'success');
            closeTrashModal();
            await loadOrganizationsData();
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
    if (!confirm(`PERMANENTLY DELETE "${orgName}"?\n\nThis action CANNOT be undone!\n\nAll assessment data will be lost forever.`)) return;

    // Double confirmation
    if (!confirm(`Are you absolutely sure? This will permanently delete "${orgName}".`)) return;

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

// Load trash count on page load
document.addEventListener('DOMContentLoaded', function() {
    loadTrashCount();
});