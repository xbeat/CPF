# CPF Dashboard Core Library

Libreria core per la gestione dati del sistema CPF Dashboard.

## Contenuto

### Storage Adapters

#### `db_json.js`
Storage adapter per file JSON. Implementa tutte le funzioni CRUD usando `fs.readFile` e `fs.writeFile`.

**Caratteristiche:**
- Zero configurazione
- Massima portabilità
- Human-readable
- Storage predefinito

#### `db_sqlite.js`
Storage adapter per database SQLite. Implementa CRUD usando queries SQL su SQLite.

**Caratteristiche:**
- Setup automatico
- Performance eccellente
- Transazioni ACID
- File singolo portabile

#### `db_postgres.js`
Storage adapter per PostgreSQL. Implementa CRUD usando pool di connessioni PostgreSQL.

**Caratteristiche:**
- Enterprise-grade
- Multi-user concurrency
- Scalabilità orizzontale
- JSONB nativo

### `dataManager.js` (Legacy)

Modulo principale per la gestione centralizzata dei dati delle organizzazioni e degli assessment.

**Nota:** Questo è il data manager legacy che funziona solo con storage JSON. Per progetti nuovi, usare direttamente gli storage adapter (`db_json.js`, `db_sqlite.js`, `db_postgres.js`) tramite `config.js`.

## Funzionalità

Il Data Manager fornisce un'interfaccia unificata per:

### Gestione Organizzazioni
- Caricamento e salvataggio dati organizzazioni
- Creazione nuove organizzazioni
- Aggiornamento metadata organizzazioni
- Soft delete e restore da trash
- Gestione indice organizzazioni

### Gestione Assessment
- Salvataggio assessment indicatori
- Caricamento assessment per organizzazione
- Calcolo statistiche completamento
- Aggregazione dati per categoria

### Storage (Multi-Backend)
- **JSON** (`db_json.js`) - File-based storage (massima portabilità)
- **SQLite** (`db_sqlite.js`) - Database locale leggero
- **PostgreSQL** (`db_postgres.js`) - Database enterprise
- Astrazione layer storage per portabilità completa
- Configurazione via `.env`: `DATABASE_TYPE=json|sqlite|postgres`

### Statistiche e Aggregati
- Calcolo overall risk score
- Statistiche per categoria
- Percentuali completamento
- Identificazione indicatori mancanti

## Utilizzo

```javascript
const DataManager = require('./lib/dataManager');

// Carica tutte le organizzazioni
const orgs = await DataManager.loadOrganizations();

// Carica dati organizzazione specifica
const orgData = await DataManager.loadOrganization('org-001');

// Salva assessment
await DataManager.saveAssessment('org-001', '1.1', assessmentData);

// Calcola statistiche
const stats = await DataManager.calculateStats('org-001');
```

## Architettura

Il Data Manager implementa il pattern **Repository** per separare la logica di business dalla persistenza dei dati.

```
┌─────────────────────────────────────┐
│  Dashboard / Client                 │
└─────────────────┬───────────────────┘
                  │
                  ↓
┌─────────────────────────────────────┐
│  DataManager (API Layer)            │
│  - loadOrganizations()              │
│  - saveAssessment()                 │
│  - calculateStats()                 │
└─────────────────┬───────────────────┘
                  │
                  ↓
┌─────────────────────────────────────┐
│  Storage Layer                      │
│  ├─ FileStorage (JSON files)        │
│  └─ PostgresStorage (Database)      │
└─────────────────────────────────────┘
```

## Vantaggi

✅ **Centralizzazione** - Unico punto di accesso ai dati
✅ **Astrazione** - Separazione storage da logica business
✅ **Portabilità** - Facile switch tra JSON e PostgreSQL
✅ **Manutenibilità** - Modifiche storage senza toccare dashboard
✅ **Consistenza** - Validazione e regole business centralizzate

## API Principale

### Organizations

```javascript
// Lista tutte le organizzazioni
loadOrganizations() → Promise<Array<Organization>>

// Carica singola organizzazione
loadOrganization(orgId) → Promise<Organization>

// Crea nuova organizzazione
createOrganization(orgData) → Promise<Organization>

// Aggiorna organizzazione
updateOrganization(orgId, updates) → Promise<Organization>

// Elimina organizzazione (soft delete)
deleteOrganization(orgId) → Promise<void>

// Ripristina da trash
restoreOrganization(orgId) → Promise<void>
```

### Assessments

```javascript
// Salva assessment indicatore
saveAssessment(orgId, indicatorId, data) → Promise<void>

// Carica tutti gli assessment di un'organizzazione
loadAssessments(orgId) → Promise<Object>

// Carica assessment specifico
loadAssessment(orgId, indicatorId) → Promise<Assessment>
```

### Statistics

```javascript
// Calcola statistiche organizzazione
calculateStats(orgId) → Promise<Stats>

// Calcola overall risk score
calculateOverallRisk(orgId) → Promise<number>

// Ottieni indicatori mancanti
getMissingIndicators(orgId) → Promise<Array<string>>

// Calcola statistiche per categoria
calculateCategoryStats(orgId) → Promise<Object>
```

## Configurazione

Gli storage adapter sono configurabili tramite `.env`:

```bash
# Storage type (json | sqlite | postgres) - Default: json
DATABASE_TYPE=json

# PostgreSQL connection (richiesto solo se DATABASE_TYPE=postgres)
DATABASE_URL=postgresql://user:pass@localhost:5432/cpf_dashboard
```

**Storage Paths:**
- **JSON**: `dashboard/data/organizations/*.json`
- **SQLite**: `dashboard/data/cpf_dashboard.sqlite`
- **PostgreSQL**: Database remoto (configurato via `DATABASE_URL`)

**Migrazione tra storage:**
Vedi script in `/dashboard/scripts/`:
- `migrate_json_to_sqlite.js`
- `migrate_sqlite_to_postgres.js`
- `export_postgres_to_json.js`

## Riferimenti

- **Documentazione completa**: `/dashboard/README.md`
- **Multi-Storage Guide**: `/dashboard/data/README.md` - Guida completa storage JSON/SQLite/PostgreSQL
- **Schema dati**: `/dashboard/data/schemas/README.md`
- **Script migrazione**: `/dashboard/scripts/README.md`
- **Config**: `/dashboard/config.js` - Configurazione storage type
