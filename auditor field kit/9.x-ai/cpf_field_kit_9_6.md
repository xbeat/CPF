# CPF FIELD KIT 9.6: Machine Learning Opacity Trust

## ⚡ QUICK ASSESSMENT (5 minutes)

**Check YES/NO for each observable indicator:**

□ **AI Decision Logs**: Does the organization maintain documented reasoning for AI security recommendations?
□ **Override Evidence**: Can you find examples of staff overriding AI recommendations in the past 3 months?
□ **Vendor Transparency**: Do AI vendor contracts include explainability requirements?
□ **Verification Process**: Is there a documented process for independently validating AI security decisions?
□ **Staff Training**: Has security staff received training on when to question AI recommendations?
□ **Failure Documentation**: Can the organization describe a recent instance where AI provided incorrect analysis?
□ **Confidence Calibration**: Do staff members regularly seek second opinions on unusual AI recommendations?

**Initial Risk Level**: 
- 6-7 YES = Green (Low Risk)
- 3-5 YES = Yellow (Moderate Risk)  
- 0-2 YES = Red (High Risk)

---

## 📝 EVIDENCE COLLECTION (10 minutes)

### Documents to Request
□ AI security tool audit logs (last 90 days)
□ Staff training records on AI system limitations
□ Vendor contracts for AI security tools
□ Incident reports involving AI system failures
□ Policies for overriding AI recommendations

### System Demonstrations
□ "Show me how AI security recommendations are logged"
□ "Walk through your process for questioning an AI decision"  
□ "Demonstrate how you verify AI threat classifications"
□ "Show examples of staff overriding AI in the past month"

### Interview Targets
□ **Security Analyst**: Daily AI tool usage patterns
□ **SOC Manager**: Override policies and frequency
□ **IT Procurement**: Vendor transparency requirements
□ **Compliance Officer**: AI decision audit procedures

### System Checks
□ Review AI recommendation acceptance rates
□ Check for explanation/confidence score logging
□ Verify independent verification tool availability
□ Examine alert fatigue vs. override patterns

---

## 🎯 RAPID SCORING (2 minutes)

### Decision Tree Scoring

**START HERE** → Are AI decisions documented with reasoning?

├── **NO** → **RED (High Risk)**
└── **YES** → Do staff override AI recommendations >10% of time?
    ├── **NO** → Are there vendor transparency requirements?
    │   ├── **NO** → **RED (High Risk)**
    │   └── **YES** → **YELLOW (Moderate Risk)**
    └── **YES** → Is there independent verification process?
        ├── **NO** → **YELLOW (Moderate Risk)**  
        └── **YES** → **GREEN (Low Risk)**

### Objective Thresholds
- **Override Rate**: <5% = Red, 5-15% = Yellow, >15% = Green
- **Documentation Coverage**: <25% = Red, 25-75% = Yellow, >75% = Green
- **Training Completion**: <50% = Red, 50-85% = Yellow, >85% = Green

---

## 🔧 SOLUTION PRIORITIES (5 minutes)

### HIGH IMPACT / QUICK IMPLEMENTATION
- **AI Decision Logging** (Cost: Low, Time: 2 weeks)
  - Enable audit trails on existing AI tools
  - Require confidence scores and key factors
- **Override Training** (Cost: Medium, Time: 1 month)  
  - 4-hour workshop on questioning AI recommendations
  - Practice scenarios with simulated overrides

### MEDIUM IMPACT / MEDIUM TIMELINE
- **Vendor Requirements Update** (Cost: Low, Time: 3 months)
  - Add transparency clauses to renewal contracts
  - Create explainability scorecard for procurement
- **Verification Process** (Cost: Medium, Time: 2 months)
  - Define triggers for independent validation
  - Establish alternative verification methods

### HIGH IMPACT / LONG TIMELINE  
- **AI Reliability Dashboard** (Cost: High, Time: 6 months)
  - Track AI accuracy vs. confidence over time
  - Alert on deviation from baseline patterns
  - *Dependency*: Requires dedicated AI ops resource

### LOW IMPACT / ONGOING
- **Red Team AI Testing** (Cost: High, Time: Quarterly)
  - External adversarial testing of AI tools
  - *Dependency*: Requires specialized security budget

---

## 💬 CLIENT CONVERSATION (3 minutes)

### Opening Questions
**"Tell me about a recent security decision where AI played a key role."**
- *Follow-up*: "How did you verify the AI's recommendation?"
- *Red flag*: No verification mentioned

**"When was the last time someone disagreed with an AI security tool?"**
- *Follow-up*: "What happened? Was the override documented?"
- *Red flag*: "That never happens" or "Can't recall"

### Probing for Opacity Trust
**"How do you know when to trust your AI security tools?"**
- *Follow-up*: "What would make you question an AI recommendation?"
- *Red flag*: Answers focus on system sophistication vs. actual accuracy

**"What questions do you ask AI vendors about how their tools work?"**
- *Follow-up*: "What if they can't explain their decision process?"
- *Red flag*: No transparency requirements or "We trust the vendor"

### Sensitive Topic Handling
**For high trust patterns**: "Your AI tools seem very reliable. How do you maintain appropriate oversight while benefiting from AI efficiency?"

**For vendor relationships**: "AI procurement can be complex. How do you balance innovation with transparency requirements?"

---

## 📊 FIELD NOTES TEMPLATE

### Assessment Summary
**Date**: ____________  **Auditor**: ____________  **Site**: ____________

**Quick Assessment Score**: ___/7  **Risk Level**: Green/Yellow/Red

### Evidence Collected
**AI Tools in Use**: _________________________________________________
**Override Examples Found**: _____________________________________
**Documentation Quality**: Good / Fair / Poor / None
**Training Evidence**: Recent / Outdated / None

### Key Findings
**Strengths**: 
- _______________________________________________________________
- _______________________________________________________________

**Vulnerabilities**:
- _______________________________________________________________
- _______________________________________________________________

**Critical Gaps**:
- _______________________________________________________________
- _______________________________________________________________

### Recommended Actions
**Immediate (0-30 days)**:
□ _________________________________________________________________
□ _________________________________________________________________

**Short-term (1-3 months)**:
□ _________________________________________________________________
□ _________________________________________________________________

**Long-term (3+ months)**:
□ _________________________________________________________________
□ _________________________________________________________________

### Follow-up Required
□ Technical review of AI system configurations
□ Staff interviews for trust calibration assessment  
□ Vendor documentation review
□ Policy development consultation

**Next Review Date**: ____________

---

## 🔍 AUDITOR QUICK REFERENCE

### Red Flags (Immediate Attention)
- AI recommendations accepted >95% without question
- No documented AI decision failures or limitations
- Staff describe AI tools as "always right" or "too sophisticated to question"
- Vendor contracts have no transparency requirements

### Success Indicators  
- Regular documented overrides with reasoning
- Staff can describe specific AI failure scenarios
- Multiple verification methods available and used
- Training records show regular updates on AI limitations

### Common Mistakes to Avoid
- Don't confuse AI consistency with AI accuracy
- Don't accept "the AI is too complex to explain" 
- Don't skip verification process testing
- Don't assume high-tech presentation equals reliability

**Total Assessment Time**: 22 minutes maximum