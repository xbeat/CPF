# Categoria 4: Vulnerabilità Affettive

Questa directory contiene schemi di implementazione dettagliati per tutti i 10 indicatori nella categoria di vulnerabilità Affettiva (Emotiva).

## Panoramica

Le vulnerabilità affettive sfruttano stati emotivi—paura, eccitazione, fiducia, curiosità—per manipolare le decisioni di sicurezza e aggirare la valutazione razionale delle minacce.

## Indicatori

1. **[4.1] Paralisi Dovuta a Paura** - Panico che impedisce una risposta efficace
2. **[4.2] Avventatezza Indotta dall'Eccitazione** - Emozioni positive che riducono la vigilanza
3. **[4.3] Sfruttamento della Fiducia** - Fiducia mal riposta negli attaccanti
4. **[4.4] Contagio Emotivo** - Diffusione di stati emotivi che influenzano i team
5. **[4.5] Sfruttamento della Curiosità** - Usare la curiosità per innescare comportamenti rischiosi
6. **[4.6] Decisioni Guidate dalla Rabbia** - Ostilità che porta a scelte sbagliate
7. **[4.7] Pregiudizio di Speranza/Ottimismo** - Sottovalutare le minacce per pensiero desideroso
8. **[4.8] Passività Indotta dalla Tristezza** - Umore basso che riduce l'impegno nella sicurezza
9. **[4.9] Sfruttamento dell'Empatia** - Usare la simpatia per manipolare la conformità
10. **[4.10] Esaurimento Emotivo** - Deplezione delle risorse emotive

## Schema di Implementazione

Ogni indicatore segue il framework **OFTLISRV** con rilevamento dello stato emotivo.

## Metriche Chiave

### Emotional Arousal Score
```
EAS = Sentiment_polarity × Sentiment_intensity
```
Intervallo: [-1, 1], dove gli estremi indicano vulnerabilità.

### Fear Response Index
```
FRI = Response_delay × Error_rate × Escalation_frequency
```

### Trust Exploitation Score
```
TES = Successful_social_engineering / Total_attempts
```

## Fonti Dati Principali

- **Email/Comunicazione**: Analisi del sentimento dei messaggi
- **Simulazioni di Phishing**: Tassi di clic, tassi di segnalazione
- **SIEM**: Pattern di accesso inusuali durante eventi emotivi
- **Dati di Incidente**: Qualità della risposta durante periodi ad alta emozione
- **Sistemi HR**: Eventi organizzativi (licenziamenti, acquisizioni)
- **Esterni**: Sentimento delle notizie sull'azienda

## Approccio di Rilevamento

### Analisi del Sentimento
```python
from sentiment_analyzer import analyze

# Analizza messaggi email/slack
sentiment = analyze(message_text)

if sentiment.polarity < -0.5:  # Fortemente negativo
    flag_emotional_state(user, 'paura/tristezza')
elif sentiment.polarity > 0.5:  # Fortemente positivo
    flag_emotional_state(user, 'eccitazione/ottimismo')
```

### Marcatori di Rilevamento della Paura
- Parole chiave: urgente, critico, violazione, attacco, causa legale
- Pattern di escalation inusuali
- Picchi di attività fuori orario
- Decisioni rapide senza verifica

### Marcatori di Rilevamento dell'Eccitazione
- Parole chiave: opportunità, esclusivo, ricompensa, vincitore
- Passi di verifica ridotti
- Eccezioni alle politiche per casi "speciali"

## Stabilimento della Baseline

Gli indicatori affettivi richiedono:
- Baseline di 60 giorni dei pattern di sentimento normali
- Pattern di risposta emotiva individuali
- Clima emotivo organizzativo
- Correlazione con eventi esterni

## Tipi di Eventi Comuni

- `phishing_clicked` → 4.3, 4.5, 4.9 (fiducia, curiosità, empatia)
- `crisis_event` → 4.1 (paralisi da paura)
- `good_news` → 4.2, 4.7 (eccitazione, ottimismo)
- `major_incident` → 4.4, 4.10 (contagio, esaurimento)
- `conflict_detected` → 4.6 (rabbia)

## Livelli di Rischio

- **Basso** (0-0.33): Stabilità emotiva, decisioni razionali
- **Medio** (0.34-0.66): Influenza emotiva, qualche danno
- **Alto** (0.67-1.00): Stato emotivo forte, vulnerabilità significativa

## Strategie di Mitigazione

### Tecnico
- Monitoraggio potenziato durante stress organizzativo
- Verifica automatica per richieste cariche di emozione
- Circuit breaker per decisioni rapide

### Organizzativo
- Formazione sull'intelligenza emotiva
- Risorse di supporto per la salute mentale
- Comunicazione trasparente durante crisi
- Protocolli di celebrazione che mantengono la consapevolezza della sicurezza

### Processo
- Periodo di raffreddamento obbligatorio per decisioni ad alta emozione
- Sistema di coppia per la verifica durante lo stress
- Debriefing dopo incidenti emotivi

## Risorse Correlate

- **Fondazione Densa**: `/foundation docs/core/it-IT/` - Modelli di vulnerabilità affettiva
- **Esempi di Pattern**: `/docs/cpf_pattern_examples_list.md`
- **Dashboard**: `/dashboard/soc/` - Indicatori dello stato emotivo
