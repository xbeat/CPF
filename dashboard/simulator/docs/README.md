# Simulator Documentation

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
