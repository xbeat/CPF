# CPF Detection Engine

**Real psychological vulnerability detection from organizational behavior data**

This is the **correct implementation** of the Cybersecurity Psychology Framework detection system, based on the Dense Foundation Paper's mathematical framework.

## The Paradigm Shift

### ❌ What We DON'T Do (Old Simulator Approach)
```
Generate labeled event "phishing"
    ↓
Map to indicator via hardcoded rules
    ↓
Indicator 1.1 = red
    ↓
Result: Circular validation - of course it maps there
```

### ✅ What We DO (Detection-Based Approach)
```
Generate REALISTIC organizational data (unlabeled)
├─ 50,000 emails/day (normal business)
├─ 5,000 auth events/hour
├─ 1,000 alerts/day
└─ HIDDEN: 0.1% contain statistical anomalies

    ↓

Apply DETECTION ALGORITHMS (from Dense Paper)
├─ Indicator 1.1: Cr > μ + 2σ (authority compliance)
├─ Indicator 5.1: Fa = 1 - investigated/presented (alert fatigue)
└─ ... 98 more indicators

    ↓

DISCOVER hidden psychological vulnerabilities
"Alert: Compliance rate 3σ above baseline (95% vs 72%)"
"Alert: 90% of alerts ignored - fatigue detected"
```

**Key Insight:** Attacks hide in normal data. We must FIND them, not label them.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  1. DATA GENERATOR                                       │
│     Realistic organizational behavior                    │
│     Volume: 10K-100K events/day per org                 │
│     Hidden signals: 0.1% contain vulnerabilities        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│  2. TIMESCALE DB (Time-Series Storage)                   │
│     Raw events + Ground truth                            │
│     Retention: 90 days hot, 1 year total                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│  3. BASELINE CALIBRATOR                                  │
│     30-day learning period                               │
│     Calculate μ, σ, Σ for each indicator                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│  4. DETECTION ENGINE                                     │
│     100 indicators (Di = w1·Ri + w2·Ai + w3·Ci)         │
│     Bayesian network for interdependencies              │
│     Convergence detection (Perfect Storm, etc.)         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│  5. VALIDATION                                           │
│     Ground truth comparison                              │
│     MCC, precision, recall metrics                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│  6. CPF MATRIX OUTPUT (to SOC Dashboard)                │
│     100 indicators [0,1] with confidence                │
│     Drill-down to raw events                            │
└─────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- 8GB RAM minimum

### 1. Install Dependencies
```bash
npm install
```

### 2. Start TimescaleDB
```bash
docker-compose up -d
```

### 3. Initialize Database
```bash
npm run db:init
```

### 4. Run Proof-of-Concept (Indicator 1.1)
```bash
npm run poc:indicator-1-1
```

This will:
1. Generate 1 day of realistic email data (50K events)
2. Inject 50 hidden authority compliance signals
3. Run Indicator 1.1 detection algorithm
4. Validate against ground truth
5. Print MCC, precision, recall metrics

Expected output:
```
✓ Generated 50,000 emails (50 contain hidden signals)
✓ Ingested to TimescaleDB
✓ Running Indicator 1.1 detection...

Validation Results:
  MCC: 0.85 (Good)
  Precision: 92.0% (4 false alarms)
  Recall: 88.0% (6 missed signals)
  F1 Score: 0.90
  Status: ✓ PASSED
```

---

## Project Structure

```
cpf-detection-engine/
├── data-generator/           # Realistic data generation
│   ├── generators/
│   │   ├── email-generator.js    # 50K emails/day
│   │   ├── auth-generator.js     # 5K auths/hour
│   │   ├── alert-generator.js    # 1K alerts/day
│   │   └── ticket-generator.js   # 500 tickets/day
│   ├── signal-injector.js        # Hide signals in data
│   └── ground-truth-manager.js   # Track what we injected
│
├── storage/                  # TimescaleDB
│   ├── schema/               # 6 SQL schema files
│   └── ingestion/            # Batch ingest pipeline
│
├── baseline-calibrator/      # 30-day learning
│   ├── calibrator.js
│   └── statistical-models.js
│
├── detection-engine/         # 100 indicators
│   ├── orchestrator.js       # Runs all indicators
│   ├── indicators/           # Individual detectors
│   │   ├── indicator-1-1.js  # Unquestioning Compliance
│   │   └── ... (99 more)
│   ├── bayesian-network/     # Interdependencies
│   └── convergence/          # Perfect Storm detection
│
├── validation/               # Ground truth testing
│   ├── validator.js
│   └── metrics.js            # MCC, precision, recall
│
└── api/                      # REST API + WebSocket
    └── server.js
```

---

## Development Roadmap

### Phase 1: Proof-of-Concept (Current)
- ✅ Project structure
- 🔄 Indicator 1.1 implementation
- ⏳ TimescaleDB setup
- ⏳ Email data generator
- ⏳ Validation framework

### Phase 2: Core Indicators (Week 2-3)
- Implement 10 pilot indicators (from guide section 10.3)
- Baseline calibration engine
- Bayesian network foundation

### Phase 3: Full System (Month 2-3)
- All 100 indicators
- Complete Bayesian network
- Convergence detection
- Production-ready API

### Phase 4: Integration (Month 4)
- Connect to existing SOC dashboard
- Real organizational data
- 30-day baseline calibration

---

## Key Differences from Old Simulator

| Aspect | Old Simulator | This (Detection Engine) |
|--------|--------------|-------------------------|
| **Input** | Labeled events | Unlabeled realistic traffic |
| **Volume** | 10-100 events/sec | 50K-200K events/day |
| **Signals** | Explicit ("phishing") | Hidden (statistical anomalies) |
| **Detection** | Hardcoded mapping | Statistical + ML algorithms |
| **Storage** | Aggregated JSON | Raw time-series DB |
| **Baseline** | Hardcoded values | 30-day calibration per org |
| **Validation** | None | Ground truth + MCC metrics |
| **Temporal** | No decay | Exponential decay (τ models) |

---

## References

- **Implementation Guide**: `/dashboard/CPF_PRACTICAL_IMPLEMENTATION_GUIDE.md` (4,108 lines)
- **Dense Foundation Paper**: `/CPF_Implementation_Companion___Dense_Foundation_Paper.pdf`
- **Old Simulator** (deprecated): `/dashboard/simulator/`

---

## License

MIT

## Contact

For questions about this implementation:
- See `/dashboard/CPF_PRACTICAL_IMPLEMENTATION_GUIDE.md` sections 8-10
- Review Dense Paper mathematical formulations
