import pytest
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from bayesian_model import CPFBayesianModel, CPFState

def test_model_initialization():
    """Test that model initializes correctly"""
    model = CPFBayesianModel()
    assert model is not None

def test_prediction():
    """Test basic prediction"""
    model = CPFBayesianModel()
    state = CPFState(*[0.5] * 10)  # All values at 0.5
    result = model.predict_incident_probability(state)
    
    assert 'final_probability' in result
    assert 0 <= result['final_probability'] <= 1
    assert result['risk_level'] in ['MINIMAL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
