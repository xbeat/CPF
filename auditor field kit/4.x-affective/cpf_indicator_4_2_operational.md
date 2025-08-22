# CPF INDICATOR 4.2: ANGER-INDUCED RISK TAKING

## CONTEXT

Anger-induced risk taking occurs when workplace frustration with security tools, policies, or procedures leads employees to bypass security controls or make risky decisions. When people are angry or frustrated, they prioritize immediate goal achievement over security considerations, creating vulnerabilities that attackers can exploit. This manifests as password sharing during system outages, clicking suspicious links when desperate for solutions, or adopting unauthorized tools to work around perceived obstacles.

## ASSESSMENT

**Question 1: Security Exception Frequency**
How often do employees request exceptions to security policies or procedures? Include requests to bypass VPN, share credentials, use personal devices, or skip authentication steps.
*Tell us your specific example of the most recent security exception request and how it was handled.*

**Question 2: Help Desk Anger Patterns**
What percentage of your security-related help desk tickets contain language indicating frustration, urgency, or complaints about security tools being "broken" or "too slow"?
*Tell us your specific example of a recent frustrated help desk ticket related to security.*

**Question 3: System Outage Responses**
What happens when your primary security tools (VPN, authentication, email security) experience outages or slowdowns? Do employees have authorized alternatives, or do they find their own workarounds?
*Tell us your specific example of how employees responded during your last major security system outage.*

**Question 4: Performance vs Security Conflicts**
How often do employees report that security requirements prevent them from meeting deadlines or performance goals? Include complaints about slow authentication, blocked websites, or restricted software.
*Tell us your specific example of when an employee said security was preventing them from doing their job.*

**Question 5: Policy Violation Clustering**
Do you notice increases in security policy violations following system changes, new security implementations, or high-stress periods (end of quarter, major projects, layoffs)?
*Tell us your specific example of when security violations increased after a particular organizational change or stressful period.*

**Question 6: Shadow IT Adoption**
What unauthorized tools, apps, or services do employees use to work around security restrictions? Include personal cloud storage, messaging apps, or software installations.
*Tell us your specific example of unauthorized technology discovered in your organization and why employees said they needed it.*

**Question 7: Authority-Directed Anger**
How do employees express frustration about security policies in meetings, emails, or informal conversations? Include complaints about IT department, security team, or management mandates.
*Tell us your specific example of negative feedback about security policies and who it was directed toward.*

## SCORING

**Green (0)**: Less than 5% of help desk tickets show frustration language; security exceptions rare (<1/month); employees have clear authorized alternatives during outages; no observable pattern between stress periods and security violations.

**Yellow (1)**: 5-15% of help desk tickets show frustration; monthly security exception requests; some unauthorized workarounds discovered; occasional correlation between organizational stress and policy violations.

**Red (2)**: More than 15% of help desk tickets show anger/frustration; weekly or daily security exception requests; widespread shadow IT usage; clear patterns of increased violations during stress periods; employees openly complain about security in meetings.

## RISK SCENARIOS

**Scenario 1: Frustration-Triggered Phishing**
Attackers monitor social media and company communications for signs of employee frustration with IT systems. They then send targeted phishing emails offering "quick fixes" or "system updates" that bypass the problematic security tool. Angry employees, seeking immediate relief, click malicious links or provide credentials to fake support sites, leading to account compromise and lateral network movement.

**Scenario 2: Credential Sharing Escalation**
During VPN outages or authentication problems, frustrated employees begin sharing passwords or using personal accounts for business tasks. Attackers exploit this by compromising personal accounts (often less secure) or intercepting shared credentials through social engineering, gaining access to corporate systems through legitimate but misused accounts.

**Scenario 3: Shadow IT Data Exposure**
Employees frustrated with slow or restrictive corporate tools adopt unauthorized cloud services, file sharing platforms, or communication apps. These shadow IT solutions often lack enterprise security controls, creating data exposure risks when sensitive information is stored or shared through unmonitored channels that attackers can more easily compromise.

**Scenario 4: Insider Threat Amplification**
Employees angry about security policies or IT department responsiveness become more susceptible to recruitment by malicious actors, or may rationalize their own data theft as justified "payback." Their existing frustration provides psychological justification for violating security policies, turning minor grievances into major insider threat incidents.

## SOLUTION CATALOG

**Solution 1: Frustration-Responsive Help Desk**
Implement help desk ticket analysis that flags frustration language and prioritizes these requests for immediate response. Train help desk staff to acknowledge user frustration, explain security rationale, and provide specific timelines for resolution. Create escalation paths for security-related complaints that reach resolution within 24 hours.

**Solution 2: Transparent Security Communication**
Develop clear, jargon-free explanations for why each security measure exists, including real examples of threats it prevents. Create a "security rationale" database that help desk staff can reference when explaining why certain restrictions are necessary. Send proactive communications before implementing new security measures, explaining the business justification.

**Solution 3: Alternative Access Procedures**
Establish pre-approved emergency procedures for common security tool failures (VPN outages, authentication problems, email security issues). Provide employees with legitimate alternative methods that maintain security while allowing productivity to continue. Document and communicate these procedures clearly before they're needed.

**Solution 4: User Experience Security Audits**
Conduct regular assessments of security tool usability, measuring login times, error rates, and user satisfaction. Prioritize improvements to the most frustrating security processes based on help desk data and user feedback. Implement single sign-on and password managers to reduce authentication friction.

**Solution 5: Stress-Period Security Monitoring**
Increase security monitoring and support during predictable high-stress periods (end of quarter, major launches, system changes). Proactively reach out to departments under pressure to offer security support and prevent policy violations. Temporarily relax non-critical security restrictions during crisis periods while maintaining essential protections.

**Solution 6: Shadow IT Discovery and Integration**
Regularly scan for unauthorized cloud services and applications using cloud access security brokers (CASB) or network monitoring tools. When shadow IT is discovered, engage users to understand their needs and either provide approved alternatives or securely integrate the unauthorized tool rather than simply blocking it.

## VERIFICATION CHECKLIST

**Solution 1 Verification:**
- Review help desk ticket categorization system for frustration indicators
- Observe help desk response times for security-related frustrated tickets
- Check training records for help desk staff on handling frustrated users
- Verify escalation procedures exist and are being used

**Solution 2 Verification:**
- Request copies of security rationale documentation
- Review recent security communications for clarity and business justification
- Check if help desk staff can explain security measures in business terms
- Verify proactive communication process for new security implementations

**Solution 3 Verification:**
- Review documented emergency access procedures
- Test emergency procedures during planned outages
- Verify employee awareness of alternative access methods
- Check that emergency procedures maintain security standards

**Solution 4 Verification:**
- Review security tool performance metrics and user satisfaction surveys
- Observe actual user login processes to identify friction points
- Check implementation status of usability improvements
- Verify single sign-on and password manager deployment

**Solution 5 Verification:**
- Review security monitoring schedules aligned with organizational stress periods
- Check records of proactive outreach during high-stress times
- Verify existence of temporary security policy modifications for crises
- Review incident patterns during stress periods before and after implementation

**Solution 6 Verification:**
- Review CASB or network monitoring reports for unauthorized applications
- Check documentation of shadow IT discovery and resolution processes
- Verify user engagement procedures when unauthorized tools are found
- Review approved alternatives provided for common shadow IT needs

## SUCCESS METRICS

**Metric 1: Frustration-Related Help Desk Reduction**
Baseline: Current percentage of security help desk tickets containing frustration language
Target: 50% reduction in frustration-related security tickets within 90 days
Measurement: Monthly analysis of help desk ticket sentiment using keyword searches for frustration indicators

**Metric 2: Security Exception Request Frequency**
Baseline: Current number of security exception requests per month
Target: 75% reduction in security exception requests within 90 days  
Measurement: Monthly tracking of formal and informal requests to bypass security policies, including reasons provided

**Metric 3: Shadow IT Discovery Rate**
Baseline: Current number of unauthorized applications/services discovered per quarter
Target: 60% reduction in new shadow IT discoveries within 90 days (indicating reduced motivation to find workarounds)
Measurement: Quarterly CASB reports and network monitoring data showing unauthorized application usage