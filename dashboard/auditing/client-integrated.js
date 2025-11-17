// ============================================
// CLIENT V2.0 - MODULE PATTERN (NO IIFE)
// ============================================
'use strict';

const CPFClient = {
    // ============================================
    // STATE
    // ============================================
    organizationContext: {
        orgId: null,
        orgName: null,
        language: 'en-US'
    },

    currentData: {
        fieldKit: null,
        metadata: {
            date: new Date().toISOString().split('T')[0],
            auditor: '',
            client: '',
            status: 'in-progress',
            notes: ''
        },
        responses: {}
    },

    currentScore: {
        quick_assessment: 0,
        conversation_depth: 0,
        red_flags: 0,
        final_score: 0,
        maturity_level: 'green',
        details: {}
    },

    referenceData: null,
    loadedLanguage: null,

    // Language code mapping
    LANG_MAP: {
        'EN': 'en-US',
        'IT': 'it-IT',
        'ES': 'es-ES',
        'FR': 'fr-FR',
        'DE': 'de-DE'
    },

    // Category mapping
    CATEGORY_MAP: {
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

    // Category details for dropdown
    CATEGORIES: [
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
    ],

    // Language options
    LANGUAGES: [
        { code: 'EN', iso: 'en-US', label: 'English' },
        { code: 'IT', iso: 'it-IT', label: 'Italiano' },
        { code: 'ES', iso: 'es-ES', label: 'Español' },
        { code: 'FR', iso: 'fr-FR', label: 'Français' },
        { code: 'DE', iso: 'de-DE', label: 'Deutsch' }
    ],

    // ============================================
    // INITIALIZATION
    // ============================================
    init() {
        // Auto-save to localStorage every 30 seconds (backup)
        setInterval(() => {
            if (CPFClient.currentData.fieldKit) {
                localStorage.setItem('cpf_current', JSON.stringify(CPFClient.currentData));
            }
        }, 30000);

        // Make CATEGORY_MAP available globally for dashboard.js compatibility
        window.CATEGORY_MAP = window.CATEGORY_MAP || CPFClient.CATEGORY_MAP;
    },

    displayOrganizationInfo() {
        const orgInfo = document.getElementById('organization-info');
        const orgNameDisplay = document.getElementById('org-name-display');
        const orgIdDisplay = document.getElementById('org-id-display');

        if (orgInfo && orgNameDisplay && orgIdDisplay) {
            orgInfo.style.display = 'block';
            orgNameDisplay.textContent = CPFClient.organizationContext.orgName;
            orgIdDisplay.textContent = CPFClient.organizationContext.orgId;
        }
    },

    mapISOToLangCode(isoLang) {
        const mapping = {
            'en-US': 'EN',
            'it-IT': 'IT',
            'es-ES': 'ES',
            'fr-FR': 'FR',
            'de-DE': 'DE'
        };
        return mapping[isoLang] || 'EN';
    },

    // ============================================
    // DATA LOADING
    // ============================================
    async loadJSON(indicatorId = null, languageOverride = null) {
        const manualInput = document.getElementById('indicator-input');
        const langSelect = document.getElementById('lang-select');
        const categorySelect = document.getElementById('category-select');
        const indicatorSelect = document.getElementById('indicator-select');

        let input;
        let isoLang;

        // Determine language: use override, then organization context, then UI select, then default
        if (languageOverride) {
            isoLang = languageOverride;
        } else if (CPFClient.organizationContext.language) {
            isoLang = CPFClient.organizationContext.language;
        } else if (langSelect) {
            const lang = langSelect.value;
            isoLang = CPFClient.LANG_MAP[lang.toUpperCase()] || 'en-US';
        } else {
            isoLang = 'en-US';
        }

        // 1. Use parameter if provided (from Quick Reference or dashboard)
        if (indicatorId) {
            input = indicatorId;
        }
        // 2. Check manual input field
        else if (manualInput && manualInput.value.trim()) {
            input = manualInput.value.trim();
            manualInput.value = '';
        }
        // 3. Use dropdown values if manual input is empty
        else if (categorySelect && indicatorSelect) {
            const category = categorySelect.value;
            const indicator = indicatorSelect.value;
            input = `${category}.${indicator}`;
        }
        // 4. Fallback to prompt (backward compatibility)
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

                // If language was specified in the input, use it
                if (indicatorMatch[3]) {
                    isoLang = CPFClient.LANG_MAP[indicatorMatch[3].toUpperCase()] || isoLang;
                }

                // Get category info
                const categoryNum = indicatorMatch[1];
                const categoryName = CPFClient.CATEGORY_MAP[categoryNum];

                if (!categoryName) {
                    throw new Error(`Invalid category number: ${categoryNum}. Must be 1-10.`);
                }

                // Construct local URL for multilingual structure
                fetchUrl = `/auditor-field-kit/interactive/${isoLang}/${categoryNum}.x-${categoryName}/indicator_${indicator}.json`;
                console.log('Loading from:', fetchUrl, 'Language:', isoLang);
            }

            const response = await fetch(fetchUrl);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`Indicator not found. The JSON file may not exist yet at: ${fetchUrl}`);
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            CPFClient.currentData.fieldKit = data;
            CPFClient.renderFieldKit(data);
        } catch (error) {
            alert('Error loading JSON: ' + error.message);
            console.error('Load error:', error);
        }
    },

    importJSON(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);

                if (data.fieldKit && data.metadata && data.responses) {
                    CPFClient.currentData = data;
                    CPFClient.renderFieldKit(data.fieldKit);
                }
                else if (data.indicator && data.sections) {
                    CPFClient.currentData.fieldKit = data;
                    CPFClient.currentData.metadata = {
                        date: new Date().toISOString().split('T')[0],
                        auditor: '',
                        client: '',
                        status: 'in-progress',
                        notes: ''
                    };
                    CPFClient.currentData.responses = {};
                    CPFClient.renderFieldKit(data);
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
    },

    // ============================================
    // RENDERING
    // ============================================
    renderFieldKit(data) {
        // Detect Bayesian schema (indicators 9.6-9.10)
        const isBayesianSchema = data.indicator_id && data.quick_assessment && !data.sections;

        if (isBayesianSchema) {
            alert(`⚠️ Indicator ${data.indicator_id} uses Bayesian schema which is not yet supported by the integrated client.\n\nPlease use the standalone reference tool for this indicator.`);
            return;
        }

        // Check for missing sections
        if (!data.sections || !Array.isArray(data.sections)) {
            alert(`⚠️ Error: This indicator file is missing the required 'sections' field.\n\nThe file may be corrupted or use an unsupported format.`);
            return;
        }

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
                <input type="date" value="${CPFClient.currentData.metadata.date}" onchange="window.CPFClient.updateMeta('date', CPFClient.value)">
            </div>
            <div class="meta-field">
                <label>Auditor</label>
                <input type="text" value="${CPFClient.currentData.metadata.auditor}" onchange="window.CPFClient.updateMeta('auditor', CPFClient.value)" placeholder="Your name">
            </div>
            <div class="meta-field">
                <label>Client</label>
                <input type="text" value="${CPFClient.currentData.metadata.client}" onchange="window.CPFClient.updateMeta('client', CPFClient.value)" placeholder="Client name">
            </div>
            <div class="meta-field">
                <label>Status</label>
                <select onchange="window.CPFClient.updateMeta('status', CPFClient.value)">
                    <option value="in-progress" ${CPFClient.currentData.metadata.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                    <option value="completed" ${CPFClient.currentData.metadata.status === 'completed' ? 'selected' : ''}>Completed</option>
                    <option value="review" ${CPFClient.currentData.metadata.status === 'review' ? 'selected' : ''}>Under Review</option>
                </select>
            </div>
            <div class="meta-field" style="grid-column: 1 / -1;">
                <label>Notes</label>
                <textarea id="assessment-notes"
                          placeholder="Assessment notes..."
                          style="width: 100%; padding: 10px; border: 2px solid var(--border); border-radius: 8px; min-height: 80px; font-family: inherit; font-size: 14px; resize: vertical;"
                          onchange="window.CPFClient.updateMeta('notes', CPFClient.value)"
                          onblur="window.CPFClient.updateMeta('notes', CPFClient.value)">${CPFClient.currentData.metadata.notes || ''}</textarea>
            </div>
        `;

        const content = document.getElementById('content');
        let html = '';

        data.sections.forEach((section, sIdx) => {
            html += `
                <div class="section">
                    <div class="section-header">
                        <div class="section-icon">${section.icon || '📋'}</div>
                        <div class="section-title">${section.title}</div>
                        ${section.time ? `<div class="section-time">${section.time} minutes</div>` : ''}
                    </div>
            `;

            // Render items principali (safe check for array)
            if (section.items && Array.isArray(section.items)) {
                section.items.forEach((item, iIdx) => {
                    const itemId = item.id || `s${sIdx}_i${iIdx}`;
                    html += CPFClient.renderItem(item, itemId);
                });
            }

            // Render subsections (safe check for array)
            if (section.subsections && Array.isArray(section.subsections)) {
                section.subsections.forEach((sub, subIdx) => {
                    html += `
                        <div class="subsection">
                            <h3 class="subsection-title">${sub.title}</h3>
                            <div class="checkbox-list">
                    `;
                    if (sub.items && Array.isArray(sub.items)) {
                        sub.items.forEach((item, iIdx) => {
                            const itemId = item.id || `s${sIdx}_sub${subIdx}_i${iIdx}`;
                            html += CPFClient.renderItem(item, itemId);
                        });
                    }
                    html += `</div></div>`;
                });
            }

            html += `</div>`;
        });

        content.innerHTML = html;
        document.getElementById('action-bar').style.display = 'flex';
        document.getElementById('action-bar').innerHTML = `
            <div style="display: flex; gap: 15px;">
                <button class="btn btn-secondary" onclick="window.CPFClient.saveData()">💾 Save</button>
                <button class="btn btn-success" onclick="window.CPFClient.exportData()">📥 Export</button>
                <button class="btn btn-primary" onclick="window.CPFClient.generateReport()">📊 Report</button>
            </div>
        `;

        // Auto-calculate score on load if scoring is available
        if (data.scoring) {
            CPFClient.calculateIndicatorScore();
        }
    },

    renderItem(item, itemId) {
        const value = CPFClient.currentData.responses[itemId];

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
                    <input type="checkbox" id="${itemId}" ${checked} onchange="window.CPFClient.updateResponseWithAutoScore('${itemId}', CPFClient.checked)">
                    <label for="${itemId}">${item.label}</label>
                </div>
            `;

            // Gestione subitems
            if (item.subitems && Array.isArray(item.subitems) && item.subitems.length > 0) {
                html += '<div class="nested-items" style="margin-left: 25px; margin-top: 8px;">';
                item.subitems.forEach((sub, subIdx) => {
                    const subItemId = `${itemId}_sub${subIdx}`;
                    if (sub.type === 'checkbox') {
                        const subValue = CPFClient.currentData.responses[subItemId] || false;
                        html += `
                            <div class="checkbox-item ${subValue ? 'checked' : ''}" style="display: inline-block; margin-right: 15px;">
                                <input type="checkbox" id="${subItemId}" ${subValue ? 'checked' : ''}
                                       onchange="window.CPFClient.updateResponse('${subItemId}', CPFClient.checked)">
                                <label for="${subItemId}">${sub.label}</label>
                            </div>
                        `;
                    }
                    else if (sub.type === 'radio') {
                        const subValue = CPFClient.currentData.responses[`${itemId}_radio_value`];
                        html += `
                            <div class="radio-option" style="display: inline-block; margin-right: 15px;">
                                <input type="radio" name="${itemId}_radio" id="${subItemId}" value="${sub.label}"
                                       ${subValue === sub.label ? 'checked' : ''}
                                       onchange="window.CPFClient.updateResponse('${itemId}_radio_value', CPFClient.value)">
                                <label for="${subItemId}">${sub.label}</label>
                            </div>
                        `;
                    }
                    else if (sub.type === 'input') {
                        html += `
                            <div class="input-group" style="margin: 10px 0;">
                                <input type="text" id="${subItemId}" value="${CPFClient.currentData.responses[subItemId] || ''}"
                                       placeholder="${sub.label}" onchange="window.CPFClient.updateResponse('${subItemId}', CPFClient.value)"
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
                    <input type="text" id="${itemId}" value="${value || ''}" onchange="window.CPFClient.updateResponse('${itemId}', CPFClient.value)">
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
                    const followupValue = CPFClient.currentData.responses[followupId] || '';
                    html += `
                        <div style="margin-bottom: 10px;">
                            <div style="font-size: 14px; color: var(--text-light); margin-bottom: 5px;">
                                <em>${followup.type}:</em> ${followup.text}
                            </div>
                            <textarea id="${followupId}"
                                      placeholder="Notes..."
                                      style="width: 100%; padding: 10px; border: 2px solid var(--border); border-radius: 8px; min-height: 60px; font-family: inherit; font-size: 14px;"
                                      onchange="window.CPFClient.updateResponseWithAutoScore('${followupId}', CPFClient.value)"
                                      onblur="window.CPFClient.updateResponseWithAutoScore('${followupId}', CPFClient.value)">${followupValue}</textarea>
                        </div>
                    `;
                });
                html += `</div>`;
            }
            html += `</div>`;
            return html;
        }

        return '<div>[Unsupported item type]</div>';
    },

    // ============================================
    // RESPONSE HANDLING
    // ============================================
    updateMeta(field, value) {
        CPFClient.currentData.metadata[field] = value;
        CPFClient.autoSave();
    },

    updateResponse(id, value) {
        CPFClient.currentData.responses[id] = value;
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

        // Auto-calculate score when responses change
        if (CPFClient.currentData.fieldKit && CPFClient.currentData.fieldKit.scoring) {
            CPFClient.calculateIndicatorScore();
        }

        CPFClient.autoSave();
    },

    updateResponseWithAutoScore(id, value) {
        CPFClient.updateResponse(id, value);

        // Auto-calculate IMMEDIATELY
        if (CPFClient.currentData.fieldKit && CPFClient.currentData.fieldKit.scoring) {
            CPFClient.calculateIndicatorScore();

            // Save IMMEDIATELY to API
            if (CPFClient.organizationContext.orgId && CPFClient.currentScore) {
                CPFClient.saveToAPI().catch(err => {
                    console.error('Auto-save failed:', err);
                });
            }
        }
    },

    selectRadioOption(itemId, value) {
        CPFClient.currentData.responses[itemId] = value;

        const container = document.querySelector(`[data-item-id="${itemId}"]`);
        if (container) {
            const allOptions = container.querySelectorAll('.checkbox-item');
            allOptions.forEach(item => {
                item.classList.remove('checked');
                const checkbox = item.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.checked = false;
                }
            });

            const selectedOption = container.querySelector(`[data-value="${value}"]`);
            if (selectedOption) {
                selectedOption.classList.add('checked');
                const checkbox = selectedOption.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.checked = true;
                }
            }
        }

        if (CPFClient.currentData.fieldKit && CPFClient.currentData.fieldKit.scoring) {
            CPFClient.calculateIndicatorScore();
        }

        CPFClient.autoSave();
    },

    // ============================================
    // SAVE & EXPORT
    // ============================================
    async saveData() {
        localStorage.setItem('cpf_current', JSON.stringify(CPFClient.currentData));

        if (CPFClient.organizationContext.orgId && CPFClient.currentScore) {
            try {
                await CPFClient.saveToAPI();
            } catch (error) {
                console.error('❌ Save to API failed:', error);
            }
        }
    },

    async autoSave() {
        if (!CPFClient.currentData.fieldKit) {
            return;
        }

        localStorage.setItem('cpf_current', JSON.stringify(CPFClient.currentData));
        console.log('✅ Local auto-save at', new Date().toLocaleTimeString());

        if (CPFClient.organizationContext.orgId && CPFClient.currentScore) {
            try {
                await CPFClient.saveToAPI();
            } catch (error) {
                console.error('❌ Auto-save to API failed:', error);
            }
        }
    },

    async saveToAPI() {
        if (!CPFClient.organizationContext.orgId) {
            console.warn('⚠️ No organization context - cannot save to API');
            alert('⚠️ No organization context available');
            return;
        }

        if (!CPFClient.currentScore) {
            console.log('📊 Auto-calculating score before save...');
            CPFClient.calculateIndicatorScore();

            await new Promise(resolve => setTimeout(resolve, 500));

            if (!CPFClient.currentScore) {
                console.warn('⚠️ Score calculation failed - cannot save to API');
                alert('⚠️ Unable to calculate score. Please fill in the required fields.');
                return;
            }
        }

        const indicator = CPFClient.currentData.fieldKit.indicator;
        const timestamp = new Date().toISOString();

        const redFlagsArray = CPFClient.currentScore.details?.red_flags_list?.map(item => item.flag) || [];

        const completionRate = CPFClient.currentScore.details?.conversation_breakdown?.completion_rate || 0;
        const calculatedConfidence = 0.5 + (completionRate * 0.45);
        const confidence = Math.round(calculatedConfidence * 100) / 100;

        const assessmentData = {
            indicator_id: indicator,
            title: CPFClient.currentData.fieldKit.title || '',
            category: CPFClient.currentData.fieldKit.category || '',
            bayesian_score: CPFClient.currentScore.final_score,
            confidence: confidence,
            maturity_level: CPFClient.currentScore.maturity_level || 'yellow',
            assessor: CPFClient.currentData.metadata.auditor || 'Client User',
            assessment_date: timestamp,
            raw_data: {
                quick_assessment: CPFClient.currentScore.details?.quick_assessment_breakdown || {},
                client_conversation: {
                    responses: CPFClient.currentData.responses || {},
                    scores: CPFClient.currentScore,
                    metadata: CPFClient.currentData.metadata,
                    notes: CPFClient.currentData.metadata.notes || '',
                    red_flags: redFlagsArray
                }
            }
        };

        console.log('💾 Saving assessment to API:', {
            orgId: CPFClient.organizationContext.orgId,
            indicator,
            score: CPFClient.currentScore.final_score,
            confidence: confidence,
            maturity_level: CPFClient.currentScore.maturity_level
        });

        const response = await fetch(`/api/organizations/${CPFClient.organizationContext.orgId}/assessments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(assessmentData)
        });

        const result = await response.json();

        if (result.success) {
            console.log('✅ Assessment saved to API successfully');
            CPFClient.showAutoSaveIndicator();

            if (window.dashboardReloadOrganization) {
                window.dashboardReloadOrganization().catch(err => {
                    console.error('Failed to reload org data:', err);
                });
            }
        } else {
            throw new Error(result.error || 'API save failed');
        }
    },

    showAutoSaveIndicator() {
        const indicator = document.getElementById('auto-save-status');
        if (indicator) {
            indicator.style.display = 'inline';
            indicator.textContent = '✓ Auto-saved';
            indicator.style.color = '#4CAF50';

            setTimeout(() => {
                indicator.style.display = 'none';
            }, 3000);
        }
    },

    exportData() {
        if (!CPFClient.currentData.score && CPFClient.currentData.fieldKit) {
            CPFClient.calculateIndicatorScore();
        }

        const blob = new Blob([JSON.stringify(CPFClient.currentData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cpf_${CPFClient.currentData.fieldKit.indicator}_${CPFClient.currentData.metadata.client}_${CPFClient.currentData.metadata.date}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },

    generateReport() {
        if (!CPFClient.currentData.fieldKit) {
            alert('No assessment loaded');
            return;
        }

        if (!CPFClient.currentScore || !CPFClient.currentScore.final_score) {
            CPFClient.calculateIndicatorScore();
        }

        if (!CPFClient.currentScore || CPFClient.currentScore.final_score === undefined) {
            alert('Unable to calculate score. Please fill in the Quick Assessment section first.');
            return;
        }

        const maturityConfig = CPFClient.currentData.fieldKit.scoring?.maturity_levels?.[CPFClient.currentScore.maturity_level] || {
            color: '#888888',
            label: 'Unknown',
            description: 'Score calculated but maturity level not configured'
        };
        const scorePercentage = (CPFClient.currentScore.final_score * 100).toFixed(1);

        const report = document.createElement('div');
        report.innerHTML = `
            <div style="font-family: Arial; padding: 20px; max-width: 800px;">
                <div style="background: #1a1a2e; color: white; padding: 20px; margin-bottom: 20px;">
                    <h1>CPF Indicator ${CPFClient.currentData.fieldKit.indicator}</h1>
                    <h2>${CPFClient.currentData.fieldKit.title}</h2>
                </div>
                <div style="margin-bottom: 20px; padding: 10px; background: #f5f5f5;">
                    <strong>Date:</strong> ${CPFClient.currentData.metadata.date} |
                    <strong>Auditor:</strong> ${CPFClient.currentData.metadata.auditor}<br>
                    <strong>Client:</strong> ${CPFClient.currentData.metadata.client} |
                    <strong>Status:</strong> ${CPFClient.currentData.metadata.status}
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
                                ${(CPFClient.currentScore.quick_assessment * 100).toFixed(1)}%
                            </div>
                        </div>
                        <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
                            <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Red Flags (30%)</div>
                            <div style="font-size: 24px; font-weight: bold; color: #1a1a2e;">
                                ${(CPFClient.currentScore.red_flags * 100).toFixed(1)}%
                            </div>
                        </div>
                        <div style="background: white; padding: 15px; border-radius: 8px; text-align: center; border: 2px dashed #888;">
                            <div style="font-size: 12px; color: #888; margin-bottom: 5px;">Conversation Completeness</div>
                            <div style="font-size: 24px; font-weight: bold; color: #666;">
                                ${CPFClient.currentScore.details.conversation_breakdown.answered_questions}/${CPFClient.currentScore.details.conversation_breakdown.total_questions}
                            </div>
                            <div style="font-size: 10px; color: #999; margin-top: 3px;">(informational)</div>
                        </div>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 8px;">
                        <strong style="color: ${maturityConfig?.color};">Maturity Level: ${maturityConfig?.label}</strong><br>
                        <span style="font-size: 14px; color: #555;">${maturityConfig?.description}</span>
                    </div>
                </div>

                ${CPFClient.currentData.fieldKit.sections.map((section, sIdx) => `
                    <div style="margin-bottom: 20px; page-break-inside: avoid;">
                        <div style="background: #e0e0e0; padding: 10px; margin-bottom: 10px;">
                            <strong>${section.icon || '📋'} ${section.title}</strong>
                        </div>
                        ${(section.items || []).map((item, iIdx) => {
                            const itemId = `s${sIdx}_i${iIdx}`;
                            const response = CPFClient.currentData.responses[itemId];
                            if (item.type === 'radio-list' || item.type === 'radio-group') {
                                const selectedOption = item.options ? item.options.find(opt => opt.value === response) : null;
                                const selectedLabel = selectedOption ? selectedOption.label : 'N/A';
                                return `<div style="margin: 10px 0;">
                                    <div><strong>${item.number ? item.number + '. ' : ''}${item.title || ''}</strong></div>
                                    <div style="margin-left: 20px;">→ ${selectedLabel}</div>
                                </div>`;
                            }
                            else if (item.type === 'checkbox') {
                                return `<div style="margin: 5px 0;">${response ? '[✓]' : '[ ]'} ${item.label || ''}</div>`;
                            }
                            else if (item.type === 'input') {
                                return `<div style="margin: 10px 0;">
                                    <strong>${item.label || ''}:</strong><br>
                                    <div style="margin-left: 20px;">${response || '_____'}</div>
                                </div>`;
                            }
                            return '';
                        }).join('')}
                        ${(section.subsections || []).map((sub, subIdx) => `
                            <div style="margin: 15px 0; padding-left: 10px; border-left: 3px solid #ccc;">
                                <h3 style="font-size: 14px; margin: 10px 0;">${sub.title || ''}</h3>
                                ${(sub.items || []).map((item, iIdx) => {
                                    const itemId = `s${sIdx}_sub${subIdx}_i${iIdx}`;
                                    const response = CPFClient.currentData.responses[itemId];
                                   if (item.type === 'radio-list' || item.type === 'radio-group') {
                                        const selectedOption = item.options ? item.options.find(opt => opt.value === response) : null;
                                        const selectedLabel = selectedOption ? selectedOption.label : 'N/A';
                                        return `<div style="margin: 10px 0;">
                                            <div><strong>${item.number ? item.number + '. ' : ''}${item.title || ''}</strong></div>
                                            <div style="margin-left: 20px;">→ ${selectedLabel}</div>
                                        </div>`;
                                    }
                                    else if (item.type === 'checkbox') {
                                        return `<div style="margin: 5px 0;">${response ? '[✓]' : '[ ]'} ${item.label || ''}</div>`;
                                    }
                                    else if (item.type === 'question') {
                                        let questionHTML = `<div style="margin: 15px 0;">
                                            <div style="font-weight: bold; color: #1a1a2e; margin-bottom: 8px;">${item.text || ''}</div>`;

                                        if (item.followups) {
                                            item.followups.forEach((followup, fIdx) => {
                                                const followupId = `${itemId}_f${fIdx}`;
                                                const followupResponse = CPFClient.currentData.responses[followupId] || '';
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
            filename: `cpf_${CPFClient.currentData.fieldKit.indicator}_${CPFClient.currentData.metadata.client || 'client'}_${CPFClient.currentData.metadata.date}_SCORED.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        if (typeof html2pdf === 'undefined') {
            document.body.removeChild(report);
            alert('❌ PDF generation library not loaded. Please check your internet connection and reload the page.');
            return;
        }

        try {
            html2pdf().from(report).set(opt).save().then(() => {
                document.body.removeChild(report);
                console.log('✅ PDF generated successfully');
            }).catch(err => {
                document.body.removeChild(report);
                console.error('PDF generation error:', err);
                alert('❌ PDF generation failed: ' + err.message);
            });
        } catch (error) {
            document.body.removeChild(report);
            console.error('PDF generation error:', error);
            alert('❌ PDF generation failed: ' + error.message);
        }
    },

    resetAll() {
        if (!confirm('⚠️ This will clear all data and reset the application.\nAre you sure you want to continue?')) {
            return;
        }

        localStorage.removeItem('cpf_current');

        CPFClient.currentData = {
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

        CPFClient.currentScore = {
            quick_assessment: 0,
            conversation_depth: 0,
            red_flags: 0,
            final_score: 0,
            maturity_level: 'green',
            details: {}
        };

        const scoreBar = document.getElementById('score-bar');
        if (scoreBar) {
            scoreBar.remove();
        }

        const scoreSummary = document.getElementById('score-summary-section');
        if (scoreSummary) {
            scoreSummary.remove();
        }

        document.getElementById('header').innerHTML = `
            <div class="header-content">
                <h1>CPF Auditor Field Kit Client</h1>
                <div class="subtitle">JSON Edition - Lightweight & Fast</div>
            </div>
        `;

        document.getElementById('metadata-bar').style.display = 'none';
        document.getElementById('action-bar').style.display = 'none';

        document.getElementById('content').innerHTML = `
            <div class="empty-state">
                <h2>Welcome to CPF Field Kit JSON Client</h2>
                <p>Load a JSON field kit to begin assessment</p>
                <input type="file" id="file-input" accept=".json" onchange="importJSON(event)" style="display: none;">
                <button class="btn btn-primary" onclick="document.getElementById('file-input').click()" style="margin-top: 20px;">📁 Import JSON</button>
            </div>
        `;

        alert('✅ Application reset successfully! All data cleared.');
    },

    // ============================================
    // SCORE CALCULATION
    // ============================================
    calculateIndicatorScore() {
        if (!CPFClient.currentData.fieldKit || !CPFClient.currentData.fieldKit.scoring) {
            console.warn('⚠️ No field kit loaded or scoring configuration missing');
            return;
        }

        const scoring = CPFClient.currentData.fieldKit.scoring;
        const sections = CPFClient.currentData.fieldKit.sections;

        console.log('🔍 calculateIndicatorScore DEBUG:', {
            hasFieldKit: !!CPFClient.currentData.fieldKit,
            hasSections: !!sections,
            sectionsIsArray: Array.isArray(sections),
            sectionsLength: sections ? sections.length : 0,
            sectionTitles: sections ? sections.map(s => ({ id: s.id, title: s.title })) : []
        });

        if (!sections || !Array.isArray(sections) || sections.length === 0) {
            console.error('❌ CRITICAL: sections is empty or not an array!');
            return;
        }

        CPFClient.currentScore = {
            quick_assessment: 0,
            conversation_depth: 0,
            red_flags: 0,
            final_score: 0,
            maturity_level: 'green',
            details: {
                quick_assessment_breakdown: [],
                conversation_breakdown: {
                    total_questions: 0,
                    answered_questions: 0,
                    completion_rate: 0,
                    is_informational: true
                },
                red_flags_list: []
            }
        };

        // 1. CALCULATE QUICK ASSESSMENT SCORE
        const quickSection = sections.find(s => s.id === 'quick-assessment');
        if (quickSection && quickSection.items) {
            let totalWeight = 0;
            let weightedScore = 0;

            quickSection.items.forEach((item, idx) => {
                const itemId = item.id || `s0_i${idx}`;
                const response = CPFClient.currentData.responses[itemId];

                if (response && item.options) {
                    const selectedOption = item.options.find(opt => opt.value === response);
                    if (selectedOption && typeof selectedOption.score !== 'undefined') {
                        const weight = scoring.question_weights?.[item.id] || item.weight || (1 / quickSection.items.length);
                        weightedScore += selectedOption.score * weight;
                        totalWeight += weight;

                        CPFClient.currentScore.details.quick_assessment_breakdown.push({
                            question: item.title,
                            response: selectedOption.label,
                            score: selectedOption.score,
                            weight: weight,
                            weighted_score: selectedOption.score * weight
                        });
                    }
                }
            });

            CPFClient.currentScore.quick_assessment = totalWeight > 0 ? weightedScore / totalWeight : 0;
        }

        // 2. TRACK CONVERSATION COMPLETENESS
        let convSectionIndex = sections.findIndex(s => s.id === 'client-conversation');

        if (convSectionIndex < 0) {
            convSectionIndex = sections.findIndex(s => s.type === 'conversation');
        }

        if (convSectionIndex < 0) {
            convSectionIndex = sections.findIndex(s =>
                s.title && (
                    s.title.toLowerCase().includes('conversation') ||
                    s.title.toLowerCase().includes('conversazione') ||
                    s.title.toLowerCase().includes('cliente') ||
                    s.title.toLowerCase().includes('client')
                )
            );
        }

        const convSection = convSectionIndex >= 0 ? sections[convSectionIndex] : null;

        console.log('📊 Conversation completeness calculation:', {
            convSectionIndex,
            hasConvSection: !!convSection,
            sectionCount: sections.length,
            sectionIds: sections.map(s => s.id || 'NO_ID'),
            sectionTitles: sections.map(s => s.title || 'NO_TITLE')
        });

        if (convSection) {
            let totalQuestions = 0;
            let answeredQuestions = 0;

            const processItems = (items, baseId) => {
                if (!items || !Array.isArray(items)) {
                    console.warn('⚠️ processItems: items is not an array', items);
                    return;
                }

                items.forEach((item, iIdx) => {
                    if (item.type === 'question') {
                        const itemId = item.id || `${baseId}_i${iIdx}`;
                        const followups = item.followups || item.followup || [];

                        if (Array.isArray(followups) && followups.length > 0) {
                            followups.forEach((followup, fIdx) => {
                                totalQuestions++;
                                const followupId = `${itemId}_f${fIdx}`;
                                const followupResponse = CPFClient.currentData.responses[followupId];

                                if (followupResponse && String(followupResponse).trim().length > 0) {
                                    answeredQuestions++;
                                }
                            });
                        }
                    }
                });
            };

            if (convSection.subsections && Array.isArray(convSection.subsections) && convSection.subsections.length > 0) {
                console.log('📋 Processing subsections:', convSection.subsections.length);
                convSection.subsections.forEach((subsection, subIdx) => {
                    if (subsection.items && Array.isArray(subsection.items)) {
                        processItems(subsection.items, `s${convSectionIndex}_sub${subIdx}`);
                    }
                });
            }

            if (convSection.items && Array.isArray(convSection.items) && convSection.items.length > 0) {
                console.log('📋 Processing direct items:', convSection.items.length);
                processItems(convSection.items, `s${convSectionIndex}`);
            }

            const completionRate = totalQuestions > 0 ? answeredQuestions / totalQuestions : 0;
            CPFClient.currentScore.conversation_depth = 0;

            CPFClient.currentScore.details.conversation_breakdown = {
                total_questions: totalQuestions,
                answered_questions: answeredQuestions,
                completion_rate: completionRate,
                is_informational: true
            };

            console.log('✅ Conversation completeness calculated:', {
                totalQuestions,
                answeredQuestions,
                completionRate: (completionRate * 100).toFixed(1) + '%'
            });
        } else {
            console.warn('⚠️ No client-conversation section found, setting defaults');
            CPFClient.currentScore.details.conversation_breakdown = {
                total_questions: 0,
                answered_questions: 0,
                completion_rate: 0,
                is_informational: true
            };
        }

        // 3. CALCULATE RED FLAGS SCORE
        let redFlagsItems = [];

        sections.forEach((section, sIdx) => {
            if (section.items && Array.isArray(section.items)) {
                section.items.forEach((item, iIdx) => {
                    if (item.severity) {
                        redFlagsItems.push(item);
                    }
                });
            }

            if (section.subsections && Array.isArray(section.subsections)) {
                section.subsections.forEach((subsection, subIdx) => {
                    if (subsection.items && Array.isArray(subsection.items)) {
                        subsection.items.forEach((item, iIdx) => {
                            if (item.severity) {
                                redFlagsItems.push(item);
                            }
                        });
                    }
                });
            }
        });

        if (redFlagsItems.length > 0) {
            let totalRedFlagImpact = 0;

            redFlagsItems.forEach((item) => {
                const itemId = item.id;
                if (!itemId) return;

                const isChecked = CPFClient.currentData.responses[itemId];
                const impact = item.score_impact || item.weight || 0;

                if (isChecked && impact > 0) {
                    totalRedFlagImpact += impact;
                    CPFClient.currentScore.details.red_flags_list.push({
                        flag: item.label || item.title || item.description,
                        impact: impact
                    });
                }
            });

            CPFClient.currentScore.red_flags = Math.min(totalRedFlagImpact, 1);
        }

        // 4. CALCULATE FINAL VULNERABILITY SCORE
        const QUICK_WEIGHT = 0.70;
        const RED_FLAGS_WEIGHT = 0.30;

        CPFClient.currentScore.final_score = (
            CPFClient.currentScore.quick_assessment * QUICK_WEIGHT +
            CPFClient.currentScore.red_flags * RED_FLAGS_WEIGHT
        );

        CPFClient.currentScore.weights_used = {
            quick_assessment: QUICK_WEIGHT,
            red_flags: RED_FLAGS_WEIGHT,
            conversation_depth: 0
        };

        // 5. DETERMINE MATURITY LEVEL
        const maturityLevels = scoring.maturity_levels;
        if (CPFClient.currentScore.final_score <= maturityLevels.green.score_range[1]) {
            CPFClient.currentScore.maturity_level = 'green';
        } else if (CPFClient.currentScore.final_score <= maturityLevels.yellow.score_range[1]) {
            CPFClient.currentScore.maturity_level = 'yellow';
        } else {
            CPFClient.currentScore.maturity_level = 'red';
        }

        // 6. UPDATE UI
        CPFClient.updateScoreDisplay();

        CPFClient.currentData.score = CPFClient.currentScore;

        console.log('📊 Score Calculated:', CPFClient.currentScore);
    },

    updateScoreDisplay() {
        const scoreBarDiv = document.getElementById('score-bar');
        const existingBreakdown = document.getElementById('score-detailed-breakdown');

        const maturityConfig = CPFClient.currentData.fieldKit.scoring.maturity_levels[CPFClient.currentScore.maturity_level];
        const scorePercentage = (CPFClient.currentScore.final_score * 100).toFixed(1);
        const weights = CPFClient.currentScore.weights_used || { quick_assessment: 0.70, red_flags: 0.30, conversation_depth: 0 };

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
                        <div class="progress-bar-fill ${CPFClient.currentScore.maturity_level}" id="score-bar-fill" style="width: ${scorePercentage}%">
                            ${scorePercentage}%
                        </div>
                    </div>
                </div>
                <div class="maturity-badge-container">
                    <div class="maturity-label">MATURITY LEVEL</div>
                    <div class="maturity-badge ${CPFClient.currentScore.maturity_level}" id="maturity-badge">
                        ${maturityConfig.label}
                    </div>
                </div>
            </div>

            <div id="score-detailed-breakdown" class="score-detailed-breakdown" style="display: none;">
                <div class="score-breakdown">
                    <div class="score-component">
                        <div class="component-label">Quick Assessment</div>
                        <div class="component-value" id="quick-val">${(CPFClient.currentScore.quick_assessment * 100).toFixed(1)}%</div>
                        <div class="component-description">
                            Based on <span id="quick-count">${CPFClient.currentScore.details.quick_assessment_breakdown.length}</span> questions
                            (Weight: ${(weights.quick_assessment * 100)}%)
                        </div>
                    </div>

                    <div class="score-component">
                        <div class="component-label">Red Flags</div>
                        <div class="component-value" id="flags-val">${(CPFClient.currentScore.red_flags * 100).toFixed(1)}%</div>
                        <div class="component-description">
                            <span id="flags-count">${CPFClient.currentScore.details.red_flags_list.length}</span> flags detected
                            (Weight: ${(weights.red_flags * 100)}%)
                        </div>
                    </div>

                    <div class="score-component" style="border: 2px dashed #ccc; background: #fafafa;">
                        <div class="component-label">Conversation Completeness</div>
                        <div class="component-value" style="color: #666;" id="conv-val">${(CPFClient.currentScore.details.conversation_breakdown.completion_rate * 100).toFixed(0)}%</div>
                        <div class="component-description" style="color: #888; font-size: 12px;">
                            <span id="conv-answered">${CPFClient.currentScore.details.conversation_breakdown.answered_questions}</span>/<span id="conv-total">${CPFClient.currentScore.details.conversation_breakdown.total_questions}</span> answered
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
                    <div id="quick-breakdown">${CPFClient.currentScore.details.quick_assessment_breakdown.map(item => `
                        <div class="detail-row">
                            <span class="detail-label">${item.question}</span>
                            <span class="detail-value">${(item.weighted_score * 100).toFixed(1)}%</span>
                        </div>
                    `).join('')}</div>

                    <div id="flags-breakdown">${CPFClient.currentScore.details.red_flags_list.length > 0 ? `
                        <h4 style="margin: 20px 0 15px; color: var(--danger);">Red Flags Detected</h4>
                        ${CPFClient.currentScore.details.red_flags_list.map(flag => `
                            <div class="detail-row">
                                <span class="detail-label">⚠️ ${flag.flag}</span>
                                <span class="detail-value" style="color: var(--danger);">+${(flag.impact * 100).toFixed(1)}%</span>
                            </div>
                        `).join('')}
                    ` : ''}</div>

                    <div class="calculation-formula" id="calc-formula">
                        <strong>Vulnerability Score Calculation:</strong><br>
                        Final Score = (Quick Assessment × ${weights.quick_assessment}) + (Red Flags × ${weights.red_flags})<br>
                        Final Score = (${CPFClient.currentScore.quick_assessment.toFixed(3)} × ${weights.quick_assessment}) + (${CPFClient.currentScore.red_flags.toFixed(3)} × ${weights.red_flags})<br>
                        <strong>Final Score = ${CPFClient.currentScore.final_score.toFixed(3)} (${scorePercentage}%)</strong><br>
                        <em style="color: #888; font-size: 12px;">Note: Conversation completeness is tracked separately for reference</em>
                    </div>
                </div>
            </div>`;

            document.getElementById('score-bar').style.display = 'block';

        } else {
            const scoreValEl = document.getElementById('score-val');
            if (scoreValEl) scoreValEl.textContent = scorePercentage + '%';

            const fill = document.getElementById('score-bar-fill');
            if (fill) {
                fill.className = `progress-bar-fill ${CPFClient.currentScore.maturity_level}`;
                fill.style.width = scorePercentage + '%';
                fill.textContent = scorePercentage + '%';
            }

            const badge = document.getElementById('maturity-badge');
            if (badge) {
                badge.className = `maturity-badge ${CPFClient.currentScore.maturity_level}`;
                badge.textContent = maturityConfig.label;
            }

            const quickValEl = document.getElementById('quick-val');
            if (quickValEl) quickValEl.textContent = (CPFClient.currentScore.quick_assessment * 100).toFixed(1) + '%';

            const quickCountEl = document.getElementById('quick-count');
            if (quickCountEl) quickCountEl.textContent = CPFClient.currentScore.details.quick_assessment_breakdown.length;

            const flagsValEl = document.getElementById('flags-val');
            if (flagsValEl) flagsValEl.textContent = (CPFClient.currentScore.red_flags * 100).toFixed(1) + '%';

            const flagsCountEl = document.getElementById('flags-count');
            if (flagsCountEl) flagsCountEl.textContent = CPFClient.currentScore.details.red_flags_list.length;

            const convValEl = document.getElementById('conv-val');
            if (convValEl) convValEl.textContent = (CPFClient.currentScore.details.conversation_breakdown.completion_rate * 100).toFixed(0) + '%';

            const convAnsweredEl = document.getElementById('conv-answered');
            if (convAnsweredEl) convAnsweredEl.textContent = CPFClient.currentScore.details.conversation_breakdown.answered_questions;

            const convTotalEl = document.getElementById('conv-total');
            if (convTotalEl) convTotalEl.textContent = CPFClient.currentScore.details.conversation_breakdown.total_questions;

            const interpTextEl = document.getElementById('interp-text');
            if (interpTextEl) interpTextEl.innerHTML = `<strong style="color: ${maturityConfig.color};">${maturityConfig.label}:</strong> ${maturityConfig.description}`;

            const quickBreakdownEl = document.getElementById('quick-breakdown');
            if (quickBreakdownEl) {
                quickBreakdownEl.innerHTML = CPFClient.currentScore.details.quick_assessment_breakdown.map(item => `
                    <div class="detail-row">
                        <span class="detail-label">${item.question}</span>
                        <span class="detail-value">${(item.weighted_score * 100).toFixed(1)}%</span>
                    </div>
                `).join('');
            }

            const flagsBreakdownEl = document.getElementById('flags-breakdown');
            if (flagsBreakdownEl) {
                flagsBreakdownEl.innerHTML = CPFClient.currentScore.details.red_flags_list.length > 0 ? `
                    <h4 style="margin: 20px 0 15px; color: var(--danger);">Red Flags Detected</h4>
                    ${CPFClient.currentScore.details.red_flags_list.map(flag => `
                        <div class="detail-row">
                            <span class="detail-label">⚠️ ${flag.flag}</span>
                            <span class="detail-value" style="color: var(--danger);">+${(flag.impact * 100).toFixed(1)}%</span>
                        </div>
                    `).join('')}
                ` : '';
            }

            const calcFormulaEl = document.getElementById('calc-formula');
            if (calcFormulaEl) {
                calcFormulaEl.innerHTML = `
                    <strong>Vulnerability Score Calculation:</strong><br>
                    Final Score = (Quick Assessment × ${weights.quick_assessment}) + (Red Flags × ${weights.red_flags})<br>
                    Final Score = (${CPFClient.currentScore.quick_assessment.toFixed(3)} × ${weights.quick_assessment}) + (${CPFClient.currentScore.red_flags.toFixed(3)} × ${weights.red_flags})<br>
                    <strong>Final Score = ${CPFClient.currentScore.final_score.toFixed(3)} (${scorePercentage}%)</strong><br>
                    <em style="color: #888; font-size: 12px;">Note: Conversation completeness is tracked separately for reference</em>
                `;
            }
        }
    },

    toggleScoreDetails() {
        const detailsDiv = document.getElementById('score-details-content');
        detailsDiv.classList.toggle('visible');

        const button = event.target;
        if (detailsDiv.classList.contains('visible')) {
            button.textContent = '📉 Hide Detailed Breakdown';
        } else {
            button.textContent = '📈 Show Detailed Breakdown';
        }
    },

    toggleDetailedAnalysis() {
        const breakdown = document.getElementById('score-detailed-breakdown');
        if (!breakdown) return;

        if (breakdown.style.display === 'none') {
            breakdown.style.display = 'block';
        } else {
            breakdown.style.display = 'none';
        }
    },

    // ============================================
    // QUICK REFERENCE GUIDE
    // ============================================
    async showQuickReference() {
        const modal = document.getElementById('reference-modal');
        const content = document.getElementById('reference-content');

        modal.style.display = 'flex';

        if (typeof pushModal === 'function') {
            pushModal('reference-modal');
        }

        const isoLang = CPFClient.organizationContext.language ||
                       CPFClient.currentData?.fieldKit?.language ||
                       'en-US';

        if (CPFClient.referenceData && CPFClient.loadedLanguage === isoLang) {
            CPFClient.renderReferenceContent(content, CPFClient.referenceData);
            return;
        }

        try {
            content.innerHTML = '<p style="text-align: center; color: #7f8c8d; padding: 40px;">Loading reference guide...</p>';

            const response = await fetch(`../auditing/reference_guide_${isoLang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load reference guide: ${response.status}`);
            }

            CPFClient.referenceData = await response.json();
            CPFClient.loadedLanguage = isoLang;
            CPFClient.renderReferenceContent(content, CPFClient.referenceData);
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
    },

    renderReferenceContent(container, data) {
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
    },

    toggleCategory(categoryId) {
        const body = document.getElementById(`category-${categoryId}`);
        const header = body.previousElementSibling;
        const arrow = header.querySelector('.category-arrow');

        header.classList.toggle('active');
        body.classList.toggle('active');

        if (body.classList.contains('active')) {
            arrow.textContent = '▼';
        } else {
            arrow.textContent = '▶';
        }
    },

    async loadIndicatorFromReference(indicatorId) {
        console.log('📥 loadIndicatorFromReference called with:', indicatorId);

        if (!indicatorId) {
            alert('❌ Error: No indicator ID provided to loadIndicatorFromReference');
            console.error('indicatorId is null or undefined');
            return;
        }

        const parts = indicatorId.split('.');
        const category = parts[0];
        const indicator = parts[1];

        console.log('🔧 Parsed:', { category, indicator });

        const categorySelect = document.getElementById('category-select');
        const indicatorSelect = document.getElementById('indicator-select');

        if (categorySelect) categorySelect.value = category;
        if (indicatorSelect) indicatorSelect.value = indicator;

        CPFClient.closeQuickReference();

        await CPFClient.loadJSON(indicatorId);
    },

    closeQuickReference() {
        const modal = document.getElementById('reference-modal');
        modal.style.display = 'none';

        if (typeof popModal === 'function') {
            popModal('reference-modal');
        }
    },

    // ============================================
    // LOAD EXISTING EXPORT
    // ============================================
    async loadExistingExport(indicatorId, orgId) {
        try {
            console.log(`📥 Loading existing export for ${orgId}/${indicatorId}...`);

            const response = await fetch(`/api/get-export?org_id=${encodeURIComponent(orgId)}&indicator_id=${encodeURIComponent(indicatorId)}`);

            if (!response.ok) {
                if (response.status === 404) {
                    alert(`⚠️ Export not found for ${orgId}/${indicatorId}. Loading empty form.`);
                    await CPFClient.loadIndicatorFromReference(indicatorId);
                    return;
                }
                throw new Error(`Failed to load export: ${response.status}`);
            }

            const result = await response.json();
            const exportData = result.data;

            console.log('✅ Export loaded:', exportData);

            const [categoryNum, indicatorNum] = indicatorId.split('.');
            const categoryName = CPFClient.getCategoryName(categoryNum);

            const langCode = CPFClient.organizationContext.language ||
                            (document.getElementById('lang-select')?.value === 'IT' ? 'it-IT' : 'en-US');

            const url = `/auditor-field-kit/interactive/${langCode}/${categoryNum}.x-${categoryName}/indicator_${indicatorId}.json`;
            console.log('Loading Field Kit from local:', url);

            const fieldKitResponse = await fetch(url);
            if (!fieldKitResponse.ok) {
                throw new Error(`Failed to load Field Kit JSON: ${fieldKitResponse.status}`);
            }

            const fieldKit = await fieldKitResponse.json();

            CPFClient.currentData.fieldKit = fieldKit;

            if (exportData.full_assessment) {
                console.log('📋 Loading data from full_assessment...');
                console.log('🔍 full_assessment structure:', Object.keys(exportData.full_assessment));

                if (exportData.full_assessment.raw_data) {
                    console.log('🔍 raw_data structure:', Object.keys(exportData.full_assessment.raw_data));

                    if (exportData.full_assessment.raw_data.client_conversation?.responses) {
                        CPFClient.currentData.responses = exportData.full_assessment.raw_data.client_conversation.responses;
                        console.log('✅ Responses loaded from raw_data:', Object.keys(CPFClient.currentData.responses).length, 'items');
                        console.log('📝 Response keys:', Object.keys(CPFClient.currentData.responses));
                    }

                    if (exportData.full_assessment.raw_data.client_conversation?.metadata) {
                        CPFClient.currentData.metadata = {
                            ...CPFClient.currentData.metadata,
                            ...exportData.full_assessment.raw_data.client_conversation.metadata
                        };
                    }

                    if (exportData.full_assessment.raw_data.client_conversation?.notes) {
                        CPFClient.currentData.metadata.notes = exportData.full_assessment.raw_data.client_conversation.notes;
                        console.log('✅ Notes loaded:', CPFClient.currentData.metadata.notes);
                    }
                }
                else if (exportData.full_assessment.responses) {
                    CPFClient.currentData.responses = exportData.full_assessment.responses;
                    console.log('✅ Responses loaded (legacy format):', Object.keys(CPFClient.currentData.responses).length, 'items');

                    if (exportData.full_assessment.metadata) {
                        CPFClient.currentData.metadata = {
                            ...CPFClient.currentData.metadata,
                            ...exportData.full_assessment.metadata
                        };
                    }
                }

                if (exportData.full_assessment.maturity_scores) {
                    CPFClient.currentData.scores = exportData.full_assessment.maturity_scores;
                }

                if (exportData.full_assessment.risk_assessments) {
                    CPFClient.currentData.assessments = exportData.full_assessment.risk_assessments;
                }

                if (exportData.full_assessment.notes) {
                    const notesTextarea = document.getElementById('notes');
                    if (notesTextarea) {
                        notesTextarea.value = exportData.full_assessment.notes;
                    }
                }
            } else {
                console.log('⚠️ Old format export detected, using indicator_data fallback');
                CPFClient.currentData.metadata = exportData.metadata || CPFClient.currentData.metadata;
            }

            CPFClient.renderFieldKit(fieldKit);

            localStorage.setItem('cpf_current', JSON.stringify(CPFClient.currentData));

            console.log(`✅ Loaded existing assessment for ${exportData.organization_name}`);

        } catch (error) {
            console.error('Error loading existing export:', error);
            await CPFClient.loadIndicatorFromReference(indicatorId);
        }
    },

    getCategoryName(categoryNum) {
        return CPFClient.CATEGORY_MAP[categoryNum] || 'unknown';
    },

    // ============================================
    // STANDALONE INITIALIZATION
    // ============================================
    initStandalone() {
        // Skip auto-init if we're integrated into dashboard
        const isDashboardIntegrated = document.querySelector('.dashboard-container') !== null;

        if (isDashboardIntegrated) {
            console.log('🎯 Client detected dashboard integration - skipping auto-init');
            console.log('✅ CPFClient namespace available for manual initialization');
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);

        const indicatorParam = urlParams.get('indicator');
        const langParam = urlParams.get('lang') || urlParams.get('language');
        const modeParam = urlParams.get('mode');
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

        if (orgIdParam) {
            CPFClient.organizationContext.orgId = orgIdParam;
        }
        if (orgNameParam) {
            CPFClient.organizationContext.orgName = orgNameParam;
        }
        if (langParam) {
            CPFClient.organizationContext.language = langParam;
        }

        if (CPFClient.organizationContext.orgId && CPFClient.organizationContext.orgName) {
            CPFClient.displayOrganizationInfo();
            CPFClient.currentData.metadata.client = CPFClient.organizationContext.orgName;
        }

        if (langParam) {
            const langSelect = document.getElementById('lang-select');
            if (langSelect) {
                const shortLang = langParam.split('-')[0].toUpperCase();
                langSelect.value = shortLang;
            }
        }

        console.log('✅ Client v2.0 initialized with organization:', CPFClient.organizationContext);

        if (indicatorParam) {
            console.log(`🔗 Loading indicator ${indicatorParam} from URL (mode: ${modeParam || 'new'})`);

            if (window.history && window.history.replaceState) {
                const cleanUrl = window.location.pathname;
                window.history.replaceState(null, '', cleanUrl);
                console.log('🧹 URL cleaned, parameters removed');
            }

            setTimeout(async () => {
                if (modeParam === 'edit' && orgIdParam) {
                    console.log(`📥 Edit mode: loading assessment for org=${orgIdParam}, indicator=${indicatorParam}`);
                    await CPFClient.loadExistingExport(indicatorParam, orgIdParam);
                } else {
                    console.log(`📄 New mode: loading indicator ${indicatorParam} from local files`);
                    await CPFClient.loadIndicatorFromReference(indicatorParam);
                }
            }, 100);
            return;
        }

        const saved = localStorage.getItem('cpf_current');
        if (saved) {
            CPFClient.currentData = JSON.parse(saved);
            if (CPFClient.currentData.fieldKit) {
                CPFClient.renderFieldKit(CPFClient.currentData.fieldKit);
            }
        }
    }
};

// ============================================
// GLOBAL EXPORT & INITIALIZATION
// ============================================

// Export to global scope for dashboard.js compatibility
window.CPFClient = CPFClient;

// Initialize module
CPFClient.init();

// Auto-init when DOM is ready (standalone mode)
window.addEventListener('DOMContentLoaded', () => {
    CPFClient.initStandalone();
});
