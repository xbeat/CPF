# CPF SOC Documentation

This directory contains comprehensive documentation for the CPF SOC/SIEM integration.

## Contents

### CPF_SOC_SIEM_Integration_Comprehensive_Paper.html

**Comprehensive technical paper** covering the entire CPF SOC integration methodology.

**Topics Covered:**

1. **Introduction & Overview**
   - CPF framework fundamentals
   - SOC integration rationale
   - Expected outcomes (73-81% prediction accuracy, 48-72h lead time)

2. **OFTLISRV Implementation Schema**
   - Observables (O): Behavioral patterns to detect
   - Data Sources (F): SIEM, email, AD, PAM, ticketing
   - Temporality (T): Time windows and decay functions
   - Detection Logic (L): Deterministic + statistical methods
   - Interdependencies (I): Bayesian network correlations
   - Thresholds (S): Risk level definitions
   - Responses (R): Mitigation actions
   - Validation (V): Human audit protocols

3. **Mathematical Formalization**
   - Temporal state functions: T_i(t) = α·X_i(t) + (1-α)·T_i(t-1)
   - Detection functions: D_i = w₁·R_i + w₂·A_i + w₃·C_i
   - Bayesian probability: P(legitimate|factors)
   - Mahalanobis distance for anomaly detection

4. **Category Implementations (1.x through 10.x)**
   - Authority-Based vulnerabilities
   - Temporal pressure exploitation
   - Social influence patterns
   - Affective (emotional) manipulation
   - Cognitive overload effects
   - Group dynamic failures
   - Stress response degradation
   - Unconscious bias exploitation
   - AI-specific vulnerabilities
   - Critical convergent states

5. **Data Sources & Integration**
   - Active Directory (authentication, privilege escalation)
   - Email gateways (phishing, social engineering)
   - SIEM platforms (Splunk, QRadar, Sentinel, Elastic)
   - Ticketing systems (Jira, ServiceNow)
   - Project management (deadlines, stress markers)
   - Communication tools (Slack, Teams)

6. **Deployment Guide**
   - Baseline establishment (30-90 day periods)
   - Correlation rule deployment
   - Dashboard configuration
   - Alert tuning and threshold calibration
   - Organization-specific customization

7. **Validation & ROI**
   - Prediction accuracy metrics
   - Lead time analysis
   - False positive reduction
   - Cost-benefit analysis
   - Case studies

## How to Use

### For Technical Implementation

1. **Start Here**: Read the comprehensive paper end-to-end
2. **Reference**: Use as lookup for specific indicator implementations
3. **Customize**: Adapt formulas and thresholds to your organization
4. **Deploy**: Follow deployment guide for production rollout

### For Research & Understanding

1. **Foundation**: Understand the OFTLISRV methodology
2. **Mathematics**: Review formalization for academic rigor
3. **Examples**: Study category implementations for real-world context
4. **Validation**: Examine metrics and case studies

### For Presentations

The HTML paper is formatted for:
- Executive briefings (focus on ROI section)
- Technical deep-dives (mathematical formalization)
- Training sessions (category implementations)
- Conference presentations (validation & metrics)

## Accessing Documentation

### Web Browser
```bash
# Open in browser
open /dashboard/soc/documentation/CPF_SOC_SIEM_Integration_Comprehensive_Paper.html

# Or via server
http://localhost:3000/dashboard/soc/documentation/
```

### PDF Export
Use browser print function → Save as PDF for offline distribution.

## Related Documentation

### Implementation Guides
- **cpf-soc-integration/docs/** - Markdown guides and papers
- **cpf-soc-integration/implementation/** - OFTLISRV schemas for all 100 indicators
- **cpf-soc-integration/papers/** - Academic papers (PDF/LaTeX)

### Foundation Papers
- **foundation docs/core/en-US/CPF Implementation Companion - Dense Foundation Paper.pdf** - Mathematical formalization
- **A_Method_for_Quantifying_Human_Risk.pdf** - Original CPF framework paper

### Code Documentation
- **dashboard/simulator/README.md** - Simulator documentation
- **dashboard/simulator/docs/** - Technical implementation details

## Updating Documentation

To update the comprehensive paper:

1. Edit the HTML file directly (it's self-contained)
2. Update version number and date in header
3. Test rendering in multiple browsers
4. Regenerate PDF if needed
5. Commit changes with descriptive message

## Versioning

Current version: 1.0 (2025)

**Changelog:**
- v1.0: Initial comprehensive paper release

## Contributing

To contribute to documentation:

1. Submit corrections via PR
2. Propose new sections or topics
3. Add implementation examples
4. Improve clarity and readability

## Citation

When citing this documentation:

```bibtex
@techreport{canale2025cpfsoc,
  title={CPF SOC/SIEM Integration: Comprehensive Implementation Guide},
  author={Canale, Giuseppe},
  year={2025},
  institution={CPF Project},
  type={Technical Documentation},
  url={https://github.com/xbeat/CPF}
}
```

## License

MIT License - See project root LICENSE file

## Contact

Giuseppe Canale, CISSP
Email: g.canale@cpf3.org
ORCID: [0009-0007-3263-6897](https://orcid.org/0009-0007-3263-6897)
