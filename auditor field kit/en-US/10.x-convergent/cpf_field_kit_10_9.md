# 📋 CPF FIELD KIT 10.9: System Coupling Failures

**Assessment Time**: 22 minutes | **Risk Focus**: Hidden system connections creating cascade vulnerabilities

---

## ⚡ QUICK ASSESSMENT (5 minutes)

**Check YES if evidence exists, NO if absent or inadequate:**

- [ ] **YES/NO**: Network discovery tool actively scans and maps system connections (monthly or more frequent)
- [ ] **YES/NO**: Change management process requires connection impact analysis before approval
- [ ] **YES/NO**: System dependency documentation updated within last 6 months
- [ ] **YES/NO**: Incident response procedures include checking connected systems
- [ ] **YES/NO**: Emergency change procedures have mandatory connection checks
- [ ] **YES/NO**: Cross-team coordination documented for system changes
- [ ] **YES/NO**: Vendor integration includes security review of system connections

**Scoring**: 6-7 YES = Green | 3-5 YES = Yellow | 0-2 YES = Red

---

## 📝 EVIDENCE COLLECTION (10 minutes)

### Documents to Request
- [ ] **Network discovery reports** (last 3 months)
- [ ] **System architecture diagrams** with update dates
- [ ] **Recent change requests** showing connection analysis
- [ ] **Last 3 incident reports** with response actions
- [ ] **Emergency change log** from past 6 months
- [ ] **Vendor security assessments** for recent implementations

### Demonstrations to Request
- [ ] **"Show me your network discovery tool and last scan results"**
- [ ] **"Walk me through your change approval process"**
- [ ] **"Show me how you check system connections during incidents"**
- [ ] **"Demonstrate emergency change procedures"**

### System Checks to Perform
- [ ] **Verify automated network scanning is configured and running**
- [ ] **Check if system diagrams match current network discovery**
- [ ] **Review change management workflow for connection requirements**
- [ ] **Examine incident response playbooks for connection procedures**

### Interview Targets
- [ ] **Network Administrator** (system connectivity knowledge)
- [ ] **Change Manager** (approval process oversight)  
- [ ] **Incident Response Lead** (security event procedures)
- [ ] **IT Operations Manager** (cross-team coordination)

---

## 🎯 RAPID SCORING (2 minutes)

### Decision Tree

**START**: Does organization have network discovery tool with recent scans?
- **NO** → **RED** (Stop - Critical gap)
- **YES** → Continue

**Does change management require connection analysis?**
- **NO** → **RED** (Stop - No change protection)  
- **YES** → Continue

**Are system dependencies documented and current (≤6 months)?**
- **NO** → **YELLOW** (Documentation gaps)
- **YES** → Continue

**Do incident procedures include connection checking?**
- **NO** → **YELLOW** (Response gaps)
- **YES** → **GREEN**

### Override Conditions
- **Force RED if**: Monthly+ unexpected system failures from changes
- **Force RED if**: Recent security incident spread unexpectedly to other systems
- **Force YELLOW if**: Documentation exists but staff unaware/untrained

---

## 🔧 SOLUTION PRIORITIES (5 minutes)

### HIGH IMPACT / QUICK IMPLEMENTATION
- [ ] **Network Discovery Tool** (Cost: Medium, Time: 30 days)
  - *Deploy automated scanning with weekly reports*
- [ ] **Emergency Change Checklist** (Cost: Low, Time: 1 week)
  - *15-minute connection verification procedure*

### HIGH IMPACT / LONG-TERM  
- [ ] **Cross-System Change Process** (Cost: Medium, Time: 90 days)
  - *Mandatory connection analysis in change workflow*
- [ ] **Incident Response Connection Protocol** (Cost: Low, Time: 60 days)
  - *Updated playbooks with connection checking steps*

### MEDIUM IMPACT / MAINTENANCE
- [ ] **Quarterly Dependency Reviews** (Cost: Low, Time: Ongoing)
  - *Regular cross-team meetings for documentation updates*
- [ ] **Vendor Integration Assessment** (Cost: Medium, Time: 45 days)
  - *Security review template for third-party connections*

### Dependencies
- **Network discovery tool** → Required before change process improvements
- **Staff training** → Required for all procedural improvements
- **Documentation tools** → Required for sustainable maintenance

---

## 💬 CLIENT CONVERSATION SCRIPT (3 minutes)

### Opening Questions
**"When you make changes to systems, what happens if something unexpected breaks?"**
- *Listen for*: Surprise failures, blame on "weird connections"

**"Tell me about your last security incident - did it affect other systems?"**  
- *Listen for*: Single system focus, missed spread, delayed discovery

**"How do you know what systems connect to what?"**
- *Listen for*: Guesswork, outdated diagrams, tribal knowledge

### Follow-up Prompts
- **If they mention documentation**: *"Show me your most recent version and when it was updated"*
- **If they mention tools**: *"Can you pull up the latest scan results?"*
- **If they mention processes**: *"Walk me through the last time you used this process"*

### Red Flag Indicators Requiring Deeper Investigation
- [ ] **"We don't usually have problems with that"** (Denial/unawareness)
- [ ] **"It's too complex to document everything"** (Overwhelming complexity)
- [ ] **"Each team handles their own systems"** (Dangerous isolation)
- [ ] **"We fix things when they break"** (Reactive-only approach)

### Professional Language for Sensitive Topics
- **Instead of**: "Your systems are dangerously connected"
- **Say**: "Let's review how system relationships are documented and managed"

- **Instead of**: "You have no visibility"  
- **Say**: "There may be opportunities to improve system relationship awareness"

---

## 📊 FIELD NOTES TEMPLATE

### Assessment Summary
**Date**: __________ **Assessor**: __________  
**Client Contact**: __________ **Systems Reviewed**: __________

### Evidence Collected
- [ ] Network discovery: **Present/Absent** - Last scan: __________
- [ ] Change process: **Formal/Informal/Absent** - Connection analysis: **Yes/No**
- [ ] Documentation: **Current/Outdated/Missing** - Last update: __________
- [ ] Incident response: **Includes connections/Single system focus**

### Risk Indicators Observed
- [ ] Staff surprised by system interactions during demonstration
- [ ] Multiple recent incidents with unexpected system impacts  
- [ ] Emergency changes made without connection consideration
- [ ] Teams unaware of other teams' system dependencies

### Scoring Rationale
**Final Score**: Green/Yellow/Red  
**Primary Justification**: ________________________________
**Override Applied**: Yes/No **Reason**: ___________________

### Immediate Recommendations
**Priority 1**: ________________________________
**Priority 2**: ________________________________  
**Priority 3**: ________________________________

### Client Commitment Level
- [ ] **High**: Ready to implement immediately
- [ ] **Medium**: Needs budget/resource planning
- [ ] **Low**: Requires executive buy-in first

---

**Field Kit Validation**: This assessment maintains fidelity to CPF 10.9 theoretical foundation while enabling rapid, consistent evaluation by auditors without psychology expertise.