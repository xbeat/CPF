# CPF Dashboard Templates

This directory contains dashboard templates for visualizing CPF psychological vulnerability indicators in SOC environments.

## Contents

- **cpf_dashboard.json** - Static dashboard template (JSON format)

## Overview

The dashboard template provides a comprehensive view of all 100 CPF indicators organized by category, with real-time risk scoring and trend analysis.

## Dashboard Features

### Risk Matrix Visualization
- 10x10 grid showing all 100 indicators
- Color-coded risk levels (green/yellow/red)
- Trend arrows (↑↓→) showing risk direction
- Click-through to indicator details

### Category Summaries
- Overall risk score per category (1.x through 10.x)
- Completion percentage (how many indicators have data)
- Top triggered indicators
- Bayesian network correlations

### Real-time Updates
- WebSocket integration for live data
- Auto-refresh on new events
- Alert notifications for high-risk indicators

## Deployment

### Option 1: Static Template (This Directory)

The JSON template in this directory is a static reference. For production deployment, use:

**Live Dashboard**: `/dashboard/soc/`
- Production-ready HTML/JS implementation
- API-connected for real-time data
- Full Bayesian scoring engine
- Multi-organization support

### Option 2: SIEM Integration

Import `cpf_dashboard.json` into your SIEM:

**Splunk:**
```bash
# Import dashboard XML (convert JSON to XML first)
splunk import dashboard cpf_dashboard.json -app search
```

**Kibana:**
```bash
# Import as Kibana dashboard
curl -X POST "localhost:5601/api/saved_objects/dashboard/cpf-dashboard" \
  -H "kbn-xsrf: true" -H "Content-Type: application/json" \
  -d @cpf_dashboard.json
```

## Live Implementation

For a fully functional dashboard with real-time updates:

**Location**: `/dashboard/soc/`

**Features**:
- Real-time indicator updates via WebSocket
- Bayesian scoring with context adjustment
- Organization management
- Category drill-down
- Indicator detail modals
- Export capabilities

**Access**: Open `/dashboard/soc/index.html` in browser after starting the server

## Data Flow

```
SIEM Events → Simulator/Adapter → CPF Scoring → Dashboard Display
                                        ↓
                              Bayesian Network
                              + Dense Foundation
```

## Customization

### Color Thresholds
Edit risk level colors in the dashboard:
```javascript
// Low: 0-0.33 (green)
// Medium: 0.34-0.66 (yellow)
// High: 0.67-1.00 (red)
```

### Category Grouping
Customize which categories are displayed:
```javascript
categories: [
  { id: 1, name: 'Authority', enabled: true },
  { id: 2, name: 'Temporal', enabled: true },
  // ... customize as needed
]
```

## Integration with Simulator

The dashboard works seamlessly with the CPF simulator:

**Simulator**: `/dashboard/simulator/`
- Generates realistic SIEM events
- Tests dashboard functionality
- Scenario-based testing (normal, attack, crisis)
- Multi-source SIEM emulation (Splunk, QRadar, Sentinel, etc.)

## Related Resources

- **Live Dashboard**: `/dashboard/soc/` - Production implementation
- **Simulator**: `/dashboard/simulator/` - Event generation and testing
- **Implementation Schemas**: `/implementation/` - Indicator definitions
- **Dense Foundation**: `/foundation docs/core/en-US/` - Mathematical formalization
