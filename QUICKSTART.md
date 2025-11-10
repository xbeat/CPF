# 🚀 CPF Dashboard - Quick Start

## Setup (Prima volta)

```bash
cd /home/user/CPF
npm install
```

## Avvia il Server

```bash
node server.js
```

Il server parte su **http://localhost:3000**

---

## 🌐 URL Disponibili

### Dashboards
- **SOC Dashboard:** `http://localhost:3000/dashboard/dashboard.html`
- **Auditing Dashboard:** `http://localhost:3000/dashboard/dashboard_auditing.html`

### Field Kit Client
- **Client:** `http://localhost:3000/client/cpf_client_json.html`

---

## 📊 Workflow Rapido

### Opzione 1: Dati Sintetici (Test)

```bash
# 1. Genera 100 schede sintetiche
node dashboard/scripts/generate_field_kit_assessments.js

# 2. Importa nel sistema
node dashboard/scripts/batch_import.js field_kit_exports

# 3. Avvia server
node server.js

# 4. Apri browser
http://localhost:3000/dashboard/dashboard_auditing.html
```

### Opzione 2: Workflow Completo

1. **Avvia server:**
   ```bash
   node server.js
   ```

2. **Apri client Field Kit:**
   ```
   http://localhost:3000/client/cpf_client_json.html
   ```

3. **Compila e esporta schede:**
   - Seleziona lingua, categoria, indicatore
   - Load Indicator
   - Compila assessment
   - Calculate Score CPF
   - Export to Dashboard

4. **Batch Import & View:**
   - Click **"📊 Batch Import & View Dashboard"**
   - Conferma → Import automatico
   - Dashboard si apre con analisi completa!

---

## 🔌 API Endpoints

```bash
# Organizzazioni
curl http://localhost:3000/api/organizations

# Risultati auditing
curl http://localhost:3000/api/auditing-results

# Lista export disponibili
curl http://localhost:3000/api/list-exports

# Batch import (POST)
curl -X POST http://localhost:3000/api/batch-import \
  -H "Content-Type: application/json" \
  -d '{"folderPath": null}'

# Genera dati sintetici (POST)
curl -X POST http://localhost:3000/api/generate-synthetic
```

---

## 📁 Struttura Cartelle

```
/home/user/CPF/
├── server.js                    ← Server Node.js principale
├── package.json                 ← Dipendenze npm
├── dashboard/
│   ├── dashboard.html           ← Dashboard SOC
│   ├── dashboard_auditing.html  ← Dashboard Auditing
│   ├── bayesian.js              ← Engine analisi
│   ├── data/
│   │   ├── organizations.json
│   │   └── auditing_results.json
│   └── scripts/
│       ├── batch_import.js
│       └── generate_field_kit_assessments.js
├── auditor field kit/
│   └── interactive/
│       ├── cpf_client_json.html ← Field Kit Client
│       └── script.js
└── field_kit_exports/           ← Export schede
    └── dashboard_export_*.json
```

---

## ❓ Problemi Comuni

### "Cannot find module 'express'"
```bash
npm install
```

### "Port 3000 already in use"
Modifica `PORT` in `server.js` oppure termina processo:
```bash
lsof -ti:3000 | xargs kill -9
```

### Dashboard vuota / "No data"
```bash
# Genera dati test
node dashboard/scripts/generate_field_kit_assessments.js
node dashboard/scripts/batch_import.js field_kit_exports
```

---

## 📚 Documentazione Completa

Vedi `/dashboard/README.md` per documentazione dettagliata.

---

**Buon lavoro! 🎉**
