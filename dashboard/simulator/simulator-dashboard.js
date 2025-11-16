// Global State
let organizations = [];
let organizationsData = null;
let currentOrgId = null;
let socData = null; // SOC indicator values from {org-name}-soc.json
let simulatorRunning = false;
let mode = 'auto'; // 'auto' or 'manual'
let statusInterval = null;
let selectedSources = ['splunk', 'qradar', 'sentinel', 'crowdstrike'];
let sortDirection = 'desc'; // 'asc' or 'desc'

// Initialize on page load
window.addEventListener('DOMContentLoaded', async () => {
    await initializeDashboard();
});

async function initializeDashboard() {
    try {
        // Load organizations
        await loadOrganizations();

        // Load available sources
        await loadSources();

        // Setup event listeners
        setupEventListeners();

        // Hide loading, show empty state
        document.getElementById('loading').style.display = 'none';
        document.getElementById('empty-state').style.display = 'block';

        logEvent('Dashboard initialized successfully');

    } catch (error) {
        console.error('Initialization error:', error);
        logEvent(`Error: ${error.message}`, 'error');
        document.getElementById('loading').innerHTML = `
            <h2>⚠️ Initialization Error</h2>
            <p>${error.message}</p>
        `;
    }
}

async function loadOrganizations() {
    try {
        const response = await fetch('/api/organizations');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        organizations = data.organizations || [];
        organizationsData = data;

        document.getElementById('org-count').textContent = organizations.length;

        renderOrganizationsList();

        logEvent(`Loaded ${organizations.length} organizations`);

    } catch (error) {
        console.error('Error loading organizations:', error);
        throw error;
    }
}

function renderOrganizationsList() {
    const orgList = document.getElementById('org-list');
    orgList.innerHTML = '';

    if (organizations.length === 0) {
        orgList.innerHTML = `
            <div style="padding: 1rem; text-align: center; color: var(--text-light);">
                <p>No organizations found</p>
                <p style="font-size: 0.875rem; margin-top: 0.5rem;">
                    Create one in the <a href="/dashboard/auditing/" target="_blank">Auditing Dashboard</a>
                </p>
            </div>
        `;
        return;
    }

    organizations.forEach(org => {
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

        // Get language info
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

function selectOrganization(orgId) {
    currentOrgId = orgId;

    // Update active state
    document.querySelectorAll('.org-item').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget?.classList.add('active');

    // Show simulator dashboard
    document.getElementById('empty-state').style.display = 'none';
    document.getElementById('simulator-dashboard').style.display = 'block';

    const org = organizations.find(o => o.id === orgId);
    logEvent(`Selected organization: ${org.name}`);

    // Initialize CPF Matrix
    initializeMatrix();

    // Load organization data and populate matrix
    loadOrganizationData(orgId);

    // Load SOC data for matrix visualization
    loadSocData(orgId);

    // Setup WebSocket for real-time updates
    setupWebSocket(orgId);

    // Check if simulator is running for this org
    checkSimulatorStatus();
}

async function loadSocData(orgId) {
    try {
        const response = await fetch(`/api/soc/${orgId}`);
        const result = await response.json();

        if (result.success) {
            socData = result.data;
            console.log(`✅ SOC data loaded for ${orgId}:`, socData);
            // Re-render matrix with SOC data
            if (organizationsData) {
                populateMatrixWithAssessments(organizationsData.assessments || {});
            }
        } else {
            console.log(`ℹ️  No SOC data found for ${orgId}`);
            socData = null;
        }
    } catch (error) {
        console.error('Error loading SOC data:', error);
        socData = null;
    }
}

async function loadSources() {
    try {
        const response = await fetch('/api/simulator/sources');
        if (!response.ok) {
            // Simulator not initialized yet, use defaults
            renderSourcesCheckboxes([
                {id: 'splunk', name: 'Splunk Enterprise', enabled: true},
                {id: 'qradar', name: 'IBM QRadar', enabled: true},
                {id: 'sentinel', name: 'Microsoft Sentinel', enabled: true},
                {id: 'crowdstrike', name: 'CrowdStrike Falcon', enabled: true}
            ]);
            return;
        }

        const data = await response.json();
        const enabledSources = data.sources.filter(s => s.enabled);
        renderSourcesCheckboxes(enabledSources);

    } catch (error) {
        console.warn('Could not load sources, using defaults');
        renderSourcesCheckboxes([
            {id: 'splunk', name: 'Splunk Enterprise', enabled: true},
            {id: 'qradar', name: 'IBM QRadar', enabled: true},
            {id: 'sentinel', name: 'Microsoft Sentinel', enabled: true},
            {id: 'crowdstrike', name: 'CrowdStrike Falcon', enabled: true}
        ]);
    }
}

function renderSourcesCheckboxes(sources) {
    const container = document.getElementById('sources-checkboxes');
    container.innerHTML = '';

    sources.forEach(source => {
        const label = document.createElement('label');
        label.className = 'checkbox-label';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = source.id;
        checkbox.checked = selectedSources.includes(source.id);
        checkbox.onchange = (e) => {
            if (e.target.checked) {
                selectedSources.push(source.id);
            } else {
                selectedSources = selectedSources.filter(s => s !== source.id);
            }
        };

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(source.name));

        container.appendChild(label);
    });
}

function setupEventListeners() {
    // Mode toggle
    document.getElementById('mode-auto').onclick = () => setMode('auto');
    document.getElementById('mode-manual').onclick = () => setMode('manual');

    // Start/Stop buttons
    document.getElementById('start-btn').onclick = startSimulator;
    document.getElementById('stop-btn').onclick = stopSimulator;
    document.getElementById('emit-event-btn').onclick = emitManualEvent;
}

function setMode(newMode) {
    mode = newMode;

    // Update UI
    if (mode === 'auto') {
        document.getElementById('mode-auto').classList.add('btn-primary');
        document.getElementById('mode-auto').classList.remove('btn-secondary');
        document.getElementById('mode-manual').classList.add('btn-secondary');
        document.getElementById('mode-manual').classList.remove('btn-primary');

        document.getElementById('auto-controls').style.display = 'block';
        document.getElementById('manual-controls').style.display = 'none';
        document.getElementById('emit-event-btn').style.display = 'none';
    } else {
        document.getElementById('mode-manual').classList.add('btn-primary');
        document.getElementById('mode-manual').classList.remove('btn-secondary');
        document.getElementById('mode-auto').classList.add('btn-secondary');
        document.getElementById('mode-auto').classList.remove('btn-primary');

        document.getElementById('auto-controls').style.display = 'none';
        document.getElementById('manual-controls').style.display = 'block';
        document.getElementById('emit-event-btn').style.display = 'inline-flex';
    }

    logEvent(`Mode changed to: ${newMode}`);
}

async function startSimulator() {
    if (!currentOrgId) {
        alert('Please select an organization first');
        return;
    }

    if (selectedSources.length === 0) {
        alert('Please select at least one SIEM/EDR source');
        return;
    }

    try {
        const payload = {
            orgId: currentOrgId,
            sources: selectedSources
        };

        if (mode === 'auto') {
            payload.scenario = document.getElementById('scenario-select').value;
            payload.rate = parseInt(document.getElementById('rate-input').value);
            payload.duration = parseInt(document.getElementById('duration-input').value);

            logEvent(`Starting automatic simulator: scenario=${payload.scenario}, rate=${payload.rate}/s`);
        } else {
            payload.scenario = 'manual';
            payload.rate = 0;

            logEvent('Starting manual simulator mode');
        }

        const response = await fetch('/api/simulator/start', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to start simulator');
        }

        const result = await response.json();

        simulatorRunning = true;
        updateSimulatorStatus(true);

        logEvent('✅ Simulator started successfully', 'success');

        // Start status polling
        startStatusPolling();

    } catch (error) {
        console.error('Error starting simulator:', error);
        logEvent(`❌ Error: ${error.message}`, 'error');
        alert(`Failed to start simulator: ${error.message}`);
    }
}

async function stopSimulator() {
    if (!currentOrgId) return;

    try {
        logEvent('Stopping simulator...');

        const response = await fetch('/api/simulator/stop', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({orgId: currentOrgId})
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to stop simulator');
        }

        const result = await response.json();

        simulatorRunning = false;
        updateSimulatorStatus(false);

        logEvent(`✅ Simulator stopped. Events: ${result.stats?.eventsGenerated || 0}`, 'success');

        // Stop status polling
        if (statusInterval) {
            clearInterval(statusInterval);
            statusInterval = null;
        }

    } catch (error) {
        console.error('Error stopping simulator:', error);
        logEvent(`❌ Error: ${error.message}`, 'error');
        alert(`Failed to stop simulator: ${error.message}`);
    }
}

async function emitManualEvent() {
    if (!currentOrgId) return;

    try {
        const eventType = document.getElementById('event-type-select').value;
        const severity = document.getElementById('severity-select').value;
        const count = parseInt(document.getElementById('event-count-input').value);

        logEvent(`Emitting ${count}x ${eventType} event(s) with ${severity} severity...`);

        const response = await fetch('/api/simulator/emit', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                orgId: currentOrgId,
                eventType: eventType,
                severity: severity,
                count: count,
                sources: selectedSources
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to emit event');
        }

        const result = await response.json();

        logEvent(`✅ Emitted ${result.eventsGenerated || count} event(s)`, 'success');

        // Refresh stats
        await checkSimulatorStatus();

    } catch (error) {
        console.error('Error emitting event:', error);
        logEvent(`❌ Error: ${error.message}`, 'error');
        alert(`Failed to emit event: ${error.message}`);
    }
}

function updateSimulatorStatus(running) {
    const statusDiv = document.getElementById('simulator-status');
    const indicator = document.getElementById('status-indicator');
    const statusText = document.getElementById('status-text');
    const statusDetail = document.getElementById('status-detail');
    const headerStatus = document.getElementById('header-status');
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');

    if (!statusDiv || !indicator || !statusText || !statusDetail || !startBtn || !stopBtn) return;

    if (running) {
        statusDiv.classList.add('running');
        statusDiv.classList.remove('stopped');
        indicator.classList.add('running');
        indicator.classList.remove('stopped');
        statusText.textContent = 'Simulator Running';
        statusDetail.textContent = mode === 'auto' ?
            `Automatic mode: ${document.getElementById('scenario-select')?.value || 'unknown'}` :
            'Manual mode: Use "Emit Event" button';
        if (headerStatus) headerStatus.textContent = 'Simulator Active';
        startBtn.disabled = true;
        stopBtn.disabled = false;
    } else {
        statusDiv.classList.add('stopped');
        statusDiv.classList.remove('running');
        indicator.classList.add('stopped');
        indicator.classList.remove('running');
        statusText.textContent = 'Simulator Stopped';
        statusDetail.textContent = 'Select a mode and click Start';
        if (headerStatus) headerStatus.textContent = 'Simulator Ready';
        startBtn.disabled = false;
        stopBtn.disabled = true;
    }
}

async function checkSimulatorStatus() {
    try {
        const response = await fetch('/api/simulator/status');
        if (!response.ok) return;

        const status = await response.json();

        // Check if our org is running
        const orgRunning = status.activeOrganizations?.some(org => org.orgId === currentOrgId);

        if (orgRunning !== simulatorRunning) {
            simulatorRunning = orgRunning;
            updateSimulatorStatus(orgRunning);
        }

        // Update stats
        const orgStatus = status.activeOrganizations?.find(org => org.orgId === currentOrgId);
        if (orgStatus) {
            document.getElementById('stat-events').textContent = orgStatus.eventsGenerated || 0;
            document.getElementById('stat-assessments').textContent = orgStatus.assessmentsCreated || 0;
            document.getElementById('stat-uptime').textContent = formatDuration(orgStatus.uptime || 0);
            document.getElementById('stat-scenario').textContent = orgStatus.scenario || '-';
        }

    } catch (error) {
        console.warn('Could not check simulator status:', error);
    }
}

function startStatusPolling() {
    if (statusInterval) clearInterval(statusInterval);

    statusInterval = setInterval(async () => {
        await checkSimulatorStatus();
    }, 2000); // Poll every 2 seconds
}

function logEvent(message, type = 'info') {
    const log = document.getElementById('event-log');
    const timestamp = new Date().toLocaleTimeString();

    const entry = document.createElement('div');
    entry.className = 'event-log-entry';

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚠️';

    entry.innerHTML = `
        <span class="event-timestamp">[${timestamp}]</span> ${icon} ${message}
    `;

    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;

    // Keep only last 100 entries
    while (log.children.length > 100) {
        log.removeChild(log.firstChild);
    }
}

function clearEventLog() {
    const log = document.getElementById('event-log');
    log.innerHTML = `
        <div class="event-log-entry">
            <span class="event-timestamp">[${new Date().toLocaleTimeString()}]</span> Log cleared
        </div>
    `;
}

function formatDuration(seconds) {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
}

// ============================================================================
// CPF MATRIX (10x10) - REAL-TIME VISUALIZATION
// ============================================================================

let socket = null;
let matrixData = {};

/**
 * Initialize CPF Matrix with 100 cells (10x10)
 */
function initializeMatrix() {
    const matrixContainer = document.getElementById('cpf-matrix');
    matrixContainer.innerHTML = '';

    // Generate 10x10 grid (categories 1-10, indicators 1-10)
    for (let category = 1; category <= 10; category++) {
        for (let indicator = 1; indicator <= 10; indicator++) {
            const indicatorId = `${category}.${indicator}`;
            const cell = document.createElement('div');
            cell.className = 'matrix-cell risk-missing';
            cell.id = `cell-${indicatorId.replace('.', '-')}`;
            cell.innerHTML = `${indicatorId}<span class="trend-indicator"></span>`;
            cell.title = `Indicator ${indicatorId}`;

            matrixContainer.appendChild(cell);
        }
    }

    logEvent('Matrix initialized (100 indicators)');
}

/**
 * Load organization data and populate matrix
 */
async function loadOrganizationData(orgId) {
    try {
        const response = await fetch(`/api/organizations/${orgId}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const result = await response.json();
        const orgData = result.data;

        // NON caricare assessments - la simulator dashboard usa SOLO dati SOC
        matrixData = {}; // Empty - non usiamo i dati di auditing

        // Update all cells (verranno popolate dai dati SOC quando disponibili)
        updateAllCells();

        logEvent(`Organization ${orgData.name} selected - waiting for SOC data`);

    } catch (error) {
        console.error('Error loading organization data:', error);
        logEvent(`Error loading data: ${error.message}`, 'error');
    }
}

/**
 * Update all matrix cells based on current data
 */
function updateAllCells() {
    for (let category = 1; category <= 10; category++) {
        for (let indicator = 1; indicator <= 10; indicator++) {
            const indicatorId = `${category}.${indicator}`;
            const assessment = matrixData[indicatorId];
            updateCell(indicatorId, assessment, null);
        }
    }
}

/**
 * Update single matrix cell
 */
function updateCell(indicatorId, assessment, trend) {
    const cellId = `cell-${indicatorId.replace('.', '-')}`;
    const cell = document.getElementById(cellId);
    if (!cell) return;

    // Remove all risk classes
    cell.classList.remove('risk-low', 'risk-medium', 'risk-high', 'risk-missing');

    // Get trend indicator element
    const trendIndicator = cell.querySelector('.trend-indicator');

    // SIMULATOR DASHBOARD: Usa SOLO dati SOC (no fallback a assessment)
    const socIndicator = socData?.indicators?.[indicatorId];
    let score = null;
    let calculatedTrend = trend;

    if (socIndicator && socIndicator.value !== undefined) {
        score = socIndicator.value;

        // Calculate trend from SOC previous_value if not provided
        if (!calculatedTrend && socIndicator.previous_value !== null && socIndicator.previous_value !== undefined) {
            const diff = score - socIndicator.previous_value;
            if (diff > 0.05) {
                calculatedTrend = 'up';
            } else if (diff < -0.05) {
                calculatedTrend = 'down';
            } else {
                calculatedTrend = 'stable';
            }
        }
    }

    if (score === null) {
        // No SOC data available
        cell.classList.add('risk-missing');
        trendIndicator.textContent = '';
        cell.title = `Indicator ${indicatorId} - No SOC data`;
        return;
    }

    const percentage = Math.round(score * 100);

    // Determine risk level (fixed thresholds)
    let riskClass;
    if (score < 0.33) {
        riskClass = 'risk-low';
    } else if (score < 0.66) {
        riskClass = 'risk-medium';
    } else {
        riskClass = 'risk-high';
    }

    cell.classList.add(riskClass);

    // Update trend indicator
    if (calculatedTrend === 'up') {
        trendIndicator.textContent = '↑';
        trendIndicator.className = 'trend-indicator trend-up';
    } else if (calculatedTrend === 'down') {
        trendIndicator.textContent = '↓';
        trendIndicator.className = 'trend-indicator trend-down';
    } else {
        trendIndicator.textContent = '';
    }

    cell.title = `Indicator ${indicatorId} - Risk: ${percentage}% [SOC] ${calculatedTrend ? (calculatedTrend === 'up' ? '(increasing)' : calculatedTrend === 'down' ? '(decreasing)' : '(stable)') : ''}`;
}

/**
 * Setup WebSocket connection for real-time updates
 */
function setupWebSocket(orgId) {
    // Disconnect existing socket
    if (socket) {
        socket.disconnect();
    }

    // Connect to Socket.io server
    socket = io();

    socket.on('connect', () => {
        logEvent('Real-time updates enabled', 'success');
        socket.emit('subscribe', orgId);
    });

    socket.on('disconnect', () => {
        logEvent('Disconnected', 'warning');
    });

    socket.on('indicator_update', (data) => {
        if (data.orgId === currentOrgId) {
            matrixData[data.indicatorId] = data.assessment;
            updateCell(data.indicatorId, data.assessment, data.trend);
            logEvent(`${data.indicatorId}: ${Math.round(data.newScore * 100)}% ${data.trend === 'up' ? '↑' : data.trend === 'down' ? '↓' : ''}`);
        }
    });

    socket.on('error', (error) => {
        logEvent(`Error: ${error}`, 'error');
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

    // Update count
    document.getElementById('org-count').textContent = filtered.length;

    // Update organizations array and re-render
    organizations = filtered;
    renderOrganizationsList();
}

// Reset all filters to default
function resetFilters() {
    document.getElementById('org-search').value = '';
    document.getElementById('org-sort').value = 'created_at';
    sortDirection = 'desc';
    document.getElementById('sort-direction').textContent = '⬇️';
    filterAndSortOrganizations();
}

// Sidebar open/close functions
function openSidebar() {
    const sidebar = document.getElementById('sidebar');
    const openBtn = document.getElementById('sidebarOpenBtn');

    sidebar.classList.remove('hidden');
    openBtn.style.display = 'none';
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const openBtn = document.getElementById('sidebarOpenBtn');

    sidebar.classList.add('hidden');
    openBtn.style.display = 'inline-flex';
}

// Edit/Delete Organization Functions
let editingOrgId = null;
let deletingOrgId = null;

function editOrganization(orgId) {
    editingOrgId = orgId;
    const org = organizations.find(o => o.id === orgId);
    if (!org) return;

    document.getElementById('edit-org-name').value = org.name;
    document.getElementById('edit-org-industry').value = org.industry;
    document.getElementById('edit-org-size').value = org.size;
    document.getElementById('edit-org-country').value = org.country;
    document.getElementById('edit-org-language').value = org.language;

    document.getElementById('edit-org-modal').style.display = 'block';
}

function closeEditOrgModal() {
    document.getElementById('edit-org-modal').style.display = 'none';
    editingOrgId = null;
}

async function saveOrganizationEdit(event) {
    event.preventDefault();

    if (!editingOrgId) return;

    const orgData = {
        name: document.getElementById('edit-org-name').value.trim(),
        industry: document.getElementById('edit-org-industry').value,
        size: document.getElementById('edit-org-size').value,
        country: document.getElementById('edit-org-country').value.trim().toUpperCase(),
        language: document.getElementById('edit-org-language').value
    };

    try {
        const response = await fetch(`/api/organizations/${editingOrgId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orgData)
        });

        const result = await response.json();

        if (result.success) {
            logEvent(`Organization updated: ${orgData.name}`);
            closeEditOrgModal();
            await loadOrganizations();
        } else {
            alert(`Error: ${result.error || 'Failed to update organization'}`);
        }
    } catch (error) {
        console.error('Error updating organization:', error);
        alert('Failed to update organization');
    }
}

function deleteOrganization(orgId, orgName) {
    deletingOrgId = orgId;
    document.getElementById('delete-org-name').textContent = orgName;
    document.getElementById('delete-org-modal').style.display = 'block';
}

function closeDeleteOrgModal() {
    document.getElementById('delete-org-modal').style.display = 'none';
    deletingOrgId = null;
}

async function confirmDeleteOrganization() {
    if (!deletingOrgId) return;

    try {
        const response = await fetch(`/api/organizations/${deletingOrgId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            logEvent(`Organization deleted`);
            closeDeleteOrgModal();

            // If deleting currently selected org, clear selection
            if (currentOrgId === deletingOrgId) {
                currentOrgId = null;
                document.getElementById('simulator-dashboard').style.display = 'none';
                document.getElementById('empty-state').style.display = 'block';
            }

            await loadOrganizations();
        } else {
            alert(`Error: ${result.error || 'Failed to delete organization'}`);
        }
    } catch (error) {
        console.error('Error deleting organization:', error);
        alert('Failed to delete organization');
    }
}

// Auto-refresh organizations every 30 seconds
setInterval(async () => {
    if (document.getElementById('empty-state').style.display !== 'none') {
        await loadOrganizations();
    }
}, 30000);
