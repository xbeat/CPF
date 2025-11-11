# Quick Start - CPF Data Generation

## 🚀 Generare Dati Demo

### Un solo comando:

```bash
npm run generate:demo
```

Questo genera:
- **5 organizzazioni demo** (TechCorp, FinanceFirst, HealthPlus, RetailMax, EduLearn)
- **30-70 assessments random** per organizzazione
- **Calcolo aggregati Bayesiani** automatico
- **Index file** con statistiche rapide

---

## 📁 File Generati

```
/dashboard/data/
├── organizations_index.json          # ← Indice organizzazioni
└── organizations/
    ├── org-demo-001.json              # ← TechCorp Global (61 assessments)
    ├── org-demo-002.json              # ← FinanceFirst Bank (67 assessments)
    ├── org-demo-003.json              # ← HealthPlus Clinic (59 assessments)
    ├── org-demo-004.json              # ← RetailMax Store (48 assessments)
    └── org-demo-005.json              # ← EduLearn Academy (69 assessments)
```

---

## 🔄 Rigenera Dati

Per rigenerare i dati demo (sovrascrive esistenti):

```bash
npm run generate:demo
```

---

## 📊 Verifica Dati

```bash
# Visualizza index
cat dashboard/data/organizations_index.json | json_pp

# Visualizza singola org
cat dashboard/data/organizations/org-demo-001.json | json_pp

# Conta assessments
cat dashboard/data/organizations/org-demo-001.json | grep '"indicator_id"' | wc -l
```

---

## 📚 Documentazione

Per dettagli completi sulla struttura dati:

📖 **[README.md](./README.md)** - Documentazione completa

---

**Versione**: 2.0
**Data**: 2025-01-11
