# CPF Dashboard - Data Storage Guide

Guida completa per la configurazione e l'utilizzo del sistema di storage dati del CPF Dashboard.

---

## Indice

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
