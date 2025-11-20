# CPF Database - Quick Start Guide

## 🚀 Setup in 3 Steps

### 1. Installa PostgreSQL (se non presente)

```bash
brew install postgresql@16
brew services start postgresql@16
```

### 2. Setup Database Completo

```bash
# Dalla root del progetto CPF
npm install
npm run db:setup
```

Questo comando:
- Crea il database `cpf_db`
- Esegue lo schema (3 tabelle + views + functions)
- Genera 5 organizzazioni demo con assessments random

### 3. Verifica

```bash
# Verifica organizzazioni create
psql cpf_db -c "SELECT * FROM v_organization_risk_summary;"

# Verifica assessments
psql cpf_db -c "SELECT COUNT(*) FROM assessments;"
```

---

## 📝 Comandi NPM Disponibili

```bash
npm run db:schema    # Solo creazione schema
npm run db:seed      # Solo generazione dati demo
npm run db:setup     # Setup completo (crea DB + schema + seed)
```

---

## 📊 Organizzazioni Demo Generate

1. **TechCorp Global** (Technology, Enterprise, US)
2. **FinanceFirst Bank** (Finance, Enterprise, GB)
3. **HealthPlus Clinic** (Healthcare, Medium, IT)
4. **RetailMax Store** (Retail, Small, DE)
5. **EduLearn Academy** (Education, Medium, FR)

Ogni organizzazione ha **30-70 assessments random** (su 100 indicatori totali).

---

## 🔍 Query Utili

```bash
# Lista tutte le organizzazioni con statistiche
psql cpf_db -c "SELECT * FROM v_organization_risk_summary;"

# Ultimi 10 assessments
psql cpf_db -c "SELECT * FROM v_recent_assessments LIMIT 10;"

# Indicatori mancanti per un'organizzazione
psql cpf_db -c "SELECT * FROM get_missing_indicators('org-demo-001');"

# Percentuale completamento
psql cpf_db -c "SELECT get_org_completion_rate('org-demo-001');"

# Risk score complessivo
psql cpf_db -c "SELECT get_org_overall_risk('org-demo-001');"
```

---

## 🗑️ Reset Database

```bash
# ATTENZIONE: Elimina tutti i dati!
dropdb cpf_db
npm run db:setup
```

---

## 📚 Documentazione Completa

Per dettagli completi su installazione, troubleshooting, e configurazione avanzata:

📖 **[DATABASE_SETUP.md](./DATABASE_SETUP.md)**

---

## ✅ Prossimi Step

Dopo il setup del database:

1. **Fase 2**: Refactoring API backend per usare PostgreSQL
2. **Fase 3**: Aggiornamento Dashboard Auditing
3. **Fase 4**: Aggiornamento Client Auditing
4. **Fase 5**: Pulizia struttura cartelle

---

**Versione**: 1.0
**Data**: 2025-01-11
