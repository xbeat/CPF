# Guida di Integrazione - CPF Auth Module

Questa guida spiega passo-passo come integrare il modulo di autenticazione nella dashboard CPF principale.

---

## 📋 Indice

1. [Prerequisiti](#prerequisiti)
2. [Fase 1: Test Standalone](#fase-1-test-standalone)
3. [Fase 2: Preparazione Database](#fase-2-preparazione-database)
4. [Fase 3: Integrazione Backend](#fase-3-integrazione-backend)
5. [Fase 4: Protezione Pagine](#fase-4-protezione-pagine)
6. [Fase 5: Configurazione Produzione](#fase-5-configurazione-produzione)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisiti

Prima di iniziare, assicurati di avere:

- [ ] Node.js >= 18.0.0
- [ ] PostgreSQL 14+ configurato e funzionante
- [ ] Dashboard CPF principale funzionante
- [ ] Accesso alle variabili ambiente
- [ ] (Opzionale) Account Resend per invio email

---

## Fase 1: Test Standalone

Prima di integrare, testa il modulo auth in modo isolato.

### 1.1 Installazione

```bash
cd /path/to/CPF/dashboard/auth-module

# Installa dipendenze
npm install
```

### 1.2 Configurazione

```bash
# Copia template
cp .env.example .env

# Modifica con i tuoi valori
nano .env
```

**Valori minimi da configurare:**

```env
# Database (stesso della dashboard)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cpf_dashboard
DB_USER=postgres
DB_PASSWORD=la_tua_password

# JWT Secrets - GENERA NUOVI VALORI!
# Usa: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_ACCESS_SECRET=genera_una_stringa_di_64_caratteri_hex
JWT_REFRESH_SECRET=genera_una_stringa_diversa_di_64_caratteri_hex
JWT_EMAIL_SECRET=genera_una_terza_stringa_di_64_caratteri_hex
JWT_RESET_SECRET=genera_una_quarta_stringa_di_64_caratteri_hex

# Admin iniziale
INITIAL_ADMIN_EMAIL=admin@tuodominio.com
INITIAL_ADMIN_PASSWORD=Password_Sicura_123!

# Per ora disabilita approvazione
REGISTRATION_REQUIRES_APPROVAL=false
```

### 1.3 Inizializza Database

```bash
npm run db:init
```

Output atteso:
```
╔═══════════════════════════════════════════════════════════╗
║        CPF Auth Module - Database Initialization          ║
╚═══════════════════════════════════════════════════════════╝

[1/4] Checking database connection...
      ✓ Database connected
[2/4] Creating schema...
      ✓ Schema created
[3/4] Creating initial super admin...
      ✓ Super admin created: admin@tuodominio.com
[4/4] Initializing settings...
      ✓ Settings initialized

╔═══════════════════════════════════════════════════════════╗
║              Initialization Complete! ✓                   ║
╚═══════════════════════════════════════════════════════════╝
```

### 1.4 Avvia Server di Test

```bash
npm run dev
```

### 1.5 Test Manuale

1. Apri `http://localhost:3001/login`
2. Accedi con le credenziali admin create
3. Prova la registrazione: `http://localhost:3001/register`
4. Prova il recupero password: `http://localhost:3001/forgot-password`

---

## Fase 2: Preparazione Database

Il modulo auth condivide il database con la dashboard principale. Le nuove tabelle create sono:

| Tabella | Descrizione |
|---------|-------------|
| `auth_users` | Utenti con credenziali e stato |
| `auth_sessions` | Sessioni attive (refresh tokens) |
| `auth_password_resets` | Token reset password |
| `auth_email_verifications` | Token verifica email |
| `auth_audit_log` | Log di tutte le azioni |
| `auth_settings` | Impostazioni globali auth |
| `auth_user_organizations` | Assegnazioni multi-org |
| `auth_rate_limits` | Rate limiting persistente |

### 2.1 Verifica Tabelle

```sql
-- Controlla che le tabelle esistano
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name LIKE 'auth_%';
```

### 2.2 Relazione con Tabella Organizations

La tabella `auth_users` ha una foreign key verso `organizations(id)`:

```sql
-- La colonna org_id in auth_users referenzia organizations
ALTER TABLE auth_users
ADD CONSTRAINT fk_auth_users_org
FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE SET NULL;
```

Questo è già gestito dallo schema, ma assicurati che la tabella `organizations` esista prima di inizializzare auth.

---

## Fase 3: Integrazione Backend

Ora integriamo l'auth nel server principale della dashboard.

### 3.1 Modifica `dashboard/server.js`

Aggiungi queste righe all'inizio del file, dopo gli import esistenti:

```javascript
// ============================================================================
// AUTH MODULE INTEGRATION
// ============================================================================

// Importa middleware auth
const authMiddleware = require('./auth-module/server/middleware/auth');
const { apiLimiter } = require('./auth-module/server/middleware/rateLimiter');

// Importa routes auth
const authRoutes = require('./auth-module/server/routes/auth.routes');
const passwordRoutes = require('./auth-module/server/routes/password.routes');
const usersRoutes = require('./auth-module/server/routes/users.routes');
```

### 3.2 Aggiungi Middleware Globali

Prima delle definizioni delle route, aggiungi:

```javascript
// Cookie parser per refresh tokens
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Rate limiting su API
app.use('/api', apiLimiter);
```

### 3.3 Monta Route Auth

Dopo le route esistenti, aggiungi:

```javascript
// ============================================================================
// AUTH ROUTES
// ============================================================================

app.use('/api/auth', authRoutes);
app.use('/api/auth/password', passwordRoutes);
app.use('/api/auth/users', usersRoutes);

// Serve pagine auth
app.use('/auth', express.static(path.join(__dirname, 'auth-module/client')));

// Redirect login
app.get('/login', (req, res) => {
    res.redirect('/auth/login.html');
});
```

### 3.4 Proteggi le API Esistenti

Modifica le API esistenti per richiedere autenticazione:

```javascript
// PRIMA (senza auth)
app.get('/api/organizations', async (req, res) => { ... });

// DOPO (con auth)
app.get('/api/organizations',
    authMiddleware.authenticate,  // Richiede token valido
    authMiddleware.requirePermission('orgs:read'),  // Controlla permesso
    async (req, res) => { ... }
);
```

### 3.5 Mappa Permessi per Ruolo

| Ruolo | Permessi |
|-------|----------|
| `super_admin` | Tutto |
| `admin` | users:*, orgs:read, assessments:*, audit:read |
| `auditor` | orgs:read, assessments:read/create/update |
| `viewer` | orgs:read, assessments:read |

### 3.6 Esempio Completo di API Protetta

```javascript
const { authenticate, requirePermission, requireSameOrg } = require('./auth-module/server/middleware/auth');

// Solo utenti autenticati con permesso 'assessments:create'
// e appartenenti alla stessa org (o super_admin)
app.post('/api/organizations/:orgId/assessments',
    authenticate,
    requirePermission('assessments:create'),
    requireSameOrg(),
    async (req, res) => {
        try {
            // req.user contiene: { id, email, role, orgId }
            const assessment = await saveAssessment(
                req.params.orgId,
                req.body,
                req.user.id  // Assessor ID
            );
            res.json({ success: true, assessment });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);
```

---

## Fase 4: Protezione Pagine

### 4.1 Aggiungi Script di Verifica Auth

Crea un file `dashboard/shared/auth-check.js`:

```javascript
/**
 * Auth Check - Verifica autenticazione lato client
 * Includere in tutte le pagine protette
 */

(function() {
    const AUTH_URL = '/auth';
    const TOKEN_KEY = 'cpf_access_token';

    // Controlla se c'è un token
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
        // Nessun token, redirect a login
        window.location.href = `${AUTH_URL}/login.html?redirect=${encodeURIComponent(window.location.pathname)}`;
        return;
    }

    // Verifica validità token (opzionale: decodifica JWT e controlla exp)
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000;

        if (Date.now() >= exp) {
            // Token scaduto, prova refresh
            refreshToken().catch(() => {
                localStorage.removeItem(TOKEN_KEY);
                window.location.href = `${AUTH_URL}/login.html?expired=true`;
            });
        }
    } catch (e) {
        // Token malformato
        localStorage.removeItem(TOKEN_KEY);
        window.location.href = `${AUTH_URL}/login.html`;
    }

    async function refreshToken() {
        const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem(TOKEN_KEY, data.accessToken);
        } else {
            throw new Error('Refresh failed');
        }
    }
})();
```

### 4.2 Includi in Pagine Protette

Modifica le pagine HTML della dashboard per includere il check:

```html
<!-- dashboard/auditing/index.html -->
<head>
    <!-- ... altri tag ... -->

    <!-- Auth Check - DEVE essere primo script -->
    <script src="/shared/auth-check.js"></script>
</head>
```

### 4.3 Modifica API Client

Aggiorna le chiamate API per includere il token:

```javascript
// dashboard/auditing/dashboard.js

async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('cpf_access_token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, {
        ...options,
        headers,
        credentials: 'include'
    });

    // Gestisci 401
    if (response.status === 401) {
        // Prova refresh
        try {
            const refreshResponse = await fetch('/api/auth/refresh', {
                method: 'POST',
                credentials: 'include'
            });

            if (refreshResponse.ok) {
                const data = await refreshResponse.json();
                localStorage.setItem('cpf_access_token', data.accessToken);
                // Riprova richiesta originale
                headers['Authorization'] = `Bearer ${data.accessToken}`;
                return fetch(endpoint, { ...options, headers, credentials: 'include' });
            }
        } catch (e) {}

        // Refresh fallito, vai a login
        window.location.href = '/auth/login.html?expired=true';
        return;
    }

    return response;
}
```

### 4.4 Aggiungi Pulsante Logout

```html
<!-- Nella navbar della dashboard -->
<button id="logoutBtn" class="nav-button">
    <span class="icon">🚪</span>
    <span>Logout</span>
</button>

<script>
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('cpf_access_token')}`
            },
            credentials: 'include'
        });
    } finally {
        localStorage.removeItem('cpf_access_token');
        localStorage.removeItem('cpf_user');
        window.location.href = '/auth/login.html?logout=true';
    }
});
</script>
```

---

## Fase 5: Configurazione Produzione

### 5.1 Variabili Ambiente Produzione

```env
# Produzione
NODE_ENV=production

# URL
AUTH_BASE_URL=https://tuodominio.com
DASHBOARD_URL=https://tuodominio.com

# Database (usa connessione sicura)
DB_HOST=db.tuodominio.com
DB_PORT=5432
DB_NAME=cpf_production
DB_USER=cpf_app
DB_PASSWORD=password_molto_sicura

# JWT (genera secrets unici per produzione!)
JWT_ACCESS_SECRET=nuova_stringa_produzione_64_char
JWT_REFRESH_SECRET=nuova_stringa_produzione_64_char
JWT_EMAIL_SECRET=nuova_stringa_produzione_64_char
JWT_RESET_SECRET=nuova_stringa_produzione_64_char

# Resend
RESEND_API_KEY=re_produzione_key
EMAIL_FROM_ADDRESS=noreply@tuodominio.com

# Sicurezza extra
CORS_ALLOWED_ORIGINS=https://tuodominio.com
```

### 5.2 HTTPS

Il modulo richiede HTTPS in produzione per:
- Cookie sicuri (`secure: true`)
- HSTS headers
- Protezione token

### 5.3 Reverse Proxy (Nginx)

```nginx
# /etc/nginx/sites-available/cpf-dashboard

server {
    listen 443 ssl http2;
    server_name tuodominio.com;

    ssl_certificate /etc/letsencrypt/live/tuodominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tuodominio.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5.4 Process Manager (PM2)

```bash
# Installa PM2
npm install -g pm2

# Crea ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'cpf-dashboard',
    script: 'server.js',
    cwd: '/path/to/CPF/dashboard',
    instances: 'max',
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
EOF

# Avvia
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

---

## Troubleshooting

### "Cannot find module './auth-module/...'"

Assicurati che il path sia corretto nel require. Se il tuo server.js è in `dashboard/`, il path deve essere `./auth-module/...`.

### "Foreign key constraint failed"

La tabella `organizations` deve esistere prima di inizializzare auth. Esegui prima le migrazioni della dashboard principale.

### "CORS error"

Aggiungi il dominio in `CORS_ALLOWED_ORIGINS`:

```env
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,https://tuodominio.com
```

### Token non salvato

Controlla che localStorage sia accessibile (non in iframe cross-origin, non in modalità privata con localStorage disabilitato).

### Refresh token non funziona

Verifica che:
1. Cookie siano abilitati
2. `credentials: 'include'` sia presente nelle fetch
3. Il dominio sia lo stesso per auth e dashboard

### Email non inviate

1. Verifica RESEND_API_KEY
2. Verifica che il dominio sia verificato in Resend
3. In development, le email sono solo loggate in console

---

## Checklist Finale

- [ ] Test standalone completato
- [ ] Database inizializzato
- [ ] Routes auth montate in server.js
- [ ] API protette con middleware
- [ ] Pagine HTML includono auth-check.js
- [ ] API client modificato per includere token
- [ ] Pulsante logout aggiunto
- [ ] Email configurate (Resend)
- [ ] HTTPS configurato
- [ ] Variabili produzione configurate
- [ ] PM2 o altro process manager configurato
- [ ] Backup database configurato

---

## Supporto

Per problemi o domande:
1. Controlla la sezione Troubleshooting
2. Leggi i log del server (`npm run dev` per log dettagliati)
3. Controlla l'audit log nel database (`SELECT * FROM auth_audit_log ORDER BY created_at DESC LIMIT 100`)

---

*Documento aggiornato: Dicembre 2024*
*Versione: 1.0.0*
