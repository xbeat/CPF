# Cybersecurity Psychology Framework (CPF) Implementation

This repository contains a computational implementation of the Cybersecurity Psychology Framework (CPF), a novel approach to assessing and prioritizing cybersecurity vulnerabilities by integrating psychological patterns. The code processes data from vulnerability scanners (Qualys, Tenable, Rapid7) to detect behavioral patterns such as manic defense, splitting, and cognitive overload, adjusting priorities accordingly.

## Features
- Extracts vulnerability data from Qualys, Tenable, and Rapid7 scanners.
- Detects psychological patterns (e.g., Manic Defense, Repetition Compulsion).
- Calculates CPF scores and adjusts vulnerability priorities.
- Provides real-time monitoring and dashboard integration.
- Modular design for extensibility and testing.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cpf-implementation.git
   cd cpf-implementation
2. Install dependencies:
   bashpip install -r requirements.txt

Configure the application by editing config.yaml with your scanner credentials and API endpoints.

##Usage
Run the main application:
bashpython main.py

The script pulls data, processes it, and pushes results to a dashboard (ensure dashboard.internal/api/cpf is configured).
Continuous monitoring runs every 60 minutes by default (adjustable in main.py).

Configuration
Edit config.yaml with your:

Scanner API credentials (username, password, access keys).
API endpoints for Qualys, Tenable, and Rapid7.
See config.yaml for a template.

####Files

detectors.py: Pattern detection logic (e.g., ManicDefenseDetector).
extractors.py: Data extraction from scanners.
normalizer.py: Data normalization across sources.
pattern_engine.py: Pattern processing and scoring.
adapters.py: Scanner adapter implementations.
priority_adjuster.py: Priority adjustment logic.
monitor.py: Continuous monitoring and alerting.
dashboard.py: Dashboard formatting and API push.
main.py: Main execution script.
README.md: This file.
requirements.txt: Dependencies.
config.yaml: Configuration file.

##Contributing
Contributions are welcome! Please open an issue or submit a pull request.
##License
[MIT License] - See LICENSE file (add if desired).
##Contact
For questions, contact [g.canale@cpf3.org].
Last updated: August 31, 2025
