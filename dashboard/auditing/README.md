# CPF Auditing Dashboard

Dashboard per il tracciamento del progresso degli assessment e l'analisi del rischio CPF.

## Panoramica

Questo è il **Dashboard Auditing principale** (versione 2) che combina:
- **Progress Tracking** - Monitoraggio completamento assessment
- **Risk Analysis** - Analisi Bayesiana del rischio organizzativo
- **Client Field Kit** - Tool integrato per assessment manuali

## Cosa Contiene

### File Principali
- `index.html` - Interfaccia principale dashboard
- `dashboard.js` - Logica dashboard e gestione stato
- `styles.css` - Stili specifici dashboard
- `client-integrated.js` - Client Field Kit integrato (v2)
- `client-integrated.css` - Stili client

### Dati e Configurazioni
- `category-descriptions.json` - Descrizioni categorie CPF
- `reference_guide_en-US.json` - Guida di riferimento (inglese)
- `reference_guide_it-IT.json` - Guida di riferimento (italiano)

### Script Utility
- `scripts/` - Script di validazione e utility

## Funzionalità

### Tab 1: Progress Tracking
- Percentuale completamento complessiva (0-100%)
- Progress bar per categoria
- Matrice 10×10 indicatori (verde=completato, grigio=mancante)
- Lista indicatori mancanti

### Tab 2: Risk Analysis
- Overall Risk Score (Bayesian aggregato)
- Category Heatmap (visualizzazione livelli rischio)
- Prioritization Matrix (ordinamento remediation)
- Convergence Chart (SOC vs Human timeline)
- Indicator Grid (100 tile con drill-down)

## Utilizzo

```bash
# Avvia server
node server.js

# Apri dashboard
http://localhost:3000/dashboard/auditing/
```

## Integrazione

La dashboard si integra con:
- **Field Kit Exports** - Import JSON da assessment
- **SOC Dashboard** - Dati real-time da simulatore SIEM
- **API REST** - Backend per CRUD organizzazioni e assessment

## Versioni

- **v2** (questa cartella) - Versione stabile attuale
- **v3** (`/dashboard/auditing-v3/`) - Versione refactorizzata con client ES6+

## Riferimenti

- Documentazione completa: `/dashboard/README.md`
- Client v3: `/dashboard/auditing-v3/README.md`
- API: `/dashboard/docs/API_DOCUMENTATION.md`
