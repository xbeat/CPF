// CPF Card Editor - Local Mode with Optional GitHub Integration
// This editor works standalone (local save) and can optionally push to GitHub

// State
let cards = [];
let currentCard = null;
let currentCardPath = null;
let githubEnabled = false;

// LocalStorage key for persisting local cards
const LOCAL_CARDS_STORAGE_KEY = 'cpf_card_editor_local_cards';

// ==================== LocalStorage Functions ====================

/**
 * Save local cards to localStorage
 * Only saves cards that were loaded from local files (have 'isLocal' flag)
 */
function saveCardsToLocalStorage() {
    const localCards = cards.filter(card => card.isLocal);
    const cardsToSave = localCards.map(card => ({
        path: card.path,
        id: card.id,
        category: card.category,
        language: card.language,
        data: card.data,
        isLocal: true
    }));
    localStorage.setItem(LOCAL_CARDS_STORAGE_KEY, JSON.stringify(cardsToSave));
}

/**
 * Load local cards from localStorage
 * @returns {Array} Array of card objects
 */
function loadCardsFromLocalStorage() {
    try {
        const stored = localStorage.getItem(LOCAL_CARDS_STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error('Error loading cards from localStorage:', error);
    }
    return [];
}

/**
 * Remove a specific card from storage and memory
 * @param {string} cardId - The ID of the card to remove
 */
function removeCardFromStorage(cardId) {
    const index = cards.findIndex(c => c.id === cardId);
    if (index !== -1) {
        cards.splice(index, 1);
        saveCardsToLocalStorage();

        // If removed card was current, clear editor
        if (currentCard && currentCard.id === cardId) {
            currentCard = null;
            currentCardPath = null;
            emptyState.style.display = 'flex';
            editorSection.classList.add('hidden');
        }
    }
}

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

    // JSON search functionality
    const jsonSearchInput = document.getElementById('jsonSearchInput');
    const jsonSearchPrev = document.getElementById('jsonSearchPrev');
    const jsonSearchNext = document.getElementById('jsonSearchNext');
    const jsonSearchClear = document.getElementById('jsonSearchClear');

    jsonSearchInput.addEventListener('input', handleJSONSearch);
    jsonSearchPrev.addEventListener('click', () => navigateJSONSearch('prev'));
    jsonSearchNext.addEventListener('click', () => navigateJSONSearch('next'));
    jsonSearchClear.addEventListener('click', clearJSONSearch);
}

async function checkGitHubStatus() {
    try {
        const response = await fetch('/api/github/status');
        if (response.ok) {
            githubEnabled = true;
            statusIcon.textContent = '🔗';
            statusText.textContent = 'GitHub Connected';
            saveGithubBtn.style.display = 'inline-flex';
            githubStatus.style.background = 'rgba(34, 197, 94, 0.3)';
        }
    } catch (error) {
        // GitHub not available, keep local mode
        githubEnabled = true;
        statusIcon.textContent = '⚠️';
        statusText.textContent = 'GitHub Not Connected';
        saveGithubBtn.style.display = 'inline-flex';
        githubStatus.style.background = 'rgba(255, 0, 0, 0.81)';
        console.log('GitHub integration not available, using local mode');
    }
}

async function loadCards() {
    cardList.innerHTML = '<div class="loading"><div class="loading-spinner"></div><div>Loading cards...</div></div>';

    // First, load any previously saved local cards from localStorage
    const savedLocalCards = loadCardsFromLocalStorage();
    if (savedLocalCards.length > 0) {
        cards = [...savedLocalCards];
    }

    try {
        // Try to load from GitHub first if enabled
        if (githubEnabled) {
            const response = await fetch('/api/cards');
            if (response.ok) {
                const cardPaths = await response.json();
                const githubCards = cardPaths.map(path => ({
                    path: path,
                    id: path.split('/').pop().replace('.json', ''),
                    category: path.split('/')[3], // e.g., "1.x-authority"
                    language: path.includes('/en-US/') ? 'en-US' : 'it-IT',
                    isLocal: false
                }));
                // Merge GitHub cards with local cards (local cards take precedence)
                const localCardIds = cards.map(c => c.id);
                const newGithubCards = githubCards.filter(gc => !localCardIds.includes(gc.id));
                cards = [...cards, ...newGithubCards];
                renderCardList();
                return;
            }
        }

        // If we have local cards from localStorage, show them
        if (cards.length > 0) {
            renderCardList();
            return;
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
        // Even on error, show local cards if available
        if (cards.length > 0) {
            renderCardList();
        }
        showAlert('Error loading cards: ' + error.message, 'error');
    }
}

function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    // Keep existing local cards, don't reset
    const existingLocalCards = cards.filter(c => c.isLocal);
    cards = [...existingLocalCards];

    let loadedCount = 0;
    files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                // IMPORTANT: Don't validate id/title here - accept any valid JSON
                // The editor can work with any card structure
                // Use data.indicator or data.id or fallback to filename
                const cardId = data.indicator || data.id || file.name.replace('.json', '');

                // Check if card already exists
                const existingIndex = cards.findIndex(c => c.id === cardId);
                const newCard = {
                    path: file.name,
                    id: cardId,
                    category: data.category || 'Unknown',
                    language: data.language || 'en-US',
                    data: data,
                    isLocal: true // Mark as local card
                };

                if (existingIndex >= 0) {
                    cards[existingIndex] = newCard;
                } else {
                    cards.push(newCard);
                }

                loadedCount++;
                if (loadedCount === files.length) {
                    saveCardsToLocalStorage(); // Persist to localStorage
                    renderCardList();
                }
            } catch (error) {
                loadedCount++;
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
            <div class="card-list-item-content">
                <div class="card-list-item-title">${card.id}</div>
                <div class="card-list-item-subtitle">
                    ${card.category || 'Unknown'}
                    ${card.isLocal ? '<span class="local-badge">LOCAL</span>' : ''}
                </div>
            </div>
            ${card.isLocal ? `
                <button class="card-delete-btn" data-card-id="${card.id}" title="Remove card">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            ` : ''}
        </div>
    `).join('');

    cardList.innerHTML = html;

    // Add click listeners for card selection
    document.querySelectorAll('.card-list-item').forEach(item => {
        item.addEventListener('click', (e) => {
            // Don't trigger if clicking delete button
            if (e.target.closest('.card-delete-btn')) return;
            loadCard(item.dataset.cardId);
        });
    });

    // Add click listeners for delete buttons
    document.querySelectorAll('.card-delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const cardId = btn.dataset.cardId;
            if (confirm(`Remove "${cardId}" from the list?`)) {
                removeCardFromStorage(cardId);
                renderCardList();
                showAlert(`Card "${cardId}" removed`, 'success');
            }
        });
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
            <div class="card-list-item-content">
                <div class="card-list-item-title">${card.id}</div>
                <div class="card-list-item-subtitle">
                    ${card.category || 'Unknown'}
                    ${card.isLocal ? '<span class="local-badge">LOCAL</span>' : ''}
                </div>
            </div>
            ${card.isLocal ? `
                <button class="card-delete-btn" data-card-id="${card.id}" title="Remove card">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            ` : ''}
        </div>
    `).join('');

    cardList.innerHTML = html;

    // Add click listeners for card selection
    document.querySelectorAll('.card-list-item').forEach(item => {
        item.addEventListener('click', (e) => {
            // Don't trigger if clicking delete button
            if (e.target.closest('.card-delete-btn')) return;
            loadCard(item.dataset.cardId);
        });
    });

    // Add click listeners for delete buttons
    document.querySelectorAll('.card-delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const cardId = btn.dataset.cardId;
            if (confirm(`Remove "${cardId}" from the list?`)) {
                removeCardFromStorage(cardId);
                filterCards(); // Re-apply filters after removal
                showAlert(`Card "${cardId}" removed`, 'success');
            }
        });
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

function renderSection(section, sectionIndex, isPreview = false) {
    const isQuickAssessment = section.type === 'radio-questions';
    const isConversation = section.type === 'conversation';

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
            html += renderSectionItem(item, sectionIndex, itemIndex, isPreview);
        });

        // Add "Add Question" button for quick-assessment (not in preview)
        if (isQuickAssessment && !isPreview) {
            html += `
                <button onclick="addAssessmentQuestion(${sectionIndex})" class="add-btn" style="width: 100%; margin-top: 10px; padding: 12px; background: #10b981; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.3s;">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="20" height="20" rx="4" fill="white" fill-opacity="0.2"/>
                        <path d="M10 5V15M5 10H15" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    Add Question
                </button>
            `;
        }
    }

    // Render subsections (for client-conversation)
    if (section.subsections && Array.isArray(section.subsections)) {
        section.subsections.forEach((subsection, subIndex) => {
            html += renderSubsection(subsection, sectionIndex, subIndex, isPreview);
        });

        // Add "Add Subsection" button for client-conversation (not in preview)
        if (isConversation && !isPreview) {
            html += `
                <button onclick="addConversationSubsection(${sectionIndex})" class="add-btn" style="width: 100%; margin-top: 10px; padding: 12px; background: #10b981; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.3s;">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="20" height="20" rx="4" fill="white" fill-opacity="0.2"/>
                        <path d="M10 5V15M5 10H15" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    Add Subsection Block
                </button>
            `;
        }
    }

    html += `</div>`;
    return html;
}

function renderSectionItem(item, sectionIndex, itemIndex, isPreview = false) {
    const readonlyAttr = isPreview ? 'readonly' : '';
    const readonlyStyle = isPreview ? 'background: #f9fafb; cursor: default;' : '';

    let html = `
        <div class="question-card" style="background: white; border: 2px solid #e5e7eb; padding: 20px; border-radius: 12px; margin-bottom: 20px; position: relative; box-shadow: 0 2px 4px rgba(0,0,0,0.05); transition: all 0.3s;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <label style="font-weight: 700; margin: 0; color: var(--primary); font-size: 16px;">Question ${item.number || itemIndex + 1}</label>`;

    if (!isPreview) {
        html += `
                <button onclick="removeQuestion(${sectionIndex}, ${itemIndex})" class="remove-btn"
                    style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 6px; transition: all 0.3s;">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="16" height="16" rx="3" fill="white" fill-opacity="0.2"/>
                        <path d="M4 4L12 12M12 4L4 12" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    Remove
                </button>`;
    }

    html += `
            </div>

            <label style="display: block; font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 6px;">Title</label>
            <input type="text"
                data-section="${sectionIndex}"
                data-item="${itemIndex}"
                data-field="title"
                value="${escapeHtml(item.title || '')}"
                ${readonlyAttr}
                style="width: 100%; margin-bottom: 14px; padding: 10px 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; transition: border-color 0.3s; ${readonlyStyle}"
                onfocus="this.style.borderColor='var(--primary)'"
                onblur="this.style.borderColor='#e5e7eb'"
            />

            <label style="display: block; font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 6px;">Question Text</label>
            <textarea
                data-section="${sectionIndex}"
                data-item="${itemIndex}"
                data-field="question"
                rows="3"
                ${readonlyAttr}
                style="width: 100%; margin-bottom: 14px; padding: 10px 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; transition: border-color 0.3s; ${readonlyStyle}"
                onfocus="this.style.borderColor='var(--primary)'"
                onblur="this.style.borderColor='#e5e7eb'"
            >${escapeHtml(item.question || '')}</textarea>
    `;

    // Render options for radio-list
    if (item.type === 'radio-list' && item.options && Array.isArray(item.options)) {
        html += `<div style="margin: 16px 0 12px 0; padding-bottom: 8px; border-bottom: 2px solid #f3f4f6;"><strong style="font-size: 14px; color: var(--text);">Options</strong></div>`;
        item.options.forEach((option, optIndex) => {
            html += `
                <div class="option-item" style="background: #f9fafb; padding: 12px; margin: 10px 0; border-radius: 8px; border: 1px solid #e5e7eb; display: flex; gap: 10px; align-items: start; transition: all 0.3s;">
                    <div style="flex: 1;">
                        <label style="font-size: 13px; color: var(--text-light); font-weight: 600; display: block; margin-bottom: 6px;">Option ${optIndex + 1} <span style="color: var(--primary);">(Score: ${option.score || 0})</span></label>
                        <textarea
                            data-section="${sectionIndex}"
                            data-item="${itemIndex}"
                            data-option="${optIndex}"
                            data-field="label"
                            rows="2"
                            ${readonlyAttr}
                            style="width: 100%; padding: 8px 10px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 13px; transition: border-color 0.3s; ${readonlyStyle}"
                            onfocus="this.style.borderColor='var(--primary)'"
                            onblur="this.style.borderColor='#e5e7eb'"
                        >${escapeHtml(option.label || '')}</textarea>
                    </div>`;

            if (!isPreview) {
                html += `
                    <button onclick="removeOption(${sectionIndex}, ${itemIndex}, ${optIndex})" class="remove-btn-small"
                        style="background: #ef4444; color: white; border: none; padding: 8px; border-radius: 6px; cursor: pointer; transition: all 0.3s; flex-shrink: 0;">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 4L12 12M12 4L4 12" stroke="white" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>`;
            }

            html += `
                </div>
            `;
        });

        if (!isPreview) {
            html += `
                <button onclick="addOption(${sectionIndex}, ${itemIndex})" class="add-btn-small"
                    style="margin-top: 12px; padding: 10px 16px; background: #10b981; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 6px; transition: all 0.3s;">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="16" height="16" rx="3" fill="white" fill-opacity="0.2"/>
                        <path d="M8 3V13M3 8H13" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    Add Option
                </button>
            `;
        }
    }

    html += `</div>`;
    return html;
}

function renderSubsection(subsection, sectionIndex, subIndex, isPreview = false) {
    // Detect type: conversation questions or red flags
    const isRedFlagSection = subsection.title && subsection.title.toLowerCase().includes('red flag');
    const isConversationSection = !isRedFlagSection;
    const readonlyAttr = isPreview ? 'readonly' : '';
    const readonlyStyle = isPreview ? 'background: #f9fafb; cursor: default;' : '';

    let html = `
        <div style="background: #f3f4f6; padding: 18px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
            <div style="margin-bottom: 12px;">
                <label style="display: block; font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 6px;">Subsection Title</label>
                <input type="text"
                    data-section="${sectionIndex}"
                    data-subsection="${subIndex}"
                    data-field="title"
                    value="${escapeHtml(subsection.title || '')}"
                    ${readonlyAttr}
                    style="width: 100%; padding: 10px 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 15px; font-weight: 600; transition: border-color 0.3s; ${readonlyStyle}"
                    onfocus="this.style.borderColor='var(--primary)'"
                    onblur="this.style.borderColor='#e5e7eb'"
                />
            </div>`;

    if (!isPreview) {
        html += `
            <div style="display: flex; justify-content: flex-end; align-items: center; margin-bottom: 16px;">
                <div style="display: flex; gap: 8px;">`;

        // Show only appropriate button based on section type
        if (isConversationSection) {
            html += `
                <button onclick="addSubsectionItem(${sectionIndex}, ${subIndex}, 'question')" class="add-btn-small"
                    style="padding: 8px 14px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 6px; transition: all 0.3s;">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="14" height="14" rx="2" fill="white" fill-opacity="0.2"/>
                        <path d="M7 3V11M3 7H11" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    Add Question
                </button>`;
        } else if (isRedFlagSection) {
            html += `
                <button onclick="addSubsectionItem(${sectionIndex}, ${subIndex}, 'checkbox')" class="add-btn-small"
                    style="padding: 8px 14px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 6px; transition: all 0.3s;">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="14" height="14" rx="2" fill="white" fill-opacity="0.2"/>
                        <path d="M7 3V11M3 7H11" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    Add Red Flag
                </button>`;
        }

        html += `
                </div>
            </div>
        `;
    }


    // Render items
    if (subsection.items && Array.isArray(subsection.items)) {
        subsection.items.forEach((item, itemIndex) => {
            if (item.type === 'question') {
                html += `
                    <div class="conversation-item" style="background: white; padding: 16px; border-radius: 8px; margin-bottom: 12px; border: 2px solid #e5e7eb; transition: all 0.3s;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <label style="font-weight: 700; font-size: 14px; margin: 0; color: var(--primary);">Question ID</label>`;

                if (!isPreview) {
                    html += `
                            <button onclick="removeSubsectionItem(${sectionIndex}, ${subIndex}, ${itemIndex})" class="remove-btn-small"
                                style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 4px; transition: all 0.3s;">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 3L11 11M11 3L3 11" stroke="white" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                                Remove
                            </button>`;
                }

                html += `
                        </div>
                        <input type="text"
                            data-section="${sectionIndex}"
                            data-subsection="${subIndex}"
                            data-item="${itemIndex}"
                            data-field="id"
                            value="${escapeHtml(item.id || '')}"
                            ${readonlyAttr}
                            style="width: 100%; margin-bottom: 10px; padding: 8px 10px; border: 2px solid #e5e7eb; border-radius: 6px; font-size: 13px; font-weight: 600; transition: border-color 0.3s; ${readonlyStyle}"
                            onfocus="this.style.borderColor='var(--primary)'"
                            onblur="this.style.borderColor='#e5e7eb'"
                        />
                        <label style="display: block; font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 6px;">Question Text</label>
                        <textarea
                            data-section="${sectionIndex}"
                            data-subsection="${subIndex}"
                            data-item="${itemIndex}"
                            data-field="text"
                            rows="3"
                            ${readonlyAttr}
                            style="width: 100%; padding: 10px; border: 2px solid #e5e7eb; border-radius: 6px; font-size: 14px; transition: border-color 0.3s; ${readonlyStyle}"
                            onfocus="this.style.borderColor='var(--primary)'"
                            onblur="this.style.borderColor='#e5e7eb'"
                        >${escapeHtml(item.text || '')}</textarea>
                    </div>
                `;
            } else if (item.type === 'checkbox') {
                // Red flag
                html += `
                    <div class="red-flag-item" style="background: #fef2f2; padding: 16px; border-radius: 8px; margin-bottom: 12px; border: 2px solid #fca5a5; border-left: 4px solid #ef4444; transition: all 0.3s;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <label style="font-weight: 700; font-size: 14px; margin: 0; color: #dc2626; display: flex; align-items: center; gap: 6px;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 15L12 3L20 15L4 15Z" fill="#dc2626"/>
                                    <circle cx="12" cy="19" r="2" fill="#dc2626"/>
                                </svg>
                                Red Flag ID
                            </label>`;

                if (!isPreview) {
                    html += `
                            <button onclick="removeSubsectionItem(${sectionIndex}, ${subIndex}, ${itemIndex})" class="remove-btn-small"
                                style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 4px; transition: all 0.3s;">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 3L11 11M11 3L3 11" stroke="white" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                                Remove
                            </button>`;
                }

                html += `
                        </div>
                        <input type="text"
                            data-section="${sectionIndex}"
                            data-subsection="${subIndex}"
                            data-item="${itemIndex}"
                            data-field="id"
                            value="${escapeHtml(item.id || '')}"
                            ${readonlyAttr}
                            style="width: 100%; margin-bottom: 10px; padding: 8px 10px; border: 2px solid #fca5a5; border-radius: 6px; font-size: 13px; font-weight: 600; transition: border-color 0.3s; ${readonlyStyle}"
                            onfocus="this.style.borderColor='#dc2626'"
                            onblur="this.style.borderColor='#fca5a5'"
                        />
                        <label style="display: block; font-size: 13px; font-weight: 600; color: #dc2626; margin-bottom: 6px;">Description</label>
                        <textarea
                            data-section="${sectionIndex}"
                            data-subsection="${subIndex}"
                            data-item="${itemIndex}"
                            data-field="label"
                            rows="2"
                            ${readonlyAttr}
                            style="width: 100%; padding: 10px; border: 2px solid #fca5a5; border-radius: 6px; font-size: 14px; transition: border-color 0.3s; ${readonlyStyle}"
                            onfocus="this.style.borderColor='#dc2626'"
                            onblur="this.style.borderColor='#fca5a5'"
                        >${escapeHtml(item.label || '')}</textarea>
                        <div style="margin-top: 10px; padding: 8px; background: white; border-radius: 6px; font-size: 12px; color: #6b7280; display: flex; gap: 16px;">
                            <span><strong>Severity:</strong> <span style="color: #dc2626; font-weight: 600;">${item.severity || 'N/A'}</span></span>
                            <span><strong>Score Impact:</strong> <span style="color: #dc2626; font-weight: 600;">${item.score_impact || 0}</span></span>
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
    const inputs = cardEditorForm.querySelectorAll('textarea[data-section], input[data-section]');

    inputs.forEach(input => {
        const sectionIdx = parseInt(input.dataset.section);
        const field = input.dataset.field;
        const value = input.value;

        if (!currentCard.data.sections[sectionIdx]) return;

        // Handle quick-assessment items
        if (input.dataset.item !== undefined && input.dataset.subsection === undefined) {
            const itemIdx = parseInt(input.dataset.item);
            const section = currentCard.data.sections[sectionIdx];

            if (section.items && section.items[itemIdx]) {
                if (input.dataset.option !== undefined) {
                    // Update option label
                    const optionIdx = parseInt(input.dataset.option);
                    if (section.items[itemIdx].options && section.items[itemIdx].options[optionIdx]) {
                        section.items[itemIdx].options[optionIdx][field] = value;
                    }
                } else {
                    // Update question (title or question text)
                    section.items[itemIdx][field] = value;
                }
            }
        }

        // Handle conversation subsection items and titles
        if (input.dataset.subsection !== undefined) {
            const subIdx = parseInt(input.dataset.subsection);
            const section = currentCard.data.sections[sectionIdx];

            if (section.subsections && section.subsections[subIdx]) {
                const subsection = section.subsections[subIdx];

                // If no item specified, it's the subsection title
                if (input.dataset.item === undefined) {
                    subsection[field] = value;
                } else {
                    // Otherwise it's an item within the subsection
                    const itemIdx = parseInt(input.dataset.item);
                    if (subsection.items && subsection.items[itemIdx]) {
                        subsection.items[itemIdx][field] = value;
                    }
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
        <div style="padding: 10px;">
            <h2 style="color: var(--primary); margin-bottom: 8px;">${cardData.indicator || ''} - ${cardData.title || 'Untitled'}</h2>
            <p><span class="badge">${cardData.category || 'Unknown Category'}</span></p>
    `;

    // Render sections using same structure as editor but in preview mode
    if (cardData.sections && Array.isArray(cardData.sections)) {
        cardData.sections.forEach((section, sectionIndex) => {
            html += renderSection(section, sectionIndex, true); // true = preview mode
        });
    }

    html += `</div>`;
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

// JSON Search Functionality
let jsonSearchMatches = [];
let currentMatchIndex = -1;

function handleJSONSearch() {
    const searchInput = document.getElementById('jsonSearchInput');
    const searchText = searchInput.value.toLowerCase();
    const jsonText = jsonEditor.value;
    const countDisplay = document.getElementById('jsonSearchCount');

    // Clear previous highlights
    jsonSearchMatches = [];
    currentMatchIndex = -1;

    if (!searchText) {
        countDisplay.textContent = '';
        return;
    }

    // Find all matches
    let index = 0;
    const lowerJson = jsonText.toLowerCase();
    while ((index = lowerJson.indexOf(searchText, index)) !== -1) {
        jsonSearchMatches.push(index);
        index += searchText.length;
    }

    if (jsonSearchMatches.length > 0) {
        currentMatchIndex = 0;
        countDisplay.textContent = `${currentMatchIndex + 1} / ${jsonSearchMatches.length}`;
        highlightMatch();
    } else {
        countDisplay.textContent = 'No matches';
    }
}

function navigateJSONSearch(direction) {
    if (jsonSearchMatches.length === 0) return;

    if (direction === 'next') {
        currentMatchIndex = (currentMatchIndex + 1) % jsonSearchMatches.length;
    } else {
        currentMatchIndex = (currentMatchIndex - 1 + jsonSearchMatches.length) % jsonSearchMatches.length;
    }

    const countDisplay = document.getElementById('jsonSearchCount');
    countDisplay.textContent = `${currentMatchIndex + 1} / ${jsonSearchMatches.length}`;
    highlightMatch();
}

function highlightMatch() {
    if (currentMatchIndex === -1 || jsonSearchMatches.length === 0) return;

    const matchPosition = jsonSearchMatches[currentMatchIndex];
    const searchInput = document.getElementById('jsonSearchInput');
    const searchLength = searchInput.value.length;

    // Set selection to highlight the match
    jsonEditor.focus();
    jsonEditor.setSelectionRange(matchPosition, matchPosition + searchLength);

    // Scroll to make the selection visible
    const lineHeight = 20; // Approximate line height
    const charsBeforeMatch = jsonEditor.value.substring(0, matchPosition);
    const lineNumber = charsBeforeMatch.split('\n').length - 1;
    const scrollPosition = lineNumber * lineHeight;
    jsonEditor.scrollTop = scrollPosition - (jsonEditor.clientHeight / 2);
}

function clearJSONSearch() {
    document.getElementById('jsonSearchInput').value = '';
    document.getElementById('jsonSearchCount').textContent = '';
    jsonSearchMatches = [];
    currentMatchIndex = -1;
}

// Load JSON file from local computer
async function handleFileLoad(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
        const text = await file.text();
        const data = JSON.parse(text);

        // Use indicator or id or filename as card ID
        const cardId = data.indicator || data.id || file.name.replace('.json', '');

        // Create a card object
        const loadedCard = {
            id: cardId,
            path: file.name,
            data: data,
            category: data.category || 'unknown',
            language: data.language || 'en-US',
            isLocal: true // Mark as local card
        };

        // Add to cards list if not already there
        const existingIndex = cards.findIndex(c => c.id === loadedCard.id);
        if (existingIndex >= 0) {
            cards[existingIndex] = loadedCard;
        } else {
            cards.push(loadedCard);
        }

        // Persist to localStorage
        saveCardsToLocalStorage();

        // Render card list and select the loaded card
        renderCardList();
        loadCard(loadedCard.id);

        showAlert(`Loaded card: ${data.title || cardId}`, 'success');
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

// Add/Remove handlers
window.addAssessmentQuestion = function(sectionIndex) {
    if (!currentCard || !currentCard.data) return;
    const section = currentCard.data.sections[sectionIndex];
    if (section && section.items) {
        const newQuestion = {
            number: section.items.length + 1,
            title: "New Question Title",
            question: "Enter your question here...",
            type: "radio-list",
            options: [
                { value: "option_1", score: 1.0, label: "Excellent option" },
                { value: "option_2", score: 0.5, label: "Good option" },
                { value: "option_3", score: 0.0, label: "Poor option" }
            ]
        };
        section.items.push(newQuestion);
        renderEditor(currentCard.data);
        renderPreview(currentCard.data);
        jsonEditor.value = JSON.stringify(currentCard.data, null, 2);

        // Scroll to new question with animation
        setTimeout(() => {
            const newCards = document.querySelectorAll('.question-card');
            if (newCards.length > 0) {
                newCards[newCards.length - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
                newCards[newCards.length - 1].style.animation = 'slideIn 0.5s ease-out';
            }
        }, 100);
    }
};

window.removeQuestion = function(sectionIndex, itemIndex) {
    if (!currentCard || !currentCard.data) return;
    const section = currentCard.data.sections[sectionIndex];
    if (section && section.items) {
        if (confirm(`Remove question ${itemIndex + 1}?`)) {
            const cards = document.querySelectorAll('.question-card');
            if (cards[itemIndex]) {
                cards[itemIndex].style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => {
                    section.items.splice(itemIndex, 1);
                    renderEditor(currentCard.data);
                    renderPreview(currentCard.data);
                    jsonEditor.value = JSON.stringify(currentCard.data, null, 2);
                }, 300);
            }
        }
    }
};

window.addOption = function(sectionIndex, itemIndex) {
    if (!currentCard || !currentCard.data) return;
    const section = currentCard.data.sections[sectionIndex];
    if (section && section.items && section.items[itemIndex]) {
        const item = section.items[itemIndex];
        if (!item.options) item.options = [];
        item.options.push({
            value: `option_${item.options.length + 1}`,
            score: 0.5,
            label: "New option - edit me"
        });
        renderEditor(currentCard.data);
        renderPreview(currentCard.data);
        jsonEditor.value = JSON.stringify(currentCard.data, null, 2);
    }
};

window.removeOption = function(sectionIndex, itemIndex, optionIndex) {
    if (!currentCard || !currentCard.data) return;
    const section = currentCard.data.sections[sectionIndex];
    if (section && section.items && section.items[itemIndex]) {
        const item = section.items[itemIndex];
        if (item.options && confirm(`Remove option ${optionIndex + 1}?`)) {
            item.options.splice(optionIndex, 1);
            renderEditor(currentCard.data);
            renderPreview(currentCard.data);
            jsonEditor.value = JSON.stringify(currentCard.data, null, 2);
        }
    }
};

window.addConversationSubsection = function(sectionIndex) {
    if (!currentCard || !currentCard.data) return;
    const section = currentCard.data.sections[sectionIndex];
    if (section && section.subsections) {
        const newSubsection = {
            title: "New Subsection - edit title",
            items: [
                {
                    type: 'question',
                    id: 'conv_q_new',
                    text: 'New question - edit me',
                    scoring_guidance: {
                        green: '',
                        yellow: '',
                        red: ''
                    },
                    followups: []
                }
            ]
        };
        section.subsections.push(newSubsection);
        renderEditor(currentCard.data);
        renderPreview(currentCard.data);
        jsonEditor.value = JSON.stringify(currentCard.data, null, 2);

        // Scroll to new subsection with animation
        setTimeout(() => {
            const subsections = document.querySelectorAll('.form-section[data-section-index="' + sectionIndex + '"] > div[style*="background: #f3f4f6"]');
            if (subsections.length > 0) {
                const lastSubsection = subsections[subsections.length - 1];
                lastSubsection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                lastSubsection.style.animation = 'slideIn 0.5s ease-out';
            }
        }, 100);
    }
};

window.addSubsectionItem = function(sectionIndex, subIndex, type) {
    if (!currentCard || !currentCard.data) return;
    const section = currentCard.data.sections[sectionIndex];
    if (section && section.subsections && section.subsections[subIndex]) {
        const subsection = section.subsections[subIndex];
        if (!subsection.items) subsection.items = [];

        const newItem = type === 'question' ? {
            type: 'question',
            id: `conv_q${subsection.items.filter(i => i.type === 'question').length + 1}`,
            text: 'New question - edit me',
            scoring_guidance: {
                green: '',
                yellow: '',
                red: ''
            },
            followups: []
        } : {
            type: 'checkbox',
            id: `red_flag_${subsection.items.filter(i => i.type === 'checkbox').length + 1}`,
            label: 'New red flag - edit me',
            severity: 'medium',
            score_impact: 0.1,
            subitems: []
        };

        subsection.items.push(newItem);
        renderEditor(currentCard.data);
        renderPreview(currentCard.data);
        jsonEditor.value = JSON.stringify(currentCard.data, null, 2);
    }
};

window.removeSubsectionItem = function(sectionIndex, subIndex, itemIndex) {
    if (!currentCard || !currentCard.data) return;
    const section = currentCard.data.sections[sectionIndex];
    if (section && section.subsections && section.subsections[subIndex]) {
        const subsection = section.subsections[subIndex];
        if (subsection.items && confirm('Remove this item?')) {
            subsection.items.splice(itemIndex, 1);
            renderEditor(currentCard.data);
            renderPreview(currentCard.data);
            jsonEditor.value = JSON.stringify(currentCard.data, null, 2);
        }
    }
};

function showAlert(message, type) {
    if (typeof window.showAlert === 'function') {
        window.showAlert(message, type);
    } else {
        alert(message);
    }
}
