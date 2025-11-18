# CPF Academic Papers

Paper accademici e documenti di ricerca relativi al Cybersecurity Psychology Framework.

## Contenuto

### Bayesian Cross-Indicator Inference

Paper sulla metodologia di inferenza Bayesiana utilizzata per l'analisi cross-indicatore nel framework CPF.

**Formati disponibili:**
- **PDF** - `Bayesian_Cross_Indicator_Inference...pdf` (pronto per lettura)
- **LaTeX** - `Bayesian_Cross_Indicator_Inference...tex` (sorgente)

**Argomenti trattati:**
- Fondamenti matematici dell'inferenza Bayesiana
- Modello di dipendenze cross-categoria
- Algoritmi di calcolo risk score
- Validazione empirica
- Case studies

## Utilizzo

### Lettura Paper

```bash
# Aprire PDF
open "Bayesian_Cross_Indicator_Inference...pdf"

# O con un PDF reader specifico
evince "Bayesian_Cross_Indicator_Inference...pdf"  # Linux
open -a Preview "Bayesian_Cross_Indicator_Inference...pdf"  # macOS
```

### Compilazione LaTeX

Se modifichi il sorgente LaTeX:

```bash
# Compilare con pdflatex
pdflatex "Bayesian_Cross_Indicator_Inference...tex"

# Per bibliography e references (se presenti)
pdflatex "Bayesian_Cross_Indicator_Inference...tex"
bibtex "Bayesian_Cross_Indicator_Inference"
pdflatex "Bayesian_Cross_Indicator_Inference...tex"
pdflatex "Bayesian_Cross_Indicator_Inference...tex"
```

## Riferimenti nel Codice

Le implementazioni descritte nei paper si trovano in:

- **Motore Bayesiano**: `/dashboard/soc/bayesian.js`
- **Detection Engine**: `/dashboard/cpf-detection-engine/`
- **Implementation Guide**: `/dashboard/cpf-detection-engine/CPF_PRACTICAL_IMPLEMENTATION_GUIDE.md`

## Paper Correlati

Altri documenti di ricerca CPF:

- **Dense Foundation Paper**: `/CPF_Implementation_Companion___Dense_Foundation_Paper.pdf` (root repository)
- **SOC/SIEM Integration**: `/dashboard/soc/documentation/CPF_SOC_SIEM_Integration_Comprehensive_Paper.html`

## Citazioni

Se utilizzi questi paper nella ricerca, cita come:

```
[Citazione da completare con dettagli pubblicazione]
```

## Contribuire

Per proporre modifiche o aggiunte ai paper:

1. Modifica il file LaTeX
2. Compila e verifica output PDF
3. Documenta le modifiche
4. Sottometti per review

## Licenza

[Specificare licenza pubblicazione]
