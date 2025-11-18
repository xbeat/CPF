# Categoria 8: Vulnerabilità dei Processi Inconsci

Questa directory contiene schemi di implementazione dettagliati per tutti i 10 indicatori nella categoria di vulnerabilità dei Processi Inconsci.

## Panoramica

Le vulnerabilità dei processi inconsci sfruttano i comportamenti automatici, i pregiudizi impliciti, i modelli abituali e i processi cognitivi che operano al di sotto della consapevolezza cosciente.

## Indicatori

1. **[8.1] Proiezione dell'ombra su attaccanti** - Leveraging di schemi di risposta automatici
2. **[8.2] Identificazione Inconscia con Minacce** - Pregiudizi inconsci che influenzano le decisioni
3. **[8.3] Sfruttamento del Comportamento Abituale** - Targeting dei comportamenti di routine
4. **[8.4] Effetti di Priming** - Influenza inconscia dall'esposizione precedente
5. **[8.5] Bias di Ancoramento** - Over-reliance sul primo pezzo di informazione
6. **[8.6] Bias di Conferma** - Ricerca di informazioni che confermano le convinzioni esistenti
7. **[8.7] Euristica della Disponibilità** - Over-weighting di informazioni facilmente ricordate
8. **[8.8] Euristica del Riconoscimento** - Fiducia nei modelli familiari rispetto all'analisi
9. **[8.9] Euristica dell'Affetto** - Uso delle emozioni come scorciatoie per le decisioni
10. **[8.10] Meccanismi di Difesa Inconsci** - Negazione, proiezione, razionalizzazione

## Schema di Implementazione

Ogni indicatore segue il framework **OFTLISRV** con focus sulla rilevazione di modelli inconsci.

## Metriche Chiave

### Punteggio di Automaticità
```
AS = Velocità_Risposta / Profondità_Verifica
```
Un punteggio elevato indica una risposta automatica senza elaborazione conscia.

### Indice di Pregiudizio Implicito
```
IBI = (Decisioni_favorevoli_gruppo_A - Decisioni_favorevoli_gruppo_B) / Decisioni_totali
```

### Punteggio di Bias di Conferma
```
CBS = Info_supporta_ipotesi / (Info_supporta + Info_contraddice)
```
Punteggio > 0.7 indica un forte bias di conferma.

## Fonti Dati Chiave

- **SIEM**: Schemi di risposta, tassi di click-through, velocità di decisione
- **Email**: Schemi di interazione con diversi tipi di mittenti
- **Dati di Incidente**: Ampiezza dell'indagine, ipotesi alternative considerate
- **Ticketing**: Schemi di risoluzione, comportamenti di raccolta informazioni
- **Log di Audit**: Schemi di interazione del sistema che rivelano abitudini

## Approccio di Rilevazione

### Rilevazione di Automaticità
```python
# Identifica risposte automatiche
response_time = calculate_response_time(event)

if response_time < (baseline_time * 0.5):
    # Troppo veloce - probabilmente automatica
    verification_depth = analyze_verification_steps(event)

    if verification_depth < minimum_required:
        flag_automaticity_risk(user_id)
```

### Rilevazione di Bias di Conferma
```python
# Traccia la raccolta di informazioni nelle indagini
investigation = get_investigation(incident_id)

supporting_evidence = count_evidence_type('supporting')
contradicting_evidence = count_evidence_type('contradicting')

bias_ratio = supporting_evidence / (supporting_evidence + contradicting_evidence)

if bias_ratio > 0.7:  # Molto unilaterale
    flag_confirmation_bias(analyst_id)
```

### Riconoscimento di Modelli Abituali
```python
# Identifica sequenze di comportamento ripetute
user_actions = get_action_sequence(user_id, window=30_days)

# Trova modelli ricorrenti
patterns = find_frequent_sequences(user_actions, min_frequency=10)

for pattern in patterns:
    if pattern.variation < 0.1:  # Altamente coerente = abituale
        flag_habit_exploitation_risk(user_id, pattern)
```

## Stabilimento della Baseline

Gli indicatori dei processi inconsci richiedono:
- Baseline del modello comportamentale di 90 giorni
- Documentazione del processo decisionale
- Profili individuali di bias cognitivo
- Norme organizzative di indagine

## Tipi di Eventi Comuni

- `rapid_response` → 8.1, 8.8 (automaticità, riconoscimento)
- `investigation_incomplete` → 8.6, 8.7 (conferma, disponibilità)
- `familiar_pattern` → 8.3, 8.8 (abitudine, riconoscimento)
- `initial_anchor_set` → 8.5 (ancoraggio)
- `prior_exposure` → 8.4 (priming)

## Livelli di Rischio

- **Basso** (0-0.33): Deliberazione conscia, consapevolezza del bias
- **Medio** (0.34-0.66): Un po' di elaborazione automatica, bias gestibile
- **Alto** (0.67-1.00): Altamente automatico, forte influenza inconscia

## Strategie di Mitigazione

### Consapevolezza
- Addestramento sulla consapevolezza del bias
- Flashcard sui bias cognitivi
- Esercizi regolari di riflessione sul bias
- Identificazione del bias tra pari

### Strutturale
- Fasi di verifica obbligatoria
- Avvisi di rilevazione del bias automatizzata
- Revisione della decisione da parte di terzi indipendenti
- Team di indagine diversificati

### Processo
- Indagini basate su checklist
- Requisiti dell'avvocato del diavolo
- Documentazione di ipotesi alternative
- Tecniche di analisi cieca

## Risorse Correlate

- **Fondazione Densa**: `/foundation docs/core/it-IT/` - Modelli dei processi inconsci
- **Thinking Fast and Slow di Kahneman**: Fondamento teorico
- **Dashboard**: `/dashboard/soc/` - Visualizzazione degli indicatori di bias
- **Ricerca**: Bias cognitivi nella cybersecurity
