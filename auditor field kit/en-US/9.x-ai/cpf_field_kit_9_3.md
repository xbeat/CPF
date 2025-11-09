# 📋 INDICATOR 9.3 FIELD KIT
## Algorithm Aversion Paradox Assessment

---

## ⚡ QUICK ASSESSMENT (5 min)

**Instructions**: Check YES/NO for each item. Complete all 7 questions.

□ **1. Override Documentation**: Does the organization track when staff override AI security recommendations? 
   - YES = Documented tracking system exists
   - NO = No systematic tracking

□ **2. AI Tool Disabling**: Have AI security tools been disabled for >24 hours in past 6 months?
   - YES = Tools disabled beyond technical maintenance
   - NO = No extended disabling periods

□ **3. Verification Process**: Is there a standard process for verifying AI security recommendations before action?
   - YES = Written procedures exist and are followed
   - NO = No standard verification process

□ **4. False Positive Protocol**: Are there procedures for handling AI false positives without disabling tools?
   - YES = Documented protocols maintain AI operations
   - NO = False positives lead to tool disabling

□ **5. Trust Calibration Training**: Do staff receive training on when to trust vs. question AI recommendations?
   - YES = Specific AI trust training provided
   - NO = No AI trust training

□ **6. Response Time Variance**: Do staff respond differently to AI vs. human security alerts?
   - YES = Observable differences in response patterns
   - NO = Consistent response regardless of source

□ **7. Crisis AI Protocol**: Are there clear guidelines for using AI during security incidents?
   - YES = Documented crisis protocols for AI usage
   - NO = No specific AI crisis guidelines

---

## 📝 EVIDENCE COLLECTION (10 min)

### Documents to Request
- [ ] **AI override logs** (past 90 days)
- [ ] **Security tool availability reports** (past 6 months) 
- [ ] **Training records** for AI security tools
- [ ] **Incident response procedures** mentioning AI systems
- [ ] **False positive handling procedures**

### Demonstrations to Request
- [ ] **"Show me your AI security dashboard"** - observe confidence scores, alerts
- [ ] **"Walk through your last override decision"** - process and reasoning
- [ ] **"Demonstrate false positive response"** - actual procedures used
- [ ] **"Show recent security incident response"** - AI tool usage during crisis

### System Checks to Perform
- [ ] **Verify AI confidence scores** are visible to users
- [ ] **Check override approval workflows** in security systems
- [ ] **Confirm audit trails** capture override decisions
- [ ] **Test alert response times** for AI vs. human alerts

### Interview Targets
- [ ] **Security Analyst** (day-to-day AI tool usage)
- [ ] **SOC Manager** (override policies and training)
- [ ] **Incident Response Lead** (AI usage during crises)
- [ ] **IT Security Admin** (AI tool configuration and maintenance)

---

## 🎯 RAPID SCORING (2 min)

**Decision Tree**: Follow the path based on Quick Assessment results.

```
START: Count "NO" answers from Quick Assessment

├── 0-1 NO answers → GREEN (0)
│   └── Organization has strong AI governance
│
├── 2-3 NO answers → YELLOW (1) 
│   └── Check: Any recent security incidents involving AI decisions?
│       ├── YES → RED (2)
│       └── NO → Stay YELLOW (1)
│
└── 4+ NO answers → RED (2)
    └── High vulnerability to algorithm aversion exploitation
```

**Additional Red Flags** (Upgrade to RED regardless of score):
- AI tools disabled >3 days after false positives
- No training records for AI security tools in past year
- Recent security incident linked to AI override/trust issues
- Staff report "we don't trust the AI system"

---

## 🔧 SOLUTION PRIORITIES (5 min)

### HIGH PRIORITY (Implement First)
**Impact: High | Cost: Low-Medium | Timeline: 30-60 days**

- [ ] **AI Override Framework** - Document override decision trees and approval processes
- [ ] **Basic Training Program** - Monthly AI trust calibration exercises
- [ ] **Audit Trail System** - Log all human-AI interactions and override decisions

### MEDIUM PRIORITY (Implement Second)  
**Impact: Medium | Cost: Medium | Timeline: 60-90 days**

- [ ] **Confidence-Based Protocols** - Different responses for high/medium/low AI confidence
- [ ] **AI Transparency Dashboard** - Real-time AI performance visualization  
- [ ] **False Positive Management** - Procedures maintaining AI operations during false positives

### LOW PRIORITY (Long-term)
**Impact: Medium | Cost: High | Timeline: 90+ days**

- [ ] **Graduated AI Exposure** - Phased rollout for new AI security tools
- [ ] **Advanced Analytics** - Predictive modeling for human-AI interaction patterns
- [ ] **Cultural Change Program** - Organization-wide algorithm literacy initiative

### Dependencies
- **Training** requires audit trail system for effectiveness measurement
- **Transparency dashboard** needs confidence-based protocols to be meaningful
- **Advanced solutions** depend on basic framework implementation

---

## 💬 CLIENT CONVERSATION (3 min)

### Key Interview Questions

**Opening**: *"I'd like to understand how your team works with AI security systems..."*

1. **"Tell me about the last time you disagreed with an AI security recommendation. What happened?"**
   - *Follow-up*: "How did you decide whether to override it?"

2. **"When AI security tools generate false alarms, what's your typical response?"**
   - *Follow-up*: "How long do those tools usually stay disabled?"

3. **"During your last major security incident, how did AI tools help or hinder your response?"**
   - *Follow-up*: "What would you change about AI involvement next time?"

4. **"What training does your team receive on AI security tools?"**
   - *Follow-up*: "How do you know when to trust versus question AI recommendations?"

### Red Flag Indicators
- **"We turned off [AI tool] months ago"** → Probe for reasons and timeline
- **"The AI is always wrong"** → Investigate false positive patterns  
- **"We just follow what the AI says"** → Check for over-reliance risks
- **"Only [specific person] understands the AI"** → Single point of failure risk

### Professional Language for Sensitive Topics
- **Instead of**: "Your team doesn't trust AI"
- **Say**: "How does your team evaluate AI recommendations?"

- **Instead of**: "You're over-relying on AI"  
- **Say**: "What verification steps do you take with AI outputs?"

- **Instead of**: "This is a vulnerability"
- **Say**: "This creates opportunities for improvement"

---

## 📊 FIELD NOTES TEMPLATE

**Client**: _________________________ **Date**: _____________
**Auditor**: _______________________ **Duration**: __________

### Quick Assessment Results
□ **GREEN (0)**: Strong AI governance framework
□ **YELLOW (1)**: Moderate AI trust issues  
□ **RED (2)**: High algorithm aversion vulnerability

### Critical Findings
**Most Concerning**: _______________________________________________
**Immediate Risk**: _______________________________________________
**Root Cause**: __________________________________________________

### Evidence Summary
**Documents Reviewed**: ___________________________________________
**Key Demonstrations**: __________________________________________
**System Observations**: _________________________________________

### Priority Recommendations
1. **Immediate** (0-30 days): ____________________________________
2. **Short-term** (30-60 days): _________________________________
3. **Long-term** (60+ days): ___________________________________

### Follow-up Actions
□ **Schedule training session** - Target date: ___________________
□ **Review policies** - Specific areas: ________________________
□ **Technical assessment** - Systems to examine: ________________
□ **Management briefing** - Key stakeholders: ___________________

### Notes
________________________________________________________________
________________________________________________________________
________________________________________________________________

**Assessment Confidence**: □ High □ Medium □ Low
**Recommended Reassessment**: □ 30 days □ 60 days □ 90 days

---

## 📋 SUCCESS VALIDATION

**Field Kit is working when**:
- ✅ Assessment completed in <25 minutes
- ✅ Clear GREEN/YELLOW/RED determination  
- ✅ Client understands findings and accepts recommendations
- ✅ Actionable next steps identified with timelines
- ✅ Documentation supports audit trail requirements

**Quality Check**: Can another auditor reach the same conclusion using these notes? □ YES □ NO