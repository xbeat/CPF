import { CATEGORY_MAP } from '../shared/config.js';
import { showAlert, escapeHtml } from '../shared/utils.js';
import { selectedOrgId, selectedOrgData } from './state.js';
import { loadOrganizationDetails } from './api.js';

// Variabili locali per il form manuale
let currentManualData = null;
let currentManualId = null;

export async function loadIndicatorForCompile() {
    const cat = document.getElementById('compile-category-select').value;
    const ind = document.getElementById('compile-indicator-select').value;
    const lang = document.getElementById('compile-language-select').value;
    
    const indicatorId = `${cat}.${ind}`;
    const categoryName = CATEGORY_MAP[cat];
    const url = `/auditor-field-kit/interactive/${lang}/${cat}.x-${categoryName}/indicator_${indicatorId}.json`;
    
    showAlert('Loading indicator...', 'info');

    try {
        const response = await fetch(url);
        if(!response.ok) throw new Error(`Not found at ${url}`);
        
        const data = await response.json();
        
        // Normalize data structure if needed
        if (data.sections && !data.field_kit) {
            const quickSection = data.sections.find(s => s.id === 'quick-assessment');
            if (quickSection && quickSection.items) {
                data.field_kit = {
                    questions: quickSection.items.map(item => ({
                        text: item.question || item.title,
                        type: item.type === 'radio-list' ? 'single_choice' : item.type,
                        answer_scale: item.options || [],
                        min: item.min,
                        max: item.max
                    }))
                };
            }
        }

        currentManualData = data;
        currentManualId = indicatorId;

        renderFieldKitForm(data);

        document.getElementById('compileFormContainer').style.display = 'block';
        document.getElementById('compileEmptyState').style.display = 'none';
        document.getElementById('scoreDisplay').style.display = 'none';
        document.getElementById('compile-date').valueAsDate = new Date();

        showAlert('Loaded successfully', 'success');
    } catch (e) {
        showAlert('Error: ' + e.message, 'error');
        console.error(e);
    }
}

function renderFieldKitForm(data) {
    const container = document.getElementById('compileFormContent');
    container.innerHTML = '';

    if (!data.field_kit || !data.field_kit.questions) {
        container.innerHTML = '<p style="color:red">Invalid data structure</p>';
        return;
    }

    const title = document.createElement('div');
    title.innerHTML = `<h3>${escapeHtml(data.title)}</h3><p>${escapeHtml(data.description)}</p>`;
    container.appendChild(title);

    data.field_kit.questions.forEach((q, idx) => {
        const div = document.createElement('div');
        div.className = 'manual-question';
        div.style.marginBottom = '20px';
        div.style.padding = '10px';
        div.style.background = '#f9f9f9';
        
        div.innerHTML = `<div style="font-weight:bold;margin-bottom:5px;">${idx+1}. ${escapeHtml(q.text)}</div>`;
        
        if (q.type === 'single_choice' && q.answer_scale) {
            q.answer_scale.forEach(opt => {
                const label = document.createElement('label');
                label.style.display = 'block';
                label.innerHTML = `
                    <input type="radio" name="mq_${idx}" value="${opt.value}" data-score="${opt.score}">
                    ${opt.value}: ${escapeHtml(opt.label)}
                `;
                div.appendChild(label);
            });
        } else if (q.type === 'number') {
            div.innerHTML += `<input type="number" id="mq_${idx}" class="form-input" min="${q.min||0}" max="${q.max||100}">`;
        } else {
            div.innerHTML += `<textarea id="mq_${idx}" class="form-input" rows="2"></textarea>`;
        }
        
        container.appendChild(div);
    });
}

function calculateScoreLocal() {
    if (!currentManualData) return null;
    const questions = currentManualData.field_kit.questions;
    let total = 0;
    let count = 0;

    questions.forEach((q, idx) => {
        if (q.type === 'single_choice') {
            const sel = document.querySelector(`input[name="mq_${idx}"]:checked`);
            if (sel) {
                total += parseFloat(sel.dataset.score);
                count++;
            }
        } else if (q.type === 'number') {
            const inp = document.getElementById(`mq_${idx}`);
            if (inp && inp.value !== '') {
                const val = parseFloat(inp.value);
                const norm = (val - (q.min||0)) / ((q.max||100)-(q.min||0));
                total += norm;
                count++;
            }
        }
    });

    if (count === 0) return null;
    return total / count;
}

export async function saveAssessmentToOrg() {
    if (!selectedOrgId) return showAlert('No org selected', 'error');
    if (!currentManualData) return showAlert('No indicator loaded', 'error');

    const score = calculateScoreLocal();
    if (score === null) return showAlert('Answer at least one question', 'warning');

    const conf = document.getElementById('compile-confidence').value;
    const assessor = document.getElementById('compile-assessor').value || 'Anonymous';
    const date = document.getElementById('compile-date').value;

    // Collect responses
    const responses = {};
    currentManualData.field_kit.questions.forEach((q, idx) => {
        if(q.type === 'single_choice') {
            const sel = document.querySelector(`input[name="mq_${idx}"]:checked`);
            if(sel) responses[`q${idx+1}`] = sel.value;
        } else {
            const inp = document.getElementById(`mq_${idx}`);
            if(inp && inp.value) responses[`q${idx+1}`] = inp.value;
        }
    });

    const payload = {
        indicator_id: currentManualId,
        title: currentManualData.title || currentManualId,
        category: currentManualData.category,
        bayesian_score: score,
        confidence: parseFloat(conf),
        maturity_level: score < 0.33 ? 'green' : score < 0.66 ? 'yellow' : 'red',
        assessor: assessor,
        assessment_date: date,
        raw_data: {
            client_conversation: {
                responses: responses,
                metadata: { auditor: assessor, date: date, status: 'completed' }
            }
        }
    };

    try {
        const res = await fetch(`/api/organizations/${selectedOrgId}/assessments`, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(payload)
        });
        const json = await res.json();
        
        if(json.success) {
            showAlert('Assessment Saved!', 'success');
            // Show score
            document.getElementById('scoreDisplay').style.display = 'block';
            document.getElementById('scoreValue').textContent = score.toFixed(2);
            // Reload org
            await loadOrganizationDetails(selectedOrgId);
        } else {
            throw new Error(json.error);
        }
    } catch(e) {
        showAlert('Save failed: ' + e.message, 'error');
    }
}

export function resetCompileForm() {
    document.getElementById('compileFormContent').innerHTML = '';
    document.getElementById('compileFormContainer').style.display = 'none';
    document.getElementById('compileEmptyState').style.display = 'block';
    currentManualData = null;
}