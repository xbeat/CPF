// Global state
let organizationsData = null;
let currentOrgId = null;
let currentOrgLanguage = 'en-US'; // Default language
let sortDirection = 'desc'; // 'asc' or 'desc'
let editingOrgId = null;
let deletingOrgId = null;
let modalStack = []; // Track open modals in order

// Open sidebar - idempotent (do nothing if already open)
function openSidebar() {
    const sidebar = document.getElementById('sidebar');
    const main = document.getElementById('dashboardMain');
    const openBtn = document.getElementById('sidebarOpenBtn');

    // If already open, do nothing
    if (!sidebar.classList.contains('sidebar-hidden')) {
        return;
    }

    // Remove hidden class and collapsed state
    sidebar.classList.remove('sidebar-hidden');
    main.classList.remove('sidebar-collapsed');

    // Hide open button
    if (openBtn) {
        openBtn.style.display = 'none';
    }
}

// Close sidebar
function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const main = document.getElementById('dashboardMain');
    const openBtn = document.getElementById('sidebarOpenBtn');

    // Hide sidebar and mark main as collapsed
    sidebar.classList.add('sidebar-hidden');
    main.classList.add('sidebar-collapsed');

    // Show open button
    if (openBtn) {
        openBtn.style.display = 'inline-flex';
    }
}

// Load data on page load
window.addEventListener('DOMContentLoaded', async () => {
    await loadOrganizationsData();
});

// Modal stack management
function pushModal(modalId) {
    if (!modalStack.includes(modalId)) {
        modalStack.push(modalId);
    }
}

function popModal(modalId) {
    const index = modalStack.indexOf(modalId);
    if (index > -1) {
        modalStack.splice(index, 1);
    }
}

// Close modals on ESC key - always close the most recently opened modal
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modalStack.length > 0) {
        // Get the most recently opened modal (last in stack)
        const topModal = modalStack[modalStack.length - 1];

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
        document.getElementById('edit-org-notes').value = org.metadata.notes || '';

        // Show modal
        document.getElementById('edit-org-modal').style.display = 'block';
        pushModal('edit-org-modal');
    } catch (error) {
        console.error('Error loading organization:', error);
        alert('Failed to load organization data: ' + error.message);
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
        metadata: {
            industry: document.getElementById('edit-org-industry').value,
            size: document.getElementById('edit-org-size').value,
            country: document.getElementById('edit-org-country').value.toUpperCase(),
            language: document.getElementById('edit-org-language').value,
            notes: document.getElementById('edit-org-notes').value
        }
    };

    try {
        const response = await fetch(`/api/organizations/${editingOrgId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            alert('✅ Organization updated successfully!');
            closeEditOrgModal();
            await loadOrganizationsData();

            // If editing currently selected org, reload it
            if (currentOrgId === editingOrgId) {
                await loadAndRenderOrganization(editingOrgId);
            }
        } else {
            alert('Failed to update organization: ' + result.error);
        }
    } catch (error) {
        console.error('Error updating organization:', error);
        alert('Failed to update organization: ' + error.message);
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
            alert('✅ Organization deleted successfully!');
            closeDeleteOrgModal();

            // If deleting currently selected org, clear selection
            if (currentOrgId === deletingOrgId) {
                currentOrgId = null;
                document.getElementById('org-detail').style.display = 'none';
                document.getElementById('empty-state').style.display = 'block';
            }

            await loadOrganizationsData();
        } else {
            alert('Failed to delete organization: ' + result.error);
        }
    } catch (error) {
        console.error('Error deleting organization:', error);
        alert('Failed to delete organization: ' + error.message);
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

    // Fetch and render organization analysis
    await loadAndRenderOrganization(orgId);
}

async function loadAndRenderOrganization(orgId) {
    try {
        // Fetch complete organization data from API
        const response = await fetch(`/api/organizations/${orgId}`);
        if (!response.ok) {
            throw new Error(`Failed to load organization: ${response.status}`);
        }
        const result = await response.json();
        const org = result.data;

        renderOrganizationDetail(org);
    } catch (error) {
        console.error('Error loading organization:', error);
        document.getElementById('org-detail').innerHTML = `
            <div class="error-message">
                <h3>⚠️ Error Loading Organization</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

/**
 * Convert API v2.0 organization format to bayesian.js expected format
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

function renderOrganizationDetail(org) {
    // Save organization language for indicator detail modal
    // Full org object has language in metadata, not at root level
    currentOrgLanguage = org.metadata?.language || 'en-US';

    // Convert API v2.0 format (assessments) to bayesian.js format (indicators)
    const orgDataForBayesian = convertOrgDataForBayesian(org);

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

    // Render prioritization table
    renderPrioritizationTable(analysis.prioritization);

    // Render convergence chart
    renderConvergenceChart(orgDataForBayesian);

    // Render indicator grid
    renderIndicatorGrid(orgDataForBayesian.indicators);
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
        tile.innerHTML = `
            <div class="category-name">${CATEGORY_NAMES[name]}</div>
            <div class="category-risk">${riskPct}%</div>
            <div class="category-conf">conf: ${(data.confidence * 100).toFixed(0)}%</div>
        `;

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

        row.innerHTML = `
            <td>${idx + 1}</td>
            <td><strong>${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</strong></td>
            <td>${(item.risk * 100).toFixed(0)}%</td>
            <td>${(item.confidence * 100).toFixed(0)}%</td>
            <td><strong>${item.priority_score.toFixed(2)}</strong></td>
            <td>${item.downstream_impact.toFixed(2)}</td>
            <td><span class="recommendation ${recClass}">${item.recommendation}</span></td>
        `;

        tbody.appendChild(row);
    });
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
                // Indicator exists - show with risk color
                const risk = indicator.current_bayesian;
                const riskClass = risk > 0.66 ? 'high' : risk > 0.33 ? 'medium' : 'low';

                tile.className = `indicator-tile ${riskClass}`;
                tile.textContent = id;
                tile.title = `Indicator ${id}: ${(risk * 100).toFixed(0)}%`;
                tile.onclick = () => showIndicatorDetail(id, indicator);
            } else {
                // Indicator missing - show gray placeholder
                tile.className = 'indicator-tile missing';
                tile.textContent = id;
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