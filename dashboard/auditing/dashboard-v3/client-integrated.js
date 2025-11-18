// ============================================
// CPF CLIENT V3.0 - REFACTORED ARCHITECTURE
// ============================================
// Migrated from IIFE to ES6+ classes
// Consolidated duplicate code
// Better separation of concerns
// ============================================

'use strict';

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    languages: {
        map: {
            'EN': 'en-US',
            'IT': 'it-IT',
            'ES': 'es-ES',
            'FR': 'fr-FR',
            'DE': 'de-DE'
        },
        options: [
            { code: 'EN', iso: 'en-US', label: 'English' },
            { code: 'IT', iso: 'it-IT', label: 'Italiano' },
            { code: 'ES', iso: 'es-ES', label: 'Español' },
            { code: 'FR', iso: 'fr-FR', label: 'Français' },
            { code: 'DE', iso: 'de-DE', label: 'Deutsch' }
        ]
    },
    categories: {
        map: window.CATEGORY_MAP || {
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
        },
        details: [
            { num: 1, name: 'authority', label: 'Authority-Based Vulnerabilities' },
            { num: 2, name: 'temporal', label: 'Temporal Vulnerabilities' },
            { num: 3, name: 'social', label: 'Social Influence Vulnerabilities' },
            { num: 4, name: 'affective', label: 'Affective Vulnerabilities' },
            { num: 5, name: 'cognitive', label: 'Cognitive Overload Vulnerabilities' },
            { num: 6, name: 'group', label: 'Group Dynamic Vulnerabilities' },
            { num: 7, name: 'stress', label: 'Stress Response Vulnerabilities' },
            { num: 8, name: 'unconscious', label: 'Unconscious Process Vulnerabilities' },
            { num: 9, name: 'ai', label: 'AI-Specific Bias Vulnerabilities' },
            { num: 10, name: 'convergent', label: 'Convergent Threat Vulnerabilities' }
        ]
    },
    scoring: {
        weights: {
            quickAssessment: 0.70,
            redFlags: 0.30,
            conversationDepth: 0  // Informational only
        }
    },
    autoSave: {
        interval: 30000,  // 30 seconds
        debounce: 2000    // 2 seconds after last change
    }
};

// Set global category map for dashboard compatibility
window.CATEGORY_MAP = CONFIG.categories.map;

// ============================================
// ASSESSMENT MANAGER CLASS
// ============================================

class AssessmentManager {
    constructor(organizationContext = {}) {
        this.organizationContext = {
            orgId: null,
            orgName: null,
            language: 'en-US',
            ...organizationContext
        };

        this.currentData = {
            fieldKit: null,
            metadata: {
                date: new Date().toISOString().split('T')[0],
                auditor: '',
                client: '',
                status: 'in-progress',
                notes: ''
            },
            responses: {}
        };

        this.currentScore = null;
        this.autoSaveTimeout = null;
        this.lastSaveTime = null;

        // Start auto-save to localStorage
        this.startAutoSaveInterval();
    }

    startAutoSaveInterval() {
        setInterval(() => {
            if (this.currentData.fieldKit) {
                localStorage.setItem('cpf_current', JSON.stringify(this.currentData));
            }
        }, CONFIG.autoSave.interval);
    }

    updateMeta(field, value) {
        this.currentData.metadata[field] = value;
        this.scheduleAutoSave();
    }

    updateResponse(id, value, options = {}) {
        const {
            updateUI = true,
            autoCalculate = true,
            autoSave = true
        } = options;

        // Update data
        this.currentData.responses[id] = value;

        // Update UI classes if needed
        if (updateUI) {
            this.updateUIClasses(id, value);
        }

        // Auto-calculate score
        if (autoCalculate && this.currentData.fieldKit?.scoring) {
            const calculator = new ScoreCalculator(this.currentData.fieldKit, this.currentData.responses);
            this.currentScore = calculator.calculate();
            this.updateScoreDisplay();
        }

        // Schedule auto-save
        if (autoSave) {
            this.scheduleAutoSave();
        }

        console.log(`📝 Response updated: ${id} = ${value}`);
    }

    updateUIClasses(id, value) {
        const element = document.getElementById(id);
        if (!element) return;

        const parent = element.closest('.item');
        if (!parent) return;

        if (value === null || value === undefined || value === '') {
            parent.classList.remove('answered');
        } else {
            parent.classList.add('answered');
        }
    }

    scheduleAutoSave() {
        // Clear existing timeout
        if (this.autoSaveTimeout) {
            clearTimeout(this.autoSaveTimeout);
        }

        // Schedule new save after debounce period
        this.autoSaveTimeout = setTimeout(() => {
            this.saveToAPI();
        }, CONFIG.autoSave.debounce);
    }

    async saveToAPI() {
        if (!this.organizationContext.orgId || !this.currentScore) {
            console.log('⚠️ Skip API save: missing orgId or score');
            return;
        }

        try {
            // Calculate dynamic confidence
            const totalItems = this.getTotalScoredItems();
            const answeredItems = Object.keys(this.currentData.responses).length;
            const dynamicConfidence = totalItems > 0 ? Math.min(answeredItems / totalItems, 1) : 0.5;

            const payload = {
                organization_id: this.organizationContext.orgId,
                indicator_id: this.currentData.fieldKit.indicator,
                bayesian_score: this.currentScore.bayesian_score,
                confidence: dynamicConfidence,
                maturity_level: this.currentScore.maturity_level,
                assessor: this.currentData.metadata.auditor || 'Unknown',
                raw_data: {
                    scores: this.currentScore,
                    client_conversation: {
                        metadata: this.currentData.metadata,
                        responses: this.currentData.responses,
                        notes: this.currentData.metadata.notes || '',
                        red_flags: this.currentScore.details?.red_flags_list || []
                    }
                }
            };

            const response = await fetch('/api/assessments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();
            this.lastSaveTime = new Date();
            this.showAutoSaveIndicator();

            // Callback to dashboard
            if (typeof window.dashboardReloadOrganization === 'function') {
                window.dashboardReloadOrganization();
            }

            console.log('✅ Saved to API:', result);
            return result;

        } catch (error) {
            console.error('❌ Failed to save:', error);
            throw error;
        }
    }

    showAutoSaveIndicator() {
        const metaBar = document.querySelector('.metadata-bar');
        if (!metaBar) return;

        const indicator = document.createElement('div');
        indicator.className = 'auto-save-indicator';
        indicator.textContent = '✓ Saved';
        indicator.style.cssText = 'position: absolute; top: 10px; right: 10px; background: #28a745; color: white; padding: 5px 10px; border-radius: 4px; font-size: 12px; animation: fadeIn 0.3s;';
        metaBar.appendChild(indicator);

        setTimeout(() => {
            indicator.style.animation = 'fadeOut 0.5s';
            setTimeout(() => indicator.remove(), 500);
        }, 2000);
    }

    getTotalScoredItems() {
        if (!this.currentData.fieldKit?.sections) return 0;

        let count = 0;
        this.currentData.fieldKit.sections.forEach(section => {
            section.items?.forEach(item => {
                if (item.type === 'radio-group' || item.type === 'checkbox') {
                    count++;
                }
            });
        });
        return count;
    }

    exportData() {
        const exportData = {
            ...this.currentData,
            score: this.currentScore,
            exported_at: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cpf_${this.currentData.fieldKit?.indicator || 'export'}_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        console.log('📥 Data exported');
    }

    resetAll() {
        if (!confirm('⚠️ Reset all data? This cannot be undone.')) {
            return;
        }

        this.currentData.responses = {};
        this.currentData.metadata = {
            date: new Date().toISOString().split('T')[0],
            auditor: '',
            client: '',
            status: 'in-progress',
            notes: ''
        };
        this.currentScore = null;

        // Clear localStorage
        localStorage.removeItem('cpf_current');

        // Re-render
        if (this.currentData.fieldKit) {
            const renderer = new FieldKitRenderer(this);
            renderer.render(this.currentData.fieldKit);
        }

        console.log('🔄 All data reset');
    }

    updateScoreDisplay() {
        const scoreDisplay = new ScoreDisplay(this.currentScore, this.currentData.fieldKit);
        scoreDisplay.render();
    }
}

// ============================================
// SCORE CALCULATOR CLASS
// ============================================

class ScoreCalculator {
    constructor(fieldKit, responses) {
        this.fieldKit = fieldKit;
        this.responses = responses;
        this.config = fieldKit.scoring || {};
    }

    calculate() {
        const quickAssessment = this.calculateQuickAssessment();
        const redFlags = this.calculateRedFlags();
        const conversationDepth = this.trackConversationCompleteness();

        // Weighted Bayesian score
        const bayesianScore =
            (quickAssessment.score * CONFIG.scoring.weights.quickAssessment) +
            (redFlags.score * CONFIG.scoring.weights.redFlags);

        const maturityLevel = this.determineMaturityLevel(bayesianScore);

        return {
            bayesian_score: Math.round(bayesianScore * 100) / 100,
            confidence: conversationDepth.completeness,
            maturity_level: maturityLevel,
            details: {
                quick_assessment: quickAssessment,
                red_flags: redFlags,
                conversation_depth: conversationDepth
            }
        };
    }

    calculateQuickAssessment() {
        const items = this.config.quick_assessment?.items || [];
        let totalScore = 0;
        let maxScore = 0;
        const answeredItems = [];

        items.forEach(item => {
            const responseValue = this.responses[item.id];
            maxScore += item.max_score || 0;

            if (responseValue !== undefined && responseValue !== null) {
                const option = item.options?.find(opt => opt.value === responseValue);
                if (option) {
                    totalScore += option.score || 0;
                    answeredItems.push({
                        id: item.id,
                        label: item.label,
                        response: option.label,
                        score: option.score
                    });
                }
            }
        });

        return {
            score: maxScore > 0 ? totalScore / maxScore : 0,
            total_score: totalScore,
            max_score: maxScore,
            answered_items: answeredItems
        };
    }

    calculateRedFlags() {
        if (!this.fieldKit.sections) {
            return { score: 0, count: 0, flags: [] };
        }

        const redFlagsList = [];
        let severitySum = 0;
        let maxSeverity = 0;

        this.fieldKit.sections.forEach((section, sIdx) => {
            section.items?.forEach((item, iIdx) => {
                if (item.severity) {
                    const itemId = item.id || `s${sIdx}_i${iIdx}`;
                    const isChecked = this.responses[itemId] === true;

                    maxSeverity += item.severity;

                    if (isChecked) {
                        severitySum += item.severity;
                        redFlagsList.push({
                            flag: item.label,
                            severity: item.severity,
                            section: section.title
                        });
                    }
                }

                // Check sub-items
                item.sub_items?.forEach((subItem, subIdx) => {
                    if (subItem.severity) {
                        const subItemId = `s${sIdx}_i${iIdx}_sub${subIdx}`;
                        const isChecked = this.responses[subItemId] === true;

                        maxSeverity += subItem.severity;

                        if (isChecked) {
                            severitySum += subItem.severity;
                            redFlagsList.push({
                                flag: subItem.label,
                                severity: subItem.severity,
                                section: section.title
                            });
                        }
                    }
                });
            });
        });

        return {
            score: maxSeverity > 0 ? severitySum / maxSeverity : 0,
            count: redFlagsList.length,
            red_flags_list: redFlagsList,
            severity_sum: severitySum,
            max_severity: maxSeverity
        };
    }

    trackConversationCompleteness() {
        if (!this.fieldKit.sections) {
            return { completeness: 0.5, total_items: 0, answered_items: 0 };
        }

        let totalItems = 0;
        let answeredItems = 0;

        this.fieldKit.sections.forEach((section, sIdx) => {
            section.items?.forEach((item, iIdx) => {
                const itemId = item.id || `s${sIdx}_i${iIdx}`;

                if (item.type === 'radio-group' || item.type === 'radio-list') {
                    totalItems++;
                    if (this.responses[itemId]) {
                        answeredItems++;
                    }
                }

                if (item.type === 'checkbox' || item.type === 'input') {
                    totalItems++;
                    if (this.responses[itemId]) {
                        answeredItems++;
                    }
                }

                // Count question follow-ups
                if (item.type === 'question' && this.responses[itemId] === 'yes') {
                    const followupId = `${itemId}_followup`;
                    totalItems++;
                    if (this.responses[followupId]) {
                        answeredItems++;
                    }
                }
            });
        });

        return {
            completeness: totalItems > 0 ? answeredItems / totalItems : 0.5,
            total_items: totalItems,
            answered_items: answeredItems
        };
    }

    determineMaturityLevel(score) {
        const levels = this.config.maturity_levels;
        if (!levels) return 'unknown';

        if (score >= 0 && score < 0.33) return 'red';
        if (score >= 0.33 && score < 0.66) return 'yellow';
        if (score >= 0.66) return 'green';

        return 'unknown';
    }
}

// ============================================
// FIELD KIT RENDERER CLASS
// ============================================

class FieldKitRenderer {
    constructor(assessmentManager) {
        this.manager = assessmentManager;
        this.container = document.getElementById('content');
    }

    render(fieldKit) {
        if (!this.container) {
            console.error('❌ Content container not found');
            return;
        }

        this.manager.currentData.fieldKit = fieldKit;

        const html = `
            ${this.renderHeader(fieldKit)}
            ${this.renderMetadataBar()}
            ${this.renderSections(fieldKit)}
        `;

        this.container.innerHTML = html;

        // Auto-calculate initial score
        if (fieldKit.scoring) {
            const calculator = new ScoreCalculator(fieldKit, this.manager.currentData.responses);
            this.manager.currentScore = calculator.calculate();
            this.manager.updateScoreDisplay();
        }

        console.log('✅ Field kit rendered');
    }

    renderHeader(data) {
        const { indicator, title, subtitle, category } = data;
        const categoryInfo = CONFIG.categories.details.find(c => c.num === parseInt(category));

        return `
            <div class="header">
                <div class="indicator-badge">${indicator || 'N/A'}</div>
                <h1>${title || 'Untitled'}</h1>
                ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}
                ${categoryInfo ? `<p class="category-tag">Category ${category}: ${categoryInfo.label}</p>` : ''}
            </div>
        `;
    }

    renderMetadataBar() {
        const { date, auditor, client, status, notes } = this.manager.currentData.metadata;

        return `
            <div class="metadata-bar">
                <div class="meta-field">
                    <label>Date:</label>
                    <input type="date" value="${date}" onchange="window.CPFClient.updateMeta('date', this.value)">
                </div>
                <div class="meta-field">
                    <label>Auditor:</label>
                    <input type="text" value="${auditor}" onchange="window.CPFClient.updateMeta('auditor', this.value)" placeholder="Your name">
                </div>
                <div class="meta-field">
                    <label>Client:</label>
                    <input type="text" value="${client}" onchange="window.CPFClient.updateMeta('client', this.value)" placeholder="Client name">
                </div>
                <div class="meta-field">
                    <label>Status:</label>
                    <select onchange="window.CPFClient.updateMeta('status', this.value)">
                        <option value="in-progress" ${status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                        <option value="completed" ${status === 'completed' ? 'selected' : ''}>Completed</option>
                        <option value="reviewed" ${status === 'reviewed' ? 'selected' : ''}>Reviewed</option>
                    </select>
                </div>
                <div class="meta-field meta-notes">
                    <label>Notes:</label>
                    <textarea rows="2" placeholder="Add notes here..."
                              onchange="window.CPFClient.updateMeta('notes', this.value)"
                              onblur="window.CPFClient.updateMeta('notes', this.value)">${notes || ''}</textarea>
                </div>
            </div>
        `;
    }

    renderSections(data) {
        if (!data.sections || data.sections.length === 0) {
            return '<div class="no-data">No sections available</div>';
        }

        let html = '<div class="sections">';

        data.sections.forEach((section, sIdx) => {
            html += `
                <div class="section">
                    <h2>${section.title || `Section ${sIdx + 1}`}</h2>
                    ${section.description ? `<p class="section-description">${section.description}</p>` : ''}
                    <div class="items">
                        ${section.items?.map((item, iIdx) => this.renderItem(item, sIdx, iIdx)).join('') || ''}
                    </div>
                </div>
            `;
        });

        html += '</div>';

        // Action buttons
        html += `
            <div class="actions">
                <button class="btn btn-secondary" onclick="window.CPFClient.saveData()">💾 Save</button>
                <button class="btn btn-success" onclick="window.CPFClient.exportData()">📥 Export</button>
                <button class="btn btn-primary" onclick="window.CPFClient.generateReport()">📊 Report</button>
            </div>
        `;

        return html;
    }

    renderItem(item, sIdx, iIdx) {
        const itemId = item.id || `s${sIdx}_i${iIdx}`;

        switch (item.type) {
            case 'radio-group':
                return this.renderRadioGroup(item, itemId);
            case 'radio-list':
                return this.renderRadioList(item, itemId);
            case 'checkbox':
                return this.renderCheckbox(item, itemId);
            case 'input':
                return this.renderInput(item, itemId);
            case 'question':
                return this.renderQuestion(item, itemId);
            default:
                return `<div class="item unsupported">Unsupported type: ${item.type}</div>`;
        }
    }

    renderRadioGroup(item, itemId) {
        const value = this.manager.currentData.responses[itemId];
        const answered = value !== undefined && value !== null ? 'answered' : '';

        let html = `<div class="item ${answered}">`;
        html += `<label class="item-label">${item.label}</label>`;
        html += '<div class="radio-group">';

        item.options?.forEach(opt => {
            const checked = value === opt.value ? 'checked' : '';
            html += `
                <label class="radio-option">
                    <input type="radio" name="${itemId}" value="${opt.value}" ${checked}
                           onchange="window.CPFClient.updateResponse('${itemId}', '${opt.value}')">
                    <span>${opt.label}</span>
                </label>
            `;
        });

        html += '</div></div>';
        return html;
    }

    renderRadioList(item, itemId) {
        const value = this.manager.currentData.responses[itemId];
        const answered = value !== undefined && value !== null ? 'answered' : '';

        let html = `<div class="item ${answered}">`;
        html += `<label class="item-label">${item.label}</label>`;
        html += '<div class="radio-list">';

        item.options?.forEach(opt => {
            const checked = value === opt.value ? 'checked' : '';
            html += `
                <label class="radio-item">
                    <input type="radio" name="${itemId}" value="${opt.value}" ${checked}
                           onchange="window.CPFClient.updateResponse('${itemId}', '${opt.value}')">
                    ${opt.label}
                </label>
            `;
        });

        html += '</div></div>';
        return html;
    }

    renderCheckbox(item, itemId) {
        const checked = this.manager.currentData.responses[itemId] === true ? 'checked' : '';
        const answered = this.manager.currentData.responses[itemId] !== undefined ? 'answered' : '';

        return `
            <div class="item ${answered}">
                <label class="checkbox-label">
                    <input type="checkbox" id="${itemId}" ${checked}
                           onchange="window.CPFClient.updateResponse('${itemId}', this.checked)">
                    <span>${item.label}</span>
                </label>
                ${item.sub_items ? this.renderSubItems(item.sub_items, itemId) : ''}
            </div>
        `;
    }

    renderInput(item, itemId) {
        const value = this.manager.currentData.responses[itemId] || '';
        const answered = value ? 'answered' : '';

        return `
            <div class="item ${answered}">
                <label class="item-label">${item.label}</label>
                <input type="text" id="${itemId}" value="${value}"
                       onchange="window.CPFClient.updateResponse('${itemId}', this.value)">
            </div>
        `;
    }

    renderQuestion(item, itemId) {
        const value = this.manager.currentData.responses[itemId];
        const followupValue = this.manager.currentData.responses[`${itemId}_followup`] || '';
        const answered = value !== undefined ? 'answered' : '';

        let html = `<div class="item ${answered}">`;
        html += `<label class="item-label">${item.label}</label>`;
        html += '<div class="question-options">';
        html += `
            <label>
                <input type="radio" name="${itemId}" value="yes" ${value === 'yes' ? 'checked' : ''}
                       onchange="window.CPFClient.updateResponse('${itemId}', 'yes')">
                Yes
            </label>
            <label>
                <input type="radio" name="${itemId}" value="no" ${value === 'no' ? 'checked' : ''}
                       onchange="window.CPFClient.updateResponse('${itemId}', 'no')">
                No
            </label>
        `;
        html += '</div>';

        if (value === 'yes') {
            html += `
                <textarea class="followup-textarea" placeholder="${item.followup || 'Please explain...'}"
                          onchange="window.CPFClient.updateResponse('${itemId}_followup', this.value)"
                          onblur="window.CPFClient.updateResponse('${itemId}_followup', this.value)">${followupValue}</textarea>
            `;
        }

        html += '</div>';
        return html;
    }

    renderSubItems(subItems, parentId) {
        let html = '<div class="sub-items">';
        subItems.forEach((subItem, subIdx) => {
            const subItemId = `${parentId}_sub${subIdx}`;
            const checked = this.manager.currentData.responses[subItemId] === true ? 'checked' : '';

            html += `
                <label class="sub-item">
                    <input type="checkbox" ${checked}
                           onchange="window.CPFClient.updateResponse('${subItemId}', this.checked)">
                    ${subItem.label}
                </label>
            `;
        });
        html += '</div>';
        return html;
    }
}

// ============================================
// SCORE DISPLAY CLASS
// ============================================

class ScoreDisplay {
    constructor(score, fieldKit) {
        this.score = score;
        this.fieldKit = fieldKit;
        this.container = document.getElementById('score-display') || this.createContainer();
    }

    createContainer() {
        const container = document.createElement('div');
        container.id = 'score-display';
        document.getElementById('content')?.appendChild(container);
        return container;
    }

    render() {
        if (!this.score || !this.container) return;

        const maturityConfig = this.fieldKit.scoring?.maturity_levels?.[this.score.maturity_level] || {
            color: '#888888',
            label: 'Unknown',
            description: 'Score calculated but maturity level not configured'
        };

        // Safely extract values with defaults
        const redFlagsCount = this.score.details?.red_flags?.count ?? 0;
        const answeredItems = this.score.details?.conversation_depth?.answered_items ?? 0;
        const totalItems = this.score.details?.conversation_depth?.total_items ?? 0;

        this.container.innerHTML = `
            <div class="score-card" style="border-left: 5px solid ${maturityConfig.color};">
                <h3>Assessment Score</h3>
                <div class="score-value" style="color: ${maturityConfig.color};">
                    ${(this.score.bayesian_score * 100).toFixed(1)}%
                </div>
                <div class="maturity-level" style="background: ${maturityConfig.color}20; color: ${maturityConfig.color};">
                    ${maturityConfig.label}
                </div>
                <div class="score-details">
                    <p><strong>Confidence:</strong> ${(this.score.confidence * 100).toFixed(0)}%</p>
                    <p><strong>Red Flags:</strong> ${redFlagsCount}</p>
                    <p><strong>Completion:</strong> ${answeredItems}/${totalItems} items</p>
                </div>
                <button class="btn btn-light" onclick="window.CPFClient.toggleScoreDetails()">
                    📊 Show Details
                </button>
            </div>
        `;
    }

    toggleDetails() {
        // TODO: Implement detailed score view
        alert('Detailed score view - TODO');
    }
}

// ============================================
// REPORT GENERATOR CLASS
// ============================================

class ReportGenerator {
    constructor(assessmentManager) {
        this.manager = assessmentManager;
    }

    async generate() {
        if (!this.manager.currentData.fieldKit) {
            alert('⚠️ No data to generate report');
            return;
        }

        // Recalculate score
        const calculator = new ScoreCalculator(
            this.manager.currentData.fieldKit,
            this.manager.currentData.responses
        );
        this.manager.currentScore = calculator.calculate();

        const html = this.buildReportHTML();

        const opt = {
            margin: 10,
            filename: `CPF_Report_${this.manager.currentData.fieldKit.indicator}_${Date.now()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        try {
            await html2pdf().set(opt).from(html).save();
            console.log('✅ Report generated');
        } catch (error) {
            console.error('❌ Failed to generate report:', error);
            alert('Failed to generate PDF report');
        }
    }

    buildReportHTML() {
        const { fieldKit, metadata, responses } = this.manager.currentData;
        const score = this.manager.currentScore;

        return `
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #333; }
                    .meta { background: #f5f5f5; padding: 10px; margin: 20px 0; }
                    .score { background: #e3f2fd; padding: 15px; margin: 20px 0; border-left: 4px solid #2196F3; }
                    .red-flags { margin: 20px 0; }
                    .flag-item { padding: 5px; margin: 5px 0; background: #fee; }
                </style>
            </head>
            <body>
                <h1>CPF Assessment Report</h1>
                <h2>${fieldKit.title}</h2>
                <p><strong>Indicator:</strong> ${fieldKit.indicator}</p>

                <div class="meta">
                    <p><strong>Date:</strong> ${metadata.date}</p>
                    <p><strong>Auditor:</strong> ${metadata.auditor}</p>
                    <p><strong>Client:</strong> ${metadata.client}</p>
                    <p><strong>Status:</strong> ${metadata.status}</p>
                </div>

                <div class="score">
                    <h3>Overall Score: ${(score.bayesian_score * 100).toFixed(1)}%</h3>
                    <p><strong>Maturity Level:</strong> ${score.maturity_level}</p>
                    <p><strong>Confidence:</strong> ${(score.confidence * 100).toFixed(0)}%</p>
                </div>

                <div class="red-flags">
                    <h3>Red Flags (${score.details.red_flags.count})</h3>
                    ${score.details.red_flags.red_flags_list.map(flag => `
                        <div class="flag-item">
                            <strong>${flag.flag}</strong> (Severity: ${flag.severity})
                        </div>
                    `).join('')}
                </div>

                ${metadata.notes ? `
                    <div class="notes">
                        <h3>Notes</h3>
                        <p>${metadata.notes}</p>
                    </div>
                ` : ''}
            </body>
            </html>
        `;
    }
}

// ============================================
// API CLIENT CLASS
// ============================================

class APIClient {
    static async loadIndicator(indicatorId, language = 'EN') {
        const langCode = CONFIG.languages.map[language] || 'en-US';
        const url = `/api/field-kit/${indicatorId}?lang=${langCode}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`❌ Failed to load indicator ${indicatorId}:`, error);
            throw error;
        }
    }

    static async loadQuickReference(language = 'EN') {
        const langCode = CONFIG.languages.map[language] || 'en-US';
        const url = `/api/quick-reference?lang=${langCode}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('❌ Failed to load quick reference:', error);
            throw error;
        }
    }
}

// ============================================
// QUICK REFERENCE MANAGER CLASS
// ============================================

class QuickReferenceManager {
    constructor() {
        this.referenceData = null;
        this.loadedLanguage = null;
    }

    async show(language = 'EN') {
        // Load reference if not cached or language changed
        if (!this.referenceData || this.loadedLanguage !== language) {
            try {
                this.referenceData = await APIClient.loadQuickReference(language);
                this.loadedLanguage = language;
            } catch (error) {
                alert('Failed to load quick reference');
                return;
            }
        }

        this.render();

        // Push to modal stack (for dashboard integration)
        if (typeof pushModal === 'function') {
            pushModal('reference-modal');
        }
    }

    render() {
        let modal = document.getElementById('reference-modal');
        if (!modal) {
            modal = this.createModal();
            document.body.appendChild(modal);
        }

        const container = modal.querySelector('.modal-body');
        if (!container || !this.referenceData) return;

        container.innerHTML = this.buildReferenceHTML();
        modal.style.display = 'block';
    }

    buildReferenceHTML() {
        let html = '<div class="reference-content">';

        this.referenceData.categories?.forEach(category => {
            const isExpanded = false;
            html += `
                <div class="category-section">
                    <div class="category-header" onclick="window.CPFClient.toggleCategory(${category.id})">
                        <span>${category.id}. ${category.name}</span>
                        <span class="toggle-icon">${isExpanded ? '▼' : '▶'}</span>
                    </div>
                    <div class="category-content" style="display: ${isExpanded ? 'block' : 'none'};" id="category-${category.id}">
                        ${category.indicators?.map(indicator => `
                            <div class="indicator-item" onclick="window.CPFClient.loadIndicatorFromReference('${indicator.id}')"
                                 title="Click to load this indicator">
                                <strong>${indicator.id}</strong> - ${indicator.name}
                            </div>
                        `).join('') || ''}
                    </div>
                </div>
            `;
        });

        html += '</div>';
        return html;
    }

    createModal() {
        const modal = document.createElement('div');
        modal.id = 'reference-modal';
        modal.className = 'cpf-client modal';
        modal.style.display = 'none';
        modal.onclick = (e) => {
            if (e.target.id === 'reference-modal') {
                this.close();
            }
        };

        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>📚 Quick Reference Guide</h2>
                    <button class="modal-close" onclick="window.CPFClient.closeQuickReference()">✕</button>
                </div>
                <div class="modal-body"></div>
            </div>
        `;

        return modal;
    }

    toggleCategory(categoryId) {
        const content = document.getElementById(`category-${categoryId}`);
        if (content) {
            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? 'block' : 'none';

            // Update icon
            const header = content.previousElementSibling;
            const icon = header?.querySelector('.toggle-icon');
            if (icon) {
                icon.textContent = isHidden ? '▼' : '▶';
            }
        }
    }

    async loadIndicator(indicatorId) {
        this.close();

        try {
            const data = await APIClient.loadIndicator(indicatorId, this.loadedLanguage);
            const renderer = new FieldKitRenderer(window.CPFClient._manager);
            renderer.render(data);
        } catch (error) {
            alert(`Failed to load indicator ${indicatorId}`);
        }
    }

    close() {
        const modal = document.getElementById('reference-modal');
        if (modal) {
            modal.style.display = 'none';
        }

        // Pop from modal stack
        if (typeof popModal === 'function') {
            popModal();
        }
    }
}

// ============================================
// FILE IMPORT/EXPORT UTILITIES
// ============================================

class FileManager {
    static importJSON(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                if (data.fieldKit && window.CPFClient._manager) {
                    window.CPFClient._manager.currentData = data;
                    const renderer = new FieldKitRenderer(window.CPFClient._manager);
                    renderer.render(data.fieldKit);

                    console.log('✅ JSON imported successfully');
                } else {
                    throw new Error('Invalid JSON format');
                }
            } catch (error) {
                console.error('❌ Import failed:', error);
                alert('Failed to import JSON file');
            }
        };
        reader.readAsText(file);
    }

    static async loadExistingExport(exportData) {
        if (!window.CPFClient._manager) return;

        const manager = window.CPFClient._manager;

        // Restore field kit
        if (exportData.fieldKit) {
            const renderer = new FieldKitRenderer(manager);
            renderer.render(exportData.fieldKit);
        }

        // Restore metadata
        if (exportData.metadata) {
            manager.currentData.metadata = exportData.metadata;
        }

        // Restore responses
        if (exportData.responses) {
            manager.currentData.responses = exportData.responses;
        }

        // Restore score
        if (exportData.score) {
            manager.currentScore = exportData.score;
            manager.updateScoreDisplay();
        }

        // Re-render to show restored data
        if (exportData.fieldKit) {
            const renderer = new FieldKitRenderer(manager);
            renderer.render(exportData.fieldKit);
        }

        console.log('✅ Existing export loaded');
    }
}

// ============================================
// GLOBAL NAMESPACE EXPORT
// ============================================

// Create singleton instance
const assessmentManager = new AssessmentManager();
const quickReferenceManager = new QuickReferenceManager();

// Export to window for dashboard compatibility
window.CPFClient = {
    // Internal reference (for class access)
    _manager: assessmentManager,
    _quickRef: quickReferenceManager,

    // Data (for dashboard read/write access)
    get organizationContext() { return assessmentManager.organizationContext; },
    get currentData() { return assessmentManager.currentData; },
    get score() { return assessmentManager.currentScore; },

    // Core functions
    async loadJSON(indicatorId, languageOverride = null) {
        const lang = languageOverride || assessmentManager.organizationContext.language;
        const langCode = Object.keys(CONFIG.languages.map).find(
            key => CONFIG.languages.map[key] === lang
        ) || 'EN';

        try {
            const data = await APIClient.loadIndicator(indicatorId, langCode);
            const renderer = new FieldKitRenderer(assessmentManager);
            renderer.render(data);
        } catch (error) {
            alert(`Failed to load indicator ${indicatorId}`);
        }
    },

    renderFieldKit(data) {
        const renderer = new FieldKitRenderer(assessmentManager);
        renderer.render(data);
    },

    // Data management
    updateMeta(field, value) {
        assessmentManager.updateMeta(field, value);
    },

    updateResponse(id, value) {
        assessmentManager.updateResponse(id, value);
    },

    // Consolidated update function (replaces updateResponseWithAutoScore and selectRadioOption)
    updateResponseWithAutoScore(id, value) {
        assessmentManager.updateResponse(id, value);
    },

    selectRadioOption(itemId, value) {
        assessmentManager.updateResponse(itemId, value);
    },

    // Save/Export
    async saveToAPI() {
        return await assessmentManager.saveToAPI();
    },

    saveData() {
        assessmentManager.saveToAPI().catch(error => {
            alert('Failed to save: ' + error.message);
        });
    },

    exportData() {
        assessmentManager.exportData();
    },

    // Report
    generateReport() {
        const generator = new ReportGenerator(assessmentManager);
        generator.generate();
    },

    // Score calculation
    calculateIndicatorScore() {
        if (assessmentManager.currentData.fieldKit?.scoring) {
            const calculator = new ScoreCalculator(
                assessmentManager.currentData.fieldKit,
                assessmentManager.currentData.responses
            );
            assessmentManager.currentScore = calculator.calculate();
            assessmentManager.updateScoreDisplay();
        }
    },

    toggleScoreDetails() {
        const scoreDisplay = new ScoreDisplay(
            assessmentManager.currentScore,
            assessmentManager.currentData.fieldKit
        );
        scoreDisplay.toggleDetails();
    },

    toggleDetailedAnalysis() {
        // Alias for dashboard compatibility
        this.toggleScoreDetails();
    },

    // Quick Reference
    showQuickReference() {
        const lang = Object.keys(CONFIG.languages.map).find(
            key => CONFIG.languages.map[key] === assessmentManager.organizationContext.language
        ) || 'EN';
        quickReferenceManager.show(lang);
    },

    closeQuickReference() {
        quickReferenceManager.close();
    },

    toggleCategory(categoryId) {
        quickReferenceManager.toggleCategory(categoryId);
    },

    loadIndicatorFromReference(indicatorId) {
        quickReferenceManager.loadIndicator(indicatorId);
    },

    // File operations
    importJSON(event) {
        FileManager.importJSON(event);
    },

    loadExistingExport(exportData) {
        FileManager.loadExistingExport(exportData);
    },

    // Reset
    resetAll() {
        assessmentManager.resetAll();
    }
};

// ============================================
// INITIALIZATION
// ============================================

window.addEventListener('DOMContentLoaded', () => {
    // Check if we're integrated into dashboard
    const isDashboardIntegrated = document.querySelector('.dashboard-container') !== null;

    if (isDashboardIntegrated) {
        console.log('🎯 CPF Client v3.0 - Dashboard integration detected');
        console.log('✅ CPFClient namespace available');
        return;
    }

    // Standalone mode - parse URL parameters
    const params = new URLSearchParams(window.location.search);
    const indicatorId = params.get('indicator');
    const orgId = params.get('orgId');
    const orgName = params.get('orgName');
    const language = params.get('lang') || 'en-US';

    if (orgId && orgName) {
        assessmentManager.organizationContext.orgId = orgId;
        assessmentManager.organizationContext.orgName = orgName;
        assessmentManager.organizationContext.language = language;

        // Display org info
        const orgInfo = document.getElementById('organization-info');
        const orgNameDisplay = document.getElementById('org-name-display');
        const orgIdDisplay = document.getElementById('org-id-display');

        if (orgInfo && orgNameDisplay && orgIdDisplay) {
            orgInfo.style.display = 'block';
            orgNameDisplay.textContent = orgName;
            orgIdDisplay.textContent = orgId;
        }
    }

    if (indicatorId) {
        window.CPFClient.loadJSON(indicatorId);
    } else {
        // Try to restore from localStorage
        const saved = localStorage.getItem('cpf_current');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.fieldKit) {
                    FileManager.loadExistingExport(data);
                }
            } catch (error) {
                console.error('Failed to restore saved data:', error);
            }
        }
    }

    console.log('🚀 CPF Client v3.0 initialized (standalone mode)');
});

console.log('✅ CPF Client v3.0 loaded');
