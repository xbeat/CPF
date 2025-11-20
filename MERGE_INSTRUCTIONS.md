# Istruzioni per Merge Server Startup Fix

## Problema Risolto
Il server esce immediatamente dopo l'avvio perché:
1. **Dipendenze mancanti** (`npm install` non eseguito)
2. **Nessun error handler** mostra l'errore reale

## Soluzione nel Branch `claude/fix-server-startup-01Ao2dQNiLqCWfjhqXxfTYjd`

### Modifiche Apportate al File `dashboard/server.js`

#### 1. Aggiunte all'inizio del file (dopo lo shebang e i commenti):

```javascript
// Error handlers for uncaught errors
process.on('uncaughtException', (error) => {
  console.error('\n❌ [FATAL] Uncaught Exception:', error.message);
  console.error(error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\n❌ [FATAL] Unhandled Promise Rejection:', reason);
  console.error('Promise:', promise);
  process.exit(1);
});

console.log('[Server] Starting CPF Dashboard Server...');
```

#### 2. Modifiche ai require (aggiunge log):

```javascript
console.log('[Server] Core modules loaded');

// Import data manager
console.log('[Server] Loading data manager...');
const dataManager = require('./lib/dataManager');
console.log('[Server] Data manager loaded successfully');
```

#### 3. Aggiunte prima di `server.listen()`:

```javascript
console.log('[Server] Initializing HTTP server on port', PORT);
```

#### 4. Aggiunte dopo `server.listen()`:

```javascript
// Handle server listen errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`\n❌ [FATAL] Port ${PORT} is already in use`);
    console.error('   Please stop the other process or use a different port\n');
  } else {
    console.error('\n❌ [FATAL] Server error:', error.message);
    console.error(error.stack);
  }
  process.exit(1);
});
```

---

## Come Applicare le Modifiche al Tuo Branch

### Opzione 1: Cherry-pick (Raccomandato)

Sul tuo branch `claude/integrate-all-features-012Sckbb6qAu2R6kgy74ncnj`:

```bash
# Fetch le ultime modifiche
git fetch origin

# Cherry-pick il commit con le fix
git cherry-pick 1e874e6

# Se ci sono conflitti, risolvi manualmente (vedi sotto)
```

### Opzione 2: Merge

```bash
# Fetch le ultime modifiche
git fetch origin

# Merge del branch fix
git merge origin/claude/fix-server-startup-01Ao2dQNiLqCWfjhqXxfTYjd

# Se ci sono conflitti, risolvi manualmente (vedi sotto)
```

### Opzione 3: Applicazione Manuale (se ci sono conflitti)

Se hai conflitti, applica manualmente le 4 sezioni di codice sopra al tuo `dashboard/server.js`:

1. **All'inizio del file** (dopo `#!/usr/bin/env node` e commenti): aggiungi i 2 process.on() handlers
2. **Dopo i require**: aggiungi i console.log di debug
3. **Prima di server.listen()**: aggiungi il log "Initializing HTTP server"
4. **Dopo server.listen()**: aggiungi il server.on('error') handler

---

## Verifica che npm install Funzioni

Sul tuo branch, assicurati che `dashboard/package.json` esista e contenga:

```json
{
  "name": "cpf-dashboard-server",
  "version": "1.0.0",
  "description": "CPF Dashboard Server",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "archiver": "^7.0.1",
    "cors": "^2.8.5",
    "exceljs": "^4.4.0",
    "express": "^4.18.2",
    "pdfkit": "^0.17.2",
    "pg": "^8.11.3",
    "socket.io": "^4.8.1"
  }
}
```

Poi esegui:

```bash
cd dashboard
npm install
```

---

## Test Finale

```bash
cd dashboard
npm start
```

Dovresti vedere:

```
[Server] Starting CPF Dashboard Server...
[Server] Core modules loaded
[Server] Loading data manager...
[Server] Data manager loaded successfully
[Server] Initializing HTTP server on port 3000

╔════════════════════════════════════════════════════════════╗
║          🛡️  CPF Dashboard Server v2.0 - RUNNING            ║
╚════════════════════════════════════════════════════════════╝
...
```

Se hai ancora problemi, il nuovo error handler mostrerà chiaramente quale modulo manca o quale errore si verifica!

---

## Risoluzione Conflitti Git (se necessari)

Se durante cherry-pick o merge vedi conflitti in `server.js`:

1. Apri `dashboard/server.js`
2. Cerca i marker di conflitto `<<<<<<<`, `=======`, `>>>>>>>`
3. Mantieni ENTRAMBE le versioni:
   - Le TUE modifiche del branch integrate-all-features
   - Le NUOVE righe di error handling
4. Rimuovi i marker di conflitto
5. Esegui:
```bash
git add dashboard/server.js
git cherry-pick --continue
# oppure
git merge --continue
```

---

## Note Importanti

- ✅ `package.json` è già committato nel repo
- ✅ Le dipendenze sono complete
- ✅ Il problema era solo `npm install` non eseguito + mancanza error handlers
- ✅ Ora il server mostra chiaramente gli errori invece di uscire silenziosamente
