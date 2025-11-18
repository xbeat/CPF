# Validation Framework

Framework per la validazione degli algoritmi di detection.

## Contenuto

### `validator.js`

Modulo di validazione che confronta detection results con ground truth.

**Funzionalità:**
- Carica ground truth
- Confronta detection results
- Calcola metriche (MCC, precision, recall, F1)
- Genera report di validazione

## Metriche Implementate

### Confusion Matrix

```
                 Predicted
                 Pos    Neg
Actual  Pos      TP     FN
        Neg      FP     TN

TP = True Positives (segnali trovati correttamente)
FP = False Positives (falsi allarmi)
FN = False Negatives (segnali mancati)
TN = True Negatives (normali identificati correttamente)
```

### Matthews Correlation Coefficient (MCC)

```javascript
MCC = (TP × TN - FP × FN) / sqrt((TP+FP)(TP+FN)(TN+FP)(TN+FN))
```

**Interpretazione:**
- `+1.0` = Perfect prediction
- `0.0` = Random prediction
- `-1.0` = Total disagreement

**Vantaggi MCC:**
- Bilanciato (non ingannato da classi sbilanciate)
- Metrica singola per qualità complessiva
- Standard per machine learning

### Precision (Positive Predictive Value)

```javascript
Precision = TP / (TP + FP)
```

**Significato:** "Degli alert raised, quanti erano veri?"

**Importanza:** Alta precision = pochi falsi allarmi

### Recall (Sensitivity, True Positive Rate)

```javascript
Recall = TP / (TP + FN)
```

**Significato:** "Dei segnali reali, quanti abbiamo trovato?"

**Importanza:** Alto recall = pochi segnali mancati

### F1 Score

```javascript
F1 = 2 × (Precision × Recall) / (Precision + Recall)
```

**Significato:** Media armonica di precision e recall

**Uso:** Bilanciamento tra precision e recall

## Utilizzo

### Caricamento Ground Truth

```javascript
const Validator = require('./validation/validator');

// Carica da file
const validator = new Validator('./ground_truth_1.1.json');

// O passa direttamente
const groundTruth = [
  { timestamp: '2025-11-18T10:30:00Z', expected: true },
  { timestamp: '2025-11-18T11:45:00Z', expected: true },
  // ...
];
const validator = new Validator(groundTruth);
```

### Validazione Detection Results

```javascript
// Detection results
const detections = [
  { timestamp: '2025-11-18T10:30:00Z', detected: true },
  { timestamp: '2025-11-18T11:45:00Z', detected: false },
  // ... 50K eventi totali
];

// Validate
const metrics = validator.validate(detections);

console.log(metrics);
// {
//   true_positives: 45,
//   false_positives: 4,
//   false_negatives: 5,
//   true_negatives: 49946,
//   MCC: 0.8523,
//   precision: 0.9184,
//   recall: 0.9000,
//   f1_score: 0.9091,
//   status: 'PASSED'
// }
```

### Report Generation

```javascript
// Genera report dettagliato
const report = validator.generateReport(detections);

console.log(report.summary);
// Performance Summary:
//   Total Events:    50,000
//   Signals:         50
//   Detected:        45 (90.0%)
//   Missed:          5 (10.0%)
//   False Alarms:    4
//
//   MCC:             0.85 (Excellent)
//   Precision:       91.8%
//   Recall:          90.0%
//   F1 Score:        0.909
//
//   Status: ✓ PASSED

// Salva report
fs.writeFileSync('validation-report.json', JSON.stringify(report, null, 2));
```

## Ground Truth Format

### File Format

```json
{
  "metadata": {
    "indicator": "1.1",
    "generated_at": "2025-11-18T00:00:00Z",
    "total_events": 50000,
    "injected_signals": 50,
    "injection_rate": 0.001
  },
  "signals": [
    {
      "timestamp": "2025-11-18T10:30:45.123Z",
      "event_id": "email_1234567890",
      "indicator": "1.1",
      "expected_detection": true,
      "signal_type": "fast_compliance",
      "metadata": {
        "compliance_rate": 0.95,
        "baseline_mean": 0.72,
        "sigma_distance": 2.88
      }
    },
    // ... altri 49 segnali
  ]
}
```

### Signal Types

#### Indicator 1.1 (Compliance)
- `fast_compliance` - Approvazione troppo rapida
- `high_compliance_rate` - Tasso approval > baseline
- `authority_bias` - Bias verso autorità

#### Indicator 5.1 (Alert Fatigue)
- `low_investigation_rate` - Pochi alert investigati
- `high_ignore_rate` - Molti alert ignorati
- `deteriorating_attention` - Attenzione in calo

## Thresholds di Successo

### Target Metrics

```javascript
const THRESHOLDS = {
  MCC: {
    excellent: 0.80,
    good: 0.60,
    fair: 0.40,
    poor: 0.00
  },
  precision: {
    excellent: 0.95,
    good: 0.90,
    acceptable: 0.85
  },
  recall: {
    excellent: 0.95,
    good: 0.85,
    acceptable: 0.75
  },
  f1_score: {
    excellent: 0.90,
    good: 0.80,
    acceptable: 0.70
  }
};
```

### Status Determination

```javascript
function determineStatus(metrics) {
  if (metrics.MCC >= THRESHOLDS.MCC.excellent &&
      metrics.precision >= THRESHOLDS.precision.good &&
      metrics.recall >= THRESHOLDS.recall.good) {
    return 'PASSED';
  }

  if (metrics.MCC >= THRESHOLDS.MCC.fair) {
    return 'NEEDS_IMPROVEMENT';
  }

  return 'FAILED';
}
```

## Advanced Validation

### Time-Series Validation

```javascript
// Valida performance nel tempo
const timeSeriesValidator = new TimeSeriesValidator();

const dailyMetrics = [];
for (const day of days) {
  const results = await detector.run(org, day);
  const metrics = validator.validate(results);
  dailyMetrics.push({ day, ...metrics });
}

// Analizza trend
const trend = timeSeriesValidator.analyzeTrend(dailyMetrics);
// {
//   mcc_trend: 'improving',
//   precision_stability: 'stable',
//   recall_trend: 'deteriorating'
// }
```

### Cross-Validation

```javascript
// K-fold cross-validation
const kFold = new KFoldValidator(k = 5);

const folds = kFold.split(data);
const cvMetrics = [];

for (const fold of folds) {
  const { train, test } = fold;

  // Calibra su train
  await calibrator.calibrate(train);

  // Testa su test
  const results = await detector.run(test);
  const metrics = validator.validate(results);

  cvMetrics.push(metrics);
}

// Media cross-validation
const avgMCC = cvMetrics.reduce((sum, m) => sum + m.MCC, 0) / k;
console.log(`Average MCC: ${avgMCC}`);
```

### Sensitivity Analysis

```javascript
// Test sensitivity a threshold
const thresholds = [1.5, 2.0, 2.5, 3.0];
const sensitivityResults = [];

for (const threshold of thresholds) {
  detector.config.sigma_threshold = threshold;
  const results = await detector.run(org, date);
  const metrics = validator.validate(results);

  sensitivityResults.push({
    threshold,
    mcc: metrics.MCC,
    precision: metrics.precision,
    recall: metrics.recall
  });
}

// Trova threshold ottimale
const optimal = sensitivityResults.reduce((best, curr) =>
  curr.mcc > best.mcc ? curr : best
);

console.log(`Optimal threshold: ${optimal.threshold} (MCC: ${optimal.mcc})`);
```

## Validation Report

### Report Completo

```json
{
  "metadata": {
    "indicator": "1.1",
    "org_id": "org-001",
    "date": "2025-11-18",
    "validated_at": "2025-11-18T23:59:59Z"
  },
  "confusion_matrix": {
    "true_positives": 45,
    "false_positives": 4,
    "false_negatives": 5,
    "true_negatives": 49946
  },
  "metrics": {
    "MCC": 0.8523,
    "precision": 0.9184,
    "recall": 0.9000,
    "f1_score": 0.9091,
    "specificity": 0.9999,
    "accuracy": 0.9998
  },
  "performance": {
    "status": "PASSED",
    "rating": "Excellent",
    "meets_thresholds": true
  },
  "details": {
    "total_events": 50000,
    "signals_injected": 50,
    "signals_detected": 45,
    "signals_missed": 5,
    "false_alarms": 4,
    "detection_rate": 0.90
  },
  "recommendations": [
    "Performance is excellent. Algorithm ready for production.",
    "Consider reducing threshold slightly to improve recall (90% → 95%)",
    "Monitor false positive rate in production"
  ]
}
```

## Testing Validator

```bash
# Test validator con dati mock
node validation/test-validator.js

# Output:
# ✓ Validator initialized
# ✓ Confusion matrix calculated correctly
# ✓ MCC: 0.85 ✓
# ✓ Precision: 91.8% ✓
# ✓ Recall: 90.0% ✓
# ✓ F1 Score: 0.909 ✓
# ✓ All tests passed
```

## Riferimenti

- **Detection Engine**: `/dashboard/cpf-detection-engine/README.md`
- **Tests**: `/dashboard/cpf-detection-engine/tests/README.md`
- **E2E Tests**: `/dashboard/cpf-detection-engine/tests/e2e/README.md`
- **Ground Truth**: `/dashboard/cpf-detection-engine/data-generator/ground-truth-manager.js`
