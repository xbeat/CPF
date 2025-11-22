const path = require('path');

// Carica le variabili d'ambiente dal file .env
require('dotenv').config({ path: path.join(__dirname, '.env') });

const databaseType = process.env.DATABASE_TYPE || 'json'; // 'json', 'sqlite', 'postgres'

console.log(`[Config] Utilizzo dello storage di tipo: ${databaseType.toUpperCase()}`);

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  database: {
    type: databaseType,
    sqlite: {
      // Il percorso del file di database SQLite.
      path: path.join(__dirname, 'data', 'cpf_dashboard.sqlite')
    },
    postgres: {
      // La stringa di connessione per PostgreSQL (presa dalla variabile d'ambiente).
      connectionString: process.env.DATABASE_URL
    },
    json: {
      // I percorsi per la modalità basata su file JSON.
      dataDir: path.join(__dirname, 'data'),
      orgsDir: path.join(__dirname, 'data', 'organizations'),
      indexFile: path.join(__dirname, 'data', 'organizations_index.json'),
      trashDir: path.join(__dirname, 'data', 'trash'),
      historyDir: path.join(__dirname, 'data', 'history'),
      auditLogFile: path.join(__dirname, 'data', 'audit_log.json')
    }
  }
};

module.exports = config;
