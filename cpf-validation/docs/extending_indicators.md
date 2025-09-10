# Extending CPF Indicators

## Adding New Indicators

To add a new CPF indicator, follow these steps:

### 1. Create Indicator Class

```python
from cpf_indicators import CPFIndicator

class YourNewIndicator(CPFIndicator):
    def __init__(self):
        super().__init__(
            indicator_id='X.Y',  # Category.Number
            category='CategoryName',
            name='Indicator Name'
        )
        self.threshold_green = 0.3
        self.threshold_yellow = 0.6
    
    def calculate(self, data: pd.DataFrame) -> float:
        # Your calculation logic
        return calculated_score
    
    def get_data_requirements(self) -> List[str]:
        return ['field1', 'field2']
```

### 2. Calibrate from Literature

Find psychological research supporting your indicator and extract quantitative parameters.

### 3. Add to Indicator Set

Register your indicator in `CPFIndicatorSet._initialize_indicators()`.

### 4. Test

Create unit tests in `test_cpf_framework.py`.

## Example: Adding "Password Fatigue" Indicator

```python
class PasswordFatigue(CPFIndicator):
    """Indicator 5.8: Password change fatigue"""
    
    def __init__(self):
        super().__init__('5.8', 'Cognitive', 'Password Fatigue')
        self.threshold_green = 0.15
        self.threshold_yellow = 0.30
    
    def calculate(self, data: pd.DataFrame) -> float:
        if 'password_resets' not in data.columns:
            return 0.0
        
        # High reset rate indicates fatigue
        reset_rate = data['password_resets'].mean()
        
        # Normalize to 0-1 scale
        return min(reset_rate / 10, 1.0)
    
    def get_data_requirements(self) -> List[str]:
        return ['password_resets']
```
