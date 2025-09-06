import requests
from datetime import datetime, timedelta
import pandas as pd
import time

class QualysExtractor:
    def __init__(self, config):
        self.session = requests.Session()
        self.session.auth = (config['username'], config['password'])
        self.base_url = config['api_url']
    
    def get_vulnerability_data(self, days_back=90):
        # Get host-level vulnerability data
        endpoint = f"{self.base_url}asset/host/vm/detection/"
        params = {
            'action': 'list',
            'show_results': 1,
            'output_format': 'json',
            'vm_scan_date_after': (datetime.now() - timedelta(days=days_back)).isoformat(),
            'include_ignored': 1,
            'include_disabled': 1
        }
        
        response = self.session.get(endpoint, params=params)
        data = response.json()
        
        # Extract key fields for CPF analysis
        vulnerabilities = []
        for host in data.get('HOST_LIST', {}).get('HOST', []):
            host_id = host['ID']
            for detection in host.get('DETECTION_LIST', {}).get('DETECTION', []):
                vulnerabilities.append({
                    'source': 'qualys',
                    'host_id': host_id,
                    'hostname': host.get('DNS', ''),
                    'ip': host.get('IP', ''),
                    'qid': detection['QID'],
                    'cve': detection.get('CVE_ID', ''),
                    'severity': detection.get('SEVERITY', 0),
                    'first_detected': detection.get('FIRST_FOUND_DATETIME'),
                    'last_detected': detection.get('LAST_FOUND_DATETIME'),
                    'times_detected': detection.get('TIMES_FOUND', 1),
                    'status': detection.get('STATUS'),
                    'ignored': detection.get('IS_IGNORED', False),
                    'disabled': detection.get('IS_DISABLED', False),
                    'patch_available': detection.get('PATCHABLE', False)
                })
        
        return pd.DataFrame(vulnerabilities)

class TenableExtractor:
    def __init__(self, config):
        self.headers = {
            'X-ApiKeys': f'accessKey={config["access_key"]};secretKey={config["secret_key"]}',
            'Content-Type': 'application/json'
        }
        self.base_url = config['api_url']
    
    def get_vulnerability_data(self, days_back=90):
        # Export vulnerabilities
        export_endpoint = f"{self.base_url}/vulns/export"
        
        # Create export request
        export_request = {
            'num_assets': 'all',
            'filters': {
                'since': int((datetime.now() - timedelta(days=days_back)).timestamp())
            }
        }
        
        response = requests.post(export_endpoint, json=export_request, headers=self.headers)
        export_uuid = response.json()['export_uuid']
        
        # Poll for completion and download
        status_endpoint = f"{self.base_url}/vulns/export/{export_uuid}/status"
        while True:
            status = requests.get(status_endpoint, headers=self.headers).json()
            if status['status'] == 'FINISHED':
                break
            time.sleep(5)
        
        # Download chunks (assuming single chunk for simplicity; extend if needed)
        chunks_endpoint = f"{self.base_url}/vulns/export/{export_uuid}/chunks/1"
        data = requests.get(chunks_endpoint, headers=self.headers).json()
        
        vulnerabilities = []
        for vuln in data.get('vulnerabilities', []):
            vulnerabilities.append({
                'source': 'tenable',
                'host_id': vuln['asset']['uuid'],
                'hostname': vuln['asset']['hostname'],
                'ip': vuln['asset']['ipv4'],
                'plugin_id': vuln['plugin']['id'],
                'cve': vuln.get('cve', [''])[0] if vuln.get('cve') else '',
                'severity': vuln['severity'],
                'first_detected': vuln['first_found'],
                'last_detected': vuln['last_found'],
                'state': vuln['state'],
                'has_patch': vuln['plugin'].get('has_patch', False),
                'exploit_available': vuln['plugin'].get('exploit_available', False),
                'exploited_by_malware': vuln['plugin'].get('exploited_by_malware', False)
            })
        
        return pd.DataFrame(vulnerabilities)

class Rapid7Extractor:
    def __init__(self, config):
        self.headers = {
            'X-Api-Key': config['api_key'],
            'Content-Type': 'application/json'
        }
        self.base_url = config['api_url']
    
    def get_vulnerability_data(self, days_back=90):
        # Get vulnerability findings
        endpoint = f"{self.base_url}vulnerabilities"
        params = {
            'size': 1000,
            'sort': 'riskScore,DESC'
        }
        
        all_vulnerabilities = []
        page = 0
        
        while True:
            params['page'] = page
            response = requests.get(endpoint, params=params, headers=self.headers)
            data = response.json()
            
            for vuln in data.get('data', []):
                for instance in vuln.get('instances', []):
                    all_vulnerabilities.append({
                        'source': 'rapid7',
                        'host_id': instance['assetId'],
                        'hostname': instance.get('hostname', ''),
                        'ip': instance.get('ip', ''),
                        'cve': vuln.get('cveId', ''),
                        'severity': vuln.get('severity', ''),
                        'risk_score': vuln.get('riskScore', 0),
                        'first_discovered': instance.get('discoveredDate'),
                        'status': instance.get('status'),
                        'proof': instance.get('proof', ''),
                        'exploitability': vuln.get('exploitability', ''),
                        'malware_kits': len(vuln.get('malwareKits', []))
                    })
            
            if not data.get('links', {}).get('next'):
                break
            page += 1
        
        return pd.DataFrame(all_vulnerabilities)
