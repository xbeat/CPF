# Detection Indicators

Algoritmi di rilevamento specifici per ciascuno dei 100 indicatori CPF.

## Contenuto

### `indicator-1-1.js`

Algoritmo per **Indicator 1.1**: Unquestioning Compliance with Apparent Authority

**Status**: ✅ Implementato (POC)

**Descrizione:**
Rileva compliance anormalmente alta con richieste che appaiono provenire da autorità, anche quando potrebbero essere inappropriate o sospette.

**Algoritmo:**
```
Cr = approval_requests_approved / total_approval_requests

if (Cr > μ + σ_threshold × σ):
  ALERT: "Abnormal compliance detected"
  score = normalize(Cr)
  confidence = min(1.0, sample_size / min_sample_size)
```

**Data Sources:**
- `raw_email_events` (has_approval_request = true)
- Campo: `clicked_approve`, `time_to_action`, `sender_authority_level`

**Thresholds:**
- σ_threshold: 2.0 (configurabile)
- min_sample_size: 1000 eventi
- Baseline: μ ≈ 0.72, σ ≈ 0.08 (calcolato durante calibration)

**Metriche:**
- Compliance rate (Cr)
- Time-to-approval distribution
- Correlation con authority level

**Output Example:**
```javascript
{
  indicator: '1.1',
  title: 'Unquestioning Compliance',
  score: 0.85,
  confidence: 0.92,
  detected: true,
  sigma_distance: 2.8,
  details: {
    compliance_rate: 0.95,
    baseline_mean: 0.72,
    baseline_stddev: 0.08,
    sample_size: 1247,
    fast_approvals: 87  // < 30 sec
  },
  timestamp: '2025-11-18T23:59:59Z'
}
```

## Indicatori Pianificati

### Authority-Based (Categoria 1)

#### `indicator-1-2.js` ⏳
**Bypass of Standard Verification**
- Algoritmo: Detection bypass procedures quando richiesto da autorità
- Data: email_events, auth_events
- Metric: verification_bypass_rate

#### `indicator-1-3.js` ⏳
**Authority Impersonation Response**
- Algoritmo: Risposta a tentativi di impersonificazione autorità
- Data: email_events (sender spoofing markers)
- Metric: impersonation_response_rate

#### `indicator-1-4.js` ⏳
**Chain of Command Override**
- Algoritmo: Override procedure gerarchiche
- Data: approval_events, escalation_events
- Metric: override_frequency

#### `indicator-1-5.js` ⏳
**Credential Sharing with Superiors**
- Algoritmo: Sharing credenziali con superiori
- Data: auth_events (shared sessions)
- Metric: credential_sharing_incidents

### Temporal-Based (Categoria 2)

#### `indicator-2-1.js` ⏳
**Deadline Pressure Response**
- Algoritmo: Comportamento sotto deadline
- Data: task_events, approval_events
- Metric: shortcuts_taken, errors_rate

#### `indicator-2-5.js` ⏳
**Urgency Susceptibility**
- Algoritmo: Risposta a marker di urgenza
- Data: email_events (urgency_markers)
- Metric: urgent_compliance_rate

### Cognitive-Based (Categoria 5)

#### `indicator-5-1.js` ⏳
**Alert Fatigue**
- Algoritmo: Deterioramento investigazione alert
```
Fa = 1 - (alerts_investigated / alerts_presented)
if (Fa > threshold):
  ALERT: "Alert fatigue detected"
```
- Data: alert_events
- Metric: investigation_rate, time_to_investigate

#### `indicator-5-3.js` ⏳
**Alert Desensitization**
- Algoritmo: Desensibilizzazione progressiva
- Data: alert_events (ignored_alerts over time)
- Metric: desensitization_trend

### Stress-Based (Categoria 7)

#### `indicator-7-1.js` ⏳
**Acute Stress Indicators**
- Algoritmo: Marcatori stress acuto
- Data: auth_events, task_events
- Metric: error_rate, retry_patterns

#### `indicator-7-2.js` ⏳
**Decision Fatigue**
- Algoritmo: Qualità decisioni diminuisce nel tempo
- Data: decision_events, approval_events
- Metric: decision_quality_trend

### Convergent (Categoria 10)

#### `indicator-10-1.js` ⏳
**Perfect Storm Detection**
- Algoritmo: Convergenza multiple vulnerabilità
```
high_risk = count(indicators where score > 0.70)
if (high_risk >= 5):
  ALERT: "Perfect Storm detected"
```
- Data: detection_results (altri indicatori)
- Metric: converging_indicators_count

## Template Implementazione

```javascript
// indicators/indicator-X-Y.js
const BaseIndicator = require('./base-indicator');

class IndicatorXY extends BaseIndicator {
  constructor(config) {
    super(config);
    this.id = 'X.Y';
    this.title = 'Indicator Title';
    this.category = 'X';
    this.dataSources = ['table_name'];
  }

  async fetchData(orgId, date) {
    const query = `
      SELECT * FROM ${this.dataSources[0]}
      WHERE org_id = $1
      AND date = $2
    `;
    return await this.db.query(query, [orgId, date]);
  }

  calculateMetric(data) {
    // Implementa logica specifica
    // Esempio: rate = positive / total
    const positive = data.filter(d => d.condition).length;
    const total = data.length;
    return positive / total;
  }

  detectAnomaly(metric, baseline) {
    const sigma = this.sigmaDistance(metric, baseline);
    return sigma > baseline.threshold;
  }

  getDetails(data, metric) {
    return {
      metric_value: metric,
      sample_size: data.length,
      // ... altri dettagli specifici
    };
  }
}

module.exports = IndicatorXY;
```

## Base Indicator

```javascript
// base-indicator.js (da creare)
class BaseIndicator {
  constructor(config) {
    this.config = config;
    this.baseline = null;
    this.db = null;  // TimescaleDB client
  }

  async loadBaseline(orgId) {
    const path = `./baselines/${orgId}_${this.id}.json`;
    this.baseline = JSON.parse(fs.readFileSync(path));
  }

  sigmaDistance(value, baseline) {
    return Math.abs(value - baseline.mean) / baseline.stddev;
  }

  normalizeScore(value) {
    return Math.min(1.0, Math.max(0.0, value));
  }

  calculateConfidence(sampleSize) {
    const minSize = this.config.min_sample_size || 1000;
    return Math.min(1.0, sampleSize / minSize);
  }

  async run(orgId, date) {
    await this.loadBaseline(orgId);
    const data = await this.fetchData(orgId, date);
    const metric = this.calculateMetric(data);
    const detected = this.detectAnomaly(metric, this.baseline);
    const confidence = this.calculateConfidence(data.length);

    return {
      indicator: this.id,
      title: this.title,
      score: this.normalizeScore(metric),
      confidence,
      detected,
      sigma_distance: this.sigmaDistance(metric, this.baseline),
      details: this.getDetails(data, metric),
      timestamp: new Date().toISOString()
    };
  }

  // Abstract methods (da override)
  async fetchData(orgId, date) {
    throw new Error('fetchData must be implemented');
  }

  calculateMetric(data) {
    throw new Error('calculateMetric must be implemented');
  }

  getDetails(data, metric) {
    return {};
  }
}

module.exports = BaseIndicator;
```

## Testing

### Unit Test

```javascript
// test/indicator-1-1.test.js
const Indicator11 = require('../indicators/indicator-1-1');

describe('Indicator 1.1', () => {
  it('should detect high compliance', async () => {
    const detector = new Indicator11();

    const mockData = [
      { clicked_approve: true },
      { clicked_approve: true },
      { clicked_approve: false },
    ];

    const metric = detector.calculateMetric(mockData);
    expect(metric).toBe(0.67);  // 2/3
  });

  it('should detect anomaly when > 2σ', () => {
    const detector = new Indicator11();
    const baseline = { mean: 0.72, stddev: 0.08, threshold: 2.0 };

    const detected = detector.detectAnomaly(0.95, baseline);
    expect(detected).toBe(true);  // 0.95 > 0.72 + 2*0.08
  });
});
```

### Integration Test

```bash
# Test con dati reali
node test/integration/test-indicator-1-1.js

# Output:
# ✓ Generated 1,000 test events
# ✓ Injected 10 anomalies
# ✓ Detected 9/10 (90% recall)
# ✓ False positives: 1 (92% precision)
# ✓ MCC: 0.87
```

## Roadmap Implementazione

### Fase 1 (Q1 2026) - 10 Indicatori Pilota
1. ✅ 1.1 - Unquestioning Compliance
2. ⏳ 1.3 - Authority Impersonation Response
3. ⏳ 5.1 - Alert Fatigue
4. ⏳ 5.3 - Alert Desensitization
5. ⏳ 7.1 - Acute Stress
6. ⏳ 7.2 - Decision Fatigue
7. ⏳ 2.5 - Urgency Susceptibility
8. ⏳ 3.2 - Peer Pressure Response
9. ⏳ 4.1 - Fear Paralysis
10. ⏳ 10.1 - Perfect Storm

### Fase 2 (Q2 2026) - 40 Indicatori
- Completare categorie 1, 5, 7
- Inizio categorie 2, 3, 4

### Fase 3 (Q3-Q4 2026) - 100 Indicatori Completi
- Tutte le categorie 1-9
- Categoria 10 (convergent) completa

## Riferimenti

- **Detection Engine**: `/dashboard/cpf-detection-engine/README.md`
- **Implementation Guide**: `/dashboard/cpf-detection-engine/CPF_PRACTICAL_IMPLEMENTATION_GUIDE.md` (sezione 10.3)
- **Config**: `/dashboard/cpf-detection-engine/config/indicators-config.json`
- **Validation**: `/dashboard/cpf-detection-engine/validation/README.md`
