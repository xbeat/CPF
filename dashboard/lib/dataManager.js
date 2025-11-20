/**
 * CPF Data Manager - Il Direttore d'Orchestra
 *
 * Questo modulo è l'unico punto di accesso ai dati per l'applicazione.
 * Legge la configurazione e carica dinamicamente il modulo "specialista"
 * corretto per la gestione dei dati (JSON, SQLite, o PostgreSQL).
 *
 * In questo modo, il resto dell'applicazione (server.js) non deve preoccuparsi
 * di quale sia la fonte dei dati, garantendo una perfetta astrazione.
 */

const config = require('../config');

let dataManager;

console.log(`[DataManager] Caricamento dello specialista per: ${config.database.type.toUpperCase()}`);

switch (config.database.type) {
  case 'sqlite':
    dataManager = require('./db_sqlite');
    break;
  case 'postgres':
    dataManager = require('./db_postgres');
    break;
  case 'json':
  default:
    dataManager = require('./db_json');
    break;
}

// Se il modulo ha una funzione di inizializzazione, la eseguiamo.
if (typeof dataManager.initialize === 'function') {
  dataManager.initialize().catch(err => {
    console.error(`[DataManager] Errore durante l'inizializzazione del modulo ${config.database.type}:`, err);
    process.exit(1);
  });
}

// Esportiamo il modulo specialista scelto.
module.exports = dataManager;
