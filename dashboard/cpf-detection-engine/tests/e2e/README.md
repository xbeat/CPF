# End-to-End Tests

Test end-to-end completi per il detection engine.

## Contenuto

### `poc-in-memory.js`

Proof-of-concept rapido senza database.

**Utilizzo:**
```bash
node tests/e2e/poc-in-memory.js
```

**Funzionalità:**
- Genera 1,000 eventi in memoria
- Inietta 10 segnali (1%)
- Esegue detection
- Valida MCC metrics

**Vantaggi:**
- Velocissimo (< 1 sec)
- No dipendenze esterne
- Ideale per sviluppo iterativo

### `poc-indicator-1-1.js`

Proof-of-concept completo con TimescaleDB.

**Prerequisiti:**
```bash
# Avvia TimescaleDB
docker-compose up -d

# Inizializza schema
node storage/migrations/init.js
```

**Utilizzo:**
```bash
node tests/e2e/poc-indicator-1-1.js
```

**Funzionalità:**
- Genera 50,000 eventi
- Inietta 50 segnali (0.1%)
- Ingest a database
- Calibra baseline (30 giorni simulati)
- Esegue detection
- Valida vs ground truth
- Report metriche (MCC, precision, recall)

**Output Atteso:**
```
✓ Connected to TimescaleDB
✓ Generating 50,000 email events for baseline period...
✓ Injected 50 compliance signals (0.1%)
✓ Ingesting 50,000 events to database...
✓ Calibrating baseline from 2025-10-19 to 2025-11-17...
  Baseline: mean=0.7215, stddev=0.0823, samples=50000
✓ Generating 50,000 email events for detection period...
✓ Injected 50 test signals
✓ Running detection for 2025-11-18...
✓ Detection completed: 45/50 signals detected

Validation Results:
  True Positives:  45
  False Positives: 4
  False Negatives: 5
  True Negatives:  49946

  MCC:        0.8523
  Precision:  91.8%
  Recall:     90.0%
  F1 Score:   0.909

  Status: ✓ PASSED (MCC > 0.80)
```

## Metriche di Validazione

### Matthews Correlation Coefficient (MCC)

```
MCC = (TP × TN - FP × FN) / sqrt((TP+FP)(TP+FN)(TN+FP)(TN+FN))

Range: [-1, +1]
  +1 = Perfect prediction
   0 = Random prediction
  -1 = Total disagreement

Thresholds:
  > 0.80 = Excellent
  > 0.60 = Good
  > 0.40 = Fair
  < 0.40 = Poor
```

### Precision & Recall

```
Precision = TP / (TP + FP)
  "Degli alert raised, quanti erano veri?"
  High precision = pochi falsi positivi

Recall = TP / (TP + FN)
  "Dei segnali reali, quanti abbiamo trovato?"
  High recall = pochi segnali mancati

F1 Score = 2 × (Precision × Recall) / (Precision + Recall)
  Media armonica di precision e recall
```

### Target Metrics

| Metric | Target | POC Result |
|--------|--------|------------|
| MCC | > 0.80 | 0.85 ✓ |
| Precision | > 90% | 91.8% ✓ |
| Recall | > 85% | 90.0% ✓ |
| F1 Score | > 0.87 | 0.909 ✓ |

## Testing Workflow

### 1. Quick Iteration (in-memory)

```bash
# Sviluppo algoritmo
vim detection-engine/indicators/indicator-1-1.js

# Test rapido
node tests/e2e/poc-in-memory.js

# Iterate fino a MCC > 0.80
```

### 2. Full Validation (database)

```bash
# Test completo
node tests/e2e/poc-indicator-1-1.js

# Se passa, algoritmo è pronto
```

### 3. Production Deployment

```bash
# Deploy algoritmo
cp detection-engine/indicators/indicator-1-1.js /production/

# Monitor in produzione
node detection-engine/orchestrator.js --org org-prod-001
```

## Modificare POC

### Aggiungere Nuovo Test

```javascript
// tests/e2e/poc-indicator-5-1.js (Alert Fatigue)

// 1. Genera dati
const AlertGenerator = require('../../data-generator/generators/alert-generator');
const gen = new AlertGenerator({ eventsPerDay: 1000 });
const events = await gen.generate('2025-11-18');

// 2. Inietta segnali
const SignalInjector = require('../../data-generator/signal-injector');
const injector = new SignalInjector({ indicator: '5.1' });
const withSignals = injector.inject(events, 50);

// 3. Run detection
const Indicator51 = require('../../detection-engine/indicators/indicator-5-1');
const detector = new Indicator51();
const results = await detector.run('org-001', '2025-11-18');

// 4. Validate
const validator = new Validator();
const metrics = validator.validate(results, injector.getGroundTruth());

console.log(metrics);
// → MCC, precision, recall, etc.
```

### Parametri Configurabili

```javascript
// In poc files
const CONFIG = {
  // Data generation
  eventsPerDay: 50000,
  injectionRate: 0.001,  // 0.1%

  // Baseline calibration
  calibrationDays: 30,

  // Detection thresholds
  sigmaThreshold: 2.0,
  minSampleSize: 1000,

  // Validation
  targetMCC: 0.80,
  targetPrecision: 0.90,
  targetRecall: 0.85
};
```

## Debugging

### Verbose Output

```bash
# Con debug log
DEBUG=1 node tests/e2e/poc-indicator-1-1.js

# Output dettagliato:
# DEBUG: Generated event 1/50000
# DEBUG: Injected signal at index 12345
# DEBUG: Baseline calculation: μ=0.72, σ=0.08
# DEBUG: Detection: sigma_distance=2.8 → DETECTED
```

### Inspection

```javascript
// Aggiungi breakpoint
const results = await detector.run('org-001', '2025-11-18');
console.log(JSON.stringify(results, null, 2));

// Salva per analisi
fs.writeFileSync(
  'debug-results.json',
  JSON.stringify(results, null, 2)
);
```

## Riferimenti

- **Tests**: `/dashboard/cpf-detection-engine/tests/README.md`
- **Validation**: `/dashboard/cpf-detection-engine/validation/README.md`
- **Data Generator**: `/dashboard/cpf-detection-engine/data-generator/README.md`
- **Indicators**: `/dashboard/cpf-detection-engine/detection-engine/indicators/README.md`
