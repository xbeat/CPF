# SIEM Correlation Rules

This directory contains SIEM correlation rules for detecting CPF psychological vulnerability patterns.

## Contents

- **cpf_authority_detection.spl** - Splunk correlation rules for Authority-Based vulnerabilities (Category 1.x)

## Overview

These correlation rules translate CPF indicators into SIEM queries that can run continuously in your Security Operations Center.

## Rule Structure

Each rule file follows the OFTLISRV schema:

1. **Observables (O)** - What behavioral patterns to look for
2. **Data Sources (F)** - Which log sources to query
3. **Temporality (T)** - Time windows and persistence thresholds
4. **Detection Logic (L)** - Rule logic combining deterministic + statistical methods
5. **Interdependencies (I)** - Correlations with other indicators
6. **Thresholds (S)** - Alert severity levels
7. **Responses (R)** - Recommended actions when triggered
8. **Validation (V)** - Human-in-the-loop audit protocols

## Supported SIEM Platforms

Currently implemented:
- **Splunk** (.spl files)

Planned:
- QRadar (.aql files)
- Sentinel (KQL files)
- Elastic (EQL files)

## Usage

### Splunk

```bash
# Install correlation rule
splunk add search "cpf_authority_detection.spl" -app search

# Enable as scheduled search
splunk enable alert "CPF_Authority_Detection" -cron "*/15 * * * *"
```

## Rule Categories

Correlation rules are organized by CPF category:

1. **Authority-Based** (cpf_authority_detection.spl) - Unquestioning compliance, authority impersonation susceptibility
2. **Temporal-Based** (planned) - Urgency-induced bypass, deadline pressure
3. **Social-Based** (planned) - Social proof exploitation, peer pressure
4. **Cognitive-Based** (planned) - Alert fatigue, information overload
5. **Stress-Based** (planned) - Crisis response patterns, burnout indicators

## Integration with CPF Adapter

These rules feed data to the CPF adapter (`/dashboard/simulator/adapters/cpf-adapter.js`) which:
- Aggregates events by indicator
- Calculates Bayesian scores
- Updates SOC dashboard in real-time

## Customization

Edit threshold values in each rule to match your organization's baseline:

```spl
# Adjust thresholds based on your environment
| where compliance_rate > 0.85  # Default: 85%, adjust as needed
```

## Contributing

To add new correlation rules:

1. Use the template in `/implementation/X.x-category/[X.Y] Indicator.md`
2. Extract the "Detection Logic (L)" section
3. Translate to your SIEM's query language
4. Test against baseline data
5. Submit PR with rule file

## Related Resources

- **Implementation Schemas**: `/implementation/` - Detailed OFTLISRV for all 100 indicators
- **Pattern Detectors**: `/src/detectors.py` - Python pattern detection algorithms
- **Dashboard Integration**: `/dashboard/soc/` - Real-time visualization
