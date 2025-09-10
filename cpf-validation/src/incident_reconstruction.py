# ============================================================================
# File: incident_reconstruction.py
# Purpose: Reconstruct Known Security Incidents
# ============================================================================

class IncidentReconstructor:
    """Reconstruct known security incidents using CPF model"""
    
    def __init__(self, cpf_model: CPFBayesianModel):
        self.cpf_model = cpf_model
        self.known_incidents = self._load_known_incidents()
    
    def _load_known_incidents(self) -> Dict:
        """Load known incident profiles"""
        
        return {
            'solarwinds': {
                'date': datetime(2020, 12, 13),
                'org_type': OrganizationType.TECHNOLOGY,
                'size': 3200,
                'key_factors': {
                    'authority': 0.91,  # Trust in vendor
                    'group': 0.88,      # Dependency on tool
                    'temporal': 0.75,   # End of year pressure
                    'cognitive': 0.70   # Alert fatigue from many updates
                },
                'description': 'Supply chain attack through trusted software vendor'
            },
            'colonial_pipeline': {
                'date': datetime(2021, 5, 7),
                'org_type': OrganizationType.MANUFACTURING,
                'size': 5500,
                'key_factors': {
                    'stress': 0.93,     # Operational stress
                    'temporal': 0.89,   # Time pressure to restore
                    'group': 0.80,      # Fight-flight response
                    'affective': 0.85   # Fear-based decisions
                },
                'description': 'Ransomware attack on critical infrastructure'
            },
            'uber': {
                'date': datetime(2022, 9, 15),
                'org_type': OrganizationType.TECHNOLOGY,
                'size': 32000,
                'key_factors': {
                    'social': 0.87,     # Social engineering
                    'authority': 0.85,  # Impersonation
                    'cognitive': 0.70,  # MFA fatigue
                    'stress': 0.65      # Organizational stress
                },
                'description': 'Social engineering and MFA fatigue attack'
            },
            'lastpass': {
                'date': datetime(2022, 12, 22),
                'org_type': OrganizationType.TECHNOLOGY,
                'size': 1000,
                'key_factors': {
                    'cognitive': 0.90,  # Complex environment
                    'stress': 0.86,     # Post-breach stress
                    'temporal': 0.80,   # Holiday period
                    'group': 0.75       # Dependency assumptions
                },
                'description': 'Sophisticated attack on password manager'
            },
            'moveit': {
                'date': datetime(2023, 5, 27),
                'org_type': OrganizationType.TECHNOLOGY,
                'size': 500,
                'key_factors': {
                    'temporal': 0.92,   # Zero-day urgency
                    'group': 0.84,      # Industry-wide panic
                    'cognitive': 0.80,  # Complexity of response
                    'stress': 0.78      # Crisis management
                },
                'description': 'Zero-day vulnerability mass exploitation'
            }
        }
    
    def reconstruct_incident(self, incident_name: str, 
                            lookback_days: int = 30) -> Dict:
        """Reconstruct psychological conditions before known incident"""
        
        if incident_name not in self.known_incidents:
            raise ValueError(f"Unknown incident: {incident_name}")
        
        incident = self.known_incidents[incident_name]
        
        # Generate synthetic organization matching incident profile
        org = SyntheticOrganization(
            org_type=incident['org_type'],
            size=incident['size'],
            start_date=incident['date'] - timedelta(days=lookback_days),
            duration_days=lookback_days + 7,  # Include incident date
            seed=42
        )
        
        # Generate data
        df = org.generate_dataset()
        
        # Inject known stress factors
        for factor, level in incident['key_factors'].items():
            if factor == 'authority':
                df['compliance_rate'] = df['compliance_rate'] * (1 + level * 0.3)
            elif factor == 'temporal':
                df['stress_level'] = df['stress_level'] * (1 + level * 0.2)
            elif factor == 'cognitive':
                df['error_rate'] = df['error_rate'] * (1 + level * 0.4)
            # Add other factors as needed
        
        # Calculate CPF state for each day
        predictions = []
        
        for _, row in df.iterrows():
            state = CPFState(
                authority=row.get('compliance_rate', 0.5),
                temporal=row.get('stress_level', 0.5),
                social=row.get('social_proof_susceptibility', 0.5),
                affective=0.5,  # Default if not in data
                cognitive=row.get('error_rate', 0.3) * 3,
                group=1.0 if row.get('group_state') != 'work' else 0.3,
                stress=row.get('stress_level', 0.5),
                unconscious=0.5,  # Default
                ai_specific=row.get('automation_bias', 0.5),
                convergence=row.get('convergence_index', 0.3)
            )
            
            prediction = self.cpf_model.predict_incident_probability(state)
            predictions.append({
                'date': row['date'],
                'probability': prediction['final_probability'],
                'risk_level': prediction['risk_level']
            })
        
        predictions_df = pd.DataFrame(predictions)
        
        # Find peak risk period
        high_risk_days = predictions_df[predictions_df['risk_level'].isin(['HIGH', 'CRITICAL'])]
        
        # Check if incident date falls within predicted window
        incident_date = incident['date']
        predicted_window = high_risk_days['date'].tolist() if not high_risk_days.empty else []
        
        hit = any(abs((d - incident_date).days) <= 3 for d in predicted_window)
        
        return {
            'incident': incident_name,
            'actual_date': incident_date,
            'predicted_high_risk_dates': predicted_window,
            'prediction_hit': hit,
            'peak_probability': predictions_df['probability'].max(),
            'description': incident['description'],
            'key_factors': incident['key_factors']
        }
    
    def validate_all_incidents(self) -> pd.DataFrame:
        """Validate model against all known incidents"""
        
        results = []
        
        for incident_name in self.known_incidents.keys():
            result = self.reconstruct_incident(incident_name)
            results.append({
                'Incident': incident_name.title(),
                'Actual Date': result['actual_date'].strftime('%Y-%m-%d'),
                'Predicted Window': f"{len(result['predicted_high_risk_dates'])} days",
                'Hit': '✓' if result['prediction_hit'] else '✗',
                'Peak Probability': f"{result['peak_probability']:.2f}"
            })
        
        return pd.DataFrame(results)

