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
