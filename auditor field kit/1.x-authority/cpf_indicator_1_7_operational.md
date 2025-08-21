## INDICATOR 1.7: Deference to Technical Authority Claims

### CONTEXT
This indicator measures how readily employees comply with requests from individuals claiming technical expertise without proper verification. When people encounter complex technical problems beyond their knowledge, they often bypass normal security protocols and defer to anyone who sounds technically competent. Attackers exploit this by impersonating IT support, vendors, or technical consultants to gain system access, credentials, or sensitive information.

### ASSESSMENT

**Question 1**: How often do your employees receive unsolicited technical support calls, emails, or visits from people claiming to be from IT vendors, consultants, or support services? What's your current monthly average?

**Question 2**: What's your standard procedure when someone claiming to be technical support contacts an employee directly requesting passwords, system access, or permission to install software? Walk us through the exact steps.

**Question 3**: Tell us about a recent example where someone contacted your organization claiming technical authority (IT support, vendor, consultant, etc.). How did your staff handle it and what verification steps were taken?

**Question 4**: What's your policy for employees who receive technical requests that seem urgent or time-sensitive? How do you balance speed with security verification?

**Question 5**: How do your non-technical employees (admin staff, executives, HR) verify if someone claiming to be IT support or a technical vendor is legitimate? Give us your specific verification process.

**Question 6**: When legitimate external technical support needs access to your systems, what approval workflow do they go through? Who authorizes access and how quickly?

**Question 7**: Tell us about your employee training on recognizing fake technical support scams. When was the last training and what specific scenarios did it cover?

### SCORING

**Green (0)**: Organization has mandatory verification protocols for all technical support contacts, employees consistently use callback verification to known numbers, and there's documented evidence of refused suspicious technical requests within the last 6 months.

**Yellow (1)**: Basic verification procedures exist but aren't consistently followed, some employees bypass verification under time pressure, or verification protocols only apply to certain types of technical requests but not others.

**Red (2)**: No formal verification process for technical support contacts, employees routinely comply with technical requests without verification, or recent incidents show successful social engineering through technical impersonation.

### RISK SCENARIOS

**Fake IT Support Credential Harvesting**: Attacker calls employees claiming to be IT support needing to "verify their password" for a system update. Without verification protocols, employees provide credentials, giving attackers immediate network access and ability to move laterally through systems.

**Malicious Software Installation**: Scammer poses as software vendor offering "urgent security patch" via email or phone. Employees with technical deference install malware disguised as legitimate software, creating persistent backdoors and data exfiltration capabilities.

**Help Desk Social Engineering**: Attacker calls internal help desk claiming to be an employee who forgot their password and needs urgent system access for a client deadline. Help desk staff, wanting to provide good service, reset credentials without proper identity verification, giving attackers elevated system privileges.

**Vendor Impersonation Data Theft**: Fraudster contacts organization claiming to be from a known technology vendor conducting a "security audit" or "compliance check." Employees provide sensitive system information, network diagrams, or database access, enabling sophisticated targeted attacks and intellectual property theft.

### SOLUTION CATALOG

**Technical Authority Verification Protocol**: Implement mandatory callback verification system where any unsolicited technical support contact must be verified by calling the claimed organization's main number and requesting transfer to the specific person. Create laminated reference cards with verification steps for all employee workstations.

**Technical Request Authorization Workflow**: Deploy digital approval system requiring supervisor and IT security approval for any external technical support requests. Include automated notifications, approval tracking, and mandatory 24-hour delay for non-emergency technical access requests.

**Centralized Technical Support Log**: Establish single point of contact (IT helpdesk or security team) that logs all external technical support interactions. Require all employees to immediately report any unsolicited technical contacts to this central team for verification and response coordination.

**Technical Impersonation Simulation Training**: Conduct quarterly simulated technical support calls and emails targeting different employee groups. Track compliance with verification protocols and provide immediate feedback. Focus scenarios on pressure tactics, urgency claims, and technical jargon that commonly bypass critical thinking.

**Vendor Authentication Database**: Create secure, searchable database of legitimate technical vendors, support contact numbers, and authorized personnel. Include photos and verification questions that only real support staff would know. Make accessible to all employees through company intranet.

**Technical Request Documentation Standard**: Require written documentation (email or ticket system) for all technical support interactions, including verification steps taken, approvals received, and actions performed. Implement monthly audit of technical support logs to identify patterns and improve procedures.

### VERIFICATION CHECKLIST

**Process Documentation**: Request copies of technical support verification procedures, callback protocols, and approval workflows. Verify procedures include specific steps, required documentation, and clear escalation paths.

**Training Records Review**: Examine training attendance logs, simulation exercise results, and employee acknowledgment forms for technical authority awareness training. Look for consistent participation and recent delivery dates.

**Incident Documentation**: Review security incident reports, help desk tickets, and IT logs for evidence of technical impersonation attempts and organizational response. Check for lessons learned and process improvements implemented.

**Policy Implementation Audit**: Observe actual technical support interactions, interview employees about verification procedures, and test knowledge through scenario questions. Verify policies exist in written form and are accessible to all staff.

**System Access Controls**: Examine approval workflows in IT service management systems, review vendor access logs, and verify technical support requests go through documented approval processes with appropriate delays and authorizations.

### SUCCESS METRICS

**Technical Verification Compliance Rate**: Measure percentage of technical support contacts that go through proper verification protocols. Target 95% compliance within 90 days, measured through monthly audit of help desk logs and employee incident reports.

**Suspicious Contact Reporting Frequency**: Track number of reported suspicious technical support contacts per month. Increase in reporting indicates improved awareness and detection capability. Target 20% increase in reported suspicious contacts within 60 days.

**Technical Authority Simulation Success Rate**: Conduct monthly simulated technical impersonation attempts and measure employee compliance with verification protocols. Target reduction in simulation success rate from baseline to under 10% within 90 days of implementation.