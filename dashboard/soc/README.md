# CPF SOC Dashboard

Dashboard per l'analisi SOC/SIEM con inferenza Bayesiana cross-indicatore multi-organizzazione.

## Panoramica

Dashboard avanzata per l'analisi di sicurezza che integra dati da sistemi SIEM con il framework CPF utilizzando analisi Bayesiana per identificare vulnerabilità psicologiche nelle organizzazioni.

## Cosa Contiene

### File Principali
- `index.html` - Interfaccia dashboard SOC
- `dashboard.js` - Logica dashboard e gestione organizazioni
- `bayesian.js` - Motore di inferenza Bayesiana
- `visualizations.js` - Libreria visualizzazioni e chart

### Dati e Configurazioni
- `category-descriptions.json` - Metadati categorie CPF
- `documentation/` - Documentazione tecnica e paper

## Funzionalità

### Gestione Organizzazioni
- **Sidebar organizzazioni** - Gestione multi-org con search/sort
- **Creazione/modifica** - CRUD completo organizzazioni
- **Trash management** - Soft delete con restore
- **Multi-language** - Supporto lingue multiple

### Analisi e Visualizzazioni
- **Overall Risk Score** - Score Bayesiano pesato aggregato
- **Category Heatmap** - 10 categorie CPF con livelli rischio
- **Security Radar Chart** - Visualizzazione ragnatela
- **Prioritization Matrix** - Ordinamento priorità remediation
- **Convergence Chart** - SOC vs Human assessment timeline
- **Indicator Matrix 10×10** - Click per drill-down dettagliato

### Real-time Updates
- **WebSocket integration** - Aggiornamenti live da simulatore SIEM
- **Auto-refresh** - Sincronizzazione automatica dati
- **Event streaming** - Ricezione eventi in tempo reale

### Export e Reporting
- **PDF Export** - Report completi organizzazione
- **Excel Export** - Dati tabulari per analisi
- **Dashboard snapshots** - Salvataggio stato visualizzazioni

## Motore Bayesiano

Il file `bayesian.js` implementa:

### 1. Merge SOC + Human Data
```javascript
// SOC values pesati per confidence
// Human assessments pesati 1.5× (più affidabili)
bayesian_score = (SOC × confidence + Human × 1.5) / (confidence + 1.5)
```

### 2. Category Risk Calculation
- Aggrega 10 indicatori per categoria
- Calcola media, varianza, confidence
- Applica pesi differenziati per categoria

### 3. Bayesian Network Inference
Dipendenze cross-categoria:
- Authority risk alto → aumenta Social risk (+30%)
- Stress risk alto → aumenta Cognitive risk (+25%)
- AI-Enhanced risk alto → amplifica Unconscious bias (+20%)
- Modello completo con 45+ dipendenze

### 4. Overall Risk Score
```
Overall Risk = Σ(Category_Risk × Category_Weight)

Pesi:
- Authority: 12%
- AI-Enhanced: 12%
- Stress: 11%
- Altri: 10-8%
```

### 5. Prioritization Matrix
```
Priority Score = (Risk × Weight) + (Downstream_Impact × 0.1)

Raccomandazioni:
- Priority > 0.70 → 🔴 Critical
- Priority 0.40-0.70 → 🟡 Review
- Priority < 0.40 → 🟢 Monitor
```

## Utilizzo

```bash
# Avvia server
node server.js

# Apri dashboard SOC
http://localhost:3000/dashboard/soc/

# Workflow tipico:
# 1. Crea organizzazione (click "New Organization")
# 2. Avvia simulatore SIEM (/dashboard/simulator/)
# 3. Osserva aggiornamenti real-time
```

## Integrazione

La dashboard si integra con:
- **SOC Simulator** (`/dashboard/simulator/`) - Generazione eventi SIEM
- **Detection Engine** (`/dashboard/cpf-detection-engine/`) - Rilevamento vulnerabilità
- **Auditing Dashboard** (`/dashboard/auditing/`) - Assessment manuali
- **WebSocket Server** (`server.js`) - Real-time communication

## Visualizzazioni

Il file `visualizations.js` fornisce wrapper per:
- **Chart.js** - Grafici a barre, linee, radar
- **Heatmap** - Mappe di calore categorie
- **Matrix visualization** - Griglie 10×10 indicatori
- **Trend charts** - Timeline convergenza SOC/Human

## Documentazione

- `/dashboard/soc/documentation/` - Paper tecnici e guide
- `/dashboard/README.md` - Guida completa sistema
- `/dashboard/docs/API_DOCUMENTATION.md` - API reference

## Riferimenti

- Simulatore SIEM: `/dashboard/simulator/README.md`
- Detection Engine: `/dashboard/cpf-detection-engine/README.md`
- Framework CPF: https://cpf3.org
