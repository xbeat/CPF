# Cybersecurity Psychology Framework (CPF) - Source Code

## Overview

This directory contains the implementation code for the Cybersecurity Psychology Framework (CPF), a novel interdisciplinary model that identifies pre-cognitive vulnerabilities in organizational security postures through the systematic integration of psychoanalytic theory and cognitive psychology.

## Files

- **CPF_Assessment.js**: JavaScript implementation of the CPF assessment tool that maps psychological vulnerabilities to specific attack vectors. This file contains the core functionality for evaluating security vulnerabilities based on psychological factors.
- **From Theory to Code Implementing Bayesian Cybersecurity Analysis in Python ( md+pdf w/ code inside )

## Framework Structure

The CPF comprises 100 indicators organized in a 10×10 matrix across the following categories:

1. **Authority-Based Vulnerabilities** (Milgram, 1974)
2. **Temporal Vulnerabilities** (Kahneman & Tversky, 1979)
3. **Social Influence Vulnerabilities** (Cialdini, 2007)
4. **Affective Vulnerabilities** (Klein, 1946)
5. **Cognitive Overload Vulnerabilities** (Miller, 1956)
6. **Group Dynamic Vulnerabilities** (Bion, 1961)
7. **Stress Response Vulnerabilities** (Selye, 1956)
8. **Unconscious Process Vulnerabilities** (Jung, 1969)
9. **AI-Specific Bias Vulnerabilities** (Novel Integration)
10. **Critical Convergent States** (System Theory)

## Assessment Methodology

Each indicator receives a ternary score:
- **Green (0)**: Minimal vulnerability detected
- **Yellow (1)**: Moderate vulnerability requiring monitoring
- **Red (2)**: Critical vulnerability requiring intervention

## Implementation Details

The current implementation in `CPF_Assessment.js` provides scenario-based assessment for selected indicators across multiple vulnerability categories. Each scenario presents users with choices that correspond to different vulnerability levels (Red/Yellow/Green).

## Usage

The assessment tool can be integrated into security awareness programs, vulnerability assessments, or organizational security posture evaluations. The JavaScript implementation allows for web-based deployment or integration with existing security platforms.

## Key Insight

The framework correctly maps Jung's shadow projection to why organizations blame "sophisticated hackers" instead of addressing internal vulnerabilities. Security blind spots aren't technical - they're psychological.

## Future Development

Future development will focus on:
- Expanding the implementation to cover all 100 indicators
- Creating visualization tools for assessment results
- Developing targeted intervention strategies based on assessment outcomes
- Validating the framework through empirical studies

---

For more detailed information about the theoretical foundation and complete framework, please refer to the full documentation in the project root directory.
