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
Documentazione tecnica avanzata per il simulatore SIEM CPF.

## Contenuto

### `CPF_SIEM_Integration_Theory_to_Practice.md`

Guida completa dall'implementazione teorica a quella pratica dell'integrazione SIEM-CPF.

**Sezioni:**
1. **Fondamenti Teorici**
   - Modello psicologico CPF
   - Mapping eventi → vulnerabilità
   - Framework Bayesiano

2. **Architettura Implementativa**
   - Design patterns
   - Component architecture
   - Data flow
   - Integration points

3. **Event Processing Pipeline**
   - Event ingestion
   - Normalization
   - CPF transformation
   - Indicator calculation
   - Bayesian inference

4. **Connector Implementation**
   - Base connector pattern
   - Platform-specific adapters
   - Authentication strategies
   - Error handling
   - Rate limiting

5. **Scenario Simulation**
   - Event generation
   - Scenario modeling
   - Attack patterns
   - Crisis simulation
   - Custom scenarios

6. **Bayesian Scoring**
   - Score calculation formulas
   - Context adjustment
   - Confidence modeling
   - Time decay
   - Convergence detection

7. **Performance & Scalability**
   - Throughput optimization
   - Memory management
   - Event batching
   - Async processing

8. **Testing & Validation**
   - Unit testing strategies
   - Integration testing
   - Scenario validation
   - Performance benchmarks

9. **Deployment Guide**
   - Environment setup
   - Configuration
   - Monitoring
   - Troubleshooting

10. **Case Studies**
    - Real-world implementations
    - Lessons learned
    - Best practices

## Utilizzo Documentazione

### Per Sviluppatori

```bash
# Leggere guida completa
cat dashboard/simulator/docs/CPF_SIEM_Integration_Theory_to_Practice.md

# Sezioni specifiche
grep -A 50 "## Event Processing Pipeline" CPF_SIEM_Integration_Theory_to_Practice.md
```

### Per Integratori

La documentazione fornisce:
- Template per nuovi connettori
- Pattern di integrazione testati
- Esempi di codice completi
- Checklist deployment

### Per Ricercatori

Contiene:
- Fondamenti matematici
- Modelli Bayesiani
- Validazione empirica
- Metriche performance

## Temi Principali

### 1. Event-to-Indicator Mapping

```
SIEM Event → CPF Adapter → Indicator Updates
     ↓              ↓              ↓
  Event Type   Baseline Lookup  Bayesian Score
  Severity     Context Adjust   Confidence
  Metadata     Scenario Mult    Time Decay
```

**Documentazione dettagliata:**
- Sezione 3: Event Processing Pipeline
- Sezione 6: Bayesian Scoring
- Esempi pratici con 40+ event types

### 2. Connector Architecture

```
┌───────────────────────────────────────┐
│  Base Connector (Abstract)            │
│  - connect()                          │
│  - sendEvent()                        │
│  - fetchEvents()                      │
│  - healthCheck()                      │
└───────────────┬───────────────────────┘
                │
        ┌───────┴───────┬──────────┐
        ↓               ↓          ↓
    Splunk         QRadar      Sentinel
   Connector      Connector    Connector
```

**Documentazione dettagliata:**
- Sezione 4: Connector Implementation
- Template e pattern
- Best practices autenticazione

### 3. Scenario Modeling

```
Normal → Attack → Crisis
  10      25       50     eventi/sec
  ↓       ↓        ↓
Low     Medium   High   severity bias
  ↓       ↓        ↓
Green   Yellow    Red    indicator colors
```

**Documentazione dettagliata:**
- Sezione 5: Scenario Simulation
- Pre-built scenarios
- Custom scenario creation

### 4. Bayesian Inference

```
Score = BaseRisk × ContextFactor × ScenarioMult
         ↓             ↓              ↓
    Event Baseline   Time Context   Attack/Crisis
    User Pattern     Geo Location   Convergence
    Severity         MFA/Device     Media Pressure
```

**Documentazione dettagliata:**
- Sezione 6: Bayesian Scoring
- Formule matematiche
- Parameter tuning

## Diagrammi e Visualizzazioni

La documentazione include:

### Diagrammi di Flusso
- Event processing pipeline
- Connector architecture
- Bayesian calculation flow
- Scenario state machine

### Diagrammi di Sequenza
- Event ingestion → indicator update
- Multi-connector simulation
- Error handling e retry
- WebSocket real-time updates

### Diagrammi di Classe
- Connector hierarchy
- Adapter pattern
- Generator classes
- Storage abstraction

## Code Examples

### Event Processing

```javascript
// Esempio completo da doc
const event = await connector.fetchEvent();
const normalized = normalizer.normalize(event);
const indicators = adapter.mapToIndicators(normalized);

for (const indicator of indicators) {
  const score = bayesian.calculateScore(
    indicator.baseValue,
    event.context,
    scenario.multiplier
  );

  await storage.saveIndicator(
    orgId,
    indicator.id,
    score,
    confidence
  );

  websocket.emit('indicator_update', {
    orgId,
    indicatorId: indicator.id,
    score,
    timestamp: Date.now()
  });
}
```

### Connector Implementation

```javascript
// Template da documentazione
class MyConnector extends BaseConnector {
  async connect(config) {
    this.client = await createClient(config);
    this.authenticated = await this.authenticate();
  }

  async sendEvent(event) {
    const formatted = this.formatEvent(event);
    return await this.client.send(formatted);
  }

  async fetchEvents(query, timeRange) {
    const results = await this.client.query(query);
    return results.map(r => this.normalizeEvent(r));
  }
}
```

## Formule Matematiche

La documentazione include tutte le formule utilizzate:

### Bayesian Score
```
S = Sbase × Fcontext × Mscenario

dove:
Sbase = EVENT_BASELINE[type][indicator]
Fcontext = 1.0 + Σ(contextFactors)
Mscenario = 1.0 (normal) | 1.3 (attack) | 1.5 (crisis)
```

### Confidence
```
C = min(1.0, Cdata × Ctime × Cpattern)

dove:
Cdata = 1.0 - (age_hours / 168)  # Decay 1 settimana
Ctime = eventCount / expectedCount
Cpattern = correlationStrength
```

### Overall Risk
```
R = Σ(Ci × Wi × Si) / Σ(Wi)

dove:
Ci = Category i risk
Wi = Category i weight
Si = Category i confidence
```

## Best Practices

### Performance
- Batch eventi (100-1000)
- Async processing
- Connection pooling
- Memory management

### Reliability
- Retry logic (exponential backoff)
- Circuit breaker pattern
- Health checks
- Graceful degradation

### Security
- Credential storage
- API key rotation
- SSL/TLS enforcement
- Rate limiting

### Testing
- Unit tests (>80% coverage)
- Integration tests
- Load testing
- Scenario validation

## Troubleshooting Guide

La documentazione include sezioni troubleshooting per:

### Problemi Comuni
- Connection failures
- Authentication errors
- Rate limiting
- Memory leaks
- Slow performance

### Debug Tools
- Logging configuration
- Event tracing
- Performance profiling
- Network monitoring

## Aggiornamenti

**Versione**: 1.0
**Ultima Revisione**: 2025-11-18

### Changelog
- v1.0 (2025-11-18): Documentazione iniziale completa
- Future: aggiunte sezioni ML/AI prediction

## Riferimenti Esterni

- **CPF Framework**: https://cpf3.org
- **Simulatore**: `/dashboard/simulator/README.md`
- **Connectors**: `/dashboard/simulator/connectors/README.md`
- **Detection Engine**: `/dashboard/cpf-detection-engine/README.md`
- **Dense Foundation Paper**: `/CPF_Implementation_Companion___Dense_Foundation_Paper.pdf`

## Contribuire

Per contribuire alla documentazione:

1. Fork repository
2. Migliora sezioni esistenti o aggiungi nuove
3. Aggiungi esempi pratici
4. Valida codice esempi
5. Submit pull request

## Feedback

Per feedback sulla documentazione:
- Issues GitHub
- Email maintainers
- Discussion forum
