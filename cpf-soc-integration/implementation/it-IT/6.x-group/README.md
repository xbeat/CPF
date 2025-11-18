# Categoria 6: Vulnerabilità delle Dinamiche di Gruppo

Questa directory contiene schemi di implementazione dettagliati per tutti i 10 indicatori nella categoria di vulnerabilità Dinamiche di Gruppo.

## Panoramica

Le vulnerabilità delle dinamiche di gruppo sfruttano i modelli di comportamento collettivo, il pensiero di gruppo, la diffusione della responsabilità e i meccanismi di difesa organizzativi.

## Indicatori

1. **[6.1] Punti ciechi di sicurezza del pensiero di gruppo** - Fallimenti del processo decisionale collettivo
2. **[6.2] Fenomeni di Risky Shift** - I gruppi prendono decisioni più rischiose rispetto ai singoli individui
3. **[6.3] Diffusione della Responsabilità** - Tutti presumono che qualcun altro agirà
4. **[6.4] Social Loafing nei Compiti di Sicurezza** - Ridotto sforzo individuale nei gruppi
5. **[6.5] Effetto Spettatore nella Risposta agli Incidenti** - Mancato rispondere supponendo che altri agiranno
6. **[6.6] Assunzioni di Dipendenza di Gruppo (baD)** - Fantasie di dipendenza collettiva
7. **[6.7] Posture di Sicurezza Fight-Flight (baF)** - Modelli di attacco/evitamento a livello di gruppo
8. **[6.8] Fantasie di Speranza di Pairing (baP)** - Ottimismo di gruppo irrealistico
9. **[6.9] Splitting Organizzativo** - Divisione buono/cattivo che crea punti ciechi
10. **[6.10] Meccanismi di Difesa Collettivi** - Negazione, razionalizzazione a livello di gruppo

## Schema di Implementazione

Ogni indicatore segue il framework **OFTLISRV** con focus su osservabili a livello di gruppo.

## Metriche Chiave

### Indice di Pensiero di Gruppo
```
GI = Unanimità_Decisionale × Velocità_al_Consenso / Presenza_Avvocato_del_Diavolo
```

### Punteggio di Diffusione della Responsabilità
```
RDS = Ritardo_Risposta_Incidente × Trasferimenti_Proprietà / Dimensione_Squadra
```

### Coefficiente di Social Loafing
```
SLC = Contributo_Individuale / Contributo_Atteso_per_Membro
```

## Fonti Dati Principali

- **Ticketing**: Trasferimenti di proprietà, assegnazioni di gruppo, tempi di risposta
- **Dati di Riunioni**: Record di decisioni, marcatori di dissenso, partecipazione
- **Strumenti di Collaborazione**: Metriche di contributo per membro del team
- **Risposta agli Incidenti**: Gestione di incidenti di gruppo vs individuale
- **Gestione del Cambiamento**: Cambiamenti approvati da gruppo vs individuale

## Approccio di Rilevamento

### Rilevamento di Pensiero di Gruppo
```python
# Analizzare i modelli di decisione di gruppo
decision = get_group_decision(incident_id)

groupthink_markers = {
    'unanimity': all([vote == decision for vote in votes]),
    'no_dissent': count_dissenting_views == 0,
    'quick_consensus': decision_time < baseline * 0.5,
    'illusion_invulnerability': overconfidence_markers > 0,
    'collective_rationalization': justification_complexity < baseline
}

if sum(groupthink_markers.values()) >= 3:
    flag_groupthink_risk(team_id)
```

### Diffusione della Responsabilità
```python
# Tracciare i trasferimenti di proprietà
transfers = get_ownership_transfers(incident_id)

if len(transfers) > 3:  # Passato più volte
    diffusion_detected = True

# Verificare l'assunzione che qualcun altro gestisca
assumption_keywords = ['thought you', 'assumed', 'believed handled']
if any(kw in incident_notes for kw in assumption_keywords):
    diffusion_detected = True
```

## Stabilimento della Baseline

Gli indicatori di dinamica di gruppo richiedono:
- Dati sulla composizione e dimensione del team
- Modelli storici di decisione di gruppo
- Tassi normali di trasferimento della responsabilità
- Valutazione della cultura organizzativa

## Tipi di Eventi Comuni

- `group_decision` → 6.1, 6.2, 6.8
- `ownership_transfer` → 6.3, 6.5
- `group_task_assigned` → 6.4
- `organizational_crisis` → 6.7, 6.9, 6.10
- `dependency_reference` → 6.6

## Livelli di Rischio

- **Basso** (0-0.33): Dinamiche di gruppo sane, responsabilità individuale
- **Medio** (0.34-0.66): Qualche influenza di gruppo, responsabilità ancora chiara
- **Alto** (0.67-1.00): Disfunzione sistematica di gruppo, diffusione della responsabilità

## Strategie di Mitigazione

### Strutturale
- Assegnazione esplicita della responsabilità individuale
- Ruoli di avvocato del diavolo nelle decisioni di sicurezza
- Processi di revisione delle decisioni
- Metriche di prestazioni individuali insieme a metriche di gruppo

### Culturale
- Premiare l'iniziativa individuale
- Normalizzare il dissenso e il mettere in questione
- Strutture di responsabilità chiare
- Revisioni post-decisione

### Processo
- Responsabilità individuale nei compiti di gruppo
- Addestramento all'intervento dello spettatore
- Protocolli di passaggio espliciti
- Requisiti di documentazione delle decisioni di gruppo

## Risorse Correlate

- **Foundation Densa**: `/foundation docs/core/it-IT/` - Formalizzazione della dinamica di gruppo
- **Assunzioni Fondamentali di Bion**: Fondamento teorico per 6.6-6.8
- **Dashboard**: `/dashboard/soc/` - Metriche a livello di gruppo
