# SOC Dashboard Documentation

Documentazione tecnica per la SOC Dashboard CPF.

## Contenuto

### `CPF_SOC_SIEM_Integration_Comprehensive_Paper.html`

Paper comprensivo sull'integrazione SOC/SIEM con il framework CPF.

**Formato**: HTML interattivo
**Argomenti:**
- Architettura integrazione SOC-CPF
- Metodologia Bayesiana cross-indicatore
- Analisi multi-organizzazione
- Visualizzazioni e dashboard
- Case studies

### `index.html`

Pagina indice della documentazione con link a tutte le risorse.

## Paper Principale

### Sezioni del Paper

1. **Executive Summary**
   - Overview integrazione
   - Benefici chiave
   - ROI stimato

2. **CPF Framework Fundamentals**
   - 10 categorie vulnerabilità psicologiche
   - 100 indicatori
   - Modello di scoring

3. **SIEM Integration Architecture**
   - Event ingestion pipeline
   - Connector architecture
   - Real-time processing
   - Storage layer

4. **Bayesian Inference Engine**
   - Cross-indicator analysis
   - Category dependencies
   - Overall risk calculation
   - Confidence modeling

5. **Multi-Organization Analysis**
   - Organization management
   - Comparative analytics
   - Benchmarking
   - Industry verticals

6. **Dashboard & Visualizations**
   - Overall Risk Score
   - Category Heatmap
   - Security Radar Chart
   - Prioritization Matrix
   - Convergence Timeline
   - Indicator Matrix 10×10

7. **Real-time Updates**
   - WebSocket architecture
   - Event streaming
   - Dashboard synchronization
   - Performance optimization

8. **Export & Reporting**
   - PDF generation
   - Excel export
   - Custom reports
   - API access

9. **Case Studies**
   - Enterprise deployment
   - Healthcare scenario
   - Financial services
   - Government sector

10. **Performance & Scalability**
    - Throughput metrics
    - Memory optimization
    - Database performance
    - Concurrent users

11. **Security & Compliance**
    - Authentication
    - Authorization
    - Data protection
    - Audit logging

12. **Future Developments**
    - ML/AI integration
    - Predictive analytics
    - Advanced correlation
    - Mobile access

## Visualizzazioni

Il paper include:

### Diagrammi Architetturali
```
┌────────────────────────────────────────────────┐
│  SIEM Platforms (12+)                         │
│  Splunk | QRadar | Sentinel | CrowdStrike...  │
└──────────────────┬─────────────────────────────┘
                   ↓
┌────────────────────────────────────────────────┐
│  SOC Simulator                                 │
│  - Event Generator                             │
│  - Scenario Engine                             │
│  - CPF Adapter                                 │
└──────────────────┬─────────────────────────────┘
                   ↓
┌────────────────────────────────────────────────┐
│  Bayesian Inference Engine                     │
│  - Score Calculation                           │
│  - Category Dependencies                       │
│  - Overall Risk                                │
└──────────────────┬─────────────────────────────┘
                   ↓
┌────────────────────────────────────────────────┐
│  SOC Dashboard                                 │
│  - Real-time Updates (WebSocket)               │
│  - Multi-org Management                        │
│  - Visualizations & Charts                     │
└────────────────────────────────────────────────┘
```

### Screenshot Dashboard
- Overall risk score display
- Category heatmap visualization
- Security radar chart
- Indicator matrix 10×10
- Prioritization table
- Convergence timeline

### Formule Matematiche

#### Overall Risk Score
```
R_overall = Σ(R_cat_i × W_i)

dove:
R_cat_i = Risk score categoria i
W_i = Peso categoria i
Σ(W_i) = 1.0
```

#### Category Risk
```
R_cat = Σ(I_j × C_j) / Σ(C_j)

dove:
I_j = Indicator score (0.0-1.0)
C_j = Confidence indicator j
```

#### Bayesian Network
```
P(V_i | E) = P(E | V_i) × P(V_i) / P(E)

dove:
V_i = Vulnerabilità indicatore i
E = Eventi SIEM osservati
```

## Utilizzo Paper

### Lettura Online

```bash
# Apri in browser
open dashboard/soc/documentation/CPF_SOC_SIEM_Integration_Comprehensive_Paper.html

# O con server HTTP
cd dashboard/soc/documentation
python3 -m http.server 8080
# Vai a http://localhost:8080
```

### Navigation

Il paper HTML include:
- **Table of Contents** - Navigazione rapida
- **Anchor links** - Link tra sezioni
- **Code blocks** - Esempi interattivi
- **Image galleries** - Screenshot dashboard
- **References** - Bibliografia e link

### Interattività

Features HTML:
- Collapse/expand sezioni
- Copy code blocks
- Zoom immagini
- Dark/light theme (se implementato)

## Utilizzo per Stakeholder

### Per Management
- **Executive Summary** - Overview high-level
- **Case Studies** - Esempi reali
- **ROI Analysis** - Benefici economici

### Per Security Teams
- **Architecture** - Design tecnico
- **Integration Guide** - Setup pratico
- **Performance Metrics** - Benchmark

### Per Developers
- **API Documentation** - Endpoint completi
- **Code Examples** - Esempi funzionanti
- **Extension Guide** - Come estendere

### Per Auditors
- **Security Section** - Compliance
- **Data Protection** - Privacy
- **Audit Logging** - Tracciabilità

## Formati Disponibili

| Formato | File | Uso |
|---------|------|-----|
| HTML | `CPF_SOC_SIEM_Integration_Comprehensive_Paper.html` | Lettura interattiva online |
| PDF | (generabile da HTML) | Distribuzione offline |
| Markdown | (disponibile se richiesto) | Editing e versioning |

### Generare PDF da HTML

```bash
# Con wkhtmltopdf
wkhtmltopdf CPF_SOC_SIEM_Integration_Comprehensive_Paper.html \
  CPF_SOC_SIEM_Integration_Paper.pdf

# Con Chrome headless
chrome --headless --print-to-pdf=output.pdf \
  CPF_SOC_SIEM_Integration_Comprehensive_Paper.html
```

## Citazioni

Se utilizzi questo paper in ricerca o presentazioni:

```
[Da completare con dettagli pubblicazione]
CPF SOC/SIEM Integration: A Comprehensive Framework
for Psychological Vulnerability Detection in Cybersecurity
Authors: [...]
Organization: CPF Team
Year: 2025
```

## Versioni

- **v1.0** (2025-11-18) - Release iniziale
- Future: aggiornamenti con ML/AI integration

## Riferimenti Correlati

### Documentazione Tecnica
- **SOC Dashboard**: `/dashboard/soc/README.md`
- **Simulatore**: `/dashboard/simulator/README.md`
- **Bayesian Engine**: `/dashboard/soc/bayesian.js`
- **API Docs**: `/dashboard/docs/API_DOCUMENTATION.md`

### Paper Accademici
- **Dense Foundation Paper**: `/CPF_Implementation_Companion___Dense_Foundation_Paper.pdf`
- **Bayesian Cross-Indicator**: `/dashboard/docs/papers/`

### Implementazioni
- **Detection Engine**: `/dashboard/cpf-detection-engine/README.md`
- **Practical Guide**: `/dashboard/cpf-detection-engine/CPF_PRACTICAL_IMPLEMENTATION_GUIDE.md`

## Feedback e Contributi

Per feedback sul paper:
- Issues GitHub
- Email authors
- Discussion forum

Per contribuire:
1. Proponi modifiche/aggiunte
2. Fornisci esempi aggiuntivi
3. Segnala errori o imprecisioni
4. Suggerisci nuove sezioni

## Licenza

[Da specificare]
