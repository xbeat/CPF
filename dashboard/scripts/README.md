# CPF Dashboard Scripts

Questa cartella contiene script utili per la gestione dei dati della dashboard CPF.

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

### 2. `generate_field_kit_assessments.js`

Genera assessment realistici (100 indicatori) pronti per l'import nella dashboard.

**Uso:**
```bash
node dashboard/scripts/generate_field_kit_assessments.js
```

**Funzionalità:**
- Genera 100 Field Kit assessment completi (tutti gli indicatori 1.1 - 10.10)
- Usa profili di industry per generare score realistici
- Applica bias basati sulla dimensione dell'organizzazione
- Simula risposte a Quick Assessment e Client Conversation

**Profili Industry:**
- **Technology**: Alta pressione temporale, stress elevato
- **Finance**: Alta autorità, rigidità temporale, stress moderato
- **Healthcare**: Massima autorità, stress molto elevato
- **Manufacturing**: Dinamiche di gruppo forti
- **Retail**: Alta pressione sociale

**Output:**
- File JSON export pronti per batch import
- Ogni file contiene assessment completo con raw_data

---

### 3. `generate_synthetic_data.js`

Genera dati sintetici combinando assessment SOC e Human per testing avanzato.

**Uso:**
```bash
node dashboard/scripts/generate_synthetic_data.js
```

**Funzionalità:**
- Crea 8 organizzazioni con dati storici (30 giorni)
- Simula assessment SOC giornalieri
- Simula audit umani settimanali
- Genera trend realistici e drift analysis

**Configurazione:**
```javascript
CONFIG = {
  num_organizations: 8,
  days_history: 30,
  soc_frequency_days: 1,      // SOC assessa ogni giorno
  human_frequency_days: 7      // Human audit settimanale
}
```

**Output:**
```
/dashboard/data/organizations.json    # File unico con tutte le org + storico
```

---

### 4. `batch_import.js`

Importa Field Kit export nella dashboard e genera report di progresso.

**Uso:**
```bash
node dashboard/scripts/batch_import.js <folder_path>
```

**Esempio:**
```bash
node dashboard/scripts/batch_import.js ./field_kit_exports/
```

**Funzionalità:**
- Scansiona cartella per file `*dashboard_export*.json`
- Valida struttura dei file export
- Importa assessment nella dashboard
- Genera `auditing_results.json` con statistiche

**Validazione:**
- Verifica presenza di `organization_id`
- Verifica presenza di `indicator_id`
- Verifica presenza di `indicator_data`
- Skip file non validi con warning

**Output:**
```
/dashboard/data/auditing_results.json    # Report di import con:
  - Lista assessment importati
  - Statistiche per organizzazione
  - Completion rate
  - Errori e warning
```

---

## 🔧 Requisiti

Tutti gli script richiedono **Node.js** installato.

```bash
# Verifica versione Node.js
node --version    # Richiede >= 14.x
```

Nessuna dipendenza npm necessaria - usano solo moduli Node.js nativi.

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

### Generazione Dati di Test Avanzati

```bash
# 1. Genera dati sintetici SOC + Human
node dashboard/scripts/generate_synthetic_data.js

# 2. Genera Field Kit assessments realistici
node dashboard/scripts/generate_field_kit_assessments.js

# 3. Import batch (se hai export esterni)
node dashboard/scripts/batch_import.js ./exports/
```

---

## ⚠️ Note Importanti

1. **Preservazione Dati**: `generate_demo_organizations.js` NON sovrascrive organizzazioni esistenti - aggiunge solo nuove
2. **Language Field**: Tutte le organizzazioni generate hanno il campo `metadata.language` correttamente impostato
3. **File-based Storage**: Il sistema usa JSON files, NON PostgreSQL (che è disponibile ma non attivo)
4. **Backup**: Prima di rigenerare dati, fai backup della cartella `/dashboard/data/`

---

## 🐛 Troubleshooting

**Problema: "Field Kit not found"**
- **Causa**: Gli indicatori per quella lingua non esistono nel repository
- **Soluzione**: Verifica che esistano i file in `/auditor-field-kit/interactive/{language}/`

**Problema: Assessment non salvati**
- **Causa**: Manca il campo `language` nell'organizzazione
- **Soluzione**: Le organizzazioni generate da `generate_demo_organizations.js` hanno già il campo corretto

**Problema: Organizzazioni duplicate**
- **Causa**: ID già esistente
- **Soluzione**: Lo script skippa automaticamente organizzazioni con ID duplicati

---

**Versione**: 2.0
**Ultima modifica**: 2025-01-15
**Maintainer**: CPF Team
