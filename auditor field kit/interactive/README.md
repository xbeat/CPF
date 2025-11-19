# CPF Auditor Field Kit - Interactive Assessment Data

This directory contains the core CPF assessment data structured by language and category. The interactive client application has been archived.

## 🎯 Overview

This directory contains the CPF 100-indicator assessment data organized in JSON format:

- Multi-language support (en-US, it-IT)
- 10 vulnerability categories (1.x through 10.x)
- Reference guides for each language
- Structured indicator definitions with scoring methodology

## 📁 Project Structure

```
interactive/
├── README.md                          # This file
├── reference_guide_en-US.json         # English reference guide
├── reference_guide_it-IT.json         # Italian reference guide
├── en-US/                             # English indicator JSONs
│   ├── README.md
│   ├── 1.x-authority/
│   │   └── indicator_1.1.json, indicator_1.2.json, ...
│   ├── 2.x-temporal/
│   ├── 3.x-social/
│   ├── 4.x-affective/
│   ├── 5.x-cognitive/
│   ├── 6.x-group/
│   ├── 7.x-stress/
│   ├── 8.x-unconscious/
│   ├── 9.x-ai/
│   └── 10.x-convergent/
├── it-IT/                             # Italian translations
│   ├── README.md
│   └── ... (same structure as en-US)
└── archive/                           # Archived client application
    └── client-app/
        ├── cpf_client_json.html       # Interactive web client (archived)
        ├── script.js                  # Client logic (archived)
        ├── styles.css                 # UI styles (archived)
        ├── validator.js               # JSON validator (archived)
        ├── test-validator.js          # Validator tests (archived)
        ├── PROMPT_TEMPLATE.md         # Generation templates (archived)
        └── STARTUP_PROMPT.md          # Workflow guide (archived)
```

> **Note**: The interactive HTML/JavaScript client has been archived. This directory now focuses on maintaining the core assessment data (JSON indicators) that can be consumed by various client applications.

## 🚀 Quick Start

### Accessing the Data

The assessment data is organized by language and category:

1. **English Indicators**: Browse `en-US/` directory
2. **Italian Indicators**: Browse `it-IT/` directory
3. **Reference Guides**: Use `reference_guide_en-US.json` or `reference_guide_it-IT.json`

### Using with Client Applications

These JSON files can be consumed by:
- The archived interactive client (see `archive/client-app/`)
- The main CPF dashboard (see `/dashboard` in repository root)
- Custom integrations via REST API
- Direct JSON parsing in any application

## 📋 Data Organization

### Indicator Naming Convention

**Format**: `indicator_X.Y.json` where:
- `X` = Category number (1-10)
- `Y` = Specific indicator within category

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

### File Locations

**English Indicators:**
- Path: `en-US/{category}/indicator_{X.Y}.json`
- Example: `en-US/1.x-authority/indicator_1.3.json`

**Italian Indicators:**
- Path: `it-IT/{category}/indicator_{X.Y}.json`
- Example: `it-IT/1.x-authority/indicator_1.3.json`

### Assessment Structure

Each indicator JSON contains:
1. **Metadata**: Indicator code, category, title, version, language
2. **Quick Assessment**: Multiple-choice questions (70% weight)
3. **Client Conversation**: Open-ended follow-up questions
4. **Red Flags**: Binary risk indicators (30% weight)
5. **Scoring**: Weighted formula and maturity level thresholds

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

### Data Format
- **Standard**: JSON (RFC 8259 compliant)
- **Encoding**: UTF-8
- **Size**: ~5-15KB per indicator
- **Validation**: Schema-validated structure

### File Organization
- Hierarchical: Language → Category → Indicator
- Consistent naming: `indicator_{X.Y}.json`
- Self-contained: Each file includes full assessment definition
- Portable: Can be used standalone or in collections

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

## 🛠️ Working with Indicators

### Creating New Indicators

1. Use indicator 1.3 as reference template
2. Follow JSON schema structure (see below)
3. Maintain consistency in field naming and structure
4. Validate JSON syntax before committing
5. Commit to appropriate category directory

### Translating Indicators

1. Copy from `en-US/` to target language directory (e.g., `it-IT/`)
2. Follow translation guidelines in `{lang}/README.md`
3. **CRITICAL**: Keep IDs, values, and scoring formulas unchanged
4. Translate only user-facing text (titles, questions, descriptions)
5. Update `language` field in JSON metadata
6. Test with client application

### Quality Assurance

- **JSON Validation**: Use `archive/client-app/validator.js` if needed
- **Schema Compliance**: Check against reference indicator
- **Consistency**: Ensure all translations match source structure
- **Completeness**: Verify all fields are translated

## 📝 Data Features

### Structure
- ✅ Standardized JSON schema across all indicators
- ✅ Self-contained assessment definitions
- ✅ Multilingual support (en-US, it-IT)
- ✅ Hierarchical category organization
- ✅ Version tracking per indicator
- ✅ Consistent naming conventions

### Content
- ✅ 100 total indicators across 10 categories
- ✅ Weighted scoring methodology embedded
- ✅ Maturity level definitions (Green/Yellow/Red)
- ✅ Quick assessment questions with weights
- ✅ Conversation prompts for qualitative depth
- ✅ Red flag indicators for critical risks

### Integration
- ✅ Client-agnostic format (JSON standard)
- ✅ Direct GitHub raw access supported
- ✅ Local file system compatible
- ✅ REST API ready
- ✅ Dashboard integration ready
- ✅ Portable and redistributable

## 🐛 Troubleshooting

### Data Issues

**File not found**
- Verify path follows structure: `{lang}/{category}/indicator_{X.Y}.json`
- Check indicator number format: `1.3` not `1-3`
- Ensure language code is correct: `it-IT` not `IT`
- Confirm file exists in repository

**JSON parsing errors**
- Validate JSON syntax using a JSON validator
- Check for missing commas, brackets, or quotes
- Ensure UTF-8 encoding (no BOM)
- Use `validator.js` from archive if available

**Missing translations**
- Confirm target language directory exists
- Check that indicator number matches source (en-US)
- Verify all required fields are present
- Compare structure with reference indicator

**Schema inconsistencies**
- Use indicator 1.3 as reference template
- Ensure all IDs remain unchanged from en-US version
- Verify scoring weights match across languages
- Check that field names follow exact schema

## 🤝 Contributing

### Adding Indicators
1. Use indicator 1.3 as reference template
2. Follow JSON schema exactly
3. Validate syntax and structure
4. Test with a client application
5. Commit to appropriate category folder
6. Update language-specific README if needed

### Translations
1. Read `{lang}/README.md` for translation guidelines
2. Use terminology mapping tables
3. **CRITICAL**: Keep all IDs and structure unchanged
4. Translate only user-facing content
5. Test with client application
6. Submit for review with validation proof

### Data Quality Issues
When reporting issues, include:
- File path and indicator number
- JSON validation error (if applicable)
- Expected vs actual structure
- Language and version
- Sample JSON snippet if relevant

## 📚 Documentation

- **en-US/README.md**: Master reference and JSON schema documentation
- **it-IT/README.md**: Italian translation guidelines and terminology
- **reference_guide_{lang}.json**: Quick reference for all indicators
- **archive/client-app/**: Legacy client documentation (archived)

## 🔒 Data Privacy

- ✅ No personal data embedded in indicator definitions
- ✅ Assessment data structure respects privacy by design
- ✅ Client implementations handle sensitive data (not the JSON files)
- ✅ Publicly accessible via GitHub (contains only assessment methodology)
- ✅ No tracking or analytics in data files

## 📈 Status & Versioning

### Current (v1.0)
- ✅ Complete 100-indicator taxonomy
- ✅ English (en-US) indicators complete
- ✅ Italian (it-IT) translations in progress
- ✅ Standardized JSON schema
- ✅ Reference guides available

### Maintenance
- Regular updates to indicator content based on field testing
- New language additions as translations become available
- Schema versioning to maintain backward compatibility
- Quality assurance and validation improvements

## 📄 License

Part of the Cybersecurity Psychology Framework (CPF) project.
For licensing information, contact the CPF team.

## 🙏 Credits

**CPF Framework**: Developed by the Cybersecurity Psychology Research Team

**Assessment Data**:
- Design: CPF Development Team
- Structure: Standardized indicator methodology
- Translations: Community contributors
- Maintenance: Ongoing quality assurance program

---

**Version**: 1.0
**Last Updated**: 2025-11-11
**Status**: Production-ready

For questions or support, refer to project documentation or contact the CPF team.
