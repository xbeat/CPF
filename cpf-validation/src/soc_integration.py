# ============================================================================
# File: soc_integration.py  
# Purpose: Integration with Security Operations Centers
# ============================================================================

class CPFSOCIntegration:
    """Integration layer for SOC/SIEM platforms"""
    
    def __init__(self, cpf_model: CPFBayesianModel):
        self.cpf_model = cpf_model
        self.indicator_set = CPFIndicatorSet()
        self.current_state = None
        self.alert_threshold = 0.7
        self.update_interval = 300  # 5 minutes
        
    def process_siem_events(self, events: List[Dict]) -> Dict:
        """Process SIEM events and extract CPF-relevant features"""
        
        features = {
            'auth_failures': 0,
            'privilege_escalations': 0,
            'anomalous_logins': 0,
            'patch_delays': [],
            'alert_responses': [],
            'communication_velocity': 0
        }
        
        for event in events:
            event_type = event.get('type', '')
            
            if 'authentication' in event_type.lower():
                if event.get('result') == 'failure':
                    features['auth_failures'] += 1
            
            elif 'privilege' in event_type.lower():
                features['privilege_escalations'] += 1
            
            elif 'login' in event_type.lower():
                if event.get('anomaly_score', 0) > 0.5:
                    features['anomalous_logins'] += 1
            
            elif 'patch' in event_type.lower():
                if 'delay' in event:
                    features['patch_delays'].append(event['delay'])
            
            elif 'alert' in event_type.lower():
                features['alert_responses'].append({
                    'response_time': event.get('response_time', 0),
                    'dismissed': event.get('dismissed', False)
                })
        
        return features
    
    def calculate_cpf_state(self, features: Dict) -> CPFState:
        """Convert SIEM features to CPF psychological state"""
        
        # Authority indicators
        authority = min(features['privilege_escalations'] / 10, 1.0)
        
        # Temporal indicators  
        avg_patch_delay = np.mean(features['patch_delays']) if features['patch_delays'] else 0
        temporal = min(avg_patch_delay / 60, 1.0)  # Normalize to 60-day max
        
        # Cognitive indicators
        if features['alert_responses']:
            dismissal_rate = sum(1 for r in features['alert_responses'] if r['dismissed']) / len(features['alert_responses'])
            cognitive = dismissal_rate
        else:
            cognitive = 0.3
        
        # Stress indicators
        stress = min((features['auth_failures'] + features['anomalous_logins']) / 20, 1.0)
        
        # Calculate convergence
        high_factors = sum([
            authority > 0.7,
            temporal > 0.7,
            cognitive > 0.7,
            stress > 0.7
        ])
        convergence = high_factors / 4
        
        return CPFState(
            authority=authority,
            temporal=temporal,
            social=0.5,  # Default without social data
            affective=0.5,  # Default
            cognitive=cognitive,
            group=0.5,  # Default
            stress=stress,
            unconscious=0.5,  # Default
            ai_specific=0.5,  # Default
            convergence=convergence
        )
    
    def generate_alert(self, risk_assessment: Dict) -> Optional[Dict]:
        """Generate security alert if threshold exceeded"""
        
        if risk_assessment['final_probability'] > self.alert_threshold:
            return {
                'alert_type': 'CPF_HIGH_RISK',
                'severity': risk_assessment['risk_level'],
                'probability': risk_assessment['final_probability'],
                'contributing_factors': risk_assessment['contributing_factors'],
                'recommended_actions': self.get_recommendations(risk_assessment),
                'timestamp': datetime.now()
            }
        
        return None
    
    def get_recommendations(self, risk_assessment: Dict) -> List[str]:
        """Generate recommendations based on risk factors"""
        
        recommendations = []
        
        for factor, value in risk_assessment['contributing_factors']:
            if value > 0.7:
                if factor == 'Authority':
                    recommendations.append('Implement additional verification for authority requests')
                    recommendations.append('Conduct authority impersonation awareness training')
                elif factor == 'Temporal':
                    recommendations.append('Review and expedite critical patch deployment')
                    recommendations.append('Reduce deadline pressure where possible')
                elif factor == 'Cognitive':
                    recommendations.append('Review alert tuning to reduce false positives')
                    recommendations.append('Implement alert rotation to prevent fatigue')
                elif factor == 'Stress':
                    recommendations.append('Monitor for signs of insider threat')
                    recommendations.append('Provide stress management resources')
                elif factor == 'Group':
                    recommendations.append('Address dependency on security tools')
                    recommendations.append('Reinforce shared security responsibility')
        
        return recommendations
    
    def create_dashboard_metrics(self, state: CPFState) -> Dict:
        """Create metrics for security dashboard display"""
        
        return {
            'cpf_overall_risk': state.convergence,
            'cpf_authority': state.authority,
            'cpf_temporal': state.temporal,
            'cpf_cognitive': state.cognitive,
            'cpf_stress': state.stress,
            'cpf_group': state.group,
            'risk_trend': 'increasing' if state.convergence > 0.5 else 'stable',
            'critical_factors': [
                f for f, v in [
                    ('Authority', state.authority),
                    ('Temporal', state.temporal),
                    ('Cognitive', state.cognitive),
                    ('Stress', state.stress)
                ] if v > 0.7
            ]
        }

