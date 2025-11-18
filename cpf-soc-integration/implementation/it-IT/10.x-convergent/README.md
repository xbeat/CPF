# Categoria 10: Stati Convergenti Critici

Questa directory contiene schemi dettagliati di implementazione per tutti i 10 indicatori nella categoria di vulnerabilità Convergente (Stato Critico).

## Panoramica

Le vulnerabilità convergenti rappresentano stati critici in cui molteplici fattori psicologici si combinano, creando fallimenti a cascata e condizioni di rischio estremo.

## Indicatori

1. **[10.1] Convergenza Multi-Fattore** - Molteplici vulnerabilità attive simultaneamente
2. **[10.2] Stati di Fallimento a Cascata** - Un fallimento che ne innesca altri
3. **[10.3] Condizioni di Tempesta Perfetta** - Combinazioni rare ma catastrofiche
4. **[10.4] Convergenza della Crisi di Burnout** - Stress + affaticamento + sovraccarico
5. **[10.5] Amplificazione Autorità-Crisi** - Sfruttamento dell'autorità durante la crisi
6. **[10.6] Convergenza Sociale-Temporale** - Pressione sociale + pressione temporale
7. **[10.7] Sovraccarico Cognitivo-Affettivo** - Capacità mentale + esaurimento emotivo
8. **[10.8] Disfunzione di Crisi di Gruppo** - Pensiero di gruppo + stress + pressione temporale
9. **[10.9] Crollo della Fiducia AI-Umana** - Fallimento simultaneo del giudizio umano e IA
10. **[10.10] Collasso Organizzativo** - Fallimento psicologico a livello di sistema

## Schema di Implementazione

Ogni indicatore segue il framework **OFTLISRV** con enfasi su **Interdipendenze (I)**.

## Metriche Chiave

### Punteggio di Convergenza
```
CS = Σ(Indicatore_i × Peso_i × Correlazione_ij) per tutti gli indicatori attivi
```

### Indice di Rischio a Cascata
```
CRI = Vulnerabilità_Attive × Gravità_Media × Forza_Interdipendenza
```

### Probabilità di Stato Critico
```
CSP = P(Indicatore_1 AND Indicatore_2 AND ... Indicatore_n)
```
Utilizzando reti bayesiane per il calcolo della probabilità congiunta.

## Approccio Chiave: Reti Bayesiane

Gli indicatori convergenti sono rilevati attraverso **analisi di rete bayesiana** delle interdipendenze.

### Struttura della Rete
```
Categoria 1 (Autorità)  ──┐
Categoria 2 (Temporale) ──┤
Categoria 3 (Sociale)   ──┼──→ Categoria 10 (Convergente)
Categoria 4 (Affettiva) ──┤
Categoria 5 (Cognitiva) ──┤
Categoria 7 (Stress)    ──┘
```

### Calcolo della Probabilità Congiunta
```python
# Calcola la probabilità di uno stato convergente
P_convergent = calculate_joint_probability(
    indicators=[1.1, 2.3, 5.1, 7.2],  # Indicatori attivi
    bayesian_network=cpf_network,
    evidence=current_observations
)

if P_convergent > threshold:
    alert_critical_convergence()
```

## Approccio di Rilevamento

### Rilevamento Multi-Fattore
```python
# Traccia gli indicatori attivi simultaneamente
active_indicators = [
    ind for ind in all_indicators
    if ind.risk_score > 0.5  # Rischio medio e superiore
]

# Verifica combinazioni pericolose
convergent_patterns = {
    '10.4': [5.1, 7.2, 7.5],  # Burnout = affaticamento_avvisi + stress + burnout
    '10.6': [2.1, 3.1, 3.2],  # Sociale-temporale = urgenza + social_proof + pressione_pari
    '10.7': [4.10, 5.3, 5.7], # Cog-affettivo = esaurimento_emotivo + sovraccarico_info + overflow_memoria
}

for conv_id, required_indicators in convergent_patterns.items():
    if all(ind.id in active_indicators for ind in required_indicators):
        trigger_convergent_alert(conv_id)
```

### Rilevamento di Cascata
```python
# Monitora i fallimenti a cascata
def detect_cascade(initial_indicator, time_window=3600):
    cascade = [initial_indicator]
    timestamp = initial_indicator.triggered_at

    # Trova attivazioni successive all'interno della finestra temporale
    related = get_related_indicators(initial_indicator)

    for rel in related:
        if rel.triggered_at - timestamp < time_window:
            cascade.append(rel)

            # Verifica ricorsiva di cascate ulteriori
            cascade.extend(detect_cascade(rel, time_window))

    return cascade

# Allerta se viene rilevata una cascata
cascade = detect_cascade(trigger_indicator)
if len(cascade) >= 3:
    alert_cascading_failure(cascade)
```

## Stabilimento della Baseline

Gli indicatori convergenti richiedono:
- **Tutte** le baseline di categoria (1-9) stabilite per prime
- Dati storici di correlazione tra indicatori
- Struttura di rete bayesiana appresa dai dati
- Pattern di crisi organizzativa

## Pattern di Attivazione Comuni

### Tempesta Perfetta (10.3)
```
Incidente principale (7.1) +
Orario notturno (2.4) +
Personale insufficiente (6.4) +
Pressione dirigenziale (1.1) +
Inondazione di avvisi (5.1)
= Tempesta perfetta
```

### Crisi di Burnout (10.4)
```
Stress cronico (7.2) +
Affaticamento da avvisi (5.1) +
Esaurimento emotivo (4.10) +
Nessun tempo di recupero (7.5)
= Crisi di burnout
```

## Livelli di Rischio

- **Basso** (0-0,33): Vulnerabilità isolate, nessuna convergenza
- **Medio** (0,34-0,66): 2-3 vulnerabilità correlate attive
- **Alto** (0,67-1,00): 4+ vulnerabilità in convergenza, rischio di cascata

## Strategie di Mitigazione

### Immediata (Stato Critico Rilevato)
- **Protocolli di emergenza**: Attiva comando di incidente
- **Riduzione del carico**: Riduci il carico di lavoro, escalation al personale senior
- **Interruttori automatici**: Pausa alle operazioni non critiche
- **Supporto esterno**: Porta risorse di backup
- **Notifica dirigenziale**: Allerta la leadership immediatamente

### Preventiva
- **Avviso tempestivo**: Allerta quando 2+ indicatori correlati diventano medi
- **Test di stress**: Simula scenari convergenti
- **Ridondanza**: Personale di backup per funzioni critiche
- **Monitoraggio**: Visualizzazione in tempo reale della rete bayesiana

### Recupero
- **Revisione post-incidente**: Comprendi le cause della convergenza
- **Rafforzamento del sistema**: Affronta le catene di vulnerabilità più deboli
- **Addestramento**: Esercitazioni su scenari convergenti
- **Documentazione**: Aggiorna i playbook con le lezioni apprese

## Visualizzazione della Rete Bayesiana

La dashboard visualizza la rete bayesiana in tempo reale mostrando:
- Indicatori attivi (nodi)
- Forza delle correlazioni (spigoli)
- Probabilità di convergenza (colore della rete)
- Percorsi critici (route evidenziate)

## Risorse Correlate

- **Fondazione Densa**: `/foundation docs/core/it-IT/` - Formalizzazione delle interdipendenze
- **Reti Bayesiane**: `/dashboard/soc/bayesian.js` - Implementazione della rete
- **Dashboard**: `/dashboard/soc/` - Visualizzazione della convergenza in tempo reale
- **Playbook di Crisi**: Procedure di risposta di emergenza
- **Tutte le Categorie**: Gli indicatori convergenti dipendono da tutte le categorie 1-9

## Nota Critica

**La Categoria 10 è la più pericolosa**. Uno stato convergente può portare rapidamente a:
- Crollo completo della sicurezza
- Attacchi principali riusciti
- Crisi organizzativa
- Danno a lungo termine

**Il tempo di risposta è critico**: I minuti contano quando viene rilevata una convergenza.
