# CPF Field Kit - Italiano (it-IT)

## Panoramica

Questa directory contiene le versioni in **lingua italiana** di tutti gli indicatori CPF (Cybersecurity Psychology Framework). Questi file JSON sono traduzioni delle versioni master in inglese (en-US).

## Informazioni sulla Lingua

- **Codice Lingua**: `it-IT`
- **Lingua**: Italiano (Italia)
- **Status**: Traduzione da en-US
- **Indicatori Totali**: 100 (10 categorie × 10 indicatori ciascuna)

## Struttura delle Directory

```
it-IT/
├── 1.x-authority/          # Vulnerabilità Basate sull'Autorità
│   ├── indicator_1.1.json
│   ├── indicator_1.2.json
│   ├── indicator_1.3.json
│   └── ...
├── 2.x-temporal/           # Vulnerabilità Temporali
├── 3.x-social/             # Vulnerabilità da Influenza Sociale
├── 4.x-affective/          # Vulnerabilità Affettive
├── 5.x-cognitive/          # Vulnerabilità da Sovraccarico Cognitivo
├── 6.x-group/              # Vulnerabilità delle Dinamiche di Gruppo
├── 7.x-stress/             # Vulnerabilità da Risposta allo Stress
├── 8.x-unconscious/        # Vulnerabilità dei Processi Inconsci
├── 9.x-ai/                 # Vulnerabilità Specifiche dell'AI
└── 10.x-convergent/        # Stati Convergenti Critici
```

## Struttura JSON

Ogni file JSON segue lo schema standardizzato con testo tradotto in italiano:

```json
{
  "indicator": "X.Y",
  "title": "FIELD KIT INDICATORE X.Y",
  "subtitle": "Nome Specifico della Vulnerabilità",
  "category": "Nome Categoria",
  "version": "1.0",
  "description": { ... },
  "scoring": {
    "method": "bayesian_weighted",
    "weights": { ... },
    "question_weights": { ... }
  },
  "detection_formula": { ... },
  "data_sources": [ ... ],
  "interdependencies": { ... },
  "sections": [
    {
      "id": "quick-assessment",
      "title": "Valutazione Rapida",
      "items": [ ... ]
    },
    {
      "id": "client-conversation",
      "title": "Guida alla Conversazione con il Cliente",
      "subsections": [ ... ]
    }
  ],
  "validation": { ... },
  "remediation": { ... },
  "risk_scenarios": [ ... ],
  "metadata": {
    "language": "it-IT",
    "language_name": "Italiano (Italia)",
    "is_translation": true,
    "translated_from": "en-US",
    "translation_date": "YYYY-MM-DD",
    "translator": "Nome Traduttore",
    "created_date": "YYYY-MM-DD",
    "last_modified": "YYYY-MM-DD",
    "version_history": []
  }
}
```

## Utilizzo

### Caricamento nel Client Interattivo

Utilizza il client interattivo CPF Field Kit per caricare e valutare gli indicatori:

1. Apri `cpf_client_json.html` in un browser web
2. Clicca sul pulsante "Load JSON"
3. Inserisci il codice indicatore: `X.Y-IT`

Esempi:
- `1.3-IT` → Carica l'indicatore 1.3 dalla versione italiana
- `2.5-IT` → Carica l'indicatore 2.5 dalla versione italiana
- `1.3` → Carica dalla versione inglese (default)

### Validazione

Per validare qualsiasi file JSON, usa il pulsante "Validate JSON" nel client dopo il caricamento, oppure:

```javascript
// Nella console del browser o in Node.js
const { validateCPFJSON } = require('./validator.js');
const data = require('./it-IT/1.x-authority/indicator_1.3.json');
const result = validateCPFJSON(data);
console.log(result);
```

## Linee Guida per la Traduzione

### Cosa Tradurre

✅ **DA TRADURRE**:
- Titoli e sottotitoli
- Descrizioni
- Testi delle domande
- Etichette delle opzioni
- Linee guida per le conversazioni
- Scenari di rischio
- Soluzioni di remediation
- Descrizioni nei metadata

### Cosa NON Tradurre

❌ **MANTENERE IN INGLESE**:
- Chiavi JSON (`"indicator"`, `"title"`, `"scoring"`, ecc.)
- Formule matematiche
- Sintassi delle formule di detection
- Citazioni di ricerca e riferimenti bibliografici
- Identificatori (`"id"`, `"q1_verification_process"`, ecc.)
- Nomi di campi tecnici

### Esempio di Traduzione Corretta

```json
{
  "question": "Quando i dipendenti ricevono richieste insolite da apparenti figure di autorità, qual è la procedura di verifica standard?",
  "guidance": "Cercare esempi specifici di verifica multi-canale e politiche documentate.",
  "options": [
    {
      "label": "Nessuna procedura formale",
      "score": 1.0
    },
    {
      "label": "Verifica su singolo canale",
      "score": 0.5
    },
    {
      "label": "Verifica multi-canale obbligatoria",
      "score": 0.0
    }
  ]
}
```

## Standard di Qualità

Tutti i file JSON in questa directory devono:

- ✅ Superare `validator.js` con 0 errori
- ✅ Seguire il pattern dello schema dell'indicatore 1.3
- ✅ Include metadati completi con informazioni di traduzione
- ✅ Avere testo tradotto accuratamente e naturalmente in italiano
- ✅ Mantenere la coerenza terminologica
- ✅ Preservare la struttura JSON originale
- ✅ Mantenere tutti i riferimenti di ricerca in inglese

## Riferimento Categorie

| Codice | Categoria | Descrizione |
|--------|-----------|-------------|
| 1.x | Vulnerabilità Basate sull'Autorità | Obbedienza all'autorità, strutture gerarchiche |
| 2.x | Vulnerabilità Temporali | Pressione temporale, rischi indotti dall'urgenza |
| 3.x | Vulnerabilità da Influenza Sociale | Principi di Cialdini, pressione dei pari |
| 4.x | Vulnerabilità Affettive | Rischi emotivi e basati sull'attaccamento |
| 5.x | Vulnerabilità da Sovraccarico Cognitivo | Sovraccarico informativo, affaticamento decisionale |
| 6.x | Vulnerabilità delle Dinamiche di Gruppo | Pensiero di gruppo, inconscio collettivo |
| 7.x | Vulnerabilità da Risposta allo Stress | Risposte di lotta/fuga/congelamento/sottomissione |
| 8.x | Vulnerabilità dei Processi Inconsci | Proiezione dell'ombra, meccanismi di difesa |
| 9.x | Vulnerabilità Specifiche dell'AI | Rischi dell'interazione uomo-AI |
| 10.x | Stati Convergenti Critici | Tempeste perfette, fallimenti a cascata |

## Workflow di Traduzione

Per creare nuove traduzioni:

1. **Copia** il file JSON da en-US alla directory it-IT
2. **Traduci** tutto il testo rivolto all'utente in italiano naturale
3. **Mantieni** in inglese: chiavi JSON, formule, citazioni
4. **Aggiorna** i metadata:
   ```json
   "metadata": {
     "language": "it-IT",
     "language_name": "Italiano (Italia)",
     "is_translation": true,
     "translated_from": "en-US",
     "translation_date": "2025-11-08",
     "translator": "Nome Cognome"
   }
   ```
5. **Valida** usando `validator.js`
6. **Testa** nel client interattivo con formato `X.Y-IT`

## Terminologia Standard

Mantieni la coerenza con questi termini:

| English | Italiano |
|---------|----------|
| Field Kit | Field Kit (mantenere) |
| Indicator | Indicatore |
| Assessment | Valutazione |
| Quick Assessment | Valutazione Rapida |
| Red Flags | Segnali di Allarme |
| Maturity Level | Livello di Maturità |
| Vulnerability | Vulnerabilità |
| Remediation | Remediation (o Rimedio) |
| Risk Scenario | Scenario di Rischio |
| Detection Formula | Formula di Detection |

## Supporto

- **Documentazione**: `/auditor field kit/interactive/PROMPT_TEMPLATE.md`
- **Validatore**: `/auditor field kit/interactive/validator.js`
- **Client**: `/auditor field kit/interactive/cpf_client_json.html`
- **Repository**: https://github.com/xbeat/CPF

## Controllo Versione

Questa è una **directory di traduzione**. Gli aggiornamenti devono:

1. Seguire le modifiche della versione master en-US
2. Essere validati prima del commit
3. Documentare le modifiche in metadata.version_history
4. Mantenere la sincronizzazione con la versione sorgente

## Contributi

Per contribuire alle traduzioni italiane:

1. Verifica la versione master en-US più recente
2. Traduci seguendo le linee guida sopra
3. Valida con validator.js
4. Testa nel client interattivo
5. Invia una pull request con descrizione dettagliata

---

**Ultimo Aggiornamento**: 2025-11-08
**Versione Framework**: CPF v1.0
**Status**: Sviluppo Attivo
**Lingua Sorgente**: en-US
