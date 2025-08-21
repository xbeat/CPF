# CPF INDICATOR 2.5: Hyperbolic Discounting of Future Threats

## CONTEXT

Organizations systematically undervalue future security threats compared to immediate operational concerns, following a psychological pattern where delayed benefits are exponentially discounted. This creates vulnerability because attackers exploit predictable planning blind spots, targeting systems during low-preparation periods and using "slow burn" attacks that escalate below detection thresholds. The result is chronic underinvestment in preventive security measures while overreacting to immediate threats.

## ASSESSMENT QUESTIONS

1. **Security Budget Allocation**: What percentage of your annual cybersecurity budget is allocated to immediate threat response versus future threat prevention? Tell us your specific breakdown and provide an example of a recent budget decision where you chose immediate response over long-term prevention.

2. **Patch Management Timing**: When critical security patches are released, how often are they delayed due to concerns about immediate operational disruption? Describe your most recent example where a security patch was postponed and explain the reasoning.

3. **Emergency vs. Planned Security Spending**: In the past 12 months, how many times did you make emergency security purchases compared to planned security investments? Give us a specific example of your most recent emergency security purchase and what drove that decision.

4. **Long-term Security Planning**: What is the longest time horizon you use for security strategic planning, and how often do these plans get shortened or modified due to immediate business pressures? Tell us about a recent instance where long-term security plans were altered for immediate concerns.

5. **Legacy System Management**: How do you decide when to modernize or retire legacy systems with known security vulnerabilities? Provide a specific example of a legacy system in your environment and explain why it hasn't been upgraded despite known risks.

6. **Security Training Investment**: When budget constraints occur, which gets cut first: immediate security tools or future-focused security training and awareness programs? Give us your most recent example of this type of budget decision.

7. **Incident Response vs. Prevention**: After a security incident, do you typically invest more in preventing similar immediate threats or in comprehensive long-term security improvements? Tell us about your response to your most recent security incident as a specific example.

## SCORING CRITERIA

**Green (0) - Low Vulnerability:**
- 60%+ of security budget allocated to prevention/long-term measures
- Security patches implemented within documented SLA (typically 72 hours for critical)
- Emergency security spending <20% of total annual security spending
- Strategic security planning horizon ≥2 years with <25% plan modifications
- Documented legacy system retirement roadmap with timelines
- Security training protected even during budget cuts
- Post-incident investments include both immediate and long-term improvements

**Yellow (1) - Moderate Vulnerability:**
- 40-60% of security budget on prevention/long-term measures  
- Some security patches delayed but with documented business justification
- Emergency security spending 20-40% of total annual spending
- 1-2 year planning horizon with 25-50% plan modifications
- Legacy systems identified but retirement timeline unclear
- Security training reduced during budget constraints but not eliminated
- Post-incident response primarily immediate with some long-term elements

**Red (2) - High Vulnerability:**
- <40% of security budget on prevention/long-term measures
- Regular patch delays due to operational concerns without formal risk assessment
- Emergency security spending >40% of total annual spending
- <1 year planning horizon or >50% plan modifications due to immediate pressures
- No clear legacy system retirement strategy
- Security training first to be cut during budget constraints
- Post-incident response almost entirely focused on immediate threat containment

## RISK SCENARIOS

**Scenario 1: Advanced Persistent Threat (APT) Exploitation**
Attackers identify organizations with poor long-term planning patterns and establish persistent access during predictable low-security periods (budget cycles, holiday seasons). They gradually escalate privileges over months while the organization remains focused on immediate operational concerns, ultimately resulting in complete data exfiltration or ransomware deployment during peak business periods.

**Scenario 2: Supply Chain Temporal Attack**
Cybercriminals compromise third-party vendors knowing that target organizations defer supply chain security assessments due to immediate integration pressures. The attack activates 12-18 months later when the organization has become dependent on the compromised vendor, maximizing impact while exploiting the temporal disconnect between procurement and security validation.

**Scenario 3: Regulatory Compliance Cascade Failure**
Organizations consistently defer compliance-related security investments until regulatory deadlines approach. Attackers time their attacks to coincide with these high-pressure compliance periods when security teams are overwhelmed with immediate requirements, unable to address evolving threats, resulting in both security breaches and regulatory violations.

**Scenario 4: Infrastructure Modernization Exploitation**
Attackers target legacy systems that organizations maintain due to immediate migration costs versus future security benefits. These systems become increasingly vulnerable over time while patches are delayed for operational stability, ultimately providing attackers with entry points into modern infrastructure through lateral movement from compromised legacy systems.

## SOLUTION CATALOG

**Solution 1: Temporal Security Budget Allocation Framework**
- **Implementation**: Establish mandatory minimum allocation (50%) for future-focused security investments with board-level approval required for reallocation
- **Process**: Quarterly budget reviews with "future threat impact assessment" requirement for any prevention budget cuts
- **Technology**: Implement budget tracking system with automated alerts when reactive spending exceeds thresholds
- **Verification**: Budget allocation reports, approval workflows, alert system demonstrations

**Solution 2: Structured Patch Management with Business Impact Weighting**
- **Implementation**: Deploy automated patch management system with risk-based prioritization that includes future threat intelligence
- **Process**: Mandatory 48-hour patch assessment period with documented business justification required for delays beyond 7 days
- **Technology**: Patch management tools integrated with threat intelligence feeds and automated testing environments
- **Verification**: Patch deployment reports, business justification documentation, testing environment validation

**Solution 3: Long-term Security Planning with Temporal Bias Controls**
- **Implementation**: Establish 3-year rolling security roadmaps with quarterly reviews and bias-checking protocols
- **Process**: "Future self" scenario planning exercises and pre-mortem analysis for security investments
- **Technology**: Security roadmap tracking tools with milestone monitoring and deviation alerts
- **Verification**: Planning documents, scenario analysis reports, milestone tracking dashboards

**Solution 4: Legacy System Risk-Based Retirement Program**
- **Implementation**: Create formal legacy system inventory with quantified risk scores and mandatory retirement timelines
- **Process**: Annual legacy system risk assessment with business case requirements for retention beyond 24 months
- **Technology**: Asset management system integrated with vulnerability scanners and risk assessment tools
- **Verification**: System inventories, risk assessments, retirement project plans and timelines

**Solution 5: Anti-Hyperbolic Security Decision Framework**
- **Implementation**: Mandatory decision-making checklist requiring "temporal horizon analysis" for all security investments >$10,000
- **Process**: Devil's advocate review process for security decisions with independent assessment of long-term implications
- **Technology**: Decision support system with temporal bias alerts and historical decision outcome tracking
- **Verification**: Decision documentation, review process records, decision outcome analysis reports

**Solution 6: Balanced Security Metrics Dashboard**
- **Implementation**: Executive dashboard showing both immediate security metrics and long-term security posture indicators
- **Process**: Monthly executive reporting including "temporal security balance scorecard"
- **Technology**: Security metrics platform with predictive analytics and trend analysis capabilities
- **Verification**: Dashboard screenshots, executive reports, metrics calculation methodology documentation

## VERIFICATION CHECKLIST

**Budget Allocation Verification:**
- [ ] Request 3 years of security budget breakdown documents
- [ ] Review board meeting minutes for security budget discussions
- [ ] Examine emergency purchase orders vs. planned security investments
- [ ] Validate budget reallocation approval processes

**Patch Management Verification:**
- [ ] Review patch deployment reports for past 12 months
- [ ] Examine patch delay documentation and business justifications
- [ ] Test patch management system functionality and automation
- [ ] Interview IT operations team about patch prioritization processes

**Planning Process Verification:**
- [ ] Review current security strategic plans and historical revisions
- [ ] Examine planning meeting minutes and decision rationale documentation
- [ ] Validate scenario planning and risk assessment processes
- [ ] Check for evidence of temporal bias mitigation techniques

**Legacy System Management Verification:**
- [ ] Request complete asset inventory with age and vulnerability data
- [ ] Review legacy system business justification documents
- [ ] Examine system retirement project plans and timelines
- [ ] Validate risk assessment methodology for legacy system retention

**Decision Framework Verification:**
- [ ] Review recent security investment decisions and documentation
- [ ] Test decision support tools and temporal bias checking processes
- [ ] Interview decision-makers about temporal consideration processes
- [ ] Examine historical decision outcomes and accuracy tracking

## SUCCESS METRICS

**Temporal Balance Ratio**: Measure the ratio of preventive to reactive security spending, targeting improvement from baseline to 60:40 preventive within 12 months. Monitor monthly through budget tracking systems with quarterly executive reporting.

**Future Threat Response Time**: Track the time from long-term threat identification to security control implementation, targeting 50% reduction in implementation time within 6 months. Measure through security project management systems with monthly progress reviews.

**Planning Horizon Stability**: Monitor the percentage of long-term security plans that remain unchanged due to immediate pressures, targeting <25% plan modification rate within 9 months. Track through strategic planning review processes with quarterly stability assessments.