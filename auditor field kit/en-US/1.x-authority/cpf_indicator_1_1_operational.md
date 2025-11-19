# CPF Indicator 1.1: Unquestioning Compliance with Apparent Authority

## CONTEXT
Employees automatically follow requests from perceived authority figures without verification, bypassing normal security protocols when commands appear to come from executives, IT staff, or other trusted sources. This psychological vulnerability enables attackers to impersonate authority figures and manipulate staff into compromising security controls, transferring funds, or sharing sensitive information. Organizations with rigid hierarchies or high-stress environments amplify this risk significantly.

## ASSESSMENT

1. **Authority Request Verification**: When employees receive unusual requests from executives or IT staff via email/phone, what verification steps are required before taking action? Tell us your specific example of how this worked in your last unusual request.

2. **CEO/Executive Communication Protocols**: How often in the past 6 months have employees processed urgent financial or data requests from senior leadership without using secondary verification channels? Give us a recent example.

3. **IT Support Request Handling**: What's your procedure when someone claiming to be IT support asks employees to disable security software, install programs, or share passwords? Describe a recent incident.

4. **Emergency Override Frequency**: How often do standard security procedures get bypassed when requests come from apparent authority figures claiming emergency status? Provide specific examples from the last quarter.

5. **Cross-Verification Culture**: When employees question unusual authority requests, what typically happens to them organizationally? Tell us about the most recent time someone challenged an authority figure's request.

6. **Vendor/Partner Authority**: What verification process exists when external vendors or business partners request system access or sensitive information? Give us your most recent vendor access example.

7. **New Employee Authority Training**: How do new hires learn to distinguish between legitimate and potentially fraudulent authority requests during their first 90 days? Show us your specific training materials.

## SCORING

**Green (0)**: Multi-channel verification required for all unusual requests; employees regularly verify authority claims without organizational punishment; documented escalation procedures exist and are consistently followed.

**Yellow (1)**: Some verification protocols exist but are bypassed during "emergencies"; occasional verification occurs but inconsistently; mixed organizational messages about challenging authority.

**Red (2)**: No systematic verification requirements; employees report fear of questioning authority figures; frequent emergency bypasses of security protocols; organizational culture punishes questioning of authority requests.

## RISK SCENARIOS

**Business Email Compromise (BEC)**: Attacker impersonates CEO requesting urgent wire transfer to new vendor. Finance staff comply immediately due to perceived executive authority, resulting in $500K+ losses. FBI reports $43B in BEC losses between 2016-2021, with 96% success rate when authority claims aren't verified.

**IT Support Social Engineering**: External attacker poses as internal IT support, requesting employees disable antivirus "for system updates." Multiple employees comply due to technical authority perception, enabling malware deployment across network infrastructure and leading to ransomware incidents.

**Vendor Impersonation Data Breach**: Attacker claims to represent trusted software vendor needing "emergency access" for critical security patches. IT staff grant administrative access without verification, enabling exfiltration of customer databases and intellectual property.

**Regulatory/Compliance Exploitation**: Attacker impersonates external auditor or regulatory official requesting immediate access to sensitive compliance documentation. Staff comply to avoid regulatory penalties, exposing confidential business information and creating competitive disadvantage.

## SOLUTION CATALOG

**Dual-Channel Verification Protocol**: Implement mandatory secondary verification for all unusual requests via different communication channel (phone request requires email confirmation, email request requires phone callback). Deploy automated verification reminders in email systems flagging requests for money, credentials, or system changes.

**Authority Challenge Training Program**: Create "respectful verification" training teaching employees to verify authority claims professionally without organizational relationship damage. Include role-playing scenarios with C-level executives demonstrating proper verification behaviors to normalize the practice organizationally.

**Digital Authority Verification System**: Deploy internal communication platform with verified identity badges/certificates for authority figures. Implement email authentication systems (DMARC, SPF, DKIM) with visual indicators showing external vs. internal communications and verified vs. unverified sender status.

**Emergency Request Workflow Management**: Create formal escalation procedures requiring supervisor approval for any security protocol bypass. Establish "cooling off" periods for emergency requests, requiring 4-hour delays for high-risk changes unless verified through multiple channels.

**Authority Impersonation Simulation Testing**: Conduct quarterly social engineering tests using fabricated authority requests (with legal/HR approval). Measure compliance rates and provide immediate coaching for failed verifications. Track improvement trends across organizational levels.

**Vendor/Partner Authentication Registry**: Maintain centralized database of authorized vendor contacts with verified communication channels. Require all external authority claims to be cross-referenced against verified contact database before granting access or providing information.

## VERIFICATION CHECKLIST

**Documentation Review**: Request verification protocols, emergency override procedures, training materials showing authority verification methods, incident reports from past 12 months showing authority-based social engineering attempts.

**Process Observation**: Observe how unusual requests are handled during normal business operations; verify multi-channel verification actually occurs; check if emergency override procedures are documented and followed; confirm escalation pathways exist and are used.

**System Configuration**: Verify email authentication systems (DMARC/SPF/DKIM) are properly configured; check if communication platforms show sender verification status; confirm vendor contact database exists and is maintained current; validate automated verification reminders are deployed.

**Training Validation**: Review training completion records for authority verification; confirm C-level executives participate in verification demonstrations; verify new employee onboarding includes authority verification training; check if simulated testing results show improvement trends.

## SUCCESS METRICS

**Verification Compliance Rate**: Measure percentage of unusual authority requests that trigger proper verification procedures. Target: 95% compliance within 90 days. Monitor through email system logs, help desk tickets, and quarterly simulation testing. Baseline measurement through historical incident analysis and initial simulation test.

**Authority Challenge Incident Reduction**: Track reduction in successful social engineering incidents involving authority impersonation. Target: 75% reduction in authority-based incidents within 6 months. Measure through security incident reports, phishing simulation results, and employee reporting of suspicious authority claims.

**Emergency Override Justification Quality**: Assess documentation quality and legitimate necessity of security protocol bypasses claimed as emergencies. Target: 90% of overrides have documented business justification and proper approval chain within 90 days. Monitor through override logs and quarterly management review processes.