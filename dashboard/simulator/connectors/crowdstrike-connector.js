/**
 * CrowdStrike Falcon Connector
 *
 * Connettore per CrowdStrike Falcon EDR
 */

const BaseConnector = require('./base-connector');

class CrowdStrikeConnector extends BaseConnector {
  constructor(config = {}) {
    super('crowdstrike', config);
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.apiUrl = config.apiUrl || 'https://api.crowdstrike.com';
    this.mode = config.mode || 'simulation';
    this.accessToken = null;
  }

  async connect() {
    if (this.mode === 'simulation') {
      this.connected = true;
      this.log('info', '🎭 Connected (Simulation Mode)');
      return { success: true, mode: 'simulation' };
    }

    try {
      this.validateConfig(['clientId', 'clientSecret']);
      // TODO: Autenticazione CrowdStrike OAuth2
      // POST /oauth2/token
      // this.accessToken = await this.authenticateFalcon();
      this.connected = true;
      this.log('info', '✅ Connected to CrowdStrike Falcon');
      return { success: true, mode: 'production' };
    } catch (error) {
      this.handleError(error, 'connect');
      throw error;
    }
  }

  async fetchEvents(filters = {}) {
    if (!this.connected) throw new Error('Not connected to CrowdStrike');
    if (this.mode === 'simulation') return [];

    try {
      // TODO: Implementare
      // GET /detects/queries/detects/v1 - Detection IDs
      // POST /detects/entities/summaries/GET/v1 - Detection details
      // GET /incidents/queries/incidents/v1 - Incident IDs
      const results = [];
      this.updateStats('eventsReceived', results.length);
      return results.map(event => this.normalizeEvent(event));
    } catch (error) {
      this.handleError(error, 'fetchEvents');
      throw error;
    }
  }

  async sendEvent(event) {
    if (!this.connected) throw new Error('Not connected to CrowdStrike');
    if (this.mode === 'simulation') {
      this.updateStats('eventsSent');
      return { success: true, mode: 'simulation' };
    }

    try {
      // TODO: Implementare
      // POST /incidents/entities/incident-actions/v1
      this.updateStats('eventsSent');
      return { success: true, mode: 'production' };
    } catch (error) {
      this.handleError(error, 'sendEvent');
      throw error;
    }
  }

  normalizeEvent(falconEvent) {
    return {
      id: falconEvent.detection_id || falconEvent.incident_id || this.generateEventId(),
      source: 'crowdstrike',
      timestamp: falconEvent.created_timestamp || falconEvent.first_behavior || new Date().toISOString(),
      type: falconEvent.tactic || falconEvent.technique || 'unknown',
      severity: this.normalizeFalconSeverity(falconEvent.severity || falconEvent.max_severity),
      description: falconEvent.description || '',
      hostname: falconEvent.device?.hostname,
      username: falconEvent.user_name,
      process: falconEvent.filename || falconEvent.process_name,
      cmdline: falconEvent.cmdline,
      parent_process: falconEvent.parent_details?.parent_process,
      behaviors: falconEvent.behaviors,
      raw: falconEvent
    };
  }

  normalizeFalconSeverity(severity) {
    // CrowdStrike usa valori numerici e stringhe
    if (typeof severity === 'number') {
      if (severity >= 70) return 'critical';
      if (severity >= 50) return 'high';
      if (severity >= 30) return 'medium';
      if (severity >= 10) return 'low';
      return 'info';
    }

    const falconMap = {
      'critical': 'critical',
      'high': 'high',
      'medium': 'medium',
      'low': 'low',
      'informational': 'info'
    };

    return falconMap[severity?.toLowerCase()] || this.normalizeSeverity(severity);
  }

  async authenticateFalcon() {
    // TODO: Implementare OAuth2 CrowdStrike
    throw new Error('CrowdStrike authentication not implemented yet');
  }
}

module.exports = CrowdStrikeConnector;
