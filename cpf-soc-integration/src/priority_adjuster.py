class PriorityAdjuster:
    def __init__(self, vulnerabilities, cpf_scores):
        self.vulns = vulnerabilities
        self.cpf = cpf_scores
    
    def adjust_priorities(self):
        adjusted = []
        
        for _, vuln in self.vulns.iterrows():
            base_priority = self.calculate_base_priority(vuln)
            psychological_multiplier = self.calculate_psychological_multiplier(vuln)
            
            adjusted.append({
                'cve': vuln['cve'],
                'host': vuln['host_key'],
                'original_priority': base_priority,
                'psychological_multiplier': psychological_multiplier,
                'adjusted_priority': base_priority * psychological_multiplier,
                'action': self.determine_action(base_priority * psychological_multiplier)
            })
        
        # Sort by adjusted priority
        adjusted.sort(key=lambda x: x['adjusted_priority'], reverse=True)
        return adjusted
    
    def calculate_base_priority(self, vuln):
        # CVSS-like calculation
        severity_scores = {'Critical': 10, 'High': 7, 'Medium': 4, 'Low': 1}
        base = severity_scores.get(vuln['severity'], 1)
        
        # Adjust for exploit availability
        if vuln.get('exploit_available'):
            base *= 1.5
        if vuln.get('malware_kits', 0) > 0:
            base *= 2.0
        
        return base
    
    def calculate_psychological_multiplier(self, vuln):
        multiplier = 1.0
        
        # Check if CVE appears in pattern evidence
        for pattern in self.cpf['high_risk_patterns']:
            if pattern['pattern'] == 'REPETITION_COMPULSION':
                # CVEs that repeat get highest priority
                for evidence in pattern['evidence']:
                    if vuln['cve'] == evidence['cve']:
                        multiplier = max(multiplier, 3.0)
                        
            elif pattern['pattern'] == 'SPLITTING':
                # CVEs on "good objects" get boosted
                for evidence in pattern['evidence']:
                    if vuln['cve'] == evidence['cve'] and \
                       vuln.get('host_type') == evidence['good_object']:
                        multiplier = max(multiplier, 2.5)
                        
            elif pattern['pattern'] == 'MANIC_DEFENSE':
                # CVEs without PoC get boosted if manic defense active
                if not vuln.get('exploit_available'):
                    multiplier = max(multiplier, 2.0)
        
        # Convergent risk multiplier
        if self.cpf['convergent_risk']:
            multiplier *= 1.5
        
        return multiplier
    
    def determine_action(self, priority):
        if priority > 30:
            return 'EMERGENCY: Patch within 24 hours'
        elif priority > 20:
            return 'CRITICAL: Patch within 72 hours'
        elif priority > 10:
            return 'HIGH: Patch within 1 week'
        elif priority > 5:
            return 'MEDIUM: Patch within 1 month'
        return 'LOW: Schedule for regular maintenance'
