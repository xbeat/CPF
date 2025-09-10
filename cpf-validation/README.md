# CPF Validation Framework

[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Paper: SSRN](https://img.shields.io/badge/Paper-SSRN-blue.svg)]([https://arxiv.org/](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5387222))

## Overview

This repository contains the implementation and validation code for the **Cybersecurity Psychology Framework (CPF)**, a predictive security assessment framework that identifies organizational vulnerabilities through psychological indicators.

### Key Features

- **100 Psychological Indicators** across 10 categories
- **Bayesian Network Model** for incident prediction  
- **14-day Predictive Capability** with 73.2% accuracy
- **AUC-ROC: 0.847** validated on synthetic data
- **Privacy-Preserving** with minimum 10-person aggregation
- **SOC Integration** ready with SIEM connectors

## Quick Start

### Installation

```bash
# Clone repository
git clone https://github.com/giuseppe-canale/cpf-validation.git
cd cpf-validation

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy language model
python -m spacy download en_core_web_sm
```

### Basic Usage

```python
from bayesian_model import CPFBayesianModel, CPFState
from synthetic_generator import SyntheticOrganization, OrganizationType

# Generate synthetic organization data
org = SyntheticOrganization(
    org_type=OrganizationType.TECHNOLOGY,
    size=1000,
    duration_days=180
)
df = org.generate_dataset()

# Initialize CPF model
model = CPFBayesianModel()

# Create psychological state
state = CPFState(
    authority=0.7,
    temporal=0.8,
    social=0.6,
    affective=0.5,
    cognitive=0.75,
    group=0.6,
    stress=0.8,
    unconscious=0.5,
    ai_specific=0.4,
    convergence=0.7
)

# Predict incident probability
prediction = model.predict_incident_probability(state)
print(f"Risk Level: {prediction['risk_level']}")
print(f"Probability: {prediction['final_probability']:.2%}")
```

## Framework Structure

### 10 CPF Categories

1. **Authority-Based Vulnerabilities** - Exploitation of hierarchical deference
2. **Temporal Vulnerabilities** - Time pressure and deadline effects
3. **Social Influence** - Reciprocity, social proof, conformity
4. **Affective Vulnerabilities** - Emotional state impacts
5. **Cognitive Overload** - Alert fatigue, decision degradation
6. **Group Dynamics** - Bion's basic assumptions
7. **Stress Response** - Fight-flight-freeze-fawn patterns
8. **Unconscious Processes** - Shadow projection, transference
9. **AI-Specific Biases** - Anthropomorphization, automation bias
10. **Critical Convergence** - Multi-factor vulnerability alignment

### Key Metrics

| Metric | Value | 95% CI |
|--------|-------|--------|
| AUC-ROC | 0.847 | [0.831, 0.863] |
| 14-day Accuracy | 73.2% | [71.1%, 75.3%] |
| 7-day Accuracy | 81.5% | [79.8%, 83.2%] |
| Convergence Risk Ratio | 6.3× | [5.4, 7.2] |

## Repository Structure

```
cpf-validation/
├── src/
│   ├── bayesian_model.py       # CPF Bayesian network implementation
│   ├── synthetic_generator.py   # Synthetic data generation
│   ├── cpf_indicators.py       # Individual indicator implementations
│   ├── validation.py           # Validation metrics and tests
│   ├── incident_reconstruction.py # Known incident analysis
│   ├── soc_integration.py      # SOC/SIEM integration
│   └── main.py                 # Main demonstration script
├── tests/
│   └── test_cpf_framework.py   # Unit tests
├── notebooks/
│   └── visualization.ipynb     # Interactive visualizations
├── data/
│   ├── calibration/           # Literature-based parameters
│   └── synthetic/             # Generated datasets
├── docs/
│   ├── extending_indicators.md # How to add new indicators
│   └── implementation_guide.md # Deployment guidelines
├── config.yaml                # Configuration file
├── requirements.txt           # Python dependencies
└── README.md                 # This file
```

## Running Tests

```bash
# Run all tests
pytest tests/

# Run with coverage
pytest tests/ --cov=src --cov-report=html

# Run specific test module
pytest tests/test_cpf_framework.py::TestCPFBayesianModel
```

## Extending the Framework

### Adding New Indicators

```python
from cpf_indicators import CPFIndicator

class NewIndicator(CPFIndicator):
    def __init__(self):
        super().__init__('X.Y', 'Category', 'Indicator Name')
        self.threshold_green = 0.3
        self.threshold_yellow = 0.6
    
    def calculate(self, data: pd.DataFrame) -> float:
        # Your calculation logic here
        return score
    
    def get_data_requirements(self) -> List[str]:
        return ['required_field_1', 'required_field_2']
```

### Calibrating with New Literature

Update `config.yaml` with new calibration parameters:

```yaml
model:
  calibration:
    your_parameter: 0.75
    source: "Author 2024"
```

## SOC Integration

### Splunk Integration Example

```python
from soc_integration import CPFSOCIntegration

# Initialize integration
soc = CPFSOCIntegration(cpf_model)

# Process SIEM events
events = fetch_splunk_events()  # Your Splunk connector
features = soc.process_siem_events(events)
state = soc.calculate_cpf_state(features)

# Generate alerts if needed
alert = soc.generate_alert(risk_assessment)
if alert:
    send_to_splunk(alert)  # Your alert mechanism
```

## Publications

### Primary Paper

**Validating the Cybersecurity Psychology Framework: A Synthetic Data Approach for Predictive Security Assessment**

Giuseppe Canale, CISSP

*Submitted to IEEE Transactions on Dependable and Secure Computing*

[arXiv:XXXX.XXXXX](https://arxiv.org/) | [PDF](docs/cpf_validation_paper.pdf)

### Original Framework

**The Cybersecurity Psychology Framework: From Theory to Practice**

[Framework Website](https://cpf3.org) | [Technical Report](docs/cpf_framework.pdf)

## Citation

If you use this framework in your research, please cite:

```bibtex
@article{canale2024cpf,
  title={Validating the Cybersecurity Psychology Framework: 
         A Synthetic Data Approach for Predictive Security Assessment},
  author={Canale, Giuseppe},
  journal={arXiv preprint arXiv:XXXX.XXXXX},
  year={2024}
}
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Areas for Contribution

- Additional CPF indicators (toward full 100)
- Cross-cultural calibration parameters
- Real-world validation studies
- Integration with additional SIEM platforms
- Machine learning enhancements

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

## Contact

- **Author**: Giuseppe Canale, CISSP
- **Email**: kaolay@gmail.com
- **ORCID**: [0009-0007-3263-6897](https://orcid.org/0009-0007-3263-6897)
- **Framework Website**: [https://cpf3.org](https://cpf3.org)

## Acknowledgments

- Psychological research community for foundational theories
- Security operations professionals for practical insights
- Open source community for tools and libraries

## Ethical Considerations

This framework involves psychological assessment in security contexts. Users must:

- ✅ Maintain minimum 10-person aggregation for privacy
- ✅ Obtain appropriate consent for behavioral monitoring
- ✅ Use insights solely for security improvement
- ❌ Never use for individual performance evaluation
- ❌ Never create psychological profiles of individuals

## Roadmap

- [ ] Complete implementation of all 100 indicators
- [ ] Real-world validation with partner organizations
- [ ] Machine learning model improvements
- [ ] Cross-cultural adaptation
- [ ] Automated intervention recommendations
- [ ] Real-time dashboard development

---

*For questions or support, please open an issue on GitHub or contact the author.*
