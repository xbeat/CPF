# CPF Dashboard - SOC Integration + Bayesian Analysis

Multi-organization dashboard for CPF Framework with SOC machine data integration and Bayesian cross-indicator inference.

## 🎯 Overview

The CPF Dashboard aggregates security assessments across multiple organizations, combining:
- **SOC Machine Data**: Automated vulnerability detection from security tools
- **Field Kit Human Assessments**: Manual audits from security professionals
- **Bayesian Cross-Indicator Analysis**: Advanced inference across 100 CPF indicators

## 🚀 Quick Start

### 1. Generate Synthetic Data (First Time)
```bash
cd scripts
node generate_synthetic_data.js
```

This creates `data/organizations.json` with 8 sample organizations and 30 days of assessment history.

### 2. Open Dashboard

**IMPORTANT**: Due to CORS policy, you need an HTTP server (file:// protocol blocked).

**Option A - Quick Start Script (Easiest)**:
```bash
cd dashboard
./start.sh
# Auto-generates data (if needed) + starts server + opens browser
```

**Option B - Python Manual**:
```bash
cd dashboard
python3 -m http.server 8000
# Open browser: http://localhost:8000/dashboard.html
```

**Option B - Node.js**:
```bash
npm install -g http-server
cd dashboard
http-server -p 8000
# Open browser: http://localhost:8000/dashboard.html
```

**Option C - VSCode Live Server**:
- Install "Live Server" extension
- Right-click dashboard.html → "Open with Live Server"

### 3. Explore

**SOC + Bayesian Dashboard** (`dashboard.html`):
- Click any organization in sidebar
- View overall risk, category breakdown, prioritization
- Inspect individual indicators (100-tile grid)
- Analyze SOC vs Human convergence chart

**Auditing Progress Dashboard** (`dashboard_auditing.html`):
- Track Field Kit assessment completion (100 indicators)
- Visual 10×10 indicator grid (green=completed, gray=missing)
- Category-level progress breakdown
- Missing indicators list per organization

## 📊 Features

### Overall Risk Scoring
- **Bayesian Aggregation**: Merges SOC + Human assessments
- **Confidence Intervals**: Data quality indicators
- **Trend Detection**: 30-day evolution (improving/stable/deteriorating)

### Category Heatmap
- 10 CPF categories (Authority, Temporal, Social, etc.)
- Color-coded risk levels (green/yellow/red)
- Confidence visualization per category

### Prioritization Matrix
- Risk × Weight + Downstream Impact
- Identifies which categories to fix first
- Shows cascade effects (fixing X improves Y)

### Indicator Grid
- All 100 indicators (1.1 - 10.10)
- Click for detailed SOC/Human breakdown
- Visual risk heatmap

### Convergence Analysis
- Timeline chart: SOC vs Human assessments
- Identifies divergence (alerts for review)
- Aggregated daily averages

## 🧠 Bayesian Engine

### How It Works

**Step 1: Indicator-Level Merge**
```
Bayesian Value = (SOC × confidence + Human × 1.5) / (confidence + 1.5)
```
Human assessments weighted 1.5x (more trustworthy)

**Step 2: Cross-Category Dependencies**
```
Authority high → Social risk increases 30%
Temporal high → Stress risk increases 40%
... (full dependency matrix in bayesian.js)
```

**Step 3: Overall Risk Calculation**
```
Overall = Σ(Category Risk × Category Weight × Confidence)

Weights:
- Authority: 12%
- AI: 12%
- Stress: 11%
- Social: 11%
- ... (see CATEGORY_WEIGHTS)
```

## 📁 Architecture

```
dashboard/
├── dashboard.html                         # Main UI
├── dashboard_auditing.html                # Progress tracking dashboard
├── bayesian.js                            # Inference engine
├── visualizations.js                      # Charts (SOC vs Human)
├── styles.css                             # UI styling
├── USER_GUIDE.html                        # Human-readable documentation
├── INTEGRATION.md                         # Technical integration guide
├── PAPER.tex                              # Research paper (LaTeX)
├── data/
│   ├── schema.json                        # JSON schema definition
│   ├── organizations.json                 # Main data store (6MB)
│   └── auditing_results.json              # Progress tracking data
├── scripts/
│   ├── generate_synthetic_data.js         # SOC synthetic data generator
│   ├── generate_field_kit_assessments.js  # Field Kit synthetic generator
│   └── batch_import.js                    # Automated Field Kit importer
└── README.md                              # This file
```

## 🔗 Integration with Field Kit

### Export from Field Kit
1. Complete assessment in Field Kit
2. Calculate score
3. Click **"🔗 Export to Dashboard"**
4. Enter organization ID (e.g., `org-001`)
5. Save JSON file to a folder (e.g., `~/field_kit_exports/`)

### Automated Batch Import (Recommended)
**For 100 indicators per organization:**

```bash
# Step 1: Collect all Field Kit exports in one folder
mkdir -p ~/field_kit_exports
# Place all dashboard_export_*.json files here

# Step 2: Run batch importer
cd dashboard/scripts
node batch_import.js ~/field_kit_exports

# Output:
# ✓ Found 100 export files
# ✓ Organizations: 1
#   org-001 (Acme Corp)
#     ✓ Completed: 100/100 (100.0%)
#     ✗ Missing: 0 indicators
# ✓ Generated: auditing_results.json
# ✓ Updated: organizations.json

# Step 3: View progress tracking
python3 -m http.server 8000
# Open: http://localhost:8000/dashboard_auditing.html

# Step 4: View SOC+Bayesian analysis
# Open: http://localhost:8000/dashboard.html
```

**Features:**
- ✅ Scans folder for all Field Kit exports
- ✅ Groups by organization automatically
- ✅ Calculates coverage (completed/missing indicators)
- ✅ Merges human assessments with Bayesian recalculation
- ✅ Generates auditing progress dashboard
- ✅ Prevents duplicate imports (idempotent)

### Manual Import (Small Scale - 1-10 assessments)
1. Open `data/organizations.json`
2. Find organization by ID
3. Locate indicator (e.g., `1.3`)
4. Add human assessment to `human_values` array:
```json
"human_values": [
  {
    "timestamp": "2025-11-09T10:00:00Z",
    "value": 0.68,
    "assessor": "John Doe",
    "assessment_id": "fk-123456"
  }
]
```
5. Refresh dashboard

## 🛠️ Customization

### Adjust Bayesian Weights
Edit `bayesian.js`:
```javascript
CATEGORY_WEIGHTS: {
  authority: 0.12,  // Change to adjust importance
  ai: 0.15,         // Increase AI category weight
  ...
}
```

### Modify Dependencies
Edit `bayesian.js`:
```javascript
DEPENDENCIES: {
  authority: {
    social: 0.3,      // Authority → Social influence
    group: 0.2        // Authority → Group influence
  },
  ...
}
```

### Change Synthetic Data Config
Edit `scripts/generate_synthetic_data.js`:
```javascript
const CONFIG = {
  num_organizations: 10,    // More orgs
  days_history: 60,         // Longer timeline
  soc_frequency_days: 0.5,  // SOC twice per day
  ...
};
```

## 📊 Data Format

### Organizations JSON Structure
```json
{
  "metadata": {
    "version": "1.0",
    "generated": "2025-11-09T...",
    "total_organizations": 8
  },
  "organizations": {
    "org-001": {
      "name": "Organization 1",
      "industry": "Healthcare",
      "size": "enterprise",
      "country": "US",
      "indicators": {
        "1.1": {
          "soc_values": [...],
          "human_values": [...],
          "current_bayesian": 0.45,
          "last_updated": "..."
        },
        ...  // Up to 10.10
      },
      "aggregates": {
        "overall_risk": 0.54,
        "by_category": {...},
        "confidence": 0.85,
        "trend": "stable",
        "last_calculated": "..."
      }
    }
  }
}
```

## 🎨 Styling

Uses same color scheme as Field Kit for consistency:
- **Primary**: #1a1a2e
- **Success**: #2ecc71 (low risk)
- **Warning**: #f39c12 (medium risk)
- **Danger**: #e74c3c (high risk)

## 🚦 Risk Thresholds

- 🟢 **Low (0-33%)**: Healthy security posture
- 🟡 **Medium (34-66%)**: Review and improve
- 🔴 **High (67-100%)**: Critical vulnerabilities

## 📈 Roadmap

### Completed (v1.0)
- ✅ Bayesian cross-indicator inference
- ✅ SOC + Human data merging
- ✅ Multi-organization dashboard
- ✅ Category prioritization
- ✅ Trend analysis
- ✅ Field Kit export integration
- ✅ **Automated batch import (100 indicators)**
- ✅ **Auditing progress dashboard**
- ✅ **Synthetic Field Kit generator**
- ✅ **User Guide (human-readable docs)**
- ✅ **Technical integration docs**
- ✅ **Research paper (LaTeX template)**

### Planned (v2.0)
- [ ] Real-time SOC connector (API)
- [ ] Alert system (email/Slack)
- [ ] Historical comparison
- [ ] Benchmark against industry
- [ ] Predictive analytics (ML)
- [ ] Multi-user collaboration
- [ ] Backend persistence (optional)

## 🔒 Privacy

- **All client-side**: No data sent to servers
- **Local storage**: organizations.json stays on your machine
- **No tracking**: Zero analytics or external calls

## 🐛 Troubleshooting

**CORS Error / "Access blocked" in console**
- **Cause**: Opening `file://` directly in browser
- **Fix**: Use HTTP server (see Quick Start above)
- **Why**: Browsers block fetch() of local files for security
- **Solution**: `python3 -m http.server 8000` or `./start.sh`

**Dashboard shows "Error Loading Data"**
- Run `node scripts/generate_synthetic_data.js` first
- Check `data/organizations.json` exists
- Verify JSON is valid
- Make sure using HTTP server (not file://)

**Chart not rendering**
- Check browser console for errors
- Ensure Canvas API supported (Chrome 90+, Firefox 88+)
- Try refreshing page

**Bayesian scores seem wrong**
- Verify indicator data exists (soc_values or human_values)
- Check confidence values (0-1 range)
- Review dependency matrix in bayesian.js

## 📚 Documentation

### User-Facing
- **[USER_GUIDE.html](USER_GUIDE.html)**: Complete guide for interpreting dashboard metrics, Bayesian scores, convergence analysis, and decision-making
  - Risk score interpretation
  - Bayesian formulas explained
  - Category breakdown with attack examples
  - 18 FAQ entries

### Technical
- **[INTEGRATION.md](INTEGRATION.md)**: Developer and integrator guide (38 KB)
  - SOC integration workflow with code examples
  - Data format specifications
  - Bayesian engine API reference
  - Deployment options (local/static/docker/air-gapped)
  - Security considerations and troubleshooting

### Research
- **[Bayesian_Cross_Indicator_Inference_for_Cybersecurity_Psychology_Assessment__Integrating_SOC_Machine_Data_with_Human_Auditing.tex](Bayesian_Cross_Indicator_Inference_for_Cybersecurity_Psychology_Assessment__Integrating_SOC_Machine_Data_with_Human_Auditing)**: arXiv-ready research paper (30 KB)
  - Bayesian cross-indicator inference methodology
  - Validation on synthetic datasets
  - Complete bibliography
  - LaTeX template ready for submission

### Other Resources
- **Field Kit README**: `../auditor field kit/interactive/README.md`
- **CPF Framework**: Main repository documentation
- **JSON Schema**: `data/schema.json` for format details

## 💡 Tips

1. **Start Small**: Test with 2-3 organizations before scaling
2. **Regular Regeneration**: Run synthetic generator weekly for fresh data
3. **Validate Exports**: Use Field Kit's "🔍 Validate JSON" before export
4. **Monitor Trends**: Check dashboard daily for deteriorating trends
5. **Prioritize**: Focus on red categories with high downstream impact

---

**Version**: 1.0
**Status**: Production-ready for testing
**Budget Used**: ~$60 (within $84 target) ✅

For questions or issues, refer to main CPF documentation.
