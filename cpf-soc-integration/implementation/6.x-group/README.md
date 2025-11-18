# Category 6: Group Dynamic Vulnerabilities

This directory contains detailed implementation schemas for all 10 indicators in the Group Dynamics vulnerability category.

## Overview

Group dynamic vulnerabilities exploit collective behavior patterns, groupthink, diffusion of responsibility, and organizational defense mechanisms.

## Indicators

1. **[6.1] Groupthink security blind spots** - Collective decision-making failures
2. **[6.2] Risky Shift Phenomena** - Groups taking riskier decisions than individuals
3. **[6.3] Diffusion of Responsibility** - Everyone assumes someone else will act
4. **[6.4] Social Loafing in Security Tasks** - Reduced individual effort in groups
5. **[6.5] Bystander Effect in Incident Response** - Failure to respond assuming others will
6. **[6.6] Dependency Group Assumptions (baD)** - Collective dependency fantasies
7. **[6.7] Fight-Flight Security Postures (baF)** - Group-level attack/avoidance patterns
8. **[6.8] Pairing Hope Fantasies (baP)** - Unrealistic group optimism
9. **[6.9] Organizational Splitting** - Good/bad division creating blind spots
10. **[6.10] Collective Defense Mechanisms** - Group-level denial, rationalization

## Implementation Schema

Each indicator follows the **OFTLISRV** framework with focus on group-level observables.

## Key Metrics

### Groupthink Index
```
GI = Decision_unanimity × Speed_to_consensus / Devil's_advocate_presence
```

### Responsibility Diffusion Score
```
RDS = Incident_response_delay × Ownership_transfers / Team_size
```

### Social Loafing Coefficient
```
SLC = Individual_contribution / Expected_contribution_per_member
```

## Key Data Sources

- **Ticketing**: Ownership transfers, group assignments, response times
- **Meeting Data**: Decision records, dissent markers, participation
- **Collaboration Tools**: Contribution metrics per team member
- **Incident Response**: Group incident handling vs individual
- **Change Management**: Group-approved changes vs individual

## Detection Approach

### Groupthink Detection
```python
# Analyze group decision patterns
decision = get_group_decision(incident_id)

groupthink_markers = {
    'unanimity': all([vote == decision for vote in votes]),
    'no_dissent': count_dissenting_views == 0,
    'quick_consensus': decision_time < baseline * 0.5,
    'illusion_invulnerability': overconfidence_markers > 0,
    'collective_rationalization': justification_complexity < baseline
}

if sum(groupthink_markers.values()) >= 3:
    flag_groupthink_risk(team_id)
```

### Diffusion of Responsibility
```python
# Track ownership transfers
transfers = get_ownership_transfers(incident_id)

if len(transfers) > 3:  # Passed around multiple times
    diffusion_detected = True

# Check for assumption someone else will handle
assumption_keywords = ['thought you', 'assumed', 'believed handled']
if any(kw in incident_notes for kw in assumption_keywords):
    diffusion_detected = True
```

## Baseline Establishment

Group dynamic indicators require:
- Team composition and size data
- Historical group decision patterns
- Normal responsibility transfer rates
- Organizational culture assessment

## Common Event Types

- `group_decision` → 6.1, 6.2, 6.8
- `ownership_transfer` → 6.3, 6.5
- `group_task_assigned` → 6.4
- `organizational_crisis` → 6.7, 6.9, 6.10
- `dependency_reference` → 6.6

## Risk Levels

- **Low** (0-0.33): Healthy group dynamics, individual accountability
- **Medium** (0.34-0.66): Some group influence, responsibility still clear
- **High** (0.67-1.00): Systematic group dysfunction, diffusion of responsibility

## Mitigation Strategies

### Structural
- Explicit individual responsibility assignment
- Devil's advocate roles in security decisions
- Decision review processes
- Individual performance metrics alongside group metrics

### Cultural
- Reward individual initiative
- Normalize dissent and questioning
- Clear accountability structures
- Post-decision reviews

### Process
- Individual accountability in group tasks
- Bystander intervention training
- Explicit handoff protocols
- Group decision documentation requirements

## Related Resources

- **Dense Foundation**: `/foundation docs/core/en-US/` - Group dynamics formalization
- **Bion's Basic Assumptions**: Theoretical foundation for 6.6-6.8
- **Dashboard**: `/dashboard/soc/` - Group-level metrics
