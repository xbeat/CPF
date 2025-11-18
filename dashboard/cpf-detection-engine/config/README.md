# Detection Engine Configuration

Configurazioni per il sistema di rilevamento CPF.

## Contenuto

### `indicators-config.json`

Configurazione dei 100 indicatori CPF per il detection engine.

**Struttura:**
```json
{
  "indicators": {
    "1.1": {
      "id": "1.1",
      "title": "Unquestioning Compliance with Apparent Authority",
      "category": "1",
      "category_name": "Authority-Based Vulnerabilities",
      "detection_algorithm": "authority_compliance_detector",
      "thresholds": {
        "baseline_mean": null,
        "baseline_stddev": null,
        "sigma_threshold": 2.0,
        "min_sample_size": 1000
      },
      "data_sources": [
        "email_events",
        "authentication_events",
        "approval_events"
      ],
      "enabled": true,
      "priority": "high"
    }
  }
}
```

## Campi Configurazione

### Identificazione
- `id` - ID indicatore (1.1 - 10.10)
- `title` - Titolo descrittivo
- `category` - Numero categoria (1-10)
- `category_name` - Nome categoria

### Detection
- `detection_algorithm` - Nome algoritmo detection
- `thresholds` - Soglie rilevamento
  - `baseline_mean` - Media baseline (calcolata durante calibration)
  - `baseline_stddev` - Deviazione standard baseline
  - `sigma_threshold` - Numero di σ per anomalia (default: 2.0)
  - `min_sample_size` - Campioni minimi per baseline
- `data_sources` - Tabelle TimescaleDB utilizzate

### Gestione
- `enabled` - Indicatore attivo/disattivo
- `priority` - Priorità (high, medium, low)

## Utilizzo

### Caricamento Configurazione

```javascript
const fs = require('fs');

const config = JSON.parse(
  fs.readFileSync('./config/indicators-config.json', 'utf8')
);

// Accedi configurazione indicatore
const indicator11 = config.indicators['1.1'];
console.log(indicator11.detection_algorithm);
// → "authority_compliance_detector"
```

### Nel Detection Engine

```javascript
const DetectionEngine = require('./detection-engine/orchestrator');

const engine = new DetectionEngine({
  configPath: './config/indicators-config.json'
});

// Esegui detection per tutti gli indicatori abilitati
const results = await engine.runDetection(orgId);
```

### Personalizzazione Thresholds

```json
{
  "1.1": {
    "thresholds": {
      "sigma_threshold": 3.0,
      "min_sample_size": 2000
    }
  }
}
```

**Effetti:**
- `sigma_threshold: 3.0` - Rilevamento più conservativo (meno falsi positivi)
- `min_sample_size: 2000` - Richiede più dati per baseline affidabile

## Algoritmi Detection

Ogni indicatore ha un algoritmo specifico:

### Authority Compliance (1.1)
```javascript
// Rileva compliance anormalmente alta con richieste autoritarie
Cr = requests_approved / total_requests
if (Cr > μ + σ_threshold × σ) {
  alert("Anomalous compliance detected");
}
```

### Alert Fatigue (5.1)
```javascript
// Rileva deterioramento investigazione alert
Fa = 1 - (alerts_investigated / alerts_presented)
if (Fa > threshold) {
  alert("Alert fatigue detected");
}
```

### Altri 98 Indicatori
Vedi `/dashboard/cpf-detection-engine/CPF_PRACTICAL_IMPLEMENTATION_GUIDE.md` sezione 10.3.

## Data Sources

### Email Events
Tabella: `raw_email_events`
- Approval requests
- Authority indicators
- Urgency markers
- Social pressure cues

### Authentication Events
Tabella: `raw_auth_events`
- Login attempts
- MFA challenges
- Password resets
- Access patterns

### Alert Events
Tabella: `raw_alert_events`
- Alert presentations
- Investigation status
- Resolution time
- Ignored alerts

### Ticket Events
Tabella: `raw_ticket_events`
- Incident tickets
- Assignment patterns
- Resolution workflow

## Baseline Calibration

Le soglie baseline vengono calcolate durante il learning period (30 giorni):

```javascript
const Calibrator = require('./baseline-calibrator');

const calibrator = new Calibrator(config);

// Calibra tutti gli indicatori
await calibrator.calibrateAll({
  startDate: '2025-01-01',
  endDate: '2025-01-30',
  updateConfig: true  // Aggiorna indicators-config.json
});

// Config ora contiene:
// {
//   "1.1": {
//     "thresholds": {
//       "baseline_mean": 0.72,
//       "baseline_stddev": 0.08,
//       ...
//     }
//   }
// }
```

## Enabling/Disabling Indicators

```javascript
// Disabilita indicatore per testing
config.indicators['9.6'].enabled = false;

// Disabilita tutta una categoria
for (let i = 1; i <= 10; i++) {
  const id = `6.${i}`;
  if (config.indicators[id]) {
    config.indicators[id].enabled = false;
  }
}

// Salva modifiche
fs.writeFileSync(
  './config/indicators-config.json',
  JSON.stringify(config, null, 2)
);
```

## Priority Levels

- **high** - Esegui ad ogni cycle, alert immediato
- **medium** - Esegui ogni 5 min, alert batched
- **low** - Esegui ogni ora, report giornaliero

## Riferimenti

- **Detection Engine**: `/dashboard/cpf-detection-engine/README.md`
- **Implementation Guide**: `/dashboard/cpf-detection-engine/CPF_PRACTICAL_IMPLEMENTATION_GUIDE.md`
- **Indicators**: `/dashboard/cpf-detection-engine/detection-engine/indicators/`
- **Calibrator**: `/dashboard/cpf-detection-engine/baseline-calibrator/`
