#!/usr/bin/env python3
"""
CPF Synthetic Data Generator for Pilot Validation
Generates realistic organizational data for testing CPF implementation
"""

import numpy as np
import pandas as pd
import random
from datetime import datetime, timedelta
import json
from dataclasses import dataclass
from typing import Dict, List, Tuple
import matplotlib.pyplot as plt
import seaborn as sns

@dataclass
class OrganizationProfile:
    """Defines organizational characteristics that influence psychological patterns"""
    size: int  # Number of employees
    industry: str  # Tech, Finance, Healthcare, etc.
    culture_type: str  # Hierarchical, Collaborative, Competitive
    stress_baseline: float  # 0-1 baseline stress level
    authority_gradient: float  # 0-1 how steep authority differences are
    change_resistance: float  # 0-1 resistance to new processes

class CPFSyntheticGenerator:
    def __init__(self, org_profile: OrganizationProfile, days: int = 90):
        self.org = org_profile
        self.days = days
        self.start_date = datetime.now() - timedelta(days=days)
        
        # Initialize psychological state baselines based on org profile
        self.baselines = self._initialize_baselines()
        
        # Correlation matrix for psychological indicators
        self.correlation_matrix = self._build_correlation_matrix()
        
        # Event probabilities (security incidents)
        self.incident_base_rate = 0.02  # 2% daily incident probability
        
    def _initialize_baselines(self) -> Dict[str, float]:
        """Initialize baseline psychological states based on organization profile"""
        baselines = {}
        
        # Category 1: Authority-Based Vulnerabilities
        baselines['authority_compliance'] = 0.3 + 0.4 * self.org.authority_gradient
        baselines['authority_bypass'] = 0.1 + 0.2 * (1 - self.org.authority_gradient)
        
        # Category 2: Temporal Vulnerabilities  
        baselines['urgency_bypass'] = 0.15 + 0.3 * self.org.stress_baseline
        baselines['deadline_pressure'] = 0.2 + 0.4 * self.org.stress_baseline
        
        # Category 3: Social Influence
        culture_multiplier = {'Hierarchical': 0.8, 'Collaborative': 1.2, 'Competitive': 1.5}
        baselines['social_proof'] = 0.25 * culture_multiplier.get(self.org.culture_type, 1.0)
        
        # Category 4: Affective States
        baselines['fear_paralysis'] = 0.1 + 0.3 * self.org.stress_baseline
        baselines['trust_levels'] = 0.7 - 0.2 * self.org.stress_baseline
        
        # Category 5: Cognitive Load
        baselines['alert_fatigue'] = min(0.8, 0.1 + 0.002 * self.org.size)  # Scales with org size
        baselines['decision_fatigue'] = 0.15 + 0.25 * self.org.stress_baseline
        
        return baselines
    
    def _build_correlation_matrix(self) -> np.ndarray:
        """Build correlation matrix between psychological indicators"""
        # Simplified 10x10 matrix for category-level correlations
        # In reality, this would be 100x100 for all indicators
        correlations = np.array([
            [1.0, 0.3, 0.4, 0.2, 0.1, 0.5, 0.3, 0.2, 0.1, 0.6],  # Authority
            [0.3, 1.0, 0.2, 0.4, 0.7, 0.3, 0.8, 0.2, 0.1, 0.5],  # Temporal
            [0.4, 0.2, 1.0, 0.3, 0.2, 0.6, 0.1, 0.3, 0.2, 0.4],  # Social
            [0.2, 0.4, 0.3, 1.0, 0.5, 0.4, 0.6, 0.4, 0.2, 0.5],  # Affective
            [0.1, 0.7, 0.2, 0.5, 1.0, 0.3, 0.7, 0.2, 0.3, 0.6],  # Cognitive
            [0.5, 0.3, 0.6, 0.4, 0.3, 1.0, 0.4, 0.5, 0.2, 0.7],  # Group
            [0.3, 0.8, 0.1, 0.6, 0.7, 0.4, 1.0, 0.3, 0.2, 0.6],  # Stress
            [0.2, 0.2, 0.3, 0.4, 0.2, 0.5, 0.3, 1.0, 0.1, 0.4],  # Unconscious
            [0.1, 0.1, 0.2, 0.2, 0.3, 0.2, 0.2, 0.1, 1.0, 0.3],  # AI
            [0.6, 0.5, 0.4, 0.5, 0.6, 0.7, 0.6, 0.4, 0.3, 1.0]   # Convergent
        ])
        return correlations
    
    def generate_daily_states(self, day: int) -> Dict[str, float]:
        """Generate daily psychological vulnerability states"""
        
        # Base weekly and daily cycles
        day_of_week = day % 7
        week_factor = 1.0 + 0.3 * np.sin(2 * np.pi * day_of_week / 7)  # Monday stress peak
        
        # Simulate external stressors (quarterly deadlines, incidents, etc.)
        external_stress = self._calculate_external_stress(day)
        
        states = {}
        
        # Generate correlated states using multivariate normal
        random_factors = np.random.multivariate_normal(
            mean=np.zeros(10), 
            cov=self.correlation_matrix * 0.1
        )
        
        # Category 1: Authority-Based (indicators 1.1-1.10)
        authority_base = self.baselines['authority_compliance']
        states['authority_compliance'] = np.clip(
            authority_base * week_factor + random_factors[0], 0, 1
        )
        
        # Category 2: Temporal (indicators 2.1-2.10) 
        temporal_base = self.baselines['urgency_bypass']
        states['urgency_bypass'] = np.clip(
            temporal_base * (1 + external_stress) + random_factors[1], 0, 1
        )
        
        # Category 3: Social Influence (indicators 3.1-3.10)
        social_base = self.baselines['social_proof']
        states['social_influence'] = np.clip(
            social_base + random_factors[2], 0, 1
        )
        
        # Category 4: Affective (indicators 4.1-4.10)
        affective_base = self.baselines['fear_paralysis']
        states['affective_vuln'] = np.clip(
            affective_base * (1 + 0.5 * external_stress) + random_factors[3], 0, 1
        )
        
        # Category 5: Cognitive Load (indicators 5.1-5.10)
        cognitive_base = self.baselines['alert_fatigue']
        states['cognitive_load'] = np.clip(
            cognitive_base * week_factor + random_factors[4], 0, 1
        )
        
        # Calculate convergent state (Category 10)
        convergent_factors = [
            states['authority_compliance'],
            states['urgency_bypass'], 
            states['affective_vuln'],
            states['cognitive_load']
        ]
        states['convergent_risk'] = np.mean(convergent_factors) + random_factors[9] * 0.1
        states['convergent_risk'] = np.clip(states['convergent_risk'], 0, 1)
        
        return states
    
    def _calculate_external_stress(self, day: int) -> float:
        """Calculate external stress factors affecting the organization"""
        stress = 0.0
        
        # Quarterly pressure (fiscal calendar)
        quarter_progress = (day % 90) / 90
        if quarter_progress > 0.8:  # Last 20% of quarter
            stress += 0.4
            
        # Simulated external events
        if day % 30 == 15:  # Monthly compliance deadline
            stress += 0.2
            
        # Random crisis events (5% probability per day)
        if random.random() < 0.05:
            stress += 0.6
            
        return min(stress, 1.0)
    
    def generate_security_incidents(self, daily_states: List[Dict]) -> List[bool]:
        """Generate security incidents based on psychological vulnerability states"""
        incidents = []
        
        for states in daily_states:
            # Calculate incident probability based on convergent risk
            base_prob = self.incident_base_rate
            risk_multiplier = 1 + 3 * states['convergent_risk']  # Up to 4x base rate
            
            # Add specific vulnerability contributions
            authority_risk = states['authority_compliance'] * 0.5
            temporal_risk = states['urgency_bypass'] * 0.7
            cognitive_risk = states['cognitive_load'] * 0.4
            
            incident_prob = base_prob * risk_multiplier * (1 + authority_risk + temporal_risk + cognitive_risk)
            incident_prob = min(incident_prob, 0.3)  # Cap at 30% daily probability
            
            incident_occurred = random.random() < incident_prob
            incidents.append(incident_occurred)
            
        return incidents
    
    def generate_pilot_dataset(self) -> pd.DataFrame:
        """Generate complete pilot dataset for CPF validation"""
        
        daily_data = []
        
        for day in range(self.days):
            date = self.start_date + timedelta(days=day)
            states = self.generate_daily_states(day)
            
            daily_record = {
                'date': date,
                'day': day,
                'day_of_week': day % 7,
                **states
            }
            daily_data.append(daily_record)
        
        # Create DataFrame
        df = pd.DataFrame(daily_data)
        
        # Generate incidents based on psychological states
        incidents = self.generate_security_incidents(daily_data)
        df['security_incident'] = incidents
        
        # Add lagged features (psychological states often precede incidents by 1-3 days)
        for col in ['authority_compliance', 'urgency_bypass', 'cognitive_load', 'convergent_risk']:
            df[f'{col}_lag1'] = df[col].shift(1)
            df[f'{col}_lag3'] = df[col].shift(3)
        
        return df
    
    def analyze_correlations(self, df: pd.DataFrame) -> Dict[str, float]:
        """Analyze correlations between psychological states and security incidents"""
        
        correlations = {}
        
        psych_cols = ['authority_compliance', 'urgency_bypass', 'affective_vuln', 
                     'cognitive_load', 'convergent_risk']
        
        for col in psych_cols:
            # Current day correlation
            corr = df[col].corr(df['security_incident'].astype(int))
            correlations[f'{col}_same_day'] = corr
            
            # Lagged correlations (if columns exist)
            if f'{col}_lag1' in df.columns:
                corr_lag1 = df[f'{col}_lag1'].corr(df['security_incident'].astype(int))
                correlations[f'{col}_lag1'] = corr_lag1
                
        return correlations

def run_synthetic_pilot():
    """Run complete synthetic pilot study"""
    
    # Define test organization profiles
    orgs = [
        OrganizationProfile(500, "Tech", "Collaborative", 0.3, 0.2, 0.4),
        OrganizationProfile(2000, "Finance", "Hierarchical", 0.6, 0.8, 0.7),
        OrganizationProfile(1000, "Healthcare", "Hierarchical", 0.5, 0.6, 0.8)
    ]
    
    results = {}
    
    for i, org in enumerate(orgs):
        print(f"\nGenerating data for Organization {i+1}: {org.industry}")
        
        generator = CPFSyntheticGenerator(org, days=180)  # 6 months
        df = generator.generate_pilot_dataset()
        
        # Calculate statistics
        incident_rate = df['security_incident'].mean()
        correlations = generator.analyze_correlations(df)
        
        results[f'org_{i+1}'] = {
            'profile': org,
            'incident_rate': incident_rate,
            'correlations': correlations,
            'data': df
        }
        
        print(f"  Incident rate: {incident_rate:.3f}")
        print(f"  Convergent risk correlation: {correlations.get('convergent_risk_same_day', 0):.3f}")
        
        # Visualization
        plt.figure(figsize=(12, 8))
        
        plt.subplot(2, 2, 1)
        plt.plot(df['convergent_risk'], alpha=0.7)
        plt.title('Convergent Risk Over Time')
        plt.ylabel('Risk Level')
        
        plt.subplot(2, 2, 2)
        incident_cumsum = df['security_incident'].cumsum()
        plt.plot(incident_cumsum)
        plt.title('Cumulative Security Incidents')
        plt.ylabel('Total Incidents')
        
        plt.subplot(2, 2, 3)
        plt.scatter(df['convergent_risk'], df['security_incident'], alpha=0.6)
        plt.xlabel('Convergent Risk')
        plt.ylabel('Security Incident')
        plt.title('Risk vs Incidents')
        
        plt.subplot(2, 2, 4)
        # Show correlation heatmap
        corr_matrix = df[['authority_compliance', 'urgency_bypass', 'cognitive_load', 
                         'convergent_risk', 'security_incident']].corr()
        sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', center=0)
        plt.title('Correlation Matrix')
        
        plt.tight_layout()
        plt.savefig(f'cpf_synthetic_org_{i+1}.png', dpi=300, bbox_inches='tight')
        plt.show()
    
    return results

if __name__ == "__main__":
    # Run the synthetic pilot study
    results = run_synthetic_pilot()
    
    # Generate summary report
    print("\n" + "="*50)
    print("CPF SYNTHETIC PILOT STUDY SUMMARY")
    print("="*50)
    
    for org_id, data in results.items():
        print(f"\n{org_id.upper()} ({data['profile'].industry}):")
        print(f"  Base incident rate: {data['incident_rate']:.1%}")
        print(f"  Authority correlation: {data['correlations'].get('authority_compliance_same_day', 0):.3f}")
        print(f"  Temporal correlation: {data['correlations'].get('urgency_bypass_lag1', 0):.3f}")
        print(f"  Convergent correlation: {data['correlations'].get('convergent_risk_same_day', 0):.3f}")
