# CPF Auth Module

Sistema di autenticazione top-tier per CPF Dashboard con supporto multi-tenancy, sicurezza enterprise-grade e funzionalità complete.

## 🌟 Funzionalità

### Autenticazione
- ✅ Login con email/password
- ✅ Registrazione con verifica email
- ✅ Recupero password via email (Resend)
- ✅ JWT Access Token + Refresh Token
- ✅ Logout singolo dispositivo
- ✅ Logout da tutti i dispositivi
- ✅ Gestione sessioni attive

### Sicurezza
- ✅ Password hashing con Argon2id (più sicuro di bcrypt)
- ✅ Rate limiting su tutte le operazioni sensibili
- ✅ Account lockout dopo tentativi falliti
- ✅ Security headers (Helmet.js)
- ✅ CSRF protection
- ✅ Audit log completo
- ✅ Rilevamento attività sospette
- ✅ Password policy enforcement (min 12 char, maiuscola, minuscola, numero, speciale)

### Gestione Account
- ✅ Ruoli utente: `super_admin`, `admin`, `auditor`, `viewer`
- ✅ Multi-tenancy (utenti legati a organizzazioni)
- ✅ Approvazione registrazioni (flag configurabile)
- ✅ Blocco/sblocco account (manuale e automatico)
- ✅ Sospensione account
- ✅ Scadenza account (default 1 anno)
- ✅ Estensione scadenza
- ✅ Pagina profilo utente (modifica dati personali)
- ✅ Gestione sessioni attive (visualizza e revoca)
- ✅ Cambio password con validazione

### Email (Resend)
- ✅ Email di verifica
- ✅ Email di benvenuto
- ✅ Reset password
- ✅ Notifica account bloccato
- ✅ Avviso scadenza account (7 giorni prima)
- ✅ Notifica cambio password
- ✅ Template HTML responsive e multilingua

### Multilingua
- ✅ Inglese (en-US)
- ✅ Italiano (it-IT)

---

## 📁 Struttura

```
auth-module/
├── README.md                     # Questa documentazione
├── INTEGRATION_GUIDE.md          # Guida di integrazione
├── package.json                  # Dipendenze Node.js
├── .env.example                  # Template variabili ambiente
│
├── server/                       # BACKEND
│   ├── index.js                  # Entry point server
│   ├── config/
│   │   ├── database.js           # Connessione PostgreSQL
│   │   ├── security.js           # Configurazione sicurezza
│   │   └── resend.js             # Template email
│   ├── middleware/
│   │   ├── auth.js               # JWT validation
│   │   ├── rateLimiter.js        # Rate limiting
│   │   ├── securityHeaders.js    # Helmet + headers
│   │   └── auditLog.js           # Logging audit
│   ├── routes/
│   │   ├── auth.routes.js        # Login, logout, register
│   │   ├── password.routes.js    # Reset, change password
│   │   └── users.routes.js       # Admin user management
│   ├── services/
│   │   ├── auth.service.js       # Logica autenticazione
│   │   ├── user.service.js       # CRUD utenti
│   │   ├── email.service.js      # Invio email
│   │   └── token.service.js      # JWT + refresh tokens
│   ├── schemas/
│   │   ├── auth_schema.sql       # Schema database
│   │   ├── init-db.js            # Script inizializzazione
│   │   ├── seed-admin.js         # Creazione super admin
│   │   └── seed-test-data.js     # Dati di test (sviluppo)
│   └── utils/
│       ├── crypto.js             # Hashing, encryption
│       └── validation.js         # Input validation
│
├── client/                       # FRONTEND
│   ├── index.html                # Redirect page
│   ├── login.html                # Pagina login
│   ├── register.html             # Pagina registrazione
│   ├── forgot-password.html      # Richiesta reset
│   ├── reset-password.html       # Form reset password
│   ├── verify-email.html         # Verifica email
│   ├── account-locked.html       # Account bloccato
│   ├── dashboard.html            # Dashboard principale (post-login)
│   ├── profile.html              # Pagina profilo utente
│   ├── admin.html                # Pannello admin
│   ├── 404.html                  # Pagina non trovata
│   ├── css/
│   │   ├── auth.css              # Stili autenticazione
│   │   └── dashboard.css         # Stili dashboard e profilo
│   └── js/
│       ├── i18n.js               # Internazionalizzazione
│       ├── auth-client.js        # API client
│       ├── login.js              # Logica login
│       ├── register.js           # Logica registrazione
│       ├── dashboard.js          # Logica dashboard
│       ├── profile.js            # Logica profilo
│       └── admin.js              # Logica admin panel
│
└── tests/                        # TEST (futuro)
    ├── auth.test.js
    └── security.test.js
```

---

## 🚀 Quick Start

### 1. Prerequisiti

- Node.js >= 18.0.0
- PostgreSQL 14+
- Database CPF Dashboard già configurato

### 2. Installazione

```bash
cd /path/to/CPF/dashboard/auth-module

# Installa dipendenze
npm install

# Copia e configura variabili ambiente
cp .env.example .env
nano .env  # Modifica con i tuoi valori
```

### 3. Configurazione .env

```env
# Database (usa stesso DB della dashboard principale)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cpf_dashboard
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Secrets (genera con: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_ACCESS_SECRET=your_64_char_secret_here
JWT_REFRESH_SECRET=your_64_char_secret_here
JWT_EMAIL_SECRET=your_64_char_secret_here
JWT_RESET_SECRET=your_64_char_secret_here

# Resend (https://resend.com)
RESEND_API_KEY=re_your_api_key
EMAIL_FROM_ADDRESS=noreply@yourdomain.com

# Admin iniziale
INITIAL_ADMIN_EMAIL=admin@yourdomain.com
INITIAL_ADMIN_PASSWORD=SecurePassword123!

# Registrazione
REGISTRATION_REQUIRES_APPROVAL=false
```

### 4. Inizializza Database

```bash
npm run db:init
```

Questo crea:
- Tabelle auth (users, sessions, tokens, audit_log, ecc.)
- Utente super_admin iniziale
- Impostazioni di default

### 5. Avvia Server

```bash
# Produzione
npm start

# Sviluppo (con logging dettagliato)
npm run dev
```

Il server parte su `http://localhost:3001`

### 6. Carica Dati di Test (opzionale)

Per sviluppo/testing, puoi caricare utenti di test:

```bash
npm run seed:test
```

Questo crea 10 utenti di test con diversi ruoli e stati:
| Email | Ruolo | Stato |
|-------|-------|-------|
| super.admin@test.local | super_admin | active |
| admin@test.local | admin | active |
| auditor1@test.local | auditor | active |
| auditor2@test.local | auditor | active |
| viewer@test.local | viewer | active |
| pending@test.local | auditor | pending_approval |
| locked@test.local | auditor | locked |
| suspended@test.local | viewer | suspended |
| expired@test.local | auditor | expired |
| expiring.soon@test.local | auditor | active (scade tra 5 giorni) |

**Password per tutti gli utenti di test: `TestPassword123!`**

### 7. Testa

Apri `http://localhost:3001/login` e accedi con:
- Email: (valore in INITIAL_ADMIN_EMAIL o un utente di test)
- Password: (valore in INITIAL_ADMIN_PASSWORD o `TestPassword123!`)

### Pagine Disponibili

| URL | Descrizione | Accesso |
|-----|-------------|---------|
| `/login` | Pagina di login | Pubblico |
| `/register` | Registrazione nuovo utente | Pubblico |
| `/forgot-password` | Recupero password | Pubblico |
| `/dashboard` | Dashboard principale | Utenti autenticati |
| `/profile` | Profilo utente (modifica dati, password, sessioni) | Utenti autenticati |
| `/admin` | Pannello amministrazione | Admin/Super Admin |

---

## 📚 API Reference

### Endpoints Pubblici

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrazione nuovo utente |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/verify-email` | Verifica email |
| POST | `/api/auth/resend-verification` | Reinvia email verifica |
| POST | `/api/auth/password/forgot` | Richiedi reset password |
| POST | `/api/auth/password/reset` | Reset password con token |
| GET | `/api/auth/password/verify-token` | Verifica validità token reset |
| GET | `/api/auth/settings/public` | Impostazioni pubbliche |

### Endpoints Autenticati

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| POST | `/api/auth/logout` | Logout sessione corrente |
| POST | `/api/auth/logout-all` | Logout da tutti i dispositivi |
| GET | `/api/auth/me` | Profilo utente corrente |
| PATCH | `/api/auth/me` | Aggiorna profilo |
| POST | `/api/auth/password/change` | Cambia password |
| GET | `/api/auth/sessions` | Lista sessioni attive |
| DELETE | `/api/auth/sessions/:id` | Revoca sessione |

### Endpoints Admin

| Metodo | Endpoint | Ruolo Minimo | Descrizione |
|--------|----------|--------------|-------------|
| GET | `/api/auth/users` | admin | Lista utenti |
| GET | `/api/auth/users/pending` | admin | Utenti in attesa approvazione |
| GET | `/api/auth/users/:id` | admin | Dettagli utente |
| POST | `/api/auth/users` | admin | Crea utente |
| PUT | `/api/auth/users/:id` | admin | Aggiorna utente |
| PATCH | `/api/auth/users/:id/role` | admin | Cambia ruolo |
| POST | `/api/auth/users/:id/approve` | admin | Approva utente |
| POST | `/api/auth/users/:id/reject` | admin | Rifiuta utente |
| POST | `/api/auth/users/:id/lock` | admin | Blocca utente |
| POST | `/api/auth/users/:id/unlock` | admin | Sblocca utente |
| POST | `/api/auth/users/:id/suspend` | admin | Sospendi utente |
| POST | `/api/auth/users/:id/activate` | admin | Attiva utente |
| POST | `/api/auth/users/:id/extend` | admin | Estendi scadenza |
| DELETE | `/api/auth/users/:id` | admin | Disattiva utente |
| GET | `/api/auth/users/admin/audit` | admin | Audit log |
| GET | `/api/auth/users/admin/settings` | super_admin | Impostazioni |
| PUT | `/api/auth/users/admin/settings` | super_admin | Aggiorna impostazioni |

---

## 🔐 Sicurezza

### Password Policy
- Minimo 12 caratteri
- Almeno 1 maiuscola
- Almeno 1 minuscola
- Almeno 1 numero
- Almeno 1 carattere speciale
- No password comuni (lista integrata)

### Rate Limiting
| Azione | Limite |
|--------|--------|
| Login | 5 / 15 min |
| Registrazione | 3 / ora |
| Reset password | 3 / ora |
| Verifica email | 5 / 5 min |
| API generale | 100 / min |

### Account Lockout
- Soglia: 5 tentativi falliti
- Durata: 30 minuti (progressivo)
- Email di notifica automatica

### Token Expiration
| Token | Durata |
|-------|--------|
| Access Token | 15 minuti |
| Refresh Token | 7 giorni |
| Email Verification | 24 ore |
| Password Reset | 1 ora |

---

## 🔧 Configurazione Avanzata

### Approvazione Registrazioni

Per richiedere approvazione admin per nuovi utenti:

```env
REGISTRATION_REQUIRES_APPROVAL=true
```

Gli admin riceveranno email quando nuovi utenti si registrano.

### Domini Email Consentiti

Per limitare registrazioni a specifici domini:

```env
ALLOWED_EMAIL_DOMAINS=azienda.com,partner.org
```

### Scadenza Account

Default: 365 giorni

```env
ACCOUNT_EXPIRY_DEFAULT_DAYS=365
```

### Lockout Progressivo

Abilitato di default. Durate: 5min → 15min → 30min → 1h → 24h

---

## 🧪 Testing

```bash
# Esegui test
npm test

# Con coverage
npm test -- --coverage
```

---

## 📧 Configurazione Email (Resend)

1. Crea account su [resend.com](https://resend.com)
2. Genera API key
3. Verifica dominio (per email da @tuodominio.com)
4. Configura in `.env`:

```env
RESEND_API_KEY=re_xxxxxxxxxx
EMAIL_FROM_NAME=CPF Dashboard
EMAIL_FROM_ADDRESS=noreply@tuodominio.com
```

---

## 🔄 Integrazione con Dashboard

Vedi [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) per istruzioni dettagliate su come integrare questo modulo nella dashboard principale.

---

## 🐛 Troubleshooting

### "Failed to connect to database"
- Verifica che PostgreSQL sia in esecuzione
- Controlla credenziali in `.env`
- Assicurati che il database esista

### "Schema initialization failed"
- La tabella `organizations` deve esistere (dalla dashboard principale)
- Esegui prima le migrazioni della dashboard

### "Email not sent"
- Verifica RESEND_API_KEY
- Controlla che il dominio sia verificato in Resend
- In development, le email sono loggate in console

### "Token expired"
- Il client deve gestire il refresh automatico
- Usa `authApi.refresh()` quando ricevi 401

---

## 📄 Licenza

MIT - CPF Team 2024
