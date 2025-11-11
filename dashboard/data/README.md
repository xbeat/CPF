# CPF Data Storage - File JSON Structure

Sistema di storage basato su file JSON per massima portabilità e semplicità di deployment.

---

## 📁 Struttura Cartelle

```
/dashboard/data/
├── organizations_index.json          # Indice di tutte le organizzazioni
├── organizations/                    # Dati completi per ogni organizzazione
│   ├── org-demo-001.json
│   ├── org-demo-002.json
│   └── ...
└── schemas/                          # Schema di riferimento (questa cartella)
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

## 🔒 Vantaggi Soluzione JSON

✅ **Zero configurazione**: Nessun database da installare
✅ **Portabilità**: Copia cartella = backup completo
✅ **Debug facile**: File leggibili da umano
✅ **Versioning**: Git tracking dei cambiamenti
✅ **Semplicità**: No query, solo `fs.readFile` / `fs.writeFile`
✅ **Backup**: Copia file = disaster recovery
✅ **Cross-platform**: Funziona ovunque (Mac, Linux, Windows)

---

## ⚠️ Limitazioni

⚠️ **Concurrent access**: No lock mechanism (ok per single-user)
⚠️ **Scale**: Performance degrada con >100 organizzazioni
⚠️ **Transactions**: No garanzia atomicità (write potrebbe fallire a metà)
⚠️ **Query complesse**: No SQL JOIN, serve parsing JSON manuale

**Soluzione futura**: Migrare a PostgreSQL quando necessario (vedi `/dashboard/postgres/`)

---

## 📝 Note Implementazione

1. **Atomicità scritture**: Usare `fs.writeFile` con temp file + rename
2. **Backup automatico**: Copiare file prima di sovrascrivere
3. **Validazione**: Schema JSON validation prima di scrivere
4. **Error handling**: Try/catch su tutte le operazioni file
5. **Indice sync**: Aggiornare sempre organizations_index.json insieme a file org

---

## 🚀 Migration Path

Se in futuro vorrai migrare a PostgreSQL:

1. Lo schema è già pronto in `/dashboard/postgres/`
2. Script di migrazione: leggere tutti i file JSON e INSERT nel DB
3. Cambiare API endpoints per usare `pool.query()` invece di `fs.readFile()`
4. Mantenere retrocompatibilità con export JSON

---

**Versione**: 2.0 (File JSON)
**Data**: 2025-01-11
**Status**: Attivo
