// CPF Card Editor - Local Mode with Optional GitHub Integration
// This editor works standalone (local save) and can optionally push to GitHub

// State
let cards = [];
let currentCard = null;
let currentCardPath = null;
let githubEnabled = false;

// DOM Elements
const cardList = document.getElementById('card-list');
const cardSearch = document.getElementById('card-search');
const categoryFilter = document.getElementById('category-filter');
const cardCount = document.getElementById('card-count');
const emptyState = document.getElementById('emptyState');
const editorSection = document.getElementById('editorSection');
const cardEditorForm = document.getElementById('cardEditorForm');
const cardPreview = document.getElementById('cardPreview');
const jsonEditor = document.getElementById('jsonEditor');
const loadJsonBtn = document.getElementById('load-json-btn');
const loadJsonInput = document.getElementById('load-json-input');
const saveLocalBtn = document.getElementById('save-local-btn');
const saveGithubBtn = document.getElementById('save-github-btn');
const githubStatus = document.getElementById('github-status');
const statusIcon = document.getElementById('status-icon');
const statusText = document.getElementById('status-text');

// Initialize
document.addEventListener('DOMContentLoaded', init);

async function init() {
    setupEventListeners();
    await checkGitHubStatus();
    await loadCards();
}

function setupEventListeners() {
    cardSearch.addEventListener('input', filterCards);
    categoryFilter.addEventListener('change', filterCards);
    loadJsonBtn.addEventListener('click', () => loadJsonInput.click());
    loadJsonInput.addEventListener('change', handleFileLoad);
    saveLocalBtn.addEventListener('click', saveToLocal);
    saveGithubBtn.addEventListener('click', saveToGitHub);

    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', (e) => switchTab(e.target.dataset.tab));
    });

    // JSON editor buttons
    document.getElementById('format-json-btn').addEventListener('click', formatJSON);
    document.getElementById('apply-json-btn').addEventListener('click', applyJSON);
}

async function checkGitHubStatus() {
    try {
        const response = await fetch('/api/cards');
        if (response.ok) {
            githubEnabled = true;
            statusIcon.textContent = '🔗';
            statusText.textContent = 'GitHub Connected';
            saveGithubBtn.style.display = 'inline-flex';
            githubStatus.style.background = 'rgba(34, 197, 94, 0.3)';
        }
    } catch (error) {
        // GitHub not available, keep local mode
        console.log('GitHub integration not available, using local mode');
    }
}

async function loadCards() {
    cardList.innerHTML = '<div class="loading"><div class="loading-spinner"></div><div>Loading cards...</div></div>';

    try {
        // Try to load from GitHub first if enabled
        if (githubEnabled) {
            const response = await fetch('/api/cards');
            if (response.ok) {
                const cardPaths = await response.json();
                cards = cardPaths.map(path => ({
                    path: path,
                    id: path.split('/').pop().replace('.json', ''),
                    category: path.split('/')[3], // e.g., "1.x-authority"
                    language: path.includes('/en-US/') ? 'en-US' : 'it-IT'
                }));
                renderCardList();
                return;
            }
        }

        // Fallback: Show instructions for local loading
        cardList.innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <h3 style="color: var(--primary); margin-bottom: 10px;">📂 Load Cards Locally</h3>
                <p style="font-size: 14px; color: var(--text-light); margin-bottom: 15px;">
                    Cards are located in:<br>
                    <code style="background: var(--bg-gray); padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                        auditor field kit/interactive/
                    </code>
                </p>
                <input type="file" id="file-input" accept=".json" multiple style="display: none;">
                <button class="btn btn-primary" onclick="document.getElementById('file-input').click();">
                    📁 Browse Files
                </button>
            </div>
        `;

        document.getElementById('file-input').addEventListener('change', handleFileSelect);
    } catch (error) {
        showAlert('Error loading cards: ' + error.message, 'error');
    }
}

function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    cards = [];

    files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                // IMPORTANT: Don't validate id/title here - accept any valid JSON
                // The editor can work with any card structure
                // Use data.indicator or data.id or fallback to filename
                const cardId = data.indicator || data.id || file.name.replace('.json', '');

                cards.push({
                    path: file.name,
                    id: cardId,
                    category: data.category || 'Unknown',
                    language: data.language || 'en-US',
                    data: data,
                    file: file
                });

                if (index === files.length - 1) {
                    renderCardList();
                }
            } catch (error) {
                showAlert(`Error parsing ${file.name}: ` + error.message, 'error');
            }
        };
        reader.readAsText(file);
    });
}

function renderCardList() {
    const filteredCards = cards;
    cardCount.textContent = filteredCards.length;

    if (filteredCards.length === 0) {
        cardList.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-light);">No cards found</div>';
        return;
    }

    const html = filteredCards.map(card => `
        <div class="card-list-item" data-card-id="${card.id}">
            <div class="card-list-item-title">${card.id}</div>
            <div class="card-list-item-subtitle">${card.category || 'Unknown'}</div>
        </div>
    `).join('');

    cardList.innerHTML = html;

    // Add click listeners using event delegation
    document.querySelectorAll('.card-list-item').forEach(item => {
        item.addEventListener('click', () => loadCard(item.dataset.cardId));
    });
}

function filterCards() {
    const searchTerm = cardSearch.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filtered = cards.filter(card => {
        const matchesSearch = card.id.toLowerCase().includes(searchTerm) ||
                            (card.category && card.category.toLowerCase().includes(searchTerm));
        const matchesCategory = !selectedCategory ||
                               (card.category && card.category.startsWith(selectedCategory));
        return matchesSearch && matchesCategory;
    });

    renderFilteredCards(filtered);
}

function renderFilteredCards(filteredCards) {
    cardCount.textContent = filteredCards.length;

    if (filteredCards.length === 0) {
        cardList.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-light);">No cards match your filters</div>';
        return;
    }

    const html = filteredCards.map(card => `
        <div class="card-list-item ${currentCard && currentCard.id === card.id ? 'active' : ''}" data-card-id="${card.id}">
            <div class="card-list-item-title">${card.id}</div>
            <div class="card-list-item-subtitle">${card.category || 'Unknown'}</div>
        </div>
    `).join('');

    cardList.innerHTML = html;

    // Add click listeners using event delegation
    document.querySelectorAll('.card-list-item').forEach(item => {
        item.addEventListener('click', () => loadCard(item.dataset.cardId));
    });
}

async function loadCard(cardId) {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    currentCard = card;
    currentCardPath = card.path;

    // If data not loaded yet, load from GitHub
    if (!card.data && githubEnabled) {
        try {
            const response = await fetch(`/api/cards/contents?path=${encodeURIComponent(card.path)}`);
            if (response.ok) {
                card.data = await response.json();
            }
        } catch (error) {
            showAlert('Error loading card data: ' + error.message, 'error');
            return;
        }
    }

    if (!card.data) {
        showAlert('No data available for this card', 'error');
        return;
    }

    // Update UI
    emptyState.style.display = 'none';
    editorSection.classList.remove('hidden');

    // Update active state
    document.querySelectorAll('.card-list-item').forEach(item => {
        item.classList.toggle('active', item.dataset.cardId === cardId);
    });

    // Render editor, preview, and JSON
    renderEditor(card.data);
    renderPreview(card.data);
    jsonEditor.value = JSON.stringify(card.data, null, 2);
}

function renderEditor(cardData) {
    // Only edit the 'sections' array (assessment, conversation, red flags)
    if (!cardData.sections || !Array.isArray(cardData.sections)) {
        cardEditorForm.innerHTML = `
            <div class="form-section">
                <div class="form-section-title">⚠️ No Sections Found</div>
                <p>This card doesn't have editable sections. Use the "Raw JSON" tab to edit manually.</p>
            </div>
        `;
        return;
    }

    let html = `
        <div style="padding: 20px; background: #eff6ff; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0; color: var(--primary);">📝 Card Editor</h3>
            <p style="margin: 0; font-size: 14px; color: var(--text-light);">
                Edit assessment questions, client conversation questions, and red flags below.
                <br><strong>Note:</strong> Card metadata (indicator ID, title, etc.) cannot be changed here - use Raw JSON tab if needed.
            </p>
        </div>
    `;

    // Render each section
    cardData.sections.forEach((section, sectionIndex) => {
        html += renderSection(section, sectionIndex);
    });

    cardEditorForm.innerHTML = html;

    // Add event listeners
    cardEditorForm.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('input', updateFromSectionsEditor);
    });
}

function renderSection(section, sectionIndex) {
    let html = `
        <div class="form-section" data-section-index="${sectionIndex}">
            <div class="form-section-title">${section.icon || '📋'} ${section.title || 'Section'}</div>
            <p style="font-size: 13px; color: var(--text-light); margin-bottom: 15px;">
                ${section.type || ''} • ${section.time || ''} min
            </p>
    `;

    // Render items (for quick-assessment)
    if (section.items && Array.isArray(section.items)) {
        section.items.forEach((item, itemIndex) => {
            html += renderSectionItem(item, sectionIndex, itemIndex);
        });
    }

    // Render subsections (for client-conversation)
    if (section.subsections && Array.isArray(section.subsections)) {
        section.subsections.forEach((subsection, subIndex) => {
            html += renderSubsection(subsection, sectionIndex, subIndex);
        });
    }

    html += `</div>`;
    return html;
}

function renderSectionItem(item, sectionIndex, itemIndex) {
    let html = `
        <div class="form-group" style="background: var(--bg-gray); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <label style="display: block; font-weight: 600; margin-bottom: 8px;">
                Question ${item.number || itemIndex + 1}: ${item.title || 'Untitled'}
            </label>
            <textarea
                data-section="${sectionIndex}"
                data-item="${itemIndex}"
                data-field="question"
                rows="2"
                style="width: 100%; margin-bottom: 10px; padding: 10px; border: 1px solid var(--border); border-radius: 6px;"
            >${escapeHtml(item.question || '')}</textarea>
    `;

    // Render options for radio-list
    if (item.type === 'radio-list' && item.options && Array.isArray(item.options)) {
        html += `<div style="margin-top: 10px;"><strong style="font-size: 13px;">Options:</strong></div>`;
        item.options.forEach((option, optIndex) => {
            html += `
                <div style="background: white; padding: 10px; margin: 8px 0; border-radius: 6px; border: 1px solid var(--border);">
                    <label style="font-size: 12px; color: var(--text-light); display: block; margin-bottom: 4px;">Option ${optIndex + 1} (Score: ${option.score || 0})</label>
                    <textarea
                        data-section="${sectionIndex}"
                        data-item="${itemIndex}"
                        data-option="${optIndex}"
                        data-field="label"
                        rows="2"
                        style="width: 100%; padding: 8px; border: 1px solid var(--border); border-radius: 4px; font-size: 13px;"
                    >${escapeHtml(option.label || '')}</textarea>
                </div>
            `;
        });
    }

    html += `</div>`;
    return html;
}

function renderSubsection(subsection, sectionIndex, subIndex) {
    let html = `
        <div style="background: var(--bg-gray); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="color: var(--primary); margin-bottom: 10px;">${subsection.title || 'Subsection'}</h4>
    `;

    // Render conversation items (questions)
    if (subsection.items && Array.isArray(subsection.items)) {
        subsection.items.forEach((item, itemIndex) => {
            if (item.type === 'question') {
                html += `
                    <div class="form-group" style="background: white; padding: 12px; border-radius: 6px; margin-bottom: 12px;">
                        <label style="font-weight: 600; font-size: 13px;">Question: ${item.id || ''}</label>
                        <textarea
                            data-section="${sectionIndex}"
                            data-subsection="${subIndex}"
                            data-item="${itemIndex}"
                            data-field="text"
                            rows="3"
                            style="width: 100%; margin-top: 8px; padding: 8px; border: 1px solid var(--border); border-radius: 4px;"
                        >${escapeHtml(item.text || '')}</textarea>
                    </div>
                `;
            } else if (item.type === 'checkbox') {
                // Red flag checkbox
                html += `
                    <div class="form-group" style="background: #fee; padding: 12px; border-radius: 6px; margin-bottom: 10px; border-left: 3px solid var(--danger);">
                        <label style="font-weight: 600; font-size: 13px; color: var(--danger);">🚩 Red Flag: ${item.id || ''}</label>
                        <textarea
                            data-section="${sectionIndex}"
                            data-subsection="${subIndex}"
                            data-item="${itemIndex}"
                            data-field="label"
                            rows="2"
                            style="width: 100%; margin-top: 8px; padding: 8px; border: 1px solid var(--border); border-radius: 4px;"
                        >${escapeHtml(item.label || '')}</textarea>
                        <div style="margin-top: 8px; font-size: 12px; color: var(--text-light);">
                            Severity: <strong>${item.severity || 'N/A'}</strong> | Score Impact: <strong>${item.score_impact || 0}</strong>
                        </div>
                    </div>
                `;
            }
        });
    }

    html += `</div>`;
    return html;
}

function groupFieldsBySection(cardData) {
    const sections = {
        'Basic Information': {},
        'Content': {},
        'Scoring': {},
        'Metadata': {}
    };

    for (const [key, value] of Object.entries(cardData)) {
        if (['indicator', 'title', 'category'].includes(key)) {
            sections['Basic Information'][key] = value;
        } else if (['description', 'psychological_basis', 'behavioral_indicators', 'questions'].includes(key)) {
            sections['Content'][key] = value;
        } else if (key.includes('scoring') || key.includes('weight') || key.includes('level')) {
            sections['Scoring'][key] = value;
        } else {
            sections['Metadata'][key] = value;
        }
    }

    return sections;
}

function renderFormField(key, value) {
    if (Array.isArray(value)) {
        return `
            <div class="form-group">
                <label>${formatLabel(key)}</label>
                <div class="array-container" id="array-${key}">
                    ${value.map((item, index) => `
                        <div class="array-item">
                            <input type="text" value="${escapeHtml(typeof item === 'object' ? JSON.stringify(item) : item)}" data-array="${key}" data-index="${index}">
                            <button onclick="removeArrayItem('${key}', ${index})">Remove</button>
                        </div>
                    `).join('')}
                </div>
                <button class="add-array-btn" onclick="addArrayItem('${key}')">+ Add Item</button>
            </div>
        `;
    } else if (typeof value === 'object' && value !== null) {
        return `
            <div class="form-group">
                <label>${formatLabel(key)}</label>
                <textarea data-key="${key}" rows="4">${JSON.stringify(value, null, 2)}</textarea>
                <div class="form-helper">Edit as JSON object</div>
            </div>
        `;
    } else {
        const isLongText = typeof value === 'string' && value.length > 100;
        return `
            <div class="form-group">
                <label>${formatLabel(key)}</label>
                ${isLongText ?
                    `<textarea data-key="${key}" rows="3">${escapeHtml(value)}</textarea>` :
                    `<input type="text" data-key="${key}" value="${escapeHtml(value)}">`
                }
            </div>
        `;
    }
}

function formatLabel(key) {
    return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

window.addArrayItem = function(arrayKey) {
    const container = document.getElementById(`array-${arrayKey}`);
    const index = container.querySelectorAll('.array-item').length;
    const newItem = document.createElement('div');
    newItem.className = 'array-item';
    newItem.innerHTML = `
        <input type="text" value="" data-array="${arrayKey}" data-index="${index}">
        <button onclick="removeArrayItem('${arrayKey}', ${index})">Remove</button>
    `;
    container.appendChild(newItem);
    newItem.querySelector('input').addEventListener('input', updateFromEditor);
};

window.removeArrayItem = function(arrayKey, index) {
    const container = document.getElementById(`array-${arrayKey}`);
    const items = container.querySelectorAll('.array-item');
    items[index].remove();
    updateFromEditor();
};

function updateFromSectionsEditor() {
    // Update currentCard.data.sections based on form inputs
    const textareas = cardEditorForm.querySelectorAll('textarea[data-section]');

    textareas.forEach(textarea => {
        const sectionIdx = parseInt(textarea.dataset.section);
        const field = textarea.dataset.field;
        const value = textarea.value;

        if (!currentCard.data.sections[sectionIdx]) return;

        // Handle quick-assessment items
        if (textarea.dataset.item !== undefined && textarea.dataset.subsection === undefined) {
            const itemIdx = parseInt(textarea.dataset.item);
            const section = currentCard.data.sections[sectionIdx];

            if (section.items && section.items[itemIdx]) {
                if (textarea.dataset.option !== undefined) {
                    // Update option label
                    const optionIdx = parseInt(textarea.dataset.option);
                    if (section.items[itemIdx].options && section.items[itemIdx].options[optionIdx]) {
                        section.items[itemIdx].options[optionIdx][field] = value;
                    }
                } else {
                    // Update question
                    section.items[itemIdx][field] = value;
                }
            }
        }

        // Handle conversation subsection items
        if (textarea.dataset.subsection !== undefined) {
            const subIdx = parseInt(textarea.dataset.subsection);
            const itemIdx = parseInt(textarea.dataset.item);
            const section = currentCard.data.sections[sectionIdx];

            if (section.subsections && section.subsections[subIdx]) {
                const subsection = section.subsections[subIdx];
                if (subsection.items && subsection.items[itemIdx]) {
                    subsection.items[itemIdx][field] = value;
                }
            }
        }
    });

    // Update preview and JSON
    renderPreview(currentCard.data);
    jsonEditor.value = JSON.stringify(currentCard.data, null, 2);
}

function updateFromEditor() {
    // Legacy function - redirect to new sections editor
    updateFromSectionsEditor();
}

function getEditorData() {
    // Return current card data (already updated by updateFromSectionsEditor)
    return currentCard.data;
}

function renderPreview(cardData) {
    let html = `
        <h2>${cardData.indicator || ''} - ${cardData.title || 'Untitled'}</h2>
        <p><span class="badge">${cardData.category || 'Unknown Category'}</span></p>
    `;

    if (cardData.description) {
        html += `<h3>Description</h3><p>${cardData.description}</p>`;
    }

    if (cardData.psychological_basis) {
        html += `<h3>Psychological Basis</h3><p>${cardData.psychological_basis}</p>`;
    }

    if (cardData.behavioral_indicators && Array.isArray(cardData.behavioral_indicators)) {
        html += `<h3>Behavioral Indicators</h3><ul>`;
        cardData.behavioral_indicators.forEach(indicator => {
            html += `<li>${indicator}</li>`;
        });
        html += `</ul>`;
    }

    if (cardData.questions && Array.isArray(cardData.questions)) {
        html += `<h3>Assessment Questions</h3><ul>`;
        cardData.questions.forEach(q => {
            html += `<li>${typeof q === 'object' ? q.question || JSON.stringify(q) : q}</li>`;
        });
        html += `</ul>`;
    }

    cardPreview.innerHTML = html;
}

function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    event.target.classList.add('active');
    document.getElementById(`${tabName}Tab`).classList.add('active');
}

function formatJSON() {
    try {
        const data = JSON.parse(jsonEditor.value);
        jsonEditor.value = JSON.stringify(data, null, 2);
        showAlert('JSON formatted successfully', 'success');
    } catch (e) {
        showAlert('Invalid JSON: ' + e.message, 'error');
    }
}

function applyJSON() {
    try {
        const data = JSON.parse(jsonEditor.value);
        currentCard.data = data;
        renderEditor(data);
        renderPreview(data);
        showAlert('Changes applied from JSON', 'success');
    } catch (e) {
        showAlert('Invalid JSON: ' + e.message, 'error');
    }
}

// Load JSON file from local computer
async function handleFileLoad(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
        const text = await file.text();
        const data = JSON.parse(text);

        // Validate it's a valid card JSON
        if (!data.id || !data.title) {
            throw new Error('Invalid card format: missing id or title');
        }

        // Create a card object
        const loadedCard = {
            id: data.id,
            path: file.name,
            data: data,
            category: data.category || 'unknown',
            language: data.language || 'en-US'
        };

        // Add to cards list if not already there
        const existingIndex = cards.findIndex(c => c.id === loadedCard.id);
        if (existingIndex >= 0) {
            cards[existingIndex] = loadedCard;
        } else {
            cards.push(loadedCard);
        }

        // Render card list and select the loaded card
        renderCardList();
        selectCard(loadedCard.id);

        showAlert(`Loaded card: ${data.title}`, 'success');
    } catch (error) {
        showAlert(`Failed to load JSON file: ${error.message}`, 'error');
        console.error('File load error:', error);
    }

    // Reset input so the same file can be loaded again
    event.target.value = '';
}

function saveToLocal() {
    if (!currentCard || !currentCard.data) {
        showAlert('No card loaded', 'error');
        return;
    }

    const dataStr = JSON.stringify(currentCard.data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentCard.path || `${currentCard.id}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showAlert('Card saved to downloads', 'success');
}

async function saveToGitHub() {
    if (!githubEnabled) {
        showAlert('GitHub integration not available', 'error');
        return;
    }

    if (!currentCard || !currentCard.data) {
        showAlert('No card loaded', 'error');
        return;
    }

    const user = prompt('Enter your name for the commit:');
    if (!user) return;

    saveGithubBtn.disabled = true;
    saveGithubBtn.textContent = '⏳ Saving...';

    try {
        const response = await fetch('/api/cards/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                path: currentCardPath,
                content: currentCard.data,
                user: user
            })
        });

        if (response.ok) {
            showAlert('Card saved to GitHub successfully', 'success');
        } else {
            const error = await response.text();
            showAlert('Failed to save to GitHub: ' + error, 'error');
        }
    } catch (error) {
        showAlert('Error saving to GitHub: ' + error.message, 'error');
    } finally {
        saveGithubBtn.disabled = false;
        saveGithubBtn.textContent = '📤 Commit to GitHub';
    }
}

function showAlert(message, type) {
    if (typeof window.showAlert === 'function') {
        window.showAlert(message, type);
    } else {
        alert(message);
    }
}
