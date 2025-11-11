# CPF Dashboard - Technical Integration Guide

**Version:** 2.0
**Last Updated:** 2025-11-11
**Audience:** Developers, Security Engineers, SOC Integrators

> **Note**: This document has been updated to reflect the new modular file architecture and REST API v2.0

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Data Format Specifications](#data-format-specifications)
3. [SOC Integration](#soc-integration)
4. [Field Kit Integration](#field-kit-integration)
5. [Batch Import Workflow](#batch-import-workflow)
6. [Bayesian Engine API](#bayesian-engine-api)
7. [REST API Reference](#rest-api-reference)
8. [Extending the Framework](#extending-the-framework)
9. [Deployment Options](#deployment-options)
10. [Security Considerations](#security-considerations)
11. [Troubleshooting](#troubleshooting)

---

## System Architecture

### Component Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     CPF ECOSYSTEM v2.0                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │  SOC Systems │         │  Field Kit   │                  │
│  │  (SIEM, EDR) │         │  (Human)     │                  │
│  └──────┬───────┘         └──────┬───────┘                  │
│         │                        │                          │
│         │ REST API               │ JSON Export              │
│         ▼                        ▼                          │
│  ┌─────────────────────────────────────────┐                │
│  │   Node.js Server (Express + CORS)      │                │
│  │   - REST API v2.0 (dataManager.js)    │                │
│  │   - Organizations CRUD                │                │
│  │   - Assessments management            │                │
│  │   - Batch import automation           │                │
│  └─────────────┬───────────────────────────┘                │
│                │                                            │
│                │ File I/O                                   │
│                ▼                                            │
│  ┌─────────────────────────────────────────┐                │
│  │   Modular File Storage                 │                │
│  │  ┌───────────────────────────────────┐  │                │
│  │  │ organizations_index.json          │  │                │
│  │  │ - Org list + stats                │  │                │
│  │  └───────────────────────────────────┘  │                │
│  │  ┌───────────────────────────────────┐  │                │
│  │  │ organizations/org-*.json          │  │                │
│  │  │ - Individual org data (100 ind)  │  │                │
│  │  │ - Assessments + aggregates       │  │                │
│  │  └───────────────────────────────────┘  │                │
│  └─────────────┬───────────────────────────┘                │
│                │                                            │
│                │ HTTP/REST API                              │
│                ▼                                            │
│  ┌─────────────────────────────────────────┐                │
│  │       Dashboard Applications            │                │
│  │  ┌───────────────────────────────────┐  │                │
│  │  │ Landing Page (index.html)         │  │                │
│  │  └───────────────────────────────────┘  │                │
│  │  ┌───────────────────────────────────┐  │                │
│  │  │ SOC Dashboard                     │  │                │
│  │  │ (soc-integration/index.html)      │  │                │
│  │  │ - Multi-org analysis              │  │                │
│  │  │ - Bayesian risk scoring           │  │                │
│  │  │ - Convergence charts              │  │                │
│  │  └───────────────────────────────────┘  │                │
│  │  ┌───────────────────────────────────┐  │                │
│  │  │ Auditing Dashboard                │  │                │
│  │  │ (auditing/index.html)             │  │                │
│  │  │ - Progress tracking               │  │                │
│  │  │ - Risk analysis                   │  │                │
│  │  │ - Completion grids                │  │                │
│  │  └───────────────────────────────────┘  │                │
│  └─────────────────────────────────────────┘                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Backend Server** | Node.js (Express 4.x) | REST API, file serving |
| **Data Manager** | Custom dataManager.js | Atomic file I/O, JSON operations |
| **Dashboard UI** | HTML5, CSS3, Vanilla JavaScript | Client-side rendering |
| **Bayesian Engine** | JavaScript (ES6+) | Risk calculation |
| **Visualizations** | Canvas API | Charts (SOC vs Human) |
| **Data Storage** | Modular JSON files (~100KB each) | File-based database |
| **Batch Import** | Node.js 18+ | Field Kit automation |
| **PostgreSQL** | Optional database | Alternative to JSON files |
| **CORS** | Express middleware | Cross-origin API access |

### Key Design Principles

1. **REST API First**: Modern RESTful architecture with JSON responses
2. **Modular File Storage**: Separate file per organization for scalability
3. **Atomic Operations**: Safe concurrent writes with temp files
4. **Real-Time Updates**: Auto-recalculation on data changes
5. **Stateless API**: No sessions, authentication optional (deploy behind SSO)
6. **Air-Gapped Compatible**: Can run offline with file-based storage
7. **Database Optional**: Use PostgreSQL if needed, JSON files by default

---

## Data Format Specifications

### File Structure Overview

The system now uses **modular file storage** instead of a single monolithic JSON:

```
/dashboard/data/
├── organizations_index.json          # Fast lookup index
├── organizations/                    # Individual organization files
│   ├── org-demo-001.json             # ~100KB per file
│   ├── org-demo-002.json
│   └── ...
└── schemas/                          # JSON schemas for validation
    ├── organization_index_schema.json
    └── organization_data_schema.json
```

**Benefits:**
- ✅ Faster reads (load only needed org)
- ✅ Safer writes (atomic per-org updates)
- ✅ Better Git diff/merge
- ✅ Scalable to 100+ organizations

---

### organizations_index.json Schema

**Purpose:** Lightweight index for quick overview of all organizations.

```json
{
  "metadata": {
    "version": "2.0",
    "last_updated": "2025-11-11T15:30:00Z",
    "total_organizations": 5
  },
  "organizations": [
    {
      "id": "org-demo-001",
      "name": "TechCorp Global",
      "industry": "Technology",
      "size": "enterprise",
      "country": "US",
      "language": "en-US",
      "created_at": "2025-01-11T10:00:00Z",
      "updated_at": "2025-01-11T15:30:00Z",
      "stats": {
        "total_assessments": 45,
        "completion_percentage": 45.0,
        "overall_risk": 0.6543,
        "avg_confidence": 0.8234,
        "last_assessment_date": "2025-01-10T14:20:00Z"
      }
    }
  ]
}
```

---

### organizations/org-{id}.json Schema

**Purpose:** Complete data for a single organization (100 indicators + aggregates).

```json
{
  "id": "org-demo-001",
  "name": "TechCorp Global",
  "metadata": {
    "industry": "Technology",
    "size": "enterprise",
    "country": "US",
    "language": "en-US",
    "created_at": "2025-01-11T10:00:00Z",
    "updated_at": "2025-01-11T15:30:00Z",
    "created_by": "Alice Johnson",
    "notes": "Enterprise tech company"
  },
  "assessments": {
    "1.1": {
      "indicator_id": "1.1",
      "title": "Unquestioning Compliance with Authority",
      "category": "Authority-Based Vulnerabilities",
      "bayesian_score": 0.6543,
      "confidence": 0.8500,
      "maturity_level": "yellow",
      "assessor": "Alice Johnson",
      "assessment_date": "2025-01-10T14:20:00Z",
      "raw_data": {
        "quick_assessment": [...],
        "client_conversation": {...}
      }
    }
    // ... indicators 1.1 through 10.10 (100 total)
  },
  "aggregates": {
    "overall_risk": 0.5208,
    "overall_confidence": 0.8212,
    "trend": "stable",
    "by_category": {
      "1": {
        "category_name": "Authority-Based Vulnerabilities",
        "avg_score": 0.6123,
        "avg_confidence": 0.8456,
        "total_assessments": 7,
        "completion_percentage": 70.0
      }
      // ... categories 1-10
    },
    "completion": {
      "total_indicators": 100,
      "assessed_indicators": 45,
      "percentage": 45.0,
      "missing_indicators": ["1.3", "1.4", ...]
    },
    "last_calculated": "2025-11-11T15:30:00Z"
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

### SOC Export Script Template (REST API v2.0)

```javascript
// soc_exporter.js - Example Splunk integration using REST API
const axios = require('axios');
const splunk = require('splunk-sdk'); // Hypothetical

const API_BASE = 'http://localhost:3000/api';

/**
 * Export SOC assessment to CPF Dashboard via REST API
 */
async function exportAssessment(orgId, indicatorId, value, confidence, source) {
  try {
    const assessmentData = {
      indicator_id: indicatorId,
      bayesian_score: parseFloat(value.toFixed(3)),
      confidence: parseFloat(confidence.toFixed(3)),
      assessor: `SOC-${source}`,
      assessment_date: new Date().toISOString(),
      raw_data: {
        source: source,
        soc_generated: true,
        metadata: {
          // Add custom SOC metrics
          confidence_level: confidence,
          detection_method: source
        }
      }
    };

    const response = await axios.post(
      `${API_BASE}/organizations/${orgId}/assessments`,
      assessmentData,
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (response.data.success) {
      console.log(`✓ Updated ${orgId} indicator ${indicatorId}: ${value}`);
      console.log(`  New overall risk: ${response.data.aggregates.overall_risk}`);
    }
  } catch (error) {
    console.error(`✗ Failed to export ${orgId}/${indicatorId}:`, error.message);
  }
}

/**
 * Example: Query Splunk for failed auth attempts (Indicator 1.7)
 */
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

  await exportAssessment(orgId, '1.7', risk, confidence, 'splunk-auth-analyzer');
}

/**
 * Batch export multiple indicators
 */
async function exportMultipleIndicators(orgId, indicators) {
  for (const [indicatorId, data] of Object.entries(indicators)) {
    await exportAssessment(
      orgId,
      indicatorId,
      data.value,
      data.confidence,
      data.source
    );
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Verify final aggregates
  const response = await axios.get(`${API_BASE}/organizations/${orgId}/aggregates`);
  console.log('✓ Final overall risk:', response.data.aggregates.overall_risk);
}

// Run every 2 days (SOC frequency)
setInterval(() => calculateIndicator1_7('org-demo-001'), 2 * 24 * 60 * 60 * 1000);
```

**Advantages of REST API approach:**
- ✅ Automatic Bayesian recalculation
- ✅ Automatic aggregate updates
- ✅ Atomic operations (no file corruption)
- ✅ Index auto-update
- ✅ Error handling and validation
- ✅ No direct file access needed

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

## REST API Reference

The CPF Dashboard Server exposes a complete REST API for programmatic access. All endpoints return JSON responses.

**Base URL:** `http://localhost:3000/api`

### Organizations Endpoints

#### GET /api/organizations
Returns the organizations index with metadata and stats.

**Response:**
```json
{
  "metadata": {
    "version": "2.0",
    "last_updated": "2025-11-11T15:30:00Z",
    "total_organizations": 5
  },
  "organizations": [...]
}
```

#### GET /api/organizations/:orgId
Returns complete data for a single organization.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "org-demo-001",
    "name": "TechCorp Global",
    "metadata": {...},
    "assessments": {...},
    "aggregates": {...}
  }
}
```

#### POST /api/organizations
Creates a new organization.

**Request Body:**
```json
{
  "id": "org-new-001",
  "name": "New Company",
  "industry": "Technology",
  "size": "medium",
  "country": "IT",
  "language": "it-IT"
}
```

**Response:** `201 Created` with organization data

#### PUT /api/organizations/:orgId
Updates organization metadata.

**Request Body:**
```json
{
  "name": "Updated Name",
  "notes": "New notes"
}
```

**Response:** `200 OK` with updated data

#### DELETE /api/organizations/:orgId
Deletes an organization and all its data.

**Response:** `200 OK` with confirmation

---

### Assessments Endpoints

#### GET /api/organizations/:orgId/assessments
Returns all assessments for an organization.

**Response:**
```json
{
  "success": true,
  "orgId": "org-demo-001",
  "assessments": {...},
  "count": 45
}
```

#### GET /api/organizations/:orgId/assessments/:indicatorId
Returns a specific assessment.

**Response:**
```json
{
  "success": true,
  "data": {
    "indicator_id": "1.1",
    "bayesian_score": 0.65,
    "confidence": 0.85,
    ...
  }
}
```

#### POST /api/organizations/:orgId/assessments
Saves or updates an assessment. **Automatically recalculates aggregates.**

**Request Body:**
```json
{
  "indicator_id": "1.1",
  "bayesian_score": 0.75,
  "confidence": 0.85,
  "assessor": "John Doe",
  "assessment_date": "2025-11-11T17:00:00Z",
  "raw_data": {...}
}
```

**Response:**
```json
{
  "success": true,
  "message": "Assessment saved successfully",
  "aggregates": {...}
}
```

#### DELETE /api/organizations/:orgId/assessments/:indicatorId
Deletes an assessment and recalculates aggregates.

**Response:** `200 OK` with updated aggregates

---

### Aggregates Endpoints

#### GET /api/organizations/:orgId/aggregates
Returns calculated aggregates (risk scores, completion, etc.).

**Response:**
```json
{
  "success": true,
  "aggregates": {
    "overall_risk": 0.5208,
    "overall_confidence": 0.8212,
    "by_category": {...},
    "completion": {...}
  }
}
```

#### POST /api/organizations/:orgId/recalculate
Forces recalculation of aggregates.

**Response:** `200 OK` with recalculated aggregates

#### GET /api/organizations/:orgId/missing
Returns list of missing indicators.

**Response:**
```json
{
  "success": true,
  "missing_indicators": ["1.3", "1.4", ...],
  "count": 55
}
```

---

### Legacy & Utility Endpoints

#### POST /api/batch-import
Executes batch import of Field Kit exports.

**Response:** Import results and statistics

#### POST /api/generate-synthetic
Generates synthetic demo data.

**Response:** Generation confirmation

**Complete API documentation:** See `/dashboard/docs/archive/API_DOCUMENTATION.md`

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

**Using Node.js Server (Recommended):**
```bash
# From repository root
npm install
npm start

# Server starts on http://localhost:3000
# Access:
#   http://localhost:3000/dashboard/               (Landing page)
#   http://localhost:3000/dashboard/soc-integration/   (SOC Dashboard)
#   http://localhost:3000/dashboard/auditing/          (Auditing Dashboard)
```

**Pros:**
- Full REST API available
- Automatic data management
- CORS enabled for development

**Cons:**
- Requires Node.js 18+
- Single-user (no authentication)

---

### Option 2: Production Server (Node.js)

**PM2 Deployment:**
```bash
# Install PM2
npm install -g pm2

# Start server with PM2
pm2 start server.js --name cpf-dashboard

# Enable startup script
pm2 startup
pm2 save

# Monitor
pm2 logs cpf-dashboard
pm2 status
```

**With Nginx Reverse Proxy:**
```nginx
server {
    listen 80;
    server_name cpf.example.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name cpf.example.com;

    ssl_certificate /etc/ssl/certs/cpf.crt;
    ssl_certificate_key /etc/ssl/private/cpf.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Optional: Basic authentication
    auth_basic "CPF Dashboard";
    auth_basic_user_file /etc/nginx/.htpasswd;
}
```

**Pros:**
- Production-ready
- HTTPS support
- Authentication via Nginx
- Process management with PM2

**Cons:**
- Requires server infrastructure
- Maintenance overhead

---

### Option 3: Docker Container

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install --production

# Copy application
COPY . .

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]
```

**Build and Run:**
```bash
# Build image
docker build -t cpf-dashboard .

# Run container
docker run -d \
  -p 3000:3000 \
  -v $(pwd)/dashboard/data:/app/dashboard/data \
  --name cpf \
  cpf-dashboard

# Access: http://localhost:3000
```

**Docker Compose:**
```yaml
version: '3.8'

services:
  cpf-dashboard:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./dashboard/data:/app/dashboard/data
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

**Pros:**
- Portable deployment
- Consistent environment
- Easy scaling

---

### Option 4: Static Hosting (Limited Features)

> **Note:** Static hosting only supports client-side dashboards. REST API will not be available.

**GitHub Pages:**
```bash
git add dashboard/*
git commit -m "Deploy CPF Dashboard"
git push origin main

# Enable GitHub Pages: Settings > Pages > Source: main > /dashboard
# Access: https://yourusername.github.io/CPF/dashboard/
```

**Pros:** Free, HTTPS, CDN
**Cons:** No API, no server-side features, static data only

---

### Option 5: Air-Gapped Environment

For classified/isolated networks:

**Prepare bundle:**
```bash
# On internet-connected machine
git clone https://github.com/yourrepo/CPF.git
cd CPF
npm install
zip -r cpf-dashboard.zip . -x "node_modules/*" ".git/*"
```

**Transfer to air-gapped system** (USB drive, approved file transfer)

**Deploy:**
```bash
unzip cpf-dashboard.zip -d /opt/cpf-dashboard
cd /opt/cpf-dashboard
npm install --production
node server.js

# Access: http://localhost:3000
```

**Pros:** Maximum security, full features available
**Cons:** Manual updates, no external integrations

---

### Option 6: PostgreSQL Backend

For enterprise deployments requiring database:

```bash
# Setup PostgreSQL
psql -U postgres -f dashboard/postgres/db_schema.sql

# Seed demo data
node dashboard/postgres/db_seed_demo.js

# Configure environment
export DB_HOST=localhost
export DB_USER=cpf_user
export DB_PASSWORD=secure_password
export DB_NAME=cpf_dashboard

# Start server
node server.js
```

**See:** `/dashboard/postgres/README.md` for detailed setup

**Pros:**
- ACID transactions
- Better for 100+ organizations
- Query optimization
- Backup/restore tools

**Cons:**
- Additional complexity
- Database maintenance required

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

### Issue: "Cannot GET /api/organizations"

**Symptoms:** API requests return 404 or connection refused

**Cause:** Server not running

**Solution:**
```bash
# Check if server is running
ps aux | grep node

# Start server if not running
cd /path/to/CPF
npm start

# Verify server is listening
curl http://localhost:3000/api/organizations
```

---

### Issue: "Failed to load organizations data"

**Symptoms:** Dashboard shows empty state or error message

**Cause:** No organization data files exist

**Solution:**
```bash
# Generate demo data
node dashboard/scripts/generate_demo_organizations.js

# Or import Field Kit assessments
node dashboard/scripts/batch_import.js /path/to/field_kit_exports

# Verify data files exist
ls -la dashboard/data/organizations/
```

---

### Issue: "Port 3000 already in use"

**Symptoms:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000
# or
netstat -tulpn | grep :3000

# Kill the process
kill -9 <PID>

# Or change port in server.js
# const PORT = 3001;
```

---

### Issue: "Bayesian scores seem incorrect"

**Symptoms:** Overall risk doesn't match manual calculations

**Debugging:**
1. **Check API response:**
```bash
# Fetch organization data
curl http://localhost:3000/api/organizations/org-demo-001 | jq

# Check aggregates
curl http://localhost:3000/api/organizations/org-demo-001/aggregates | jq
```

2. **Verify dependency matrix:**
```javascript
// In browser console
console.log(BAYESIAN.DEPENDENCIES);
```

3. **Force recalculation:**
```bash
curl -X POST http://localhost:3000/api/organizations/org-demo-001/recalculate
```

---

### Issue: "Convergence chart not rendering"

**Symptoms:** Blank canvas, no SOC vs Human timeline

**Debugging:**
1. **Check API data:**
```bash
curl http://localhost:3000/api/organizations/org-demo-001/assessments/1.1
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

### Issue: "Batch import fails with 'Organization not found'"

**Symptoms:** `Error: Organization org-001 not found`

**Cause:** Organization must exist before importing assessments

**Solution:**
```bash
# Create organization first via API
curl -X POST http://localhost:3000/api/organizations \
  -H "Content-Type: application/json" \
  -d '{
    "id": "org-001",
    "name": "Organization Name",
    "industry": "Technology",
    "size": "medium",
    "country": "US"
  }'

# Then run batch import
node dashboard/scripts/batch_import.js /path/to/field_kit_exports
```

---

### Issue: "Dashboard shows old data after update"

**Cause:** Browser cache or API not returning latest data

**Solution:**
```bash
# 1. Check file modification time
ls -la dashboard/data/organizations/org-demo-001.json

# 2. Verify API returns fresh data
curl http://localhost:3000/api/organizations/org-demo-001 | jq '.metadata.updated_at'

# 3. Hard refresh browser
# Chrome/Firefox: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

# 4. Clear browser cache
# DevTools (F12) > Application > Clear storage
```

---

### Issue: "File write errors / Permission denied"

**Symptoms:** `EACCES: permission denied, open 'dashboard/data/organizations/org-001.json'`

**Solution:**
```bash
# Fix file permissions
chmod -R 755 dashboard/data/
chmod -R 644 dashboard/data/organizations/*.json

# Verify ownership
ls -la dashboard/data/organizations/
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

**Version:** 2.0
**Last Updated:** 2025-11-11
**Maintainers:** CPF Framework Team

---

## 🆕 What's New in v2.0

### Architecture Changes
- ✅ **Modular File Storage**: Separate JSON files per organization instead of monolithic `organizations.json`
- ✅ **REST API**: Full RESTful API with Express.js server
- ✅ **Data Manager**: Atomic file operations with `dataManager.js`
- ✅ **Auto-recalculation**: Bayesian aggregates update automatically on save

### New File Structure
```
dashboard/
├── index.html                      # NEW: Landing page
├── soc-integration/index.html      # (was dashboard.html)
├── auditing/index.html             # (was dashboard_auditing.html)
├── lib/dataManager.js              # NEW: Data management module
├── data/
│   ├── organizations_index.json    # NEW: Fast index
│   ├── organizations/              # NEW: Modular storage
│   │   ├── org-demo-001.json
│   │   └── ...
│   └── schemas/                    # NEW: JSON schemas
└── postgres/                       # NEW: Optional database support
```

### Migration from v1.0

**If you have existing `organizations.json`:**

The new system is **backward compatible**. The server will automatically migrate old data format to new modular structure on first run.

**Manual migration:**
```bash
# Backup old data
cp dashboard/data/organizations.json dashboard/data/organizations_backup.json

# Start server (auto-migrates)
npm start

# Verify migration
ls -la dashboard/data/organizations/
```

### API Changes

**Old (v1.0):** Direct file access
```javascript
const data = JSON.parse(fs.readFileSync('organizations.json'));
```

**New (v2.0):** REST API
```javascript
const response = await fetch('http://localhost:3000/api/organizations');
const data = await response.json();
```

---

## 📚 Additional Resources

- **Main README**: `/dashboard/README.md` - Complete system documentation
- **API Documentation**: `/dashboard/docs/archive/API_DOCUMENTATION.md` - Full REST API reference
- **User Guide**: `/dashboard/docs/USER_GUIDE.html` - End-user dashboard guide
- **PostgreSQL Setup**: `/dashboard/postgres/README.md` - Database integration
- **Data Schemas**: `/dashboard/data/README.md` - JSON structure documentation

---

**Version:** 2.0
**Last Updated:** 2025-11-11
**Maintainers:** CPF Framework Team
