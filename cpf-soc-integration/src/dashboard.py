import requests
from datetime import datetime

class Dashboard:
    def __init__(self):
        self.api_endpoint = "https://dashboard.internal/api/cpf"
    
    def format_output(self, cpf_scores, adjusted_priorities, patterns):
        """
        Format CPF results for customer dashboard
        """
        return {
            "metadata": {
                "customer_id": cpf_scores['customer_id'],
                "scan_date": cpf_scores['scan_date'],
                "data_sources": ["Qualys", "Tenable", "Rapid7"],
                "cpf_version": "1.0"
            },
            "executive_summary": {
                "overall_psychological_health": cpf_scores['cpf_total_score'],
                "risk_level": calculate_risk_level(cpf_scores['cpf_total_score']),
                "dominant_vulnerability": patterns[0]['pattern'] if patterns else 'None',
                "breach_prediction": cpf_scores['predicted_breach_vectors'][0] if 'predicted_breach_vectors' in cpf_scores else 'None'
            },
            "psychological_state": {
                "active_patterns": [
                    {
                        "pattern": p['pattern'],
                        "severity": p['severity'],
                        "description": p.get('interpretation', ''),
                        "evidence_count": len(p.get('evidence', []))
                    }
                    for p in patterns
                ],
                "convergent_risk": cpf_scores['convergent_risk']
            },
            "adjusted_priorities": {
                "critical_cves": [
                    {
                        "cve": cve['cve'],
                        "traditional_score": cve['original_priority'],
                        "cpf_adjusted_score": cve['adjusted_priority'],
                        "reason": cve.get('reasoning', ''),
                        "action": "PATCH IMMEDIATELY"
                    }
                    for cve in adjusted_priorities[:10]
                ]
            },
            "predictions": {
                "vulnerability_windows": [
                    {
                        "timeframe": "Friday 14:00-17:00",
                        "risk_multiplier": 3.2,
                        "attack_type": "Phishing/Social Engineering"
                    }
                ],
                "likely_breach_vector": cpf_scores.get('predicted_breach_vectors', ['None'])[0],
                "timeline": "Next 30-60 days based on pattern convergence"
            },
            "recommendations": {
                "immediate": cpf_scores.get('priority_interventions', [])[:3],
                "medium_term": cpf_scores.get('priority_interventions', [])[3:6],
                "strategic": [
                    "Address underlying psychological dynamics",
                    "Implement CPF-aware security training",
                    "Regular psychological state assessments"
                ]
            }
        }
    
    def push_to_dashboard(self, data):
        response = requests.post(
            self.api_endpoint,
            json=data,
            headers={'Content-Type': 'application/json'}
        )
        return response.status_code == 200
    
    # Stubs
    def calculate_risk_level(self, score):
        if score > 0.7: return 'CRITICAL'
        elif score > 0.5: return 'HIGH'
        elif score > 0.3: return 'MEDIUM'
        return 'LOW'
    
    def score_to_severity(self, score):
        if score > 0.7: return 'RED'
        elif score > 0.4: return 'YELLOW'
        return 'GREEN'
