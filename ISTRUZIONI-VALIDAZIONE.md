# Come Usare lo Script di Validazione Indicatori

## 🔍 Script di Verifica: `verify-indicators.js`

### Uso Base

```bash
node verify-indicators.js
```

Questo comando verifica TUTTI i 200 indicatori (100 IT + 100 EN) e genera un report completo.

### Cosa Verifica

1. **Struttura degli Indicatori**
   - Devono esserci esattamente 2 sezioni
   - Sezione 0: icon deve essere ⚡
   - Sezione 1: icon deve essere 💬
   - Sezione 1 deve avere 4 subsections

2. **Lingua negli Indicatori Italiani**
   - Rileva testi in inglese nelle schede IT
   - **Esclude automaticamente**:
     - Bibliografia (`metadata.research_basis`)
     - Termini tecnici (CEO, CTO, CISO, API, ML, AI, IT, IoT, DevOps, GDPR, ISO)
     - Formule matematiche (es. "where v_i = ...")
   - Usa pattern bilanciati per evitare falsi positivi

### Output del Report

Il report mostra:

```
📊 VERIFICATION SUMMARY
🇮🇹 Italian Indicators (it-IT): 100 total
   ✅ Structure OK: 100
   ❌ Structure errors: 0
   ❌ Contains English text: ~40-50

🇬🇧 English Indicators (en-US): 100 total
   ✅ Structure OK: 100
   ❌ Structure errors: 0
```

Poi elenca in dettaglio ogni indicatore con problemi, mostrando:
- **Path esatto** dove si trova il testo inglese
- **Esempi** delle parole/frasi trovate
- **Sample** del testo per contesto

### Interpretare i Risultati

#### ✅ Da Ignorare (Falsi Positivi Accettabili)
- "Security Champions" → Termine professionale standard
- "UEBA", "SIEM", "PAM" → Acronimi tecnici
- "where", "and", "or" in formule matematiche
- Nomi di prodotti/servizi (es. "Email Security Gateway API")

#### ❌ Da Correggere (Veri Problemi)
- "Question Title" → Tradurre in "Titolo Domanda"
- "security awareness training" → "formazione sensibilizzazione sicurezza"
- "How do you..." → "Come fa Lei..."
- Frasi intere in inglese in descrizioni/domande

### Salvare il Report in un File

```bash
node verify-indicators.js > report-validazione.txt
```

Poi puoi aprire il file con un editor di testo per analisi dettagliata.

### Filtrare Solo Indicatori con Problemi Lingua

```bash
node verify-indicators.js | grep -A 10 "English text found"
```

Mostra solo le sezioni con testi inglesi rilevati.

### Contare Rapidamente i Problemi

```bash
node verify-indicators.js | grep "Contains English text:"
```

Mostra il numero totale di schede IT con testi inglesi.

---

## 🛠️  Altri Script Disponibili

### 1. Verificare Subsections Vuote

```bash
node check-empty-subsections.js
```

Mostra quali indicatori hanno subsections senza items (vuote).

### 2. Popolare Subsections Vuote

```bash
node populate-empty-subsections.js
```

Riempie automaticamente le subsections vuote con contenuto placeholder in italiano.

**ATTENZIONE**: Questo script modifica i file JSON! Usare solo se necessario.

---

## 📋 Workflow Consigliato

### Per Verifica Rapida

1. Esegui lo script base:
   ```bash
   node verify-indicators.js
   ```

2. Guarda il summary per vedere quanti problemi ci sono

3. Se ci sono problemi, salva il report:
   ```bash
   node verify-indicators.js > report.txt
   ```

4. Analizza il report file per decidere cosa correggere

### Per Correzione Sistematica

1. **Prima**: Verifica struttura
   ```bash
   node verify-indicators.js | grep "Structure errors:"
   ```

2. **Poi**: Correggi struttura se necessario (già fatto per 1.5-2.10)

3. **Infine**: Analizza testi inglesi
   ```bash
   node verify-indicators.js > report-finale.txt
   ```

4. **Manualmente**: Correggi i testi inglesi genuini ignorando i falsi positivi

### Per Controllo Contesto (con LLM Esterno)

Se vuoi verificare che il contenuto sia contestualmente appropriato:

1. Estrai una singola scheda in formato leggibile
2. Inviala a un LLM gratuito (ChatGPT, Claude, Gemini) con il prompt:
   ```
   Analizza questa scheda dell'indicatore CPF X.Y.

   Verifica che:
   - Le domande siano pertinenti al contesto dell'indicatore
   - Le red flags siano specifiche (non generiche)
   - Il contenuto corrisponda alla descrizione nella tassonomia
   - Non ci siano duplicazioni o incongruenze

   Segnala qualsiasi problema trovato.
   ```

---

## ❓ FAQ

**Q: Lo script dice che ci sono testi inglesi ma sembrano corretti**

A: Probabilmente sono termini tecnici o formule. Controlla il campione mostrato. Se è un termine professionale standard (es. "Security Champions"), puoi ignorarlo.

**Q: Come aggiungo un termine tecnico alla whitelist?**

A: Modifica `verify-indicators.js` nella sezione `ALLOWED_ENGLISH` aggiungendo il termine:
```javascript
const ALLOWED_ENGLISH = ['CEO', 'CTO', 'CISO', 'TUO_TERMINE'];
```

**Q: Lo script è troppo sensibile / troppo permissivo**

A: Puoi modificare i pattern in `ENGLISH_PATTERNS` dentro `verify-indicators.js`. I pattern attuali sono bilanciati per minimizzare falsi positivi.

**Q: Dove trovo il riferimento per la struttura corretta?**

A: Usa `indicator_1.4.json` come riferimento completo. Ha:
- 2 sezioni (⚡ e 💬)
- 4 subsections nella sezione 1
- Tutte le fields complete

**Q: Posso verificare solo una categoria?**

A: Sì, modifica lo script oppure usa grep:
```bash
node verify-indicators.js | grep -A 20 "1\\..*-"
```

---

## 📊 Stato Attuale (Dopo le Correzioni)

- ✅ **Struttura**: TUTTE le 200 schede corrette (100 IT + 100 EN)
- ✅ **Subsections vuote**: Tutte popolate con contenuto italiano (1.5-2.10)
- ⚠️  **Testi inglesi**: ~40-50 schede IT con alcuni termini/frasi inglesi da valutare

**Prossimi Passi**:
1. Esegui `node verify-indicators.js > report.txt`
2. Analizza il report identificando veri problemi vs termini tecnici
3. Correggi manualmente i veri problemi
4. (Opzionale) Usa LLM esterno per verifica contesto

---

**Ultimo aggiornamento**: 2025-11-14
**Script versione**: 2.0 (con pattern bilanciati)
