# GitHub Actions - Documentazione

## 📄 MD to PDF Converter

### Come Funziona

La GitHub Action `md-to-pdf.yml` converte automaticamente tutti i file Markdown (`.md`) nella cartella `cpf-soc-integration/docs/` in PDF di alta qualità.

### Quando Si Attiva

L'action si attiva **automaticamente** in questi casi:

1. **Push di file .md**: Quando fai push di modifiche a qualsiasi file `.md` in `cpf-soc-integration/docs/`
2. **Modifica dell'action stessa**: Quando modifichi il file `.github/workflows/md-to-pdf.yml`
3. **Esecuzione manuale**: Puoi attivarla manualmente da GitHub

### Come Usarla

#### ✅ Metodo 1: Automatico (Consigliato)

Semplicemente modifica e pusha file .md:

```bash
# Modifica un file markdown
vim cpf-soc-integration/docs/it-IT/README.md

# Committa e pusha
git add cpf-soc-integration/docs/it-IT/README.md
git commit -m "docs: Update Italian README"
git push

# L'action si attiverà automaticamente e genererà i PDF!
```

#### 🔧 Metodo 2: Esecuzione Manuale

1. Vai su GitHub: `https://github.com/xbeat/CPF/actions`
2. Clicca su "Convert Markdown to PDF" nella sidebar sinistra
3. Clicca sul pulsante "Run workflow" in alto a destra
4. Seleziona il branch (es. `main`)
5. Clicca "Run workflow"

### Cosa Fa l'Action

1. **Checkout**: Scarica il codice del repository
2. **Installa Tools**: Installa Pandoc e LaTeX (per PDF professionali)
3. **Conversione**: Converte ogni `.md` in `.pdf` con lo stesso nome
   - Esempio: `README.md` → `README.pdf`
   - Posizione: stesso della cartella del file .md
4. **Commit**: Committa automaticamente i PDF generati
5. **Push**: Pusha i cambiamenti al repository

### Caratteristiche PDF Generati

I PDF sono creati con queste impostazioni:

- **Margini**: 1 pollice su tutti i lati
- **Font**: 11pt
- **Indice**: Generato automaticamente (TOC)
- **Syntax highlighting**: Per blocchi di codice (stile Tango)
- **Engine**: XeLaTeX (supporto Unicode e font moderni)

### Esempio Output

```
cpf-soc-integration/docs/
├── en-US/
│   ├── README.md
│   ├── README.pdf          ← Generato automaticamente
│   ├── cpf_implementation_guide.md
│   └── cpf_implementation_guide.pdf  ← Generato automaticamente
└── it-IT/
    ├── README.md
    ├── README.pdf          ← Generato automaticamente
    └── ...
```

### Verifica Esecuzione

Dopo ogni esecuzione puoi:

1. **Vedere i Log**: `GitHub → Actions → Click sull'esecuzione`
2. **Controllare PDF**: I PDF saranno committati nel tuo branch
3. **Download**: Clona il repo per vedere i PDF localmente

### Troubleshooting

**❓ L'action non si attiva?**
- Verifica che il file modificato sia in `cpf-soc-integration/docs/**/*.md`
- Controlla che il push sia andato a buon fine

**❓ Errori di conversione?**
- Controlla i log in GitHub Actions
- Verifica che il markdown sia valido
- Alcuni caratteri speciali potrebbero richiedere escape LaTeX

**❓ PDF non committati?**
- Verifica che GitHub Actions abbia permessi di scrittura
- Controlla Settings → Actions → General → Workflow permissions
- Assicurati sia selezionato "Read and write permissions"

### Personalizzazione

Puoi modificare `.github/workflows/md-to-pdf.yml` per:

- **Cambiare margini**: Modifica `-V geometry:margin=1in`
- **Cambiare font size**: Modifica `-V fontsize=11pt`
- **Rimuovere indice**: Rimuovi `--toc`
- **Cambiare colori codice**: Cambia `--highlight-style=tango`

Stili disponibili: `pygments`, `tango`, `espresso`, `zenburn`, `kate`, `monochrome`, `breezedark`, `haddock`

### Note Importanti

- ⚠️ Il commit dei PDF include `[skip ci]` per evitare loop infiniti
- 📦 I PDF sono committati nello stesso branch del push
- 🔒 Assicurati che GitHub Actions abbia permessi appropriati
- ⏱️ La conversione impiega ~30-60 secondi per esecuzione

## Supporto

Per problemi o domande, crea un issue nel repository.
