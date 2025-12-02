import { getOrganizations, getSelectedOrgId, getSortDirection } from './state.js';
import { escapeHtml, capitalizeFirst } from '../shared/utils.js';

export function renderOrganizations() {
    const orgList = document.getElementById('org-list');
    const countEl = document.getElementById('org-count');
    const sidebarCountEl = document.getElementById('sidebarOrgCount');
    const organizations = getOrganizations();

    if (countEl) countEl.textContent = organizations.length;
    if (sidebarCountEl) sidebarCountEl.textContent = organizations.length;
    if (!orgList) return;

    orgList.innerHTML = '';

    if (!organizations || organizations.length === 0) {
        orgList.innerHTML = `<div style="padding:1rem;text-align:center;color:var(--text-light);">No organizations found</div>`;
        return;
    }

    organizations.forEach(org => {
        orgList.appendChild(createOrganizationCard(org));
    });
}

export function createOrganizationCard(org) {
    const item = document.createElement('div');
    item.className = 'org-item';
    const selectedOrgId = getSelectedOrgId();
    if (selectedOrgId === org.id) item.classList.add('active');
    
    item.dataset.action = 'select-organization';
    item.dataset.orgId = org.id;

    // Stats calculations
    const completion = org.stats?.completion_percentage || 0;
    const risk = org.stats?.overall_risk || 0;
    const riskClass = risk > 0.66 ? 'high' : risk > 0.33 ? 'medium' : 'low';
    const riskLabel = risk > 0.66 ? 'High' : risk > 0.33 ? 'Medium' : 'Low';
    const assessmentsCount = org.stats?.total_assessments || 0;
    const language = org.language || 'en-US';
    const confidence = org.stats?.avg_confidence;

    const flag = getFlag(org.country);
    const date = org.created_at ? new Date(org.created_at).toLocaleDateString() : 'N/A';

    item.innerHTML = `
        <div class="org-card-header">
            <div style="flex: 1; min-width: 0;">
                <div class="org-name">${escapeHtml(org.name)}</div>
                <div class="org-meta">${escapeHtml(org.industry)} • ${capitalizeFirst(org.size)} • ${flag}</div>
            </div>
            <div class="org-card-actions">
                <button class="icon-btn" data-action="edit-organization" data-org-id="${org.id}">✏️</button>
                <button class="icon-btn" data-action="delete-organization" data-org-id="${org.id}" data-org-name="${escapeHtml(org.name)}">🗑️</button>
            </div>
        </div>
        <div class="org-stats-detailed">
            <div class="stat-row"><span>Created</span><span>${date}</span></div>
            <div class="stat-row"><span>Language</span><span>${language}</span></div>
            <div class="stat-row"><span>Assessments</span><span>${assessmentsCount}/100 (${completion}%)</span></div>
            <div class="stat-row"><span>Risk Level</span><span class="stat-value ${riskClass}">${riskLabel} (${(risk * 100).toFixed(0)}%)</span></div>
            <div class="stat-row"><span>Confidence</span><span>${typeof confidence === 'number' ? (confidence * 100).toFixed(0) + '%' : 'N/A'}</span></div>
        </div>
    `;
    return item;
}

function getFlag(country) {
    if(!country) return '🌐';
    const c = country.toUpperCase();
    const flags = { 'IT':'🇮🇹', 'US':'🇺🇸', 'GB':'🇬🇧', 'FR':'🇫🇷', 'DE':'🇩🇪', 'ES':'🇪🇸' };
    return flags[c] || '🌐';
}

export function filterAndSortOrganizations() {
    const searchVal = document.getElementById('org-search')?.value.toLowerCase().trim() || '';
    const sortValue = document.getElementById('org-sort')?.value || 'created_at';
    const organizations = getOrganizations();
    const sortDirection = getSortDirection();

    // Create a working copy
    let filtered = [...organizations];
    
    // Filter
    if (searchVal) {
        filtered = filtered.filter(org => org.name.toLowerCase().includes(searchVal));
    }

    // Sort
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
            case 'assessments': 
                result = (a.stats?.total_assessments || 0) - (b.stats?.total_assessments || 0); 
                break;
            case 'industry': 
                result = (a.industry || '').localeCompare(b.industry || ''); 
                break;
            case 'country': 
                result = (a.country || '').localeCompare(b.country || ''); 
                break;
            case 'updated_at':
                result = new Date(a.updated_at || 0) - new Date(b.updated_at || 0);
                break;
            case 'created_at': default: 
                result = new Date(a.created_at || 0) - new Date(b.created_at || 0); 
                break;
        }

        return sortDirection === 'desc' ? -result : result;
    });

    // Render logic duplicated here to use the sorted array
    // instead of the global unsorted one
    const orgList = document.getElementById('org-list');
    const countEl = document.getElementById('org-count');
    const sidebarCountEl = document.getElementById('sidebarOrgCount');

    if (countEl) countEl.textContent = filtered.length;
    if (sidebarCountEl) sidebarCountEl.textContent = filtered.length;
    if (!orgList) return;

    orgList.innerHTML = '';
    
    if (filtered.length === 0) {
        orgList.innerHTML = `<div style="padding:1rem;text-align:center;color:var(--text-light);">No organizations found</div>`;
        return;
    }

    filtered.forEach(org => {
        orgList.appendChild(createOrganizationCard(org));
    });
}