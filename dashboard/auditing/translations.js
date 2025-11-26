// ============================================
// CPF AUDITING DASHBOARD - TRANSLATIONS (EN/IT)
// ============================================

const auditingTranslations = {
	en: {
		// Meta tags
		'meta.title': 'CPF Auditing Dashboard - Organizations & Assessment Progress',
		'meta.description': 'Comprehensive CPF assessment platform with maturity model, compliance tracking, and ROI analysis',

		// Header
		'header.back': '← Back to Dashboard',
		'header.title': '🛡️ CPF Auditing Dashboard',
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
		'sidebar.sort.label': 'Sort by',
		'sidebar.sort.date': '📅 Date Created',
		'sidebar.sort.name': '🔤 Name',
		'sidebar.sort.risk': '⚠️ Risk Score',
		'sidebar.sort.completion': '📊 Completion %',
		'sidebar.sort.updated': '🔄 Last Updated',
		'sidebar.sort.assessments': '📝 Assessments',
		'sidebar.sort.industry': '🏢 Industry',
		'sidebar.sort.country': '🌍 Country',
		'sidebar.loading': 'Loading...',
		'sidebar.open.title': 'Show organizations',
		'sidebar.create.title': 'Create new organization',
		'sidebar.trash.title': 'View deleted organizations',

		// Empty State
		'empty.title': 'Welcome to CPF Auditing Dashboard',
		'empty.subtitle': 'Select an organization from the sidebar to view assessment progress and risk analysis',

		// Tabs
		'tab.progress': '📈 Progress Tracking',
		'tab.risk': '🔥 Risk Analysis',
		'tab.maturity': '🎖️ Maturity Model',
		'tab.compile': '✏️ Compile Assessment',

		// Progress Tab
		'progress.title': 'Assessment Progress Matrix',
		'progress.zoom': 'Zoom:',
		'progress.zoom.label': 'Zoom:',

		// Risk Tab
		'risk.title': 'Risk Analysis by Category',
		'risk.radar.title': '📡 Security Posture Radar',
		'risk.radar.subtitle': 'Interactive visualization of vulnerability assessment across all categories.',
		'risk.radar.note': 'Larger area = Higher risk',
		'risk.stats.title': '📊 Quick Stats',
		'risk.priority.title': '🎯 Prioritization Matrix',
		'risk.priority.subtitle': 'Categories ordered by priority for remediation (risk × weight + downstream impact)',
		'risk.recommendation.immediate': 'Immediate action required',
		'risk.recommendation.high-priority': 'High priority - address soon',
		'risk.recommendation.monitor': 'Monitor and plan improvements',
		'risk.recommendation.maintain': 'Maintain current level',

		// Prioritization Table
		'table.th.number': '#',
		'table.th.category': 'Category',
		'table.th.risk': 'Risk',
		'table.th.confidence': 'Confidence',
		'table.th.completion': 'Completion',
		'table.th.priority': 'Priority Score',
		'table.th.recommendation': 'Recommendation',

		// Maturity Tab
		'maturity.title': '🎖️ CPF Maturity Model Assessment',
		'maturity.subtitle': 'Overall organizational maturity based on CPF Score (0-100) and Convergence Index',
		'maturity.current-level': 'Current Maturity Level',
		'maturity.cpf-score': 'CPF Score',
		'maturity.progress-next': 'Progress to Next Level',
		'maturity.convergence': 'Convergence Index',
		'maturity.domain-distribution': 'Domain Distribution',
		'maturity.sector-percentile': 'Sector Percentile',
		'maturity.status.balanced': 'Balanced - Good distribution',
		'maturity.status.skewed': 'Skewed - Some domains need attention',
		'maturity.status.critical': 'Critical - Significant imbalances',
		'maturity.comparison.above': 'Above sector average',
		'maturity.comparison.average': 'At sector average',
		'maturity.comparison.below': 'Below sector average',

		// Compliance
		'compliance.title': '📋 Regulatory Compliance Status',
		'compliance.subtitle': 'Compliance status with major cybersecurity and privacy regulations',
		'compliance.th.regulation': 'Regulation',
		'compliance.th.status': 'Status',
		'compliance.th.min-level': 'Min. Level Required',
		'compliance.th.recommended': 'Recommended Level',
		'compliance.th.your-level': 'Your Level',

		// Benchmark
		'benchmark.title': '📊 Sector Benchmark Comparison',
		'benchmark.subtitle': 'How your organization compares to industry peers',
		'benchmark.sector-mean': 'Sector Mean',
		'benchmark.your-score': 'Your Score',

		// Certification
		'certification.title': '🏆 CPF Certification Pathway',
		'certification.subtitle': 'Track your progress toward CPF certifications',

		// ROI
		'roi.title': '💰 ROI Analysis - Next Level Investment',
		'roi.subtitle': 'Estimated investment and returns for advancing to the next maturity level',

		// Compile Assessment
		'compile.title': '✏️ Compile New Assessment',
		'compile.subtitle': 'Select an indicator, fill in the assessment, and save to the organization\'s data.',
		'compile.step1': '1. Select Indicator',
		'compile.step2': '2. Fill Assessment',
		'compile.empty': '👆 Select an indicator above to begin compiling an assessment',

		// Compile Form
		'form.category': 'Category',
		'form.indicator': 'Indicator',
		'form.language': 'Language',
		'form.metadata': 'Assessment Metadata',
		'form.assessor': 'Assessor Name',
		'form.date': 'Assessment Date',
		'form.confidence': 'Confidence Level',
		'form.confidence.high': 'High (0.9)',
		'form.confidence.medium': 'Medium (0.7)',
		'form.confidence.low': 'Low (0.5)',

		// Categories
		'category.1': '1. Authority',
		'category.2': '2. Temporal',
		'category.3': '3. Social',
		'category.4': '4. Affective',
		'category.5': '5. Cognitive',
		'category.6': '6. Group',
		'category.7': '7. Stress',
		'category.8': '8. Unconscious',
		'category.9': '9. AI',
		'category.10': '10. Convergent',

		// Languages
		'lang.en': 'English',
		'lang.it': 'Italiano',
		'lang.es': 'Español',
		'lang.fr': 'Français',
		'lang.de': 'Deutsch',

		// Organization Modal
		'modal.create.title': 'Create New Organization',
		'modal.edit.title': 'Edit Organization',
		'modal.org-id': 'Organization ID',
		'modal.org-name': 'Organization Name',
		'modal.industry': 'Industry',
		'modal.size': 'Size',
		'modal.country': 'Country',
		'modal.language': 'Language',
		'modal.address': 'Sede Sociale',
		'modal.vat': 'Partita IVA',
		'modal.notes': 'Notes',
		'modal.required': '*',

		// Industries
		'industry.select': 'Select industry...',
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

		// Sizes
		'size.select': 'Select size...',
		'size.small': 'Small (<50 employees)',
		'size.medium': 'Medium (50-500 employees)',
		'size.enterprise': 'Enterprise (>500 employees)',

		// Common
		'common.loading': 'Loading...',
		'common.save': 'Save',
		'common.cancel': 'Cancel',
		'common.delete': 'Delete',
		'common.edit': 'Edit',
		'common.close': 'Close',
		'common.confirm': 'Confirm',
		'common.yes': 'Yes',
		'common.no': 'No'
	},
	it: {
		// Meta tags
		'meta.title': 'CPF Auditing Dashboard - Organizzazioni e Progressi Assessment',
		'meta.description': 'Piattaforma completa di assessment CPF con maturity model, compliance tracking e ROI analysis',

		// Header
		'header.back': '← Torna alla Dashboard',
		'header.title': '🛡️ CPF Auditing Dashboard',
		'header.subtitle': 'Organizzazioni e Progressi Assessment',

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
		'sidebar.sort.label': 'Ordina per',
		'sidebar.sort.date': '📅 Data Creazione',
		'sidebar.sort.name': '🔤 Nome',
		'sidebar.sort.risk': '⚠️ Punteggio Rischio',
		'sidebar.sort.completion': '📊 Completamento %',
		'sidebar.sort.updated': '🔄 Ultimo Aggiornamento',
		'sidebar.sort.assessments': '📝 Assessment',
		'sidebar.sort.industry': '🏢 Settore',
		'sidebar.sort.country': '🌍 Paese',
		'sidebar.loading': 'Caricamento...',
		'sidebar.open.title': 'Mostra organizzazioni',
		'sidebar.create.title': 'Crea nuova organizzazione',
		'sidebar.trash.title': 'Visualizza organizzazioni eliminate',

		// Empty State
		'empty.title': 'Benvenuto nella CPF Auditing Dashboard',
		'empty.subtitle': 'Seleziona un\'organizzazione dalla sidebar per visualizzare i progressi dell\'assessment e l\'analisi del rischio',

		// Tabs
		'tab.progress': '📈 Tracciamento Progressi',
		'tab.risk': '🔥 Analisi Rischio',
		'tab.maturity': '🎖️ Maturity Model',
		'tab.compile': '✏️ Compila Assessment',

		// Progress Tab
		'progress.title': 'Matrice Progressi Assessment',
		'progress.zoom': 'Zoom:',
		'progress.zoom.label': 'Zoom:',

		// Risk Tab
		'risk.title': 'Analisi Rischio per Categoria',
		'risk.radar.title': '📡 Radar Postura Sicurezza',
		'risk.radar.subtitle': 'Visualizzazione interattiva della vulnerability assessment su tutte le categorie.',
		'risk.radar.note': 'Area più grande = Rischio maggiore',
		'risk.stats.title': '📊 Statistiche Rapide',
		'risk.priority.title': '🎯 Matrice Priorità',
		'risk.priority.subtitle': 'Categorie ordinate per priorità di remediation (rischio × peso + impatto downstream)',
		'risk.recommendation.immediate': 'Azione immediata richiesta',
		'risk.recommendation.high-priority': 'Alta priorità - affrontare presto',
		'risk.recommendation.monitor': 'Monitorare e pianificare miglioramenti',
		'risk.recommendation.maintain': 'Mantenere il livello attuale',

		// Prioritization Table
		'table.th.number': '#',
		'table.th.category': 'Categoria',
		'table.th.risk': 'Rischio',
		'table.th.confidence': 'Confidenza',
		'table.th.completion': 'Completamento',
		'table.th.priority': 'Punteggio Priorità',
		'table.th.recommendation': 'Raccomandazione',

		// Maturity Tab
		'maturity.title': '🎖️ Assessment Maturity Model CPF',
		'maturity.subtitle': 'Maturità organizzativa complessiva basata su CPF Score (0-100) e Convergence Index',
		'maturity.current-level': 'Livello Maturità Attuale',
		'maturity.cpf-score': 'CPF Score',
		'maturity.progress-next': 'Progresso al Livello Successivo',
		'maturity.convergence': 'Convergence Index',
		'maturity.domain-distribution': 'Distribuzione Domini',
		'maturity.sector-percentile': 'Percentile Settore',
		'maturity.status.balanced': 'Bilanciato - Buona distribuzione',
		'maturity.status.skewed': 'Sbilanciato - Alcuni domini necessitano attenzione',
		'maturity.status.critical': 'Critico - Squilibri significativi',
		'maturity.comparison.above': 'Sopra la media del settore',
		'maturity.comparison.average': 'Alla media del settore',
		'maturity.comparison.below': 'Sotto la media del settore',

		// Compliance
		'compliance.title': '📋 Stato Compliance Normativa',
		'compliance.subtitle': 'Stato di compliance con le principali normative di cybersecurity e privacy',
		'compliance.th.regulation': 'Normativa',
		'compliance.th.status': 'Stato',
		'compliance.th.min-level': 'Livello Min. Richiesto',
		'compliance.th.recommended': 'Livello Raccomandato',
		'compliance.th.your-level': 'Tuo Livello',

		// Benchmark
		'benchmark.title': '📊 Confronto Benchmark Settore',
		'benchmark.subtitle': 'Come la tua organizzazione si confronta con i peer del settore',
		'benchmark.sector-mean': 'Media Settore',
		'benchmark.your-score': 'Tuo Punteggio',

		// Certification
		'certification.title': '🏆 Percorso Certificazione CPF',
		'certification.subtitle': 'Traccia i tuoi progressi verso le certificazioni CPF',

		// ROI
		'roi.title': '💰 Analisi ROI - Investimento Livello Successivo',
		'roi.subtitle': 'Investimento e ritorni stimati per avanzare al livello di maturità successivo',

		// Compile Assessment
		'compile.title': '✏️ Compila Nuovo Assessment',
		'compile.subtitle': 'Seleziona un indicatore, compila l\'assessment e salva nei dati dell\'organizzazione.',
		'compile.step1': '1. Seleziona Indicatore',
		'compile.step2': '2. Compila Assessment',
		'compile.empty': '👆 Seleziona un indicatore sopra per iniziare a compilare un assessment',

		// Compile Form
		'form.category': 'Categoria',
		'form.indicator': 'Indicatore',
		'form.language': 'Lingua',
		'form.metadata': 'Metadati Assessment',
		'form.assessor': 'Nome Assessor',
		'form.date': 'Data Assessment',
		'form.confidence': 'Livello Confidenza',
		'form.confidence.high': 'Alta (0.9)',
		'form.confidence.medium': 'Media (0.7)',
		'form.confidence.low': 'Bassa (0.5)',

		// Categories
		'category.1': '1. Authority',
		'category.2': '2. Temporal',
		'category.3': '3. Social',
		'category.4': '4. Affective',
		'category.5': '5. Cognitive',
		'category.6': '6. Group',
		'category.7': '7. Stress',
		'category.8': '8. Unconscious',
		'category.9': '9. AI',
		'category.10': '10. Convergent',

		// Languages
		'lang.en': 'English',
		'lang.it': 'Italiano',
		'lang.es': 'Español',
		'lang.fr': 'Français',
		'lang.de': 'Deutsch',

		// Organization Modal
		'modal.create.title': 'Crea Nuova Organizzazione',
		'modal.edit.title': 'Modifica Organizzazione',
		'modal.org-id': 'ID Organizzazione',
		'modal.org-name': 'Nome Organizzazione',
		'modal.industry': 'Settore',
		'modal.size': 'Dimensione',
		'modal.country': 'Paese',
		'modal.language': 'Lingua',
		'modal.address': 'Sede Sociale',
		'modal.vat': 'Partita IVA',
		'modal.notes': 'Note',
		'modal.required': '*',

		// Industries
		'industry.select': 'Seleziona settore...',
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

		// Sizes
		'size.select': 'Seleziona dimensione...',
		'size.small': 'Piccola (<50 dipendenti)',
		'size.medium': 'Media (50-500 dipendenti)',
		'size.enterprise': 'Enterprise (>500 dipendenti)',

		// Common
		'common.loading': 'Caricamento...',
		'common.save': 'Salva',
		'common.cancel': 'Annulla',
		'common.delete': 'Elimina',
		'common.edit': 'Modifica',
		'common.close': 'Chiudi',
		'common.confirm': 'Conferma',
		'common.yes': 'Sì',
		'common.no': 'No'
	}
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
	module.exports = { auditingTranslations };
}
