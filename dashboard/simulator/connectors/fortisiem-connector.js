/**
 * FortiSIEM Connector
 *
 * Fortinet multi-tenant SIEM
 *
 * API: FortiSIEM REST API
 */

const BaseConnector = require('./base-connector');

class FortiSIEMConnector extends BaseConnector {
  constructor(config) {
    super(config);
    this.sourceId = 'fortisiem';
    this.apiVersion = '7.x';
  }

  async connect() {
    if (this.mode === 'simulation') {
      this.connected = true;
      return {
        success: true,
        mode: 'simulation',
        message: 'FortiSIEM simulator connected'
      };
    }

    // TODO: Production - FortiSIEM authentication
    this.connected = true;
    return { success: true, mode: 'production' };
  }

  async fetchEvents(filters = {}) {
    if (this.mode === 'simulation') {
      return this.generateSimulatedEvents(filters);
    }

    // TODO: Production - Query FortiSIEM incidents
    return [];
  }
}

module.exports = FortiSIEMConnector;
