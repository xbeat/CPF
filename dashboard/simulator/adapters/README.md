# CPF Adapters

Adapters that transform SIEM events into CPF indicator assessments with Bayesian scoring.

## Overview

The adapter layer is responsible for:
- Mapping SIEM events to CPF indicators
- Calculating Bayesian risk scores
- Aggregating events per indicator
- Generating CPF assessments with confidence levels

## Files

### cpf-adapter.js
**Main CPF adapter** - Transforms raw SIEM events into scored CPF indicators.

**Key Functions:**

```javascript
class CPFAdapter {
  // Map event types to indicators
  buildEventMapping()

  // Convert events to CPF assessments
  convertToCPF(events, orgId, scenario)

  // Calculate Bayesian score (Dense Paper formula)
  calculateBayesianScore(aggregate, indicator, events, eventType, scenario)

  // Bayesian context adjustment
  calculateBayesianContext(events, eventType, indicatorId)

  // Create individual assessment
  createAssessment(indicatorId, aggregate, orgId, scenario)
}
```

**Scoring Methodology:**

The adapter uses a **3-tier scoring approach**:

1. **Tier 1: Baseline Deterministic**
   ```javascript
   baseRisk = EVENT_BASELINE[eventType][indicatorId]
   ```
   Uses deterministic baseline from event-baseline.js matrix

2. **Tier 2: Dynamic Modulation**
   ```javascript
   score += Math.log10(eventCount + 1) / 2 * 0.2   // Frequency
   score += avgSeverity * 0.15                      // Average severity
   score += maxSeverity * 0.1                       // Peak severity
   ```

3. **Tier 3: Bayesian Context Adjustment**
   ```javascript
   // P(legitimate|factors) from Dense Foundation Paper
   contextFactor = 1.0
   if (after_hours) contextFactor += 0.20
   if (privileged_user) contextFactor += 0.15
   if (mfa_verified) contextFactor -= 0.30
   // ... more context factors

   score *= contextFactor
   ```

4. **Tier 4: Scenario Multiplier**
   ```javascript
   if (scenario !== 'normal') score *= 1.3
   ```

### event-baseline.js
**Event-to-Indicator baseline matrix** - Deterministic risk scores for event/indicator combinations.

**Structure:**
```javascript
EVENT_BASELINE = {
  'phishing_clicked': {
    '1.1': 0.70,  // Unquestioning compliance
    '1.3': 0.65,  // Authority impersonation
    '3.1': 0.60,  // Social proof
    '4.3': 0.75,  // Trust exploitation
    // ...
  },
  'ransomware_activity': {
    '4.1': 0.85,  // Fear paralysis
    '7.1': 0.88,  // Acute stress
    '10.3': 0.90, // Perfect storm
    // ...
  },
  // ... 40+ event types
}
```

**Coverage**: ~60-80 indicators have baseline mappings for common event types.

## Event Types

The adapter recognizes 40+ SIEM event types:

### Common (50% of events)
- `authentication_failed`
- `policy_violation`
- `information_overload`

### Medium (30% of events)
- `phishing_clicked`
- `multitasking_detected`
- `ai_recommendation_followed`

### Uncommon (15% of events)
- `privilege_escalation`
- `social_engineering`
- `groupthink_indicator`

### Rare (5% of events)
- `ransomware_activity`
- `crisis_event`
- `ml_model_poisoning`

## Bayesian Context Factors

The adapter considers these contextual factors:

### Temporal Context
- `after_hours`: Event outside business hours (+20%)
- `business_hours`: Event during normal hours (-10%)

### User Context
- `privileged_user`: Admin/exec account (+15%)
- `known_user`: Established baseline (-15%)

### Authentication Context
- `mfa_verified`: MFA used (-30%)
- `no_mfa`: Password-only authentication (+20%)

### Geographic Context
- `vpn_tor`: VPN or Tor usage (+30%)
- `from_office`: Physical office location (-10%)

### Pattern Context
- `regular_pattern`: Matches historical behavior (+25%)
- `anomalous_pattern`: Deviates from baseline (+35%)

## Integration

### With SIEM Data Generator
```javascript
const { SIEMDataGenerator } = require('../generators/siem-data-generator');
const { CPFAdapter } = require('./cpf-adapter');

// Generate events
const generator = new SIEMDataGenerator();
const events = generator.generateEvents(count=100);

// Convert to CPF
const adapter = new CPFAdapter(denseLoader);
const assessments = adapter.convertToCPF(events, orgId, scenario);
```

### With Dashboard
```javascript
// Save assessments
for (const assessment of assessments) {
  await saveSocIndicator(assessment);
}

// Emit WebSocket update
io.emit('indicator_update', {
  orgId: orgId,
  indicators: assessments
});
```

## Configuration

### Adjust Baseline Scaling
```javascript
// In cpf-adapter.js
const BASELINE_SCALE = 0.7;  // Scale all baselines by 70%
baseRisk *= BASELINE_SCALE;
```

### Customize Context Weights
```javascript
// Modify context factor calculations
if (after_hours) contextFactor += 0.15;  // Reduce from 0.20
if (mfa_verified) contextFactor -= 0.40; // Increase from -0.30
```

## Performance Considerations

### Batch Processing
The adapter efficiently processes events in batches:
- Groups events by indicator
- Calculates aggregate statistics once
- Single Bayesian calculation per indicator

### Caching
Event baselines are cached on adapter initialization for fast lookup.

## Testing

```javascript
// Test event conversion
const testEvent = {
  type: 'phishing_clicked',
  severity: 'high',
  timestamp: Date.now(),
  user: 'test@example.com',
  metadata: { after_hours: true }
};

const assessments = adapter.convertToCPF([testEvent], 'test-org', 'normal');
console.log(assessments);
```

## Related Resources

- **Dense Loader**: `../generators/dense-loader.js` - Indicator structure
- **Event Baseline**: `./event-baseline.js` - Deterministic risk matrix
- **SIEM Generator**: `../generators/siem-data-generator.js` - Event generation
- **Dense Foundation Paper**: `/foundation docs/core/en-US/` - Mathematical formalization
