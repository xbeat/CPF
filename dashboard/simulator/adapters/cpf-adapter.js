/**
 * CPF Adapter
 *
 * Mappa eventi SIEM/SOC/EDR agli indicatori CPF (1.1 - 10.10)
 * Converte eventi di sicurezza in assessments psicologici
 */

const { EVENT_BASELINE } = require('./event-baseline');

class CPFAdapter {
  constructor(denseLoader) {
    this.denseLoader = denseLoader;
    this.eventToIndicatorMap = this.buildEventMapping();
  }

  /**
   * Costruisce la mappatura Evento SIEM → Indicatori CPF
   */
  buildEventMapping() {
    return {
      // 1.x - Authority-Based Vulnerabilities
      'authentication_failed': ['1.1', '1.3', '1.5'], // Deference to authority, role confusion
      'privilege_escalation': ['1.2', '1.4', '1.6'], // Unauthorized authority assumption
      'policy_violation': ['1.7', '1.8'], // Authority bypass

      // 2.x - Temporal Vulnerabilities
      'after_hours_access': ['2.1', '2.2', '2.4'], // Time pressure, deadline manipulation
      'urgent_action_required': ['2.3', '2.5'], // Urgency exploitation
      'scheduled_task_anomaly': ['2.6', '2.7'],

      // 3.x - Social Influence Vulnerabilities
      'phishing_clicked': ['3.1', '3.2', '3.3', '3.5'], // Social engineering, peer pressure
      'email_phishing': ['3.1', '3.4'],
      'social_engineering': ['3.1', '3.2', '3.6'],
      'impersonation': ['3.7', '3.8'],
      'pretexting': ['3.9'],

      // 4.x - Affective Vulnerabilities
      'fear_based_alert': ['4.1', '4.2'], // Fear, anxiety manipulation
      'trust_exploitation': ['4.3', '4.4', '4.5'],
      'emotional_manipulation': ['4.6', '4.7'],
      'excitement_based': ['4.8'],

      // 5.x - Cognitive Overload Vulnerabilities
      'information_overload': ['5.1', '5.2'], // Too much information
      'multitasking_detected': ['5.3', '5.4'],
      'attention_fragmentation': ['5.5', '5.6'],
      'decision_fatigue': ['5.7', '5.8'],
      'complexity_exploit': ['5.9'],

      // 6.x - Group Dynamic Vulnerabilities
      'groupthink_indicator': ['6.1', '6.2'], // Groupthink, diffusion of responsibility
      'diffusion_responsibility': ['6.3', '6.4'],
      'organizational_pressure': ['6.5', '6.6'],
      'cultural_norm_violation': ['6.7'],

      // 7.x - Stress Response Vulnerabilities
      'crisis_event': ['7.1', '7.2', '7.3'], // Crisis, panic, stress
      'panic_button': ['7.4', '7.5'],
      'burnout_indicator': ['7.6', '7.7'],
      'overwhelm_detected': ['7.8'],
      'high_pressure_event': ['7.9'],

      // 8.x - Unconscious Process Vulnerabilities
      'habitual_behavior': ['8.1', '8.2'], // Automaticity, implicit bias
      'implicit_bias_indicator': ['8.3', '8.4'],
      'autopilot_mode': ['8.5', '8.6'],
      'routine_violation': ['8.7'],
      'muscle_memory_exploit': ['8.8'],

      // 9.x - AI-Specific Bias Vulnerabilities
      'ai_recommendation_followed': ['9.1', '9.2'], // AI trust, automation bias
      'automation_bias': ['9.3', '9.4'],
      'algorithmic_deference': ['9.5', '9.6'],
      'ai_hallucination': ['9.7'],
      'ml_model_poisoning': ['9.8'],

      // 10.x - Critical Convergent States
      'multiple_factors': ['10.1', '10.2'], // Multi-factor convergence
      'cascading_failure': ['10.3', '10.4'],
      'perfect_storm': ['10.5', '10.6'],
      'system_critical': ['10.7', '10.8'],

      // Eventi SIEM generici mappati a categorie
      'malware_detected': ['4.1', '7.2', '8.3'], // Affective + Stress + Unconscious
      'ransomware_activity': ['4.2', '7.1', '7.5', '10.3'], // High stress + convergent
      'data_exfiltration': ['1.4', '6.3', '8.2'], // Authority + Group + Unconscious
      'lateral_movement': ['1.3', '5.4', '8.5'], // Authority + Cognitive + Unconscious
      'suspicious_process': ['5.2', '8.1'], // Cognitive + Unconscious
      'brute_force_attack': ['1.1', '7.3'], // Authority + Stress
      'insider_threat_indicator': ['1.5', '2.2', '6.4', '8.6'], // Multi-factor
      'credential_theft': ['1.2', '3.3', '4.5'], // Authority + Social + Affective
      'network_traffic_anomaly': ['5.1', '8.2'], // Cognitive + Unconscious
      'security_offense': ['7.2', '10.2'], // Stress + Convergent
      'anomaly_detected': ['5.3', '8.4'], // Cognitive + Unconscious
      'correlation_event': ['10.1'], // Convergent
      'threat_intelligence_match': ['4.3', '7.4'], // Affective + Stress
      'compliance_violation': ['1.7', '6.5'], // Authority + Group
      'command_control_traffic': ['1.4', '5.6', '8.7'], // Authority + Cognitive + Unconscious
      'azure_ad_signin_anomaly': ['1.1', '2.1'], // Authority + Temporal
      'office365_suspicious_activity': ['3.4', '5.5'], // Social + Cognitive
      'cloud_resource_misconfig': ['6.6', '8.1'], // Group + Unconscious
      'identity_attack': ['1.3', '3.2'], // Authority + Social
      'endpoint_threat': ['7.3', '8.5'], // Stress + Unconscious
      'endpoint_malware': ['4.1', '7.2'], // Affective + Stress
      'behavioral_detection': ['8.2', '8.3'], // Unconscious processes
      'exploit_attempt': ['5.4', '7.1'], // Cognitive + Stress
      'fileless_attack': ['5.7', '8.6'], // Cognitive + Unconscious
      'memory_injection': ['8.4', '8.7'], // Unconscious
      'persistence_mechanism': ['1.6', '8.5'], // Authority + Unconscious
      'authentication_success': ['1.1'], // Normal authority (low risk)
      'service_disruption': ['7.1', '7.4', '10.4'], // Stress + Convergent
      'resource_exhaustion': ['5.1', '5.3', '7.6'] // Cognitive + Stress
    };
  }

  /**
   * Converte eventi SIEM in assessments CPF
   */
  async convertEventsToAssessments(events, orgId, scenario = 'normal') {
    const assessments = [];
    const indicatorAggregates = {}; // Aggrega eventi per indicatore

    events.forEach(event => {
      const indicators = this.mapEventToIndicators(event);

      indicators.forEach(indicatorId => {
        if (!indicatorAggregates[indicatorId]) {
          indicatorAggregates[indicatorId] = {
            events: [],
            totalSeverity: 0,
            maxSeverity: 0
          };
        }

        indicatorAggregates[indicatorId].events.push(event);

        const severityValue = this.severityToNumeric(event.severity);
        indicatorAggregates[indicatorId].totalSeverity += severityValue;
        indicatorAggregates[indicatorId].maxSeverity = Math.max(
          indicatorAggregates[indicatorId].maxSeverity,
          severityValue
        );
      });
    });

    // Crea assessment per ogni indicatore affetto
    for (const [indicatorId, aggregate] of Object.entries(indicatorAggregates)) {
      const assessment = this.createAssessment(
        indicatorId,
        aggregate,
        orgId,
        scenario
      );
      assessments.push(assessment);
    }

    return assessments;
  }

  /**
   * Mappa un evento agli indicatori CPF
   */
  mapEventToIndicators(event) {
    // Cerca mapping esatto per tipo evento
    let indicators = this.eventToIndicatorMap[event.type] || [];

    // Se non trovato, usa mapping generico basato su severity
    if (indicators.length === 0) {
      indicators = this.genericMapping(event);
    }

    return indicators;
  }

  /**
   * Mapping generico basato su severity e metadati
   */
  genericMapping(event) {
    const indicators = [];

    // Eventi high/critical attivano stress e convergent
    if (['high', 'critical'].includes(event.severity)) {
      indicators.push('7.1', '7.2'); // Stress
      if (event.severity === 'critical') {
        indicators.push('10.1'); // Convergent
      }
    }

    // Eventi con user coinvolto attivano authority
    if (event.metadata?.user || event.user) {
      indicators.push('1.1');
    }

    // Eventi fuori orario attivano temporal
    const hour = new Date(event.timestamp).getHours();
    if (hour < 6 || hour > 20) {
      indicators.push('2.1');
    }

    // Default fallback
    if (indicators.length === 0) {
      indicators.push('8.1'); // Unconscious process generico
    }

    return indicators;
  }

  /**
   * Crea un assessment CPF da eventi aggregati
   */
  createAssessment(indicatorId, aggregate, orgId, scenario) {
    const indicator = this.denseLoader.getIndicator(indicatorId);
    if (!indicator) {
      throw new Error(`Invalid indicator ID: ${indicatorId}`);
    }

    const eventCount = aggregate.events.length;
    const avgSeverity = aggregate.totalSeverity / eventCount;
    const maxSeverity = aggregate.maxSeverity;

    // Estrai tipo evento (usa il primo se ci sono eventi multipli)
    const eventType = aggregate.events[0]?.type || 'unknown';

    // Calcola bayesian score basato su eventi
    const bayesianScore = this.calculateBayesianScore(
      indicator,
      indicatorId,
      eventType,
      eventCount,
      avgSeverity,
      maxSeverity,
      scenario,
      aggregate.events // Passa gli eventi per context analysis
    );

    // Calcola confidence basato su numero di osservazioni
    const confidence = this.denseLoader.calculateConfidence(eventCount);

    // Determina maturity level
    const maturityLevel = this.calculateMaturityLevel(bayesianScore);

    const assessment = {
      indicator_id: indicatorId,
      title: `SIEM-generated assessment for ${indicatorId}`,
      category: indicator.categoryName,
      bayesian_score: bayesianScore,
      confidence: confidence,
      maturity_level: maturityLevel,
      assessor: 'SIEM-Simulator',
      assessment_date: new Date().toISOString(),

      raw_data: {
        source: 'simulator',
        scenario: scenario,
        event_count: eventCount,
        avg_severity: avgSeverity,
        max_severity: maxSeverity,
        events_summary: aggregate.events.map(e => ({
          id: e.id,
          type: e.type,
          severity: e.severity,
          timestamp: e.timestamp,
          source: e.source
        })),

        // Dati per Bayesian
        soc_values: [{
          timestamp: new Date().toISOString(),
          value: bayesianScore,
          confidence: confidence,
          source: 'siem-events',
          event_count: eventCount
        }]
      }
    };

    return assessment;
  }

  /**
   * Calcola Bayesian score da eventi
   * Usa baseline deterministici da EVENT_BASELINE + modulazione dinamica + context
   */
  calculateBayesianScore(indicator, indicatorId, eventType, eventCount, avgSeverity, maxSeverity, scenario, events = []) {
    // 1. BASE RISK DETERMINISTICO (da EVENT_BASELINE)
    let baseRisk = 0.5; // Fallback default

    if (EVENT_BASELINE[eventType] && EVENT_BASELINE[eventType][indicatorId]) {
      // Usa baseline deterministico specifico evento-indicatore
      baseRisk = EVENT_BASELINE[eventType][indicatorId];
    } else {
      // Fallback al baseline generico della categoria (da denseLoader)
      baseRisk = indicator.baselineRisk;
    }

    let score = baseRisk;

    // 2. MODULAZIONE DINAMICA

    // Incrementa in base al numero di eventi (logaritmico)
    // Formula: log10(n+1) / 2 dà 0.0 per 1 evento, 0.15 per 10 eventi, 0.25 per 100 eventi
    const eventFactor = Math.min(1.0, Math.log10(eventCount + 1) / 2);
    score += eventFactor * 0.2;

    // Incrementa in base alla severity media
    score += avgSeverity * 0.15;

    // Incrementa in base alla severity massima
    score += maxSeverity * 0.1;

    // 3. BAYESIAN CONTEXT ADJUSTMENT (Dense Paper formula)
    // P(legitimate|factors) = P(factors|legitimate)·P(legitimate) / P(factors)
    // Factors: time_of_day, request_pattern, verification_attempted
    const contextAdjustment = this.calculateBayesianContext(events, eventType, indicatorId);
    score *= contextAdjustment;

    // 4. SCENARIO MULTIPLIER
    // Scenari di attacco aumentano il rischio del 30%
    if (scenario !== 'normal') {
      score *= 1.3;
    }

    // Limita tra 0 e 1
    return Math.max(0, Math.min(1, score));
  }

  /**
   * Calcola aggiustamento Bayesiano basato sul contesto
   * Formula Dense Paper: P(legitimate|factors) = P(factors|legitimate)·P(legitimate) / P(factors)
   *
   * Factors:
   * - time_of_day: Eventi fuori orario sono più sospetti
   * - request_pattern: Pattern insoliti aumentano rischio
   * - verification_attempted: Verifiche riducono rischio
   *
   * Returns: moltiplicatore tra 0.5 (molto ridotto) e 1.5 (molto aumentato)
   */
  calculateBayesianContext(events, eventType, indicatorId) {
    if (!events || events.length === 0) {
      return 1.0; // Nessun aggiustamento se non ci sono eventi
    }

    let adjustment = 1.0;

    // Usa il primo evento per estrarre il contesto
    const event = events[0];

    // FACTOR 1: Time of Day
    // Eventi fuori orario lavorativo (18:00-08:00) sono più sospetti
    if (event.timestamp) {
      const hour = new Date(event.timestamp).getHours();
      const isAfterHours = hour < 8 || hour >= 18;

      if (isAfterHours) {
        // Fuori orario aumenta rischio del 20%
        adjustment *= 1.2;
      } else {
        // Orario normale riduce leggermente rischio (5%)
        adjustment *= 0.95;
      }
    }

    // FACTOR 2: Request Pattern
    // Eventi ripetitivi ravvicinati indicano automazione o attacco
    if (events.length > 1) {
      const timestamps = events.map(e => new Date(e.timestamp).getTime());
      const timeDeltas = [];

      for (let i = 1; i < timestamps.length; i++) {
        timeDeltas.push(timestamps[i] - timestamps[i-1]);
      }

      // Calcola deviazione standard dei delta temporali
      const avgDelta = timeDeltas.reduce((a, b) => a + b, 0) / timeDeltas.length;
      const variance = timeDeltas.reduce((acc, delta) =>
        acc + Math.pow(delta - avgDelta, 2), 0) / timeDeltas.length;
      const stdDev = Math.sqrt(variance);

      // Pattern molto regolare (bassa std dev) = possibile automazione/script
      if (stdDev < avgDelta * 0.1) { // < 10% di variazione
        adjustment *= 1.25; // Aumenta rischio del 25%
      }
    }

    // FACTOR 3: Verification Attempted
    // Se evento ha metadata che indica tentativo di verifica, riduce rischio
    if (event.metadata) {
      const metadata = event.metadata;

      // Verifica multi-fattore riduce rischio
      if (metadata.mfa_verified || metadata.verification_attempted) {
        adjustment *= 0.7; // Riduce rischio del 30%
      }

      // Verifica manuale/umana riduce rischio
      if (metadata.human_verified) {
        adjustment *= 0.6; // Riduce rischio del 40%
      }

      // Source trusted riduce rischio
      if (metadata.trusted_source) {
        adjustment *= 0.8; // Riduce rischio del 20%
      }

      // Source unknown/untrusted aumenta rischio
      if (metadata.untrusted_source || metadata.unknown_source) {
        adjustment *= 1.3; // Aumenta rischio del 30%
      }
    }

    // FACTOR 4: User Context (se disponibile)
    if (event.user || event.metadata?.user) {
      const user = event.user || event.metadata.user;

      // Privileged user con azione insolita = più rischioso
      if (user.is_admin || user.is_privileged) {
        adjustment *= 1.15; // Aumenta rischio del 15%
      }

      // New user = più sospetto
      if (user.is_new || user.account_age_days < 30) {
        adjustment *= 1.2; // Aumenta rischio del 20%
      }
    }

    // FACTOR 5: Geographic Context
    if (event.metadata?.geo) {
      const geo = event.metadata.geo;

      // Location insolita o VPN
      if (geo.is_unusual || geo.is_vpn || geo.is_tor) {
        adjustment *= 1.3; // Aumenta rischio del 30%
      }

      // Geo impossible travel (due login da location distanti in poco tempo)
      if (geo.impossible_travel) {
        adjustment *= 1.5; // Aumenta rischio del 50%
      }
    }

    // Limita adjustment tra 0.5 e 1.5
    return Math.max(0.5, Math.min(1.5, adjustment));
  }

  /**
   * Calcola maturity level da bayesian score
   */
  calculateMaturityLevel(bayesianScore) {
    if (bayesianScore >= 0.85) return 'critical';
    if (bayesianScore >= 0.66) return 'high';
    if (bayesianScore >= 0.33) return 'medium';
    return 'low';
  }

  /**
   * Converte severity in valore numerico
   */
  severityToNumeric(severity) {
    const map = {
      'critical': 1.0,
      'high': 0.75,
      'medium': 0.5,
      'low': 0.25,
      'info': 0.1
    };
    return map[severity] || 0.5;
  }

  /**
   * Analizza eventi per pattern di convergenza
   */
  detectConvergence(events) {
    // Cerca eventi multipli in finestra temporale stretta
    const timeWindow = 5 * 60 * 1000; // 5 minuti
    const convergenceThreshold = 5; // 5+ eventi diversi

    const now = Date.now();
    const recentEvents = events.filter(e =>
      now - new Date(e.timestamp).getTime() < timeWindow
    );

    const uniqueTypes = new Set(recentEvents.map(e => e.type));

    if (uniqueTypes.size >= convergenceThreshold) {
      return {
        detected: true,
        eventCount: recentEvents.length,
        uniqueTypes: uniqueTypes.size,
        indicators: ['10.1', '10.2', '10.3'] // Convergent states
      };
    }

    return { detected: false };
  }

  /**
   * Ottiene statistiche di mappatura
   */
  getMappingStats() {
    const totalMappings = Object.keys(this.eventToIndicatorMap).length;
    const indicatorsCovered = new Set();

    Object.values(this.eventToIndicatorMap).forEach(indicators => {
      indicators.forEach(id => indicatorsCovered.add(id));
    });

    return {
      totalEventTypes: totalMappings,
      indicatorsCovered: indicatorsCovered.size,
      coveragePercentage: (indicatorsCovered.size / 100) * 100
    };
  }
}

module.exports = CPFAdapter;
