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

async function loadJSON() {
    const input = prompt('Enter indicator (format: X.Y-LANG or X.Y for en-US)\nExamples: 1.3-IT, 2.1-EN, 1.3');
    if (!input) return;

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
}

function saveData() {
    localStorage.setItem('cpf_current', JSON.stringify(currentData));
    alert('✅ Assessment saved to browser storage!');
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
    showScoreSummary();
    
    // Save score to currentData
    currentData.score = currentScore;
    
    console.log('📊 Score Calculated:', currentScore);
}

function updateScoreDisplay() {
    const scoreBarDiv = document.getElementById('score-bar');
    if (!scoreBarDiv) {
        // Create score bar if doesn't exist
        const metadataBar = document.getElementById('metadata-bar');
        const newScoreBar = document.createElement('div');
        newScoreBar.id = 'score-bar';
        newScoreBar.className = 'score-bar';
        metadataBar.parentNode.insertBefore(newScoreBar, metadataBar.nextSibling);
    }

    const maturityConfig = currentData.fieldKit.scoring.maturity_levels[currentScore.maturity_level];
    const scorePercentage = (currentScore.final_score * 100).toFixed(1);

    document.getElementById('score-bar').innerHTML = `
        <div class="score-container">
            <div class="score-progress-section">
                <div class="score-label">
                    <span>Vulnerability Score</span>
                    <span class="score-value">${scorePercentage}%</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill ${currentScore.maturity_level}"
                         style="width: ${scorePercentage}%">
                        ${scorePercentage}%
                    </div>
                </div>
            </div>
            <div class="maturity-badge-container">
                <div class="maturity-label">MATURITY LEVEL</div>
                <div class="maturity-badge ${currentScore.maturity_level}">
                    ${maturityConfig.label}
                </div>
            </div>
            <div class="summary-toggle-container">
                <button class="btn btn-light" onclick="toggleSummaryPanel()" id="summary-toggle-btn">
                    📊 Show Detailed Analysis
                </button>
            </div>
        </div>
    `;

    const scoreBar = document.getElementById('score-bar');
    scoreBar.style.display = 'block';
    scoreBar.classList.add('sticky-score-bar');
}

function showScoreSummary() {
    const content = document.getElementById('content');
    
    // Remove existing summary if present
    const existingSummary = document.getElementById('score-summary-section');
    if (existingSummary) {
        existingSummary.remove();
    }

    const maturityConfig = currentData.fieldKit.scoring.maturity_levels[currentScore.maturity_level];
    const weights = currentScore.weights_used || { quick_assessment: 0.70, red_flags: 0.30, conversation_depth: 0 };

    const summaryHTML = `
        <div id="score-summary-section" class="score-summary-section sticky-summary-panel" style="display: none;">
            <div class="score-summary-title">
                📊 Vulnerability Score Summary & Analysis
            </div>

            <div class="score-breakdown">
                <div class="score-component">
                    <div class="component-label">Quick Assessment</div>
                    <div class="component-value">${(currentScore.quick_assessment * 100).toFixed(1)}%</div>
                    <div class="component-description">
                        Based on ${currentScore.details.quick_assessment_breakdown.length} questions
                        (Weight: ${(weights.quick_assessment * 100)}%)
                    </div>
                </div>

                <div class="score-component">
                    <div class="component-label">Red Flags</div>
                    <div class="component-value">${(currentScore.red_flags * 100).toFixed(1)}%</div>
                    <div class="component-description">
                        ${currentScore.details.red_flags_list.length} flags detected
                        (Weight: ${(weights.red_flags * 100)}%)
                    </div>
                </div>

                <div class="score-component" style="border: 2px dashed #888; background: #f5f5f5;">
                    <div class="component-label">Conversation Completeness</div>
                    <div class="component-value" style="color: #666;">${(currentScore.details.conversation_breakdown.completion_rate * 100).toFixed(0)}%</div>
                    <div class="component-description" style="color: #888;">
                        ${currentScore.details.conversation_breakdown.answered_questions}/${currentScore.details.conversation_breakdown.total_questions} questions answered
                        <br><em>(Informational only - not included in vulnerability score)</em>
                    </div>
                </div>
                
                <div class="score-component" style="border: 3px solid ${maturityConfig.color}; background: ${maturityConfig.color}15;">
                    <div class="component-label">FINAL SCORE</div>
                    <div class="component-value" style="color: ${maturityConfig.color}; font-size: 42px;">
                        ${(currentScore.final_score * 100).toFixed(1)}%
                    </div>
                    <div class="component-description" style="font-weight: 700; color: ${maturityConfig.color};">
                        ${maturityConfig.label}
                    </div>
                </div>
            </div>
            
            <div class="score-interpretation">
                <div class="interpretation-title">📋 Interpretation</div>
                <div class="interpretation-text">
                    <strong>${maturityConfig.label}:</strong> ${maturityConfig.description}
                </div>
            </div>
            
            <div class="score-details-toggle">
                <button class="btn btn-light" onclick="toggleScoreDetails()">
                    📈 Show Detailed Breakdown
                </button>
            </div>
            
            <div id="score-details-content" class="score-details-content">
                <h4 style="margin-bottom: 15px; color: var(--primary);">Quick Assessment Breakdown</h4>
                ${currentScore.details.quick_assessment_breakdown.map(item => `
                    <div class="detail-row">
                        <span class="detail-label">${item.question}</span>
                        <span class="detail-value">${(item.weighted_score * 100).toFixed(1)}%</span>
                    </div>
                `).join('')}
                
                ${currentScore.details.red_flags_list.length > 0 ? `
                    <h4 style="margin: 20px 0 15px; color: var(--danger);">Red Flags Detected</h4>
                    ${currentScore.details.red_flags_list.map(flag => `
                        <div class="detail-row">
                            <span class="detail-label">⚠️ ${flag.flag}</span>
                            <span class="detail-value" style="color: var(--danger);">+${(flag.impact * 100).toFixed(1)}%</span>
                        </div>
                    `).join('')}
                ` : ''}
                
                <div class="calculation-formula">
                    <strong>Vulnerability Score Calculation:</strong><br>
                    Final Score = (Quick Assessment × ${weights.quick_assessment}) + (Red Flags × ${weights.red_flags})<br>
                    Final Score = (${currentScore.quick_assessment.toFixed(3)} × ${weights.quick_assessment}) + (${currentScore.red_flags.toFixed(3)} × ${weights.red_flags})<br>
                    <strong>Final Score = ${currentScore.final_score.toFixed(3)} (${(currentScore.final_score * 100).toFixed(1)}%)</strong><br>
                    <em style="color: #888; font-size: 12px;">Note: Conversation completeness is tracked separately for reference</em>
                </div>
            </div>
        </div>
    `;

    // Insert at the beginning of content
    content.insertAdjacentHTML('afterbegin', summaryHTML);
}

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

function toggleSummaryPanel() {
    const summaryPanel = document.getElementById('score-summary-section');
    const toggleBtn = document.getElementById('summary-toggle-btn');

    if (summaryPanel.style.display === 'none') {
        summaryPanel.style.display = 'block';
        toggleBtn.textContent = '📉 Hide Detailed Analysis';
    } else {
        summaryPanel.style.display = 'none';
        toggleBtn.textContent = '📊 Show Detailed Analysis';
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

window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('cpf_current');
    if (saved) {
        currentData = JSON.parse(saved);
        if (currentData.fieldKit) {
            renderFieldKit(currentData.fieldKit);
        }
    }
});