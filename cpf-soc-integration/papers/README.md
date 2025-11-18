# CPF Academic Papers

This directory contains academic and technical papers documenting the Cybersecurity Psychology Framework (CPF) SOC integration methodology.

## Papers

### CPF SOC Implementation Technical Paper (2025)
**File**: `CPF_SOC_Implementation_Technical_Paper_2025.pdf` / `.tex`

Comprehensive technical paper covering:
- OFTLISRV implementation schema (Observables, Data Sources, Temporality, Detection Logic, Interdependencies, Thresholds, Responses, Validation)
- Mathematical formalization of all 100 indicators
- Bayesian network modeling for indicator interdependencies
- Universal detection framework with anomaly detection
- Category-specific implementations (1.x through 10.x)
- Validation metrics and ROI analysis

**Key Contributions:**
- Systematic methodology for operationalizing psychological indicators in SOC
- Deterministic + statistical hybrid detection approach
- Temporal dimension handling for psychological phenomena
- Mahalanobis distance for correlated observables

### Implementation Guide
**File**: `implementation-guide.md`

Quick-start guide for implementing CPF in production SOC environments.

## Citation

If you use this framework in your research or production systems, please cite:

```bibtex
@article{canale2025cpf,
  title={The Cybersecurity Psychology Framework (CPF): A Method for Quantifying Human Risk and a Blueprint for LLM Integration},
  author={Canale, Giuseppe},
  journal={Preprint},
  year={2025},
  url={https://github.com/xbeat/CPF}
}
```

## Related Documentation

- **Foundation Paper**: `/foundation docs/core/en-US/CPF Implementation Companion - Dense Foundation Paper.pdf`
- **Implementation Details**: `/implementation/` - OFTLISRV schemas for all indicators
- **Source Code**: `/src/` - Production-ready Python implementation

## Contact

Giuseppe Canale, CISSP
Email: g.canale@cpf3.org
ORCID: [0009-0007-3263-6897](https://orcid.org/0009-0007-3263-6897)
