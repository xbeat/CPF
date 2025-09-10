# ============================================================================
# File: validation.py
# Purpose: Validation Metrics and Statistical Tests
# ============================================================================

import numpy as np
import pandas as pd
from sklearn.metrics import roc_auc_score, precision_recall_curve, average_precision_score
from sklearn.metrics import confusion_matrix, classification_report
from sklearn.model_selection import cross_val_score, KFold
from scipy import stats
from typing import Dict, Tuple, List
import warnings
warnings.filterwarnings('ignore')

class CPFValidator:
    """Validation metrics for CPF framework"""
    
    def __init__(self, predictions: np.ndarray, 
                 actual: np.ndarray,
                 probabilities: Optional[np.ndarray] = None):
        self.predictions = predictions
        self.actual = actual
        self.probabilities = probabilities if probabilities is not None else predictions
        
    def calculate_auc_roc(self) -> Tuple[float, Tuple[float, float]]:
        """Calculate AUC-ROC with confidence interval"""
        
        auc = roc_auc_score(self.actual, self.probabilities)
        
        # Bootstrap confidence interval
        n_bootstraps = 1000
        rng = np.random.RandomState(42)
        bootstrapped_scores = []
        
        for _ in range(n_bootstraps):
            indices = rng.randint(0, len(self.predictions), len(self.predictions))
            if len(np.unique(self.actual[indices])) < 2:
                continue
            score = roc_auc_score(self.actual[indices], self.probabilities[indices])
            bootstrapped_scores.append(score)
        
        confidence_lower = np.percentile(bootstrapped_scores, 2.5)
        confidence_upper = np.percentile(bootstrapped_scores, 97.5)
        
        return auc, (confidence_lower, confidence_upper)
    
    def calculate_precision_recall(self) -> Dict:
        """Calculate precision-recall metrics"""
        
        precision, recall, thresholds = precision_recall_curve(
            self.actual, self.probabilities
        )
        
        avg_precision = average_precision_score(self.actual, self.probabilities)
        
        return {
            'precision': precision,
            'recall': recall,
            'thresholds': thresholds,
            'average_precision': avg_precision
        }
    
    def calculate_brier_score(self) -> float:
        """Calculate Brier score for probability calibration"""
        
        return np.mean((self.probabilities - self.actual) ** 2)
    
    def calculate_temporal_accuracy(self, 
                                   timestamps: pd.Series,
                                   incident_times: pd.Series,
                                   horizons: List[int] = [7, 14, 30]) -> Dict:
        """Calculate prediction accuracy at different time horizons"""
        
        results = {}
        
        for horizon in horizons:
            # Check if prediction was made within horizon of actual incident
            correct_predictions = 0
            total_predictions = 0
            
            for pred_time, pred_value in zip(timestamps, self.predictions):
                if pred_value > 0.5:  # Predicted incident
                    total_predictions += 1
                    
                    # Check if incident occurred within horizon
                    future_incidents = incident_times[
                        (incident_times > pred_time) & 
                        (incident_times <= pred_time + timedelta(days=horizon))
                    ]
                    
                    if len(future_incidents) > 0:
                        correct_predictions += 1
            
            accuracy = correct_predictions / total_predictions if total_predictions > 0 else 0
            results[f'{horizon}_day_accuracy'] = accuracy
        
        return results
    
    def calculate_convergence_risk_ratio(self, 
                                        convergence_scores: np.ndarray,
                                        percentile: int = 90) -> Tuple[float, Tuple[float, float]]:
        """Calculate relative risk during high convergence states"""
        
        threshold = np.percentile(convergence_scores, percentile)
        
        high_convergence = convergence_scores > threshold
        low_convergence = ~high_convergence
        
        # Calculate incident rates
        high_rate = self.actual[high_convergence].mean()
        low_rate = self.actual[low_convergence].mean()
        
        # Relative risk
        if low_rate > 0:
            risk_ratio = high_rate / low_rate
        else:
            risk_ratio = np.inf
        
        # Confidence interval using log transformation
        if high_rate > 0 and low_rate > 0:
            log_rr = np.log(risk_ratio)
            se_log_rr = np.sqrt(
                (1 - high_rate) / (high_convergence.sum() * high_rate) +
                (1 - low_rate) / (low_convergence.sum() * low_rate)
            )
            
            ci_lower = np.exp(log_rr - 1.96 * se_log_rr)
            ci_upper = np.exp(log_rr + 1.96 * se_log_rr)
        else:
            ci_lower, ci_upper = (risk_ratio, risk_ratio)
        
        return risk_ratio, (ci_lower, ci_upper)
    
    def perform_statistical_tests(self) -> Dict:
        """Perform statistical significance tests"""
        
        results = {}
        
        # Test if predictions are better than random
        # Permutation test
        n_permutations = 1000
        observed_auc = roc_auc_score(self.actual, self.probabilities)
        
        permuted_aucs = []
        rng = np.random.RandomState(42)
        
        for _ in range(n_permutations):
            shuffled = self.actual.copy()
            rng.shuffle(shuffled)
            try:
                permuted_auc = roc_auc_score(shuffled, self.probabilities)
                permuted_aucs.append(permuted_auc)
            except:
                continue
        
        p_value = (np.array(permuted_aucs) >= observed_auc).mean()
        results['permutation_test_p'] = p_value
        
        # Chi-square test for independence
        binary_predictions = (self.probabilities > 0.5).astype(int)
        contingency_table = pd.crosstab(binary_predictions, self.actual)
        chi2, p_chi2, dof, expected = stats.chi2_contingency(contingency_table)
        
        results['chi2_statistic'] = chi2
        results['chi2_p_value'] = p_chi2
        
        return results

