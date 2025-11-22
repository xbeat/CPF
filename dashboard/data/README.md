# CPF Dashboard - Data Storage Guide

Guida completa per la configurazione e l'utilizzo del sistema di storage dati del CPF Dashboard.

---

## Indice
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

1. [Configurazione Ambiente](#configurazione-ambiente)
2. [Storage Backends](#storage-backends)
3. [Generazione Dati Demo](#generazione-dati-demo)
4. [Struttura Dati](#struttura-dati)
5. [API Endpoints](#api-endpoints)
6. [Schema Files](#schema-files)

---

## Configurazione Ambiente

### 1. Crea il file `.env`

```bash
cd dashboard
cp .env.example .env
```

### 2. Configura il tipo di database

Modifica `.env` e imposta `DATABASE_TYPE`:

```bash
# Opzioni disponibili:
DATABASE_TYPE=json      # Default - File JSON (nessuna configurazione aggiuntiva)
DATABASE_TYPE=sqlite    # SQLite - Database locale in un file
DATABASE_TYPE=postgres  # PostgreSQL - Richiede DATABASE_URL
```

### 3. Configurazione PostgreSQL (se usato)

```bash
# Aggiungi al file .env:
DATABASE_TYPE=postgres
DATABASE_URL=postgresql://cpf_user:cpf_password@localhost:5432/cpf_db
```

---

## Storage Backends

Il CPF Dashboard supporta tre tipi di storage:

| Backend | Uso Consigliato | Configurazione |
|---------|-----------------|----------------|
| **JSON** | Sviluppo, demo, single-user | Nessuna |
| **SQLite** | Sviluppo locale, testing | Solo `DATABASE_TYPE=sqlite` |
| **PostgreSQL** | Produzione, multi-user | Richiede server PostgreSQL |

---

## Generazione Dati Demo

### JSON (Default)

```bash
cd dashboard
npm run generate:demo
```

Genera:
- 5 organizzazioni demo
- 30-70 assessments per organizzazione
- File in `data/organizations/`

### SQLite

```bash
cd dashboard

# 1. Configura .env
echo "DATABASE_TYPE=sqlite" > .env

# 2. Genera dati demo
node -e "
const { generateDemoOrganizations } = require('./scripts/generate_demo_organizations');
const db = require('./lib/db_sqlite');

async function seed() {
  await db.initialize();
  const orgs = await generateDemoOrganizations();

  for (const org of orgs) {
    await db.createOrganization(org);
    for (const [indicatorId, assessment] of Object.entries(org.assessments)) {
      await db.saveAssessment(org.id, indicatorId, assessment);
    }
    console.log('Saved:', org.name);
  }
  console.log('Done!');
  process.exit(0);
}
seed();
"
```

Il database viene creato in `data/cpf_dashboard.sqlite`.

### PostgreSQL

#### 1. Avvia PostgreSQL

```bash
# Linux/Ubuntu
sudo service postgresql start

# macOS (Homebrew)
brew services start postgresql
```

#### 2. Crea utente e database

```bash
# Accedi come superuser
sudo -u postgres psql

# Esegui questi comandi SQL:
CREATE USER cpf_user WITH PASSWORD 'cpf_password';
CREATE DATABASE cpf_db OWNER cpf_user;
GRANT ALL PRIVILEGES ON DATABASE cpf_db TO cpf_user;
\q
```

#### 3. Configura `.env`

```bash
cat > .env << 'EOF'
DATABASE_TYPE=postgres
DATABASE_URL=postgresql://cpf_user:cpf_password@localhost:5432/cpf_db
EOF
```

#### 4. (Opzionale) Applica schema manualmente

```bash
PGPASSWORD=cpf_password psql -U cpf_user -d cpf_db -f lib/schemas/db_schema_postgres.sql
```

#### 5. Genera dati demo

```bash
node -e "
const { generateDemoOrganizations } = require('./scripts/generate_demo_organizations');
const db = require('./lib/db_postgres');

async function seed() {
  await db.initialize();
  const orgs = await generateDemoOrganizations();

  for (const org of orgs) {
    await db.createOrganization(org);
    console.log('Saved:', org.name);
  }
  console.log('Done!');
  process.exit(0);
}
seed();
"
```

#### Comandi utili PostgreSQL

```bash
# Verifica connessione
PGPASSWORD=cpf_password psql -U cpf_user -d cpf_db -c "SELECT 1"

# Lista tabelle
PGPASSWORD=cpf_password psql -U cpf_user -d cpf_db -c "\dt"

# Conta organizzazioni
PGPASSWORD=cpf_password psql -U cpf_user -d cpf_db -c "SELECT COUNT(*) FROM organizations"

# Reset database
sudo -u postgres psql -c "DROP DATABASE cpf_db"
sudo -u postgres psql -c "CREATE DATABASE cpf_db OWNER cpf_user"
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

## Struttura Dati

### Struttura Cartelle (JSON)

```
/dashboard/data/
├── organizations_index.json      # Indice di tutte le organizzazioni
├── organizations/                # Dati completi per organizzazione
│   ├── techcorp-global.json
│   ├── financefirst-bank.json
│   └── ...
├── schemas/                      # Schema JSON di validazione
│   ├── organization_data_schema.json
│   └── organization_index_schema.json
├── history/                      # Storico modifiche (opzionale)
└── trash/                        # Organizzazioni eliminate
```

### File: `organizations_index.json`

Indice rapido di tutte le organizzazioni.

```json
{
  "metadata": {
    "version": "2.0",
    "last_updated": "2025-01-11T15:30:00Z",
    "total_organizations": 5
  },
  "organizations": [
    {
      "id": "techcorp-global",
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

### File: `organizations/{id}.json`

Dati completi di una singola organizzazione.

```json
{
  "id": "techcorp-global",
  "name": "TechCorp Global",
  "metadata": {
    "industry": "Technology",
    "size": "enterprise",
    "country": "US",
    "language": "en-US",
    "created_at": "2025-01-11T10:00:00Z",
    "updated_at": "2025-01-11T15:30:00Z",
    "created_by": "Alice Johnson",
    "notes": "Enterprise tech company",
    "sede_sociale": "100 Innovation Drive, San Francisco, CA",
    "partita_iva": "US12-3456789"
  },
  "assessments": {
    "1.1": {
      "indicator_id": "1.1",
      "title": "Indicator 1.1 Title",
      "category": "Authority-Based Vulnerabilities",
      "bayesian_score": 0.6543,
      "confidence": 0.8500,
      "maturity_level": "yellow",
      "assessor": "Alice Johnson",
      "assessment_date": "2025-01-10T14:20:00Z",
      "raw_data": {
        "fieldKit": { },
        "quick_assessment": [ ],
        "client_conversation": {
          "responses": { },
          "scores": { },
          "metadata": { },
          "red_flags": [ ]
        }
      }
    }
  },
  "aggregates": {
    "overall_risk": 0.6543,
    "overall_confidence": 0.8234,
    "trend": "stable",
    "by_category": {
      "1": {
        "category_name": "Authority-Based Vulnerabilities",
        "avg_score": 0.6123,
        "avg_confidence": 0.8456,
        "total_assessments": 7,
        "completion_percentage": 70.0
      }
    },
    "completion": {
      "total_indicators": 100,
      "assessed_indicators": 45,
      "percentage": 45.0,
      "missing_indicators": ["1.3", "1.4", "1.8"]
    },
    "last_calculated": "2025-01-11T15:30:00Z",
    "maturity_model": {
      "cpf_score": 65.5,
      "maturity_level": 2,
      "level_name": "Developing"
    }
  }
}
```

### Campi Principali

#### Organization Metadata

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `id` | string | ID univoco (kebab-case, es. `techcorp-global`) |
| `name` | string | Nome organizzazione |
| `industry` | enum | Technology, Finance, Healthcare, Retail, Education, Manufacturing, Government |
| `size` | enum | small, medium, enterprise |
| `country` | string | Codice ISO 3166-1 alpha-2 (IT, US, GB) |
| `language` | enum | en-US, it-IT, es-ES, fr-FR, de-DE |
| `sede_sociale` | string | Indirizzo sede legale |
| `partita_iva` | string | Partita IVA / VAT number |

#### Assessment

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `indicator_id` | string | ID indicatore (1.1 - 10.10) |
| `title` | string | Titolo indicatore |
| `category` | string | Categoria vulnerabilità |
| `bayesian_score` | number | Score rischio (0.0 = low, 1.0 = high) |
| `confidence` | number | Livello confidenza (0.0 - 1.0) |
| `maturity_level` | enum | green, yellow, red |
| `assessor` | string | Nome valutatore |
| `assessment_date` | ISO 8601 | Data valutazione |
| `raw_data` | object | Dati completi del form |

#### Maturity Level

| Livello | Score Range | Descrizione |
|---------|-------------|-------------|
| `green` | 0.00 - 0.29 | Low risk |
| `yellow` | 0.30 - 0.69 | Medium risk |
| `red` | 0.70 - 1.00 | High risk |

---

## API Endpoints
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

### Organizzazioni

```
GET    /api/organizations                    # Lista tutte le organizzazioni
GET    /api/organizations/:orgId             # Dettaglio organizzazione
POST   /api/organizations                    # Crea nuova organizzazione
PUT    /api/organizations/:orgId             # Aggiorna organizzazione
DELETE /api/organizations/:orgId             # Elimina organizzazione
```

### Assessments

```
GET    /api/organizations/:orgId/assessments              # Tutti gli assessments
GET    /api/organizations/:orgId/assessments/:indicatorId # Assessment specifico
POST   /api/organizations/:orgId/assessments              # Salva assessment
PUT    /api/organizations/:orgId/assessments/:indicatorId # Aggiorna assessment
DELETE /api/organizations/:orgId/assessments/:indicatorId # Elimina assessment
```

### Aggregati e Statistiche

```
GET    /api/organizations/:orgId/aggregates  # Aggregati calcolati
GET    /api/organizations/:orgId/missing     # Indicatori mancanti
POST   /api/organizations/:orgId/recalculate # Ricalcola aggregati
```

### Indicatori

```
POST   /api/organizations/:orgId/fetch-indicators # Fetch indicatori da GitHub
```

---

## Schema Files

### Posizione Schema

| File | Percorso | Descrizione |
|------|----------|-------------|
| JSON Schema (data) | `data/schemas/organization_data_schema.json` | Validazione dati organizzazione |
| JSON Schema (index) | `data/schemas/organization_index_schema.json` | Validazione indice |
| SQL Schema (generico) | `lib/schemas/db_schema.sql` | Schema SQL compatibile SQLite |
| SQL Schema (SQLite) | `lib/schemas/db_schema_sqlite.sql` | Schema ottimizzato SQLite |
| SQL Schema (PostgreSQL) | `lib/schemas/db_schema_postgres.sql` | Schema ottimizzato PostgreSQL |
| JS Schema | `lib/schemas/db_schema_json.js` | Definizione schema JavaScript |

### Validazione JSON

```javascript
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const fs = require('fs');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// Carica schema
const schema = JSON.parse(
  fs.readFileSync('./data/schemas/organization_data_schema.json', 'utf8')
);
const validate = ajv.compile(schema);

// Valida dati
const data = JSON.parse(
  fs.readFileSync('./data/organizations/techcorp-global.json', 'utf8')
);

if (validate(data)) {
  console.log('Valid');
} else {
  console.error('Invalid:', validate.errors);
}
```

---

## Avvio Server

```bash
cd dashboard
npm install
npm start
```

Il server si avvia su `http://localhost:3000` e utilizza il backend configurato in `.env`.

---

## Confronto Storage Backends

| Feature | JSON | SQLite | PostgreSQL |
|---------|------|--------|------------|
| Setup | Nessuno | Nessuno | Richiede server |
| Performance | Buona (<100 org) | Ottima | Ottima |
| Concurrent access | No | Limitato | Si |
| Backup | Copia file | Copia file | pg_dump |
| Query complesse | No | SQL | SQL + JSONB |
| Produzione | No | Dev/Test | Si |

---

## Troubleshooting

### SQLite: "table has no column named X"

Il database esiste con schema vecchio. Elimina e ricrea:
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

```bash
rm dashboard/data/cpf_dashboard.sqlite
# Riesegui il seed
```

### PostgreSQL: Connection refused

```bash
# Verifica che PostgreSQL sia attivo
sudo service postgresql status

# Avvia se necessario
sudo service postgresql start
```

### PostgreSQL: Permission denied

```bash
# Verifica permessi utente
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE cpf_db TO cpf_user;"
```

---

**Versione**: 2.0
**Ultimo aggiornamento**: 2025-01-11
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
