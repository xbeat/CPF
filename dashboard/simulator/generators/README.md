# SIEM Event Generators

Generatori di eventi SIEM realistici per il simulatore CPF.

## Contenuto

### `siem-data-generator.js`

Generatore principale di eventi di sicurezza per simulare traffico SIEM realistico.

**Funzionalità:**
- Generazione 40+ tipi di eventi
- Distribuzione ponderata per frequenza
- Context enrichment (time, user, geo)
- Severity assignment
- Source attribution (Splunk, QRadar, etc.)

### `scenario-engine.js`

Motore per la generazione di scenari predefiniti (normal, attack, crisis).

**Funzionalità:**
- Scenario presets
- Event rate modulation
- Severity distribution adjustment
- Attack pattern simulation
- Crisis event injection

### `dense-loader.js`

Generatore ad alta densità per testing di carico e stress test.

**Funzionalità:**
- High-volume event generation (1000+ eventi/sec)
- Batch processing
- Memory-efficient streaming
- Performance monitoring

### `index.js`

Entry point e orchestrator per tutti i generatori.

## SIEM Data Generator

### Event Types (40+)

#### Authentication Events
```javascript
{
  type: 'authentication_failed',
  user: 'john.doe@company.com',
  source_ip: '192.168.1.100',
  attempts: 3,
  reason: 'invalid_password',
  timestamp: '2025-11-18T10:30:45Z'
}
```

**Variants:**
- `authentication_failed`
- `authentication_successful`
- `mfa_challenge`
- `password_reset_requested`

#### Phishing Events
```javascript
{
  type: 'phishing_clicked',
  user: 'jane.smith@company.com',
  email_subject: 'Urgent: Verify Your Account',
  link_clicked: true,
  reported: false,
  severity: 'medium'
}
```

**Variants:**
- `phishing_clicked`
- `phishing_reported`
- `phishing_email_delivered`
- `social_engineering_attempt`

#### Malware Events
```javascript
{
  type: 'malware_detected',
  host: 'WKS-001',
  malware_type: 'trojan',
  action_taken: 'quarantined',
  file_hash: 'a3f5b12...',
  severity: 'high'
}
```

**Variants:**
- `malware_detected`
- `malware_quarantined`
- `ransomware_activity`
- `suspicious_file_execution`

#### Policy & Compliance
```javascript
{
  type: 'policy_violation',
  user: 'admin@company.com',
  policy: 'data_classification',
  action: 'unauthorized_file_share',
  severity: 'medium'
}
```

**Variants:**
- `policy_violation`
- `compliance_violation`
- `unauthorized_access`
- `data_exfiltration_attempt`

#### User Behavior
```javascript
{
  type: 'after_hours_access',
  user: 'john.doe@company.com',
  time: '02:30 AM',
  resource: 'financial_database',
  location: 'Remote VPN',
  severity: 'medium'
}
```

**Variants:**
- `after_hours_access`
- `privilege_escalation`
- `multitasking_detected`
- `information_overload`
- `alert_fatigue`

#### AI & Automation
```javascript
{
  type: 'ai_recommendation_followed',
  user: 'operator@company.com',
  ai_system: 'security_copilot',
  recommendation: 'block_ip',
  confidence: 0.85,
  followed: true
}
```

**Variants:**
- `ai_recommendation_followed`
- `ai_recommendation_ignored`
- `automation_failure`
- `ml_model_drift`

#### Crisis Events
```javascript
{
  type: 'crisis_event',
  category: 'data_breach',
  impact: 'critical',
  affected_users: 5000,
  media_attention: true,
  severity: 'critical'
}
```

**Variants:**
- `crisis_event`
- `major_incident`
- `regulatory_investigation`

### Event Distribution

Il generatore produce eventi con questa distribuzione:

```javascript
const EVENT_DISTRIBUTION = {
  // 50% - Eventi comuni (low severity)
  common: [
    'authentication_failed',
    'policy_violation',
    'information_overload',
    'multitasking_detected',
    // ...
  ],

  // 30% - Eventi medi (medium severity)
  medium: [
    'phishing_clicked',
    'unauthorized_access',
    'after_hours_access',
    'ai_recommendation_followed',
    // ...
  ],

  // 15% - Eventi non comuni (medium-high severity)
  uncommon: [
    'privilege_escalation',
    'social_engineering',
    'malware_detected',
    // ...
  ],

  // 5% - Eventi rari (high-critical severity)
  rare: [
    'ransomware_activity',
    'crisis_event',
    'data_breach',
    // ...
  ]
};
```

### Context Enrichment

Ogni evento viene arricchito con:

```javascript
{
  // Event base
  type: 'phishing_clicked',
  severity: 'medium',

  // Context enrichment
  context: {
    // Time context
    after_hours: false,
    weekend: false,
    unusual_time: false,

    // Pattern context
    repeated_attempts: false,
    regular_pattern: true,
    burst_activity: false,

    // User context
    privileged_user: false,
    new_user: false,
    suspicious_user: false,

    // Verification context
    mfa_verified: true,
    known_device: true,
    corporate_network: true,

    // Geo context
    vpn_detected: false,
    tor_detected: false,
    foreign_ip: false,
    location_change: false
  }
}
```

## Scenario Engine

### Scenario Types

#### Normal Operations
```javascript
{
  name: 'normal',
  event_rate: 10,  // eventi/sec
  severity_distribution: {
    low: 0.60,
    medium: 0.30,
    high: 0.08,
    critical: 0.02
  },
  event_types: 'all'
}
```

#### Attack Scenario
```javascript
{
  name: 'attack',
  event_rate: 25,  // eventi/sec aumentato
  severity_distribution: {
    low: 0.20,
    medium: 0.40,
    high: 0.30,
    critical: 0.10
  },
  event_types: ['phishing', 'malware', 'privilege_escalation'],
  inject_patterns: ['credential_stuffing', 'lateral_movement']
}
```

#### Crisis Scenario
```javascript
{
  name: 'crisis',
  event_rate: 50,  // eventi/sec molto alto
  severity_distribution: {
    low: 0.10,
    medium: 0.20,
    high: 0.40,
    critical: 0.30
  },
  event_types: ['ransomware', 'data_breach', 'crisis_event'],
  convergent_indicators: true  // Triggera indicatori 10.x
}
```

#### Custom Scenario
```javascript
{
  name: 'custom',
  event_rate: 15,
  custom_events: [
    { type: 'phishing_clicked', weight: 0.30 },
    { type: 'ai_recommendation_followed', weight: 0.25 },
    { type: 'alert_fatigue', weight: 0.20 }
  ]
}
```

### Utilizzo

```javascript
const ScenarioEngine = require('./scenario-engine');

const engine = new ScenarioEngine();

// Carica scenario
engine.loadScenario('attack');

// Genera eventi
const events = engine.generate(100);  // 100 eventi

// Modifica runtime
engine.setEventRate(30);
engine.setSeverity('high', 0.40);
```

## Dense Loader

Generatore ad alta densità per stress testing:

```javascript
const DenseLoader = require('./dense-loader');

const loader = new DenseLoader({
  eventsPerSecond: 1000,
  duration: 60,  // secondi
  batchSize: 100,
  streaming: true
});

// Avvia generazione
loader.start((batch) => {
  // Processa batch di 100 eventi
  sendToSIEM(batch);
});

// Statistiche
console.log(loader.getStats());
// {
//   totalEvents: 60000,
//   eventsPerSecond: 1000,
//   memoryUsage: '150 MB',
//   duration: 60
// }
```

## Utilizzo Completo

### Nel Simulatore

```javascript
const { SiemDataGenerator } = require('./generators');
const ScenarioEngine = require('./generators/scenario-engine');

// Setup
const generator = new SiemDataGenerator();
const scenario = new ScenarioEngine();

// Carica scenario
scenario.loadScenario('normal');

// Avvia generazione
setInterval(() => {
  // Genera 2-5 eventi
  const eventCount = Math.floor(Math.random() * 3) + 2;

  for (let i = 0; i < eventCount; i++) {
    const event = generator.generateEvent(scenario);

    // Invia a SIEM connector
    await siemConnector.sendEvent(event);

    // Converti in CPF updates
    const updates = cpfAdapter.convertEvent(event);
    await saveIndicatorUpdates(updates);
  }
}, 100);  // Ogni 100ms (10 eventi/sec)
```

## Configurazione

I generatori sono configurabili via `/simulator/config/`:

```json
{
  "generator": {
    "default_rate": 10,
    "max_rate": 1000,
    "event_types": "all",
    "enrichment": {
      "enable_context": true,
      "enable_geo": true,
      "enable_user_profiles": true
    }
  }
}
```

## Testing

```bash
# Test generatore base
node simulator/test-generator.js

# Test scenario
node simulator/test-scenario.js attack

# Stress test
node simulator/test-dense-loader.js 1000  # 1000 eventi/sec
```

## Performance

### Benchmark

| Generatore | Eventi/sec | Memoria | CPU |
|------------|-----------|---------|-----|
| SIEM Data Gen | 100-500 | 50 MB | 10% |
| Scenario Engine | 200-1000 | 80 MB | 15% |
| Dense Loader | 1000-5000 | 150 MB | 30% |

## Riferimenti

- **Simulatore**: `/dashboard/simulator/README.md`
- **CPF Adapter**: `/dashboard/simulator/adapters/README.md`
- **Event Baseline**: `/dashboard/simulator/adapters/event-baseline.js`
- **Connectors**: `/dashboard/simulator/connectors/README.md`
