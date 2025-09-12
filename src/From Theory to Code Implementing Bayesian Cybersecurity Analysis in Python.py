import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from transformers import pipeline

class AuthorityVulnerabilityDetector:
    def __init__(self):
        self.sentiment_analyzer = pipeline("sentiment-analysis")
        self.anomaly_detector = IsolationForest(contamination=0.1)
        
    def analyze_communication_patterns(self, emails_df):
        """Detect authority-based manipulation patterns"""
        
        # Extract authority signals
        authority_signals = []
        for email in emails_df['content']:
            signals = {
                'urgent_keywords': len([w for w in ['urgent', 'immediate', 'asap'] 
                                       if w.lower() in email.lower()]),
                'authority_appeals': len([w for w in ['ceo', 'director', 'urgent request'] 
                                         if w.lower() in email.lower()]),
                'compliance_pressure': self.sentiment_analyzer(email)[0]['score']
            }
            authority_signals.append(signals)
            
        return pd.DataFrame(authority_signals)
    
    def calculate_authority_risk(self, signals_df):
        """Calculate authority-based vulnerability score"""
        
        # Normalize signals
        normalized = (signals_df - signals_df.mean()) / signals_df.std()
        
        # Detect anomalies
        anomalies = self.anomaly_detector.fit_predict(normalized)
        
        # Calculate risk score (0-2 scale: Green/Yellow/Red)
        risk_scores = []
        for i, anomaly in enumerate(anomalies):
            base_score = normalized.iloc[i].mean()
            if anomaly == -1:  # Anomaly detected
                score = min(2, max(1, abs(base_score)))
            else:
                score = 0 if abs(base_score) < 0.5 else 1
            risk_scores.append(score)
            
        return np.array(risk_scores)

import pgmpy
from pgmpy.models import BayesianNetwork
from pgmpy.factors.discrete import TabularCPD
from pgmpy.inference import VariableElimination

class CPFBayesianModel:
    def __init__(self):
        # Define the network structure
        self.model = BayesianNetwork([
            ('Authority', 'Breach_Risk'),
            ('Temporal', 'Breach_Risk'),
            ('Social', 'Breach_Risk'),
            ('Stress', 'Breach_Risk'),
            ('Cognitive_Load', 'Breach_Risk')
        ])
        
        # Define CPDs (Conditional Probability Distributions)
        self.setup_cpds()
        
    def setup_cpds(self):
        """Setup conditional probability distributions based on research"""
        
        # Authority CPD (based on Milgram studies)
        authority_cpd = TabularCPD(
            variable='Authority',
            variable_card=3,  # 0=Green, 1=Yellow, 2=Red
            values=[[0.6], [0.3], [0.1]]  # Base rates from organizational studies
        )
        
        # Breach Risk CPD (complex interactions)
        breach_cpd = TabularCPD(
            variable='Breach_Risk',
            variable_card=3,
            values=[
                # Low risk when all factors are green
                [0.9, 0.7, 0.5, 0.3, 0.2, 0.1, 0.05, 0.02, 0.01],
                # Medium risk
                [0.08, 0.2, 0.3, 0.4, 0.3, 0.2, 0.15, 0.08, 0.04],
                # High risk when multiple factors converge
                [0.02, 0.1, 0.2, 0.3, 0.5, 0.7, 0.8, 0.9, 0.95]
            ],
            evidence=['Authority', 'Temporal', 'Social'],
            evidence_card=[3, 3, 3]
        )
        
        self.model.add_cpds(authority_cpd, breach_cpd)
        
    def predict_breach_probability(self, evidence):
        """Predict breach probability given current psychological state"""
        
        inference = VariableElimination(self.model)
        probability = inference.query(
            variables=['Breach_Risk'],
            evidence=evidence
        )
        
        return probability.values

import dash
from dash import dcc, html
import plotly.graph_objs as go
import plotly.express as px

class CPFDashboard:
    def __init__(self, cpf_model):
        self.cpf_model = cpf_model
        self.app = dash.Dash(__name__)
        self.setup_layout()
        
    def setup_layout(self):
        self.app.layout = html.Div([
            html.H1("CPF Cybersecurity Psychology Dashboard"),
            
            # Current risk level
            html.Div([
                html.H3("Current Organization Risk Level"),
                dcc.Graph(id='risk-gauge')
            ]),
            
            # Category breakdown
            html.Div([
                html.H3("Vulnerability Categories"),
                dcc.Graph(id='category-radar')
            ]),
            
            # Convergence probability
            html.Div([
                html.H3("Convergence Risk Over Time"),
                dcc.Graph(id='convergence-timeline')
            ]),
            
            # Auto-refresh every 5 minutes
            dcc.Interval(
                id='interval-component',
                interval=5*60*1000,  # 5 minutes in milliseconds
                n_intervals=0
            )
        ])
        
    def create_risk_gauge(self, current_risk):
        fig = go.Figure(go.Indicator(
            mode = "gauge+number+delta",
            value = current_risk,
            domain = {'x': [0, 1], 'y': [0, 1]},
            title = {'text': "Overall CPF Risk Score"},
            delta = {'reference': 1.0},
            gauge = {
                'axis': {'range': [None, 2]},
                'bar': {'color': "darkblue"},
                'steps': [
                    {'range': [0, 0.7], 'color': "lightgreen"},
                    {'range': [0.7, 1.3], 'color': "yellow"},
                    {'range': [1.3, 2], 'color': "red"}
                ],
                'threshold': {
                    'line': {'color': "red", 'width': 4},
                    'thickness': 0.75,
                    'value': 1.5
                }
            }
        ))
        
        return fig

class PrivacyPreservingCPF:
    def __init__(self, epsilon=0.1):
        self.epsilon = epsilon  # Differential privacy parameter
        
    def add_noise(self, data):
        """Add differential privacy noise"""
        noise = np.random.laplace(0, 1/self.epsilon, data.shape)
        return data + noise
        
    def aggregate_analysis(self, individual_data, min_group_size=10):
        """Only analyze groups, never individuals"""
        
        if len(individual_data) < min_group_size:
            raise ValueError(f"Minimum group size is {min_group_size}")
            
        # Aggregate to department/team level
        aggregated = individual_data.groupby('department').mean()
        
        # Add privacy noise
        noisy_aggregated = self.add_noise(aggregated)
        
        return noisy_aggregated