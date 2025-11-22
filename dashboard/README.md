# CPF Dashboard System - Complete Guide

## 📦 Overview

Sistema unificato di dashboard per il **CPF** (Cognitive Persuasion Framework), che fornisce:

- **Dashboard SOC** - Analisi SOC/SIEM + Bayesian Cross-Indicator Analysis
- **SOC Simulator** - Generazione realistica di eventi SIEM per testing
- **Detection Engine** - Motore di rilevamento basato su algoritmi statistici
- **Dashboard Auditing** - Field Kit Progress Tracking + Risk Analysis
- **Client Field Kit v3** - Client di assessment refactorizzato (ES6+)
- **Certificate Generator** - Generatore certificati PDF (Python + Node.js)
- **RESTful API** - Backend services con WebSocket real-time
- **Multi-Storage** - Supporto JSON, SQLite, PostgreSQL (configurabile via .env)

## 📁 Struttura Repository

```
dashboard/
├── README.md                    # Questa guida
├── server.js                    # Server unificato Node.js + WebSocket
├── package.json                 # Dipendenze NPM
├── start.sh                     # Script di avvio server
├── index.html                   # Dashboard principale
│
├── soc/                         # Dashboard SOC/SIEM
│   ├── index.html               # Interfaccia dashboard SOC
│   ├── dashboard.js             # Logica dashboard
│   ├── bayesian.js              # Bayesian inference engine
│   ├── visualizations.js        # Grafici e visualizzazioni
│   ├── category-descriptions.json
│   └── documentation/           # Documentazione tecnica
│       └── CPF_SOC_SIEM_Integration_Comprehensive_Paper.html
│
├── simulator/                   # Simulatore SIEM
│   ├── README.md                # Logica e funzionamento
│   ├── index.html               # Interfaccia simulatore
│   ├── simulator-dashboard.js   # Dashboard simulatore
│   ├── connectors/              # Connettori SIEM (12+)
│   │   ├── base-connector.js
│   │   ├── splunk-connector.js
│   │   ├── qradar-connector.js
│   │   ├── sentinel-connector.js
│   │   ├── elastic-connector.js
│   │   ├── crowdstrike-connector.js
│   │   └── ... (8+ altri)
│   ├── adapters/                # Adattatori CPF
│   │   ├── cpf-adapter.js       # Conversione eventi → indicatori
│   │   └── event-baseline.js    # Baseline matrix (40+ eventi)
│   ├── generators/              # Generatori eventi
│   │   ├── siem-data-generator.js
│   │   ├── scenario-engine.js
│   │   └── dense-loader.js
│   ├── config/                  # Configurazioni
│   │   ├── sources.json
│   │   └── scenarios.json
│   └── docs/                    # Documentazione
│
├── cpf-detection-engine/        # Detection Engine (NEW paradigm)
│   ├── README.md                # Architettura detection-based
│   ├── CPF_PRACTICAL_IMPLEMENTATION_GUIDE.md  # 4,108 righe
│   ├── docker-compose.yml       # TimescaleDB setup
│   ├── package.json
│   ├── data-generator/          # Generazione dati realistici
│   │   └── generators/
│   │       └── email-generator.js
│   ├── detection-engine/        # 100 indicatori
│   │   └── indicators/
│   │       └── indicator-1-1.js
│   └── config/
│       └── indicators-config.json
│
├── auditing/                    # Dashboard Auditing
│   ├── index.html               # Interfaccia auditing
│   ├── dashboard.js             # Logica dashboard
│   ├── client-integrated.js     # Client Field Kit v2
│   ├── client-integrated.css
│   ├── styles.css
│   ├── reference_guide_*.json   # Guide di riferimento (IT/EN)
│   ├── category-descriptions.json
│   ├── client-v3/               # Client Field Kit v3 (refactored)
│   │   ├── README.md            # Guida completa v3
│   │   ├── README-PYTHON.md     # Setup backend Python
│   │   ├── index.html           # Test standalone
│   │   ├── client-integrated.js # ES6+ refactored (33% meno codice)
│   │   ├── test-runner.html     # Test UI (50+ tests)
│   │   ├── test-suite.js        # Suite di test
│   │   ├── run-tests-simple.js  # Test runner Node.js
│   │   └── run-tests.js
│   └── scripts/                 # Script utility
│       ├── validate-fieldkit.js
│       └── README.md
│
├── shared/                      # Componenti condivisi
│   ├── ui-utils.js              # Utility UI
│   ├── styles.css               # Stili globali
│   └── README.md
│
├── certificate/                 # Generatore Certificati
│   ├── README.md                # Guida completa
│   ├── cert-gen.py              # Versione Python
│   ├── cert-gen.js              # Versione Node.js
│   ├── requirements.txt         # Dipendenze Python
│   ├── package.json             # Dipendenze Node.js
│   └── logo_cpf3.png            # Logo CPF3
│
├── lib/                         # Librerie core
│   └── dataManager.js           # Data management module
│
├── scripts/                     # Script utility
│   ├── batch_import.js          # Import batch Field Kit exports
│   ├── generate_synthetic_data.js
│   ├── generate_field_kit_assessments.js
│   ├── generate_demo_organizations.js
│   ├── validate-and-fix-indicators.js
│   └── README.md
│
├── data/                        # Dati applicazione
│   ├── organizations.json       # Dati organizzazioni
│   ├── auditing_results.json    # Risultati assessment
│   ├── README.md
│   ├── QUICK_START.md
│   └── schemas/                 # Schema JSON
│       ├── organization_data_schema.json
│       └── organization_index_schema.json
│
├── postgres/                    # PostgreSQL
│   ├── README.md
│   ├── DATABASE_SETUP.md        # Setup database
│   ├── QUICK_START.md           # Guida rapida
│   ├── db_schema.sql            # Schema database
│   └── db_seed_demo.js          # Seed data
│
├── docs/                        # Documentazione
│   ├── USER_GUIDE.html
│   ├── API_DOCUMENTATION.md
│   ├── INTEGRATION.md
│   └── papers/                  # Paper accademici
│       ├── Bayesian_Cross_Indicator_Inference...pdf
│       └── Bayesian_Cross_Indicator_Inference...tex
│
├── CPF Dashboard.app/           # Launcher macOS
│   └── Contents/                # App bundle
└── APP_LAUNCHER_README.md       # Guida launcher
```

> **Note**: I dati di assessment (JSON indicators) si trovano in `/auditor field kit/interactive/`. Vedi la documentazione principale del repository per dettagli.

---

## 🚀 Quick Start

### 1. Installazione Dipendenze

```bash
cd /path/to/CPF
npm install
```

Questo installerà:
- `express` - Web server framework
- `cors` - Cross-origin resource sharing
- `socket.io` - WebSocket real-time
- Altre dipendenze per simulatore e API

### 2. Avvio Server

```bash
npm start
# oppure
node server.js
# oppure
./dashboard/start.sh
```

Il server si avvierà su **http://localhost:3000**

---

## ⚙️ Configurazione Storage

Il sistema supporta **3 tipi di storage** configurabili tramite file `.env`:

### 1. JSON (Default) - File-based

```bash
# Crea .env copiando .env.example
cp dashboard/.env.example dashboard/.env

# Imposta storage type
DATABASE_TYPE=json
```

**Caratteristiche**:
- ✅ Zero configurazione
- ✅ Massima portabilità
- ✅ Ideale per sviluppo e demo
- ⚠️ Limitato a single-user
- File: `dashboard/data/organizations/*.json`

### 2. SQLite - Database locale

```bash
# In .env
DATABASE_TYPE=sqlite
```

**Caratteristiche**:
- ✅ Setup automatico
- ✅ Performance eccellente
- ✅ Transazioni ACID
- ✅ Ideale per produzione piccola/media
- File: `dashboard/data/cpf_dashboard.sqlite`

### 3. PostgreSQL - Enterprise database

```bash
# Setup database PostgreSQL prima
sudo -u postgres psql
CREATE DATABASE cpf_dashboard;
CREATE USER cpf_user WITH ENCRYPTED PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE cpf_dashboard TO cpf_user;
\q

# In .env
DATABASE_TYPE=postgres
DATABASE_URL="postgresql://cpf_user:password@localhost:5432/cpf_dashboard"
```

**Caratteristiche**:
- ✅ Enterprise-grade
- ✅ Multi-user concurrency
- ✅ Scalabilità orizzontale
- ✅ Ideale per produzione enterprise
- ⚠️ Richiede installazione PostgreSQL

**📚 Guida completa**: Vedi `/dashboard/data/README.md` per dettagli su setup, migrazione, e confronto storage.

---

## 🌐 Dashboard e Interfacce

### Dashboard Principali

| URL | Descrizione |
|-----|-------------|
| `http://localhost:3000/` | Main dashboard (selezione moduli) |
| `http://localhost:3000/dashboard/soc/` | **Dashboard SOC** - Analisi Bayesiana multi-org |
| `http://localhost:3000/dashboard/simulator/` | **Simulatore SIEM** - Generazione eventi real-time |
| `http://localhost:3000/dashboard/auditing/` | **Dashboard Auditing** - Progress + Risk Analysis |
| `http://localhost:3000/dashboard/auditing/client-v3/` | **Field Kit Client v3** - Assessment tool (standalone) |

### Testing & Sviluppo

| URL | Descrizione |
|-----|-------------|
| `http://localhost:3000/dashboard/auditing/client-v3/test-runner.html` | Test suite Client v3 (50+ tests) |
| `http://localhost:3000/dashboard/soc/documentation/` | Documentazione SOC/SIEM |

---

## 🔌 API Endpoints

### Gestione Organizzazioni

| Method | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/api/organizations` | Lista organizzazioni |
| POST | `/api/organizations` | Crea nuova organizzazione |
| PUT | `/api/organizations/:id` | Aggiorna organizzazione |
| DELETE | `/api/organizations/:id` | Elimina organizzazione (soft delete) |
| GET | `/api/organizations/trash` | Lista organizzazioni eliminate |
| POST | `/api/organizations/:id/restore` | Ripristina da trash |

### Dashboard Auditing

| Method | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/api/auditing-results` | Risultati assessment |
| GET | `/api/list-exports` | Lista Field Kit export files |
| POST | `/api/batch-import` | Import batch Field Kit exports |
| POST | `/api/generate-synthetic` | Genera assessment sintetici |

### Simulatore SOC

| Method | Endpoint | Descrizione |
|--------|----------|-------------|
| POST | `/api/simulator/start` | Avvia simulatore SIEM |
| POST | `/api/simulator/stop` | Ferma simulatore |
| GET | `/api/simulator/status` | Stato simulatore |
| GET | `/api/soc-data/:orgId` | Dati SOC organizzazione |

### WebSocket Events

| Event | Direzione | Payload |
|-------|-----------|---------|
| `indicator_update` | Server → Client | `{ orgId, indicatorId, value, timestamp }` |
| `simulator_event` | Server → Client | `{ orgId, event, indicators }` |
| `organization_updated` | Server → Client | `{ orgId, action }` |

---

## 📊 Workflow Completi

### Workflow A: Dashboard SOC + Simulatore SIEM

**Scenario**: Testare analisi Bayesiana con dati SIEM sintetici

1. **Avvia il server:**
   ```bash
   node server.js
   ```

2. **Apri Dashboard SOC:**
   ```
   http://localhost:3000/dashboard/soc/
   ```

3. **Crea un'organizzazione:**
   - Click su "New Organization"
   - Compila i dati (nome, settore, paese, etc.)
   - Salva

4. **Avvia il simulatore:**
   - Apri `http://localhost:3000/dashboard/simulator/`
   - Seleziona l'organizzazione
   - Scegli sorgenti SIEM (es. Splunk, QRadar, Sentinel)
   - Imposta scenario (normal, attack, crisis)
   - Click "Start Simulator"

5. **Osserva aggiornamenti real-time:**
   - Torna alla Dashboard SOC
   - Gli indicatori si aggiorneranno in tempo reale via WebSocket
   - Matrice 10×10 mostra coverage e livelli rischio

### Workflow B: Dashboard Auditing con Field Kit

**Scenario**: Tracciare progresso assessment umani

1. **Genera assessment sintetici:**
   ```bash
   node dashboard/scripts/generate_field_kit_assessments.js
   ```
   Crea 100 file in `/field_kit_exports/`

2. **Import batch:**
   ```bash
   node dashboard/scripts/batch_import.js field_kit_exports
   ```

3. **Visualizza risultati:**
   ```
   http://localhost:3000/dashboard/auditing/
   ```
   - **Tab Progress**: Completion % e grid 10×10
   - **Tab Risk Analysis**: Bayesian risk scores, heatmap, prioritization

### Workflow C: Client Field Kit v3 (Standalone)

**Scenario**: Eseguire assessment manuale per un indicatore

1. **Apri Client v3:**
   ```
   http://localhost:3000/dashboard/auditing/client-v3/
   ```

2. **Carica un indicatore:**
   - Click "Load Test Indicator (9.1)"
   - Oppure carica JSON custom

3. **Compila assessment:**
   - Metadata (auditor, client, date)
   - Rispondi alle domande
   - Il punteggio si calcola automaticamente

4. **Esporta dati:**
   - Click "Export Data" → scarica JSON
   - Importabile dalla Dashboard Auditing

5. **Test automatici:**
   ```bash
   # Test Node.js
   cd dashboard/auditing/client-v3
   node run-tests-simple.js

   # Test browser
   http://localhost:3000/dashboard/auditing/client-v3/test-runner.html
   ```

### Workflow D: PostgreSQL Database

**Scenario**: Persistenza dati su database

1. **Setup database:**
   ```bash
   psql -U postgres -f dashboard/postgres/db_schema.sql
   ```

2. **Seed dati demo:**
   ```bash
   node dashboard/postgres/db_seed_demo.js
   ```

3. **Configura connessione:**
   Edita `server.js` o `.env` con credenziali PostgreSQL

4. **Verifica:**
   Le dashboard useranno automaticamente PostgreSQL invece di JSON files

### Workflow E: Detection Engine (Paradigma Nuovo)

**Scenario**: Rilevamento vulnerabilità da dati realistici

1. **Setup TimescaleDB:**
   ```bash
   cd dashboard/cpf-detection-engine
   docker-compose up -d
   npm install
   npm run db:init
   ```

2. **Proof-of-Concept Indicator 1.1:**
   ```bash
   npm run poc:indicator-1-1
   ```

3. **Output atteso:**
   - 50K email generate
   - 50 segnali nascosti iniettati
   - Detection algorithm trova anomalie
   - Metriche: MCC, precision, recall

4. **Differenza con Simulatore:**
   - **Simulatore**: eventi etichettati → mapping deterministico
   - **Detection Engine**: dati realistici → algoritmi statistici

---

## 🎯 Componenti Principali

### 1. Dashboard SOC (`/dashboard/soc/`)

**Analisi Bayesiana Multi-Organizzazione**

Funzionalità:
- **Sidebar organizzazioni** - Gestione multi-org con search/sort
- **Overall Risk Score** - Aggregato Bayesiano pesato
- **Category Heatmap** - 10 categorie CPF con risk levels
- **Security Radar Chart** - Visualizzazione ragnatela
- **Prioritization Matrix** - Ordinamento per priorità remediation
- **Convergence Chart** - SOC vs Human assessment timeline
- **Indicator Matrix 10×10** - Click per drill-down
- **Export** - PDF e Excel per reporting
- **Real-time updates** - WebSocket per aggiornamenti live
- **Trash management** - Soft delete con restore

Tecnologie:
- `bayesian.js` - Motore inferenza Bayesiana
- `visualizations.js` - Chart.js wrapper
- `dashboard.js` - Logica UI e gestione stato
- Socket.IO - Real-time communication

### 2. Simulatore SIEM (`/dashboard/simulator/`)

**Generazione Eventi SIEM Realistici**

Funzionalità:
- **12+ connettori SIEM** - Splunk, QRadar, Sentinel, Elastic, CrowdStrike, etc.
- **40+ tipi evento** - Authentication, phishing, privilege escalation, etc.
- **Scenario engine** - Normal, Attack, Crisis, Custom
- **CPF Adapter** - Conversione eventi → 100 indicatori CPF
- **Event Baseline Matrix** - Mapping deterministico evento→indicatore
- **Bayesian Context** - Time, pattern, user, geo adjustments
- **Rate control** - Eventi/sec configurabile
- **Real-time stream** - WebSocket push verso Dashboard SOC

Componenti:
- `connectors/` - Adattatori per ogni SIEM vendor
- `adapters/cpf-adapter.js` - Logica conversione CPF
- `generators/` - Generatori evento + scenario
- `config/` - Sources e scenarios JSON

Problemi noti (vedi `/dashboard/simulator/README.md`):
- ⚠️ Baseline troppo alti → saturazione rapida
- ⚠️ Manca time decay → score solo crescono
- ⚠️ Event rate troppo alto → tutti rossi in 1-2 min
- ✅ Soluzioni proposte documentate

### 3. Detection Engine (`/dashboard/cpf-detection-engine/`)

**Paradigma Detection-Based (Nuovo Approccio)**

Differenza filosofica:
```
❌ Simulatore (vecchio):
   Evento "phishing" → map to indicator 1.1 → rosso
   (Circolare: ovvio che mappa lì)

✅ Detection Engine (nuovo):
   50K email normali + 0.1% anomalie nascoste
   → Algoritmi statistici (μ, σ, Bayesian)
   → SCOPRE vulnerabilità senza label
```

Architettura:
1. **Data Generator** - 50K-200K eventi/giorno realistici
2. **TimescaleDB** - Time-series storage
3. **Baseline Calibrator** - 30 giorni learning (μ, σ, Σ)
4. **Detection Engine** - 100 algoritmi (uno per indicatore)
5. **Validation** - Ground truth comparison (MCC metrics)
6. **Output** - CPF Matrix 10×10 con confidence

Status:
- ✅ Architettura definita
- 🔄 POC Indicator 1.1 in corso
- ⏳ TimescaleDB setup
- ⏳ Email generator

### 4. Dashboard Auditing (`/dashboard/auditing/`)

**Progress Tracking + Risk Analysis**

Due tab:

**Tab 1: Progress Tracking**
- Overall completion % (0-100%)
- Category progress bars
- Indicator grid 10×10 (verde=completato, grigio=mancante)
- Missing indicators list

**Tab 2: Risk Analysis**
- Overall Risk Score - Bayesian merged
- Category Heatmap - Visual risk levels
- Prioritization Matrix - Ordinamento remediation
- Convergence Chart - SOC vs Human timeline
- Indicator Grid - 100 tile con drill-down

Integrazione:
- Field Kit exports (JSON)
- Batch import automatico
- API REST per CRUD

### 5. Client Field Kit v3 (`/dashboard/auditing/client-v3/`)

**Assessment Tool Refactorizzato ES6+**

Miglioramenti vs v2:
- ✅ ES6+ classes (no IIFE wrapper)
- ✅ 33% meno codice (1350 vs 2000 righe)
- ✅ Zero duplicazione
- ✅ 100% compatibilità v2 API
- ✅ 21 test automatici (100% passing)
- ✅ Architettura modulare (8 classes)

Classi:
1. `AssessmentManager` - Core data + auto-save
2. `ScoreCalculator` - Bayesian scoring
3. `FieldKitRenderer` - HTML generation
4. `ScoreDisplay` - Score visualization
5. `ReportGenerator` - PDF export
6. `APIClient` - HTTP requests
7. `QuickReferenceManager` - Reference modal
8. `FileManager` - Import/export JSON

Testing:
```bash
# Test Node.js (quick)
node run-tests-simple.js
# ✅ 21/21 tests passed

# Test browser (completo)
http://localhost:8000/test-runner.html
# ✅ 50+ tests
```

### 6. Certificate Generator (`/dashboard/certificate/`)

**Generazione Certificati PDF**

Due versioni identiche:
- **Python** (`cert-gen.py`) - ReportLab
- **Node.js** (`cert-gen.js`) - PDFKit

Features:
- Pattern esagonale sfondo
- Intestazione con box colorato
- Sezioni progetto + timestamping
- QR code integrato
- Logo personalizzabile
- Layout A4 professionale

Utilizzo:
```bash
# Python
cd dashboard/certificate
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python cert-gen.py

# Node.js
npm install
node cert-gen.js
```

---

## 📁 File Dati e Formati

### File/Database generati (dipende da storage)

| Storage Type | Location | Descrizione |
|--------------|----------|-------------|
| **JSON** | `/dashboard/data/organizations_index.json` | Indice organizzazioni |
| **JSON** | `/dashboard/data/organizations/org-{id}.json` | Dati org completi |
| **JSON** | `/dashboard/data/organizations/{name}-soc.json` | Dati SOC (opzionale) |
| **JSON** | `/dashboard/data/trash/` | Soft-deleted organizations |
| **JSON** | `/dashboard/data/history/` | Assessment versioning |
| **JSON** | `/dashboard/data/audit_log.json` | Audit log eventi |
| **SQLite** | `/dashboard/data/cpf_dashboard.sqlite` | Database SQLite (tutto in 1 file) |
| **PostgreSQL** | Database remoto | Tabelle: organizations, assessments |
| **Legacy** | `/field_kit_exports/dashboard_export_*.json` | Export Field Kit (deprecati) |

### Formati Dati

**Organization Data:**
```json
{
  "id": "org-001",
  "name": "ACME Corporation",
  "industry": "Technology",
  "size": "enterprise",
  "country": "US",
  "language": "en-US",
  "sede_sociale": "123 Main St, New York, NY",
  "partita_iva": "IT12345678901",
  "indicators": {
    "1.1": {
      "soc_values": [...],
      "human_values": [...],
      "current_bayesian": 0.45,
      "confidence": 0.85,
      "last_updated": "2025-11-18T10:30:00Z"
    }
  },
  "created_at": "2025-11-01T09:00:00Z",
  "updated_at": "2025-11-18T10:30:00Z"
}
```

**Field Kit Export:**
```json
{
  "organization_id": "org-001",
  "organization_name": "ACME Corporation",
  "indicator_id": "1.3",
  "indicator_data": {
    "soc_values": [],
    "human_values": [{
      "timestamp": "2025-11-10T10:30:00Z",
      "value": 0.68,
      "assessor": "Jane Smith",
      "assessment_id": "fk-1234567890-13"
    }],
    "current_bayesian": 0.68,
    "last_updated": "2025-11-10T10:30:00Z"
  },
  "metadata": {
    "exported_from": "field_kit",
    "export_timestamp": "2025-11-10T10:30:00Z",
    "field_kit_version": "3.0"
  }
}
```

**SOC Event (Simulator):**
```json
{
  "timestamp": "2025-11-18T10:30:45Z",
  "source": "splunk",
  "event_type": "phishing_clicked",
  "severity": "medium",
  "user": "john.doe@acme.com",
  "context": {
    "after_hours": false,
    "mfa_verified": true,
    "privileged_user": false
  },
  "indicators_triggered": ["1.1", "1.3", "3.2", "5.1"],
  "scores": {
    "1.1": 0.72,
    "1.3": 0.65,
    "3.2": 0.58,
    "5.1": 0.81
  }
}
```

---

## 🔧 Script Utility

Tutti gli script manuali rimangono funzionali:

```bash
# Genera organizations.json sintetico
node dashboard/scripts/generate_synthetic_data.js

# Genera 100 Field Kit assessment exports
node dashboard/scripts/generate_field_kit_assessments.js

# Import batch di Field Kit exports
node dashboard/scripts/batch_import.js field_kit_exports

# Genera organizzazioni demo per testing
node dashboard/scripts/generate_demo_organizations.js

# Valida e correggi indicatori
node dashboard/scripts/validate-and-fix-indicators.js
```

---

## 🛠️ Analisi Bayesiana

Il sistema utilizza un sofisticato motore di inferenza Bayesiana (`soc/bayesian.js` e `shared/`) che implementa:

### 1. Merge SOC + Human Data
```javascript
// SOC values pesati per confidence
// Human assessments pesati 1.5× (più affidabili)
bayesian_score = (SOC × confidence + Human × 1.5) / (confidence + 1.5)
```

### 2. Category Risk Calculation
- Aggrega 10 indicatori per categoria (10 categorie × 10 indicatori = 100 totali)
- Calcola media, varianza, e confidence
- Applica pesi differenziati per categoria

### 3. Bayesian Network Inference
Dipendenze cross-categoria:
- **Authority** risk alto → aumenta **Social** risk (+30%)
- **Stress** risk alto → aumenta **Cognitive** risk (+25%)
- **AI-Enhanced** risk alto → amplifica **Unconscious** bias (+20%)
- Modello completo con 45+ dipendenze documentate

### 4. Overall Risk Score
Combinazione pesata delle 10 categorie:
```
Overall Risk = Σ(Category_Risk × Category_Weight)

Pesi:
- Authority: 12%
- AI-Enhanced: 12%
- Stress: 11%
- Affective: 10%
- Cognitive: 10%
- Social: 10%
- Unconscious: 9%
- Temporal: 9%
- Group: 9%
- Convergent: 8%
```

### 5. Prioritization Matrix
```
Priority Score = (Risk × Weight) + (Downstream_Impact × 0.1)

Raccomandazioni:
- Priority > 0.70 → 🔴 Critical (azione immediata)
- Priority 0.40-0.70 → 🟡 Review (pianifica remediation)
- Priority < 0.40 → 🟢 Monitor (osserva trend)
```

---

## 🔐 Note di Sicurezza

- Server in ascolto su `localhost:3000` di default (non esposto esternamente)
- CORS abilitato per sviluppo locale
- Nessuna autenticazione richiesta (solo uso locale)
- Validazione path file per prevenire directory traversal
- Soft delete per organizzazioni (30 giorni trash retention)
- WebSocket con rate limiting per prevenire DoS

**Per uso in produzione:**
- Abilita HTTPS
- Implementa autenticazione (JWT, OAuth)
- Configura CORS restrittivo
- Usa PostgreSQL invece di JSON files
- Abilita logging e monitoring

---

## 🐛 Troubleshooting

### "Failed to load data. Run batch import first."

**Soluzione:** Genera dati prima:
```bash
node dashboard/scripts/generate_field_kit_assessments.js
node dashboard/scripts/batch_import.js field_kit_exports
```

### "Batch Import Failed - Folder not found"

**Soluzione:** Verifica che `/field_kit_exports/` esista e contenga file `dashboard_export_*.json`.

### "Port 3000 already in use"

**Soluzione:** Cambia porta in `server.js`:
```javascript
const PORT = 3001; // Cambia qui
```

Oppure termina il processo esistente:
```bash
# Linux/macOS
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <pid> /F
```

### "WebSocket connection failed"

**Soluzione:**
1. Verifica che Socket.IO sia installato: `npm install socket.io`
2. Controlla firewall/antivirus
3. Prova con browser diverso
4. Controlla console browser per errori

### "Charts non si visualizzano"

**Soluzione:**
1. Refresh pagina (Ctrl+Shift+R)
2. Cambia tab e ritorna
3. Verifica Chart.js sia caricato: controlla console
4. Controlla che ci siano dati da visualizzare

### "Simulatore: tutti indicatori rossi in 1-2 minuti"

**Problema noto** - Vedi `/dashboard/simulator/README.md` per dettagli

**Soluzione temporanea:**
- Riduci event rate a 2-3 eventi/sec
- Ferma e riavvia simulatore periodicamente

**Soluzione permanente (pianificata):**
- Implementazione time decay
- Riduzione baseline values
- Indicator cooldown

### "Client v3: test falliscono"

**Soluzione:**
```bash
cd dashboard/auditing/client-v3

# Verifica sintassi
node -c client-integrated.js

# Re-run tests
node run-tests-simple.js

# Se persistono errori, controlla versione Node
node --version  # Richiede Node 14+
```

### "PostgreSQL connection error"

**Soluzione:**
1. Verifica PostgreSQL in esecuzione:
   ```bash
   sudo systemctl status postgresql
   ```

2. Controlla variabili `.env`:
   ```bash
   DATABASE_TYPE=postgres
   DATABASE_URL="postgresql://user:pass@localhost:5432/cpf_dashboard"
   ```

3. Testa connessione:
   ```bash
   psql $DATABASE_URL -c "\dt"
   ```

4. Verifica tabelle create (auto-create al primo avvio):
   ```bash
   psql $DATABASE_URL -c "SELECT count(*) FROM organizations;"
   ```

### "Wrong storage type / Data not found"

**Problema**: Cambiato `DATABASE_TYPE` ma dati non visibili

**Soluzione:**
1. Verifica `.env`:
   ```bash
   cat dashboard/.env | grep DATABASE_TYPE
   ```

2. Se cambiato storage, esegui migrazione:
   ```bash
   # Da JSON a SQLite
   node dashboard/scripts/migrate_json_to_sqlite.js

   # Da SQLite a PostgreSQL
   node dashboard/scripts/migrate_sqlite_to_postgres.js
   ```

3. Oppure ripopola dati con seed:
   ```bash
   node dashboard/scripts/generate_demo_organizations.js
   ```

### "SQLite database is locked"

**Problema**: Errore "database is locked" con SQLite

**Soluzione:**
1. Chiudi tutti i processi che accedono al DB:
   ```bash
   lsof dashboard/data/cpf_dashboard.sqlite
   kill <pid>
   ```

2. SQLite ha concorrenza limitata - considera PostgreSQL per multi-user

### "Certificate Generator: errore font/logo"

**Python:**
```bash
# Reinstalla dipendenze
pip install --upgrade reportlab qrcode[pil] Pillow

# Verifica logo esiste
ls -la dashboard/certificate/logo_cpf3.png
```

**Node.js:**
```bash
# Reinstalla dipendenze
cd dashboard/certificate
rm -rf node_modules package-lock.json
npm install

# Verifica percorso logo corretto
```

### "Detection Engine: TimescaleDB non si avvia"

**Soluzione:**
```bash
cd dashboard/cpf-detection-engine

# Verifica Docker in esecuzione
docker ps

# Restart container
docker-compose down
docker-compose up -d

# Check logs
docker-compose logs -f timescaledb

# Verifica connessione
docker exec -it <container-id> psql -U postgres
```

---

## 📚 Risorse e Documentazione

### Documentazione Principale

| Risorsa | Percorso | Descrizione |
|---------|----------|-------------|
| **CPF Framework** | https://cpf3.org | Sito ufficiale |
| **Implementation Guide** | `/dashboard/cpf-detection-engine/CPF_PRACTICAL_IMPLEMENTATION_GUIDE.md` | 4,108 righe - guida completa |
| **Dense Foundation Paper** | `/CPF_Implementation_Companion___Dense_Foundation_Paper.pdf` | Fondamenti matematici |
| **SOC Integration Paper** | `/dashboard/soc/documentation/CPF_SOC_SIEM_Integration_Comprehensive_Paper.html` | Integrazione SOC/SIEM |
| **Bayesian Paper** | `/dashboard/docs/papers/Bayesian_Cross_Indicator_Inference...pdf` | Paper accademico |

### Documentazione Componenti

| Componente | README | Descrizione |
|------------|--------|-------------|
| **Simulatore SIEM** | `/dashboard/simulator/README.md` | Logica, problemi noti, soluzioni |
| **Detection Engine** | `/dashboard/cpf-detection-engine/README.md` | Architettura detection-based |
| **Client v3** | `/dashboard/auditing/client-v3/README.md` | Guida completa refactoring |
| **Client v3 Python** | `/dashboard/auditing/client-v3/README-PYTHON.md` | Setup backend Python |
| **Certificate Gen** | `/dashboard/certificate/README.md` | Generazione certificati PDF |
| **Data Storage** | `/dashboard/data/README.md` | **Multi-Storage: JSON, SQLite, PostgreSQL** |
| **Data Schemas** | `/dashboard/data/schemas/README.md` | JSON Schema validazione |
| **PostgreSQL Legacy** | `/dashboard/postgres/README.md` | Setup PostgreSQL (legacy - vedi data/) |
| **Scripts** | `/dashboard/scripts/README.md` | Script utility |
| **Shared** | `/dashboard/shared/README.md` | Componenti condivisi |
| **Lib** | `/dashboard/lib/README.md` | Storage adapters e data manager |

### File Chiave

| File | Descrizione |
|------|-------------|
| `/dashboard/server.js` | Server unificato con API e WebSocket |
| `/dashboard/config.js` | **Configurazione storage (JSON/SQLite/PostgreSQL)** |
| `/dashboard/lib/dataManager.js` | Data manager principal (legacy JSON) |
| `/dashboard/lib/db_json.js` | **Storage adapter JSON** |
| `/dashboard/lib/db_sqlite.js` | **Storage adapter SQLite** |
| `/dashboard/lib/db_postgres.js` | **Storage adapter PostgreSQL** |
| `/dashboard/soc/bayesian.js` | Motore inferenza Bayesiana |
| `/dashboard/soc/visualizations.js` | Libreria chart e visualizzazioni |
| `/dashboard/simulator/adapters/cpf-adapter.js` | Conversione eventi → indicatori |
| `/dashboard/simulator/adapters/event-baseline.js` | Matrix 40+ eventi baseline |
| `/dashboard/data/schemas/organization_data_schema.json` | JSON Schema organizzazioni |
| `/dashboard/data/schemas/organization_index_schema.json` | JSON Schema indice |

### API e Integrazioni

| Risorsa | Percorso |
|---------|----------|
| **API Documentation** | `/dashboard/docs/API_DOCUMENTATION.md` |
| **Integration Guide** | `/dashboard/docs/INTEGRATION.md` |
| **User Guide** | `/dashboard/docs/USER_GUIDE.html` |

---

## 🎓 Note di Sviluppo

### Aggiungere Nuovi Indicatori

1. **Crea JSON indicator:**
   ```bash
   /auditor field kit/interactive/{lang}/{cat}.x-{name}/
   ```

2. **Segui schema:**
   Vedi `/auditor field kit/interactive/README.md`

3. **Template di riferimento:**
   Usa indicator 1.3 come template

4. **Valida JSON:**
   ```bash
   node dashboard/scripts/validate-and-fix-indicators.js
   ```

### Modificare Pesi Bayesiani

**Location:** `/dashboard/soc/bayesian.js`

```javascript
const CATEGORY_WEIGHTS = {
  authority: 0.12,    // Modifica qui
  ai_enhanced: 0.12,
  stress: 0.11,
  // ... altri
};
```

**Dipendenze Cross-Categoria:**
```javascript
const CATEGORY_DEPENDENCIES = {
  authority: {
    social: 0.30,      // Authority → Social (+30%)
    cognitive: 0.15,
    // ...
  },
  // ...
};
```

### Personalizzare Stili Dashboard

**Stili globali:** `/dashboard/shared/styles.css`
```css
:root {
  --primary: #3b82f6;
  --secondary: #8b5cf6;
  --accent: #ec4899;
  /* Modifica colori qui */
}
```

**Stili specifici:**
- SOC: `/dashboard/auditing/styles.css`
- Auditing: `/dashboard/auditing/styles.css`
- Client v3: `/dashboard/auditing/client-v3/client-integrated.css`

### Aggiungere Nuovo Connettore SIEM

1. **Crea file:**
   ```bash
   /dashboard/simulator/connectors/mycustom-connector.js
   ```

2. **Estendi BaseConnector:**
   ```javascript
   const BaseConnector = require('./base-connector');

   class MyCustomConnector extends BaseConnector {
     constructor() {
       super('mycustom', 'MyCustom SIEM');
     }

     async connect() { /* ... */ }
     async fetchEvents() { /* ... */ }
   }
   ```

3. **Registra in config:**
   ```json
   // /dashboard/simulator/config/sources.json
   {
     "mycustom": {
       "name": "MyCustom SIEM",
       "endpoint": "https://api.mycustom.com"
     }
   }
   ```

---

## ✨ Novità e Roadmap

### ✅ Completato (Novembre 2025)

- **Dashboard SOC v1.0** - Analisi Bayesiana multi-org completa
- **Simulatore SIEM** - 12+ connettori, 40+ eventi
- **Client Field Kit v3** - Refactoring ES6+ con test automatici
- **Certificate Generator** - Python + Node.js
- **WebSocket Real-time** - Aggiornamenti live indicatori
- **Trash Management** - Soft delete con restore
- **Export** - PDF e Excel reporting

### 🔄 In Corso

- **Detection Engine** - POC Indicator 1.1
- **TimescaleDB** - Setup e integrazione
- **Simulatore Fixes** - Time decay, baseline adjustment, cooldown

### ⏳ Pianificato (Q1 2026)

- **Detection Engine** - 10 indicatori pilota
- **Baseline Calibrator** - Learning period 30 giorni
- **Bayesian Network** - Implementazione completa dipendenze
- **Production Deployment** - HTTPS, auth, monitoring
- **Mobile Dashboard** - Responsive design
- **API v2** - GraphQL endpoint

### 🚀 Roadmap Lungo Termine

- **100 Indicatori** - Detection algorithms completi
- **Machine Learning** - Auto-tuning baseline
- **Multi-tenancy** - Supporto multi-organization con isolamento
- **Advanced Analytics** - Predictive modeling
- **Integration Plugins** - Connector marketplace

---

## 📝 Licenza

Parte del progetto **CPF** (Cognitive Persuasion Framework).

© 2025 CPF Team - Tutti i diritti riservati.

---

## 🤝 Supporto e Contributi

### Hai un Problema?

1. **Controlla Troubleshooting** - Sezione sopra
2. **Controlla Logs:**
   ```bash
   # Server logs
   tail -f /tmp/server.log

   # Browser console
   F12 → Console
   ```
3. **Verifica File Structure:**
   ```bash
   ls -la dashboard/data/
   ls -la field_kit_exports/
   ```

### Vuoi Contribuire?

1. **Fork repository**
2. **Crea feature branch:**
   ```bash
   git checkout -b feature/my-feature
   ```
3. **Scrivi test** (per Client v3)
4. **Commit con messaggi chiari:**
   ```bash
   git commit -m "Add: feature description"
   ```
5. **Push e crea Pull Request**

### Contatti

- **Issues:** GitHub Issues
- **Documentazione:** Vedi sezione Risorse sopra
- **CPF Framework:** https://cpf3.org

---

## 🎯 Quick Reference

### Avvio Rapido (1 minuto)
```bash
cd /path/to/CPF
npm install
npm start
# Apri http://localhost:3000
```

### Testing Rapido (3 minuti)
```bash
# Dashboard SOC
http://localhost:3000/dashboard/soc/
# → Crea org → Avvia simulatore → Osserva real-time

# Client v3 Test
cd dashboard/auditing/client-v3
node run-tests-simple.js
# → ✅ 21/21 tests passed
```

### Workflow Completo (15 minuti)
```bash
# 1. Setup
npm install
npm start

# 2. Genera dati
node dashboard/scripts/generate_field_kit_assessments.js
node dashboard/scripts/batch_import.js field_kit_exports

# 3. Dashboard
http://localhost:3000/dashboard/soc/        # SOC
http://localhost:3000/dashboard/auditing/   # Auditing
http://localhost:3000/dashboard/simulator/  # Simulator
```

---

**Buon lavoro con CPF Dashboard! 🎉**

Per domande o supporto, consulta la documentazione completa nelle cartelle dei singoli componenti.
