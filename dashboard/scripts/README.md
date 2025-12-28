# Scripts del Pannello di Controllo

Questa directory contiene vari script di supporto per il pannello di controllo del CPF (Cybersecurity Posture Framework).

## Configurazione Database

Il sistema supporta tre tipi di storage, configurabili tramite il file `dashboard/.env`:

| Tipo | Variabile | Descrizione |
|------|-----------|-------------|
| **JSON** | `DATABASE_TYPE=json` | File JSON in `dashboard/data/organizations/` (default) |
| **SQLite** | `DATABASE_TYPE=sqlite` | Database SQLite in `dashboard/data/cpf_dashboard.sqlite` |
| **PostgreSQL** | `DATABASE_TYPE=postgres` | Richiede `DATABASE_URL` |

**File di configurazione:** `dashboard/.env`

```bash
# Per JSON (default)
DATABASE_TYPE=json

# Per SQLite
DATABASE_TYPE=sqlite

# Per PostgreSQL
DATABASE_TYPE=postgres
DATABASE_URL=postgresql://user:password@localhost:5432/cpf_dashboard
```

**Nota:** Puoi anche passare la variabile direttamente da riga di comando:
```bash
DATABASE_TYPE=sqlite node dashboard/server.js
```

---

## Contenuti

---

## 🧪 Script di Testing e Generazione Dati

### `test_backend.js`

**Scopo:** Script principale per testare il backend e generare dati demo per qualsiasi store.

**Funzionamento:**
1. Utilizza `generate_demo_organizations.js` per creare dati di test
2. Usa il driver del database configurato (`db.js`) per operazioni CRUD
3. Verifica che creazione, lettura e salvataggio di assessment funzionino
4. Salva TUTTI gli assessments generati nel database (30-70 per organizzazione)

**Usage:**
```bash
# Test con JSON (default)
DATABASE_TYPE=json node dashboard/scripts/test_backend.js

# Test con SQLite
DATABASE_TYPE=sqlite node dashboard/scripts/test_backend.js

# Test con PostgreSQL
DATABASE_TYPE=postgres node dashboard/scripts/test_backend.js
```

**Output:**
- 5 organizzazioni demo con 30-70 assessments ciascuna
- Per SQLite: crea automaticamente `dashboard/data/cpf_dashboard.sqlite`
- Per JSON: file in `dashboard/data/organizations/*.json`

---

### `generate_demo_organizations.js`

**Scopo:** Generatore di dati demo ad alta qualità.

Questo script crea un set di dati di esempio che include:
- 5 organizzazioni demo (TechCorp Global, FinanceFirst Bank, HealthPlus Clinic, RetailMax Store, EduLearn Academy)
- Assessment randomici basati sui Field Kit reali
- Punteggi calcolati con la stessa formula del client
- Aggregati e maturity model calcolati automaticamente

**Usage standalone (solo JSON):**
```bash
node dashboard/scripts/generate_demo_organizations.js
```

**Note:** Per generare dati demo per SQLite/PostgreSQL, usare `test_backend.js` con la variabile `DATABASE_TYPE` appropriata.

---

## 🔍 Script di Validazione

### `validate-and-fix-indicators.js`

**Scopo:** Validare e auto-correggere i file JSON degli indicatori (Field Kit).

**Funzionamento:**
1. Scansiona tutti gli indicatori in `auditor field kit/interactive/{language}/`
2. Valida la struttura JSON di ogni indicatore
3. Auto-corregge problemi comuni:
   - Normalizza i pesi scoring che non sommano a 1.0
   - Normalizza i pesi delle domande
   - Scala gli impatti dei red flags se superano 1.0
   - Corregge typo comuni
4. Crea backup automatici prima di modificare

**Usage:**
```bash
# Dry run (mostra cosa verrebbe modificato senza cambiare nulla)
node dashboard/scripts/validate-and-fix-indicators.js en-US --dry-run

# Applica le correzioni
node dashboard/scripts/validate-and-fix-indicators.js en-US

# Per altre lingue
node dashboard/scripts/validate-and-fix-indicators.js it-IT --dry-run
```

**Lingue supportate:** `en-US`, `it-IT`, `es-ES`, `fr-FR`, `de-DE`

---

## 🔄 Script di Migrazione Storage

### `migrate_json_to_sqlite.js`

**Scopo:** Migra tutti i dati da file JSON a database SQLite.

**Pre-requisiti:**
- Dati JSON esistenti in `dashboard/data/organizations/`
- `DATABASE_TYPE=json` in `.env` (o default)

**Usage:**
```bash
node dashboard/scripts/migrate_json_to_sqlite.js
```

**Output:**
- Database SQLite: `dashboard/data/cpf_dashboard.sqlite`
- Backup automatico se DB esistente
- Report completo con conteggio organizzazioni e assessments

**Prossimi passi:**
1. Aggiorna `.env`: `DATABASE_TYPE=sqlite`
2. Riavvia server: `npm start`

---

### `migrate_sqlite_to_postgres.js`

**Scopo:** Migra tutti i dati da database SQLite a PostgreSQL.

**Pre-requisiti:**
- Database SQLite esistente in `dashboard/data/cpf_dashboard.sqlite`
- PostgreSQL installato e database creato
- `DATABASE_URL` configurato in `.env`

**Setup PostgreSQL:**
```bash
sudo -u postgres psql
CREATE DATABASE cpf_dashboard;
CREATE USER cpf_user WITH ENCRYPTED PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE cpf_dashboard TO cpf_user;
\q
```

**Usage:**
```bash
# Aggiungi a .env
DATABASE_URL="postgresql://cpf_user:password@localhost:5432/cpf_dashboard"

# Esegui migrazione
node dashboard/scripts/migrate_sqlite_to_postgres.js
```

**Output:**
- Tabelle create automaticamente in PostgreSQL
- Report completo migrazione

**Prossimi passi:**
1. Aggiorna `.env`: `DATABASE_TYPE=postgres`
2. Riavvia server: `npm start`

---

### `export_postgres_to_json.js`

**Scopo:** Esporta tutti i dati da PostgreSQL a file JSON (downgrade).

**Pre-requisiti:**
- PostgreSQL database con dati
- `DATABASE_URL` configurato in `.env`

**Usage:**
```bash
node dashboard/scripts/export_postgres_to_json.js
```

**Output:**
- File JSON in `dashboard/data/organizations/*.json`
- `organizations_index.json` rigenerato
- Backup automatico di directory esistente

**Prossimi passi:**
1. Aggiorna `.env`: `DATABASE_TYPE=json`
2. Riavvia server: `npm start`

---

## Quick Start

### 1. Generare dati demo e testare

```bash
# Per SQLite (consigliato per sviluppo)
DATABASE_TYPE=sqlite node dashboard/scripts/test_backend.js

# Avvia il server
DATABASE_TYPE=sqlite node dashboard/server.js
```

### 2. Verificare che tutto funzioni

```bash
# API test
curl http://localhost:3000/api/organizations

# Apri dashboard nel browser
open http://localhost:3000/dashboard/auditing/
```

### 3. Cambiare store

Semplicemente cambia `DATABASE_TYPE` e riavvia:

```bash
# Passa a JSON
DATABASE_TYPE=json node dashboard/server.js

# Passa a SQLite
DATABASE_TYPE=sqlite node dashboard/server.js

# Passa a PostgreSQL
DATABASE_TYPE=postgres node dashboard/server.js
```

---

## 🐘 PostgreSQL Cloud (Neon, Supabase, Render, etc.)

Per database PostgreSQL cloud, passa le variabili direttamente dalla riga di comando:

### Generare dati demo (5 organizzazioni)

```bash
DATABASE_TYPE=postgres \
DATABASE_URL='postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require' \
node dashboard/scripts/test_backend.js
```

**Esempio con Neon:**
```bash
DATABASE_TYPE=postgres \
DATABASE_URL='postgresql://dashboard_user:xxxxx@ep-ancient-sunset-xxxxx-pooler.eu-central-1.aws.neon.tech/cpf_dashboard_db?sslmode=require' \
node dashboard/scripts/test_backend.js
```

### Creare utenti Auth (richiede auth-module)

```bash
cd dashboard/auth-module

# Super Admin (interattivo)
DATABASE_TYPE=postgres \
DATABASE_URL='postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require' \
npm run seed:admin

# 10 Utenti Test (password: TestPassword123!)
DATABASE_TYPE=postgres \
DATABASE_URL='postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require' \
npm run seed:test
```

### Utenti di test disponibili

| Email | Ruolo | Stato |
|-------|-------|-------|
| super.admin@test.local | super_admin | active |
| admin@test.local | admin | active |
| auditor1@test.local | auditor | active |
| auditor2@test.local | auditor | active |
| viewer@test.local | viewer | active |
| pending@test.local | auditor | pending_approval |
| locked@test.local | auditor | locked |
| suspended@test.local | viewer | suspended |
| expired@test.local | auditor | expired |
| expiring.soon@test.local | auditor | active (5 giorni) |

**Password:** `TestPassword123!`
