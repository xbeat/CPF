# Data Generators - Specific Event Types

Generatori specifici per ogni tipo di evento organizzativo.

## Contenuto

### `email-generator.js`

Generatore di eventi email con approval requests e authority indicators.

**Status**: ✅ Implementato

**Funzionalità:**
- Genera 50,000 email/giorno
- Distribuzione sender/recipient realistica
- Subject pattern analysis
- Approval request detection
- Link click behavior
- Authority level classification
- Time-to-action measurement

**Segnali iniettabili:**
- Indicator 1.1: Compliance anormalmente alta
- Indicator 1.3: Authority impersonation response
- Indicator 2.5: Urgency susceptibility

**Utilizzo:**
```javascript
const EmailGenerator = require('./email-generator');

const gen = new EmailGenerator({
  eventsPerDay: 50000,
  organizationProfile: {
    size: 'enterprise',
    industry: 'technology',
    employees: 5000
  },
  injectSignals: {
    '1.1': 50,  // 50 segnali per indicator 1.1
    '1.3': 30,  // 30 segnali per indicator 1.3
  }
});

const events = await gen.generate('2025-11-18');
```

**Output format:**
```javascript
{
  event_id: 'email_1234567890',
  timestamp: '2025-11-18T10:30:45.123Z',
  sender: 'ceo@company.com',
  sender_authority_level: 'executive',
  recipient: 'john.doe@company.com',
  recipient_department: 'engineering',
  subject: 'Urgent: Please approve budget',
  has_approval_request: true,
  has_urgency_markers: true,
  urgency_score: 0.85,
  clicked_approve: true,
  time_to_action: 45,  // secondi
  typical_response_time: 3600,  // 1 ora (baseline)
  is_authority_impersonation: false  // Ground truth
}
```

### `auth-generator.js`

Generatore di eventi di autenticazione.

**Status**: ⏳ Pianificato

**Funzionalità previste:**
- 5,000 auth events/ora (120K/giorno)
- Login attempts (success/fail)
- MFA challenges
- Password resets
- After-hours access patterns
- Geo-location anomalies

**Segnali iniettabili:**
- Indicator 1.5: Credential sharing
- Indicator 2.3: After-hours susceptibility
- Indicator 7.1: Stress-induced auth failures

### `alert-generator.js`

Generatore di eventi alert SIEM.

**Status**: ⏳ Pianificato

**Funzionalità previste:**
- 1,000 alerts/giorno
- Alert presentation
- Investigation status
- Time-to-investigate
- Ignored alerts tracking
- Alert severity distribution

**Segnali iniettabili:**
- Indicator 5.1: Alert fatigue
- Indicator 5.3: Desensitization
- Indicator 7.2: Decision fatigue

### `ticket-generator.js`

Generatore di eventi ticketing/incident.

**Status**: ⏳ Pianificato

**Funzionalità previste:**
- 500 tickets/giorno
- Assignment patterns
- Resolution workflow
- Escalation tracking
- Stress indicators

**Segnali iniettabili:**
- Indicator 6.2: Groupthink in assignments
- Indicator 7.5: Chronic stress markers

## Email Generator - Dettagli

### Realistic Patterns

```javascript
// Distribuzione authority levels
const AUTHORITY_DISTRIBUTION = {
  executive: 0.05,      // CEO, C-suite
  senior_management: 0.15,  // VPs, Directors
  middle_management: 0.30,  // Managers
  staff: 0.50           // Regular employees
};

// Distribuzione tempi risposta (normale)
const RESPONSE_TIME_NORMAL = {
  mean: 3600,   // 1 ora
  stddev: 1800  // 30 min
};

// Email per authority level
const EMAILS_PER_AUTHORITY = {
  executive: 2,     // Poche email, alta priorità
  management: 10,   // Moderate email
  staff: 50         // Molte email
};
```

### Signal Injection

```javascript
// Esempio: Indicator 1.1 (Unquestioning Compliance)
function injectHighCompliance(events, count = 50) {
  const signalIndices = selectRandomIndices(events, count);

  for (const idx of signalIndices) {
    const event = events[idx];

    // Rendi l'evento anomalo
    event.sender_authority_level = 'executive';
    event.has_approval_request = true;
    event.clicked_approve = true;
    event.time_to_action = 15;  // Molto veloce (< μ - 2σ)

    // Ground truth
    event._ground_truth = {
      indicator: '1.1',
      expected_detection: true,
      anomaly_type: 'fast_compliance',
      sigma_distance: 2.8
    };
  }

  return events;
}
```

### Validation

```javascript
const gen = new EmailGenerator({ injectSignals: {'1.1': 50} });
const events = await gen.generate('2025-11-18');

// Verifica injection
const injected = events.filter(e => e._ground_truth);
console.log(`Injected ${injected.length}/50 signals`);

// Ground truth per validation
const groundTruth = injected.map(e => ({
  timestamp: e.timestamp,
  indicator: e._ground_truth.indicator,
  expected_detection: true
}));

fs.writeFileSync(
  'ground_truth_1.1.json',
  JSON.stringify(groundTruth, null, 2)
);
```

## Extensibility

### Aggiungere Nuovo Generatore

```javascript
// generators/my-custom-generator.js
class MyCustomGenerator {
  constructor(config) {
    this.config = config;
    this.groundTruth = [];
  }

  async generate(date) {
    const events = [];

    for (let i = 0; i < this.config.eventsPerDay; i++) {
      events.push(this.generateEvent(date, i));
    }

    // Inject signals
    if (this.config.injectSignals) {
      this.injectSignals(events);
    }

    return events;
  }

  generateEvent(date, index) {
    return {
      event_id: `custom_${Date.now()}_${index}`,
      timestamp: this.randomTimestamp(date),
      // ... altri campi
    };
  }

  injectSignals(events) {
    // Logica injection
  }

  getGroundTruth() {
    return this.groundTruth;
  }
}

module.exports = MyCustomGenerator;
```

## Testing

```bash
# Test email generator
node data-generator/generators/email-generator.js \
  --test \
  --events 1000 \
  --inject 10

# Output:
# ✓ Generated 1,000 events
# ✓ Injected 10 signals for indicator 1.1
# ✓ Mean response time: 3,605 sec (σ: 1,798)
# ✓ Compliance rate: 0.73 (baseline)
# ✓ Anomalies: 10 events with response < 100 sec
```

## Riferimenti

- **Data Generator**: `/dashboard/cpf-detection-engine/data-generator/README.md`
- **Signal Injector**: `/dashboard/cpf-detection-engine/data-generator/signal-injector.js`
- **Ground Truth**: `/dashboard/cpf-detection-engine/data-generator/ground-truth-manager.js`
- **Detection Engine**: `/dashboard/cpf-detection-engine/README.md`
