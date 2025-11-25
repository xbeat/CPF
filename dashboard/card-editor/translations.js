// ============================================
// CPF CARD EDITOR - TRANSLATIONS (EN/IT)
// ============================================

const cardEditorTranslations = {
	en: {
		// Meta tags
		'meta.title': 'CPF Card Editor - Interactive Indicator Cards',
		'meta.description': 'Edit and manage CPF indicator cards for the Auditor Field Kit',

		// Header
		'header.back': '← Back to Dashboard',
		'header.title': '📝 CPF Card Editor',
		'header.subtitle': 'Edit Interactive Indicator Cards (Auditor Field Kit)',

		// Status
		'status.local': 'Local Mode',
		'status.github': 'GitHub Connected',

		// Buttons
		'button.load-json': '📂 Load JSON',
		'button.save-local': '💾 Save Local',
		'button.save-github': '📤 Commit to GitHub',

		// Sidebar
		'sidebar.title': 'Cards',
		'sidebar.search': '🔍 Search cards...',
		'sidebar.filter.all': 'All Categories',
		'sidebar.loading': 'Loading cards...',

		// Categories
		'category.1': '1.x Authority',
		'category.2': '2.x Temporal',
		'category.3': '3.x Social',
		'category.4': '4.x Affective',
		'category.5': '5.x Cognitive',
		'category.6': '6.x Group',
		'category.7': '7.x Stress',
		'category.8': '8.x Unconscious',
		'category.9': '9.x AI',
		'category.10': '10.x Convergent',

		// Empty State
		'empty.title': 'Select a Card to Edit',
		'empty.subtitle': 'Choose a card from the sidebar to begin editing',

		// Tabs
		'tab.edit': '✏️ Edit',
		'tab.preview': '👁️ Preview',
		'tab.json': '{ } Raw JSON',

		// JSON Editor
		'json.search': 'Search in JSON...',
		'json.prev': 'Previous match',
		'json.next': 'Next match',
		'json.clear': 'Clear search',
		'json.format': 'Format JSON',
		'json.apply': 'Apply Changes',

		// Common
		'common.loading': 'Loading...',
		'common.cancel': 'Cancel',
		'common.save': 'Save',
		'common.close': 'Close'
	},
	it: {
		// Meta tags
		'meta.title': 'CPF Card Editor - Schede Indicatori Interattive',
		'meta.description': 'Modifica e gestisci le schede indicatori CPF per il Field Kit Auditor',

		// Header
		'header.back': '← Torna alla Dashboard',
		'header.title': '📝 CPF Card Editor',
		'header.subtitle': 'Modifica Schede Indicatori Interattive (Field Kit Auditor)',

		// Status
		'status.local': 'Modalità Locale',
		'status.github': 'GitHub Connesso',

		// Buttons
		'button.load-json': '📂 Carica JSON',
		'button.save-local': '💾 Salva Locale',
		'button.save-github': '📤 Commit su GitHub',

		// Sidebar
		'sidebar.title': 'Schede',
		'sidebar.search': '🔍 Cerca schede...',
		'sidebar.filter.all': 'Tutte le Categorie',
		'sidebar.loading': 'Caricamento schede...',

		// Categories
		'category.1': '1.x Authority',
		'category.2': '2.x Temporal',
		'category.3': '3.x Social',
		'category.4': '4.x Affective',
		'category.5': '5.x Cognitive',
		'category.6': '6.x Group',
		'category.7': '7.x Stress',
		'category.8': '8.x Unconscious',
		'category.9': '9.x AI',
		'category.10': '10.x Convergent',

		// Empty State
		'empty.title': 'Seleziona una Scheda da Modificare',
		'empty.subtitle': 'Scegli una scheda dalla sidebar per iniziare la modifica',

		// Tabs
		'tab.edit': '✏️ Modifica',
		'tab.preview': '👁️ Anteprima',
		'tab.json': '{ } JSON Grezzo',

		// JSON Editor
		'json.search': 'Cerca in JSON...',
		'json.prev': 'Risultato precedente',
		'json.next': 'Risultato successivo',
		'json.clear': 'Cancella ricerca',
		'json.format': 'Formatta JSON',
		'json.apply': 'Applica Modifiche',

		// Common
		'common.loading': 'Caricamento...',
		'common.cancel': 'Annulla',
		'common.save': 'Salva',
		'common.close': 'Chiudi'
	}
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
	module.exports = { cardEditorTranslations };
}
