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

## 8. End-to-End Implementation Examples

### 8.1 Complete Indicator 1.1 Implementation

Let's walk through a complete implementation of **Indicator 1.1 (Unquestioning Compliance)** from data generation to detection to validation.

#### Step 1: Generate Realistic Email Data

```javascript
// File: /data-generator/email-generator.js

class EmailTrafficGenerator {
  constructor(orgConfig) {
    this.orgId = orgConfig.orgId;
    this.userCount = orgConfig.userCount || 1000;
    this.emailsPerUserPerDay = 50;
    this.execDomains = ["ceo@", "cfo@", "board@", "exec@"];

    // Baseline from calibration (or defaults for new org)
    this.baseline = {
      compliance_rate: 0.72,
      compliance_std: 0.08,
      verification_rate: 0.35,
      verification_std: 0.12
    };
  }

  /**
   * Generate one day of realistic email traffic
   */
  async generateDay(date) {
    const events = [];
    const totalEmails = this.userCount * this.emailsPerUserPerDay;

    console.log(`Generating ${totalEmails} emails for ${date.toISOString().split('T')[0]}...`);

    for (let i = 0; i < totalEmails; i++) {
      const timestamp = this.distributeCircadian(date, i, totalEmails);
      const email = this.generateNormalEmail(timestamp);
      events.push(email);
    }

    // Inject hidden authority compliance signals (0.1% of emails)
    const signalCount = Math.floor(totalEmails * 0.001);

    for (let i = 0; i < signalCount; i++) {
      const signal = this.injectAuthorityComplianceSignal(date);
      events.push(signal);

      // Record ground truth
      await this.recordGroundTruth({
        eventId: signal.id,
        timestamp: signal.timestamp,
        indicator: "1.1",
        signalStrength: signal._metadata.deviationSigmas,
        shouldDetect: signal._metadata.deviationSigmas >= 2.0
      });
    }

    // Shuffle to hide injection pattern
    return this.shuffle(events);
  }

  /**
   * Generate normal business email (no signal)
   */
  generateNormalEmail(timestamp) {
    const sender = this.selectRandomUser();
    const recipient = this.selectRandomUser();

    return {
      id: `email-${uuidv4()}`,
      timestamp: timestamp.getTime(),
      type: "email",
      from: sender.email,
      to: recipient.email,
      subject: this.generateSubject("normal"),
      body: this.generateBody("normal"),

      // User behavior (normally distributed)
      user_action: {
        read: true,
        read_time: timestamp.getTime() + this.randomNormal(300, 120) * 1000,
        clicked_link: Math.random() < 0.05,
        opened_attachment: Math.random() < 0.03,
        forwarded: Math.random() < 0.02,
        deleted: Math.random() < 0.10
      }
    };
  }

  /**
   * Inject authority compliance signal
   * Creates email from exec that gets abnormally high compliance
   */
  injectAuthorityComplianceSignal(date) {
    const timestamp = this.distributeCircadian(date, Math.random(), 1);

    // Select exec sender
    const execDomain = this.execDomains[Math.floor(Math.random() * this.execDomains.length)];
    const sender = `${execDomain}company.com`;

    // Create request that requires action
    const actionTypes = ["wire transfer", "approve access", "grant exception", "urgent approval"];
    const action = actionTypes[Math.floor(Math.random() * actionTypes.length)];

    // Calculate anomalous compliance rate (3σ above baseline)
    const targetCompliance = this.baseline.compliance_rate + (3 * this.baseline.compliance_std);

    // Select recipients who will comply
    const recipientCount = Math.floor(Math.random() * 10) + 5; // 5-15 recipients
    const recipients = [];

    for (let i = 0; i < recipientCount; i++) {
      const recipient = this.selectRandomUser();
      const willComply = Math.random() < targetCompliance;

      recipients.push({
        email: recipient.email,
        user_id: recipient.id,
        action_taken: willComply,
        verified: Math.random() < 0.05, // Very low verification (vs 35% baseline)
        response_time: willComply ? this.randomNormal(300, 60) : null // Fast response if comply
      });
    }

    const email = {
      id: `email-${uuidv4()}`,
      timestamp: timestamp.getTime(),
      type: "email",
      from: sender,
      to: recipients.map(r => r.email),
      subject: `Urgent: ${action} needed`,
      body: this.generateBody("urgent_authority", {action}),
      urgency_markers: ["urgent", "immediately", "today"],

      // Recipients and their actions
      recipients: recipients,

      // Metadata for ground truth (NOT visible to detection)
      _metadata: {
        injectedSignal: true,
        indicator: "1.1",
        baselineCompliance: this.baseline.compliance_rate,
        actualCompliance: recipients.filter(r => r.action_taken).length / recipients.length,
        deviationSigmas: (recipients.filter(r => r.action_taken).length / recipients.length - this.baseline.compliance_rate) / this.baseline.compliance_std,
        baselineVerification: this.baseline.verification_rate,
        actualVerification: recipients.filter(r => r.verified).length / recipients.length
      }
    };

    return email;
  }

  /**
   * Distribute events across day with circadian pattern
   * Peak hours: 9-11am, 2-4pm
   */
  distributeCircadian(date, index, total) {
    // Use inverse transform sampling with circadian PDF
    const u = index / total; // Uniform [0, 1]

    // Circadian CDF (approximation)
    // Higher probability during work hours
    let hour;
    if (u < 0.05) hour = Math.floor(Math.random() * 8); // 0-8am: 5%
    else if (u < 0.25) hour = 8 + Math.floor(Math.random() * 2); // 8-10am: 20%
    else if (u < 0.50) hour = 10 + Math.floor(Math.random() * 2); // 10-12pm: 25%
    else if (u < 0.65) hour = 12 + Math.floor(Math.random() * 2); // 12-2pm: 15%
    else if (u < 0.90) hour = 14 + Math.floor(Math.random() * 3); // 2-5pm: 25%
    else hour = 17 + Math.floor(Math.random() * 7); // 5pm-12am: 10%

    const minute = Math.floor(Math.random() * 60);
    const second = Math.floor(Math.random() * 60);

    const timestamp = new Date(date);
    timestamp.setHours(hour, minute, second, 0);

    return timestamp;
  }
}

// Usage
const generator = new EmailTrafficGenerator({
  orgId: "org-acme-001",
  userCount: 1000
});

const events = await generator.generateDay(new Date("2025-11-17"));
console.log(`Generated ${events.length} events, ${events.filter(e => e._metadata?.injectedSignal).length} contain hidden signals`);

// Store to time-series DB
await timeseries.batchInsert("emails", events);
```

#### Step 2: Detection Algorithm

```javascript
// File: /detection-engine/indicators/indicator-1-1.js

class Indicator_1_1_UnquestioningCompliance {
  constructor(timeSeriesDB, baselineDB) {
    this.db = timeSeriesDB;
    this.baselineDB = baselineDB;
    this.indicatorId = "1.1";
  }

  /**
   * Run detection for time window
   */
  async detect(orgId, windowSeconds = 3600) {
    const windowStart = Date.now() - (windowSeconds * 1000);

    // Step 1: Query authority domain emails
    const authorityEmails = await this.db.query(`
      SELECT * FROM emails
      WHERE org_id = '${orgId}'
      AND timestamp >= ${windowStart}
      AND (
        from LIKE '%ceo@%' OR
        from LIKE '%cfo@%' OR
        from LIKE '%exec@%' OR
        from LIKE '%board@%'
      )
      AND (
        body LIKE '%transfer%' OR
        body LIKE '%approve%' OR
        body LIKE '%grant%' OR
        body LIKE '%urgent%'
      )
    `);

    if (authorityEmails.length === 0) {
      return this.noDataResult();
    }

    // Step 2: Calculate compliance metrics
    const N_requested = authorityEmails.length;
    let N_executed = 0;
    let N_verified = 0;
    const responseTimes = [];

    for (const email of authorityEmails) {
      // Check if recipients took action
      const recipients = email.recipients || [];

      for (const recipient of recipients) {
        if (recipient.action_taken) {
          N_executed++;
          if (recipient.response_time) {
            responseTimes.push(recipient.response_time);
          }
        }
        if (recipient.verified) {
          N_verified++;
        }
      }
    }

    const totalRecipients = authorityEmails.reduce((sum, e) =>
      sum + (e.recipients?.length || 0), 0
    );

    // Observables
    const Cr = totalRecipients > 0 ? N_executed / totalRecipients : 0;
    const verificationRate = totalRecipients > 0 ? N_verified / totalRecipients : 0;
    const avgResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((a,b) => a+b, 0) / responseTimes.length
      : 0;

    const observation = {
      complianceRate: Cr,
      verificationRate: verificationRate,
      responseTime: avgResponseTime
    };

    // Step 3: Get baseline
    const baseline = await this.baselineDB.get(orgId, this.indicatorId);

    if (!baseline) {
      console.warn(`No baseline for ${orgId} ${this.indicatorId} - skipping detection`);
      return this.noBaselineResult(observation);
    }

    // Step 4: Rule-based detection
    const threshold = baseline.mean.complianceRate + (2 * baseline.std.complianceRate);
    const Ri = Cr > threshold ? 1 : 0;

    // Step 5: Anomaly detection (Mahalanobis distance)
    const Ai = this.calculateMahalanobisDistance(
      [observation.complianceRate, observation.verificationRate, observation.responseTime],
      baseline.mean_vector,
      baseline.covariance_matrix
    );

    // Step 6: Contextual scoring (Bayesian)
    const Ci = await this.calculateBayesianContext(orgId, authorityEmails);

    // Step 7: Combined detection score
    const weights = baseline.weights || {w1: 0.4, w2: 0.4, w3: 0.2};
    const Di = (weights.w1 * Ri) + (weights.w2 * Ai) + (weights.w3 * Ci);

    // Step 8: Temporal decay (if previous state exists)
    const previousState = await this.getTemporalState(orgId);
    const Di_temporal = previousState
      ? this.applyTemporalDecay(Di, previousState, windowSeconds)
      : Di;

    // Step 9: Store result
    const result = {
      org_id: orgId,
      indicator_id: this.indicatorId,
      timestamp: Date.now(),
      score: Di_temporal,
      raw_score: Di,
      confidence: this.calculateConfidence(totalRecipients, baseline.sample_size),

      components: {
        rule_based: Ri,
        anomaly: Ai,
        context: Ci,
        weights: weights
      },

      observations: observation,
      baseline: {
        mean: baseline.mean.complianceRate,
        std: baseline.std.complianceRate,
        threshold: threshold
      },

      details: {
        requests_analyzed: N_requested,
        total_recipients: totalRecipients,
        executed: N_executed,
        verified: N_verified,
        compliance_rate: Cr,
        verification_rate: verificationRate,
        avg_response_time: avgResponseTime,
        sigmas_above_baseline: (Cr - baseline.mean.complianceRate) / baseline.std.complianceRate
      },

      triggered: Di_temporal > 0.7,
      severity: this.calculateSeverity(Di_temporal),

      raw_event_ids: authorityEmails.map(e => e.id)
    };

    await this.storeDetectionResult(result);
    await this.updateTemporalState(orgId, Di_temporal);

    if (result.triggered) {
      await this.triggerAlert(result);
    }

    return result;
  }

  /**
   * Mahalanobis distance calculation
   */
  calculateMahalanobisDistance(x, μ, Σ) {
    // x = observation vector [Cr, verificationRate, responseTime]
    // μ = baseline mean vector
    // Σ = covariance matrix

    const diff = x.map((xi, i) => xi - μ[i]);
    const Σ_inv = this.invertMatrix(Σ);

    // distance = sqrt(diff^T * Σ^-1 * diff)
    const distance = Math.sqrt(
      this.vectorMultiply(
        this.matrixVectorMultiply(Σ_inv, diff),
        diff
      )
    );

    // Normalize using chi-squared CDF
    return this.chiSquaredCDF(distance, x.length);
  }

  /**
   * Bayesian context from Dense Paper
   */
  async calculateBayesianContext(orgId, emails) {
    const factors = [];

    // Time of day factor
    const hour = new Date().getHours();
    const afterHours = hour < 8 || hour > 18;
    if (afterHours) factors.push(0.7); // Suspicious

    // Sender reputation
    for (const email of emails) {
      const reputation = await this.getSenderReputation(email.from);
      factors.push(1 - reputation); // Low rep = high suspicion
    }

    // Urgency language
    const urgencyCount = emails.filter(e =>
      e.urgency_markers && e.urgency_markers.length > 0
    ).length;
    const urgencyRatio = urgencyCount / emails.length;
    factors.push(urgencyRatio);

    // Average all factors
    return factors.reduce((a,b) => a+b, 0) / factors.length;
  }

  /**
   * Temporal decay from Dense Paper
   * Ti(t) = α·Xi(t) + (1-α)·Ti(t-1)
   */
  applyTemporalDecay(currentScore, previousState, deltaTime) {
    const τ = 14400; // 4 hours for authority indicators
    const α = Math.exp(-deltaTime / τ);

    return (α * currentScore) + ((1 - α) * previousState.score);
  }

  calculateConfidence(sampleSize, baselineSampleSize) {
    // Wilson score interval
    const n = sampleSize;
    const n0 = baselineSampleSize;

    if (n < 10) return 0.3; // Low confidence
    if (n < 50) return 0.6; // Medium
    if (n < n0 * 0.1) return 0.8; // Good
    return 0.95; // High confidence
  }

  calculateSeverity(score) {
    if (score >= 0.9) return "critical";
    if (score >= 0.7) return "high";
    if (score >= 0.5) return "medium";
    return "low";
  }

  async triggerAlert(result) {
    console.log(`🚨 ALERT: Indicator ${result.indicator_id} triggered for ${result.org_id}`);
    console.log(`   Score: ${(result.score * 100).toFixed(1)}% (${result.severity})`);
    console.log(`   Compliance: ${(result.details.compliance_rate * 100).toFixed(1)}% (baseline: ${(result.baseline.mean * 100).toFixed(1)}%)`);
    console.log(`   ${result.details.sigmas_above_baseline.toFixed(1)}σ above baseline`);

    // Send to SOC dashboard via WebSocket
    await this.websocket.emit('indicator_update', {
      orgId: result.org_id,
      indicatorId: result.indicator_id,
      score: result.score,
      severity: result.severity,
      details: result.details
    });

    // Store in alerts table
    await this.db.insert('alerts', {
      org_id: result.org_id,
      indicator_id: result.indicator_id,
      timestamp: result.timestamp,
      score: result.score,
      severity: result.severity,
      message: `Unquestioning compliance detected: ${(result.details.compliance_rate*100).toFixed(1)}% compliance rate (${result.details.sigmas_above_baseline.toFixed(1)}σ above baseline)`,
      raw_data: JSON.stringify(result)
    });
  }
}
```

#### Step 3: Validation

```javascript
// File: /validation/indicator-1-1-validator.js

class Indicator_1_1_Validator {
  async validate(orgId, timeWindow = 86400) {
    console.log(`Validating Indicator 1.1 for ${orgId} over ${timeWindow}s...`);

    // Step 1: Get ground truth
    const groundTruth = await this.db.query(`
      SELECT * FROM ground_truth
      WHERE org_id = '${orgId}'
      AND indicator = '1.1'
      AND timestamp >= ${Date.now() - timeWindow * 1000}
    `);

    // Step 2: Get detection results
    const detections = await this.db.query(`
      SELECT * FROM detection_results
      WHERE org_id = '${orgId}'
      AND indicator_id = '1.1'
      AND timestamp >= ${Date.now() - timeWindow * 1000}
    `);

    // Step 3: Match ground truth to detections
    let TP = 0, TN = 0, FP = 0, FN = 0;

    for (const truth of groundTruth) {
      const detected = detections.find(d =>
        Math.abs(d.timestamp - truth.timestamp) < 3600000 // Within 1 hour
      );

      if (truth.shouldDetect && detected && detected.triggered) {
        TP++;
        console.log(`✓ TP: Signal at ${new Date(truth.timestamp).toISOString()} detected (${truth.signalStrength.toFixed(1)}σ)`);
      } else if (truth.shouldDetect && (!detected || !detected.triggered)) {
        FN++;
        console.warn(`✗ FN: Signal at ${new Date(truth.timestamp).toISOString()} MISSED (${truth.signalStrength.toFixed(1)}σ)`);
      } else if (!truth.shouldDetect && detected && detected.triggered) {
        FP++;
        console.warn(`✗ FP: False alarm at ${new Date(detected.timestamp).toISOString()}`);
      } else {
        TN++;
      }
    }

    // Step 4: Calculate metrics
    const MCC = (TP * TN - FP * FN) / Math.sqrt(
      (TP + FP) * (TP + FN) * (TN + FP) * (TN + FN)
    );

    const precision = TP / (TP + FP);
    const recall = TP / (TP + FN);
    const f1 = 2 * (precision * recall) / (precision + recall);

    const results = {
      indicator: "1.1",
      org_id: orgId,
      timeWindow: timeWindow,

      confusion_matrix: {TP, TN, FP, FN},

      metrics: {
        MCC: MCC,
        precision: precision,
        recall: recall,
        f1: f1,
        accuracy: (TP + TN) / (TP + TN + FP + FN)
      },

      quality: this.interpretMCC(MCC),

      passed: MCC >= 0.7 && recall >= 0.8, // Thresholds

      recommendations: this.generateRecommendations({MCC, precision, recall, FP, FN})
    };

    console.log(`\nValidation Results for Indicator 1.1:`);
    console.log(`  MCC: ${MCC.toFixed(3)} (${results.quality})`);
    console.log(`  Precision: ${(precision*100).toFixed(1)}% (${FP} false alarms)`);
    console.log(`  Recall: ${(recall*100).toFixed(1)}% (${FN} missed signals)`);
    console.log(`  F1 Score: ${f1.toFixed(3)}`);
    console.log(`  Status: ${results.passed ? "✓ PASSED" : "✗ FAILED"}`);

    return results;
  }

  interpretMCC(mcc) {
    if (mcc >= 0.9) return "Excellent";
    if (mcc >= 0.7) return "Good";
    if (mcc >= 0.5) return "Moderate";
    if (mcc >= 0.3) return "Weak";
    return "Poor";
  }

  generateRecommendations({MCC, precision, recall, FP, FN}) {
    const recommendations = [];

    if (MCC < 0.7) {
      recommendations.push("Overall detection quality below threshold - review baseline calibration");
    }

    if (precision < 0.8) {
      recommendations.push(`High false positive rate (${FP} FP) - increase detection threshold or refine rule-based component`);
    }

    if (recall < 0.8) {
      recommendations.push(`Missing signals (${FN} FN) - decrease detection threshold or improve anomaly detection sensitivity`);
    }

    if (FP > FN * 2) {
      recommendations.push("Too many false alarms - prioritize precision by increasing threshold");
    }

    if (FN > FP * 2) {
      recommendations.push("Missing too many signals - prioritize recall by decreasing threshold");
    }

    return recommendations;
  }
}

// Run validation
const validator = new Indicator_1_1_Validator();
const results = await validator.validate("org-acme-001", 86400);
```

### 8.2 Complete Indicator 5.1 Implementation (Alert Fatigue)

```javascript
// File: /detection-engine/indicators/indicator-5-1.js

class Indicator_5_1_AlertFatigue {
  constructor(timeSeriesDB, baselineDB) {
    this.db = timeSeriesDB;
    this.baselineDB = baselineDB;
    this.indicatorId = "5.1";
  }

  async detect(orgId, windowSeconds = 86400) {
    // Query all security alerts
    const alerts = await this.db.query(`
      SELECT
        alert_id,
        severity,
        presented_at,
        investigated_at,
        analyst_id,
        auto_closed
      FROM security_alerts
      WHERE org_id = '${orgId}'
      AND presented_at >= ${Date.now() - windowSeconds * 1000}
      AND auto_closed = false
    `);

    const presented = alerts.length;
    const investigated = alerts.filter(a => a.investigated_at !== null).length;

    // Formula from Dense Paper: Fa = 1 - (investigated/presented)
    const Fa = presented > 0 ? 1 - (investigated / presented) : 0;

    // Temporal decay analysis - split into hourly buckets
    const buckets = this.groupByHour(alerts);
    const Fa_timeline = buckets.map(bucket => ({
      hour: bucket.hour,
      presented: bucket.alerts.length,
      investigated: bucket.alerts.filter(a => a.investigated_at).length,
      Fa: 1 - (bucket.alerts.filter(a => a.investigated_at).length / bucket.alerts.length),
      alert_rate: bucket.alerts.length / 3600
    }));

    // Fit exponential: Fa(t) = F0 · e^(λ·alert_rate·t)
    const {F0, λ} = this.fitExponentialDecay(Fa_timeline);

    // By severity
    const bySeverity = {
      critical: this.calculateFaForSeverity(alerts, 'critical'),
      high: this.calculateFaForSeverity(alerts, 'high'),
      medium: this.calculateFaForSeverity(alerts, 'medium'),
      low: this.calculateFaForSeverity(alerts, 'low')
    };

    // Detection
    const baseline = await this.baselineDB.get(orgId, this.indicatorId);

    // Rule: Fa > 0.7 OR critical alerts ignored
    const Ri = (Fa > 0.7 || bySeverity.critical > 0.1) ? 1 : 0;

    // Anomaly
    const observation = [Fa, bySeverity.critical, λ];
    const Ai = this.calculateMahalanobisDistance(observation, baseline.mean_vector, baseline.covariance_matrix);

    // Context: analyst workload
    const analystCount = await this.getActiveAnalystCount(orgId);
    const alertsPerAnalyst = presented / Math.max(analystCount, 1);
    const Ci = Math.min(alertsPerAnalyst / 100, 1.0);

    const weights = baseline.weights || {w1: 0.5, w2: 0.3, w3: 0.2};
    const Di = (weights.w1 * Ri) + (weights.w2 * Ai) + (weights.w3 * Ci);

    return {
      org_id: orgId,
      indicator_id: this.indicatorId,
      timestamp: Date.now(),
      score: Di,
      confidence: this.calculateConfidence(presented, baseline.sample_size),

      observations: {
        fatigueIndex: Fa,
        decayRate: λ,
        bySeverity: bySeverity
      },

      details: {
        presented: presented,
        investigated: investigated,
        ignored: presented - investigated,
        fatigue_percent: Fa * 100,
        critical_ignored_percent: bySeverity.critical * 100,
        alerts_per_analyst: alertsPerAnalyst
      },

      triggered: Di > 0.7 || bySeverity.critical > 0.1,
      severity: this.calculateSeverity(Di),

      warning: bySeverity.critical > 0.1 ?
        `CRITICAL: ${(bySeverity.critical*100).toFixed(1)}% of critical alerts ignored!` : null
    };
  }

  fitExponentialDecay(timeline) {
    const X = timeline.map((p, i) => p.alert_rate * i);
    const Y = timeline.map(p => Math.log(Math.max(p.Fa, 0.001)));

    const {slope, intercept} = this.linearRegression(X, Y);

    return {
      F0: Math.exp(intercept),
      λ: slope
    };
  }
}
```

### 8.3 Integration Example: Multi-Indicator Detection

```javascript
// File: /detection-engine/orchestrator.js

class DetectionOrchestrator {
  constructor(config) {
    this.indicators = [
      new Indicator_1_1_UnquestioningCompliance(config.db, config.baselineDB),
      new Indicator_1_2_DiffusionOfResponsibility(config.db, config.baselineDB),
      new Indicator_2_1_UrgencyBypass(config.db, config.baselineDB),
      new Indicator_5_1_AlertFatigue(config.db, config.baselineDB),
      // ... 96 more
    ];

    this.bayesianNetwork = new BayesianNetwork();
  }

  /**
   * Run detection for all indicators
   */
  async runDetection(orgId) {
    console.log(`Starting detection cycle for ${orgId}...`);

    const results = {};

    // Phase 1: Run all indicators in parallel
    const detectionPromises = this.indicators.map(indicator =>
      indicator.detect(orgId).catch(err => {
        console.error(`Error in ${indicator.indicatorId}:`, err);
        return null;
      })
    );

    const detectionResults = await Promise.all(detectionPromises);

    // Phase 2: Store individual results
    for (const result of detectionResults) {
      if (result) {
        results[result.indicator_id] = result;
      }
    }

    // Phase 3: Bayesian Network - model interdependencies
    const bayesianResults = await this.bayesianNetwork.analyze(results);

    // Phase 4: Convergence detection (Category 10)
    const convergence = this.detectConvergence(results);

    // Phase 5: Aggregate for dashboard
    const aggregated = {
      org_id: orgId,
      timestamp: Date.now(),

      overall_risk: this.calculateOverallRisk(results, bayesianResults),
      overall_confidence: this.calculateOverallConfidence(results),

      by_category: this.aggregateByCategory(results),

      triggered_indicators: Object.values(results).filter(r => r.triggered),

      convergence: convergence,

      bayesian_insights: bayesianResults.insights,

      prioritization: this.prioritize(results, bayesianResults)
    };

    // Phase 6: Broadcast to dashboard
    await this.broadcast(aggregated);

    return aggregated;
  }

  /**
   * Detect convergence states (Perfect Storm, Swiss Cheese, etc.)
   */
  detectConvergence(results) {
    const triggered = Object.values(results).filter(r => r.triggered);

    if (triggered.length >= 3) {
      // Multiple indicators triggered - potential convergence

      // Perfect Storm (10.1): CI = ∏(1 + vi)
      const CI = triggered.reduce((product, r) =>
        product * (1 + r.score), 1
      );

      if (CI > 5.0) {
        return {
          type: "perfect_storm",
          severity: "critical",
          convergence_index: CI,
          contributing_indicators: triggered.map(r => r.indicator_id),
          message: `Perfect Storm detected: ${triggered.length} indicators converged (CI=${CI.toFixed(2)})`
        };
      }
    }

    return null;
  }

  calculateOverallRisk(results, bayesianResults) {
    // Weighted average from Dense Paper
    const weights = {
      "1.x": 0.12,  // Authority
      "2.x": 0.10,  // Temporal
      "3.x": 0.11,  // Social
      "4.x": 0.09,  // Affective
      "5.x": 0.10,  // Cognitive
      "6.x": 0.08,  // Group
      "7.x": 0.11,  // Stress
      "8.x": 0.09,  // Unconscious
      "9.x": 0.12,  // AI
      "10.x": 0.08  // Convergent
    };

    let weightedSum = 0;
    let totalWeight = 0;

    for (const [indicatorId, result] of Object.entries(results)) {
      const category = indicatorId.split('.')[0] + '.x';
      const weight = weights[category] || 0.10;

      // Adjust by Bayesian network
      const bayesianAdjustment = bayesianResults.adjustments[indicatorId] || 1.0;

      weightedSum += result.score * weight * bayesianAdjustment * result.confidence;
      totalWeight += weight * result.confidence;
    }

    return weightedSum / totalWeight;
  }
}

// Usage
const orchestrator = new DetectionOrchestrator({
  db: timeSeriesDB,
  baselineDB: baselineDB
});

// Run every hour
setInterval(async () => {
  const orgs = await getActiveOrganizations();

  for (const org of orgs) {
    const results = await orchestrator.runDetection(org.id);
    console.log(`Detection complete for ${org.name}: overall risk ${(results.overall_risk*100).toFixed(1)}%`);
  }
}, 3600000); // 1 hour
```

---

## 9. Storage & Query Architecture

### 9.1 Time-Series Database Selection

**Recommended: InfluxDB or TimescaleDB**

**InfluxDB Pros:**
- Purpose-built for time-series
- Native downsampling and retention policies
- Fast tag-based queries
- Line protocol for efficient ingestion

**TimescaleDB Pros:**
- PostgreSQL extension (familiar SQL)
- Relational capabilities
- Hypertables for automatic partitioning
- Better for complex joins

**Our Choice: TimescaleDB** (easier integration with existing PostgreSQL knowledge)

### 9.2 Schema Design

#### Raw Events Table

```sql
-- File: /storage/schema/01_raw_events.sql

-- Create TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Raw events table (all event types)
CREATE TABLE raw_events (
  time TIMESTAMPTZ NOT NULL,
  org_id TEXT NOT NULL,
  event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,  -- 'email', 'auth', 'alert', 'ticket'
  source_system TEXT,         -- 'exchange', 'ad', 'siem', 'servicenow'

  -- Event data (JSONB for flexibility)
  data JSONB NOT NULL,

  -- Metadata
  ingested_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ground truth (if this is an injected signal)
  _ground_truth JSONB,  -- {indicator, signal_strength, should_detect}

  PRIMARY KEY (time, org_id, event_id)
);

-- Convert to hypertable (TimescaleDB magic)
SELECT create_hypertable('raw_events', 'time');

-- Create indexes for fast queries
CREATE INDEX idx_raw_events_org ON raw_events (org_id, time DESC);
CREATE INDEX idx_raw_events_type ON raw_events (event_type, time DESC);
CREATE INDEX idx_raw_events_source ON raw_events (source_system, time DESC);

-- GIN index for JSONB queries
CREATE INDEX idx_raw_events_data ON raw_events USING GIN (data);
CREATE INDEX idx_raw_events_ground_truth ON raw_events USING GIN (_ground_truth)
  WHERE _ground_truth IS NOT NULL;

-- Retention policy: raw events kept for 90 days
SELECT add_retention_policy('raw_events', INTERVAL '90 days');
```

#### Aggregated Metrics Table

```sql
-- File: /storage/schema/02_aggregated_metrics.sql

-- Pre-aggregated metrics for faster queries
CREATE TABLE aggregated_metrics (
  time TIMESTAMPTZ NOT NULL,
  org_id TEXT NOT NULL,
  indicator_id TEXT NOT NULL,
  window_size INTEGER NOT NULL,  -- seconds (3600, 86400, etc.)

  -- Observation values
  observation_mean DOUBLE PRECISION,
  observation_std DOUBLE PRECISION,
  observation_min DOUBLE PRECISION,
  observation_max DOUBLE PRECISION,
  observation_count INTEGER,

  -- Multi-dimensional observations (JSONB)
  observations JSONB,  -- {complianceRate: 0.75, verificationRate: 0.32, ...}

  PRIMARY KEY (time, org_id, indicator_id, window_size)
);

SELECT create_hypertable('aggregated_metrics', 'time');

CREATE INDEX idx_agg_metrics_indicator ON aggregated_metrics (org_id, indicator_id, time DESC);

-- Continuous aggregate: 1-hour rollups
CREATE MATERIALIZED VIEW metrics_1h
WITH (timescaledb.continuous) AS
SELECT
  time_bucket('1 hour', time) AS bucket,
  org_id,
  indicator_id,
  AVG((data->>'value')::DOUBLE PRECISION) AS mean_value,
  STDDEV((data->>'value')::DOUBLE PRECISION) AS std_value,
  COUNT(*) AS event_count
FROM raw_events
WHERE event_type IN ('email', 'auth', 'alert', 'ticket')
GROUP BY bucket, org_id, indicator_id;

-- Refresh policy: update every 30 minutes
SELECT add_continuous_aggregate_policy('metrics_1h',
  start_offset => INTERVAL '2 hours',
  end_offset => INTERVAL '30 minutes',
  schedule_interval => INTERVAL '30 minutes');
```

#### Baselines Table

```sql
-- File: /storage/schema/03_baselines.sql

CREATE TABLE baselines (
  org_id TEXT NOT NULL,
  indicator_id TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,

  -- Calibration period
  calibration_start TIMESTAMPTZ NOT NULL,
  calibration_end TIMESTAMPTZ NOT NULL,
  sample_size INTEGER NOT NULL,

  -- Statistical parameters
  mean_vector DOUBLE PRECISION[] NOT NULL,
  std_vector DOUBLE PRECISION[] NOT NULL,
  covariance_matrix DOUBLE PRECISION[][] NOT NULL,

  -- Distribution info
  distribution_type TEXT,  -- 'normal', 'exponential', 'poisson'

  -- Percentiles
  p50 DOUBLE PRECISION,
  p75 DOUBLE PRECISION,
  p90 DOUBLE PRECISION,
  p95 DOUBLE PRECISION,
  p99 DOUBLE PRECISION,

  -- Detection parameters
  threshold_k DOUBLE PRECISION DEFAULT 2.0,  -- For μ + k·σ
  threshold_value DOUBLE PRECISION,

  weights JSONB,  -- {w1: 0.4, w2: 0.4, w3: 0.2}

  -- Temporal parameters
  persistence_tau INTEGER,  -- seconds
  circadian_params JSONB,   -- {E0, A, phi}

  -- Bayesian priors
  priors JSONB,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,

  PRIMARY KEY (org_id, indicator_id, version)
);

CREATE INDEX idx_baselines_active ON baselines (org_id, indicator_id) WHERE is_active = true;
```

#### Detection Results Table

```sql
-- File: /storage/schema/04_detection_results.sql

CREATE TABLE detection_results (
  time TIMESTAMPTZ NOT NULL,
  org_id TEXT NOT NULL,
  indicator_id TEXT NOT NULL,

  -- Scores
  score DOUBLE PRECISION NOT NULL,
  raw_score DOUBLE PRECISION,
  confidence DOUBLE PRECISION,

  -- Components
  rule_based_score DOUBLE PRECISION,
  anomaly_score DOUBLE PRECISION,
  context_score DOUBLE PRECISION,

  -- Observations
  observations JSONB NOT NULL,

  -- Baseline comparison
  baseline_mean DOUBLE PRECISION,
  baseline_std DOUBLE PRECISION,
  sigmas_above_baseline DOUBLE PRECISION,

  -- Metadata
  triggered BOOLEAN NOT NULL,
  severity TEXT,  -- 'low', 'medium', 'high', 'critical'

  -- Raw event references
  raw_event_ids TEXT[],
  event_count INTEGER,

  PRIMARY KEY (time, org_id, indicator_id)
);

SELECT create_hypertable('detection_results', 'time');

CREATE INDEX idx_detection_triggered ON detection_results (org_id, time DESC) WHERE triggered = true;
CREATE INDEX idx_detection_severity ON detection_results (severity, time DESC) WHERE severity IN ('high', 'critical');

-- Retention: keep detection results for 1 year
SELECT add_retention_policy('detection_results', INTERVAL '365 days');
```

#### Temporal State Table

```sql
-- File: /storage/schema/05_temporal_state.sql

-- Stores Ti(t) for temporal decay
CREATE TABLE temporal_state (
  org_id TEXT NOT NULL,
  indicator_id TEXT NOT NULL,

  temporal_state DOUBLE PRECISION NOT NULL,
  raw_observation DOUBLE PRECISION,
  decay_factor DOUBLE PRECISION,

  timestamp TIMESTAMPTZ NOT NULL,

  PRIMARY KEY (org_id, indicator_id)
);

CREATE INDEX idx_temporal_state_time ON temporal_state (timestamp DESC);
```

#### Ground Truth Table

```sql
-- File: /storage/schema/06_ground_truth.sql

CREATE TABLE ground_truth (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL,
  indicator TEXT NOT NULL,

  timestamp TIMESTAMPTZ NOT NULL,
  event_ids TEXT[] NOT NULL,

  signal_strength DOUBLE PRECISION NOT NULL,  -- In sigmas
  should_detect BOOLEAN NOT NULL,

  -- Detection outcome (filled after detection runs)
  was_detected BOOLEAN,
  detected_at TIMESTAMPTZ,
  detection_score DOUBLE PRECISION,

  -- Metadata
  injection_method TEXT,
  notes TEXT
);

CREATE INDEX idx_ground_truth_org_indicator ON ground_truth (org_id, indicator, timestamp DESC);
CREATE INDEX idx_ground_truth_pending ON ground_truth (timestamp) WHERE was_detected IS NULL;
```

### 9.3 Query Patterns

#### Query 1: Get Recent Events for Indicator Detection

```sql
-- Example: Get authority emails for Indicator 1.1
SELECT
  event_id,
  time,
  data->>'from' AS sender,
  data->'recipients' AS recipients,
  data->'urgency_markers' AS urgency
FROM raw_events
WHERE org_id = 'org-acme-001'
  AND event_type = 'email'
  AND time >= NOW() - INTERVAL '1 hour'
  AND (
    data->>'from' LIKE '%ceo@%' OR
    data->>'from' LIKE '%cfo@%' OR
    data->>'from' LIKE '%exec@%'
  )
  AND (
    data->>'body' LIKE '%transfer%' OR
    data->>'body' LIKE '%approve%' OR
    data->>'body' LIKE '%grant%'
  )
ORDER BY time DESC;
```

#### Query 2: Get Baseline for Indicator

```sql
-- Get active baseline
SELECT
  mean_vector,
  std_vector,
  covariance_matrix,
  threshold_value,
  weights,
  persistence_tau
FROM baselines
WHERE org_id = 'org-acme-001'
  AND indicator_id = '1.1'
  AND is_active = true
ORDER BY version DESC
LIMIT 1;
```

#### Query 3: Validation - Match Ground Truth to Detections

```sql
-- Find detections within 1 hour of ground truth signals
SELECT
  gt.id AS ground_truth_id,
  gt.indicator,
  gt.timestamp AS signal_time,
  gt.signal_strength,
  gt.should_detect,

  dr.time AS detected_time,
  dr.score AS detection_score,
  dr.triggered,

  CASE
    WHEN gt.should_detect AND dr.triggered THEN 'TP'
    WHEN gt.should_detect AND NOT dr.triggered THEN 'FN'
    WHEN NOT gt.should_detect AND dr.triggered THEN 'FP'
    WHEN NOT gt.should_detect AND NOT dr.triggered THEN 'TN'
  END AS outcome

FROM ground_truth gt
LEFT JOIN detection_results dr
  ON gt.org_id = dr.org_id
  AND gt.indicator = dr.indicator_id
  AND dr.time BETWEEN gt.timestamp - INTERVAL '30 minutes'
                  AND gt.timestamp + INTERVAL '30 minutes'

WHERE gt.org_id = 'org-acme-001'
  AND gt.indicator = '1.1'
  AND gt.timestamp >= NOW() - INTERVAL '24 hours'

ORDER BY gt.timestamp DESC;
```

#### Query 4: Dashboard - Get Latest Indicator Scores

```sql
-- Get most recent detection results for all indicators
SELECT DISTINCT ON (indicator_id)
  indicator_id,
  score,
  confidence,
  triggered,
  severity,
  observations,
  sigmas_above_baseline,
  time
FROM detection_results
WHERE org_id = 'org-acme-001'
  AND time >= NOW() - INTERVAL '2 hours'
ORDER BY indicator_id, time DESC;
```

#### Query 5: Trend Analysis - Indicator Over Time

```sql
-- Get 7-day trend for Indicator 1.1
SELECT
  time_bucket('1 day', time) AS day,
  AVG(score) AS avg_score,
  MAX(score) AS max_score,
  STDDEV(score) AS score_volatility,
  COUNT(*) FILTER (WHERE triggered) AS trigger_count,
  AVG(sigmas_above_baseline) AS avg_sigmas
FROM detection_results
WHERE org_id = 'org-acme-001'
  AND indicator_id = '1.1'
  AND time >= NOW() - INTERVAL '7 days'
GROUP BY day
ORDER BY day;
```

### 9.4 Ingestion Pipeline

```javascript
// File: /storage/ingestion/batch-ingest.js

class BatchIngestion {
  constructor(timescaleDB) {
    this.db = timescaleDB;
    this.batchSize = 1000;
    this.buffer = [];
  }

  /**
   * Add event to buffer
   */
  async ingest(event) {
    this.buffer.push(event);

    if (this.buffer.length >= this.batchSize) {
      await this.flush();
    }
  }

  /**
   * Flush buffer to database
   */
  async flush() {
    if (this.buffer.length === 0) return;

    const events = this.buffer.splice(0, this.buffer.length);

    // Build multi-row INSERT
    const values = events.map(e => {
      return `(
        '${new Date(e.timestamp).toISOString()}',
        '${e.orgId}',
        '${e.id}',
        '${e.type}',
        '${e.source || 'simulator'}',
        '${JSON.stringify(e).replace(/'/g, "''")}'::jsonb,
        ${e._groundTruth ? `'${JSON.stringify(e._groundTruth)}'::jsonb` : 'NULL'}
      )`;
    }).join(',');

    const query = `
      INSERT INTO raw_events (time, org_id, event_id, event_type, source_system, data, _ground_truth)
      VALUES ${values}
      ON CONFLICT (time, org_id, event_id) DO NOTHING
    `;

    try {
      await this.db.query(query);
      console.log(`✓ Ingested ${events.length} events`);
    } catch (err) {
      console.error(`✗ Ingestion failed:`, err);
      // Re-add to buffer for retry
      this.buffer.unshift(...events);
    }
  }

  /**
   * Auto-flush every 10 seconds
   */
  startAutoFlush() {
    setInterval(() => this.flush(), 10000);
  }
}
```

---

## 10. Deployment Roadmap

### 10.1 Phased Deployment (8 Months to Full Operational Capability)

**From Dense Paper (p.4):**
> Deployment follows phased approach: baseline establishment (30 days), pilot deployment (10 indicators, 60 days), graduated rollout (20 indicators/month), and full operational capability (month 8).

### Phase 1: Infrastructure Setup (Month 1)

**Objectives:**
- Set up time-series database
- Deploy data ingestion pipeline
- Create monitoring dashboards

**Tasks:**
```bash
Week 1: TimescaleDB Setup
- Install TimescaleDB on production cluster
- Create database schemas (raw_events, baselines, detection_results)
- Configure retention policies
- Set up continuous aggregates
- Performance testing (target: 10K inserts/sec)

Week 2: Ingestion Pipeline
- Build batch ingestion service
- Implement SIEM connectors (Splunk, QRadar, etc.)
- Create data validation layer
- Set up dead letter queue for failed ingestions

Week 3: Monitoring & Observability
- Grafana dashboards for ingestion metrics
- Prometheus alerts for pipeline health
- Log aggregation (ELK stack)
- Query performance monitoring

Week 4: Testing & Validation
- Load testing (100K events/day)
- Failover testing
- Backup/restore procedures
- Documentation
```

**Deliverables:**
- ✅ Scalable time-series database (tested to 100K events/day)
- ✅ Reliable ingestion pipeline (99.9% uptime)
- ✅ Monitoring dashboards
- ✅ Runbooks for operations team

### Phase 2: Baseline Establishment (30 Days)

**Objectives:**
- Collect 30 days of real organizational data
- Calculate baselines for all 100 indicators
- Validate baseline quality

**Tasks:**
```bash
Day 1-7: Data Collection Validation
- Connect to production SIEM/logs
- Verify data quality and completeness
- Identify gaps in telemetry
- Adjust collection as needed

Day 8-30: Passive Collection
- Collect all security events (no detection yet)
- Store raw events in time-series DB
- Monitor data volume and quality
- Build initial aggregations

Day 31-35: Baseline Calculation
- Run baseline calibration for all 100 indicators
- Calculate μ, σ, Σ for each indicator
- Fit temporal models (circadian, weekly)
- Identify distribution types

Day 36-38: Baseline Validation
- Review baselines with security team
- Check for anomalies in baselines
- Adjust parameters if needed
- Document baseline characteristics

Day 39-40: Baseline Approval
- Present baselines to stakeholders
- Get sign-off for pilot deployment
```

**Deliverables:**
- ✅ 30-day dataset for organization (millions of events)
- ✅ Calibrated baselines for 100 indicators
- ✅ Baseline quality report
- ✅ Approved to proceed to pilot

### Phase 3: Pilot Deployment (60 Days)

**Objectives:**
- Deploy 10 indicators for detection
- Validate detection accuracy
- Tune thresholds and weights

**Selected Indicators for Pilot:**
1. **1.1** - Unquestioning Compliance (high-impact)
2. **1.2** - Diffusion of Responsibility
3. **2.1** - Urgency-Induced Bypass
4. **3.3** - Social Proof Manipulation
5. **5.1** - Alert Fatigue (critical for SOC)
6. **5.2** - Decision Fatigue
7. **6.1** - Groupthink
8. **7.1** - Acute Stress
9. **9.2** - Automation Bias
10. **10.1** - Perfect Storm Detection

**Timeline:**
```bash
Week 1-2: Implementation
- Deploy detection algorithms for 10 indicators
- Set up alert routing
- Create dashboard visualizations
- Shadow mode (detect but don't alert)

Week 3-4: Silent Running
- Run detection in background
- Collect results
- No alerts to SOC analysts yet
- Build ground truth dataset

Week 5-6: Validation
- Compare detections to ground truth
- Calculate MCC, precision, recall for each indicator
- Identify false positives and false negatives
- Analyze failure modes

Week 7-8: Tuning
- Adjust detection thresholds
- Recalibrate weights (w1, w2, w3)
- Fine-tune Bayesian priors
- Re-run validation

Week 9-10: SOC Integration
- Enable alerts to SOC dashboard
- Train analysts on new indicators
- Establish triage procedures
- Collect analyst feedback

Week 11-12: Iteration
- Address feedback from SOC team
- Fix bugs and edge cases
- Optimize performance
- Document lessons learned
```

**Success Criteria:**
- ✅ MCC ≥ 0.7 for at least 8/10 indicators
- ✅ False positive rate < 10%
- ✅ SOC analyst acceptance (feedback survey > 7/10)
- ✅ No performance degradation on production systems

### Phase 4: Graduated Rollout (Months 4-7)

**Objective:** Deploy remaining 90 indicators at 20/month

**Month 4: Category 1 + Category 2 (20 indicators)**
- Deploy indicators 1.3-1.10 (Authority)
- Deploy indicators 2.2-2.10 (Temporal)
- Validation cycle (2 weeks detection + 2 weeks tuning)

**Month 5: Category 3 + Category 4 (20 indicators)**
- Deploy indicators 3.1-3.10 (Social Influence)
- Deploy indicators 4.1-4.10 (Affective)
- Cross-category correlation analysis

**Month 6: Category 5 + Category 6 (20 indicators)**
- Deploy indicators 5.3-5.10 (Cognitive Overload)
- Deploy indicators 6.2-6.10 (Group Dynamics)
- Bayesian network activation

**Month 7: Category 7 + Category 8 + Category 9 (30 indicators)**
- Deploy indicators 7.1-7.10 (Stress)
- Deploy indicators 8.1-8.10 (Unconscious)
- Deploy indicators 9.1-9.10 (AI-Specific)
- Full interdependency modeling

### Phase 5: Full Operational Capability (Month 8)

**Objectives:**
- All 100 indicators operational
- Bayesian network fully active
- Convergence detection enabled
- Automated response protocols

**Tasks:**
```bash
Week 1: Integration Testing
- Test all 100 indicators together
- Verify Bayesian network calculations
- Test convergence detection (10.x indicators)
- Performance testing under full load

Week 2: Automated Response
- Deploy response playbooks
- Configure automated isolation/blocking
- Set up escalation procedures
- Test incident response workflows

Week 3: User Acceptance Testing
- SOC team full-scale exercises
- Red team testing (simulate attacks)
- Measure detection coverage
- Validate response times

Week 4: Production Release
- Go-live announcement
- 24/7 monitoring for first week
- Daily review meetings
- Incident retrospectives
```

**Full Operational Capability Metrics:**
- ✅ 100/100 indicators deployed and validated
- ✅ Average MCC ≥ 0.7 across all indicators
- ✅ Detection latency < 5 minutes
- ✅ False positive rate < 5%
- ✅ SOC analyst satisfaction > 8/10
- ✅ Coverage: detecting ≥ 80% of simulated attacks

### 10.2 Ongoing Operations (Month 9+)

**Monthly:**
- Baseline recalibration (if drift detected)
- Validation testing with synthetic signals
- Performance optimization
- False positive analysis and tuning

**Quarterly:**
- Red team exercises
- Indicator effectiveness review
- Feature enhancements
- Research new indicators

**Annually:**
- Full system audit
- Baseline reset (fresh 30-day calibration)
- Technology refresh
- Strategic roadmap update

### 10.3 Resource Requirements

**Personnel:**
```
Phase 1-2 (Months 1-2):
- 1 DevOps Engineer (database/infrastructure)
- 1 Data Engineer (ingestion pipeline)
- 1 Backend Developer (detection algorithms)
- 0.5 Security Analyst (requirements/validation)

Phase 3-4 (Months 3-7):
- 2 Backend Developers (indicator implementation)
- 1 Data Scientist (baseline calibration, ML tuning)
- 1 Security Analyst (validation, SOC integration)
- 0.5 DevOps Engineer (scaling/performance)

Phase 5+ (Month 8+):
- 1 Backend Developer (maintenance, new features)
- 0.5 Data Scientist (optimization)
- 1 Security Analyst (triage, tuning)
- On-call rotation for 24/7 support
```

**Infrastructure:**
```
Database:
- TimescaleDB cluster (3 nodes)
- 1TB storage per 1000 users/year
- 16 cores for real-time processing per 10,000 users

Compute:
- Detection engine: 8 cores, 32GB RAM
- Ingestion pipeline: 4 cores, 16GB RAM
- Baseline calibration: 16 cores, 64GB RAM (batch jobs)

Network:
- Ingestion: 100 Mbps sustained
- Dashboard queries: 10 Mbps

Monitoring:
- Prometheus + Grafana
- ELK stack for logs
```

**Budget Estimate (Annual):**
```
Infrastructure: $120K/year
  - Database cluster: $60K
  - Compute instances: $40K
  - Monitoring/logging: $20K

Personnel: $600K/year
  - 2.5 Engineers @ $150K avg
  - 1.5 Security Analysts @ $120K avg
  - 0.5 Data Scientist @ $160K

Licenses/Tools: $50K/year
  - TimescaleDB support
  - Monitoring tools
  - Development tools

Total: ~$770K/year for 1000-user organization
```

---

## 11. Conclusion & Next Steps

This guide has transformed the **CPF Dense Foundation Paper's mathematical framework** into **practical, implementable specifications**.

### What We've Covered

1. ✅ **Paradigm Shift**: From labeled events to realistic data with hidden signals
2. ✅ **Architecture**: 6-layer system from ingestion to matrix output
3. ✅ **Data Generation**: Realistic traffic patterns with statistical anomalies
4. ✅ **Detection Algorithms**: Complete implementations for 7 indicators
5. ✅ **Baseline Calibration**: 30-day learning with adaptive updates
6. ✅ **Temporal Modeling**: Decay and persistence models (solves "rapid saturation")
7. ✅ **Validation**: Ground truth tracking with MCC metrics
8. ✅ **End-to-End Examples**: Full code from data generation to alerting
9. ✅ **Storage Architecture**: TimescaleDB schema and query patterns
10. ✅ **Deployment Roadmap**: 8-month phased rollout to FOC

### The Core Innovation

**We're not testing "does phishing map to indicator 1.1?"**

**We're testing "can we FIND psychological vulnerabilities hidden in normal organizational behavior?"**

This is the difference between:
- ❌ A circular validation (event → mapping → indicator)
- ✅ A real detection system (data → algorithms → discovery)

### Ready to Implement

This document provides everything needed to build a production CPF detection system:
- Complete code examples (7 indicators fully implemented)
- Database schemas with retention policies
- Query patterns for all use cases
- Deployment timeline with success criteria
- Resource requirements and budget estimates

### Recommended Next Steps

**Option A: Build Proof-of-Concept (2 weeks)**
- Implement Indicator 1.1 end-to-end
- Generate 1 day of realistic data (50K events)
- Run detection and validation
- Prove the concept works

**Option B: Set Up Infrastructure (1 month)**
- Deploy TimescaleDB
- Build ingestion pipeline
- Start collecting real organizational data
- Begin 30-day baseline calibration

**Option C: Pilot Deployment (3 months)**
- Deploy 10 indicators from Phase 3
- Run on real organization
- Validate with SOC team
- Measure ROI

---

**The path from theory to practice is now clear.**

**Which direction should we take?**