# 📋 INDICATOR 1.2 FIELD KIT
## Diffusion of Responsibility in Hierarchical Structures

---

## ⚡ QUICK ASSESSMENT (5 minutes)

**Check YES/NO for each question:**

☐ **YES** ☐ **NO** - Does the organization have a written document listing specific individuals (not just roles) authorized to make security decisions?

☐ **YES** ☐ **NO** - Can security decisions for critical issues be made in under 30 minutes without multiple approvals?

☐ **YES** ☐ **NO** - Is there a named individual available 24/7 who can authorize emergency security actions?

☐ **YES** ☐ **NO** - Do departments meet monthly or more to clarify security responsibilities between teams?

☐ **YES** ☐ **NO** - Are security responsibilities assigned to specific people rather than departments in policy documents?

☐ **YES** ☐ **NO** - Does patch management have a named person accountable for each step of the process?

☐ **YES** ☐ **NO** - Are individual security performance metrics tracked and tied to employee reviews?

**Scoring Preview:** 6-7 YES = Green | 4-5 YES = Yellow | 0-3 YES = Red

---

## 📝 EVIDENCE COLLECTION (10 minutes)

### Documents to Request:
- [ ] Security authority matrix or decision-making document
- [ ] Incident response procedures showing decision authority
- [ ] Last 3 security incident reports with timestamps
- [ ] Cross-department meeting notes (last 6 months)
- [ ] Patch management process documentation
- [ ] Security policy exception approval records

### Demonstrations to Request:
- [ ] "Walk me through what happens when you detect suspicious network traffic"
- [ ] "Show me your process for emergency account lockouts after hours"
- [ ] "Demonstrate how you escalate a security concern to management"

### System Checks:
- [ ] Review SIEM alert escalation workflows
- [ ] Check ticketing system for security decision approval times
- [ ] Examine user access review processes and ownership
- [ ] Audit security tool administrative assignments

### Interview Targets:
- [ ] **IT Manager**: Decision authority and escalation processes
- [ ] **Security Team Lead**: Cross-department coordination
- [ ] **Help Desk Staff**: After-hours incident procedures
- [ ] **Department Manager**: Security responsibility understanding

---

## 🎯 RAPID SCORING (2 minutes)

### Decision Tree:

**START HERE:** Review Quick Assessment results

**IF 6-7 YES responses:**
- ✅ **GREEN (0)** - Named individuals have clear authority, decisions under 30 minutes, regular coordination

**IF 4-5 YES responses:**
- Check: Are critical decisions delayed 30min-4hrs? → ⚠️ **YELLOW (1)**
- Check: Mixed individual/department assignments? → ⚠️ **YELLOW (1)**

**IF 0-3 YES responses:**
- Check: Are critical decisions delayed 4+ hours? → 🚨 **RED (2)**
- Check: Only department-level assignments? → 🚨 **RED (2)**

### Objective Thresholds:
- **Decision Speed**: Under 30min = Green | 30min-4hrs = Yellow | 4+ hrs = Red
- **Authority Assignment**: Named persons = Green | Mixed = Yellow | Departments only = Red
- **Coordination**: Monthly+ = Green | Quarterly = Yellow | Ad-hoc/None = Red

---

## 🔧 SOLUTION PRIORITIES (5 minutes)

### HIGH IMPACT / QUICK IMPLEMENTATION
- **Security Authority Matrix** (Low Cost)
  - Create named-person decision document
  - 2-week implementation
  - Requires: Management approval only

- **Decision Time Limits** (Low Cost)
  - Set 30min/4hr/24hr response requirements
  - 1-week implementation
  - Requires: Policy update

### MEDIUM IMPACT / MEDIUM IMPLEMENTATION  
- **Security Champions Network** (Medium Cost)
  - Monthly cross-department meetings
  - 4-6 week implementation
  - Requires: Champion selection, training

- **Individual Scorecards** (Medium Cost)
  - Personal security metrics tracking
  - 6-8 week implementation
  - Requires: HR system integration

### HIGH IMPACT / LONG-TERM IMPLEMENTATION
- **Automated Decision Workflows** (High Cost)
  - SOAR platform for routine decisions
  - 3-6 month implementation
  - Requires: Technology investment

- **Incident Command Structure** (Medium Cost)
  - Bypass hierarchy during incidents
  - 2-3 month implementation
  - Requires: Cultural change management

### Dependencies:
- Executive buy-in required for authority changes
- HR involvement needed for individual metrics
- IT resources required for automation solutions

---

## 💬 CLIENT CONVERSATION (3 minutes)

### Opening Questions:
**"When you discover a potential security issue, who do you contact first?"**
- Follow-up: *"How long does it typically take to get permission to act?"*

**"What happens if a security problem occurs at 2 AM on Saturday?"**  
- Follow-up: *"Who has the authority to shut down systems or block traffic?"*

**"How do different departments coordinate on security responsibilities?"**
- Follow-up: *"When was your last cross-department security meeting?"*

### Red Flag Indicators:
- 🚨 "We have a committee that meets to discuss..." 
- 🚨 "It depends on who's available..."
- 🚨 "That's not really my area..."
- 🚨 "We'd need to check with several people..."
- 🚨 "The policy says to contact the department..."

### Professional Language for Sensitive Topics:
**Instead of**: "Your security is broken"
**Say**: "We've identified opportunities to streamline your security decision-making"

**Instead of**: "No one is accountable"  
**Say**: "There may be opportunities to clarify security responsibilities"

**Instead of**: "This creates vulnerabilities"
**Say**: "This structure may slow incident response times"

---

## 📊 FIELD NOTES TEMPLATE

**Date:** _____________ **Auditor:** _________________ **Organization:** _________________

### Quick Assessment Results:
- Individual authority documented: ☐ Yes ☐ No
- Fast decision capability (<30min): ☐ Yes ☐ No  
- 24/7 authority coverage: ☐ Yes ☐ No
- Regular coordination meetings: ☐ Yes ☐ No
- Person-specific assignments: ☐ Yes ☐ No
- Patch accountability: ☐ Yes ☐ No
- Individual metrics: ☐ Yes ☐ No

**Total YES responses: ___/7**

### Evidence Collected:
- Authority documentation: ☐ Present ☐ Absent ☐ Incomplete
- Incident response times: Average ____ minutes/hours
- Cross-department coordination: ☐ Monthly ☐ Quarterly ☐ Ad-hoc ☐ None
- Decision approval delays: ☐ <30min ☐ 30min-4hr ☐ 4hr+

### Scoring Determination:
☐ **GREEN (0)** - Clear authority, fast decisions, regular coordination
☐ **YELLOW (1)** - Some delays, mixed assignments, periodic coordination  
☐ **RED (2)** - Major delays, department assignments, poor coordination

### Priority Recommendations:
☐ Security Authority Matrix (HIGH/QUICK)
☐ Decision Time Limits (HIGH/QUICK)  
☐ Security Champions Network (MED/MED)
☐ Individual Scorecards (MED/MED)
☐ Automated Workflows (HIGH/LONG)
☐ Incident Command Structure (HIGH/LONG)

### Client Feedback/Concerns:
_________________________________________________
_________________________________________________
_________________________________________________

### Follow-up Actions Required:
☐ Executive presentation needed
☐ Additional documentation review
☐ Follow-up interviews scheduled
☐ Technical assessment required

**Assessment Completed:** _____ minutes
**Report Generation Time:** _____ minutes