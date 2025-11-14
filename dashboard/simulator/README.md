# CPF SOC/SIEM Simulator

## 📋 Panoramica

Il **CPF SOC/SIEM Simulator** è un sistema di simulazione che genera dati realistici provenienti da SIEM, SOC e EDR per alimentare la Dashboard SOC durante lo sviluppo, senza dipendere da infrastrutture di sicurezza reali.

### Architettura

```
Dashboard SOC ← API ← Connettori ← Simulatore
                         ↑
                    (Dev: Simulatore)
                    (Prod: SIEM/SOC reali)
```

### Vantaggi

✅ **Sviluppo Indipendente**: Nessuna dipendenza da SIEM/SOC reali
✅ **Testing Riproducibile**: Scenari controllati e ripetibili
✅ **Transizione Facile**: Stessi connettori per dev e produzione
✅ **Dati Realistici**: Basati su CPF Dense Foundation e matematica formale

---

## 🚀 Quick Start

### 1. Avviare il Simulatore

```bash
cd dashboard
SIMULATOR_MODE=true npm start
```

Il server partirà su `http://localhost:3000` con il simulatore attivo.

### 2. Verificare lo Stato

```bash
curl http://localhost:3000/api/simulator/status
```

Risposta:
```json
{
  "enabled": true,
  "running": false,
  "sources": ["splunk", "qradar", "sentinel", "crowdstrike"],
  "uptime": 0
}
```

### 3. Avviare la Simulazione

```bash
curl -X POST http://localhost:3000/api/simulator/start \
  -H "Content-Type: application/json" \
  -d '{"orgId": "acme-corp-001", "sources": ["splunk", "crowdstrike"]}'
```

### 4. Visualizzare nella Dashboard

Apri `http://localhost:3000/dashboard/soc/` e seleziona l'organizzazione simulata.

---

## 🎯 Hands-On Guide - Workflow Completo

### Opzione A: Workflow Browser + Terminale (Raccomandato per iniziare)

#### Step 1: Avvia Server
```bash
cd dashboard
SIMULATOR_MODE=true npm start
```

Vedrai nel log:
```
🎭 [Simulator] Mode ENABLED
📚 [DenseLoader] Loaded 100 indicators from 10 categories
🔌 [Simulator] API routes registered
```

#### Step 2: Crea Organizzazione (via terminale)
```bash
curl -X POST http://localhost:3000/api/organizations \
  -H "Content-Type: application/json" \
  -d '{
    "id": "demo-company-001",
    "name": "Demo Company",
    "industry": "Technology",
    "size": "medium",
    "country": "IT",
    "language": "it-IT"
  }'
```

Oppure usa la dashboard auditing: http://localhost:3000/dashboard/auditing/

#### Step 3: Avvia Simulazione (via terminale)
```bash
# Scenario normale (baseline)
curl -X POST http://localhost:3000/api/simulator/start \
  -H "Content-Type: application/json" \
  -d '{
    "orgId": "demo-company-001",
    "scenario": "normal",
    "sources": ["splunk", "crowdstrike"],
    "rate": 10
  }'
```

**Risposta:**
```json
{
  "success": true,
  "message": "Simulator started",
  "orgId": "demo-company-001",
  "config": {
    "sources": ["splunk", "crowdstrike"],
    "scenario": "normal",
    "rate": 10
  }
}
```

#### Step 4: Apri Dashboard nel Browser
1. Vai a: **http://localhost:3000/dashboard/soc/**
2. Nella sidebar sinistra, clicca su **"Demo Company"**
3. Vedrai in tempo reale:
   - 📊 **Overall Risk** che si aggiorna
   - 🔥 **Category Heatmap** che si popola
   - 🎯 **Indicator Grid** con indicatori colorati
   - 📋 **Prioritization Table** con raccomandazioni

#### Step 5: Prova Scenari di Attacco
```bash
# Ferma simulazione normale
curl -X POST http://localhost:3000/api/simulator/stop \
  -H "Content-Type: application/json" \
  -d '{"orgId": "demo-company-001"}'

# Avvia scenario phishing
curl -X POST http://localhost:3000/api/simulator/scenario \
  -H "Content-Type: application/json" \
  -d '{
    "orgId": "demo-company-001",
    "scenario": "phishing-campaign",
    "duration": 300,
    "intensity": "high"
  }'
```

**Torna al browser** → Vedrai i valori di rischio salire drammaticamente nelle categorie Social (3.x) e Affective (4.x)! 🚨

#### Step 6: Monitora Stato
```bash
# Stato simulatore
curl http://localhost:3000/api/simulator/status | jq

# Report scenario attivo
curl http://localhost:3000/api/simulator/scenario/demo-company-001 | jq

# Dati organizzazione aggiornati
curl http://localhost:3000/api/organizations/demo-company-001 | jq
```

---

### Opzione B: Workflow Solo Terminale (Advanced)

```bash
# 1. Avvia server
SIMULATOR_MODE=true npm start &

# 2. Attendi 2 secondi
sleep 2

# 3. Crea organizzazione
curl -X POST http://localhost:3000/api/organizations \
  -H "Content-Type: application/json" \
  -d '{"id":"test-001","name":"Test Org","industry":"Tech","size":"small","country":"US"}'

# 4. Lista scenari disponibili
curl http://localhost:3000/api/simulator/scenarios | jq '.scenarios[] | {id, name, intensity}'

# 5. Avvia scenario ransomware (critico!)
curl -X POST http://localhost:3000/api/simulator/scenario \
  -H "Content-Type: application/json" \
  -d '{
    "orgId": "test-001",
    "scenario": "ransomware-attack",
    "duration": 60,
    "intensity": "critical"
  }'

# 6. Monitora progress
watch -n 2 'curl -s http://localhost:3000/api/simulator/scenario/test-001 | jq ".report.status"'

# 7. Dopo 60 secondi, verifica dati
curl http://localhost:3000/api/organizations/test-001/aggregates | jq

# 8. Ferma simulatore
curl -X POST http://localhost:3000/api/simulator/stop \
  -H "Content-Type: application/json" \
  -d '{"orgId":"test-001"}'
```

---

### Opzione C: Demo Veloce (1 minuto)

```bash
# Terminal 1: Avvia server
cd dashboard && SIMULATOR_MODE=true npm start

# Terminal 2: Demo script
curl -X POST http://localhost:3000/api/organizations \
  -d '{"id":"quick-demo","name":"Quick Demo","industry":"Finance","size":"large","country":"IT"}' \
  -H "Content-Type: application/json" && \
curl -X POST http://localhost:3000/api/simulator/start \
  -d '{"orgId":"quick-demo","scenario":"phishing-campaign","rate":20}' \
  -H "Content-Type: application/json" && \
sleep 5 && \
curl http://localhost:3000/api/organizations/quick-demo | jq '.aggregates.overall_risk'
```

**Poi apri browser**: http://localhost:3000/dashboard/soc/ → Seleziona "Quick Demo" ✅

---

## 📺 Cosa Vedere nella Dashboard

Quando apri **http://localhost:3000/dashboard/soc/** con simulazione attiva vedrai:

### 1. Sidebar - Lista Organizzazioni
- 🏢 Nome organizzazione
- 📊 Statistiche: Assessments, Risk Level, Confidence
- ✅ Clicca per selezionare

### 2. Overall Risk Card
- 🎯 Risk Value (0-100%)
- 📈 Trend (increasing/stable/decreasing)
- 🔒 Confidence Level
- 📅 Last Updated (si aggiorna in tempo reale)

### 3. Category Heatmap
- 🔥 10 tile (Authority, Temporal, Social, Affective, Cognitive, Group, Stress, Unconscious, AI, Convergent)
- Colori: 🟢 Low → 🟡 Medium → 🔴 High
- **Durante phishing**: Social (3.x) e Affective (4.x) diventano rossi
- **Durante ransomware**: Stress (7.x) e Convergent (10.x) esplodono

### 4. Indicator Grid (10x10)
- 100 celle (1.1 → 10.10)
- Click su cella → Dettaglio indicatore
- Colori cambiano in base al rischio

### 5. Prioritization Table
- Categorie ordinate per priorità
- Raccomandazioni: Monitor / Review / Critical
- Downstream Impact

---

## 🎬 Scenari Disponibili

| Scenario | Durata | Intensità | Indicatori Principali | Descrizione |
|----------|--------|-----------|----------------------|-------------|
| **normal** | continuo | low | 1.1, 2.1, 3.1 | Operazioni baseline normali |
| **phishing-campaign** | 1h | high | 3.x, 4.x, 8.x | Campagna phishing mirata |
| **ransomware-attack** | 2h | critical | 4.x, 7.x, 10.x | Ransomware multi-stage |
| **insider-threat** | 3h | medium | 1.x, 6.x, 8.x | Minaccia interna |
| **apt-intrusion** | 24h | critical | 5.x, 8.x, 10.x | Advanced Persistent Threat |
| **credential-stuffing** | 30min | high | 1.x, 7.x | Credential stuffing automatizzato |
| **supply-chain-compromise** | 4h | critical | 3.x, 9.x, 10.x | Compromissione supply chain |
| **ddos-attack** | 1h | high | 5.x, 7.x | DDoS con stress operativo |

---

## 🔧 Comandi Utili

```bash
# Status simulatore
curl http://localhost:3000/api/simulator/status | jq

# Lista SIEM disponibili
curl http://localhost:3000/api/simulator/sources | jq '.sources[] | {id, name, type}'

# Lista scenari
curl http://localhost:3000/api/simulator/scenarios | jq '.scenarios[] | {id, name, duration, intensity}'

# Verifica organizzazioni
curl http://localhost:3000/api/organizations | jq

# Dettagli organizzazione
curl http://localhost:3000/api/organizations/ORGID | jq

# Aggregati (rischio totale)
curl http://localhost:3000/api/organizations/ORGID/aggregates | jq

# Ferma simulatore per org
curl -X POST http://localhost:3000/api/simulator/stop \
  -d '{"orgId":"ORGID"}' -H "Content-Type: application/json"

# Verifica assessments creati
curl http://localhost:3000/api/organizations/ORGID/assessments | jq '. | length'
```

---

## ⚠️ Note Importanti

### Simulatore NON Attivo
Se avvii il server **senza** `SIMULATOR_MODE=true`:
```bash
npm start  # Simulatore DISABILITATO
```

Le API simulatore ritorneranno:
```json
{
  "success": false,
  "error": "Simulator not enabled",
  "message": "Set SIMULATOR_MODE=true to enable simulator"
}
```

### Rate Limiting
- Default rate: **10 eventi/secondo**
- Per test veloci: `"rate": 50`
- Per test realistici: `"rate": 5`

### Durata Scenari
- `duration: 0` = infinito (fino a stop manuale)
- `duration: 300` = 5 minuti
- Lo scenario si ferma automaticamente alla fine

### Refresh Dashboard
La dashboard **non** fa auto-refresh. Per vedere nuovi dati:
1. Ricarica pagina (F5)
2. Oppure ri-seleziona l'organizzazione dalla sidebar

**TODO**: Implementare WebSocket per aggiornamenti real-time

---

## 📁 Struttura

```
simulator/
├── config/
│   ├── sources.json       # Configurazione SIEM/SOC/EDR
│   └── scenarios.json     # Scenari di attacco predefiniti
├── generators/
│   ├── index.js              # Orchestratore principale
│   ├── dense-loader.js       # Carica CPF dense foundation
│   ├── siem-data-generator.js # Genera eventi SIEM-like
│   └── scenario-engine.js    # Simula scenari di attacco
├── connectors/
│   ├── base-connector.js      # Interfaccia comune
│   ├── splunk-connector.js    # Connettore Splunk
│   ├── qradar-connector.js    # Connettore IBM QRadar
│   ├── sentinel-connector.js  # Connettore Microsoft Sentinel
│   └── crowdstrike-connector.js # Connettore CrowdStrike
├── adapters/
│   └── cpf-adapter.js         # Mappa SIEM data → CPF indicators
└── README.md
```

---

## 🔌 API Endpoints

### GET `/api/simulator/status`
Restituisce lo stato corrente del simulatore.

**Risposta:**
```json
{
  "enabled": true,
  "running": false,
  "sources": ["splunk", "qradar", "sentinel", "crowdstrike"],
  "activeOrganizations": [],
  "uptime": 0,
  "eventsGenerated": 0
}
```

### POST `/api/simulator/start`
Avvia il simulatore per una specifica organizzazione.

**Body:**
```json
{
  "orgId": "acme-corp-001",
  "sources": ["splunk", "crowdstrike"],
  "scenario": "normal",
  "rate": 10
}
```

**Parametri:**
- `orgId`: ID organizzazione target
- `sources`: Array di SIEM/EDR da simulare (opzionale, default: tutti)
- `scenario`: Scenario da simulare (opzionale, default: "normal")
- `rate`: Eventi/secondo (opzionale, default: 10)

**Risposta:**
```json
{
  "success": true,
  "message": "Simulator started",
  "orgId": "acme-corp-001",
  "sources": ["splunk", "crowdstrike"],
  "scenario": "normal"
}
```

### POST `/api/simulator/stop`
Ferma il simulatore.

**Body:**
```json
{
  "orgId": "acme-corp-001"
}
```

### GET `/api/simulator/sources`
Lista tutti i SIEM/SOC/EDR disponibili.

**Risposta:**
```json
{
  "sources": [
    {
      "id": "splunk",
      "name": "Splunk Enterprise",
      "type": "SIEM",
      "version": "9.x",
      "enabled": true
    },
    {
      "id": "qradar",
      "name": "IBM QRadar",
      "type": "SIEM",
      "version": "7.5",
      "enabled": true
    }
  ]
}
```

### POST `/api/simulator/scenario`
Esegue uno scenario specifico.

**Body:**
```json
{
  "orgId": "acme-corp-001",
  "scenario": "phishing-campaign",
  "duration": 3600,
  "intensity": "high"
}
```

**Scenari disponibili:**
- `normal`: Operazioni normali
- `phishing-campaign`: Campagna phishing
- `ransomware-attack`: Attacco ransomware
- `insider-threat`: Minaccia interna
- `apt-intrusion`: Advanced Persistent Threat
- `credential-stuffing`: Credential stuffing

### GET `/api/simulator/events/stream` (SSE)
Stream eventi in tempo reale (Server-Sent Events).

**Esempio (JavaScript):**
```javascript
const eventSource = new EventSource('/api/simulator/events/stream?orgId=acme-corp-001');

eventSource.addEventListener('siem-event', (e) => {
  const event = JSON.parse(e.data);
  console.log('SIEM Event:', event);
});
```

---

## ⚙️ Configurazione

### sources.json

Configurazione dei SIEM/SOC/EDR da simulare:

```json
{
  "sources": [
    {
      "id": "splunk",
      "name": "Splunk Enterprise",
      "type": "SIEM",
      "version": "9.x",
      "enabled": true,
      "eventTypes": [
        "authentication",
        "network_traffic",
        "malware_detected",
        "policy_violation"
      ],
      "connector": "./connectors/splunk-connector.js"
    }
  ]
}
```

### scenarios.json

Scenari di attacco predefiniti:

```json
{
  "scenarios": [
    {
      "id": "phishing-campaign",
      "name": "Phishing Campaign",
      "description": "Simulates a targeted phishing campaign",
      "duration": 3600,
      "indicators": {
        "3.1": 0.85,
        "4.2": 0.72,
        "8.3": 0.68
      },
      "events": [
        {
          "type": "email_suspicious",
          "count": 150,
          "distribution": "normal"
        }
      ]
    }
  ]
}
```

---

## 🔄 Modalità Operative

### Development Mode (con Simulatore)

```bash
# Avvia con simulatore attivo
SIMULATOR_MODE=true npm start

# Oppure modifica .env
echo "SIMULATOR_MODE=true" >> .env
npm start
```

In questa modalità:
- ✅ Simulatore disponibile
- ✅ Genera dati sintetici
- ✅ Connettori mappano dati simulati → CPF
- ✅ Dashboard SOC riceve dati in tempo reale

### Production Mode (con SIEM reali)

```bash
# Avvia senza simulatore
npm start

# Oppure
SIMULATOR_MODE=false npm start
```

In questa modalità:
- ❌ Simulatore disabilitato
- ✅ Connettori si collegano a SIEM/SOC reali
- ✅ Stessi endpoint API
- ✅ Nessun cambio di codice richiesto

---

## 📊 SIEM/SOC/EDR Supportati

### SIEM (Security Information and Event Management)

| Sistema | Tipo | Simulato | Produzione |
|---------|------|----------|------------|
| **Splunk Enterprise** | SIEM | ✅ | 🔧 WIP |
| **IBM QRadar** | SIEM | ✅ | 🔧 WIP |
| **Microsoft Sentinel** | SIEM (Cloud) | ✅ | 🔧 WIP |
| **Elastic Security** | SIEM | 🔧 Planned | 🔧 Planned |

### EDR/XDR (Endpoint Detection and Response)

| Sistema | Tipo | Simulato | Produzione |
|---------|------|----------|------------|
| **CrowdStrike Falcon** | EDR | ✅ | 🔧 WIP |
| **SentinelOne** | EDR | 🔧 Planned | 🔧 Planned |
| **Microsoft Defender** | EDR | 🔧 Planned | 🔧 Planned |

### SOC Tools

| Sistema | Tipo | Simulato | Produzione |
|---------|------|----------|------------|
| **TheHive** | Case Management | 🔧 Planned | 🔧 Planned |
| **MISP** | Threat Intelligence | 🔧 Planned | 🔧 Planned |
| **Cortex** | Automation | 🔧 Planned | 🔧 Planned |

---

## 🧪 Testing

### Test di Base

```bash
# 1. Avvia simulatore
SIMULATOR_MODE=true npm start

# 2. In un altro terminale, verifica status
curl http://localhost:3000/api/simulator/status

# 3. Crea organizzazione di test
curl -X POST http://localhost:3000/api/organizations \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-org-001",
    "name": "Test Organization",
    "industry": "Technology",
    "size": "medium",
    "country": "IT",
    "language": "it-IT"
  }'

# 4. Avvia simulazione
curl -X POST http://localhost:3000/api/simulator/start \
  -H "Content-Type: application/json" \
  -d '{
    "orgId": "test-org-001",
    "sources": ["splunk"],
    "scenario": "normal"
  }'

# 5. Controlla eventi generati
curl http://localhost:3000/api/organizations/test-org-001
```

### Test Scenari

```bash
# Simula phishing attack
curl -X POST http://localhost:3000/api/simulator/scenario \
  -H "Content-Type: application/json" \
  -d '{
    "orgId": "test-org-001",
    "scenario": "phishing-campaign",
    "duration": 60,
    "intensity": "high"
  }'

# Attendi 60 secondi, poi verifica dati
curl http://localhost:3000/api/organizations/test-org-001/aggregates
```

---

## 🔧 Estensione

### Aggiungere un nuovo SIEM

1. **Crea connettore** in `connectors/`

```javascript
// connectors/custom-siem-connector.js
const BaseConnector = require('./base-connector');

class CustomSIEMConnector extends BaseConnector {
  constructor(config) {
    super('custom-siem', config);
  }

  async connect() {
    // Implementa logica connessione
  }

  async fetchEvents(filters) {
    // Implementa fetch eventi
  }

  async sendEvent(event) {
    // Implementa invio evento
  }
}

module.exports = CustomSIEMConnector;
```

2. **Aggiungi in** `config/sources.json`

```json
{
  "id": "custom-siem",
  "name": "Custom SIEM",
  "type": "SIEM",
  "version": "1.0",
  "enabled": true,
  "connector": "./connectors/custom-siem-connector.js"
}
```

3. **Riavvia server**

### Aggiungere uno scenario

Modifica `config/scenarios.json`:

```json
{
  "id": "custom-scenario",
  "name": "My Custom Scenario",
  "description": "Custom attack scenario",
  "duration": 1800,
  "indicators": {
    "1.1": 0.90,
    "2.3": 0.75
  },
  "events": [
    {
      "type": "custom_event",
      "count": 100,
      "distribution": "poisson"
    }
  ]
}
```

---

## 📖 Mappatura SIEM → CPF

Il **CPF Adapter** (`adapters/cpf-adapter.js`) mappa eventi SIEM ai 100 indicatori CPF.

### Esempi

| Evento SIEM | Indicatore CPF | Descrizione |
|-------------|----------------|-------------|
| `failed_login` | 1.x (Authority) | Vulnerabilità legate all'autorità |
| `after_hours_access` | 2.x (Temporal) | Vulnerabilità temporali |
| `phishing_clicked` | 3.x (Social) | Influenza sociale |
| `panic_button` | 7.x (Stress) | Risposta allo stress |
| `ai_hallucination` | 9.x (AI) | Bias AI-specifici |

### Logica di Mappatura

```javascript
// Esempio semplificato
function mapEventToIndicators(event) {
  const mappings = {
    'failed_login': ['1.3', '1.5'],
    'phishing_clicked': ['3.1', '4.2', '8.3'],
    'after_hours_access': ['2.1', '2.4', '7.2']
  };

  return mappings[event.type] || [];
}
```

---

## 🐛 Troubleshooting

### Il simulatore non parte

```bash
# Verifica che SIMULATOR_MODE sia true
echo $SIMULATOR_MODE

# Verifica logs
SIMULATOR_MODE=true npm start | grep SIMULATOR
```

### Nessun evento generato

```bash
# Verifica organizzazione esista
curl http://localhost:3000/api/organizations/YOUR_ORG_ID

# Verifica simulatore sia running
curl http://localhost:3000/api/simulator/status

# Riavvia simulazione
curl -X POST http://localhost:3000/api/simulator/stop -d '{"orgId":"YOUR_ORG_ID"}'
curl -X POST http://localhost:3000/api/simulator/start -d '{"orgId":"YOUR_ORG_ID"}'
```

### Errori connettori

```bash
# Verifica configurazione sources.json
cat dashboard/simulator/config/sources.json | jq

# Controlla logs connettore
tail -f dashboard/logs/simulator.log
```

---

## 📚 Riferimenti

- **CPF Dense Foundation**: `/CPF Implementation Companion - Dense Foundation Paper.tex`
- **Math Formalization**: `/math-formalization/`
- **Dashboard SOC**: `/dashboard/soc/`
- **API Documentation**: `/dashboard/README.md`

---

## 🤝 Contribuire

Per aggiungere nuovi connettori o scenari:

1. Crea un branch: `git checkout -b feature/new-connector`
2. Implementa seguendo `base-connector.js`
3. Aggiungi test
4. Apri PR con descrizione dettagliata

---

## 📝 License

ISC
