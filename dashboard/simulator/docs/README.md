# Simulator Documentation

Technical documentation for the CPF SIEM Simulator.

## Overview

This directory contains in-depth documentation for the simulator architecture, implementation details, and integration guides.

## Contents

### CPF_SIEM_Integration_Theory_to_Practice.md

**Comprehensive implementation guide** covering the complete journey from theory to production deployment.

**Topics:**

1. **Theoretical Foundation**
   - CPF framework overview
   - OFTLISRV schema explanation
   - Psychological vulnerability taxonomy

2. **Architecture**
   - Simulator component design
   - Data flow pipelines
   - Bayesian network implementation
   - Real-time processing architecture

3. **Implementation Details**
   - Event generation algorithms
   - Scoring methodology (3-tier approach)
   - Context-aware Bayesian adjustment
   - Temporal decay functions

4. **Integration Patterns**
   - SIEM platform integration
   - API design and endpoints
   - WebSocket real-time updates
   - Multi-organization architecture

5. **Deployment Guide**
   - Production setup
   - Performance tuning
   - Scaling considerations
   - Monitoring and alerting

6. **Troubleshooting**
   - Common issues and solutions
   - Debug techniques
   - Performance optimization
   - Error handling

## Document Usage

### For Developers

**Getting Started:**
1. Read "Theoretical Foundation" for context
2. Study "Architecture" to understand component relationships
3. Dive into "Implementation Details" for coding

**Integration:**
1. Review "Integration Patterns"
2. Follow "Deployment Guide" step-by-step
3. Reference "Troubleshooting" as needed

### For Architects

**System Design:**
1. Focus on "Architecture" section
2. Review "Integration Patterns" for enterprise fit
3. Study "Scaling considerations" for capacity planning

### For Researchers

**Understanding the Methodology:**
1. Read "Theoretical Foundation" thoroughly
2. Examine "Scoring methodology" mathematics
3. Review "Bayesian network implementation"
4. Analyze validation metrics

## Key Concepts Explained

### OFTLISRV Schema
Detailed breakdown of each component with code examples:
- **O**bservables: What to detect
- **F**oundation (Data Sources): Where to get data
- **T**emporality: Time window handling
- **L**ogic: Detection algorithms
- **I**nterdependencies: Bayesian correlations
- **S**hresholds: Alert levels
- **R**esponses: Mitigation actions
- **V**alidation: Human audit protocols

### Three-Tier Scoring

**Tier 1: Baseline**
```
baseRisk = EVENT_BASELINE[eventType][indicatorId]
```

**Tier 2: Dynamic Modulation**
```
score += eventFactor + severityFactor
```

**Tier 3: Bayesian Context**
```
score *= contextFactor
P(legitimate|factors) formula
```

### Temporal Patterns

Understanding how indicators behave over time:
- **Steady**: Constant baseline (Authority, Group)
- **Cyclical**: Repeating patterns (Temporal)
- **Burst**: Sudden spikes (Social)
- **Random**: Unpredictable (Affective)
- **Increasing**: Progressive growth (Cognitive)
- **Spike**: Sharp peaks (Stress)
- **Gradual**: Slow accumulation (Unconscious)
- **Periodic**: Regular intervals (AI)
- **Cascade**: Chain reactions (Convergent)

## Implementation Examples

The document includes working code examples for:
- Event generation
- Bayesian score calculation
- Temporal decay implementation
- Convergence detection
- Multi-source aggregation

## API Reference

Detailed documentation of all simulator APIs:

### Start Simulation
```http
POST /api/simulator/start
Content-Type: application/json

{
  "orgId": "uuid",
  "sources": ["splunk", "qradar"],
  "scenario": "normal",
  "rate": 3
}
```

### Stop Simulation
```http
POST /api/simulator/stop
Content-Type: application/json

{
  "orgId": "uuid"
}
```

### Get Status
```http
GET /api/simulator/status/:orgId
```

## Performance Metrics

Documented benchmarks and optimization targets:

- **Event Generation**: 10,000 events/second
- **CPF Conversion**: 1,000 assessments/second
- **Dashboard Update Latency**: <100ms
- **Memory Usage**: ~1MB per 1000 events
- **CPU Usage**: <10% idle, <50% under load

## Troubleshooting Guide

Common issues with solutions:

### All Indicators Turn Red
- **Cause**: Baseline too high, no decay
- **Solution**: Reduce baselines, implement time decay

### Dashboard Not Updating
- **Cause**: WebSocket disconnection
- **Solution**: Check network, verify server running

### Slow Performance
- **Cause**: Too high event rate
- **Solution**: Reduce rate parameter, batch events

### Indicators Not Triggered
- **Cause**: Event-to-indicator mapping missing
- **Solution**: Update EVENT_BASELINE matrix

## Best Practices

### Production Deployment
1. Start with low event rates (1-3/sec)
2. Establish 30-day baseline before alerting
3. Tune thresholds per organization
4. Implement time decay
5. Monitor convergence indicators closely

### Testing
1. Use "normal" scenario for baseline
2. Test attack scenarios in isolated environment
3. Validate Bayesian calculations manually
4. Compare with known incidents

### Monitoring
1. Track event generation rate
2. Monitor CPF conversion latency
3. Alert on convergent states
4. Log all high-risk indicators

## Related Documentation

### Theoretical Foundation
- **Dense Foundation Paper**: `/foundation docs/core/en-US/`
- **Original CPF Paper**: Project root
- **Implementation Schemas**: `/cpf-soc-integration/implementation/`

### Code Documentation
- **Adapters**: `../adapters/README.md`
- **Generators**: `../generators/README.md`
- **Connectors**: `../connectors/README.md`
- **Configuration**: `../config/README.md`

### Operational Guides
- **Dashboard**: `/dashboard/soc/README.md`
- **Simulator Dashboard**: `../README.md` (main)

## Contributing

To improve documentation:

1. Submit corrections via PR
2. Add clarifying examples
3. Expand troubleshooting section
4. Include real-world case studies

## Feedback

For questions or suggestions:
- Open GitHub issue
- Email: g.canale@cpf3.org

## Version History

- **v1.0** (2025): Initial comprehensive documentation

## License

MIT License - See project root LICENSE file
