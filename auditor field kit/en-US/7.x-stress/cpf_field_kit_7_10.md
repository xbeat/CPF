# 📋 CPF INDICATOR 7.10 FIELD KIT
## Recovery Period Vulnerabilities

---

## ⚡ QUICK ASSESSMENT (5 minutes)

**Check all that apply - Observable evidence only:**

□ **Q1:** Organization has documented recovery protocol lasting 72+ hours post-incident
□ **Q2:** Fresh security personnel (not incident responders) monitor during recovery periods  
□ **Q3:** Security controls remain unchanged during 72-hour recovery window
□ **Q4:** External validation required before declaring incident "fully resolved"
□ **Q5:** Formal staff rotation policy exists for incident response teams
□ **Q6:** Recovery timeline decisions based on security criteria (not business pressure)
□ **Q7:** No security exceptions permitted during recovery periods

**Checkbox Count:** ___/7

---

## 📝 EVIDENCE COLLECTION (10 minutes)

### **Documents to Request:**
□ Most recent incident response report and recovery timeline
□ Security monitoring procedures for post-incident periods
□ Staff rotation/fatigue management policies
□ Access request logs from last recovery period
□ Recovery phase communication protocols
□ Security exception approval logs (last 6 months)

### **System Demonstrations:**
□ **"Show me how you declare an incident resolved"** - Who decides? What criteria?
□ **"Walk through your last recovery period"** - Timeline from resolution to normal ops
□ **"Show me who monitors security during recovery"** - Same team or different personnel?

### **Interview Targets:**
□ **CISO/Security Manager:** Recovery protocols and decision authority
□ **Incident Response Lead:** Staff rotation and fatigue management
□ **Operations Manager:** Business pressure vs. security timeline conflicts
□ **SOC Analyst:** Alert handling during recent recovery periods

### **System Checks:**
□ Review security alert sensitivity settings during last recovery
□ Check access control logs 48-72 hours post last major incident  
□ Verify external security consultant engagement records
□ Examine recovery phase security audit results

---

## 🎯 RAPID SCORING (2 minutes)

### **Decision Tree:**

**Start Here:** Count checked boxes from Quick Assessment

**If 6-7 boxes checked:**
- **AND** external validation documented **→ GREEN (0)**
- **AND** no external validation **→ YELLOW (1)**

**If 3-5 boxes checked:**
- **AND** formal recovery protocol exists **→ YELLOW (1)** 
- **AND** no formal recovery protocol **→ RED (2)**

**If 0-2 boxes checked:**
- **→ RED (2)** (High Recovery Vulnerability)

**Final Score:** ___/2

### **Red Flags (Immediate RED regardless of checklist):**
□ Same incident team monitors recovery periods
□ Security exceptions routinely approved during recovery
□ "All clear" declared same day as technical resolution
□ No recovery period security monitoring

---

## 🔧 SOLUTION PRIORITIES (5 minutes)

### **HIGH IMPACT / QUICK IMPLEMENTATION**
□ **72-Hour Recovery Protocol** (Cost: Low, Time: 2-4 weeks)
  - Define security checkpoints at 24/48/72 hours
  - Create recovery validation criteria checklist

□ **Fresh Eyes Monitoring** (Cost: Medium, Time: 1-2 weeks)  
  - Assign non-incident personnel to recovery monitoring
  - Rotate security teams after 48 hours

### **HIGH IMPACT / LONG-TERM**
□ **External Recovery Validation** (Cost: High, Time: 2-3 months)
  - Contract third-party security consultant
  - Require external sign-off before "all clear"
  - Dependencies: Budget approval, vendor selection

□ **Automated Recovery Controls** (Cost: High, Time: 3-6 months)
  - Prevent security relaxation during recovery periods
  - Dependencies: Security system integration

### **MEDIUM IMPACT / QUICK IMPLEMENTATION**  
□ **Recovery Communication Protocol** (Cost: Low, Time: 1-2 weeks)
  - Avoid premature "all clear" messaging
  - Train leadership on recovery communications

□ **Staff Rotation Policy** (Cost: Low, Time: 2-3 weeks)
  - Mandatory rest for incident responders
  - Fresh personnel for recovery monitoring

---

## 💬 CLIENT CONVERSATION (3 minutes)

### **Opening Questions:**
- *"Walk me through what happens in the 72 hours after you resolve a major security incident."*
- *"Who makes the decision that an incident is completely over?"*
- *"How do you prevent your team from letting their guard down after successfully handling an attack?"*

### **Follow-Up Prompts:**
**If they mention business pressure:**
- *"Can you give me a specific example of when business needs conflicted with security timeline?"*

**If they mention team fatigue:**  
- *"How do you handle security monitoring when your incident response team is exhausted?"*

**If they claim no recovery vulnerabilities:**
- *"What security checks do you perform before declaring 'all clear'?"*

### **Red Flag Indicators Requiring Deeper Investigation:**
□ **Defensive responses** about recovery speed
□ **Vague answers** about who monitors during recovery  
□ **Examples of rushing** back to normal operations
□ **No awareness** of recovery period risks
□ **Business pressure** overriding security decisions

### **Professional Language for Sensitive Topics:**
- **Instead of:** "Your recovery process is vulnerable"
- **Say:** "Let's explore opportunities to strengthen your post-incident security posture"

- **Instead of:** "Your team gets careless after incidents"  
- **Say:** "Industry research shows recovery periods present unique security considerations"

---

## 📊 FIELD NOTES TEMPLATE

**Client:** _________________ **Date:** _______ **Auditor:** _________________

### **Quick Assessment Score:** ___/7 → **Final Risk Score:** ___/2

### **Key Findings:**
**Recovery Protocol:**
□ Documented □ Ad-hoc □ Non-existent
**Notes:** _________________________________________________

**Staff Management:**  
□ Rotation policy □ Fresh monitoring □ Same team continues
**Notes:** _________________________________________________

**Security Controls:**
□ Maintained □ Mixed □ Relaxed during recovery
**Notes:** _________________________________________________

**External Validation:**
□ Required □ Optional □ Not used
**Notes:** _________________________________________________

### **Evidence Collected:**
□ Incident response reports  
□ Recovery timelines
□ Monitoring procedures
□ Staff rotation policies  
□ Access logs
□ Communication records

### **Immediate Recommendations:**
**Priority 1:** _________________________________________________
**Priority 2:** _________________________________________________  
**Priority 3:** _________________________________________________

### **Client Concerns/Pushback:**
_____________________________________________________________

### **Follow-up Required:**
□ Additional documentation needed
□ Technical demonstration required
□ Leadership interview needed
□ External validation check

**Next Steps:** _______________________________________________

---

## ✅ AUDITOR CHECKLIST

**Pre-Assessment (5 min):**
□ Review client's recent incident history
□ Identify key personnel for interviews
□ Prepare evidence collection requests

**During Assessment (22 min):**
□ Complete Quick Assessment checklist
□ Collect all required evidence  
□ Conduct key interviews
□ Document findings in real-time

**Post-Assessment (3 min):**
□ Calculate final risk score
□ Identify top 3 solution priorities
□ Schedule follow-up if needed
□ Prepare executive summary

**Total Time Allocation:** 30 minutes maximum

---

*Field Kit Version 1.0 | CPF Indicator 7.10 | Recovery Period Vulnerabilities*