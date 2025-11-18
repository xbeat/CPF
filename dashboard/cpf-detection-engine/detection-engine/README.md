# Detection Engine Core

Motore di rilevamento per i 100 indicatori CPF basato su algoritmi statistici.

## Panoramica

Il detection engine implementa algoritmi di machine learning e analisi statistica per **scoprire** vulnerabilità psicologiche nei dati organizzativi, senza etichette o mapping deterministico.

## Filosofia

```
Input: 50K eventi non etichettati
  ↓
Algorithm: μ, σ, Bayesian, pattern detection
  ↓
Output: "Indicator 1.1 = 0.85 (3σ above baseline)"
  ↓
Validation: MCC, precision, recall vs ground truth
```

## Struttura

```
detection-engine/
├── README.md                # Questa guida
├── orchestrator.js          # Esegue tutti i 100 indicatori
├── indicators/              # Algoritmi specifici per indicatore
│   ├── indicator-1-1.js     # Unquestioning Compliance
│   ├── indicator-1-2.js     # (futuro)
│   └── ... (99 altri)
├── bayesian-network/        # Interdipendenze (futuro)
└── convergence/             # Perfect Storm detection (futuro)
```

## Orchestrator

**File**: `orchestrator.js` (pianificato)

Coordina l'esecuzione di tutti gli indicatori.

**Utilizzo:**
```javascript
const DetectionEngine = require('./orchestrator');

const engine = new DetectionEngine({
  configPath: './config/indicators-config.json',
  baselinePath: './baselines/org-001.json'
});

// Esegui detection per organizzazione
const results = await engine.runDetection('org-001', {
  date: '2025-11-18',
  indicators: 'all'  // o ['1.1', '1.3', '5.1']
});

// results = {
//   '1.1': { score: 0.85, confidence: 0.92, detected: true },
//   '1.3': { score: 0.45, confidence: 0.88, detected: false },
//   ...
// }
```

## Indicators

### Implementazione Standard

Ogni indicatore segue questo pattern:

```javascript
// indicators/indicator-X-Y.js
class IndicatorXY {
  constructor(config) {
    this.config = config;
    this.baseline = null;
  }

  async loadBaseline(orgId) {
    // Carica μ, σ da baseline calibrator
    this.baseline = await BaselineManager.load(orgId, 'X.Y');
  }

  async run(orgId, date) {
    // 1. Fetch raw data
    const data = await this.fetchData(orgId, date);

    // 2. Calculate metric
    const metric = this.calculateMetric(data);

    // 3. Detect anomaly
    const detected = this.detectAnomaly(metric, this.baseline);

    // 4. Calculate confidence
    const confidence = this.calculateConfidence(data);

    return {
      indicator: 'X.Y',
      score: this.normalizeScore(metric),
      confidence,
      detected,
      sigma_distance: this.sigmaDistance(metric, this.baseline),
      details: this.getDetails(data, metric)
    };
  }

  calculateMetric(data) {
    // Algoritmo specifico
    // Esempio per 1.1: compliance_rate = approved / total
  }

  detectAnomaly(metric, baseline) {
    const sigma = this.sigmaDistance(metric, baseline);
    return sigma > baseline.threshold;  // Default: 2.0
  }

  sigmaDistance(value, baseline) {
    return Math.abs(value - baseline.mean) / baseline.stddev;
  }

  normalizeScore(metric) {
    // Normalizza a [0, 1]
    return Math.min(1.0, Math.max(0.0, metric));
  }

  calculateConfidence(data) {
    // Confidence basata su sample size e data quality
    const sampleSize = data.length;
    const minSize = this.config.min_sample_size || 1000;

    return Math.min(1.0, sampleSize / minSize);
  }
}

module.exports = IndicatorXY;
```

### Indicator 1.1 - Unquestioning Compliance

**File**: `indicators/indicator-1-1.js`

**Status**: ✅ Implementato (POC)

**Algoritmo:**
```javascript
// 1. Fetch email approval events
const events = await db.query(`
  SELECT * FROM raw_email_events
  WHERE date = $1
  AND has_approval_request = true
`);

// 2. Calculate compliance rate
const approved = events.filter(e => e.clicked_approve).length;
const total = events.length;
const complianceRate = approved / total;

// 3. Detect anomaly
const baseline = { mean: 0.72, stddev: 0.08 };
const sigma = (complianceRate - baseline.mean) / baseline.stddev;

if (sigma > 2.0) {
  return {
    score: 0.85,
    detected: true,
    sigma_distance: sigma,
    message: `Compliance rate ${complianceRate.toFixed(2)} is ${sigma.toFixed(1)}σ above baseline`
  };
}
```

**Data sources:**
- `raw_email_events`

**Metrics:**
- Compliance rate (Cr = approved / total)
- Response time distribution
- Authority level correlation

### Altri 99 Indicatori

Vedi `/dashboard/cpf-detection-engine/CPF_PRACTICAL_IMPLEMENTATION_GUIDE.md` sezione 10.3 per algoritmi completi.

**Prossimi priorità:**
1. **1.3** - Authority Impersonation Response
2. **5.1** - Alert Fatigue Detection
3. **5.3** - Alert Desensitization
4. **7.1** - Acute Stress Detection
5. **7.2** - Decision Fatigue
6. **2.5** - Urgency Susceptibility
7. **3.2** - Peer Pressure Response
8. **4.1** - Fear Paralysis
9. **6.2** - Groupthink Indicators
10. **10.1** - Perfect Storm (Convergent)

## Bayesian Network

**Directory**: `bayesian-network/` (futuro)

Implementerà le dipendenze cross-categoria:

```javascript
// Esempio: Authority high → Social aumenta
const DEPENDENCIES = {
  '1': {  // Authority
    '3': 0.30,  // → Social +30%
    '5': 0.15,  // → Cognitive +15%
  },
  '7': {  // Stress
    '5': 0.25,  // → Cognitive +25%
    '4': 0.20,  // → Affective +20%
  }
};

// Adjust scores
for (const [source, targets] of Object.entries(DEPENDENCIES)) {
  if (results[source].score > 0.70) {  // High risk
    for (const [target, weight] of Object.entries(targets)) {
      results[target].score += weight * results[source].score;
    }
  }
}
```

## Convergence Detection

**Directory**: `convergence/` (futuro)

Rileva "Perfect Storm" (Indicator 10.1-10.10):

```javascript
// Rileva quando multiple vulnerabilità convergono
function detectPerfectStorm(results) {
  const highRisk = Object.values(results).filter(r => r.score > 0.70);

  if (highRisk.length >= 5) {  // 5+ categorie in rosso
    return {
      indicator: '10.1',
      score: 0.90,
      detected: true,
      converging_indicators: highRisk.map(r => r.indicator),
      message: 'Perfect Storm: Multiple vulnerabilities converging'
    };
  }
}
```

## Esecuzione

### Single Indicator

```bash
# Esegui indicator 1.1 per org-001
node detection-engine/indicators/indicator-1-1.js \
  --org org-001 \
  --date 2025-11-18 \
  --baseline ./baselines/org-001_1.1.json
```

### All Indicators (Orchestrator)

```bash
# Esegui tutti gli indicatori
node detection-engine/orchestrator.js \
  --org org-001 \
  --date 2025-11-18
```

### Integration con Dashboard

```javascript
// In server.js o detection-api.js
app.post('/api/detection/run', async (req, res) => {
  const { orgId, date } = req.body;

  const engine = new DetectionEngine();
  const results = await engine.runDetection(orgId, { date });

  // Salva in database
  await saveDetectionResults(orgId, results);

  // Push to dashboard via WebSocket
  io.emit('detection_update', {
    orgId,
    results,
    timestamp: Date.now()
  });

  res.json({ success: true, results });
});
```

## Validation

Ogni indicatore deve essere validato con ground truth:

```javascript
const GroundTruth = require('../validation/ground-truth-manager');
const Indicator11 = require('./indicators/indicator-1-1');

// Run detection
const detector = new Indicator11();
const results = await detector.run('org-001', '2025-11-18');

// Validate
const gt = new GroundTruth('./ground_truth_1.1.json');
const validation = gt.validate(results.detected);

console.log(validation);
// {
//   MCC: 0.85,
//   precision: 0.918,
//   recall: 0.900,
//   f1_score: 0.909,
//   status: 'PASSED'
// }
```

## Performance

| Indicatore | Eventi | Tempo | Memoria |
|-----------|--------|-------|---------|
| 1.1 (Email) | 50K | 2.5 sec | 120 MB |
| 5.1 (Alerts) | 1K | 0.3 sec | 30 MB |
| 7.1 (Auth) | 120K | 5.0 sec | 200 MB |

**Total** (100 indicatori): ~8-12 minuti/organizzazione/giorno

**Optimization:**
- Parallel execution
- Batch processing
- Caching baseline
- Indexed queries

## Riferimenti

- **Detection Engine**: `/dashboard/cpf-detection-engine/README.md`
- **Implementation Guide**: `/dashboard/cpf-detection-engine/CPF_PRACTICAL_IMPLEMENTATION_GUIDE.md`
- **Data Generator**: `/dashboard/cpf-detection-engine/data-generator/README.md`
- **Validation**: `/dashboard/cpf-detection-engine/validation/README.md`
