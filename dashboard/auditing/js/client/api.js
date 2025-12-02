import { organizationContext, currentData, resetCurrentData } from './state.js';
import { currentScore, calculateIndicatorScore, resetCurrentScore } from './scoring.js';
import { renderFieldKit, showAutoSaveIndicator } from './render.js';
import { CATEGORY_MAP, LANG_MAP } from '../shared/config.js';
import { showConfirm } from '../shared/utils.js';

// Flag to prevent autosave during reset operation
let isResetting = false;

export async function loadJSON(indicatorId = null, languageOverride = null) {
    let input = indicatorId;
    let isoLang = languageOverride || organizationContext.language || 'en-US';

    if (!input) {
        input = prompt('Enter indicator (format: X.Y-LANG or X.Y for en-US)\nExamples: 1.3-IT, 2.1-EN, 1.3');
        if (!input) return;
    }

    try {
        let fetchUrl = input;
        const indicatorMatch = input.match(/^(\d{1,2})\.(\d{1,2})(?:-([A-Z]{2}))?$/i);

        if (indicatorMatch) {
            const indicator = `${indicatorMatch[1]}.${indicatorMatch[2]}`;
            if (indicatorMatch[3]) {
                isoLang = LANG_MAP[indicatorMatch[3].toUpperCase()] || isoLang;
            }
            const categoryNum = indicatorMatch[1];
            const categoryName = CATEGORY_MAP[categoryNum];
            if (!categoryName) throw new Error(`Invalid category number: ${categoryNum}`);

            fetchUrl = `/auditor-field-kit/interactive/${isoLang}/${categoryNum}.x-${categoryName}/indicator_${indicator}.json`;
        }

        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        const data = await response.json();
        currentData.fieldKit = data;
        renderFieldKit(data);
    } catch (error) {
        alert('Error loading JSON: ' + error.message);
        console.error('Load error:', error);
    }
}

export async function autoSave() {
    if (!currentData.fieldKit) return;

    // Skip autosave during reset operation
    if (isResetting) {
        console.log('⏭️ Skipping autosave during reset operation');
        return;
    }

    localStorage.setItem('cpf_current', JSON.stringify(currentData));

    if (organizationContext.orgId) {
        try {
            await saveToAPI();
        } catch (error) {
            console.error('❌ Auto-save to API failed:', error);
        }
    }
}

export async function saveToAPI() {
    if (!organizationContext.orgId) {
        console.warn('⚠️ No organization context - cannot save to API');
        return;
    }
    if (!currentData || !currentData.fieldKit || !currentData.fieldKit.indicator) {
        console.warn('Cannot save: indicator data is not loaded properly');
        return;
    }

    if (!currentScore || !currentScore.final_score) {
        calculateIndicatorScore();
        // Short delay for async
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    const indicator = currentData.fieldKit.indicator;
    const timestamp = new Date().toISOString();
    const redFlagsArray = currentScore.details?.red_flags_list?.map(item => item.flag) || [];
    const completionRate = currentScore.details?.conversation_breakdown?.completion_rate || 0;
    const confidence = Math.round((0.5 + (completionRate * 0.45)) * 100) / 100;

    const assessmentData = {
        indicator_id: indicator,
        title: currentData.fieldKit.title || '',
        category: currentData.fieldKit.category || '',
        bayesian_score: currentScore.final_score,
        confidence: confidence,
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

    const response = await fetch(`/api/organizations/${organizationContext.orgId}/assessments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assessmentData)
    });

    const result = await response.json();

    if (result.success) {
        showAutoSaveIndicator();
        if (window.dashboardReloadOrganization) {
            window.dashboardReloadOrganization().catch(err => console.error(err));
        }
    } else {
        throw new Error(result.error || 'API save failed');
    }
}

export function importJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.fieldKit && data.metadata && data.responses) {
                // Restore full export
                Object.assign(currentData, data);
                renderFieldKit(data.fieldKit);
            } else if (data.indicator && data.sections) {
                // Import fresh indicator
                currentData.fieldKit = data;
                resetCurrentData(); // Reset responses but keep fieldKit
                currentData.fieldKit = data; // Restore fieldKit
                renderFieldKit(data);
            } else {
                throw new Error('Unrecognized JSON structure');
            }
        } catch (error) {
            alert('Invalid JSON file: ' + error.message);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

export function exportData() {
    if (!currentData.score && currentData.fieldKit) calculateIndicatorScore();
    const blob = new Blob([JSON.stringify(currentData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cpf_${currentData.fieldKit.indicator}_${currentData.metadata.client}_${currentData.metadata.date}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Reset function (formerly resetAll)
export async function resetAll() {
    if (!confirm('⚠️ This will clear all data and reset the application.\nAre you sure?')) return;
    
    // 1. Save empty state to history (via API) before clearing in UI, to mark the reset
    // We create a temp empty assessment
    if (organizationContext.orgId && currentData.fieldKit) {
         const indicatorId = currentData.fieldKit.indicator;
         const emptyAssessment = {
            indicator_id: indicatorId,
            title: currentData.fieldKit.title,
            category: currentData.fieldKit.category,
            bayesian_score: 0,
            confidence: 0.5,
            maturity_level: 'green',
            assessor: '',
            assessment_date: new Date().toISOString(),
            raw_data: { client_conversation: { responses: {}, notes: '', red_flags: [] } }
         };
         try {
             await fetch(`/api/organizations/${organizationContext.orgId}/assessments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(emptyAssessment)
            });
         } catch(e) { console.error("Error saving reset state", e); }
    }

    localStorage.removeItem('cpf_current');
    
    // Reset State
    resetCurrentData();
    resetCurrentScore();
    
    // UI Cleanup
    const scoreBar = document.getElementById('score-bar');
    if (scoreBar) scoreBar.remove();
    const scoreSummary = document.getElementById('score-summary-section');
    if (scoreSummary) scoreSummary.remove();
    
    // Re-render empty state or reload indicator
    if (currentData.fieldKit) {
        // Just re-render the blank form
        renderFieldKit(currentData.fieldKit);
    } else {
        document.getElementById('content').innerHTML = `
            <div class="empty-state">
                <h2>Assessment Reset</h2>
                <p>Reload a JSON field kit to begin</p>
            </div>
        `;
    }
    
    alert('✅ Application reset successfully!');
}

export function generateReport() {
    if (!currentData.fieldKit) {
        alert('No assessment loaded');
        return;
    }

    // Calculate score if not already calculated
    if (!currentScore || !currentScore.final_score) {
        calculateIndicatorScore();
    }

    // Check if score calculation was successful
    if (!currentScore || currentScore.final_score === undefined) {
        alert('Unable to calculate score. Please fill in the Quick Assessment section first.');
        return;
    }

    const maturityConfig = currentData.fieldKit.scoring?.maturity_levels?.[currentScore.maturity_level] || {
        color: '#888888',
        label: 'Unknown',
        description: 'Score calculated but maturity level not configured'
    };
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
                        <strong>${section.icon || '📋'} ${section.title}</strong>
                    </div>
                    ${(section.items || []).map((item, iIdx) => {
                        const itemId = `s${sIdx}_i${iIdx}`;
                        const response = currentData.responses[itemId];
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
                                const response = currentData.responses[itemId];
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
        filename: `cpf_${currentData.fieldKit.indicator}_${currentData.metadata.client || 'client'}_${currentData.metadata.date}_SCORED.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // Check if html2pdf library is loaded
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
}

// Reset assessment data (for integrated client) - clears fields but keeps indicator loaded
export async function resetIntegratedClientData() {
    const confirmed = await showConfirm({
        title: '⚠️ Reset this assessment?',
        message: 'This will clear all form data and save an empty assessment.\n\nYou can undo this using the History button.',
        confirmText: 'Reset',
        cancelText: 'Cancel',
        confirmClass: 'btn-warning'
    });

    if (!confirmed) {
        return;
    }

    // Set flag to prevent autosave during reset
    isResetting = true;
    console.log('🗑️ Resetting integrated client data');

    // Save empty assessment to history (before clearing UI)
    if (organizationContext.orgId && currentData.fieldKit) {
        const indicatorId = currentData.fieldKit.indicator;
        const emptyAssessment = {
            indicator_id: indicatorId,
            title: currentData.fieldKit.title || '',
            category: currentData.fieldKit.category || '',
            bayesian_score: 0,
            confidence: 0.5,
            maturity_level: 'green',
            assessor: '',
            assessment_date: new Date().toISOString(),
            raw_data: {
                quick_assessment: {},
                client_conversation: {
                    responses: {},
                    scores: null,
                    metadata: {
                        date: new Date().toISOString().split('T')[0],
                        auditor: '',
                        client: organizationContext.orgName || '',
                        status: 'in-progress',
                        notes: ''
                    },
                    notes: '',
                    red_flags: []
                }
            }
        };

        try {
            console.log('💾 Saving empty assessment to API for history tracking...');
            const response = await fetch(`/api/organizations/${organizationContext.orgId}/assessments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(emptyAssessment)
            });

            const result = await response.json();

            if (result.success) {
                console.log('✅ Empty assessment saved to history');

                // Refresh organization data in background to update matrix and history
                if (window.dashboardReloadOrganization) {
                    window.dashboardReloadOrganization().catch(err => {
                        console.error('Failed to reload org data:', err);
                    });
                }
            } else {
                console.error('❌ Failed to save empty assessment:', result.error);
            }
        } catch (error) {
            console.error('❌ Error saving reset state to history:', error);
        }
    } else {
        console.warn('⚠️ Cannot save to history: missing organizationContext.orgId or currentData.fieldKit');
    }

    // Clear all form inputs
    const containers = [document.getElementById('content'), document.getElementById('client-integrated-container')];
    containers.forEach(container => {
        if (container) {
            const inputs = container.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = false;
                    const parent = input.closest('.checkbox-item');
                    if (parent) parent.classList.remove('checked');
                } else if (input.type !== 'hidden') {
                    input.value = '';
                }
            });
        }
    });

    // Save fieldKit reference before reset
    const savedFieldKit = currentData.fieldKit;

    // Reset state but keep fieldKit
    currentData.responses = {};
    currentData.metadata = {
        date: new Date().toISOString().split('T')[0],
        auditor: '',
        client: organizationContext.orgName || '',
        status: 'in-progress',
        notes: ''
    };
    currentData.score = null;
    currentData.fieldKit = savedFieldKit; // Restore fieldKit

    // Reset score
    if (window.resetCurrentScore) {
        window.resetCurrentScore();
    }

    // Remove score displays
    const scoreBar = document.getElementById('score-bar');
    if (scoreBar) scoreBar.remove();
    const scoreSummary = document.getElementById('score-summary-section');
    if (scoreSummary) scoreSummary.remove();
    const scoreDisplay = document.getElementById('scoreDisplay');
    if (scoreDisplay) scoreDisplay.style.display = 'none';

    // Re-render the form empty
    if (savedFieldKit) {
        renderFieldKit(savedFieldKit);
    }

    // Show feedback
    showAutoSaveIndicator();
    console.log('✅ Assessment reset complete');

    // Re-enable autosave after a short delay to let any pending events settle
    setTimeout(() => {
        isResetting = false;
        console.log('✅ Autosave re-enabled after reset');
    }, 500);
}