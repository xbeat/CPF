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
    this.mode = config.mode || 'simulation'; // 'simulation' | 'production'
    this.stats = {
      eventsReceived: 0,
      eventsSent: 0,
      errors: 0,
      lastActivity: null
    };
  }

  // ===== TEMPLATE METHODS (common logic for all connectors) =====

  /**
   * Connetti al SIEM/SOC/EDR
   * Template method - implements common connection logic
   * Dev Mode: Setup simulazione
   * Prod Mode: Connessione reale al sistema (calls _connectProduction)
   */
  async connect() {
    if (this.mode === 'simulation') {
      // Simulation mode - no real connection
      this.connected = true;
      this.log('info', '🎭 Connected (Simulation Mode)');
      return { success: true, mode: 'simulation' };
    }

    // Production mode - delegate to vendor-specific implementation
    try {
      await this._connectProduction();
      this.connected = true;
      this.log('info', `✅ Connected to ${this.sourceId}`);
      return { success: true, mode: 'production' };
    } catch (error) {
      this.handleError(error, 'connect');
      throw error;
    }
  }

  /**
   * Disconnetti
   */
  async disconnect() {
    this.connected = false;
    this.log('info', `🔌 Disconnected`);
  }

  /**
   * Verifica connessione attiva
   */
  async ping() {
    return this.connected;
  }

  /**
   * Fetch eventi dal sistema
   * Template method - implements common fetch logic
   * Dev Mode: Non usato (generiamo eventi)
   * Prod Mode: Query eventi reali (calls _fetchEventsProduction)
   *
   * @param {Object} filters - Filtri (timeRange, eventTypes, severity, etc)
   * @returns {Array} Eventi
   */
  async fetchEvents(filters = {}) {
    if (!this.connected) {
      throw new Error(`Not connected to ${this.sourceId}`);
    }

    if (this.mode === 'simulation') {
      this.log('warn', 'fetchEvents() not used in simulation mode');
      return [];
    }

    try {
      const results = await this._fetchEventsProduction(filters);
      this.updateStats('eventsReceived', results.length);
      return results.map(event => this.normalizeEvent(event));
    } catch (error) {
      this.handleError(error, 'fetchEvents');
      throw error;
    }
  }

  /**
   * Invia evento al sistema
   * Template method - implements common send logic
   * Dev Mode: Non usato
   * Prod Mode: Crea alert/ticket/case nel SIEM (calls _sendEventProduction)
   *
   * @param {Object} event - Evento da inviare
   * @returns {Object} Risultato
   */
  async sendEvent(event) {
    if (!this.connected) {
      throw new Error(`Not connected to ${this.sourceId}`);
    }

    if (this.mode === 'simulation') {
      this.updateStats('eventsSent');
      return { success: true, mode: 'simulation' };
    }

    try {
      const result = await this._sendEventProduction(event);
      this.updateStats('eventsSent');
      return { success: true, mode: 'production', result };
    } catch (error) {
      this.handleError(error, 'sendEvent');
      throw error;
    }
  }

  // ===== HOOK METHODS (must be implemented by subclasses) =====

  /**
   * Production connection logic - vendor specific
   * Subclasses must implement this method
   * @protected
   */
  async _connectProduction() {
    throw new Error('_connectProduction() must be implemented by subclass');
  }

  /**
   * Production fetch events logic - vendor specific
   * Subclasses must implement this method
   * @protected
   * @param {Object} filters - Filtri eventi
   * @returns {Array} Eventi raw (will be normalized by base class)
   */
  async _fetchEventsProduction(filters) {
    throw new Error('_fetchEventsProduction() must be implemented by subclass');
  }

  /**
   * Production send event logic - vendor specific
   * Subclasses must implement this method
   * @protected
   * @param {Object} event - Evento da inviare
   * @returns {Object} Risultato vendor-specific
   */
  async _sendEventProduction(event) {
    throw new Error('_sendEventProduction() must be implemented by subclass');
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
