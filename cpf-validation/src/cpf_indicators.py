# ============================================================================
# File: cpf_indicators.py
# Purpose: CPF Indicator Implementations
# ============================================================================

from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

class CPFIndicator(ABC):
    """Abstract base class for CPF indicators"""
    
    def __init__(self, indicator_id: str, category: str, name: str):
        self.indicator_id = indicator_id
        self.category = category
        self.name = name
        self.threshold_green = 0.3
        self.threshold_yellow = 0.6
        
    @abstractmethod
    def calculate(self, data: pd.DataFrame) -> float:
        """Calculate indicator score from data"""
        pass
    
    def get_risk_level(self, score: float) -> str:
        """Convert score to risk level"""
        if score < self.threshold_green:
            return 'GREEN'
        elif score < self.threshold_yellow:
            return 'YELLOW'
        else:
            return 'RED'
    
    @abstractmethod
    def get_data_requirements(self) -> List[str]:
        """Return list of required data fields"""
        pass

class UnquestioningCompliance(CPFIndicator):
    """Indicator 1.1: Unquestioning compliance with apparent authority"""
    
    def __init__(self):
        super().__init__('1.1', 'Authority', 'Unquestioning Compliance')
        self.threshold_green = 0.05
        self.threshold_yellow = 0.15
    
    def calculate(self, data: pd.DataFrame) -> float:
        """Calculate unquestioning compliance rate"""
        
        if 'compliance_rate' not in data.columns or 'verification_skip_rate' not in data.columns:
            return 0.0
        
        # High compliance with high verification skip indicates unquestioning compliance
        unquestioning = (data['compliance_rate'] > 0.6) & (data['verification_skip_rate'] > 0.6)
        
        return unquestioning.mean()
    
    def get_data_requirements(self) -> List[str]:
        return ['compliance_rate', 'verification_skip_rate']

class PatchProcrastination(CPFIndicator):
    """Indicator 2.4: Present bias in security investments (Patch Procrastination)"""
    
    def __init__(self):
        super().__init__('2.4', 'Temporal', 'Patch Procrastination')
        
    def calculate(self, data: pd.DataFrame) -> float:
        """Calculate patch procrastination index"""
        
        if 'patch_delay_days' not in data.columns:
            return 0.0
        
        # Formula from paper: I_PP = max(0, D - 30) / 10
        procrastination_index = data['patch_delay_days'].apply(
            lambda d: max(0, d - 30) / 10
        )
        
        return procrastination_index.mean()
    
    def get_data_requirements(self) -> List[str]:
        return ['patch_delay_days']

class AlertFatigue(CPFIndicator):
    """Indicator 5.1: Alert fatigue desensitization"""
    
    def __init__(self):
        super().__init__('5.1', 'Cognitive', 'Alert Fatigue')
        self.threshold_green = 0.10
        self.threshold_yellow = 0.25
    
    def calculate(self, data: pd.DataFrame) -> float:
        """Calculate alert dismissal rate"""
        
        if 'alert_dismissal_rate' not in data.columns:
            return 0.0
        
        return data['alert_dismissal_rate'].mean()
    
    def get_data_requirements(self) -> List[str]:
        return ['alert_dismissal_rate']

class DependencyAssumption(CPFIndicator):
    """Indicator 6.6: Dependency group assumptions"""
    
    def __init__(self):
        super().__init__('6.6', 'Group', 'Dependency Assumption')
    
    def calculate(self, data: pd.DataFrame) -> float:
        """Calculate dependency assumption prevalence"""
        
        if 'group_state' not in data.columns:
            return 0.0
        
        dependency_rate = (data['group_state'] == 'baD').mean()
        
        # Also factor in tool overreliance if available
        if 'tool_overreliance' in data.columns:
            overreliance_rate = data['tool_overreliance'].mean()
            return (dependency_rate + overreliance_rate) / 2
        
        return dependency_rate
    
    def get_data_requirements(self) -> List[str]:
        return ['group_state', 'tool_overreliance']

class ConvergenceIndex(CPFIndicator):
    """Indicator 10.1: Perfect storm conditions"""
    
    def __init__(self):
        super().__init__('10.1', 'Convergence', 'Perfect Storm')
        self.threshold_green = 0.2
        self.threshold_yellow = 0.4
    
    def calculate(self, data: pd.DataFrame) -> float:
        """Calculate convergence index"""
        
        if 'convergence_index' in data.columns:
            return data['convergence_index'].mean()
        
        # Calculate from other indicators if not directly available
        critical_factors = 0
        count = 0
        
        checks = [
            ('stress_level', 0.7),
            ('error_rate', 0.3),
            ('compliance_rate', 0.6),
            ('alert_dismissal_rate', 0.5),
            ('patch_delay_days', 60)
        ]
        
        for column, threshold in checks:
            if column in data.columns:
                if column == 'patch_delay_days':
                    critical_factors += (data[column] > threshold).mean()
                else:
                    critical_factors += (data[column] > threshold).mean()
                count += 1
        
        return critical_factors / count if count > 0 else 0.0
    
    def get_data_requirements(self) -> List[str]:
        return ['convergence_index', 'stress_level', 'error_rate', 
                'compliance_rate', 'alert_dismissal_rate']

class CPFIndicatorSet:
    """Manage collection of CPF indicators"""
    
    def __init__(self):
        self.indicators = self._initialize_indicators()
    
    def _initialize_indicators(self) -> Dict[str, CPFIndicator]:
        """Initialize all CPF indicators"""
        
        indicators = {}
        
        # Add representative indicators
        indicators['1.1'] = UnquestioningCompliance()
        indicators['2.4'] = PatchProcrastination()
        indicators['5.1'] = AlertFatigue()
        indicators['6.6'] = DependencyAssumption()
        indicators['10.1'] = ConvergenceIndex()
        
        # Note: In full implementation, add all 100 indicators
        
        return indicators
    
    def calculate_all(self, data: pd.DataFrame) -> Dict[str, Dict]:
        """Calculate all indicator scores"""
        
        results = {}
        
        for indicator_id, indicator in self.indicators.items():
            score = indicator.calculate(data)
            risk_level = indicator.get_risk_level(score)
            
            results[indicator_id] = {
                'name': indicator.name,
                'category': indicator.category,
                'score': score,
                'risk_level': risk_level
            }
        
        return results
    
    def get_category_scores(self, indicator_scores: Dict) -> Dict[str, float]:
        """Aggregate indicators by category"""
        
        category_scores = {}
        category_counts = {}
        
        for indicator_id, scores in indicator_scores.items():
            category = scores['category']
            
            if category not in category_scores:
                category_scores[category] = 0
                category_counts[category] = 0
            
            category_scores[category] += scores['score']
            category_counts[category] += 1
        
        # Calculate averages
        for category in category_scores:
            category_scores[category] /= category_counts[category]
        
        return category_scores

