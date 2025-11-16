/**
 * Simulator Generator Orchestrator
 *
 * Coordina dense-loader, siem-data-generator e scenario-engine
 */

const { getInstance: getDenseLoader } = require('./dense-loader');
const SIEMDataGenerator = require('./siem-data-generator');
const ScenarioEngine = require('./scenario-engine');
const CPFAdapter = require('../adapters/cpf-adapter');

class SimulatorOrchestrator {
  constructor() {
    this.denseLoader = getDenseLoader();
    this.siemGenerator = new SIEMDataGenerator();
    this.scenarioEngine = new ScenarioEngine();
    this.cpfAdapter = new CPFAdapter(this.denseLoader);

    this.running = false;
    this.activeOrganizations = new Map(); // orgId -> config
    this.intervals = new Map(); // orgId -> intervalId
    this.stats = {
      eventsGenerated: 0,
      assessmentsCreated: 0,
      startTime: null
    };
  }

  /**
   * Avvia il simulatore per un'organizzazione
   */
  start(orgId, config = {}) {
    if (this.activeOrganizations.has(orgId)) {
      throw new Error(`Simulator already running for ${orgId}`);
    }

    const defaultConfig = {
      sources: ['splunk', 'qradar', 'sentinel', 'crowdstrike'],
      scenario: 'normal',
      rate: 10, // eventi/secondo
      duration: 0 // 0 = infinito
    };

    const orgConfig = { ...defaultConfig, ...config };


    // Avvia scenario se non è "normal"
    if (orgConfig.scenario !== 'normal') {
      this.scenarioEngine.startScenario(orgId, orgConfig.scenario, {
        sources: orgConfig.sources,
        duration: orgConfig.duration
      });
    }

    // Salva configurazione
    this.activeOrganizations.set(orgId, {
      ...orgConfig,
      startTime: Date.now(),
      eventsGenerated: 0,
      assessmentsCreated: 0
    });

    // Avvia generazione eventi periodica
    const intervalMs = 1000 / orgConfig.rate;
    const intervalId = setInterval(() => {
      this.generateAndProcess(orgId);
    }, intervalMs);

    this.intervals.set(orgId, intervalId);

    if (!this.running) {
      this.running = true;
      this.stats.startTime = Date.now();
    }


    return {
      success: true,
      orgId,
      config: orgConfig
    };
  }

  /**
   * Ferma il simulatore per un'organizzazione
   */
  stop(orgId) {
    if (!this.activeOrganizations.has(orgId)) {
      return {
        success: false,
        error: `Simulator not running for ${orgId}`
      };
    }


    // Ferma interval
    const intervalId = this.intervals.get(orgId);
    if (intervalId) {
      clearInterval(intervalId);
      this.intervals.delete(orgId);
    }

    // Ferma scenario se attivo
    if (this.scenarioEngine.isScenarioActive(orgId)) {
      this.scenarioEngine.stopScenario(orgId);
    }

    // Ottieni stats
    const orgConfig = this.activeOrganizations.get(orgId);
    const stats = {
      eventsGenerated: orgConfig.eventsGenerated,
      assessmentsCreated: orgConfig.assessmentsCreated,
      duration: Math.floor((Date.now() - orgConfig.startTime) / 1000)
    };

    // Rimuovi da attivi
    this.activeOrganizations.delete(orgId);

    // Se nessuna org attiva, ferma simulatore
    if (this.activeOrganizations.size === 0) {
      this.running = false;
    }


    return {
      success: true,
      orgId,
      stats
    };
  }

  /**
   * Genera ed elabora eventi per un'organizzazione
   */
  async generateAndProcess(orgId) {
    try {
      const orgConfig = this.activeOrganizations.get(orgId);
      if (!orgConfig) return;

      let events = [];

      // Se c'è uno scenario attivo, genera eventi da scenario
      if (this.scenarioEngine.isScenarioActive(orgId)) {
        events = this.scenarioEngine.generateScenarioEvents(orgId);
      } else {
        // Altrimenti genera eventi normali
        events = this.generateNormalEvents(orgConfig);
      }

      if (events.length === 0) return;

      // Converti eventi SIEM in assessments CPF
      const assessments = await this.cpfAdapter.convertEventsToAssessments(
        events,
        orgId,
        orgConfig.scenario
      );

      // Aggiorna stats
      orgConfig.eventsGenerated += events.length;
      orgConfig.assessmentsCreated += assessments.length;
      this.stats.eventsGenerated += events.length;
      this.stats.assessmentsCreated += assessments.length;

      // Invia assessments all'API (se disponibile)
      await this.sendAssessmentsToAPI(orgId, assessments);

    } catch (error) {
      console.error(`❌ [Simulator] Error generating events for ${orgId}:`, error.message);
    }
  }

  /**
   * Genera eventi normali (non-scenario)
   */
  generateNormalEvents(orgConfig) {
    const events = [];
    const normalEventTypes = [
      'authentication_success',
      'authentication_failed',
      'network_traffic_anomaly',
      'policy_violation'
    ];

    // Genera 1-3 eventi per iterazione
    const count = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < count; i++) {
      const source = orgConfig.sources[Math.floor(Math.random() * orgConfig.sources.length)];
      const eventType = normalEventTypes[Math.floor(Math.random() * normalEventTypes.length)];

      const event = this.siemGenerator.generateEvent(
        source,
        eventType,
        'normal',
        'low'
      );

      events.push(event);
    }

    return events;
  }

  /**
   * Invia assessments all'API dashboard
   */
  async sendAssessmentsToAPI(orgId, assessments) {
    // Questa funzione sarà chiamata dal server.js che ha accesso al dataManager
    // Per ora registriamo solo a console
    if (assessments.length > 0) {
    }

    // Il server.js userà questa callback per salvare i dati
    if (this.onAssessmentsGenerated) {
      await this.onAssessmentsGenerated(orgId, assessments);
    }
  }

  /**
   * Registra callback per assessments generati
   */
  setAssessmentsCallback(callback) {
    this.onAssessmentsGenerated = callback;
  }

  /**
   * Ottiene stato del simulatore
   */
  getStatus() {
    const active = [];

    this.activeOrganizations.forEach((config, orgId) => {
      active.push({
        orgId,
        scenario: config.scenario,
        sources: config.sources,
        rate: config.rate,
        eventsGenerated: config.eventsGenerated,
        assessmentsCreated: config.assessmentsCreated,
        uptime: Math.floor((Date.now() - config.startTime) / 1000)
      });
    });

    return {
      running: this.running,
      activeOrganizations: active,
      stats: {
        ...this.stats,
        uptime: this.stats.startTime ? Math.floor((Date.now() - this.stats.startTime) / 1000) : 0
      },
      scenarios: this.scenarioEngine.getActiveScenarios()
    };
  }

  /**
   * Ottiene lista scenari disponibili
   */
  getAvailableScenarios() {
    return this.scenarioEngine.listScenarios();
  }

  /**
   * Ottiene report scenario
   */
  getScenarioReport(orgId) {
    return this.scenarioEngine.generateScenarioReport(orgId);
  }

  /**
   * Ferma tutti i simulatori
   */
  stopAll() {
    const orgs = Array.from(this.activeOrganizations.keys());


    orgs.forEach(orgId => {
      this.stop(orgId);
    });

    return {
      success: true,
      stopped: orgs.length
    };
  }
}

// Singleton
let instance = null;

module.exports = {
  getInstance: () => {
    if (!instance) {
      instance = new SimulatorOrchestrator();
    }
    return instance;
  },
  SimulatorOrchestrator
};
