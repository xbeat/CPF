# 🎛️ CPF Simulator - Dashboard UI Guide

## 🚀 NUOVO! Interfaccia Web Completa

Il simulatore ora ha una **dashboard web completa** per controllare tutto visualmente, senza bisogno di comandi da terminale!

---

## Quick Start (3 Passi)

### 1️⃣ Avvia Server (NO parametri necessari!)

```bash
cd dashboard
npm start
```

**NOTA IMPORTANTE**:
- ✅ **NON serve** più `SIMULATOR_MODE=true`
- ✅ Il simulatore si attiva automaticamente on-demand
- ✅ Nessuna configurazione richiesta

### 2️⃣ Apri Dashboard Simulator

Browser: **http://localhost:3000/dashboard/simulator/**

### 3️⃣ Usa l'Interfaccia!

- Seleziona organizzazione dalla sidebar
- Scegli modalità (Auto/Manual)
- Click Start → Fatto! ✅

---

## 🎯 Caratteristiche Dashboard

### Sidebar - Organizzazioni
- 📋 Lista tutte le organizzazioni
- 📊 Mostra stats (Risk, Assessments)
- ✅ Click per selezionare

### Pannello Controlli

**🤖 Modalità Automatica (Continuous)**
- Seleziona scenario (Phishing, Ransomware, APT, etc.)
- Imposta rate eventi/secondo (1-100)
- Durata in secondi (0 = infinito)
- Il simulatore genera eventi automaticamente in background

**📝 Modalità Manuale (On-Demand)**
- Seleziona tipo evento specifico
- Imposta severity (Low → Critical)
- Count (numero eventi)
- Click "⚡ Emit Event" quando vuoi

### SIEM/EDR Sources
☑️ Splunk Enterprise
☑️ IBM QRadar
☑️ Microsoft Sentinel
☑️ CrowdStrike Falcon

Spunta/deseleziona per scegliere quali simulare.

### Statistiche Live
- 📊 Eventi Generati
- 📝 Assessments Creati
- ⏱️ Uptime
- 🎬 Scenario Attivo

### Event Log
Console in tempo reale con:
- Timestamp eventi
- Azioni eseguite
- Errori/warning
- Stato simulatore

---

## 🎬 Scenari Disponibili

| ID | Nome | Durata | Intensità | Descrizione |
|----|------|--------|-----------|-------------|
| `normal` | Normal Operations | Continuo | Low | Baseline operativo normale |
| `phishing-campaign` | Phishing Campaign | 1h | High | Attacco phishing coordinato |
| `ransomware-attack` | Ransomware Attack | 2h | Critical | Ransomware multi-stage |
| `insider-threat` | Insider Threat | 3h | Medium | Minaccia interna |
| `apt-intrusion` | APT Intrusion | 24h | Critical | Advanced Persistent Threat |
| `credential-stuffing` | Credential Stuffing | 30min | High | Brute force credentials |
| `supply-chain-compromise` | Supply Chain Attack | 4h | Critical | Compromissione supply chain |
| `ddos-attack` | DDoS Attack | 1h | High | Attacco DDoS |

---

## 📖 Workflow Tipico

### Scenario A: Test Phishing Attack

**1. Prepara**
```bash
cd dashboard && npm start
```

**2. Dashboard**
- Apri http://localhost:3000/dashboard/simulator/
- Seleziona organizzazione (o creane una)

**3. Configura**
- Mode: 🤖 Automatic
- Scenario: "Phishing Campaign"
- Rate: 20 eventi/sec
- Duration: 180 secondi (3 minuti)
- Sources: Splunk ✓, Sentinel ✓

**4. Avvia**
- Click "▶️ Start Simulator"
- Vedi log popolarsi in real-time
- Statistiche si aggiornano ogni 2 secondi

**5. Visualizza Impatto**
- Click "📊 View SOC Dashboard" (si apre in nuova tab)
- Seleziona stessa organizzazione
- Vedrai:
  - Overall Risk salire (specialmente 3.x Social, 4.x Affective)
  - Heatmap colorarsi di rosso
  - Indicator Grid mostrare valori alti

**6. Termina**
- Dopo 3 minuti si ferma automaticamente
- Oppure click "⏹️ Stop Simulator" quando vuoi

---

### Scenario B: Emissione Manuale Eventi

**1. Dashboard**
- http://localhost:3000/dashboard/simulator/
- Seleziona organizzazione

**2. Modalità Manuale**
- Click "📝 Manual"

**3. Emetti Eventi Specifici**
```
Event Type: "Malware Detected"
Severity: "Critical"
Count: 10
Sources: CrowdStrike ✓

→ Click "⚡ Emit Event"
```

**4. Osserva**
- Log: "✅ Emitted 10 event(s)"
- Stats: "Assessments Created" si aggiorna
- Vai a SOC Dashboard → Refresh → Vedi indicatori aggiornati

**5. Emetti Altri Eventi**
```
Event Type: "Data Exfiltration"
Severity: "High"
Count: 5

→ Click "⚡ Emit Event"
```

**6. Ripeti** quanto vuoi!

---

## 🆚 Dashboard UI vs CLI

### Dashboard UI (Raccomandato)
✅ Visuale e intuitivo
✅ Sidebar con organizzazioni
✅ Statistiche live
✅ Event log in tempo reale
✅ Nessun comando da ricordare
✅ Perfetto per demo e testing

### CLI (Terminale)
✅ Automazione e scripting
✅ CI/CD pipelines
✅ Headless environments
✅ Batch operations

Vedi `README.md` per comandi CLI.

---

## 🔧 Configurazione Avanzata

### Cambiare Rate Eventi

**Dashboard**: Slider "Event Rate" (1-100)

**Cosa significa?**
- **1-5**: Lento, realistico, per osservare singoli eventi
- **10-20**: Medio, bilanciato, per test standard
- **50-100**: Veloce, per popolare rapidamente dati

### Durata Scenari

- **0 secondi** = Infinito (fino a Stop manuale)
- **60-300** = Breve (1-5 minuti), per quick test
- **3600+** = Lungo (1+ ora), per simulazioni realistiche

### Selezione SIEM Sources

Puoi combinare:
- ✓ Splunk + CrowdStrike → Focus su malware/endpoint
- ✓ QRadar + Sentinel → Focus su network/cloud
- ✓ Tutti e 4 → Coverage completo

---

## ⚡ Tips & Tricks

### Tip 1: Refresh SOC Dashboard
La SOC Dashboard NON fa auto-refresh. Dopo aver avviato simulatore:
1. Apri SOC Dashboard
2. Seleziona organizzazione
3. Aspetta 10-30 secondi
4. **Refresh (F5)** → Vedrai nuovi dati!

### Tip 2: Event Log Pulizia
Se il log diventa troppo lungo:
- Click "Clear" button → Reset log

### Tip 3: Multiple Organizations
Puoi simulare più organizzazioni contemporaneamente:
1. Seleziona Org A → Start simulatore (scenario X)
2. Seleziona Org B → Start simulatore (scenario Y)
3. Entrambe girano in parallelo!

### Tip 4: Stop Automatico
Se imposti Duration > 0, lo scenario si ferma automaticamente alla fine.
Vedrai nel log: "✅ Simulator stopped. Events: XXX"

### Tip 5: Monitoring Status
Sidebar mostra "Status Indicator":
- 🟢 Verde pulsante = Simulator attivo
- 🔴 Rosso = Simulator fermo

---

## 🐛 Troubleshooting

### Dashboard non carica organizzazioni
**Causa**: Nessuna organizzazione nel database

**Soluzione**:
```bash
# Vai a Auditing Dashboard e creane una
http://localhost:3000/dashboard/auditing/

# Oppure via CLI
curl -X POST http://localhost:3000/api/organizations \
  -H "Content-Type: application/json" \
  -d '{"id":"test-001","name":"Test","industry":"Tech","size":"small","country":"IT"}'
```

### Simulatore non parte
**Causa 1**: Organizzazione non selezionata
→ Soluzione: Click su un'organizzazione nella sidebar

**Causa 2**: Nessuna source selezionata
→ Soluzione: Spunta almeno una checkbox SIEM

**Causa 3**: Errore server
→ Soluzione: Guarda console browser (F12) o log server

### Stats non si aggiornano
**Causa**: Simulatore non running o crash

**Soluzione**:
1. Click "⏹️ Stop Simulator"
2. Attendi 2 secondi
3. Click "▶️ Start Simulator"

### SOC Dashboard non mostra dati
**Causa 1**: Non hai fatto refresh dopo simulazione
→ Soluzione: F5 per ricaricare

**Causa 2**: Simulazione troppo breve
→ Soluzione: Aspetta almeno 10-20 secondi prima di controllare

---

## 📚 Link Utili

- **Simulator Dashboard**: http://localhost:3000/dashboard/simulator/
- **SOC Dashboard**: http://localhost:3000/dashboard/soc/
- **Auditing Dashboard**: http://localhost:3000/dashboard/auditing/
- **API Docs**: Vedi `README.md`
- **Configurazione**: `/simulator/config/sources.json`, `/simulator/config/scenarios.json`

---

## 🎥 Video Tutorial (Simulato)

### 1. Quick Start (30 secondi)
```
1. npm start
2. Apri http://localhost:3000/dashboard/simulator/
3. Seleziona org
4. Click "▶️ Start"
→ FATTO!
```

### 2. Phishing Attack Demo (2 minuti)
```
1. Mode: Automatic
2. Scenario: "Phishing Campaign"
3. Rate: 15, Duration: 120
4. Start → Attendi 2 minuti
5. Apri SOC Dashboard
6. Vedi Social (3.x) e Affective (4.x) in rosso!
```

### 3. Manual Event Emission (1 minuto)
```
1. Mode: Manual
2. Event: "Ransomware Activity"
3. Severity: "Critical", Count: 20
4. Emit Event → Ripeti 3 volte
5. SOC Dashboard → Vedi Stress (7.x) esplodere!
```

---

## 🤝 Feedback

Hai suggerimenti per la dashboard? Apri issue su GitHub!

## 📝 Changelog

**v2.0** (2025-11-14)
- ✨ Aggiunta Dashboard UI completa
- ✨ Modalità Auto/Manual
- ✨ Event log in tempo reale
- ✨ Lazy-loading simulatore (no SIMULATOR_MODE required)
- ✨ API `/api/simulator/emit` per eventi manuali
- 🐛 Fix: Nessun restart server necessario

**v1.0**
- Simulatore via CLI only
