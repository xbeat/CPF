# Event Generators

Generators for creating realistic SIEM events, scenarios, and test data for CPF simulator.

## Overview

The generator layer creates realistic security events for:
- Testing CPF dashboard functionality
- Demonstrating indicator behavior
- Training and demonstrations
- Scenario-based simulations (normal, attack, crisis)

## Files

### siem-data-generator.js
**Main event generator** - Creates realistic SIEM events with proper metadata.

**Features:**
- 40+ event types (phishing, malware, auth failures, policy violations)
- Weighted distribution (common 50%, medium 30%, uncommon 15%, rare 5%)
- Metadata generation (timestamps, users, IPs, severity)
- Scenario-based modulation (normal, attack, crisis)

**Usage:**
```javascript
const { SIEMDataGenerator } = require('./siem-data-generator');

const generator = new SIEMDataGenerator();

// Generate single event
const event = generator.generateSingleEvent();

// Generate batch
const events = generator.generateEvents(count=100);

// Generate for specific scenario
const crisisEvents = generator.generateEvents(100, 'crisis');
```

**Event Structure:**
```javascript
{
  id: 'evt_1234567890',
  type: 'phishing_clicked',
  severity: 'high',
  timestamp: '2025-01-15T14:30:00Z',
  source: 'email_gateway',
  user: 'alice@example.com',
  metadata: {
    after_hours: false,
    privileged_user: false,
    mfa_verified: true,
    vpn: false,
    // ... contextual data
  }
}
```

### scenario-engine.js
**Scenario orchestration** - Creates realistic attack scenarios with temporal progression.

**Scenarios:**

1. **Normal Operations**
   - Low event volume
   - Mostly common events
   - Minimal high-severity alerts

2. **Phishing Campaign**
   - Increased phishing events
   - Social engineering patterns
   - Escalating severity over time

3. **Ransomware Attack**
   - Initial compromise events
   - Lateral movement indicators
   - Encryption activity spike
   - Crisis-level stress markers

4. **Insider Threat**
   - Gradual privilege escalation
   - After-hours access patterns
   - Data exfiltration indicators

5. **Crisis Scenario**
   - Multiple concurrent incidents
   - Time pressure indicators
   - Organizational stress markers
   - Converging vulnerabilities

**Usage:**
```javascript
const { ScenarioEngine } = require('./scenario-engine');

const engine = new ScenarioEngine();

// Load scenario
const scenario = engine.loadScenario('ransomware_attack');

// Generate event sequence
const eventSequence = scenario.generateSequence(duration_minutes=60);

// Execute scenario
for (const event of eventSequence) {
  await injectEvent(event);
  await sleep(event.delay);
}
```

### dense-loader.js
**CPF Dense Foundation loader** - Loads indicator structure from Dense Foundation Paper.

**Responsibilities:**
- Load 100 CPF indicators (10 categories × 10 indicators)
- Define baseline risk levels
- Calculate indicator weights
- Define interdependencies
- Provide temporal patterns

**Key Functions:**
```javascript
class DenseLoader {
  // Load all indicators
  load()

  // Get specific indicator
  getIndicator(id)  // e.g., '5.1'

  // Get all indicators in category
  getCategoryIndicators(category)  // e.g., 5

  // Generate risk score for event
  generateRiskFromEvent(indicatorId, event, scenario)

  // Calculate confidence from observations
  calculateConfidence(observationCount)
}
```

**Indicator Structure:**
```javascript
{
  id: '5.1',
  category: '5',
  categoryName: 'Cognitive',
  index: 1,
  baselineRisk: 0.22,
  weight: 1.0,
  influences: { '7.2': 0.15, '4.10': 0.12 },
  temporalPattern: 'increasing',
  thresholds: {
    low: 0.33,
    medium: 0.66,
    high: 0.85,
    critical: 0.95
  }
}
```

### index.js
**Generator exports** - Main entry point for all generators.

## Event Types by Category

### Authentication (10 types)
- `authentication_failed`
- `suspicious_login`
- `brute_force_attempt`
- `credential_stuffing`

### Email Security (8 types)
- `phishing_clicked`
- `malicious_attachment`
- `business_email_compromise`
- `spam_outbreak`

### Endpoint Security (12 types)
- `malware_detected`
- `ransomware_activity`
- `suspicious_process`
- `privilege_escalation`

### Network Security (6 types)
- `network_anomaly`
- `data_exfiltration`
- `c2_communication`
- `port_scan`

### Behavioral (14 types)
- `policy_violation`
- `after_hours_access`
- `multitasking_detected`
- `groupthink_indicator`
- `information_overload`

## Scenario Progression

### Ransomware Attack Timeline

```
T+0min:   Initial compromise (phishing_clicked)
T+5min:   Reconnaissance (network_scan)
T+15min:  Privilege escalation
T+30min:  Lateral movement
T+60min:  Data staging
T+90min:  Encryption begins (ransomware_activity)
T+120min: Crisis state, multiple converging indicators
```

### Event Frequency by Scenario

| Scenario | Events/Hour | High Severity % | Convergent Risk |
|----------|-------------|-----------------|-----------------|
| Normal   | 50-100      | 5%              | Low             |
| Phishing | 100-200     | 15%             | Medium          |
| Ransomware | 200-500   | 30%             | High            |
| Crisis   | 500-1000    | 50%             | Critical        |

## Configuration

### Adjust Event Rate
```javascript
// In simulator dashboard or API
const simulatorConfig = {
  rate: 3,  // events per second (default: 10)
  scenario: 'normal',
  sources: ['splunk', 'qradar']
};
```

### Customize Event Distribution
```javascript
// In siem-data-generator.js
const EVENT_WEIGHTS = {
  common: 0.50,    // 50% of events
  medium: 0.30,    // 30%
  uncommon: 0.15,  // 15%
  rare: 0.05       // 5%
};
```

### Add New Event Type
```javascript
// Add to EVENT_TYPES in siem-data-generator.js
EVENT_TYPES.common.push({
  type: 'new_event_type',
  severity: 'medium',
  source: 'custom_system',
  triggers: ['1.1', '2.3', '5.1']  // CPF indicators
});
```

## Testing

```javascript
// Generate test dataset
const generator = new SIEMDataGenerator();
const testEvents = generator.generateEvents(1000);

// Validate event structure
testEvents.forEach(event => {
  assert(event.id);
  assert(event.type);
  assert(event.severity);
  assert(event.timestamp);
});

// Test scenario
const scenario = new ScenarioEngine().loadScenario('phishing');
const sequence = scenario.generateSequence(30);
assert(sequence.length > 0);
```

## Performance

### Memory Usage
- Each event: ~1KB
- 1000 events: ~1MB
- Batch generation preferred for efficiency

### Generation Speed
- ~10,000 events/second single-threaded
- Limited by JSON serialization, not generation logic

### Recommendations
- Generate events in batches of 100-1000
- Use scenario engine for realistic temporal distribution
- Clear old events periodically to prevent memory bloat

## Integration with CPF Pipeline

```
Generators (THIS)
    ↓
Events with metadata
    ↓
CPF Adapter (../adapters/cpf-adapter.js)
    ↓
Bayesian Scoring
    ↓
SOC Dashboard (../../soc/)
```

## Related Resources

- **CPF Adapter**: `../adapters/cpf-adapter.js` - Event to CPF conversion
- **Dense Foundation**: `/foundation docs/core/en-US/` - Indicator structure
- **Event Baseline**: `../adapters/event-baseline.js` - Risk mappings
- **Simulator Dashboard**: `../index.html` - UI for controlling generation
