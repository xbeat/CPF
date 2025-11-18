# CPF Dashboard Core Library

Libreria core per la gestione dati del sistema CPF Dashboard.

## Contenuto

### `dataManager.js`

Modulo principale per la gestione centralizzata dei dati delle organizzazioni e degli assessment.

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

### Storage
- **File-based** - Sistema basato su file JSON
- **PostgreSQL** - Supporto database (opzionale)
- Astrazione layer storage per portabilità

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

Il Data Manager può essere configurato tramite variabili d'ambiente:

```bash
# Storage type (json | postgres)
STORAGE_TYPE=json

# JSON storage path
DATA_PATH=/dashboard/data

# PostgreSQL connection (se STORAGE_TYPE=postgres)
DATABASE_URL=postgresql://user:pass@localhost/cpf_db
```

## Riferimenti

- Documentazione completa: `/dashboard/README.md`
- Schema dati: `/dashboard/data/README.md`
- PostgreSQL setup: `/dashboard/postgres/README.md`
