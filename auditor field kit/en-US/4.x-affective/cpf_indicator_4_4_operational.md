# CPF INDICATOR 4.4: ATTACHMENT TO LEGACY SYSTEMS

## CONTEXT

Organizations develop emotional bonds with legacy systems that extend beyond functional utility, creating psychological resistance to security upgrades and replacements. This attachment manifests when teams treat outdated systems as "too important to change" despite known vulnerabilities, leading to extended attack windows and increased breach risk. Legacy system attachment creates blind spots where security teams avoid implementing controls on "trusted" systems, while threat actors specifically target these outdated, under-protected assets.

## ASSESSMENT

**Question 1**: How many systems in your IT environment are currently running past their vendor's official security support lifecycle? Please provide specific examples of your oldest systems still in production.

**Question 2**: What is your standard timeline for replacing systems when vendors end security support? Walk us through your most recent system replacement project and how long it took from decision to deployment.

**Question 3**: How often do legacy systems receive exemptions from your standard security policies (patching schedules, monitoring requirements, access controls)? Give us a recent example where you made such an exemption and why.

**Question 4**: What happens when your security team proposes changes or replacements for critical legacy systems? Describe the typical organizational response and decision-making process.

**Question 5**: How do you handle situations where only one or two people understand how to maintain a legacy system? Tell us about a specific system where you have this knowledge concentration risk.

**Question 6**: What percentage of your IT budget currently goes toward maintaining legacy systems versus investing in replacements? Provide examples of recent budget decisions between legacy maintenance and new system acquisition.

**Question 7**: When you experience security incidents or vulnerabilities on legacy systems, how does your organization typically respond? Give us an example of a recent legacy system security issue and how it was resolved.

## SCORING

**Green (0)**: Organization has documented lifecycle management with automatic replacement triggers when vendor support ends. No systems run past security support lifecycle for more than 6 months. Legacy systems follow same security policies as modern systems. Multiple staff trained on each critical system.

**Yellow (1)**: Some systems run past vendor support but with compensating controls and documented risk acceptance. Occasional exemptions from security policies with formal approval process. Timeline for replacements typically 12-18 months from decision. Some knowledge concentration but succession planning in place.

**Red (2)**: Multiple systems running years past vendor security support. Regular exemptions from security policies without formal risk assessment. Strong organizational resistance to legacy system changes. Critical systems dependent on single individuals. No defined replacement timelines or processes.

## RISK SCENARIOS

**Scenario 1 - Targeted Legacy Exploitation**: Attackers scan for and specifically target known vulnerabilities in unsupported legacy systems, using them as initial compromise points. Organizations delay patching due to "system stability" concerns, providing extended attack windows. Example: 2017 WannaCry ransomware specifically targeted Windows XP systems that organizations kept operational past Microsoft's support end.

**Scenario 2 - Vendor Impersonation Attacks**: Threat actors impersonate legacy system vendors or support contractors, exploiting the trust and dependency relationships organizations have with these systems. Teams bypass normal security verification due to attachment to familiar vendor relationships. This enables social engineering attacks and malicious system access.

**Scenario 3 - Network Lateral Movement**: Legacy systems often receive exemptions from network segmentation and monitoring, creating pathways for lateral movement after initial compromise. Attackers use trusted legacy systems to move through networks undetected, knowing security teams monitor these systems less rigorously.

**Scenario 4 - Maintenance Window Exploitation**: Attackers time attacks during extended maintenance windows when legacy systems are taken offline for updates, knowing that attachment-driven resistance creates infrequent, lengthy maintenance periods. Organizations may restore from outdated backups or skip security updates to minimize "disruption" to beloved systems.

## SOLUTION CATALOG

**Solution 1 - Automated Lifecycle Tracking System**: Implement asset management tools that automatically flag systems approaching end-of-support dates with mandatory replacement planning triggers. System generates reports showing security support status, forces budget planning for replacements 18 months before support ends, and escalates to executive level when systems run past support lifecycle.

**Solution 2 - Legacy System Security Isolation**: Deploy network micro-segmentation and enhanced monitoring specifically for legacy systems that cannot be immediately replaced. Implement additional authentication layers, restrict network access to essential communications only, and deploy specialized monitoring that compensates for system limitations. Create "security wrapper" around legacy systems.

**Solution 3 - Knowledge Transfer Documentation Program**: Establish mandatory documentation and cross-training requirements for all legacy systems. Create detailed runbooks, require at least three staff members trained on each critical system, and implement regular knowledge verification testing. Include legacy system documentation in business continuity planning.

**Solution 4 - Gradual Replacement Planning Process**: Develop phased replacement methodology that treats system transitions as change management projects rather than technical cutover events. Include stakeholder engagement planning, parallel system operations during transitions, and success metric tracking that demonstrates replacement benefits while honoring legacy system contributions.

**Solution 5 - Executive Risk Dashboard**: Create executive-level reporting that translates legacy system risks into business impact terms. Dashboard shows potential financial exposure, regulatory compliance risks, and business continuity threats from legacy system dependencies. Includes competitor comparison showing how legacy dependencies affect market competitiveness.

**Solution 6 - Compensating Controls Framework**: For legacy systems that cannot be immediately replaced, implement standardized compensating controls including enhanced backup procedures, isolated network segments, additional access logging, and incident response procedures specific to legacy system compromises. Document risk acceptance with clear accountability.

## VERIFICATION CHECKLIST

**Asset Management Verification**:
- Request current asset inventory showing all systems and support lifecycle status
- Review replacement planning documents and timelines
- Examine budget allocations for legacy maintenance vs. replacement
- Check for automated alerts or tracking systems for support lifecycle management

**Policy Compliance Verification**:
- Review security policy exemption logs and approval processes
- Audit recent security assessments on legacy systems
- Examine network segmentation and access controls for legacy systems
- Verify monitoring coverage and incident response procedures for legacy systems

**Knowledge Management Verification**:
- Request documentation for critical legacy systems
- Verify cross-training records and knowledge transfer procedures
- Check business continuity plans for legacy system dependencies
- Interview multiple staff members about legacy system operations

**Risk Management Verification**:
- Review risk registers for legacy system risks and mitigation strategies
- Examine incident response history for legacy system security events
- Check executive reporting and dashboard systems for legacy system risk visibility
- Verify compensating controls implementation and effectiveness testing

## SUCCESS METRICS

**Legacy System Reduction Rate**: Measure percentage decrease in systems running past vendor security support lifecycle. Target: 50% reduction within 12 months, elimination of systems more than 2 years past support within 24 months. Track monthly and report quarterly to executive leadership.

**Security Exception Frequency**: Monitor number of security policy exemptions granted to legacy systems and average exemption duration. Target: 25% reduction in exemptions within 6 months, maximum 90-day duration for any security exemption with required renewal justification.

**Knowledge Concentration Risk Score**: Calculate percentage of critical systems dependent on single individuals for operations. Target: Zero single-person dependencies within 18 months, minimum three qualified staff per critical system, verified through quarterly competency testing and documentation reviews.