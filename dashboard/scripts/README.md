# Scripts del Pannello di Controllo

Questa directory contiene vari script di supporto per il pannello di controllo del CPF (Cybersecurity Posture Framework).

## Contenuti

### `generate_demo_organizations.js`

**Scopo:** Generare dati di organizzazione fittizi per scopi di sviluppo, test o dimostrazione.

Questo script crea un set di dati di esempio che include informazioni sull'organizzazione, valutazioni di sicurezza pre-calcolate e aggregati statistici. È essenziale per popolare un ambiente di sviluppo pulito con dati coerenti.

### `test_backend.js`

**Scopo:** Eseguire un test di integrazione completo per il backend del pannello di controllo.

**Funzionamento:**
1.  Utilizza `generate_demo_organizations.js` per creare dati di test al volo.
2.  Usa il driver del database configurato (es. JSON o SQLite) per eseguire operazioni CRUD (Create, Read, Update, Delete).
3.  Verifica che la creazione di un'organizzazione, la lettura e il salvataggio di una valutazione funzionino come previsto.

È lo script principale per verificare la salute e il corretto funzionamento dell'intero stack del backend.

### `test_generator.js`

**Scopo:** Eseguire un test unitario per lo script `generate_demo_organizations.js`.

**Funzionamento:**
1.  Esegue la funzione di generazione dei dati.
2.  Controlla rigorosamente la struttura dei dati restituiti, verificando la presenza e il tipo corretto di tutte le proprietà chiave (ID, metadati, valutazioni, aggregati).

Questo test garantisce che qualsiasi modifica al generatore di dati non produca dati malformati, che potrebbero causare errori in altre parti dell'applicazione.
