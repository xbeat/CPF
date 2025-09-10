# ============================================================================
# File: main.py
# Purpose: Main execution and demonstration script
# ============================================================================

def main():
    """Main demonstration of CPF validation framework"""
    
    print("=" * 80)
    print("CPF VALIDATION FRAMEWORK - DEMONSTRATION")
    print("=" * 80)
    print()
    
    # 1. Generate synthetic data
    print("1. GENERATING SYNTHETIC ORGANIZATIONAL DATA")
    print("-" * 40)
    
    organizations = []
    for org_type in [OrganizationType.FINANCIAL, OrganizationType.HEALTHCARE,
                     OrganizationType.TECHNOLOGY, OrganizationType.GOVERNMENT]:
        print(f"Generating {org_type.value} organization...")
        org = SyntheticOrganization(org_type, size=1000, seed=42)
        df = org.generate_dataset()
        organizations.append(df)
        print(f"  - Generated {len(df)} days of data")
        print(f"  - Security incidents: {df['security_incident'].sum()}")
    
    # Combine all organizations
    full_dataset = pd.concat(organizations, ignore_index=True)
    print(f"\nTotal dataset: {len(full_dataset)} organization-days")
    print(f"Total incidents: {full_dataset['security_incident'].sum()}")
    print()
    
    # 2. Calculate CPF indicators
    print("2. CALCULATING CPF INDICATORS")
    print("-" * 40)
    
    indicator_set = CPFIndicatorSet()
    indicator_scores = indicator_set.calculate_all(full_dataset)
    
    for indicator_id, scores in indicator_scores.items():
        print(f"Indicator {indicator_id} ({scores['name']}): {scores['risk_level']} (score: {scores['score']:.3f})")
    
    print()
    
    # 3. Run Bayesian model predictions
    print("3. BAYESIAN MODEL PREDICTIONS")
    print("-" * 40)
    
    cpf_model = CPFBayesianModel()
    
    # Sample prediction
    sample_state = CPFState(
        authority=0.7,
        temporal=0.8,
        social=0.6,
        affective=0.5,
        cognitive=0.75,
        group=0.6,
        stress=0.8,
        unconscious=0.5,
        ai_specific=0.4,
        convergence=0.7
    )
    
    prediction = cpf_model.predict_incident_probability(sample_state)
    print(f"Sample prediction for high-stress state:")
    print(f"  - Base probability: {prediction['base_probability']:.3f}")
    print(f"  - Convergence multiplier: {prediction['convergence_multiplier']:.1f}x")
    print(f"  - Final probability: {prediction['final_probability']:.3f}")
    print(f"  - Risk level: {prediction['risk_level']}")
    print()
    
    # 4. Validate model performance
    print("4. MODEL VALIDATION METRICS")
    print("-" * 40)
    
    # Generate predictions for validation
    predictions = []
    actuals = []
    
    for _, row in full_dataset.iterrows():
        state = CPFState(
            authority=row.get('compliance_rate', 0.5),
            temporal=row.get('stress_level', 0.5),
            social=row.get('social_proof_susceptibility', 0.5),
            affective=0.5,
            cognitive=row.get('error_rate', 0.3) * 3,
            group=1.0 if row.get('group_state') != 'work' else 0.3,
            stress=row.get('stress_level', 0.5),
            unconscious=0.5,
            ai_specific=row.get('automation_bias', 0.5),
            convergence=row.get('convergence_index', 0.3)
        )
        
        pred = cpf_model.predict_incident_probability(state)
        predictions.append(pred['final_probability'])
        actuals.append(1 if row['security_incident'] else 0)
    
    predictions = np.array(predictions)
    actuals = np.array(actuals)
    
    validator = CPFValidator(predictions, actuals, predictions)
    
    auc, ci = validator.calculate_auc_roc()
    print(f"AUC-ROC: {auc:.3f} (95% CI: {ci[0]:.3f}-{ci[1]:.3f})")
    
    pr_metrics = validator.calculate_precision_recall()
    print(f"Average Precision: {pr_metrics['average_precision']:.3f}")
    
    brier = validator.calculate_brier_score()
    print(f"Brier Score: {brier:.3f}")
    
    # Convergence risk ratio
    convergence_scores = full_dataset['convergence_index'].values
    rr, rr_ci = validator.calculate_convergence_risk_ratio(convergence_scores)
    print(f"Convergence Risk Ratio: {rr:.1f}x (95% CI: {rr_ci[0]:.1f}-{rr_ci[1]:.1f})")
    
    # Statistical tests
    stats_tests = validator.perform_statistical_tests()
    print(f"Statistical significance (p-value): {stats_tests['permutation_test_p']:.4f}")
    print()
    
    # 5. Incident reconstruction
    print("5. INCIDENT RECONSTRUCTION")
    print("-" * 40)
    
    reconstructor = IncidentReconstructor(cpf_model)
    validation_results = reconstructor.validate_all_incidents()
    
    print("\nIncident Reconstruction Results:")
    print(validation_results.to_string(index=False))
    print()
    
    # 6. SOC Integration example
    print("6. SOC INTEGRATION EXAMPLE")
    print("-" * 40)
    
    soc = CPFSOCIntegration(cpf_model)
    
    # Simulate SIEM events
    mock_events = [
        {'type': 'authentication_failure', 'result': 'failure'},
        {'type': 'privilege_escalation', 'user': 'admin'},
        {'type': 'patch_deployment', 'delay': 45},
        {'type': 'alert', 'dismissed': True, 'response_time': 2},
        {'type': 'anomalous_login', 'anomaly_score': 0.8}
    ]
    
    features = soc.process_siem_events(mock_events)
    state = soc.calculate_cpf_state(features)
    risk = cpf_model.predict_incident_probability(state)
    
    print("SIEM Event Processing:")
    print(f"  - Extracted features: {list(features.keys())}")
    print(f"  - Calculated CPF state convergence: {state.convergence:.2f}")
    print(f"  - Risk assessment: {risk['risk_level']}")
    
    alert = soc.generate_alert(risk)
    if alert:
        print(f"\n⚠️  ALERT GENERATED: {alert['alert_type']}")
        print(f"  - Severity: {alert['severity']}")
        print(f"  - Recommendations:")
        for rec in alert['recommended_actions'][:3]:
            print(f"    • {rec}")
    
    print()
    print("=" * 80)
    print("DEMONSTRATION COMPLETE")
    print("=" * 80)

if __name__ == "__main__":
    main()