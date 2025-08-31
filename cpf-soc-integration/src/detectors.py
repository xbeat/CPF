from datetime import datetime
from concurrent.futures import ThreadPoolExecutor
import pandas as pd  # Assuming pd is pandas

# Stub functions for time calculations (from implementation guide)
def days_between(start, end):
    return (datetime.fromisoformat(end) - datetime.fromisoformat(start)).days

def hours_between(start, end):
    return (datetime.fromisoformat(end) - datetime.fromisoformat(start)).total_seconds() / 3600

class ManicDefenseDetector:
    """
    Detects manic defense through patch behavior around PoC publication
    Data sources: Qualys/Tenable vulnerability data + enrichment
    """
    
    def __init__(self, vuln_history):
        self.vuln_history = vuln_history
        self.threshold_days_before_poc = 90
        self.threshold_hours_after_poc = 48
        
    def detect_pattern(self):
        pattern_score = 0
        manic_events = []
        
        for vuln in self.vuln_history:
            if vuln['cve'] in vuln['enrichment']['poc_published']:
                # Calculate time between CVE discovery and patch
                time_before_poc = days_between(
                    vuln['discovered_date'], 
                    vuln['poc_publish_date']
                )
                time_after_poc = hours_between(
                    vuln['poc_publish_date'],
                    vuln['patch_applied_date']
                )
                
                if (time_before_poc > self.threshold_days_before_poc and 
                    time_after_poc < self.threshold_hours_after_poc):
                    # Manic defense pattern detected
                    pattern_score += 1
                    manic_events.append({
                        'cve': vuln['cve'],
                        'ignored_days': time_before_poc,
                        'panic_hours': time_after_poc
                    })
        
        return {
            'pattern': 'MANIC_DEFENSE',
            'cpf_category': '[8.6] Defense mechanism interference',
            'score': min(pattern_score * 0.2, 1.0),  # Normalize to 0-1
            'severity': self.calculate_severity(pattern_score),
            'evidence': manic_events,
            'prediction': 'Organization vulnerable to 0-day attacks',
            'intervention': 'Address omnipotent fantasies about security'
        }
    
    def calculate_severity(self, score):
        if score >= 5: return 'RED'
        elif score >= 2: return 'YELLOW'
        return 'GREEN'

class SplittingDetector:
    """
    Detects splitting through differential treatment of identical CVEs
    Data source: Qualys/Tenable host-level vulnerability data
    """
    
    def __init__(self, fleet_data):
        self.fleet_data = fleet_data  # All hosts data
        
    def detect_pattern(self):
        # Group hosts by characteristics
        host_groups = {
            'executive': [],
            'production': [],
            'development': [],
            'IT': []
        }
        
        # Classify hosts based on naming/user patterns
        for host in self.fleet_data:
            host_type = self.classify_host(host)
            host_groups[host_type].append(host)
        
        # Find CVEs that exist across multiple groups
        common_cves = self.find_common_cves(host_groups)
        
        splitting_score = 0
        splitting_evidence = []
        
        for cve in common_cves:
            patch_rates = {}
            for group_name, hosts in host_groups.items():
                patch_rates[group_name] = self.calculate_patch_rate(hosts, cve)
            
            # Detect splitting: same CVE, vastly different treatment
            if self.is_splitting_pattern(patch_rates):
                splitting_score += 1
                splitting_evidence.append({
                    'cve': cve,
                    'patch_rates': patch_rates,
                    'good_object': max(patch_rates, key=patch_rates.get),
                    'bad_object': min(patch_rates, key=patch_rates.get)
                })
        
        return {
            'pattern': 'SPLITTING',
            'cpf_category': '[4.9] Object relations splitting',
            'score': min(splitting_score * 0.15, 1.0),
            'severity': self.calculate_severity(splitting_score),
            'evidence': splitting_evidence,
            'prediction': f'Breach via {splitting_evidence[0]["good_object"]} systems' if splitting_evidence else 'No splitting detected',
            'intervention': 'Workshop on whole-object relations'
        }
    
    def is_splitting_pattern(self, patch_rates):
        values = list(patch_rates.values())
        return max(values) - min(values) > 0.7  # 70% difference if values else 0
    
    # Stubs for undefined methods
    def classify_host(self, host):
        # Example implementation; replace with actual logic
        if 'exec' in host.get('hostname', '').lower():
            return 'executive'
        return 'general'
    
    def find_common_cves(self, host_groups):
        # Example; implement based on data
        return []  # Return list of common CVEs
    
    def calculate_patch_rate(self, hosts, cve):
        # Example; implement based on data
        return 0.5  # Dummy rate

    def calculate_severity(self, score):
        if score >= 5: return 'RED'
        elif score >= 2: return 'YELLOW'
        return 'GREEN'

class RepetitionCompulsionDetector:
    """
    Detects CVEs that keep returning despite patching
    Data source: Tenable/Qualys historical scan data
    """
    
    def __init__(self, scan_history):
        self.scan_history = scan_history  # Multiple scans over time
        self.min_repetitions = 3
        
    def detect_pattern(self):
        cve_timeline = self.build_cve_timeline()
        repetition_score = 0
        compulsive_cves = []
        
        for cve, timeline in cve_timeline.items():
            repetitions = self.count_repetitions(timeline)
            
            if repetitions >= self.min_repetitions:
                repetition_score += repetitions
                compulsive_cves.append({
                    'cve': cve,
                    'repetitions': repetitions,
                    'pattern': timeline,
                    'trauma_category': self.identify_trauma_type(cve)
                })
        
        return {
            'pattern': 'REPETITION_COMPULSION',
            'cpf_category': '[8.3] Repetition compulsion patterns',
            'score': min(repetition_score * 0.1, 1.0),
            'severity': 'RED' if repetition_score > 0 else 'GREEN',
            'evidence': compulsive_cves,
            'prediction': f'{compulsive_cves[0]["cve"]} will be breach vector' if compulsive_cves else 'No repetition detected',
            'intervention': 'Identify organizational trauma around this CVE type'
        }
    
    def count_repetitions(self, timeline):
        # Count patch->reappear cycles
        repetitions = 0
        for i in range(len(timeline) - 1):
            if timeline[i] == 'PATCHED' and timeline[i+1] == 'VULNERABLE':
                repetitions += 1
        return repetitions
    
    # Stubs
    def build_cve_timeline(self):
        return {}  # Dict of cve: list of statuses
    
    def identify_trauma_type(self, cve):
        return 'data_breach'  # Dummy

class TemporalVulnerabilityDetector:
    """
    Detects time-based vulnerability patterns
    Data source: Rapid7 Nexpose scan timestamps + patch history
    """
    
    def __init__(self, temporal_data):
        self.temporal_data = temporal_data
        
    def detect_pattern(self):
        patterns = {
            'friday_fade': self.detect_friday_fade(),
            'holiday_gaps': self.detect_holiday_gaps(),
            'audit_theater': self.detect_audit_cycles(),
            'ego_depletion': self.detect_progressive_decay()
        }
        
        # Combine temporal patterns for overall score
        temporal_score = sum(p['score'] for p in patterns.values()) / len(patterns)
        
        return {
            'pattern': 'TEMPORAL_VULNERABILITY',
            'cpf_category': '[2.x] Temporal Vulnerabilities',
            'score': temporal_score,
            'severity': self.calculate_severity(temporal_score),
            'sub_patterns': patterns,
            'prediction': self.predict_vulnerability_window(patterns),
            'intervention': 'Implement psychological support during high-risk periods'
        }
    
    def detect_friday_fade(self):
        friday_patches = []
        other_day_patches = []
        
        for patch in self.temporal_data.get('patch_history', []):
            patch_day = datetime.fromisoformat(patch['timestamp']).weekday()
            success_rate = patch['success_rate']
            
            if patch_day == 4:  # Friday
                friday_patches.append(success_rate)
            else:
                other_day_patches.append(success_rate)
        
        friday_avg = sum(friday_patches) / len(friday_patches) if friday_patches else 0
        other_avg = sum(other_day_patches) / len(other_day_patches) if other_day_patches else 0
        
        fade_score = max(0, (other_avg - friday_avg) / other_avg) if other_avg else 0
        
        return {
            'score': fade_score,
            'friday_success_rate': friday_avg,
            'other_days_rate': other_avg,
            'interpretation': 'Superego dissolution in liminal time'
        }
    
    def predict_vulnerability_window(self, patterns):
        if patterns['friday_fade']['score'] > 0.3:
            return "Maximum vulnerability: Friday 14:00-17:00"
        elif patterns['holiday_gaps']['score'] > 0.5:
            return "Critical exposure during next holiday period"
        return "No significant temporal vulnerability detected"
    
    # Stubs for other detects
    def detect_holiday_gaps(self):
        return {'score': 0.0}  # Implement as needed
    
    def detect_audit_cycles(self):
        return {'score': 0.0}
    
    def detect_progressive_decay(self):
        return {'score': 0.0}
    
    def calculate_severity(self, score):
        if score > 0.7: return 'RED'
        elif score > 0.4: return 'YELLOW'
        return 'GREEN'

class CognitiveOverloadDetector:
    """
    Detects cognitive overload from vulnerability volume and response patterns
    Data source: Qualys VMDR aggregated metrics
    """
    
    def __init__(self, workload_data):
        self.workload_data = workload_data
        
    def detect_pattern(self):
        metrics = {
            'alert_fatigue': self.calculate_alert_fatigue(),
            'decision_paralysis': self.calculate_decision_paralysis(),
            'complexity_score': self.calculate_complexity_overload()
        }
        
        overload_score = self.aggregate_overload_score(metrics)
        
        return {
            'pattern': 'COGNITIVE_OVERLOAD',
            'cpf_category': '[5.x] Cognitive Overload Vulnerabilities',
            'score': overload_score,
            'severity': self.calculate_severity(overload_score),
            'metrics': metrics,
            'prediction': 'Critical CVEs ignored due to overload',
            'intervention': 'Reduce cognitive load before adding more tools'
        }
    
    def calculate_alert_fatigue(self):
        # Measure response rate degradation over time
        weekly_response_rates = []
        
        for week in self.workload_data.get('weekly_metrics', []):
            total_alerts = week['total_alerts']
            investigated = week['alerts_investigated']
            response_rate = investigated / total_alerts if total_alerts > 0 else 0
            weekly_response_rates.append(response_rate)
        
        # Calculate degradation slope
        if len(weekly_response_rates) > 4:
            early_avg = sum(weekly_response_rates[:4]) / 4
            recent_avg = sum(weekly_response_rates[-4:]) / 4
            fatigue_score = max(0, (early_avg - recent_avg) / early_avg)
        else:
            fatigue_score = 0
            
        return {
            'score': fatigue_score,
            'current_response_rate': weekly_response_rates[-1] if weekly_response_rates else 0,
            'interpretation': 'Progressive alert desensitization'
        }
    
    # Stubs for other calculates
    def calculate_decision_paralysis(self):
        return {'score': 0.0}
    
    def calculate_complexity_overload(self):
        return {'score': 0.0}
    
    def aggregate_overload_score(self, metrics):
        return sum(m['score'] for m in metrics.values()) / len(metrics)
    
    def calculate_severity(self, score):
        if score > 0.7: return 'RED'
        elif score > 0.4: return 'YELLOW'
        return 'GREEN'

class ShadowITDetector:
    """
    Detects unauthorized software patterns indicating group dynamics
    Data source: Tenable/Qualys software inventory
    """
    
    def __init__(self, software_inventory):
        self.software_inventory = software_inventory
        self.authorized_list = self.load_authorized_software()
        
    def detect_pattern(self):
        shadow_it_map = {}
        
        for host in self.software_inventory:
            department = self.get_department(host)
            unauthorized = self.find_unauthorized_software(host)
            
            if department not in shadow_it_map:
                shadow_it_map[department] = []
            shadow_it_map[department].extend(unauthorized)
        
        # Analyze clustering patterns
        shadow_patterns = []
        for dept, software_list in shadow_it_map.items():
            if len(software_list) > 10:  # Significant shadow IT
                shadow_patterns.append({
                    'department': dept,
                    'unauthorized_count': len(software_list),
                    'common_software': self.find_common_patterns(software_list),
                    'group_dynamic': 'Fight-flight against IT authority'
                })
        
        shadow_score = len(shadow_patterns) * 0.2
        
        return {
            'pattern': 'SHADOW_IT',
            'cpf_category': '[6.7] Fight-flight security postures',
            'score': min(shadow_score, 1.0),
            'severity': self.calculate_severity(shadow_score),
            'evidence': shadow_patterns,
            'prediction': 'Ransomware entry via unauthorized SaaS/tools',
            'intervention': 'Address departmental rebellion against IT'
        }
    
    # Stubs
    def load_authorized_software(self):
        return []  # List of authorized software names
    
    def get_department(self, host):
        return 'IT'  # Dummy
    
    def find_unauthorized_software(self, host):
        return []  # List of unauthorized
    
    def find_common_patterns(self, software_list):
        return []  # Common ones
    
    def calculate_severity(self, score):
        if score > 0.7: return 'RED'
        elif score > 0.4: return 'YELLOW'
        return 'GREEN'
