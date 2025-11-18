# CPF Data Schemas

Schema JSON per la validazione dei dati delle organizzazioni e degli assessment CPF.

## Contenuto

### `organization_index_schema.json`

Schema JSON per il file indice delle organizzazioni (`organizations_index.json`).

**Definisce:**
- Metadata (version, last_updated, total_organizations)
- Array organizations con campi base
- Statistics (total_assessments, completion_percentage, overall_risk, etc.)

**Utilizzo:**
```javascript
const schema = require('./organization_index_schema.json');
const Ajv = require('ajv');
const ajv = new Ajv();
const validate = ajv.compile(schema);

const valid = validate(indexData);
if (!valid) {
  console.error(validate.errors);
}
```

### `organization_data_schema.json`

Schema JSON per i file dati singola organizzazione (`organizations/org-{id}.json`).

**Definisce:**
- Organization metadata (id, name, industry, size, country, language, etc.)
- Assessments structure (per ogni indicator 1.1-10.10)
- Aggregates (overall_risk, by_category, completion, etc.)
- Assessment details (bayesian_score, confidence, raw_data, etc.)

**Utilizzo:**
```javascript
const schema = require('./organization_data_schema.json');
const Ajv = require('ajv');
const ajv = new Ajv();
const validate = ajv.compile(schema);

const valid = validate(orgData);
if (!valid) {
  console.error(validate.errors);
}
```

## Campi Principali

### Organization Index

```json
{
  "metadata": {
    "version": "2.0",
    "last_updated": "ISO 8601",
    "total_organizations": number
  },
  "organizations": [
    {
      "id": "string",
      "name": "string",
      "industry": "enum",
      "size": "enum",
      "country": "ISO 3166-1",
      "language": "locale",
      "created_at": "ISO 8601",
      "updated_at": "ISO 8601",
      "stats": { ... }
    }
  ]
}
```

### Organization Data

```json
{
  "id": "string",
  "name": "string",
  "metadata": { ... },
  "assessments": {
    "1.1": {
      "indicator_id": "1.1",
      "title": "string",
      "category": "string",
      "bayesian_score": 0.0-1.0,
      "confidence": 0.0-1.0,
      "maturity_level": "green|yellow|red",
      "assessor": "string",
      "assessment_date": "ISO 8601",
      "raw_data": { ... }
    }
  },
  "aggregates": {
    "overall_risk": 0.0-1.0,
    "overall_confidence": 0.0-1.0,
    "trend": "improving|stable|deteriorating",
    "by_category": { ... },
    "completion": { ... }
  }
}
```

## Validazione

### Setup

```bash
npm install ajv ajv-formats
```

### Script di Validazione

```javascript
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const fs = require('fs');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// Carica schema
const schema = JSON.parse(
  fs.readFileSync('./organization_data_schema.json', 'utf8')
);
const validate = ajv.compile(schema);

// Valida file
const data = JSON.parse(
  fs.readFileSync('../organizations/org-001.json', 'utf8')
);

if (validate(data)) {
  console.log('✓ Valid');
} else {
  console.error('✗ Invalid:', validate.errors);
}
```

## Enumerazioni

### Industry
- `Technology`
- `Finance`
- `Healthcare`
- `Retail`
- `Education`
- `Manufacturing`
- `Government`

### Size
- `small` (1-50 dipendenti)
- `medium` (51-500 dipendenti)
- `enterprise` (500+ dipendenti)

### Maturity Level
- `green` - Low risk (0.00-0.33)
- `yellow` - Medium risk (0.34-0.66)
- `red` - High risk (0.67-1.00)

### Trend
- `improving` - Risk in diminuzione
- `stable` - Risk stabile
- `deteriorating` - Risk in aumento

## Riferimenti

- **Data Storage Guide**: `/dashboard/data/README.md`
- **API Documentation**: `/dashboard/docs/API_DOCUMENTATION.md`
- **Implementation**: `/dashboard/lib/dataManager.js`

## Versione Schema

- **Version**: 2.0
- **Last Updated**: 2025-01-11
- **JSON Schema Standard**: Draft-07
