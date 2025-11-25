// ============================================
// CPF SIMULATOR DASHBOARD - TRANSLATIONS (EN/IT)
// ============================================

const simulatorTranslations = {
	en: {
		// Meta tags
		'meta.title': 'CPF SIEM/SOC Simulator - Control Dashboard',
		'meta.description': 'Simulate realistic SIEM, SOC and EDR events for testing and development',

		// Header
		'header.back': '← Back to Dashboard',
		'header.title': '🎭 CPF SOC Simulator Dashboard',
		'header.version': 'v1.0',
		'header.subtitle': 'SIEM/SOC Event Simulation & Testing',

		// Buttons
		'button.organizations': 'Organizations',
		'button.new-org': 'New Organization',
		'button.deleted-items': 'Deleted Items',

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
		'loading.title': 'Loading Simulator...',
		'loading.text': 'Initializing SIEM/SOC simulator components',
		'empty.title': '🚀 Simulator Ready',
		'empty.subtitle': 'Select an organization from the sidebar to start simulating SIEM/SOC events',

		// Simulator Controls
		'controls.title': 'Simulator Controls',
		'controls.mode': 'Mode:',
		'controls.mode.manual': '📝 Manual',
		'controls.mode.auto': '🤖 Automatic',

		// Scenarios
		'scenario.label': 'Scenario',
		'scenario.normal': 'Normal Operations (Baseline)',
		'scenario.phishing': 'Phishing Campaign',
		'scenario.ransomware': 'Ransomware Attack',
		'scenario.insider': 'Insider Threat',
		'scenario.apt': 'APT Intrusion',
		'scenario.credential': 'Credential Stuffing',
		'scenario.supply-chain': 'Supply Chain Attack',
		'scenario.ddos': 'DDoS Attack',

		// Event Configuration
		'event.rate': 'Event Rate (events/sec)',
		'event.duration': 'Duration (seconds, 0=infinite)',
		'event.type': 'Event Type',
		'event.severity': 'Severity',
		'event.count': 'Count',

		// Event Types
		'event-type.phishing': 'Phishing Clicked',
		'event-type.malware': 'Malware Detected',
		'event-type.ransomware': 'Ransomware Activity',
		'event-type.exfiltration': 'Data Exfiltration',
		'event-type.privilege': 'Privilege Escalation',
		'event-type.lateral': 'Lateral Movement',
		'event-type.brute-force': 'Brute Force Attack',
		'event-type.insider': 'Insider Threat',

		// Severity Levels
		'severity.low': 'Low',
		'severity.medium': 'Medium',
		'severity.high': 'High',
		'severity.critical': 'Critical',

		// SIEM Sources
		'sources.label': 'SIEM/EDR Sources',

		// Control Buttons
		'button.start': '▶️ Start Simulator',
		'button.stop': '⏹️ Stop Simulator',
		'button.emit': '⚡ Emit Event',

		// Statistics
		'stats.title': 'Statistics',
		'stats.total-events': 'Total Events',
		'stats.events-sec': 'Events/sec',
		'stats.duration': 'Duration',
		'stats.active-sources': 'Active Sources',

		// Matrix
		'matrix.title': 'CPF Indicators Matrix (10x10)',
		'matrix.zoom': 'Zoom:',

		// Legend
		'legend.low': 'Low Risk (< 33%)',
		'legend.medium': 'Medium Risk (33-66%)',
		'legend.high': 'High Risk (> 66%)',
		'legend.no-data': 'No Data',
		'legend.increasing': '↑ Risk increasing',
		'legend.stable': '→ Risk stable',
		'legend.decreasing': '↓ Risk decreasing',

		// Common
		'common.loading': 'Loading...',
		'common.cancel': 'Cancel',
		'common.save': 'Save',
		'common.close': 'Close'
	},
	it: {
		// Meta tags
		'meta.title': 'CPF SIEM/SOC Simulator - Dashboard Controllo',
		'meta.description': 'Simula eventi SIEM, SOC e EDR realistici per testing e sviluppo',

		// Header
		'header.back': '← Torna alla Dashboard',
		'header.title': '🎭 CPF SOC Simulator Dashboard',
		'header.version': 'v1.0',
		'header.subtitle': 'Simulazione & Testing Eventi SIEM/SOC',

		// Buttons
		'button.organizations': 'Organizzazioni',
		'button.new-org': 'Nuova Organizzazione',
		'button.deleted-items': 'Elementi Eliminati',

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
		'loading.title': 'Caricamento Simulatore...',
		'loading.text': 'Inizializzazione componenti simulatore SIEM/SOC',
		'empty.title': '🚀 Simulatore Pronto',
		'empty.subtitle': 'Seleziona un\'organizzazione dalla sidebar per iniziare a simulare eventi SIEM/SOC',

		// Simulator Controls
		'controls.title': 'Controlli Simulatore',
		'controls.mode': 'Modalità:',
		'controls.mode.manual': '📝 Manuale',
		'controls.mode.auto': '🤖 Automatico',

		// Scenarios
		'scenario.label': 'Scenario',
		'scenario.normal': 'Operazioni Normali (Baseline)',
		'scenario.phishing': 'Campagna Phishing',
		'scenario.ransomware': 'Attacco Ransomware',
		'scenario.insider': 'Minaccia Interna',
		'scenario.apt': 'Intrusione APT',
		'scenario.credential': 'Credential Stuffing',
		'scenario.supply-chain': 'Attacco Supply Chain',
		'scenario.ddos': 'Attacco DDoS',

		// Event Configuration
		'event.rate': 'Frequenza Eventi (eventi/sec)',
		'event.duration': 'Durata (secondi, 0=infinito)',
		'event.type': 'Tipo Evento',
		'event.severity': 'Severità',
		'event.count': 'Conteggio',

		// Event Types
		'event-type.phishing': 'Phishing Cliccato',
		'event-type.malware': 'Malware Rilevato',
		'event-type.ransomware': 'Attività Ransomware',
		'event-type.exfiltration': 'Esfiltrazione Dati',
		'event-type.privilege': 'Escalation Privilegi',
		'event-type.lateral': 'Movimento Laterale',
		'event-type.brute-force': 'Attacco Brute Force',
		'event-type.insider': 'Minaccia Interna',

		// Severity Levels
		'severity.low': 'Bassa',
		'severity.medium': 'Media',
		'severity.high': 'Alta',
		'severity.critical': 'Critica',

		// SIEM Sources
		'sources.label': 'Sorgenti SIEM/EDR',

		// Control Buttons
		'button.start': '▶️ Avvia Simulatore',
		'button.stop': '⏹️ Ferma Simulatore',
		'button.emit': '⚡ Emetti Evento',

		// Statistics
		'stats.title': 'Statistiche',
		'stats.total-events': 'Eventi Totali',
		'stats.events-sec': 'Eventi/sec',
		'stats.duration': 'Durata',
		'stats.active-sources': 'Sorgenti Attive',

		// Matrix
		'matrix.title': 'Matrice Indicatori CPF (10x10)',
		'matrix.zoom': 'Zoom:',

		// Legend
		'legend.low': 'Rischio Basso (< 33%)',
		'legend.medium': 'Rischio Medio (33-66%)',
		'legend.high': 'Rischio Alto (> 66%)',
		'legend.no-data': 'Nessun Dato',
		'legend.increasing': '↑ Rischio in aumento',
		'legend.stable': '→ Rischio stabile',
		'legend.decreasing': '↓ Rischio in diminuzione',

		// Common
		'common.loading': 'Caricamento...',
		'common.cancel': 'Annulla',
		'common.save': 'Salva',
		'common.close': 'Chiudi'
	}
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
	module.exports = { simulatorTranslations };
}
