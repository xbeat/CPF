# Categoria 2: Vulnerabilità Temporali

Questa directory contiene schemi di implementazione dettagliati per tutti i 10 indicatori nella categoria di vulnerabilità Temporale.

## Panoramica

Le vulnerabilità temporali sfruttano la pressione del tempo, lo stress dei deadline e la manipolazione dell'urgenza per indurre comportamenti degradanti dal punto di vista della sicurezza.

## Indicatori

1. **[2.1] Bypass della Sicurezza Indotto dall'Urgenza** - Analisi del tempo di completamento dei compiti sotto pressione
2. **[2.2] Degradazione Decisionale per Pressione Temporale** - Metriche di qualità delle decisioni vs prossimità ai deadline
3. **[2.3] Accettazione del Rischio Guidata dai Deadline** - Richieste di eccezione correlate ai deadline dei progetti
4. **[2.4] Affaticamento della Sicurezza Fuori dall'Orario** - Schemi di eventi fuori orario e tassi di errore
5. **[2.5] Implementazione di Cambiamenti Affrettati** - Bypass del controllo dei cambiamenti durante i vincoli di tempo
6. **[2.6] Effetto del Countdown della Crisi** - Degradazione del comportamento man mano che i deadline si avvicinano
7. **[2.7] Sconto Temporale della Sicurezza** - Sconto iperbolico nelle decisioni sulla sicurezza
8. **[2.8] Sfruttamento nei Weekend/Giorni Festivi** - Ridotta vigilanza durante i periodi fuori orario
9. **[2.9] Vulnerabilità della Transizione di Turno** - Incidenti durante i periodi di passaggio
10. **[2.10] Suscettibilità all'Urgenza Artificiale** - Risposta alla pressione temporale prodotta

## Schema di Implementazione

Ogni file indicatore segue il framework **OFTLISRV** per l'operazionalizzazione sistematica.

## Formule Chiave

### Tasso di Bypass Indotto dall'Urgenza
```
U_i = (Δt_normal - Δt_urgent) / Δt_normal
```
Quando U_i > 0.5 (accelerazione del 50%), la degradazione della sicurezza è prevedibile.

### Sconto Iperbolico
```
V = A / (1 + k × D)
```
Dove A = valore effettivo, D = ritardo, k = tasso di sconto (calibrato per organizzazione)

## Fonti Dati Principali

- **Sistemi di Gestione Progettuale**: Deadline, date dei milestone, programmi sprint
- **Gestione dei Cambiamenti**: Timestamp delle richieste di cambio, tempi di approvazione
- **SIEM**: Timestamp degli eventi, attività fuori orario
- **Ticketing**: Tempi di risoluzione dei problemi, conformità SLA
- **Email/Slack**: Parole chiave di urgenza, indicatori di pressione temporale

## Approccio di Rilevamento

### Regressione di Poisson per il Tasso di Bypass
```
λ = e^(β₀ + β₁×pressure + β₂×deadline_proximity)
```
Modella il tasso di bypass previsto data la pressione temporale.

## Stabilimento della Linea di Base

Gli indicatori temporali richiedono:
- Linea di base di 60 giorni per i tempi normali di completamento dei compiti
- Schemi di orario di ufficio per dipartimento
- Schemi di deadline stagionali/ciclici
- Dati del programma di turno

## Tipi di Eventi Comuni

- `urgent_request` → 2.1, 2.10
- `after_hours_access` → 2.4, 2.8
- `change_expedited` → 2.5, 2.6
- `shift_handoff` → 2.9
- `deadline_approaching` → 2.3, 2.7

## Livelli di Rischio

- **Basso** (0-0.33): Pressione temporale normale, controlli mantenuti
- **Medio** (0.34-0.66): Pressione temporale elevata, alcuni bypass di controllo
- **Alto** (0.67-1.00): Urgenza estrema, degradazione sistematica della sicurezza

## Strategie di Mitigazione

- Implementare "budget di sicurezza temporale" nella pianificazione dei progetti
- Pre-autorizzare scenari urgenti comuni
- Monitoraggio potenziato durante periodi di deadline noti
- Convalida automatizzata per modifiche expedite

## Risorse Correlate

- **Fondazione Densa**: `/foundation docs/core/it-IT/` - Formalizzazione delle vulnerabilità temporali
- **Guida all'Implementazione**: `/docs/cpf_implementation_guide.md`
- **Dashboard**: `/dashboard/soc/` - Visualizzazione della timeline
