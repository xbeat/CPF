# CPF Dashboard - Technical Integration Guide

**Version:** 1.0
**Last Updated:** 2025-11-09
**Audience:** Developers, Security Engineers, SOC Integrators

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Data Format Specifications](#data-format-specifications)
3. [SOC Integration](#soc-integration)
4. [Field Kit Integration](#field-kit-integration)
5. [Batch Import Workflow](#batch-import-workflow)
6. [Bayesian Engine API](#bayesian-engine-api)
7. [Extending the Framework](#extending-the-framework)
8. [Deployment Options](#deployment-options)
9. [Security Considerations](#security-considerations)
10. [Troubleshooting](#troubleshooting)

---

## System Architecture

### Component Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     CPF ECOSYSTEM                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │  SOC Systems │         │  Field Kit   │                  │
│  │  (SIEM, EDR) │         │  (Human)     │                  │
│  └──────┬───────┘         └──────┬───────┘                  │
│         │                        │                          │
│         │ JSON Export            │ JSON Export              │
│         ▼                        ▼                          │
│  ┌─────────────────────────────────────────┐                │
│  │   organizations.json (Unified Store)    │                │
│  │   - 100 indicators per org              │                │
│  │   - SOC + Human values                  │                │
│  │   - Bayesian merged scores              │                │
│  └─────────────┬───────────────────────────┘                │
│                │                                            │
│                │ Fetch (HTTP)                               │
│                ▼                                            │
│  ┌─────────────────────────────────────────┐                │
│  │       Dashboard (Client-Side)           │                │
│  │  ┌───────────────────────────────────┐  │                │
│  │  │ Bayesian Engine (bayesian.js)     │  │                │
│  │  │ - Indicator merge                 │  │                │
│  │  │ - Cross-category dependencies     │  │                │
│  │  │ - Overall risk aggregation        │  │                │
│  │  └───────────────────────────────────┘  │                │
│  │  ┌───────────────────────────────────┐  │                │
│  │  │ Visualization (Canvas + HTML5)    │  │                │
│  │  │ - Multi-org grid                  │  │                │
│  │  │ - Convergence charts              │  │                │
│  │  │ - Prioritization matrix           │  │                │
│  │  └───────────────────────────────────┘  │                │
│  └─────────────────────────────────────────┘                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Dashboard UI** | HTML5, CSS3, Vanilla JavaScript | Client-side rendering |
| **Bayesian Engine** | JavaScript (ES6+) | Risk calculation |
| **Visualizations** | Canvas API | Charts (SOC vs Human) |
| **Data Storage** | JSON files (6MB typical) | Zero-backend architecture |
| **Batch Import** | Node.js 14+ | Field Kit automation |
| **Synthetic Generator** | Node.js 14+ | Demo data creation |
| **HTTP Server** | Python 3.8+ / Node.js http-server | Local development (CORS) |

### Key Design Principles

1. **Client-Side Only**: Zero server dependencies, all computation in browser
2. **JSON-Based Storage**: No database, version-controllable data
3. **Real-Time Updates**: Auto-recalculation on data changes
4. **Stateless**: No sessions, no authentication (deploy behind SSO if needed)
5. **Air-Gapped Compatible**: Works offline after initial data load

---

## Data Format Specifications

### organizations.json Schema

```json
{
  "metadata": {
    "version": "1.0",
    "generated": "2025-11-09T10:00:00Z",
    "total_organizations": 8
  },
  "organizations": {
    "org-001": {
      "name": "Organization 1",
      "industry": "Healthcare | Finance | Technology | Manufacturing | Retail",
      "size": "small | medium | enterprise",
      "country": "US | UK | DE | ...",
      "indicators": {
        "1.1": {
          "soc_values": [
            {
              "timestamp": "2025-11-01T00:00:00Z",
              "value": 0.45,
              "confidence": 0.9,
              "source": "siem-analyzer",
              "metadata": {
                "alert_count": 12,
                "severity": "medium"
              }
            }
          ],
          "human_values": [
            {
              "timestamp": "2025-11-05T14:30:00Z",
              "value": 0.52,
              "assessor": "John Doe",
              "assessment_id": "fk-1730815800-11"
            }
          ],
          "current_bayesian": 0.49,
          "last_updated": "2025-11-05T14:30:00Z"
        }
        // ... indicators 1.1 through 10.10 (100 total)
      },
      "aggregates": {
        "overall_risk": 0.54,
        "by_category": {
          "authority": 0.45,
          "temporal": 0.60,
          "social": 0.52,
          "affective": 0.48,
          "cognitive": 0.55,
          "group": 0.50,
          "stress": 0.68,
          "unconscious": 0.51,
          "ai": 0.58,
          "convergent": 0.47
        },
        "confidence": 0.85,
        "trend": "stable | improving | deteriorating",
        "last_calculated": "2025-11-09T10:00:00Z"
      }
    }
    // ... more organizations
  }
}
```

### Field Kit Export Format

**Filename Pattern:** `dashboard_export_{org_id}_{indicator_id}_{timestamp}.json`

**Example:** `dashboard_export_org-001_1.3_1730815800000.json`

```json
{
  "organization_id": "org-001",
  "organization_name": "Acme Corporation",
  "indicator_id": "1.3",
  "indicator_data": {
    "soc_values": [],
    "human_values": [
      {
        "timestamp": "2025-11-09T10:30:00Z",
        "value": 0.68,
        "assessor": "Jane Smith",
        "assessment_id": "fk-1730815800-13"
      }
    ],
    "current_bayesian": 0.68,
    "last_updated": "2025-11-09T10:30:00Z"
  },
  "metadata": {
    "exported_from": "field_kit",
    "export_timestamp": "2025-11-09T10:30:00Z",
    "field_kit_version": "1.0",
    "synthetic_data": false
  }
}
```

### Indicator Value Object

| Field | Type | Range | Description |
|-------|------|-------|-------------|
| `timestamp` | ISO 8601 string | - | Assessment time (UTC) |
| `value` | float | 0.0 - 1.0 | Risk score (0=low, 1=high) |
| `confidence` | float (SOC only) | 0.0 - 1.0 | Data quality indicator |
| `source` | string (SOC only) | - | Tool name (e.g., "splunk-alert-analyzer") |
| `assessor` | string (Human only) | - | Auditor name/ID |
| `assessment_id` | string (Human only) | - | Unique assessment identifier |

---

## SOC Integration

### Overview

SOC systems (SIEM, EDR, SOAR, vulnerability scanners) export indicator values to `organizations.json` via automated scripts or API connectors.

### Integration Workflow

```
1. SOC Tool Processes Event Logs
   └─> Calculates indicator risk (0-1 scale)
       └─> Appends to organizations.json soc_values array
           └─> Triggers Bayesian recalculation
```

### Mapping SOC Metrics to CPF Indicators

#### Example: Authority Category (1.1 - 1.10)

| Indicator | SOC Metric | Tool | Calculation |
|-----------|-----------|------|-------------|
| **1.1** Impersonation | Display name spoofing detections | Email Gateway | `detections_count / total_emails` |
| **1.3** Credential trust | SPF/DKIM/DMARC failures | Email Security | `1 - (authenticated / total_external)` |
| **1.7** Auth failures | Failed login attempts from authority roles | SIEM | `failed_auths / total_auths` |

#### Example: Stress Category (7.1 - 7.10)

| Indicator | SOC Metric | Tool | Calculation |
|-----------|-----------|------|-------------|
| **7.5** Security shortcuts | Policy violations during high-load | DLP | `violations_peak_hours / violations_normal` |
| **7.9** Incident correlation | Incidents during overtime hours | SIEM | `incidents_18-22 / incidents_09-17` |

### SOC Export Script Template

```javascript
// soc_exporter.js - Example Splunk integration
const fs = require('fs');
const path = require('path');
const splunk = require('splunk-sdk'); // Hypothetical

async function exportToOrganizationsJSON(orgId, indicatorId, value, confidence, source) {
  const dataPath = path.join(__dirname, '../data/organizations.json');
  const orgsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  if (!orgsData.organizations[orgId]) {
    console.error(`Organization ${orgId} not found`);
    return;
  }

  const indicator = orgsData.organizations[orgId].indicators[indicatorId];

  // Append SOC value
  indicator.soc_values.push({
    timestamp: new Date().toISOString(),
    value: parseFloat(value.toFixed(3)),
    confidence: parseFloat(confidence.toFixed(3)),
    source: source,
    metadata: {} // Add custom metadata
  });

  // Update timestamp
  indicator.last_updated = new Date().toISOString();

  // Recalculate Bayesian (requires bayesian.js)
  const BAYESIAN = require('../bayesian.js');
  const merged = BAYESIAN.mergeIndicatorValues(
    indicator.soc_values,
    indicator.human_values
  );
  indicator.current_bayesian = merged.value;

  // Save
  fs.writeFileSync(dataPath, JSON.stringify(orgsData, null, 2));
  console.log(`✓ Updated ${orgId} indicator ${indicatorId}: ${value}`);
}

// Example: Query Splunk for failed auth attempts (Indicator 1.7)
async function calculateIndicator1_7(orgId) {
  const service = new splunk.Service({
    username: process.env.SPLUNK_USER,
    password: process.env.SPLUNK_PASS,
    host: 'splunk.example.com',
    port: 8089
  });

  const query = `
    index=auth_logs
    | stats count(eval(status="failed")) as failed, count as total
    | eval risk=failed/total
  `;

  const result = await service.search(query);
  const risk = result.rows[0].risk;
  const confidence = 0.9; // High confidence from direct log data

  await exportToOrganizationsJSON(orgId, '1.7', risk, confidence, 'splunk-auth-analyzer');
}

// Run every 2 days (SOC frequency)
setInterval(() => calculateIndicator1_7('org-001'), 2 * 24 * 60 * 60 * 1000);
```

### SOC Integration Checklist

- [ ] Identify 10-20 high-value indicators with existing SOC metrics
- [ ] Map SOC tool outputs to CPF 0-1 risk scale
- [ ] Implement export script (Python/Node.js/PowerShell)
- [ ] Schedule automated runs (recommend: daily or every 2 days)
- [ ] Set confidence values based on data quality (0.7-0.95 typical)
- [ ] Include `source` metadata for traceability
- [ ] Test Bayesian recalculation after export
- [ ] Monitor for errors (file locks, JSON parsing)

---

## Field Kit Integration

### Export from Field Kit

1. User completes assessment for indicator (e.g., 1.3)
2. Clicks **"Calculate Indicator Score"** button
3. Clicks **"🔗 Export to Dashboard"** button
4. Enters organization ID (e.g., `org-001`)
5. Enters organization name (e.g., `Acme Corp`)
6. Browser downloads JSON file: `dashboard_export_org-001_1.3_1730815800000.json`

### Manual Import (Small Scale)

For 1-10 assessments:

1. Open `dashboard/data/organizations.json`
2. Locate organization by ID
3. Find indicator (e.g., `"1.3"`)
4. Copy `human_values` entry from export file
5. Paste into `human_values` array
6. Manually trigger Bayesian recalc (or refresh dashboard)

**Drawback:** Error-prone for 100 indicators.

### Automated Batch Import (Recommended)

For 100 indicators per organization:

```bash
# Step 1: Collect all Field Kit exports in folder
mkdir -p ~/field_kit_exports
# Place all dashboard_export_*.json files here

# Step 2: Run batch importer
cd dashboard/scripts
node batch_import.js ~/field_kit_exports

# Output:
# 🔧 CPF Batch Import - Field Kit to Dashboard
#
# 📁 Scanning: /Users/username/field_kit_exports
# ✓ Found 100 export files
#
# 🏢 Organizations found: 1
#
#   org-001 (Acme Corporation)
#     ✓ Completed: 100/100 (100.0%)
#     ✗ Missing: 0 indicators
#     Categories:
#       authority     ██████████ 100.0%
#       temporal      ██████████ 100.0%
#       ...
#
# ✓ Generated: ../data/auditing_results.json
# ✓ Updated: ../data/organizations.json
#
# ✨ Import complete!
```

### Batch Import Script API

**Input:** Folder path containing `dashboard_export_*.json` files

**Outputs:**
1. **organizations.json**: Updated with human assessments, Bayesian recalculated
2. **auditing_results.json**: Progress tracking (completed/missing indicators)

**Logic:**
```javascript
function scanExports(folderPath) {
  // Scans for dashboard_export_*.json
  // Validates structure (org_id, indicator_id, indicator_data)
  // Returns array of parsed exports
}

function groupByOrganization(exports) {
  // Groups by organization_id
  // Returns { "org-001": { indicators: {...}, files: [...] } }
}

function calculateCoverage(orgData) {
  // Identifies completed indicators (1-100)
  // Identifies missing indicators
  // Calculates category-level coverage
  // Returns { completed: 87, missing: 13, percentage: 87.0, ... }
}

function updateOrganizationsJSON(organizationData, organizationsPath) {
  // Merges human_values into existing organizations.json
  // Checks for duplicates (timestamp + assessor)
  // Recalculates Bayesian via BAYESIAN.mergeIndicatorValues()
  // Updates aggregates via BAYESIAN.analyzeOrganization()
  // Saves updated JSON
}
```

### Deduplication Strategy

Import script prevents duplicate human assessments:

```javascript
// Check if not duplicate
const exists = target.human_values.some(existing =>
  existing.timestamp === hv.timestamp && existing.assessor === hv.assessor
);

if (!exists) {
  target.human_values.push(hv);
}
```

Re-running batch import on same folder is safe (idempotent operation).

---

## Batch Import Workflow

### Standard Workflow

```
┌─────────────────────────────────────────────────────┐
│ 1. Auditor completes 100 Field Kit assessments      │
│    (1 week of work, 30-45 min per indicator)        │
└───────────────────┬─────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────┐
│ 2. Export all 100 to folder ~/field_kit_exports     │
│    (100 JSON files, ~50KB each = 5MB total)         │
└───────────────────┬─────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────┐
│ 3. Run batch import:                                │
│    node batch_import.js ~/field_kit_exports         │
└───────────────────┬─────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────┐
│ 4. View progress tracking:                          │
│    http://localhost:8000/dashboard_auditing.html    │
│    - Shows 100/100 completed                        │
│    - Green grid, no missing indicators              │
└───────────────────┬─────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────┐
│ 5. View SOC+Bayesian analysis:                      │
│    http://localhost:8000/dashboard.html             │
│    - Overall risk, category heatmap                 │
│    - SOC vs Human convergence chart                 │
│    - Prioritization matrix                          │
└─────────────────────────────────────────────────────┘
```

### Incremental Updates

For ongoing audits (weekly reassessments):

```bash
# Week 1: Initial 100 assessments
node batch_import.js ~/field_kit_exports/week1

# Week 2: Reassess high-risk indicators (20 indicators)
node batch_import.js ~/field_kit_exports/week2

# Week 3: Full reassessment (100 indicators)
node batch_import.js ~/field_kit_exports/week3
```

Each run appends to `human_values` array, creating historical timeline.

---

## Bayesian Engine API

### Core Functions

#### 1. `mergeIndicatorValues(socValues, humanValues)`

Merges SOC and human assessments for single indicator.

**Input:**
```javascript
const socValues = [
  { timestamp: "...", value: 0.45, confidence: 0.9, source: "siem" }
];
const humanValues = [
  { timestamp: "...", value: 0.52, assessor: "John", assessment_id: "fk-123" }
];
```

**Output:**
```javascript
{
  value: 0.49,        // Weighted average: (0.45*0.9 + 0.52*1.5) / (0.9+1.5)
  confidence: 0.96    // min((0.9 + 1*1.5) / 2.5, 1.0)
}
```

**Formula:**
```javascript
const HUMAN_WEIGHT = 1.5;

let totalWeight = 0;
let weightedSum = 0;

// Add SOC contribution
if (socValues.length > 0) {
  const latest = socValues[socValues.length - 1];
  const weight = latest.confidence || 0.8;
  weightedSum += latest.value * weight;
  totalWeight += weight;
}

// Add human contribution (weighted 1.5x)
if (humanValues.length > 0) {
  const latest = humanValues[humanValues.length - 1];
  weightedSum += latest.value * HUMAN_WEIGHT;
  totalWeight += HUMAN_WEIGHT;
}

const value = totalWeight > 0 ? weightedSum / totalWeight : 0.5;
const confidence = Math.min(totalWeight / 2.5, 1.0);
```

#### 2. `analyzeOrganization(orgData)`

Calculates organization-level aggregates with cross-category dependencies.

**Input:**
```javascript
const orgData = {
  name: "Organization 1",
  indicators: {
    "1.1": { soc_values: [...], human_values: [...], current_bayesian: 0.45 },
    // ... all 100 indicators
  }
};
```

**Output:**
```javascript
{
  overall_risk: 0.54,
  by_category: {
    authority: 0.45,
    temporal: 0.60,
    social: 0.52,
    affective: 0.48,
    cognitive: 0.55,
    group: 0.50,
    stress: 0.68,
    unconscious: 0.51,
    ai: 0.58,
    convergent: 0.47
  },
  confidence: 0.85,
  trend: "deteriorating",
  prioritization: [
    { category: "stress", risk: 0.68, priority: 0.124, rank: 1 },
    { category: "authority", risk: 0.45, priority: 0.141, rank: 2 },
    // ... sorted by priority
  ]
}
```

**Key Steps:**

1. **Average indicators per category:**
```javascript
for (let cat = 1; cat <= 10; cat++) {
  const categoryIndicators = Object.entries(indicators)
    .filter(([id, _]) => id.startsWith(`${cat}.`));

  const avgRisk = categoryIndicators.reduce((sum, [_, ind]) =>
    sum + ind.current_bayesian, 0) / 10;

  categoryRisks[categoryName] = avgRisk;
}
```

2. **Apply cross-category dependencies:**
```javascript
const DEPENDENCIES = {
  authority: { social: 0.3, group: 0.2, unconscious: 0.15 },
  temporal: { stress: 0.4, affective: 0.25, cognitive: 0.2 },
  // ... full matrix
};

for (const [targetCat, influences] of Object.entries(DEPENDENCIES)) {
  let adjustment = 0;
  for (const [sourceCat, weight] of Object.entries(influences)) {
    adjustment += categoryRisks[sourceCat] * weight * (1 - categoryRisks[targetCat]);
  }
  adjustedRisks[targetCat] = categoryRisks[targetCat] + adjustment;
}
```

3. **Calculate overall risk:**
```javascript
const CATEGORY_WEIGHTS = {
  authority: 0.12, temporal: 0.10, social: 0.11, affective: 0.09,
  cognitive: 0.10, group: 0.08, stress: 0.11, unconscious: 0.09,
  ai: 0.12, convergent: 0.08
};

const overallRisk = Object.entries(adjustedRisks).reduce((sum, [cat, risk]) =>
  sum + risk * CATEGORY_WEIGHTS[cat] * categoryConfidence[cat], 0);
```

4. **Prioritize categories:**
```javascript
const prioritization = Object.entries(adjustedRisks).map(([cat, risk]) => {
  const downstreamImpact = Object.entries(DEPENDENCIES)
    .filter(([src, _]) => src === cat)
    .reduce((sum, [_, targets]) =>
      sum + Object.values(targets).reduce((a, b) => a + b, 0), 0);

  const priority = risk * CATEGORY_WEIGHTS[cat] * (1 + downstreamImpact);

  return { category: cat, risk, priority };
}).sort((a, b) => b.priority - a.priority);
```

### Customization Options

#### Adjust Category Weights

Edit `bayesian.js`:

```javascript
CATEGORY_WEIGHTS: {
  authority: 0.15,  // Increase if authority attacks are prevalent
  ai: 0.15,         // Increase for industries facing AI threats
  stress: 0.08,     // Decrease if low-stress environment
  // ... adjust based on threat landscape
}
```

#### Modify Dependencies

Add/remove edges in dependency matrix:

```javascript
DEPENDENCIES: {
  authority: {
    social: 0.35,     // Increase influence
    group: 0.25,      // Increase influence
    cognitive: 0.20   // NEW: Add dependency
  },
  // ... modify based on organizational psychology
}
```

#### Change Human Weight

Adjust trust in human vs machine assessments:

```javascript
// In mergeIndicatorValues()
const HUMAN_WEIGHT = 2.0;  // Increase to 2x if humans extremely reliable
const HUMAN_WEIGHT = 1.0;  // Equal weighting
const HUMAN_WEIGHT = 0.8;  // Trust machines more (not recommended)
```

---

## Extending the Framework

### Adding New Indicators

**Scenario:** Add indicator 11.1 (new category "Physical Security")

1. **Update CPF taxonomy** (11 categories instead of 10)

2. **Modify data generation:**
```javascript
// In generate_synthetic_data.js
const ALL_INDICATORS = [];
for (let cat = 1; cat <= 11; cat++) {  // Changed from 10
  for (let ind = 1; ind <= 10; ind++) {
    ALL_INDICATORS.push(`${cat}.${ind}`);
  }
}

const CATEGORY_NAMES = {
  1: 'authority', 2: 'temporal', 3: 'social', 4: 'affective', 5: 'cognitive',
  6: 'group', 7: 'stress', 8: 'unconscious', 9: 'ai', 10: 'convergent',
  11: 'physical'  // NEW
};
```

3. **Update Bayesian engine:**
```javascript
// In bayesian.js
CATEGORY_WEIGHTS: {
  // ... existing
  physical: 0.07  // NEW (adjust others to sum to 1.0)
},

DEPENDENCIES: {
  // ... existing
  physical: {
    stress: 0.2,   // Poor physical security increases stress
    group: 0.15    // Impacts group dynamics (tailgating, etc.)
  }
}
```

4. **Update dashboard UI** to render 11 categories

5. **Create Field Kit assessment** for indicator 11.1-11.10

### Custom Visualizations

**Scenario:** Add radar chart for category comparison

```javascript
// In visualizations.js
function renderRadarChart(categories, canvas) {
  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 40;

  const angleStep = (2 * Math.PI) / Object.keys(categories).length;

  ctx.beginPath();
  Object.values(categories).forEach((risk, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const distance = risk * radius;
    const x = centerX + distance * Math.cos(angle);
    const y = centerY + distance * Math.sin(angle);

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(231, 76, 60, 0.3)';
  ctx.fill();
  ctx.strokeStyle = '#e74c3c';
  ctx.stroke();
}
```

### Alerting System

**Scenario:** Email notification when risk exceeds threshold

```javascript
// alerts.js (Node.js backend required)
const nodemailer = require('nodemailer');

function checkRiskThresholds(orgData) {
  const thresholds = {
    overall_risk: 0.70,  // Alert if org risk > 70%
    category_risk: 0.80, // Alert if any category > 80%
    trend: 'deteriorating'
  };

  const alerts = [];

  if (orgData.aggregates.overall_risk > thresholds.overall_risk) {
    alerts.push({
      type: 'overall_risk',
      severity: 'critical',
      message: `Overall risk ${(orgData.aggregates.overall_risk * 100).toFixed(0)}% exceeds threshold`
    });
  }

  for (const [cat, risk] of Object.entries(orgData.aggregates.by_category)) {
    if (risk > thresholds.category_risk) {
      alerts.push({
        type: 'category_risk',
        severity: 'high',
        category: cat,
        message: `${cat} risk ${(risk * 100).toFixed(0)}% exceeds threshold`
      });
    }
  }

  if (orgData.aggregates.trend === 'deteriorating') {
    alerts.push({
      type: 'trend',
      severity: 'medium',
      message: 'Risk trend is deteriorating'
    });
  }

  return alerts;
}

async function sendAlerts(orgName, alerts) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });

  const mailOptions = {
    from: 'cpf-alerts@example.com',
    to: 'security-team@example.com',
    subject: `[CPF Alert] ${orgName} - ${alerts.length} issues detected`,
    html: `
      <h2>CPF Risk Alerts for ${orgName}</h2>
      <ul>
        ${alerts.map(a => `<li><strong>${a.severity.toUpperCase()}:</strong> ${a.message}</li>`).join('')}
      </ul>
    `
  };

  await transporter.sendMail(mailOptions);
}
```

---

## Deployment Options

### Option 1: Local Development (Default)

```bash
cd dashboard
python3 -m http.server 8000
# Open: http://localhost:8000/dashboard.html
```

**Pros:** Zero setup, instant start
**Cons:** Single-user, no persistence across restarts

### Option 2: Static Web Hosting

**GitHub Pages:**
```bash
# Push to GitHub
git add dashboard/*
git commit -m "Deploy CPF Dashboard"
git push origin main

# Enable GitHub Pages in repo settings
# Select source: main branch, /dashboard folder
# Access: https://yourusername.github.io/CPF/dashboard.html
```

**Pros:** Free hosting, HTTPS, accessible anywhere
**Cons:** Data publicly visible (use private repo if sensitive)

**Netlify/Vercel:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd dashboard
netlify deploy --prod

# Follow prompts to publish
```

### Option 3: Internal Web Server

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name cpf-dashboard.internal.company.com;

    root /var/www/cpf/dashboard;
    index dashboard.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # Optional: Basic authentication
    auth_basic "CPF Dashboard";
    auth_basic_user_file /etc/nginx/.htpasswd;
}
```

**Pros:** Controlled access, SSO integration possible
**Cons:** Requires infrastructure, maintenance

### Option 4: Air-Gapped Environment

For classified/isolated networks:

1. **Prepare bundle:**
```bash
# On internet-connected machine
git clone https://github.com/yourrepo/CPF.git
cd CPF/dashboard
zip -r cpf-dashboard.zip .
```

2. **Transfer to air-gapped system** (USB drive, approved file transfer)

3. **Deploy:**
```bash
unzip cpf-dashboard.zip -d /opt/cpf-dashboard
cd /opt/cpf-dashboard
python3 -m http.server 8000 --bind 127.0.0.1  # Localhost only
```

**Pros:** Maximum security
**Cons:** Manual updates, no external integrations

### Option 5: Docker Container

```dockerfile
# Dockerfile
FROM nginx:alpine

COPY dashboard /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build and run
docker build -t cpf-dashboard .
docker run -d -p 8080:80 --name cpf cpf-dashboard

# Access: http://localhost:8080/dashboard.html
```

**Pros:** Portable, consistent environment
**Cons:** Requires Docker, slight overhead

---

## Security Considerations

### Data Sensitivity

**Risk Scores = Sensitive Information**

Organizations.json contains:
- Security vulnerability assessments
- Organizational weaknesses
- Insider threat indicators
- Remediation gaps

**Recommendations:**
1. **Access Control:** Deploy behind SSO/authentication
2. **Encryption at Rest:** Encrypt organizations.json (AES-256)
3. **Encryption in Transit:** Serve over HTTPS only
4. **Audit Logging:** Track who accesses dashboard and when
5. **Data Retention:** Define policy for historical assessment data

### Client-Side Limitations

**No Server = No Security Enforcement**

Current architecture cannot:
- Enforce authentication (anyone with JSON can view)
- Prevent data exfiltration (JSON downloadable)
- Log access attempts
- Rate limit requests

**Mitigations:**
- Deploy behind reverse proxy with auth (Nginx + OAuth)
- Use private GitHub repo (access via GitHub authentication)
- Implement read-only web server (no write access to JSON)

### Input Validation

**SOC Export Scripts:**
```javascript
function validateIndicatorValue(value) {
  if (typeof value !== 'number') {
    throw new Error('Value must be number');
  }
  if (value < 0 || value > 1) {
    throw new Error('Value must be in range [0, 1]');
  }
  return parseFloat(value.toFixed(3)); // Max 3 decimals
}

function validateIndicatorId(id) {
  const pattern = /^([1-9]|10)\.([1-9]|10)$/;
  if (!pattern.test(id)) {
    throw new Error(`Invalid indicator ID: ${id}`);
  }
  return id;
}
```

### JSON Injection Prevention

**Batch Import:**
```javascript
// DANGEROUS (don't do this):
eval(`const data = ${fileContents}`);

// SAFE:
try {
  const data = JSON.parse(fileContents);
  // Validate structure before using
  if (!data.organization_id || !data.indicator_id) {
    throw new Error('Invalid export format');
  }
} catch (error) {
  console.error('Malformed JSON:', error);
  return;
}
```

---

## Troubleshooting

### Issue: "Failed to fetch organizations.json"

**Symptoms:** Dashboard shows loading spinner, console error: `net::ERR_FAILED`

**Cause:** Using `file://` protocol (CORS policy blocks local file fetch)

**Solution:**
```bash
# Start HTTP server
cd dashboard
python3 -m http.server 8000

# Open: http://localhost:8000/dashboard.html (NOT file://)
```

---

### Issue: "Bayesian scores seem incorrect"

**Symptoms:** Overall risk doesn't match manual calculations

**Debugging:**
1. **Check raw indicator values:**
```javascript
// In browser console
fetch('data/organizations.json')
  .then(r => r.json())
  .then(data => {
    const org = data.organizations['org-001'];
    console.log(org.indicators['1.1']);
    // Verify soc_values, human_values, current_bayesian
  });
```

2. **Verify dependency matrix:**
```javascript
// Check DEPENDENCIES in bayesian.js
console.log(BAYESIAN.DEPENDENCIES);
```

3. **Test mergeIndicatorValues:**
```javascript
const soc = [{ timestamp: '...', value: 0.5, confidence: 0.9, source: 'test' }];
const human = [{ timestamp: '...', value: 0.6, assessor: 'test', assessment_id: 'test' }];
const result = BAYESIAN.mergeIndicatorValues(soc, human);
console.log(result); // Expected: { value: ~0.56, confidence: ~0.96 }
```

---

### Issue: "Convergence chart not rendering"

**Symptoms:** Blank canvas, no SOC vs Human timeline

**Debugging:**
1. **Check data structure:**
```javascript
// Convergence requires both SOC and Human values with timestamps
const org = data.organizations['org-001'];
const indicator = org.indicators['1.1'];
console.log(indicator.soc_values.length, indicator.human_values.length);
// Need at least 1 of each
```

2. **Verify Canvas API support:**
```javascript
// In browser console
const canvas = document.getElementById('convergence-chart');
console.log(canvas.getContext('2d')); // Should not be null
```

3. **Check browser compatibility:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

### Issue: "Batch import fails with 'File not found'"

**Symptoms:** `❌ Folder not found: /path/to/exports`

**Solutions:**
```bash
# 1. Check path exists
ls /path/to/field_kit_exports

# 2. Use absolute path (not relative)
node batch_import.js /Users/username/field_kit_exports  # Good
node batch_import.js ../exports                          # May fail

# 3. Check file naming pattern
# Files must match: dashboard_export_*.json
ls field_kit_exports/dashboard_export_*

# 4. Verify JSON validity
node -e "console.log(JSON.parse(require('fs').readFileSync('field_kit_exports/dashboard_export_org-001_1.1_12345.json')))"
```

---

### Issue: "Import succeeds but dashboard shows old data"

**Cause:** Browser cache serving stale organizations.json

**Solution:**
```bash
# Hard refresh in browser
# Chrome/Firefox: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

# Or disable cache in DevTools:
# 1. Open DevTools (F12)
# 2. Network tab
# 3. Check "Disable cache"
# 4. Refresh page
```

---

### Issue: "Trend detection shows 'stable' when visually deteriorating"

**Cause:** Slope threshold too strict (-0.01 to +0.01)

**Solution:**
```javascript
// In bayesian.js, adjust thresholds
function detectTrend(riskHistory) {
  const slope = calculateSlope(riskHistory);

  if (slope < -0.005) return 'improving';      // Changed from -0.01
  if (slope > 0.005) return 'deteriorating';   // Changed from +0.01
  return 'stable';
}
```

---

## Performance Optimization

### Large Datasets (100+ Organizations)

**Problem:** 6MB JSON per 8 orgs = 75MB for 100 orgs

**Solutions:**

1. **Lazy Loading:**
```javascript
// Load organization list first (lightweight)
fetch('data/organizations_list.json')
  .then(r => r.json())
  .then(list => renderOrgList(list));

// Load full data only when org selected
function selectOrganization(orgId) {
  fetch(`data/orgs/${orgId}.json`)
    .then(r => r.json())
    .then(orgData => renderDashboard(orgData));
}
```

2. **Pagination:**
```javascript
// Split into pages (10 orgs per page)
// organizations_page1.json, organizations_page2.json, ...
```

3. **Database Migration:**
```javascript
// Consider SQLite (client-side) or PostgreSQL (server-side)
// For 100+ orgs with real-time SOC feeds
```

### Dashboard Rendering

**Problem:** Rendering 100-tile grid for 100 orgs = 10,000 DOM elements

**Solution: Virtual scrolling**
```javascript
// Only render visible organizations (viewport)
function renderVisibleOrgs() {
  const scrollTop = container.scrollTop;
  const viewportHeight = container.clientHeight;
  const orgHeight = 600; // px per org card

  const startIdx = Math.floor(scrollTop / orgHeight);
  const endIdx = Math.ceil((scrollTop + viewportHeight) / orgHeight);

  const visibleOrgs = allOrgs.slice(startIdx, endIdx);
  renderOrgs(visibleOrgs);
}

container.addEventListener('scroll', renderVisibleOrgs);
```

---

## Appendix: Full API Reference

### BAYESIAN.mergeIndicatorValues()

```typescript
function mergeIndicatorValues(
  socValues: Array<{
    timestamp: string,
    value: number,        // 0.0 - 1.0
    confidence: number,   // 0.0 - 1.0
    source: string
  }>,
  humanValues: Array<{
    timestamp: string,
    value: number,        // 0.0 - 1.0
    assessor: string,
    assessment_id: string
  }>
): {
  value: number,       // 0.0 - 1.0
  confidence: number   // 0.0 - 1.0
}
```

### BAYESIAN.analyzeOrganization()

```typescript
function analyzeOrganization(
  orgData: {
    name: string,
    indicators: { [indicatorId: string]: IndicatorData }
  }
): {
  overall_risk: number,               // 0.0 - 1.0
  by_category: { [category: string]: number },
  confidence: number,                 // 0.0 - 1.0
  trend: "improving" | "stable" | "deteriorating",
  prioritization: Array<{
    category: string,
    risk: number,
    priority: number,
    rank: number
  }>
}
```

---

## Support and Contribution

**Documentation:** See `README.md`, `USER_GUIDE.html`, `PAPER.tex`

**Issues:** Report bugs and feature requests via project issue tracker

**Contributing:**
1. Fork repository
2. Create feature branch (`git checkout -b feature/new-indicator`)
3. Commit changes (`git commit -m "Add indicator 11.1"`)
4. Push branch (`git push origin feature/new-indicator`)
5. Open pull request

**License:** MIT (modify freely, attribution required)

---

**Version:** 1.0
**Last Updated:** 2025-11-09
**Maintainers:** CPF Framework Team
