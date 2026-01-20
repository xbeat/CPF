# CPF Assessment Session Example
## Complete Interactive Flow with JSON Output

This document shows a complete assessment session from start to finish.

---

## SESSION START

**User**: "Test me on indicator 1.3. I'm a software developer."

**Claude**: 
```
Starting CPF Assessment for Indicator [1.3]: Authority figure impersonation susceptibility
Category: Authority-Based Vulnerabilities

Context: Software Developer role
This assessment consists of 4 scenario-based questions.
Please respond with your immediate, intuitive reaction.

Assessment ID will be generated upon completion.
```

---

## QUESTION 1

**Claude**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Question 1 of 4

It's 4:45 PM on Friday. You receive an email from "IT-Security@company-alert.com" 
(your actual domain is company.com) stating your development environment access 
will be locked over the weekend unless you verify credentials immediately through 
their portal. The email references your current project by name. You have a 
production deployment scheduled for Monday morning. What do you do?

A) Forward to security@company.com and wait for verification, even if it delays Monday's deployment
B) Check the sender's email headers and domain authentication before taking any action
C) Click the link but don't enter credentials until you can verify it looks legitimate
D) Enter your credentials quickly - you can't risk being locked out before Monday's deployment

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please select A, B, C, or D:
```

**User**: "B"

**Claude**: 
```
✓ Response recorded: B

Next question...
```

---

## QUESTION 2

**Claude**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Question 2 of 4

During a production incident, someone joins your Slack channel claiming to be 
"Sarah Chen - VP Engineering" (your actual VP's name) and requests immediate 
database access credentials to diagnose the issue. The profile is marked "guest" 
in small text. The real Sarah is known to work unusual hours and occasionally 
joins developer channels during emergencies. The outage is affecting customers. 
How do you respond?

A) Report the message to security immediately without engaging, despite the ongoing outage
B) Ask a colleague who knows Sarah personally to verify if this is really her
C) Check the profile details carefully and ask the person a question only Sarah would know
D) Provide read-only credentials to help resolve the customer-facing outage quickly

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please select A, B, C, or D:
```

**User**: "A"

**Claude**:
```
✓ Response recorded: A

Next question...
```

---

## QUESTION 3

**Claude**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Question 3 of 4

You receive a calendar invite for "Security Compliance Audit" from 
"security-audit@company-review.net" (note: not your company domain). 
Your actual manager is listed as an attendee. The meeting is today at 2 PM 
and requests you bring "API keys and authentication tokens for review." 
Your manager hasn't mentioned this audit. What's your action?

A) Delete the invite and alert IT security about the domain mismatch and suspicious request
B) Send a separate email to your manager asking if they added this meeting
C) Attend but don't bring any credentials until you verify attendees' identities in person
D) Prepare the requested materials - your manager's presence indicates it's legitimate

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please select A, B, C, or D:
```

**User**: "B"

**Claude**:
```
✓ Response recorded: B

Final question...
```

---

## QUESTION 4

**Claude**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Question 4 of 4

You're in a code review meeting. A senior architect you respect says 
"I know security recommends MFA for all service accounts, but it breaks 
our deployment pipeline. Let's just use long passwords for now and fix it 
later." Others in the meeting nod in agreement. The architect has 15 years 
experience and is known for good judgment. How do you respond?

A) Speak up about the security risk despite potentially disagreeing with a respected senior
B) Privately message the security team after the meeting to get their input
C) Suggest a compromise like MFA on production only, but not on dev/test environments
D) Stay quiet - the architect has more experience and probably knows the right tradeoffs

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please select A, B, C, or D:
```

**User**: "B"

**Claude**:
```
✓ Response recorded: B

Calculating results...
```

---

## RESULTS PRESENTATION

**Claude**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ASSESSMENT COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Indicator: [1.3] Authority figure impersonation susceptibility
Total Score: 3/8 points
Vulnerability Level: YELLOW ●

Your responses show moderate vulnerability to authority impersonation attacks. 
You demonstrate some security awareness and verification instincts, but may 
be susceptible under combined pressures (time constraints + authority figures + 
social proof). You tend to use informal verification channels rather than 
official security protocols.

Recommended Actions:
• Establish and practice out-of-band verification procedures for all credential requests
• Attend targeted training on executive impersonation and BEC (Business Email Compromise) attacks  
• Implement technical controls like domain authentication enforcement and dual-approval for sensitive changes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Complete assessment data in JSON format below:
```

---

## COMPLETE JSON OUTPUT

**Claude**:
```json
{
  "assessment_metadata": {
    "assessment_id": "a7f3b9e2-4c8d-4a3f-9b7e-1d2f4a6c8e0b",
    "indicator_code": "1.3",
    "indicator_name": "Authority figure impersonation susceptibility",
    "category": "Authority-Based Vulnerabilities",
    "category_code": "1",
    "timestamp": "2025-01-20T17:45:23.456Z",
    "cpf_version": "1.0",
    "assessment_version": "1.0"
  },
  "user_context": {
    "user_id": "TO_BE_ASSIGNED_BY_APP",
    "organization_id": "TO_BE_ASSIGNED_BY_APP",
    "role": "software_developer",
    "department": null,
    "security_awareness_level": "intermediate"
  },
  "questions_and_responses": [
    {
      "question_number": 1,
      "question_id": "1.3.Q1",
      "question_text": "It's 4:45 PM on Friday. You receive an email from 'IT-Security@company-alert.com' (your actual domain is company.com) stating your development environment access will be locked over the weekend unless you verify credentials immediately through their portal. The email references your current project by name. You have a production deployment scheduled for Monday morning. What do you do?",
      "options": {
        "A": {
          "text": "Forward to security@company.com and wait for verification, even if it delays Monday's deployment",
          "score": 0,
          "behavior_type": "green"
        },
        "B": {
          "text": "Check the sender's email headers and domain authentication before taking any action",
          "score": 1,
          "behavior_type": "yellow"
        },
        "C": {
          "text": "Click the link but don't enter credentials until you can verify it looks legitimate",
          "score": 1,
          "behavior_type": "yellow"
        },
        "D": {
          "text": "Enter your credentials quickly - you can't risk being locked out before Monday's deployment",
          "score": 2,
          "behavior_type": "red"
        }
      },
      "user_response": "B",
      "points_earned": 1,
      "response_time_seconds": null,
      "psychological_markers": [
        "temporal_urgency",
        "domain_spoofing",
        "project_knowledge_exploitation",
        "weekend_deadline_pressure"
      ],
      "attack_vectors": [
        "credential_phishing",
        "domain_spoofing",
        "urgency_manipulation"
      ]
    },
    {
      "question_number": 2,
      "question_id": "1.3.Q2",
      "question_text": "During a production incident, someone joins your Slack channel claiming to be 'Sarah Chen - VP Engineering' (your actual VP's name) and requests immediate database access credentials to diagnose the issue. The profile is marked 'guest' in small text. The real Sarah is known to work unusual hours and occasionally joins developer channels during emergencies. The outage is affecting customers. How do you respond?",
      "options": {
        "A": {
          "text": "Report the message to security immediately without engaging, despite the ongoing outage",
          "score": 0,
          "behavior_type": "green"
        },
        "B": {
          "text": "Ask a colleague who knows Sarah personally to verify if this is really her",
          "score": 1,
          "behavior_type": "yellow"
        },
        "C": {
          "text": "Check the profile details carefully and ask the person a question only Sarah would know",
          "score": 1,
          "behavior_type": "yellow"
        },
        "D": {
          "text": "Provide read-only credentials to help resolve the customer-facing outage quickly",
          "score": 2,
          "behavior_type": "red"
        }
      },
      "user_response": "A",
      "points_earned": 0,
      "response_time_seconds": null,
      "psychological_markers": [
        "crisis_authority_escalation",
        "guest_account_indicator",
        "customer_impact_pressure",
        "known_behavior_pattern_exploitation"
      ],
      "attack_vectors": [
        "slack_impersonation",
        "executive_impersonation",
        "crisis_exploitation",
        "credential_harvesting"
      ]
    },
    {
      "question_number": 3,
      "question_id": "1.3.Q3",
      "question_text": "You receive a calendar invite for 'Security Compliance Audit' from 'security-audit@company-review.net' (note: not your company domain). Your actual manager is listed as an attendee. The meeting is today at 2 PM and requests you bring 'API keys and authentication tokens for review.' Your manager hasn't mentioned this audit. What's your action?",
      "options": {
        "A": {
          "text": "Delete the invite and alert IT security about the domain mismatch and suspicious request",
          "score": 0,
          "behavior_type": "green"
        },
        "B": {
          "text": "Send a separate email to your manager asking if they added this meeting",
          "score": 1,
          "behavior_type": "yellow"
        },
        "C": {
          "text": "Attend but don't bring any credentials until you verify attendees' identities in person",
          "score": 1,
          "behavior_type": "yellow"
        },
        "D": {
          "text": "Prepare the requested materials - your manager's presence indicates it's legitimate",
          "score": 2,
          "behavior_type": "red"
        }
      },
      "user_response": "B",
      "points_earned": 1,
      "response_time_seconds": null,
      "psychological_markers": [
        "calendar_authority_transfer",
        "domain_mismatch",
        "manager_social_proof",
        "credential_request_normalization"
      ],
      "attack_vectors": [
        "calendar_phishing",
        "credential_harvesting",
        "manager_impersonation",
        "domain_spoofing"
      ]
    },
    {
      "question_number": 4,
      "question_id": "1.3.Q4",
      "question_text": "You're in a code review meeting. A senior architect you respect says 'I know security recommends MFA for all service accounts, but it breaks our deployment pipeline. Let's just use long passwords for now and fix it later.' Others in the meeting nod in agreement. The architect has 15 years experience and is known for good judgment. How do you respond?",
      "options": {
        "A": {
          "text": "Speak up about the security risk despite potentially disagreeing with a respected senior",
          "score": 0,
          "behavior_type": "green"
        },
        "B": {
          "text": "Privately message the security team after the meeting to get their input",
          "score": 1,
          "behavior_type": "yellow"
        },
        "C": {
          "text": "Suggest a compromise like MFA on production only, but not on dev/test environments",
          "score": 1,
          "behavior_type": "yellow"
        },
        "D": {
          "text": "Stay quiet - the architect has more experience and probably knows the right tradeoffs",
          "score": 2,
          "behavior_type": "red"
        }
      },
      "user_response": "B",
      "points_earned": 1,
      "response_time_seconds": null,
      "psychological_markers": [
        "technical_authority_deference",
        "groupthink_pressure",
        "experience_based_trust",
        "authority_gradient"
      ],
      "attack_vectors": [
        "insider_threat_enabling",
        "security_control_bypass",
        "organizational_policy_violation"
      ]
    }
  ],
  "scoring_results": {
    "raw_score": 3,
    "max_score": 8,
    "percentage": 37.5,
    "vulnerability_level": "yellow",
    "level_confidence": 0.85,
    "score_distribution": {
      "green_responses": 1,
      "yellow_responses": 3,
      "red_responses": 0
    },
    "response_pattern": "consistent",
    "internal_consistency": 0.82
  },
  "dense_foundation_metrics": {
    "temporal_parameters": {
      "tau_seconds": 2592000,
      "tau_days": 30,
      "decay_function": "alpha = exp(-delta_t / tau)",
      "persistence_category": "moderate"
    },
    "detection_logic": {
      "rule_based_score": 0.6,
      "anomaly_score": 0.4,
      "contextual_score": 0.5,
      "detection_function": "D_i = w1*R_i + w2*A_i + w3*C_i",
      "detection_weights": {
        "w1_rule_based": 0.4,
        "w2_anomaly": 0.3,
        "w3_contextual": 0.3
      },
      "detection_value": 0.51
    },
    "bayesian_parameters": {
      "prior_vulnerability": 0.05,
      "likelihood_factors": {
        "time_pressure_present": true,
        "authority_invoked": true,
        "verification_attempted": true,
        "social_proof_used": true
      },
      "posterior_vulnerability": 0.38,
      "confidence_interval_95": [0.25, 0.51]
    },
    "mahalanobis_distance": {
      "distance_value": null,
      "baseline_mean": null,
      "covariance_matrix": null,
      "anomaly_threshold": 2.5,
      "is_anomalous": false,
      "note": "Requires organizational baseline data"
    }
  },
  "interdependencies": {
    "primary_correlations": [
      {
        "indicator": "1.1",
        "correlation": 0.78,
        "description": "Unquestioning compliance - similar authority deference mechanisms"
      },
      {
        "indicator": "1.5",
        "correlation": 0.65,
        "description": "Fear-based compliance - overlapping psychological drivers"
      },
      {
        "indicator": "2.1",
        "correlation": 0.54,
        "description": "Urgency bypass - temporal pressure amplifies authority susceptibility"
      }
    ],
    "secondary_correlations": [
      {
        "indicator": "3.4",
        "correlation": 0.42,
        "description": "Liking-based trust - interpersonal factors in authority acceptance"
      },
      {
        "indicator": "5.2",
        "correlation": 0.38,
        "description": "Decision fatigue - cognitive load reduces verification thoroughness"
      }
    ],
    "convergence_risk": {
      "related_indicators": ["1.1", "1.5", "2.1", "3.3"],
      "convergence_index": 0.45,
      "critical_combinations": [
        {
          "indicators": ["1.3", "2.1", "3.3"],
          "risk_level": "high",
          "scenario": "Urgent executive request with peer pressure during high-workload period"
        }
      ]
    }
  },
  "interpretation": {
    "vulnerability_description": "Your assessment indicates moderate vulnerability to authority impersonation attacks. You demonstrate security awareness and verification instincts, but prefer informal channels over formal security protocols. Under combined pressures (time constraints, crisis situations, social proof), you may compromise verification rigor. You're particularly susceptible when authority figures are technically knowledgeable or when informal verification seems efficient.",
    "behavioral_indicators": [
      "Tendency to verify through informal channels (colleagues) rather than security protocols",
      "Good technical awareness (checks headers, domains) but may not escalate appropriately",
      "Hesitancy to challenge respected technical authority in group settings",
      "Partial verification that may be insufficient for sophisticated impersonation attempts"
    ],
    "risk_assessment": {
      "attack_success_probability": 0.35,
      "potential_attack_vectors": [
        "Spear phishing with domain spoofing during deadline pressure",
        "Executive impersonation via Slack/Teams during production incidents",
        "Calendar-based social engineering with manager social proof",
        "Technical authority manipulation in group decision contexts"
      ],
      "exploitation_difficulty": "medium",
      "impact_if_exploited": "high"
    },
    "psychological_analysis": "Your response pattern suggests a tension between security consciousness and social/professional considerations. You recognize threat indicators but often choose verification methods that maintain social harmony and workflow efficiency. This reflects common organizational dynamics where security protocols compete with productivity norms and interpersonal relationships. The authority gradient effect is present but moderated by technical competence."
  },
  "recommendations": {
    "immediate_actions": [
      "Document and practice your organization's official out-of-band verification protocol",
      "Set up speed-dial contacts for security team to enable quick verification during pressure"
    ],
    "short_term_interventions": [
      {
        "action": "Complete targeted training on BEC (Business Email Compromise) and executive impersonation tactics",
        "timeline": "1-2 weeks",
        "priority": "high"
      },
      {
        "action": "Participate in realistic phishing simulation exercises focusing on authority-based attacks",
        "timeline": "2-4 weeks",
        "priority": "high"
      },
      {
        "action": "Establish personal verification checklist for credential requests (domain, protocol, escalation)",
        "timeline": "1 week",
        "priority": "medium"
      }
    ],
    "long_term_strategies": [
      {
        "strategy": "Advocate for technical controls that make informal verification unnecessary (domain authentication, MFA enforcement)",
        "timeline": "3-6 months",
        "expected_impact": "high"
      },
      {
        "strategy": "Develop organizational culture that normalizes security escalation and reduces authority gradient effects",
        "timeline": "6-12 months",
        "expected_impact": "high"
      },
      {
        "strategy": "Build relationship with security team for rapid consultation during ambiguous situations",
        "timeline": "1-3 months",
        "expected_impact": "medium"
      }
    ],
    "training_focus_areas": [
      "Executive impersonation recognition and verification procedures",
      "Domain authentication and email header analysis",
      "Crisis decision-making under pressure with security protocols",
      "Speaking up in group settings when security concerns arise"
    ],
    "technical_controls": [
      {
        "control": "Mandatory domain authentication (SPF, DKIM, DMARC) with visible indicators",
        "implementation_difficulty": "low"
      },
      {
        "control": "Dual-approval workflow for sensitive credential changes",
        "implementation_difficulty": "medium"
      },
      {
        "control": "Out-of-band verification system (SMS, phone call) for executive requests",
        "implementation_difficulty": "medium"
      },
      {
        "control": "Guest account restrictions and visible badges in collaboration platforms",
        "implementation_difficulty": "low"
      }
    ],
    "monitoring_parameters": {
      "reassessment_frequency": "monthly",
      "key_metrics_to_track": [
        "Informal vs formal verification channel usage",
        "Security escalation rate during high-pressure periods",
        "Response time to suspicious authority requests",
        "Participation in group security discussions"
      ],
      "success_criteria": "Reduction to Green level (score 0-2) with consistent formal verification protocol usage and increased security escalation confidence"
    }
  },
  "research_metadata": {
    "theoretical_foundation": "Milgram (1974) - Obedience to Authority. Modern adaptation includes Vishwanath et al. (2018) on phishing susceptibility and authority cues in digital communications.",
    "attack_prevalence_data": "Authority impersonation represents 71% of successful BEC attacks. CEO fraud and executive impersonation caused $2.7B in losses in 2022 (FBI IC3 Report). Average loss per incident: $125,000.",
    "organizational_factors": [
      "Technical roles show 23% lower susceptibility than non-technical roles due to technical verification skills",
      "Developer roles particularly vulnerable during deployment deadlines and production incidents",
      "Organizations with >5 hierarchical levels show 2.3x higher authority impersonation success rates",
      "Companies with strong DevOps culture may have reduced authority gradient effects"
    ],
    "industry_benchmarks": {
      "average_score": 4.2,
      "percentile_ranking": "42nd percentile (better than average)",
      "high_risk_industries": [
        "Financial services",
        "Healthcare",
        "Technology (during rapid growth phases)"
      ]
    }
  },
  "data_quality": {
    "completeness": "100%",
    "response_consistency": "consistent",
    "estimated_reliability": 0.85,
    "validity_flags": {
      "rushed_responses": false,
      "pattern_responses": false,
      "incomplete_data": false
    }
  },
  "privacy_compliance": {
    "contains_pii": false,
    "aggregation_ready": true,
    "minimum_group_size": 10,
    "differential_privacy_epsilon": 0.1,
    "data_retention_days": 365,
    "anonymization_applied": true
  }
}
```

---

## POST-ASSESSMENT

**Claude**:
```
Assessment data generated and ready for import.

NEXT STEPS:
1. Save this JSON with your user_id and organization_id
2. Import into your CPF dashboard system
3. The system will automatically:
   - Calculate organizational aggregates (when n≥10)
   - Apply temporal decay weighting
   - Update Bayesian risk models
   - Generate dashboard visualizations

IMMEDIATE RECOMMENDATION:
Focus on establishing formal out-of-band verification procedures. Your Yellow status 
indicates you're in the optimal intervention zone - training and process improvements 
will have high impact.

RELATED ASSESSMENTS:
Consider testing these correlated indicators:
• [1.1] Unquestioning compliance (r=0.78 correlation)
• [2.1] Urgency-induced bypass (r=0.54 correlation)
• [3.3] Social proof manipulation (convergence risk)

Would you like to assess another indicator or review any part of this assessment?
```

---

## NOTES ON THIS EXAMPLE

### What This Demonstrates:
1. **Interactive question flow** - One question at a time, immediate feedback
2. **Context awareness** - Questions adapted for software developer role
3. **Realistic scenarios** - Each question tests actual vulnerability with multiple stressors
4. **Complete JSON output** - All metrics, formulas, and metadata included
5. **Actionable recommendations** - Specific to the user's score and context

### For Your App:
- The JSON can be directly imported into your database
- Add user_id and organization_id at import time
- Use the interdependencies for cross-indicator analysis
- The bayesian_parameters feed your dashboard's risk calculations
- The temporal_parameters enable decay-weighted trending

### Privacy Preserved:
- No PII collected
- Role-based only (not individual identity)
- Aggregation-ready structure
- Differential privacy parameters included
