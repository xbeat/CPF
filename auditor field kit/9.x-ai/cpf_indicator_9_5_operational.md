# CPF INDICATOR 9.5: Uncanny Valley Effects

## CONTEXT

Uncanny valley effects occur when users interact with AI systems that appear almost-but-not-quite human, triggering psychological discomfort and trust confusion. This creates cybersecurity vulnerability because users simultaneously trust (due to human-like presentation) and distrust (due to artificial cues) the AI system, compromising normal security decision-making. In organizations, this manifests as inconsistent responses to AI-generated communications, delayed threat recognition, and exploitation by attackers using sophisticated chatbots or deepfakes that deliberately occupy this psychological "uncanny valley."

## ASSESSMENT

1. **How does your organization handle verification when employees receive communications from AI systems or chatbots (customer service bots, automated assistants, etc.)?**
   - Tell us your specific example of a recent AI interaction that required verification.

2. **What's your procedure when employees report feeling "something seems off" about digital communications, even if they can't pinpoint why?**
   - Give us a recent example where an employee had this gut feeling about a message or interaction.

3. **How often do employees ask colleagues to verify whether communications are from humans or AI systems?**
   - Tell us about the last time this happened and how it was handled.

4. **What's your policy for employees who express discomfort or confusion about whether they're interacting with AI systems versus humans in work communications?**
   - Provide a specific example of how your team handled such a situation.

5. **How does your organization train employees to distinguish between legitimate AI security tools and potentially malicious AI-generated communications?**
   - Tell us about your most recent training session or guidance on this topic.

6. **What happens when employees receive video calls or messages that look almost real but something feels "wrong" about the person's appearance or behavior?**
   - Give us an example of how your team would handle a suspicious video communication.

7. **How quickly can employees escalate concerns about AI-human ambiguity in communications to security teams?**
   - Tell us about your escalation process and provide a recent example.

## SCORING

**Green (0)**: Organization has clear procedures for AI-human verification, employees regularly use verification protocols, documented escalation processes exist, and recent examples show effective handling of ambiguous AI interactions.

**Yellow (1)**: Some verification procedures exist but inconsistently applied, employees sometimes seek verification but no formal process, or organization acknowledges the issue but lacks comprehensive response protocols.

**Red (2)**: No formal procedures for AI-human distinction, employees handle ambiguous communications individually without support, no escalation protocols exist, or organization dismisses employee concerns about "uncanny" digital interactions.

## RISK SCENARIOS

1. **AI Impersonation Attack**: Attackers deploy sophisticated chatbots that mimic customer support or HR representatives, using near-human language with subtle artificial cues. Employees, confused by the uncanny presentation, provide sensitive information while feeling uneasy but unable to articulate why. The psychological uncertainty prevents them from following normal verification procedures.

2. **Deepfake Executive Impersonation**: Criminals create video messages from executives requesting urgent financial transfers, deliberately including subtle artificial elements that create uncanny valley effects. Employees experience conflicting trust signals - recognizing the familiar face while sensing something is "wrong" - leading to delayed verification and successful fraud.

3. **Trust Calibration Manipulation**: Attackers expose employees to obviously artificial but helpful AI systems, then switch to sophisticated near-human AI for malicious purposes. The contrast manipulates trust calibration, making the uncanny but malicious AI seem more trustworthy by comparison, bypassing normal security skepticism.

4. **Decision Paralysis Exploitation**: During critical security incidents, attackers flood communication channels with AI-generated messages that trigger uncanny valley responses. The cognitive uncertainty created by trying to distinguish human from AI communications delays incident response, allowing attacks to proceed while security teams struggle with authentication.

## SOLUTION CATALOG

1. **AI Communication Labeling Protocol**
   - Implement mandatory labeling system for all AI-generated communications
   - Deploy technical controls that automatically tag AI messages with clear identifiers
   - Establish verification requirements for any unlabeled communications claiming human origin
   - Create escalation pathway for communications that lack proper AI/human identification

2. **Uncanny Valley Response Training**
   - Develop 20-minute training module teaching employees to recognize and trust their "uncanny" feelings
   - Include practical exercises using examples of legitimate vs. malicious AI communications
   - Train employees to use verification protocols when experiencing psychological discomfort with digital interactions
   - Provide clear scripts for escalating "something feels wrong" concerns to security teams

3. **Two-Channel Verification System**
   - Establish policy requiring verification through separate communication channel for any high-stakes requests
   - Implement technical system that automatically prompts verification for financial, access, or sensitive data requests
   - Create simple process for employees to quickly verify human identity through alternative means
   - Deploy phone or in-person verification requirements for unusual requests, regardless of source authenticity

4. **Psychological Safety Protocols**
   - Create formal process for employees to report "uncanny" or uncomfortable digital interactions without judgment
   - Establish security team response procedure for investigating ambiguous AI-human communications
   - Implement policy protecting employees who escalate based on intuitive concerns rather than technical evidence
   - Deploy rapid-response system for employees experiencing confusion about communication authenticity

5. **AI Interaction Baseline Monitoring**
   - Deploy system to monitor patterns in employee responses to AI communications
   - Establish baseline metrics for normal AI interaction behaviors (response times, verification requests, escalations)
   - Create alerts for unusual patterns that might indicate uncanny valley exploitation
   - Implement automated detection for communication patterns that typically trigger uncanny valley responses

6. **Enhanced Authentication for Ambiguous Communications**
   - Deploy multi-factor verification system triggered by employee uncertainty reports
   - Implement biometric or behavioral authentication for video/audio communications when requested
   - Create technical controls that flag communications exhibiting uncanny valley characteristics
   - Establish secure verification codes or phrases for confirming human identity in suspicious interactions

## VERIFICATION CHECKLIST

**AI Communication Labeling Protocol:**
- Request examples of AI-labeled communications from past 30 days
- Verify technical implementation of automatic AI tagging systems
- Review escalation logs for unlabeled communication reports
- Test system by requesting demonstration of labeling process

**Uncanny Valley Response Training:**
- Review training materials and completion records for all employees
- Interview random employees about their understanding of uncanny valley responses
- Request examples of recent escalations based on "gut feeling" concerns
- Verify availability and clarity of escalation scripts

**Two-Channel Verification System:**
- Review policy documentation requiring dual-channel verification
- Test system by simulating high-stakes request to observe automatic prompting
- Examine logs of verification activities from past quarter
- Verify alternative verification methods are functional and accessible

**Psychological Safety Protocols:**
- Review documentation of formal reporting processes for uncomfortable interactions
- Interview security team about their response procedures for ambiguous communications
- Examine records of escalations based on intuitive concerns vs. technical evidence
- Test rapid-response system by simulating employee uncertainty report

**AI Interaction Baseline Monitoring:**
- Review monitoring system configuration and baseline metrics
- Examine alert logs for unusual AI interaction patterns
- Verify detection capabilities for uncanny valley communication characteristics
- Request demonstration of monitoring dashboard and alert notifications

**Enhanced Authentication:**
- Test multi-factor verification system triggered by uncertainty reports
- Verify functionality of biometric/behavioral authentication for video/audio
- Review technical controls flagging uncanny valley characteristics
- Test secure verification codes or phrases with sample interactions

## SUCCESS METRICS

1. **Verification Protocol Utilization Rate**: Measure percentage of ambiguous AI communications that trigger verification procedures. Target 80% improvement in verification usage within 90 days, with baseline established through current employee surveys and system logs.

2. **Uncanny Valley Escalation Response Time**: Track time from employee uncertainty report to security team investigation completion. Target reduction to under 30 minutes for initial response and 2 hours for investigation completion, measured through ticketing system timestamps.

3. **False Trust Incident Reduction**: Monitor incidents where employees inappropriately trusted AI-generated communications due to human-like presentation. Target 70% reduction in such incidents within 90 days, measured through security incident reports and employee feedback surveys.
