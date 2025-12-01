import { currentData } from './state.js';
import { 
    autoSave, 
    saveToAPI, 
    exportData, 
    resetAll, 
    generateReport, 
    importJSON 
} from './api.js';
import { calculateIndicatorScore } from './scoring.js';
import { 
    toggleScoreDetails, 
    toggleDetailedAnalysis, 
    updateScoreDisplay, 
    showQuickReference, 
    closeQuickReference 
} from './render.js';

// --- STATE UPDATE FUNCTIONS (Definite qui localmente) ---

export function updateMeta(field, value) {
    currentData.metadata[field] = value;
    autoSave();
}

export function updateResponse(id, value) {
    currentData.responses[id] = value;
    
    // Update visual checkbox state
    const elem = document.getElementById(id);
    if (elem && elem.type === 'checkbox') {
        const item = elem.closest('.checkbox-item');
        if (item) {
            if (value) item.classList.add('checked');
            else item.classList.remove('checked');
        }
    }
    // Update visual radio-list state
    const radioContainer = document.querySelector(`[data-item-id="${id}"]`);
    if (radioContainer) {
        radioContainer.querySelectorAll('.checkbox-item').forEach(item => item.classList.remove('checked'));
        const selected = radioContainer.querySelector(`[data-value="${value}"]`);
        if (selected) selected.classList.add('checked');
    }

    // Auto-calculate
    if (currentData.fieldKit && currentData.fieldKit.scoring) {
        calculateIndicatorScore();
        updateScoreDisplay();
    }
    autoSave();
}

export function selectRadioOption(itemId, value) {
    currentData.responses[itemId] = value;
    const container = document.querySelector(`[data-item-id="${itemId}"]`);
    if (container) {
        container.querySelectorAll('.checkbox-item').forEach(item => {
            item.classList.remove('checked');
            const cb = item.querySelector('input[type="checkbox"]');
            if(cb) cb.checked = false;
        });
        const selected = container.querySelector(`[data-value="${value}"]`);
        if (selected) {
            selected.classList.add('checked');
            const cb = selected.querySelector('input[type="checkbox"]');
            if(cb) cb.checked = true;
        }
    }
    if (currentData.fieldKit && currentData.fieldKit.scoring) {
        calculateIndicatorScore();
        updateScoreDisplay();
    }
    autoSave();
}

// --- EVENT DELEGATION ---

export function setupClientEventDelegation() {
    document.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        if (!action) return;

        // Verify we are inside the client container
        if (!e.target.closest('.cpf-client')) return;

        switch (action) {
            case 'save':
            case 'save-data':
                saveToAPI().catch(e => console.error(e));
                break;
            case 'export':
            case 'export-data':
                exportData();
                break;
            case 'generate-report':
                generateReport();
                break;
            case 'toggle-score-details':
                toggleScoreDetails();
                break;
            case 'toggle-detailed-analysis':
                toggleDetailedAnalysis();
                break;
            case 'show-quick-reference':
                showQuickReference();
                break;
            case 'close-quick-reference':
                closeQuickReference();
                break;
            case 'reset-compile-form':
                resetAll();
                break;
            case 'trigger-file-input':
                 const inputId = e.target.dataset.fileInputId;
                 if(inputId) {
                     const el = document.getElementById(inputId);
                     if(el) el.click();
                 }
                 break;
        }
    });

    document.addEventListener('change', (e) => {
        const target = e.target;
        
        if (target.dataset.action === 'import-json') {
            importJSON(e);
            return;
        }

        const metaField = target.dataset.metaField;
        const responseId = target.dataset.responseId;

        if (metaField) {
            updateMeta(metaField, target.value);
        } else if (responseId) {
            const value = target.type === 'checkbox' ? target.checked : target.value;
            updateResponse(responseId, value);
        } else if (target.dataset.radioGroup) {
            const itemId = target.dataset.radioGroup;
            const value = target.dataset.radioValue;
            if (itemId && value) selectRadioOption(itemId, value);
        }
    });
}