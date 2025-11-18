# CPF SOC Simulator - Logica e Funzionamento

## 📋 Indice
- [Come Funziona](#come-funziona)
- [Logica Attuale](#logica-attuale)
- [Distribuzione Eventi](#distribuzione-eventi)
- [Perché Diventano Tutti Rossi](#perché-diventano-tutti-rossi)
- [Prossimi Passi Consigliati](#prossimi-passi-consigliati)

---

## 🔄 Come Funziona

### 1. Avvio Simulatore
```
POST /api/simulator/start
{
  orgId: "uuid",
  sources: ["splunk", "qradar", "sentinel", "crowdstrike"],
  scenario: "normal",
  rate: 10  // eventi/secondo
}
```

### 2. Flusso Dati
```
┌─────────────────────────────────────────────────────────────┐
│ 1. GENERAZIONE EVENTI                                       │
│    ├─ Ogni 100ms (rate=10/sec)                             │
│    ├─ Genera 2-5 eventi casuali                            │
│    └─ Distribuzione ponderata per tipo                      │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. SELEZIONE EVENTO                                         │
│    ├─ 50% comuni (low severity)                            │
│    ├─ 30% medi (medium severity)                           │
│    ├─ 15% non comuni (medium severity)                     │
│    └─ 5% rari (high severity)                              │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. CONVERSIONE CPF (cpf-adapter.js)                        │
│    ├─ Cerca evento in EVENT_BASELINE matrix                │
│    ├─ Trova indicatori triggati                            │
│    └─ Per ogni indicatore:                                  │
│       ├─ Score = baseline (EVENT_BASELINE)                 │
│       ├─ + modulazione dinamica (event count, severity)    │
│       └─ × Bayesian context (time, pattern, user, geo)     │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. SALVATAGGIO (saveSocIndicator)                          │
│    ├─ Scrive {org-name}-soc.json                           │
│    ├─ Aggiorna previous_value                              │
│    └─ Emette WebSocket indicator_update                    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. DASHBOARD UPDATE (real-time)                            │
│    ├─ Riceve WebSocket event                               │
│    ├─ Ricarica SOC data                                    │
│    └─ Aggiorna celle matrice con colori/trend              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧮 Logica Attuale

### Calcolo Bayesian Score

```javascript
// TIER 1: Baseline Deterministico
baseRisk = EVENT_BASELINE[eventType][indicatorId]
// Esempio: phishing_clicked → 1.1 = 0.70

// TIER 2: Modulazione Dinamica
score = baseRisk
score += Math.log10(eventCount + 1) / 2 * 0.2  // Event frequency
score += avgSeverity * 0.15                      // Severity impact
score += maxSeverity * 0.1                       // Peak severity

// TIER 3: Bayesian Context Adjustment
contextFactor = 1.0
if (after_hours) contextFactor += 0.20          // Time of day
if (regular_pattern) contextFactor += 0.25      // Request pattern
if (mfa_verified) contextFactor -= 0.30         // Verification
if (privileged_user) contextFactor += 0.15      // User context
if (vpn_tor) contextFactor += 0.30              // Geo context

score *= contextFactor

// TIER 4: Scenario Multiplier
if (scenario !== 'normal') score *= 1.3

// Final score: clamp to [0, 1]
finalScore = Math.max(0, Math.min(1, score))
```

### Soglie Rischio
```
0.00 - 0.33: 🟢 Low Risk (verde)
0.34 - 0.66: 🟡 Medium Risk (giallo)
0.67 - 1.00: 🔴 High Risk (rosso)
```

---

## 📊 Distribuzione Eventi

### Eventi per Categoria (40+ tipi totali)

| Frequenza | % | Severità | Esempi | Indicatori Triggati |
|-----------|---|----------|--------|---------------------|
| **Comuni** | 50% | Low | authentication_failed, policy_violation, information_overload | 5-8 per evento |
| **Medi** | 30% | Medium | phishing_clicked, multitasking_detected, ai_recommendation_followed | 6-10 per evento |
| **Non Comuni** | 15% | Medium | privilege_escalation, social_engineering, groupthink_indicator | 8-12 per evento |
| **Rari** | 5% | High | ransomware_activity, crisis_event, ml_model_poisoning | 10-15 per evento |

### Coverage per Categoria CPF

| Categoria | Eventi Disponibili | Indicatori Coperti | Coverage |
|-----------|-------------------|-------------------|----------|
| 1. Authority-Based | 5 | 8-10 / 10 | 80-100% |
| 2. Temporal-Based | 3 | 6-8 / 10 | 60-80% |
| 3. Social-Based | 4 | 8-10 / 10 | 80-100% |
| 4. Affective-Based | 4 | 7-9 / 10 | 70-90% |
| 5. Cognitive-Based | 5 | 8-10 / 10 | 80-100% |
| 6. Group-Based | 3 | 6-7 / 10 | 60-70% |
| 7. Stress-Based | 5 | 7-8 / 10 | 70-80% |
| 8. Unconscious-Based | 4 | 6-8 / 10 | 60-80% |
| 9. AI-Enhanced | 4 | 6-7 / 10 | 60-70% |
| 10. Convergent | 3 | 5-6 / 10 | 50-60% |

**Coverage Totale**: ~60-80 indicatori su 100 (60-80%)

---

## ⚠️ Perché Diventano Tutti Rossi

### Problema Identificato

**TUTTI gli indicatori diventano rossi (>0.67) troppo velocemente (~1-2 minuti)**

### Cause

#### 1. **Baseline Già Alti**
```javascript
// Molti eventi hanno baseline naturalmente alti
'ransomware_activity': {
  '4.1': 0.85,  // Fear paralysis - già ROSSO dal primo evento!
  '7.1': 0.88,  // Acute stress - CRITICO
}

'phishing_clicked': {
  '1.1': 0.70,  // Unquestioning compliance - già borderline
  '1.3': 0.65,  // Authority impersonation
}
```

**Risultato**: Molti indicatori partono già in zona gialla/rossa dal primo evento.

#### 2. **Accumulo Senza Decay**
```javascript
// Ogni nuovo evento INCREMENTA sempre lo score
score += eventFactor * 0.2
score += avgSeverity * 0.15

// NON c'è decay temporale!
// previous_value NON viene mai ridotto
```

**Risultato**: Gli score possono solo SALIRE, mai scendere.

#### 3. **Event Frequency Troppo Alta**
```
Rate default: 10 eventi/sec
Ogni ciclo: 2-5 eventi generati
→ 20-50 eventi/sec effettivi!

In 60 secondi: 1200-3000 eventi
In 2 minuti: 2400-6000 eventi
```

**Risultato**: Saturazione rapida degli indicatori.

#### 4. **Stessi Indicatori Triggati Ripetutamente**
```javascript
// Eventi comuni (50%) triggano sempre gli stessi indicatori:
authentication_failed → sempre 1.1, 1.3, 1.5
policy_violation → sempre 1.7, 1.8
information_overload → sempre 5.1, 5.2
```

**Risultato**: ~15-20 indicatori bombardati continuamente, gli altri mai triggerati.

#### 5. **Context Multiplier Sempre Positivo**
```javascript
// Bayesian context tende ad AUMENTARE sempre lo score:
if (after_hours) +20%
if (privileged_user) +15%
if (vpn) +30%

// Riduzioni sono rare:
if (mfa_verified) -30%  // Quanto spesso succede?
```

**Risultato**: Context multiplier medio ~1.2-1.5x invece di ~1.0x.

---

## 🚀 Prossimi Passi Consigliati

### 1. **URGENT: Implementare Time Decay**

```javascript
// Decay esponenziale: score si riduce nel tempo
const DECAY_RATE = 0.95;  // 5% riduzione ogni aggiornamento
const MIN_THRESHOLD = 0.10; // Floor minimo

function applyTimeDecay(currentScore, lastUpdated) {
  const hoursSince = (Date.now() - new Date(lastUpdated)) / 3600000;
  const decayFactor = Math.pow(DECAY_RATE, hoursSince);
  const decayedScore = currentScore * decayFactor;

  return Math.max(MIN_THRESHOLD, decayedScore);
}
```

**Beneficio**: Gli score si normalizzano nel tempo, evitando saturazione permanente.

### 2. **Ridurre Baseline Values**

```javascript
// Scalare tutti i baseline del 30-40%
'phishing_clicked': {
  '1.1': 0.45,  // era 0.70
  '1.3': 0.40,  // era 0.65
}

'ransomware_activity': {
  '4.1': 0.60,  // era 0.85
  '7.1': 0.65,  // era 0.88
}
```

**Beneficio**: Partenza da valori realistici, crescita graduale.

### 3. **Diminuire Event Rate**

```javascript
// Opzioni:
rate: 2,  // 2 eventi/sec invece di 10
// Oppure
eventsPerCycle: 1,  // 1 evento invece di 2-5
```

**Beneficio**: Accumulo più lento e controllato.

### 4. **Implementare Indicator Cooldown**

```javascript
// Non triggerare lo stesso indicatore troppo spesso
const COOLDOWN_MS = 30000; // 30 secondi
const lastTriggered = {}; // indicatorId → timestamp

function canTrigger(indicatorId) {
  const last = lastTriggered[indicatorId];
  if (!last) return true;
  return (Date.now() - last) > COOLDOWN_MS;
}
```

**Beneficio**: Distribuzione più uniforme su tutti i 100 indicatori.

### 5. **Rotazione Event Types**

```javascript
// Evitare ripetizioni dello stesso evento
const recentEvents = []; // Queue ultimi 20 eventi
const MAX_SAME_EVENT = 2; // Max 2 volte stesso evento in queue

function selectEvent(eventTypes) {
  const available = eventTypes.filter(type => {
    const count = recentEvents.filter(e => e === type).length;
    return count < MAX_SAME_EVENT;
  });

  return available[Math.floor(Math.random() * available.length)];
}
```

**Beneficio**: Maggiore varietà, coverage più uniforme.

### 6. **Contextual Balancing**

```javascript
// Context deve oscillare intorno a 1.0, non sempre >1.0
function calculateBalancedContext(event) {
  let adjustment = 1.0;

  // Fattori positivi
  if (after_hours) adjustment += 0.15;
  if (privileged_user) adjustment += 0.10;

  // Fattori negativi (più probabili)
  if (business_hours) adjustment -= 0.10;
  if (known_user) adjustment -= 0.15;
  if (from_office) adjustment -= 0.10;

  return Math.max(0.6, Math.min(1.4, adjustment));
}
```

**Beneficio**: Context bilanciato, non sempre amplificante.

### 7. **Organization Profile**

```javascript
// Diversità tra organizzazioni
const ORG_PROFILES = {
  'finance': { baseline_multiplier: 1.2, decay_rate: 0.90 },
  'healthcare': { baseline_multiplier: 1.1, decay_rate: 0.92 },
  'retail': { baseline_multiplier: 0.9, decay_rate: 0.95 },
  'tech': { baseline_multiplier: 0.8, decay_rate: 0.97 }
};
```

**Beneficio**: Diversità realistica tra settori.

### 8. **Learning Period**

```javascript
// Prime 24h: baseline ridotti del 50%
// Giorni 2-7: incremento graduale
// Dopo 7 giorni: baseline normali

function getLearningMultiplier(orgStartDate) {
  const hoursSince = (Date.now() - orgStartDate) / 3600000;

  if (hoursSince < 24) return 0.5;
  if (hoursSince < 168) return 0.5 + (hoursSince / 168) * 0.5;
  return 1.0;
}
```

**Beneficio**: Crescita realistica, non esplosione immediata.

---

## 🎯 Implementazione Priorità

### FASE 1 (URGENTE - 1-2 ore)
1. ✅ Implementare Time Decay
2. ✅ Ridurre Event Rate (10 → 3 eventi/sec)
3. ✅ Scalare Baseline Values (-30%)

### FASE 2 (IMPORTANTE - 2-3 ore)
4. ⬜ Indicator Cooldown
5. ⬜ Event Type Rotation
6. ⬜ Contextual Balancing

### FASE 3 (ENHANCEMENT - 4-5 ore)
7. ⬜ Organization Profiles
8. ⬜ Learning Period
9. ⬜ Scenario-based Generation

---

## 📈 Comportamento Atteso (Dopo Fix)

### Timeline Realistica

```
T+0min:   ░░░░░░░░░░ 0-5 indicatori verdi (5%)
T+5min:   ░░░░░░░░░░ 10-15 indicatori verdi (15%)
T+15min:  ░░░░▓▓░░░░ 20-30 indicatori gialli (30%)
T+30min:  ░░▓▓▓▓▓░░░ 40-50 indicatori, mix verde/giallo (50%)
T+1h:     ░▓▓▓▓▓▓▓░░ 60-70 indicatori, alcuni rossi iniziano (70%)
T+2h:     ▓▓▓▓▓▓█▓▓░ 70-80 indicatori, 10-15% rossi (80%)
T+4h:     ▓▓▓███▓▓▓▓ 80-90 indicatori, 20-30% rossi (90%)
T+8h:     ██████████ Coverage completo, 30-40% rossi (100%)
```

### Distribuzione Finale (Dopo 8h)
```
🟢 Low (0-33%):    20-30 indicatori (20-30%)
🟡 Medium (34-66%): 40-50 indicatori (40-50%)
🔴 High (67-100%):  20-30 indicatori (20-30%)
```

**Curva bell-shaped realistica, non tutto rosso!**

---

## 🔍 Debug & Monitoring

### Log Events
```bash
tail -f /tmp/server.log | grep "SOC"
```

### Statistiche Real-time
```javascript
// Nel browser console (SOC/Simulator dashboard)
console.log('Coverage:', Object.keys(socData.indicators).length + '/100');
console.log('Distribuzione:', {
  low: Object.values(socData.indicators).filter(i => i.value < 0.33).length,
  medium: Object.values(socData.indicators).filter(i => i.value >= 0.33 && i.value < 0.67).length,
  high: Object.values(socData.indicators).filter(i => i.value >= 0.67).length
});
```

---

**Vuoi che implementi le fix della FASE 1 (urgente) per rendere la simulazione più realistica?**
