// Global State
let organizations = [];
let currentOrgId = null;
let simulatorRunning = false;
let mode = 'auto'; // 'auto' or 'manual'
let statusInterval = null;
let selectedSources = ['splunk', 'qradar', 'sentinel', 'crowdstrike'];

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
        item.onclick = () => selectOrganization(org.id);

        const riskPct = Math.round((org.stats?.overall_risk || 0) * 100);

        item.innerHTML = `
            <div class="org-name">${org.name}</div>
            <div class="org-meta">
                ${org.industry} • ${org.country} • Risk: ${riskPct}%
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

    // Check if simulator is running for this org
    checkSimulatorStatus();
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

    if (running) {
        statusDiv.classList.add('running');
        statusDiv.classList.remove('stopped');
        indicator.classList.add('running');
        indicator.classList.remove('stopped');

        statusText.textContent = 'Simulator Running';
        statusDetail.textContent = mode === 'auto' ?
            `Automatic mode: ${document.getElementById('scenario-select').value}` :
            'Manual mode: Use "Emit Event" button';
        headerStatus.textContent = 'Simulator Active';

        startBtn.disabled = true;
        stopBtn.disabled = false;

    } else {
        statusDiv.classList.add('stopped');
        statusDiv.classList.remove('running');
        indicator.classList.add('stopped');
        indicator.classList.remove('running');

        statusText.textContent = 'Simulator Stopped';
        statusDetail.textContent = 'Select a mode and click Start';
        headerStatus.textContent = 'Simulator Ready';

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

// Auto-refresh organizations every 30 seconds
setInterval(async () => {
    if (document.getElementById('empty-state').style.display !== 'none') {
        await loadOrganizations();
    }
}, 30000);
