# Database Schema

Schema SQL per TimescaleDB del detection engine.

## File Schema

### `01_raw_events.sql`

Tabelle per eventi raw (email, auth, alert, ticket).

**Hypertables create:**
- `raw_email_events` - Eventi email
- `raw_auth_events` - Eventi autenticazione
- `raw_alert_events` - Eventi alert
- `raw_ticket_events` - Eventi ticket (pianificato)

**Partitioning:**
- Automatic time-based partitioning (1 week chunks)
- Partitioned by `time` column

### `03_baselines.sql`

Tabella per storage baseline calibrati.

**Table:**
- `baselines` - Baseline μ, σ per ogni indicatore/organizzazione

**Struttura:**
```sql
(org_id, indicator_id) → (mean, stddev, sample_size, confidence)
```

### `04_detection_results.sql`

Hypertable per risultati detection.

**Hypertable:**
- `detection_results` - Risultati giornalieri per ogni indicatore

**Partitioning:**
- Time-based (1 week chunks)
- Indici su (org_id, indicator_id, time)

### `06_ground_truth.sql`

Hypertable per ground truth (validation).

**Hypertable:**
- `ground_truth` - Segnali iniettati per validation

**Struttura:**
```sql
(time, org_id, indicator_id) → (expected_detection, signal_type, metadata)
```

## Esecuzione

```bash
# Via migration script
node storage/migrations/init.js

# Manuale (ordine importante!)
psql -U postgres -d cpf_detection -f 01_raw_events.sql
psql -U postgres -d cpf_detection -f 03_baselines.sql
psql -U postgres -d cpf_detection -f 04_detection_results.sql
psql -U postgres -d cpf_detection -f 06_ground_truth.sql
```

## Dettagli Tabelle

### raw_email_events

```sql
Columns:
  time                    TIMESTAMPTZ (PRIMARY)
  org_id                  TEXT
  event_id                TEXT (UNIQUE)
  sender                  TEXT
  sender_authority_level  TEXT
  recipient               TEXT
  subject                 TEXT
  has_approval_request    BOOLEAN
  has_urgency_markers     BOOLEAN
  clicked_approve         BOOLEAN
  time_to_action          INTEGER (seconds)
  metadata                JSONB

Indexes:
  - PRIMARY KEY (time, event_id)
  - idx_email_org_time (org_id, time DESC)
  - idx_email_metadata GIN (metadata)

Retention: 90 days
Compression: After 7 days
```

### baselines

```sql
Columns:
  org_id                      TEXT
  indicator_id                TEXT
  calibrated_at               TIMESTAMPTZ
  calibration_period_start    TIMESTAMPTZ
  calibration_period_end      TIMESTAMPTZ
  baseline_mean               DOUBLE PRECISION
  baseline_stddev             DOUBLE PRECISION
  sample_size                 INTEGER
  confidence                  DOUBLE PRECISION
  metadata                    JSONB

Indexes:
  - PRIMARY KEY (org_id, indicator_id)
  - idx_baselines_org (org_id)
  - idx_baselines_indicator (indicator_id)

No retention (permanent)
```

### detection_results

```sql
Columns:
  time              TIMESTAMPTZ (PRIMARY)
  org_id            TEXT
  indicator_id      TEXT
  score             DOUBLE PRECISION
  confidence        DOUBLE PRECISION
  detected          BOOLEAN
  sigma_distance    DOUBLE PRECISION
  details           JSONB

Indexes:
  - PRIMARY KEY (time, org_id, indicator_id)
  - idx_detection_org_indicator (org_id, indicator_id, time DESC)

Retention: 365 days
```

## Modifiche Schema

Per aggiungere colonne:

```sql
-- Aggiungi colonna
ALTER TABLE raw_email_events
  ADD COLUMN new_field TEXT;

-- Indice su nuova colonna
CREATE INDEX idx_email_new_field ON raw_email_events(new_field);
```

Per creare nuova hypertable:

```sql
-- Nuova tabella
CREATE TABLE raw_new_events (
  time TIMESTAMPTZ NOT NULL,
  org_id TEXT NOT NULL,
  -- ... altri campi
);

-- Converti in hypertable
SELECT create_hypertable('raw_new_events', 'time');

-- Retention policy
SELECT add_retention_policy('raw_new_events', INTERVAL '90 days');
```

## Best Practices

1. **Time column**: Sempre `TIMESTAMPTZ NOT NULL` per hypertables
2. **Partitioning**: Basato su `time` column
3. **Indici**: Crea indici su colonne frequentemente filtrate (org_id, indicator_id)
4. **JSONB**: Usa per metadata flessibili, con indici GIN per query
5. **Retention**: Definisci sempre policy per evitare crescita incontrollata
6. **Compression**: Abilita per dati > 7 giorni

## Riferimenti

- **Storage**: `/dashboard/cpf-detection-engine/storage/README.md`
- **Migrations**: `/dashboard/cpf-detection-engine/storage/migrations/README.md`
- **TimescaleDB Hypertables**: https://docs.timescale.com/use-timescale/latest/hypertables/
