/**
 * Scenario Engine
 *
 * Orchestra l'esecuzione di scenari di attacco predefiniti
 */

const fs = require('fs');
const path = require('path');
const SIEMDataGenerator = require('./siem-data-generator');

class ScenarioEngine {
  constructor() {
    this.scenarios = this.loadScenarios();
    this.siemGenerator = new SIEMDataGenerator();
    this.activeScenarios = new Map(); // orgId -> scenario state
  }

  /**
   * Carica scenari da config
   */
  loadScenarios() {
    const scenariosPath = path.join(__dirname, '../config/scenarios.json');
    const data = JSON.parse(fs.readFileSync(scenariosPath, 'utf8'));
    return data.scenarios;
  }

  /**
   * Ottiene un scenario per ID
   */
  getScenario(scenarioId) {
    return this.scenarios.find(s => s.id === scenarioId);
  }

  /**
   * Lista tutti gli scenari disponibili
   */
  listScenarios() {
    return this.scenarios.map(s => ({
      id: s.id,
      name: s.name,
      category: s.category,
      description: s.description,
      duration: s.duration,
      intensity: s.intensity
    }));
  }

  /**
   * Avvia uno scenario per un'organizzazione
   */
  startScenario(orgId, scenarioId, options = {}) {
    const scenario = this.getScenario(scenarioId);
    if (!scenario) {
      throw new Error(`Scenario not found: ${scenarioId}`);
    }

    // Prepara stato scenario
    const state = {
      orgId,
      scenarioId,
      scenario,
      startTime: Date.now(),
      duration: options.duration || scenario.duration,
      intensity: options.intensity || scenario.intensity,
      sources: options.sources || ['splunk', 'qradar', 'sentinel', 'crowdstrike'],
      phase: 'initial',
      eventsGenerated: 0,
      indicatorsAffected: {},
      timeline: []
    };

    this.activeScenarios.set(orgId, state);

    console.log(`🎬 [ScenarioEngine] Starting scenario "${scenario.name}" for ${orgId}`);
    console.log(`   Duration: ${state.duration}s, Intensity: ${state.intensity}`);

    return state;
  }

  /**
   * Ferma uno scenario
   */
  stopScenario(orgId) {
    const state = this.activeScenarios.get(orgId);
    if (!state) {
      return null;
    }

    const summary = {
      orgId,
      scenarioId: state.scenarioId,
      scenarioName: state.scenario.name,
      startTime: state.startTime,
      endTime: Date.now(),
      duration: Date.now() - state.startTime,
      eventsGenerated: state.eventsGenerated,
      indicatorsAffected: Object.keys(state.indicatorsAffected).length,
      timeline: state.timeline
    };

    this.activeScenarios.delete(orgId);

    console.log(`🛑 [ScenarioEngine] Stopped scenario "${state.scenario.name}" for ${orgId}`);
    console.log(`   Events: ${summary.eventsGenerated}, Indicators: ${summary.indicatorsAffected}`);

    return summary;
  }

  /**
   * Verifica se uno scenario è attivo
   */
  isScenarioActive(orgId) {
    return this.activeScenarios.has(orgId);
  }

  /**
   * Ottiene lo stato di uno scenario attivo
   */
  getScenarioState(orgId) {
    return this.activeScenarios.get(orgId) || null;
  }

  /**
   * Genera eventi per lo scenario corrente
   */
  generateScenarioEvents(orgId) {
    const state = this.activeScenarios.get(orgId);
    if (!state) {
      return [];
    }

    const scenario = state.scenario;
    const elapsed = Date.now() - state.startTime;
    const progress = elapsed / (state.duration * 1000);

    // Scenario completato
    if (progress >= 1.0) {
      this.stopScenario(orgId);
      return [];
    }

    // Determina fase dello scenario
    state.phase = this.determinePhase(progress, scenario);

    // Genera eventi per questa iterazione
    const events = [];

    scenario.events.forEach(eventConfig => {
      // Filtra source se non disponibile
      const availableSources = eventConfig.sources
        ? eventConfig.sources.filter(s => state.sources.includes(s))
        : state.sources;

      if (availableSources.length === 0) return;

      // Calcola quanti eventi generare in base a progress e intensity
      const eventCount = this.calculateEventCount(
        eventConfig.count,
        progress,
        state.intensity,
        eventConfig.distribution
      );

      if (eventCount === 0) return;

      // Seleziona source casuale tra quelli disponibili
      const source = availableSources[Math.floor(Math.random() * availableSources.length)];

      // Genera eventi
      const generatedEvents = this.siemGenerator.generateEvents(
        source,
        eventConfig.type,
        eventCount,
        eventConfig.distribution,
        scenario.id,
        state.intensity
      );

      events.push(...generatedEvents);
      state.eventsGenerated += generatedEvents.length;
    });

    // Aggiorna timeline
    if (events.length > 0) {
      state.timeline.push({
        timestamp: new Date().toISOString(),
        phase: state.phase,
        eventCount: events.length,
        progress: Math.round(progress * 100)
      });
    }

    return events;
  }

  /**
   * Determina fase dello scenario in base al progresso
   */
  determinePhase(progress, scenario) {
    // Fasi generiche di un attacco
    if (progress < 0.15) return 'reconnaissance';
    if (progress < 0.30) return 'initial-access';
    if (progress < 0.50) return 'execution';
    if (progress < 0.70) return 'persistence';
    if (progress < 0.85) return 'privilege-escalation';
    return 'exfiltration';
  }

  /**
   * Calcola numero di eventi da generare
   */
  calculateEventCount(baseCount, progress, intensity, distribution) {
    let count = baseCount;

    // Modifica in base alla distribuzione
    switch (distribution) {
      case 'burst':
        // Tutti gli eventi all'inizio
        count = progress < 0.1 ? baseCount : 0;
        break;

      case 'gradual':
        // Crescita lineare
        count = Math.floor(baseCount * progress);
        break;

      case 'exponential':
        // Crescita esponenziale
        count = Math.floor(baseCount * Math.pow(progress, 0.5));
        break;

      case 'constant':
        // Costante nel tempo
        count = Math.floor(baseCount * 0.01); // 1% alla volta
        break;

      case 'flood':
        // Massimo rate
        count = Math.floor(baseCount * 0.1); // 10% alla volta
        break;

      case 'stealthy':
        // Basso volume distribuito
        count = Math.random() > 0.8 ? 1 : 0;
        break;

      case 'periodic':
        // Eventi periodici
        const period = 0.1; // ogni 10%
        count = Math.floor(progress / period) !== Math.floor((progress - 0.01) / period) ? 1 : 0;
        break;

      default:
        // Normal/random - distribuzione uniforme
        count = Math.floor(baseCount * 0.02); // 2% alla volta
    }

    // Modifica in base all'intensità
    const intensityMultiplier = {
      'low': 0.5,
      'medium': 1.0,
      'high': 1.5,
      'critical': 2.0
    };

    count = Math.floor(count * (intensityMultiplier[intensity] || 1.0));

    return count;
  }

  /**
   * Ottiene indicatori affetti da uno scenario
   */
  getScenarioIndicators(scenarioId) {
    const scenario = this.getScenario(scenarioId);
    if (!scenario) return {};

    return scenario.indicators || {};
  }

  /**
   * Calcola impatto di uno scenario su un indicatore
   */
  calculateScenarioImpact(scenarioId, indicatorId) {
    const indicators = this.getScenarioIndicators(scenarioId);
    return indicators[indicatorId] || 0;
  }

  /**
   * Genera report dello scenario
   */
  generateScenarioReport(orgId) {
    const state = this.activeScenarios.get(orgId);
    if (!state) {
      return null;
    }

    const elapsed = Date.now() - state.startTime;
    const progress = Math.min(1.0, elapsed / (state.duration * 1000));

    return {
      organization: orgId,
      scenario: {
        id: state.scenarioId,
        name: state.scenario.name,
        category: state.scenario.category,
        description: state.scenario.description
      },
      status: {
        phase: state.phase,
        progress: Math.round(progress * 100),
        elapsed: Math.floor(elapsed / 1000),
        remaining: Math.max(0, state.duration - Math.floor(elapsed / 1000))
      },
      statistics: {
        eventsGenerated: state.eventsGenerated,
        indicatorsAffected: Object.keys(state.indicatorsAffected).length,
        sources: state.sources,
        intensity: state.intensity
      },
      timeline: state.timeline,
      indicators: state.scenario.indicators
    };
  }

  /**
   * Ottiene tutti gli scenari attivi
   */
  getActiveScenarios() {
    const active = [];

    this.activeScenarios.forEach((state, orgId) => {
      active.push({
        orgId,
        scenarioId: state.scenarioId,
        scenarioName: state.scenario.name,
        phase: state.phase,
        eventsGenerated: state.eventsGenerated,
        startTime: state.startTime
      });
    });

    return active;
  }
}

module.exports = ScenarioEngine;
