// ============================================
// CPF AUDITING DASHBOARD V2 - TRANSLATIONS (EN/IT)
// ============================================

const auditingV2Translations = {
	en: {
		// Meta tags
		'meta.title': 'CPF Auditing Dashboard v2.0 - Organizations & Assessment Progress',
		'meta.description': 'Manage organizations and track CPF assessment progress with risk analysis and maturity models',

		// Header
		'header.back': '← Back to Dashboard',
		'header.title': '🛡️ CPF Auditing Dashboard',
		'header.version': 'v2.0',
		'header.subtitle': 'Organizations & Assessment Progress',

		// Buttons
		'button.organizations': 'Organizations',
		'button.new-org': 'New Organization',
		'button.deleted-items': 'Deleted Items',
		'button.export-excel': 'Export Excel',
		'button.export-pdf': 'Export PDF',
		'button.export-zip': 'Export ZIP',

		// Sidebar
		'sidebar.title': 'Organizations',
		'sidebar.search': '🔍 Search organizations...',
		'sidebar.sort.date': '📅 Date Created',
		'sidebar.sort.name': '🔤 Name',
		'sidebar.sort.risk': '⚠️ Risk Score',
		'sidebar.sort.completion': '📊 Completion %',
		'sidebar.sort.updated': '🔄 Last Updated',
		'sidebar.sort.assessments': '📝 Assessments',
		'sidebar.sort.industry': '🏢 Industry',
		'sidebar.sort.country': '🌍 Country',
		'sidebar.loading': 'Loading...',

		// Empty State
		'empty.title': 'Welcome to CPF Auditing Dashboard',
		'empty.subtitle': 'Select an organization from the sidebar to view assessment progress and risk analysis',

		// Tabs
		'tab.progress': '📈 Progress Tracking',
		'tab.risk': '🔥 Risk Analysis',
		'tab.maturity': '📊 Maturity Model',
		'tab.compile': '✏️ Compile Assessment',

		// Progress Tab
		'progress.title': 'Assessment Progress Matrix',
		'progress.zoom': 'Zoom:',

		// Risk Tab
		'risk.title': 'Risk Analysis by Category',
		'risk.radar.title': '📡 Security Posture Radar',
		'risk.radar.description': 'Interactive visualization of vulnerability assessment across all categories.',
		'risk.radar.note': 'Larger area = Higher risk',
		'risk.stats.title': '📊 Quick Stats',
		'risk.priority.title': '🎯 Prioritization Matrix',
		'risk.priority.description': 'Categories ordered by priority for remediation (risk × weight + downstream impact)',

		// Prioritization Table
		'table.th.number': '#',
		'table.th.category': 'Category',
		'table.th.risk': 'Risk',
		'table.th.confidence': 'Confidence',
		'table.th.completion': 'Completion',
		'table.th.priority': 'Priority Score',
		'table.th.recommendation': 'Recommendation',

		// Maturity Tab
		'maturity.title': '📊 Organizational Maturity Model',
		'maturity.description': 'Assessment of security control maturity based on industry standards and best practices',

		// Compile Tab
		'compile.title': '✏️ Compile New Assessment',
		'compile.description': 'Select an indicator, fill in the assessment, and save to the organization\'s data.',
		'compile.step1': '1. Select Indicator',
		'compile.category': 'Category',
		'compile.indicator': 'Indicator',
		'compile.language': 'Language',
		'compile.load': '📥 Load Indicator',
		'compile.selected': 'Selected:',
		'compile.step2': '2. Fill Assessment',
		'compile.metadata': 'Assessment Metadata',
		'compile.assessor': 'Assessor Name',
		'compile.assessor.placeholder': 'Your name',
		'compile.date': 'Assessment Date',
		'compile.confidence': 'Confidence Level',
		'compile.confidence.high': 'High (0.9)',
		'compile.confidence.medium': 'Medium (0.7)',
		'compile.confidence.low': 'Low (0.5)',
		'compile.reset': '🗑️ Reset Assessment',
		'compile.save': '💾 Save to Organization',
		'compile.score': 'CPF Score:',
		'compile.confidence.label': 'Confidence:',
		'compile.empty': '👆 Select an indicator above to begin compiling an assessment',

		// Organization Modal
		'modal.org.create': 'Create New Organization',
		'modal.org.edit': 'Edit Organization',
		'modal.org.id': 'Organization ID',
		'modal.org.id.helper': 'Format: org-yourname-001 (lowercase, hyphens allowed)',
		'modal.org.name': 'Organization Name',
		'modal.org.name.placeholder': 'ACME Corporation',
		'modal.org.industry': 'Industry',
		'modal.org.industry.select': 'Select industry...',
		'modal.org.size': 'Size',
		'modal.org.size.select': 'Select size...',
		'modal.org.size.small': 'Small (<50 employees)',
		'modal.org.size.medium': 'Medium (50-500 employees)',
		'modal.org.size.enterprise': 'Enterprise (>500 employees)',
		'modal.org.country': 'Country',
		'modal.org.country.helper': 'ISO 3166-1 alpha-2 code (2 letters, e.g., US, IT, GB)',
		'modal.org.language': 'Language',
		'modal.org.sede': 'Sede Sociale',
		'modal.org.sede.placeholder': 'Via Roma 1, 00100 Roma (RM)',
		'modal.org.sede.helper': 'Indirizzo della sede legale dell\'azienda',
		'modal.org.vat': 'Partita IVA',
		'modal.org.vat.placeholder': 'IT12345678901',
		'modal.org.vat.helper': 'Numero di Partita IVA (es. IT12345678901)',
		'modal.org.notes': 'Notes',
		'modal.org.notes.placeholder': 'Additional notes about this organization...',
		'modal.org.fetch': 'Fetch all 100 indicators from GitHub (recommended for new organizations)',
		'modal.org.fetch.helper': 'This will download indicator definitions from GitHub repository and store them with the organization.',
		'modal.org.fetching': 'Fetching indicators from GitHub...',
		'modal.required': '*',

		// Industries
		'industry.technology': 'Technology',
		'industry.finance': 'Finance',
		'industry.healthcare': 'Healthcare',
		'industry.retail': 'Retail',
		'industry.education': 'Education',
		'industry.manufacturing': 'Manufacturing',
		'industry.government': 'Government',
		'industry.energy': 'Energy',
		'industry.transportation': 'Transportation',
		'industry.other': 'Other',

		// Languages
		'lang.en': 'English (US)',
		'lang.it': 'Italian (IT)',
		'lang.es': 'Spanish (ES)',
		'lang.fr': 'French (FR)',
		'lang.de': 'German (DE)',

		// Delete Modal
		'modal.delete.title': '⚠️ Delete Organization',
		'modal.delete.confirm': 'Are you sure you want to delete',
		'modal.delete.warning': 'The organization will be moved to the trash and can be restored within 30 days. After 30 days, it will be permanently deleted.',
		'modal.delete.button': 'Move to Trash',

		// Indicator Modal
		'modal.indicator.title': 'Indicator Detail',
		'modal.indicator.loading': 'Loading indicator details...',
		'modal.indicator.history': '📜 History',
		'modal.indicator.edit': '✏️ Edit Assessment',
		'modal.indicator.delete': 'Delete Assessment',

		// Assessment Details Modal
		'modal.assessment.title': 'Assessment Details',
		'modal.assessment.loading': 'Loading details...',
		'modal.assessment.delete': '🗑️ Delete',

		// Trash Modal
		'modal.trash.title': '🗑️ Trash',
		'modal.trash.empty.title': 'Trash is Empty',
		'modal.trash.empty.subtitle': 'No deleted organizations',

		// History Modal
		'modal.history.title': '📜 Version History',
		'modal.history.loading': 'Loading history...',

		// Category Modal
		'modal.category.title': 'Category',

		// Common
		'common.cancel': 'Cancel',
		'common.save': 'Save',
		'common.close': 'Close',
		'common.loading': 'Loading...'
	},
	it: {
		// Meta tags
		'meta.title': 'CPF Auditing Dashboard v2.0 - Organizzazioni e Progresso Assessment',
		'meta.description': 'Gestisci organizzazioni e monitora il progresso degli assessment CPF con analisi del rischio e modelli di maturità',

		// Header
		'header.back': '← Torna alla Dashboard',
		'header.title': '🛡️ CPF Auditing Dashboard',
		'header.version': 'v2.0',
		'header.subtitle': 'Organizzazioni e Progresso Assessment',

		// Buttons
		'button.organizations': 'Organizzazioni',
		'button.new-org': 'Nuova Organizzazione',
		'button.deleted-items': 'Elementi Eliminati',
		'button.export-excel': 'Esporta Excel',
		'button.export-pdf': 'Esporta PDF',
		'button.export-zip': 'Esporta ZIP',

		// Sidebar
		'sidebar.title': 'Organizzazioni',
		'sidebar.search': '🔍 Cerca organizzazioni...',
		'sidebar.sort.date': '📅 Data Creazione',
		'sidebar.sort.name': '🔤 Nome',
		'sidebar.sort.risk': '⚠️ Punteggio Rischio',
		'sidebar.sort.completion': '📊 Completamento %',
		'sidebar.sort.updated': '🔄 Ultimo Aggiornamento',
		'sidebar.sort.assessments': '📝 Assessment',
		'sidebar.sort.industry': '🏢 Settore',
		'sidebar.sort.country': '🌍 Paese',
		'sidebar.loading': 'Caricamento...',

		// Empty State
		'empty.title': 'Benvenuto nella CPF Auditing Dashboard',
		'empty.subtitle': 'Seleziona un\'organizzazione dalla sidebar per visualizzare il progresso dell\'assessment e l\'analisi del rischio',

		// Tabs
		'tab.progress': '📈 Monitoraggio Progresso',
		'tab.risk': '🔥 Analisi Rischio',
		'tab.maturity': '📊 Modello Maturità',
		'tab.compile': '✏️ Compila Assessment',

		// Progress Tab
		'progress.title': 'Matrice Progresso Assessment',
		'progress.zoom': 'Zoom:',

		// Risk Tab
		'risk.title': 'Analisi Rischio per Categoria',
		'risk.radar.title': '📡 Radar Postura Sicurezza',
		'risk.radar.description': 'Visualizzazione interattiva della valutazione delle vulnerabilità su tutte le categorie.',
		'risk.radar.note': 'Area maggiore = Rischio più alto',
		'risk.stats.title': '📊 Statistiche Rapide',
		'risk.priority.title': '🎯 Matrice Priorità',
		'risk.priority.description': 'Categorie ordinate per priorità di remediation (rischio × peso + impatto downstream)',

		// Prioritization Table
		'table.th.number': '#',
		'table.th.category': 'Categoria',
		'table.th.risk': 'Rischio',
		'table.th.confidence': 'Confidenza',
		'table.th.completion': 'Completamento',
		'table.th.priority': 'Punteggio Priorità',
		'table.th.recommendation': 'Raccomandazione',

		// Maturity Tab
		'maturity.title': '📊 Modello Maturità Organizzativa',
		'maturity.description': 'Valutazione della maturità dei controlli di sicurezza basata su standard e best practice del settore',

		// Compile Tab
		'compile.title': '✏️ Compila Nuovo Assessment',
		'compile.description': 'Seleziona un indicatore, compila l\'assessment e salvalo nei dati dell\'organizzazione.',
		'compile.step1': '1. Seleziona Indicatore',
		'compile.category': 'Categoria',
		'compile.indicator': 'Indicatore',
		'compile.language': 'Lingua',
		'compile.load': '📥 Carica Indicatore',
		'compile.selected': 'Selezionato:',
		'compile.step2': '2. Compila Assessment',
		'compile.metadata': 'Metadati Assessment',
		'compile.assessor': 'Nome Valutatore',
		'compile.assessor.placeholder': 'Il tuo nome',
		'compile.date': 'Data Assessment',
		'compile.confidence': 'Livello Confidenza',
		'compile.confidence.high': 'Alto (0.9)',
		'compile.confidence.medium': 'Medio (0.7)',
		'compile.confidence.low': 'Basso (0.5)',
		'compile.reset': '🗑️ Reimposta Assessment',
		'compile.save': '💾 Salva nell\'Organizzazione',
		'compile.score': 'Punteggio CPF:',
		'compile.confidence.label': 'Confidenza:',
		'compile.empty': '👆 Seleziona un indicatore sopra per iniziare a compilare un assessment',

		// Organization Modal
		'modal.org.create': 'Crea Nuova Organizzazione',
		'modal.org.edit': 'Modifica Organizzazione',
		'modal.org.id': 'ID Organizzazione',
		'modal.org.id.helper': 'Formato: org-tuonome-001 (minuscolo, trattini consentiti)',
		'modal.org.name': 'Nome Organizzazione',
		'modal.org.name.placeholder': 'ACME Corporation',
		'modal.org.industry': 'Settore',
		'modal.org.industry.select': 'Seleziona settore...',
		'modal.org.size': 'Dimensione',
		'modal.org.size.select': 'Seleziona dimensione...',
		'modal.org.size.small': 'Piccola (<50 dipendenti)',
		'modal.org.size.medium': 'Media (50-500 dipendenti)',
		'modal.org.size.enterprise': 'Enterprise (>500 dipendenti)',
		'modal.org.country': 'Paese',
		'modal.org.country.helper': 'Codice ISO 3166-1 alpha-2 (2 lettere, es. US, IT, GB)',
		'modal.org.language': 'Lingua',
		'modal.org.sede': 'Sede Sociale',
		'modal.org.sede.placeholder': 'Via Roma 1, 00100 Roma (RM)',
		'modal.org.sede.helper': 'Indirizzo della sede legale dell\'azienda',
		'modal.org.vat': 'Partita IVA',
		'modal.org.vat.placeholder': 'IT12345678901',
		'modal.org.vat.helper': 'Numero di Partita IVA (es. IT12345678901)',
		'modal.org.notes': 'Note',
		'modal.org.notes.placeholder': 'Note aggiuntive sull\'organizzazione...',
		'modal.org.fetch': 'Scarica tutti i 100 indicatori da GitHub (consigliato per nuove organizzazioni)',
		'modal.org.fetch.helper': 'Questo scaricherà le definizioni degli indicatori dal repository GitHub e li memorizzerà con l\'organizzazione.',
		'modal.org.fetching': 'Scaricamento indicatori da GitHub...',
		'modal.required': '*',

		// Industries
		'industry.technology': 'Tecnologia',
		'industry.finance': 'Finanza',
		'industry.healthcare': 'Sanità',
		'industry.retail': 'Retail',
		'industry.education': 'Istruzione',
		'industry.manufacturing': 'Manifattura',
		'industry.government': 'Governo',
		'industry.energy': 'Energia',
		'industry.transportation': 'Trasporti',
		'industry.other': 'Altro',

		// Languages
		'lang.en': 'English (US)',
		'lang.it': 'Italian (IT)',
		'lang.es': 'Spanish (ES)',
		'lang.fr': 'French (FR)',
		'lang.de': 'German (DE)',

		// Delete Modal
		'modal.delete.title': '⚠️ Elimina Organizzazione',
		'modal.delete.confirm': 'Sei sicuro di voler eliminare',
		'modal.delete.warning': 'L\'organizzazione verrà spostata nel cestino e potrà essere ripristinata entro 30 giorni. Dopo 30 giorni, verrà eliminata definitivamente.',
		'modal.delete.button': 'Sposta nel Cestino',

		// Indicator Modal
		'modal.indicator.title': 'Dettaglio Indicatore',
		'modal.indicator.loading': 'Caricamento dettagli indicatore...',
		'modal.indicator.history': '📜 Cronologia',
		'modal.indicator.edit': '✏️ Modifica Assessment',
		'modal.indicator.delete': 'Elimina Assessment',

		// Assessment Details Modal
		'modal.assessment.title': 'Dettagli Assessment',
		'modal.assessment.loading': 'Caricamento dettagli...',
		'modal.assessment.delete': '🗑️ Elimina',

		// Trash Modal
		'modal.trash.title': '🗑️ Cestino',
		'modal.trash.empty.title': 'Cestino Vuoto',
		'modal.trash.empty.subtitle': 'Nessuna organizzazione eliminata',

		// History Modal
		'modal.history.title': '📜 Cronologia Versioni',
		'modal.history.loading': 'Caricamento cronologia...',

		// Category Modal
		'modal.category.title': 'Categoria',

		// Common
		'common.cancel': 'Annulla',
		'common.save': 'Salva',
		'common.close': 'Chiudi',
		'common.loading': 'Caricamento...'
	}
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
	module.exports = { auditingV2Translations };
}
