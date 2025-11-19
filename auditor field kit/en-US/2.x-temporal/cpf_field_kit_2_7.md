# 📋 CPF INDICATOR 2.7 FIELD KIT
## Time-of-day Vulnerability Windows

---

## ⚡ QUICK ASSESSMENT (5 minutes)

**Binary Assessment Checklist - Check all that apply:**

□ **24/7 Operations**: Organization operates security-critical systems outside 9-5 business hours  
□ **Skeleton Staffing**: Fewer than 50% of normal security staff during nights/weekends  
□ **Off-Hours Incidents**: Security incidents have occurred during evenings/nights/weekends in past 6 months  
□ **Bypass Documentation**: Written evidence exists of security procedures bypassed during time pressure  
□ **Authority Gaps**: No designated security decision-maker available during off-hours  
□ **Shift Handovers**: Organization uses multiple shifts with handover periods  
□ **Emergency Requests**: After-hours "urgent" security requests occur monthly or more frequently  

**Quick Score**: 0-2 boxes = Green | 3-4 boxes = Yellow | 5+ boxes = Red

---

## 📝 EVIDENCE COLLECTION (10 minutes)

### Documents to Request
- [ ] **Shift schedules** and staffing levels by time period
- [ ] **Incident logs** from past 6 months (note timestamps)
- [ ] **After-hours approval records** (password resets, access requests)
- [ ] **SOC/monitoring coverage** schedules
- [ ] **Emergency contact lists** and escalation procedures
- [ ] **Shift handover templates** or communication logs

### Demonstrations Needed
- [ ] **"Show me how"** someone requests urgent access at 2 AM
- [ ] **"Walk me through"** your shift change process
- [ ] **"Demonstrate"** your after-hours incident response procedure

### System Checks
- [ ] **Review SIEM alerts** clustered between 6 PM - 6 AM
- [ ] **Check authentication logs** for off-hours access patterns
- [ ] **Examine help desk tickets** submitted during nights/weekends
- [ ] **Verify monitoring dashboards** show coverage gaps

### Key Interview Targets
- [ ] **SOC Manager** - overnight coverage and alert handling
- [ ] **IT Help Desk Lead** - after-hours request procedures
- [ ] **Security Manager** - off-hours decision authority
- [ ] **Shift Supervisor** - handover communication processes

---

## 🎯 RAPID SCORING (2 minutes)

### Decision Tree

**START HERE** → Does organization operate 24/7 or have off-hours operations?
- **NO** → **GREEN (0)** - Minimal temporal vulnerability
- **YES** → Continue below

**Coverage Check** → Is dedicated security staff present during all operational hours?
- **YES** → Check handovers below
- **NO** → **RED (2)** if <25% coverage, **YELLOW (1)** if 25-75% coverage

**Authority Check** → Can security decisions be made at any hour?
- **YES** → Check incidents below  
- **NO** → **RED (2)** if no after-hours authority, **YELLOW (1)** if limited authority

**Incident Pattern** → Security incidents during off-hours in past 6 months?
- **NONE** → **GREEN (0)**
- **1-2 incidents** → **YELLOW (1)**  
- **3+ incidents** → **RED (2)**

**Final Score**: Highest individual score determines overall rating

---

## 🔧 SOLUTION PRIORITIES (5 minutes)

### HIGH IMPACT / QUICK IMPLEMENTATION
- **Enhanced Off-Hours Verification** (Cost: Low)
  - Require callback verification for after-hours requests
  - Implement dual approval for security changes outside business hours
- **Structured Shift Handovers** (Cost: Low)
  - Deploy digital handover checklist
  - Require security-specific briefings between shifts

### MEDIUM IMPACT / MODERATE TIMELINE  
- **Time-Based Authority Matrix** (Cost: Medium)
  - Define security decision authority by time period
  - Create "security duty officer" rotation system
- **Temporal Attack Detection** (Cost: Medium)
  - Configure SIEM alerts for timing-based attack patterns
  - Monitor after-hours access request frequency

### HIGH IMPACT / LONG-TERM INVESTMENT
- **24/7 SOC Coverage** (Cost: High)
  - Staff dedicated security personnel around the clock
  - Implement circadian-optimized shift scheduling
- **Automated Security Controls** (Cost: High)  
  - Deploy systems requiring minimal human decision-making
  - Implement default-deny policies for off-hours requests

### Dependencies
- **Leadership Buy-in Required**: 24/7 staffing, authority matrix changes
- **Technology Prerequisites**: SIEM configuration, automated controls
- **Policy Updates Needed**: All verification and handover procedures

---

## 💬 CLIENT CONVERSATION (3 minutes)

### Opening Questions
- *"How many hours per week do you operate outside normal business hours?"*
- *"Who makes security decisions when your main team isn't available?"*
- *"Tell me about your last security incident - what time did it occur?"*

### Follow-up Prompts for Incomplete Answers
- **If they say "We have coverage"**: *"How many people, and what's their security decision authority?"*
- **If they mention incidents**: *"What time of day do most of your security issues happen?"*
- **If they describe handovers**: *"Show me your last shift handover documentation."*

### Red Flag Indicators Requiring Deeper Investigation
- **Frequent after-hours "emergencies"** requiring security bypasses
- **Incident clusters during specific time periods** (nights, shift changes)
- **Vague answers about off-hours decision authority**
- **No documentation of shift communications**
- **Staff mentions of "weekend shortcuts"** or pressure to bypass security

### Professional Language for Sensitive Topics
- Instead of: "Your night staff are vulnerable"
- Say: "We want to ensure consistent security standards across all operational hours"
- Instead of: "People make bad decisions when tired" 
- Say: "Research shows cognitive performance varies throughout the day"

---

## 📊 FIELD NOTES TEMPLATE

**Organization**: _________________ **Date**: _________ **Auditor**: _________________

### Operational Hours
□ Standard business hours only (9-5) □ Extended hours □ 24/7 operations
**Details**: ________________________________________________________________

### Current Off-Hours Coverage
**Security staff present**: _______ **Decision authority level**: _______________
**Escalation process**: _____________________________________________________

### Recent Temporal Incidents
**Incident 1**: ____________________________________________________________
**Time/Date**: ________________________ **Impact**: ______________________

**Incident 2**: ____________________________________________________________
**Time/Date**: ________________________ **Impact**: ______________________

### Shift Handover Quality
□ Documented process □ Verbal only □ No formal handover
**Security information transfer**: __________________________________________

### Immediate Recommendations
**Priority 1**: ____________________________________________________________
**Priority 2**: ____________________________________________________________
**Priority 3**: ____________________________________________________________

### Score Justification
**Final Score**: _______ **Primary factors**: ________________________________

---

## ✅ AUDITOR SUCCESS CHECKLIST

Before leaving client site, confirm:
- [ ] All 7 quick assessment items evaluated
- [ ] At least 3 pieces of documentary evidence collected
- [ ] Shift handover process observed or documented
- [ ] Off-hours authority chain confirmed
- [ ] Recent incident timing patterns identified
- [ ] Priority recommendations provided to client
- [ ] Field notes template completely filled out

**Total Assessment Time**: _______ minutes (Target: <25 minutes)