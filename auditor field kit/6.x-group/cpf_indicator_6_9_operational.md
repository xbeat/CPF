## INDICATOR 6.9: Organizational Splitting

### CONTEXT

Organizational splitting occurs when organizations unconsciously divide security threats into oversimplified "trusted internal" versus "dangerous external" categories. This binary thinking creates dangerous blind spots by over-trusting insiders and systems while projecting all risk onto external attackers. Organizations experiencing splitting exhibit extreme trust in certain actors (long-term employees, vendors, executives) while attributing security failures exclusively to sophisticated external threats, making them vulnerable to insider attacks and social engineering.

### ASSESSMENT

**Question 1 - Incident Attribution Process**
When your organization experiences a security incident or breach, what is your standard process for determining the root cause? Tell us about a specific recent incident and how the investigation concluded.

**Question 2 - Insider Threat Monitoring**
How often does your organization actively monitor the activities of privileged users (administrators, executives, long-term employees) for potential security risks? What specific monitoring tools or processes are in place for internal personnel?

**Question 3 - Security Policy Exceptions**
What is your procedure when senior executives, long-term employees, or trusted vendors request exceptions to standard security policies? Give us a recent example of such a request and how it was handled.

**Question 4 - Access Control Decision-Making**
How does your organization determine access levels for different personnel categories (executives, IT staff, regular employees, contractors, vendors)? Tell us about your specific process and any differences in security requirements between these groups.

**Question 5 - Resource Allocation Balance**
What percentage of your security budget is allocated to external threat detection (firewalls, perimeter security) versus internal threat monitoring (user behavior analytics, insider threat detection)? Provide specific budget breakdowns.

**Question 6 - Vendor Security Assessment**
How frequently does your organization reassess the security practices of long-term, trusted vendors or partners? Give us an example of when you last changed security requirements for an established vendor relationship.

**Question 7 - Zero Trust Implementation**
To what extent has your organization implemented zero trust security principles (verify every user and device, regardless of location or perceived trust level)? Tell us specifically which systems or personnel are exempt from verification requirements and why.

### SCORING

**Green (0): Balanced Trust Assessment**
- All security incidents undergo comprehensive investigation including internal factors
- Active monitoring systems track all privileged user activities regardless of role or tenure  
- Security policies apply uniformly with documented, limited exceptions requiring formal approval
- Similar access controls and verification requirements for all personnel categories
- Balanced security budget allocation (minimum 30% focused on insider threat detection)
- Regular security reassessments of all vendors including trusted partners
- Comprehensive zero trust implementation with minimal exceptions

**Yellow (1): Moderate Splitting Indicators**
- Most incidents investigated thoroughly but some automatic external attribution
- Privileged user monitoring exists but with gaps for certain "trusted" categories
- Security policy exceptions granted regularly but with some oversight process
- Different security standards exist for different personnel tiers with documented rationale
- Budget allocation shows preference for perimeter security but some insider threat investment
- Vendor assessments occur but less frequently for established relationships
- Partial zero trust implementation with exceptions for certain systems or roles

**Red (2): High Splitting Vulnerability**
- Security incidents consistently attributed to external attackers without internal investigation
- Minimal or no monitoring of privileged users, especially executives or long-term employees
- Frequent security policy exceptions for "trusted" personnel with minimal oversight
- Significantly different security standards based on perceived trust levels
- Security budget heavily focused on external threats (less than 20% on insider threat detection)
- Established vendor relationships rarely reassessed for security
- Zero trust principles rejected or implemented with major exceptions for "trusted" entities

### RISK SCENARIOS

**Trusted Insider Data Theft**
Employees with idealized status (executives, long-term staff, privileged IT personnel) exploit their trusted position to exfiltrate sensitive data over extended periods. Minimal monitoring of their activities enables gradual privilege escalation and data theft that goes undetected until significant damage occurs, as seen in cases like Edward Snowden.

**Social Engineering via Trust Transfer**
Attackers exploit the organization's splitting tendency by positioning themselves as "trusted" through impersonation of authority figures, established vendors, or internal personnel. Once categorized as trustworthy, they bypass normal security scrutiny and gain access to sensitive systems, similar to the Target breach where trusted vendor credentials enabled network infiltration.

**Supply Chain Infiltration**
Organizations with strong splitting patterns fail to adequately scrutinize trusted vendor relationships, enabling sophisticated supply chain attacks. Attackers compromise trusted partners or software providers to gain access to the target organization, exploiting the "trusted partner" blind spot as demonstrated in the SolarWinds attack.

**Lateral Movement Exploitation**
Once inside the network perimeter, attackers exploit the organization's implicit trust assumptions to move laterally across systems. High splitting environments assume internal network traffic is trustworthy, enabling extensive reconnaissance and data access before detection occurs.

### SOLUTION CATALOG

**Behavioral Analytics Implementation**
Deploy user and entity behavior analytics (UEBA) systems that monitor all personnel activities regardless of role or tenure. Implement baseline behavior modeling for privileged users, automated anomaly detection for unusual access patterns, and risk scoring for all internal actors. Establish clear escalation procedures for behavioral anomalies.

**Zero Trust Architecture Deployment**
Implement comprehensive zero trust principles requiring verification for all users and devices regardless of perceived trust level. Deploy multi-factor authentication for all system access, micro-segmentation of network resources, and continuous authentication for sensitive operations. Eliminate security policy exceptions based on role or tenure.

**Insider Threat Program Development**
Establish formal insider threat program with dedicated personnel and resources. Implement psychological evaluation for high-risk positions, regular security awareness training focused on insider risks, peer reporting mechanisms for concerning behaviors, and structured investigation processes for internal incidents.

**Incident Response Process Enhancement**
Revise incident response procedures to mandate comprehensive investigation of all security events including internal factors. Implement structured root cause analysis requiring examination of both external attack vectors and internal vulnerabilities. Establish independent incident review processes to prevent attribution bias.

**Access Control Matrix Standardization**
Develop standardized access control matrices applying consistent security requirements across all personnel categories. Implement regular access reviews for all privileged accounts, automated provisioning and deprovisioning processes, and documented justification requirements for any access exceptions. Establish role-based access controls with principle of least privilege.

**Vendor Risk Management Program**
Create comprehensive vendor risk management program with regular security assessments of all partners regardless of relationship duration. Implement continuous monitoring of vendor security postures, contractual security requirements for all vendors, and incident response coordination procedures. Establish vendor access controls with time-limited permissions.

### VERIFICATION CHECKLIST

**For Behavioral Analytics:**
- Request documentation of UEBA system deployment and configuration
- Review sample behavioral baselines and anomaly detection reports  
- Observe monitoring dashboard and alert management processes
- Verify inclusion of all privileged users in monitoring scope
- Check incident response procedures for behavioral anomalies

**For Zero Trust Implementation:**
- Review network architecture diagrams showing micro-segmentation
- Test multi-factor authentication requirements across different systems
- Verify continuous authentication mechanisms for sensitive operations
- Document any remaining trust-based access exceptions and justifications
- Observe authentication flows for different user categories

**For Insider Threat Program:**
- Review program charter and dedicated staffing assignments
- Examine insider threat risk assessment methodologies
- Review training materials and delivery records for insider threat awareness
- Verify reporting mechanisms and investigation procedures
- Check integration with HR and security incident response processes

**For Enhanced Incident Response:**
- Review incident response playbooks for investigation requirements
- Examine recent incident reports for internal factor analysis
- Verify independent review processes and personnel assignments  
- Check root cause analysis templates and completion requirements
- Review incident attribution patterns over previous 12 months

**For Access Control Standardization:**
- Review access control matrices and approval workflows
- Examine access review procedures and completion records
- Verify automated provisioning/deprovisioning system configuration
- Check documentation requirements for access exceptions
- Test least privilege implementation across different roles

**For Vendor Risk Management:**
- Review vendor risk assessment schedules and completion records
- Examine security requirement clauses in vendor contracts
- Verify vendor access control and monitoring mechanisms
- Check vendor incident response coordination procedures
- Review vendor security posture monitoring processes

### SUCCESS METRICS

**Insider Threat Detection Rate**
Measure the percentage of internal security incidents detected through proactive monitoring versus reactive discovery. Target improvement from baseline to 80% proactive detection within 90 days. Monitor monthly and assign responsibility to security operations team.

**Policy Exception Frequency**
Track the number of security policy exceptions granted monthly, categorized by requestor type and justification. Target 50% reduction in trust-based exceptions within 90 days. Monitor weekly and assign responsibility to compliance team.

**Incident Attribution Balance**
Measure the percentage of security incidents with comprehensive internal factor analysis versus external-only attribution. Target 100% comprehensive analysis within 60 days. Monitor per incident and assign responsibility to incident response team.