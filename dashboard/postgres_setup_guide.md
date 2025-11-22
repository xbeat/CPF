# CPF - Database PostgreSQL Setup Guide

Guida completa per l'installazione e configurazione del database PostgreSQL per il progetto CPF (Cyber Psychology Framework).

---

## 📋 Indice

1. [Installazione PostgreSQL su Mac](#installazione-postgresql-su-mac)
2. [Verifica Installazione](#verifica-installazione)
3. [Creazione Database CPF](#creazione-database-cpf)
4. [Esecuzione Schema](#esecuzione-schema)
5. [Generazione Dati Demo](#generazione-dati-demo)
6. [Connessione da Applicazione](#connessione-da-applicazione)
7. [Comandi Utili](#comandi-utili)
8. [Troubleshooting](#troubleshooting)

---

## 🍺 Installazione PostgreSQL su Mac

### Opzione 1: Homebrew (Raccomandato)

```bash
# Installa Homebrew se non presente
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Installa PostgreSQL
brew install postgresql@16

# Avvia PostgreSQL come servizio
brew services start postgresql@16

# Aggiungi PostgreSQL al PATH
echo 'export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Opzione 2: Postgres.app (GUI)

1. Scarica da: https://postgresapp.com/
2. Trascina nella cartella Applicazioni
3. Avvia Postgres.app
4. Clicca "Initialize" per creare il server

---

## ✅ Verifica Installazione

```bash
# Verifica versione PostgreSQL
psql --version
# Output atteso: psql (PostgreSQL) 16.x

# Verifica che il servizio sia attivo
brew services list | grep postgresql
# Output atteso: postgresql@16 started

# Connetti al database di default
psql postgres
# Se funziona, vedrai il prompt: postgres=#
# Esci con: \q
```

---

## 🗄️ Creazione Database CPF

```bash
# Connetti a PostgreSQL
psql postgres

# Crea database cpf_db
CREATE DATABASE cpf_db;

# Crea utente cpf (opzionale, per produzione)
CREATE USER cpf_user WITH PASSWORD 'your_secure_password';

# Assegna privilegi
GRANT ALL PRIVILEGES ON DATABASE cpf_db TO cpf_user;

# Esci
\q

# Verifica creazione database
psql -l | grep cpf_db
```

### Script Automatico

```bash
# Crea database automaticamente
createdb cpf_db

# Oppure con psql one-liner
psql postgres -c "CREATE DATABASE cpf_db;"
```

---

## 📊 Esecuzione Schema

```bash
# Dalla root del progetto CPF
cd /path/to/CPF

# Esegui lo schema
psql cpf_db -f dashboard/db_schema.sql

# Verifica tabelle create
psql cpf_db -c "\dt"
```

Output atteso:
```
                List of relations
 Schema |         Name          | Type  |  Owner
--------+-----------------------+-------+----------
 public | assessments           | table | your_user
 public | indicators_metadata   | table | your_user
 public | organizations         | table | your_user
```

---

## 🎲 Generazione Dati Demo

```bash
# Installa dipendenza pg (se non presente)
npm install pg

# Esegui script seed
node dashboard/db_seed_demo.js

# Output atteso:
# ✅ Connesso a PostgreSQL
# ✅ Creata organizzazione: Demo Corp 1
# ✅ Creati 45 assessments per Demo Corp 1
# ...
# ✅ Seed completato! 5 organizzazioni create.
```

---

## 🔌 Connessione da Applicazione

### Node.js (pg library)

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  user: 'your_username',      // default: utente Mac
  host: 'localhost',
  database: 'cpf_db',
  password: '',               // vuoto per connessione locale
  port: 5432,
});

// Test connessione
pool.query('SELECT NOW()', (err, res) => {
  console.log(err ? err.stack : res.rows[0]);
  pool.end();
});
```

### Environment Variables (.env)

```env
# Crea file .env nella root del progetto
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cpf_db
DB_USER=your_username
DB_PASSWORD=
```

---

## 🛠️ Comandi Utili

### Gestione PostgreSQL

```bash
# Avvia servizio
brew services start postgresql@16

# Ferma servizio
brew services stop postgresql@16

# Riavvia servizio
brew services restart postgresql@16

# Status servizio
brew services info postgresql@16
```

### Comandi psql

```bash
# Connetti a database
psql cpf_db

# Lista database
\l

# Lista tabelle
\dt

# Descrivi tabella
\d organizations

# Esegui query
SELECT * FROM organizations;

# Esporta risultati in CSV
\copy (SELECT * FROM organizations) TO '/tmp/orgs.csv' CSV HEADER;

# Esci
\q
```

### Backup e Restore

```bash
# Backup database
pg_dump cpf_db > cpf_backup_$(date +%Y%m%d).sql

# Restore database
psql cpf_db < cpf_backup_20250111.sql

# Backup solo schema
pg_dump cpf_db --schema-only > cpf_schema.sql

# Backup solo dati
pg_dump cpf_db --data-only > cpf_data.sql
```

---

## 🔍 Verifica Dati Demo

```bash
# Conta organizzazioni
psql cpf_db -c "SELECT COUNT(*) FROM organizations;"

# Lista organizzazioni
psql cpf_db -c "SELECT id, name, industry FROM organizations;"

# Conta assessments per org
psql cpf_db -c "
  SELECT o.name, COUNT(a.id) as num_assessments
  FROM organizations o
  LEFT JOIN assessments a ON o.id = a.org_id
  GROUP BY o.name;
"

# Visualizza distribuzione scores
psql cpf_db -c "
  SELECT
    CASE
      WHEN bayesian_score < 0.3 THEN 'Low Risk'
      WHEN bayesian_score < 0.7 THEN 'Medium Risk'
      ELSE 'High Risk'
    END as risk_level,
    COUNT(*) as count
  FROM assessments
  GROUP BY risk_level;
"
```

---

## 🚨 Troubleshooting

### Problema: `psql: command not found`

```bash
# Aggiungi PostgreSQL al PATH
echo 'export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Problema: `connection refused`

```bash
# Verifica che PostgreSQL sia avviato
brew services list | grep postgresql

# Se non è started, avvialo
brew services start postgresql@16
```

### Problema: `database "cpf_db" does not exist`

```bash
# Crea il database
createdb cpf_db
```

### Problema: `permission denied`

```bash
# Controlla owner del database
psql postgres -c "\l" | grep cpf_db

# Assegna privilegi al tuo utente
psql postgres -c "ALTER DATABASE cpf_db OWNER TO $(whoami);"
```

### Problema: Port 5432 già in uso

```bash
# Trova processo che usa porta 5432
lsof -i :5432

# Termina processo (usa PID dal comando precedente)
kill -9 <PID>

# Oppure cambia porta di PostgreSQL
# Modifica /opt/homebrew/var/postgresql@16/postgresql.conf
# port = 5433
```

### Reset Completo Database

```bash
# ATTENZIONE: elimina TUTTI i dati!

# Ferma servizio
brew services stop postgresql@16

# Elimina database
dropdb cpf_db

# Ricrea database
createdb cpf_db

# Ri-esegui schema e seed
psql cpf_db -f dashboard/db_schema.sql
node dashboard/db_seed_demo.js

# Riavvia servizio
brew services start postgresql@16
```

---

## 📦 Struttura Database CPF

### Tabella: `organizations`
Contiene le organizzazioni monitorate.

| Colonna | Tipo | Descrizione |
|---------|------|-------------|
| id | VARCHAR(50) PRIMARY KEY | ID univoco (es. org-001) |
| name | VARCHAR(255) NOT NULL | Nome organizzazione |
| industry | VARCHAR(100) | Settore (Technology, Finance, etc.) |
| size | VARCHAR(50) | Dimensione (small, medium, enterprise) |
| country | VARCHAR(2) | Codice ISO paese (IT, US, etc.) |
| created_at | TIMESTAMP | Data creazione |
| updated_at | TIMESTAMP | Ultimo aggiornamento |

### Tabella: `assessments`
Contiene le valutazioni degli indicatori per ogni organizzazione.

| Colonna | Tipo | Descrizione |
|---------|------|-------------|
| id | SERIAL PRIMARY KEY | ID auto-incrementale |
| org_id | VARCHAR(50) REFERENCES organizations | ID organizzazione |
| indicator_id | VARCHAR(10) NOT NULL | ID indicatore (1.1, 2.5, etc.) |
| bayesian_score | DECIMAL(5,4) | Score Bayesiano (0.0000 - 1.0000) |
| confidence | DECIMAL(5,4) | Confidence (0.0000 - 1.0000) |
| assessor | VARCHAR(255) | Nome valutatore |
| assessment_date | TIMESTAMP | Data valutazione |
| raw_data | JSONB | Dati completi assessment (form) |
| created_at | TIMESTAMP | Data creazione record |

### Tabella: `indicators_metadata`
Snapshot degli indicatori al momento della creazione dell'organizzazione.

| Colonna | Tipo | Descrizione |
|---------|------|-------------|
| id | SERIAL PRIMARY KEY | ID auto-incrementale |
| org_id | VARCHAR(50) REFERENCES organizations | ID organizzazione |
| indicator_id | VARCHAR(10) NOT NULL | ID indicatore (1.1, 2.5, etc.) |
| category | VARCHAR(100) | Categoria indicatore |
| title | TEXT | Titolo indicatore |
| language | VARCHAR(5) DEFAULT 'en-US' | Lingua (en-US, it-IT) |
| full_data | JSONB | JSON completo indicatore da GitHub |
| snapshot_date | TIMESTAMP | Data snapshot |

---

## 🔄 Workflow Completo

```bash
# 1. Installa PostgreSQL
brew install postgresql@16
brew services start postgresql@16

# 2. Crea database
createdb cpf_db

# 3. Esegui schema
psql cpf_db -f dashboard/db_schema.sql

# 4. Genera dati demo
node dashboard/db_seed_demo.js

# 5. Verifica
psql cpf_db -c "SELECT name FROM organizations;"

# 6. Avvia applicazione
node server.js
```

---

## 📚 Risorse Utili

- **PostgreSQL Docs**: https://www.postgresql.org/docs/16/
- **Homebrew PostgreSQL**: https://formulae.brew.sh/formula/postgresql@16
- **node-postgres (pg)**: https://node-postgres.com/
- **psql Guide**: https://www.postgresql.org/docs/current/app-psql.html

---

## 📝 Note Finali

- **Ambiente di sviluppo**: Questa guida è ottimizzata per Mac con Homebrew
- **Produzione**: Per deployment in produzione, configura password sicure e SSL
- **Backup**: Configura backup automatici giornalieri in produzione
- **Performance**: Per dataset grandi (>1000 org), considera indici aggiuntivi

---

**Versione**: 1.0
**Data**: 2025-01-11
**Progetto**: CPF - Cyber Psychology Framework
