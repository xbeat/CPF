let currentData = {
    fieldKit: null,
    metadata: {
        date: new Date().toISOString().split('T')[0],
        auditor: '',
        client: '',
        status: 'in-progress'
    },
    responses: {}
};

// Auto-save every 30 seconds
setInterval(() => {
    if (currentData.fieldKit) {
        localStorage.setItem('cpf_current', JSON.stringify(currentData));
    }
}, 30000);

// Language code mapping
const LANG_MAP = {
    'EN': 'en-US',
    'IT': 'it-IT',
    'ES': 'es-ES',
    'FR': 'fr-FR',
    'DE': 'de-DE'
};

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

            // Construct GitHub raw URL for multilingual structure
            fetchUrl = `https://raw.githubusercontent.com/xbeat/CPF/main/auditor%20field%20kit/interactive/${isoLang}/${categoryNum}.x-${categoryName}/indicator_${indicator}.json`;
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
                    status: 'in-progress'
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
            <input type="date" value="${currentData.metadata.date}" onchange="updateMeta('date', this.value)">
        </div>
        <div class="meta-field">
            <label>Auditor</label>
            <input type="text" value="${currentData.metadata.auditor}" onchange="updateMeta('auditor', this.value)" placeholder="Your name">
        </div>
        <div class="meta-field">
            <label>Client</label>
            <input type="text" value="${currentData.metadata.client}" onchange="updateMeta('client', this.value)" placeholder="Client name">
        </div>
        <div class="meta-field">
            <label>Status</label>
            <select onchange="updateMeta('status', this.value)">
                <option value="in-progress" ${currentData.metadata.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                <option value="completed" ${currentData.metadata.status === 'completed' ? 'selected' : ''}>Completed</option>
                <option value="review" ${currentData.metadata.status === 'review' ? 'selected' : ''}>Under Review</option>
            </select>
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
            <button class="btn btn-secondary" onclick="saveData()">💾 Save</button>
        </div>
        <div style="display: flex; gap: 15px;">
            <button class="btn btn-success" onclick="exportData()">📥 Export</button>
            <button class="btn btn-primary" onclick="generateReport()">📊 Report</button>
        </div>
    `;

    // Auto-calculate score on load if scoring is available
    if (data.scoring) {
        calculateIndicatorScore();
    }
}

function renderItem(item, itemId) {
    const value = currentData.responses[itemId];

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
                                    onchange="updateResponseWithAutoScore('${itemId}', '${opt.value}')">
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
                                       onchange="selectRadioOption('${itemId}', '${opt.value}')">
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
                <input type="checkbox" id="${itemId}" ${checked} onchange="updateResponseWithAutoScore('${itemId}', this.checked)">
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
                                   onchange="updateResponse('${subItemId}', this.checked)">
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
                                   onchange="updateResponse('${itemId}_radio_value', this.value)">
                            <label for="${subItemId}">${sub.label}</label>
                        </div>
                    `;
                }
                else if (sub.type === 'input') {
                    html += `
                        <div class="input-group" style="margin: 10px 0;">
                            <input type="text" id="${subItemId}" value="${currentData.responses[subItemId] || ''}"
                                   placeholder="${sub.label}" onchange="updateResponse('${subItemId}', this.value)"
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
                <input type="text" id="${itemId}" value="${value || ''}" onchange="updateResponse('${itemId}', this.value)">
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
                                  onchange="updateResponseWithAutoScore('${followupId}', this.value)"
                                  onblur="updateResponseWithAutoScore('${followupId}', this.value)">${followupValue}</textarea>
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

    // Auto-save immediately
    autoSave();
}

function saveData() {
    localStorage.setItem('cpf_current', JSON.stringify(currentData));
    alert('✅ Assessment saved to browser storage!');
}

function autoSave() {
    if (currentData.fieldKit) {
        localStorage.setItem('cpf_current', JSON.stringify(currentData));
        console.log('✅ Auto-saved at', new Date().toLocaleTimeString());
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

    // Auto-save immediately
    autoSave();

    // Trigger auto-calculation IMMEDIATELY (no lag)
    if (currentData.fieldKit && currentData.fieldKit.scoring) {
        calculateIndicatorScore();
    }
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
            status: 'in-progress'
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
                <button class="btn btn-light" onclick="toggleScoreDetails()">
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

// Auto-calculate score when responses change (optional - real-time)
function updateResponseWithAutoScore(id, value) {
    updateResponse(id, value);

    // Auto-calculate IMMEDIATELY (no lag)
    if (currentData.fieldKit && currentData.fieldKit.scoring) {
        calculateIndicatorScore();
    }
}

// Export assessment to Dashboard format
async function exportToDashboard() {
    if (!currentData.fieldKit || !currentScore) {
        alert('Please complete an assessment and calculate the score first');
        return;
    }

    const orgId = prompt('Enter organization ID (e.g., org-001):', 'org-001');
    if (!orgId) return;

    const orgName = prompt('Enter organization name:', currentData.metadata.client || 'Organization');
    if (!orgName) return;

    // Convert Field Kit assessment to dashboard format
    const indicator = currentData.fieldKit.indicator;
    const timestamp = new Date().toISOString();

    // Create indicator entry
    const indicatorEntry = {
        soc_values: [], // No SOC data from Field Kit
        human_values: [{
            timestamp: timestamp,
            value: currentScore.final_score,
            assessor: currentData.metadata.auditor || 'Unknown',
            assessment_id: `fk-${Date.now()}`
        }],
        current_bayesian: currentScore.final_score,
        last_updated: timestamp
    };

    // Create minimal organization structure for dashboard import
    const dashboardExport = {
        organization_id: orgId,
        organization_name: orgName,
        indicator_id: indicator,
        indicator_data: indicatorEntry,
        metadata: {
            exported_from: 'field_kit',
            export_timestamp: timestamp,
            field_kit_version: '1.0'
        }
    };

    try {
        // Save directly to server via API
        console.log('💾 Saving export to server...');

        const response = await fetch('/api/save-export', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                exportData: dashboardExport
            })
        });

        const result = await response.json();

        if (result.success) {
            alert(
                `✅ Assessment Saved Successfully!\n\n` +
                `Organization: ${result.organization}\n` +
                `Indicator: ${result.indicator}\n` +
                `File: ${result.filename}\n\n` +
                `The assessment has been saved to field_kit_exports/ and is ready for batch import.`
            );
            console.log('✅ Export saved:', result);
        } else {
            throw new Error(result.error || 'Save failed');
        }

    } catch (error) {
        console.error('❌ Export error:', error);

        // Fallback to browser download if server save fails
        const fallback = confirm(
            `❌ Server Save Failed\n\n` +
            `Error: ${error.message}\n\n` +
            `Would you like to download the file instead?\n` +
            `(You'll need to manually move it to field_kit_exports/)`
        );

        if (fallback) {
            // Download as JSON (fallback)
            const blob = new Blob([JSON.stringify(dashboardExport, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `dashboard_export_${orgId}_${indicator}_${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);

            alert(`⚠️ File downloaded to your Downloads folder.\n\nPlease move it to field_kit_exports/ manually.`);
        }
    }
}

// Funzione:
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

        const response = await fetch(`reference_guide_${isoLang}.json`);
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
                <div class="category-header" onclick="toggleCategory(${category.id})">
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
                            <div class="indicator-item" onclick="loadIndicatorFromReference('${indicator.id}')" title="Click to load this indicator">
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
    const header = event.currentTarget;
    const body = document.getElementById(`category-${categoryId}`);

    // Toggle active state
    header.classList.toggle('active');
    body.classList.toggle('active');
}

function loadIndicatorFromReference(indicatorId) {
    // Parse indicator ID (e.g., "1.3" -> category=1, indicator=3)
    const parts = indicatorId.split('.');
    const category = parts[0];
    const indicator = parts[1];

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

    // Load the indicator
    loadJSON();
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

/**
 * Batch import all Field Kit exports and open auditing dashboard
 * Calls server API to process all exports and view results
 */
async function batchImportAndViewDashboard() {
    const confirmed = confirm(
        '📊 Batch Import & View Dashboard\n\n' +
        'This will:\n' +
        '1. Import all Field Kit exports from the configured folder\n' +
        '2. Update organizations.json and auditing_results.json\n' +
        '3. Open the Auditing Dashboard to view results\n\n' +
        'Continue?'
    );

    if (!confirmed) return;

    try {
        // Show loading indicator
        const originalContent = document.querySelector('.toolbar').innerHTML;
        const toolbar = document.querySelector('.toolbar');

        const loadingMsg = document.createElement('div');
        loadingMsg.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 30px; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); z-index: 10000; text-align: center;';
        loadingMsg.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 15px;">⚙️</div>
            <h3 style="margin-bottom: 10px; color: #1a1a2e;">Batch Import in Progress...</h3>
            <p style="color: #7f8c8d; margin-bottom: 20px;">Processing Field Kit exports</p>
            <div class="spinner" style="margin: 0 auto;"></div>
        `;
        document.body.appendChild(loadingMsg);

        // Call batch import API
        console.log('🔧 Calling batch import API...');

        const response = await fetch('/api/batch-import', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                folderPath: null // Use default folder (../field_kit_exports)
            })
        });

        const result = await response.json();

        // Remove loading indicator
        document.body.removeChild(loadingMsg);

        if (result.success) {
            // Show success message
            alert(
                `✅ Batch Import Successful!\n\n` +
                `Files processed: ${result.filesProcessed}\n` +
                `Folder: ${result.folderPath}\n\n` +
                `Opening Auditing Dashboard...`
            );

            console.log('✅ Batch import completed:', result);

            // Open auditing dashboard in new tab
            window.open('/dashboard/dashboard_auditing.html', '_blank');

        } else {
            throw new Error(result.error || 'Batch import failed');
        }

    } catch (error) {
        console.error('❌ Batch import error:', error);

        alert(
            `❌ Batch Import Failed\n\n` +
            `Error: ${error.message}\n\n` +
            `Please ensure:\n` +
            `1. The server is running (http://localhost:3000)\n` +
            `2. Field Kit export files exist in the configured folder\n` +
            `3. The folder path is correct`
        );
    }
}

/**
 * Generate synthetic data for testing (calls server API)
 */
async function generateSyntheticData() {
    const confirmed = confirm(
        '🔧 Generate Synthetic Data\n\n' +
        'This will create 100 synthetic Field Kit assessment files ' +
        'for testing purposes.\n\n' +
        'Continue?'
    );

    if (!confirmed) return;

    try {
        const response = await fetch('/api/generate-synthetic', {
            method: 'POST'
        });

        const result = await response.json();

        if (result.success) {
            alert(
                '✅ Synthetic Data Generated!\n\n' +
                '100 Field Kit assessment files have been created.\n\n' +
                'You can now use "Batch Import & View Dashboard" to process them.'
            );
        } else {
            throw new Error(result.error);
        }

    } catch (error) {
        alert(`❌ Failed to generate synthetic data:\n\n${error.message}`);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('cpf_current');
    if (saved) {
        currentData = JSON.parse(saved);
        if (currentData.fieldKit) {
            renderFieldKit(currentData.fieldKit);
        }
    }
});