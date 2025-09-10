# ============================================================================
# File: synthetic_generator.py
# Purpose: Generate Synthetic Organizational Data
# ============================================================================

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from enum import Enum
import random
from scipy import stats

class OrganizationType(Enum):
    FINANCIAL = "financial"
    HEALTHCARE = "healthcare"
    TECHNOLOGY = "technology"
    GOVERNMENT = "government"
    EDUCATION = "education"
    MANUFACTURING = "manufacturing"

class GroupState(Enum):
    WORK = "work"
    DEPENDENCY = "baD"
    FIGHT_FLIGHT = "baF"
    PAIRING = "baP"

class StressEvent:
    """Represents a stress-inducing event in the organization"""
    
    def __init__(self, event_type: str, intensity: float, 
                 start_date: datetime, duration_days: int):
        self.event_type = event_type
        self.intensity = intensity
        self.start_date = start_date
        self.duration_days = duration_days
        self.end_date = start_date + timedelta(days=duration_days)
    
    def get_stress_at_time(self, current_date: datetime, 
                           recovery_rate: float = 0.1) -> float:
        """Calculate stress contribution at a given time"""
        
        if current_date < self.start_date:
            return 0.0
        elif current_date <= self.end_date:
            # During event: full intensity
            return self.intensity
        else:
            # After event: exponential decay
            days_since_end = (current_date - self.end_date).days
            return self.intensity * np.exp(-recovery_rate * days_since_end)

class SyntheticOrganization:
    """Generate synthetic organizational data calibrated on psychological research"""
    
    def __init__(self, org_type: OrganizationType, 
                 size: int = 1000,
                 start_date: datetime = datetime(2024, 1, 1),
                 duration_days: int = 180,
                 seed: Optional[int] = None):
        
        if seed:
            np.random.seed(seed)
            random.seed(seed)
        
        self.org_type = org_type
        self.size = size
        self.start_date = start_date
        self.duration_days = duration_days
        self.end_date = start_date + timedelta(days=duration_days)
        
        # Organization-specific parameters
        self.profile = self._get_org_profile()
        
        # Initialize organizational state
        self.hierarchy_levels = self.profile['hierarchy_levels']
        self.baseline_stress = self.profile['baseline_stress']
        self.compliance_culture = self.profile['compliance_culture']
        self.tech_maturity = self.profile['tech_maturity']
        
        # Generate stress events
        self.stress_events = self._generate_stress_events()
        
        # Initialize group state
        self.group_state = GroupState.WORK
        self.group_state_history = []
        
        # Storage for generated data
        self.daily_data = []
        
    def _get_org_profile(self) -> Dict:
        """Get organization-specific profile parameters"""
        
        profiles = {
            OrganizationType.FINANCIAL: {
                'hierarchy_levels': 7,
                'baseline_stress': 0.65,
                'compliance_culture': 0.8,
                'tech_maturity': 0.7,
                'deadline_frequency': 0.25,  # Quarterly pressures
                'authority_strength': 0.75,
                'innovation_pressure': 0.5,
                'regulatory_burden': 0.9
            },
            OrganizationType.HEALTHCARE: {
                'hierarchy_levels': 5,
                'baseline_stress': 0.75,
                'compliance_culture': 0.85,
                'tech_maturity': 0.5,
                'deadline_frequency': 0.1,
                'authority_strength': 0.85,  # Strong hierarchy
                'innovation_pressure': 0.3,
                'regulatory_burden': 0.95
            },
            OrganizationType.TECHNOLOGY: {
                'hierarchy_levels': 3,
                'baseline_stress': 0.7,
                'compliance_culture': 0.4,
                'tech_maturity': 0.95,
                'deadline_frequency': 0.5,  # Frequent releases
                'authority_strength': 0.3,
                'innovation_pressure': 0.9,
                'regulatory_burden': 0.3
            },
            OrganizationType.GOVERNMENT: {
                'hierarchy_levels': 8,
                'baseline_stress': 0.5,
                'compliance_culture': 0.9,
                'tech_maturity': 0.4,
                'deadline_frequency': 0.15,
                'authority_strength': 0.9,
                'innovation_pressure': 0.2,
                'regulatory_burden': 0.7
            }
        }
        
        return profiles.get(self.org_type, profiles[OrganizationType.TECHNOLOGY])
    
    def _generate_stress_events(self) -> List[StressEvent]:
        """Generate realistic stress events over the time period"""
        
        events = []
        current_date = self.start_date
        
        # Regular deadlines (monthly, quarterly, etc.)
        deadline_interval = int(30 / self.profile['deadline_frequency']) if self.profile['deadline_frequency'] > 0 else 90
        
        while current_date < self.end_date:
            # Project deadline
            if random.random() < self.profile['deadline_frequency']:
                events.append(StressEvent(
                    event_type='project_deadline',
                    intensity=random.uniform(0.6, 0.9),
                    start_date=current_date,
                    duration_days=random.randint(3, 10)
                ))
            
            # Quarterly closing (financial stress)
            if current_date.month in [3, 6, 9, 12] and current_date.day > 20:
                events.append(StressEvent(
                    event_type='quarterly_closing',
                    intensity=0.8,
                    start_date=current_date,
                    duration_days=10
                ))
            
            # Random crisis events
            if random.random() < 0.05:  # 5% chance per period
                events.append(StressEvent(
                    event_type='crisis',
                    intensity=random.uniform(0.8, 1.0),
                    start_date=current_date,
                    duration_days=random.randint(1, 5)
                ))
            
            # Audit/compliance events
            if random.random() < 0.1 * self.profile['regulatory_burden']:
                events.append(StressEvent(
                    event_type='audit',
                    intensity=0.7 * self.profile['regulatory_burden'],
                    start_date=current_date,
                    duration_days=random.randint(5, 15)
                ))
            
            current_date += timedelta(days=random.randint(7, 21))
        
        return events
    
    def _calculate_daily_stress(self, date: datetime) -> float:
        """Calculate aggregate stress level for a given day"""
        
        # Start with baseline stress
        total_stress = self.baseline_stress
        
        # Add contribution from all active stress events
        for event in self.stress_events:
            total_stress += event.get_stress_at_time(date) * 0.3
        
        # Add cyclical patterns (weekly/monthly)
        day_of_week = date.weekday()
        if day_of_week == 0:  # Monday
            total_stress += 0.1
        elif day_of_week == 4:  # Friday
            total_stress += 0.15
        
        # End of month stress
        if date.day > 25:
            total_stress += 0.1
        
        # Cap at 1.0
        return min(total_stress, 1.0)
    
    def _update_group_state(self, anxiety_level: float) -> GroupState:
        """Update group state based on Bion's basic assumptions"""
        
        # State transition probabilities based on anxiety
        if anxiety_level > 0.7:
            # High anxiety triggers basic assumptions
            if self.group_state == GroupState.WORK:
                transitions = {
                    GroupState.DEPENDENCY: 0.4,
                    GroupState.FIGHT_FLIGHT: 0.4,
                    GroupState.PAIRING: 0.2
                }
            elif self.group_state == GroupState.DEPENDENCY:
                transitions = {
                    GroupState.DEPENDENCY: 0.6,
                    GroupState.FIGHT_FLIGHT: 0.3,
                    GroupState.PAIRING: 0.1
                }
            elif self.group_state == GroupState.FIGHT_FLIGHT:
                transitions = {
                    GroupState.FIGHT_FLIGHT: 0.5,
                    GroupState.DEPENDENCY: 0.3,
                    GroupState.WORK: 0.2
                }
            else:  # PAIRING
                transitions = {
                    GroupState.PAIRING: 0.4,
                    GroupState.DEPENDENCY: 0.4,
                    GroupState.FIGHT_FLIGHT: 0.2
                }
        else:
            # Low anxiety tends toward work group
            if self.group_state == GroupState.WORK:
                transitions = {GroupState.WORK: 1.0}
            else:
                transitions = {
                    GroupState.WORK: 0.7,
                    self.group_state: 0.3
                }
        
        # Sample new state
        states = list(transitions.keys())
        probs = list(transitions.values())
        new_state = np.random.choice(states, p=probs)
        
        return new_state
    
    def _generate_daily_behaviors(self, date: datetime, 
                                 stress_level: float,
                                 group_state: GroupState) -> Dict:
        """Generate daily behavioral indicators based on psychological state"""
        
        behaviors = {
            'date': date,
            'stress_level': stress_level,
            'group_state': group_state.value
        }
        
        # Authority-based behaviors (Milgram calibration)
        authority_pressure = self.profile['authority_strength'] * (1 + stress_level * 0.3)
        if authority_pressure > 0.7:
            behaviors['compliance_rate'] = np.random.beta(6.5, 3.5)  # ~65% mean
            behaviors['verification_skip_rate'] = np.random.beta(7, 3)  # ~70% mean
        else:
            behaviors['compliance_rate'] = np.random.beta(2.1, 7.9)  # ~21% mean
            behaviors['verification_skip_rate'] = np.random.beta(2, 8)  # ~20% mean
        
        # Temporal behaviors
        behaviors['response_time_minutes'] = np.random.gamma(
            shape=2, 
            scale=5 * (1 - stress_level * 0.5)  # Faster under stress
        )
        behaviors['patch_delay_days'] = np.random.poisson(
            30 * (1 + stress_level)  # Longer delays under stress
        )
        
        # Cognitive load indicators (Kahneman calibration)
        cognitive_load = min(stress_level + random.uniform(0, 0.3), 1.0)
        if cognitive_load > 0.8:
            behaviors['error_rate'] = np.random.beta(3.2, 6.8)  # 3.2x baseline
            behaviors['alert_dismissal_rate'] = np.random.beta(8, 2)  # 80% dismissal
        else:
            behaviors['error_rate'] = np.random.beta(1, 9)  # 10% baseline
            behaviors['alert_dismissal_rate'] = np.random.beta(2, 8)  # 20% dismissal
        
        # Social influence behaviors (Cialdini calibration)
        behaviors['social_proof_susceptibility'] = np.random.beta(8.7, 1.3)  # 87% mean
        behaviors['reciprocity_score'] = np.random.beta(7.6, 2.4)  # 76% mean
        
        # Group dynamics behaviors
        if group_state == GroupState.DEPENDENCY:
            behaviors['tool_overreliance'] = np.random.beta(8, 2)  # High reliance
            behaviors['security_ownership'] = np.random.beta(2, 8)  # Low ownership
        elif group_state == GroupState.FIGHT_FLIGHT:
            behaviors['aggressive_responses'] = np.random.beta(7, 3)
            behaviors['avoidance_behaviors'] = np.random.beta(6, 4)
        elif group_state == GroupState.PAIRING:
            behaviors['future_solution_hope'] = np.random.beta(8, 2)
            behaviors['current_action_delay'] = np.random.beta(7, 3)
        else:  # WORK
            behaviors['tool_overreliance'] = np.random.beta(3, 7)
            behaviors['security_ownership'] = np.random.beta(7, 3)
        
        # Stress response behaviors
        if stress_level > 0.8:
            behaviors['decision_quality'] = np.random.beta(3, 7)  # Degraded
            behaviors['risk_taking'] = np.random.beta(7, 3)  # Increased
        else:
            behaviors['decision_quality'] = np.random.beta(7, 3)
            behaviors['risk_taking'] = np.random.beta(3, 7)
        
        # AI-specific behaviors
        behaviors['ai_trust_level'] = np.random.beta(6, 4)
        behaviors['automation_bias'] = np.random.beta(
            7 * self.profile['tech_maturity'], 
            3
        )
        
        # Calculate convergence index
        high_risk_factors = sum([
            stress_level > 0.7,
            cognitive_load > 0.7,
            group_state != GroupState.WORK,
            authority_pressure > 0.7,
            behaviors['error_rate'] > 0.3
        ])
        
        behaviors['convergence_index'] = high_risk_factors / 5.0
        
        # Generate security incident (probabilistic based on factors)
        incident_probability = self._calculate_incident_probability(behaviors)
        behaviors['security_incident'] = np.random.random() < incident_probability
        
        if behaviors['security_incident']:
            behaviors['incident_type'] = self._sample_incident_type(behaviors)
        else:
            behaviors['incident_type'] = None
        
        return behaviors
    
    def _calculate_incident_probability(self, behaviors: Dict) -> float:
        """Calculate probability of security incident based on behavioral indicators"""
        
        # Base probability
        base_prob = 0.01  # 1% baseline
        
        # Multipliers based on behaviors
        multipliers = 1.0
        
        if behaviors['stress_level'] > 0.8:
            multipliers *= 2.5
        elif behaviors['stress_level'] > 0.6:
            multipliers *= 1.5
        
        if behaviors['error_rate'] > 0.3:
            multipliers *= 2.0
        
        if behaviors['compliance_rate'] > 0.6 and behaviors['verification_skip_rate'] > 0.6:
            multipliers *= 3.0  # High compliance without verification is dangerous
        
        if behaviors['convergence_index'] > 0.6:
            multipliers *= 6.3  # Critical convergence multiplier
        elif behaviors['convergence_index'] > 0.4:
            multipliers *= 2.5
        
        if behaviors['group_state'] == GroupState.DEPENDENCY.value:
            multipliers *= 1.5
        
        final_prob = min(base_prob * multipliers, 0.5)  # Cap at 50%
        
        return final_prob
    
    def _sample_incident_type(self, behaviors: Dict) -> str:
        """Determine incident type based on vulnerability profile"""
        
        # Weight different incident types by behavioral indicators
        weights = {
            'phishing': behaviors['compliance_rate'] * behaviors['social_proof_susceptibility'],
            'insider_threat': behaviors['stress_level'] * (1 - behaviors.get('security_ownership', 0.5)),
            'ransomware': behaviors['patch_delay_days'] / 100.0 if behaviors['patch_delay_days'] < 100 else 1.0,
            'data_breach': behaviors['error_rate'] * behaviors.get('cognitive_load', 0.5),
            'supply_chain': behaviors.get('tool_overreliance', 0.3),
            'credential_compromise': behaviors['verification_skip_rate']
        }
        
        # Normalize weights
        total_weight = sum(weights.values())
        if total_weight == 0:
            return 'unknown'
        
        probs = {k: v/total_weight for k, v in weights.items()}
        
        # Sample incident type
        types = list(probs.keys())
        probabilities = list(probs.values())
        
        return np.random.choice(types, p=probabilities)
    
    def generate_dataset(self) -> pd.DataFrame:
        """Generate complete synthetic dataset for the organization"""
        
        current_date = self.start_date
        
        while current_date <= self.end_date:
            # Calculate daily stress
            stress_level = self._calculate_daily_stress(current_date)
            
            # Update group state
            self.group_state = self._update_group_state(stress_level)
            self.group_state_history.append((current_date, self.group_state))
            
            # Generate daily behaviors
            daily_behaviors = self._generate_daily_behaviors(
                current_date, stress_level, self.group_state
            )
            
            self.daily_data.append(daily_behaviors)
            
            # Move to next day
            current_date += timedelta(days=1)
        
        # Convert to DataFrame
        df = pd.DataFrame(self.daily_data)
        
        # Add organizational metadata
        df['org_type'] = self.org_type.value
        df['org_size'] = self.size
        df['hierarchy_levels'] = self.hierarchy_levels
        df['tech_maturity'] = self.tech_maturity
        df['compliance_culture'] = self.compliance_culture
        
        return df

