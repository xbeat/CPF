# CPF Dashboard System - Complete Guide

## 📦 Overview

Unified Node.js server for the CPF (Cognitive Persuasion Framework) Dashboard system, providing:

- **Dashboard SOC** - SOC + Bayesian Analysis Dashboard
- **Dashboard Auditing** - Field Kit Progress Tracking + Risk Analysis
- **Batch Import System** - Automated import of Field Kit assessments
- **RESTful API** - Backend services for data management
- **PostgreSQL Integration** - Database schema and seed data

## 📁 Repository Structure

```
dashboard/
├── README.md                    # This file
├── index.html                   # Main dashboard interface
├── styles.css                   # Global dashboard styles
├── bayesian.js                  # Bayesian inference engine
├── visualizations.js            # Chart and visualization library
├── start.sh                     # Server startup script
│
├── lib/                         # Core libraries
│   └── dataManager.js           # Data management module
│
├── scripts/                     # Utility scripts
│   ├── batch_import.js          # Batch import Field Kit exports
│   ├── generate_synthetic_data.js
│   ├── generate_field_kit_assessments.js
│   └── generate_demo_organizations.js
│
├── data/                        # Application data
│   ├── organizations.json       # Organization data
│   ├── auditing_results.json    # Assessment results
│   └── README.md
│
├── postgres/                    # PostgreSQL files
│   ├── README.md
│   ├── DATABASE_SETUP.md        # Database setup guide
│   ├── QUICK_START.md           # Quick start guide
│   ├── db_schema.sql            # Database schema
│   └── db_seed_demo.js          # Seed data script
│
├── auditing/                    # Auditing dashboard
│   ├── index.html               # Auditing interface
│   └── v1_backup.html           # Legacy version
│
├── soc-integration/             # SOC integration
│   └── index.html
│
└── docs/                        # Documentation
    ├── USER_GUIDE.html
    └── archive/                 # Archived documentation
        ├── API_DOCUMENTATION.md
        ├── INTEGRATION.md
        └── papers/              # Academic papers
            ├── Bayesian_Cross_Indicator_Inference...pdf
            └── Bayesian_Cross_Indicator_Inference...tex
```

> **Note**: Assessment data (JSON indicators) is located in `/auditor field kit/interactive/` directory. See main repository documentation for details.

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd /path/to/CPF
npm install
```

This will install:
- `express` - Web server framework
- `cors` - Cross-origin resource sharing

### 2. Start the Server

```bash
npm start
# or
node server.js
```

Server will start on **http://localhost:3000**

---

## 🌐 Available Endpoints

### Web Interfaces

| URL | Description |
|-----|-------------|
| `http://localhost:3000/dashboard/` | Main dashboard interface |
| `http://localhost:3000/dashboard/auditing/` | Auditing Progress + Risk Analysis Dashboard |
| `http://localhost:3000/dashboard/soc-integration/` | SOC Integration Dashboard |

> **Note**: Field Kit Assessment Client is located in `/auditor field kit/interactive/archive/client-app/`

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/organizations` | Returns organizations.json data |
| GET | `/api/auditing-results` | Returns auditing_results.json data |
| GET | `/api/list-exports` | Lists available Field Kit export files |
| POST | `/api/batch-import` | Executes batch import of Field Kit exports |
| POST | `/api/generate-synthetic` | Generates synthetic Field Kit assessment files |

---

## 📊 Complete Workflow

### Option A: Quick Test with Synthetic Data

1. **Start the server:**
   ```bash
   node server.js
   ```
   (From repository root)

2. **Generate synthetic data:**
   ```bash
   node dashboard/scripts/generate_field_kit_assessments.js
   ```
   This creates 100 synthetic Field Kit assessments in `/field_kit_exports/`

3. **Run batch import:**
   ```bash
   node dashboard/scripts/batch_import.js field_kit_exports
   ```

4. **View results:**
   - Open `http://localhost:3000/dashboard/`
   - Or `http://localhost:3000/dashboard/auditing/`

### Option B: Using PostgreSQL Database

1. **Setup database:**
   ```bash
   psql -U postgres -f dashboard/postgres/db_schema.sql
   ```

2. **Seed demo data:**
   ```bash
   node dashboard/postgres/db_seed_demo.js
   ```

3. **Start the server:**
   ```bash
   node server.js
   ```

4. **View dashboards:**
   - Main: `http://localhost:3000/dashboard/`
   - Auditing: `http://localhost:3000/dashboard/auditing/`
   - SOC: `http://localhost:3000/dashboard/soc-integration/`

---

## 🎯 Dashboard Features

### Dashboard Auditing (Enhanced)

**Two Tabs:**

#### Tab 1: Progress Tracking
- Overall completion percentage (0-100%)
- Category-level progress bars
- 10×10 indicator completion grid (green = completed, gray = missing)
- Missing indicators list

#### Tab 2: Risk Analysis
- **Overall Risk Score** - Bayesian merged organizational risk
- **Category Heatmap** - Visual risk levels per category (Authority, Temporal, Social, etc.)
- **Prioritization Matrix** - Categories ordered by priority for remediation
- **Convergence Chart** - SOC vs Human assessment comparison over time
- **Indicator Grid** - 100 indicators with risk levels (click for details)

### Dashboard SOC

Full Bayesian analysis dashboard with:
- Multi-organization sidebar
- Overall risk assessment
- Category heatmaps
- Prioritization tables
- SOC vs Human convergence charts
- Detailed indicator modals

---

## 📁 Data Files

### Generated Files

| File | Location | Description |
|------|----------|-------------|
| `organizations.json` | `/dashboard/data/` | Full organization data with 100 indicators per org |
| `auditing_results.json` | `/dashboard/data/` | Progress tracking and coverage statistics |
| `dashboard_export_*.json` | `/field_kit_exports/` | Individual Field Kit assessment exports |

### Data Structure

**Field Kit Export Format:**
```json
{
  "organization_id": "org-001",
  "organization_name": "Acme Corporation",
  "indicator_id": "1.3",
  "indicator_data": {
    "soc_values": [],
    "human_values": [{
      "timestamp": "2025-11-10T10:30:00Z",
      "value": 0.68,
      "assessor": "Jane Smith",
      "assessment_id": "fk-1234567890-13"
    }],
    "current_bayesian": 0.68,
    "last_updated": "2025-11-10T10:30:00Z"
  },
  "metadata": {
    "exported_from": "field_kit",
    "export_timestamp": "2025-11-10T10:30:00Z",
    "field_kit_version": "1.0"
  }
}
```

---

## 🔧 Manual Scripts (Still Available)

All original manual scripts remain functional:

```bash
# Generate synthetic organizations.json directly
node scripts/generate_synthetic_data.js

# Generate Field Kit export files
node scripts/generate_field_kit_assessments.js

# Batch import Field Kit exports
node scripts/batch_import.js /path/to/exports/folder
```

---

## 🛠️ Bayesian Analysis

The system uses a sophisticated Bayesian inference engine (`bayesian.js`) that:

1. **Merges SOC + Human Data**
   - SOC values weighted by confidence
   - Human assessments weighted 1.5× (more trustworthy)
   - Formula: `(SOC × confidence + Human × 1.5) / (confidence + 1.5)`

2. **Category Risk Calculation**
   - Aggregates 10 indicators per category
   - Calculates mean, variance, and confidence

3. **Bayesian Network Inference**
   - Applies cross-category dependencies
   - Example: High Authority risk → increases Social risk by 30%

4. **Overall Risk Score**
   - Weighted combination of 10 categories
   - Authority: 12%, AI: 12%, Stress: 11%, etc.

5. **Prioritization**
   - Priority Score = (Risk × Weight) + (Downstream Impact × 0.1)
   - Recommendations: Critical, Review, Monitor

---

## 🔐 Security Notes

- Server runs on `localhost:3000` by default (not exposed externally)
- CORS enabled for local development
- No authentication required (local use only)
- File paths validated to prevent directory traversal

---

## 🐛 Troubleshooting

### "Failed to load data. Run batch import first."

**Solution:** Generate data first:
```bash
node scripts/generate_field_kit_assessments.js
node scripts/batch_import.js ../field_kit_exports
```

### "Batch Import Failed - Folder not found"

**Solution:** Ensure `/field_kit_exports/` exists and contains `dashboard_export_*.json` files.

### "Port 3000 already in use"

**Solution:** Change port in `server.js`:
```javascript
const PORT = 3001; // Change this
```

### Canvas charts not rendering

**Solution:** Refresh the page or switch tabs to trigger re-render.

---

## 📚 Resources

- **CPF Framework:** https://cpf3.org
- **Assessment Data (JSON):** `/auditor field kit/interactive/`
- **Field Kit Client (archived):** `/auditor field kit/interactive/archive/client-app/`
- **Database Schema:** `/dashboard/postgres/db_schema.sql`
- **API Documentation:** `/dashboard/docs/archive/API_DOCUMENTATION.md`
- **Integration Guide:** `/dashboard/docs/archive/INTEGRATION.md`
- **Bayesian Engine:** `/dashboard/bayesian.js`
- **Visualization Library:** `/dashboard/visualizations.js`

---

## 🎓 Development Notes

### Adding New Indicators

1. Create JSON file in `/auditor field kit/interactive/{lang}/{cat}.x-{name}/`
2. Follow schema documentation in `/auditor field kit/interactive/README.md`
3. Use indicator 1.3 as reference template
4. Validate JSON syntax before committing

### Modifying Bayesian Weights

Edit in `/dashboard/bayesian.js`:
```javascript
CATEGORY_WEIGHTS: {
  authority: 0.12,  // Adjust as needed
  temporal: 0.10,
  // ...
}
```

### Customizing Dashboard Styles

All dashboards use `/dashboard/styles.css`

---

## ✨ What's New

### Enhanced Auditing Dashboard
- **Two-tab interface** - Progress + Analysis
- **Bayesian risk analysis** - Full organizational risk assessment
- **Category heatmaps** - Visual risk representation
- **Convergence charts** - SOC vs Human timeline
- **Integrated with server API** - No more manual imports

### Unified Server
- **One server for everything** - SOC, Auditing dashboards
- **RESTful API** - Programmatic access to all data
- **Batch import system** - Automated assessment processing
- **PostgreSQL integration** - Database-backed data persistence

### Reorganized Structure
- **PostgreSQL consolidated** - All database files in `/postgres/`
- **Documentation archived** - API docs and papers in `/docs/archive/`
- **Clean root directory** - Focus on dashboard application files
- **Modular architecture** - Clear separation of concerns

---

## 📝 License

Part of the CPF (Cognitive Persuasion Framework) project.

---

## 🤝 Support

For issues or questions, please check:
- Server logs in terminal
- Browser console (F12)
- Data file structure in `/dashboard/data/`
- Export file format in `/field_kit_exports/`

---

**Happy analyzing! 🎉**
