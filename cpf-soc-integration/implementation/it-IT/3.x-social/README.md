# Categoria 3: Vulnerabilità di Influenza Sociale

Questa directory contiene schemi di implementazione dettagliati per tutti i 10 indicatori nella categoria di vulnerabilità di Influenza Sociale.

## Panoramica

Le vulnerabilità di influenza sociale sfruttano le tendenze umane verso la conformità, la prova sociale, la pressione dei pari e la fiducia nelle reti sociali.

## Indicatori

1. **[3.1] Sfruttamento della Reciprocità** - Quid pro quo nei contratti sociali
2. **[3.2] Trappole di Escalation dell'Impegno** - Conformità ai compromessi di gruppo sulla politica
3. **[3.3] Manipolazione della Prova Sociale** - Sfruttamento delle relazioni sociali
4. **[3.4] Bypass di Fiducia Basato sul Gradimento** - Deferenza al consenso del gruppo
5. **[3.5] Ricerca di Validazione Sociale** - Necessità di approvazione che supera la sicurezza
6. **[3.6] Bias di Fiducia del Gruppo Interno** - Scrutinio ridotto dei membri del gruppo interno
7. **[3.7] Conformità alla Pressione dei Pari** - Manipolazione dell'identità sociale
8. **[3.8] Conformità alle Norme Non Sicure** - Sfruttamento dello status sociale
9. **[3.9] Minacce all'Identità Sociale** - Diffusione virale dei comportamenti rischiosi
10. **[3.10] Conflitti di Gestione della Reputazione** - Cascate di effetti di rete

## Schema di Implementazione

Ogni indicatore segue il framework **OFTLISRV** con focus sull'analisi dei grafi sociali.

## Metriche Chiave

### Tasso di Conformità alla Prova Sociale
```
SPCR = N_seguito_rischioso / N_esposto_rischioso
```
Misura la tendenza a seguire i comportamenti rischiosi degli altri.

### Punteggio di Sfruttamento della Rete di Fiducia
```
TNES = Σ(Peso_Fiducia × Comportamento_Rischio) / N_relazioni
```

### Fattore di Propagazione della Cascata
```
CPF = N_influenzato / N_attori_iniziali
```
Misura la diffusione virale dei comportamenti attraverso la rete.

## Fonti di Dati Chiave

- **Grafi Sociali**: Organigramma, reti email, strumenti di collaborazione
- **Piattaforme di Comunicazione**: Slack, Teams, modelli di interazione email
- **SIEM**: Eventi correlati attraverso connessioni sociali
- **Sistemi HR**: Dipartimento, team, relazioni gerarchiche
- **Badge/Accesso**: Modelli di prossimità fisica

## Approccio di Rilevamento

### Analisi del Grafo Sociale
```python
# Costruisci rete di fiducia
G = build_social_graph(email_data, slack_data)

# Identifica propagazione dei comportamenti rischiosi
for user in G.nodes:
    peer_behaviors = [G.neighbors(user).behaviors]
    user_behavior = user.behaviors

    if user_behavior == peer_behaviors.mode():
        social_proof_triggered = True
```

### Rilevamento della Cascata
```python
# Traccia diffusione del comportamento
cascade = detect_cascade(
    initial_event=policy_bypass,
    time_window=24_hours,
    network=social_graph
)

if len(cascade.nodes) > threshold:
    alert_cascade_detected()
```

## Stabilimento della Baseline

Gli indicatori sociali richiedono:
- Costruzione del grafo sociale di 90 giorni
- Modelli di comunicazione normali
- Baselines dell'influenza tra pari
- Mappatura della rete di fiducia

## Tipi di Eventi Comuni

- `peer_action_observed` → 3.1, 3.4
- `in_group_request` → 3.6
- `reciprocal_favor` → 3.7
- `influencer_post` → 3.9
- `cascade_propagation` → 3.10

## Livelli di Rischio

- **Basso** (0-0.33): Processo decisionale indipendente mantenuto
- **Medio** (0.34-0.66): Qualche influenza dei pari, la verifica avviene ancora
- **Alto** (0.67-1.00): Conformità sistematica, pensiero critico ridotto

## Risorse Correlate

- **Foundation Densa**: `/foundation docs/core/it-IT/` - Modelli di influenza sociale
- **Dashboard**: `/dashboard/soc/` - Visualizzazione della rete sociale
- **Analisi dei Grafi**: Strumenti di grafi sociali basati su NetworkX
