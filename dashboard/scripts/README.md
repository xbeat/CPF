# Scripts del Pannello di Controllo

Questa directory contiene vari script di supporto per il pannello di controllo del CPF (Cybersecurity Posture Framework).

## Contenuti

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

## 🧪 Script di Testing e Sviluppo

### `generate_demo_organizations.js`

**Scopo:** Generare dati di organizzazione fittizi per scopi di sviluppo, test o dimostrazione.

Questo script crea un set di dati di esempio che include informazioni sull'organizzazione, valutazioni di sicurezza pre-calcolate e aggregati statistici. È essenziale per popolare un ambiente di sviluppo pulito con dati coerenti.

**Usage:**
```bash
node dashboard/scripts/generate_demo_organizations.js
```

**Output:**
- 5 organizzazioni demo (TechCorp Global, FinanceFirst Bank, HealthPlus Clinic, RetailMax Store, EduLearn Academy)
- Assessment randomici per categoria
- Aggregati calcolati automaticamente

### `test_backend.js`

**Scopo:** Eseguire un test di integrazione completo per il backend del pannello di controllo.

**Funzionamento:**
1.  Utilizza `generate_demo_organizations.js` per creare dati di test al volo.
2.  Usa il driver del database configurato (es. JSON o SQLite) per eseguire operazioni CRUD (Create, Read, Update, Delete).
3.  Verifica che la creazione di un'organizzazione, la lettura e il salvataggio di una valutazione funzionino come previsto.

È lo script principale per verificare la salute e il corretto funzionamento dell'intero stack del backend.

### `test_generator.js`

**Scopo:** Eseguire un test unitario per lo script `generate_demo_organizations.js`.

**Funzionamento:**
1.  Esegue la funzione di generazione dei dati.
2.  Controlla rigorosamente la struttura dei dati restituiti, verificando la presenza e il tipo corretto di tutte le proprietà chiave (ID, metadati, valutazioni, aggregati).

Questo test garantisce che qualsiasi modifica al generatore di dati non produca dati malformati, che potrebbero causare errori in altre parti dell'applicazione.
