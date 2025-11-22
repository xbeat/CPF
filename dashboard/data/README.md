# CPF Data Storage - Multi-Storage Architecture

Sistema di storage flessibile che supporta **3 modalità di persistenza dati** configurabili:
- **JSON** - File-based storage (massima portabilità)
- **SQLite** - Database locale leggero (bilanciamento performance/portabilità)
- **PostgreSQL** - Database enterprise (scalabilità e produzione)

---

## ⚙️ Configurazione Storage

### Variabile d'Ambiente

Il tipo di storage si configura nel file `.env`:

```bash
# Crea .env copiando .env.example
cp dashboard/.env.example dashboard/.env

# Imposta il tipo di storage (json | sqlite | postgres)
DATABASE_TYPE=json
```

**Opzioni disponibili:**
- `json` - **Default** - Nessuna configurazione aggiuntiva richiesta
- `sqlite` - Database SQLite locale (file `data/cpf_dashboard.sqlite`)
- `postgres` - PostgreSQL remoto (richiede `DATABASE_URL`)

### Configurazione PostgreSQL

Se `DATABASE_TYPE=postgres`, imposta anche:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/cpf_db"
```

---

## 📁 Storage Mode: JSON

### Struttura Cartelle

```
/dashboard/data/
├── organizations_index.json          # Indice di tutte le organizzazioni
├── organizations/                    # Dati completi per ogni organizzazione
│   ├── org-demo-001.json
│   ├── org-demo-002.json
│   ├── techcorp-global-soc.json     # File SOC (opzionale)
│   └── ...
├── trash/                            # Organizzazioni eliminate (soft delete)
├── history/                          # Versioning assessments
├── audit_log.json                    # Log audit eventi
└── schemas/                          # Schema di riferimento
    ├── organization_index_schema.json
    └── organization_data_schema.json
```

---

## 📋 File: `organizations_index.json`

**Scopo**: Indice rapido di tutte le organizzazioni con metadati essenziali.

### Struttura:

```json
{
  "metadata": {
    "version": "2.0",
    "last_updated": "2025-01-11T15:30:00Z",
    "total_organizations": 5
  },
  "organizations": [
    {
      "id": "org-demo-001",
      "name": "TechCorp Global",
      "industry": "Technology",
      "size": "enterprise",
      "country": "US",
      "language": "en-US",
      "created_at": "2025-01-11T10:00:00Z",
      "updated_at": "2025-01-11T15:30:00Z",
      "stats": {
        "total_assessments": 45,
        "completion_percentage": 45.0,
        "overall_risk": 0.6543,
        "avg_confidence": 0.8234,
        "last_assessment_date": "2025-01-10T14:20:00Z"
      }
    }
  ]
}
```

### Campi:

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `id` | string | ID univoco organizzazione (es. org-demo-001) |
| `name` | string | Nome organizzazione |
| `industry` | string | Settore (Technology, Finance, Healthcare, Retail, Education, Manufacturing, Government) |
| `size` | string | Dimensione (small, medium, enterprise) |
| `country` | string | Codice ISO 3166-1 alpha-2 (IT, US, GB, etc.) |
| `language` | string | Lingua organizzazione (en-US, it-IT, etc.) |
| `created_at` | ISO 8601 | Data creazione |
| `updated_at` | ISO 8601 | Ultimo aggiornamento |
| `stats.total_assessments` | number | Numero di schede compilate |
| `stats.completion_percentage` | number | Percentuale completamento (0-100) |
| `stats.overall_risk` | number | Risk score complessivo (0.0-1.0) |
| `stats.avg_confidence` | number | Confidence media (0.0-1.0) |
| `stats.last_assessment_date` | ISO 8601 | Data ultima valutazione |

---

## 📄 File: `organizations/org-{id}.json`

**Scopo**: Dati completi di una singola organizzazione (anagrafica + tutte le schede + aggregati).

### Struttura:

```json
{
  "id": "org-demo-001",
  "name": "TechCorp Global",
  "metadata": {
    "industry": "Technology",
    "size": "enterprise",
    "country": "US",
    "language": "en-US",
    "created_at": "2025-01-11T10:00:00Z",
    "updated_at": "2025-01-11T15:30:00Z",
    "created_by": "Alice Johnson",
    "notes": "Enterprise tech company, high digital maturity"
  },
  "assessments": {
    "1.1": {
      "indicator_id": "1.1",
      "title": "Unquestioning Compliance with Apparent Authority",
      "category": "Authority-Based Vulnerabilities",
      "bayesian_score": 0.6543,
      "confidence": 0.8500,
      "maturity_level": "yellow",
      "assessor": "Alice Johnson",
      "assessment_date": "2025-01-10T14:20:00Z",
      "raw_data": {
        "quick_assessment": [
          {
            "question_id": "q1",
            "question": "Does your organization have a formal policy...",
            "answer": "option_b",
            "weight": 0.25
          }
        ],
        "client_conversation": {
          "notes": "Company has policies but enforcement is inconsistent",
          "red_flags_identified": 2,
          "red_flags": [
            "Staff unaware of procedures",
            "Management oversight gaps"
          ]
        },
        "timestamp": "2025-01-10T14:20:00Z"
      }
    },
    "1.2": { ... },
    "2.3": { ... }
  },
  "aggregates": {
    "overall_risk": 0.6543,
    "overall_confidence": 0.8234,
    "trend": "improving",
    "by_category": {
      "1": {
        "category_name": "Authority-Based Vulnerabilities",
        "avg_score": 0.6123,
        "avg_confidence": 0.8456,
        "total_assessments": 7,
        "completion_percentage": 70.0
      },
      "2": { ... },
      "3": { ... }
    },
    "completion": {
      "total_indicators": 100,
      "assessed_indicators": 45,
      "percentage": 45.0,
      "missing_indicators": ["1.3", "1.4", "1.8", ...]
    },
    "last_calculated": "2025-01-11T15:30:00Z"
  }
}
```

### Sezioni:

#### 1. **Metadata**
Anagrafica organizzazione e informazioni base.

#### 2. **Assessments**
Dizionario con chiave = indicator_id (es. "1.1", "2.5").

**Campi assessment:**
- `indicator_id`: ID indicatore (1.1 - 10.10)
- `title`: Titolo indicatore
- `category`: Categoria indicatore
- `bayesian_score`: Score Bayesiano (0.0 = low risk, 1.0 = high risk)
- `confidence`: Livello di confidenza (0.0 - 1.0)
- `maturity_level`: green, yellow, red
- `assessor`: Nome valutatore
- `assessment_date`: Data valutazione
- `raw_data`: Dati completi form (Quick Assessment + Conversation)

#### 3. **Aggregates**
Statistiche calcolate automaticamente:

- **overall_risk**: Score medio di tutti gli assessments
- **overall_confidence**: Confidence media
- **trend**: improving, stable, deteriorating
- **by_category**: Statistiche per ogni categoria (1-10)
- **completion**: Tracciamento completamento (100 indicatori totali)

---

---

## 💾 Storage Mode: SQLite

### Descrizione

SQLite è un database SQL leggero, serverless, self-contained ideale per:
- Sviluppo locale
- Deployment semplici
- Performance migliori di JSON per query complesse
- Transazioni ACID garantite

### File Database

```
/dashboard/data/
└── cpf_dashboard.sqlite              # Database SQLite (creato automaticamente)
```

### Schema Tabelle

#### **organizations**
```sql
CREATE TABLE organizations (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  size VARCHAR(50),
  country VARCHAR(2),
  language VARCHAR(10),
  notes TEXT,
  partita_iva VARCHAR(50),
  sede_sociale VARCHAR(255),
  created_by VARCHAR(255),
  is_deleted BOOLEAN DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### **assessments**
```sql
CREATE TABLE assessments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  org_id VARCHAR(50) NOT NULL,
  indicator_id VARCHAR(10) NOT NULL,
  title TEXT,
  category VARCHAR(100),
  maturity_level VARCHAR(20),
  bayesian_score DECIMAL(5, 4),
  confidence DECIMAL(5, 4),
  assessor VARCHAR(255),
  assessment_date TIMESTAMP,
  raw_data TEXT,                        -- JSON serializzato
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE,
  UNIQUE(org_id, indicator_id)
);
```

### Setup

1. **Imposta `.env`**:
   ```bash
   DATABASE_TYPE=sqlite
   ```

2. **Avvia server**: Il database viene creato automaticamente al primo avvio
   ```bash
   npm start
   ```

3. **Verifica database**:
   ```bash
   sqlite3 dashboard/data/cpf_dashboard.sqlite "SELECT count(*) FROM organizations;"
   ```

---

## 🐘 Storage Mode: PostgreSQL

### Descrizione

PostgreSQL è un database relazionale enterprise-grade ideale per:
- Ambienti di produzione
- Multi-tenancy e scalabilità
- Backup e replica avanzati
- Concorrenza e transazioni complesse

### Configurazione

1. **Installa PostgreSQL** (se non presente):
   ```bash
   # Ubuntu/Debian
   sudo apt install postgresql postgresql-contrib

   # macOS
   brew install postgresql
   brew services start postgresql
   ```

2. **Crea database**:
   ```bash
   sudo -u postgres psql
   CREATE DATABASE cpf_dashboard;
   CREATE USER cpf_user WITH ENCRYPTED PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE cpf_dashboard TO cpf_user;
   \q
   ```

3. **Imposta `.env`**:
   ```bash
   DATABASE_TYPE=postgres
   DATABASE_URL="postgresql://cpf_user:secure_password@localhost:5432/cpf_dashboard"
   ```

4. **Avvia server**: Le tabelle vengono create automaticamente
   ```bash
   npm start
   ```

### Schema Tabelle

#### **organizations**
```sql
CREATE TABLE organizations (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  size VARCHAR(50),
  country VARCHAR(2),
  language VARCHAR(10),
  created_by VARCHAR(255),
  notes TEXT,
  sede_sociale TEXT,
  partita_iva VARCHAR(50),
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

#### **assessments**
```sql
CREATE TABLE assessments (
  id SERIAL PRIMARY KEY,
  org_id VARCHAR(50) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  indicator_id VARCHAR(10) NOT NULL,
  title TEXT,
  category VARCHAR(100),
  maturity_level VARCHAR(20),
  bayesian_score DECIMAL(5, 4),
  confidence DECIMAL(5, 4),
  assessor VARCHAR(255),
  assessment_date TIMESTAMPTZ,
  raw_data JSONB,                       -- Tipo nativo JSONB
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(org_id, indicator_id)
);
```

### Verifica Setup

```bash
# Connessione al database
psql postgresql://cpf_user:secure_password@localhost:5432/cpf_dashboard

# Lista tabelle
\dt

# Conta organizzazioni
SELECT count(*) FROM organizations;

# Esci
\q
```

---

## 🔄 Workflow Dati

### 1. Creazione Nuova Organizzazione (da Dashboard)

```
User → Dashboard → Click "Crea Organizzazione"
  ↓
  Inserisce: nome, industry, size, country, lingua
  ↓
  Sistema:
  1. Genera nuovo ID (org-demo-XXX)
  2. Fetch tutti i 100 indicatori da GitHub (nella lingua scelta)
  3. Salva snapshot indicatori in indicators_metadata (se implementato)
  4. Crea file organizations/org-demo-XXX.json con assessments vuoti
  5. Aggiorna organizations_index.json
```

### 2. Compilazione Scheda (da Client Auditing)

```
User → Client → Seleziona org + indicatore
  ↓
  Compila form (Quick Assessment + Conversation)
  ↓
  Click "Calculate Score"
  ↓
  Sistema:
  1. Calcola bayesian_score
  2. Salva in organizations/org-{id}.json → assessments[indicator_id]
  3. Ricalcola aggregates (overall_risk, by_category, completion)
  4. Aggiorna organizations_index.json → stats
  5. Aggiorna updated_at
```

### 3. Visualizzazione Dashboard

```
Dashboard → Load organizations_index.json
  ↓
  Mostra griglia organizzazioni con stats
  ↓
  User clicca su org
  ↓
  Load organizations/org-{id}.json
  ↓
  Mostra Progress + Risk Analysis
```

---

## 🔧 API Endpoints (server.js)

```javascript
// Gestione organizzazioni
GET    /api/organizations                    → organizations_index.json
GET    /api/organizations/:orgId             → organizations/org-{id}.json
POST   /api/organizations                    → Crea nuova org
PUT    /api/organizations/:orgId             → Aggiorna org metadata
DELETE /api/organizations/:orgId             → Elimina org

// Gestione assessments
GET    /api/organizations/:orgId/assessments              → Tutti assessments
GET    /api/organizations/:orgId/assessments/:indicatorId → Assessment specifico
POST   /api/organizations/:orgId/assessments              → Salva assessment
PUT    /api/organizations/:orgId/assessments/:indicatorId → Aggiorna assessment
DELETE /api/organizations/:orgId/assessments/:indicatorId → Elimina assessment

// Aggregati e statistiche
GET    /api/organizations/:orgId/aggregates  → Aggregati calcolati
GET    /api/organizations/:orgId/missing     → Indicatori mancanti
POST   /api/organizations/:orgId/recalculate → Ricalcola aggregati

// Import da GitHub (quando si crea org)
POST   /api/organizations/:orgId/fetch-indicators → Fetch 100 indicatori da GitHub
```

---

## 📊 Calcolo Aggregati (Bayesian Engine)

Quando si salva un assessment, il sistema deve ricalcolare:

### 1. Overall Risk
```javascript
overall_risk = AVG(tutti i bayesian_score degli assessments)
```

### 2. By Category
```javascript
by_category[X].avg_score = AVG(assessments da X.1 a X.10)
by_category[X].completion_percentage = COUNT(assessments X.*) / 10 * 100
```

### 3. Completion
```javascript
completion.assessed_indicators = COUNT(assessments)
completion.percentage = assessed_indicators / 100 * 100
completion.missing_indicators = [tutti gli ID da 1.1 a 10.10 non presenti]
```

### 4. Trend (opzionale, se tracciamo storico)
```javascript
// Confronta overall_risk con calcolo precedente
if (overall_risk < previous_overall_risk) trend = "improving"
else if (overall_risk > previous_overall_risk) trend = "deteriorating"
else trend = "stable"
```

---

---

## 📊 Confronto Storage Types

| Caratteristica | JSON | SQLite | PostgreSQL |
|----------------|------|--------|------------|
| **Setup** | ✅ Zero config | ✅ Automatico | ⚠️ Richiede installazione |
| **Portabilità** | ✅ Copia cartella | ✅ File singolo | ⚠️ Dump/Restore |
| **Performance (< 10 org)** | ✅ Veloce | ✅ Molto veloce | ⚠️ Overhead network |
| **Performance (> 100 org)** | ❌ Degrada | ✅ Ottimo | ✅ Eccellente |
| **Concorrenza** | ❌ Single-user | ⚠️ Limitata | ✅ Multi-user |
| **Transazioni ACID** | ❌ No | ✅ Sì | ✅ Sì |
| **Query complesse** | ❌ Parsing manuale | ✅ SQL completo | ✅ SQL avanzato + JSONB |
| **Backup** | ✅ Copia file | ✅ Copia file | ✅ pg_dump + replica |
| **Debug** | ✅ Human-readable | ⚠️ SQL tools | ⚠️ SQL tools |
| **Git tracking** | ✅ Sì | ❌ File binario | ❌ N/A |
| **Scaling** | ❌ Singola macchina | ❌ Singola macchina | ✅ Horizontal scaling |
| **Best for** | Dev/Demo | Dev/Prod piccole | Prod enterprise |

---

## ✅ Vantaggi per Storage Type

### JSON
- ✅ Zero configurazione
- ✅ Massima portabilità
- ✅ Debug facile (human-readable)
- ✅ Git versioning
- ✅ Cross-platform

### SQLite
- ✅ Setup automatico
- ✅ Performance eccellente
- ✅ Transazioni ACID
- ✅ SQL query standard
- ✅ File singolo portabile
- ✅ Zero dipendenze esterne

### PostgreSQL
- ✅ Enterprise-grade
- ✅ Multi-user concurrency
- ✅ Scalabilità orizzontale
- ✅ Backup/Replica avanzati
- ✅ JSONB nativo
- ✅ Sicurezza avanzata

---

## ⚠️ Limitazioni per Storage Type

### JSON
- ⚠️ No concurrent access (single-user)
- ⚠️ Performance degrada con >100 org
- ⚠️ No transazioni ACID
- ⚠️ Query complesse richiedono parsing manuale

### SQLite
- ⚠️ Concorrenza limitata (lock file)
- ⚠️ File binario (no Git tracking)
- ⚠️ No scaling orizzontale

### PostgreSQL
- ⚠️ Richiede installazione/configurazione
- ⚠️ Overhead per deployment piccoli
- ⚠️ Backup più complesso di file copy

---

## 🔀 Migrazione tra Storage Types

### Da JSON a SQLite

```bash
# 1. Backup dati JSON
cp -r dashboard/data dashboard/data_backup

# 2. Cambia .env
echo "DATABASE_TYPE=sqlite" > dashboard/.env

# 3. Esegui script migrazione
node dashboard/scripts/migrate_json_to_sqlite.js

# 4. Verifica
sqlite3 dashboard/data/cpf_dashboard.sqlite "SELECT count(*) FROM organizations;"
```

### Da SQLite a PostgreSQL

```bash
# 1. Setup PostgreSQL (vedi sezione sopra)

# 2. Cambia .env
DATABASE_TYPE=postgres
DATABASE_URL="postgresql://cpf_user:password@localhost:5432/cpf_dashboard"

# 3. Esegui script migrazione
node dashboard/scripts/migrate_sqlite_to_postgres.js

# 4. Verifica
psql $DATABASE_URL -c "SELECT count(*) FROM organizations;"
```

### Da PostgreSQL a JSON (downgrade)

```bash
# 1. Backup database
pg_dump $DATABASE_URL > dashboard/data/backup.sql

# 2. Esporta a JSON
node dashboard/scripts/export_postgres_to_json.js

# 3. Cambia .env
echo "DATABASE_TYPE=json" > dashboard/.env

# 4. Riavvia server
npm start
```

---

## 📝 Note Implementazione

1. **Atomicità scritture**: Usare `fs.writeFile` con temp file + rename
2. **Backup automatico**: Copiare file prima di sovrascrivere
3. **Validazione**: Schema JSON validation prima di scrivere
4. **Error handling**: Try/catch su tutte le operazioni file
5. **Indice sync**: Aggiornare sempre organizations_index.json insieme a file org

---

## 🛠️ Architettura Storage Layer

```
┌─────────────────────────────────────────────────────┐
│  Dashboard API (server.js)                          │
│  - REST Endpoints                                   │
│  - WebSocket Real-time                              │
└─────────────────┬───────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────────┐
│  Data Manager (lib/dataManager.js)                  │
│  - Business Logic                                   │
│  - Aggregates Calculation                           │
│  - Validation                                       │
└─────────────────┬───────────────────────────────────┘
                  │
         ┌────────┼────────┐
         ↓        ↓        ↓
    ┌────────┬────────┬────────┐
    │ JSON   │ SQLite │Postgres│
    │Adapter │Adapter │Adapter │
    └────────┴────────┴────────┘
         ↓        ↓        ↓
    ┌────────┬────────┬────────┐
    │ Files  │ .sqlite│Database│
    └────────┴────────┴────────┘
```

**Interfaccia Unificata**: Tutti e 3 gli adapter implementano le stesse funzioni:
- `createOrganization()`
- `readOrganization()`
- `writeOrganization()`
- `saveAssessment()`
- `getAssessment()`
- `deleteOrganization()`
- Etc.

---

## 📚 Riferimenti

- **Dashboard Main**: `/dashboard/README.md` - Guida completa CPF Dashboard
- **Server API**: `/dashboard/server.js` - Endpoint RESTful
- **Storage Adapters**: `/dashboard/lib/` - db_json.js, db_sqlite.js, db_postgres.js
- **Config**: `/dashboard/config.js` - Configurazione storage
- **Schema Validation**: `/dashboard/data/schemas/` - JSON Schema

---

**Versione**: 3.0 (Multi-Storage)
**Data**: 2025-11-22
**Storage Supportati**: JSON, SQLite, PostgreSQL
