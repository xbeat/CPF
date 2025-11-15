# CPF Dashboard Scripts

Script utili per la gestione dei dati della dashboard CPF.

## 📄 Script Disponibili

### 1. `generate_demo_organizations.js`

Genera 5 organizzazioni demo con assessment random per testing della dashboard.

**Uso:**
```bash
node dashboard/scripts/generate_demo_organizations.js
```

**Funzionalità:**
- Crea 5 organizzazioni demo con settori diversi (Technology, Finance, Healthcare, Retail, Education)
- Genera assessment random per 30-70% degli indicatori (100 totali)
- Salva i dati in formato JSON file-based
- **Preserva organizzazioni esistenti** - aggiunge solo nuove, non sovrascrive
- Genera automaticamente statistiche e aggregati per ogni organizzazione

**Output:**
```
/dashboard/data/organizations_index.json      # Indice organizzazioni
/dashboard/data/organizations/
  ├── org-demo-001.json                       # TechCorp Global (en-US)
  ├── org-demo-002.json                       # FinanceFirst Bank (en-US)
  ├── org-demo-003.json                       # HealthPlus Clinic (it-IT)
  ├── org-demo-004.json                       # RetailMax Store (de-DE)
  └── org-demo-005.json                       # EduLearn Academy (fr-FR)
```

**Caratteristiche:**
- ✅ Campo `language` correttamente impostato in `metadata.language`
- ✅ Completion rate: 30-70% random
- ✅ Overall risk: distribuzione realistica (20% low, 50% medium, 30% high)
- ✅ Aggregati per categoria calcolati automaticamente
- ✅ Date di assessment distribuite negli ultimi 90 giorni

**Reset/Pulizia:**
```bash
# Per cancellare tutti i dati demo e ripartire da zero
rm -f dashboard/data/organizations_index.json
rm -rf dashboard/data/organizations/
```

---

### 2. `validate-and-fix-indicators.js`

Valida e corregge automaticamente problemi comuni nei Field Kit JSON.

**Uso:**
```bash
# Valida tutti gli indicatori
node dashboard/scripts/validate-and-fix-indicators.js

# Valida solo una lingua specifica
node dashboard/scripts/validate-and-fix-indicators.js --lang en-US

# Valida e correggi automaticamente
node dashboard/scripts/validate-and-fix-indicators.js --fix

# Valida solo una categoria
node dashboard/scripts/validate-and-fix-indicators.js --category 1
```

**Cosa Valida:**
- ✅ Campi obbligatori (indicator, title, category, sections)
- ✅ Formato indicator ID (X.Y)
- ✅ Struttura sezioni e items
- ✅ Scoring configuration e maturity levels
- ✅ Quick Assessment options e scores
- ✅ Red flags configuration

**Auto-Fix Applicati:**
- 🔧 Corregge indicator ID sbagliato
- 🔧 Normalizza scoring weights a somma 1.0
- 🔧 Normalizza question weights a somma 1.0
- 🔧 Aggiunge score di default (0.5) a opzioni senza score
- 🔧 Clamp score a range 0.0-1.0
- 🔧 Cap red flags total impact a 1.0
- 🔧 Aggiunge maturity levels mancanti

**Output:**
```
📊 Validation Report:
  ✅ Valid: 95 indicators
  ⚠️  Warnings: 3 indicators
  ❌ Errors: 2 indicators

🔧 Auto-fixes applied: 12
  - Normalized weights: 5
  - Added default scores: 4
  - Clamped scores: 3
```

**Opzioni:**
```bash
--lang <code>       # Valida solo una lingua (en-US, it-IT, etc.)
--category <num>    # Valida solo una categoria (1-10)
--fix               # Applica correzioni automatiche
--verbose           # Output dettagliato
--dry-run           # Simula fix senza salvare
```

---

## 🔧 Requisiti

Tutti gli script richiedono **Node.js** installato.

```bash
# Verifica versione Node.js
node --version    # Richiede >= 14.x
```

---

## 📊 Workflow Tipico

### Setup Iniziale Dashboard con Dati Demo

```bash
# 1. Genera 5 organizzazioni demo
node dashboard/scripts/generate_demo_organizations.js

# 2. Avvia dashboard
node dashboard/server.js

# 3. Apri browser
open http://localhost:3000/dashboard/auditing/
```

### Validazione e Fix Field Kit

```bash
# 1. Valida tutti gli indicatori
node dashboard/scripts/validate-and-fix-indicators.js

# 2. Applica correzioni automatiche
node dashboard/scripts/validate-and-fix-indicators.js --fix

# 3. Valida solo una lingua
node dashboard/scripts/validate-and-fix-indicators.js --lang it-IT --fix
```

---

## ⚠️ Note Importanti

1. **Preservazione Dati**: `generate_demo_organizations.js` NON sovrascrive organizzazioni esistenti
2. **Language Field**: Campo `metadata.language` sempre presente nelle org generate
3. **Auto-Fix Safety**: `validate-and-fix-indicators.js` crea backup prima di modificare
4. **File-based Storage**: Sistema usa JSON files, NON PostgreSQL

---

## 🐛 Troubleshooting

**Problema: "Field Kit not found"**
- **Causa**: Indicatori per quella lingua non esistono
- **Soluzione**: Verifica path `/auditor-field-kit/interactive/{language}/`

**Problema: Assessment non salvati**
- **Causa**: Manca campo `language` nell'organizzazione
- **Soluzione**: Organizzazioni da `generate_demo_organizations.js` hanno già il campo

**Problema: Score calculation failed**
- **Causa**: Pesi di scoring non sommano a 1.0
- **Soluzione**: Esegui `validate-and-fix-indicators.js --fix`

---

**Versione**: 2.0
**Ultima modifica**: 2025-01-15
**Maintainer**: CPF Team
