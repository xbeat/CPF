# CPF API Documentation v2.0

REST API per la gestione di organizzazioni e assessments nel CPF (Cyber Psychology Framework).

**Base URL**: `http://localhost:3000`

---

## 📋 Indice

1. [Organizations API](#organizations-api)
2. [Assessments API](#assessments-api)
3. [Aggregates API](#aggregates-api)
4. [Legacy API](#legacy-api-backward-compatibility)
5. [Response Codes](#response-codes)
6. [Examples](#examples)

---

## 🏢 Organizations API

### GET /api/organizations

Restituisce l'indice di tutte le organizzazioni con statistiche aggregate.

**Response:**
```json
{
  "metadata": {
    "version": "2.0",
    "last_updated": "2025-01-11T17:00:00Z",
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
        "total_assessments": 61,
        "completion_percentage": 61.0,
        "overall_risk": 0.5208,
        "avg_confidence": 0.8212,
        "last_assessment_date": "2025-01-10T14:20:00Z"
      }
    }
  ]
}
```

---

### GET /api/organizations/:orgId

Restituisce i dati completi di una singola organizzazione (metadata + assessments + aggregates).

**Parameters:**
- `orgId` (path) - ID organizzazione (es. `org-demo-001`)

**Response:**
```json
{
  "success": true,
  "data": {
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
      "notes": "Enterprise tech company"
    },
    "assessments": {
      "1.1": {
        "indicator_id": "1.1",
        "title": "Indicator Title",
        "category": "Authority-Based Vulnerabilities",
        "bayesian_score": 0.6543,
        "confidence": 0.8500,
        "maturity_level": "yellow",
        "assessor": "Alice Johnson",
        "assessment_date": "2025-01-10T14:20:00Z",
        "raw_data": { ... }
      }
    },
    "aggregates": {
      "overall_risk": 0.5208,
      "overall_confidence": 0.8212,
      "trend": "stable",
      "by_category": { ... },
      "completion": {
        "total_indicators": 100,
        "assessed_indicators": 61,
        "percentage": 61.0,
        "missing_indicators": [ ... ]
      }
    }
  }
}
```

**Error Responses:**
- `404` - Organization not found

---

### POST /api/organizations

Crea una nuova organizzazione.

**Request Body:**
```json
{
  "id": "org-new-001",
  "name": "New Organization",
  "industry": "Technology",
  "size": "medium",
  "country": "IT",
  "language": "it-IT",
  "created_by": "John Doe",
  "notes": "Optional notes"
}
```

**Required Fields:**
- `id` - ID univoco organizzazione
- `name` - Nome organizzazione
- `industry` - Settore (`Technology`, `Finance`, `Healthcare`, `Retail`, `Education`, etc.)
- `size` - Dimensione (`small`, `medium`, `enterprise`)
- `country` - Codice ISO paese (2 lettere, es. `IT`, `US`)

**Optional Fields:**
- `language` - Lingua (`en-US`, `it-IT`, etc.) - default: `en-US`
- `created_by` - Nome creatore - default: `System`
- `notes` - Note opzionali

**Response:**
```json
{
  "success": true,
  "message": "Organization created successfully",
  "data": { ... }
}
```

**Error Responses:**
- `400` - Missing required fields
- `409` - Organization already exists

---

### PUT /api/organizations/:orgId

Aggiorna i metadati di un'organizzazione esistente.

**Parameters:**
- `orgId` (path) - ID organizzazione

**Request Body:**
```json
{
  "name": "Updated Name",
  "industry": "Finance",
  "size": "enterprise",
  "country": "GB",
  "language": "en-US",
  "notes": "Updated notes"
}
```

**All fields are optional** - verranno aggiornati solo i campi forniti.

**Response:**
```json
{
  "success": true,
  "message": "Organization updated successfully",
  "data": { ... }
}
```

**Error Responses:**
- `404` - Organization not found

---

### DELETE /api/organizations/:orgId

Elimina un'organizzazione e tutti i suoi dati.

**Parameters:**
- `orgId` (path) - ID organizzazione

**Response:**
```json
{
  "success": true,
  "message": "Organization deleted successfully",
  "orgId": "org-demo-001"
}
```

**Error Responses:**
- `404` - Organization not found

---

## 📊 Assessments API

### GET /api/organizations/:orgId/assessments

Restituisce tutti gli assessments per un'organizzazione.

**Parameters:**
- `orgId` (path) - ID organizzazione

**Response:**
```json
{
  "success": true,
  "orgId": "org-demo-001",
  "assessments": {
    "1.1": { ... },
    "1.2": { ... }
  },
  "count": 61
}
```

**Error Responses:**
- `404` - Organization not found

---

### GET /api/organizations/:orgId/assessments/:indicatorId

Restituisce un assessment specifico.

**Parameters:**
- `orgId` (path) - ID organizzazione
- `indicatorId` (path) - ID indicatore (es. `1.1`, `2.5`)

**Response:**
```json
{
  "success": true,
  "data": {
    "indicator_id": "1.1",
    "title": "Indicator Title",
    "bayesian_score": 0.6543,
    "confidence": 0.8500,
    ...
  }
}
```

**Error Responses:**
- `404` - Organization or assessment not found

---

### POST /api/organizations/:orgId/assessments

Salva o aggiorna un assessment. Ricalcola automaticamente gli aggregati.

**Parameters:**
- `orgId` (path) - ID organizzazione

**Request Body:**
```json
{
  "indicator_id": "1.1",
  "title": "Indicator Title",
  "category": "Authority-Based Vulnerabilities",
  "bayesian_score": 0.75,
  "confidence": 0.85,
  "maturity_level": "red",
  "assessor": "John Doe",
  "assessment_date": "2025-01-11T17:00:00Z",
  "raw_data": {
    "quick_assessment": [ ... ],
    "client_conversation": { ... }
  }
}
```

**Required Fields:**
- `indicator_id` - ID indicatore (1.1 - 10.10)
- `bayesian_score` - Score Bayesiano (0.0 - 1.0)
- `confidence` - Livello confidenza (0.0 - 1.0)

**Optional Fields:**
- `title` - Titolo indicatore
- `category` - Categoria indicatore
- `maturity_level` - Livello maturità (`green`, `yellow`, `red`)
- `assessor` - Nome valutatore
- `assessment_date` - Data valutazione (ISO 8601)
- `raw_data` - Dati completi form assessment

**Response:**
```json
{
  "success": true,
  "message": "Assessment saved successfully",
  "orgId": "org-demo-001",
  "indicator_id": "1.1",
  "aggregates": { ... }
}
```

**Error Responses:**
- `400` - Missing required fields
- `404` - Organization not found

---

### DELETE /api/organizations/:orgId/assessments/:indicatorId

Elimina un assessment. Ricalcola automaticamente gli aggregati.

**Parameters:**
- `orgId` (path) - ID organizzazione
- `indicatorId` (path) - ID indicatore

**Response:**
```json
{
  "success": true,
  "message": "Assessment deleted successfully",
  "orgId": "org-demo-001",
  "indicatorId": "1.1",
  "aggregates": { ... }
}
```

**Error Responses:**
- `404` - Organization not found

---

## 📈 Aggregates API

### GET /api/organizations/:orgId/aggregates

Restituisce gli aggregati calcolati (risk scores, completion, etc.).

**Parameters:**
- `orgId` (path) - ID organizzazione

**Response:**
```json
{
  "success": true,
  "orgId": "org-demo-001",
  "aggregates": {
    "overall_risk": 0.5208,
    "overall_confidence": 0.8212,
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
      "assessed_indicators": 61,
      "percentage": 61.0,
      "missing_indicators": [ "1.3", "1.4", ... ]
    },
    "last_calculated": "2025-01-11T17:00:00Z"
  }
}
```

**Error Responses:**
- `404` - Organization not found

---

### GET /api/organizations/:orgId/missing

Restituisce la lista degli indicatori mancanti.

**Parameters:**
- `orgId` (path) - ID organizzazione

**Response:**
```json
{
  "success": true,
  "orgId": "org-demo-001",
  "missing_indicators": ["1.3", "1.4", "1.8", ...],
  "count": 39
}
```

**Error Responses:**
- `404` - Organization not found

---

### POST /api/organizations/:orgId/recalculate

Ricalcola gli aggregati per un'organizzazione.

**Parameters:**
- `orgId` (path) - ID organizzazione

**Response:**
```json
{
  "success": true,
  "message": "Aggregates recalculated successfully",
  "orgId": "org-demo-001",
  "aggregates": { ... }
}
```

**Error Responses:**
- `404` - Organization not found

---

## 🔙 Legacy API (Backward Compatibility)

Gli endpoint legacy sono mantenuti per retrocompatibilità con il sistema precedente.

### GET /api/auditing-results

**DEPRECATED** - Usa `/api/organizations` invece.

Restituisce il file `auditing_results.json` legacy (se esiste).

---

### GET /api/list-exports

Lista i file di export nella cartella `field_kit_exports/`.

---

### GET /api/get-export

Recupera un export specifico da `field_kit_exports/`.

**Query Parameters:**
- `org_id` - ID organizzazione
- `indicator_id` - ID indicatore

---

### POST /api/save-export

Salva un export nella cartella `field_kit_exports/`.

**Request Body:**
```json
{
  "exportData": {
    "organization_id": "org-001",
    "indicator_id": "1.1",
    ...
  }
}
```

---

### POST /api/batch-import

Esegue batch import di tutti gli export nella cartella `field_kit_exports/`.

---

### POST /api/generate-synthetic

Genera dati sintetici di test.

---

## ✅ Response Codes

| Code | Meaning |
|------|---------|
| `200` | OK - Richiesta completata con successo |
| `201` | Created - Risorsa creata con successo |
| `400` | Bad Request - Parametri mancanti o non validi |
| `404` | Not Found - Risorsa non trovata |
| `409` | Conflict - Risorsa già esistente |
| `500` | Internal Server Error - Errore del server |

---

## 📝 Examples

### Workflow Completo

#### 1. Crea nuova organizzazione

```bash
curl -X POST http://localhost:3000/api/organizations \
  -H "Content-Type: application/json" \
  -d '{
    "id": "org-acme-001",
    "name": "ACME Corporation",
    "industry": "Technology",
    "size": "enterprise",
    "country": "US",
    "language": "en-US",
    "created_by": "John Doe"
  }'
```

#### 2. Salva un assessment

```bash
curl -X POST http://localhost:3000/api/organizations/org-acme-001/assessments \
  -H "Content-Type: application/json" \
  -d '{
    "indicator_id": "1.1",
    "title": "Unquestioning Compliance with Authority",
    "category": "Authority-Based Vulnerabilities",
    "bayesian_score": 0.75,
    "confidence": 0.85,
    "maturity_level": "red",
    "assessor": "Jane Smith",
    "assessment_date": "2025-01-11T17:00:00Z",
    "raw_data": {
      "quick_assessment": [],
      "client_conversation": {}
    }
  }'
```

#### 3. Visualizza aggregati

```bash
curl http://localhost:3000/api/organizations/org-acme-001/aggregates
```

#### 4. Lista indicatori mancanti

```bash
curl http://localhost:3000/api/organizations/org-acme-001/missing
```

#### 5. Aggiorna metadata organizzazione

```bash
curl -X PUT http://localhost:3000/api/organizations/org-acme-001 \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Updated notes about ACME Corp"
  }'
```

#### 6. Elimina assessment

```bash
curl -X DELETE http://localhost:3000/api/organizations/org-acme-001/assessments/1.1
```

#### 7. Elimina organizzazione

```bash
curl -X DELETE http://localhost:3000/api/organizations/org-acme-001
```

---

### JavaScript/Frontend Examples

#### Fetch organizzazioni

```javascript
const response = await fetch('http://localhost:3000/api/organizations');
const data = await response.json();
console.log(`Total organizations: ${data.metadata.total_organizations}`);
```

#### Crea organizzazione

```javascript
const newOrg = {
  id: 'org-new-001',
  name: 'New Company',
  industry: 'Finance',
  size: 'medium',
  country: 'IT',
  language: 'it-IT'
};

const response = await fetch('http://localhost:3000/api/organizations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newOrg)
});

const result = await response.json();
if (result.success) {
  console.log('Organization created:', result.data.id);
}
```

#### Salva assessment

```javascript
const assessment = {
  indicator_id: '1.1',
  bayesian_score: 0.75,
  confidence: 0.85,
  assessor: 'John Doe',
  assessment_date: new Date().toISOString()
};

const response = await fetch(
  `http://localhost:3000/api/organizations/${orgId}/assessments`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(assessment)
  }
);

const result = await response.json();
console.log('New completion:', result.aggregates.completion.percentage + '%');
```

---

## 🔧 Data Manager (Backend)

Le API utilizzano il modulo `dashboard/lib/dataManager.js` per tutte le operazioni sui file JSON.

**Funzionalità principali:**
- Atomic writes con temp files
- Auto-aggiornamento dell'indice
- Calcolo automatico aggregati Bayesiani
- Tracking completamento (100 indicatori)
- Gestione errori con rollback

---

**Versione API**: 2.0
**Server**: CPF Dashboard Server v2.0
**Data**: 2025-01-11
