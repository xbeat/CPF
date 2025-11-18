# Cybersecurity Psychology Framework (CPF) - Mathematical Formalization

[![arXiv](https://img.shields.io/badge/arXiv-2510.09635-b31b1b.svg)](https://arxiv.org/abs/2510.09635)
[![DOI](https://img.shields.io/badge/DOI-10.48550/arXiv.2510.09635-blue.svg)](https://doi.org/10.48550/arXiv.2510.09635)
[![DOI](https://zenodo.org/badge/DOI/10.2139/ssrn.5387222.svg)](http://dx.doi.org/10.2139/ssrn.5387222)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.16944972.svg)](https://doi.org/10.5281/zenodo.16944972)
[![HuggingFace DOI](https://img.shields.io/badge/DOI-10.57967/hf/6704-ffd21e.svg?logo=huggingface)](https://doi.org/10.57967/hf/6704)

**Complete Mathematical Formalization of 100+ Psychological Vulnerabilities in Cybersecurity**

## 📚 Research Foundation

This repository contains the complete mathematical formalization of the **Cybersecurity Psychology Framework (CPF)**, enabling quantitative human risk assessment through systematic integration of psychological constructs with operational security telemetry.

**Core Publication:**  
*The Cybersecurity Psychology Framework (CPF): A Method for Quantifying Human Risk and a Blueprint for LLM Integration*  
**arXiv:** [2510.09635](https://arxiv.org/abs/2510.09635) | **DOI:** [10.48550/arXiv.2510.09635](https://doi.org/10.48550/arXiv.2510.09635)

## 🎯 Complete Mathematical Formalization Series

### **10 Vulnerability Categories - Fully Formalized**

| Category | Paper | Status | Focus Area |
|----------|-------|--------|------------|
| 1. Authority Compliance | `CPF Mathematical Formalization Series - Paper 1_ Authority-Based Vulnerabilities.tex` | ✅ Complete | Power dynamics, obedience patterns |
| 2. Temporal Vulnerabilities | `CPF Mathematical Formalization Series - Paper 2_Temporal Vulnerabilities.tex` | ✅ Complete | Time-based risk fluctuations |
| 3. Social Influence | `CPF Mathematical Formalization Series - Paper 3_Social Influence Vulnerabilities.tex` | ✅ Complete | Conformity, herd behavior |
| 4. Affective States | `CPF Mathematical Formalization Series - Paper 4_ Affective Vulnerabilities.tex` | ✅ Complete | Emotional decision-making |
| 5. Cognitive Overload | `CPF Mathematical Formalization Series - Paper 5_Cognitive Overload Vulnerabilities.tex` | ✅ Complete | Attention, fatigue, overload |
| 6. Group Dynamics | `CPF Mathematical Formalization Series - Paper 6_ Group Dynamic Vulnerabilities.tex` | ✅ Complete | Collective behavior patterns |
| 7. Stress Response | `CPF Mathematical Formalization Series - Paper 7_ Stress Response Vulnerabilities.tex` | ✅ Complete | Chronic stress impacts |
| 8. Unconscious Processes | `CPF Mathematical Formalization Series - Paper 8_ Unconscious Process Vulnerabilities.tex` | ✅ Complete | Psychoanalytic mechanisms |
| 9. AI-Specific Bias | `CPF Mathematical Formalization Series - Paper 9_AI-Specific Bias Vulnerabilities.tex` | ✅ Complete | Anthropomorphization effects |
| 10. Critical Convergent States | `CPF Mathematical Formalization Series - Paper 10_ Critical Convergent States.tex` | ✅ Complete | Multi-vulnerability alignment |

## 🔬 Key Research Contributions

### **1. Mathematical Rigor**
- **100+ formally defined detection functions**
- Bayesian inference models for psychological state estimation
- Network analysis for group dynamics  
- Temporal evolution models with consensus dynamics

### **2. Algorithm Implementation Examples**

**From Paper 1 - Authority Compliance:**
```python
# Unquestioning Compliance Detection
def detect_unquestioning_compliance(compliance_rate, baseline_mean, baseline_std):
    threshold = baseline_mean + 2 * baseline_std
    return compliance_rate > threshold

# Authority Gradient Effects  
def authority_gradient_effect(hierarchy_level_i, hierarchy_level_j, max_hierarchy):
    return (hierarchy_level_j - hierarchy_level_i) / max_hierarchy
```
**From Paper 6 - Group Dynamics:**

```python
# Groupthink Detection
def detect_groupthink(opinion_entropy, consensus_velocity):
    return opinion_entropy < 0.2 and consensus_velocity > threshold_velocity

# Social Loafing Index
def social_loafing_index(individual_effort, group_size, alpha_coefficient):
    return individual_effort * (1 - (alpha_coefficient * math.log(group_size)) / group_size)
```
### **3. Validation Framework**
- Synthetic data validation: 0.92 F1-score

- Cross-category interdependency matrices
- Statistical significance testing protocols


## 🏗️ System Architecture
- Data Sources → Privacy Processing → SLM Analysis → CPF Detection → Dashboard

- SIEM Anonymization Mistral-7B 100 Indicators Team Insights
- Ticketing Role-based DistilBERT 10 Categories Risk Trends
- Communications Metadata On-premise Real-time Interventions

## 📊 Performance Metrics

| Metric | Value | Context |
|--------|-------|---------|
| Detection Accuracy | 92% F1-score | Synthetic validation |
| Computational Cost | <$2,000 hardware | On-premise deployment |
| Privacy Level | Zero external data | GDPR-compliant |
| Analysis Speed | 12ms/inference | Real-time capable |

## 🚀 Getting Started for Researchers

### 1. **Understand the Framework**
Start with the main paper in `/The_Cybersecurity_Psychology_Framework__Taxonomy_Complete_pdf`

### 2. **Explore Mathematical Foundations**
Browse the `math-formalization/` directory for complete LaTeX formalizations

### 2. **Explore Mathematical Foundations**
Browse the `math-formalization/` directory:
```bash
# List all formalization papers
ls math-formalization/*.tex

# Example files:
# - CPF Mathematical Formalization Series - Paper 1_ Authority-Based Vulnerabilities.tex
# - CPF Mathematical Formalization Series - Paper 4_ Affective Vulnerabilities.tex  
# - CPF Mathematical Formalization Series - Paper 7_ Stress Response Vulnerabilities.tex
```

## 🤝 Research Collaboration

We actively seek:
- **Validation studies** with organizational data
- **Cross-cultural adaptation** research  
- **Integration partnerships** with SOC platforms
- **Psychological validation** with domain experts

**Contact:** Giuseppe Canale, CISSP | g.canale@cpf3.org | ORCID: 0009-0007-3263-6897

## 📜 Citation

```bibtex
@article{canale2025cpf,
  title={The Cybersecurity Psychology Framework (CPF): A Method for Quantifying Human Risk},
  author={Canale, Giuseppe},
  journal={arXiv preprint arXiv:2510.09635},
  year={2025},
  doi={10.48550/arXiv.2510.09635}
}
```