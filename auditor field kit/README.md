# CPF Auditor Field Kit

**Practical assessment tools for cybersecurity psychology vulnerabilities**

This repository contains the operational assessment tools for the Cybersecurity Psychology Framework (CPF). Each vulnerability domain includes three complementary components designed for different assessment needs and expertise levels.

## Repository Structure

```
auditor-field-kit/
├── README.md
│
├── interactive/                        # Assessment data repository
│   ├── README.md
│   ├── reference_guide_en-US.json      # English reference guide
│   ├── reference_guide_it-IT.json      # Italian reference guide
│   ├── en-US/                          # English indicators (JSON format)
│   │   ├── 1.x-authority/
│   │   ├── 2.x-temporal/
│   │   ├── 3.x-social/
│   │   ├── 4.x-affective/
│   │   ├── 5.x-cognitive/
│   │   ├── 6.x-group/
│   │   ├── 7.x-stress/
│   │   ├── 8.x-unconscious/
│   │   ├── 9.x-ai/
│   │   └── 10.x-convergent/
│   ├── it-IT/                          # Italian indicators (JSON format)
│   │   └── ... (same structure as en-US)
│   └── archive/
│       └── client-app/                 # Legacy web client (archived)
│           ├── cpf_client_json.html
│           ├── script.js
│           ├── validator.js
│           ├── styles.css
│           ├── PROMPT_TEMPLATE.md
│           └── STARTUP_PROMPT.md
│
├── it-IT/                              # Italian assessment documents
│   ├── README.md
│   ├── 1.x-authority/
│   │   ├── cpf_indicator_1_1_foundation.md
│   │   ├── cpf_indicator_1_1_operational.md
│   │   └── cpf_field_kit_1_1.md
│   ├── 2.x-temporal/
│   └── ... (10 categories)
│
└── en-US/                              # English assessment documents
    ├── README.md
    ├── 1.x-authority/
    │   ├── cpf_indicator_1_1_foundation.md
    │   ├── cpf_indicator_1_1_operational.md
    │   └── cpf_field_kit_1_1.md
    ├── 2.x-temporal/
    └── ... (10 categories)
```

## Assessment Data Repository

The `interactive/` folder contains the core CPF assessment data in JSON format:
- **100 indicators** across 10 vulnerability categories
- **Multi-language support** (English & Italian)
- **Standardized schema** for consistent assessment methodology
- **Reference guides** for quick indicator lookup
- **Client-agnostic format** ready for dashboard, API, or custom integrations

### Using the Assessment Data
The JSON indicator files can be consumed by:
- **CPF Dashboard** (see `/dashboard` in repository root)
- **Custom integrations** via REST API or direct file access
- **Legacy web client** (archived in `interactive/archive/client-app/`)
- **Third-party applications** supporting the CPF schema

For detailed information on the data structure and usage, see `interactive/README.md`.

---

## Assessment Components

### 📚 Foundation Documents (`*_foundation.md`)
**Target Audience**: Research teams, training developers, solution architects

Deep theoretical analysis providing the psychological and scientific basis for each vulnerability. These documents contain:
- Research citations and empirical evidence
- Detailed psychological mechanisms
- Historical attack analysis
- Neuroscience and behavioral insights
- Cultural and organizational context

**Use Cases**:
- Training program development
- Solution design justification
- Academic research and validation
- Stakeholder education materials

### 🔧 Operational Documents (`*_operational.md`)
**Target Audience**: Security professionals, consultants, risk managers

Comprehensive assessment protocols with detailed scoring methodology. These documents include:
- Structured interview questions with follow-up probes
- Technical verification procedures
- Evidence collection requirements
- Solution catalogs with ROI estimates
- Success metrics and monitoring approaches

**Use Cases**:
- Formal risk assessments
- Compliance evaluations
- Vendor security reviews
- Board-level reporting

### ⚡ Field Kit Documents (`*_field_kit.md`)
**Target Audience**: Auditors, penetration testers, rapid assessment teams

Streamlined 30-minute assessment tools for immediate vulnerability identification. These documents provide:
- 5-minute quick assessment checklists
- Evidence collection templates
- Rapid scoring decision trees
- Priority solution recommendations
- Client conversation scripts

**Use Cases**:
- Rapid security assessments
- Pre-engagement reconnaissance
- Incident response psychological profiling
- On-site audit support

## Assessment Workflow

### Standard Assessment Process
1. **Start with Field Kit** → Rapid vulnerability identification (30 min)
2. **Deep-dive with Operational** → Comprehensive analysis (2-4 hours)
3. **Reference Foundation** → Solution justification and training

### Rapid Assessment Process
1. **Field Kit Only** → Immediate risk scoring and priority actions (30 min)
2. **Operational Follow-up** → Detailed assessment of high-risk findings

## Scoring System

All assessments use the standardized CPF ternary scoring:

- **🟢 Green (0)**: Minimal vulnerability - monitoring recommended
- **🟡 Yellow (1)**: Moderate vulnerability - intervention planning required  
- **🔴 Red (2)**: Critical vulnerability - immediate action required

### Aggregate Scoring
- **Domain Score**: Sum of 10 indicators (0-20 range)
- **CPF Total**: Weighted sum across all domains
- **Risk Priority**: Highest individual indicator scores take precedence

## Privacy and Ethics

All assessment tools are designed with privacy-first principles:
- **No individual profiling** - aggregate behavioral pattern analysis only
- **Minimum viable data collection** - only security-relevant observations
- **Anonymized reporting** - role-based rather than person-specific findings
- **Consent-based** - clear communication about assessment scope and purpose

## Getting Started

### For Security Auditors
1. Review the Field Kit for your target domain (e.g., `1.x-authority/`)
2. Use the 30-minute rapid assessment protocol
3. Escalate to Operational assessment for Red/Yellow findings

### For Risk Managers  
1. Start with Operational assessment for comprehensive coverage
2. Reference Foundation documents for stakeholder communication
3. Use success metrics for ongoing monitoring

### For Researchers
1. Begin with Foundation documents for theoretical grounding
2. Reference Operational protocols for empirical validation
3. Contribute improvements through standard academic channels

## Domain Quick Reference

| Domain | Focus Area | Key Indicators |
|--------|------------|----------------|
| **1.x Authority** | Compliance with perceived authority | CEO fraud, IT impersonation, hierarchical bypass |
| **2.x Temporal** | Time pressure vulnerabilities | Urgency attacks, deadline pressure, time-based bias |
| **3.x Social** | Social influence exploitation | Reciprocity, social proof, commitment traps |
| **4.x Affective** | Emotional state vulnerabilities | Fear responses, trust transfer, attachment patterns |
| **5.x Cognitive** | Mental overload conditions | Alert fatigue, decision fatigue, information overload |
| **6.x Group** | Collective behavior patterns | Groupthink, diffusion of responsibility, social loafing |
| **7.x Stress** | Stress response exploitation | Fight/flight responses, burnout, cortisol impairment |
| **8.x Unconscious** | Below-awareness processes | Shadow projection, defense mechanisms, transference |
| **9.x AI** | Human-AI interaction bias | Anthropomorphization, automation bias, algorithm aversion |
| **10.x Convergent** | Multiple vulnerability overlap | Perfect storms, cascade failures, tipping points |

## Support and Contributions

### Reporting Issues
- Use domain-specific issue templates
- Include assessment context and organizational type
- Anonymize all sensitive information

### Contributing Improvements
- Follow evidence-based modification principles
- Provide research citations for theoretical changes
- Test operational modifications in controlled environments

### Training and Certification
Contact framework maintainers for:
- Assessor certification programs
- Train-the-trainer workshops
- Custom organizational adaptations

---

**⚠️ Important**: These tools assess organizational psychological patterns, not individual psychology. Misuse for employee evaluation or discrimination is strictly prohibited and undermines the framework's scientific validity.

**🔬 Research Status**: CPF is actively being validated through pilot implementations. Assessment results should be considered alongside traditional security controls, not as replacements.