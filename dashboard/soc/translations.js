// ============================================
// CPF SOC DASHBOARD - TRANSLATIONS (EN/IT)
// ============================================

const socTranslations = {
	en: {
		// Meta tags
		'meta.title': 'CPF Dashboard - SOC + Bayesian Analysis',
		'meta.description': 'SOC Integration with Bayesian Cross-Indicator Analysis for comprehensive security risk assessment',

		// Header
		'header.back': '← Back to Dashboard',
		'header.title': '⚠️ CPF SOC Dashboard',
		'header.version': 'v1.0',
		'header.subtitle': 'SOC Integration + Bayesian Cross-Indicator Analysis',

		// Buttons
		'button.organizations': 'Organizations',
		'button.new-org': 'New Organization',
		'button.deleted-items': 'Deleted Items',
		'button.export-excel': 'Export Excel',
		'button.export-pdf': 'Export PDF',

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

		// Loading & Empty State
		'loading.text': 'Loading organizations data...',
		'empty.title': '👋 Welcome to CPF Dashboard',
		'empty.subtitle': 'Select an organization from the sidebar to view analysis',

		// Bayesian Explanation
		'bayesian.title': '🧠 About Bayesian Cross-Indicator Analysis',
		'bayesian.text1': 'This dashboard uses <strong>Bayesian inference</strong> to intelligently merge data from two sources: machine-generated SOC (Security Operations Center) data and human auditor assessments. The Bayesian approach provides a probabilistic framework that weighs evidence from both sources, considering their confidence levels and interdependencies.',
		'bayesian.text2': '<strong>Key features:</strong> Cross-category dependency modeling (e.g., high Authority risk influences Social risk), weighted aggregation (human assessments weighted 1.5× for higher trust), confidence-based analysis, and automated prioritization for remediation planning.',

		// Meta Labels
		'meta.confidence': 'Confidence',
		'meta.trend': 'Trend',
		'meta.updated': 'Last Updated',

		// Sections
		'section.risk-category': '📊 Risk by Category',
		'section.radar': '🎯 Security Risk Radar',
		'section.radar.desc': 'Visual representation of risk and confidence across all categories',
		'section.stats': '📊 Quick Stats',
		'section.priority': '🎯 Prioritization Matrix',
		'section.priority.desc': 'Categories ordered by priority for remediation (risk × weight + downstream impact)',
		'section.convergence': '🔗 SOC vs Human Convergence',
		'section.convergence.desc': 'Comparison of machine (SOC) and human (auditor) assessments',
		'section.indicators': '🔍 Indicator Matrix (100 Indicators)',
		'section.indicators.desc': 'Click any indicator for detailed breakdown',

		// Table Headers
		'table.th.category': 'Category',
		'table.th.risk': 'Risk',
		'table.th.confidence': 'Confidence',
		'table.th.priority': 'Priority Score',
		'table.th.impact': 'Downstream Impact',
		'table.th.recommendation': 'Recommendation',

		// Zoom Controls
		'zoom.label': 'Zoom:',

		// Modal - Indicator Detail
		'modal.indicator.title': 'Indicator',

		// Modal - Edit Organization
		'modal.edit.title': '✏️ Edit Organization',
		'modal.org-name': 'Organization Name',
		'modal.industry': 'Industry',
		'modal.size': 'Size',
		'modal.country': 'Country',
		'modal.language': 'Language',
		'modal.address': 'Sede Sociale',
		'modal.vat': 'Partita IVA',
		'modal.notes': 'Notes',
		'modal.required': '*',

		// Modal - Delete Organization
		'modal.delete.title': '⚠️ Delete Organization',
		'modal.delete.confirm': 'Are you sure you want to delete',
		'modal.delete.warning': 'The organization will be moved to the trash and can be restored within 30 days.',

		// Modal - Trash
		'modal.trash.title': 'Deleted Items',

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

		// Languages
		'lang.en': 'English (US)',
		'lang.it': 'Italian (IT)',
		'lang.es': 'Spanish (ES)',
		'lang.fr': 'French (FR)',
		'lang.de': 'German (DE)',

		// Common
		'common.cancel': 'Cancel',
		'common.save': 'Save Changes',
		'common.delete': 'Move to Trash',
		'common.close': 'Close'
	},
	it: {
		// Meta tags
		'meta.title': 'CPF Dashboard - SOC + Analisi Bayesiana',
		'meta.description': 'Integrazione SOC con Analisi Cross-Indicator Bayesiana per assessment completo del rischio di sicurezza',

		// Header
		'header.back': '← Torna alla Dashboard',
		'header.title': '⚠️ CPF SOC Dashboard',
		'header.version': 'v1.0',
		'header.subtitle': 'Integrazione SOC + Analisi Cross-Indicator Bayesiana',

		// Buttons
		'button.organizations': 'Organizzazioni',
		'button.new-org': 'Nuova Organizzazione',
		'button.deleted-items': 'Elementi Eliminati',
		'button.export-excel': 'Esporta Excel',
		'button.export-pdf': 'Esporta PDF',

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

		// Loading & Empty State
		'loading.text': 'Caricamento dati organizzazioni...',
		'empty.title': '👋 Benvenuto nella CPF Dashboard',
		'empty.subtitle': 'Seleziona un\'organizzazione dalla sidebar per visualizzare l\'analisi',

		// Bayesian Explanation
		'bayesian.title': '🧠 Informazioni sull\'Analisi Cross-Indicator Bayesiana',
		'bayesian.text1': 'Questa dashboard utilizza l\'<strong>inferenza Bayesiana</strong> per unire intelligentemente dati da due fonti: dati SOC (Security Operations Center) generati dalla macchina e valutazioni di auditor umani. L\'approccio Bayesiano fornisce un framework probabilistico che pesa le evidenze da entrambe le fonti, considerando i loro livelli di confidenza e le interdipendenze.',
		'bayesian.text2': '<strong>Caratteristiche principali:</strong> Modellazione delle dipendenze cross-categoria (es. alto rischio Authority influenza rischio Social), aggregazione ponderata (valutazioni umane pesate 1.5× per maggiore fiducia), analisi basata sulla confidenza e prioritizzazione automatica per la pianificazione della remediation.',

		// Meta Labels
		'meta.confidence': 'Confidenza',
		'meta.trend': 'Tendenza',
		'meta.updated': 'Ultimo Aggiornamento',

		// Sections
		'section.risk-category': '📊 Rischio per Categoria',
		'section.radar': '🎯 Radar Rischio Sicurezza',
		'section.radar.desc': 'Rappresentazione visuale del rischio e della confidenza su tutte le categorie',
		'section.stats': '📊 Statistiche Rapide',
		'section.priority': '🎯 Matrice Priorità',
		'section.priority.desc': 'Categorie ordinate per priorità di remediation (rischio × peso + impatto downstream)',
		'section.convergence': '🔗 Convergenza SOC vs Umano',
		'section.convergence.desc': 'Confronto tra valutazioni macchina (SOC) e umane (auditor)',
		'section.indicators': '🔍 Matrice Indicatori (100 Indicatori)',
		'section.indicators.desc': 'Clicca su qualsiasi indicatore per il dettaglio',

		// Table Headers
		'table.th.category': 'Categoria',
		'table.th.risk': 'Rischio',
		'table.th.confidence': 'Confidenza',
		'table.th.priority': 'Punteggio Priorità',
		'table.th.impact': 'Impatto Downstream',
		'table.th.recommendation': 'Raccomandazione',

		// Zoom Controls
		'zoom.label': 'Zoom:',

		// Modal - Indicator Detail
		'modal.indicator.title': 'Indicatore',

		// Modal - Edit Organization
		'modal.edit.title': '✏️ Modifica Organizzazione',
		'modal.org-name': 'Nome Organizzazione',
		'modal.industry': 'Settore',
		'modal.size': 'Dimensione',
		'modal.country': 'Paese',
		'modal.language': 'Lingua',
		'modal.address': 'Sede Sociale',
		'modal.vat': 'Partita IVA',
		'modal.notes': 'Note',
		'modal.required': '*',

		// Modal - Delete Organization
		'modal.delete.title': '⚠️ Elimina Organizzazione',
		'modal.delete.confirm': 'Sei sicuro di voler eliminare',
		'modal.delete.warning': 'L\'organizzazione verrà spostata nel cestino e potrà essere ripristinata entro 30 giorni.',

		// Modal - Trash
		'modal.trash.title': 'Elementi Eliminati',

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

		// Languages
		'lang.en': 'English (US)',
		'lang.it': 'Italian (IT)',
		'lang.es': 'Spanish (ES)',
		'lang.fr': 'French (FR)',
		'lang.de': 'German (DE)',

		// Common
		'common.cancel': 'Annulla',
		'common.save': 'Salva Modifiche',
		'common.delete': 'Sposta nel Cestino',
		'common.close': 'Chiudi'
	}
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
	module.exports = { socTranslations };
}
