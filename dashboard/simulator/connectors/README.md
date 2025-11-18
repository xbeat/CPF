# SIEM Connectors

Connettori per l'integrazione con 12+ piattaforme SIEM/EDR/XDR.

## Panoramica

Questa cartella contiene i connettori che permettono al simulatore CPF di interfacciarsi con diverse piattaforme di sicurezza, simulando eventi SIEM realistici.

## Connettori Disponibili

### Enterprise SIEM

#### `splunk-connector.js`
Connettore per **Splunk Enterprise / Splunk Cloud**.
- HTTP Event Collector (HEC) API
- Index-based data organization
- SPL query support
- 40+ event types supportati

#### `qradar-connector.js`
Connettore per **IBM QRadar SIEM**.
- REST API v12+
- Offense management
- Custom properties support
- AQL query compatibility

#### `sentinel-connector.js`
Connettore per **Microsoft Sentinel** (Azure Sentinel).
- Log Analytics API
- KQL query support
- Azure AD integration
- Incident management

#### `elastic-connector.js`
Connettore per **Elastic Security / SIEM**.
- Elasticsearch REST API
- ECS (Elastic Common Schema) format
- Detection rules integration
- Timeline analysis

### EDR/XDR Platforms

#### `crowdstrike-connector.js`
Connettore per **CrowdStrike Falcon**.
- Falcon API v2
- Real-time detection events
- Endpoint telemetry
- Threat intelligence feed

#### `cortex-xdr-connector.js`
Connettore per **Palo Alto Cortex XDR**.
- XDR API
- Cross-layer detection
- Incident response
- Behavioral analytics

#### `carbonblack-connector.js`
Connettore per **VMware Carbon Black**.
- CB Response API
- EDR events
- Threat hunting
- Process analysis

### Other SIEM/Security Platforms

#### `arcsight-connector.js`
Connettore per **Micro Focus ArcSight ESM**.
- CEF (Common Event Format)
- Correlation rules
- Active channels

#### `logrhythm-connector.js`
Connettore per **LogRhythm SIEM**.
- REST API
- SmartResponse integration
- Case management

#### `fortisiem-connector.js`
Connettore per **Fortinet FortiSIEM**.
- CMDB integration
- UEBA analytics
- Compliance reporting

#### `rapid7-connector.js`
Connettore per **Rapid7 InsightIDR**.
- REST API v1
- User behavior analytics
- Log search API

#### `xsoar-connector.js`
Connettore per **Palo Alto Cortex XSOAR** (SOAR platform).
- Incident API
- Playbook execution
- Integration with SIEM feeds

## Architettura

Tutti i connettori estendono `base-connector.js`:

```javascript
const BaseConnector = require('./base-connector');

class SplunkConnector extends BaseConnector {
  constructor() {
    super('splunk', 'Splunk Enterprise');
  }

  async connect(config) {
    // Implementazione specifica Splunk
  }

  async sendEvent(event) {
    // Invio evento via HEC
  }

  async fetchEvents(query, timeRange) {
    // Query SPL
  }
}
```

### Base Connector

Il file `base-connector.js` fornisce:
- ✅ Connection management (connect, disconnect, reconnect)
- ✅ Authentication handling
- ✅ Error handling e retry logic
- ✅ Rate limiting
- ✅ Event normalization
- ✅ Health check e monitoring
- ✅ Logging

## Utilizzo

### Nel Simulatore

```javascript
const SplunkConnector = require('./connectors/splunk-connector');

const connector = new SplunkConnector();
await connector.connect({
  host: 'splunk.company.com',
  port: 8088,
  token: 'HEC_TOKEN',
  index: 'cpf_events'
});

// Invia evento
await connector.sendEvent({
  timestamp: Date.now(),
  source: 'cpf-simulator',
  sourcetype: 'cpf:security',
  event: {
    type: 'phishing_clicked',
    user: 'john.doe@company.com',
    severity: 'medium'
  }
});
```

### Configurazione

I connettori sono configurati in `/simulator/config/sources.json`:

```json
{
  "splunk": {
    "name": "Splunk Enterprise",
    "type": "siem",
    "endpoint": "https://splunk.company.com:8088/services/collector",
    "auth_type": "token",
    "capabilities": ["real-time", "historical", "correlation"]
  }
}
```

## Event Types Supportati

Tutti i connettori supportano 40+ tipi di eventi:

### Security Events
- Authentication (failed, successful, mfa, etc.)
- Phishing (clicked, reported, delivered)
- Malware (detected, quarantined, executed)
- Data exfiltration (attempted, blocked, successful)

### User Behavior
- Privilege escalation
- Policy violations
- After-hours access
- Anomalous patterns

### System Events
- Configuration changes
- Alert fatigue indicators
- Information overload
- Multitasking detection

Vedi `/simulator/adapters/event-baseline.js` per la lista completa.

## Aggiungere Nuovo Connettore

1. **Creare file connettore:**
```javascript
// mynewsiem-connector.js
const BaseConnector = require('./base-connector');

class MyNewSiemConnector extends BaseConnector {
  constructor() {
    super('mynewsiem', 'My New SIEM Platform');
  }

  async connect(config) {
    // Implementa connessione
  }

  async sendEvent(event) {
    // Implementa invio evento
  }

  async fetchEvents(query, timeRange) {
    // Implementa fetch eventi (opzionale)
  }
}

module.exports = MyNewSiemConnector;
```

2. **Aggiungere a sources.json:**
```json
{
  "mynewsiem": {
    "name": "My New SIEM",
    "type": "siem",
    "endpoint": "https://api.mynewsiem.com/v1",
    "auth_type": "api_key"
  }
}
```

3. **Testare:**
```bash
node test-connector.js mynewsiem
```

## Testing

Ogni connettore può essere testato individualmente:

```bash
# Test singolo connettore
node simulator/test-connector.js splunk

# Test tutti i connettori
node simulator/test-all-connectors.js
```

## Rate Limiting

I connettori implementano rate limiting per prevenire sovraccarico:

```javascript
// Configurazione rate limit in base-connector.js
const RATE_LIMITS = {
  splunk: 10000,    // eventi/sec (HEC)
  qradar: 100,      // eventi/sec
  sentinel: 500,    // eventi/sec
  elastic: 1000     // eventi/sec
};
```

## Error Handling

Gestione errori standard:
- **Connection errors** - Retry con exponential backoff
- **Authentication errors** - Re-authentication automatica
- **Rate limit errors** - Throttling automatico
- **Network errors** - Reconnection logic

## Riferimenti

- **Base Connector**: `base-connector.js`
- **Event Adapter**: `/simulator/adapters/cpf-adapter.js`
- **Event Types**: `/simulator/adapters/event-baseline.js`
- **Configuration**: `/simulator/config/sources.json`
- **Simulatore**: `/dashboard/simulator/README.md`
