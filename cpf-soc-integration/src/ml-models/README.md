# CPF Machine Learning Models

This directory contains machine learning models for behavioral pattern detection and risk prediction in the CPF framework.

## Contents

- **cpf_risk_model.py** - Risk scoring and prediction model

## Overview

The ML models enhance CPF indicator detection by:
- Learning organizational baselines
- Detecting anomalies in behavioral patterns
- Predicting vulnerability trends
- Reducing false positives

## Models

### CPF Risk Model
**File**: `cpf_risk_model.py`

**Purpose**: Multi-class risk prediction for CPF indicators

**Approach**:
- Supervised learning on labeled SOC data
- Features: event frequency, severity, temporal patterns, user context
- Output: Risk score [0-1] per indicator
- Model: Gradient Boosting / Random Forest ensemble

**Training Data Requirements**:
- Historical SIEM events (minimum 30 days)
- Labeled incidents (confirmed threats vs false positives)
- User/entity baseline behavior
- Temporal patterns (day/week/month cycles)

**Performance Metrics**:
- Prediction accuracy: 73-81% (per CPF paper)
- Lead time: 48-72 hours before incident
- False positive reduction: ~40% vs rule-based only

## Usage

### Training

```python
from cpf_risk_model import CPFRiskModel

# Initialize model
model = CPFRiskModel()

# Load training data
model.load_data('siem_events.csv', 'incidents.csv')

# Train model
model.train(epochs=100, validation_split=0.2)

# Save trained model
model.save('cpf_risk_model.pkl')
```

### Inference

```python
# Load trained model
model = CPFRiskModel.load('cpf_risk_model.pkl')

# Predict risk for current events
events = get_recent_events()  # From SIEM
risk_scores = model.predict(events)

# Update CPF indicators
for indicator_id, score in risk_scores.items():
    update_indicator(indicator_id, score)
```

## Feature Engineering

The model uses these feature categories:

### Event Features
- Event frequency (per hour/day/week)
- Severity distribution
- Event type diversity
- Source variety

### Temporal Features
- Time of day patterns
- Day of week patterns
- Trend direction (increasing/decreasing)
- Burst detection

### User/Entity Features
- User privilege level
- Department/role
- Historical behavior baseline
- Deviation from baseline

### Contextual Features
- Geo-location (office/remote/vpn/tor)
- Authentication method (MFA/password)
- Verification attempts
- Related indicators (Bayesian network)

## Model Architecture

```
Input Layer (feature vector)
    ↓
Dense Layer (128 neurons, ReLU)
    ↓
Dropout (0.3)
    ↓
Dense Layer (64 neurons, ReLU)
    ↓
Dropout (0.2)
    ↓
Output Layer (100 neurons, sigmoid)
    ↓
Risk Scores [0-1] for 100 indicators
```

## Integration

### With CPF Adapter
```javascript
// dashboard/simulator/adapters/cpf-adapter.js
const mlScore = await mlModel.predict(events);
const bayesianScore = calculateBayesianScore(events);

// Blend ML + Bayesian
const finalScore = 0.6 * mlScore + 0.4 * bayesianScore;
```

### With SIEM
```python
# Run as scheduled task
@schedule.every(15).minutes
def update_ml_predictions():
    events = fetch_recent_events()
    predictions = model.predict(events)
    push_to_dashboard(predictions)
```

## Retraining

Models should be retrained periodically:

- **Weekly**: Incremental training on new data
- **Monthly**: Full retraining with expanded dataset
- **Quarterly**: Architecture review and hyperparameter tuning

```python
# Incremental retraining
model.partial_fit(new_events, new_labels)
model.save('cpf_risk_model_v2.pkl')
```

## Performance Monitoring

Track model performance over time:

```python
# Evaluate on recent data
metrics = model.evaluate(test_events, test_labels)
print(f"Accuracy: {metrics['accuracy']:.2%}")
print(f"Precision: {metrics['precision']:.2%}")
print(f"Recall: {metrics['recall']:.2%}")
print(f"F1 Score: {metrics['f1']:.2%}")
```

## Planned Enhancements

- **LSTM Networks**: For temporal sequence modeling
- **Graph Neural Networks**: For Bayesian network structure
- **Transfer Learning**: Pre-trained models for common SIEM platforms
- **AutoML**: Automated hyperparameter optimization

## Related Resources

- **Pattern Detectors**: `/src/detectors.py` - Rule-based pattern detection
- **CPF Adapter**: `/dashboard/simulator/adapters/cpf-adapter.js` - Score blending
- **Dense Foundation**: `/foundation docs/core/en-US/` - Mathematical framework
- **Training Data**: Contact for access to labeled CPF dataset
