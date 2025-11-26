# CPF Dashboard Documentation

Documentazione tecnica e guide per il sistema CPF Dashboard.

## Contenuto

### Documenti Principali

#### `USER_GUIDE.html`
Guida utente completa per l'utilizzo delle dashboard CPF.

**Contenuto:**
- Introduzione al sistema
- Workflow di utilizzo
- Gestione organizzazioni
- Esecuzione assessment
- Interpretazione risultati
- Troubleshooting

#### `API_DOCUMENTATION.md`
Documentazione completa delle API REST del sistema.

**Sezioni:**
- Endpoint organizzazioni
- Endpoint assessment
- Endpoint simulatore SOC
- WebSocket events
- Autenticazione e sicurezza
- Esempi di utilizzo

#### `INTEGRATION.md`
Guida all'integrazione del sistema CPF con sistemi esterni.

**Contenuto:**
- Architettura integrazioni
- Connessioni SIEM
- Import/Export dati
- API esterne
- Webhook e callbacks
- Esempi codice

### Sottocartelle

#### `papers/`
Paper accademici e documenti di ricerca sul framework CPF.

**Contenuto:**
- Paper Bayesian Cross-Indicator Inference (PDF + LaTeX)
- Paper SOC/SIEM Integration
- Ricerche psicologiche
- Documentazione matematica

## Struttura

```
docs/
├── README.md                        # Questo file
├── USER_GUIDE.html                  # Guida utente
├── API_DOCUMENTATION.md             # API reference
├── INTEGRATION.md                   # Guida integrazioni
└── papers/                          # Paper accademici
    ├── Bayesian_Cross_Indicator_Inference...pdf
    └── Bayesian_Cross_Indicator_Inference...tex
```

## Utilizzo

### Leggere la Documentazione

```bash
# Aprire User Guide in browser
open dashboard/docs/USER_GUIDE.html

# Leggere API documentation
cat dashboard/docs/API_DOCUMENTATION.md

# Leggere Integration guide
cat dashboard/docs/INTEGRATION.md
```

### Paper Accademici

I paper sono disponibili in:
- **PDF** - Per lettura diretta
- **LaTeX** - Sorgente per modifiche e compilazione

```bash
# Visualizzare PDF
open dashboard/docs/papers/Bayesian_Cross_Indicator_Inference...pdf

# Compilare LaTeX (se modificato)
cd dashboard/docs/papers
pdflatex Bayesian_Cross_Indicator_Inference...tex
```

## Documentazione Aggiuntiva

### Per Componente

Ogni componente ha la sua documentazione specifica:

- **Dashboard Principale**: `/dashboard/README.md`
- **SOC Dashboard**: `/dashboard/soc/README.md`
- **Auditing Dashboard**: `/dashboard/auditing/README.md`
- **Simulatore SIEM**: `/dashboard/simulator/README.md`
- **Detection Engine**: `/dashboard/cpf-detection-engine/README.md`
- **Certificate Generator**: `/dashboard/certificate/README.md`
- **PostgreSQL**: `/dashboard/postgres/README.md`

### Guide Specializzate

- **Quick Start**: `/dashboard/README.md` (sezione Quick Start)
- **Database Setup**: `/dashboard/postgres/DATABASE_SETUP.md`
- **Client Guide**: `/dashboard/auditing/README-CLIENT.md`

## Contribuire

Per contribuire alla documentazione:

1. Segui il formato Markdown per consistenza
2. Aggiungi esempi di codice dove possibile
3. Mantieni sezioni chiare e ben strutturate
4. Aggiorna l'indice quando aggiungi nuove sezioni
5. Valida i link e riferimenti

## Riferimenti

- **CPF Framework**: https://cpf3.org
- **Repository GitHub**: (se pubblico)
- **Issue Tracker**: (se disponibile)

## Versione

- **Versione Documentazione**: 2.0
- **Ultima Revisione**: 2025-11-18
- **Mantenuto da**: CPF Team
