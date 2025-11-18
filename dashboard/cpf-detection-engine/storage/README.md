# TimescaleDB Storage Layer

Layer di persistenza basato su TimescaleDB per time-series data del detection engine.

## Panoramica

TimescaleDB è un'estensione PostgreSQL ottimizzata per time-series data, ideale per lo storage di eventi organizzativi ad alto volume (50K-200K eventi/giorno).

## Perché TimescaleDB

✅ **Time-series optimization** - Query veloci su range temporali
✅ **Automatic partitioning** - Gestione automatica partizioni per data
✅ **Data retention** - Retention policies automatiche
✅ **Compression** - Compressione dati storici
✅ **PostgreSQL compatibility** - SQL standard + estensioni
✅ **Scalability** - Gestione milioni di righe/giorno

## Struttura

```
storage/
├── README.md                # Questa guida
├── timescale-client.js      # Client TimescaleDB
├── schema/                  # Schema SQL
│   ├── 01_raw_events.sql    # Tabelle eventi raw
│   ├── 03_baselines.sql     # Baseline storage
│   ├── 04_detection_results.sql  # Risultati detection
│   └── 06_ground_truth.sql  # Ground truth per validation
└── migrations/              # Migrazioni schema
    └── init.js              # Inizializzazione DB
```

## TimescaleDB Client

**File**: `timescale-client.js`

Fornisce interfaccia per operazioni su TimescaleDB.

**Funzionalità:**
- Connection pooling
- Query builder
- Bulk insert ottimizzato
- Time-range queries
- Aggregazioni temporali
- Retention management

**Utilizzo:**
```javascript
const TimescaleClient = require('./timescale-client');

const db = new TimescaleClient({
  host: 'localhost',
  port: 5432,
  database: 'cpf_detection',
  user: 'postgres',
  password: 'password'
});

await db.connect();

// Insert singolo
await db.insert('raw_email_events', {
  timestamp: new Date(),
  sender: 'user@company.com',
  has_approval_request: true,
  clicked_approve: true
});

// Bulk insert (ottimizzato)
const events = [...];  // 50K eventi
await db.bulkInsert('raw_email_events', events);

// Query time-range
const data = await db.query(`
  SELECT * FROM raw_email_events
  WHERE time >= NOW() - INTERVAL '7 days'
  AND org_id = $1
`, [orgId]);

// Aggregazioni
const stats = await db.aggregate('raw_email_events', {
  timeColumn: 'time',
  interval: '1 hour',
  aggregates: {
    count: 'COUNT(*)',
    avg_response_time: 'AVG(time_to_action)'
  },
  where: { org_id: 'org-001' }
});
```

## Schema

### 01_raw_events.sql

Tabelle per eventi raw:

```sql
-- Email events
CREATE TABLE raw_email_events (
  time TIMESTAMPTZ NOT NULL,
  org_id TEXT NOT NULL,
  event_id TEXT UNIQUE,
  sender TEXT,
  sender_authority_level TEXT,
  recipient TEXT,
  subject TEXT,
  has_approval_request BOOLEAN,
  has_urgency_markers BOOLEAN,
  clicked_approve BOOLEAN,
  time_to_action INTEGER,  -- secondi
  metadata JSONB
);

SELECT create_hypertable('raw_email_events', 'time');

-- Auth events
CREATE TABLE raw_auth_events (
  time TIMESTAMPTZ NOT NULL,
  org_id TEXT NOT NULL,
  event_id TEXT UNIQUE,
  user_id TEXT,
  event_type TEXT,  -- login, logout, mfa, etc.
  success BOOLEAN,
  source_ip INET,
  after_hours BOOLEAN,
  metadata JSONB
);

SELECT create_hypertable('raw_auth_events', 'time');

-- Alert events
CREATE TABLE raw_alert_events (
  time TIMESTAMPTZ NOT NULL,
  org_id TEXT NOT NULL,
  alert_id TEXT UNIQUE,
  severity TEXT,
  presented BOOLEAN,
  investigated BOOLEAN,
  time_to_investigate INTEGER,
  resolved BOOLEAN,
  metadata JSONB
);

SELECT create_hypertable('raw_alert_events', 'time');
```

### 03_baselines.sql

Storage per baseline calibrati:

```sql
CREATE TABLE baselines (
  org_id TEXT NOT NULL,
  indicator_id TEXT NOT NULL,
  calibrated_at TIMESTAMPTZ NOT NULL,
  calibration_period_start TIMESTAMPTZ,
  calibration_period_end TIMESTAMPTZ,
  baseline_mean DOUBLE PRECISION,
  baseline_stddev DOUBLE PRECISION,
  sample_size INTEGER,
  confidence DOUBLE PRECISION,
  metadata JSONB,
  PRIMARY KEY (org_id, indicator_id)
);

CREATE INDEX idx_baselines_org ON baselines(org_id);
CREATE INDEX idx_baselines_indicator ON baselines(indicator_id);
```

### 04_detection_results.sql

Risultati detection:

```sql
CREATE TABLE detection_results (
  time TIMESTAMPTZ NOT NULL,
  org_id TEXT NOT NULL,
  indicator_id TEXT NOT NULL,
  score DOUBLE PRECISION,
  confidence DOUBLE PRECISION,
  detected BOOLEAN,
  sigma_distance DOUBLE PRECISION,
  details JSONB,
  PRIMARY KEY (time, org_id, indicator_id)
);

SELECT create_hypertable('detection_results', 'time');

CREATE INDEX idx_detection_org_indicator
  ON detection_results(org_id, indicator_id, time DESC);
```

### 06_ground_truth.sql

Ground truth per validation:

```sql
CREATE TABLE ground_truth (
  time TIMESTAMPTZ NOT NULL,
  org_id TEXT NOT NULL,
  indicator_id TEXT NOT NULL,
  expected_detection BOOLEAN,
  signal_type TEXT,
  metadata JSONB,
  PRIMARY KEY (time, org_id, indicator_id)
);

SELECT create_hypertable('ground_truth', 'time');
```

## Migrations

### Inizializzazione

**File**: `migrations/init.js`

```bash
# Esegui migration iniziale
node storage/migrations/init.js

# Output:
# ✓ Connected to TimescaleDB
# ✓ Created hypertable: raw_email_events
# ✓ Created hypertable: raw_auth_events
# ✓ Created hypertable: raw_alert_events
# ✓ Created table: baselines
# ✓ Created hypertable: detection_results
# ✓ Created hypertable: ground_truth
# ✓ Migration completed successfully
```

### Esecuzione

```javascript
// migrations/init.js
const fs = require('fs');
const TimescaleClient = require('../timescale-client');

async function runMigrations() {
  const db = new TimescaleClient();
  await db.connect();

  const schemaFiles = [
    '01_raw_events.sql',
    '03_baselines.sql',
    '04_detection_results.sql',
    '06_ground_truth.sql'
  ];

  for (const file of schemaFiles) {
    console.log(`Executing ${file}...`);
    const sql = fs.readFileSync(`./schema/${file}`, 'utf8');
    await db.execute(sql);
  }

  console.log('✓ Migrations completed');
  await db.disconnect();
}

runMigrations().catch(console.error);
```

## Docker Setup

```yaml
# docker-compose.yml
version: '3.8'

services:
  timescaledb:
    image: timescale/timescaledb:latest-pg14
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: cpf_detection
    volumes:
      - timescale_data:/var/lib/postgresql/data
    command: postgres -c shared_preload_libraries=timescaledb

volumes:
  timescale_data:
```

### Avvio

```bash
# Avvia TimescaleDB
docker-compose up -d

# Verifica
docker-compose ps

# Accedi al database
docker exec -it <container-id> psql -U postgres -d cpf_detection

# Test TimescaleDB extension
SELECT * FROM timescaledb_information.hypertables;
```

## Data Retention

### Retention Policy

```sql
-- Mantieni raw data per 90 giorni
SELECT add_retention_policy('raw_email_events', INTERVAL '90 days');
SELECT add_retention_policy('raw_auth_events', INTERVAL '90 days');
SELECT add_retention_policy('raw_alert_events', INTERVAL '90 days');

-- Mantieni detection results per 1 anno
SELECT add_retention_policy('detection_results', INTERVAL '365 days');

-- Mantieni ground truth indefinitamente (no retention)
```

### Compression

```sql
-- Comprimi dati > 7 giorni
ALTER TABLE raw_email_events
  SET (timescaledb.compress,
       timescaledb.compress_segmentby = 'org_id');

SELECT add_compression_policy('raw_email_events', INTERVAL '7 days');
```

## Query Optimization

### Indici Consigliati

```sql
-- Indici per org_id queries
CREATE INDEX idx_email_org_time ON raw_email_events(org_id, time DESC);
CREATE INDEX idx_auth_org_time ON raw_auth_events(org_id, time DESC);
CREATE INDEX idx_alert_org_time ON raw_alert_events(org_id, time DESC);

-- Indici per detection results
CREATE INDEX idx_detection_org_indicator
  ON detection_results(org_id, indicator_id, time DESC);

-- Indici JSONB (per metadata queries)
CREATE INDEX idx_email_metadata ON raw_email_events USING GIN (metadata);
```

### Continuous Aggregates

```sql
-- Pre-aggregate hourly stats
CREATE MATERIALIZED VIEW email_hourly_stats
WITH (timescaledb.continuous) AS
SELECT
  time_bucket('1 hour', time) AS hour,
  org_id,
  COUNT(*) AS total_emails,
  COUNT(*) FILTER (WHERE has_approval_request) AS approval_requests,
  COUNT(*) FILTER (WHERE clicked_approve) AS approvals,
  AVG(time_to_action) AS avg_response_time
FROM raw_email_events
GROUP BY hour, org_id;

SELECT add_continuous_aggregate_policy('email_hourly_stats',
  start_offset => INTERVAL '3 hours',
  end_offset => INTERVAL '1 hour',
  schedule_interval => INTERVAL '1 hour');
```

## Backup & Restore

```bash
# Backup
pg_dump -U postgres -d cpf_detection -F c -f backup.dump

# Restore
pg_restore -U postgres -d cpf_detection backup.dump

# Backup solo schema
pg_dump -U postgres -d cpf_detection --schema-only -f schema.sql
```

## Monitoring

```sql
-- Check hypertable size
SELECT * FROM timescaledb_information.hypertables;

-- Check compression stats
SELECT * FROM timescaledb_information.compression_settings;

-- Query performance
EXPLAIN ANALYZE
SELECT * FROM raw_email_events
WHERE org_id = 'org-001'
AND time >= NOW() - INTERVAL '7 days';
```

## Riferimenti

- **Detection Engine**: `/dashboard/cpf-detection-engine/README.md`
- **Data Generator**: `/dashboard/cpf-detection-engine/data-generator/README.md`
- **TimescaleDB Docs**: https://docs.timescale.com/
- **Docker Setup**: `docker-compose.yml`
