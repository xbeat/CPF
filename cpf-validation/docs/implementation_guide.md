# CPF Implementation Guide

## Deployment Steps

### 1. Environment Setup

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Configuration

Edit `config.yaml` to match your organization:

```yaml
model:
  calibration:
    # Adjust based on your organization type
    baseline_stress: 0.65  # Financial: 0.65, Healthcare: 0.75
```

### 3. Data Integration

Connect to your data sources:

```python
from soc_integration import CPFSOCIntegration

soc = CPFSOCIntegration(cpf_model)
events = your_siem_connector.get_events()
state = soc.calculate_cpf_state(events)
```

### 4. Dashboard Creation

Use the provided metrics for your security dashboard:

```python
metrics = soc.create_dashboard_metrics(state)
# Send to your visualization platform
```

## Privacy Considerations

- Always aggregate to minimum 10 individuals
- Apply differential privacy (ε = 0.1)
- Never store individual psychological profiles
- Obtain appropriate consent

## Recommended Deployment Architecture

```
SIEM/SOC → CPF Engine → Risk Dashboard
     ↓          ↓              ↓
   Events    Analysis      Alerts
```
