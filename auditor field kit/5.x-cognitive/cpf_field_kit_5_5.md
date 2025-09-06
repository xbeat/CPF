# 📋 INDICATOR 5.5 FIELD KIT: Context Switching Vulnerabilities

## ⚡ QUICK ASSESSMENT (5 minutes)

**Instructions:** Check YES/NO for each question based on direct observation or documentation review.

| # | Assessment Question | YES | NO |
|---|---------------------|-----|----|
| 1 | Do security analysts use 7+ different tools during a single shift? | ☐ | ☐ |
| 2 | Are there 3+ separate dashboards with no integration for security monitoring? | ☐ | ☐ |
| 3 | Do shift handoffs require verbal briefings due to lack of integrated documentation? | ☐ | ☐ |
| 4 | Do multi-domain incidents require switching between 4+ separate tools/systems? | ☐ | ☐ |
| 5 | Does escalation involve 4+ separate communication channels or approval processes? | ☐ | ☐ |
| 6 | Are analysts required to view multiple screens/monitors to get complete security picture? | ☐ | ☐ |
| 7 | Do compliance reports require accessing 3+ separate systems? | ☐ | ☐ |

---

## 📝 EVIDENCE COLLECTION (10 minutes)

### Documents to Request
- [ ] **SOC shift handoff logs** (last 30 days)
- [ ] **Security tool inventory list** with usage frequency
- [ ] **Incident response workflow diagrams**
- [ ] **Analyst workstation screenshots** during active monitoring
- [ ] **Recent security incident post-mortems** (identify tool switching patterns)

### System Demonstrations
- [ ] **"Show me analyst workstation setup"** - count active windows/dashboards
- [ ] **"Walk through your last security alert investigation"** - track tool switches
- [ ] **"Demonstrate shift handoff process"** - observe documentation gaps
- [ ] **"Show escalation procedure"** - count system/process switches

### Interview Targets
- [ ] **SOC Manager** - overall tool strategy and analyst workflow
- [ ] **Senior Security Analyst** - daily operational challenges
- [ ] **Incident Response Lead** - multi-domain incident handling
- [ ] **IT Operations** - tool integration status and limitations

### System Checks
- [ ] **Count active security monitoring tools** in environment
- [ ] **Verify SIEM integration status** with other security tools
- [ ] **Check automated handoff documentation** existence
- [ ] **Review dashboard consolidation** efforts

---

## 🎯 RAPID SCORING (2 minutes)

### Decision Tree

**Start Here:** Count total "YES" answers from Quick Assessment

**0-2 YES answers** → **GREEN (0 points)**
- Integrated operations with minimal context switching

**3-5 YES answers** → **YELLOW (1 point)**
- Moderate fragmentation requiring attention

**6-7 YES answers** → **RED (2 points)**
- High fragmentation creating significant vulnerability

### Verification Checkpoints
- [ ] If scored RED: Confirm 7+ tools are actively used (not just installed)
- [ ] If scored GREEN: Verify integration actually reduces switching (not just claims)
- [ ] If escalation involves 4+ steps: Automatic RED regardless of other factors

---

## 🔧 SOLUTION PRIORITIES (5 minutes)

### High Impact / Quick Implementation
- [ ] **Unified Security Dashboard** (30-45 days, Medium cost)
  - *Consolidate 3+ separate dashboards into role-based views*
- [ ] **Shift Handoff Protocols** (15-30 days, Low cost)
  - *Standardized digital handoff documentation*

### High Impact / Long-term Implementation  
- [ ] **SIEM Consolidation** (30-60 days, High cost)
  - *Aggregate alerts from all tools into single interface*
- [ ] **SOAR Implementation** (60-90 days, High cost)
  - *Automate routine context switching tasks*

### Medium Impact / Quick Implementation
- [ ] **Cross-Training Program** (45-60 days, Medium cost)
  - *Reduce cognitive load through domain expertise*
- [ ] **Monitor Configuration** (15-30 days, Low cost)
  - *Optimize physical workspace for context preservation*

### Dependencies
- **SIEM before SOAR** - Integration platform needed first
- **Dashboard design requires** tool inventory completion
- **Cross-training needs** current workflow documentation

---

## 💬 CLIENT CONVERSATION SCRIPT (3 minutes)

### Opening Questions
**"How many different security tools does your typical analyst use during an 8-hour shift?"**
- *Follow-up: "Can you show me a workstation during active monitoring?"*

**"When you had your last security incident, what tools did the analyst need to use?"**
- *Follow-up: "In what sequence? Any delays switching between them?"*

**"How do you handle shift changes when there are ongoing security activities?"**
- *Follow-up: "Can you show me the handoff documentation from yesterday?"*

### Red Flag Indicators Requiring Deeper Investigation
- [ ] **Verbal-only handoffs** - No documented process
- [ ] **"We're used to it" responses** - Normalized dysfunction
- [ ] **Multiple screens required** - Lack of integration
- [ ] **"It depends" escalation** - No standardized process
- [ ] **Tool switching delays** - Acknowledged inefficiency

### Professional Follow-up Language
- *"Help me understand your current integration efforts..."*
- *"What challenges have you experienced with tool consolidation?"*
- *"How do you measure analyst effectiveness across different systems?"*
- *"What would ideal integration look like for your team?"*

---

## 📊 FIELD NOTES TEMPLATE

### Assessment Summary
**Date:** _________ **Assessor:** _________ **Organization:** _________

**Quick Assessment Score:** ___/7 **Final Rating:** Green / Yellow / Red

### Tool Environment
**Primary Security Tools in Use:**
1. ___________________ 4. ___________________
2. ___________________ 5. ___________________
3. ___________________ 6. ___________________

**Dashboard Count:** _____ **Integration Level:** None / Partial / Full

### Critical Observations
**Highest Priority Issue:** _________________________________

**Immediate Risk:** _____________________________________

**Quick Win Opportunity:** _______________________________

### Recommendations
**Primary Recommendation:** _______________________________
- **Timeline:** _______ **Cost:** Low/Med/High **Impact:** Low/Med/High

**Secondary Recommendation:** _____________________________
- **Timeline:** _______ **Cost:** Low/Med/High **Impact:** Low/Med/High

### Follow-up Required
- [ ] **Technical assessment** needed for SIEM/SOAR feasibility
- [ ] **Workflow analysis** required for dashboard design
- [ ] **Training needs assessment** for cross-domain expertise
- [ ] **Budget approval** process for tool consolidation

---

## ✅ COMPLETION CHECKLIST

Assessment Complete When:
- [ ] All 7 quick assessment questions answered
- [ ] At least 3 evidence items collected
- [ ] Score assigned using decision tree
- [ ] Primary recommendation identified
- [ ] Client conversation documented
- [ ] Field notes template completed

**Total Time:** _______ minutes (Target: <25 minutes)