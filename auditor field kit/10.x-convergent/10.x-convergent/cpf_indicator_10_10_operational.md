# INDICATOR 10.10: Hysteresis Security Gaps

## CONTEXT

Hysteresis security gaps occur when organizations maintain security practices based on past conditions rather than current threats, creating a dangerous mismatch between protective measures and actual risks. This "security inertia" happens because organizations become psychologically attached to historical security decisions, continuing outdated approaches even when circumstances have fundamentally changed. Attackers exploit this predictable organizational behavior by studying past security patterns and timing attacks when historical practices create the largest gaps in current protection.

## ASSESSMENT

**Question 1: Security Policy Review Frequency**
How often does your organization formally review and update its core security policies to ensure they address current threats rather than historical ones? Tell us your specific example of a recent policy update and what triggered it.

**Question 2: Legacy System Management**
What is your process for identifying and retiring security tools or practices that are no longer effective? Give us a recent example of a security system or practice you discontinued and why.

**Question 3: Threat Model Evolution**
How frequently do you reassess your organization's threat model to ensure it reflects current rather than historical attack patterns? Describe your most recent threat model update and what changes were made.

**Question 4: Security Investment Decisions**
When making security budget decisions, what percentage of your analysis focuses on current threat intelligence versus maintaining existing security investments? Tell us about your last major security investment decision and the factors that influenced it.

**Question 5: Incident Response Adaptation**
How often do you update your incident response procedures based on new attack types rather than historical incidents? Give us an example of how you modified your response procedures after encountering a novel attack pattern.

**Question 6: Security Training Currency**
What percentage of your security training content addresses threats that have emerged in the past 18 months versus established historical threats? Tell us about your most recent training update and what new threats it addressed.

**Question 7: Architecture Evolution**
How do you ensure your security architecture adapts to business changes rather than maintaining historical configurations? Describe a recent example where you modified your security architecture due to changing business needs.

## SCORING

**Green (0): Adaptive Security Posture**
- Security policies reviewed and updated at least quarterly with documented threat landscape analysis
- Formal process exists for deprecating outdated security tools/practices with regular reviews
- Threat models updated at least semi-annually with specific analysis of emerging attack patterns
- Security investment decisions include formal analysis of current threat intelligence (>50% weight)
- Incident response procedures updated within 30 days of encountering new attack types
- Security training content includes current threats (>40% of content addresses threats from past 18 months)
- Security architecture has documented change management process tied to business evolution

**Yellow (1): Mixed Adaptation Patterns**
- Security policies reviewed annually or bi-annually with some current threat consideration
- Informal process for managing legacy security tools with irregular reviews
- Threat models updated annually with limited analysis of emerging threats
- Security decisions balance current threats with historical investments (25-50% current threat weight)
- Incident response updates occur within 60-90 days of new attack encounters
- Security training includes some current threats (20-40% addresses recent threats)
- Security architecture changes occur reactively with informal change processes

**Red (2): Historical Security Anchoring**
- Security policies reviewed less than annually or only when required by compliance
- No formal process for retiring outdated security tools/practices
- Threat models unchanged for >18 months or focus primarily on historical attack patterns
- Security decisions primarily based on maintaining existing investments (<25% current threat weight)
- Incident response procedures unchanged despite encountering new attack types
- Security training primarily addresses historical threats (<20% current threat content)
- Security architecture maintained in historical configurations despite business changes

## RISK SCENARIOS

**Scenario 1: Legacy System Exploitation**
Attackers target security systems that should have been retired but remain operational due to organizational inertia. Example: Exploitation of deprecated VPN concentrators that remained in production because "they still work" while new remote access solutions were deployed alongside them, creating multiple attack surfaces with inconsistent security policies.

**Scenario 2: Outdated Threat Model Attacks**
Sophisticated attackers study an organization's historical security focus to identify current blind spots. Example: APT groups exploiting cloud-based attack vectors against organizations whose security monitoring and response procedures still emphasize traditional network perimeter threats, allowing prolonged undetected access.

**Scenario 3: Policy Gap Exploitation**
Attackers exploit gaps between outdated security policies and current business processes. Example: Social engineering attacks that leverage new collaboration tools and workflows that aren't covered by security policies written for traditional office environments, allowing credential harvesting through "approved" communication channels.

**Scenario 4: Training Lag Exploitation**
Attackers use current attack techniques against organizations whose security awareness training focuses on historical threats. Example: Business email compromise attacks using AI-generated content against employees trained primarily on traditional phishing recognition, resulting in successful financial fraud because staff weren't prepared for evolved attack techniques.

## SOLUTION CATALOG

**Solution 1: Automated Security Policy Freshness Monitoring**
Deploy automated scanning tools that compare security policies against current threat intelligence feeds and flag policies that haven't been updated within defined timeframes. Implement policy version control with mandatory review triggers based on threat landscape changes. Include automated alerts when security controls address threats that are no longer prevalent while missing current attack vectors.

**Solution 2: Legacy Security Asset Lifecycle Management**
Establish formal inventory and lifecycle management for all security tools and practices with mandatory sunset dates. Create automated discovery tools that identify security systems not recently updated or configured. Implement quarterly security tool effectiveness reviews that compare current threat coverage against tool capabilities, with automatic decommissioning workflows for ineffective tools.

**Solution 3: Dynamic Threat Model Integration**
Deploy threat intelligence platforms that automatically update organizational threat models based on current attack patterns in similar organizations and industries. Implement regular red team exercises that test current threat model assumptions and identify gaps. Create automated reporting that compares security investment allocation against current threat priorities rather than historical spending patterns.

**Solution 4: Adaptive Incident Response Framework**
Implement incident response platforms that automatically incorporate lessons from recent incidents into standard operating procedures. Deploy machine learning systems that identify when current incidents don't match historical response patterns and trigger procedure updates. Create cross-industry incident sharing that ensures response procedures evolve with attack technique evolution.

**Solution 5: Continuous Security Training Personalization**
Deploy adaptive security training platforms that automatically adjust content based on current threat intelligence and individual risk profiles. Implement micro-learning approaches that deliver current threat awareness in real-time rather than annual training cycles. Create personalized threat simulations based on current attack techniques rather than generic historical scenarios.

**Solution 6: Architecture Evolution Management**
Implement infrastructure-as-code approaches that enable rapid security architecture adaptation to business changes. Deploy automated security architecture scanning that identifies configurations optimized for historical rather than current business processes. Create business-aligned security architecture review processes that trigger automatically when organizational structures or processes change.

## VERIFICATION CHECKLIST

**Policy Freshness Verification:**
- Request security policy update logs and change management records
- Verify integration between threat intelligence feeds and policy review processes
- Observe policy review meetings to confirm current threat consideration
- Check for automated policy freshness monitoring tools and their alert histories

**Legacy System Management Evidence:**
- Review security asset inventory and lifecycle management documentation
- Examine security tool retirement procedures and recent decommissioning examples
- Verify existence of automated security tool discovery and effectiveness assessment
- Observe security architecture review processes and their business alignment triggers

**Threat Model Currency Validation:**
- Request current threat model documentation and compare with threat intelligence sources
- Verify threat intelligence platform integration and update frequency
- Examine recent red team exercise reports and resulting threat model modifications
- Review security investment justifications for current threat landscape alignment

**Adaptation Process Verification:**
- Observe incident response procedure updates and their integration with recent incidents
- Verify security training content analysis and current threat coverage percentages
- Examine architecture change management processes and their business trigger integration
- Review automated monitoring and alerting systems for historical security pattern identification

## SUCCESS METRICS

**Security Adaptation Velocity**
Measure the average time between threat landscape changes and corresponding organizational security adaptations. Target: Reduce adaptation lag time by 50% within 90 days. Monitor through automated threat intelligence correlation with security policy and tool update timestamps.

**Historical Security Debt Reduction**
Track the percentage of security investments addressing current versus historical threats through automated policy and tool analysis. Target: Achieve >70% current threat focus in security investments within 90 days. Measure through quarterly security portfolio analysis comparing threat intelligence priorities with resource allocation.

**Organizational Security Learning Rate**
Monitor the frequency and speed of security practice evolution based on new threat intelligence and incident learning. Target: Implement security updates within 30 days of relevant threat intelligence or incident lessons. Measure through change management system tracking and security effectiveness assessment comparisons.