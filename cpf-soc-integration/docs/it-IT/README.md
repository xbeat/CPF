# Documentazione CPF

Questa directory contiene la documentazione completa per l'integrazione SOC del Cybersecurity Psychology Framework (CPF).

## Contenuti

### Documenti e Guide

- **cpf_implementation_guide.md** - Guida all'implementazione passo-passo per l'integrazione SOC
- **cpf_technical_integration.md** - Dettagli tecnici per l'integrazione SIEM/SOAR
- **cpf_integration_descriptive.md** - Panoramica descrittiva dell'architettura di integrazione
- **cpf_pattern_examples_list.md** - Esempi reali di pattern psicologici
- **cpf_psychological_inference_paper.md** - Fondamenti teorici per l'inferenza psicologica
- **cpf_vulnerability_whitepaper.md** - Whitepaper sulla valutazione delle vulnerabilità umane
- **cpf_enterprise_paper.tex/.pdf** - Considerazioni per il deployment enterprise

## Organizzazione dei Documenti

### Guide all'Implementazione
Inizia con `cpf_implementation_guide.md` per i passaggi pratici di implementazione, tra cui:
- Configurazione delle sorgenti dati
- Algoritmi di rilevamento dei pattern
- Metodologia di scoring degli indicatori
- Integrazione dashboard

### Documentazione Tecnica
`cpf_technical_integration.md` fornisce le specifiche tecniche:
- Endpoint API e formati dati
- Struttura delle regole di correlazione SIEM
- Formule di scoring bayesiano
- Definizioni delle soglie di alert

### Fondamenti Teorici
`cpf_psychological_inference_paper.md` spiega la teoria psicologica alla base del framework:
- Modelli di vulnerabilità cognitive
- Riconoscimento dei pattern comportamentali
- Metodologia di quantificazione del rischio

## Risorse Correlate

- **File di Implementazione**: `/implementation/` - Schemi OFTLISRV dettagliati per tutti i 100 indicatori
- **Codice Sorgente**: `/src/` - Implementazione Python dei rilevatori di pattern
- **Documenti**: `/papers/` - Articoli accademici e specifiche tecniche

## Utilizzo

Questi documenti sono progettati per essere letti in sequenza:

1. Inizia con `cpf_implementation_guide.md` per una panoramica
2. Esamina `cpf_pattern_examples_list.md` per il contesto del mondo reale
3. Consulta `cpf_technical_integration.md` per i dettagli di implementazione
4. Fai riferimento alle implementazioni specifiche degli indicatori in `/implementation/`

## Versioni PDF

Tutti i documenti markdown hanno corrispondenti versioni PDF per la lettura offline e la distribuzione.
