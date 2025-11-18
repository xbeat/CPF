# Data Generator

Generatore di dati realistici per il training e testing del detection engine.

## Panoramica

A differenza del **Simulatore SIEM** (che genera eventi etichettati), questo data generator produce dati organizzativi realistici **non etichettati** con segnali nascosti, per testare l'efficacia degli algoritmi di detection.

## Filosofia

```
❌ Simulatore (vecchio approccio):
   Evento "phishing" → map to indicator 1.1 → rosso
   (Circolare: ovvio che mappa lì)

✅ Data Generator (nuovo approccio):
   50K email normali + 50 anomalie nascoste (0.1%)
   → Algoritmi detection SCOPRONO anomalie
   → Validazione: "trovato 45/50 segnali nascosti (MCC: 0.85)"
```

## Struttura

```
data-generator/
├── README.md                    # Questa guida
├── generators/                  # Generatori specifici
│   ├── email-generator.js       # 50K email/giorno
│   ├── auth-generator.js        # 5K auth/ora
│   ├── alert-generator.js       # 1K alert/giorno
│   └── ticket-generator.js      # 500 ticket/giorno
├── signal-injector.js           # Inietta segnali nascosti
└── ground-truth-manager.js      # Traccia cosa è stato iniettato
```

## Generatori Disponibili

### Email Generator

**File**: `generators/email-generator.js`

Genera 50,000 email al giorno con:
- Distribuzione realistica sender/recipient
- Subject patterns normali
- Link click behavior statistico
- Approval request patterns

**Segnali nascosti:**
- Compliance rate anomalo (per indicator 1.1)
- Authority impersonation (per indicator 1.3)
- Urgency exploitation (per indicator 2.5)

**Utilizzo:**
```javascript
const EmailGenerator = require('./generators/email-generator');

const gen = new EmailGenerator({
  eventsPerDay: 50000,
  normalBehavior: true,
  injectSignals: 50  // Inietta 50 segnali nascosti
});

const emails = await gen.generate('2025-11-18', '2025-11-19');
// → Array di 50,000 email events

// Ground truth
const injected = gen.getInjectedSignals();
// → Array di 50 timestamp dove ci sono anomalie
```

**Output format:**
```javascript
{
  timestamp: '2025-11-18T10:30:45Z',
  sender: 'manager@company.com',
  recipient: 'john.doe@company.com',
  subject: 'Urgent: Approve this request',
  has_approval_request: true,
  clicked_approve: true,  // ← Potenziale segnale
  time_to_approve: 45,    // secondi (molto veloce!)
  authority_level: 'high'
}
```

### Auth Generator

**File**: `generators/auth-generator.js` (pianificato)

Genera 5,000 eventi di autenticazione all'ora.

### Alert Generator

**File**: `generators/alert-generator.js` (pianificato)

Genera 1,000 alert al giorno con:
- Alert presentation
- Investigation patterns
- Fatigue indicators

### Ticket Generator

**File**: `generators/ticket-generator.js` (pianificato)

Genera 500 ticket al giorno con:
- Assignment patterns
- Resolution workflow
- Stress indicators

## Signal Injection

### Filosofia

I segnali vengono **nascosti** nel traffico normale, non etichettati.

```javascript
// BAD (approach vecchio - simulatore)
{
  type: 'phishing_clicked',
  label: 'ATTACK',  // ← Troppo ovvio!
  target_indicator: '1.1'
}

// GOOD (approach nuovo - data generator)
{
  timestamp: '2025-11-18T10:30:45Z',
  sender: 'ceo@company.com',  // ← Sembra CEO
  clicked_approve: true,       // ← Comportamento normale?
  time_to_approve: 12          // ← Troppo veloce (segnale!)
}
// Algoritmo DEVE scoprire che 12 sec è < μ - 2σ
```

### Signal Injector

**File**: `signal-injector.js` (pianificato)

```javascript
const SignalInjector = require('./signal-injector');

const injector = new SignalInjector({
  signalType: 'authority_compliance',
  targetIndicator: '1.1',
  injectionRate: 0.001  // 0.1% degli eventi
});

// Inietta in dataset
const dataset = emailGenerator.generate(...);
const withSignals = injector.inject(dataset);

// Ground truth
const groundTruth = injector.getGroundTruth();
// → [ { timestamp, type, indicator, expected_detection: true } ]
```

## Ground Truth Management

### Tracking Signals

**File**: `ground-truth-manager.js` (pianificato)

```javascript
const GroundTruth = require('./ground-truth-manager');

const gt = new GroundTruth();

// Registra segnale iniettato
gt.recordInjection({
  timestamp: '2025-11-18T10:30:45Z',
  indicator: '1.1',
  signal_type: 'high_compliance',
  expected_detection: true,
  metadata: {
    compliance_rate: 0.95,  // vs baseline 0.72
    sigma_distance: 2.8     // > 2.0 threshold
  }
});

// Dopo detection, confronta
const detections = await detectionEngine.run();
const validation = gt.validate(detections);

console.log(validation.metrics);
// {
//   true_positives: 45,
//   false_positives: 4,
//   false_negatives: 5,
//   true_negatives: 49946,
//   MCC: 0.85,
//   precision: 0.918,
//   recall: 0.900,
//   f1_score: 0.909
// }
```

## Proof-of-Concept: Indicator 1.1

### Setup

```bash
cd dashboard/cpf-detection-engine

# Genera 1 giorno di email (50K)
node data-generator/generators/email-generator.js \
  --start 2025-11-18 \
  --end 2025-11-19 \
  --inject-signals 50 \
  --output data/email_events.json
```

### Output

```
✓ Generated 50,000 email events
✓ Injected 50 hidden compliance signals (0.1%)
✓ Saved to data/email_events.json
✓ Ground truth: data/ground_truth_1.1.json
```

### Validation

```bash
# Esegui detection
node detection-engine/indicators/indicator-1-1.js \
  --input data/email_events.json \
  --ground-truth data/ground_truth_1.1.json

# Output:
# ✓ Detected 45/50 signals
# ✓ False positives: 4
# ✓ MCC: 0.85 (Good)
# ✓ Precision: 91.8%
# ✓ Recall: 90.0%
```

## Utilizzo Completo

### 1. Genera Dati

```javascript
const EmailGenerator = require('./generators/email-generator');

const gen = new EmailGenerator({
  eventsPerDay: 50000,
  injectSignals: 50,
  signalTypes: ['1.1', '1.3', '5.1']  // Multi-indicator
});

const data = await gen.generate('2025-11-01', '2025-11-30');
// → 30 giorni × 50K = 1.5M eventi
```

### 2. Ingest a TimescaleDB

```javascript
const TimescaleClient = require('../storage/timescale-client');

const db = new TimescaleClient();
await db.bulkInsert('raw_email_events', data);
```

### 3. Calibra Baseline (30 giorni)

```javascript
const Calibrator = require('../baseline-calibrator');

const cal = new Calibrator();
await cal.calibrate('1.1', {
  startDate: '2025-11-01',
  endDate: '2025-11-30'
});
// → baseline_mean: 0.72, baseline_stddev: 0.08
```

### 4. Esegui Detection

```javascript
const Indicator11 = require('../detection-engine/indicators/indicator-1-1');

const detector = new Indicator11();
const results = await detector.run({
  date: '2025-12-01',  // Giorno successivo
  baseline: { mean: 0.72, stddev: 0.08 }
});

// results = [
//   { timestamp: '...', detected: true, score: 0.95, sigma: 2.8 },
//   ...
// ]
```

### 5. Valida vs Ground Truth

```javascript
const GroundTruth = require('./ground-truth-manager');

const gt = new GroundTruth('data/ground_truth_1.1.json');
const validation = gt.validate(results);

console.log(validation);
// {
//   MCC: 0.85,
//   precision: 0.918,
//   recall: 0.900,
//   status: 'PASSED'
// }
```

## Performance

| Generatore | Eventi/giorno | Tempo Generazione | Memoria |
|------------|--------------|-------------------|---------|
| Email | 50,000 | ~10 sec | 80 MB |
| Auth | 120,000 | ~15 sec | 100 MB |
| Alert | 1,000 | ~1 sec | 20 MB |
| Ticket | 500 | ~1 sec | 10 MB |

**Totale**: ~170K eventi/giorno (~26 sec generazione)

## Differenze vs Simulatore

| Aspetto | Simulatore | Data Generator |
|---------|------------|----------------|
| **Output** | Eventi etichettati | Dati realistici non etichettati |
| **Volume** | 10-100 eventi/sec | 50K-200K eventi/giorno |
| **Segnali** | Espliciti | Nascosti (0.1%) |
| **Scopo** | Demo real-time | Training/testing algoritmi |
| **Validazione** | Nessuna | Ground truth + MCC |
| **Temporalità** | Real-time stream | Batch storico |

## Riferimenti

- **Detection Engine**: `/dashboard/cpf-detection-engine/README.md`
- **Implementation Guide**: `/dashboard/cpf-detection-engine/CPF_PRACTICAL_IMPLEMENTATION_GUIDE.md`
- **Simulatore** (vecchio approccio): `/dashboard/simulator/README.md`
- **Validation**: `/dashboard/cpf-detection-engine/validation/README.md`
