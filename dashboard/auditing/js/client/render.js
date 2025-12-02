import { currentData } from './state.js';
import { currentScore, calculateIndicatorScore } from './scoring.js';
import { autoSave, loadJSON } from './api.js'; // Aggiunto loadJSON

// --- MAIN RENDER FUNCTIONS ---

export function renderFieldKit(data) {
    // Detect Bayesian schema
    const isBayesianSchema = data.indicator_id && data.quick_assessment && !data.sections;
    if (isBayesianSchema) {
        alert(`⚠️ Indicator ${data.indicator_id} uses Bayesian schema which is not yet supported by the integrated client.`);
        return;
    }

    if (!data.sections || !Array.isArray(data.sections)) {
        alert(`⚠️ Error: This indicator file is missing the required 'sections' field.`);
        return;
    }

    // Header
    const headerEl = document.getElementById('header');
    if (headerEl) {
        headerEl.innerHTML = `
            <div class="header-content">
                <h1>Indicator ${data.indicator} Field Kit</h1>
                <div class="subtitle">${data.subtitle || data.title}</div>
                <div class="indicator-badge">${data.category}</div>
            </div>
        `;
    }

    // Metadata Bar
    const metadataBar = document.getElementById('metadata-bar');
    if (metadataBar) {
        metadataBar.style.display = 'grid';
        metadataBar.innerHTML = `
            <div class="meta-field" style="grid-column: 1 / -1; background: #dbeafe; padding: 16px 20px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid #3b82f6;">
                <label style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: #2563eb; font-weight: 700; display: block; margin-bottom: 6px;">Organization</label>
                <div style="font-size: 24px; font-weight: 700; color: #1e40af;">${currentData.metadata.client}</div>
            </div>
            <div class="meta-field">
                <label>Assessment Date</label>
                <input type="date" value="${currentData.metadata.date}" data-meta-field="date">
            </div>
            <div class="meta-field">
                <label>Auditor</label>
                <input type="text" value="${currentData.metadata.auditor}" data-meta-field="auditor" placeholder="Your name">
            </div>
            <div class="meta-field">
                <label>Status</label>
                <select data-meta-field="status">
                    <option value="in-progress" ${currentData.metadata.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                    <option value="completed" ${currentData.metadata.status === 'completed' ? 'selected' : ''}>Completed</option>
                    <option value="review" ${currentData.metadata.status === 'review' ? 'selected' : ''}>Under Review</option>
                </select>
            </div>
            <div class="meta-field" style="grid-column: 1 / -1;">
                <label>Notes</label>
                <textarea id="assessment-notes" placeholder="Assessment notes..." style="width: 100%; padding: 10px; border: 2px solid var(--border); border-radius: 8px; min-height: 80px;" data-meta-field="notes">${currentData.metadata.notes || ''}</textarea>
            </div>
        `;
    }
    
    // Content Sections
    const content = document.getElementById('content');
    if (content) {
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
            
            if (section.items && Array.isArray(section.items)) {
                section.items.forEach((item, iIdx) => {
                    const itemId = item.id || `s${sIdx}_i${iIdx}`;
                    html += renderItem(item, itemId);
                });
            }

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
                            html += renderItem(item, itemId);
                        });
                    }
                    html += `</div></div>`;
                });
            }
            html += `</div>`;
        });
        content.innerHTML = html;
    }
    
    // Action Bar
    const actionBar = document.getElementById('action-bar');
    if (actionBar) actionBar.style.display = 'flex';

    // Update Score
    if (data.scoring) {
        calculateIndicatorScore();
        updateScoreDisplay(); // Assicuriamoci che venga chiamato anche qui
    }
}

export function renderItem(item, itemId) {
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
                                    data-response-id="${itemId}" data-auto-score="true">
                            <label for="${itemId}_${opt.value}" class="radio-label">${opt.label}</label>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } else if (item.type === 'radio-list') {
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
                            <label class="checkbox-item ${isChecked ? 'checked' : ''}" data-value="${opt.value}">
                                <input type="checkbox" ${isChecked ? 'checked' : ''} data-radio-group="${itemId}" data-radio-value="${opt.value}">
                                <span class="checkbox-label">${opt.label}</span>
                            </label>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    } else if (item.type === 'checkbox') {
        const checked = value ? 'checked' : '';
        let html = `
            <div class="checkbox-item ${checked}">
                <input type="checkbox" id="${itemId}" ${checked} data-response-id="${itemId}" data-auto-score="true">
                <label for="${itemId}">${item.label}</label>
            </div>
        `;
        if (item.subitems && Array.isArray(item.subitems)) {
            html += '<div class="nested-items" style="margin-left: 25px; margin-top: 8px;">';
            item.subitems.forEach((sub, subIdx) => {
                const subItemId = `${itemId}_sub${subIdx}`;
                if (sub.type === 'checkbox') {
                    const subValue = currentData.responses[subItemId] || false;
                    html += `
                        <div class="checkbox-item ${subValue ? 'checked' : ''}" style="display: inline-block; margin-right: 15px;">
                            <input type="checkbox" id="${subItemId}" ${subValue ? 'checked' : ''} data-response-id="${subItemId}">
                            <label for="${subItemId}">${sub.label}</label>
                        </div>
                    `;
                } else if (sub.type === 'radio') {
                    const subValue = currentData.responses[`${itemId}_radio_value`];
                    html += `
                        <div class="radio-option" style="display: inline-block; margin-right: 15px;">
                            <input type="radio" name="${itemId}_radio" id="${subItemId}" value="${sub.label}" ${subValue === sub.label ? 'checked' : ''} data-response-id="${itemId}_radio_value">
                            <label for="${subItemId}">${sub.label}</label>
                        </div>
                    `;
                } else if (sub.type === 'input') {
                    html += `
                        <div class="input-group" style="margin: 10px 0;">
                            <input type="text" id="${subItemId}" value="${currentData.responses[subItemId] || ''}" placeholder="${sub.label}" data-response-id="${subItemId}" style="padding: 6px; width: 200px;">
                        </div>
                    `;
                }
            });
            html += '</div>';
        }
        return html;
    } else if (item.type === 'input') {
        return `
            <div class="input-group">
                <label>${item.label}</label>
                <input type="text" id="${itemId}" value="${value || ''}" data-response-id="${itemId}">
            </div>
        `;
    } else if (item.type === 'question') {
        let html = `
            <div class="question-group" style="margin-bottom: 25px;">
                <div class="question-title" style="font-size: 16px; font-weight: 600; color: var(--primary); margin-bottom: 15px;">
                    ${item.text}
                </div>
        `;
        if (item.followups) {
            html += `<div style="margin-left: 20px; margin-top: 10px;">`;
            item.followups.forEach((followup, fIdx) => {
                const followupId = `${itemId}_f${fIdx}`;
                const followupValue = currentData.responses[followupId] || '';
                html += `
                    <div style="margin-bottom: 10px;">
                        <div style="font-size: 14px; color: var(--text-light); margin-bottom: 5px;"><em>${followup.type}:</em> ${followup.text}</div>
                        <textarea id="${followupId}" placeholder="Notes..." style="width: 100%; padding: 10px; border: 2px solid var(--border); border-radius: 8px; min-height: 60px;" data-response-id="${followupId}" data-auto-score="true">${followupValue}</textarea>
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

// --- SCORE DISPLAY ---

export function updateScoreDisplay() {
    const scoreBarDiv = document.getElementById('score-bar');
    
    if (!currentData.fieldKit || !currentData.fieldKit.scoring) return;
    if (!currentScore.maturity_level) return; 

    const maturityConfig = currentData.fieldKit.scoring.maturity_levels[currentScore.maturity_level];
    const scorePercentage = (currentScore.final_score * 100).toFixed(1);
    const weights = currentScore.weights_used || { quick_assessment: 0.70, red_flags: 0.30, conversation_depth: 0 };

    if (!scoreBarDiv) {
        // Create it if it doesn't exist
        const metadataBar = document.getElementById('metadata-bar');
        const newScoreBar = document.createElement('div');
        newScoreBar.id = 'score-bar';
        newScoreBar.className = 'score-bar sticky-score-bar';
        if (metadataBar && metadataBar.parentNode) {
            metadataBar.parentNode.insertBefore(newScoreBar, metadataBar.nextSibling);
        } else {
            return;
        }
    }

    const html = `
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
                    ${maturityConfig ? maturityConfig.label : 'Unknown'}
                </div>
            </div>
        </div>

        <div id="score-detailed-breakdown" class="score-detailed-breakdown" style="display: none;">
            <!-- Components -->
            <div class="score-breakdown">
                <div class="score-component">
                    <div class="component-label">Quick Assessment</div>
                    <div class="component-value" id="quick-val">${(currentScore.quick_assessment * 100).toFixed(1)}%</div>
                    <div class="component-description">Based on ${currentScore.details.quick_assessment_breakdown ? currentScore.details.quick_assessment_breakdown.length : 0} questions</div>
                </div>
                <div class="score-component">
                    <div class="component-label">Red Flags</div>
                    <div class="component-value" id="flags-val">${(currentScore.red_flags * 100).toFixed(1)}%</div>
                    <div class="component-description">${currentScore.details.red_flags_list ? currentScore.details.red_flags_list.length : 0} flags detected</div>
                </div>
                <div class="score-component" style="border: 2px dashed #ccc; background: #fafafa;">
                    <div class="component-label">Conversation Completeness</div>
                    <div class="component-value" style="color: #666;">${(currentScore.details.conversation_breakdown ? currentScore.details.conversation_breakdown.completion_rate * 100 : 0).toFixed(0)}%</div>
                    <div class="component-description" style="font-size: 12px; color: #666;">${currentScore.details.conversation_breakdown ? currentScore.details.conversation_breakdown.answered_questions : 0}/${currentScore.details.conversation_breakdown ? currentScore.details.conversation_breakdown.total_questions : 0} answered<br><em style="font-size: 11px;">(Informational only)</em></div>
                </div>
            </div>
            
            <div class="score-interpretation">
                <div class="interpretation-title">📋 Interpretation</div>
                <div class="interpretation-text">
                    <strong style="color: ${maturityConfig ? maturityConfig.color : '#000'};">${maturityConfig ? maturityConfig.label : 'N/A'}:</strong> ${maturityConfig ? maturityConfig.description : ''}
                </div>
            </div>

            <div class="score-details-toggle">
                <button class="btn btn-light" data-action="toggle-score-details">📈 Show Question Breakdown</button>
            </div>

            <div id="score-details-content" class="score-details-content">
                <!-- Quick Assessment Breakdown -->
                ${currentScore.details.quick_assessment_breakdown && currentScore.details.quick_assessment_breakdown.length > 0 ? `
                <div style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 10px 0; color: var(--primary);">Quick Assessment Breakdown</h4>
                    ${currentScore.details.quick_assessment_breakdown.map(item => `
                        <div style="display: flex; justify-content: space-between; padding: 8px; border-bottom: 1px solid var(--border);">
                            <div style="flex: 1;">
                                <strong>${item.question}</strong>
                            </div>
                            <div style="text-align: right; min-width: 80px; font-weight: 600; color: var(--primary);">
                                ${(item.weighted_score * 100).toFixed(1)}%
                            </div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                <!-- Red Flags Detected -->
                ${currentScore.details.red_flags_list && currentScore.details.red_flags_list.length > 0 ? `
                <div style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 10px 0; color: var(--danger);">Red Flags Detected</h4>
                    ${currentScore.details.red_flags_list.map(flag => `
                        <div style="display: flex; align-items: center; padding: 8px; background: #fee; border-left: 4px solid var(--danger); margin-bottom: 8px; border-radius: 4px;">
                            <span style="margin-right: 10px; font-size: 20px;">⚠️</span>
                            <div style="flex: 1;">
                                <strong>"${flag.flag}"</strong>
                            </div>
                            <div style="text-align: right; min-width: 80px; font-weight: 600; color: var(--danger);">
                                +${(flag.impact * 100).toFixed(1)}%
                            </div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                <!-- Calculation Formula -->
                <div class="calculation-formula" style="margin-top: 20px; padding-top: 20px; border-top: 2px solid var(--border);">
                    <h4 style="margin: 0 0 10px 0;">Vulnerability Score Calculation:</h4>
                    <p style="margin: 0; font-family: monospace; color: var(--text-light);">
                        <strong>Final Score = (Quick Assessment × ${weights.quick_assessment}) + (Red Flags × ${weights.red_flags})</strong><br>
                        Final Score = (${currentScore.quick_assessment.toFixed(3)} × ${weights.quick_assessment}) + (${currentScore.red_flags.toFixed(3)} × ${weights.red_flags})<br>
                        <strong>Final Score = ${currentScore.final_score.toFixed(3)} (${(currentScore.final_score * 100).toFixed(1)}%)</strong>
                    </p>
                    ${currentScore.details.conversation_breakdown ? `
                    <p style="margin-top: 15px; padding: 10px; background: #f0f9ff; border-radius: 6px; font-size: 13px;">
                        <strong>Note:</strong> Conversation completeness is tracked separately for reference<br>
                        ${currentScore.details.conversation_breakdown.answered_questions}/${currentScore.details.conversation_breakdown.total_questions} answered (${(currentScore.details.conversation_breakdown.completion_rate * 100).toFixed(0)}%)
                        <em style="color: var(--text-light); display: block; margin-top: 5px;">(Informational only)</em>
                    </p>
                    ` : ''}
                </div>
            </div>
        </div>`;

    document.getElementById('score-bar').innerHTML = html;
    document.getElementById('score-bar').style.display = 'block';
}

export function toggleScoreDetails() {
    const detailsDiv = document.getElementById('score-details-content');
    if (!detailsDiv) return;
    detailsDiv.classList.toggle('visible');
    const button = document.querySelector('[data-action="toggle-score-details"]');
    if (button) button.textContent = detailsDiv.classList.contains('visible') ? '📉 Hide Detailed Breakdown' : '📈 Show Detailed Breakdown';
}

export function toggleDetailedAnalysis() {
    console.log('🔍 toggleDetailedAnalysis called');
    const breakdown = document.getElementById('score-detailed-breakdown');
    console.log('🔍 Found breakdown element:', breakdown);

    if (!breakdown) {
        alert('⚠️ No score analysis available yet. Please complete the Quick Assessment section first.');
        return;
    }

    // Check if score has been calculated
    if (!currentScore || !currentScore.final_score) {
        alert('⚠️ Score not calculated yet. Please complete some questions first.');
        return;
    }

    // Toggle visibility
    const currentDisplay = breakdown.style.display;
    const isHidden = (currentDisplay === 'none' || currentDisplay === '');

    breakdown.style.display = isHidden ? 'block' : 'none';

    // Debug: Check computed styles and dimensions
    if (isHidden) {
        setTimeout(() => {
            const computed = window.getComputedStyle(breakdown);
            console.log('🔍 After toggle - Computed styles:', {
                display: computed.display,
                height: computed.height,
                maxHeight: computed.maxHeight,
                overflow: computed.overflow,
                opacity: computed.opacity,
                visibility: computed.visibility
            });
            console.log('🔍 Element dimensions:', {
                offsetHeight: breakdown.offsetHeight,
                scrollHeight: breakdown.scrollHeight,
                clientHeight: breakdown.clientHeight
            });
            console.log('🔍 Children count:', breakdown.children.length);
        }, 100);
    }

    // Update button text
    const button = document.querySelector('[data-action="toggle-detailed-analysis"]');
    if (button) {
        button.textContent = isHidden ? '📊 Hide Analysis' : '📊 Show/Hide Analysis';
    }
}

export function showAutoSaveIndicator() {
    const indicator = document.getElementById('auto-save-status');
    if (indicator) {
        indicator.classList.remove('hide');
        indicator.classList.add('show');
        setTimeout(() => {
            indicator.classList.remove('show');
            indicator.classList.add('hide');
            setTimeout(() => { indicator.classList.remove('hide'); }, 400);
        }, 3000);
    }
}

// --- QUICK REFERENCE & UTILS ---

export async function showQuickReference() {
    const modal = document.getElementById('reference-modal');
    if (modal) {
        modal.style.display = 'flex';
        // Add to modal stack for ESC key handling
        if (window.pushModal) window.pushModal('reference-modal');

        const content = document.getElementById('reference-content');

        // Evita di ricaricare se già caricato
        if (content && !content.innerHTML.includes('category-accordion')) {
            content.innerHTML = '<p>Loading reference guide...</p>';
            await loadReferenceContent(content);
        }
    }
}

export function closeQuickReference() {
    const modal = document.getElementById('reference-modal');
    if (modal) {
        modal.style.display = 'none';
        // Remove from modal stack
        if (window.popModal) window.popModal('reference-modal');
    }
}

async function loadReferenceContent(container) {
    try {
        const lang = 'en-US'; // Potresti volerlo rendere dinamico
        const response = await fetch(`/dashboard/auditing/reference_guide_${lang}.json`);
        
        if (!response.ok) throw new Error('Reference guide file not found');
        const data = await response.json();
        
        let html = `
            <div style="margin-bottom: 25px;">
                <p style="font-size: 14px; color: var(--text-light); line-height: 1.6;">${data.description}</p>
            </div>
        `;

        data.categories.forEach(category => {
            console.log('🔍 Loading category:', category.id, 'with', category.indicators?.length || 0, 'indicators');
            html += `
                <div class="category-accordion">
                    <div class="category-header" data-action="toggle-category" data-category-id="${category.id}">
                        <div class="category-title">
                            <span class="category-arrow">▶</span>
                            <span class="category-badge">${category.id}.x</span>
                            <span>${category.name}</span>
                        </div>
                    </div>
                    <div class="category-body" id="category-${category.id}">
                        <div class="indicator-list">
                            ${category.indicators && category.indicators.length > 0 ? category.indicators.map(indicator => `
                                <div class="indicator-item"
                                     data-action="load-indicator"
                                     data-indicator-id="${indicator.id}">
                                    <span class="indicator-code">${indicator.id}</span>
                                    <span class="indicator-title">${indicator.title}</span>
                                </div>
                            `).join('') : '<div class="no-indicators">No indicators available</div>'}
                        </div>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
        
        // Aggiunge listener interni per questo specifico contenuto generato
        container.querySelectorAll('[data-action="toggle-category"]').forEach(el => {
            el.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.categoryId;
                toggleCategory(id);
            });
        });
        
        container.querySelectorAll('[data-action="load-indicator"]').forEach(el => {
            el.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.indicatorId;
                loadIndicatorFromReference(id);
            });
        });

    } catch (e) {
        console.error(e);
        container.innerHTML = `<p style="color:red">Error loading guide: ${e.message}</p>`;
    }
}

export function toggleCategory(categoryId) {
    console.log('🔍 toggleCategory called with:', categoryId);
    const body = document.getElementById(`category-${categoryId}`);
    const header = body ? body.previousElementSibling : null;

    if (!body) {
        console.warn('⚠️ Category body not found for:', categoryId);
        return;
    }

    // Toggle active class (CSS handles max-height transition)
    const isActive = body.classList.contains('active');
    body.classList.toggle('active');

    // Toggle header active class
    if (header) {
        header.classList.toggle('active');
    }

    // Rotate arrow
    const arrow = header ? header.querySelector('.category-arrow') : null;
    if (arrow) {
        arrow.textContent = isActive ? '▶' : '▼';
    }

    console.log('🔍 Category toggled. Active:', !isActive);
}

export async function loadIndicatorFromReference(indicatorId) {
    if (!indicatorId) return;
    closeQuickReference();
    await loadJSON(indicatorId);
}