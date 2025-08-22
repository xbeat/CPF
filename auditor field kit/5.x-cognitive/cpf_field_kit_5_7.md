# 📋 INDICATOR 5.7 FIELD KIT: Working Memory Overflow

## ⚡ QUICK ASSESSMENT (5 minutes)

**Check all that apply - Look for objective evidence:**

□ **Alert Overload**: Do analysts regularly handle 6+ concurrent security alerts during normal operations?

□ **Tool Switching**: Does a typical incident investigation require accessing 5+ different security tools/interfaces?

□ **No Interruption Control**: Are all security alerts treated as equally urgent with no triage system?

□ **Manual Documentation**: Do analysts manually create incident reports while actively responding to threats?

□ **Complex Handoffs**: Do shift changes involve transferring 8+ ongoing issues between teams?

□ **Peak Period Gaps**: Are staffing levels the same during predictable high-stress times (Monday mornings, post-holidays)?

□ **No Error Tracking**: Is there no system to track mistakes during high-alert periods vs. normal operations?

**Scoring**: 0-2 checked = Green | 3-5 checked = Yellow | 6-7 checked = Red

---

## 📝 EVIDENCE COLLECTION (10 minutes)

### Documents to Request:
- [ ] SIEM alert volume reports (last 30 days)
- [ ] Security tool inventory and access requirements
- [ ] Incident response procedures and templates
- [ ] Shift handoff documentation examples
- [ ] Staffing schedules for peak periods
- [ ] Error/quality metrics for security operations

### Demonstrations to Request:
- [ ] "Show me how you investigate a typical security alert"
- [ ] "Walk through your shift handoff process"
- [ ] "Demonstrate how you handle multiple concurrent alerts"
- [ ] "Show me your documentation process during an active incident"

### System Checks to Perform:
- [ ] Count security tools requiring separate login
- [ ] Review SIEM dashboard complexity and alert volume
- [ ] Check for workload monitoring systems
- [ ] Verify automation in documentation workflows

### Interview Targets:
- [ ] **SOC Analysts**: Daily workload and peak stress periods
- [ ] **SOC Manager**: Staffing decisions and error patterns
- [ ] **Incident Response Lead**: Coordination challenges and tool switching
- [ ] **CISO**: Resource allocation during high-alert periods

---

## 🎯 RAPID SCORING (2 minutes)

**Follow this decision tree:**

### GREEN (0): Low Vulnerability
**If ALL are true:**
- Analysts handle max 3-4 concurrent items during peaks
- Single-pane-of-glass tools OR <4 interfaces per incident
- Dedicated triage role exists
- Automated documentation reduces manual work by >50%
- Structured handoff procedures with complexity limits

### RED (2): High Vulnerability  
**If ANY are true:**
- Analysts routinely handle 8+ concurrent items
- Requires 7+ different tools for typical investigation
- No formal interruption management
- Extensive manual documentation during active response
- Ad-hoc handoff procedures with no limits

### YELLOW (1): Moderate Vulnerability
**All other situations**

---

## 🔧 SOLUTION PRIORITIES (5 minutes)

### HIGH IMPACT / QUICK IMPLEMENTATION
- **Cognitive Load Dashboard** (Cost: Medium)
  - Real-time analyst workload monitoring
  - Automatic escalation when >4 concurrent tasks
  - Dependencies: SIEM integration

- **Interruption Management Protocol** (Cost: Low)
  - Dedicated triage role during complex analysis
  - "Do not disturb" periods >30 minutes
  - Dependencies: Staff training

### HIGH IMPACT / LONG-TERM
- **Integrated Security Platform** (Cost: High)
  - Single-pane-of-glass SIEM/SOAR solution
  - Reduces tool switching from 7+ to 2-3 interfaces
  - Dependencies: Major technology investment

- **Automated Documentation** (Cost: Medium)
  - SOAR workflows auto-generate incident reports
  - 70% reduction in manual documentation
  - Dependencies: SOAR platform implementation

### MEDIUM IMPACT / QUICK IMPLEMENTATION
- **Peak Period Staffing** (Cost: Medium)
  - Predictive staffing based on historical patterns
  - On-call support during identified peak periods
  - Dependencies: Historical data analysis

- **Working Memory Aids** (Cost: Low)
  - Standardized investigation templates
  - Digital checklists and visual workflows
  - Dependencies: Template development

---

## 💬 CLIENT CONVERSATION (3 minutes)

### Opening Questions:
**"During your busiest security day last month, how many different things was each analyst juggling at once?"**
- *Follow-up*: "Can you walk me through that specific day?"

**"When investigating a security incident, how many different systems does your team need to log into?"**
- *Follow-up*: "Can you show me the typical workflow?"

### Red Flag Indicators:
- **Analyst Burnout Mentions**: "Our people are stretched thin"
- **Error Acknowledgments**: "Sometimes things slip through the cracks"
- **Tool Frustration**: "We have too many systems that don't talk to each other"
- **Peak Period Chaos**: "Monday mornings are always crazy"

### Sensitive Topics - Professional Language:
- **Instead of**: "Your team is cognitively overloaded"
- **Say**: "Your analysts are managing high information volumes"

- **Instead of**: "Working memory overflow"
- **Say**: "Capacity constraints during peak periods"

### Follow-up Prompts:
- "What happens when urgent alerts come in during complex investigations?"
- "How do you ensure nothing gets missed during shift changes?"
- "What patterns do you notice in security mistakes during busy periods?"

---

## 📊 FIELD NOTES TEMPLATE

**Client**: _________________________ **Date**: _____________

**Auditor**: _______________________ **Time**: _____________

### Quick Assessment Results:
□ Alert Overload □ Tool Switching □ No Interruption Control
□ Manual Documentation □ Complex Handoffs □ Peak Period Gaps □ No Error Tracking

**Score**: _______ (0-2 Green | 3-5 Yellow | 6-7 Red)

### Key Evidence Observed:
- **Peak concurrent alerts/analyst**: _______
- **Tools required per incident**: _______
- **Interruption management**: Yes/No
- **Documentation automation**: ____%
- **Handoff complexity**: _______

### Critical Quotes:
```
"_________________________________________________"
"_________________________________________________"
"_________________________________________________"
```

### Immediate Red Flags:
□ Analysts mention being "overwhelmed"
□ No clear triage process observed
□ Multiple incidents missed due to volume
□ Staff turnover attributed to stress
□ Manual processes during crisis response

### Solution Priorities for Client:
**HIGH**: ___________________________________
**MEDIUM**: _________________________________
**LOW**: ___________________________________

### Next Steps:
□ Schedule follow-up for solution discussion
□ Request additional documentation
□ Propose quick-win implementations
□ Escalate to senior leadership

**Assessment Completed**: _______minutes