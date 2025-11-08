# CPF FIELD KIT JSON GENERATOR - Indicator Template

## PURPOSE

This prompt template is designed to generate complete, validated JSON field kits for all 100 CPF indicators. Each JSON follows a standardized schema while accommodating category-specific characteristics.

**Multilingual Support:** Generates field kits in multiple languages (en-US, it-IT, es-ES, etc.) following ISO 639-1 + ISO 3166-1 language codes.

---

## LANGUAGE CONFIGURATION

**Target Language:** `{LANGUAGE_CODE}` (e.g., `en-US`, `it-IT`, `es-ES`)

**Output Path:** `/auditor field kit/interactive/{LANGUAGE_CODE}/{X}.x-{category}/indicator_{X}.{Y}.json`

### Language-Specific Requirements

#### English (en-US) - DEFAULT/MASTER
- Use American spelling (e.g., "organization" not "organisation")
- Financial amounts in USD ($)
- Date format: MM/DD/YYYY
- Formal but accessible tone
- All field labels in English

#### Italian (it-IT)
- Use formal register ("Lei" form in questions)
- Financial amounts in EUR (€)
- Date format: DD/MM/YYYY
- Technical terms: Use English in parentheses on first occurrence
  - Example: "Il phishing (email fraudolenta) rappresenta..."
- All field labels translated to Italian
- Maintain same JSON structure as en-US

#### Spanish (es-ES) - FUTURE
- Use formal "usted" form
- Financial amounts in EUR (€)
- Date format: DD/MM/YYYY

### Translation Guidelines

**TRANSLATE:**
- All user-facing text (questions, labels, descriptions, instructions)
- Risk scenarios descriptions
- Remediation solution text
- Scoring guidance

**KEEP IN ENGLISH:**
- JSON keys/field names (`indicator`, `title`, `sections`, etc.)
- Technical identifiers (`id`, `value` attributes)
- Formula syntax and mathematical notation
- Research citations
- Technical terms where appropriate (SPF, DKIM, SIEM, API, etc.)

**IMPORTANT:**
- Preserve exact JSON structure across all languages
- Maintain identical scoring logic and weights
- Keep formulas and thresholds unchanged

---

## PRE-FLIGHT CHECK

Before starting JSON generation, verify all required files are available:

### Required Files Checklist

```
□ /auditor field kit/{X}.x-{category}/cpf_indicator_{X}_{Y}_foundation.md
□ /auditor field kit/{X}.x-{category}/cpf_indicator_{X}_{Y}_operational.md
□ /math-formalization/CPF Mathematical Formalization Series - Paper {X}_ {Category Name}.tex
□ /auditor field kit/interactive/en-US/1.x-authority/indicator_1.3.json (REFERENCE SCHEMA)
```

### File Verification Procedure

1. List all required files with their exact paths
2. Confirm each file exists and is readable
3. If ANY file is missing, STOP and report which file is missing
4. Only proceed if ALL files are confirmed available

**Example successful check:**
```
✅ Foundation: cpf_indicator_2_3_foundation.md (15.2 KB)
✅ Operational: cpf_indicator_2_3_operational.md (8.7 KB)
✅ Math paper: Paper 2_ Temporal Vulnerabilities.tex (42.1 KB)
✅ Reference: en-US/1.x-authority/indicator_1.3.json (40.6 KB)

All files verified. Proceeding with generation for language: it-IT
```

**Example failure:**
```
❌ Foundation file NOT FOUND: cpf_indicator_2_3_foundation.md
Expected path: /auditor field kit/2.x-temporal/cpf_indicator_2_3_foundation.md

STOPPING: Cannot generate JSON without foundation file.
Please verify file path and try again.
```

---

## INPUT FILES REQUIRED

**Mandatory:**
1. `/auditor field kit/{X}.x-{category}/cpf_indicator_{X}_{Y}_foundation.md`
2. `/auditor field kit/{X}.x-{category}/cpf_indicator_{X}_{Y}_operational.md`

**Reference:**
3. `/math-formalization/CPF Mathematical Formalization Series - Paper {X}_ {Category Name}.tex`
4. `/CPF_Implementation_Companion___Dense_Foundation_Paper.pdf` (Section Category {X})

**Template (Master):**
5. `/auditor field kit/interactive/en-US/1.x-authority/indicator_1.3.json` (REFERENCE SCHEMA - use this structure exactly)

---

## EXTRACTION INSTRUCTIONS

### 1. METADATA & DESCRIPTION

**Source:** `foundation.md` (lines 1-50) + `operational.md`

**Extract:**
- **indicator**: From filename (e.g., `cpf_indicator_1_3` → `"1.3"`)
- **title**: Construct as `"INDICATOR {X.Y} FIELD KIT"`
- **subtitle**: From header `# INDICATOR {X.Y}: {Title}` in foundation.md
- **category**: From folder name (e.g., `1.x-authority` → `"Authority-Based Vulnerabilities"`)
- **description.short**: First paragraph after `## CONTEXT` in operational.md
- **description.context**: Complete `### CONTEXT` section from operational.md
- **description.psychological_basis**: Section `### Core Mechanism` from foundation.md
- **description.impact**: Extract from operational.md `### RISK SCENARIOS` or foundation.md `### Historical Incidents`

---

### 2. QUICK ASSESSMENT (8-12 questions)

**Source:** `operational.md` sections `### ASSESSMENT` and `### SCORING`

**Extraction process:**

1. **Identify questions:**
   - Look for `**Question 1-7:**` patterns in operational.md
   - Extract main question text
   - Extract response options (Yes/No, multiple choice, scales)

2. **Structure each question:**
```json
{
  "type": "radio-list",
  "number": 1,
  "id": "q{N}_{snake_case_title}",
  "weight": 0.XX,
  "title": "Concise Question Title",
  "question": "Full question text from operational.md",
  "options": [
    {
      "value": "yes|no|option_id",
      "score": 0.0,  // Green=0, Yellow=0.5, Red=1.0
      "label": "Full option text"
    }
  ],
  "evidence_required": "Extracted from 'Tell us your specific example:' section",
  "soc_mapping": "Metric from detection_formula that maps to this question"
}
```

3. **Assign weights:**
   - **Critical questions** (presence of security controls, written policies): 0.15-0.18
   - **Important questions** (procedures, training programs): 0.12-0.14
   - **Supporting questions** (culture, comfort levels): 0.06-0.10
   - **Total must equal 1.0** (±0.01 tolerance)

4. **Score options:**
   - **Green indicators** (low risk, good practices) → `score: 0`
   - **Yellow indicators** (partial implementation, inconsistent) → `score: 0.5`
   - **Red indicators** (no controls, high risk) → `score: 1.0`

**Example from operational.md:**

```markdown
**Question 1: Authority Verification Process**
When employees receive unusual requests (wire transfers, password resets) from apparent executives, what is your standard verification procedure?
*Tell us your specific example: Describe the last time...*
```

**Becomes:**

```json
{
  "type": "radio-list",
  "number": 1,
  "id": "q1_verification_process",
  "weight": 0.18,
  "title": "Written Verification Procedures for Authority Requests",
  "question": "When employees receive unusual requests (wire transfers, password resets, data access) from apparent executives or IT staff, what is your standard verification procedure?",
  "options": [
    {
      "value": "yes",
      "score": 0,
      "label": "Organization has written procedures requiring verification through separate communication channels"
    },
    {
      "value": "no",
      "score": 1,
      "label": "No formal verification procedures exist"
    }
  ],
  "evidence_required": "Written verification policy document, recent example",
  "soc_mapping": "compliance_rate metric from detection_formula"
}
```

---

### 3. CONVERSATION QUESTIONS (4-7 questions)

**Source:** `operational.md` section `### ASSESSMENT`

**Extraction process:**

1. **Identify narrative questions:**
   - Questions with "*Tell us your specific example:*"
   - Open-ended questions requiring detailed responses
   - Questions about processes, culture, incidents

2. **Extract follow-ups:**
   - Sub-questions indented under main questions
   - Questions marked with quotation marks (probing questions)

3. **Group into subsections:**
   - **"Opening Questions"**: Main assessment questions (3-4)
   - **"{Specific Topic}"**: Category-specific deep-dive (1-2)
     - Examples: "Technical Authority & External Experts", "Crisis Management", "Cultural Factors"
   - **"Cultural & Psychological Factors"**: Cultural assessment (1-2)

4. **Structure:**

```json
{
  "title": "Opening Questions",
  "weight": 0.35,
  "items": [
    {
      "type": "question",
      "id": "conv_q1",
      "text": "Main question text",
      "scoring_guidance": {
        "green": "Optimal answer indicators (specific examples, documented procedures)",
        "yellow": "Partial answer indicators (informal processes, vague examples)",
        "red": "Problematic answer indicators (no procedures, cultural resistance)"
      },
      "followups": [
        {
          "type": "Follow-up",
          "text": "Specific probing question",
          "evidence_type": "specific_example|cultural_indicator|technical_control|preparedness_artifact"
        }
      ]
    }
  ]
}
```

**Example:**

```json
{
  "type": "question",
  "id": "conv_q1",
  "text": "When employees receive unusual requests from apparent authority figures, what is your standard verification procedure?",
  "scoring_guidance": {
    "green": "Specific multi-step procedure with recent successful verification example",
    "yellow": "General procedure mentioned but inconsistent application",
    "red": "No specific procedure or 'we trust our executives' response"
  },
  "followups": [
    {
      "type": "Follow-up",
      "text": "Can you describe the last time this happened - what exactly occurred?",
      "evidence_type": "specific_example"
    }
  ]
}
```

---

### 4. RED FLAGS (5-10 checkboxes)

**Source:** `foundation.md` sections:
- `### Observable Indicators` → `**Behavioral Markers:**`
- `### Organizational Signals:`
- `operational.md` → Examples of problematic statements

**Extraction process:**

1. **Identify red flag patterns:**
   - Direct quotes showing problematic attitudes
   - Behavioral patterns indicating vulnerability
   - Organizational signals of systemic issues

2. **Categorize severity:**
   - **Critical** (0.15-0.18): Fundamental security culture failures
   - **High** (0.12-0.14): Significant procedural gaps
   - **Medium** (0.08-0.10): Warning signs, early indicators

3. **Structure:**

```json
{
  "type": "checkbox",
  "id": "red_flag_{N}",
  "label": "Quoted problematic statement or observable behavior",
  "severity": "critical|high|medium",
  "score_impact": 0.XX,
  "subitems": []
}
```

**Example from foundation.md:**

```markdown
**Organizational Signals:**
- High frequency of "executive exception" requests
- Normalization of unusual authority requests during crisis periods
- Employees express reluctance to question authority
```

**Becomes:**

```json
[
  {
    "type": "checkbox",
    "id": "red_flag_1",
    "label": "\"We trust our executives, so we don't question their requests...\"",
    "severity": "critical",
    "score_impact": 0.18
  },
  {
    "type": "checkbox",
    "id": "red_flag_2",
    "label": "\"In emergencies, we need to move fast without verification delays...\"",
    "severity": "high",
    "score_impact": 0.12
  }
]
```

**Validation:** Total `score_impact` across all red flags must not exceed 1.0

---

### 5. DETECTION FORMULA (SOC automation)

**Source:** `Mathematical Formalization Paper {X}` → `\subsection{Indicator {X.Y}}`

**Extraction process:**

1. **Locate indicator subsection** in the LaTeX paper:
```latex
\subsection{Indicator X.Y: Title}
\textbf{Mathematical Model:}
\begin{equation}
...
\end{equation}
```

2. **Extract components:**

   **a) Primary detection formula:**
   ```latex
   D_{X.Y}(t) = w_1 \cdot R_{X.Y}(t) + w_2 \cdot A_{X.Y}(t) + w_3 \cdot B_{X.Y}(t)
   ```

   **b) Rule-based detection:**
   ```latex
   R_{X.Y}(t) = \begin{cases}
   1 & \text{if condition} \\
   0 & \text{otherwise}
   \end{cases}
   ```

   **c) Anomaly detection:**
   ```latex
   A_{X.Y}(t) = \sqrt{(\mathbf{x}(t) - \boldsymbol{\mu})^T \boldsymbol{\Sigma}^{-1} (\mathbf{x}(t) - \boldsymbol{\mu})}
   ```

   **d) Bayesian model:**
   ```latex
   P(legitimate|factors) = \frac{P(factors|legitimate) \cdot P(legitimate)}{P(factors)}
   ```

3. **Convert LaTeX to JSON:**

   **LaTeX:**
   ```latex
   V_{auth}(t) = \frac{\sum_{i} (1-SPF_i)(1-DKIM_i) \cdot Success_i}{\sum_{i} (1-SPF_i)(1-DKIM_i)}
   ```

   **JSON:**
   ```json
   {
     "formula": "V_auth(t) = Σ[(1-SPF_i)(1-DKIM_i)·Success_i] / Σ[(1-SPF_i)(1-DKIM_i)]",
     "description": "Correlation between email authentication failures and successful user compliance",
     "interpretation": "Higher values indicate users interacting with unauthenticated authority figures"
   }
   ```

4. **Extract thresholds:**
   - Look for `\theta`, `N >`, `p <` values
   - Example: `V_{auth} > 0.3 \text{ and } N_{failures} > 5`

   ```json
   "threshold": {
     "V_auth": 0.3,
     "N_failures": 5
   }
   ```

5. **Extract default weights:**
   ```json
   "default_weights": {
     "w1_rule": 0.3,
     "w2_anomaly": 0.4,
     "w3_bayesian": 0.3
   }
   ```

   **Validation:** Weights must sum to 1.0

6. **Extract temporal decay (if present):**
   ```latex
   T_{X.Y}(t) = \alpha \cdot D_{X.Y}(t) + (1-\alpha) \cdot T_{X.Y}(t-1)
   \text{ where } \alpha = e^{-\Delta t/\tau}
   ```

   ```json
   "temporal_decay": {
     "formula": "T_X.Y(t) = α·D_X.Y(t) + (1-α)·T_X.Y(t-1)",
     "alpha": "e^(-Δt/τ)",
     "tau": 3600,
     "description": "Exponential smoothing with 1-hour time constant"
   }
   ```

---

### 6. DATA SOURCES (telemetry mapping)

**Source:** `Implementation Companion PDF` → Section `Category {X}` → paragraph starting with "Data sources include:"

**Extraction process:**

1. **Identify log sources:**
   - Example: "Exchange message tracking logs", "Active Directory logs", "SIEM correlation events"

2. **Extract required fields:**
   - Look for parenthetical field lists
   - Example: "(sender_domain, spf_result, dkim_result, user_action)"

3. **Structure for SOC automation:**

```json
"data_sources": {
  "automated_soc": {
    "required": [
      {
        "source": "email_gateway_logs",
        "fields": ["sender_domain", "spf_result", "dkim_result", "recipient_action", "timestamp"],
        "retention": "90_days"
      }
    ],
    "optional": [
      {
        "source": "privilege_access_management",
        "fields": ["elevated_access_grants", "approver", "business_justification"],
        "retention": "180_days"
      }
    ],
    "telemetry_mapping": {
      "V_auth": {
        "calculation": "SPF/DKIM failure correlation with user actions",
        "query": "SELECT (COUNT(spf='fail' AND user_clicked=true) / COUNT(spf='fail')) FROM email_logs WHERE sender_claims_authority=true AND time_window='24h'"
      }
    }
  },
  "integration_apis": {
    "exchange_online": "Microsoft Graph API - Message Tracking, Mail Headers",
    "active_directory": "LDAP - User Hierarchy, Reporting Structure",
    "siem": "Splunk/Sentinel API - Correlation Events"
  }
}
```

4. **Map metrics to data sources:**
   - For each metric in detection_formula, specify:
     - Which log source provides it
     - How to calculate it (query example)
     - Real-time vs. batch processing

---

### 7. INTERDEPENDENCIES

**Source:** `Implementation Companion PDF` → Section `4 Interdependency Modeling`

**Extraction process:**

1. **Locate interdependency statements:**
   - "Key interdependencies include {X.Y} amplifying {Z.W}"
   - "stress amplifying authority compliance (P(1.1|7.1) = 0.8)"
   - Table showing conditional probabilities

2. **Extract amplified_by relationships:**

   **Pattern:** "{Indicator A} amplifies {Current Indicator}"

   ```json
   "amplified_by": [
     {
       "indicator": "7.1",
       "name": "Acute Stress Response",
       "probability": 0.8,
       "factor": 1.4,
       "description": "Stress amplifies authority compliance by reducing prefrontal cortex activity",
       "formula": "P(1.3|7.1) = 0.8",
       "evidence": "Berns et al. (2005) - neurological study citation if available"
     }
   ]
   ```

   **Probability values:**
   - Extract from `P(X.Y|Z.W) = 0.X` patterns
   - If not explicitly stated, use qualitative descriptors:
     - "strongly amplifies" → 0.8
     - "moderately amplifies" → 0.6-0.7
     - "slightly increases" → 0.5-0.6

   **Amplification factor:**
   - Extract from text like "increases vulnerability by 40%" → factor: 1.4
   - If not stated, derive from probability:
     - P > 0.75 → factor: 1.4-1.6
     - P > 0.6 → factor: 1.2-1.4
     - P > 0.5 → factor: 1.1-1.2

3. **Extract amplifies relationships:**

   **Pattern:** "{Current Indicator} increases risk of {Indicator B}"

   ```json
   "amplifies": [
     {
       "indicator": "1.1",
       "name": "Unquestioning Compliance",
       "probability": 0.6,
       "factor": 1.3,
       "description": "Successful impersonation normalizes automatic compliance patterns"
     }
   ]
   ```

4. **Extract convergent risk combinations:**

   **Pattern:** "Perfect storm: {X.Y} + {Z.W} + {A.B}"

   ```json
   "convergent_risk": {
     "critical_combination": ["1.3", "7.1", "2.1"],
     "convergence_formula": "CI = ∏(1 + v_i) where v_i = normalized vulnerability score",
     "convergence_multiplier": 2.5,
     "threshold_critical": 3.5,
     "description": "Perfect storm: Authority impersonation + Acute stress + Time urgency = 350% increased breach probability",
     "real_world_example": "Ubiquiti Networks $46.7M fraud during quarter-end deadline with stressed finance team"
   }
   ```

5. **Build Conditional Probability Table (CPT):**

   From paper section showing probability distributions:

   ```json
   "bayesian_network": {
     "parent_nodes": ["7.1", "5.2", "2.1", "6.1"],
     "child_nodes": ["1.1", "1.8"],
     "conditional_probability_table": {
       "P_1.3_base": 0.15,
       "P_1.3_given_stress": 0.45,
       "P_1.3_given_fatigue": 0.38,
       "P_1.3_given_urgency": 0.52,
       "P_1.3_given_all": 0.82
     }
   }
   ```

   **Calculation rules:**
   - Base probability: From empirical data in paper, or default 0.10-0.20
   - Single condition: Base × (1 + amplification_factor)
   - Multiple conditions: Use multiplicative model or explicit value from paper

**Validation:**
- All referenced indicators must match pattern `\d{1,2}\.\d{1,2}`
- Probabilities must be 0-1
- Amplification factors should be ≥ 1.0

---

### 8. REMEDIATION SOLUTIONS

**Source:** `operational.md` → Section `### SOLUTION CATALOG`

**Extraction process:**

1. **Locate solutions:**
   - Look for `**Solution 1-6:**` patterns
   - Extract title, description, implementation details

2. **Structure each solution:**

```json
{
  "id": "sol_{N}",
  "title": "Solution Name",
  "description": "One-line summary",
  "implementation": "Detailed implementation steps from operational.md",
  "technical_controls": "List of technical systems/tools required",
  "roi": "Extract percentage if stated, otherwise use category defaults",
  "effort": "low|medium|high",
  "timeline": "30-60 days"
}
```

3. **Classify effort:**
   - **Low**: Training programs, policy updates, cultural initiatives → "low", "30 days"
   - **Medium**: Process implementation, workflow changes → "medium", "45-60 days"
   - **High**: Technical integrations, system deployments → "high", "60-90 days"

4. **Extract ROI:**
   - If stated: "420% average within 18 months" → `"roi": "420% average within 18 months"`
   - If not stated, use category baselines:
     - Technical controls: 300-400%
     - Training: 250-350%
     - Cultural: 200-300%

5. **Build prioritization:**

```json
"prioritization": {
  "critical_first": ["sol_1", "sol_4"],
  "high_value": ["sol_2", "sol_3"],
  "cultural_foundation": ["sol_6"],
  "governance": ["sol_5"]
}
```

**Example extraction:**

**From operational.md:**
```markdown
**Solution 1: Dual-Channel Verification Protocol**
Require all sensitive requests from authority figures to be verified through separate communication channel. If email request → verify by phone using known numbers.
```

**Becomes JSON:**
```json
{
  "id": "sol_1",
  "title": "Dual-Channel Verification Protocol",
  "description": "Require all sensitive requests from authority figures to be verified through a separate communication channel",
  "implementation": "If email request → verify by phone using known numbers; if phone request → verify by email",
  "technical_controls": "Email gateway flags high-risk requests for automatic verification reminders",
  "roi": "420% average within 18 months",
  "effort": "medium",
  "timeline": "30-60 days"
}
```

---

### 9. RISK SCENARIOS

**Source:** `foundation.md` → `### Historical Incidents` and `operational.md` → `### RISK SCENARIOS`

**Extraction process:**

1. **Identify real-world incidents:**
   - Company names (Ubiquiti, Target, Anthem)
   - Incident dates
   - Financial losses
   - Attack vectors

2. **Structure scenario:**

```json
{
  "id": "scenario_{N}",
  "title": "Attack Type Name",
  "description": "Brief description of attack scenario",
  "attack_vector": "Specific technical/social method used",
  "psychological_mechanism": "Psychological vulnerability exploited",
  "historical_example": "Company name + year + specific details",
  "likelihood": "high|medium|low",
  "impact": "critical|high|medium|low",
  "detection_indicators": ["metric_1 > threshold", "behavioral_pattern_2", "system_signal_3"]
}
```

3. **Classify likelihood and impact:**

   **Likelihood:**
   - High: Common attacks, frequent attempts, low barrier
   - Medium: Periodic occurrences, requires some sophistication
   - Low: Rare, requires significant resources/conditions

   **Impact:**
   - Critical: >$1M losses, data breach, operational shutdown
   - High: $100K-$1M, significant damage, regulatory issues
   - Medium: <$100K, limited scope, recoverable

4. **Extract detection indicators:**
   - Map to metrics from detection_formula
   - Include both technical and behavioral signals
   - Format as actionable alerts

**Example:**

**From foundation.md:**
```markdown
The 2016 **Ubiquiti Networks** case exemplifies this vulnerability: attackers impersonated executives and attorneys to authorize $46.7 million in fraudulent transfers. Despite multiple verification opportunities, employees complied with apparent authority commands rather than following security protocols.
```

**Becomes JSON:**
```json
{
  "id": "scenario_1",
  "title": "CEO Fraud / Business Email Compromise",
  "description": "Attackers impersonate executives to authorize fraudulent wire transfers, payroll redirections, or sensitive data releases",
  "attack_vector": "Email impersonation with spoofed domain or compromised account",
  "psychological_mechanism": "Authority gradient makes verification feel insubordinate",
  "historical_example": "Ubiquiti Networks 2016 - $46.7M fraudulent transfers via executive impersonation",
  "likelihood": "high",
  "impact": "critical",
  "detection_indicators": [
    "V_auth > 0.3",
    "urgent_financial_request",
    "unusual_request_time",
    "no_verification_attempted"
  ]
}
```

---

### 10. METADATA

**Source:** Multiple files + current date + language configuration

**Structure:**

```json
"metadata": {
  "created": "2025-01-08",
  "version": "1.0",
  "author": "Giuseppe Canale, CISSP",
  "cpf_version": "1.0",
  "last_updated": "2025-01-08",
  "language": "{LANGUAGE_CODE}",
  "language_name": "{LANGUAGE_NAME}",
  "is_translation": true|false,
  "translated_from": "{SOURCE_LANGUAGE_CODE}"|null,
  "translation_date": "YYYY-MM-DD"|null,
  "translator": "Name"|null,
  "research_basis": [
    "Primary citation from foundation.md (e.g., Milgram, 1974)",
    "Secondary citations from psychological basis section",
    "Technical papers referenced in formulas"
  ],
  "validation_status": "peer_reviewed|draft|production_ready",
  "deployment_status": "production_ready|pilot|development"
}
```

**Language Metadata Rules:**

**For en-US (Master/Original):**
```json
"language": "en-US",
"language_name": "English (United States)",
"is_translation": false,
"translated_from": null,
"translation_date": null,
"translator": null
```

**For it-IT (Translation):**
```json
"language": "it-IT",
"language_name": "Italiano (Italia)",
"is_translation": true,
"translated_from": "en-US",
"translation_date": "2025-01-09",
"translator": "Giuseppe Canale, CISSP"
```

**Language Name Mapping:**
- `en-US` → "English (United States)"
- `en-GB` → "English (United Kingdom)"
- `it-IT` → "Italiano (Italia)"
- `es-ES` → "Español (España)"
- `fr-FR` → "Français (France)"
- `de-DE` → "Deutsch (Deutschland)"

**Extract research_basis:**
- Scan foundation.md for `\cite{author_year}` or parenthetical citations
- Include primary researcher (Milgram, Cialdini, etc.)
- Add neurological studies if mentioned
- Include organizational psychology frameworks (Hofstede, Bion)
- Keep citations in original language (English) even for translations

---

## VALIDATION RULES

Before finalizing JSON, verify:

### ✅ **Schema Compliance**

- [ ] All required root fields present: `indicator`, `title`, `subtitle`, `category`, `version`, `description`, `scoring`, `detection_formula`, `data_sources`, `interdependencies`, `sections`, `validation`, `remediation`, `risk_scenarios`, `metadata`
- [ ] `sections` array contains exactly 2 objects: `quick-assessment` and `client-conversation`
- [ ] All IDs are unique within their scope

### ✅ **Scoring Mathematics**

- [ ] Sum of `scoring.question_weights` = 1.0 (±0.01 tolerance)
- [ ] Sum of `scoring.weights` (quick_assessment + conversation_depth + red_flags) = 1.0
- [ ] Each option `score` is between 0 and 1
- [ ] Sum of red flags `score_impact` ≤ 1.0
- [ ] Detection formula `default_weights` sum to 1.0

### ✅ **Quick Assessment Quality**

- [ ] 6-12 questions present
- [ ] Each question has: `id`, `weight`, `title`, `question`, `options`
- [ ] Each option has: `value`, `score`, `label`
- [ ] At least one Green option (score: 0) and one Red option (score: 1.0) per question
- [ ] `evidence_required` and `soc_mapping` fields populated

### ✅ **Conversation Quality**

- [ ] 3-5 subsections in client-conversation
- [ ] "Probing for Red Flags" subsection present
- [ ] Each question has `scoring_guidance` with green/yellow/red criteria
- [ ] Follow-ups have `evidence_type` specified
- [ ] At least 5 red flags, maximum 10

### ✅ **Detection Formulas**

- [ ] `detection_formula.mathematical_model.primary` present
- [ ] At least 2 components defined (rule_based, anomaly_score, or bayesian_inference)
- [ ] Formulas syntactically correct (no LaTeX artifacts like `\`, `{`, `_` in wrong places)
- [ ] Thresholds are numeric values, not placeholders
- [ ] Variables are defined in accompanying text

### ✅ **Interdependencies**

- [ ] All indicator references match pattern `\d{1,2}\.\d{1,2}`
- [ ] Referenced indicators exist in CPF framework (1.1-10.10)
- [ ] `probability` values are 0-1
- [ ] `factor` values are ≥ 1.0
- [ ] Convergent combinations reference 2-4 indicators

### ✅ **Data Quality**

- [ ] No placeholder text: `[TODO]`, `[EXAMPLE]`, `{X}`, `...`, `etc.`
- [ ] No LaTeX formatting artifacts: `\textbf`, `\cite`, `\begin{equation}`
- [ ] Dates in ISO format: `YYYY-MM-DD`
- [ ] URLs valid and accessible (if present)
- [ ] No copy-paste errors (duplicate content, wrong indicator numbers)

### ✅ **Completeness**

- [ ] Description sections are >50 words each (not just one-liners)
- [ ] At least 3 remediation solutions
- [ ] At least 2 risk scenarios
- [ ] Research basis has 2-5 citations
- [ ] Evidence requirements are specific and actionable

---

## CATEGORY-SPECIFIC GUIDELINES

### **Category 1: Authority-Based Vulnerabilities**

**Focus areas:**
- Compliance patterns with perceived authority
- Verification procedures for authority requests
- Organizational hierarchy and power distance

**Key metrics:**
- Compliance rate `C_r`
- Verification attempts
- Exception grant frequency
- SPF/DKIM correlation for email-based authority

**Data sources priority:**
- Email gateway logs (SPF/DKIM/DMARC)
- Approval chain logs
- Privilege access management
- Active Directory (organizational structure)

**Common interdependencies:**
- Amplified by: 7.1 (stress), 2.1 (urgency), 5.2 (decision fatigue)
- Amplifies: Other authority indicators (1.1-1.10)

---

### **Category 2: Temporal Vulnerabilities**

**Focus areas:**
- Time pressure effects on security decisions
- Deadline-driven risk acceptance
- Circadian rhythm impacts
- Decision velocity under urgency

**Key metrics:**
- Urgency index `U_i = (Δt_normal - Δt_urgent) / Δt_normal`
- Deadline proximity `D` (days/hours to deadline)
- Circadian effectiveness `E(t) = E0·(1 + A·sin(2π(t-φ)/24))`
- Hyperbolic discounting `V = A/(1+k·D)`

**Data sources priority:**
- Project management systems (deadline data)
- Task completion timestamps
- Security exception requests with urgency flags
- Time-of-day analysis of security events

**Common interdependencies:**
- Amplifies: 1.x (authority), 5.x (cognitive load), 7.x (stress)
- Amplified by: 4.x (fear/anxiety), 6.x (group pressure)

---

### **Category 3: Social Influence Vulnerabilities**

**Focus areas:**
- Reciprocity exploitation
- Social proof manipulation
- Commitment escalation
- Scarcity tactics

**Key metrics:**
- Reciprocity index `R = Σw_ij·favor_ij`
- Social proof phrase detection (NLP)
- Request sequence complexity
- Network influence centrality

**Data sources priority:**
- Email communication graphs
- Request/approval chains
- Sentiment analysis logs
- Behavioral clustering data

**Common interdependencies:**
- Amplified by: 6.x (group dynamics), 1.x (authority)
- Amplifies: 2.x (urgency), 4.x (emotional states)

---

### **Category 4: Affective Vulnerabilities**

**Focus areas:**
- Fear, anger, trust, attachment emotional states
- Emotional decision-making degradation
- Trust transference
- Emotional contagion

**Key metrics:**
- Fear index `F = α·linguistic_markers + β·response_latency + γ·action_avoidance`
- Sentiment scores (anger, fear, trust)
- Trust differential (human vs. system)
- Emotional velocity (rapid state changes)

**Data sources priority:**
- Communication sentiment analysis
- Response time patterns
- Decision outcome tracking
- Linguistic markers (NLP)

**Common interdependencies:**
- Amplifies: 7.x (stress), 5.x (cognitive), 1.x (authority)
- Amplified by: 2.x (time pressure), 6.x (group emotions)

---

### **Category 5: Cognitive Overload Vulnerabilities**

**Focus areas:**
- Alert fatigue
- Decision fatigue
- Working memory overflow
- Complexity-induced errors

**Key metrics:**
- Fatigue `F_a = 1 - (investigated/presented)`
- Decision quality degradation
- Miller's 7±2 limit violations
- Error rate correlation with cognitive load

**Data sources priority:**
- Alert presentation and investigation logs
- Decision logs with timestamps
- Error tracking systems
- Complexity metrics (cyclomatic, interface count)

**Common interdependencies:**
- Amplified by: 2.x (time pressure), 7.x (stress), 5.x (other cognitive)
- Amplifies: All categories (cognitive capacity is foundational)

---

### **Category 6: Group Dynamic Vulnerabilities**

**Focus areas:**
- Groupthink
- Risky shift
- Diffusion of responsibility
- Bion's basic assumptions (dependency, fight-flight, pairing)

**Key metrics:**
- Diversity index `D = 1 - Σp_i^2`
- Group vs. individual risk tolerance
- Ownership transfer count
- Linguistic markers (dependency, fight-flight, pairing)

**Data sources priority:**
- Meeting transcripts/logs
- Decision voting patterns
- Ticket ownership transfers
- Communication network analysis

**Common interdependencies:**
- Amplifies: 1.x (authority dependency), 3.x (social proof), 4.x (emotional contagion)
- Amplified by: 7.x (collective stress), 2.x (group deadlines)

---

### **Category 7: Stress Response Vulnerabilities**

**Focus areas:**
- Acute stress response
- Chronic stress accumulation
- Fight/flight/freeze/fawn patterns
- Burnout

**Key metrics:**
- Stress index `S = ∫ stress_markers(t)·e^(-λ(t-τ)) dτ`
- Typing pattern deviation
- Email response variance
- Physiological proxies (if available ethically)

**Data sources priority:**
- Behavioral biometrics (typing, mouse movement)
- Communication pattern changes
- Error rate spikes
- HR systems (workload, hours, PTO)

**Common interdependencies:**
- Amplifies: ALL categories (stress is universal amplifier)
- Amplified by: 2.x (deadline stress), 5.x (cognitive overload), 6.x (social stress)

---

### **Category 8: Unconscious Process Vulnerabilities**

**Focus areas:**
- Shadow projection
- Repetition compulsion
- Defense mechanisms (denial, rationalization, intellectualization)
- Transference

**Key metrics:**
- Attribution pattern matching
- Cyclical failure detection (time-series)
- Linguistic defense mechanism markers
- Negation frequency, causal conjunction density, abstract noun usage

**Data sources priority:**
- Incident post-mortems (language analysis)
- Threat description patterns
- Time-series incident data
- Communication psycholinguistics

**Common interdependencies:**
- Underlying mechanism for: 1.x, 3.x, 4.x, 6.x
- Difficult to detect directly (indirect behavioral manifestations)

---

### **Category 9: AI-Specific Bias Vulnerabilities**

**Focus areas:**
- Anthropomorphization
- Automation bias
- AI overreliance
- Hallucination acceptance

**Key metrics:**
- Pronoun usage for AI systems
- Override rate when AI conflicts with human judgment
- AI confidence vs. human acceptance correlation
- Emotional language in AI interactions

**Data sources priority:**
- AI interaction logs
- Human override tracking
- AI confidence scores
- Acceptance rate by confidence level

**Common interdependencies:**
- Amplified by: 1.x (authority - AI as expert), 5.x (cognitive offloading)
- Amplifies: Security decisions with AI involvement

---

### **Category 10: Critical Convergent States**

**Focus areas:**
- Perfect storm detection (multiple vulnerabilities aligned)
- Swiss cheese model (defense layer failures)
- Catastrophic combination identification
- Near-miss analysis

**Key metrics:**
- Convergence Index `CI = ∏(1 + v_i)`
- Breach probability `P_breach = ∏p_i`
- Multi-factor risk scores
- Time-to-failure predictions

**Data sources priority:**
- Aggregated indicator data from categories 1-9
- Historical breach correlation analysis
- Defense layer status monitoring
- Threat intelligence feeds

**Common interdependencies:**
- Aggregates: All other categories
- Critical thresholds: CI > 3.5, P_breach > 0.05

---

## OUTPUT FORMAT

Generate a single, complete JSON file following this exact structure:

```json
{
  "indicator": "X.Y",
  "title": "INDICATOR X.Y FIELD KIT",
  "subtitle": "...",
  "category": "...",
  "version": "1.0",
  "cpf_reference": "CPF v1.0 - Category X.x",

  "description": {
    "short": "...",
    "context": "...",
    "impact": "...",
    "psychological_basis": "..."
  },

  "scoring": {
    "method": "bayesian_weighted",
    "formula": "Final_Score = (w1 × Quick_Assessment + w2 × Conversation_Depth + w3 × Red_Flags) × Interdependency_Multiplier",
    "weights": {
      "quick_assessment": 0.4,
      "conversation_depth": 0.35,
      "red_flags": 0.25
    },
    "maturity_levels": {
      "green": {
        "score_range": [0, 0.33],
        "label": "Low Vulnerability - Resilient",
        "description": "...",
        "risk_level": "low",
        "color": "#22c55e"
      },
      "yellow": { /* ... */ },
      "red": { /* ... */ }
    },
    "question_weights": { /* Must sum to 1.0 */ }
  },

  "detection_formula": { /* Mathematical models for SOC */ },
  "data_sources": { /* Manual + automated sources */ },
  "interdependencies": { /* Bayesian network */ },

  "sections": [
    {
      "id": "quick-assessment",
      "icon": "⚡",
      "title": "QUICK ASSESSMENT",
      "time": 5,
      "type": "radio-questions",
      "scoring_method": "weighted_average",
      "items": [ /* 8-12 questions */ ],
      "subsections": [],
      "instructions": "...",
      "calculation": "..."
    },
    {
      "id": "client-conversation",
      "icon": "💬",
      "title": "CLIENT CONVERSATION",
      "time": 15,
      "type": "conversation",
      "scoring_method": "qualitative_depth",
      "items": [],
      "subsections": [ /* 3-5 subsections including red flags */ ]
    }
  ],

  "validation": { /* Validation methodology */ },
  "remediation": { /* Solutions catalog */ },
  "risk_scenarios": [ /* 2-5 scenarios */ ],
  "metadata": { /* Creation date, author, citations */ }
}
```

---

## USAGE INSTRUCTIONS

### **Step 1: Identify Indicator**

Example: Generate JSON for Indicator 2.3 (Deadline-Driven Risk Acceptance)

**Files needed:**
```
/auditor field kit/2.x-temporal/cpf_indicator_2_3_foundation.md
/auditor field kit/2.x-temporal/cpf_indicator_2_3_operational.md
/math-formalization/CPF Mathematical Formalization Series - Paper 2_ Temporal Vulnerabilities.tex
/CPF_Implementation_Companion___Dense_Foundation_Paper.pdf (Section 3.2)
```

### **Step 2: Execute Prompt**

**Prompt to LLM:**
```
Generate the complete CPF Field Kit JSON for Indicator 2.3 (Deadline-Driven Risk Acceptance).

Use the following files as sources:
1. Foundation: [paste cpf_indicator_2_3_foundation.md content]
2. Operational: [paste cpf_indicator_2_3_operational.md content]
3. Mathematical formalization: [paste relevant section from Paper 2]
4. Implementation companion: [paste Category 2 section]

Reference schema: indicator_1.3.json (use identical structure)

Follow all extraction instructions in PROMPT_TEMPLATE.md, paying special attention to Category 2-specific guidelines (temporal vulnerabilities).

Output: Complete, validated JSON ready for immediate use in CPF Field Kit Client.
```

### **Step 3: Validate Output**

Run through `validator.js`:
```javascript
const json = require('./indicator_2.3.json');
const result = validateJSONFile(json);
// Check for errors and warnings
```

### **Step 4: Iterate if Needed**

If validation fails:
1. Review errors
2. Manually fix or re-prompt with corrections
3. Re-validate until clean

---

## QUALITY CHECKLIST

Before marking JSON as complete:

- [ ] Read both foundation.md and operational.md completely
- [ ] Extracted mathematical formulas from correct paper section
- [ ] All weights sum to 1.0 (scoring, questions, detection)
- [ ] No placeholder text remaining
- [ ] Indicator references validated (exist in framework)
- [ ] JSON syntax valid (parseable)
- [ ] Compared structure with indicator_1.3.json (matches)
- [ ] Category-specific guidelines followed
- [ ] Tested in CPF Field Kit Client (loads without errors)
- [ ] Score calculation produces valid output

---

## FINAL NOTES

- **Consistency:** All 100 indicators must follow identical schema structure
- **Flexibility:** Content varies by category, but structure remains constant
- **Validation:** Use validator.js after every generation
- **Iteration:** Expect 1-2 refinement cycles per indicator
- **Batch processing:** Generate category-by-category (10 at a time) for quality control

**Target:** Production-ready JSON that works immediately in CPF Field Kit Client with no manual adjustments required.
