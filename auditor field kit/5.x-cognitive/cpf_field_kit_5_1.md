# CPF FIELD KIT 5.1: Alert Fatigue Desensitization

## ⚡ QUICK ASSESSMENT (5 minutes)

**Check YES/NO for each observable condition:**

□ **YES/NO**: Security team receives >150 alerts per analyst per day
□ **YES/NO**: False positive rate exceeds 70% (or team estimates "most alerts are false")
□ **YES/NO**: Average response time to alerts exceeds 4 hours
□ **YES/NO**: No formal alert tuning process exists (no documented reviews/changes)
□ **YES/NO**: Analysts regularly complain about "alert noise" or "too many alerts"
□ **YES/NO**: Critical security incidents were missed in past 12 months
□ **YES/NO**: Analysts have disabled/suppressed alert types without formal approval

**Quick Score**: 0-2 YES = Green | 3-4 YES = Yellow | 5+ YES = Red

---

## 📝 EVIDENCE COLLECTION (10 minutes)

### Documents to Request
- [ ] **SIEM/Alert logs** from past 30 days showing daily volumes
- [ ] **Alert resolution reports** showing disposition (false positive/actionable)
- [ ] **Incident response tickets** with timestamps (alert→investigation)
- [ ] **Alert tuning documentation** (configuration changes, approvals)
- [ ] **Security staffing schedule** (coverage during absences)

### System Demonstrations
- [ ] **"Show me your alert dashboard"** - observe current alert volumes
- [ ] **"Walk through investigating this alert"** - time the process
- [ ] **"Show me disabled/filtered alerts"** - identify suppressed notifications
- [ ] **"Demonstrate escalation process"** - verify coverage procedures

### Key Interviews
- [ ] **SOC Analysts** (2-3 individuals): Daily alert handling experience
- [ ] **Security Manager**: Alert management policies and procedures
- [ ] **IT Operations**: System maintenance impact on alerts
- [ ] **Recent hire**: Training on alert handling

### System Checks
- [ ] **Alert volume calculation**: Total alerts ÷ number of analysts ÷ days
- [ ] **Response time analysis**: Review timestamps in ticketing system
- [ ] **False positive rate**: (Dismissed alerts ÷ Total alerts) × 100

---

## 🎯 RAPID SCORING (2 minutes)

**Decision Tree - Start Here:**

**STEP 1**: Daily alerts per analyst?
- **<50**: Continue to Step 2
- **50-150**: Skip to Yellow criteria check
- **>150**: Score RED immediately

**STEP 2**: False positive rate?
- **<30%**: Continue to Step 3  
- **30-70%**: Skip to Yellow criteria check
- **>70%**: Score RED immediately

**STEP 3**: Response time consistency?
- **<30 min average**: Continue to Step 4
- **30min-4hr variable**: Yellow criteria check
- **>4hr frequent**: Score RED immediately

**STEP 4**: Formal processes exist?
- **Yes + documented**: Score GREEN
- **Informal only**: Score YELLOW
- **None**: Score RED

**Yellow Criteria Check** (need 2+ for Yellow, otherwise Green):
- □ Inconsistent response times
- □ Some missed incidents
- □ Informal alert management
- □ Occasional complaints

---

## 🔧 SOLUTION PRIORITIES (5 minutes)

### HIGH IMPACT - Quick Implementation
| Solution | Cost | Time | Dependencies |
|----------|------|------|--------------|
| **Alert volume audit** | Low | 1-2 weeks | Current SIEM access |
| **False positive baseline** | Low | 1 week | Alert logs |
| **Basic alert tuning** | Medium | 2-4 weeks | Vendor support |

### MEDIUM IMPACT - Long-term 
| Solution | Cost | Time | Dependencies |
|----------|------|------|--------------|
| **Alert prioritization system** | High | 3-6 months | Budget approval |
| **Cross-training program** | Medium | 2-3 months | Staff availability |
| **Consolidated dashboard** | Medium | 1-3 months | Tool integration |

### FOUNDATIONAL - Strategic
| Solution | Cost | Time | Dependencies |
|----------|------|------|--------------|
| **SIEM replacement/upgrade** | High | 6-12 months | Major budget cycle |
| **Security tool consolidation** | High | 6-18 months | Architecture review |
| **Staffing increase** | High | 3-6 months | HR approval |

---

## 💬 CLIENT CONVERSATION (3 minutes)

### Opening Questions
**"How many security alerts does your team see on a typical day?"**
- *Follow-up*: "How many require actual action?"
- *Red flag*: Vague answers or "too many to count"

**"Tell me about a recent security incident you missed or detected late."**
- *Follow-up*: "Were there alerts that should have caught it?"
- *Red flag*: Multiple incidents or dismissive attitude

**"What happens when your security analyst calls in sick?"**
- *Follow-up*: "How do you ensure alert coverage?"
- *Red flag*: No backup plan or single points of failure

### Sensitive Topics
**Instead of**: "Do your analysts ignore alerts?"
**Say**: "How does your team prioritize which alerts to investigate first?"

**Instead of**: "Are your security tools poorly configured?"
**Say**: "How often do you review and tune your alert thresholds?"

**Instead of**: "Do you have alert fatigue problems?"
**Say**: "How do you measure the effectiveness of your security alerts?"

### Red Flag Responses
- [ ] **"We get so many alerts we can't keep up"**
- [ ] **"Most of our alerts are false positives"**
- [ ] **"We've had to turn off some monitoring because of noise"**
- [ ] **"Our analysts complain about alert overload"**
- [ ] **"We missed [incident] because it got lost in all the alerts"**

---

## 📊 FIELD NOTES TEMPLATE

**Assessment Date**: ________________  **Auditor**: ________________

### Alert Volume Metrics
- **Total daily alerts**: ______
- **Number of analysts**: ______  
- **Alerts per analyst per day**: ______

### False Positive Analysis
- **Total alerts reviewed (30 days)**: ______
- **False positives**: ______ **Percentage**: ______%

### Response Time Data  
- **Average response time**: ______ hours
- **Longest response time**: ______ hours
- **Response time during high-volume periods**: ______ hours

### Process Documentation
- [ ] **Alert tuning process documented**
- [ ] **Regular review schedule exists** 
- [ ] **Escalation procedures defined**
- [ ] **Coverage plan for absences**

### Staff Feedback Summary
**Analyst #1**: ________________________________
**Analyst #2**: ________________________________  
**Manager**: ___________________________________

### Critical Findings
**Missed Incidents**: ___________________________
**Disabled Monitoring**: ________________________
**Staff Complaints**: ___________________________

### Immediate Recommendations
1. ____________________________________________
2. ____________________________________________
3. ____________________________________________

**Overall Score**: □ Green □ Yellow □ Red

**Confidence Level**: □ High □ Medium □ Low

---

**Assessment Complete - Total Time: ~22 minutes**