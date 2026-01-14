# CPF Agentic Framework - Documentazione Italiana

Questa directory contiene la documentazione in lingua italiana per i componenti del CPF Agentic Framework.

## 📚 Documenti

### CPF Security Orchestrator
**File**: `CPF_Security_Orchestrator.tex`, `CPF_Security_Orchestrator.pdf`

Guida completa all'**Orchestratore di Sicurezza CPF** - un sistema di automazione della sicurezza basato su AI che sfrutta il rilevamento delle vulnerabilità CPF per la mitigazione proattiva delle minacce.

**Argomenti Chiave**:
- Architettura e design del sistema
- Integrazione con l'infrastruttura di sicurezza esistente (SIEM, EDR, IAM)
- Flussi di risposta automatizzati basati su indicatori di rischio psicologico
- Strategie di monitoraggio e intervento in tempo reale
- Pattern di deployment con preservazione della privacy

**Casi d'Uso**:
- Rilevamento automatico di vulnerabilità di conformità all'autorità nei tentativi di phishing
- Monitoraggio delle vulnerabilità temporali (pattern di attività fuori orario)
- Valutazione del carico cognitivo per contesti decisionali critici
- Analisi delle dinamiche di gruppo in ambienti collaborativi

---

## Panoramica dell'Integrazione di Sistema

```
┌─────────────────────────────────────────────────────────────┐
│              Orchestratore di Sicurezza CPF                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐      ┌──────────────┐      ┌───────────┐ │
│  │ CPF SLM Core │ ───> │ Risk Engine  │ ───> │ Esecutore │ │
│  │ (Rilevatore) │      │  (Analisi)   │      │ Risposte  │ │
│  └──────────────┘      └──────────────┘      └───────────┘ │
│         │                      │                     │       │
│         v                      v                     v       │
│  ┌──────────────┐      ┌──────────────┐      ┌───────────┐ │
│  │ Sorgenti Dati│      │   Dashboard  │      │   SIEM    │ │
│  │ (Email, Chat)│      │  (Report)    │      │ /SOAR API │ │
│  └──────────────┘      └──────────────┘      └───────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Avvio Rapido

### Per i Team di Sicurezza
1. **Comprendere l'Architettura**: Leggere `CPF_Security_Orchestrator.pdf`
2. **Pianificare l'Integrazione**: Identificare gli strumenti di sicurezza esistenti per l'integrazione con l'orchestratore
3. **Validare l'Implementazione**: Seguire il protocollo di testing (disponibile nella documentazione inglese)

### Per i Ricercatori
1. **Fondamenti Teorici**: Esplorare la ricerca CPF sul framework agentico
2. **Metodologia**: Rivedere i protocolli di test per il design della ricerca
3. **Validazione**: Utilizzare il protocollo per test adversarial

### Per gli Sviluppatori
1. **Specifiche Tecniche**: Estrarre i requisiti di sistema dalla documentazione dell'orchestratore
2. **Framework di Testing**: Implementare la validazione secondo il protocollo di test
3. **Integrazione AI**: Applicare le intuizioni per considerazioni sulla sicurezza degli LLM

---

## Benchmark delle Prestazioni

| Componente | Metrica | Target |
|------------|---------|--------|
| **Rilevamento CPF** | Tempo di inferenza | < 15ms |
| **Analisi del Rischio** | Latenza di elaborazione | < 50ms |
| **Esecuzione Risposta** | Ritardo azione | < 200ms |
| **End-to-End** | Latenza totale sistema | < 300ms |
| **Privacy** | Esternalizzazione dati | Zero |

---

## Caratteristiche Principali

### 🛡️ Sicurezza Proattiva
- Rilevamento delle vulnerabilità pre-cognitive prima dello sfruttamento
- Interventi automatizzati contestualmente appropriati
- Apprendimento dai pattern comportamentali organizzativi

### 🔒 Privacy by Design
- Deployment completo on-premise
- Zero trasmissione dati verso l'esterno
- Conformità GDPR nativa
- Anonimizzazione automatica

### ⚡ Prestazioni Elevate
- Inferenza in tempo reale (< 15ms)
- Analisi del rischio sub-50ms
- Risposta end-to-end < 300ms
- Scalabilità orizzontale

### 🔗 Integrazione Completa
- API standard per SIEM/SOAR
- Connettori per piattaforme email/chat
- Dashboard di monitoraggio in tempo reale
- Export dati per analytics

---

## Le 10 Categorie di Vulnerabilità CPF

L'orchestratore rileva e risponde a 10 distinte categorie di vulnerabilità psicologica:

| Categoria | Descrizione |
|-----------|-------------|
| **Conformità all'Autorità** | Obbedienza acritica all'autorità apparente |
| **Vulnerabilità Temporali** | Vigilanza ridotta durante orari non standard |
| **Prova Sociale** | Seguire altri senza verifica |
| **Stati Affettivi** | Decisioni basate su paura o emozioni |
| **Carico Cognitivo** | Affaticamento da alert e deplezione dell'attenzione |
| **Dinamiche di Gruppo** | Groupthink che crea blind spot di sicurezza |
| **Fattori di Stress** | Stress cronico che porta a decisioni sbagliate |
| **Proiezioni Inconsce** | Psicologia dell'ombra che influenza la percezione delle minacce |
| **Bias AI** | Antropomorfizzazione dei sistemi AI |
| **Condizioni Convergenti** | Allineamento di multiple vulnerabilità |

---

## Documentazione Correlata

- **Directory Principale**: `../README.md` - Panoramica del Framework Agentico
- **Documentazione Inglese**: `../en-US/README.md` - Documentazione completa in inglese
- **CPF Core**: `../../README.md` - Fondamenti dell'implementazione CPF
- **Guida Deployment**: `../../CPF Deployment Tutorial - Local & Cloud.md`

---

## Requisiti Tecnici

### Hardware Minimo
- **CPU**: Intel Core i5 o equivalente
- **RAM**: 8GB (16GB raccomandati)
- **Storage**: 10GB spazio disponibile
- **GPU**: Opzionale (migliora le prestazioni)

### Dipendenze Software
- Python 3.8+
- Docker (per deployment containerizzato)
- Supporto CUDA (opzionale, per accelerazione GPU)

---

## Licenza

Quest'opera è distribuita sotto licenza **CC BY-NC-ND 4.0** (Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International).

Non sono permesse opere derivate o uso commerciale senza autorizzazione esplicita.

---

## Contatti

**Giuseppe Canale, CISSP**
Ricercatore Indipendente
kaolay@gmail.com
ORCID: 0009-0007-3263-6897

Per domande tecniche, richieste di collaborazione o opportunità di pilot testing, contattare direttamente.

---

## Note

Per la documentazione tecnica completa, inclusi i protocolli di testing e la ricerca su Silicon Psyche, fare riferimento alla documentazione in inglese nella directory `../en-US/`.
