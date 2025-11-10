# CPF Dashboard System - Complete Guide

## 📦 Overview

Unified Node.js server for the CPF (Cognitive Persuasion Framework) Dashboard system, providing:

- **Dashboard SOC** - SOC + Bayesian Analysis Dashboard
- **Dashboard Auditing** - Field Kit Progress Tracking + Risk Analysis
- **Field Kit Client** - Interactive assessment interface
- **Batch Import System** - Automated import of Field Kit assessments
- **RESTful API** - Backend services for data management

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd dashboard
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
| `http://localhost:3000/dashboard.html` | SOC + Bayesian Analysis Dashboard |
| `http://localhost:3000/dashboard_auditing.html` | Auditing Progress + Risk Analysis Dashboard |
| `http://localhost:3000/client/cpf_client_json.html` | Field Kit Assessment Client |

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

2. **Generate synthetic data:**
   ```bash
   node scripts/generate_field_kit_assessments.js
   ```
   This creates 100 synthetic Field Kit assessments in `/field_kit_exports/`

3. **Run batch import:**
   ```bash
   node scripts/batch_import.js ../field_kit_exports
   ```

4. **View results:**
   - Open `http://localhost:3000/dashboard_auditing.html`
   - Or `http://localhost:3000/dashboard.html`

### Option B: Using Field Kit Client (Recommended)

1. **Start the server:**
   ```bash
   node server.js
   ```

2. **Open Field Kit Client:**
   ```
   http://localhost:3000/client/cpf_client_json.html
   ```

3. **Load and complete assessments:**
   - Select language, category, and indicator
   - Click "Load Indicator"
   - Fill out the assessment form
   - Click "Calculate Score CPF"

4. **Export to Dashboard:**
   - Click "Export to Dashboard"
   - Enter organization ID and name
   - File saved to `/field_kit_exports/`

5. **Batch Import & View:**
   - Click **"Batch Import & View Dashboard"** button
   - Automatically imports all exports
   - Opens auditing dashboard in new tab

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
- **Field Kit JSON Structure:** See `/auditor field kit/interactive/{lang}/{cat}.x-{name}/indicator_{id}.json`
- **Bayesian Engine:** `/dashboard/bayesian.js`
- **Visualization Library:** `/dashboard/visualizations.js`

---

## 🎓 Development Notes

### Adding New Indicators

1. Create JSON file in `/auditor field kit/interactive/{lang}/{cat}.x-{name}/`
2. Follow schema in `validator.js`
3. Ensure indicator ID matches filename

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
- **One server for everything** - SOC, Auditing, Field Kit Client
- **RESTful API** - Programmatic access to all data
- **Batch import integration** - Direct from Field Kit Client

### Field Kit Client Integration
- **"Batch Import & View Dashboard" button** - One-click workflow
- **Server API calls** - Automated import process
- **Auto-open dashboard** - Seamless user experience

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
