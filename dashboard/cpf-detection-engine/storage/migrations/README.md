# Database Migrations

Script di migrazione per inizializzazione e aggiornamento schema TimescaleDB.

## Contenuto

### `init.js`

Script di inizializzazione database che esegue tutti gli schema SQL in ordine.

**Funzionalità:**
- Connessione a TimescaleDB
- Esecuzione schema files in sequenza
- Creazione hypertables
- Creazione indici
- Setup retention e compression policies

**Utilizzo:**
```bash
# Prima volta (init completo)
node storage/migrations/init.js

# Con Docker
docker-compose up -d
node storage/migrations/init.js
```

**Output:**
```
✓ Connected to TimescaleDB (cpf_detection)
✓ Executing 01_raw_events.sql...
  - Created hypertable: raw_email_events
  - Created hypertable: raw_auth_events
  - Created hypertable: raw_alert_events
✓ Executing 03_baselines.sql...
  - Created table: baselines
✓ Executing 04_detection_results.sql...
  - Created hypertable: detection_results
✓ Executing 06_ground_truth.sql...
  - Created hypertable: ground_truth
✓ Migration completed successfully
```

## File Schema Eseguiti

I file vengono eseguiti in questo ordine:

1. `01_raw_events.sql` - Tabelle eventi raw
2. `03_baselines.sql` - Storage baseline
3. `04_detection_results.sql` - Risultati detection
4. `06_ground_truth.sql` - Ground truth

## Implementazione

```javascript
const fs = require('fs');
const path = require('path');
const TimescaleClient = require('../timescale-client');

async function runMigrations() {
  const db = new TimescaleClient({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'cpf_detection',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password'
  });

  try {
    console.log('Connecting to TimescaleDB...');
    await db.connect();
    console.log('✓ Connected');

    const schemaDir = path.join(__dirname, '../schema');
    const schemaFiles = [
      '01_raw_events.sql',
      '03_baselines.sql',
      '04_detection_results.sql',
      '06_ground_truth.sql'
    ];

    for (const file of schemaFiles) {
      console.log(`\n✓ Executing ${file}...`);
      const filePath = path.join(schemaDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      // Execute SQL
      await db.execute(sql);
      console.log(`  ✓ Completed`);
    }

    console.log('\n✓ All migrations completed successfully');

  } catch (error) {
    console.error('✗ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await db.disconnect();
  }
}

// Run
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };
```

## Environment Variables

```bash
# .env file
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cpf_detection
DB_USER=postgres
DB_PASSWORD=password
```

## Reset Database

```bash
# ATTENZIONE: Elimina tutti i dati!
psql -U postgres -c "DROP DATABASE IF EXISTS cpf_detection;"
psql -U postgres -c "CREATE DATABASE cpf_detection;"

# Re-run migrations
node storage/migrations/init.js
```

## Verificare Schema

```bash
# Connetti al database
psql -U postgres -d cpf_detection

# Lista tabelle
\dt

# Lista hypertables
SELECT * FROM timescaledb_information.hypertables;

# Verifica indici
\di

# Schema completo
\d raw_email_events
```

## Troubleshooting

**Error: "extension timescaledb not found"**
```sql
-- Abilita estensione
CREATE EXTENSION IF NOT EXISTS timescaledb;
```

**Error: "permission denied"**
```bash
# User deve avere permessi
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE cpf_detection TO your_user;"
```

**Error: "hypertable already exists"**
```sql
-- Drop e ricrea
DROP TABLE IF EXISTS raw_email_events CASCADE;
-- Poi re-run migration
```

## Riferimenti

- **Storage**: `/dashboard/cpf-detection-engine/storage/README.md`
- **Schema Files**: `/dashboard/cpf-detection-engine/storage/schema/`
- **TimescaleDB**: https://docs.timescale.com/
