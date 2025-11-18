# CPF Auditing Dashboard v3.0

## Overview

This is the **Dashboard v3** which combines the full CPF Auditing Dashboard with the **refactored Client v3**.

## What's Inside

This directory contains:

### Dashboard Components
- `index.html` - Main dashboard interface (v3.0)
- `dashboard.js` - Dashboard logic and functionality
- `styles.css` - Dashboard styles
- `category-descriptions.json` - Category metadata
- `reference_guide_*.json` - Reference guides (multilingual)
- `scripts/` - Additional dashboard scripts

### Client v3 (Refactored)
- `client-integrated.js` - Refactored client v3 (replaces the v2 client)
- `client-integrated.css` - Client styles
- `README-CLIENT-V3.md` - Client v3 documentation
- `README-CLIENT-V3-PYTHON.md` - Python integration guide

### Testing Tools
- `index-client-test.html` - Client v3 test page
- `test-runner.html` - Automated test runner
- `test-suite.js` - Client v3 test suite
- `run-tests.js` - Test execution scripts
- `run-tests-simple.js` - Simplified test runner

## Purpose

This dashboard-v3 allows you to:
- **Test the refactored client v3** in a full dashboard environment
- **Compare** v3 performance against the original v2 dashboard
- **Run tests** while using the dashboard
- **Validate** all client v3 functionality in a production-like setting

## Usage

1. Open `index.html` in a browser to use the full dashboard with client v3
2. Open `index-client-test.html` for quick client v3 testing
3. Open `test-runner.html` to run the automated test suite

## Differences from v2

- Uses the **refactored client v3** instead of the original client
- Improved code organization and maintainability
- Enhanced testing capabilities
- All original dashboard functionality preserved

## Original Dashboard

The original dashboard (v2) remains untouched in `dashboard/auditing/` for comparison and fallback purposes.
