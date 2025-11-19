document.addEventListener('DOMContentLoaded', () => {
    const cardList = document.getElementById('card-list');
    const cardEditorForm = document.getElementById('card-editor-form');
    const cardPreview = document.getElementById('card-preview');
    const saveButton = document.getElementById('save-button');
    let currentCardPath = null;

    async function fetchCards() {
        try {
            const response = await fetch('/api/cards');
            if (!response.ok) {
                throw new Error('Failed to load cards. Is the server configured for GitHub access?');
            }
            const cards = await response.json();
            renderCardList(cards);
        } catch (error) {
            cardList.innerHTML = `<p style="color: red;">${error.message}</p>`;
        }
    }

    function renderCardList(cards) {
        const ul = document.createElement('ul');
        cards.forEach(cardPath => {
            const li = document.createElement('li');
            li.textContent = cardPath.split('/').slice(-3).join('/'); // Show last 3 parts of path
            li.dataset.path = cardPath;
            li.addEventListener('click', () => loadCard(cardPath));
            ul.appendChild(li);
        });
        cardList.innerHTML = '';
        cardList.appendChild(ul);
    }

    async function loadCard(cardPath) {
        currentCardPath = cardPath;
        try {
            const response = await fetch(`/api/cards/contents?path=${encodeURIComponent(cardPath)}`);
            if (!response.ok) {
                throw new Error('Failed to load card content.');
            }
            const cardData = await response.json();
            renderEditor(cardData);
            renderPreview(cardData);
            saveButton.disabled = false;
        } catch (error) {
            cardEditorForm.innerHTML = `<p style="color: red;">${error.message}</p>`;
        }
    }

    function renderEditor(cardData) {
        cardEditorForm.innerHTML = '';
        for (const key in cardData) {
            const value = cardData[key];
            const formGroup = document.createElement('div');
            const label = document.createElement('label');
            label.textContent = key;
            formGroup.appendChild(label);

            if (Array.isArray(value)) {
                const arrayContainer = document.createElement('div');
                arrayContainer.id = `array-${key}`;
                value.forEach((item) => {
                    createArrayItem(arrayContainer, item);
                });
                const addButton = document.createElement('button');
                addButton.textContent = 'Add';
                addButton.type = 'button';
                addButton.addEventListener('click', () => {
                    createArrayItem(arrayContainer, '');
                });
                formGroup.appendChild(arrayContainer);
                formGroup.appendChild(addButton);
            } else {
                const input = document.createElement('input');
                input.type = 'text';
                input.value = value;
                input.dataset.key = key;
                input.addEventListener('input', updatePreview);
                formGroup.appendChild(input);
            }
            cardEditorForm.appendChild(formGroup);
        }
    }
    
    function createArrayItem(container, value) {
        const arrayItem = document.createElement('div');
        const input = document.createElement('input');
        input.type = 'text';
        input.value = value;
        input.addEventListener('input', updatePreview);
    
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.type = 'button';
        removeButton.addEventListener('click', () => {
            arrayItem.remove();
            updatePreview();
        });
    
        arrayItem.appendChild(input);
        arrayItem.appendChild(removeButton);
        container.appendChild(arrayItem);
    }

    function getEditorData() {
        const cardData = {};
        const inputs = cardEditorForm.querySelectorAll('input[data-key]');
        inputs.forEach(input => {
            cardData[input.dataset.key] = input.value;
        });

        const arrayContainers = cardEditorForm.querySelectorAll('div[id^="array-"]');
        arrayContainers.forEach(container => {
            const key = container.id.substring(6); // "array-".length
            const values = [];
            container.querySelectorAll('input').forEach(input => {
                values.push(input.value);
            });
            cardData[key] = values;
        });
        return cardData;
    }

    function updatePreview() {
        const cardData = getEditorData();
        renderPreview(cardData);
    }

    function renderPreview(cardData) {
        cardPreview.innerHTML = `<h3>${cardData.title || ''}</h3><p>${cardData.description || ''}</p>`;
        if (cardData.questions && Array.isArray(cardData.questions)) {
            const ul = document.createElement('ul');
            cardData.questions.forEach(question => {
                const li = document.createElement('li');
                li.textContent = question;
                ul.appendChild(li);
            });
            cardPreview.appendChild(ul);
        }
    }

    async function saveChanges() {
        if (!currentCardPath) return;

        const user = prompt("Please enter your name or identifier for this proposal:", "editor");
        if (!user) return; // User cancelled

        saveButton.disabled = true;
        saveButton.textContent = 'Saving...';

        const newContent = getEditorData();

        try {
            const response = await fetch('/api/cards/propose', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    originalPath: currentCardPath, 
                    newContent: newContent, 
                    user: user 
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to save changes.');
            }

            alert(`Success! A new branch named '${result.branch}' has been created with your proposed changes.`);
            
            // Reset editor state
            cardEditorForm.innerHTML = '<p>Select a card to edit.</p>';
            cardPreview.innerHTML = '';
            currentCardPath = null;

        } catch (error) {
            alert(`Error saving changes: ${error.message}`);
        } finally {
            saveButton.disabled = false;
            saveButton.textContent = 'Save';
        }
    }

    saveButton.addEventListener('click', saveChanges);
    saveButton.disabled = true; // Disabled until a card is loaded

    // Initial load
    fetchCards();
});
