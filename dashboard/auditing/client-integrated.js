// ============================================
// CLIENT V2.0 - WRAPPED IN NAMESPACE TO AVOID CONFLICTS
// ============================================
(function() {
'use strict';

// Organization context (loaded from URL parameters or dashboard)
let organizationContext = {
    orgId: null,
    orgName: null,
    language: 'en-US'
};

let currentData = {
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

// Auto-save to localStorage every 30 seconds (backup)
setInterval(() => {
    if (currentData.fieldKit) {
        localStorage.setItem('cpf_current', JSON.stringify(currentData));
    }
}, 30000);

// ============================================
// INITIALIZATION - Load Organization Context
// ============================================

// NOTE: URL parameter handling moved to unified DOMContentLoaded listener at the end of this file
// This avoids duplicate event listeners and ensures proper initialization order

// Display organization information in header
function displayOrganizationInfo() {
    const orgInfo = document.getElementById('organization-info');
    const orgNameDisplay = document.getElementById('org-name-display');
    const orgIdDisplay = document.getElementById('org-id-display');

    if (orgInfo && orgNameDisplay && orgIdDisplay) {
        orgInfo.style.display = 'block';
        orgNameDisplay.textContent = organizationContext.orgName;
        orgIdDisplay.textContent = organizationContext.orgId;
    }
}

// Map ISO language code to short code
function mapISOToLangCode(isoLang) {
    const mapping = {
        'en-US': 'EN',
        'it-IT': 'IT',
        'es-ES': 'ES',
        'fr-FR': 'FR',
        'de-DE': 'DE'
    };
    return mapping[isoLang] || 'EN';
}

// Language code mapping
const LANG_MAP = {
    'EN': 'en-US',
    'IT': 'it-IT',
    'ES': 'es-ES',
    'FR': 'fr-FR',
    'DE': 'de-DE'
};

// Category mapping
// Use existing CATEGORY_MAP from dashboard.js if available, otherwise define it
window.CATEGORY_MAP = window.CATEGORY_MAP || {
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
const CATEGORY_MAP = window.CATEGORY_MAP;

// Category details for dropdown
const CATEGORIES = [
    { num: 1, name: 'authority', label: 'Authority-Based Vulnerabilities' },
    { num: 2, name: 'temporal', label: 'Temporal Vulnerabilities' },
    { num: 3, name: 'social', label: 'Social Influence Vulnerabilities' },
    { num: 4, name: 'affective', label: 'Affective Vulnerabilities' },
    { num: 5, name: 'cognitive', label: 'Cognitive Overload Vulnerabilities' },
    { num: 6, name: 'group', label: 'Group Dynamic Vulnerabilities' },
    { num: 7, name: 'stress', label: 'Stress Response Vulnerabilities' },
    { num: 8, name: 'unconscious', label: 'Unconscious Process Vulnerabilities' },
    { num: 9, name: 'ai', label: 'AI-Specific Bias Vulnerabilities' },
    { num: 10, name: 'convergent', label: 'Critical Convergent States' }
];

// Language options
const LANGUAGES = [
    { code: 'EN', iso: 'en-US', label: 'English' },
    { code: 'IT', iso: 'it-IT', label: 'Italiano' },
    { code: 'ES', iso: 'es-ES', label: 'Español' },
    { code: 'FR', iso: 'fr-FR', label: 'Français' },
    { code: 'DE', iso: 'de-DE', label: 'Deutsch' }
];

async function loadJSON() {
    // Priority order: manual input field > dropdowns > prompt
    const manualInput = document.getElementById('indicator-input');
    const langSelect = document.getElementById('lang-select');
    const categorySelect = document.getElementById('category-select');
    const indicatorSelect = document.getElementById('indicator-select');

    let input;

    // 1. Check manual input field first (highest priority)
    if (manualInput && manualInput.value.trim()) {
        input = manualInput.value.trim();
        // Clear the input field after use
        manualInput.value = '';
    }
    // 2. Use dropdown values if manual input is empty
    else if (langSelect && categorySelect && indicatorSelect) {
        const lang = langSelect.value;
        const category = categorySelect.value;
        const indicator = indicatorSelect.value;
        input = `${category}.${indicator}-${lang}`;
    }
    // 3. Fallback to prompt (backward compatibility)
    else {
        input = prompt('Enter indicator (format: X.Y-LANG or X.Y for en-US)\nExamples: 1.3-IT, 2.1-EN, 1.3');
        if (!input) return;
    }

    try {
        let fetchUrl = input;

        // Check if it's an indicator format (X.Y or X.Y-LANG)
        const indicatorMatch = input.match(/^(\d{1,2})\.(\d{1,2})(?:-([A-Z]{2}))?$/i);

        if (indicatorMatch) {
            const indicator = `${indicatorMatch[1]}.${indicatorMatch[2]}`;
            const lang = indicatorMatch[3] || 'EN';

            // Map language code to ISO format
            const isoLang = LANG_MAP[lang.toUpperCase()] || 'en-US';

            // Get category info
            const categoryNum = indicatorMatch[1];
            const categoryName = CATEGORY_MAP[categoryNum];

            if (!categoryName) {
                throw new Error(`Invalid category number: ${categoryNum}. Must be 1-10.`);
            }

            // Construct local URL for multilingual structure
            fetchUrl = `/auditor-field-kit/interactive/${isoLang}/${categoryNum}.x-${categoryName}/indicator_${indicator}.json`;
            console.log('Loading from:', fetchUrl);
        }

        const response = await fetch(fetchUrl);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Indicator not found. The JSON file may not exist yet at: ${fetchUrl}`);
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        currentData.fieldKit = data;
        renderFieldKit(data);
    } catch (error) {
        alert('Error loading JSON: ' + error.message);
        console.error('Load error:', error);
    }
}

function importJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.fieldKit && data.metadata && data.responses) {
                currentData = data;
                renderFieldKit(data.fieldKit);
            } 
            else if (data.indicator && data.sections) {
                currentData.fieldKit = data;
                currentData.metadata = {
                    date: new Date().toISOString().split('T')[0],
                    auditor: '',
                    client: '',
                    status: 'in-progress',
                    notes: ''
                };
                currentData.responses = {};
                renderFieldKit(data);
            } 
            else {
                throw new Error('Unrecognized JSON structure');
            }
        } catch (error) {
            alert('Invalid JSON file: ' + error.message);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function renderFieldKit(data) {
    document.getElementById('header').innerHTML = `
        <div class="header-content">
            <h1>Indicator ${data.indicator} Field Kit</h1>
            <div class="subtitle">${data.subtitle || data.title}</div>
            <div class="indicator-badge">${data.category}</div>
        </div>
    `;
    
    const metadataBar = document.getElementById('metadata-bar');
    metadataBar.style.display = 'grid';
    metadataBar.innerHTML = `
        <div class="meta-field">
            <label>Assessment Date</label>
            <input type="date" value="${currentData.metadata.date}" onchange="window.CPFClient.updateMeta('date', this.value)">
        </div>
        <div class="meta-field">
            <label>Auditor</label>
            <input type="text" value="${currentData.metadata.auditor}" onchange="window.CPFClient.updateMeta('auditor', this.value)" placeholder="Your name">
        </div>
        <div class="meta-field">
            <label>Client</label>
            <input type="text" value="${currentData.metadata.client}" onchange="window.CPFClient.updateMeta('client', this.value)" placeholder="Client name">
        </div>
        <div class="meta-field">
            <label>Status</label>
            <select onchange="window.CPFClient.updateMeta('status', this.value)">
                <option value="in-progress" ${currentData.metadata.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                <option value="completed" ${currentData.metadata.status === 'completed' ? 'selected' : ''}>Completed</option>
                <option value="review" ${currentData.metadata.status === 'review' ? 'selected' : ''}>Under Review</option>
            </select>
        </div>
        <div class="meta-field" style="grid-column: 1 / -1;">
            <label>Notes</label>
            <textarea id="assessment-notes"
                      placeholder="Assessment notes..."
                      style="width: 100%; padding: 10px; border: 2px solid var(--border); border-radius: 8px; min-height: 80px; font-family: inherit; font-size: 14px; resize: vertical;"
                      onchange="window.CPFClient.updateMeta('notes', this.value)"
                      onblur="window.CPFClient.updateMeta('notes', this.value)">${currentData.metadata.notes || ''}</textarea>
        </div>
    `;
    
    const content = document.getElementById('content');
    let html = '';
    
    data.sections.forEach((section, sIdx) => {
        html += `
            <div class="section">
                <div class="section-header">
                    <div class="section-icon">${section.icon}</div>
                    <div class="section-title">${section.title}</div>
                    ${section.time ? `<div class="section-time">${section.time} minutes</div>` : ''}
                </div>
        `;
        
        // Render items principali
        section.items.forEach((item, iIdx) => {
            const itemId = `s${sIdx}_i${iIdx}`;
            html += renderItem(item, itemId);
        });
        
        // Render subsections
        section.subsections.forEach((sub, subIdx) => {
            html += `
                <div class="subsection">
                    <h3 class="subsection-title">${sub.title}</h3>
                    <div class="checkbox-list">
            `;
            sub.items.forEach((item, iIdx) => {
                const itemId = `s${sIdx}_sub${subIdx}_i${iIdx}`;
                html += renderItem(item, itemId);
            });
            html += `</div></div>`;
        });
        
        html += `</div>`;
    });
    
    content.innerHTML = html;
    document.getElementById('action-bar').style.display = 'flex';
    document.getElementById('action-bar').innerHTML = `
        <div style="display: flex; gap: 15px;">
            <button class="btn btn-secondary" onclick="window.CPFClient.saveData()">💾 Save</button>
            <button class="btn btn-warning" onclick="window.CPFClient.calculateIndicatorScore()">🧮 Calculate Score</button>
            <button class="btn btn-info" onclick="window.CPFClient.validateCurrentJSON()">✓ Validate</button>
        </div>
        <div style="display: flex; gap: 15px;">
            <button class="btn btn-success" onclick="window.CPFClient.exportData()">📥 Export</button>
            <button class="btn btn-primary" onclick="window.CPFClient.generateReport()">📊 Report</button>
        </div>
    `;

    // Auto-calculate score on load if scoring is available
    if (data.scoring) {
        calculateIndicatorScore();
    }
}

function renderItem(item, itemId) {
    const value = currentData.responses[itemId];

    // Debug: log when we have a value
    if (value !== undefined && value !== null && value !== '') {
        console.log(`✅ Found value for ${itemId}:`, value);
    }

    if (item.type === 'radio-group') {
        return `
            <div class="question-group">
                <div class="question-title">                        
                    ${item.number ? `<span class="question-number">${item.number}</span>` : ''}
                    <span>${item.title}</span>
                </div>
                <div class="radio-group">
                    ${item.options.map(opt => `
                        <div class="radio-option ${opt.value}">
                            <input type="radio" name="${itemId}" id="${itemId}_${opt.value}" value="${opt.value}"
                                    ${value === opt.value ? 'checked' : ''}
                                    onchange="window.CPFClient.updateResponseWithAutoScore('${itemId}', '${opt.value}')">
                            <label for="${itemId}_${opt.value}" class="radio-label">
                                ${opt.label}
                            </label>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    else if (item.type === 'radio-list') {
        return `
            <div class="question-group" data-item-id="${itemId}">
                <div class="question-title">                        
                    ${item.number ? `<span class="question-number">${item.number}</span>` : ''}
                    <span>${item.title}</span>
                </div>
                <div class="checkbox-list">
                    ${item.options.map(opt => {
                        const isChecked = value === opt.value;
                        return `
                            <label class="checkbox-item ${isChecked ? 'checked' : ''}" 
                                   data-value="${opt.value}">
                                <input type="checkbox" 
                                       ${isChecked ? 'checked' : ''}
                                       onchange="window.CPFClient.selectRadioOption('${itemId}', '${opt.value}')">
                                <span class="checkbox-label">${opt.label}</span>
                            </label>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    else if (item.type === 'checkbox') {
        const checked = value ? 'checked' : '';
        let html = `
            <div class="checkbox-item ${checked}">
                <input type="checkbox" id="${itemId}" ${checked} onchange="window.CPFClient.updateResponseWithAutoScore('${itemId}', this.checked)">
                <label for="${itemId}">${item.label}</label>
            </div>
        `;
        
        // Gestione subitems
        if (item.subitems && Array.isArray(item.subitems) && item.subitems.length > 0) {
            html += '<div class="nested-items" style="margin-left: 25px; margin-top: 8px;">';
            item.subitems.forEach((sub, subIdx) => {
                const subItemId = `${itemId}_sub${subIdx}`;
                if (sub.type === 'checkbox') {
                    const subValue = currentData.responses[subItemId] || false;
                    html += `
                        <div class="checkbox-item ${subValue ? 'checked' : ''}" style="display: inline-block; margin-right: 15px;">
                            <input type="checkbox" id="${subItemId}" ${subValue ? 'checked' : ''} 
                                   onchange="window.CPFClient.updateResponse('${subItemId}', this.checked)">
                            <label for="${subItemId}">${sub.label}</label>
                        </div>
                    `;
                }
                else if (sub.type === 'radio') {
                    const subValue = currentData.responses[`${itemId}_radio_value`];
                    html += `
                        <div class="radio-option" style="display: inline-block; margin-right: 15px;">
                            <input type="radio" name="${itemId}_radio" id="${subItemId}" value="${sub.label}" 
                                   ${subValue === sub.label ? 'checked' : ''}
                                   onchange="window.CPFClient.updateResponse('${itemId}_radio_value', this.value)">
                            <label for="${subItemId}">${sub.label}</label>
                        </div>
                    `;
                }
                else if (sub.type === 'input') {
                    html += `
                        <div class="input-group" style="margin: 10px 0;">
                            <input type="text" id="${subItemId}" value="${currentData.responses[subItemId] || ''}"
                                   placeholder="${sub.label}" onchange="window.CPFClient.updateResponse('${subItemId}', this.value)"
                                   style="padding: 6px; width: 200px;">
                        </div>
                    `;
                }
            });
            html += '</div>';
        }
        return html;
    }

    else if (item.type === 'input') {
        return `
            <div class="input-group">
                <label>${item.label}</label>
                <input type="text" id="${itemId}" value="${value || ''}" onchange="window.CPFClient.updateResponse('${itemId}', this.value)">
            </div>
        `;
    }

    else if (item.type === 'question') {
        let html = `
            <div class="question-group" style="margin-bottom: 25px;">
                <div class="question-title" style="font-size: 16px; font-weight: 600; color: var(--primary); margin-bottom: 15px;">
                    ${item.text}
                </div>
        `;
        if (item.followups && item.followups.length > 0) {
            html += `<div style="margin-left: 20px; margin-top: 10px;">`;
            item.followups.forEach((followup, fIdx) => {
                const followupId = `${itemId}_f${fIdx}`;
                const followupValue = currentData.responses[followupId] || '';
                html += `
                    <div style="margin-bottom: 10px;">
                        <div style="font-size: 14px; color: var(--text-light); margin-bottom: 5px;">
                            <em>${followup.type}:</em> ${followup.text}
                        </div>
                        <textarea id="${followupId}"
                                  placeholder="Notes..."
                                  style="width: 100%; padding: 10px; border: 2px solid var(--border); border-radius: 8px; min-height: 60px; font-family: inherit; font-size: 14px;"
                                  onchange="window.CPFClient.updateResponseWithAutoScore('${followupId}', this.value)"
                                  onblur="window.CPFClient.updateResponseWithAutoScore('${followupId}', this.value)">${followupValue}</textarea>
                    </div>
                `;
            });
            html += `</div>`;
        }
        html += `</div>`;
        return html;
    }

    return '<div>[Unsupported item type]</div>';
}

function updateMeta(field, value) {
    currentData.metadata[field] = value;
    // Auto-save immediately
    autoSave();
}

function updateResponse(id, value) {
    currentData.responses[id] = value;
    const elem = document.getElementById(id);
    if (elem && elem.type === 'checkbox') {
        const item = elem.closest('.checkbox-item');
        if (value) {
            item.classList.add('checked');
        } else {
            item.classList.remove('checked');
        }
    }

    // Aggiorna anche le radio list con grafica checkbox
    const radioContainer = document.querySelector(`[data-item-id="${id}"]`);
    if (radioContainer) {
        const allOptions = radioContainer.querySelectorAll('.checkbox-item');
        allOptions.forEach(item => {
            item.classList.remove('checked');
        });

        const selectedOption = radioContainer.querySelector(`[data-value="${value}"]`);
        if (selectedOption) {
            selectedOption.classList.add('checked');
        }
    }

    // Auto-calculate score when responses change (silent, no UI alert)
    if (currentData.fieldKit && currentData.fieldKit.scoring) {
        calculateIndicatorScore();
    }

    // Auto-save immediately
    autoSave();
}

async function saveData() {
    // Save to localStorage as backup
    localStorage.setItem('cpf_current', JSON.stringify(currentData));

    // If organization context available, save to API
    if (organizationContext.orgId && currentScore) {
        try {
            await saveToAPI();
            alert('✅ Assessment saved successfully!');
        } catch (error) {
            console.error('❌ Save to API failed:', error);
            alert('⚠️ Saved locally, but API save failed. Check console for details.');
        }
    } else {
        alert('✅ Assessment saved to browser storage!');
    }
}

// ============================================
// AUTO-SAVE TO API (V2.0)
// ============================================

async function autoSave() {
    if (!currentData.fieldKit) {
        return;
    }

    // Always save to localStorage as backup
    localStorage.setItem('cpf_current', JSON.stringify(currentData));
    console.log('✅ Local auto-save at', new Date().toLocaleTimeString());

    // If organization context is available, save IMMEDIATELY to API (no debounce!)
    if (organizationContext.orgId && currentScore) {
        try {
            await saveToAPI();
        } catch (error) {
            console.error('❌ Auto-save to API failed:', error);
            // Continue silently - localStorage backup is still working
        }
    }
}

async function saveToAPI() {
    if (!organizationContext.orgId) {
        console.warn('⚠️ No organization context - cannot save to API');
        alert('⚠️ No organization context available');
        return;
    }

    // Auto-calculate score if not present
    if (!currentScore) {
        console.log('📊 Auto-calculating score before save...');
        calculateIndicatorScore();

        // Wait a moment for score to be calculated
        await new Promise(resolve => setTimeout(resolve, 500));

        if (!currentScore) {
            console.warn('⚠️ Score calculation failed - cannot save to API');
            alert('⚠️ Unable to calculate score. Please fill in the required fields.');
            return;
        }
    }

    const indicator = currentData.fieldKit.indicator;
    const timestamp = new Date().toISOString();

    // Extract red flags as array of strings for dashboard display
    const redFlagsArray = currentScore.details?.red_flags_list?.map(item => item.flag) || [];

    // Calculate dynamic confidence based on conversation completeness
    // Formula: confidence = 0.5 + (completion_rate * 0.45)
    // This gives a range of 0.5 (no questions answered) to 0.95 (all questions answered)
    const completionRate = currentScore.details?.conversation_breakdown?.completion_rate || 0;
    const calculatedConfidence = 0.5 + (completionRate * 0.45);

    // Round to 2 decimal places
    const confidence = Math.round(calculatedConfidence * 100) / 100;

    // Prepare assessment data for API
    const assessmentData = {
        indicator_id: indicator,
        title: currentData.fieldKit.title || '',
        category: currentData.fieldKit.category || '',
        bayesian_score: currentScore.final_score,
        confidence: confidence, // Dynamic confidence based on conversation completeness
        maturity_level: currentScore.maturity_level || 'yellow',
        assessor: currentData.metadata.auditor || 'Client User',
        assessment_date: timestamp,
        raw_data: {
            quick_assessment: currentScore.details?.quick_assessment_breakdown || {},
            client_conversation: {
                responses: currentData.responses || {},
                scores: currentScore,
                metadata: currentData.metadata,
                notes: currentData.metadata.notes || '',
                red_flags: redFlagsArray
            }
        }
    };

    console.log('💾 Saving assessment to API:', {
        orgId: organizationContext.orgId,
        indicator,
        score: currentScore.final_score,
        confidence: confidence,
        maturity_level: currentScore.maturity_level,
        completion_rate: completionRate
    });

    const response = await fetch(`/api/organizations/${organizationContext.orgId}/assessments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(assessmentData)
    });

    const result = await response.json();

    if (result.success) {
        console.log('✅ Assessment saved to API successfully');
        showAutoSaveIndicator();

        // Reload organization data in background (no modal close)
        if (window.dashboardReloadOrganization) {
            window.dashboardReloadOrganization().catch(err => {
                console.error('Failed to reload org data:', err);
            });
        }
    } else {
        throw new Error(result.error || 'API save failed');
    }
}

function showAutoSaveIndicator() {
    const indicator = document.getElementById('auto-save-status');
    if (indicator) {
        indicator.style.display = 'inline';
        indicator.textContent = '✓ Auto-saved';
        indicator.style.color = '#4CAF50';

        // Hide after 3 seconds
        setTimeout(() => {
            indicator.style.display = 'none';
        }, 3000);
    }
}

function exportData() {
    // Calculate score before export if not already done
    if (!currentData.score && currentData.fieldKit) {
        calculateIndicatorScore();
    }

    const blob = new Blob([JSON.stringify(currentData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cpf_${currentData.fieldKit.indicator}_${currentData.metadata.client}_${currentData.metadata.date}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function generateReport() {
    if (!currentData.fieldKit) {
        alert('No assessment loaded');
        return;
    }
    
    // Calculate score if not already calculated
    if (!currentData.score) {
        calculateIndicatorScore();
    }
    
    const maturityConfig = currentData.fieldKit.scoring?.maturity_levels?.[currentScore.maturity_level];
    const scorePercentage = (currentScore.final_score * 100).toFixed(1);
    
    const report = document.createElement('div');
    report.innerHTML = `
        <div style="font-family: Arial; padding: 20px; max-width: 800px;">
            <div style="background: #1a1a2e; color: white; padding: 20px; margin-bottom: 20px;">
                <h1>CPF Indicator ${currentData.fieldKit.indicator}</h1>
                <h2>${currentData.fieldKit.title}</h2>
            </div>
            <div style="margin-bottom: 20px; padding: 10px; background: #f5f5f5;">
                <strong>Date:</strong> ${currentData.metadata.date} | 
                <strong>Auditor:</strong> ${currentData.metadata.auditor}<br>
                <strong>Client:</strong> ${currentData.metadata.client} | 
                <strong>Status:</strong> ${currentData.metadata.status}
            </div>
            
            <!-- SCORE SECTION IN PDF -->
            <div style="margin-bottom: 30px; padding: 20px; background: ${maturityConfig?.color}15; border-left: 5px solid ${maturityConfig?.color};">
                <h2 style="margin: 0 0 15px 0; color: ${maturityConfig?.color};">
                    📊 Assessment Score: ${scorePercentage}%
                </h2>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 15px;">
                    <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Quick Assessment (70%)</div>
                        <div style="font-size: 24px; font-weight: bold; color: #1a1a2e;">
                            ${(currentScore.quick_assessment * 100).toFixed(1)}%
                        </div>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Red Flags (30%)</div>
                        <div style="font-size: 24px; font-weight: bold; color: #1a1a2e;">
                            ${(currentScore.red_flags * 100).toFixed(1)}%
                        </div>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 8px; text-align: center; border: 2px dashed #888;">
                        <div style="font-size: 12px; color: #888; margin-bottom: 5px;">Conversation Completeness</div>
                        <div style="font-size: 24px; font-weight: bold; color: #666;">
                            ${currentScore.details.conversation_breakdown.answered_questions}/${currentScore.details.conversation_breakdown.total_questions}
                        </div>
                        <div style="font-size: 10px; color: #999; margin-top: 3px;">(informational)</div>
                    </div>
                </div>
                <div style="background: white; padding: 15px; border-radius: 8px;">
                    <strong style="color: ${maturityConfig?.color};">Maturity Level: ${maturityConfig?.label}</strong><br>
                    <span style="font-size: 14px; color: #555;">${maturityConfig?.description}</span>
                </div>
            </div>
            
            ${currentData.fieldKit.sections.map((section, sIdx) => `
                <div style="margin-bottom: 20px; page-break-inside: avoid;">
                    <div style="background: #e0e0e0; padding: 10px; margin-bottom: 10px;">
                        <strong>${section.icon} ${section.title}</strong>
                    </div>
                    ${section.items.map((item, iIdx) => {
                        const itemId = `s${sIdx}_i${iIdx}`;
                        const response = currentData.responses[itemId];
                        if (item.type === 'radio-list' || item.type === 'radio-group') {
                            const selectedOption = item.options.find(opt => opt.value === response);
                            const selectedLabel = selectedOption ? selectedOption.label : 'N/A';
                            return `<div style="margin: 10px 0;">
                                <div><strong>${item.number ? item.number + '. ' : ''}${item.title}</strong></div>
                                <div style="margin-left: 20px;">→ ${selectedLabel}</div>
                            </div>`;
                        }
                        else if (item.type === 'checkbox') {
                            return `<div style="margin: 5px 0;">${response ? '[✓]' : '[ ]'} ${item.label}</div>`;
                        }
                        else if (item.type === 'input') {
                            return `<div style="margin: 10px 0;">
                                <strong>${item.label}:</strong><br>
                                <div style="margin-left: 20px;">${response || '_____'}</div>
                            </div>`;
                        }
                        return '';
                    }).join('')}
                    ${(section.subsections || []).map((sub, subIdx) => `
                        <div style="margin: 15px 0; padding-left: 10px; border-left: 3px solid #ccc;">
                            <h3 style="font-size: 14px; margin: 10px 0;">${sub.title}</h3>
                            ${sub.items.map((item, iIdx) => {
                                const itemId = `s${sIdx}_sub${subIdx}_i${iIdx}`;
                                const response = currentData.responses[itemId];
                               if (item.type === 'radio-list' || item.type === 'radio-group') {
                                    const selectedOption = item.options.find(opt => opt.value === response);
                                    const selectedLabel = selectedOption ? selectedOption.label : 'N/A';
                                    return `<div style="margin: 10px 0;">
                                        <div><strong>${item.number ? item.number + '. ' : ''}${item.title}</strong></div>
                                        <div style="margin-left: 20px;">→ ${selectedLabel}</div>
                                    </div>`;
                                }
                                else if (item.type === 'checkbox') {
                                    return `<div style="margin: 5px 0;">${response ? '[✓]' : '[ ]'} ${item.label}</div>`;
                                }
                                else if (item.type === 'question') {
                                    let questionHTML = `<div style="margin: 15px 0;">
                                        <div style="font-weight: bold; color: #1a1a2e; margin-bottom: 8px;">${item.text}</div>`;
                                    
                                    if (item.followups) {
                                        item.followups.forEach((followup, fIdx) => {
                                            const followupId = `${itemId}_f${fIdx}`;
                                            const followupResponse = currentData.responses[followupId] || '';
                                            questionHTML += `
                                                <div style="margin-left: 20px; margin-top: 8px;">
                                                    <em style="font-size: 13px; color: #666;">${followup.text}</em><br>
                                                    <div style="margin-left: 15px; padding: 8px; background: #f9f9f9; border-left: 3px solid #ddd;">
                                                        ${followupResponse || '<em style="color: #999;">No response</em>'}
                                                    </div>
                                                </div>
                                            `;
                                        });
                                    }
                                    questionHTML += `</div>`;
                                    return questionHTML;
                                }
                                return '';
                            }).join('')}
                        </div>
                    `).join('')}
                </div>
            `).join('')}
            
            <div style="margin-top: 30px; padding: 15px; background: #f0f0f0; border-radius: 8px;">
                <small style="color: #666;">
                    Generated by CPF Field Kit Client | ${new Date().toLocaleString()} | 
                    Framework: cpf3.org
                </small>
            </div>
        </div>
    `;
    
    document.body.appendChild(report);
    const opt = {
        margin: 10,
        filename: `cpf_${currentData.fieldKit.indicator}_${currentData.metadata.client}_${currentData.metadata.date}_SCORED.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    
    html2pdf().from(report).set(opt).save();
    document.body.removeChild(report);
    alert('✅ PDF generated with score analysis');
}

function selectRadioOption(itemId, value) {
    // Aggiorna i dati
    currentData.responses[itemId] = value;

    // Aggiorna l'interfaccia - rimuove 'checked' da tutti e lo aggiunge a quello selezionato
    const container = document.querySelector(`[data-item-id="${itemId}"]`);
    if (container) {
        const allOptions = container.querySelectorAll('.checkbox-item');
        allOptions.forEach(item => {
            item.classList.remove('checked');
            // Deseleziona tutti i checkbox
            const checkbox = item.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.checked = false;
            }
        });

        const selectedOption = container.querySelector(`[data-value="${value}"]`);
        if (selectedOption) {
            selectedOption.classList.add('checked');
            // Seleziona solo il checkbox cliccato
            const checkbox = selectedOption.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.checked = true;
            }
        }
    }

    // Auto-calculate score when responses change (silent, no UI alert)
    if (currentData.fieldKit && currentData.fieldKit.scoring) {
        calculateIndicatorScore();
    }

    // Auto-save immediately
    autoSave();
}

function resetAll() {
    if (!confirm('⚠️ This will clear all data and reset the application.\nAre you sure you want to continue?')) {
        return;
    }
    
    // Clear storage
    localStorage.removeItem('cpf_current');
    
    // Reset currentData
    currentData = {
        fieldKit: null,
        metadata: {
            date: new Date().toISOString().split('T')[0],
            auditor: '',
            client: '',
            status: 'in-progress',
            notes: ''
        },
        responses: {},
        score: null
    };
    
    // Reset currentScore object
    currentScore = {
        quick_assessment: 0,
        conversation_depth: 0,
        red_flags: 0,
        final_score: 0,
        maturity_level: 'green',
        details: {}
    };
    
    // Remove score UI elements
    const scoreBar = document.getElementById('score-bar');
    if (scoreBar) {
        scoreBar.remove();
    }
    
    const scoreSummary = document.getElementById('score-summary-section');
    if (scoreSummary) {
        scoreSummary.remove();
    }
    
    // Reset header
    document.getElementById('header').innerHTML = `
        <div class="header-content">
            <h1>CPF Auditor Field Kit Client</h1>
            <div class="subtitle">JSON Edition - Lightweight & Fast</div>
        </div>
    `;
    
    // Hide metadata and action bars
    document.getElementById('metadata-bar').style.display = 'none';
    document.getElementById('action-bar').style.display = 'none';
    
    // Reset content to empty state
    document.getElementById('content').innerHTML = `
        <div class="empty-state">
            <h2>Welcome to CPF Field Kit JSON Client</h2>
            <p>Load a JSON field kit to begin assessment</p>
            <input type="file" id="file-input" accept=".json" onchange="importJSON(event)" style="display: none;">
            <button class="btn btn-primary" onclick="document.getElementById('file-input').click()" style="margin-top: 20px;">📁 Import JSON</button>
        </div>
    `;
    
    alert('✅ Application reset successfully! All data cleared.');
}

// ============================================
// CPF SCORE CALCULATION SYSTEM
// ============================================

let currentScore = {
    quick_assessment: 0,
    conversation_depth: 0,
    red_flags: 0,
    final_score: 0,
    maturity_level: 'green',
    details: {}
};

function calculateIndicatorScore() {
    if (!currentData.fieldKit || !currentData.fieldKit.scoring) {
        alert('⚠️ No field kit loaded or scoring configuration missing');
        return;
    }

    const scoring = currentData.fieldKit.scoring;
    const sections = currentData.fieldKit.sections;
    
    // Reset score
    currentScore = {
        quick_assessment: 0,
        conversation_depth: 0,
        red_flags: 0,
        final_score: 0,
        maturity_level: 'green',
        details: {
            quick_assessment_breakdown: [],
            conversation_breakdown: [],
            red_flags_list: []
        }
    };

    // 1. CALCULATE QUICK ASSESSMENT SCORE
    const quickSection = sections.find(s => s.id === 'quick-assessment');
    if (quickSection && quickSection.items) {
        let totalWeight = 0;
        let weightedScore = 0;

        quickSection.items.forEach((item, idx) => {
            const itemId = `s0_i${idx}`;
            const response = currentData.responses[itemId];
            
            if (response && item.options) {
                const selectedOption = item.options.find(opt => opt.value === response);
                if (selectedOption && typeof selectedOption.score !== 'undefined') {
                    const weight = scoring.question_weights?.[item.id] || item.weight || (1 / quickSection.items.length);
                    weightedScore += selectedOption.score * weight;
                    totalWeight += weight;
                    
                    currentScore.details.quick_assessment_breakdown.push({
                        question: item.title,
                        response: selectedOption.label,
                        score: selectedOption.score,
                        weight: weight,
                        weighted_score: selectedOption.score * weight
                    });
                }
            }
        });

        currentScore.quick_assessment = totalWeight > 0 ? weightedScore / totalWeight : 0;
    }

    // 2. TRACK CONVERSATION COMPLETENESS (informational only, not part of vulnerability score)
    const convSection = sections.find(s => s.id === 'client-conversation');
    if (convSection && convSection.subsections) {
        let totalQuestions = 0;
        let answeredQuestions = 0;

        convSection.subsections.forEach((subsection, subIdx) => {
            if (subsection.items) {
                subsection.items.forEach((item, iIdx) => {
                    if (item.type === 'question') {
                        const itemId = `s1_sub${subIdx}_i${iIdx}`;

                        // Only count follow-ups (main questions don't have input fields, only text)
                        if (item.followups) {
                            item.followups.forEach((followup, fIdx) => {
                                totalQuestions++;
                                const followupId = `${itemId}_f${fIdx}`;
                                const followupResponse = currentData.responses[followupId];
                                if (followupResponse && followupResponse.trim().length > 0) {
                                    answeredQuestions++;
                                }
                            });
                        }
                    }
                });
            }
        });

        // Conversation completeness (for reference only, NOT part of vulnerability score)
        const completionRate = totalQuestions > 0 ? answeredQuestions / totalQuestions : 0;
        currentScore.conversation_depth = 0; // NOT USED in final score calculation

        currentScore.details.conversation_breakdown = {
            total_questions: totalQuestions,
            answered_questions: answeredQuestions,
            completion_rate: completionRate,
            is_informational: true // Flag to indicate this is NOT a vulnerability score
        };
    }

    // 3. CALCULATE RED FLAGS SCORE
    const redFlagsSubsection = convSection?.subsections?.find(s => s.title === 'Probing for Red Flags');
    if (redFlagsSubsection && redFlagsSubsection.items) {
        let totalRedFlagImpact = 0;
        
        redFlagsSubsection.items.forEach((item, iIdx) => {
            const itemId = `s1_sub3_i${iIdx}`; // Assumendo che red flags sia subsection 3
            const isChecked = currentData.responses[itemId];
            
            if (isChecked && item.score_impact) {
                totalRedFlagImpact += item.score_impact;
                currentScore.details.red_flags_list.push({
                    flag: item.label,
                    impact: item.score_impact
                });
            }
        });
        
        currentScore.red_flags = Math.min(totalRedFlagImpact, 1); // Cap at 1.0
    }

    // 4. CALCULATE FINAL VULNERABILITY SCORE
    // NOTE: Conversation depth is NOT included (it's informational only)
    // Score = Quick Assessment (70%) + Red Flags (30%)
    const QUICK_WEIGHT = 0.70;
    const RED_FLAGS_WEIGHT = 0.30;

    currentScore.final_score = (
        currentScore.quick_assessment * QUICK_WEIGHT +
        currentScore.red_flags * RED_FLAGS_WEIGHT
    );

    // Store actual weights used
    currentScore.weights_used = {
        quick_assessment: QUICK_WEIGHT,
        red_flags: RED_FLAGS_WEIGHT,
        conversation_depth: 0  // Not used in vulnerability score
    };

    // 5. DETERMINE MATURITY LEVEL
    const maturityLevels = scoring.maturity_levels;
    if (currentScore.final_score <= maturityLevels.green.score_range[1]) {
        currentScore.maturity_level = 'green';
    } else if (currentScore.final_score <= maturityLevels.yellow.score_range[1]) {
        currentScore.maturity_level = 'yellow';
    } else {
        currentScore.maturity_level = 'red';
    }

    // 6. UPDATE UI
    updateScoreDisplay();

    // Save score to currentData
    currentData.score = currentScore;

    console.log('📊 Score Calculated:', currentScore);
}

function updateScoreDisplay() {
    const scoreBarDiv = document.getElementById('score-bar');
    const existingBreakdown = document.getElementById('score-detailed-breakdown');

    const maturityConfig = currentData.fieldKit.scoring.maturity_levels[currentScore.maturity_level];
    const scorePercentage = (currentScore.final_score * 100).toFixed(1);
    const weights = currentScore.weights_used || { quick_assessment: 0.70, red_flags: 0.30, conversation_depth: 0 };

    // FIRST TIME: Create full HTML structure
    if (!scoreBarDiv || !existingBreakdown) {
        if (!scoreBarDiv) {
            const metadataBar = document.getElementById('metadata-bar');
            const newScoreBar = document.createElement('div');
            newScoreBar.id = 'score-bar';
            newScoreBar.className = 'score-bar sticky-score-bar';
            metadataBar.parentNode.insertBefore(newScoreBar, metadataBar.nextSibling);
        }

        document.getElementById('score-bar').innerHTML = `
        <div class="score-container">
            <div class="score-progress-section">
                <div class="score-label">
                    <span>Vulnerability Score</span>
                    <span class="score-value" id="score-val">${scorePercentage}%</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill ${currentScore.maturity_level}" id="score-bar-fill" style="width: ${scorePercentage}%">
                        ${scorePercentage}%
                    </div>
                </div>
            </div>
            <div class="maturity-badge-container">
                <div class="maturity-label">MATURITY LEVEL</div>
                <div class="maturity-badge ${currentScore.maturity_level}" id="maturity-badge">
                    ${maturityConfig.label}
                </div>
            </div>
        </div>

        <div id="score-detailed-breakdown" class="score-detailed-breakdown" style="display: none;">
            <div class="score-breakdown">
                <div class="score-component">
                    <div class="component-label">Quick Assessment</div>
                    <div class="component-value" id="quick-val">${(currentScore.quick_assessment * 100).toFixed(1)}%</div>
                    <div class="component-description">
                        Based on <span id="quick-count">${currentScore.details.quick_assessment_breakdown.length}</span> questions
                        (Weight: ${(weights.quick_assessment * 100)}%)
                    </div>
                </div>

                <div class="score-component">
                    <div class="component-label">Red Flags</div>
                    <div class="component-value" id="flags-val">${(currentScore.red_flags * 100).toFixed(1)}%</div>
                    <div class="component-description">
                        <span id="flags-count">${currentScore.details.red_flags_list.length}</span> flags detected
                        (Weight: ${(weights.red_flags * 100)}%)
                    </div>
                </div>

                <div class="score-component" style="border: 2px dashed #ccc; background: #fafafa;">
                    <div class="component-label">Conversation Completeness</div>
                    <div class="component-value" style="color: #666;" id="conv-val">${(currentScore.details.conversation_breakdown.completion_rate * 100).toFixed(0)}%</div>
                    <div class="component-description" style="color: #888; font-size: 12px;">
                        <span id="conv-answered">${currentScore.details.conversation_breakdown.answered_questions}</span>/<span id="conv-total">${currentScore.details.conversation_breakdown.total_questions}</span> answered
                        <br><em>(Informational only)</em>
                    </div>
                </div>
            </div>

            <div class="score-interpretation">
                <div class="interpretation-title">📋 Interpretation</div>
                <div class="interpretation-text" id="interp-text">
                    <strong style="color: ${maturityConfig.color};">${maturityConfig.label}:</strong> ${maturityConfig.description}
                </div>
            </div>

            <div class="score-details-toggle">
                <button class="btn btn-light" onclick="window.CPFClient.toggleScoreDetails()">
                    📈 Show Question Breakdown
                </button>
            </div>

            <div id="score-details-content" class="score-details-content">
                <h4 style="margin-bottom: 15px; color: var(--primary);">Quick Assessment Breakdown</h4>
                <div id="quick-breakdown">${currentScore.details.quick_assessment_breakdown.map(item => `
                    <div class="detail-row">
                        <span class="detail-label">${item.question}</span>
                        <span class="detail-value">${(item.weighted_score * 100).toFixed(1)}%</span>
                    </div>
                `).join('')}</div>

                <div id="flags-breakdown">${currentScore.details.red_flags_list.length > 0 ? `
                    <h4 style="margin: 20px 0 15px; color: var(--danger);">Red Flags Detected</h4>
                    ${currentScore.details.red_flags_list.map(flag => `
                        <div class="detail-row">
                            <span class="detail-label">⚠️ ${flag.flag}</span>
                            <span class="detail-value" style="color: var(--danger);">+${(flag.impact * 100).toFixed(1)}%</span>
                        </div>
                    `).join('')}
                ` : ''}</div>

                <div class="calculation-formula" id="calc-formula">
                    <strong>Vulnerability Score Calculation:</strong><br>
                    Final Score = (Quick Assessment × ${weights.quick_assessment}) + (Red Flags × ${weights.red_flags})<br>
                    Final Score = (${currentScore.quick_assessment.toFixed(3)} × ${weights.quick_assessment}) + (${currentScore.red_flags.toFixed(3)} × ${weights.red_flags})<br>
                    <strong>Final Score = ${currentScore.final_score.toFixed(3)} (${scorePercentage}%)</strong><br>
                    <em style="color: #888; font-size: 12px;">Note: Conversation completeness is tracked separately for reference</em>
                </div>
            </div>
        </div>`;

        document.getElementById('score-bar').style.display = 'block';

    } else {
        // SUBSEQUENT UPDATES: Only update values, NO HTML regeneration
        document.getElementById('score-val').textContent = scorePercentage + '%';

        const fill = document.getElementById('score-bar-fill');
        fill.className = `progress-bar-fill ${currentScore.maturity_level}`;
        fill.style.width = scorePercentage + '%';
        fill.textContent = scorePercentage + '%';

        const badge = document.getElementById('maturity-badge');
        badge.className = `maturity-badge ${currentScore.maturity_level}`;
        badge.textContent = maturityConfig.label;

        document.getElementById('quick-val').textContent = (currentScore.quick_assessment * 100).toFixed(1) + '%';
        document.getElementById('quick-count').textContent = currentScore.details.quick_assessment_breakdown.length;

        document.getElementById('flags-val').textContent = (currentScore.red_flags * 100).toFixed(1) + '%';
        document.getElementById('flags-count').textContent = currentScore.details.red_flags_list.length;

        document.getElementById('conv-val').textContent = (currentScore.details.conversation_breakdown.completion_rate * 100).toFixed(0) + '%';
        document.getElementById('conv-answered').textContent = currentScore.details.conversation_breakdown.answered_questions;
        document.getElementById('conv-total').textContent = currentScore.details.conversation_breakdown.total_questions;

        document.getElementById('interp-text').innerHTML = `<strong style="color: ${maturityConfig.color};">${maturityConfig.label}:</strong> ${maturityConfig.description}`;

        document.getElementById('quick-breakdown').innerHTML = currentScore.details.quick_assessment_breakdown.map(item => `
            <div class="detail-row">
                <span class="detail-label">${item.question}</span>
                <span class="detail-value">${(item.weighted_score * 100).toFixed(1)}%</span>
            </div>
        `).join('');

        document.getElementById('flags-breakdown').innerHTML = currentScore.details.red_flags_list.length > 0 ? `
            <h4 style="margin: 20px 0 15px; color: var(--danger);">Red Flags Detected</h4>
            ${currentScore.details.red_flags_list.map(flag => `
                <div class="detail-row">
                    <span class="detail-label">⚠️ ${flag.flag}</span>
                    <span class="detail-value" style="color: var(--danger);">+${(flag.impact * 100).toFixed(1)}%</span>
                </div>
            `).join('')}
        ` : '';

        document.getElementById('calc-formula').innerHTML = `
            <strong>Vulnerability Score Calculation:</strong><br>
            Final Score = (Quick Assessment × ${weights.quick_assessment}) + (Red Flags × ${weights.red_flags})<br>
            Final Score = (${currentScore.quick_assessment.toFixed(3)} × ${weights.quick_assessment}) + (${currentScore.red_flags.toFixed(3)} × ${weights.red_flags})<br>
            <strong>Final Score = ${currentScore.final_score.toFixed(3)} (${scorePercentage}%)</strong><br>
            <em style="color: #888; font-size: 12px;">Note: Conversation completeness is tracked separately for reference</em>
        `;
    }
}


// showScoreSummary() removed - detailed breakdown now integrated in score bar

function toggleScoreDetails() {
    const detailsDiv = document.getElementById('score-details-content');
    detailsDiv.classList.toggle('visible');

    const button = event.target;
    if (detailsDiv.classList.contains('visible')) {
        button.textContent = '📉 Hide Detailed Breakdown';
    } else {
        button.textContent = '📈 Show Detailed Breakdown';
    }
}

function toggleDetailedAnalysis() {
    const breakdown = document.getElementById('score-detailed-breakdown');
    if (!breakdown) return;

    if (breakdown.style.display === 'none') {
        breakdown.style.display = 'block';
    } else {
        breakdown.style.display = 'none';
    }
}

// Auto-calculate score when responses change (REAL-TIME!)
function updateResponseWithAutoScore(id, value) {
    updateResponse(id, value);

    // Auto-calculate IMMEDIATELY (no lag)
    if (currentData.fieldKit && currentData.fieldKit.scoring) {
        calculateIndicatorScore();

        // Save IMMEDIATELY to API (real-time, no debounce!)
        if (organizationContext.orgId && currentScore) {
            saveToAPI().catch(err => {
                console.error('Auto-save failed:', err);
            });
        }
    }
}

// ============================================
// DEPRECATED FUNCTIONS REMOVED IN V2.0
// ============================================
// The following functions have been removed:
// - generateSlug() - No longer needed (org ID comes from dashboard)
// - generateUniqueOrgId() - No longer needed (org ID comes from dashboard)
// - exportToDashboard() - Replaced by auto-save to API
// - batchImportAndViewDashboard() - No longer needed with direct API integration
// ============================================

// ============================================
// JSON VALIDATION
// ============================================
function validateCurrentJSON() {
    if (!currentData.fieldKit) {
        alert('No JSON loaded');
        return;
    }
    
    const result = validateJSONFile(currentData.fieldKit);
    
    if (result.valid) {
        alert(`✅ JSON is valid!\n\n${result.warnings.length} warnings found (check console for details)`);
    } else {
        alert(`❌ JSON has ${result.errors.length} errors!\n\nCheck console for details.`);
    }
}

// ============================================
// QUICK REFERENCE GUIDE SYSTEM
// ============================================

let referenceData = null;
let loadedLanguage = null;

async function showQuickReference() {
    const modal = document.getElementById('reference-modal');
    const content = document.getElementById('reference-content');

    // Show modal immediately
    modal.style.display = 'flex';

    // Load reference guide based on selected language
    const langSelect = document.getElementById('lang-select');
    const lang = langSelect ? langSelect.value : 'EN';
    const isoLang = LANG_MAP[lang] || 'en-US';

    // If data is already loaded AND language hasn't changed, just display it
    if (referenceData && loadedLanguage === isoLang) {
        renderReferenceContent(content, referenceData);
        return;
    }

    try {
        content.innerHTML = '<p style="text-align: center; color: #7f8c8d; padding: 40px;">Loading reference guide...</p>';

        const response = await fetch(`../auditing/reference_guide_${isoLang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load reference guide: ${response.status}`);
        }

        referenceData = await response.json();
        loadedLanguage = isoLang; // Save which language was loaded
        renderReferenceContent(content, referenceData);
    } catch (error) {
        console.error('Error loading reference guide:', error);
        content.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <p style="color: var(--danger); font-size: 18px; margin-bottom: 15px;">⚠️ Error Loading Reference Guide</p>
                <p style="color: var(--text-light);">${error.message}</p>
                <p style="color: var(--text-light); font-size: 14px; margin-top: 10px;">Please make sure the reference guide file exists.</p>
            </div>
        `;
    }
}

function renderReferenceContent(container, data) {
    let html = `
        <div style="margin-bottom: 25px;">
            <p style="font-size: 14px; color: var(--text-light); line-height: 1.6;">
                ${data.description}
            </p>
        </div>
    `;

    data.categories.forEach(category => {
        html += `
            <div class="category-accordion">
                <div class="category-header" onclick="window.CPFClient.toggleCategory(${category.id})">
                    <div class="category-title">
                        <span class="category-badge">${category.id}.x</span>
                        <div style="flex: 1;">
                            <div>${category.name}</div>
                            <div class="category-description">${category.description}</div>
                        </div>
                    </div>
                    <span class="category-arrow">▶</span>
                </div>
                <div class="category-body" id="category-${category.id}">
                    <div class="indicator-list">
                        ${category.indicators.map(indicator => `
                            <div class="indicator-item" onclick="window.CPFClient.loadIndicatorFromReference('${indicator.id}')" title="Click to load this indicator">
                                <span class="indicator-code">${indicator.id}</span>
                                <span class="indicator-title">${indicator.title}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    });

    html += `
        <div class="reference-footer">
            <strong>${data.title}</strong> | Version ${data.version} | Language: ${data.language}<br>
            <em style="font-size: 11px;">Click on any indicator to load it directly</em>
        </div>
    `;

    container.innerHTML = html;
}

function toggleCategory(categoryId) {
    const body = document.getElementById(`category-${categoryId}`);
    const header = body.previousElementSibling; // Get the category-header element
    const arrow = header.querySelector('.category-arrow');

    // Toggle active state
    header.classList.toggle('active');
    body.classList.toggle('active');

    // Rotate arrow
    if (body.classList.contains('active')) {
        arrow.textContent = '▼';
    } else {
        arrow.textContent = '▶';
    }
}

async function loadIndicatorFromReference(indicatorId) {
    console.log('📥 loadIndicatorFromReference called with:', indicatorId);

    if (!indicatorId) {
        alert('❌ Error: No indicator ID provided to loadIndicatorFromReference');
        console.error('indicatorId is null or undefined');
        return;
    }

    // Parse indicator ID (e.g., "1.3" -> category=1, indicator=3)
    const parts = indicatorId.split('.');
    const category = parts[0];
    const indicator = parts[1];

    console.log('🔧 Parsed:', { category, indicator });

    // Get current language
    const langSelect = document.getElementById('lang-select');
    const lang = langSelect ? langSelect.value : 'EN';

    // Update UI controls
    const categorySelect = document.getElementById('category-select');
    const indicatorSelect = document.getElementById('indicator-select');

    if (categorySelect) categorySelect.value = category;
    if (indicatorSelect) indicatorSelect.value = indicator;

    // Close modal
    closeQuickReference();

    // Load the indicator (AWAIT it!)
    await loadJSON();
}

function closeQuickReference() {
    const modal = document.getElementById('reference-modal');
    modal.style.display = 'none';
}

// Close modal with ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('reference-modal');
        if (modal && modal.style.display === 'flex') {
            closeQuickReference();
        }
    }
});

// ============================================
// BATCH IMPORT & DASHBOARD INTEGRATION
// ============================================

// NOTE: batchImportAndViewDashboard() and generateSyntheticData() removed in v2.0
// These functions are no longer needed with direct API integration

// ============================================
// INDICATOR DETAILS MODAL
// ============================================

/**
 * Show detailed information about the current indicator
 */
function showIndicatorDetails() {
    if (!currentData.fieldKit) {
        alert('❌ No indicator loaded.\n\nPlease load an indicator first before viewing details.');
        return;
    }

    const fieldKit = currentData.fieldKit;
    const modal = document.getElementById('indicator-details-modal');
    const title = document.getElementById('indicator-details-title');
    const content = document.getElementById('indicator-details-content');

    title.textContent = `📄 Indicator ${fieldKit.indicator} - Details`;

    // Render detailed information
    let html = `
        <div class="indicator-detail" style="max-width: 900px; margin: 0 auto;">
            <!-- Title & Category -->
            <div style="margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e0e0e0;">
                <h3 style="margin: 0 0 10px 0; font-size: 24px; color: #1a1a2e;">${fieldKit.title || 'N/A'}</h3>
                <p style="font-size: 16px; color: #7f8c8d; margin-bottom: 15px;">${fieldKit.subtitle || ''}</p>
                <div style="background: #f8f9fa; padding: 10px 15px; border-radius: 6px; display: inline-block;">
                    <strong>Category:</strong> ${fieldKit.category || 'N/A'}
                </div>
            </div>

            <!-- Description -->
            <div style="margin-bottom: 25px;">
                <h4 style="color: #1a1a2e; margin-bottom: 10px; font-size: 18px;">📝 Description</h4>
                <p style="line-height: 1.7; color: #2c3e50;">${fieldKit.description?.short || 'No description available'}</p>
            </div>

            ${fieldKit.description?.context ? `
            <div style="margin-bottom: 25px;">
                <h4 style="color: #1a1a2e; margin-bottom: 10px; font-size: 18px;">🌍 Context</h4>
                <p style="line-height: 1.7; color: #2c3e50;">${fieldKit.description.context}</p>
            </div>
            ` : ''}

            ${fieldKit.description?.impact ? `
            <div style="margin-bottom: 25px;">
                <h4 style="color: #1a1a2e; margin-bottom: 10px; font-size: 18px;">⚠️ Impact</h4>
                <p style="line-height: 1.7; color: #2c3e50;">${fieldKit.description.impact}</p>
            </div>
            ` : ''}

            ${fieldKit.description?.psychological_basis ? `
            <div style="margin-bottom: 25px;">
                <h4 style="color: #1a1a2e; margin-bottom: 10px; font-size: 18px;">🧠 Psychological Basis</h4>
                <p style="line-height: 1.7; color: #2c3e50;">${fieldKit.description.psychological_basis}</p>
            </div>
            ` : ''}

            ${fieldKit.risk_scenarios && fieldKit.risk_scenarios.length > 0 ? `
            <div style="margin-bottom: 25px;">
                <h4 style="color: #1a1a2e; margin-bottom: 15px; font-size: 18px;">🔥 Risk Scenarios</h4>
                ${fieldKit.risk_scenarios.map((scenario, idx) => `
                    <div style="background: #fff3cd; padding: 20px; border-left: 4px solid #f39c12; margin-bottom: 15px; border-radius: 6px;">
                        <h5 style="margin: 0 0 10px 0; color: #856404; font-size: 16px;">
                            ${scenario.title || 'Scenario ' + (idx + 1)}
                        </h5>
                        <p style="margin: 0 0 10px 0; line-height: 1.6; color: #856404;">
                            ${scenario.description || ''}
                        </p>
                        ${scenario.likelihood ? `<p style="margin: 0; font-size: 14px;"><strong>Likelihood:</strong> ${scenario.likelihood}</p>` : ''}
                        ${scenario.impact ? `<p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Impact:</strong> ${scenario.impact}</p>` : ''}
                    </div>
                `).join('')}
            </div>
            ` : ''}

            ${fieldKit.scoring && fieldKit.scoring.maturity_levels ? `
            <div style="margin-bottom: 25px;">
                <h4 style="color: #1a1a2e; margin-bottom: 15px; font-size: 18px;">📊 Maturity Levels</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                    ${Object.entries(fieldKit.scoring.maturity_levels).map(([level, data]) => {
                        const bgColor = level === 'green' ? '#d4edda' : level === 'yellow' ? '#fff3cd' : '#f8d7da';
                        const textColor = level === 'green' ? '#155724' : level === 'yellow' ? '#856404' : '#721c24';
                        return `
                            <div style="background: ${bgColor}; padding: 15px; border-radius: 8px;">
                                <h5 style="margin: 0 0 10px 0; color: ${textColor}; text-transform: capitalize;">
                                    ${level} (${data.score_range ? data.score_range.join(' - ') : 'N/A'})
                                </h5>
                                <p style="margin: 0; font-size: 14px; color: ${textColor}; line-height: 1.5;">
                                    ${data.description || 'No description'}
                                </p>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            ` : ''}

            ${fieldKit.remediation && fieldKit.remediation.actions ? `
            <div style="margin-bottom: 25px;">
                <h4 style="color: #1a1a2e; margin-bottom: 15px; font-size: 18px;">🛠️ Remediation Actions</h4>
                <ul style="line-height: 1.8; color: #2c3e50; padding-left: 20px;">
                    ${fieldKit.remediation.actions.map(action => `
                        <li style="margin-bottom: 10px;">${action}</li>
                    `).join('')}
                </ul>
            </div>
            ` : ''}

            <!-- Metadata -->
            <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e0e0e0;">
                <h4 style="color: #1a1a2e; margin-bottom: 10px; font-size: 18px;">ℹ️ Metadata</h4>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                    <div>
                        <strong>Version:</strong> ${fieldKit.version || 'N/A'}
                    </div>
                    <div>
                        <strong>Indicator:</strong> ${fieldKit.indicator}
                    </div>
                    ${fieldKit.metadata?.difficulty ? `
                    <div>
                        <strong>Difficulty:</strong> ${fieldKit.metadata.difficulty}
                    </div>
                    ` : ''}
                    ${fieldKit.metadata?.time_to_assess ? `
                    <div>
                        <strong>Time to Assess:</strong> ${fieldKit.metadata.time_to_assess}
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;

    content.innerHTML = html;
    modal.style.display = 'flex';
}

/**
 * Close indicator details modal
 */
function closeIndicatorDetails() {
    const modal = document.getElementById('indicator-details-modal');
    modal.style.display = 'none';
}

/**
 * Load existing export from server (edit mode)
 */
async function loadExistingExport(indicatorId, orgId) {
    try {
        console.log(`📥 Loading existing export for ${orgId}/${indicatorId}...`);

        // Fetch export from server (using query parameters to handle dots in indicator_id)
        const response = await fetch(`/api/get-export?org_id=${encodeURIComponent(orgId)}&indicator_id=${encodeURIComponent(indicatorId)}`);

        if (!response.ok) {
            if (response.status === 404) {
                alert(`⚠️ Export not found for ${orgId}/${indicatorId}. Loading empty form.`);
                await loadIndicatorFromReference(indicatorId);
                return;
            }
            throw new Error(`Failed to load export: ${response.status}`);
        }

        const result = await response.json();
        const exportData = result.data;

        console.log('✅ Export loaded:', exportData);

        // First, load the Field Kit JSON from local files
        const [categoryNum, indicatorNum] = indicatorId.split('.');
        const categoryName = getCategoryName(categoryNum);

        // Use organization language from context (set by URL params), fallback to langSelect
        const langCode = organizationContext.language ||
                        (document.getElementById('lang-select')?.value === 'IT' ? 'it-IT' : 'en-US');

        // Construct local URL (same pattern as loadJSON)
        const url = `/auditor-field-kit/interactive/${langCode}/${categoryNum}.x-${categoryName}/indicator_${indicatorId}.json`;
        console.log('Loading Field Kit from local:', url);

        const fieldKitResponse = await fetch(url);
        if (!fieldKitResponse.ok) {
            throw new Error(`Failed to load Field Kit JSON: ${fieldKitResponse.status}`);
        }

        const fieldKit = await fieldKitResponse.json();

        // Populate currentData FIRST, then render
        currentData.fieldKit = fieldKit;

        // Now populate with existing data from full_assessment (if available)
        if (exportData.full_assessment) {
            console.log('📋 Loading data from full_assessment...');
            console.log('🔍 full_assessment structure:', Object.keys(exportData.full_assessment));

            // Check if raw_data exists (new format)
            if (exportData.full_assessment.raw_data) {
                console.log('🔍 raw_data structure:', Object.keys(exportData.full_assessment.raw_data));

                // Load responses from raw_data.client_conversation.responses
                if (exportData.full_assessment.raw_data.client_conversation?.responses) {
                    currentData.responses = exportData.full_assessment.raw_data.client_conversation.responses;
                    console.log('✅ Responses loaded from raw_data:', Object.keys(currentData.responses).length, 'items');
                    console.log('📝 Response keys:', Object.keys(currentData.responses));
                }

                // Load metadata from raw_data if available
                if (exportData.full_assessment.raw_data.client_conversation?.metadata) {
                    currentData.metadata = {
                        ...currentData.metadata,
                        ...exportData.full_assessment.raw_data.client_conversation.metadata
                    };
                }

                // Load notes separately (in case they're stored separately for compatibility)
                if (exportData.full_assessment.raw_data.client_conversation?.notes) {
                    currentData.metadata.notes = exportData.full_assessment.raw_data.client_conversation.notes;
                    console.log('✅ Notes loaded:', currentData.metadata.notes);
                }
            }
            // Fallback to old format (if responses are directly under full_assessment)
            else if (exportData.full_assessment.responses) {
                currentData.responses = exportData.full_assessment.responses;
                console.log('✅ Responses loaded (legacy format):', Object.keys(currentData.responses).length, 'items');

                // Also load metadata from full_assessment level for old format
                if (exportData.full_assessment.metadata) {
                    currentData.metadata = {
                        ...currentData.metadata,
                        ...exportData.full_assessment.metadata
                    };
                }
            }

            // Populate maturity scores (if available)
            if (exportData.full_assessment.maturity_scores) {
                currentData.scores = exportData.full_assessment.maturity_scores;
            }

            // Populate risk assessments (if available)
            if (exportData.full_assessment.risk_assessments) {
                currentData.assessments = exportData.full_assessment.risk_assessments;
            }

            // Populate notes (if available)
            if (exportData.full_assessment.notes) {
                const notesTextarea = document.getElementById('notes');
                if (notesTextarea) {
                    notesTextarea.value = exportData.full_assessment.notes;
                }
            }
        } else {
            // Fallback for old format exports (backward compatibility)
            console.log('⚠️ Old format export detected, using indicator_data fallback');
            currentData.metadata = exportData.metadata || currentData.metadata;
        }

        // Render ONCE with all data populated
        renderFieldKit(fieldKit);

        // Save to localStorage
        localStorage.setItem('cpf_current', JSON.stringify(currentData));

        console.log(`✅ Loaded existing assessment for ${exportData.organization_name}`);

    } catch (error) {
        console.error('Error loading existing export:', error);
        // Silently fallback to loading from local files (error logged to console for debug)
        await loadIndicatorFromReference(indicatorId);
    }
}

/**
 * Get category name from category number
 */
function getCategoryName(categoryNum) {
    const categoryMap = {
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
    return categoryMap[categoryNum] || 'unknown';
}

window.addEventListener('DOMContentLoaded', () => {
    // IMPORTANT: Skip auto-init if we're integrated into dashboard
    // Check if we're in dashboard context by looking for dashboard-specific elements
    const isDashboardIntegrated = document.querySelector('.dashboard-container') !== null;

    if (isDashboardIntegrated) {
        console.log('🎯 Client detected dashboard integration - skipping auto-init');
        console.log('✅ CPFClient namespace available for manual initialization');
        return; // Exit early, let dashboard code initialize manually
    }

    // Check for URL parameters (e.g., from dashboard link)
    const urlParams = new URLSearchParams(window.location.search);

    // Get all URL parameters
    const indicatorParam = urlParams.get('indicator');
    const langParam = urlParams.get('lang') || urlParams.get('language'); // Support both 'lang' and 'language' parameters
    const modeParam = urlParams.get('mode'); // 'edit' or 'new'
    const orgIdParam = urlParams.get('org_id');
    const orgNameParam = urlParams.get('org_name');

    console.log('🔍 Client loaded with URL params:', {
        indicator: indicatorParam,
        language: langParam,
        mode: modeParam,
        org_id: orgIdParam,
        org_name: orgNameParam,
        fullURL: window.location.href
    });

    // Set organization context from URL parameters
    if (orgIdParam) {
        organizationContext.orgId = orgIdParam;
    }
    if (orgNameParam) {
        organizationContext.orgName = orgNameParam;
    }
    if (langParam) {
        organizationContext.language = langParam;
    }

    // Display organization info if available
    if (organizationContext.orgId && organizationContext.orgName) {
        displayOrganizationInfo();

        // Pre-fill client metadata
        currentData.metadata.client = organizationContext.orgName;
    }

    // Set language if provided in URL
    if (langParam) {
        const langSelect = document.getElementById('lang-select');
        if (langSelect) {
            // Convert ISO code (en-US) to uppercase short form (EN)
            const shortLang = langParam.split('-')[0].toUpperCase();
            langSelect.value = shortLang;
        }
    }

    console.log('✅ Client v2.0 initialized with organization:', organizationContext);

    // Load specific indicator if provided in URL
    if (indicatorParam) {
        console.log(`🔗 Loading indicator ${indicatorParam} from URL (mode: ${modeParam || 'new'})`);

        // Clean URL (remove query parameters after reading them)
        if (window.history && window.history.replaceState) {
            const cleanUrl = window.location.pathname;
            window.history.replaceState(null, '', cleanUrl);
            console.log('🧹 URL cleaned, parameters removed');
        }

        // Use setTimeout to ensure DOM is fully ready
        setTimeout(async () => {
            if (modeParam === 'edit' && orgIdParam) {
                // Edit mode: load existing export from server
                console.log(`📥 Edit mode: loading assessment for org=${orgIdParam}, indicator=${indicatorParam}`);
                await loadExistingExport(indicatorParam, orgIdParam);
            } else {
                // New mode: load from local files
                console.log(`📄 New mode: loading indicator ${indicatorParam} from local files`);
                await loadIndicatorFromReference(indicatorParam);
            }
        }, 100);
        return; // Skip localStorage loading
    }

    // Otherwise, restore from localStorage
    const saved = localStorage.getItem('cpf_current');
    if (saved) {
        currentData = JSON.parse(saved);
        if (currentData.fieldKit) {
            renderFieldKit(currentData.fieldKit);
        }
    }
});

// ============================================
// EXPORT TO GLOBAL SCOPE (for dashboard integration)
// ============================================
window.CPFClient = {
    // Data
    organizationContext: organizationContext,
    currentData: currentData,

    // Core functions
    renderFieldKit: renderFieldKit,
    saveToAPI: saveToAPI,
    calculateIndicatorScore: calculateIndicatorScore,

    // Response handling (CRITICAL for auto-save)
    updateResponse: updateResponse,
    updateResponseWithAutoScore: updateResponseWithAutoScore,
    selectRadioOption: selectRadioOption,
    updateMeta: updateMeta,

    // Utility functions
    loadJSON: loadJSON,
    importJSON: importJSON,
    saveData: saveData,
    exportData: exportData,
    generateReport: generateReport,
    resetAll: resetAll,
    toggleDetailedAnalysis: toggleDetailedAnalysis,
    toggleScoreDetails: toggleScoreDetails,

    // Modal functions
    showQuickReference: showQuickReference,
    closeQuickReference: closeQuickReference,
    toggleCategory: toggleCategory,
    loadIndicatorFromReference: loadIndicatorFromReference,
    showIndicatorDetails: showIndicatorDetails,
    closeIndicatorDetails: closeIndicatorDetails,

    // Validation
    validateCurrentJSON: validateCurrentJSON
};

})(); // End of IIFE wrapper