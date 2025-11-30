# CPF Auditing Dashboard

## 📋 Panoramica

Dashboard completa per la gestione delle valutazioni CPF (Cognitive Persuasion Framework) con:
- ✅ Gestione organizzazioni e assessment
- ✅ Analisi di maturità e rischio
- ✅ Client moderno con architettura ES6+
- ✅ Sistema multilingua (IT/EN)
- ✅ Export/import dati

---

## 🚀 Quick Start

### 1. Avvio Server

```bash
cd /home/user/CPF/dashboard/auditing

# Opzione A: Python 3 (raccomandato)
python3 -m http.server 8000

# Opzione B: Python 2
python -m SimpleHTTPServer 8000

# Opzione C: Node.js
npx http-server -p 8000
```

### 2. Accesso

- **Dashboard principale**: http://localhost:8000/index.html
- **Test runner**: http://localhost:8000/tests/test-runner.html (solo sviluppo)

### 3. Test Rapidi

```bash
# Validazione veloce (Node.js)
node tests/run-tests-simple.js

# Output atteso:
# ✅ Passed: 21/21 (100%)
```

---

## 📁 Struttura File

### File di Produzione

| File | Scopo | Dimensione |
|------|-------|------------|
| `index.html` | Dashboard principale | 55K |
| `dashboard.js` | Logica applicazione | 169K |
| `client-integrated.js` | Client CPF refactored | 87K |
| `client-integrated.css` | Stili client | 21K |
| `styles.css` | Stili dashboard | 18K |
| `translations.js` | Sistema i18n | 15K |
| `category-descriptions.json` | Metadati categorie | 21K |
| `reference_guide_*.json` | Guide di riferimento | 21K |

### File di Testing (`tests/`)

| File | Scopo |
|------|-------|
| `test-runner.html` | Interfaccia test interattiva |
| `test-suite.js` | Suite di test completa (50+ test) |
| `run-tests-simple.js` | Test runner Node.js |
| `run-tests.js` | Test runner avanzato (richiede jsdom) |
| `index-client-test.html` | Pagina test rapido |

### Script Utility (`scripts/`)

| File | Scopo |
|------|-------|
| `validate-fieldkit.js` | Validazione JSON field kit |

---

## 🏗️ Architettura Client

### Design Class-Based (ES6+)

Il client utilizza un'architettura moderna con 8 classi specializzate:

```
┌─────────────────────────────────────────┐
│         window.CPFClient (API)          │
│  (Compatibile con v2.0)                 │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┴──────────┐
        │                    │
┌───────▼────────┐  ┌────────▼─────────┐
│ Assessment     │  │ Quick Reference  │
│ Manager        │  │ Manager          │
└───────┬────────┘  └──────────────────┘
        │
  ┌─────┴──────┬──────────┬───────────┐
  │            │          │           │
┌─▼──────┐ ┌──▼─────┐ ┌──▼──────┐ ┌──▼──────┐
│ Score  │ │ Field  │ │ Report  │ │  API    │
│ Calc   │ │ Kit    │ │ Gen     │ │ Client  │
└────────┘ └────────┘ └─────────┘ └─────────┘
```

**Classi Principali:**
1. **AssessmentManager** - Gestione dati, auto-save, stato
2. **ScoreCalculator** - Scoring Bayesiano, red flags, maturità
3. **FieldKitRenderer** - Generazione HTML form
4. **ScoreDisplay** - Visualizzazione score
5. **ReportGenerator** - Export PDF
6. **APIClient** - Richieste HTTP
7. **QuickReferenceManager** - Modal guide di riferimento
8. **FileManager** - Import/export JSON

---

## 🧪 Testing

### Opzione 1: Browser Tests (50+ test completi)

**Ideale per:** Feedback visivo, debugging, test completi

```bash
# 1. Avvia server
python3 -m http.server 8000

# 2. Apri nel browser
http://localhost:8000/tests/test-runner.html

# 3. Clicca i pulsanti:
# - 🚀 Run All Tests - Suite completa
# - 📦 Unit Tests - Test per classe
# - ⚡ Performance Tests - Benchmark velocità
# - 🔗 Integration Tests - Workflow completo
```

### Opzione 2: Node.js Tests (21 test rapidi)

**Ideale per:** CI/CD, validazione rapida

```bash
node tests/run-tests-simple.js

# Output:
🧪 CPF CLIENT - QUICK VALIDATION
============================================================
✅ window.CPFClient should be defined
✅ CPFClient should have currentData
...
============================================================
📊 RESULTS
Total: 21
✅ Passed: 21
❌ Failed: 0
Success Rate: 100.0%
🎉 All tests passed!
```

### Opzione 3: Test Manuale

```bash
# 1. Avvia server
python3 -m http.server 8000

# 2. Apri app principale
http://localhost:8000/index.html

# 3. Test workflow:
# - Crea nuova organizzazione
# - Compila assessment per indicatori
# - Verifica calcolo score
# - Export/import dati
# - Genera report PDF
```

---

## 🐍 Setup Backend Python

### Virtual Environment

```bash
# Crea virtual environment
python3 -m venv venv

# Attiva (Linux/macOS)
source venv/bin/activate

# Attiva (Windows)
venv\Scripts\activate

# Installa dipendenze
pip install -r requirements.txt

# Avvia Flask API
flask run

# Disattiva quando finito
deactivate
```

### Dipendenze Core

```txt
# Web Framework
Flask==3.0.0
flask-cors==4.0.0

# Database
SQLAlchemy==2.0.23
psycopg2-binary==2.9.9

# API & Validation
marshmallow==3.20.1
python-dotenv==1.0.0

# Development
pytest==7.4.3
pytest-cov==4.1.0
black==23.11.0
flake8==6.1.0
```

### Configurazione Environment

Crea `.env`:

```bash
# Flask Configuration
FLASK_APP=api/app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-here

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/cpf_db

# API Configuration
API_PORT=5000
API_HOST=0.0.0.0

# CORS
CORS_ORIGINS=http://localhost:8000,http://localhost:3000
```

---

## 💡 API Pubblica (JavaScript)

### Caricamento Indicatore

```javascript
// Carica indicator dal repository
window.CPFClient.loadJSON('9.1', 'EN');
```

### Gestione Metadati

```javascript
window.CPFClient.updateMeta('auditor', 'Mario Rossi');
window.CPFClient.updateMeta('client', 'ACME S.p.A.');
window.CPFClient.updateMeta('date', '2025-01-15');
```

### Aggiornamento Risposte

```javascript
window.CPFClient.updateResponse('question_id', 'answer_value');
```

### Calcolo Score

```javascript
window.CPFClient.calculateIndicatorScore();
console.log(window.CPFClient._manager.currentScore);
```

### Export/Import Dati

```javascript
// Export (download JSON)
window.CPFClient.exportData();

// Import (file input)
<input type="file" onchange="window.CPFClient.importJSON(event)">
```

### Generazione Report

```javascript
// Genera e scarica PDF
window.CPFClient.generateReport();
```

---

## 🔧 Utility Scripts

### Validazione Field Kit

Valida la struttura JSON degli indicatori:

```bash
# Valida singolo indicator
node scripts/validate-fieldkit.js auditor-field-kit/interactive/en-US/1.x-authority/indicator_1.1.json

# Valida tutti gli indicatori di una categoria
for file in auditor-field-kit/interactive/en-US/1.x-authority/*.json; do
  echo "Validating: $file"
  node scripts/validate-fieldkit.js "$file"
done
```

**Controlli Effettuati:**
- ✅ Campi obbligatori (`indicator`, `title`, `category`, `sections`)
- ✅ Struttura sezioni corretta
- ✅ Configurazione scoring
- ✅ Livelli di maturità
- ⚠️ Identificazione schema Bayesiano (9.6-9.10)

---

## 🎯 Obiettivi Raggiunti

| Obiettivo | Status | Dettagli |
|-----------|--------|----------|
| Rimozione IIFE wrapper | ✅ | Usa classi ES6+ |
| Classi ES6+ | ✅ | 8 classi con responsabilità singole |
| Rimozione duplicazione codice | ✅ | 3 funzioni update → 1 consolidata |
| Codice pulito | ✅ | Rimossi commenti e codice morto |
| Separazione concerns | ✅ | Ogni classe ha responsabilità singola |
| API completa | ✅ | API `window.CPFClient` completa |
| Test automatizzati | ✅ | 21 Node.js + 50+ browser tests |
| Documentazione | ✅ | README completo + guide |

---

## 🐛 Troubleshooting

### Problema: "CPFClient namespace not available"

```javascript
// Verifica caricamento
console.log(window.CPFClient);

// Controlla:
// 1. client-integrated.js è caricato?
// 2. Errori JavaScript in console?
// 3. Path del file corretto?
```

### Problema: Test falliscono in Node.js

```bash
# Verifica versione Node (richiede 14+)
node --version

# Re-run tests
node tests/run-tests-simple.js

# Verifica sintassi
node -c client-integrated.js
```

### Problema: Server non si avvia

```bash
# Porta già in uso?
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Usa porta diversa
python3 -m http.server 8001
```

### Problema: Modifiche non appaiono nel browser

```
1. Hard refresh: Ctrl+Shift+R (Win/Linux) o Cmd+Shift+R (Mac)
2. Svuota cache
3. Verifica console per errori
4. Verifica che il file sia stato salvato
```

---

## 📝 Workflow Sviluppo

### Aggiungere Nuova Feature

1. **Identifica la classe**
   ```
   Logica dati → AssessmentManager
   Scoring → ScoreCalculator
   Rendering → FieldKitRenderer
   ```

2. **Aggiungi metodo**
   ```javascript
   class AssessmentManager {
       // ... metodi esistenti

       nuovaFeature() {
           // Il tuo codice qui
       }
   }
   ```

3. **Esponi via API (se necessario)**
   ```javascript
   window.CPFClient = {
       // ... metodi esistenti
       nuovaFeature() {
           assessmentManager.nuovaFeature();
       }
   };
   ```

4. **Scrivi test**
   ```javascript
   // In test-suite.js
   runner.it('should do nuova feature', () => {
       window.CPFClient.nuovaFeature();
       runner.assertTrue(/* assertion */);
   });
   ```

5. **Test e commit**
   ```bash
   node tests/run-tests-simple.js
   git add .
   git commit -m "Add nuova feature"
   git push
   ```

---

## 🚦 Status Progetto

### Stato Attuale
✅ **Production-ready** - Tutti i test passano (21/21)

### Testato
- ✅ Compatibilità API con v2.0
- ✅ Accuratezza calcolo score
- ✅ Persistenza dati
- ✅ Funzionalità import/export
- ✅ Compatibilità cross-browser

### Non Ancora Testato in Produzione
- ⏳ Integrazione dashboard su larga scala
- ⏳ Utenti concorrenti multipli
- ⏳ Dataset grandi (100+ indicatori)

### Limitazioni Conosciute
- Usa ancora handler inline `onclick` (possibile migrazione a event delegation)
- File singolo (possibile split in ES6 modules)
- Vista dettaglio score non completamente implementata

---

## 🌍 Sistema Multilingua

Il dashboard supporta italiano e inglese:

```javascript
// Switch lingua automatico dai pulsanti EN/IT nell'header
// Le traduzioni sono in translations.js

// Struttura traduzioni
const auditingTranslations = {
  en: {
    "header.title": "CPF Auditing Dashboard",
    "sidebar.title": "Organizations",
    // ...
  },
  it: {
    "header.title": "CPF Dashboard Auditing",
    "sidebar.title": "Organizzazioni",
    // ...
  }
};
```

---

## 📞 Supporto

### Ottenere Aiuto

1. **Controlla questo README** prima
2. **Esegui test** per identificare problemi
3. **Controlla console browser** per errori
4. **Leggi** documentazione script in `scripts/README.md`

### Segnalazione Bug

Include nel report:
1. Cosa stavi cercando di fare
2. Cosa è successo invece
3. Errori console browser
4. Risultati test (`node tests/run-tests-simple.js`)
5. Passi per riprodurre

### Contribuire

1. Fork repository
2. Crea feature branch
3. Fai modifiche
4. Scrivi test
5. Invia pull request

---

## 📄 Licenza

Vedi file LICENSE del repository principale.

---

## ✨ Sommario

**CPF Auditing Dashboard** è una dashboard moderna, manutenibile e completamente testata per la valutazione CPF con architettura pulita per sviluppo futuro.

**Pronto all'uso:**
```bash
cd /home/user/CPF/dashboard/auditing
python3 -m http.server 8000
# Apri http://localhost:8000
```

**Domande?** Controlla `scripts/README.md` per script utility o esamina i file di test per esempi d'uso.

---

**Versione**: 3.0 (Refactored)
**Ultima modifica**: 2025-01-30
**Maintainer**: CPF Team
