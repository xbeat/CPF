// ============================================
// CPF FIELD KIT CLIENT
// Interactive Assessment Tool
// ============================================

let currentData = null;
let currentScore = {
    quick_assessment: 0,
    conversation_depth: 0,
    red_flags: 0,
    final_score: 0,
    maturity_level: 'green',
    details: {}
};

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

/**
 * Load JSON from GitHub repository with multilingual support
 */
async function loadJSON() {
    const input = document.getElementById('indicatorInput').value.trim();

    if (!input) {
        showError('Please enter an indicator number (e.g., 1.3 or 1.3-IT)');
        return;
    }

    try {
        showLoading('Loading indicator data...');

        // Parse input: "X.Y-LANG" or "X.Y"
        let [indicator, lang] = input.includes('-') ? input.split('-') : [input, 'EN'];

        // Validate indicator format
        if (!/^\d{1,2}\.\d{1,2}$/.test(indicator)) {
            throw new Error(`Invalid indicator format: ${indicator}. Expected format: X.Y (e.g., 1.3)`);
        }

        // Map language code to ISO format
        const isoLang = LANG_MAP[lang.toUpperCase()] || 'en-US';

        // Extract category number
        const categoryNum = indicator.split('.')[0];
        const categoryName = CATEGORY_MAP[categoryNum];

        if (!categoryName) {
            throw new Error(`Invalid category number: ${categoryNum}. Must be 1-10.`);
        }

        // Construct GitHub raw URL
        const githubUrl = `https://raw.githubusercontent.com/xbeat/CPF/main/auditor%20field%20kit/interactive/${isoLang}/${categoryNum}.x-${categoryName}/indicator_${indicator}.json`;

        console.log('Fetching from:', githubUrl);

        // Fetch JSON
        const response = await fetch(githubUrl);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Indicator ${indicator} not found for language ${isoLang}. The JSON file may not exist yet.`);
            }
            throw new Error(`Failed to load indicator: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        currentData = data;

        // Render the field kit
        renderFieldKit(data);

    } catch (error) {
        console.error('Load error:', error);
        showError(`Error loading indicator: ${error.message}`);
    }
}

/**
 * Load JSON from local file
 */
async function loadLocalJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            showLoading('Loading local JSON...');
            const text = await file.text();
            const data = JSON.parse(text);
            currentData = data;
            renderFieldKit(data);
        } catch (error) {
            console.error('Parse error:', error);
            showError(`Error parsing JSON: ${error.message}`);
        }
    };

    input.click();
}

/**
 * Render the complete field kit interface
 */
function renderFieldKit(data) {
    const content = document.getElementById('content');

    // Reset score
    resetScore();

    let html = `
        <div class="field-kit-header">
            <h2 class="field-kit-title">${data.title || 'Field Kit'}</h2>
            <p class="field-kit-subtitle">${data.subtitle || ''}</p>
        </div>

        <div class="metadata">
            <div class="metadata-item"><strong>Indicator:</strong> ${data.indicator}</div>
            <div class="metadata-item"><strong>Category:</strong> ${data.category}</div>
            <div class="metadata-item"><strong>Version:</strong> ${data.version}</div>
            ${data.metadata?.language ? `<div class="metadata-item"><strong>Language:</strong> ${data.metadata.language_name || data.metadata.language}</div>` : ''}
            ${data.metadata?.is_translation ? `<div class="metadata-item"><strong>Translated from:</strong> ${data.metadata.translated_from}</div>` : ''}
        </div>

        <div class="section">
            <div class="section-title">Description</div>
            <p>${data.description || 'No description available.'}</p>
        </div>
    `;

    // Render sections
    if (data.sections && Array.isArray(data.sections)) {
        data.sections.forEach(section => {
            html += renderSection(section, data);
        });
    }

    content.innerHTML = html;

    // Attach event listeners
    attachEventListeners();
}

/**
 * Render a section (quick-assessment or client-conversation)
 */
function renderSection(section, data) {
    let html = `<div class="section" data-section-id="${section.id}">`;
    html += `<div class="section-title">${section.title || section.id}</div>`;

    if (section.id === 'quick-assessment') {
        html += renderQuickAssessment(section, data);
    } else if (section.id === 'client-conversation') {
        html += renderClientConversation(section, data);
    }

    html += '</div>';
    return html;
}

/**
 * Render quick assessment questions
 */
function renderQuickAssessment(section, data) {
    let html = '<div class="quick-assessment">';

    if (section.items && Array.isArray(section.items)) {
        section.items.forEach((item, index) => {
            html += `
                <div class="question" data-question-id="${item.id}">
                    <div class="question-text">
                        <strong>Question ${index + 1}:</strong> ${item.question}
                    </div>
                    <div class="options" data-question-id="${item.id}">
            `;

            if (item.options && Array.isArray(item.options)) {
                item.options.forEach((option, optIndex) => {
                    html += `
                        <div class="option"
                             data-question-id="${item.id}"
                             data-option-index="${optIndex}"
                             data-score="${option.score}"
                             data-weight="${item.weight || 0}">
                            ${option.label} <span style="color: #888;">(Score: ${option.score})</span>
                        </div>
                    `;
                });
            }

            html += '</div></div>';
        });
    }

    html += '</div>';
    return html;
}

/**
 * Render client conversation section
 */
function renderClientConversation(section, data) {
    let html = '<div class="client-conversation">';
    html += '<p><em>This section is for qualitative assessment during client interviews.</em></p>';

    if (section.subsections && Array.isArray(section.subsections)) {
        section.subsections.forEach(subsection => {
            html += `
                <div class="subsection">
                    <h4>${subsection.title}</h4>
                    <p>${subsection.description || ''}</p>
            `;

            if (subsection.items && Array.isArray(subsection.items)) {
                html += '<ul>';
                subsection.items.forEach(item => {
                    html += `<li><strong>${item.question}</strong>`;
                    if (item.guidance) {
                        html += `<br><em style="color: #888;">Guidance: ${item.guidance}</em>`;
                    }
                    if (item.score_impact) {
                        html += `<br><em style="color: #00d9ff;">Impact: ${item.score_impact}</em>`;
                    }
                    html += '</li>';
                });
                html += '</ul>';
            }

            html += '</div>';
        });
    }

    html += '</div>';
    return html;
}

/**
 * Attach event listeners to interactive elements
 */
function attachEventListeners() {
    // Option selection
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function() {
            const questionId = this.dataset.questionId;
            const score = parseFloat(this.dataset.score);
            const weight = parseFloat(this.dataset.weight);

            // Deselect other options in same question
            document.querySelectorAll(`.option[data-question-id="${questionId}"]`).forEach(opt => {
                opt.classList.remove('selected');
            });

            // Select this option
            this.classList.add('selected');

            // Update score
            updateScore(questionId, score, weight);
        });
    });
}

/**
 * Update score calculation
 */
function updateScore(questionId, score, weight) {
    // Store individual question score
    currentScore.details[questionId] = {
        score: score,
        weight: weight,
        weighted_score: score * weight
    };

    // Recalculate total quick assessment score
    let totalWeightedScore = 0;
    Object.values(currentScore.details).forEach(detail => {
        totalWeightedScore += detail.weighted_score;
    });

    currentScore.quick_assessment = totalWeightedScore;

    // Calculate final score (for now, only quick assessment is interactive)
    if (currentData && currentData.scoring && currentData.scoring.weights) {
        const weights = currentData.scoring.weights;
        currentScore.final_score =
            (currentScore.quick_assessment * weights.quick_assessment) +
            (currentScore.conversation_depth * weights.conversation_depth) +
            (currentScore.red_flags * weights.red_flags);
    } else {
        currentScore.final_score = currentScore.quick_assessment;
    }

    // Determine maturity level
    if (currentScore.final_score <= 0.33) {
        currentScore.maturity_level = 'green';
    } else if (currentScore.final_score <= 0.66) {
        currentScore.maturity_level = 'yellow';
    } else {
        currentScore.maturity_level = 'red';
    }

    // Display score
    displayScore();
}

/**
 * Display current score
 */
function displayScore() {
    // Remove existing score display
    let scoreDisplay = document.getElementById('score-display');
    if (!scoreDisplay) {
        scoreDisplay = document.createElement('div');
        scoreDisplay.id = 'score-display';
        scoreDisplay.className = 'score-display';
        document.getElementById('content').insertBefore(
            scoreDisplay,
            document.getElementById('content').firstChild
        );
    }

    const maturityClass = `maturity-${currentScore.maturity_level}`;
    const maturityLabel = currentScore.maturity_level.toUpperCase();

    scoreDisplay.innerHTML = `
        <h3>Current Assessment Score</h3>
        <div class="score-value">${(currentScore.final_score * 100).toFixed(1)}%</div>
        <div>Quick Assessment: ${(currentScore.quick_assessment * 100).toFixed(1)}%</div>
        <div>Conversation Depth: ${(currentScore.conversation_depth * 100).toFixed(1)}%</div>
        <div>Red Flags: ${(currentScore.red_flags * 100).toFixed(1)}%</div>
        <div class="maturity-level ${maturityClass}">
            Maturity Level: ${maturityLabel}
        </div>
    `;
}

/**
 * Validate current JSON using the validator
 */
async function validateCurrentJSON() {
    if (!currentData) {
        showError('No JSON loaded. Please load an indicator first.');
        return;
    }

    try {
        // Check if validator is available
        if (typeof validateCPFJSON === 'undefined') {
            // Load validator dynamically
            await loadValidator();
        }

        // Run validation
        const result = validateCPFJSON(currentData);

        // Display results
        displayValidationResult(result);

    } catch (error) {
        console.error('Validation error:', error);
        showError(`Validation error: ${error.message}`);
    }
}

/**
 * Load validator.js dynamically
 */
function loadValidator() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'validator.js';
        script.onload = resolve;
        script.onerror = () => reject(new Error('Failed to load validator.js'));
        document.head.appendChild(script);
    });
}

/**
 * Display validation results
 */
function displayValidationResult(result) {
    const content = document.getElementById('content');

    let validationHTML = `
        <div class="validation-result ${result.valid ? 'success' : 'error'}">
            <div class="validation-summary">
                <h3>${result.valid ? '✅ Valid JSON' : '❌ Invalid JSON'}</h3>
                <p><strong>Indicator:</strong> ${result.summary.indicator}</p>
                <p><strong>Category:</strong> ${result.summary.category}</p>
                <p><strong>Errors:</strong> ${result.summary.errors_found}</p>
                <p><strong>Warnings:</strong> ${result.summary.warnings_found}</p>
            </div>
    `;

    if (result.errors.length > 0) {
        validationHTML += '<div class="validation-errors"><h4>Errors:</h4><ul>';
        result.errors.forEach(err => {
            validationHTML += `<li>${err}</li>`;
        });
        validationHTML += '</ul></div>';
    }

    if (result.warnings.length > 0) {
        validationHTML += '<div class="validation-warnings"><h4>Warnings:</h4><ul>';
        result.warnings.forEach(warn => {
            validationHTML += `<li>${warn}</li>`;
        });
        validationHTML += '</ul></div>';
    }

    if (result.valid && result.warnings.length === 0) {
        validationHTML += '<p style="color: #00ff88; font-weight: bold;">Perfect! JSON is fully valid with no warnings.</p>';
    }

    validationHTML += '</div>';

    // Insert at top of content
    content.insertAdjacentHTML('afterbegin', validationHTML);
}

/**
 * Reset all data and UI
 */
function resetAll() {
    currentData = null;

    // Reset score object completely
    currentScore = {
        quick_assessment: 0,
        conversation_depth: 0,
        red_flags: 0,
        final_score: 0,
        maturity_level: 'green',
        details: {}
    };

    // Reset UI
    const content = document.getElementById('content');
    content.innerHTML = `
        <p style="text-align: center; color: #888; padding: 40px;">
            Enter an indicator number and click "Load Indicator" to begin the assessment.<br><br>
            Use format: <strong>X.Y-LANG</strong> (e.g., 1.3-IT for Italian, 1.3-EN for English)<br>
            or just <strong>X.Y</strong> to default to English (en-US)
        </p>
    `;

    // Clear input
    document.getElementById('indicatorInput').value = '';

    console.log('Reset complete');
}

/**
 * Reset score tracking
 */
function resetScore() {
    currentScore = {
        quick_assessment: 0,
        conversation_depth: 0,
        red_flags: 0,
        final_score: 0,
        maturity_level: 'green',
        details: {}
    };
}

/**
 * Show loading state
 */
function showLoading(message) {
    const content = document.getElementById('content');
    content.innerHTML = `<div class="loading">${message}</div>`;
}

/**
 * Show error message
 */
function showError(message) {
    const content = document.getElementById('content');
    content.innerHTML = `<div class="error"><strong>Error:</strong> ${message}</div>`;
}

/**
 * Show success message
 */
function showSuccess(message) {
    const content = document.getElementById('content');
    content.innerHTML = `<div class="success"><strong>Success:</strong> ${message}</div>`;
}

// Initialize
console.log('CPF Field Kit Client loaded');
console.log('Supported languages:', Object.keys(LANG_MAP).join(', '));
console.log('Supported categories:', Object.keys(CATEGORY_MAP).join(', '));
