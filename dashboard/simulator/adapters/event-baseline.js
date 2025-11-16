/**
 * EVENT_BASELINE Matrix
 *
 * Baseline risk deterministici per coppie evento-indicatore
 * Basato su CPF Dense Foundation Paper
 *
 * Ogni evento ha baseline diversi per gli indicatori che triggera
 * I valori riflettono la rilevanza psicologica teorica evento→indicatore
 */

const EVENT_BASELINE = {
  // ============================================================================
  // 1.x - AUTHORITY-BASED VULNERABILITIES
  // ============================================================================

  'phishing_clicked': {
    '1.1': 0.70,  // Unquestioning compliance to apparent authority (high)
    '1.3': 0.65,  // Authority impersonation susceptibility (high)
    '1.5': 0.60,  // Fear-based compliance (medium-high)
    '1.9': 0.62,  // Authority-based social proof (medium-high)
    '3.1': 0.55,  // Social reciprocity exploitation (medium)
    '3.3': 0.58,  // Social proof manipulation (medium)
    '3.5': 0.60,  // Social commitment consistency (medium-high)
    '4.1': 0.50,  // Fear paralysis (medium if urgent language)
  },

  'authentication_failed': {
    '1.1': 0.55,  // Could be authority confusion
    '1.3': 0.65,  // Impersonation attempt (high)
    '1.5': 0.50,  // Possible fear-based response
  },

  'privilege_escalation': {
    '1.2': 0.75,  // Diffusion of responsibility (high)
    '1.4': 0.70,  // Bypassing for convenience (high)
    '1.6': 0.65,  // Authority gradient exploitation (high)
  },

  'policy_violation': {
    '1.7': 0.68,  // Technical authority claims (medium-high)
    '1.8': 0.72,  // Executive exception normalization (high)
  },

  'brute_force_attack': {
    '1.1': 0.60,  // Authority determination attempt
    '7.3': 0.55,  // Fight response (medium)
  },

  // ============================================================================
  // 2.x - TEMPORAL VULNERABILITIES
  // ============================================================================

  'after_hours_access': {
    '2.1': 0.75,  // Urgency-induced bypass (high - time pressure)
    '2.2': 0.70,  // Time scarcity exploitation (high)
    '2.4': 0.60,  // Temporal disorientation (medium-high)
  },

  'urgent_action_required': {
    '2.3': 0.80,  // Deadline-driven risk acceptance (very high)
    '2.5': 0.75,  // Hyperbolic time discounting (high)
  },

  'scheduled_task_anomaly': {
    '2.6': 0.65,  // Temporal exhaustion patterns (medium-high)
    '2.7': 0.60,  // Circadian vulnerability (medium-high)
  },

  // ============================================================================
  // 3.x - SOCIAL INFLUENCE VULNERABILITIES
  // ============================================================================

  'email_phishing': {
    '3.1': 0.72,  // Reciprocity exploitation (high)
    '3.4': 0.68,  // Liking/similarity bias (medium-high)
  },

  'social_engineering': {
    '3.1': 0.75,  // Reciprocity (high)
    '3.2': 0.70,  // Commitment escalation (high)
    '3.6': 0.65,  // Authority + Social (medium-high)
  },

  'impersonation': {
    '3.7': 0.78,  // Direct impersonation (very high)
    '3.8': 0.72,  // Identity confusion (high)
  },

  'pretexting': {
    '3.9': 0.74,  // Pretext vulnerability (high)
  },

  // ============================================================================
  // 4.x - AFFECTIVE VULNERABILITIES
  // ============================================================================

  'ransomware_activity': {
    '4.1': 0.85,  // Fear paralysis (very high - ransomware creates panic)
    '4.2': 0.82,  // Anger-induced risk-taking (very high)
    '7.1': 0.88,  // Acute stress response (critical)
    '7.5': 0.80,  // Fawn response (high - compliance under threat)
    '10.3': 0.75, // Cascading psychological failures (high)
  },

  'fear_based_alert': {
    '4.1': 0.75,  // Fear paralysis (high)
    '4.2': 0.70,  // Anger response (high)
  },

  'trust_exploitation': {
    '4.3': 0.78,  // Trust transference (very high)
    '4.4': 0.72,  // Attachment to legacy systems (high)
    '4.5': 0.68,  // Over-trusting behavior (medium-high)
  },

  'emotional_manipulation': {
    '4.6': 0.76,  // Hope/greed exploitation (high)
    '4.7': 0.70,  // Emotional contagion (high)
  },

  'excitement_based': {
    '4.8': 0.65,  // Positive affect exploitation (medium-high)
  },

  // ============================================================================
  // 5.x - COGNITIVE OVERLOAD VULNERABILITIES
  // ============================================================================

  'information_overload': {
    '5.1': 0.78,  // Alert fatigue (very high)
    '5.2': 0.75,  // Decision fatigue (high)
  },

  'multitasking_detected': {
    '5.3': 0.72,  // Task-switching cost (high)
    '5.4': 0.68,  // Divided attention (medium-high)
  },

  'attention_fragmentation': {
    '5.5': 0.70,  // Attention residue (high)
    '5.6': 0.65,  // Focus depletion (medium-high)
  },

  'decision_fatigue': {
    '5.7': 0.80,  // Working memory overflow (very high)
    '5.8': 0.75,  // Choice overload (high)
  },

  'complexity_exploit': {
    '5.9': 0.74,  // Complexity-induced errors (high)
  },

  // ============================================================================
  // 6.x - GROUP DYNAMIC VULNERABILITIES
  // ============================================================================

  'groupthink_indicator': {
    '6.1': 0.76,  // Groupthink detection (high)
    '6.2': 0.70,  // Risky shift (high)
  },

  'diffusion_responsibility': {
    '6.3': 0.72,  // Bystander effect (high)
    '6.4': 0.68,  // Social loafing (medium-high)
  },

  'organizational_pressure': {
    '6.5': 0.74,  // Organizational conformity (high)
    '6.6': 0.70,  // Dependency basic assumption (high)
  },

  'cultural_norm_violation': {
    '6.7': 0.65,  // Cultural script violation (medium-high)
  },

  // ============================================================================
  // 7.x - STRESS RESPONSE VULNERABILITIES
  // ============================================================================

  'crisis_event': {
    '7.1': 0.85,  // Acute stress response (very high - crisis)
    '7.2': 0.80,  // Chronic stress accumulation (very high)
    '7.3': 0.75,  // Fight/flight/freeze (high)
  },

  'panic_button': {
    '7.4': 0.82,  // Freeze response (very high)
    '7.5': 0.78,  // Fawn response (high)
  },

  'burnout_indicator': {
    '7.6': 0.76,  // Stress contagion (high)
    '7.7': 0.72,  // Resilience depletion (high)
  },

  'overwhelm_detected': {
    '7.8': 0.74,  // Psychological overwhelm (high)
  },

  'high_pressure_event': {
    '7.9': 0.78,  // Performance under pressure (high)
  },

  // ============================================================================
  // 8.x - UNCONSCIOUS PROCESS VULNERABILITIES
  // ============================================================================

  'malware_detected': {
    '4.1': 0.60,  // Fear response (medium-high)
    '7.2': 0.65,  // Stress accumulation (medium-high)
    '8.3': 0.55,  // Repetition compulsion (medium)
  },

  'habitual_behavior': {
    '8.1': 0.70,  // Shadow projection (high)
    '8.2': 0.65,  // Transference patterns (medium-high)
  },

  'implicit_bias_indicator': {
    '8.3': 0.72,  // Repetition compulsion (high)
    '8.4': 0.68,  // Collective unconscious (medium-high)
  },

  'autopilot_mode': {
    '8.5': 0.74,  // Automatic schema activation (high)
    '8.6': 0.70,  // Defense mechanisms (high)
  },

  'routine_violation': {
    '8.7': 0.65,  // Pattern interruption (medium-high)
  },

  'muscle_memory_exploit': {
    '8.8': 0.68,  // Procedural memory exploit (medium-high)
  },

  'behavioral_detection': {
    '8.2': 0.66,  // Behavioral unconscious patterns
    '8.3': 0.62,  // Repetitive behaviors
  },

  // ============================================================================
  // 9.x - AI-SPECIFIC BIAS VULNERABILITIES
  // ============================================================================

  'ai_recommendation_followed': {
    '9.1': 0.75,  // Anthropomorphization (high)
    '9.2': 0.78,  // Automation bias (very high)
  },

  'automation_bias': {
    '9.3': 0.80,  // Over-reliance on automation (very high)
    '9.4': 0.75,  // Complacency (high)
  },

  'algorithmic_deference': {
    '9.5': 0.72,  // Algorithmic authority (high)
    '9.6': 0.68,  // System justification (medium-high)
  },

  'ai_hallucination': {
    '9.7': 0.82,  // Hallucination acceptance (very high risk)
  },

  'ml_model_poisoning': {
    '9.8': 0.76,  // Model manipulation vulnerability (high)
  },

  // ============================================================================
  // 10.x - CRITICAL CONVERGENT STATES
  // ============================================================================

  'multiple_factors': {
    '10.1': 0.85, // Perfect storm index (very high)
    '10.2': 0.80, // Multi-factor amplification (very high)
  },

  'cascading_failure': {
    '10.3': 0.88, // Cascading psychological failures (critical)
    '10.4': 0.85, // Swiss cheese alignment (very high)
  },

  'perfect_storm': {
    '10.5': 0.90, // Threshold convergence (critical)
    '10.6': 0.87, // Vulnerability synchronization (critical)
  },

  'system_critical': {
    '10.7': 0.84, // Critical mass effects (very high)
    '10.8': 0.82, // Systemic collapse risk (very high)
  },

  // ============================================================================
  // EVENTI GENERICI MAPPATI
  // ============================================================================

  'data_exfiltration': {
    '1.4': 0.68,  // Authority bypass for convenience
    '6.3': 0.62,  // Group diffusion (insider threat)
    '8.2': 0.58,  // Unconscious transference patterns
  },

  'lateral_movement': {
    '1.3': 0.65,  // Authority impersonation
    '5.4': 0.60,  // Cognitive divided attention
    '8.5': 0.62,  // Automatic schema activation
  },

  'suspicious_process': {
    '5.2': 0.58,  // Decision fatigue (might ignore)
    '8.1': 0.55,  // Shadow projection
  },

  'insider_threat_indicator': {
    '1.5': 0.70,  // Fear-based compliance (coercion)
    '2.2': 0.62,  // Time pressure (urgency)
    '6.4': 0.68,  // Social loafing/disengagement
    '8.6': 0.65,  // Defense mechanisms (rationalization)
  },

  'credential_theft': {
    '1.2': 0.72,  // Authority diffusion
    '3.3': 0.68,  // Social proof
    '4.5': 0.64,  // Over-trusting behavior
  },

  'network_traffic_anomaly': {
    '5.1': 0.60,  // Alert fatigue (might be ignored)
    '8.2': 0.56,  // Unconscious patterns
  },

  'security_offense': {
    '7.2': 0.70,  // Stress response
    '10.2': 0.68, // Multi-factor convergence
  },

  'anomaly_detected': {
    '5.3': 0.62,  // Cognitive task-switching
    '8.4': 0.58,  // Collective unconscious normalization
  },

  'correlation_event': {
    '10.1': 0.75, // Perfect storm detection
  },

  'threat_intelligence_match': {
    '4.3': 0.65,  // Trust in threat intel
    '7.4': 0.68,  // Freeze response to known threat
  },

  'compliance_violation': {
    '1.7': 0.70,  // Technical authority claims
    '6.5': 0.66,  // Organizational conformity pressure
  },

  'command_control_traffic': {
    '1.4': 0.64,  // Authority bypass
    '5.6': 0.60,  // Focus depletion (missed)
    '8.7': 0.58,  // Pattern interruption
  },

  'azure_ad_signin_anomaly': {
    '1.1': 0.66,  // Unquestioning compliance
    '2.1': 0.70,  // Temporal urgency (if after-hours)
  },

  'office365_suspicious_activity': {
    '3.4': 0.65,  // Social liking bias
    '5.5': 0.62,  // Attention residue
  },

  'cloud_resource_misconfig': {
    '6.6': 0.64,  // Group dependency
    '8.1': 0.60,  // Shadow projection (blame cloud)
  },

  'identity_attack': {
    '1.3': 0.74,  // Authority impersonation (high)
    '3.2': 0.68,  // Commitment escalation
  },

  'endpoint_threat': {
    '7.3': 0.66,  // Fight/flight response
    '8.5': 0.62,  // Automatic schemas
  },

  'endpoint_malware': {
    '4.1': 0.68,  // Fear paralysis
    '7.2': 0.64,  // Stress accumulation
  },

  'exploit_attempt': {
    '5.4': 0.62,  // Divided attention (missed)
    '7.1': 0.65,  // Acute stress if successful
  },

  'fileless_attack': {
    '5.7': 0.68,  // Working memory overflow (hard to detect)
    '8.6': 0.64,  // Defense mechanisms (denial)
  },

  'memory_injection': {
    '8.4': 0.66,  // Collective unconscious (normalized)
    '8.7': 0.62,  // Pattern violation
  },

  'persistence_mechanism': {
    '1.6': 0.65,  // Authority gradient
    '8.5': 0.70,  // Automatic schema (habitual acceptance)
  },

  'authentication_success': {
    '1.1': 0.15,  // Normal authority compliance (low baseline)
  },

  'service_disruption': {
    '7.1': 0.78,  // Acute stress response (high)
    '7.4': 0.75,  // Freeze response (high)
    '10.4': 0.72, // Cascading failures
  },

  'resource_exhaustion': {
    '5.1': 0.70,  // Information overload
    '5.3': 0.66,  // Task-switching cost
    '7.6': 0.68,  // Stress contagion
  },

  // ============================================================================
  // EVENTI ADDIZIONALI PER COVERAGE 100%
  // ============================================================================

  // Authority crisis escalation (1.10)
  'authority_crisis_escalation': {
    '1.10': 0.78,  // Crisis authority escalation (high)
    '7.1': 0.70,   // Acute stress (high)
    '10.1': 0.65,  // Perfect storm (medium-high)
  },

  // Temporal vulnerabilities specifiche
  'deadline_pressure_event': {
    '2.8': 0.72,   // Time-based decision degradation (high)
    '2.9': 0.70,   // Temporal myopia (high)
    '2.10': 0.68,  // Time perception distortion (medium-high)
    '5.2': 0.65,   // Decision fatigue (medium-high)
  },

  // Social influence avanzata
  'social_network_manipulation': {
    '3.10': 0.74,  // Network-based influence (high)
    '6.1': 0.68,   // Groupthink (medium-high)
    '6.2': 0.66,   // Risky shift (medium-high)
  },

  // Affective vulnerabilities specifiche
  'emotional_exhaustion_event': {
    '4.9': 0.76,   // Emotional resource depletion (high)
    '4.10': 0.74,  // Affective forecasting errors (high)
    '7.6': 0.70,   // Stress contagion (high)
  },

  // Cognitive limite
  'cognitive_limit_reached': {
    '5.10': 0.80,  // Ego depletion (very high)
    '5.2': 0.75,   // Decision fatigue (high)
    '7.1': 0.68,   // Acute stress (medium-high)
  },

  // Group dynamics avanzati (Bion's basic assumptions)
  'group_dependency_pattern': {
    '6.8': 0.72,   // Pairing basic assumption (high)
    '6.9': 0.70,   // Group unconscious dynamics (high)
    '6.10': 0.68,  // Collective shadow (medium-high)
  },

  // Stress advanced
  'traumatic_stress_event': {
    '7.10': 0.82,  // Post-traumatic stress patterns (very high)
    '7.1': 0.78,   // Acute stress (high)
    '4.1': 0.75,   // Fear paralysis (high)
  },

  // Unconscious processes avanzati
  'unconscious_pattern_repetition': {
    '8.9': 0.70,   // Archetypal activation (high)
    '8.10': 0.68,  // Synchronicity phenomena (medium-high)
    '8.3': 0.66,   // Repetition compulsion (medium-high)
  },

  // AI vulnerabilities avanzate
  'ai_overreliance_event': {
    '9.9': 0.76,   // AI skill atrophy (high)
    '9.10': 0.74,  // Human-AI boundary confusion (high)
    '9.2': 0.78,   // Automation bias (very high)
  },

  // Convergent states critici
  'systemic_collapse_warning': {
    '10.9': 0.88,  // Organizational immune system failure (critical)
    '10.10': 0.90, // Total system vulnerability (critical)
    '10.1': 0.85,  // Perfect storm (very high)
    '7.1': 0.80,   // Acute stress (very high)
  },

  // Eventi generici per sicurezza coverage
  'security_policy_override': {
    '1.10': 0.70,  // Crisis escalation
    '6.5': 0.66,   // Organizational conformity
  },

  'time_critical_decision': {
    '2.8': 0.68,
    '2.9': 0.66,
    '5.2': 0.64,
  },

  'social_pressure_event': {
    '3.10': 0.70,
    '6.9': 0.65,
  },

  'emotional_trigger_event': {
    '4.9': 0.72,
    '4.10': 0.70,
  },

  'mental_exhaustion': {
    '5.10': 0.75,
    '7.6': 0.68,
  },

  'group_dynamics_event': {
    '6.8': 0.68,
    '6.10': 0.66,
  },

  'trauma_response': {
    '7.10': 0.78,
    '8.9': 0.65,
  },

  'archetypal_pattern': {
    '8.9': 0.66,
    '8.10': 0.64,
  },

  'ai_dependency': {
    '9.9': 0.72,
    '9.10': 0.70,
  },

  'system_wide_failure': {
    '10.9': 0.85,
    '10.10': 0.88,
  }
};

module.exports = { EVENT_BASELINE };
