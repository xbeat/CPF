/**
 * Base Connector
 *
 * Interfaccia comune per tutti i connettori SIEM/SOC/EDR
 * Definisce il contratto che ogni connettore deve implementare
 */

class BaseConnector {
  constructor(sourceId, config = {}) {
    this.sourceId = sourceId;
    this.config = config;
    this.connected = false;
    this.stats = {
      eventsReceived: 0,
      eventsSent: 0,
      errors: 0,
      lastActivity: null
    };
  }

  /**
   * Connetti al SIEM/SOC/EDR
   * Dev Mode: Setup simulazione
   * Prod Mode: Connessione reale al sistema
   */
  async connect() {
    throw new Error('connect() must be implemented by subclass');
  }

  /**
   * Disconnetti
   */
  async disconnect() {
    this.connected = false;
    console.log(`🔌 [${this.sourceId}] Disconnected`);
  }

  /**
   * Verifica connessione attiva
   */
  async ping() {
    return this.connected;
  }

  /**
   * Fetch eventi dal sistema
   * Dev Mode: Non usato (generiamo eventi)
   * Prod Mode: Query eventi reali
   *
   * @param {Object} filters - Filtri (timeRange, eventTypes, severity, etc)
   * @returns {Array} Eventi
   */
  async fetchEvents(filters = {}) {
    throw new Error('fetchEvents() must be implemented by subclass');
  }

  /**
   * Invia evento al sistema
   * Dev Mode: Non usato
   * Prod Mode: Crea alert/ticket/case nel SIEM
   *
   * @param {Object} event - Evento da inviare
   * @returns {Object} Risultato
   */
  async sendEvent(event) {
    throw new Error('sendEvent() must be implemented by subclass');
  }

  /**
   * Normalizza evento dal formato nativo al formato comune
   *
   * @param {Object} nativeEvent - Evento nel formato del sistema
   * @returns {Object} Evento normalizzato
   */
  normalizeEvent(nativeEvent) {
    // Formato comune per tutti i connettori
    return {
      id: nativeEvent.id || this.generateEventId(),
      source: this.sourceId,
      timestamp: nativeEvent.timestamp || new Date().toISOString(),
      type: nativeEvent.type || 'unknown',
      severity: this.normalizeSeverity(nativeEvent.severity),
      description: nativeEvent.description || nativeEvent.message || '',
      raw: nativeEvent // Mantieni dati originali
    };
  }

  /**
   * Normalizza severity a formato standard
   */
  normalizeSeverity(severity) {
    if (!severity) return 'medium';

    const normalized = severity.toString().toLowerCase();

    // Mappa severity comuni
    const severityMap = {
      'critical': 'critical',
      'high': 'high',
      'medium': 'medium',
      'low': 'low',
      'info': 'info',
      'informational': 'info',
      // Numeri (0-10)
      '0': 'info',
      '1': 'info',
      '2': 'low',
      '3': 'low',
      '4': 'low',
      '5': 'medium',
      '6': 'medium',
      '7': 'high',
      '8': 'high',
      '9': 'critical',
      '10': 'critical'
    };

    return severityMap[normalized] || 'medium';
  }

  /**
   * Genera ID evento unico
   */
  generateEventId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${this.sourceId}-${timestamp}-${random}`;
  }

  /**
   * Ottiene statistiche connettore
   */
  getStats() {
    return {
      sourceId: this.sourceId,
      connected: this.connected,
      stats: this.stats
    };
  }

  /**
   * Aggiorna statistiche
   */
  updateStats(type, count = 1) {
    if (this.stats[type] !== undefined) {
      this.stats[type] += count;
    }
    this.stats.lastActivity = new Date().toISOString();
  }

  /**
   * Valida configurazione
   */
  validateConfig(requiredFields = []) {
    const missing = [];

    requiredFields.forEach(field => {
      if (!this.config[field]) {
        missing.push(field);
      }
    });

    if (missing.length > 0) {
      throw new Error(`Missing required config fields: ${missing.join(', ')}`);
    }

    return true;
  }

  /**
   * Log helper
   */
  log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const prefix = `[${this.sourceId}]`;

    const logFn = {
      'error': console.error,
      'warn': console.warn,
      'info': console.log,
      'debug': console.log
    }[level] || console.log;

    if (data) {
      logFn(`${timestamp} ${prefix} ${message}`, data);
    } else {
      logFn(`${timestamp} ${prefix} ${message}`);
    }
  }

  /**
   * Gestione errori
   */
  handleError(error, context = '') {
    this.updateStats('errors');
    this.log('error', `Error${context ? ' in ' + context : ''}: ${error.message}`);

    // In produzione, potresti voler inviare a sistema di monitoring
    // this.sendToMonitoring(error, context);
  }
}

module.exports = BaseConnector;
