# Simulator Configuration

File di configurazione per il simulatore SIEM CPF.

## Contenuto

### `sources.json`

Configurazione di tutte le sorgenti SIEM/EDR/XDR supportate.

**Struttura:**
```json
{
  "splunk": {
    "name": "Splunk Enterprise",
    "type": "siem",
    "vendor": "Splunk Inc.",
    "endpoint": "https://{host}:8088/services/collector",
    "auth_type": "token",
    "api_version": "v1",
    "capabilities": [
      "real-time",
      "historical",
      "correlation",
      "alert_management"
    ],
    "event_format": "json",
    "rate_limit": 10000,
    "supported_event_types": "all"
  }
}
```

**Campi:**
- `name` - Nome piattaforma
- `type` - Tipo (siem, edr, xdr, soar)
- `vendor` - Produttore
- `endpoint` - URL template API
- `auth_type` - Metodo autenticazione (token, api_key, oauth)
- `api_version` - Versione API supportata
- `capabilities` - Feature supportate
- `event_format` - Formato eventi (json, cef, leef)
- `rate_limit` - Eventi/secondo massimi
- `supported_event_types` - Eventi supportati (all o lista)

**Piattaforme configurate (12+):**
- Splunk Enterprise
- IBM QRadar
- Microsoft Sentinel
- Elastic Security
- CrowdStrike Falcon
- Palo Alto Cortex XDR
- VMware Carbon Black
- Micro Focus ArcSight
- LogRhythm
- FortiSIEM
- Rapid7 InsightIDR
- Cortex XSOAR

### `scenarios.json`

Configurazione degli scenari di simulazione.

**Struttura:**
```json
{
  "normal": {
    "name": "Normal Operations",
    "description": "Operazioni quotidiane standard",
    "event_rate": 10,
    "duration": "continuous",
    "severity_distribution": {
      "low": 0.60,
      "medium": 0.30,
      "high": 0.08,
      "critical": 0.02
    },
    "event_type_weights": {
      "authentication": 0.30,
      "policy_violation": 0.25,
      "user_behavior": 0.20,
      "phishing": 0.15,
      "malware": 0.05,
      "other": 0.05
    },
    "context_modifiers": {
      "after_hours_probability": 0.15,
      "weekend_probability": 0.10,
      "vpn_probability": 0.25
    }
  },

  "attack": {
    "name": "Attack Scenario",
    "description": "Simulazione attacco in corso",
    "event_rate": 25,
    "duration": 3600,
    "severity_distribution": {
      "low": 0.20,
      "medium": 0.40,
      "high": 0.30,
      "critical": 0.10
    },
    "event_type_weights": {
      "phishing": 0.30,
      "malware": 0.25,
      "privilege_escalation": 0.20,
      "data_exfiltration": 0.15,
      "other": 0.10
    },
    "attack_patterns": [
      "credential_stuffing",
      "lateral_movement",
      "data_staging"
    ],
    "inject_events": [
      {
        "type": "ransomware_activity",
        "timing": "peak",
        "probability": 0.20
      }
    ]
  },

  "crisis": {
    "name": "Crisis Event",
    "description": "Evento critico sistemico",
    "event_rate": 50,
    "duration": 7200,
    "severity_distribution": {
      "low": 0.10,
      "medium": 0.20,
      "high": 0.40,
      "critical": 0.30
    },
    "convergent_indicators": true,
    "media_pressure": true,
    "executive_involvement": true,
    "inject_events": [
      {
        "type": "data_breach",
        "timing": "start",
        "probability": 1.0
      },
      {
        "type": "regulatory_investigation",
        "timing": "mid",
        "probability": 0.70
      }
    ]
  },

  "custom": {
    "name": "Custom Scenario",
    "description": "Scenario personalizzabile",
    "event_rate": 15,
    "allow_override": true,
    "custom_weights": {}
  }
}
```

**Campi Scenario:**
- `name` - Nome scenario
- `description` - Descrizione scenario
- `event_rate` - Eventi/secondo
- `duration` - Durata (secondi o "continuous")
- `severity_distribution` - Distribuzione severity
- `event_type_weights` - Pesi tipi evento
- `context_modifiers` - Modificatori contesto
- `attack_patterns` - Pattern attacco (opzionale)
- `inject_events` - Eventi da iniettare (opzionale)
- `convergent_indicators` - Attiva indicatori convergenti (opzionale)

## Utilizzo

### Caricare Configurazione

```javascript
const fs = require('fs');

// Carica sources
const sources = JSON.parse(
  fs.readFileSync('./config/sources.json', 'utf8')
);

// Carica scenarios
const scenarios = JSON.parse(
  fs.readFileSync('./config/scenarios.json', 'utf8')
);

// Accedi configurazione
const splunkConfig = sources.splunk;
const normalScenario = scenarios.normal;
```

### Nel Simulatore

```javascript
// Seleziona sorgente
const selectedSources = ['splunk', 'qradar', 'sentinel'];
const connectors = selectedSources.map(id => {
  const config = sources[id];
  const Connector = require(`./connectors/${id}-connector`);
  return new Connector(config);
});

// Carica scenario
const scenario = scenarios.attack;
generator.loadScenario(scenario);

// Avvia simulazione
startSimulation(connectors, scenario);
```

### Override Runtime

```javascript
// Modifica event rate runtime
scenario.event_rate = 20;

// Modifica severity distribution
scenario.severity_distribution.critical = 0.15;

// Aggiungi custom event type
scenario.event_type_weights.custom_event = 0.10;
```

## Personalizzazione

### Aggiungere Nuova Sorgente

```json
{
  "mynewsiem": {
    "name": "My New SIEM",
    "type": "siem",
    "vendor": "My Company",
    "endpoint": "https://api.mynewsiem.com/v1/events",
    "auth_type": "api_key",
    "api_version": "v1",
    "capabilities": ["real-time", "historical"],
    "event_format": "json",
    "rate_limit": 500,
    "supported_event_types": [
      "authentication",
      "phishing",
      "malware"
    ]
  }
}
```

Poi crea il connettore in `/connectors/mynewsiem-connector.js`.

### Aggiungere Nuovo Scenario

```json
{
  "phishing_campaign": {
    "name": "Phishing Campaign",
    "description": "Campagna phishing mirata",
    "event_rate": 20,
    "duration": 1800,
    "severity_distribution": {
      "low": 0.30,
      "medium": 0.50,
      "high": 0.15,
      "critical": 0.05
    },
    "event_type_weights": {
      "phishing_clicked": 0.40,
      "phishing_reported": 0.20,
      "social_engineering": 0.25,
      "authentication_failed": 0.15
    },
    "target_indicators": [
      "1.1",  // Unquestioning Compliance
      "1.3",  // Authority Impersonation
      "3.2"   // Peer Pressure
    ]
  }
}
```

### Scenario Template

```json
{
  "template_name": {
    "name": "Scenario Name",
    "description": "Brief description",
    "event_rate": 10-50,
    "duration": 3600,
    "severity_distribution": {
      "low": 0.0-1.0,
      "medium": 0.0-1.0,
      "high": 0.0-1.0,
      "critical": 0.0-1.0
    },
    "event_type_weights": {
      "event_type_1": 0.0-1.0,
      "event_type_2": 0.0-1.0
    }
  }
}
```

**Note:**
- Severity distribution deve sommare a 1.0
- Event type weights deve sommare a 1.0
- Event rate consigliato: 2-30 eventi/sec
- Duration in secondi (o "continuous")

## Validazione

### Schema Validation

```javascript
const Ajv = require('ajv');
const ajv = new Ajv();

// Schema per sources.json
const sourcesSchema = {
  type: 'object',
  patternProperties: {
    '.*': {
      type: 'object',
      required: ['name', 'type', 'endpoint'],
      properties: {
        name: { type: 'string' },
        type: { enum: ['siem', 'edr', 'xdr', 'soar'] },
        endpoint: { type: 'string', format: 'uri' },
        rate_limit: { type: 'number', minimum: 1 }
      }
    }
  }
};

// Valida
const validate = ajv.compile(sourcesSchema);
const valid = validate(sources);
if (!valid) {
  console.error(validate.errors);
}
```

### Script di Validazione

```bash
# Valida configurazione
node simulator/validate-config.js

# Output:
# ✓ sources.json is valid (12 sources)
# ✓ scenarios.json is valid (4 scenarios)
```

## Best Practices

### Event Rate
- **Normal**: 5-15 eventi/sec (realistico)
- **Attack**: 20-30 eventi/sec (moderato)
- **Crisis**: 40-60 eventi/sec (alto)
- **Max safe**: 100 eventi/sec

### Severity Distribution
- **Normal**: Low 60%, Medium 30%, High 8%, Critical 2%
- **Attack**: Low 20%, Medium 40%, High 30%, Critical 10%
- **Crisis**: Low 10%, Medium 20%, High 40%, Critical 30%

### Duration
- **Testing**: 60-300 secondi
- **Demo**: 600-1800 secondi
- **Continuous**: "continuous" (no stop)

## Riferimenti

- **Connectors**: `/dashboard/simulator/connectors/README.md`
- **Generators**: `/dashboard/simulator/generators/README.md`
- **Scenarios Engine**: `/dashboard/simulator/generators/scenario-engine.js`
- **Simulatore**: `/dashboard/simulator/README.md`
