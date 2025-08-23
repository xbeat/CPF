# CPF INDICATOR 6.7: FIGHT-FLIGHT SECURITY POSTURES

## CONTEXT

Fight-flight security postures occur when organizations unconsciously adopt either aggressive defensive stances (fight) or complete avoidance behaviors (flight) when facing cybersecurity threats. This creates systematic blind spots where organizations either over-invest in perimeter defenses while ignoring internal threats, or avoid security decisions entirely through denial and delegation. These reactive patterns bypass rational risk assessment and create predictable vulnerabilities that attackers can exploit.

## ASSESSMENT

**Question 1**: In the past 12 months, what percentage of your cybersecurity budget was spent on perimeter security (firewalls, intrusion detection, network monitoring) versus internal security (endpoint protection, access controls, data loss prevention)? Tell us your specific budget breakdown.

**Question 2**: When a potential security threat is identified, how long does it typically take your organization to make a decision about response actions? Walk us through a recent example of threat response decision-making.

**Question 3**: How often do security policy exceptions get approved, and what's the typical approval process? Give us a specific example of a recent security exception request and how it was handled.

**Question 4**: Describe your last major security investment decision. What triggered the decision, who was involved, and how long did the process take from initial discussion to implementation?

**Question 5**: When security tools generate alerts or recommendations, what percentage typically get investigated within 48 hours? Tell us about a recent week's alert handling.

**Question 6**: How does your organization handle security discussions in executive meetings? Describe the typical reaction when security issues are raised and provide a recent example.

**Question 7**: What happens when security measures conflict with business operations? Give us a specific example of how such conflicts were resolved in the past 6 months.

## SCORING

**Green (0)**: Balanced security investments (40-60% internal vs perimeter), security decisions made within 5 business days, exception rate below 10% with documented process, evidence-based investment decisions, alert investigation rate above 80%, constructive executive security discussions, structured conflict resolution process.

**Yellow (1)**: Moderately imbalanced investments (30-70% split), security decisions take 1-2 weeks, exception rate 10-25% with informal approvals, mixed rational/reactive investment decisions, alert investigation rate 50-80%, inconsistent executive engagement, ad-hoc conflict resolution.

**Red (2)**: Severely imbalanced investments (over 70% perimeter or under 30% internal), security decisions delayed over 2 weeks or made hastily under pressure, exception rate above 25% or no tracking, purely reactive investment decisions, alert investigation rate below 50%, executives avoid security discussions or react defensively, conflicts resolved by disabling security controls.

## RISK SCENARIOS

**Insider Threat Exploitation**: Fight posture organizations focus intensively on external perimeters while trusted employees operate with excessive privileges and minimal monitoring. A disgruntled employee or compromised insider account can access and exfiltrate sensitive data because internal controls were neglected in favor of "fortress mentality" perimeter defenses.

**Advanced Persistent Threat (APT) Campaigns**: APT actors exploit flight posture organizations by using low-and-slow techniques that avoid triggering the minimal security monitoring in place. These organizations delay threat investigation and response, allowing attackers months or years to establish persistence, move laterally, and complete their objectives.

**Business Email Compromise (BEC) Attacks**: Flight organizations avoid implementing strong email security controls to prevent business disruption, making them vulnerable to social engineering attacks. Fight organizations may block legitimate emails with aggressive filtering while missing sophisticated BEC attacks that don't trigger signature-based detections.

**Supply Chain Compromises**: Both postures create vulnerabilities - fight organizations may hastily cut vendor relationships after minor incidents, disrupting business continuity, while flight organizations avoid vendor security assessments entirely, allowing compromised suppliers to access their networks.

## SOLUTION CATALOG

**Balanced Security Architecture Review**: Conduct quarterly reviews of security spending allocation using a standardized framework that mandates minimum percentages for different security domains (30-40% perimeter, 35-45% internal, 15-25% response/recovery). Create executive dashboards showing investment balance with clear justifications for any deviations from target allocations.

**Security Decision Framework Implementation**: Deploy a structured decision-making process with defined timelines (72-hour initial assessment, 5-day decision deadline, escalation procedures for delays). Include decision criteria matrices that weigh business impact, threat likelihood, implementation complexity, and resource requirements to counteract emotional decision-making.

**Alert Management Optimization**: Implement tiered alert prioritization with automated initial triage, mandatory response timeframes for each tier, and weekly metrics reporting on investigation rates and resolution times. Include alert fatigue monitoring through metrics tracking false positive rates and analyst burnout indicators.

**Executive Security Briefing Protocol**: Establish monthly structured security briefings using standardized formats that present balanced risk information without triggering fight-flight responses. Include both threat landscape updates and security program achievements to maintain constructive engagement.

**Conflict Resolution Process**: Create formal procedures for resolving security-business conflicts within defined timeframes, including risk acceptance documentation, compensating controls identification, and regular review of temporary exceptions to prevent permanent security degradation.

**Security Posture Self-Assessment Tool**: Deploy quarterly self-assessment surveys for security teams and executives to identify fight-flight tendencies early, with results reviewed by external security advisors to provide objective feedback on organizational security stance balance.

## VERIFICATION CHECKLIST

**Security Architecture Review**:
- Request last 12 months of security expenditure reports
- Review security architecture diagrams showing control placement
- Interview security team about investment decision rationale
- Red flag: Over 70% spending in single security domain without documented risk justification

**Decision Framework Implementation**:
- Request documentation of security decision process and timelines
- Review meeting minutes from recent security decisions
- Interview stakeholders about actual versus documented process
- Red flag: Multiple examples of decisions taking weeks without emergency justification

**Alert Management Process**:
- Review SIEM/SOC alert statistics for past 3 months
- Observe alert triage process during site visit
- Interview security analysts about workload and alert quality
- Red flag: Investigation rates below 50% or analysts reporting chronic alert fatigue

**Executive Engagement Quality**:
- Review executive meeting minutes mentioning security topics
- Interview executives about security program perception
- Observe executive security briefing if possible
- Red flag: Pattern of security discussions being deferred, abbreviated, or generating defensive responses

**Conflict Resolution Effectiveness**:
- Request examples of recent security-business conflicts
- Review security exception logs and approval processes
- Interview business stakeholders about security interaction experience
- Red flag: High number of permanent exceptions or pattern of disabling security controls

## SUCCESS METRICS

**Security Investment Balance Ratio**: Measure quarterly percentage allocation across security domains (perimeter/internal/response). Target: Maintain 35-45% internal security spending. Baseline: Current spending distribution. Monitor via security budget reports reviewed by CFO and CISO monthly.

**Security Decision Velocity**: Track average time from threat identification to response decision implementation. Target: 95% of decisions completed within 5 business days. Baseline: Current average decision timeline. Monitor via incident tracking system with monthly executive reporting.

**Alert Investigation Effectiveness**: Monitor percentage of security alerts investigated within 48 hours and false positive reduction rate. Target: 85% investigation rate with <20% false positives. Baseline: Current investigation statistics. Monitor via SIEM dashboards with weekly security team review.