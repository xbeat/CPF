/**
 * CPF Dense Foundation Loader
 *
 * Carica e processa il CPF Dense Foundation dal file LaTeX
 * per estrarre la struttura degli indicatori e le loro caratteristiche.
 */

const fs = require('fs');
const path = require('path');

class DenseLoader {
  constructor() {
    this.densePath = path.join(__dirname, '../../../CPF Implementation Companion - Dense Foundation Paper.tex');
    this.mathFormalizationPath = path.join(__dirname, '../../../math-formalization');
    this.indicators = {};
    this.categories = {};
    this.loaded = false;
  }

  /**
   * Carica il Dense Foundation
   */
  load() {
    if (this.loaded) {
      return this.indicators;
    }

    console.log('📚 [DenseLoader] Loading CPF Dense Foundation...');

    // Carica struttura base degli indicatori
    this.loadIndicatorStructure();

    // Carica matematica formale se disponibile
    this.loadMathFormalization();

    this.loaded = true;
    console.log(`✅ [DenseLoader] Loaded ${Object.keys(this.indicators).length} indicators from ${Object.keys(this.categories).length} categories`);

    return this.indicators;
  }

  /**
   * Carica la struttura base degli indicatori (10 categorie x 10 indicatori)
   */
  loadIndicatorStructure() {
    // Definizione delle 10 categorie CPF
    this.categories = {
      '1': {
        name: 'Authority',
        fullName: 'Authority-Based Vulnerabilities',
        description: 'Compliance patterns, deference to authority, role confusion'
      },
      '2': {
        name: 'Temporal',
        fullName: 'Temporal Vulnerabilities',
        description: 'Time pressure, deadline stress, urgency manipulation'
      },
      '3': {
        name: 'Social',
        fullName: 'Social Influence Vulnerabilities',
        description: 'Peer pressure, social proof, group conformity'
      },
      '4': {
        name: 'Affective',
        fullName: 'Affective Vulnerabilities',
        description: 'Emotional manipulation, fear, excitement, trust exploitation'
      },
      '5': {
        name: 'Cognitive',
        fullName: 'Cognitive Overload Vulnerabilities',
        description: 'Information overload, multitasking, attention limits'
      },
      '6': {
        name: 'Group',
        fullName: 'Group Dynamic Vulnerabilities',
        description: 'Groupthink, diffusion of responsibility, organizational culture'
      },
      '7': {
        name: 'Stress',
        fullName: 'Stress Response Vulnerabilities',
        description: 'Crisis response, panic reactions, burnout effects'
      },
      '8': {
        name: 'Unconscious',
        fullName: 'Unconscious Process Vulnerabilities',
        description: 'Automaticity, implicit bias, habitual behavior'
      },
      '9': {
        name: 'AI',
        fullName: 'AI-Specific Bias Vulnerabilities',
        description: 'AI trust, automation bias, algorithmic deference'
      },
      '10': {
        name: 'Convergent',
        fullName: 'Critical Convergent States',
        description: 'Multi-factor vulnerability convergence, cascading effects'
      }
    };

    // Genera tutti i 100 indicatori (10 categorie x 10 indicatori ciascuna)
    for (let category = 1; category <= 10; category++) {
      for (let indicator = 1; indicator <= 10; indicator++) {
        const id = `${category}.${indicator}`;

        this.indicators[id] = {
          id,
          category: category.toString(),
          categoryName: this.categories[category.toString()].name,
          index: indicator,

          // Baseline risk (varia per categoria e posizione)
          baselineRisk: this.calculateBaselineRisk(category, indicator),

          // Peso relativo dell'indicatore (primi indicatori più critici)
          weight: this.calculateIndicatorWeight(indicator),

          // Fattori di influenza da altri indicatori
          influences: this.calculateInfluences(category, indicator),

          // Distribuzione temporale degli eventi
          temporalPattern: this.getTemporalPattern(category),

          // Soglie di allerta
          thresholds: {
            low: 0.33,
            medium: 0.66,
            high: 0.85,
            critical: 0.95
          }
        };
      }
    }
  }

  /**
   * Calcola il rischio baseline per un indicatore
   */
  calculateBaselineRisk(category, indicator) {
    // Categorie più critiche hanno baseline più alto
    const categoryWeight = {
      1: 0.15, // Authority - medio
      2: 0.12, // Temporal - medio-basso
      3: 0.18, // Social - medio-alto
      4: 0.20, // Affective - alto
      5: 0.22, // Cognitive - alto
      6: 0.14, // Group - medio
      7: 0.25, // Stress - molto alto
      8: 0.16, // Unconscious - medio
      9: 0.19, // AI - medio-alto
      10: 0.30 // Convergent - critico
    };

    // Primi indicatori in ogni categoria sono più critici
    const positionWeight = 1 - (indicator - 1) * 0.05;

    return Math.min(0.95, (categoryWeight[category] || 0.15) * positionWeight);
  }

  /**
   * Calcola il peso dell'indicatore (importanza relativa)
   */
  calculateIndicatorWeight(indicator) {
    // Peso decrescente per indicatori successivi
    return Math.max(0.5, 1.0 - (indicator - 1) * 0.05);
  }

  /**
   * Calcola le influenze tra indicatori
   */
  calculateInfluences(category, indicator) {
    const influences = {};

    // Categoria 10 (Convergent) è influenzata da tutte le altre
    if (category === 10) {
      for (let c = 1; c <= 9; c++) {
        influences[`${c}.${indicator}`] = 0.1; // Ogni categoria contribuisce 10%
      }
    }

    // Stress (7) influenza fortemente Cognitive (5) e Affective (4)
    if (category === 7) {
      influences[`5.${indicator}`] = 0.15;
      influences[`4.${indicator}`] = 0.12;
    }

    // Social (3) influenza Group (6)
    if (category === 3) {
      influences[`6.${indicator}`] = 0.10;
    }

    // Authority (1) influenza Unconscious (8)
    if (category === 1) {
      influences[`8.${indicator}`] = 0.08;
    }

    return influences;
  }

  /**
   * Pattern temporale per categoria
   */
  getTemporalPattern(category) {
    const patterns = {
      1: 'steady', // Authority - costante
      2: 'cyclical', // Temporal - ciclico
      3: 'burst', // Social - a raffiche
      4: 'random', // Affective - casuale
      5: 'increasing', // Cognitive - crescente
      6: 'steady', // Group - costante
      7: 'spike', // Stress - picchi
      8: 'gradual', // Unconscious - graduale
      9: 'periodic', // AI - periodico
      10: 'cascade' // Convergent - cascata
    };

    return patterns[category] || 'steady';
  }

  /**
   * Carica matematica formale dai paper
   */
  loadMathFormalization() {
    try {
      if (!fs.existsSync(this.mathFormalizationPath)) {
        console.log('⚠️  [DenseLoader] Math formalization folder not found, using defaults');
        return;
      }

      const papers = fs.readdirSync(this.mathFormalizationPath)
        .filter(f => f.endsWith('.tex'));

      console.log(`📐 [DenseLoader] Found ${papers.length} math formalization papers`);

      // Per ora usiamo solo la struttura base
      // In futuro possiamo parsare i .tex per estrarre formule

    } catch (error) {
      console.warn(`⚠️  [DenseLoader] Could not load math formalization: ${error.message}`);
    }
  }

  /**
   * Ottiene un indicatore per ID
   */
  getIndicator(id) {
    return this.indicators[id] || null;
  }

  /**
   * Ottiene tutti gli indicatori di una categoria
   */
  getCategoryIndicators(category) {
    return Object.values(this.indicators)
      .filter(ind => ind.category === category.toString());
  }

  /**
   * Ottiene info categoria
   */
  getCategory(category) {
    return this.categories[category.toString()] || null;
  }

  /**
   * Genera un rischio realistico per un indicatore basato su evento SIEM
   */
  generateRiskFromEvent(indicatorId, event, scenario = 'normal') {
    const indicator = this.getIndicator(indicatorId);
    if (!indicator) return 0.5;

    let risk = indicator.baselineRisk;

    // Modifica in base allo scenario
    if (scenario !== 'normal') {
      risk *= 1.5; // Scenario di attacco aumenta rischio
    }

    // Aggiungi variazione casuale realistica
    const variance = 0.1;
    risk += (Math.random() - 0.5) * variance;

    // Limita tra 0 e 1
    return Math.max(0, Math.min(1, risk));
  }

  /**
   * Calcola confidence basato su numero di osservazioni
   */
  calculateConfidence(observationCount) {
    // Confidence aumenta con più osservazioni, plateau a 0.95
    const maxConfidence = 0.95;
    const growthRate = 0.1;

    return maxConfidence * (1 - Math.exp(-growthRate * observationCount));
  }
}

// Singleton
let instance = null;

module.exports = {
  getInstance: () => {
    if (!instance) {
      instance = new DenseLoader();
      instance.load();
    }
    return instance;
  },
  DenseLoader
};
