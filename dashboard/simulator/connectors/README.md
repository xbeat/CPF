# SIEM Connectors

Connectors for integrating CPF with major SIEM/EDR/SOAR platforms.

## Overview

Each connector provides standardized interface for:
- Authentication and connection management
- Event/alert retrieval
- Log forwarding to CPF adapter
- Platform-specific query translation

## Available Connectors

### Base Connector (base-connector.js)
Abstract base class providing common functionality for all connectors.

**Features:**
- Connection pooling
- Retry logic with exponential backoff
- Error handling and logging
- Rate limiting
- Authentication management

### SIEM Platforms

#### splunk-connector.js
**Splunk Enterprise / Splunk Cloud** integration

- REST API authentication
- SPL query support
- Real-time event streaming
- Saved search execution

**Configuration:**
```javascript
{
  host: 'splunk.example.com',
  port: 8089,
  username: 'cpf-service',
  password: 'xxx',
  index: 'security'
}
```

#### qradar-connector.js
**IBM QRadar** integration

- API key authentication
- AQL query translation
- Offense correlation
- Reference set management

#### sentinel-connector.js
**Microsoft Sentinel** integration

- Azure AD OAuth2
- KQL query support
- Log Analytics workspace
- Incident API integration

#### elastic-connector.js
**Elastic Security (ELK Stack)** integration

- Elasticsearch API
- EQL query support
- Kibana dashboard integration
- Index pattern management

#### arcsight-connector.js
**Micro Focus ArcSight** integration

- CEF log parsing
- ESM API integration
- Correlation rule deployment

#### logrhythm-connector.js
**LogRhythm SIEM** integration

- REST API authentication
- Case management integration
- Alarm retrieval

#### fortisiem-connector.js
**Fortinet FortiSIEM** integration

- XML API support
- Incident correlation
- Report generation

### EDR Platforms

#### crowdstrike-connector.js
**CrowdStrike Falcon** integration

- Falcon API authentication
- Detection streaming
- Threat intelligence enrichment
- Behavioral indicators

#### carbonblack-connector.js
**VMware Carbon Black** integration

- CB Response/Defense API
- Endpoint telemetry
- Binary analysis results

#### cortex-xdr-connector.js
**Palo Alto Cortex XDR** integration

- XDR API v2
- Incident retrieval
- Causality analysis
- Behavioral threat protection

### SOAR Platforms

#### xsoar-connector.js
**Palo Alto Cortex XSOAR** integration

- Incident creation from CPF indicators
- Playbook triggering
- War room updates
- Indicator enrichment

#### rapid7-connector.js
**Rapid7 InsightConnect** integration

- Workflow automation
- Asset vulnerability correlation
- Incident response orchestration

## Common Interface

All connectors implement:

```javascript
class SIEMConnector extends BaseConnector {
  // Connect to platform
  async connect()

  // Disconnect
  async disconnect()

  // Query events/alerts
  async queryEvents(query, timeRange)

  // Stream real-time events
  async streamEvents(callback)

  // Send CPF assessment back to SIEM
  async sendAssessment(assessment)

  // Health check
  async healthCheck()
}
```

## Usage Example

```javascript
const { SplunkConnector } = require('./connectors/splunk-connector');
const { CPFAdapter } = require('./adapters/cpf-adapter');

// Initialize connector
const splunk = new SplunkConnector({
  host: 'splunk.company.com',
  port: 8089,
  username: 'cpf',
  password: process.env.SPLUNK_PASSWORD
});

// Connect
await splunk.connect();

// Query events
const events = await splunk.queryEvents(
  'index=security sourcetype=auth | head 1000',
  { start: '-1h', end: 'now' }
);

// Convert to CPF
const adapter = new CPFAdapter(denseLoader);
const assessments = adapter.convertToCPF(events, orgId, 'normal');

// Send assessments back to Splunk
for (const assessment of assessments) {
  await splunk.sendAssessment(assessment);
}
```

## Deployment

### Production Deployment

1. **Choose Your Platform(s)**
   ```bash
   # Install only needed connectors
   npm install --production
   ```

2. **Configure Credentials**
   ```bash
   # Use environment variables
   export SPLUNK_HOST=splunk.example.com
   export SPLUNK_USERNAME=cpf-service
   export SPLUNK_PASSWORD=xxx
   ```

3. **Test Connection**
   ```javascript
   const connector = new SplunkConnector(config);
   const health = await connector.healthCheck();
   console.log(health);  // { status: 'ok', latency: 45ms }
   ```

4. **Start Integration**
   ```javascript
   // Stream events continuously
   connector.streamEvents(async (events) => {
     const assessments = adapter.convertToCPF(events);
     await saveAssessments(assessments);
   });
   ```

### Multi-Platform Integration

```javascript
// Connect to multiple SIEMs simultaneously
const connectors = [
  new SplunkConnector(splunkConfig),
  new QRadarConnector(qradarConfig),
  new SentinelConnector(sentinelConfig)
];

// Initialize all
await Promise.all(connectors.map(c => c.connect()));

// Aggregate events from all platforms
const allEvents = await Promise.all(
  connectors.map(c => c.queryEvents(query, timeRange))
);

const mergedEvents = allEvents.flat();
const assessments = adapter.convertToCPF(mergedEvents);
```

## Security Considerations

### Credentials
- Store credentials in secure vault (HashiCorp Vault, Azure Key Vault)
- Use service accounts with minimal privileges
- Rotate credentials regularly
- Never commit credentials to git

### Network
- Use TLS/SSL for all connections
- Implement IP whitelisting
- Use VPN for cloud SIEM access
- Enable MFA where supported

### Data
- Filter sensitive data before processing
- Encrypt data at rest and in transit
- Implement data retention policies
- Follow GDPR/compliance requirements

## Extending

To add a new SIEM connector:

1. **Create Connector File**
   ```javascript
   // new-siem-connector.js
   const { BaseConnector } = require('./base-connector');

   class NewSIEMConnector extends BaseConnector {
     async connect() { /* ... */ }
     async queryEvents(query, timeRange) { /* ... */ }
     // Implement interface
   }
   ```

2. **Add Configuration Schema**
   ```javascript
   const CONFIG_SCHEMA = {
     host: { type: 'string', required: true },
     apiKey: { type: 'string', required: true }
   };
   ```

3. **Test**
   ```bash
   npm test -- connectors/new-siem-connector.test.js
   ```

4. **Document**
   Update this README with connector details

## Related Resources

- **CPF Adapter**: `../adapters/cpf-adapter.js` - Event to CPF conversion
- **Event Generator**: `../generators/siem-data-generator.js` - For testing without real SIEM
- **Configuration**: `../config/sources.json` - SIEM source definitions
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
