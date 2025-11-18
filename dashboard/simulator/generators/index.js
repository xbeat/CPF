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
   *
   * Lista espansa per coprire tutti i 100 indicatori CPF
   * Eventi distribuiti su tutte le 10 categorie psicologiche
   */
  generateNormalEvents(orgConfig) {
    const events = [];

    // Eventi normali categorizzati per probabilità
    const normalEventTypes = {
      // Alta frequenza (operazioni quotidiane)
      common: [
        'authentication_failed',
        'policy_violation',
        'information_overload',
        'multitasking_detected',
        'after_hours_access'
      ],

      // Media frequenza (attività regolari)
      medium: [
        'phishing_clicked',
        'email_phishing',
        'scheduled_task_anomaly',
        'attention_fragmentation',
        'decision_fatigue',
        'habitual_behavior',
        'routine_violation',
        'ai_recommendation_followed'
      ],

      // Bassa frequenza (eventi occasionali ma importanti)
      uncommon: [
        'privilege_escalation',
        'brute_force_attack',
        'urgent_action_required',
        'social_engineering',
        'impersonation',
        'pretexting',
        'trust_exploitation',
        'emotional_manipulation',
        'complexity_exploit',
        'groupthink_indicator',
        'diffusion_responsibility',
        'organizational_pressure',
        'burnout_indicator',
        'implicit_bias_indicator',
        'autopilot_mode',
        'automation_bias',
        'algorithmic_deference',
        'behavioral_detection',
        'suspicious_process',
        'data_exfiltration'
      ],

      // Rara (eventi critici)
      rare: [
        'ransomware_activity',
        'fear_based_alert',
        'crisis_event',
        'panic_button',
        'overwhelm_detected',
        'malware_detected',
        'muscle_memory_exploit',
        'ai_hallucination',
        'ml_model_poisoning',
        'cascading_failure',
        'perfect_storm',
        'system_critical',
        'lateral_movement'
      ]
    };

    // Genera 2-5 eventi per iterazione (aumentato per più coverage)
    const count = Math.floor(Math.random() * 4) + 2;

    for (let i = 0; i < count; i++) {
      const source = orgConfig.sources[Math.floor(Math.random() * orgConfig.sources.length)];

      // Selezione ponderata per tipo di evento
      const rand = Math.random();
      let eventType;
      let severity = 'low';

      if (rand < 0.50) {
        // 50% eventi comuni
        eventType = normalEventTypes.common[Math.floor(Math.random() * normalEventTypes.common.length)];
        severity = 'low';
      } else if (rand < 0.80) {
        // 30% eventi medi
        eventType = normalEventTypes.medium[Math.floor(Math.random() * normalEventTypes.medium.length)];
        severity = 'medium';
      } else if (rand < 0.95) {
        // 15% eventi non comuni
        eventType = normalEventTypes.uncommon[Math.floor(Math.random() * normalEventTypes.uncommon.length)];
        severity = 'medium';
      } else {
        // 5% eventi rari
        eventType = normalEventTypes.rare[Math.floor(Math.random() * normalEventTypes.rare.length)];
        severity = 'high';
      }

      const event = this.siemGenerator.generateEvent(
        source,
        eventType,
        'normal',
        severity
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
