# CPF INDICATOR 3.1: RECIPROCITY EXPLOITATION

## CONTEXT

Reciprocity exploitation leverages the psychological pressure people feel to "return favors" when someone provides help, gifts, or services. This automatic response bypasses security thinking and creates a vulnerability window where employees grant access, share information, or bypass protocols because they feel obligated to reciprocate. Attackers systematically exploit this by offering seemingly helpful services, free resources, or assistance before requesting security-compromising actions in return.

## ASSESSMENT QUESTIONS

1. **Gift and Favor Policy**: What is your organization's written policy regarding accepting gifts, meals, or services from vendors, clients, or unknown parties? How is this policy communicated and enforced?

2. **IT Support Requests**: How often do employees receive unsolicited offers for IT help, free software, or technical assistance from external sources? What's your procedure when staff report these offers? *Tell us your specific example of how this was handled recently.*

3. **Vendor Relationship Management**: Describe a recent situation where a vendor or external party provided your organization with free services, information, or resources. What follow-up requests did they make, and how were these handled?

4. **Security Exception Processes**: How frequently are security policies bypassed or exceptions granted after external parties provide help or favors? What approval process exists for these exceptions? *Give us a specific recent example.*

5. **Employee Response Training**: When was the last time your staff received training on recognizing and responding to quid pro quo social engineering attempts? What specific scenarios were covered?

6. **Reciprocal Business Practices**: How does your organization typically respond when clients, vendors, or partners offer unexpected benefits, discounts, or "special deals"? What verification steps are required before accepting?

7. **Incident Tracking**: Have you experienced any security incidents in the past year that began with someone offering help, free services, or gifts? *Describe the most significant example and how it was discovered.*

## SCORING CRITERIA

**Green (0): Low Vulnerability**
- Written gift/favor policy with enforcement mechanisms and regular training
- Mandatory cooling-off period (24-48 hours) between receiving benefits and granting any requests
- All unsolicited offers routed through security team for evaluation
- Zero security exceptions granted without multi-level approval following received favors

**Yellow (1): Moderate Vulnerability**
- Gift policy exists but limited enforcement or training
- Some informal processes for handling unsolicited offers but not consistently applied
- Occasional security exceptions granted after favors with single-level approval
- Basic awareness training covers reciprocity but no specific scenario practice

**Red (2): High Vulnerability**
- No formal gift/favor policy or widely ignored existing policy
- Employees regularly accept unsolicited help, gifts, or services without reporting
- Security exceptions commonly granted immediately following received favors
- No training on reciprocity-based social engineering or last training over 2 years ago

## RISK SCENARIOS

**Quid Pro Quo IT Support**: Attacker calls offering to fix computer problems or update security software, then requests remote access credentials or asks employee to install "diagnostic tools" (malware) as reciprocation for the help.

**USB Gift Campaigns**: Branded USB drives containing malware are distributed as "gifts" at conferences or mailed to employees. Recipients feel obligated to use the devices or at minimum plug them in to "see what's on there," triggering malware execution.

**Vendor Intelligence Trading**: External parties provide valuable industry reports, competitive intelligence, or regulatory updates, then leverage reciprocity pressure to request internal company data, client lists, or system access as "information exchange."

**Executive Assistance Exploitation**: Attackers target executive assistants by offering helpful services (calendar management, travel planning, event coordination), then exploit reciprocity pressure to gain access to executive communications, schedules, or secure facilities.

## SOLUTION CATALOG

**1. Reciprocity Recognition Training**
- Implement quarterly scenario-based training specifically on quid pro quo attacks
- Include role-playing exercises where employees practice declining reciprocal requests
- Provide scripted responses for politely deferring requests after receiving favors
- Create "reciprocity radar" quick reference cards for common manipulation tactics

**2. Mandatory Delay Protocol**
- Institute 48-hour cooling-off period between receiving any unsolicited benefit and making security-related decisions
- Require all external offers of help/gifts/services to be reported to security team within 24 hours
- Implement approval workflow that prevents immediate reciprocal responses
- Create exception process requiring manager and security team dual approval

**3. Gift and Favor Management System**
- Deploy centralized system for logging all gifts, favors, and unsolicited offers received
- Set monetary thresholds requiring automatic security review ($25+) and rejection ($100+)
- Create vendor relationship protocols requiring formal agreements before accepting any benefits
- Implement quarterly audits of gift acceptance patterns by department and individual

**4. Technical Controls for Quid Pro Quo Prevention**
- Block USB auto-run functionality on all endpoints to prevent gift USB malware
- Implement email filtering to quarantine messages offering free software, services, or suspicious help
- Deploy endpoint detection rules to flag installation of software following external contact
- Create network segmentation preventing "helpful" external parties from accessing internal systems

**5. Alternative Reciprocity Channels**
- Establish formal vendor appreciation programs that don't compromise security
- Create structured processes for expressing gratitude without granting access or exceptions
- Develop reciprocal value offerings that maintain relationships without security risk
- Implement corporate social responsibility programs as alternative reciprocity outlets

**6. Escalation and Reporting Framework**
- Create simple reporting mechanism for suspicious reciprocity-based approaches
- Establish clear escalation paths when employees feel pressured to reciprocate
- Implement protection for employees who report reciprocity manipulation attempts
- Develop feedback loop to share lessons learned from reciprocity-based incidents

## VERIFICATION CHECKLIST

**Policy Documentation Review**
- Request current gift and favor acceptance policies
- Verify policy includes specific reciprocity guidance and thresholds
- Check for evidence of policy updates within past 12 months
- Confirm policy distribution records and acknowledgment signatures

**Process Observation**
- Shadow front-desk staff during vendor/visitor interactions for one day
- Observe IT support ticket handling when external help is offered
- Review recent security exception requests for reciprocity patterns
- Audit email systems for blocked quid pro quo attempts

**Training Validation**
- Review training curriculum for reciprocity-specific content
- Check attendance records for reciprocity training completion rates
- Conduct spot interviews with 5-10 employees about reciprocity recognition
- Test employee responses to simulated quid pro quo scenarios

**System Configuration Review**
- Verify USB auto-run is disabled across all endpoints
- Check email filtering rules for quid pro quo attack patterns
- Review endpoint detection configurations for suspicious software installation
- Audit network access logs for external "helper" connection attempts

## SUCCESS METRICS

**1. Reciprocity Incident Reduction Rate**
- Baseline: Number of security incidents preceded by gifts/favors in past 12 months
- Target: 75% reduction in reciprocity-based security incidents within 6 months
- Measurement: Monthly incident analysis with reciprocity pattern identification

**2. Policy Compliance Improvement**
- Baseline: Current gift policy violation rate and unreported favor acceptance
- Target: 90% compliance with gift reporting requirements within 90 days
- Measurement: Quarterly compliance audits and anonymous self-reporting surveys

**3. Employee Recognition Speed**
- Baseline: Average time to identify reciprocity-based manipulation in simulated scenarios
- Target: 50% improvement in recognition speed within 3 months of training
- Measurement: Monthly phishing simulations incorporating quid pro quo elements