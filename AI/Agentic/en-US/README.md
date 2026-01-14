# CPF Agentic Framework - English Documentation

This directory contains English language documentation for the CPF Agentic Framework components.

## 📚 Documents

### CPF Security Orchestrator
**Files**: `CPF_Security_Orchestrator.tex`, `CPF_Security_Orchestrator.pdf`

Comprehensive guide to the **CPF Security Orchestrator** - an AI-powered security automation system that leverages CPF vulnerability detection for proactive threat mitigation.

**Key Topics**:
- Architecture and system design
- Integration with existing security infrastructure (SIEM, EDR, IAM)
- Automated response workflows based on psychological risk indicators
- Real-time monitoring and intervention strategies
- Privacy-preserving deployment patterns

**Use Cases**:
- Automated detection of authority compliance vulnerabilities in phishing attempts
- Temporal vulnerability monitoring (off-hours activity patterns)
- Cognitive load assessment for critical decision-making contexts
- Group dynamics analysis in collaborative environments

---

### CPF3 Testing Protocol
**Files**: `cpf3_testing_protocol.tex`, `cpf3_testing_protocol.pdf`

Standardized testing methodology for validating CPF implementations and ensuring accurate vulnerability detection.

**Key Topics**:
- Model accuracy validation procedures
- Privacy preservation testing
- Performance benchmarking methodology
- Real-world scenario simulation
- Correlation studies with security incidents

**Testing Domains**:
- Detection accuracy across 10 CPF categories
- False positive/negative rate analysis
- Inference latency benchmarks
- Privacy compliance verification
- Integration testing with security platforms

---

### 📁 Silicon Psyche/
Research papers on **Anthropomorphic Vulnerabilities in Large Language Models**

A groundbreaking study applying the CPF to LLMs, introducing the **Anthropomorphic Vulnerability Inheritance (AVI)** hypothesis.

**See**: `Silicon Psyche/README.md` for detailed information

**Key Contributions**:
- LLMs inherit human psychological vulnerabilities through training data
- Classification of three generations of LLM attacks (syntactic → contextual → meta-cognitive)
- SiliconPsyche Protocol for adversarial CPF testing of AI systems
- Transitive Validation Hypothesis: LLMs as "Cognitive Digital Twins" for psychological research
- Defensive framework: "Psychological Firewalls" for AI systems

---

## Quick Start

### For Security Teams
1. **Understand the Architecture**: Read `CPF_Security_Orchestrator.pdf`
2. **Plan Integration**: Identify existing security tools for orchestrator integration
3. **Validate Implementation**: Follow `cpf3_testing_protocol.pdf` for testing

### For Researchers
1. **Theoretical Foundation**: Explore `Silicon Psyche/` for CPF application to AI systems
2. **Methodology**: Review testing protocols for research design
3. **Validation**: Use SiliconPsyche Protocol for adversarial testing

### For Developers
1. **Technical Specs**: Extract system requirements from orchestrator documentation
2. **Testing Framework**: Implement validation according to testing protocol
3. **AI Integration**: Apply Silicon Psyche insights for LLM security considerations

---

## System Integration Overview

```
┌─────────────────────────────────────────────────────────────┐
│                  CPF Security Orchestrator                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐      ┌──────────────┐      ┌───────────┐ │
│  │ CPF SLM Core │ ───> │ Risk Engine  │ ───> │ Response  │ │
│  │  (Detector)  │      │  (Analysis)  │      │ Executor  │ │
│  └──────────────┘      └──────────────┘      └───────────┘ │
│         │                      │                     │       │
│         v                      v                     v       │
│  ┌──────────────┐      ┌──────────────┐      ┌───────────┐ │
│  │ Data Sources │      │   Dashboard  │      │   SIEM    │ │
│  │ (Email, Chat)│      │  (Reporting) │      │ /SOAR API │ │
│  └──────────────┘      └──────────────┘      └───────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Performance Benchmarks

| Component | Metric | Target |
|-----------|--------|--------|
| **CPF Detection** | Inference time | < 15ms |
| **Risk Analysis** | Processing latency | < 50ms |
| **Response Execution** | Action delay | < 200ms |
| **End-to-End** | Total system latency | < 300ms |
| **Privacy** | Data externalization | Zero |

---

## Related Documentation

- **Parent Directory**: `../README.md` - Agentic Framework overview
- **Core CPF**: `../../README.md` - CPF implementation fundamentals
- **Deployment Guide**: `../../CPF Deployment Tutorial - Local & Cloud.md`

---

## License

This work is licensed under **CC BY-NC-ND 4.0** (Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International).

No derivatives or commercial use permitted without explicit authorization.

---

## Contact

**Giuseppe Canale, CISSP**
Independent Researcher
kaolay@gmail.com
ORCID: 0009-0007-3263-6897

For technical questions, collaboration inquiries, or pilot testing opportunities, please reach out directly.
