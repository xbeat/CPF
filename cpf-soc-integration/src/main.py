import yaml  # For config loading
from extractors import QualysExtractor, TenableExtractor, Rapid7Extractor
from normalizer import DataNormalizer
from pattern_engine import PatternDetectionEngine
from priority_adjuster import PriorityAdjuster
from dashboard import Dashboard

def load_config(file_path):
    with open(file_path, 'r') as f:
        return yaml.safe_load(f)

def main():
    # Load configuration
    config = load_config('config.yaml')
    
    # Step 1: Extract data from all three scanners
    qualys = QualysExtractor(config['qualys'])
    tenable = TenableExtractor(config['tenable'])
    rapid7 = Rapid7Extractor(config['rapid7'])
    
    qualys_data = qualys.get_vulnerability_data()
    tenable_data = tenable.get_vulnerability_data()
    rapid7_data = rapid7.get_vulnerability_data()
    
    # Step 2: Normalize and merge
    normalizer = DataNormalizer()
    consolidated = normalizer.merge_scanner_data(qualys_data, tenable_data, rapid7_data)
    
    # Step 3: Detect patterns
    engine = PatternDetectionEngine(config)
    patterns = engine.process_batch(consolidated)['patterns'].values()  # Get list of pattern dicts
    
    # Step 4: Calculate CPF scores
    # Note: CPFScoreCalculator is in pattern_engine.py as method; adjust if separate
    cpf_scores = engine.process_batch(consolidated)
    
    # Step 5: Adjust priorities
    adjuster = PriorityAdjuster(consolidated, cpf_scores)
    adjusted_priorities = adjuster.adjust_priorities()
    
    # Step 6: Format and push to dashboard
    dashboard = Dashboard()
    output = dashboard.format_output(cpf_scores, adjusted_priorities, patterns)
    dashboard.push_to_dashboard(output)
    
    # Step 7: Start continuous monitoring (in background or separate process)
    monitor = CPFMonitor(config)
    monitor.continuous_monitoring(interval_minutes=60)

if __name__ == "__main__":
    main()
