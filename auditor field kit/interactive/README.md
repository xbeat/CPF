# CPF Auditor Field Kit - Interactive JSON Client

A lightweight, browser-based interactive client for conducting Cybersecurity Psychology Framework (CPF) field assessments. This tool enables security auditors to evaluate organizational psychological vulnerabilities using the CPF 100-indicator methodology.

## 🎯 Overview

The CPF Field Kit Interactive Client is a standalone HTML/CSS/JavaScript application that:

- Loads CPF indicator assessments from JSON files (local or GitHub)
- Provides interactive questionnaires for field auditors
- Calculates vulnerability scores using weighted formulas
- Generates professional PDF reports
- Supports 5 languages (en-US, it-IT, es-ES, fr-FR, de-DE)
- Requires zero installation (runs directly in browser)

## 📁 Project Structure

```
interactive/
├── cpf_client_json.html    # Main application file
├── script.js                # Core logic and scoring engine
├── styles.css               # UI styling
├── README.md                # This file
├── STARTUP_PROMPT.md        # Batch generation workflow guide
├── en-US/                   # English indicator JSONs
│   ├── README.md
│   ├── 1.x-authority/
│   │   └── indicator_1.3.json
│   ├── 2.x-temporal/
│   ├── 3.x-social/
│   └── ... (10 categories total)
├── it-IT/                   # Italian translations
│   ├── README.md
│   └── ... (same structure)
└── ... (es-ES, fr-FR, de-DE)
```

## 🚀 Quick Start

### Option 1: Open Directly
1. Open `cpf_client_json.html` in any modern browser
2. Click **"📥 Load JSON"**
3. Enter indicator code (e.g., `1.3` for en-US or `1.3-IT` for Italian)
4. Complete the assessment
5. Click **"📊 Show/Hide Analysis"** to view scores

### Option 2: Load from File
1. Open `cpf_client_json.html`
2. Click **"📂 Import JSON"**
3. Select a local `.json` file
4. Complete the assessment

## 📋 How to Use

### Loading Indicators

**Format**: `X.Y-LANG` or `X.Y` (defaults to en-US)

Examples:
- `1.3` → Loads `en-US/1.x-authority/indicator_1.3.json` from GitHub
- `1.3-IT` → Loads `it-IT/1.x-authority/indicator_1.3.json` from GitHub
- `2.5-ES` → Loads `es-ES/2.x-temporal/indicator_2.5.json` from GitHub

**Category Mapping:**
1. Authority → `1.x-authority`
2. Temporal → `2.x-temporal`
3. Social → `3.x-social`
4. Affective → `4.x-affective`
5. Cognitive → `5.x-cognitive`
6. Group → `6.x-group`
7. Stress → `7.x-stress`
8. Unconscious → `8.x-unconscious`
9. AI → `9.x-ai`
10. Convergent → `10.x-convergent`

### Assessment Workflow

1. **Load Indicator**: Choose your indicator
2. **Fill Metadata**: Date, auditor name, client, status
3. **Complete Sections**:
   - Quick Assessment (multiple choice)
   - Client Conversation (open-ended questions)
   - Red Flags (checkboxes)
4. **Auto-scoring**: Score updates in real-time
5. **Review Analysis**: Click "Show/Hide Analysis" button
6. **Export**:
   - 💾 Save (localStorage)
   - 📥 Export (JSON download)
   - 📊 Generate Report (PDF)

## 📊 Scoring System

### Formula (v2.0 - Current)
```
Final Vulnerability Score = (Quick Assessment × 0.70) + (Red Flags × 0.30)
```

**Note**: Conversation Completeness is tracked separately as **informational only** (not included in vulnerability score).

### Maturity Levels
- 🟢 **Green (0-33%)**: Low vulnerability - Good security culture
- 🟡 **Yellow (34-66%)**: Medium vulnerability - Needs improvement
- 🔴 **Red (67-100%)**: High vulnerability - Critical risks present

### Components

1. **Quick Assessment (70% weight)**
   - Multiple-choice questions
   - Weighted by importance
   - Covers key vulnerability indicators

2. **Red Flags (30% weight)**
   - Binary indicators of critical risks
   - Cultural/behavioral warning signs
   - Additive impact scoring

3. **Conversation Completeness (0% weight)**
   - Tracks progress on qualitative questions
   - X/14 answered (14 total follow-up questions)
   - Provides context, not quantified risk

## 🌍 Multilingual Support

### Supported Languages
- **en-US**: English (United States) - Master reference
- **it-IT**: Italian (Italy)
- **es-ES**: Spanish (Spain)
- **fr-FR**: French (France)
- **de-DE**: German (Germany)

### Language Files
Each language has its own directory with identical structure:
```
{lang}/
├── README.md
├── 1.x-authority/
│   ├── indicator_1.1.json
│   ├── indicator_1.2.json
│   └── ...
└── ... (all 10 categories)
```

See language-specific READMEs for translation guidelines and terminology.

## 🔧 Technical Details

### Browser Compatibility
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- No server required (pure client-side)

### Dependencies
- **Zero external dependencies**
- Pure vanilla JavaScript (ES6+)
- CSS Grid/Flexbox for layout
- LocalStorage for persistence
- jsPDF for PDF generation (included via CDN)

### Performance
- Lightweight: ~150KB total (HTML+CSS+JS)
- Instant load time
- Real-time scoring (<50ms)
- Optimized DOM updates (no full re-renders)

### Data Storage
- **LocalStorage**: Auto-save every response
- **Export JSON**: Download complete assessment data
- **No cloud sync**: All data stays local for privacy

## 📄 JSON Schema

Each indicator JSON follows this structure:

```json
{
  "indicator": "1.3",
  "category": "Authority-Based Vulnerabilities",
  "title": "Deference to Technical Authority",
  "subtitle": "Assessment of organizational susceptibility...",
  "version": "1.0",
  "language": "en-US",
  "sections": [
    {
      "id": "quick-assessment",
      "title": "QUICK ASSESSMENT",
      "icon": "⚡",
      "items": [...]
    },
    {
      "id": "client-conversation",
      "title": "CLIENT CONVERSATION",
      "icon": "💬",
      "subsections": [...]
    }
  ],
  "scoring": {
    "method": "weighted_average",
    "maturity_levels": {...}
  }
}
```

See `en-US/README.md` for complete schema documentation.

## 🛠️ Development

### Creating New Indicators

1. Use **STARTUP_PROMPT.md** for batch generation workflow
2. Follow JSON schema from master reference (indicator 1.3)
3. Validate using "🔍 Validate JSON" button
4. Test scoring calculation
5. Commit to appropriate language directory

### Translating Indicators

1. Copy from `en-US/` to target language directory
2. Follow translation guidelines in `{lang}/README.md`
3. Keep IDs, values, and scoring formulas unchanged
4. Translate only user-facing text
5. Update `language` field in JSON
6. Test in application

### Customization

**Colors** (styles.css):
```css
:root {
    --primary: #1a1a2e;
    --highlight: #e94560;
    --success: #2ecc71;
    --warning: #f39c12;
    --danger: #e74c3c;
}
```

**Scoring Weights** (script.js):
```javascript
const QUICK_WEIGHT = 0.70;
const RED_FLAGS_WEIGHT = 0.30;
```

## 📝 Features

### Core Features
- ✅ Load indicators from GitHub or local files
- ✅ Interactive questionnaires with auto-save
- ✅ Real-time vulnerability scoring
- ✅ Multilingual support (5 languages)
- ✅ Expandable detailed analysis
- ✅ PDF report generation
- ✅ JSON export/import
- ✅ Offline-capable (no internet required after load)

### Scoring Features
- ✅ Auto-update on value change (zero lag)
- ✅ Weighted scoring algorithm
- ✅ Maturity level classification
- ✅ Detailed breakdown by component
- ✅ Question-level scoring visibility
- ✅ Red flags impact tracking

### UX Features
- ✅ Sticky score bar (always visible)
- ✅ Collapsible detailed analysis (in-place, no modal)
- ✅ Smooth animations
- ✅ Responsive design (mobile-friendly)
- ✅ Clean, professional interface
- ✅ Zero flicker on updates (optimized DOM)

## 🐛 Troubleshooting

### Common Issues

**"Indicator not found" error**
- Check spelling: `1.3` not `1-3`
- Verify language code: `IT` not `it`
- Ensure JSON exists in GitHub repo
- Try loading from local file instead

**Score not updating**
- Open browser console (F12)
- Look for JavaScript errors
- Ensure all required fields are filled
- Click "🧮 Calcola Score CPF" manually

**PDF export not working**
- Check if jsPDF loaded (F12 → Network tab)
- Ensure popup blocker is disabled
- Try different browser
- Use JSON export as alternative

**Data lost after browser close**
- Use "💾 Export Data" before closing
- Check if localStorage is enabled
- Try "📥 Export" for backup

## 🤝 Contributing

### Adding Indicators
1. Follow `STARTUP_PROMPT.md` workflow
2. Use indicator 1.3 as template
3. Validate JSON schema
4. Test scoring in application
5. Commit to appropriate category folder

### Translations
1. Read `{lang}/README.md` for guidelines
2. Use terminology mapping tables
3. Keep IDs and structure unchanged
4. Test in application
5. Submit for review

### Bug Reports
Include:
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Console errors (F12)
- Sample JSON if relevant

## 📚 Documentation

- **STARTUP_PROMPT.md**: Batch generation workflow
- **en-US/README.md**: Master reference and schema
- **it-IT/README.md**: Italian translation guide
- **{lang}/README.md**: Language-specific guidelines

## 🔒 Privacy & Security

- ✅ All data stays local (no cloud)
- ✅ No analytics or tracking
- ✅ No external API calls (except GitHub raw for JSON loading)
- ✅ No authentication required
- ✅ Export data anytime (full ownership)

## 📈 Roadmap

### Completed (v1.0)
- ✅ Core assessment functionality
- ✅ Multilingual support
- ✅ Real-time scoring
- ✅ PDF export
- ✅ Optimized UX

### Planned (v2.0)
- [ ] Backend persistence (optional)
- [ ] Multi-indicator dashboard
- [ ] Bayesian cross-indicator analysis
- [ ] Collaborative editing
- [ ] API for integrations
- [ ] Advanced analytics

## 📄 License

Part of the Cybersecurity Psychology Framework (CPF) project.
For licensing information, contact the CPF team.

## 🙏 Credits

**CPF Framework**: Developed by the Cybersecurity Psychology Research Team

**Interactive Client**:
- Architecture: CPF Development Team
- Implementation: Claude (Anthropic) + Human collaboration
- Optimization: Multiple iteration cycles for production quality

---

**Version**: 1.0
**Last Updated**: 2025-11-08
**Status**: Production-ready for field testing

For questions or support, refer to project documentation or contact the CPF team.
