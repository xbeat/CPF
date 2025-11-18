# Detection Engine Tests

Suite di test per il detection engine CPF.

## Struttura

```
tests/
├── README.md                # Questa guida
├── unit/                    # Unit tests (pianificato)
│   ├── indicator-1-1.test.js
│   └── ...
├── integration/             # Integration tests (pianificato)
│   └── detection-flow.test.js
└── e2e/                     # End-to-end tests
    ├── poc-in-memory.js     # POC in-memory (no DB)
    └── poc-indicator-1-1.js # POC completo con TimescaleDB
```

## End-to-End Tests

### `poc-in-memory.js`

Proof-of-concept senza database, usando dati in memoria.

**Status**: ✅ Implementato

**Funzionalità:**
- Genera dataset sintetico in memoria
- Inietta segnali nascosti
- Esegue detection algorithm
- Valida vs ground truth
- Calcola MCC metrics

**Utilizzo:**
```bash
node tests/e2e/poc-in-memory.js

# Output:
# ✓ Generated 1,000 email events
# ✓ Injected 10 compliance signals (1.0%)
# ✓ Baseline: mean=0.72, stddev=0.08
# ✓ Running detection...
# ✓ Detected: 9/10 signals
# ✓ False positives: 1
# ✓ MCC: 0.87
# ✓ Precision: 90.0%
# ✓ Recall: 90.0%
# ✓ Status: PASSED
```

**Vantaggi:**
- Veloce (< 1 sec)
- No setup database
- Ideale per sviluppo rapido

### `poc-indicator-1-1.js`

Proof-of-concept completo con TimescaleDB.

**Status**: ✅ Implementato

**Funzionalità:**
- Genera 50K eventi email
- Ingest a TimescaleDB
- Calibra baseline (30 giorni)
- Esegue detection
- Valida vs ground truth

**Utilizzo:**
```bash
# Setup DB first
docker-compose up -d
node storage/migrations/init.js

# Run POC
node tests/e2e/poc-indicator-1-1.js

# Output:
# ✓ Connected to TimescaleDB
# ✓ Generating 50,000 email events...
# ✓ Injected 50 compliance signals (0.1%)
# ✓ Ingesting to database...
# ✓ Calibrating baseline (30 days)...
# ✓ Baseline: mean=0.72, stddev=0.08, samples=50000
# ✓ Running detection for day 31...
# ✓ Detected: 45/50 signals
# ✓ False positives: 4
# ✓ MCC: 0.85
# ✓ Precision: 91.8%
# ✓ Recall: 90.0%
# ✓ F1 Score: 0.909
# ✓ Status: PASSED
```

**Vantaggi:**
- Test realistico completo
- Valida tutto il pipeline
- Performance measurement

## Unit Tests (Pianificati)

### Struttura Test

```javascript
// tests/unit/indicator-1-1.test.js
const { expect } = require('chai');
const Indicator11 = require('../../detection-engine/indicators/indicator-1-1');

describe('Indicator 1.1: Unquestioning Compliance', () => {
  let detector;

  beforeEach(() => {
    detector = new Indicator11({
      min_sample_size: 100,
      sigma_threshold: 2.0
    });
  });

  describe('calculateMetric', () => {
    it('should calculate compliance rate correctly', () => {
      const events = [
        { clicked_approve: true },
        { clicked_approve: true },
        { clicked_approve: false },
      ];

      const rate = detector.calculateMetric(events);
      expect(rate).to.equal(0.67);  // 2/3
    });

    it('should handle empty events', () => {
      const rate = detector.calculateMetric([]);
      expect(rate).to.equal(0);
    });
  });

  describe('detectAnomaly', () => {
    it('should detect when metric > μ + 2σ', () => {
      const baseline = { mean: 0.72, stddev: 0.08, threshold: 2.0 };
      const detected = detector.detectAnomaly(0.95, baseline);

      expect(detected).to.be.true;  // 0.95 > 0.72 + 2*0.08 = 0.88
    });

    it('should not detect when metric within 2σ', () => {
      const baseline = { mean: 0.72, stddev: 0.08, threshold: 2.0 };
      const detected = detector.detectAnomaly(0.80, baseline);

      expect(detected).to.be.false;  // 0.80 < 0.88
    });
  });

  describe('sigmaDistance', () => {
    it('should calculate correct sigma distance', () => {
      const baseline = { mean: 0.72, stddev: 0.08 };
      const sigma = detector.sigmaDistance(0.88, baseline);

      expect(sigma).to.equal(2.0);  // (0.88 - 0.72) / 0.08 = 2.0
    });
  });

  describe('calculateConfidence', () => {
    it('should return 1.0 when sample size sufficient', () => {
      const confidence = detector.calculateConfidence(1000);
      expect(confidence).to.equal(1.0);
    });

    it('should return proportional when sample size insufficient', () => {
      const confidence = detector.calculateConfidence(500);
      expect(confidence).to.equal(0.5);  // 500/1000
    });
  });
});
```

### Esecuzione

```bash
# Run all unit tests
npm test

# Run specific test
npm test -- --grep "Indicator 1.1"

# Coverage report
npm run test:coverage
```

## Integration Tests (Pianificati)

### Detection Flow

```javascript
// tests/integration/detection-flow.test.js
describe('Detection Flow Integration', () => {
  it('should complete full detection pipeline', async () => {
    // 1. Generate data
    const events = await generator.generate(50000);

    // 2. Ingest to DB
    await db.bulkInsert('raw_email_events', events);

    // 3. Calibrate baseline
    const baseline = await calibrator.calibrate('1.1');

    // 4. Run detection
    const results = await detector.run('org-001', '2025-11-18');

    // 5. Validate
    expect(results.detected).to.be.true;
    expect(results.score).to.be.above(0.80);
  });
});
```

## Test Data

### Fixture Data

```javascript
// tests/fixtures/email-events.json
[
  {
    "timestamp": "2025-11-18T10:30:00Z",
    "sender": "ceo@company.com",
    "sender_authority_level": "executive",
    "clicked_approve": true,
    "time_to_action": 15  // Fast compliance
  },
  // ... altri eventi
]
```

### Mock Database

```javascript
// tests/mocks/db-mock.js
class MockTimescaleClient {
  constructor() {
    this.data = [];
  }

  async bulkInsert(table, rows) {
    this.data.push(...rows);
  }

  async query(sql, params) {
    // Return mock data
    return this.data.filter(/* ... */);
  }
}
```

## Performance Benchmarks

```javascript
// tests/benchmarks/detection-performance.js
describe('Detection Performance', () => {
  it('should detect in < 3 seconds for 50K events', async () => {
    const start = Date.now();
    await detector.run('org-001', '2025-11-18');
    const duration = Date.now() - start;

    expect(duration).to.be.below(3000);  // < 3 sec
  });

  it('should handle 100 indicators in < 10 minutes', async () => {
    const start = Date.now();
    await orchestrator.runAll('org-001');
    const duration = Date.now() - start;

    expect(duration).to.be.below(600000);  // < 10 min
  });
});
```

## Continuous Integration

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      timescaledb:
        image: timescale/timescaledb:latest-pg14
        ports:
          - 5432:5432
        env:
          POSTGRES_PASSWORD: password

    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'

      - run: npm install
      - run: node storage/migrations/init.js
      - run: npm test
      - run: npm run test:e2e
```

## Metriche di Successo

### Unit Tests
- ✅ Coverage > 80%
- ✅ Tutti i test passano
- ✅ Esecuzione < 5 sec

### Integration Tests
- ✅ Full pipeline funzionante
- ✅ Database operations OK
- ✅ Esecuzione < 30 sec

### E2E Tests
- ✅ MCC > 0.80
- ✅ Precision > 90%
- ✅ Recall > 85%
- ✅ Detection < 3 sec/indicatore

## Riferimenti

- **Detection Engine**: `/dashboard/cpf-detection-engine/README.md`
- **Indicators**: `/dashboard/cpf-detection-engine/detection-engine/indicators/README.md`
- **Validation**: `/dashboard/cpf-detection-engine/validation/README.md`
