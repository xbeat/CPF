# CPF Claude Skills

Specialized AI skills for working with the **Cybersecurity Psychology Framework (CPF)** - an evidence-based methodology for assessing pre-cognitive psychological vulnerabilities in organizational security.

## What Are Claude Skills?

Claude Skills are specialized instruction sets that extend Claude's capabilities with domain-specific knowledge, methodologies, and workflows. Think of them as "mini-LLMs" - focused AI assistants that anyone can load into their Claude environment to work with specific frameworks or domains.

## Available Skills

### 1. **cpf-framework** 
Core CPF methodology and theoretical foundations.

**Use when:** Creating presentations, documents, or materials about the CPF framework, its theoretical foundations (psychoanalysis, cognitive psychology), vulnerability assessment methodology, or human factors in cybersecurity.

**Contains:**
- 10×10 matrix structure (100 indicators across 10 categories)
- Ternary assessment system (Green/Yellow/Red)
- Psychological foundations from Milgram, Cialdini, Kahneman
- Privacy-by-design principles
- Vulnerability mapping and assessment methodologies

### 2. **cpf-academic**
Academic and research-focused content creation.

**Use when:** Writing academic papers, peer-reviewed articles, theoretical research documents, literature reviews, or scholarly presentations about CPF.

**Contains:**
- Academic writing standards and structure
- Literature review methodologies
- Theoretical framework development
- Peer-review preparation guidelines
- Scientific citation and attribution

### 3. **cpf-implementation**
Technical deployment and operationalization guide.

**Use when:** Developing deployment documentation, writing algorithm specifications, creating detection logic, implementing SIEM/SOAR integrations, or building operational security capabilities based on CPF indicators.

**Contains:**
- OFTLISRV implementation schema (Observables, Data Sources, Temporality, Detection Logic, Interdependencies, Thresholds, Responses, Validation)
- SOC integration patterns
- Detection algorithm specifications
- SIEM/SOAR integration guidelines
- Telemetry source mapping
- Bayesian network modeling

### 4. **cpf-mathematical**
Mathematical formalization and algorithmic specifications.

**Use when:** Working with mathematical models, detection algorithms, statistical analysis, or formal verification of CPF indicators. Ideal for researchers, data scientists, and technical implementers needing rigorous mathematical foundations.

**Contains:**
- Complete mathematical formalization for all 10 CPF categories
- Detection functions combining rule-based logic, anomaly detection, and Bayesian inference
- Temporal modeling and exponential decay functions
- Interdependency matrices and correlation analysis
- Algorithm specifications for real-time detection
- Statistical validation metrics
- Category-specific mathematical models (Authority, Temporal, Cognitive Load, Social, etc.)

## How to Use These Skills

### Step 1: Download the Skills
Clone this repository or download the individual skill folders you need.

### Step 2: Add to Your Claude Environment
1. Open Claude (claude.ai)
2. Go to your account settings
3. Navigate to "Skills" section
4. Upload the skill folder(s) you want to use
5. The skills will now be available in your Claude conversations

### Step 3: Activate and Use
When starting a conversation where CPF content is relevant, Claude will automatically detect and use the appropriate skill based on your request. You can also explicitly mention which skill you want to use.

**Examples:**
- "Create an academic paper about CPF temporal vulnerabilities" → `cpf-academic` + `cpf-mathematical`
- "Write a SOC deployment guide for indicators 1.1-1.10" → `cpf-implementation`
- "Explain the mathematical model for cognitive load assessment" → `cpf-mathematical`
- "Make a presentation introducing CPF to executives" → `cpf-framework`

## What is CPF?

The **Cybersecurity Psychology Framework** is a systematic methodology for identifying and addressing pre-cognitive psychological vulnerabilities in organizational security. Unlike traditional security awareness training that focuses on knowledge transfer, CPF identifies psychological states that create security blind spots before conscious decision-making occurs.

### Framework Structure
- **100 indicators** organized in a 10×10 matrix
- **10 vulnerability categories:** Authority, Temporal, Cognitive Load, Social, Emotional, Environmental, Identity, Trust, Scarcity, Reward
- **Ternary assessment:** Green (low risk), Yellow (moderate risk), Red (high risk)
- **Privacy-by-design:** Aggregate behavioral analysis, no individual profiling

### Research Foundation
CPF is grounded in established psychological research from:
- Milgram (obedience to authority)
- Cialdini (principles of influence)
- Kahneman (cognitive biases and heuristics)
- Contemporary social engineering and behavioral security research

## Repository Structure

```
cpf-claude-skills/
├── README.md (this file)
├── cpf-framework/
│   └── SKILL.md
├── cpf-academic/
│   └── SKILL.md
├── cpf-implementation/
│   └── SKILL.md
└── cpf-mathematical/
    └── SKILL.md
```

## Contributing

This is an open-source project. If you develop additional skills for CPF or improve existing ones, please submit a pull request.

**Potential future skills:**
- `cpf-assessment` - Vulnerability assessment execution and reporting
- `cpf-training` - Security awareness content creation
- `cpf-metrics` - KPI definition and measurement frameworks

## Learn More

- **Website:** [cpf3.org](https://cpf3.org)
- **Author:** Giuseppe Canale, CISSP
- **Email:** g.canale@cpf3.org
- **ORCID:** [0009-0007-3263-6897](https://orcid.org/0009-0007-3263-6897)

## License

[Specify your license here - MIT, Apache 2.0, CC-BY, etc.]

## Citation

If you use CPF or these skills in your research or work, please cite:

```
Canale, G. (2024). The Cybersecurity Psychology Framework: 
A Systematic Approach to Pre-Cognitive Security Vulnerabilities. 
Available at: https://cpf3.org
```

---

**Want to contribute?** Open an issue or submit a PR. Let's build the CPF ecosystem together.
