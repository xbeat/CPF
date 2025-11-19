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
                cards.push({
                    path: file.name,
                    id: file.name.replace('.json', ''),
                    category: data.category || 'Unknown',
                    language: 'en-US', // Default
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
        <div class="card-list-item" data-card-id="${card.id}" onclick="loadCard('${card.id}')">
            <div class="card-list-item-title">${card.id}</div>
            <div class="card-list-item-subtitle">${card.category || 'Unknown'}</div>
        </div>
    `).join('');

    cardList.innerHTML = html;
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
        <div class="card-list-item ${currentCard && currentCard.id === card.id ? 'active' : ''}" data-card-id="${card.id}" onclick="loadCard('${card.id}')">
            <div class="card-list-item-title">${card.id}</div>
            <div class="card-list-item-subtitle">${card.category || 'Unknown'}</div>
        </div>
    `).join('');

    cardList.innerHTML = html;
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
    const sections = groupFieldsBySection(cardData);
    let html = '';

    for (const [sectionName, fields] of Object.entries(sections)) {
        html += `<div class="form-section">`;
        html += `<div class="form-section-title">📋 ${sectionName}</div>`;

        for (const [key, value] of Object.entries(fields)) {
            html += renderFormField(key, value);
        }

        html += `</div>`;
    }

    cardEditorForm.innerHTML = html;

    // Add event listeners for inputs
    cardEditorForm.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('input', updateFromEditor);
    });
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

function updateFromEditor() {
    const updatedData = getEditorData();
    currentCard.data = updatedData;
    renderPreview(updatedData);
    jsonEditor.value = JSON.stringify(updatedData, null, 2);
}

function getEditorData() {
    const data = {};

    // Regular inputs
    cardEditorForm.querySelectorAll('input[data-key], textarea[data-key]').forEach(input => {
        try {
            const value = input.value;
            data[input.dataset.key] = input.tagName === 'TEXTAREA' && value.trim().startsWith('{') ?
                JSON.parse(value) : value;
        } catch (e) {
            data[input.dataset.key] = input.value;
        }
    });

    // Array inputs
    cardEditorForm.querySelectorAll('.array-container').forEach(container => {
        const key = container.id.replace('array-', '');
        data[key] = Array.from(container.querySelectorAll('input')).map(input => {
            try {
                return input.value.trim().startsWith('{') ? JSON.parse(input.value) : input.value;
            } catch (e) {
                return input.value;
            }
        });
    });

    return data;
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
