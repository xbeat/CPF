# PostgreSQL Setup (Opzionale - Per Uso Futuro)

Questa cartella contiene il setup completo per PostgreSQL come alternativa al sistema basato su file JSON.

## ⚠️ Nota Importante

**Questa soluzione NON è attualmente utilizzata dal progetto CPF.**

Il sistema attivo usa file JSON per semplicità di deployment e configurazione client.
Questa implementazione PostgreSQL è mantenuta come riferimento per:

- **Deployment server**: Quando il progetto verrà deployato su server dedicato
- **Scale**: Quando ci saranno molte organizzazioni (>100)
- **Multi-user**: Quando servirà accesso concorrente
- **Advanced queries**: Quando serviranno analisi complesse

---

## 📁 File Inclusi

- **DATABASE_SETUP.md** - Guida completa installazione PostgreSQL
- **QUICK_START.md** - Guida rapida setup
- **db_schema.sql** - Schema database (3 tabelle + views + functions)
- **db_seed_demo.js** - Script generazione dati demo

---

## 🔄 Migrazione Futura JSON → PostgreSQL

Quando vorrai migrare da file JSON a PostgreSQL:

1. Segui la guida in `DATABASE_SETUP.md`
2. Esegui lo schema: `psql cpf_db -f db_schema.sql`
3. Crea uno script di migrazione per importare i file JSON esistenti nel database
4. Modifica le API in `server.js` per usare PostgreSQL invece di `fs.readFile`

---

## 💡 Vantaggi PostgreSQL (per il futuro)

✅ **Transazioni** - Garanzia consistenza dati
✅ **Concurrent access** - Multi-user sicuro
✅ **Query avanzate** - JOIN, aggregazioni, funzioni
✅ **Indexing** - Performance su grandi dataset
✅ **Backup** - Tools professionali (pg_dump)
✅ **Scalabilità** - Gestione migliaia di organizzazioni

---

## 📊 Schema Database

### Tabelle Principali:

1. **organizations** - Anagrafica organizzazioni
2. **assessments** - Valutazioni indicatori per ogni org
3. **indicators_metadata** - Snapshot indicatori da GitHub

### Views:
- `v_organization_risk_summary` - Statistiche per organizzazione
- `v_indicator_statistics` - Statistiche per indicatore
- `v_recent_assessments` - Ultimi assessments

### Functions:
- `get_org_completion_rate(org_id)` - Percentuale completamento
- `get_org_overall_risk(org_id)` - Risk score complessivo
- `get_missing_indicators(org_id)` - Indicatori mancanti

---

## 🚀 Soluzione Attuale (File JSON)

Il sistema attivo usa:

```
/dashboard/data/
├── organizations_index.json          # Indice organizzazioni
└── organizations/
    ├── org-001.json                  # Dati completi org 1
    ├── org-002.json                  # Dati completi org 2
    └── ...
```

**Vantaggi soluzione JSON:**
- ✅ Zero configurazione client
- ✅ Backup semplice (copia file)
- ✅ Portabilità totale
- ✅ Debug facile (file leggibili)
- ✅ No dipendenze esterne

---

## 📝 Note

- Schema compatibile con struttura JSON attuale
- Migrazione reversibile (export da PostgreSQL a JSON)
- Performance ottimizzate con indici
- Pronto per produzione

---

**Versione**: 1.0
**Data**: 2025-01-11
**Status**: Reference Implementation (non attivo)
