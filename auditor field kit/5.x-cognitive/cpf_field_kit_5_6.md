# 📋 CPF INDICATOR 5.6 FIELD KIT: COGNITIVE TUNNELING

## ⚡ QUICK ASSESSMENT (5 minutes)

**Check YES/NO for each observable indicator:**

□ **YES/NO**: Organization has documented procedures requiring attention rotation during incidents lasting >2 hours

□ **YES/NO**: SIEM/security tools have active correlation rules flagging simultaneous alerts across different security domains (network + endpoint + email, etc.)

□ **YES/NO**: Security team uses buddy system or paired monitoring during high-priority incidents

□ **YES/NO**: Formal approval process exists for bypassing security controls during urgent operations

□ **YES/NO**: Organization can show evidence of successfully detecting multi-vector attacks in past 12 months

□ **YES/NO**: Training records show cognitive tunneling awareness training conducted within past 24 months

□ **YES/NO**: Automated monitoring systems continue background scanning when human teams focus on specific incidents

---

## 📝 EVIDENCE COLLECTION (10 minutes)

### **Documents to Request**
- [ ] Incident response procedures (look for attention management requirements)
- [ ] SIEM correlation rules configuration
- [ ] Security override/exception approval logs from past 90 days
- [ ] Training records for security team (past 24 months)
- [ ] Post-incident reports from past 12 months (check for multi-vector mentions)

### **System Demonstrations**
- [ ] "Show me your SIEM dashboard during a simulated high-priority alert"
- [ ] "Walk through your incident response process for a network intrusion"
- [ ] "Demonstrate how alerts from different security tools get correlated"
- [ ] "Show me how temporary security exceptions get approved and restored"

### **Key Interview Targets**
- [ ] **SOC Manager/Lead**: Daily operations and team coordination
- [ ] **Senior SOC Analyst**: Real incident experiences and challenges
- [ ] **IT Operations Manager**: Security control bypass procedures
- [ ] **CISO/Security Director**: Training programs and policies

### **System Checks**
- [ ] Review alert volume and correlation rates in SIEM for past 30 days
- [ ] Check for automated background monitoring configurations
- [ ] Verify security exception logs show approval workflows
- [ ] Examine incident response team size and rotation schedules

---

## 🎯 RAPID SCORING (2 minutes)

### **Decision Tree**

**START HERE** → Does organization have documented attention rotation procedures + SIEM correlation rules + buddy system?

**↓ YES** → Can they show evidence of detecting multi-vector attacks + formal security override process?
   - **YES** → **GREEN (0)**: Strong cognitive tunneling controls
   - **NO** → **YELLOW (1)**: Partial controls, missing evidence

**↓ NO** → Do they have any systematic multi-vector detection OR attention management procedures?
   - **YES** → **YELLOW (1)**: Some controls but inconsistent
   - **NO** → **RED (2)**: No systematic tunneling prevention

### **Objective Thresholds**
- **GREEN**: ≥5 YES answers in Quick Assessment + evidence of multi-vector detection
- **YELLOW**: 3-4 YES answers + partial evidence
- **RED**: ≤2 YES answers + no multi-vector detection evidence

---

## 🔧 SOLUTION PRIORITIES (5 minutes)

### **HIGH IMPACT - Quick Implementation**
| Solution | Cost | Time | Dependencies |
|----------|------|------|--------------|
| **Attention Rotation Protocol** | Low | 2 weeks | Team training only |
| **SIEM Correlation Rules** | Low | 1 week | Existing SIEM system |
| **Incident Response Buddy System** | Low | 1 week | None |

### **HIGH IMPACT - Long-term**
| Solution | Cost | Time | Dependencies |
|----------|------|------|--------------|
| **Cross-Domain Alert Dashboard** | Medium | 8 weeks | SIEM upgrade possible |
| **Automated Background Monitoring** | High | 12 weeks | AI/ML capabilities |
| **Security Override Controls** | Low | 4 weeks | Workflow system |

### **MEDIUM IMPACT**
| Solution | Cost | Time | Dependencies |
|----------|------|------|--------------|
| **Peripheral Awareness Training** | Medium | 6 weeks | Training vendor |
| **Tabletop Exercises** | Low | 4 weeks | Scenario development |

---

## 💬 CLIENT CONVERSATION SCRIPT (3 minutes)

### **Opening Questions**
- *"Walk me through what happens when you get a high-priority security alert while already working another incident."*
- *"Tell me about the last time you discovered an attack was more complex than it first appeared."*
- *"How do you ensure your team doesn't miss other threats when focused on urgent IT problems?"*

### **Follow-up Prompts for Incomplete Answers**
- **If they mention procedures**: *"Can you show me the documented process? When was it last used?"*
- **If they mention training**: *"What specific scenarios do you practice? How do you measure effectiveness?"*
- **If they mention tools**: *"Demonstrate how alerts from different systems get connected together."*

### **Red Flag Indicators**
- **🚩** "We handle incidents as they come" (no systematic approach)
- **🚩** "Our team is small so everyone focuses on the biggest problem" (resource-driven tunneling)
- **🚩** "We've never had a multi-vector attack" (lack of awareness/detection)
- **🚩** "During outages, security takes a back seat" (operational override culture)

### **Professional Language for Sensitive Topics**
- Instead of: *"Your team misses threats"*
- Say: *"Let's explore how to maintain broad awareness during intensive focus periods"*

- Instead of: *"You have blind spots"*
- Say: *"We're assessing situational awareness capabilities across multiple threat vectors"*

---

## 📊 FIELD NOTES TEMPLATE

**Assessment Date**: ___________  **Auditor**: _______________

### **Key Findings**
**Strengths Observed**:
- □ _________________________________
- □ _________________________________
- □ _________________________________

**Gaps Identified**:
- □ _________________________________
- □ _________________________________
- □ _________________________________

### **Evidence Collected**
- [ ] Incident response procedures reviewed
- [ ] SIEM correlation demonstrated
- [ ] Training records verified
- [ ] Multi-vector detection evidence: **YES/NO**

### **Immediate Recommendations**
**Priority 1** (Implement within 30 days):
- _________________________________

**Priority 2** (Implement within 90 days):
- _________________________________

### **Risk Assessment**
**Current Risk Level**: **GREEN / YELLOW / RED**

**Primary Concern**: _________________________________

**Business Impact if Unaddressed**: _________________________________

### **Client Next Steps**
1. _________________________________
2. _________________________________
3. _________________________________

**Follow-up Date**: ___________

---

## 📋 QUICK REFERENCE CHECKLIST

**Pre-Assessment Setup** (2 min):
- [ ] SIEM access arranged
- [ ] Key personnel available
- [ ] Incident response docs ready

**During Assessment**:
- [ ] Quick Assessment completed
- [ ] Evidence collected and documented
- [ ] System demonstrations observed
- [ ] Key interviews conducted

**Post-Assessment** (5 min):
- [ ] Scoring completed using decision tree
- [ ] Priority solutions identified
- [ ] Field notes completed
- [ ] Client next steps documented

**Total Time Budget**: 22 minutes maximum