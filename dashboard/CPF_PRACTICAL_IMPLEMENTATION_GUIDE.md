# CPF Practical Implementation Guide
## From Theory to Detection: Operationalizing Psychological Vulnerability Indicators

**Version:** 1.0
**Date:** 2025-11-17
**Purpose:** Bridge the Dense Foundation Paper's mathematical theory to practical, implementable detection systems

---

## Table of Contents

1. [The Fundamental Paradigm Shift](#1-the-fundamental-paradigm-shift)
2. [Architecture Overview](#2-architecture-overview)
3. [Data Generation Philosophy](#3-data-generation-philosophy)
4. [Detection Algorithms by Category](#4-detection-algorithms-by-category)
5. [Baseline Calibration Framework](#5-baseline-calibration-framework)
6. [Temporal Modeling & Decay](#6-temporal-modeling--decay)
7. [Validation Methodology](#7-validation-methodology)
8. [End-to-End Implementation Examples](#8-end-to-end-implementation-examples)
9. [Storage & Query Architecture](#9-storage--query-architecture)
10. [Deployment Roadmap](#10-deployment-roadmap)

---

## 1. The Fundamental Paradigm Shift

### ❌ What We're NOT Doing (Current Broken Approach)

```
Generate labeled event "phishing"
    ↓
Map to indicator via EVENT_BASELINE
    ↓
Indicator 1.1 = 0.85 (red)
    ↓
Result: Circular validation - of course it maps there
```

**Problem:** This is a tautology. We're testing "does my mapping function work" not "can I detect hidden psychological vulnerabilities."

### ✅ What We're ACTUALLY Doing (Detection-Based Approach)

```
Generate REALISTIC organizational data (unlabeled)
├─ 10,000 emails/day (normal business)
├─ 500 authentication events/hour
├─ 200 tickets/day
├─ 1,000 security alerts/day
└─ HIDDEN: 3-5 weak signals of psychological exploitation

    ↓

Apply DETECTION ALGORITHMS from Dense Paper
├─ Indicator 1.1: Compliance Rate Analysis
│   Formula: Cr = N_executed / N_requested
│   Trigger: Cr > μ_baseline + 2σ
│
├─ Indicator 5.1: Alert Fatigue Detection
│   Formula: Fa = 1 - (investigated/presented)
│   Model: Fa(t) = F0 · e^(λ·alert_rate·t)
│
└─ Indicator 2.1: Urgency-Induced Bypass
    Formula: Ui = (Δt_normal - Δt_urgent) / Δt_normal
    Trigger: Ui > 0.5 (50% acceleration)

    ↓

DISCOVER hidden patterns
"Alert: Authority compliance 3σ above baseline (95% vs 72%)"
"Alert: Alert investigation rate dropped to 10% (fatigue detected)"
"Alert: Time pressure correlates with 60% bypass increase"
```

**Key Insight:** Attacks hide in normal data. We must FIND them, not label them.

---

## 2. Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────┐
│  1. REALISTIC DATA GENERATOR                             │
│     Simulates organizational behavior                    │
│     - Volume: 10K-100K events/day per org               │
│     - Types: Email, Auth, Tickets, Alerts, Meetings     │
│     - Patterns: Circadian, weekly, seasonal             │
│     - Hidden signals: 0.01%-0.1% contain vulnerabilities│
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│  2. RAW EVENT STORAGE (Time-Series DB)                   │
│     InfluxDB / TimescaleDB / ClickHouse                  │
│     - Retention: Hot=7d, Warm=30d, Cold=1yr             │
│     - Measurements: emails, auths, tickets, alerts      │
│     - Tags: user, dept, severity, source                │
│     - Fields: all event attributes                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│  3. BASELINE CALIBRATION ENGINE                          │
│     30-day learning period per organization              │
│     - Calculate μ, σ for each indicator                 │
│     - Build covariance matrices Σ                       │
│     - Establish behavioral patterns                     │
│     - Detect circadian/weekly cycles                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│  4. DETECTION ALGORITHM ENGINE                           │
│     Real-time + batch processing                         │
│     ┌──────────────────────────────────────────────┐   │
│     │ Per-Indicator Detectors (100 total)          │   │
│     │ - Rule-based (Ri): Deterministic checks      │   │
│     │ - Anomaly (Ai): Mahalanobis distance         │   │
│     │ - Context (Ci): Bayesian correlation         │   │
│     │ Combined: Di = w1·Ri + w2·Ai + w3·Ci         │   │
│     └──────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│  5. BAYESIAN NETWORK (Interdependencies)                 │
│     Models how indicators influence each other           │
│     - Stress (7.1) amplifies compliance (1.1)           │
│     - Time pressure (2.x) increases cognitive load (5.x)│
│     - Group dynamics (6.x) mask individual vulns (4.x)  │
│     - Convergence detection (10.x) for perfect storms   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│  6. CPF MATRIX OUTPUT (100 Indicators)                   │
│     Final risk scores [0,1] with confidence              │
│     - Indicator scores with drill-down to raw events    │
│     - Trend analysis (improving/stable/deteriorating)   │
│     - Convergence alerts                                │
│     - Response protocol triggers                        │
└─────────────────────────────────────────────────────────┘
```

### Critical Difference from Current System

| Aspect | Current | New Approach |
|--------|---------|--------------|
| **Input** | Labeled events ("phishing") | Unlabeled realistic traffic |
| **Volume** | 10-100 events/sec | 10K-100K events/day (normal) |
| **Signal** | Explicit tags | Hidden in statistical noise |
| **Detection** | Deterministic mapping | Statistical + ML algorithms |
| **Storage** | Aggregated JSON | Raw time-series + aggregates |
| **Baseline** | None (hardcoded values) | 30-day calibration per org |
| **Validation** | None | Ground truth + MCC/RMSE metrics |

---

## 3. Data Generation Philosophy

### 3.1 Realistic vs Synthetic

**Dense Paper Quote (p.1):**
> "Each indicator maps to specific data sources, algorithms, and response protocols enabling immediate deployment."

This means we need to generate data that **looks like real SOC telemetry**, not labeled psychological attacks.

### 3.2 Data Types & Volumes

#### **A. Email Traffic**

**Volume:** 50-200 emails/user/day × 1000 users = 50K-200K/day

**Normal Distribution:**
```javascript
{
  from: {
    domain: ["company.com", "partner.com", "vendors.com"],
    distribution: [70%, 20%, 10%]
  },

  to: {
    internal: 60%,
    external: 40%
  },

  actions: {
    read: 80%,
    link_click: 5%,
    attachment_open: 3%,
    forward: 2%,
    delete_without_read: 10%
  },

  timing: {
    pattern: "circadian",
    peak_hours: [9-11, 14-16],
    weekend_ratio: 0.05
  }
}
```

**Hidden Signals (0.1% = ~50-200 per day):**
```javascript
// Authority compliance anomaly (Indicator 1.1)
{
  from: "ceo@company.com",  // Or spoofed to look like exec
  subject: "Urgent: Wire transfer needed",
  action_requested: "send money",

  // Signal: Abnormally HIGH compliance
  normal_compliance: 0.72 ± 0.08,
  injected_compliance: 0.95,  // 3σ above baseline

  // Signal: LOW verification attempts
  normal_verification: 0.35,
  injected_verification: 0.02
}

// Social proof manipulation (Indicator 3.3)
{
  from: "hr@company.com",
  subject: "Everyone has completed the security training",
  body: "You're the last one - click here to complete",

  // Signal: BERT embedding similarity to social proof phrases
  similarity_score: 0.94,  // > 0.9 threshold

  // Signal: Clicks despite being false claim
  click_through_rate: 0.45  // vs baseline 0.05
}
```

#### **B. Authentication Events**

**Volume:** 2-10 auths/user/hour × 1000 users = 2K-10K/hour

**Normal Distribution:**
```javascript
{
  event_types: {
    vpn_login: 30%,
    sso_auth: 50%,
    mfa_challenge: 15%,
    password_reset: 3%,
    failed_attempt: 2%
  },

  timing: {
    work_hours: 85%,
    after_hours: 10%,
    overnight: 5%
  },

  mfa_completion: {
    success: 98%,
    abandoned: 2%
  }
}
```

**Hidden Signals:**
```javascript
// Bypassing for convenience (Indicator 1.4)
{
  user: "exec_user_01",
  time: "18:30",  // After hours
  event: "mfa_bypass_request",

  // Signal: Exception grant rate during exec presence
  normal_bypass_rate: 0.05,
  exec_hours_bypass_rate: 0.35,  // 7x higher

  // Signal: Justification patterns
  reason: "urgent meeting",  // Temporal pressure keyword
  approval_time: "45 seconds"  // vs baseline 5 minutes
}

// Temporal exhaustion (Indicator 2.6)
{
  user: "analyst_user_42",
  time: "03:00",  // Circadian low

  // Signal: Security effectiveness degradation
  E(t) = E0 · (1 + A·sin(2π(t-φ)/24))
  baseline_error_rate: 0.02,
  night_shift_error_rate: 0.18,  // 9x worse

  mfa_abandonment_rate: 0.25  // vs 0.02 baseline
}
```

#### **C. Security Alerts**

**Volume:** 500-2000 alerts/day

**Normal Distribution:**
```javascript
{
  severity: {
    critical: 2%,
    high: 8%,
    medium: 30%,
    low: 60%
  },

  sources: {
    endpoint_av: 40%,
    firewall: 25%,
    ids_ips: 20%,
    dlp: 10%,
    other: 5%
  },

  analyst_response: {
    investigated_within_1h: 80% (critical),
    investigated_within_24h: 50% (high),
    investigated_within_week: 20% (medium),
    auto_closed: 80% (low)
  }
}
```

**Hidden Signals:**
```javascript
// Alert fatigue (Indicator 5.1)
{
  presented: 1500/day,
  investigated: 150/day,  // Only 10%

  // Formula from Dense Paper (p.3)
  Fa = 1 - (investigated/presented) = 1 - 0.1 = 0.9

  // Temporal decay model
  Fa(t) = F0 · e^(λ·alert_rate·t)

  // Detection: Fa > 0.7 threshold
  // Consequence: Real attacks in the 90% ignored
}

// Decision fatigue (Indicator 5.2)
{
  analyst: "soc_analyst_03",
  decisions_count: 250,  // In 8-hour shift

  // Signal: Error rate correlation
  early_shift_errors: 2%,   // First 100 decisions
  late_shift_errors: 18%,   // Last 100 decisions

  // Detection: Linear regression slope > threshold
  error_rate_increase: 0.16 per 100 decisions
}
```

#### **D. Ticket/Incident Data**

**Volume:** 100-500 tickets/day

**Normal Distribution:**
```javascript
{
  categories: {
    password_reset: 35%,
    access_request: 25%,
    technical_issue: 20%,
    security_incident: 5%,
    other: 15%
  },

  ownership: {
    assigned_time: "median 15min",
    first_response: "median 2h",
    resolution: "median 24h"
  },

  escalation_rate: 8%
}
```

**Hidden Signals:**
```javascript
// Diffusion of responsibility (Indicator 1.2)
{
  ticket_id: "INC-12345",
  category: "security_incident",

  // Signal: Excessive ownership transitions
  ownership_chain: [
    {owner: "tier1_analyst", duration: "10min"},
    {owner: "tier2_analyst", duration: "15min"},
    {owner: "tier1_analyst", duration: "8min"},
    {owner: "security_team", duration: "20min"}
  ],

  // Detection from Dense Paper (p.2)
  T_ownership = 4  // > 3 indicates diffusion

  // Consequence: 53 minutes passed, no real action
}

// Groupthink (Indicator 6.1)
{
  decision_point: "Approve vendor exception",
  participants: ["mgr_01", "mgr_02", "mgr_03", "mgr_04"],

  // Signal: Low diversity in decision patterns
  votes: ["approve", "approve", "approve", "approve"],

  // Formula from Dense Paper (p.3)
  D = 1 - Σ(pi²) = 1 - (1.0² + 0² + 0²) = 0

  // Detection: D < 0.3 + rapid consensus < 5min
  consensus_time: "3 minutes",
  individual_risk_tolerance: [0.4, 0.5, 0.3, 0.4],
  group_risk_tolerance: 0.8  // 2x individual average (risky shift)
}
```

### 3.3 Hidden Signal Injection Strategy

**Key Principle:** Signals must be **statistically detectable** but **not obviously labeled**.

```javascript
class RealisticDataGenerator {
  constructor(config) {
    this.normalTrafficRate = config.eventsPerDay;
    this.signalInjectionRate = 0.001;  // 0.1% contain signals
    this.signalTypes = [
      {indicator: "1.1", probability: 0.15},  // Authority compliance
      {indicator: "5.1", probability: 0.20},  // Alert fatigue
      {indicator: "2.1", probability: 0.10},  // Urgency bypass
      {indicator: "3.3", probability: 0.08},  // Social proof
      {indicator: "6.1", probability: 0.05},  // Groupthink
      // ... 95 more
    ];
  }

  generateDay(orgId) {
    const events = [];

    // Generate normal traffic
    for (let i = 0; i < this.normalTrafficRate; i++) {
      const timestamp = this.distributeCircadian(i);
      const event = this.generateNormalEvent(timestamp);
      events.push(event);
    }

    // Inject hidden signals (UNLABELED)
    const signalCount = Math.floor(
      this.normalTrafficRate * this.signalInjectionRate
    );

    for (let i = 0; i < signalCount; i++) {
      const indicatorType = this.selectWeightedRandom(this.signalTypes);
      const signal = this.injectHiddenSignal(indicatorType);

      // CRITICAL: Do NOT label this as an attack
      // It looks like normal traffic with subtle anomalies
      events.push(signal);
    }

    // Shuffle to hide injection pattern
    return this.shuffle(events);
  }

  injectHiddenSignal(indicatorType) {
    switch(indicatorType) {
      case "1.1":  // Authority compliance anomaly
        return this.createHighComplianceEmail({
          complianceRate: this.baseline.compliance + 3 * this.baseline.compliance_std,
          verificationRate: this.baseline.verification - 2 * this.baseline.verification_std,
          // Looks normal but statistically deviant
          from: this.selectExecutiveDomain(),
          urgencyMarkers: ["urgent", "immediately", "today"]
        });

      case "5.1":  // Alert fatigue
        return this.createIgnoredAlert({
          severity: "high",  // Should be investigated
          presented: true,
          investigated: false,  // But ignored
          analystId: this.selectFatiguedAnalyst(),  // High decision count today
          // Detection will catch the aggregate pattern
        });

      // ... 98 more cases
    }
  }

  // GROUND TRUTH: Track what we injected for validation
  recordGroundTruth(event, indicatorType) {
    this.groundTruth.push({
      timestamp: event.timestamp,
      eventId: event.id,
      expectedIndicator: indicatorType,
      signalStrength: event.deviationFromBaseline,  // In sigmas
      hidden: true  // Not visible to detection algorithms
    });
  }
}
```

---

## 4. Detection Algorithms by Category

### 4.1 Universal Detection Framework

**From Dense Paper (p.1):**

> Each indicator's detection logic combines deterministic rules with statistical anomaly detection. The base detection function Di for indicator i evaluates:
>
> **Di = w1 · Ri + w2 · Ai + w3 · Ci**
>
> where:
> - **Ri** = rule-based detection (binary: 0 or 1)
> - **Ai** = anomaly score (continuous: 0 to 1)
> - **Ci** = contextual correlation (normalized: 0 to 1)
> - **w1, w2, w3** = weights calibrated per organization

#### Anomaly Detection (Mahalanobis Distance)

**From Dense Paper (p.1):**

> The anomaly detection employs Mahalanobis distance to account for correlation between observables:
>
> **Ai = sqrt((xi - μi)ᵀ Σi⁻¹ (xi - μi))**
>
> where:
> - **xi** = observation vector
> - **μi** = baseline mean
> - **Σi** = covariance matrix (updated via EWMA)

**Practical Implementation:**

```javascript
class AnomalyDetector {
  constructor(indicatorId) {
    this.indicatorId = indicatorId;
    this.baseline = {
      mean: null,        // μi - learned during calibration
      covariance: null,  // Σi - covariance matrix
      std: null          // σi - standard deviation
    };
  }

  /**
   * Calculate Mahalanobis distance for multi-dimensional anomaly
   * Example: Indicator 1.1 observes [compliance_rate, verification_rate, response_time]
   */
  calculateMahalanobisDistance(observation) {
    // observation xi = [0.95, 0.02, 120]  (current values)
    // baseline μi     = [0.72, 0.35, 300]  (30-day average)

    const diff = this.subtract(observation, this.baseline.mean);
    // diff = [0.23, -0.33, -180]

    const covInverse = this.invertMatrix(this.baseline.covariance);

    // Distance = sqrt(diffᵀ · Σ⁻¹ · diff)
    const distance = Math.sqrt(
      this.multiply(
        this.multiply(this.transpose(diff), covInverse),
        diff
      )
    );

    // Normalize to [0, 1] using chi-squared distribution
    const anomalyScore = this.chiSquaredCDF(distance, observation.length);

    return anomalyScore;  // Ai
  }

  /**
   * Update baseline using Exponential Weighted Moving Average
   * This allows baseline to adapt to organizational changes
   */
  updateBaseline(newObservation, alpha = 0.1) {
    if (!this.baseline.mean) {
      // First observation - initialize
      this.baseline.mean = newObservation;
      this.baseline.covariance = this.identityMatrix(newObservation.length);
    } else {
      // EWMA update from Dense Paper (p.1)
      // μ_new = α·x + (1-α)·μ_old
      this.baseline.mean = this.add(
        this.multiply(alpha, newObservation),
        this.multiply(1 - alpha, this.baseline.mean)
      );

      // Update covariance matrix
      const diff = this.subtract(newObservation, this.baseline.mean);
      const outerProduct = this.outerProduct(diff, diff);

      this.baseline.covariance = this.add(
        this.multiply(alpha, outerProduct),
        this.multiply(1 - alpha, this.baseline.covariance)
      );
    }
  }
}
```

### 4.2 Category 1: Authority-Based Vulnerabilities (1.1-1.10)

#### **Indicator 1.1: Unquestioning Compliance**

**Dense Paper (p.2):**
> Indicator 1.1 operationalizes through continuous monitoring of the compliance rate function **Cr = N_executed / N_requested** where requests originate from authority domain patterns. Detection triggers when **Cr > μ_baseline + 2σ** within window W = 3600s.

**Practical Implementation:**

```javascript
class Indicator_1_1_Detector {
  /**
   * Observables (O):
   * - Email requests from executive domains
   * - User actions (executed vs ignored)
   * - Verification attempts (call-backs, confirmations)
   */
  observables = {
    executiveDomains: ["@company.com", "ceo@", "cfo@", "board@"],
    actionKeywords: ["transfer", "send", "approve", "grant", "wire"],
    timeWindow: 3600  // seconds
  };

  /**
   * Data Sources (F):
   * - Exchange message tracking logs
   * - Email gateway logs
   * - Action audit logs (financial systems, approvals)
   */
  dataSources = [
    "exchange.message_tracking",
    "email_gateway.logs",
    "financial_system.transactions",
    "approval_system.audit"
  ];

  /**
   * Detection Logic (L)
   */
  async detect(orgId, timeWindow = 3600) {
    const now = Date.now();
    const windowStart = now - (timeWindow * 1000);

    // Query: Requests from authority domains in time window
    const requests = await this.queryTimeSeries(
      `SELECT * FROM emails
       WHERE org_id = '${orgId}'
       AND timestamp >= ${windowStart}
       AND sender_domain IN (${this.observables.executiveDomains})
       AND body CONTAINS_ANY (${this.observables.actionKeywords})`
    );

    const N_requested = requests.length;

    // Query: How many were executed?
    const executed = requests.filter(req =>
      this.wasActionExecuted(req.id)
    );

    const N_executed = executed.length;

    // Formula from Dense Paper
    const Cr = N_requested > 0 ? N_executed / N_requested : 0;

    // Get baseline for this org
    const baseline = await this.getBaseline(orgId, "1.1");
    const μ = baseline.mean;        // e.g., 0.72
    const σ = baseline.std;         // e.g., 0.08
    const threshold = μ + (2 * σ);  // e.g., 0.88

    // Rule-based detection (Ri)
    const Ri = Cr > threshold ? 1 : 0;

    // Anomaly detection (Ai) - multi-dimensional
    const verificationRate = this.calculateVerificationRate(requests);
    const responseTime = this.calculateMedianResponseTime(requests);

    const observation = [Cr, verificationRate, responseTime];
    const Ai = this.calculateMahalanobisDistance(observation);

    // Contextual correlation (Ci) - Bayesian factors
    const factors = {
      timeOfDay: this.getTimeOfDay(now),
      isAfterHours: this.isAfterHours(now),
      senderReputation: await this.getSenderReputation(requests[0]?.sender),
      historicalPattern: await this.getHistoricalPattern(orgId, requests[0]?.sender)
    };

    const Ci = this.calculateBayesianContext(factors);

    // Combined detection score from Dense Paper
    const weights = baseline.weights || {w1: 0.4, w2: 0.4, w3: 0.2};
    const Di = (weights.w1 * Ri) + (weights.w2 * Ai) + (weights.w3 * Ci);

    return {
      indicator: "1.1",
      score: Di,
      confidence: this.calculateConfidence(N_requested, baseline.sampleSize),
      details: {
        complianceRate: Cr,
        baseline: μ,
        threshold: threshold,
        sigmasAboveBaseline: (Cr - μ) / σ,
        requestCount: N_requested,
        executedCount: N_executed,
        verificationRate: verificationRate
      },
      rawEvents: requests.map(r => r.id),  // For drill-down
      triggered: Di > 0.7  // Threshold for alert
    };
  }

  /**
   * Bayesian update for authority legitimacy
   * Dense Paper (p.2): P(legitimate|factors) = P(factors|legitimate)·P(legitimate) / P(factors)
   */
  calculateBayesianContext(factors) {
    const priors = {
      afterHours: {legitimate: 0.3, attack: 0.7},
      knownSender: {legitimate: 0.9, attack: 0.1},
      urgentLanguage: {legitimate: 0.4, attack: 0.8},
      noVerification: {legitimate: 0.2, attack: 0.9}
    };

    let P_legitimate = 0.95;  // Prior: most emails are legitimate

    // Update based on factors
    if (factors.isAfterHours) {
      P_legitimate *= priors.afterHours.legitimate;
    }
    if (factors.senderReputation < 0.5) {
      P_legitimate *= priors.knownSender.attack;
    }

    // Normalize to [0, 1]
    return 1 - P_legitimate;  // Return suspicion score
  }

  /**
   * Check if action was actually executed
   * Looks in downstream systems (financial, approval, file shares)
   */
  async wasActionExecuted(emailId) {
    // Check financial system
    const wireTransfer = await this.queryDB(
      `SELECT * FROM wire_transfers
       WHERE reference_email_id = '${emailId}'
       AND status = 'completed'
       AND timestamp WITHIN 1 HOUR OF email.timestamp`
    );

    if (wireTransfer) return true;

    // Check approval system
    const approval = await this.queryDB(
      `SELECT * FROM approvals
       WHERE triggered_by_email = '${emailId}'
       AND action = 'granted'`
    );

    if (approval) return true;

    // Check file share access
    // ... etc

    return false;
  }
}
```

**Example Output:**

```javascript
{
  indicator: "1.1",
  score: 0.87,  // HIGH - likely vulnerability
  confidence: 0.82,
  details: {
    complianceRate: 0.95,        // 95% compliance
    baseline: 0.72,              // vs 72% baseline
    threshold: 0.88,             // threshold is 88%
    sigmasAboveBaseline: 2.875,  // 2.9σ above baseline!
    requestCount: 23,            // 23 requests from exec domain
    executedCount: 22,           // 22 executed (only 1 ignored)
    verificationRate: 0.04       // Only 4% verified (vs 35% baseline)
  },
  rawEvents: ["email-12345", "email-12346", ...],
  triggered: true,

  // Human-readable explanation
  explanation: "Authority compliance is 2.9 standard deviations above baseline. " +
               "Employees executing 95% of executive requests with minimal verification (4% vs 35% baseline). " +
               "This indicates high susceptibility to authority-based social engineering."
}
```

#### **Indicator 1.2: Diffusion of Responsibility**

**Dense Paper (p.2):**
> Diffusion of responsibility (1.2) tracks ticket ownership transitions where **T_ownership > 3** within incident lifecycle indicates diffusion.

**Practical Implementation:**

```javascript
class Indicator_1_2_Detector {
  observables = {
    ticketSystems: ["ServiceNow", "Jira", "Remedy"],
    criticalCategories: ["security_incident", "data_breach", "unauthorized_access"],
    ownershipThreshold: 3  // transitions
  };

  async detect(orgId, timeWindow = 86400) {  // 24 hours
    // Query: Security incidents in time window
    const incidents = await this.queryTimeSeries(
      `SELECT * FROM tickets
       WHERE org_id = '${orgId}'
       AND category IN (${this.observables.criticalCategories})
       AND created_at >= NOW() - INTERVAL '${timeWindow}' SECOND
       AND status != 'closed'`
    );

    const diffusionInstances = [];

    for (const incident of incidents) {
      // Get ownership chain
      const ownershipChain = await this.getOwnershipHistory(incident.id);

      const T_ownership = ownershipChain.length;

      if (T_ownership > this.observables.ownershipThreshold) {
        // Calculate time wasted in transitions
        const transitionTime = ownershipChain.reduce((sum, owner) => {
          return sum + owner.duration;
        }, 0);

        // Calculate actual work time
        const workTime = await this.calculateActualWorkTime(incident.id);

        const wasteRatio = transitionTime / (transitionTime + workTime);

        diffusionInstances.push({
          incidentId: incident.id,
          transitions: T_ownership,
          transitionTime: transitionTime,
          workTime: workTime,
          wasteRatio: wasteRatio,
          ownershipChain: ownershipChain
        });
      }
    }

    // Aggregate score
    const diffusionRate = diffusionInstances.length / incidents.length;

    // Compare to baseline
    const baseline = await this.getBaseline(orgId, "1.2");
    const Ri = diffusionRate > (baseline.mean + 2 * baseline.std) ? 1 : 0;

    // Anomaly score
    const observation = [
      diffusionRate,
      this.median(diffusionInstances.map(d => d.transitions)),
      this.median(diffusionInstances.map(d => d.wasteRatio))
    ];
    const Ai = this.calculateMahalanobisDistance(observation);

    // Contextual factors
    const Ci = this.calculateContext({
      orgSize: await this.getOrgSize(orgId),
      teamStructure: await this.getTeamStructure(orgId),
      workload: await this.getCurrentWorkload(orgId)
    });

    const weights = baseline.weights || {w1: 0.3, w2: 0.5, w3: 0.2};
    const Di = (weights.w1 * Ri) + (weights.w2 * Ai) + (weights.w3 * Ci);

    return {
      indicator: "1.2",
      score: Di,
      confidence: this.calculateConfidence(incidents.length, baseline.sampleSize),
      details: {
        diffusionRate: diffusionRate,
        baseline: baseline.mean,
        incidentsAnalyzed: incidents.length,
        diffusionInstances: diffusionInstances.length,
        averageTransitions: this.mean(diffusionInstances.map(d => d.transitions)),
        averageWasteRatio: this.mean(diffusionInstances.map(d => d.wasteRatio))
      },
      rawEvents: diffusionInstances.map(d => d.incidentId),
      triggered: Di > 0.7,

      explanation: `${diffusionInstances.length} of ${incidents.length} security incidents (${(diffusionRate*100).toFixed(1)}%) ` +
                   `show responsibility diffusion (>3 ownership transfers). ` +
                   `Average ${this.mean(diffusionInstances.map(d => d.wasteRatio)*100).toFixed(1)}% of time wasted in transitions.`
    };
  }
}
```

### 4.3 Category 2: Temporal Vulnerabilities (2.1-2.10)

#### **Indicator 2.1: Urgency-Induced Bypass**

**Dense Paper (p.2):**
> Urgency-induced bypass (2.1) quantifies through **Ui = (Δt_normal - Δt_urgent) / Δt_normal** where Δt represents task completion time. When **Ui > 0.5**, indicating 50% acceleration, security control effectiveness degrades predictably.

**Practical Implementation:**

```javascript
class Indicator_2_1_Detector {
  observables = {
    urgencyKeywords: [
      "urgent", "immediately", "asap", "now", "today",
      "critical", "emergency", "time-sensitive", "deadline"
    ],
    taskTypes: [
      "approval_request",
      "access_grant",
      "policy_exception",
      "security_review"
    ]
  };

  async detect(orgId, timeWindow = 86400) {
    // Query: All tasks completed in time window
    const tasks = await this.queryTimeSeries(
      `SELECT * FROM tasks
       WHERE org_id = '${orgId}'
       AND completed_at >= NOW() - INTERVAL '${timeWindow}' SECOND
       AND type IN (${this.observables.taskTypes})`
    );

    // Classify tasks as urgent vs normal
    const urgentTasks = [];
    const normalTasks = [];

    for (const task of tasks) {
      const isUrgent = this.detectUrgencyMarkers(task);

      const completionTime = task.completed_at - task.created_at;
      const securityChecks = await this.getSecurityChecksPerformed(task.id);

      const taskData = {
        id: task.id,
        completionTime: completionTime,
        securityChecks: securityChecks.length,
        bypasses: securityChecks.filter(c => c.status === "bypassed").length
      };

      if (isUrgent) {
        urgentTasks.push(taskData);
      } else {
        normalTasks.push(taskData);
      }
    }

    // Calculate average completion times
    const Δt_normal = this.median(normalTasks.map(t => t.completionTime));
    const Δt_urgent = this.median(urgentTasks.map(t => t.completionTime));

    // Formula from Dense Paper
    const Ui = (Δt_normal - Δt_urgent) / Δt_normal;

    // Calculate bypass rate correlation
    const normalBypassRate = this.mean(
      normalTasks.map(t => t.bypasses / t.securityChecks)
    );
    const urgentBypassRate = this.mean(
      urgentTasks.map(t => t.bypasses / t.securityChecks)
    );

    // Detection
    const baseline = await this.getBaseline(orgId, "2.1");

    // Rule: Ui > 0.5 (50% acceleration)
    const Ri = Ui > 0.5 ? 1 : 0;

    // Anomaly: Multi-dimensional
    const observation = [
      Ui,
      urgentBypassRate,
      (urgentBypassRate - normalBypassRate)
    ];
    const Ai = this.calculateMahalanobisDistance(observation);

    // Context: Poisson regression from Dense Paper (p.2)
    // λ = e^(β0 + β1·pressure + β2·deadline_proximity)
    const pressure = this.calculatePressureScore(orgId);
    const deadlineProximity = await this.getUpcomingDeadlines(orgId);

    const β = baseline.poissonCoefficients || {β0: -2.5, β1: 1.2, β2: 0.8};
    const λ = Math.exp(β.β0 + (β.β1 * pressure) + (β.β2 * deadlineProximity));

    const Ci = Math.min(λ, 1.0);  // Normalize

    const weights = baseline.weights || {w1: 0.4, w2: 0.4, w3: 0.2};
    const Di = (weights.w1 * Ri) + (weights.w2 * Ai) + (weights.w3 * Ci);

    return {
      indicator: "2.1",
      score: Di,
      confidence: this.calculateConfidence(tasks.length, baseline.sampleSize),
      details: {
        accelerationIndex: Ui,
        normalCompletionTime: Δt_normal,
        urgentCompletionTime: Δt_urgent,
        accelerationPercent: Ui * 100,
        normalBypassRate: normalBypassRate,
        urgentBypassRate: urgentBypassRate,
        bypassIncrease: (urgentBypassRate - normalBypassRate) / normalBypassRate,
        urgentTaskCount: urgentTasks.length,
        normalTaskCount: normalTasks.length
      },
      rawEvents: urgentTasks.map(t => t.id),
      triggered: Di > 0.7,

      explanation: `Urgent tasks completed ${(Ui*100).toFixed(1)}% faster than normal ` +
                   `(${Δt_urgent}s vs ${Δt_normal}s). ` +
                   `Bypass rate increases from ${(normalBypassRate*100).toFixed(1)}% to ${(urgentBypassRate*100).toFixed(1)}% under time pressure.`
    };
  }

  detectUrgencyMarkers(task) {
    const text = `${task.title} ${task.description}`.toLowerCase();

    // Keyword matching
    const hasKeyword = this.observables.urgencyKeywords.some(keyword =>
      text.includes(keyword)
    );

    // Time pressure indicators
    const hasDeadline = task.deadline &&
      (task.deadline - task.created_at) < (24 * 3600 * 1000);  // < 24h

    // Requester seniority (execs create urgency)
    const isExecRequest = this.isExecutive(task.requester);

    return hasKeyword || hasDeadline || isExecRequest;
  }
}
```

#### **Indicator 2.6: Temporal Exhaustion Patterns**

**Dense Paper (p.2):**
> Temporal exhaustion patterns (2.6) require circadian modeling with security effectiveness **E(t) = E0 · (1 + A · sin(2π(t-φ)/24))** where φ represents phase shift and A represents amplitude of variation.

**Practical Implementation:**

```javascript
class Indicator_2_6_Detector {
  async detect(orgId, timeWindow = 604800) {  // 7 days for circadian analysis
    // Query: All security decisions/actions over 7 days
    const events = await this.queryTimeSeries(
      `SELECT
         EXTRACT(HOUR FROM timestamp) as hour,
         user_id,
         decision_quality,
         error_occurred,
         mfa_abandoned,
         alert_missed
       FROM security_events
       WHERE org_id = '${orgId}'
       AND timestamp >= NOW() - INTERVAL '${timeWindow}' SECOND`
    );

    // Group by hour of day
    const hourlyStats = Array(24).fill(null).map(() => ({
      errorRate: [],
      mfaAbandonmentRate: [],
      missedAlertRate: [],
      decisionQuality: []
    }));

    for (const event of events) {
      const hour = event.hour;

      hourlyStats[hour].errorRate.push(event.error_occurred ? 1 : 0);
      hourlyStats[hour].mfaAbandonmentRate.push(event.mfa_abandoned ? 1 : 0);
      hourlyStats[hour].missedAlertRate.push(event.alert_missed ? 1 : 0);
      hourlyStats[hour].decisionQuality.push(event.decision_quality);
    }

    // Calculate effectiveness per hour
    const E_hourly = hourlyStats.map(stats => {
      const errorRate = this.mean(stats.errorRate);
      const abandonmentRate = this.mean(stats.mfaAbandonmentRate);
      const missedRate = this.mean(stats.missedAlertRate);
      const quality = this.mean(stats.decisionQuality);

      // Effectiveness = inverse of problems
      return 1 - this.mean([errorRate, abandonmentRate, missedRate, 1 - quality]);
    });

    // Fit sine wave: E(t) = E0 · (1 + A·sin(2π(t-φ)/24))
    const {E0, A, φ} = this.fitSineWave(E_hourly);

    // Find minimum effectiveness (worst hour)
    const worstHour = this.findMinimum(E_hourly);
    const E_min = E_hourly[worstHour];
    const E_max = E_hourly[this.findMaximum(E_hourly)];

    // Detection: Large amplitude variation indicates circadian vulnerability
    const baseline = await this.getBaseline(orgId, "2.6");

    // Rule: Amplitude > 0.3 (30% variation)
    const Ri = A > 0.3 ? 1 : 0;

    // Anomaly
    const observation = [A, E_min, (E_max - E_min)];
    const Ai = this.calculateMahalanobisDistance(observation);

    // Context: Shift work patterns
    const Ci = await this.analyzeShiftPatterns(orgId);

    const weights = baseline.weights || {w1: 0.3, w2: 0.5, w3: 0.2};
    const Di = (weights.w1 * Ri) + (weights.w2 * Ai) + (weights.w3 * Ci);

    return {
      indicator: "2.6",
      score: Di,
      confidence: this.calculateConfidence(events.length, baseline.sampleSize),
      details: {
        baselineEffectiveness: E0,
        amplitude: A,
        amplitudePercent: A * 100,
        phaseShift: φ,
        worstHour: worstHour,
        minimumEffectiveness: E_min,
        maximumEffectiveness: E_max,
        variationRange: E_max - E_min,
        hourlyEffectiveness: E_hourly
      },
      triggered: Di > 0.7,

      explanation: `Circadian analysis shows ${(A*100).toFixed(1)}% amplitude variation in security effectiveness. ` +
                   `Worst performance at ${worstHour}:00 (effectiveness: ${(E_min*100).toFixed(1)}%) ` +
                   `vs best at ${this.findMaximum(E_hourly)}:00 (${(E_max*100).toFixed(1)}%). ` +
                   `This indicates temporal exhaustion vulnerability.`,

      recommendation: `Avoid critical security operations during ${worstHour}:00-${(worstHour+2)%24}:00. ` +
                      `Consider additional controls or oversight during low-effectiveness periods.`
    };
  }

  /**
   * Fit sine wave to hourly data using least squares
   * Returns {E0, A, φ} parameters
   */
  fitSineWave(hourlyData) {
    // Simplified - in production use proper curve fitting library
    const n = hourlyData.length;
    const E0 = this.mean(hourlyData);

    let bestA = 0;
    let bestPhi = 0;
    let minError = Infinity;

    // Grid search for A and φ
    for (let A = 0; A <= 0.5; A += 0.01) {
      for (let φ = 0; φ < 24; φ += 0.5) {
        let error = 0;

        for (let t = 0; t < n; t++) {
          const predicted = E0 * (1 + A * Math.sin(2 * Math.PI * (t - φ) / 24));
          error += Math.pow(hourlyData[t] - predicted, 2);
        }

        if (error < minError) {
          minError = error;
          bestA = A;
          bestPhi = φ;
        }
      }
    }

    return {E0, A: bestA, φ: bestPhi};
  }
}
```

### 4.4 Category 5: Cognitive Overload Vulnerabilities (5.1-5.10)

#### **Indicator 5.1: Alert Fatigue**

**Dense Paper (p.3):**
> Alert fatigue (5.1) operationalizes as **Fa = 1 - investigated/presented** with temporal decay modeling showing **Fa(t) = F0 · e^(λ·alert_rate·t)**

**Practical Implementation:**

```javascript
class Indicator_5_1_Detector {
  async detect(orgId, timeWindow = 86400) {
    // Query: All security alerts presented to analysts
    const alerts = await this.queryTimeSeries(
      `SELECT
         alert_id,
         severity,
         presented_at,
         investigated_at,
         analyst_id
       FROM security_alerts
       WHERE org_id = '${orgId}'
       AND presented_at >= NOW() - INTERVAL '${timeWindow}' SECOND`
    );

    const presented = alerts.length;
    const investigated = alerts.filter(a => a.investigated_at !== null).length;

    // Formula from Dense Paper
    const Fa = 1 - (investigated / presented);

    // Temporal decay analysis
    // Break into time buckets to see if fatigue increases over time
    const buckets = this.groupByTimeBucket(alerts, 3600);  // 1-hour buckets

    const Fa_timeline = buckets.map(bucket => {
      const p = bucket.alerts.length;
      const i = bucket.alerts.filter(a => a.investigated_at).length;
      return {
        time: bucket.time,
        Fa: 1 - (i / p),
        alert_rate: p / 3600  // alerts per second
      };
    });

    // Fit exponential: Fa(t) = F0 · e^(λ·alert_rate·t)
    const {F0, λ} = this.fitExponentialDecay(Fa_timeline);

    // Analyze by severity (critical alerts should ALWAYS be investigated)
    const bySeverity = {
      critical: alerts.filter(a => a.severity === 'critical'),
      high: alerts.filter(a => a.severity === 'high'),
      medium: alerts.filter(a => a.severity === 'medium'),
      low: alerts.filter(a => a.severity === 'low')
    };

    const Fa_bySeverity = {};
    for (const [severity, severityAlerts] of Object.entries(bySeverity)) {
      const p = severityAlerts.length;
      const i = severityAlerts.filter(a => a.investigated_at).length;
      Fa_bySeverity[severity] = 1 - (i / p);
    }

    // CRITICAL: If high/critical alerts are ignored, this is dangerous
    const criticalIgnored = Fa_bySeverity.critical > 0.1;  // >10% critical ignored

    // Detection
    const baseline = await this.getBaseline(orgId, "5.1");

    // Rule: Fa > 0.7 (70% of alerts ignored)
    const Ri = Fa > 0.7 ? 1 : 0;

    // Anomaly
    const observation = [
      Fa,
      Fa_bySeverity.critical,
      λ  // Decay rate
    ];
    const Ai = this.calculateMahalanobisDistance(observation);

    // Context: Workload and analyst capacity
    const analystCount = await this.getActiveAnalystCount(orgId);
    const alertsPerAnalyst = presented / analystCount;
    const Ci = Math.min(alertsPerAnalyst / 100, 1.0);  // Normalize

    const weights = baseline.weights || {w1: 0.5, w2: 0.3, w3: 0.2};
    const Di = (weights.w1 * Ri) + (weights.w2 * Ai) + (weights.w3 * Ci);

    return {
      indicator: "5.1",
      score: Di,
      confidence: this.calculateConfidence(presented, baseline.sampleSize),
      details: {
        fatigueIndex: Fa,
        presented: presented,
        investigated: investigated,
        ignored: presented - investigated,
        ignoredPercent: Fa * 100,
        decayRate: λ,
        criticalIgnoredPercent: Fa_bySeverity.critical * 100,
        alertsPerAnalyst: alertsPerAnalyst,
        fatigueTimeline: Fa_timeline,
        bySeverity: Fa_bySeverity
      },
      rawEvents: alerts.filter(a => !a.investigated_at).map(a => a.alert_id),
      triggered: Di > 0.7 || criticalIgnored,

      criticalWarning: criticalIgnored ?
        `CRITICAL: ${(Fa_bySeverity.critical*100).toFixed(1)}% of critical alerts are being ignored!` : null,

      explanation: `Alert fatigue detected: ${(Fa*100).toFixed(1)}% of alerts ignored (${presented - investigated} of ${presented}). ` +
                   `Fatigue increases exponentially with alert rate (λ=${λ.toFixed(3)}). ` +
                   `${alertsPerAnalyst.toFixed(0)} alerts per analyst. ` +
                   (criticalIgnored ? `WARNING: Critical alerts also being missed.` : ''),

      recommendation: `Reduce alert volume through tuning. Current rate (${alertsPerAnalyst.toFixed(0)}/analyst) exceeds sustainable capacity (~50/analyst/day).`
    };
  }

  /**
   * Fit exponential decay: Fa(t) = F0 · e^(λ·r·t)
   * where r = alert_rate
   */
  fitExponentialDecay(timeline) {
    // Use least squares regression on log-transformed data
    // ln(Fa) = ln(F0) + λ·r·t

    const data = timeline.map((point, idx) => ({
      t: idx,
      r: point.alert_rate,
      Fa: point.Fa > 0 ? point.Fa : 0.001  // Avoid log(0)
    }));

    const X = data.map(d => d.r * d.t);
    const Y = data.map(d => Math.log(d.Fa));

    const {slope, intercept} = this.linearRegression(X, Y);

    return {
      F0: Math.exp(intercept),
      λ: slope
    };
  }
}
```

#### **Indicator 5.7: Working Memory Overflow**

**Dense Paper (p.3):**
> Working memory overflow (5.7) applies Miller's 7 ± 2 limit, flagging when concurrent security requirements exceed threshold.

**Practical Implementation:**

```javascript
class Indicator_5_7_Detector {
  observables = {
    millerLimit: 7,  // Miller's magic number
    tolerance: 2     // ± 2 range
  };

  async detect(orgId, timeWindow = 3600) {
    // Query: Active tasks requiring cognitive load
    const users = await this.getActiveUsers(orgId);

    const overloadInstances = [];

    for (const user of users) {
      // Count concurrent requirements
      const concurrent = await this.queryConcurrentRequirements(user.id, timeWindow);

      const requirements = {
        openSecurityAlerts: concurrent.alerts.filter(a => a.requires_decision),
        pendingApprovals: concurrent.approvals,
        activeIncidents: concurrent.incidents,
        passwordsToRemember: concurrent.recent_password_changes,
        mfaDevices: concurrent.mfa_devices,
        policyExceptions: concurrent.policy_exceptions,
        trainingModules: concurrent.incomplete_training
      };

      const totalLoad = Object.values(requirements).reduce((sum, arr) => sum + arr.length, 0);

      // Miller's law: 7 ± 2
      const threshold = this.observables.millerLimit + this.observables.tolerance;

      if (totalLoad > threshold) {
        // Measure consequences
        const errorRate = await this.getUserErrorRate(user.id, timeWindow);
        const taskCompletionTime = await this.getUserTaskTime(user.id, timeWindow);

        overloadInstances.push({
          userId: user.id,
          cognitiveLoad: totalLoad,
          breakdown: requirements,
          exceedsBy: totalLoad - threshold,
          errorRate: errorRate,
          taskCompletionTime: taskCompletionTime
        });
      }
    }

    // Aggregate
    const overloadRate = overloadInstances.length / users.length;

    // Detection
    const baseline = await this.getBaseline(orgId, "5.7");

    const Ri = overloadRate > 0.3 ? 1 : 0;  // >30% users overloaded

    const observation = [
      overloadRate,
      this.mean(overloadInstances.map(o => o.cognitiveLoad)),
      this.mean(overloadInstances.map(o => o.errorRate))
    ];
    const Ai = this.calculateMahalanobisDistance(observation);

    const Ci = this.calculateContext({
      timeOfDay: new Date().getHours(),
      workload: await this.getOrgWorkload(orgId)
    });

    const weights = baseline.weights || {w1: 0.4, w2: 0.4, w3: 0.2};
    const Di = (weights.w1 * Ri) + (weights.w2 * Ai) + (weights.w3 * Ci);

    return {
      indicator: "5.7",
      score: Di,
      confidence: this.calculateConfidence(users.length, baseline.sampleSize),
      details: {
        overloadRate: overloadRate,
        usersAnalyzed: users.length,
        usersOverloaded: overloadInstances.length,
        averageLoad: this.mean(overloadInstances.map(o => o.cognitiveLoad)),
        millerLimit: threshold,
        overloadInstances: overloadInstances.slice(0, 10)  // Top 10
      },
      triggered: Di > 0.7,

      explanation: `Working memory overflow detected in ${(overloadRate*100).toFixed(1)}% of users (${overloadInstances.length} of ${users.length}). ` +
                   `Average concurrent requirements: ${this.mean(overloadInstances.map(o => o.cognitiveLoad)).toFixed(1)} (threshold: ${threshold}). ` +
                   `This exceeds Miller's 7±2 cognitive limit.`,

      recommendation: `Reduce concurrent security requirements. Batch non-urgent tasks. Implement password managers to reduce memory load.`
    };
  }
}
```

### 4.5 Category 6: Group Dynamic Vulnerabilities (6.1-6.10)

#### **Indicator 6.1: Groupthink Detection**

**Dense Paper (p.3):**
> Groupthink detection (6.1) employs diversity indices on decision patterns: **D = 1 - Σpi²** where pi represents fraction choosing option i. Low diversity coupled with rapid consensus indicates groupthink.

**Practical Implementation:**

```javascript
class Indicator_6_1_Detector {
  async detect(orgId, timeWindow = 86400) {
    // Query: Group decisions (meetings, votes, approvals)
    const decisions = await this.queryTimeSeries(
      `SELECT * FROM group_decisions
       WHERE org_id = '${orgId}'
       AND timestamp >= NOW() - INTERVAL '${timeWindow}' SECOND
       AND participant_count >= 3`  // Requires group
    );

    const groupthinkInstances = [];

    for (const decision of decisions) {
      const votes = await this.getVotes(decision.id);

      // Calculate diversity index (Simpson's Diversity)
      // D = 1 - Σ(pi²) where pi = fraction choosing option i
      const voteCounts = {};
      for (const vote of votes) {
        voteCounts[vote.option] = (voteCounts[vote.option] || 0) + 1;
      }

      const total = votes.length;
      const D = 1 - Object.values(voteCounts).reduce((sum, count) => {
        const p = count / total;
        return sum + (p * p);
      }, 0);

      // Consensus time (how fast did everyone agree?)
      const firstVote = Math.min(...votes.map(v => v.timestamp));
      const lastVote = Math.max(...votes.map(v => v.timestamp));
      const consensusTime = (lastVote - firstVote) / 1000;  // seconds

      // Risky shift analysis (group vs individual risk tolerance)
      const individualRisk = await this.getIndividualRiskTolerance(votes.map(v => v.user_id));
      const groupRisk = decision.risk_score;

      const riskyShift = groupRisk > (this.mean(individualRisk) * 1.2);  // 20% more risky

      // Groupthink indicators:
      // 1. Low diversity (D < 0.3)
      // 2. Rapid consensus (< 5 minutes)
      // 3. Risky shift
      // 4. No dissent recorded

      if (D < 0.3 && consensusTime < 300 && riskyShift) {
        groupthinkInstances.push({
          decisionId: decision.id,
          diversity: D,
          consensusTime: consensusTime,
          participantCount: votes.length,
          groupRisk: groupRisk,
          individualRiskAvg: this.mean(individualRisk),
          riskyShiftAmount: groupRisk - this.mean(individualRisk),
          unanimity: D === 0,  // Everyone voted the same
          dissentRecorded: await this.hasRecordedDissent(decision.id)
        });
      }
    }

    const groupthinkRate = groupthinkInstances.length / decisions.length;

    // Detection
    const baseline = await this.getBaseline(orgId, "6.1");

    const Ri = groupthinkRate > 0.2 ? 1 : 0;  // >20% decisions show groupthink

    const observation = [
      groupthinkRate,
      this.mean(groupthinkInstances.map(g => g.diversity)),
      this.mean(groupthinkInstances.map(g => g.consensusTime))
    ];
    const Ai = this.calculateMahalanobisDistance(observation);

    const Ci = this.calculateContext({
      organizationalCulture: await this.getOrganizationalCulture(orgId),
      leadershipStyle: await this.getLeadershipStyle(orgId)
    });

    const weights = baseline.weights || {w1: 0.4, w2: 0.4, w3: 0.2};
    const Di = (weights.w1 * Ri) + (weights.w2 * Ai) + (weights.w3 * Ci);

    return {
      indicator: "6.1",
      score: Di,
      confidence: this.calculateConfidence(decisions.length, baseline.sampleSize),
      details: {
        groupthinkRate: groupthinkRate,
        decisionsAnalyzed: decisions.length,
        groupthinkInstances: groupthinkInstances.length,
        averageDiversity: this.mean(groupthinkInstances.map(g => g.diversity)),
        averageConsensusTime: this.mean(groupthinkInstances.map(g => g.consensusTime)),
        riskyShiftCount: groupthinkInstances.filter(g => g.riskyShiftAmount > 0).length,
        unanimousCount: groupthinkInstances.filter(g => g.unanimity).length
      },
      rawEvents: groupthinkInstances.map(g => g.decisionId),
      triggered: Di > 0.7,

      explanation: `Groupthink detected in ${(groupthinkRate*100).toFixed(1)}% of group decisions (${groupthinkInstances.length} of ${decisions.length}). ` +
                   `Average diversity index: ${this.mean(groupthinkInstances.map(g => g.diversity)).toFixed(2)} (threshold: 0.3). ` +
                   `Average consensus time: ${this.mean(groupthinkInstances.map(g => g.consensusTime)).toFixed(0)}s. ` +
                   `${groupthinkInstances.filter(g => g.riskyShiftAmount > 0).length} decisions show risky shift.`,

      recommendation: `Encourage dissent. Assign devil's advocate role. Use anonymous voting. Slow down decision process.`
    };
  }
}
```

---

## 5. Baseline Calibration Framework

### 5.1 The Calibration Phase

**From Dense Paper (p.4):**
> Deployment follows phased approach: **baseline establishment (30 days)**, pilot deployment (10 indicators, 60 days), graduated rollout (20 indicators/month), and full operational capability (month 8).

**Why 30 Days?**
- Captures weekly cycles (4+ weeks)
- Includes various organizational states (normal, busy, quiet)
- Sufficient data for statistical significance (thousands of events)
- Detects seasonal patterns

### 5.2 What Gets Calibrated

For each indicator, we calculate:

```javascript
class BaselineCalibrator {
  async calibrateIndicator(orgId, indicatorId, days = 30) {
    console.log(`Starting ${days}-day baseline calibration for ${indicatorId}...`);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Collect ALL raw data for this indicator over 30 days
    const rawData = await this.collectRawData(orgId, indicatorId, startDate);

    console.log(`Collected ${rawData.length} data points`);

    // Extract features/observables
    const observations = rawData.map(data =>
      this.extractObservables(indicatorId, data)
    );

    // Calculate statistics
    const baseline = {
      indicatorId: indicatorId,
      orgId: orgId,
      calibrationPeriod: {
        start: startDate,
        end: new Date(),
        days: days
      },

      // 1. Mean (μ)
      mean: this.calculateMean(observations),

      // 2. Standard Deviation (σ)
      std: this.calculateStd(observations),

      // 3. Covariance Matrix (Σ) - for multi-dimensional indicators
      covariance: this.calculateCovarianceMatrix(observations),

      // 4. Percentiles (for threshold setting)
      percentiles: {
        p50: this.percentile(observations, 0.50),  // Median
        p75: this.percentile(observations, 0.75),
        p90: this.percentile(observations, 0.90),
        p95: this.percentile(observations, 0.95),
        p99: this.percentile(observations, 0.99)
      },

      // 5. Temporal patterns
      temporal: {
        hourly: this.groupByHour(observations),
        daily: this.groupByDayOfWeek(observations),
        circadian: this.fitCircadianModel(observations)
      },

      // 6. Distribution type (normal, exponential, poisson, etc.)
      distribution: this.detectDistribution(observations),

      // 7. Sample size (for confidence calculation)
      sampleSize: observations.length,

      // 8. Detection weights (calibrated via validation)
      weights: await this.calibrateWeights(orgId, indicatorId, observations),

      // 9. Threshold (μ + k·σ, where k is calibrated)
      threshold: {
        k: 2.0,  // Default: 2 sigma
        value: null  // Will be calculated
      },

      // 10. Bayesian priors (for context calculation)
      priors: await this.calculateBayesianPriors(orgId, observations)
    };

    // Calculate threshold value
    baseline.threshold.value = baseline.mean + (baseline.threshold.k * baseline.std);

    // Store baseline
    await this.storeBaseline(baseline);

    console.log(`Baseline calibrated: μ=${baseline.mean.toFixed(3)}, σ=${baseline.std.toFixed(3)}, threshold=${baseline.threshold.value.toFixed(3)}`);

    return baseline;
  }

  /**
   * Extract observables depends on indicator type
   */
  extractObservables(indicatorId, rawData) {
    switch(indicatorId) {
      case "1.1":  // Authority compliance
        return {
          complianceRate: rawData.executed / rawData.requested,
          verificationRate: rawData.verified / rawData.requested,
          responseTime: rawData.avgResponseTime
        };

      case "5.1":  // Alert fatigue
        return {
          fatigueIndex: 1 - (rawData.investigated / rawData.presented),
          alertRate: rawData.presented / 86400,  // per day
          criticalIgnoredRate: rawData.criticalIgnored / rawData.criticalPresented
        };

      case "2.1":  // Urgency bypass
        return {
          accelerationIndex: (rawData.normalTime - rawData.urgentTime) / rawData.normalTime,
          bypassRate: rawData.bypasses / rawData.total,
          pressureScore: rawData.urgencyMarkerCount / rawData.total
        };

      // ... 97 more
    }
  }

  /**
   * Calibrate detection weights (w1, w2, w3) using validation data
   * Optimize for highest Matthews Correlation Coefficient
   */
  async calibrateWeights(orgId, indicatorId, observations) {
    // Need ground truth for calibration
    const groundTruth = await this.getGroundTruth(orgId, indicatorId);

    if (!groundTruth || groundTruth.length < 10) {
      // Not enough data - use defaults
      return {w1: 0.4, w2: 0.4, w3: 0.2};
    }

    let bestWeights = {w1: 0.4, w2: 0.4, w3: 0.2};
    let bestMCC = -1;

    // Grid search over weight space
    for (let w1 = 0; w1 <= 1.0; w1 += 0.1) {
      for (let w2 = 0; w2 <= (1.0 - w1); w2 += 0.1) {
        const w3 = 1.0 - w1 - w2;

        const weights = {w1, w2, w3};

        // Calculate MCC with these weights
        const predictions = observations.map(obs => {
          const Ri = this.calculateRuleBased(indicatorId, obs);
          const Ai = this.calculateAnomaly(indicatorId, obs);
          const Ci = this.calculateContext(indicatorId, obs);

          const Di = (w1 * Ri) + (w2 * Ai) + (w3 * Ci);

          return Di > 0.7 ? 1 : 0;  // Threshold
        });

        const mcc = this.calculateMCC(predictions, groundTruth);

        if (mcc > bestMCC) {
          bestMCC = mcc;
          bestWeights = weights;
        }
      }
    }

    console.log(`Calibrated weights for ${indicatorId}: w1=${bestWeights.w1.toFixed(2)}, w2=${bestWeights.w2.toFixed(2)}, w3=${bestWeights.w3.toFixed(2)} (MCC=${bestMCC.toFixed(3)})`);

    return bestWeights;
  }

  /**
   * Covariance matrix for multi-dimensional indicators
   */
  calculateCovarianceMatrix(observations) {
    // observations = [{complianceRate, verificationRate, responseTime}, ...]

    if (!observations[0] || typeof observations[0] !== 'object') {
      // Single-dimensional - return variance
      return [[this.calculateVariance(observations)]];
    }

    const keys = Object.keys(observations[0]);
    const n = keys.length;

    const matrix = Array(n).fill(null).map(() => Array(n).fill(0));

    // Extract vectors
    const vectors = keys.map(key =>
      observations.map(obs => obs[key])
    );

    // Calculate covariance for each pair
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        matrix[i][j] = this.covariance(vectors[i], vectors[j]);
      }
    }

    return matrix;
  }

  covariance(x, y) {
    const meanX = this.mean(x);
    const meanY = this.mean(y);
    const n = x.length;

    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += (x[i] - meanX) * (y[i] - meanY);
    }

    return sum / (n - 1);
  }
}
```

### 5.3 Baseline Storage Schema

```javascript
// Time-series DB: InfluxDB measurement
{
  measurement: "baselines",
  tags: {
    org_id: "org-123",
    indicator_id: "1.1",
    version: "1.0"
  },
  fields: {
    mean: 0.72,
    std: 0.08,
    threshold: 0.88,
    sample_size: 15234,

    // Covariance matrix (flattened)
    cov_00: 0.0064,
    cov_01: -0.0023,
    cov_02: 12.5,
    cov_11: 0.0112,
    cov_12: -8.3,
    cov_22: 2450.0,

    // Weights
    w1: 0.4,
    w2: 0.4,
    w3: 0.2,

    // Percentiles
    p50: 0.71,
    p75: 0.78,
    p90: 0.85,
    p95: 0.89,
    p99: 0.94,

    // Distribution parameters
    distribution_type: "normal",

    // Temporal parameters
    circadian_E0: 0.85,
    circadian_A: 0.15,
    circadian_phi: 14.5,

    // Bayesian priors (JSON encoded)
    priors: '{"afterHours": {"legitimate": 0.3, "attack": 0.7}, ...}',

    // Metadata
    calibration_start: "2025-10-18T00:00:00Z",
    calibration_end: "2025-11-17T00:00:00Z",
    last_updated: "2025-11-17T12:34:56Z"
  },
  timestamp: 1700227200000
}
```

### 5.4 Adaptive Baseline Updates

Baselines should adapt over time as organizations change:

```javascript
class AdaptiveBaseline {
  /**
   * Update baseline using Exponential Weighted Moving Average
   * Allows slow drift while rejecting sudden attacks
   */
  async updateBaseline(orgId, indicatorId, newObservation) {
    const baseline = await this.getBaseline(orgId, indicatorId);

    const alpha = 0.05;  // 5% weight to new data (slow adaptation)

    // Check if observation is an outlier (potential attack)
    const distance = this.mahalanobisDistance(
      newObservation,
      baseline.mean,
      baseline.covariance
    );

    if (distance > 4.0) {
      // More than 4 sigma - likely an attack, don't update baseline
      console.log(`Outlier detected (${distance.toFixed(2)}σ) - not updating baseline`);
      return baseline;
    }

    // EWMA update
    const updatedMean = this.vectorAdd(
      this.vectorMultiply(alpha, newObservation),
      this.vectorMultiply(1 - alpha, baseline.mean)
    );

    // Update covariance
    const diff = this.vectorSubtract(newObservation, baseline.mean);
    const outerProduct = this.outerProduct(diff, diff);

    const updatedCovariance = this.matrixAdd(
      this.matrixMultiply(alpha, outerProduct),
      this.matrixMultiply(1 - alpha, baseline.covariance)
    );

    // Store updated baseline
    baseline.mean = updatedMean;
    baseline.covariance = updatedCovariance;
    baseline.last_updated = new Date();

    await this.storeBaseline(baseline);

    return baseline;
  }
}
```

---

## 6. Temporal Modeling & Decay

### 6.1 Why Temporal Decay Matters

**Current Problem (from simulator README):**
> "Rapid saturation - all indicators turn red in 1-2 minutes"
>
> Root causes: High baselines, **no decay**, excessive event rate

**The Fix:** Events should decay over time. A phishing email from last week is less relevant than one from 10 minutes ago.

### 6.2 Exponential Decay Model

**From Dense Paper (p.1):**

> The temporal dimension proves critical for psychological indicators. For indicator i at time t, the temporal state Ti(t) is calculated as:
>
> **Ti(t) = α · Xi(t) + (1 - α) · Ti(t - 1)**
>
> where **α = e^(-Δt/τ)** provides exponential decay, and Xi(t) represents the instantaneous observation.

**Parameters:**
- **τ (tau)**: Half-life / persistence threshold
  - Short τ: Fast decay (alerts, urgent events)
  - Long τ: Slow decay (training, cultural patterns)
- **Δt**: Time since last update
- **α**: Decay factor (0 to 1)

### 6.3 Practical Implementation

```javascript
class TemporalDecayModel {
  /**
   * Persistence thresholds (τ) per indicator category
   * In seconds
   */
  persistenceThresholds = {
    // Authority (1.x): Medium persistence (hours)
    "1.x": 14400,  // 4 hours

    // Temporal (2.x): Short persistence (minutes)
    "2.x": 1800,   // 30 minutes

    // Social (3.x): Medium persistence
    "3.x": 10800,  // 3 hours

    // Affective (4.x): Medium-long persistence
    "4.x": 21600,  // 6 hours

    // Cognitive (5.x): Long persistence (days)
    "5.x": 86400,  // 24 hours

    // Group (6.x): Very long persistence (weeks)
    "6.x": 604800, // 7 days

    // Stress (7.x): Medium persistence
    "7.x": 18000,  // 5 hours

    // Unconscious (8.x): Very long persistence (months)
    "8.x": 2592000, // 30 days

    // AI (9.x): Short persistence
    "9.x": 3600,   // 1 hour

    // Convergent (10.x): Variable (use shortest contributing indicator)
    "10.x": null   // Calculated dynamically
  };

  /**
   * Calculate temporal state with exponential decay
   *
   * @param indicatorId - e.g., "1.1"
   * @param currentObservation - Xi(t) - current value [0, 1]
   * @param previousState - Ti(t-1) - previous temporal state
   * @param deltaTime - Δt - seconds since last update
   */
  calculateTemporalState(indicatorId, currentObservation, previousState, deltaTime) {
    // Get persistence threshold for this indicator
    const category = indicatorId.split('.')[0] + '.x';
    const τ = this.persistenceThresholds[category];

    // Calculate decay factor: α = e^(-Δt/τ)
    const α = Math.exp(-deltaTime / τ);

    // Temporal state from Dense Paper:
    // Ti(t) = α·Xi(t) + (1-α)·Ti(t-1)
    const Ti = (α * currentObservation) + ((1 - α) * previousState);

    return {
      temporalState: Ti,
      decayFactor: α,
      decayAmount: previousState - Ti,
      contribution: {
        current: α * currentObservation,
        previous: (1 - α) * previousState
      }
    };
  }

  /**
   * Example: Alert Fatigue (5.1) with decay
   */
  async calculateAlertFatigueWithDecay(orgId) {
    // Get current observation
    const alerts = await this.getRecentAlerts(orgId, 3600);  // Last hour
    const Fa_current = 1 - (alerts.investigated / alerts.presented);

    // Get previous temporal state
    const previous = await this.getTemporalState(orgId, "5.1");
    const Fa_previous = previous.temporalState || 0;
    const deltaTime = Date.now() - previous.timestamp;

    // Apply decay
    const τ = this.persistenceThresholds["5.x"];  // 24 hours
    const α = Math.exp(-deltaTime / τ);

    // Ti(t) = α·Fa_current + (1-α)·Fa_previous
    const Fa_temporal = (α * Fa_current) + ((1 - α) * Fa_previous);

    // Store new temporal state
    await this.storeTemporalState(orgId, "5.1", {
      temporalState: Fa_temporal,
      rawObservation: Fa_current,
      decayFactor: α,
      timestamp: Date.now()
    });

    console.log(`Alert Fatigue 5.1:
      Current observation: ${(Fa_current*100).toFixed(1)}%
      Previous state: ${(Fa_previous*100).toFixed(1)}%
      Decay factor: ${α.toFixed(3)} (${deltaTime}s elapsed, τ=${τ}s)
      Temporal state: ${(Fa_temporal*100).toFixed(1)}%`
    );

    return Fa_temporal;
  }

  /**
   * Visualization: Show how indicator decays over time
   */
  simulateDecay(initialValue, τ, durationHours = 24) {
    const timeline = [];
    let Ti = initialValue;

    for (let hour = 0; hour <= durationHours; hour++) {
      const deltaTime = hour * 3600;  // Convert to seconds
      const α = Math.exp(-deltaTime / τ);

      // Assuming no new observations (Xi = 0)
      Ti = (1 - α) * Ti;

      timeline.push({
        hour: hour,
        value: Ti,
        decayFactor: α,
        percentRemaining: (Ti / initialValue) * 100
      });
    }

    return timeline;
  }
}

// Example usage:
const decay = new TemporalDecayModel();

// Short τ (alerts): Decays fast
console.log("Alert decay (τ=30min):");
console.log(decay.simulateDecay(1.0, 1800, 4));
/*
  hour 0: 100%
  hour 1: 13.5%  (after 2 half-lives)
  hour 2: 1.8%
  hour 3: 0.2%
  hour 4: 0.03%
*/

// Long τ (unconscious): Decays slow
console.log("Unconscious pattern decay (τ=30days):");
console.log(decay.simulateDecay(1.0, 2592000, 24*30));
/*
  day 0: 100%
  day 7: 80%
  day 15: 63%
  day 30: 37% (one half-life)
  day 60: 13%
*/
```

### 6.4 Sliding Windows for Aggregation

Different indicators need different time windows:

```javascript
class SlidingWindowAggregator {
  windows = {
    // Real-time (minutes)
    "2.1": {size: 3600, label: "1 hour"},        // Urgency bypass
    "9.2": {size: 3600, label: "1 hour"},        // Automation bias

    // Short-term (hours)
    "1.1": {size: 14400, label: "4 hours"},      // Authority compliance
    "5.1": {size: 86400, label: "24 hours"},     // Alert fatigue
    "7.1": {size: 28800, label: "8 hours"},      // Acute stress

    // Medium-term (days)
    "3.3": {size: 259200, label: "3 days"},      // Social proof
    "4.4": {size: 604800, label: "7 days"},      // Attachment to legacy

    // Long-term (weeks/months)
    "6.1": {size: 1209600, label: "14 days"},    // Groupthink
    "8.3": {size: 2592000, label: "30 days"},    // Repetition compulsion
  };

  async calculateWithWindow(orgId, indicatorId) {
    const window = this.windows[indicatorId] || {size: 86400, label: "24 hours"};

    // Query events within window
    const events = await this.queryTimeSeries(
      `SELECT * FROM events
       WHERE org_id = '${orgId}'
       AND indicator = '${indicatorId}'
       AND timestamp >= NOW() - INTERVAL '${window.size}' SECOND`
    );

    // Apply temporal weighting (recent events weighted more)
    const weightedEvents = events.map(event => {
      const age = (Date.now() - event.timestamp) / 1000;  // seconds
      const weight = Math.exp(-age / window.size);  // Exponential weight

      return {
        ...event,
        weight: weight
      };
    });

    // Weighted average
    const totalWeight = weightedEvents.reduce((sum, e) => sum + e.weight, 0);
    const weightedValue = weightedEvents.reduce((sum, e) => sum + (e.value * e.weight), 0);

    return weightedValue / totalWeight;
  }
}
```

---

## 7. Validation Methodology

### 7.1 Ground Truth Generation

**The Challenge:** How do we know if detection works?

**Solution:** Inject known signals and track them.

```javascript
class GroundTruthManager {
  /**
   * During data generation, record what signals were injected
   */
  recordInjectedSignal(signal) {
    const groundTruth = {
      id: generateUUID(),
      timestamp: signal.timestamp,
      orgId: signal.orgId,

      // What indicator should detect this?
      expectedIndicator: signal.indicatorType,  // e.g., "1.1"

      // How strong is the signal? (in standard deviations)
      signalStrength: signal.deviationFromBaseline,  // e.g., 2.5σ

      // What events comprise this signal?
      eventIds: signal.relatedEvents.map(e => e.id),

      // Should it be detected?
      shouldDetect: signal.signalStrength >= 2.0,  // 2σ threshold

      // Metadata for analysis
      metadata: {
        injectionMethod: signal.method,
        baselineValue: signal.baseline,
        injectedValue: signal.value,
        hiddenIn: signal.maskedBy  // What normal traffic hides it
      }
    };

    await this.storeGroundTruth(groundTruth);
  }

  /**
   * After detection runs, compare results to ground truth
   */
  async validateDetection(orgId, indicatorId, timeWindow) {
    // Get ground truth for this period
    const groundTruth = await this.getGroundTruth(orgId, indicatorId, timeWindow);

    // Get detection results
    const detectionResults = await this.getDetectionResults(orgId, indicatorId, timeWindow);

    // Build confusion matrix
    let TP = 0;  // True Positives
    let TN = 0;  // True Negatives
    let FP = 0;  // False Positives
    let FN = 0;  // False Negatives

    for (const truth of groundTruth) {
      const detected = detectionResults.find(d =>
        this.isOverlapping(d.timestamp, truth.timestamp, 3600)  // Within 1 hour
      );

      if (truth.shouldDetect && detected) {
        TP++;
      } else if (truth.shouldDetect && !detected) {
        FN++;
        console.warn(`MISSED: ${truth.expectedIndicator} signal at ${truth.timestamp} (${truth.signalStrength}σ)`);
      } else if (!truth.shouldDetect && detected) {
        FP++;
        console.warn(`FALSE ALARM: ${truth.expectedIndicator} at ${detected.timestamp}`);
      } else {
        TN++;
      }
    }

    // Calculate metrics from Dense Paper (p.4)
    const metrics = this.calculateValidationMetrics(TP, TN, FP, FN);

    return metrics;
  }

  /**
   * Matthews Correlation Coefficient - from Dense Paper
   * V = (TP·TN - FP·FN) / sqrt((TP+FP)(TP+FN)(TN+FP)(TN+FN))
   */
  calculateValidationMetrics(TP, TN, FP, FN) {
    const MCC = (TP * TN - FP * FN) / Math.sqrt(
      (TP + FP) * (TP + FN) * (TN + FP) * (TN + FN)
    );

    const precision = TP / (TP + FP);
    const recall = TP / (TP + FN);
    const f1 = 2 * (precision * recall) / (precision + recall);
    const accuracy = (TP + TN) / (TP + TN + FP + FN);

    return {
      MCC: MCC,                    // Matthews Correlation Coefficient [-1, 1]
      precision: precision,        // How many detected are real? [0, 1]
      recall: recall,              // How many real signals caught? [0, 1]
      f1Score: f1,                 // Harmonic mean of precision/recall
      accuracy: accuracy,          // Overall correctness

      confusionMatrix: {
        truePositives: TP,
        trueNegatives: TN,
        falsePositives: FP,
        falseNegatives: FN
      },

      // Interpretation
      quality: this.interpretMCC(MCC)
    };
  }

  interpretMCC(mcc) {
    if (mcc >= 0.9) return "Excellent";
    if (mcc >= 0.7) return "Good";
    if (mcc >= 0.5) return "Moderate";
    if (mcc >= 0.3) return "Weak";
    return "Poor";
  }
}
```

### 7.2 Continuous Validation

**From Dense Paper (p.4):**
> Each indicator undergoes continuous validation through synthetic testing and correlation analysis. Drift detection using Kolmogorov-Smirnov tests triggers recalibration when p < 0.05.

```javascript
class ContinuousValidator {
  /**
   * Run daily validation checks
   */
  async dailyValidation(orgId, indicatorId) {
    console.log(`Running daily validation for ${indicatorId}...`);

    // 1. Synthetic Test Injection
    const syntheticResults = await this.runSyntheticTests(orgId, indicatorId);

    // 2. Correlation Analysis (cross-indicator validation)
    const correlationResults = await this.checkCorrelations(orgId, indicatorId);

    // 3. Drift Detection (has baseline shifted?)
    const driftResults = await this.detectDrift(orgId, indicatorId);

    // 4. Performance Metrics
    const performanceResults = await this.checkPerformance(orgId, indicatorId);

    // Aggregate results
    const validationScore = this.aggregateValidation({
      synthetic: syntheticResults.passRate,
      correlation: correlationResults.score,
      drift: driftResults.stable ? 1.0 : 0.0,
      performance: performanceResults.mcc
    });

    // Alert if validation fails
    if (validationScore < 0.7) {
      await this.alertValidationFailure(orgId, indicatorId, {
        synthetic: syntheticResults,
        correlation: correlationResults,
        drift: driftResults,
        performance: performanceResults
      });
    }

    return {
      indicatorId: indicatorId,
      validationScore: validationScore,
      timestamp: new Date(),
      details: {
        synthetic: syntheticResults,
        correlation: correlationResults,
        drift: driftResults,
        performance: performanceResults
      }
    };
  }

  /**
   * Kolmogorov-Smirnov test for distribution drift
   */
  async detectDrift(orgId, indicatorId) {
    // Get baseline distribution (from calibration)
    const baseline = await this.getBaseline(orgId, indicatorId);
    const baselineDistribution = baseline.calibrationData;  // Historical values

    // Get recent distribution (last 7 days)
    const recentData = await this.getRecentObservations(orgId, indicatorId, 7);

    // Kolmogorov-Smirnov test
    const ksStatistic = this.kolmogorovSmirnovTest(
      baselineDistribution,
      recentData
    );

    // Calculate p-value
    const pValue = this.ksPValue(ksStatistic, baselineDistribution.length, recentData.length);

    // From Dense Paper: p < 0.05 triggers recalibration
    const drifted = pValue < 0.05;

    if (drifted) {
      console.warn(`DRIFT DETECTED in ${indicatorId}: p=${pValue.toFixed(4)} (threshold 0.05)`);
      console.warn(`Distribution has shifted significantly - recalibration recommended`);
    }

    return {
      drifted: drifted,
      ksStatistic: ksStatistic,
      pValue: pValue,
      needsRecalibration: drifted,
      stable: !drifted
    };
  }

  /**
   * Run synthetic tests - inject known signals and verify detection
   */
  async runSyntheticTests(orgId, indicatorId) {
    const tests = [
      {name: "weak_signal", strength: 2.0},    // 2σ - borderline
      {name: "medium_signal", strength: 3.0},  // 3σ - should detect
      {name: "strong_signal", strength: 5.0},  // 5σ - obvious
      {name: "no_signal", strength: 0.0}       // Baseline - should NOT detect
    ];

    const results = [];

    for (const test of tests) {
      // Inject synthetic signal
      const signal = await this.injectSyntheticSignal(orgId, indicatorId, test.strength);

      // Wait for detection to run
      await this.sleep(5000);

      // Check if detected
      const detected = await this.wasDetected(orgId, indicatorId, signal.timestamp);

      const shouldDetect = test.strength >= 2.0;
      const correct = (detected && shouldDetect) || (!detected && !shouldDetect);

      results.push({
        test: test.name,
        strength: test.strength,
        shouldDetect: shouldDetect,
        wasDetected: detected,
        correct: correct
      });

      console.log(`Synthetic test "${test.name}": ${correct ? "✓ PASS" : "✗ FAIL"}`);
    }

    const passRate = results.filter(r => r.correct).length / results.length;

    return {
      passRate: passRate,
      results: results,
      passed: passRate >= 0.75  // 75% threshold
    };
  }
}
```

---

This document is getting quite long. Should I continue with:

8. **End-to-End Implementation Examples** (complete code for 2-3 indicators)
9. **Storage & Query Architecture** (time-series DB schemas, queries)
10. **Deployment Roadmap** (phased rollout plan)

Or would you like me to save this as-is and we can start implementing code based on this specification?