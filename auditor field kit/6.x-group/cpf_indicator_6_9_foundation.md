# INDICATOR 6.9: Organizational Splitting

## PSYCHOLOGICAL FOUNDATION

### Core Mechanism

Organizational splitting represents the unconscious psychological defense mechanism where organizations divide complex, anxiety-provoking realities into simplified "all good" or "all bad" categories. Rooted in Melanie Klein's object relations theory (1946), splitting occurs when the cognitive and emotional complexity of managing security threats becomes overwhelming, leading to defensive simplification that creates systematic blind spots.

In cybersecurity contexts, splitting manifests as the unconscious division of the threat landscape into idealized internal actors (trusted employees, familiar systems) versus demonized external threats (sophisticated hackers, foreign adversaries). This binary thinking prevents organizations from recognizing the nuanced reality that most security incidents involve complex interactions between internal vulnerabilities and external exploitation.

The splitting mechanism operates below conscious awareness, making it particularly insidious. Organizations experiencing high splitting will exhibit extreme trust in certain actors or systems while projecting all threat onto external sources, creating exploitable vulnerabilities that technical controls cannot address.

### Research Basis

**Kleinian Object Relations Theory:** Klein (1946) identified splitting as a primitive defense mechanism where the ego cannot tolerate ambivalence about objects that are both good and bad. In organizational contexts, this translates to an inability to hold the anxiety-provoking reality that trusted insiders can pose security risks while external threats may not always be as sophisticated as feared.

**Group Dynamics Research:** Bion (1961) demonstrated how groups under anxiety adopt basic assumptions that distort reality. The dependency assumption (baD) leads to idealization of protective figures, while the fight-flight assumption (baF) externalizes all threats, both contributing to organizational splitting patterns.

**Neuroscience Validation:** Modern neuroscience supports Klein's observations, with amygdala activation creating rapid categorization of stimuli as threatening or safe (LeDoux, 2000). Under stress, the brain's tendency toward binary categorization increases, making splitting more likely during security incidents or high-pressure periods.

**Organizational Defense Research:** Menzies Lyth (1960) documented how institutions develop "social defense systems" against anxiety that can interfere with primary tasks. In cybersecurity, splitting serves as a collective defense against the overwhelming anxiety of constant threat, but creates systematic vulnerabilities.

### Cognitive/Emotional Triggers

**Anxiety Overload:** When the complexity of the threat landscape becomes cognitively overwhelming, splitting provides psychological relief through simplification. Organizations facing sophisticated attacks often split to reduce anxiety rather than maintain complex threat models.

**Identity Protection:** Splitting protects organizational identity by externalizing threats. Acknowledging insider risks or system vulnerabilities threatens the organization's self-concept as competent and secure, triggering defensive splitting.

**Cognitive Dissonance:** When evidence contradicts existing beliefs (trusted employee exhibiting suspicious behavior), splitting resolves dissonance by categorizing the evidence as "external manipulation" rather than questioning internal trust assumptions.

**Authority Relationships:** Hierarchical structures amplify splitting through idealization of leadership while projecting failures onto external factors. This maintains authority relationships but creates blind spots to insider threats from privileged users.

## CYBERSECURITY IMPACT

### Primary Attack Vectors

**Trusted Insider Exploitation:** Splitting creates exploitable blind spots around insider threats. Organizations exhibiting high splitting will have inadequate monitoring of privileged users, insufficient access controls for trusted personnel, and weak detection of gradual privilege escalation by internal actors.

**Social Engineering via Trust Transfer:** Attackers exploit splitting by positioning themselves within the "trusted" category through rapport building, authority impersonation, or association with known entities. Once categorized as "trusted," normal security scrutiny is bypassed.

**Lateral Movement Exploitation:** High splitting environments assume that once inside the perimeter, actors are trustworthy. This enables extensive lateral movement, as internal network security is often weaker due to implicit trust assumptions.

**Supply Chain Infiltration:** Organizations with strong splitting patterns are vulnerable to supply chain attacks, as trusted vendor relationships receive insufficient scrutiny. The "trusted partner" designation can mask sophisticated infiltration attempts.

### Historical Incidents

The CPF framework identifies splitting as a contributing factor in major breaches:

**Edward Snowden Case:** Extreme trust in cleared personnel created blind spots that enabled massive data exfiltration. The organization's splitting mechanism prevented adequate monitoring of privileged insiders.

**Target Breach (2013):** Trust in HVAC vendor credentials enabled network access that was exploited for payment system infiltration. The splitting between "trusted vendors" and "external threats" created the vulnerability.

**SolarWinds Attack (2020):** Organizations' trust in software update processes and established vendors enabled widespread compromise. Splitting between "trusted software sources" and "external threats" prevented adequate scrutiny of update mechanisms.

### Technical Failure Points

**Inadequate Insider Threat Detection:** Organizations with high splitting invest heavily in perimeter defense while maintaining minimal internal monitoring capabilities, creating technical blind spots.

**Weak Identity and Access Management:** Splitting leads to excessive trust in role-based access controls without adequate monitoring of how those roles are used, enabling privilege abuse.

**Insufficient Zero Trust Implementation:** The splitting mindset fundamentally conflicts with zero trust principles, leading to incomplete implementations that maintain "trusted zones."

**Alert Bias:** Security operations centers in high-splitting environments may dismiss or deprioritize alerts involving internal actors, focusing disproportionately on external threat indicators.

## ORGANIZATIONAL DYNAMICS

### Structural Amplifiers

**Hierarchical Organizations:** Steep hierarchies amplify splitting through idealization of senior leadership and externalization of security failures. C-suite executives may be exempt from security controls while blame is projected onto external threats.

**Silo Structures:** Departmental boundaries create splitting between "security-conscious" and "business-focused" units, with each projecting security responsibility onto the other while maintaining idealized views of their own practices.

**Vendor Relationship Structures:** Long-term vendor relationships often become idealized, creating blind spots to supply chain risks. "Trusted partner" status can persist despite changing threat landscapes or vendor security postures.

**Cultural Homogeneity:** Organizations with strong cultural uniformity are more susceptible to collective splitting, as dissenting voices that might challenge binary thinking are less likely to be heard or valued.

### Cultural Variations

**High-Trust Cultures:** Organizations emphasizing trust and relationship-building (common in family businesses or certain cultural contexts) show greater vulnerability to splitting-based attacks, as challenging trust assumptions creates cultural dissonance.

**Military/Government:** These sectors often exhibit institutional splitting between "cleared" and "uncleared" personnel, creating exploitable vulnerabilities when cleared individuals are compromised or become malicious insiders.

**Technology Companies:** May split between "technical elite" (idealized) and "business users" (viewed as security risks), missing sophisticated attacks that exploit technical personnel's privileged access.

**Financial Services:** Often exhibit splitting between "front office" (revenue-generating, idealized) and "back office" (cost centers, potential security risks), creating vulnerabilities in high-value business units.

### Role-Based Patterns

**Executive Leadership:** Most vulnerable to idealization, often exempt from standard security controls. This creates significant risk when executives are targeted or compromised.

**IT/Security Personnel:** May be split as either "security heroes" (idealized) or "business obstacles" (demonized), both creating vulnerabilities through over-trust or under-cooperation respectively.

**Long-term Employees:** Often idealized due to tenure, creating blind spots to insider threats from personnel who may become disgruntled or compromised over time.

**External Consultants:** May be categorized as either "trusted advisors" (excessive access) or "external threats" (excessive restrictions), both creating security vulnerabilities.

## ASSESSMENT CONSIDERATIONS

### Observable Indicators

**Language Patterns:** High splitting manifests in absolute language about threats ("all hackers are external," "our people would never..."), lack of nuanced threat discussion, and consistent externalization of security incidents.

**Resource Allocation:** Disproportionate investment in perimeter security versus insider threat detection, minimal monitoring of privileged user activity, and resistance to zero trust implementations.

**Incident Response Patterns:** Consistent attribution of security incidents to external sophisticated attackers while minimizing internal contributing factors, reluctance to investigate insider involvement.

**Policy Exceptions:** Frequent security policy exceptions for "trusted" individuals or systems, different security standards for different organizational levels, and resistance to uniform security controls.

### Detection Challenges

**Unconscious Nature:** Splitting operates below conscious awareness, making it difficult to identify through direct questioning. Organizations exhibiting splitting genuinely believe their trust assessments are rational.

**Cultural Reinforcement:** Organizational cultures often reward trust and loyalty while discouraging suspicion, making it difficult to surface splitting patterns without appearing to undermine organizational values.

**Defense Mechanism:** When splitting is challenged, organizations may respond with increased defensiveness, making assessment more difficult and potentially triggering stronger splitting as a protective response.

**Measurement Sensitivity:** Individuals may not accurately self-report splitting behaviors due to social desirability bias and the unconscious nature of the mechanism.

### Measurement Opportunities

**Behavioral Analysis:** Aggregate patterns in access control decisions, incident response attribution, and resource allocation can reveal splitting without individual profiling.

**Policy Analysis:** Review of security policies and exception patterns can identify systematic splitting in organizational decision-making.

**Incident Pattern Analysis:** Historical analysis of how incidents are investigated and attributed can reveal splitting patterns in organizational responses.

**Survey Instruments:** Carefully designed instruments can identify organizational splitting through scenario-based questions and pattern recognition rather than direct self-assessment.

## REMEDIATION INSIGHTS

### Psychological Intervention Points

**Anxiety Reduction:** Addressing the underlying anxiety that drives splitting through improved threat intelligence, clearer communication about actual risk levels, and realistic security messaging can reduce defensive splitting.

**Cognitive Complexity Training:** Training programs that help personnel hold complex, ambiguous threat models rather than requiring binary categorization can build resilience against splitting.

**Group Process Facilitation:** Working with organizational groups to identify and process splitting patterns can reduce their unconscious influence on security decision-making.

**Leadership Modeling:** Senior leaders who demonstrate comfort with security complexity and acknowledge insider risks can help reduce organizational splitting patterns.

### Resistance Factors

**Identity Protection:** Organizations resist recognizing splitting because it threatens their self-concept as competent and secure. Remediation efforts must be careful not to trigger increased defensive responses.

**Cultural Values:** Splitting often aligns with stated organizational values (trust, loyalty, teamwork), making it difficult to address without appearing to undermine core cultural principles.

**Anxiety Management:** If splitting is serving an anxiety management function, removing it without providing alternative anxiety management mechanisms may increase organizational stress and resistance.

**Power Dynamics:** Splitting often protects existing power structures by idealizing leadership and externalizing failures. Those benefiting from these dynamics may resist change.

### Success Indicators

**Increased Nuance:** Successful remediation shows in more nuanced discussions of threats, acknowledgment of insider risks alongside external threats, and complex rather than binary threat models.

**Uniform Security Standards:** Reduction in security policy exceptions, more consistent application of controls across organizational levels, and implementation of zero trust principles.

**Balanced Resource Allocation:** More balanced investment between perimeter security and insider threat detection, increased monitoring of privileged user activity.

**Incident Response Evolution:** More comprehensive incident investigations that consider internal factors, reduced automatic attribution to external sophisticated actors, and learning-oriented rather than blame-oriented post-incident processes.

**Organizational Learning:** Increased ability to learn from security incidents without defensive responses, more open discussion of vulnerabilities, and integration of lessons learned into security practices.

---

This foundation brief provides the theoretical and practical understanding necessary to assess, detect, and address organizational splitting as a cybersecurity vulnerability, enabling development of targeted assessment tools and intervention strategies.