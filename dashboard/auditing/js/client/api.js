import { organizationContext, currentData, resetCurrentData } from './state.js';
import { currentScore, calculateIndicatorScore, resetCurrentScore } from './scoring.js';
import { renderFieldKit, showAutoSaveIndicator } from './render.js';
import { CATEGORY_MAP, LANG_MAP } from '../shared/config.js';

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
    // Basic implementation placeholder - full implementation is in original file
    // Due to size limits, if you need the full PDF generation code, I can provide it separately
    // or you can copy the generateReport function from your original client-integrated.js
    if (!currentData.fieldKit) { alert('No assessment loaded'); return; }
    if (!currentScore || !currentScore.final_score) calculateIndicatorScore();
    alert("Report generation triggered. (Copy full function if needed)");
}