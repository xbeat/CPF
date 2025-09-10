# ============================================================================
# File: test_cpf_framework.py
# Purpose: Unit tests for CPF Framework
# ============================================================================

import pytest
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from bayesian_model import CPFBayesianModel, CPFState
from synthetic_generator import SyntheticOrganization, OrganizationType, GroupState, StressEvent
from cpf_indicators import (
    UnquestioningCompliance, PatchProcrastination, AlertFatigue,
    DependencyAssumption, ConvergenceIndex, CPFIndicatorSet
)
from validation import CPFValidator
from incident_reconstruction import IncidentReconstructor

class TestCPFBayesianModel:
    """Test suite for Bayesian model"""
    
    @pytest.fixture
    def model(self):
        return CPFBayesianModel()
    
    @pytest.fixture
    def sample_state(self):
        return CPFState(
            authority=0.7,
            temporal=0.6,
            social=0.5,
            affective=0.4,
            cognitive=0.8,
            group=0.6,
            stress=0.7,
            unconscious=0.5,
            ai_specific=0.4,
            convergence=0.6
        )
    
    def test_model_initialization(self, model):
        """Test model initializes correctly"""
        assert model is not None
        assert model.model is not None
        assert model.inference is not None
        assert len(model.calibration_params) > 0
    
    def test_predict_incident_probability(self, model, sample_state):
        """Test incident probability prediction"""
        result = model.predict_incident_probability(sample_state)
        
        assert 'final_probability' in result
        assert 'risk_level' in result
        assert 'contributing_factors' in result
        
        assert 0 <= result['final_probability'] <= 1
        assert result['risk_level'] in ['MINIMAL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
        assert len(result['contributing_factors']) == 3  # Top 3 factors
    
    def test_convergence_risk_calculation(self, model):
        """Test convergence risk multiplier"""
        # Low convergence state
        low_state = CPFState(*[0.3] * 10)
        low_result = model.predict_incident_probability(low_state)
        
        # High convergence state
        high_state = CPFState(*[0.9] * 10)
        high_result = model.predict_incident_probability(high_state)
        
        # High convergence should have higher multiplier
        assert high_result['convergence_multiplier'] > low_result['convergence_multiplier']
        assert high_result['convergence_multiplier'] >= 6.0  # Critical convergence
    
    def test_state_to_evidence_conversion(self, model, sample_state):
        """Test conversion of continuous state to discrete evidence"""
        evidence = model._state_to_evidence(sample_state)
        
        assert isinstance(evidence, dict)
        assert 'authority_gradient' in evidence
        assert 'temporal_stress' in evidence
        assert 'cognitive_load' in evidence
        
        # Check discretization
        assert evidence['authority_gradient'] in [0, 1]
        assert evidence['temporal_stress'] in [0, 1, 2]

class TestSyntheticOrganization:
    """Test suite for synthetic data generation"""
    
    @pytest.fixture
    def org(self):
        return SyntheticOrganization(
            OrganizationType.TECHNOLOGY,
            size=100,
            duration_days=30,
            seed=42
        )
    
    def test_organization_initialization(self, org):
        """Test organization initializes with correct parameters"""
        assert org.org_type == OrganizationType.TECHNOLOGY
        assert org.size == 100
        assert org.duration_days == 30
        assert org.baseline_stress > 0
    
    def test_stress_event_generation(self, org):
        """Test stress events are generated"""
        assert len(org.stress_events) > 0
        
        for event in org.stress_events:
            assert isinstance(event, StressEvent)
            assert 0 < event.intensity <= 1
            assert event.duration_days > 0
    
    def test_daily_stress_calculation(self, org):
        """Test daily stress calculation"""
        test_date = org.start_date + timedelta(days=15)
        stress = org._calculate_daily_stress(test_date)
        
        assert 0 <= stress <= 1
        assert stress >= org.baseline_stress  # Should be at least baseline
    
    def test_group_state_transitions(self, org):
        """Test Bion's group state transitions"""
        # Low anxiety - should tend toward work
        new_state = org._update_group_state(0.3)
        assert new_state in [GroupState.WORK, GroupState.DEPENDENCY, 
                             GroupState.FIGHT_FLIGHT, GroupState.PAIRING]
        
        # High anxiety - should shift to basic assumptions
        high_anxiety_states = []
        for _ in range(100):
            state = org._update_group_state(0.9)
            high_anxiety_states.append(state)
        
        # Most should be basic assumptions, not work
        work_count = sum(1 for s in high_anxiety_states if s == GroupState.WORK)
        assert work_count < 30  # Less than 30% should be work state
    
    def test_dataset_generation(self, org):
        """Test complete dataset generation"""
        df = org.generate_dataset()
        
        assert isinstance(df, pd.DataFrame)
        assert len(df) == org.duration_days + 1  # Include start and end date
        
        # Check required columns exist
        required_columns = [
            'date', 'stress_level', 'group_state', 'compliance_rate',
            'error_rate', 'security_incident', 'convergence_index'
        ]
        for col in required_columns:
            assert col in df.columns
        
        # Check value ranges
        assert df['stress_level'].between(0, 1).all()
        assert df['compliance_rate'].between(0, 1).all()
        assert df['error_rate'].between(0, 1).all()
    
    def test_incident_generation(self, org):
        """Test security incidents are generated appropriately"""
        df = org.generate_dataset()
        
        incident_rate = df['security_incident'].mean()
        assert 0 < incident_rate < 0.5  # Should have some but not too many
        
        # High convergence should correlate with incidents
        high_convergence = df[df['convergence_index'] > 0.6]
        if len(high_convergence) > 0:
            high_conv_incident_rate = high_convergence['security_incident'].mean()
            assert high_conv_incident_rate > incident_rate  # Should be higher

class TestCPFIndicators:
    """Test suite for CPF indicators"""
    
    @pytest.fixture
    def sample_data(self):
        """Generate sample data for testing"""
        n = 100
        return pd.DataFrame({
            'compliance_rate': np.random.beta(6, 4, n),
            'verification_skip_rate': np.random.beta(5, 5, n),
            'patch_delay_days': np.random.poisson(35, n),
            'alert_dismissal_rate': np.random.beta(3, 7, n),
            'group_state': np.random.choice(['work', 'baD', 'baF', 'baP'], n),
            'tool_overreliance': np.random.beta(4, 6, n),
            'stress_level': np.random.beta(6, 4, n),
            'error_rate': np.random.beta(2, 8, n),
            'convergence_index': np.random.beta(3, 7, n)
        })
    
    def test_unquestioning_compliance(self, sample_data):
        """Test unquestioning compliance indicator"""
        indicator = UnquestioningCompliance()
        score = indicator.calculate(sample_data)
        
        assert 0 <= score <= 1
        risk_level = indicator.get_risk_level(score)
        assert risk_level in ['GREEN', 'YELLOW', 'RED']
    
    def test_patch_procrastination(self, sample_data):
        """Test patch procrastination indicator"""
        indicator = PatchProcrastination()
        score = indicator.calculate(sample_data)
        
        assert score >= 0  # Can be > 1 for very long delays
        
        # Test formula: I_PP = max(0, D - 30) / 10
        test_data = pd.DataFrame({'patch_delay_days': [20, 30, 40, 50]})
        test_score = indicator.calculate(test_data)
        expected = (0 + 0 + 1 + 2) / 4  # (0 + 0 + 10/10 + 20/10) / 4
        assert abs(test_score - expected) < 0.01
    
    def test_alert_fatigue(self, sample_data):
        """Test alert fatigue indicator"""
        indicator = AlertFatigue()
        score = indicator.calculate(sample_data)
        
        assert 0 <= score <= 1
        assert score == sample_data['alert_dismissal_rate'].mean()
    
    def test_dependency_assumption(self, sample_data):
        """Test dependency assumption indicator"""
        indicator = DependencyAssumption()
        score = indicator.calculate(sample_data)
        
        assert 0 <= score <= 1
    
    def test_convergence_index(self, sample_data):
        """Test convergence index indicator"""
        indicator = ConvergenceIndex()
        score = indicator.calculate(sample_data)
        
        assert 0 <= score <= 1
    
    def test_indicator_set(self, sample_data):
        """Test complete indicator set"""
        indicator_set = CPFIndicatorSet()
        results = indicator_set.calculate_all(sample_data)
        
        assert len(results) >= 5  # At least 5 indicators
        
        for indicator_id, result in results.items():
            assert 'score' in result
            assert 'risk_level' in result
            assert 'category' in result
            assert result['risk_level'] in ['GREEN', 'YELLOW', 'RED']
        
        # Test category aggregation
        category_scores = indicator_set.get_category_scores(results)
        assert len(category_scores) > 0
        for score in category_scores.values():
            assert 0 <= score <= 1

class TestValidation:
    """Test suite for validation metrics"""
    
    @pytest.fixture
    def sample_predictions(self):
        """Generate sample predictions and actuals"""
        np.random.seed(42)
        n = 1000
        
        # Generate correlated predictions and actuals
        probabilities = np.random.beta(2, 5, n)
        actuals = (probabilities + np.random.normal(0, 0.2, n) > 0.4).astype(int)
        
        return probabilities, actuals
    
    def test_auc_roc_calculation(self, sample_predictions):
        """Test AUC-ROC calculation with confidence intervals"""
        probs, actuals = sample_predictions
        validator = CPFValidator(probs, actuals, probs)
        
        auc, ci = validator.calculate_auc_roc()
        
        assert 0 <= auc <= 1
        assert ci[0] <= auc <= ci[1]
        assert ci[1] - ci[0] < 0.2  # Reasonable CI width
    
    def test_precision_recall(self, sample_predictions):
        """Test precision-recall calculation"""
        probs, actuals = sample_predictions
        validator = CPFValidator(probs, actuals, probs)
        
        pr_metrics = validator.calculate_precision_recall()
        
        assert 'precision' in pr_metrics
        assert 'recall' in pr_metrics
        assert 'average_precision' in pr_metrics
        
        assert 0 <= pr_metrics['average_precision'] <= 1
    
    def test_brier_score(self, sample_predictions):
        """Test Brier score calculation"""
        probs, actuals = sample_predictions
        validator = CPFValidator(probs, actuals, probs)
        
        brier = validator.calculate_brier_score()
        
        assert 0 <= brier <= 1
        
        # Perfect predictions should have Brier score of 0
        perfect_probs = actuals.astype(float)
        perfect_validator = CPFValidator(perfect_probs, actuals, perfect_probs)
        perfect_brier = perfect_validator.calculate_brier_score()
        assert perfect_brier < 0.01
    
    def test_convergence_risk_ratio(self, sample_predictions):
        """Test convergence risk ratio calculation"""
        probs, actuals = sample_predictions
        validator = CPFValidator(probs, actuals, probs)
        
        # Generate convergence scores
        convergence_scores = np.random.beta(3, 7, len(actuals))
        
        rr, ci = validator.calculate_convergence_risk_ratio(convergence_scores)
        
        assert rr > 0
        assert ci[0] <= rr <= ci[1]
    
    def test_statistical_tests(self, sample_predictions):
        """Test statistical significance tests"""
        probs, actuals = sample_predictions
        validator = CPFValidator(probs, actuals, probs)
        
        stats = validator.perform_statistical_tests()
        
        assert 'permutation_test_p' in stats
        assert 'chi2_statistic' in stats
        assert 'chi2_p_value' in stats
        
        assert 0 <= stats['permutation_test_p'] <= 1
        assert 0 <= stats['chi2_p_value'] <= 1

class TestIncidentReconstruction:
    """Test suite for incident reconstruction"""
    
    @pytest.fixture
    def reconstructor(self):
        model = CPFBayesianModel()
        return IncidentReconstructor(model)
    
    def test_known_incidents_loaded(self, reconstructor):
        """Test that known incidents are loaded"""
        assert len(reconstructor.known_incidents) > 0
        assert 'solarwinds' in reconstructor.known_incidents
        assert 'colonial_pipeline' in reconstructor.known_incidents
    
    def test_incident_reconstruction(self, reconstructor):
        """Test reconstruction of a known incident"""
        result = reconstructor.reconstruct_incident('solarwinds', lookback_days=14)
        
        assert 'incident' in result
        assert 'actual_date' in result
        assert 'predicted_high_risk_dates' in result
        assert 'prediction_hit' in result
        assert 'peak_probability' in result
        
        assert isinstance(result['prediction_hit'], bool)
        assert 0 <= result['peak_probability'] <= 1
    
    def test_all_incidents_validation(self, reconstructor):
        """Test validation of all known incidents"""
        df = reconstructor.validate_all_incidents()
        
        assert isinstance(df, pd.DataFrame)
        assert len(df) == len(reconstructor.known_incidents)
        assert 'Hit' in df.columns
        
        # Should have at least some hits
        hits = df['Hit'].str.contains('✓').sum()
        assert hits > 0
