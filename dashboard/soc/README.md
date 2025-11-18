# CPF SOC Dashboard

Real-time visualization and monitoring dashboard for the Cybersecurity Psychology Framework (CPF) indicators in Security Operations Centers.

## Overview

This is the **production-ready web dashboard** for CPF SOC integration. It provides:

- Real-time monitoring of all 100 CPF psychological vulnerability indicators
- 10x10 risk matrix visualization with color-coded severity
- Bayesian network correlation analysis
- Multi-organization support
- WebSocket-based live updates
- Category drill-down and indicator details
- Trend analysis and historical data

## Features

### Risk Matrix
- **100 Indicators** displayed in 10x10 grid (10 categories × 10 indicators each)
- **Color Coding**:
  - 🟢 Green (0-0.33): Low risk
  - 🟡 Yellow (0.34-0.66): Medium risk
  - 🔴 Red (0.67-1.00): High risk
- **Trend Arrows**: ↑ increasing, ↓ decreasing, → stable
- **Click-through**: Modal with detailed indicator information

### Category View
- Overall risk score per category
- Completion percentage (how many indicators have data)
- Top triggered indicators
- Category-specific descriptions (bilingual: en-US/it-IT)

### Real-time Updates
- WebSocket integration for live event streaming
- Auto-refresh on new SIEM events
- Alert notifications for high-risk indicators
- Organization selector with live switching

### Bayesian Network
- Interactive visualization of indicator interdependencies
- Correlation strength displayed as edge thickness
- Convergent state detection (Category 10.x)
- Network-based risk propagation

## Files

```
dashboard/soc/
├── index.html              # Main dashboard page
├── dashboard.js            # Core dashboard logic
├── visualizations.js       # Chart and visualization components
├── bayesian.js            # Bayesian network analysis
├── category-descriptions.json  # Category metadata (bilingual)
└── documentation/
    ├── index.html          # Documentation hub
    └── CPF_SOC_SIEM_Integration_Comprehensive_Paper.html
```

## Quick Start

### 1. Start the Server

The dashboard requires the CPF API server:

```bash
# From project root
cd /path/to/CPF
npm start  # Or your server start command
```

### 2. Access Dashboard

Open in browser:
```
http://localhost:3000/dashboard/soc/
```

### 3. Select Organization

Click on an organization in the left sidebar to view its risk indicators.

## Data Flow

```
SIEM Events
    ↓
Simulator/Generator (/dashboard/simulator/)
    ↓
CPF Adapter (cpf-adapter.js)
    ↓
Bayesian Scoring (bayesian.js)
    ↓
API Server (/api/organizations, /api/soc-indicators)
    ↓
WebSocket Updates
    ↓
Dashboard Visualization (THIS)
```

## API Endpoints

The dashboard consumes these APIs:

- `GET /api/organizations` - List all organizations with metadata
- `GET /api/organizations/:id` - Get specific organization data
- `GET /api/soc-indicators/:orgName` - Get SOC indicator scores
- `WebSocket /ws` - Real-time indicator updates

## Integration with Simulator

The dashboard works seamlessly with the CPF simulator:

**Start Simulator** (in another terminal):
```bash
# Via simulator dashboard
open /dashboard/simulator/index.html

# Start simulation for an organization
POST /api/simulator/start
{
  "orgId": "org-uuid",
  "sources": ["splunk", "qradar"],
  "scenario": "normal",
  "rate": 3
}
```

Events from the simulator automatically update the SOC dashboard in real-time.

## Customization

### Threshold Adjustment

Edit risk level thresholds in `dashboard.js`:

```javascript
function getRiskClass(value) {
    if (value >= 0.67) return 'high';
    if (value >= 0.34) return 'medium';
    return 'low';
}
```

### Color Scheme

Modify CSS variables in `index.html`:

```css
:root {
    --risk-low: #10b981;    /* Green */
    --risk-medium: #f59e0b; /* Yellow */
    --risk-high: #ef4444;   /* Red */
}
```

### Language Support

The dashboard supports English and Italian. Edit `category-descriptions.json` to add translations.

## Indicator Details Modal

Clicking any indicator cell opens a detailed modal showing:

- Indicator ID and name
- Current risk score and trend
- Confidence level
- Maturity level
- Recent events triggering this indicator
- Recommended mitigation actions
- Related indicators (Bayesian network)

## Bayesian Network Visualization

The Bayesian network view shows:

- **Nodes**: CPF indicators sized by risk score
- **Edges**: Correlations weighted by strength
- **Colors**: Category-based color coding
- **Critical Paths**: Highlighted routes to convergent states

Enable in dashboard:
```javascript
// Toggle Bayesian view
toggleBayesianView();
```

## Performance Considerations

### Large Organizations
For organizations with high event volume:

- Adjust update throttling in `dashboard.js`
- Use pagination for event history
- Enable auto-aggregation of low-risk indicators

### WebSocket Optimization
```javascript
// Throttle updates to reduce CPU usage
const UPDATE_THROTTLE_MS = 1000;  // Update max once per second
```

## Related Resources

- **Simulator**: `/dashboard/simulator/` - Event generation and testing
- **Implementation Schemas**: `/cpf-soc-integration/implementation/` - Indicator definitions
- **Dense Foundation**: `/foundation docs/core/en-US/` - Mathematical formalization
- **API Documentation**: See server README

## Troubleshooting

### Dashboard Not Loading
- Verify server is running
- Check browser console for errors
- Ensure organization data exists

### No Real-time Updates
- Check WebSocket connection in browser DevTools
- Verify simulator is running
- Check firewall settings

### Incorrect Risk Scores
- Verify baseline data is established (30+ days)
- Check event sources are configured correctly
- Review CPF adapter scoring logic

## Contributing

To enhance the dashboard:

1. Edit visualization components in `visualizations.js`
2. Add new chart types (Chart.js is included)
3. Extend Bayesian network features in `bayesian.js`
4. Add new indicator detail views
5. Submit PR with changes

## License

MIT License - See project root LICENSE file

## Contact

Giuseppe Canale, CISSP
Email: g.canale@cpf3.org
ORCID: [0009-0007-3263-6897](https://orcid.org/0009-0007-3263-6897)
