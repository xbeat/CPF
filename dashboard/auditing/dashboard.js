// ===== GLOBAL STATE =====
let organizations = [];
let selectedOrgId = null;
let selectedOrgData = null;
let editingOrgId = null;
let deletingOrgId = null;
let selectedIndicatorId = null;
let categoryFilter = null;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    loadAllData();
});

// ===== DATA LOADING =====
async function loadAllData() {
    try {
        const response = await fetch('/api/organizations');
        const data = await response.json();

        organizations = data.organizations || [];
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

// ===== RENDERING =====
function renderOrganizations() {
    const grid = document.getElementById('organizationsGrid');
    const countEl = document.getElementById('orgCount');

    countEl.textContent = `${organizations.length} organization${organizations.length !== 1 ? 's' : ''}`;

    if (organizations.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state-icon">📊</div>
                <h3 class="empty-state-title">No Organizations Yet</h3>
                <p class="empty-state-text">Create your first organization to start tracking assessments</p>
                <button class="btn btn-primary" onclick="openCreateOrgModal()">➕ Create Organization</button>
            </div>
        `;
        return;
    }

    grid.innerHTML = organizations.map(org => {
        const riskClass = org.stats.overall_risk < 0.3 ? 'risk-low' :
                            org.stats.overall_risk < 0.7 ? 'risk-medium' : 'risk-high';
        const riskLabel = org.stats.overall_risk < 0.3 ? '🟢 Low' :
                            org.stats.overall_risk < 0.7 ? '🟡 Medium' : '🔴 High';

        return `
            <div class="org-card ${selectedOrgId === org.id ? 'selected' : ''}" onclick="selectOrganization('${org.id}')">
                <div class="org-card-header">
                    <div>
                        <h3 class="org-card-title">${escapeHtml(org.name)}</h3>
                        <div class="org-card-meta">
                            ${org.industry} • ${capitalizeFirst(org.size)} • ${org.country}
                        </div>
                    </div>
                    <div class="org-card-actions" onclick="event.stopPropagation()">
                        <button class="icon-btn" onclick="editOrganization('${org.id}')" title="Edit">✏️</button>
                        <button class="icon-btn" onclick="deleteOrganization('${org.id}', '${escapeHtml(org.name)}')" title="Delete">🗑️</button>
                    </div>
                </div>
                <div class="org-card-stats">
                    <div class="stat-row">
                        <span class="stat-label">Industry</span>
                        <span class="stat-value">${org.industry}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Assessments</span>
                        <span class="stat-value">${org.stats.total_assessments}/100 (${org.stats.completion_percentage}%)</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Risk</span>
                        <span class="stat-value ${riskClass}">${riskLabel}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function selectOrganization(orgId) {
    selectedOrgId = orgId;
    renderOrganizations();
    loadOrganizationDetails(orgId);
    document.getElementById('assessmentSection').classList.remove('hidden');
    // Scroll to assessment section
    document.getElementById('assessmentSection').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderAssessmentDetails() {
    if (!selectedOrgData) return;

    const org = selectedOrgData;

    // Update titles
    document.getElementById('progressTitle').textContent = `${org.name} - Assessment Progress Matrix`;
    document.getElementById('riskTitle').textContent = `${org.name} - Risk Analysis by Category`;

    // Render summaries
    renderProgressSummary(org);
    renderRiskSummary(org);

    // Render matrix and heatmap
    renderProgressMatrix(org);
    renderRiskHeatmap(org);
    renderPrioritizationTable(org);
}

function renderProgressSummary(org) {
    const el = document.getElementById('progressSummary');
    const completion = org.aggregates.completion.percentage;
    const assessed = org.aggregates.completion.assessed_indicators;

    el.innerHTML = `
        <div style="display: flex; gap: 30px; align-items: center; margin-top: 10px;">
            <div>
                <span style="font-size: 14px; color: var(--text-light);">Completion:</span>
                <span style="font-size: 24px; font-weight: 700; color: var(--primary); margin-left: 10px;">${completion}%</span>
            </div>
            <div>
                <span style="font-size: 14px; color: var(--text-light);">Assessed:</span>
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
    const risk = org.aggregates.overall_risk;
    const riskPercent = (risk * 100).toFixed(1);
    const riskClass = risk < 0.3 ? 'risk-low' : risk < 0.7 ? 'risk-medium' : 'risk-high';
    const riskLabel = risk < 0.3 ? '🟢 Low Risk' : risk < 0.7 ? '🟡 Medium Risk' : '🔴 High Risk';

    el.innerHTML = `
        <div style="display: flex; gap: 30px; align-items: center; margin-top: 10px;">
            <div>
                <span style="font-size: 14px; color: var(--text-light);">Overall Risk:</span>
                <span style="font-size: 24px; font-weight: 700; margin-left: 10px;" class="${riskClass}">${riskLabel}</span>
            </div>
            <div>
                <span style="font-size: 14px; color: var(--text-light);">Risk Score:</span>
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
    const assessments = org.assessments || {};

    let html = '';

    // Show filter info if active
    if (categoryFilter) {
        const categoryNames = {
            '1': 'Authority-Based', '2': 'Temporal-Based', '3': 'Social-Based', '4': 'Affective-Based',
            '5': 'Cognitive-Based', '6': 'Group-Based', '7': 'Stress-Based', '8': 'Unconscious-Based',
            '9': 'AI-Enhanced', '10': 'Convergent'
        };
        html += `
            <div style="background: var(--primary); color: white; padding: 10px; border-radius: 8px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
                <div>🔍 Filter active: Category ${categoryFilter} - ${categoryNames[categoryFilter]}</div>
                <button onclick="clearCategoryFilter()" class="btn btn-small" style="background: white; color: var(--primary);">Clear Filter</button>
            </div>
        `;
    }

    // Header row
    html += '<div class="matrix-cell header" style="font-size: 11px;">CAT</div>';
    for (let i = 1; i <= 10; i++) {
        html += `<div class="matrix-cell header">${i}</div>`;
    }

    // Data rows
    for (let cat = 1; cat <= 10; cat++) {
        const catKey = cat.toString();
        const isFiltered = categoryFilter && categoryFilter !== catKey;
        const rowStyle = isFiltered ? 'opacity: 0.3;' : '';

        html += `<div class="matrix-cell header" style="${rowStyle}">${cat}</div>`;

        for (let ind = 1; ind <= 10; ind++) {
            const indicatorId = `${cat}.${ind}`;
            const assessment = assessments[indicatorId];
            const completed = !!assessment;

            let cellClass = '';
            let riskLevel = 'Not assessed';

            if (completed) {
                const score = assessment.bayesian_score;
                if (score < 0.33) {
                    cellClass = 'risk-low';
                    riskLevel = 'Low Risk';
                } else if (score < 0.66) {
                    cellClass = 'risk-medium';
                    riskLevel = 'Medium Risk';
                } else {
                    cellClass = 'risk-high';
                    riskLevel = 'High Risk';
                }
            }

            const title = completed ? `${indicatorId} - ${riskLevel} (${(assessment.bayesian_score * 100).toFixed(1)}%)` : `${indicatorId} - Not assessed`;
            const cellStyle = isFiltered ? 'opacity: 0.3; cursor: default;' : '';

            const onclickHandler = isFiltered ? '' : `openIndicatorDetail('${indicatorId}', '${org.id}')`;
            html += `
                <div class="matrix-cell indicator ${cellClass}"
                        title="${title}"
                        style="${cellStyle}"
                        onclick="${onclickHandler}">
                    ${ind}
                </div>
            `;
        }
    }

    matrix.innerHTML = html;
}

function renderRiskHeatmap(org) {
    const heatmap = document.getElementById('riskHeatmap');
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

    let html = '';

    for (let cat = 1; cat <= 10; cat++) {
        const catKey = cat.toString();
        const catData = categories[catKey];

        if (catData) {
            const riskPercent = (catData.avg_score * 100).toFixed(1);
            const riskClass = catData.avg_score < 0.3 ? 'risk-low' :
                                catData.avg_score < 0.7 ? 'risk-medium' : 'risk-high';

            html += `
                <div class="category-card" onclick="filterByCategory('${catKey}')">
                    <div class="category-title">${cat}. ${categoryNames[catKey]}</div>
                    <div class="category-stats">
                        <div class="category-risk ${riskClass}">${riskPercent}%</div>
                        <div class="category-completion">${catData.completion_percentage}% complete</div>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${catData.completion_percentage}%"></div>
                    </div>
                    <div style="font-size: 12px; color: var(--text-light); margin-top: 8px;">
                        ${catData.total_assessments}/10 assessed • Conf: ${(catData.avg_confidence * 100).toFixed(0)}%
                    </div>
                </div>
            `;
        } else {
            html += `
                <div class="category-card" style="opacity: 0.5;">
                    <div class="category-title">${cat}. ${categoryNames[catKey]}</div>
                    <div class="category-stats">
                        <div class="category-risk">--</div>
                        <div class="category-completion">No data</div>
                    </div>
                    <div style="font-size: 12px; color: var(--text-light); margin-top: 8px;">
                        No assessments yet
                    </div>
                </div>
            `;
        }
    }

    heatmap.innerHTML = html;
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
            <tr>
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

async function openIndicatorDetail(indicatorId, orgId) {
    console.log('🎯 openIndicatorDetail called with:', { indicatorId, orgId });

    selectedIndicatorId = indicatorId;
    const assessment = selectedOrgData.assessments[indicatorId];

    console.log('📊 Assessment exists?', !!assessment);

    // ALWAYS open integrated client (either new or edit mode)
    await openIntegratedClient(indicatorId, orgId, assessment);
}

async function showAssessmentDetails(indicatorId, assessment) {
    document.getElementById('indicatorModalTitle').textContent = `Indicator ${indicatorId} - Assessment Details`;
    document.getElementById('indicatorModal').classList.add('active');

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
        const language = selectedOrgData.metadata.language || 'en-US';
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

                ${fieldKit && fieldKit.risk_scenarios && fieldKit.risk_scenarios.length > 0 ? `
                <!-- Risk Scenarios -->
                <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid var(--warning);">
                    <h4 style="margin: 0 0 10px 0; color: var(--warning);">⚠️ Risk Scenarios</h4>
                    ${fieldKit.risk_scenarios.slice(0, 3).map((scenario, idx) => `
                        <div style="background: white; padding: 12px; border-radius: 6px; margin-bottom: 10px;">
                            <strong>${scenario.title || 'Scenario ' + (idx + 1)}</strong>
                            <p style="margin: 5px 0 0 0;">${scenario.description || ''}</p>
                            ${scenario.likelihood ? `<small style="color: var(--text-light);">Likelihood: ${scenario.likelihood}</small>` : ''}
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
                        ${assessment.raw_data.client_conversation.red_flags.map(flag => `<li>${flag}</li>`).join('')}
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

    // Add fullscreen class for client modal
    const modalContent = document.querySelector('#indicatorModal .modal-content');
    modalContent.classList.add('fullscreen-client');

    const content = document.getElementById('indicatorModalContent');

    // Get organization data
    const language = selectedOrgData.metadata.language || 'en-US';

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
    const language = selectedOrgData.metadata.language || 'en-US';
    const assessment = selectedOrgData.assessments[indicatorId];

    console.log('🎨 openIntegratedVersion called with:', { indicatorId, orgId, assessment: !!assessment });

    // Close current modal
    closeIndicatorModal();

    // Reopen with integrated form
    document.getElementById('indicatorModalTitle').textContent = `Indicator ${indicatorId} - ${assessment ? 'Edit' : 'New'} Assessment (INTEGRATED)`;
    document.getElementById('indicatorModal').classList.add('active');

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
                        <button class="btn btn-info" onclick="window.CPFClient.showQuickReference()">📚 Quick Reference</button>
                        <button class="btn btn-success" onclick="window.CPFClient.showIndicatorDetails()">📄 Indicator Details</button>
                        <button class="btn btn-info" onclick="window.CPFClient.toggleDetailedAnalysis()">📊 Show/Hide Analysis</button>
                        <button class="btn btn-warning" onclick="window.CPFClient.calculateIndicatorScore()">🧮 Calculate Score</button>
                        <button class="btn btn-warning" onclick="window.CPFClient.validateCurrentJSON()">🔍 Validate</button>
                        <button class="btn btn-light" onclick="document.getElementById('file-input-integrated').click()">📂 Import JSON</button>
                        <input type="file" id="file-input-integrated" accept=".json" onchange="window.CPFClient.importJSON(event)" style="display: none;">
                        <button class="btn btn-danger" onclick="if(confirm('Reset all data?')) window.CPFClient.resetAll()" title="Clear all data and reset">🗑️ Reset</button>
                        ${isEditMode ? `<button class="btn btn-primary" onclick="viewAssessmentDetailsFromEdit('${indicatorId}')">📋 View Details</button>` : ''}
                        ${isEditMode ? `<button class="btn btn-danger" onclick="deleteAssessmentFromEdit('${indicatorId}')">🗑️ Delete Assessment</button>` : ''}
                    </div>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
                        <span id="auto-save-status" style="color: #4CAF50; font-size: 14px; display: none;">✓ Auto-saved</span>
                        <button class="btn btn-secondary" onclick="window.CPFClient.saveData()">💾 Save Local</button>
                        <button class="btn btn-success" onclick="window.CPFClient.exportData()">💾 Export Data</button>
                        <button class="btn btn-primary" onclick="window.CPFClient.generateReport()">📊 Report</button>
                        <button class="btn btn-success" onclick="window.CPFClient.saveToAPI()" id="save-to-dashboard-btn">💾 Save Assessment</button>
                        <button class="btn btn-secondary" onclick="closeIndicatorModal()">✖️ Close</button>
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
            <div id="reference-modal" class="cpf-client modal" style="display: none;" onclick="if(event.target.id==='reference-modal') window.CPFClient.closeQuickReference()">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>📚 CPF Indicators Quick Reference</h2>
                        <button class="modal-close" onclick="window.CPFClient.closeQuickReference()">✕</button>
                    </div>
                    <div class="modal-body" id="reference-content">
                        <p style="text-align: center; color: #7f8c8d; padding: 40px;">Loading reference guide...</p>
                    </div>
                </div>
            </div>

            <!-- Indicator Details Modal -->
            <div id="indicator-details-modal" class="cpf-client modal" style="display: none;" onclick="if(event.target.id==='indicator-details-modal') window.CPFClient.closeIndicatorDetails()">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 id="indicator-details-title">📄 Indicator Details</h2>
                        <button class="modal-close" onclick="window.CPFClient.closeIndicatorDetails()">✕</button>
                    </div>
                    <div class="modal-body" id="indicator-details-content">
                        <p style="text-align: center; color: #7f8c8d; padding: 40px;">No indicator loaded</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    content.innerHTML = html;

    // Wait for DOM to be ready, then initialize client
    setTimeout(() => {
        if (typeof window.CPFClient !== 'undefined' && typeof window.CPFClient.renderFieldKit === 'function') {
            // Initialize client's global variables with our data
            if (window.CPFClient.organizationContext) {
                window.CPFClient.organizationContext.orgId = orgId;
                window.CPFClient.organizationContext.orgName = selectedOrgData?.name || 'Unknown';
                window.CPFClient.organizationContext.language = selectedOrgData?.metadata?.language || 'en-US';
            }

            if (window.CPFClient.currentData) {
                window.CPFClient.currentData.fieldKit = indicatorData;
                window.CPFClient.currentData.metadata = {
                    date: new Date().toISOString().split('T')[0],
                    auditor: selectedOrgData?.metadata?.auditor || '',
                    client: selectedOrgData?.name || '',
                    status: 'in-progress'
                };
                window.CPFClient.currentData.responses = {};

                // If editing, populate with existing data
                if (existingAssessment && existingAssessment.raw_data) {
                    if (existingAssessment.raw_data.metadata) {
                        window.CPFClient.currentData.metadata = existingAssessment.raw_data.metadata;
                    }
                    if (existingAssessment.raw_data.client_conversation) {
                        window.CPFClient.currentData.responses = existingAssessment.raw_data.client_conversation.responses || {};
                    }
                }
            }

            console.log('🎨 Calling CPFClient.renderFieldKit with data:', indicatorData);
            console.log('📊 Organization context:', window.CPFClient.organizationContext);
            console.log('📝 Current data:', window.CPFClient.currentData);

            // Render the field kit
            window.CPFClient.renderFieldKit(indicatorData);

            // After rendering, close modal on successful save
            // Override saveToAPI to close modal after save
            const originalSaveToAPI = window.CPFClient.saveToAPI;
            window.CPFClient.saveToAPI = async function() {
                try {
                    await originalSaveToAPI();
                    showAlert('Assessment saved successfully!', 'success');

                    // Reload organization data and close modal
                    setTimeout(async () => {
                        await loadOrganizationDetails(orgId);
                        closeIndicatorModal();
                    }, 1000);
                } catch (error) {
                    console.error('Error saving assessment:', error);
                    showAlert('Failed to save assessment: ' + error.message, 'error');
                }
            };

        } else {
            console.error('❌ CPFClient not found! Client script may not be loaded yet.');
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

    const assessment = selectedOrgData.assessments[indicatorId];
    if (!assessment) {
        showAlert('Assessment not found', 'error');
        return;
    }

    // Open details in SEPARATE modal (assessmentDetailsModal)
    document.getElementById('assessmentDetailsTitle').textContent = `Indicator ${indicatorId} - Assessment Details`;
    document.getElementById('assessmentDetailsModal').classList.add('active');

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
        const language = selectedOrgData.metadata.language || 'en-US';
        const url = `/auditor-field-kit/interactive/${language}/${categoryNum}.x-${categoryName}/indicator_${indicatorId}.json`;

        const response = await fetch(url);
        let fieldKit = null;
        if (response.ok) {
            fieldKit = await response.json();
        }

        // Render full details
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
            </div>
        `;
    } catch (error) {
        console.error('Error loading Field Kit:', error);
        content.innerHTML = `
            <div style="padding: 20px;">
                <p>⚠️ Could not load full Field Kit details</p>
                <p style="font-size: 14px; color: var(--text-light);">Showing basic assessment information only.</p>
            </div>
        `;
    }
}

// Close assessment details modal (returns to edit form which is still open)
function closeAssessmentDetailsModal() {
    document.getElementById('assessmentDetailsModal').classList.remove('active');
}

// Delete assessment from edit form
async function deleteAssessmentFromEdit(indicatorId) {
    if (!selectedOrgId) return;

    if (!confirm(`Are you sure you want to delete the assessment for indicator ${indicatorId}?`)) {
        return;
    }

    try {
        const response = await fetch(`/api/organizations/${selectedOrgId}/assessments/${indicatorId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            showAlert('Assessment deleted successfully', 'success');
            closeIndicatorModal();
            await loadOrganizationDetails(selectedOrgId);
        } else {
            showAlert('Failed to delete assessment: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Error deleting assessment:', error);
        showAlert('Failed to delete assessment: ' + error.message, 'error');
    }
}

async function deleteAssessmentFromModal() {
    if (!selectedIndicatorId || !selectedOrgId) return;

    if (!confirm(`Are you sure you want to delete the assessment for indicator ${selectedIndicatorId}?`)) {
        return;
    }

    try {
        const response = await fetch(`/api/organizations/${selectedOrgId}/assessments/${selectedIndicatorId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            showAlert('Assessment deleted successfully', 'success');
            closeIndicatorModal();
            await loadOrganizationDetails(selectedOrgId);
        } else {
            showAlert('Failed to delete assessment: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Error deleting assessment:', error);
        showAlert('Failed to delete assessment: ' + error.message, 'error');
    }
}

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
    document.getElementById('saveOrgBtn').textContent = 'Create Organization';
    document.getElementById('orgForm').reset();
    document.getElementById('orgId').disabled = false;
    document.getElementById('fetchIndicators').parentElement.parentElement.classList.remove('hidden');
    document.getElementById('orgModal').classList.add('active');
}

function editOrganization(orgId) {
    editingOrgId = orgId;
    const org = organizations.find(o => o.id === orgId);
    if (!org) return;

    document.getElementById('orgModalTitle').textContent = 'Edit Organization';
    document.getElementById('saveOrgBtn').textContent = 'Save Changes';
    document.getElementById('orgId').value = org.id;
    document.getElementById('orgId').disabled = true;
    document.getElementById('orgName').value = org.name;
    document.getElementById('orgIndustry').value = org.industry;
    document.getElementById('orgSize').value = org.size;
    document.getElementById('orgCountry').value = org.country;
    document.getElementById('orgLanguage').value = org.language;
    // Note: we'd need to fetch full org data to get notes
    document.getElementById('fetchIndicators').parentElement.parentElement.classList.add('hidden');
    document.getElementById('orgModal').classList.add('active');
}

async function saveOrganization(event) {
    event.preventDefault();

    const orgId = document.getElementById('orgId').value.trim();
    const orgName = document.getElementById('orgName').value.trim();
    const orgIndustry = document.getElementById('orgIndustry').value;
    const orgSize = document.getElementById('orgSize').value;
    const orgCountry = document.getElementById('orgCountry').value.trim().toUpperCase();
    const orgLanguage = document.getElementById('orgLanguage').value;
    const orgNotes = document.getElementById('orgNotes').value.trim();
    const fetchIndicators = document.getElementById('fetchIndicators').checked;

    const orgData = {
        id: orgId,
        name: orgName,
        industry: orgIndustry,
        size: orgSize,
        country: orgCountry,
        language: orgLanguage,
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
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    deletingOrgId = null;
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
    } else if (tabName === 'compile') {
        document.getElementById('compileTab').classList.add('active');
    }
}

// ===== UTILITIES =====
function showAlert(message, type = 'info') {
    const container = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    container.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 5000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

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

    // Prepare assessment data for API
    const assessmentData = {
        indicator_id: currentIndicatorId,
        title: currentIndicatorData.title || `Indicator ${currentIndicatorId}`,
        category: currentIndicatorData.category || CATEGORY_MAP[currentIndicatorId.split('.')[0]],
        bayesian_score: scoreResult.score,
        confidence: scoreResult.confidence,
        maturity_level: getMaturityLevel(scoreResult.score),
        assessor: document.getElementById('compile-assessor').value || 'Anonymous',
        assessment_date: document.getElementById('compile-date').value || new Date().toISOString().split('T')[0],
        raw_data: {
            responses: responses,
            field_kit_version: '2.0',
            source: 'dashboard_auditing'
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
            renderOrganizationDetails(selectedOrganization);
        }, 1000);

        // Reset form
        resetCompileForm();

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

// Reset compile form
function resetCompileForm() {
    currentIndicatorData = null;
    currentIndicatorId = null;

    document.getElementById('compileFormContainer').style.display = 'none';
    document.getElementById('compileEmptyState').style.display = 'block';
    document.getElementById('scoreDisplay').style.display = 'none';

    document.getElementById('compileFormContent').innerHTML = '';
    document.getElementById('compile-assessor').value = '';
    document.getElementById('compile-date').value = '';
    document.getElementById('compile-confidence').value = '0.7';

    showAlert('Form reset', 'info');
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