# CPF BATCH GENERATION - Startup Prompt

## OVERVIEW

Use this prompt to generate complete JSON field kits for all 10 indicators in a CPF category. This system follows the PROMPT_TEMPLATE.md workflow and uses indicator 1.3 as the master reference schema.

---

## CONFIGURATION

**Category**: [X].x - [Category Name]
**Language**: en-US (Master/Source)
**Indicators to Generate**: [X].1 through [X].10
**Reference Schema**: `/auditor field kit/interactive/en-US/1.x-authority/indicator_1.3.json`
**Output Directory**: `/auditor field kit/interactive/en-US/[X].x-[category-name]/`

---

## CATEGORY SELECTION

Choose ONE category to generate (replace [X] with category number 1-10):

| Code | Category Name | Folder Name |
|------|---------------|-------------|
| 1.x | Authority-Based Vulnerabilities | `authority` |
| 2.x | Temporal Vulnerabilities | `temporal` |
| 3.x | Social Influence Vulnerabilities | `social` |
| 4.x | Affective Vulnerabilities | `affective` |
| 5.x | Cognitive Overload Vulnerabilities | `cognitive` |
| 6.x | Group Dynamic Vulnerabilities | `group` |
| 7.x | Stress Response Vulnerabilities | `stress` |
| 8.x | Unconscious Process Vulnerabilities | `unconscious` |
| 9.x | AI-Specific Bias Vulnerabilities | `ai` |
| 10.x | Critical Convergent States | `convergent` |

---

## PRE-FLIGHT CHECK

**CRITICAL**: Before starting generation, verify ALL required files exist.

### For EACH indicator [X].1 through [X].10, check:

```
□ /auditor field kit/[X].x-[category]/cpf_indicator_[X]_[Y]_foundation.md
□ /auditor field kit/[X].x-[category]/cpf_indicator_[X]_[Y]_operational.md
```

**Example for Category 2 (Temporal), Indicator 2.3:**
```
□ /auditor field kit/2.x-temporal/cpf_indicator_2_3_foundation.md
□ /auditor field kit/2.x-temporal/cpf_indicator_2_3_operational.md
```

### Additional required files:

```
□ /math-formalization/CPF Mathematical Formalization Series - Paper [X]_ [Category Name].tex
□ /auditor field kit/interactive/PROMPT_TEMPLATE.md
□ /auditor field kit/interactive/en-US/1.x-authority/indicator_1.3.json (reference schema)
□ /auditor field kit/interactive/validator.js
```

### Verification Procedure:

1. List all required files with their exact paths
2. Confirm each file exists and is readable
3. If ANY file is missing, STOP and report which files are missing
4. Only proceed if ALL files are confirmed available

**Example successful check:**
```
✅ Foundation: cpf_indicator_2_1_foundation.md (15.2 KB)
✅ Operational: cpf_indicator_2_1_operational.md (8.7 KB)
✅ Foundation: cpf_indicator_2_2_foundation.md (14.8 KB)
✅ Operational: cpf_indicator_2_2_operational.md (9.1 KB)
... (check all 10 indicators)
✅ Math paper: Paper 2_ Temporal Vulnerabilities.tex (42.1 KB)
✅ Reference: en-US/1.x-authority/indicator_1.3.json (40.6 KB)
✅ Template: PROMPT_TEMPLATE.md (25.3 KB)
✅ Validator: validator.js (10.7 KB)

All files verified. Proceeding with Category 2.x generation for language: en-US
```

**Example failure:**
```
❌ Foundation file NOT FOUND: cpf_indicator_2_3_foundation.md
Expected path: /auditor field kit/2.x-temporal/cpf_indicator_2_3_foundation.md

STOPPING: Cannot generate JSON without foundation file.
Please verify file path and try again.
```

---

## GENERATION WORKFLOW

For each indicator [X].1 through [X].10:

### 1. Read Source Files

Read all source files for the indicator:

```
- Foundation: /auditor field kit/[X].x-[category]/cpf_indicator_[X]_[Y]_foundation.md
- Operational: /auditor field kit/[X].x-[category]/cpf_indicator_[X]_[Y]_operational.md
- Math paper: /math-formalization/CPF Mathematical Formalization Series - Paper [X]_ [Category Name].tex
```

### 2. Follow PROMPT_TEMPLATE.md Exactly

Generate the complete JSON following these requirements:

**Use indicator 1.3 as schema reference**:
- Read `/auditor field kit/interactive/en-US/1.x-authority/indicator_1.3.json`
- Match exact structure, field names, and formatting
- Preserve all required sections

**Extract content from source files**:
- Psychological basis from foundation.md
- Detection methods from operational.md
- Mathematical formulas from .tex paper
- Research citations and references

**Generate assessment content**:
- 8-12 quick assessment questions with weighted scoring
- Questions must cover key aspects of the vulnerability
- All question weights MUST sum to exactly 1.0
- Each option must have a score value (0.0 to 1.0)
- Create comprehensive client conversation guide
- Include probing questions and follow-ups

**Include technical specifications**:
- Complete detection formulas with mathematical notation
- Bayesian interdependencies with other indicators
- Data sources and collection methods
- Validation rules and thresholds

**Add practical guidance**:
- Remediation solutions with implementation steps
- 3-5 realistic risk scenarios
- References to peer-reviewed research

### 3. Set Metadata (en-US Master)

```json
"metadata": {
  "language": "en-US",
  "language_name": "English (United States)",
  "is_translation": false,
  "translated_from": null,
  "translation_date": null,
  "translator": null,
  "created_date": "2025-11-08",
  "last_modified": "2025-11-08",
  "version_history": []
}
```

### 4. Validate Each JSON

**BEFORE saving**, validate using validator.js:

```javascript
const { validateCPFJSON } = require('./validator.js');
const result = validateCPFJSON(generatedJSON);

if (!result.valid || result.errors.length > 0) {
    console.error('Validation failed:', result.errors);
    // FIX ERRORS before proceeding
}
```

### 5. Save to Correct Location

Save each validated JSON to:

```
/auditor field kit/interactive/en-US/[X].x-[category]/indicator_[X].[Y].json
```

**Example for Category 2, Indicator 2.3:**
```
/auditor field kit/interactive/en-US/2.x-temporal/indicator_2.3.json
```

---

## QUALITY REQUIREMENTS

Each generated JSON MUST satisfy ALL of these requirements:

### Validation:
- ✅ Pass validator.js with 0 errors, 0 warnings
- ✅ All required fields present
- ✅ Correct data types for all fields

### Schema Compliance:
- ✅ Follow exact schema from indicator 1.3
- ✅ Match field naming conventions
- ✅ Preserve JSON structure

### Assessment Quality:
- ✅ 8-12 weighted quick assessment questions
- ✅ Question weights sum to exactly 1.0
- ✅ All options have score values
- ✅ Scoring weights (quick: 0.4, conversation: 0.35, red_flags: 0.25)

### Technical Accuracy:
- ✅ Complete detection formulas with proper notation
- ✅ Bayesian interdependencies defined
- ✅ Valid mathematical expressions
- ✅ Correct threshold values

### Content Completeness:
- ✅ Reference peer-reviewed research
- ✅ Include data sources
- ✅ Provide actionable remediation solutions
- ✅ Include 3-5 realistic risk scenarios
- ✅ Complete metadata fields

---

## SCORING VALIDATION

Verify scoring configuration for each indicator:

### Global Weights (must sum to 1.0):
```json
"weights": {
  "quick_assessment": 0.4,      // 40%
  "conversation_depth": 0.35,    // 35%
  "red_flags": 0.25             // 25%
}
```

### Question Weights (must sum to 1.0):

Example for 10 questions:
```json
"question_weights": {
  "q1_[description]": 0.12,
  "q2_[description]": 0.11,
  "q3_[description]": 0.10,
  "q4_[description]": 0.10,
  "q5_[description]": 0.10,
  "q6_[description]": 0.10,
  "q7_[description]": 0.09,
  "q8_[description]": 0.09,
  "q9_[description]": 0.10,
  "q10_[description]": 0.09
}
// Total: 1.00 (exactly)
```

**CRITICAL**: Use calculator to verify weights sum to exactly 1.0, not 0.99 or 1.01.

---

## INTERDEPENDENCIES

For each indicator, define relationships with other indicators in the same category and related categories:

### Same Category (Strong Interdependencies):

Example for Indicator 2.3 (Temporal category):
```json
"interdependencies": {
  "primary": {
    "2.1": {
      "type": "amplifies",
      "weight": 0.3,
      "description": "Urgency-induced bypass amplifies deadline risk acceptance"
    },
    "2.2": {
      "type": "prerequisite",
      "weight": 0.25,
      "description": "Time pressure degradation enables deadline-driven risks"
    }
  }
}
```

### Cross-Category (Moderate Interdependencies):

```json
"secondary": {
  "1.5": {
    "type": "compounds",
    "weight": 0.15,
    "description": "Fear-based compliance compounds deadline pressure"
  },
  "5.2": {
    "type": "enabler",
    "weight": 0.12,
    "description": "Decision fatigue enables poor deadline decisions"
  }
}
```

---

## COMPLETION CHECKLIST

After generating all 10 indicators for the category:

### Validation:
- [ ] All 10 JSON files pass validator.js with 0 errors
- [ ] All files saved in correct directory structure
- [ ] All file names follow convention: `indicator_X.Y.json`

### Quality Assurance:
- [ ] All questions are clear and actionable
- [ ] All formulas use correct mathematical notation
- [ ] All interdependencies are bidirectional (if 2.3 references 2.1, then 2.1 references 2.3)
- [ ] All research citations are valid and accessible
- [ ] All remediation solutions are specific and implementable

### Documentation:
- [ ] Report any warnings or issues encountered
- [ ] Document any deviations from template
- [ ] Note any source file inconsistencies

### Git Operations:
- [ ] Stage all 10 generated JSON files
- [ ] Commit with descriptive message including category number
- [ ] Push to feature branch: `claude/[session-id]`

### Commit Message Format:

```
Generate complete Category [X].x field kits ([Category Name])

Created 10 validated JSON field kits for Category [X].x:
- Indicators [X].1 through [X].10
- All files validated with 0 errors
- Complete schema compliance with indicator 1.3 reference
- Full Bayesian interdependencies mapped
- Peer-reviewed research citations included

Language: en-US (master)
Output: /auditor field kit/interactive/en-US/[X].x-[category]/

Quality metrics:
- Total questions: [N]
- Total formulas: [N]
- Total interdependencies: [N]
- Total risk scenarios: [N]
```

---

## FINAL OUTPUT SUMMARY

Provide this summary after completion:

```
=== CPF CATEGORY [X].x GENERATION COMPLETE ===

Category: [X].x - [Category Name]
Language: en-US (master)
Indicators Generated: 10 ([X].1 - [X].10)

✅ Validation Results:
   - All 10 JSONs: PASS (0 errors, 0 warnings)
   - Total size: [X] KB
   - Average questions per indicator: [X]

✅ Content Statistics:
   - Total quick assessment questions: [N]
   - Total conversation questions: [N]
   - Total detection formulas: [N]
   - Total interdependencies: [N]
   - Total risk scenarios: [N]
   - Total remediation solutions: [N]

✅ Git Status:
   - Branch: claude/[session-id]
   - Commit: [hash]
   - Files added: 10
   - Ready for merge: YES

📋 Next Steps:
   1. Review generated JSONs in interactive client
   2. Test with format: [X].1, [X].2, etc.
   3. Merge branch to main after review
   4. Begin next category or translation workflow
```

---

## USAGE NOTES

### For Generation:
- Use ONLY information from source files (foundation.md, operational.md, .tex)
- Do NOT invent questions, scenarios, or formulas
- Keep technical terminology in English
- Ensure scoring weights are mathematically correct
- Cross-reference interdependencies across indicators in same category

### For Validation:
- Run validator.js after generating EACH indicator
- Fix any errors immediately before proceeding to next indicator
- Verify all weights sum to exactly 1.0
- Check that all required fields are present

### For Quality:
- Questions should be specific and observable
- Formulas should use standard mathematical notation
- Remediation should be actionable and specific
- Risk scenarios should be realistic and detailed
- Research citations should be complete and verifiable

---

## EXAMPLE USAGE

```
User: Generate Category 2.x (Temporal Vulnerabilities)