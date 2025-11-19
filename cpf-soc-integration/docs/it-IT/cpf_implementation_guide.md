# Guida all'Implementazione CPF: Dai Dati degli Scanner di Vulnerabilità agli Score Psicologici

## Sorgenti Dati da Qualys/Tenable/Rapid7

### Strutture Dati Disponibili

```python
# Struttura dati tipica Qualys/Tenable/Rapid7
vulnerability_data = {
    "host_id": "srv-prod-001",
    "scan_date": "2025-08-29T14:30:00Z",
    "confirmed_vulns": [
        {
            "cve": "CVE-2024-1234",
            "cvss": 9.8,
            "discovered_date": "2025-01-15",
            "patch_available_date": "2025-01-20",
            "exploitability": "HIGH",
            "patch_status": "MISSING"
        }
    ],
    "potential_vulns": [
        {
            "cve": "CVE-2024-5678",
            "confidence": 75,
            "reason": "Version fingerprinting uncertain"
        }
    ],
    "installed_software": [
        {
            "name": "Apache",
            "version": "2.2.15",
            "install_date": "2019-03-15",
            "authorized": False
        }
    ],
    "running_processes": [
        {
            "name": "httpd",
            "pid": 1234,
            "user": "root",
            "start_time": "2025-08-29T03:00:00Z",
            "cpu_usage": 45.2
        }
    ],
    "users": [
        {
            "username": "admin",
            "last_login": "2025-08-29T18:45:00Z",
            "privilege_level": "administrator",
            "login_frequency": "daily"
        }
    ],
    "enrichment": {
        "poc_published": ["CVE-2024-1234"],
        "news_mentions": ["CVE-2024-1234"],
        "github_activity": "HIGH",
        "exploit_kits": ["CVE-2024-1234"]
    }
}
```

## Implementazione Rilevamento Pattern

### PATTERN 1: Rilevamento Difesa Maniacale

```python
class ManicDefenseDetector:
    """
    Rileva difesa maniacale attraverso comportamento patching intorno a pubblicazione PoC
    Sorgenti dati: Dati vulnerabilità Qualys/Tenable + enrichment
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
                # Calcola tempo tra scoperta CVE e patch
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
                    # Pattern difesa maniacale rilevato
                    pattern_score += 1
                    manic_events.append({
                        'cve': vuln['cve'],
                        'ignored_days': time_before_poc,
                        'panic_hours': time_after_poc
                    })

        return {
            'pattern': 'MANIC_DEFENSE',
            'cpf_category': '[8.6] Defense mechanism interference',
            'score': min(pattern_score * 0.2, 1.0),  # Normalizza a 0-1
            'severity': self.calculate_severity(pattern_score),
            'evidence': manic_events,
            'prediction': 'Organizzazione vulnerabile ad attacchi 0-day',
            'intervention': 'Affrontare fantasie onnipotenti sulla sicurezza'
        }

    def calculate_severity(self, score):
        if score >= 5: return 'RED'
        elif score >= 2: return 'YELLOW'
        return 'GREEN'
```

### PATTERN 2: Rilevamento Splitting

```python
class SplittingDetector:
    """
    Rileva splitting attraverso trattamento differenziale di CVE identici
    Sorgente dati: Dati vulnerabilità a livello host Qualys/Tenable
    """

    def __init__(self, fleet_data):
        self.fleet_data = fleet_data  # Dati di tutti gli host

    def detect_pattern(self):
        # Raggruppa host per caratteristiche
        host_groups = {
            'executive': [],
            'production': [],
            'development': [],
            'IT': []
        }

        # Classifica host basandosi su pattern naming/utente
        for host in self.fleet_data:
            host_type = self.classify_host(host)
            host_groups[host_type].append(host)

        # Trova CVE che esistono su gruppi multipli
        common_cves = self.find_common_cves(host_groups)

        splitting_score = 0
        splitting_evidence = []

        for cve in common_cves:
            patch_rates = {}
            for group_name, hosts in host_groups.items():
                patch_rates[group_name] = self.calculate_patch_rate(hosts, cve)

            # Rileva splitting: stesso CVE, trattamento vastamente diverso
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
            'prediction': f'Violazione via sistemi {splitting_evidence[0]["good_object"]}',
            'intervention': 'Workshop su relazioni oggettuali complete'
        }

    def is_splitting_pattern(self, patch_rates):
        values = list(patch_rates.values())
        return max(values) - min(values) > 0.7  # 70% differenza
```

### PATTERN 3: Rilevamento Coazione a Ripetere

```python
class RepetitionCompulsionDetector:
    """
    Rileva CVE che continuano a ritornare nonostante patching
    Sorgente dati: Dati storici scansioni Tenable/Qualys
    """

    def __init__(self, scan_history):
        self.scan_history = scan_history  # Scansioni multiple nel tempo
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
            'prediction': f'{compulsive_cves[0]["cve"]} sarà vettore di violazione',
            'intervention': 'Identificare trauma organizzativo intorno a questo tipo di CVE'
        }

    def count_repetitions(self, timeline):
        # Conta cicli patch->riapparizione
        repetitions = 0
        for i in range(len(timeline) - 1):
            if timeline[i] == 'PATCHED' and timeline[i+1] == 'VULNERABLE':
                repetitions += 1
        return repetitions
```

### PATTERN 4: Finestre di Vulnerabilità Temporali

```python
class TemporalVulnerabilityDetector:
    """
    Rileva pattern di vulnerabilità basati sul tempo
    Sorgente dati: Timestamp scansioni Rapid7 Nexpose + storico patch
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

        # Combina pattern temporali per score complessivo
        temporal_score = sum(p['score'] for p in patterns.values()) / len(patterns)

        return {
            'pattern': 'TEMPORAL_VULNERABILITY',
            'cpf_category': '[2.x] Temporal Vulnerabilities',
            'score': temporal_score,
            'severity': self.calculate_severity(temporal_score),
            'sub_patterns': patterns,
            'prediction': self.predict_vulnerability_window(patterns),
            'intervention': 'Implementare supporto psicologico durante periodi ad alto rischio'
        }

    def detect_friday_fade(self):
        friday_patches = []
        other_day_patches = []

        for patch in self.temporal_data['patch_history']:
            patch_day = patch['timestamp'].weekday()
            success_rate = patch['success_rate']

            if patch_day == 4:  # Venerdì
                friday_patches.append(success_rate)
            else:
                other_day_patches.append(success_rate)

        friday_avg = sum(friday_patches) / len(friday_patches) if friday_patches else 0
        other_avg = sum(other_day_patches) / len(other_day_patches) if other_day_patches else 0

        fade_score = max(0, (other_avg - friday_avg) / other_avg)

        return {
            'score': fade_score,
            'friday_success_rate': friday_avg,
            'other_days_rate': other_avg,
            'interpretation': 'Dissoluzione super-io nel tempo liminale'
        }

    def predict_vulnerability_window(self, patterns):
        if patterns['friday_fade']['score'] > 0.3:
            return "Massima vulnerabilità: Venerdì 14:00-17:00"
        elif patterns['holiday_gaps']['score'] > 0.5:
            return "Esposizione critica durante prossimo periodo festivo"
        return "Nessuna vulnerabilità temporale significativa rilevata"
```

### PATTERN 5: Rilevamento Sovraccarico Cognitivo

```python
class CognitiveOverloadDetector:
    """
    Rileva sovraccarico cognitivo da volume vulnerabilità e pattern risposta
    Sorgente dati: Metriche aggregate Qualys VMDR
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
            'prediction': 'CVE critici ignorati per sovraccarico',
            'intervention': 'Ridurre carico cognitivo prima di aggiungere altri strumenti'
        }

    def calculate_alert_fatigue(self):
        # Misura degradazione tasso risposta nel tempo
        weekly_response_rates = []

        for week in self.workload_data['weekly_metrics']:
            total_alerts = week['total_alerts']
            investigated = week['alerts_investigated']
            response_rate = investigated / total_alerts if total_alerts > 0 else 0
            weekly_response_rates.append(response_rate)

        # Calcola pendenza degradazione
        if len(weekly_response_rates) > 4:
            early_avg = sum(weekly_response_rates[:4]) / 4
            recent_avg = sum(weekly_response_rates[-4:]) / 4
            fatigue_score = max(0, (early_avg - recent_avg) / early_avg)
        else:
            fatigue_score = 0

        return {
            'score': fatigue_score,
            'current_response_rate': weekly_response_rates[-1] if weekly_response_rates else 0,
            'interpretation': 'Desensibilizzazione progressiva agli alert'
        }
```

### PATTERN 6: Rilevamento Shadow IT

```python
class ShadowITDetector:
    """
    Rileva pattern software non autorizzato indicanti dinamiche di gruppo
    Sorgente dati: Inventario software Tenable/Qualys
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

        # Analizza pattern clustering
        shadow_patterns = []
        for dept, software_list in shadow_it_map.items():
            if len(software_list) > 10:  # Shadow IT significativo
                shadow_patterns.append({
                    'department': dept,
                    'unauthorized_count': len(software_list),
                    'common_software': self.find_common_patterns(software_list),
                    'group_dynamic': 'Attacco-fuga contro autorità IT'
                })

        shadow_score = len(shadow_patterns) * 0.2

        return {
            'pattern': 'SHADOW_IT',
            'cpf_category': '[6.7] Fight-flight security postures',
            'score': min(shadow_score, 1.0),
            'severity': self.calculate_severity(shadow_score),
            'evidence': shadow_patterns,
            'prediction': 'Ingresso ransomware via SaaS/strumenti non autorizzati',
            'intervention': 'Affrontare ribellione dipartimentale contro IT'
        }
```

## Sistema di Scoring CPF Aggregato

```python
class CPFScoreCalculator:
    """
    Aggrega tutti i rilevamenti pattern in score CPF unificato
    Si integra con API Qualys/Tenable/Rapid7
    """

    def __init__(self, scanner_api):
        self.scanner_api = scanner_api  # Client API Qualys/Tenable/Rapid7
        self.detectors = [
            ManicDefenseDetector,
            SplittingDetector,
            RepetitionCompulsionDetector,
            TemporalVulnerabilityDetector,
            CognitiveOverloadDetector,
            ShadowITDetector
        ]

    def calculate_cpf_score(self, customer_id):
        # Preleva dati da API scanner
        raw_data = self.fetch_scanner_data(customer_id)

        # Esegui tutti i rilevatori pattern
        pattern_results = []
        for detector_class in self.detectors:
            detector = detector_class(raw_data)
            result = detector.detect_pattern()
            pattern_results.append(result)

        # Calcola score aggregati
        cpf_scores = self.aggregate_scores(pattern_results)

        # Identifica rischi convergenti (flag rossi multipli)
        convergent_risk = self.calculate_convergent_risk(pattern_results)

        return {
            'customer_id': customer_id,
            'scan_date': datetime.now().isoformat(),
            'cpf_total_score': cpf_scores['total'],
            'category_scores': cpf_scores['by_category'],
            'detected_patterns': pattern_results,
            'convergent_risk': convergent_risk,
            'priority_interventions': self.prioritize_interventions(pattern_results),
            'predicted_breach_vectors': self.aggregate_predictions(pattern_results)
        }

    def fetch_scanner_data(self, customer_id):
        """
        Preleva dati da API Qualys/Tenable/Rapid7
        """
        data = {
            'vulnerability_data': self.scanner_api.get_vulnerabilities(customer_id),
            'asset_inventory': self.scanner_api.get_assets(customer_id),
            'scan_history': self.scanner_api.get_scan_history(customer_id, days=180),
            'software_inventory': self.scanner_api.get_software(customer_id),
            'process_snapshots': self.scanner_api.get_processes(customer_id),
            'enrichment': self.fetch_threat_intelligence()
        }
        return data

    def aggregate_scores(self, pattern_results):
        # Scoring CPF per categoria
        category_scores = {
            '[1.x]': 0,  # Autorità
            '[2.x]': 0,  # Temporale
            '[3.x]': 0,  # Sociale
            '[4.x]': 0,  # Affettivo
            '[5.x]': 0,  # Cognitivo
            '[6.x]': 0,  # Gruppo
            '[7.x]': 0,  # Stress
            '[8.x]': 0,  # Inconscio
            '[9.x]': 0,  # AI
            '[10.x]': 0  # Convergente
        }

        for result in pattern_results:
            category = result['cpf_category'].split(']')[0] + ']'
            category_scores[category] = max(
                category_scores[category],
                result['score']
            )

        total_score = sum(category_scores.values()) / len(category_scores)

        return {
            'total': total_score,
            'by_category': category_scores
        }

    def calculate_convergent_risk(self, pattern_results):
        """
        Identifica quando stati psicologici multipli convergono
        creando condizioni di tempesta perfetta
        """
        red_patterns = [p for p in pattern_results if p['severity'] == 'RED']

        if len(red_patterns) >= 3:
            return {
                'level': 'CRITICAL',
                'converging_patterns': [p['pattern'] for p in red_patterns],
                'prediction': 'Violazione imminente entro 30 giorni',
                'cpf_category': '[10.1] Perfect storm conditions'
            }
        elif len(red_patterns) >= 2:
            return {
                'level': 'HIGH',
                'converging_patterns': [p['pattern'] for p in red_patterns],
                'prediction': 'Rischio elevato di attacco riuscito',
                'cpf_category': '[10.4] Swiss cheese alignment'
            }
        return {
            'level': 'NORMAL',
            'prediction': 'Nessun rischio convergente rilevato'
        }
```

## Integrazione con Infrastruttura

```python
class CPFIntegration:
    """
    Integrazione produzione per modulo gestione vulnerabilità
    """

    def __init__(self, config):
        self.qualys_api = QualysAPI(config['qualys'])
        self.tenable_api = TenableAPI(config['tenable'])
        self.rapid7_api = Rapid7API(config['rapid7'])
        self.cpf_calculator = CPFScoreCalculator()

    def process_customer(self, customer_id):
        # Aggrega dati da tutti gli scanner
        combined_data = self.aggregate_scanner_data(customer_id)

        # Calcola score CPF
        cpf_results = self.cpf_calculator.calculate_cpf_score(combined_data)

        # Aggiusta priorità CVE basandosi su stato psicologico
        adjusted_priorities = self.adjust_cve_priorities(
            combined_data['vulnerabilities'],
            cpf_results
        )

        # Genera report azionabile
        report = self.generate_cpf_report(cpf_results, adjusted_priorities)

        return report

    def adjust_cve_priorities(self, vulnerabilities, cpf_results):
        """
        Ri-prioritizza CVE basandosi su vulnerabilità psicologiche
        """
        adjusted = []

        for vuln in vulnerabilities:
            base_score = vuln['cvss']
            psychological_multiplier = 1.0

            # Applica aggiustamenti psicologici
            for pattern in cpf_results['detected_patterns']:
                if pattern['pattern'] == 'REPETITION_COMPULSION':
                    # CVE che corrispondono a pattern ripetizione ottengono priorità massima
                    if vuln['cve'] in pattern['evidence']:
                        psychological_multiplier = 2.5

                elif pattern['pattern'] == 'SPLITTING':
                    # CVE su sistemi "oggetto buono" ottengono boost
                    if vuln['host_type'] in pattern['evidence']['good_object']:
                        psychological_multiplier = 2.0

                elif pattern['pattern'] == 'MANIC_DEFENSE':
                    # CVE senza PoC ottengono boost se rilevata difesa maniacale
                    if vuln['cve'] not in vuln['enrichment']['poc_published']:
                        psychological_multiplier = 1.8

            adjusted.append({
                'cve': vuln['cve'],
                'original_priority': base_score,
                'cpf_adjusted_priority': base_score * psychological_multiplier,
                'psychological_factor': psychological_multiplier,
                'reasoning': self.explain_adjustment(pattern, vuln)
            })

        return sorted(adjusted, key=lambda x: x['cpf_adjusted_priority'], reverse=True)
```

## Regole di Monitoraggio in Tempo Reale

```python
class CPFMonitoringRules:
    """
    Alerting in tempo reale basato su cambiamenti stato psicologico
    """

    def __init__(self, alert_system):
        self.alert_system = alert_system
        self.rules = self.define_rules()

    def define_rules(self):
        return [
            {
                'name': 'Collasso Difesa Maniacale',
                'condition': lambda data: (
                    data['poc_published_last_24h'] and
                    data['unpatched_critical_cves'] > 50
                ),
                'alert': 'CRITICO: Collasso difesa maniacale imminente. Aspettarsi panic patching.',
                'action': 'Pre-posizionare supporto per patching emergenza'
            },
            {
                'name': 'Finestra Vulnerabilità Venerdì',
                'condition': lambda data: (
                    datetime.now().weekday() == 4 and
                    datetime.now().hour >= 14 and
                    data['cpf_scores']['temporal'] > 0.7
                ),
                'alert': 'ALTO: Ingresso finestra dissolvenza venerdì con alta vulnerabilità temporale',
                'action': 'Aumentare monitoraggio SOC per prossime 4 ore'
            },
            {
                'name': 'Coazione a Ripetere Attiva',
                'condition': lambda data: (
                    data['recurring_cve_count'] > 0 and
                    data['days_since_last_recurrence'] > 85
                ),
                'alert': 'MEDIO: Ciclo ripetizione in avvicinamento per CVE ricorrenti',
                'action': 'Schedulare intervento prima del giorno 90'
            },
            {
                'name': 'Crisi Sovraccarico Cognitivo',
                'condition': lambda data: (
                    data['alert_response_rate'] < 0.1 and
                    data['new_cves_per_day'] > 100
                ),
                'alert': 'CRITICO: Team in sovraccarico cognitivo, cecità sicurezza attiva',
                'action': 'Riduzione carico lavoro immediata richiesta'
            }
        ]

    def evaluate_rules(self, current_data):
        triggered_alerts = []

        for rule in self.rules:
            if rule['condition'](current_data):
                self.alert_system.send_alert(
                    level=rule['alert'].split(':')[0],
                    message=rule['alert'],
                    recommended_action=rule['action']
                )
                triggered_alerts.append(rule['name'])

        return triggered_alerts
```

## Formato Output per Dashboard

```python
def generate_dashboard_json(cpf_results):
    """
    Formatta risultati CPF per dashboard cliente
    """
    return {
        "metadata": {
            "customer_id": cpf_results['customer_id'],
            "scan_date": cpf_results['scan_date'],
            "data_sources": ["Qualys", "Tenable", "Rapid7"],
            "cpf_version": "1.0"
        },
        "executive_summary": {
            "overall_psychological_health": cpf_results['cpf_total_score'],
            "risk_level": calculate_risk_level(cpf_results['cpf_total_score']),
            "dominant_vulnerability": cpf_results['detected_patterns'][0]['pattern'],
            "breach_prediction": cpf_results['predicted_breach_vectors'][0]
        },
        "psychological_state": {
            "active_patterns": [
                {
                    "pattern": p['pattern'],
                    "severity": p['severity'],
                    "description": p['interpretation'],
                    "evidence_count": len(p['evidence'])
                }
                for p in cpf_results['detected_patterns']
            ],
            "convergent_risk": cpf_results['convergent_risk']
        },
        "adjusted_priorities": {
            "critical_cves": [
                {
                    "cve": cve['cve'],
                    "traditional_score": cve['original_priority'],
                    "cpf_adjusted_score": cve['cpf_adjusted_priority'],
                    "reason": cve['reasoning'],
                    "action": "PATCH IMMEDIATELY"
                }
                for cve in cpf_results['adjusted_priorities'][:10]
            ]
        },
        "predictions": {
            "vulnerability_windows": [
                {
                    "timeframe": "Venerdì 14:00-17:00",
                    "risk_multiplier": 3.2,
                    "attack_type": "Phishing/Social Engineering"
                }
            ],
            "likely_breach_vector": cpf_results['predicted_breach_vectors'][0],
            "timeline": "Prossimi 30-60 giorni basandosi su convergenza pattern"
        },
        "recommendations": {
            "immediate": cpf_results['priority_interventions'][:3],
            "medium_term": cpf_results['priority_interventions'][3:6],
            "strategic": [
                "Affrontare dinamiche psicologiche sottostanti",
                "Implementare formazione sicurezza CPF-aware",
                "Valutazioni regolari stato psicologico"
            ]
        }
    }
```
