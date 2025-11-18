# Simulator Configuration

Configuration files for the CPF simulator, defining scenarios, SIEM sources, and event patterns.

## Overview

This directory contains JSON configuration files that define:
- Scenario definitions (normal, attack, crisis)
- SIEM source configurations
- Event type distributions
- Temporal patterns

## Files

### scenarios.json
**Scenario definitions** - Pre-configured attack and operational scenarios.

**Structure:**
```json
{
  "normal": {
    "name": "Normal Operations",
    "description": "Baseline SOC operations",
    "event_rate_multiplier": 1.0,
    "severity_distribution": {
      "low": 0.70,
      "medium": 0.25,
      "high": 0.05
    },
    "dominant_indicators": [],
    "convergence_risk": "low"
  },
  "phishing_campaign": {
    "name": "Phishing Campaign",
    "description": "Targeted phishing attack",
    "event_rate_multiplier": 1.5,
    "severity_distribution": {
      "low": 0.50,
      "medium": 0.35,
      "high": 0.15
    },
    "dominant_indicators": ["1.1", "1.3", "3.1", "4.3"],
    "event_types": ["phishing_clicked", "social_engineering"],
    "convergence_risk": "medium"
  },
  "ransomware_attack": {
    "name": "Ransomware Attack",
    "description": "Active ransomware incident",
    "event_rate_multiplier": 3.0,
    "severity_distribution": {
      "low": 0.20,
      "medium": 0.40,
      "high": 0.40
    },
    "dominant_indicators": ["4.1", "7.1", "7.4", "10.3"],
    "event_types": ["ransomware_activity", "lateral_movement"],
    "convergence_risk": "critical"
  }
}
```

**Available Scenarios:**
- `normal` - Baseline operations
- `phishing_campaign` - Social engineering attack
- `ransomware_attack` - Active ransomware
- `insider_threat` - Malicious insider activity
- `crisis` - Multiple concurrent incidents

### sources.json
**SIEM source definitions** - Configuration for different SIEM platforms.

**Structure:**
```json
{
  "splunk": {
    "name": "Splunk Enterprise",
    "type": "siem",
    "event_types": [
      "authentication",
      "network",
      "endpoint",
      "application"
    ],
    "default_index": "security",
    "query_language": "SPL",
    "supports_realtime": true
  },
  "qradar": {
    "name": "IBM QRadar",
    "type": "siem",
    "event_types": ["authentication", "network", "endpoint"],
    "query_language": "AQL",
    "supports_realtime": true
  },
  "sentinel": {
    "name": "Microsoft Sentinel",
    "type": "siem",
    "event_types": ["azure_ad", "m365", "endpoint"],
    "query_language": "KQL",
    "cloud_native": true
  },
  "crowdstrike": {
    "name": "CrowdStrike Falcon",
    "type": "edr",
    "event_types": ["endpoint", "behavioral"],
    "specialization": "endpoint_detection"
  }
}
```

**Supported Sources:**

**SIEM Platforms:**
- Splunk
- QRadar
- Sentinel
- Elastic
- ArcSight
- LogRhythm
- FortiSIEM

**EDR Platforms:**
- CrowdStrike
- Carbon Black
- Cortex XDR

**SOAR Platforms:**
- XSOAR
- Rapid7 InsightConnect

## Usage

### Loading Scenarios

```javascript
const scenarios = require('./config/scenarios.json');

// Get specific scenario
const ransomwareScenario = scenarios.ransomware_attack;

// Apply to generator
generator.setScenario(ransomwareScenario);
```

### Loading Sources

```javascript
const sources = require('./config/sources.json');

// Get source config
const splunkConfig = sources.splunk;

// Initialize connector
const connector = new SplunkConnector(splunkConfig);
```

### From Simulator API

```bash
# Start simulation with scenario
POST /api/simulator/start
{
  "orgId": "test-org",
  "sources": ["splunk", "qradar"],
  "scenario": "ransomware_attack",
  "rate": 5
}
```

## Customization

### Add New Scenario

```json
{
  "custom_scenario": {
    "name": "Custom Scenario Name",
    "description": "Description of the scenario",
    "event_rate_multiplier": 2.0,
    "severity_distribution": {
      "low": 0.30,
      "medium": 0.50,
      "high": 0.20
    },
    "dominant_indicators": ["1.1", "5.1", "7.2"],
    "event_types": ["specific_event_type"],
    "convergence_risk": "medium",
    "duration_minutes": 120,
    "progression": {
      "phase_1": { "duration": 30, "focus": "reconnaissance" },
      "phase_2": { "duration": 60, "focus": "exploitation" },
      "phase_3": { "duration": 30, "focus": "impact" }
    }
  }
}
```

### Add New SIEM Source

```json
{
  "new_siem": {
    "name": "New SIEM Name",
    "type": "siem|edr|soar",
    "vendor": "Vendor Name",
    "event_types": ["type1", "type2"],
    "query_language": "QL",
    "supports_realtime": true,
    "api_version": "v2",
    "authentication": "api_key|oauth2|basic",
    "default_config": {
      "host": "siem.example.com",
      "port": 443
    }
  }
}
```

## Scenario Design Guidelines

### Event Rate Multiplier
- `1.0` - Normal baseline
- `1.5-2.0` - Elevated activity
- `2.0-3.0` - Active incident
- `3.0+` - Crisis/emergency

### Severity Distribution
Should sum to 1.0:
- Normal: 70% low, 25% medium, 5% high
- Attack: 40% low, 40% medium, 20% high
- Crisis: 20% low, 40% medium, 40% high

### Dominant Indicators
Choose 3-5 indicators that will be most active in this scenario:
- Phishing: 1.1, 1.3, 3.1, 4.3 (authority, social, trust)
- Ransomware: 4.1, 7.1, 7.4, 10.3 (fear, stress, convergence)
- Insider: 2.4, 6.3, 8.1 (temporal, diffusion, automaticity)

### Convergence Risk
- `low`: Independent indicators, minimal correlation
- `medium`: Some indicator clustering
- `high`: Strong correlations, cascade potential
- `critical`: Multiple convergent states (Category 10.x)

## Temporal Progression

For realistic scenarios, define phases:

```json
{
  "progression": {
    "initial_compromise": {
      "duration_minutes": 15,
      "event_types": ["phishing_clicked", "malware_detected"],
      "dominant_indicators": ["1.3", "4.3"]
    },
    "lateral_movement": {
      "duration_minutes": 45,
      "event_types": ["privilege_escalation", "network_scan"],
      "dominant_indicators": ["2.4", "8.1"]
    },
    "impact": {
      "duration_minutes": 30,
      "event_types": ["ransomware_activity", "data_exfiltration"],
      "dominant_indicators": ["4.1", "7.1", "10.3"]
    }
  }
}
```

## Validation

Validate configuration before loading:

```javascript
const Ajv = require('ajv');
const ajv = new Ajv();

const scenarioSchema = {
  type: 'object',
  required: ['name', 'description', 'event_rate_multiplier'],
  properties: {
    name: { type: 'string' },
    description: { type: 'string' },
    event_rate_multiplier: { type: 'number', minimum: 0.1, maximum: 10 },
    severity_distribution: {
      type: 'object',
      required: ['low', 'medium', 'high']
    }
  }
};

const validate = ajv.compile(scenarioSchema);
const valid = validate(scenario);
if (!valid) console.error(validate.errors);
```

## Related Resources

- **Scenario Engine**: `../generators/scenario-engine.js` - Scenario execution
- **SIEM Generator**: `../generators/siem-data-generator.js` - Event generation
- **Connectors**: `../connectors/` - SIEM integration
- **Simulator Dashboard**: `../index.html` - UI for scenario selection
