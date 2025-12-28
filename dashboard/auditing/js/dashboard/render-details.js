import { getSelectedOrgData, getCategoryFilter } from './state.js';
import { renderSecurityRadarChart } from './charts.js';
import { renderMaturityTab } from './maturity.js';
import { renderInterventionTab } from './intervention.js';
import { renderPrioritizationTable } from './render-details-table.js';

export function renderAssessmentDetails() {
    const selectedOrgData = getSelectedOrgData();
    if (!selectedOrgData) return;
    const org = selectedOrgData;

    // Titles
    const pTitle = document.getElementById('progressTitle');
    const rTitle = document.getElementById('riskTitle');
    if(pTitle) pTitle.textContent = `${org.name} - Assessment Progress Matrix`;
    if(rTitle) rTitle.textContent = `${org.name} - Risk Analysis by Category`;

    // Render Components
    renderProgressSummary(org);
    renderRiskSummary(org);
    renderProgressMatrix(org);
    renderRiskHeatmap(org);
    renderSecurityRadarChart(org);
    renderPrioritizationTable(org);

    // Refresh Maturity Tab if active
    const matTab = document.querySelector('.tab[data-tab="maturity"]');
    if (matTab && matTab.classList.contains('active')) {
        renderMaturityTab();
    }

    // Refresh Intervention Tab if active
    const intTab = document.querySelector('.tab[data-tab="intervention"]');
    if (intTab && intTab.classList.contains('active')) {
        renderInterventionTab();
    }

    // Restore Zoom
    restoreMatrixZoom();
}

function renderProgressSummary(org) {
    const el = document.getElementById('progressSummary');
    if (!el) return;
    const completion = org.aggregates?.completion?.percentage ?? 0;
    const assessed = org.aggregates?.completion?.assessed_indicators ?? 0;

    el.innerHTML = `
        <div style="display: flex; gap: 30px; align-items: center; margin-top: 10px;">
            <div><span style="font-size:14px;color:var(--text-light);">Completion</span><span style="font-size:24px;font-weight:700;color:var(--primary);margin-left:10px;">${completion}%</span></div>
            <div><span style="font-size:14px;color:var(--text-light);">Assessed</span><span style="font-size:24px;font-weight:700;color:var(--primary);margin-left:10px;">${assessed}/100</span></div>
            <div style="flex:1;"><div class="progress-bar-large"><div class="progress-bar-large-fill" style="width:${completion}%">${completion}%</div></div></div>
        </div>
    `;
}

function renderRiskSummary(org) {
    const el = document.getElementById('riskSummary');
    if (!el) return;
    const risk = org.aggregates?.overall_risk ?? 0.5;
    const riskPercent = (risk * 100).toFixed(1);
    const riskClass = risk < 0.3 ? 'risk-low' : risk < 0.7 ? 'risk-medium' : 'risk-high';
    const riskLabel = risk < 0.3 ? 'Low Risk' : risk < 0.7 ? 'Medium Risk' : 'High Risk';
    const riskBadge = risk < 0.3 ? '🟢' : risk < 0.7 ? '🟡' : '🔴';
    const riskColor = risk < 0.3 ? '#22c55e' : risk < 0.7 ? '#f59e0b' : '#ef4444';

    el.innerHTML = `
        <div style="display: flex; gap: 30px; align-items: center; margin-top: 10px;">
            <div><span style="font-size:14px;color:var(--text-light);">Overall Risk</span><span style="font-size:24px;font-weight:700;margin-left:10px;color:${riskColor};">${riskBadge} ${riskLabel}</span></div>
            <div><span style="font-size:14px;color:var(--text-light);">Score</span><span style="font-size:24px;font-weight:700;color:var(--primary);margin-left:10px;">${riskPercent}%</span></div>
            <div style="flex:1;"><div class="progress-bar-large"><div class="progress-bar-large-fill" style="width:${riskPercent}%;background:${riskColor};">${riskPercent}%</div></div></div>
        </div>
    `;
}

export function renderProgressMatrix(org) {
    const matrix = document.getElementById('progressMatrix');
    const filterDiv = document.getElementById('progressFilter');
    if (!matrix) return;

    // Filter Info
    const categoryFilter = getCategoryFilter();
    if (filterDiv) {
        if (categoryFilter) {
            filterDiv.innerHTML = `
                <div class="filter-active">
                    <div class="filter-text">🔍 Filter: Category ${categoryFilter}</div>
                    <button data-action="clear-category-filter" class="filter-clear-btn">Clear</button>
                </div>`;
        } else {
            filterDiv.innerHTML = '';
        }
    }

    let html = '';
    const assessments = org.assessments || {};

    for (let cat = 1; cat <= 10; cat++) {
        for (let ind = 1; ind <= 10; ind++) {
            const id = `${cat}.${ind}`;
            const assessment = assessments[id];

            // Check completed status
            const hasScore = assessment && typeof assessment.bayesian_score === 'number';
            const completed = hasScore && (assessment.bayesian_score >= 0);

            let cellClass = '';
            let title = `${id} - Not Assessed`;
            let riskPercent = '';

            if (completed) {
                const score = assessment.bayesian_score;
                if (score <= 0.33) cellClass = 'risk-low';
                else if (score <= 0.66) cellClass = 'risk-medium';
                else cellClass = 'risk-high';

                riskPercent = (score * 100).toFixed(0) + '%';
                title = `${id} - Risk: ${riskPercent}`;
            }

            const isFiltered = categoryFilter && categoryFilter !== String(cat);
            const style = isFiltered ? 'opacity: 0.3; cursor: default;' : '';
            const actionAttr = isFiltered ? '' : `data-action="open-indicator-detail" data-indicator-id="${id}" data-org-id="${org.id}"`;

            html += `
                <div class="matrix-cell indicator ${cellClass}" 
                     title="${title}" style="${style}" ${actionAttr}>
                    <div style="font-weight:700;font-size:13px;">${id}</div>
                    ${completed ? `<div style="font-weight:600;font-size:16px;margin-top:4px;">${riskPercent}</div>` : ''}
                </div>
            `;
        }
    }
    matrix.innerHTML = html;
}

export function renderRiskHeatmap(org) {
    const heatmap = document.getElementById('riskHeatmap');
    if (!heatmap) return;

    const categories = org.aggregates?.by_category || {};

    const catNames = {
        '1':'Authority', '2':'Temporal', '3':'Social', '4':'Affective',
        '5':'Cognitive', '6':'Group', '7':'Stress', '8':'Unconscious',
        '9':'AI-Enhanced', '10':'Convergent'
    };

    let html = '';
    for (let cat = 1; cat <= 10; cat++) {
        const catKey = String(cat);
        const data = categories[catKey];
        const name = catNames[catKey] || 'Category';

        if (data) {
            const risk = (data.avg_score * 100).toFixed(1);
            const riskClass = data.avg_score < 0.3 ? 'risk-low' : data.avg_score < 0.7 ? 'risk-medium' : 'risk-high';

            html += `
                <div class="category-card" style="position: relative;">
                    <div style="cursor: pointer;" data-action="filter-by-category" data-category-key="${catKey}">
                        <div class="category-title">
                            ${cat}. ${name}
                        </div>
                        <div class="category-stats">
                            <div class="category-risk ${riskClass}">${risk}%</div>
                            <div class="category-completion">${data.completion_percentage}% complete</div>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar-fill" style="width:${data.completion_percentage}%"></div>
                        </div>
                        <div style="font-size:12px;color:var(--text-light);margin-top:8px;">
                            ${data.total_assessments}/10 assessed • Conf: ${(data.avg_confidence * 100).toFixed(0)}%
                        </div>
                    </div>
                    <span data-action="open-category-modal" data-category-key="${catKey}" class="category-info-icon" style="position: absolute; top: 10px; right: 10px; cursor: pointer; font-size: 18px; z-index: 10;">❓</span>
                </div>
            `;
        } else {
            html += `
                <div class="category-card" style="opacity:0.5; position: relative;">
                     <div class="category-title">${cat}. ${name}</div>
                     <div class="category-stats"><div>--</div><div>No data</div></div>
                     <span data-action="open-category-modal" data-category-key="${catKey}" class="category-info-icon" style="position: absolute; top: 10px; right: 10px; cursor: pointer; font-size: 18px; z-index: 10;">❓</span>
                </div>`;
        }
    }
    heatmap.innerHTML = html;
}

export function setMatrixZoom(type, level) {
    const el = type === 'progress' ? document.getElementById('progressMatrix') : document.getElementById('riskHeatmap');
    if (el) {
        el.classList.remove('zoom-100', 'zoom-75', 'zoom-50');
        el.classList.add(`zoom-${level}`);
        localStorage.setItem(`matrix-zoom-${type}`, level);
        
        // Update active button state
        const container = type === 'progress' ? document.querySelector('#progressTab .zoom-controls') : document.querySelector('#riskTab .zoom-controls');
        if (container) {
            container.querySelectorAll('.zoom-btn').forEach(b => {
                b.classList.toggle('active', b.textContent.includes(level));
            });
        }
    }
}

export function restoreMatrixZoom() {
    ['progress', 'risk'].forEach(type => {
        const level = localStorage.getItem(`matrix-zoom-${type}`);
        if(level) setMatrixZoom(type, parseInt(level));
    });
}