# INDICATOR 1.10: Crisis Authority Escalation

## CONTEXT

Crisis Authority Escalation occurs when employees automatically grant elevated privileges or bypass security protocols during high-stress situations based solely on authority claims, without proper verification. During crises, people seek quick decisions from authority figures and skip normal security checks due to time pressure and stress. This creates a prime opportunity for attackers to impersonate executives or IT leaders during emergencies to gain unauthorized access to systems and sensitive data.

## ASSESSMENT

**1. Emergency Access Procedures**  
What is your standard procedure when someone claiming to be senior leadership requests immediate system access or security bypasses during an emergency? Tell us your specific example from the last 12 months.

**2. Authority Verification During Crises**  
How often do your employees verify the identity of people requesting emergency assistance or system changes during high-stress situations (system outages, security incidents, compliance deadlines)? What verification steps are required?

**3. Crisis Communication Channels**  
What secure communication methods does your organization use during emergencies, and how do employees confirm they're receiving legitimate crisis communications from authorized personnel?

**4. Break Glass Access Controls**  
How frequently are your "emergency access" or "break glass" procedures used, and what approval process is required before granting these elevated privileges during crisis situations?

**5. Recent Crisis Response Review**  
Give us a recent example of how your organization handled a crisis situation (system outage, security incident, urgent compliance request). What security procedures were followed or bypassed during the response?

**6. Cross-Department Crisis Authority**  
What happens when someone from outside an employee's normal chain of command (different department, external consultant, vendor) requests urgent access or information during an emergency? What's your verification policy?

**7. Employee Crisis Decision Training**  
How often do you train employees on verifying authority and maintaining security protocols during high-stress emergency situations? Tell us about your most recent crisis simulation exercise.

## SCORING

**Green (0): Low Vulnerability**
- Documented emergency procedures require multi-person verification for all elevated access
- Regular crisis simulation training includes authority verification components  
- Secure communication channels with authentication for crisis communications
- Break glass access used less than quarterly with full documentation
- Clear policy requiring verification regardless of claimed authority level

**Yellow (1): Moderate Vulnerability**  
- Emergency procedures exist but allow single-person authorization in some situations
- Crisis training occurs annually but limited focus on authority verification
- Some secure communication channels but gaps in crisis communication security
- Break glass access used monthly with basic approval processes
- Inconsistent verification requirements across departments or situations

**Red (2): High Vulnerability**
- Emergency procedures routinely bypass normal security controls without verification
- No regular crisis training or authority verification training
- Crisis communications primarily through unsecured channels (email, phone calls)
- Break glass access used weekly or more with minimal oversight
- Culture of "don't question authority during emergencies"

## RISK SCENARIOS

**CEO Fraud During System Outages**: Attackers monitor for system outages and send urgent emails from spoofed executive accounts requesting immediate wire transfers or system access, exploiting the chaos when normal verification procedures are suspended.

**Fake IT Emergency Support**: During legitimate security incidents, attackers call employees claiming to be emergency IT contractors hired to resolve the crisis, requesting remote access credentials or system information that they use to expand their attack.

**Regulatory Authority Impersonation**: Attackers pose as regulators demanding immediate compliance actions during manufactured or real regulatory crises, leveraging fear of penalties to gain access to sensitive compliance data and financial systems.

**Insider Threat Amplification**: During organizational crises, malicious insiders exploit relaxed security environments to claim false emergency authority or expand their legitimate authority beyond normal bounds, accessing systems and data typically restricted.

## SOLUTION CATALOG

**Multi-Person Authorization for Emergency Access**: Implement "two-person integrity" requirements for all emergency access grants, where any crisis-related security bypass requires approval from two separate authorized individuals with independent verification of the requestor's identity.

**Crisis Communication Authentication System**: Deploy secure communication platforms with multi-factor authentication for crisis communications, including pre-shared verification codes or phrases that legitimate authority figures use to confirm their identity during emergencies.

**Authority Verification Decision Trees**: Create simple flowcharts posted at workstations and integrated into systems that guide employees through identity verification steps during high-stress situations, including specific contact numbers and verification questions for different authority levels.

**Regular Crisis Authority Simulation**: Conduct quarterly tabletop exercises that include fake authority scenarios mixed with legitimate crisis response training, teaching employees to maintain verification protocols even under pressure while measuring compliance rates.

**Break Glass Access Monitoring**: Implement automated monitoring of emergency access usage with real-time alerts to security teams and mandatory post-incident reviews within 24 hours, including verification that the access was legitimately authorized and appropriately scoped.

**Crisis Response Team Pre-Authentication**: Establish pre-verified crisis response teams with photo identification cards, biometric authentication, or other verification methods that allow rapid but secure identification during actual emergencies, reducing pressure to skip verification steps.

## VERIFICATION CHECKLIST

**Emergency Procedures Documentation**:
- Request copies of documented emergency access procedures
- Verify multi-person authorization requirements exist and are enforced
- Check for specific authority verification steps in crisis response plans
- Review break glass access logs for frequency and approval documentation

**Crisis Communication Security**:
- Observe crisis communication platforms and authentication mechanisms
- Verify secure channels are actually used during drills or recent incidents
- Check for pre-shared authentication codes or verification procedures
- Test employee knowledge of legitimate crisis communication methods

**Training Program Evidence**:
- Review crisis simulation exercise documentation from past 12 months
- Verify authority verification components are included in training materials
- Check attendance records and competency assessments for crisis training
- Observe a crisis drill if possible to assess real-world compliance

**Access Control Implementation**:
- Review break glass access logs and approval workflows
- Verify automated monitoring and alerting systems are operational
- Check post-incident review documentation for emergency access grants
- Test that emergency access actually requires documented approvals

**Policy Consistency Assessment**:
- Interview employees from different departments about crisis procedures
- Verify consistent understanding of authority verification requirements
- Check for department-specific variations in crisis response procedures
- Assess whether verification requirements are culturally supported or resisted

## SUCCESS METRICS

**Emergency Access Compliance Rate**: Measure percentage of emergency access requests that follow proper verification procedures, targeting 100% compliance with multi-person authorization requirements and maintaining detailed logs of all emergency access grants.

**Crisis Simulation Performance**: Track employee compliance with authority verification protocols during quarterly crisis exercises, aiming for 95% proper verification rate even under simulated high-stress conditions with continuous improvement over time.

**Break Glass Access Frequency**: Monitor monthly usage of emergency access procedures, targeting reduction in frequency (indicating better normal access provisioning) while maintaining rapid incident response capabilities when legitimately needed.