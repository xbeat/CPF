# CPF Event Adapters

Adattatori per la conversione di eventi SIEM in indicatori CPF.

## Contenuto

### `cpf-adapter.js`

Adapter principale che converte eventi di sicurezza (SIEM/EDR/XDR) in aggiornamenti degli indicatori CPF (1.1 - 10.10).

**Funzionalità:**
- Mapping eventi → indicatori CPF
- Calcolo score Bayesiano
- Context adjustment (time, pattern, user, geo)
- Scenario-based modulation

### `event-baseline.js`

Matrice di baseline che definisce il mapping deterministico tra 40+ tipi di eventi e i 100 indicatori CPF.

**Struttura:**
- Event types (phishing, malware, policy violation, etc.)
- Baseline scores per indicatore
- Coverage matrix (quali indicatori vengono triggerati)

## CPF Adapter

### Architettura

```
SIEM Event → CPF Adapter → Indicator Updates
     ↓              ↓              ↓
Event Type   Baseline Lookup   Bayesian Score
Severity     Context Adjust    Confidence
Context      Scenario Mult     Previous Value
```

### Event Processing Flow

```javascript
// 1. Riceve evento SIEM
const event = {
  type: 'phishing_clicked',
  severity: 'medium',
  user: 'john.doe@company.com',
  timestamp: '2025-11-18T10:30:00Z',
  context: {
    after_hours: false,
    mfa_verified: true,
    privileged_user: false
  }
};

// 2. Lookup baseline (event-baseline.js)
const baseline = EVENT_BASELINE['phishing_clicked'];
// → { '1.1': 0.70, '1.3': 0.65, '3.2': 0.58, '5.1': 0.81 }

// 3. Calcolo score per ogni indicatore
for (const [indicatorId, baseScore] of Object.entries(baseline)) {
  let score = baseScore;

  // Modulazione dinamica
  score += calculateEventFrequency(indicatorId) * 0.2;
  score += event.severity === 'high' ? 0.15 : 0;

  // Bayesian context
  score *= calculateContextFactor(event.context);

  // Scenario multiplier
  if (scenario === 'attack') score *= 1.3;

  // Salva indicatore
  saveIndicatorUpdate(orgId, indicatorId, score);
}
```

### Bayesian Context Adjustment

Il context factor modifica lo score base:

```javascript
function calculateContextFactor(context) {
  let factor = 1.0;

  // Time-based
  if (context.after_hours) factor += 0.20;
  if (context.weekend) factor += 0.15;

  // Pattern-based
  if (context.repeated_attempts) factor += 0.25;
  if (context.unusual_time) factor += 0.20;

  // User-based
  if (context.privileged_user) factor += 0.15;
  if (context.new_user) factor += 0.10;

  // Verification-based
  if (context.mfa_verified) factor -= 0.30;
  if (context.known_device) factor -= 0.15;

  // Geo-based
  if (context.vpn_detected) factor += 0.30;
  if (context.tor_detected) factor += 0.40;
  if (context.foreign_ip) factor += 0.20;

  return Math.max(0.5, Math.min(1.5, factor));
}
```

## Event Baseline Matrix

### Struttura

Il file `event-baseline.js` contiene:

```javascript
const EVENT_BASELINE = {
  // Categoria: Phishing & Social Engineering
  'phishing_clicked': {
    '1.1': 0.70,  // Unquestioning Compliance
    '1.3': 0.65,  // Authority Impersonation
    '3.2': 0.58,  // Peer Pressure
    '5.1': 0.81,  // Information Overload
    // ... altri indicatori triggerati
  },

  'phishing_reported': {
    '1.1': 0.25,  // Basso - utente vigilante
    '5.2': 0.30,  // Awareness positiva
    // ...
  },

  // Categoria: Authentication
  'authentication_failed': {
    '1.5': 0.55,  // Credential Security
    '7.1': 0.60,  // Stress sotto pressione
    // ...
  },

  // 40+ altri tipi evento...
};
```

### Event Types Coverage

| Categoria | Eventi | Indicatori Triggerati | Coverage |
|-----------|--------|----------------------|----------|
| Phishing & Social Eng | 5 | 8-12 | 80-100% |
| Authentication | 4 | 6-8 | 60-80% |
| Malware & Threats | 6 | 10-15 | 90-100% |
| Policy & Compliance | 4 | 5-8 | 50-80% |
| User Behavior | 8 | 8-12 | 80-90% |
| AI & Automation | 4 | 6-8 | 60-70% |
| Cognitive Load | 5 | 7-10 | 70-90% |
| Group Dynamics | 3 | 5-7 | 50-70% |
| Crisis Events | 3 | 10-12 | 80-100% |

**Totale: 42 event types → 60-80 indicatori coperti**

## Esempi di Mapping

### Phishing Clicked

```javascript
'phishing_clicked': {
  '1.1': 0.70,  // Authority-Based: Unquestioning Compliance
  '1.3': 0.65,  // Authority-Based: Authority Impersonation
  '2.5': 0.60,  // Temporal: Urgency Susceptibility
  '3.2': 0.58,  // Social: Peer Pressure
  '4.3': 0.62,  // Affective: Fear Response
  '5.1': 0.81,  // Cognitive: Information Overload
  '7.2': 0.55,  // Stress: Decision Fatigue
  '8.3': 0.60,  // Unconscious: Confirmation Bias
}
```

**Rationale:**
- Alto su 5.1 (Info Overload) - phishing spesso sfrutta sovraccarico
- Alto su 1.1 (Compliance) - click indica compliance cieca
- Medio su altri - sfrutta multiple vulnerabilità psicologiche

### Alert Fatigue

```javascript
'alert_fatigue': {
  '5.1': 0.85,  // Cognitive: Information Overload (molto alto)
  '5.3': 0.75,  // Cognitive: Alert Desensitization
  '7.2': 0.70,  // Stress: Decision Fatigue
  '7.5': 0.65,  // Stress: Chronic Stress
}
```

**Rationale:**
- Altissimo su 5.1 e 5.3 - fatigue è cognitive overload
- Alto su stress - fatigue aumenta stress
- Pochi indicatori ma molto rilevanti

### Ransomware Activity

```javascript
'ransomware_activity': {
  '4.1': 0.85,  // Affective: Fear Paralysis (critico)
  '4.5': 0.80,  // Affective: Panic Response
  '7.1': 0.88,  // Stress: Acute Stress (molto alto)
  '7.5': 0.75,  // Stress: Chronic Stress
  '10.1': 0.82, // Convergent: Perfect Storm
  '10.3': 0.78, // Convergent: Crisis Amplification
  // ... 10-15 indicatori triggerati
}
```

**Rationale:**
- Baseline già molto alti - evento critico
- Molti indicatori - impatto sistemico
- Convergent indicators - multiple vulnerabilities convergono

## Utilizzo

### Nel Simulatore

```javascript
const CPFAdapter = require('./adapters/cpf-adapter');

const adapter = new CPFAdapter();

// Converti evento SIEM in updates CPF
const updates = adapter.convertEvent({
  orgId: 'org-001',
  event: siemEvent,
  scenario: 'normal'
});

// updates = [
//   { indicatorId: '1.1', score: 0.72, confidence: 0.85 },
//   { indicatorId: '1.3', score: 0.68, confidence: 0.82 },
//   ...
// ]

// Salva aggiornamenti
for (const update of updates) {
  await saveIndicator(updates.orgId, update);
}
```

### Estendere Event Baseline

Per aggiungere nuovi event types:

```javascript
// In event-baseline.js
EVENT_BASELINE['my_new_event'] = {
  '1.5': 0.60,  // Indicatore primario
  '3.2': 0.55,  // Indicatore secondario
  // ... altri indicatori rilevanti
};
```

**Best Practices:**
- Non triggerare più di 15 indicatori per evento
- Baseline realistici (non partire da 0.80+)
- Razionale chiaro per ogni mapping
- Testare impact su matrice 10×10

## Problemi Noti

⚠️ **Baseline troppo alti** - Vedi `/simulator/README.md` sezione "Perché diventano tutti rossi"

**Fix pianificati:**
- Riduzione baseline del 30-40%
- Time decay implementation
- Event cooldown per indicatori
- Context balancing (non sempre amplificante)

## Testing

```bash
# Test adapter
node simulator/test-adapter.js

# Test event mapping
node simulator/test-event-mapping.js phishing_clicked

# Validate baseline matrix
node simulator/validate-baseline.js
```

## Riferimenti

- **Simulatore**: `/dashboard/simulator/README.md`
- **Connettori SIEM**: `/dashboard/simulator/connectors/README.md`
- **Data Generators**: `/dashboard/simulator/generators/README.md`
- **Detection Engine** (approccio alternativo): `/dashboard/cpf-detection-engine/README.md`
