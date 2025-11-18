# GitHub Actions - Documentazione

Questo repository utilizza GitHub Actions per automatizzare la generazione di PDF da file sorgente.

## 📑 Indice

1. [LaTeX to PDF](#-latex-to-pdf) - Compila file .tex in PDF
2. [Markdown to PDF](#-markdown-to-pdf) - Converte file .md in PDF
3. [Permessi Richiesti](#-permessi-richiesti)
4. [Troubleshooting](#-troubleshooting)

---

## 📘 LaTeX to PDF

### Descrizione

Il workflow `latex-to-pdf.yml` compila automaticamente file LaTeX (.tex) in PDF di alta qualità usando pdflatex.

### Come Usarlo

#### 1. Vai su GitHub Actions
```
https://github.com/xbeat/CPF/actions
```

#### 2. Seleziona "Compile LaTeX to PDF"

#### 3. Clicca "Run workflow"

#### 4. Inserisci i parametri:

**Source Folder** (obbligatorio):
- Cartella contenente i file .tex da compilare
- Esempio: `research`, `cpf-soc-integration/docs/en-US`, `.`
- Default: `.` (root del repository)

**Output Folder** (opzionale):
- Dove salvare i PDF generati
- Se vuoto: PDF salvati nella stessa cartella del file .tex
- Esempio: `output/pdfs`, `build`

#### 5. Clicca "Run workflow" per avviare

### Esempi di Utilizzo

**Esempio 1: Compila tutti i .tex nella cartella research**
```yaml
Source folder: research
Output folder: (lascia vuoto)
```
Risultato: `research/paper.tex` → `research/paper.pdf`

**Esempio 2: Compila e salva in cartella separata**
```yaml
Source folder: cpf-soc-integration/docs/en-US
Output folder: pdfs/en-US
```
Risultato: `docs/en-US/paper.tex` → `pdfs/en-US/paper.pdf`

**Esempio 3: Compila tutto nel repository**
```yaml
Source folder: .
Output folder: (lascia vuoto)
```

### Caratteristiche

- ✅ Compila con `pdflatex` (doppia esecuzione per riferimenti)
- ✅ Pulisce automaticamente file ausiliari (.aux, .log, etc.)
- ✅ Gestisce errori e continua con i file successivi
- ✅ Committa automaticamente i PDF generati
- ✅ Non ricorsivo (solo file nella cartella specificata)

### Output

I PDF sono committati automaticamente al repository con messaggio:
```
Add compiled PDFs from [source_folder]
```

---

## 📄 Markdown to PDF

### Descrizione

Il workflow `md-to-pdf.yml` converte automaticamente file Markdown (.md) in PDF professionali usando Pandoc con XeLaTeX.

### Come Usarlo

#### 1. Vai su GitHub Actions
```
https://github.com/xbeat/CPF/actions
```

#### 2. Seleziona "Convert Markdown to PDF"

#### 3. Clicca "Run workflow"

#### 4. Inserisci i parametri:

**Source Folder** (obbligatorio):
- Cartella contenente i file .md da convertire
- Esempio: `cpf-soc-integration/docs/en-US`, `cpf-soc-integration/docs/it-IT`
- Default: `cpf-soc-integration/docs/en-US`

**Output Folder** (opzionale):
- Dove salvare i PDF generati
- Se vuoto: PDF salvati nella stessa cartella del file .md
- Esempio: `pdfs/en-US`, `output`

#### 5. Clicca "Run workflow" per avviare

### Esempi di Utilizzo

**Esempio 1: Converti tutti i .md in inglese**
```yaml
Source folder: cpf-soc-integration/docs/en-US
Output folder: (lascia vuoto)
```
Risultato: `docs/en-US/README.md` → `docs/en-US/README.pdf`

**Esempio 2: Converti tutti i .md in italiano**
```yaml
Source folder: cpf-soc-integration/docs/it-IT
Output folder: (lascia vuoto)
```
Risultato: `docs/it-IT/README.md` → `docs/it-IT/README.pdf`

**Esempio 3: Salva in cartella separata**
```yaml
Source folder: cpf-soc-integration/docs/en-US
Output folder: pdfs/en-US
```

### Caratteristiche PDF Generati

I PDF sono creati con queste impostazioni professionali:

- **Engine**: XeLaTeX (supporto Unicode completo)
- **Margini**: 1 pollice su tutti i lati
- **Font**: 11pt
- **Indice**: Generato automaticamente (TOC) fino a 3 livelli
- **Syntax Highlighting**: Stile Tango per blocchi di codice
- **Layout**: Professionale con document class article

### Output

I PDF sono committati automaticamente al repository con messaggio:
```
docs: Add PDF versions from [source_folder]
```

---

## 🔒 Permessi Richiesti

Entrambi i workflow richiedono i seguenti permessi:

### GitHub Actions Settings

1. Vai su: `Settings` → `Actions` → `General`
2. Sotto "Workflow permissions":
   - ✅ Seleziona **"Read and write permissions"**
   - ✅ Abilita **"Allow GitHub Actions to create and approve pull requests"**
3. Clicca "Save"

**⚠️ Importante**: Senza questi permessi, i workflow non potranno committare i PDF generati.

---

## 🔧 Troubleshooting

### Workflow non si avvia

**Problema**: Workflow non disponibile in Actions
- ✅ Verifica che i file `.yml` siano nella cartella `.github/workflows/`
- ✅ Controlla che la sintassi YAML sia corretta
- ✅ Pusha i file workflow al repository

### Errori di compilazione LaTeX

**Problema**: File .tex non compila
- 📋 Controlla i log in GitHub Actions per errori specifici
- 📋 Verifica che il file .tex sia valido
- 📋 Assicurati che tutti i package LaTeX richiesti siano disponibili
- 💡 Il workflow installa `texlive-full` che include la maggior parte dei package

### Errori di conversione Markdown

**Problema**: File .md non converte in PDF
- 📋 Controlla i log per errori Pandoc
- 📋 Verifica che il markdown sia valido
- 📋 Alcuni caratteri speciali potrebbero richiedere escape
- 💡 Tabelle complesse potrebbero non convertire perfettamente

### PDF non committati

**Problema**: PDF generati ma non committati al repository
- 🔐 Verifica permessi GitHub Actions (vedi sezione [Permessi](#-permessi-richiesti))
- 📋 Controlla che non ci siano errori nel step "Commit PDFs"
- 📋 Assicurati che almeno un PDF sia stato generato con successo

### Cartella non trovata

**Problema**: Error: Folder 'xyz' does not exist
- 📁 Verifica che la cartella esista nel repository
- 📁 Usa path relativi dalla root del repository
- 📁 Controlla maiuscole/minuscole nel path

### Workflow troppo lento

**Problema**: Compilazione impiega troppo tempo
- ⏱️ L'installazione di TeX Live Full richiede ~2-3 minuti
- ⏱️ La conversione Markdown richiede ~30-60 secondi
- 💡 Considera di limitare il numero di file da processare

---

## 📊 Confronto Workflow

| Feature | LaTeX to PDF | Markdown to PDF |
|---------|-------------|-----------------|
| **Formato Input** | .tex | .md |
| **Engine** | pdflatex | Pandoc + XeLaTeX |
| **Esecuzioni** | 2x (per riferimenti) | 1x |
| **Indice (TOC)** | Automatico se presente | Sempre generato |
| **Syntax Highlighting** | ❌ | ✅ (Tango) |
| **Tempo medio** | ~3-5 min | ~2-3 min |
| **File ausiliari** | Rimossi automaticamente | N/A |
| **Output folder** | ✅ Supportato | ✅ Supportato |

---

## 🎯 Best Practices

### 1. Organizzazione File
```
repository/
├── docs/
│   ├── en-US/
│   │   ├── README.md
│   │   └── guide.md
│   └── it-IT/
│       ├── README.md
│       └── guide.md
└── pdfs/           ← Output folder opzionale
    ├── en-US/
    └── it-IT/
```

### 2. Naming Conventions
- Usa nomi file descrittivi senza spazi
- Preferisci `snake_case` o `kebab-case`
- Evita caratteri speciali nei nomi file

### 3. Testing
- Testa prima con una singola cartella
- Verifica il risultato prima di processare tutto
- Controlla sempre i log per warnings

### 4. Version Control
- I PDF committati sono tracciati da Git
- Considera di usare `.gitignore` se preferisci non tracciare i PDF
- Usa Output Folder separata per organizzazione migliore

---

## 📚 Risorse Utili

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Pandoc Manual](https://pandoc.org/MANUAL.html)
- [LaTeX Documentation](https://www.latex-project.org/help/documentation/)
- [XeLaTeX Guide](https://www.overleaf.com/learn/latex/XeLaTeX)

---

## 🆘 Supporto

Per problemi, domande o suggerimenti:
1. Controlla la sezione [Troubleshooting](#-troubleshooting)
2. Verifica i log di GitHub Actions
3. Crea un issue nel repository con:
   - Nome del workflow
   - Input forniti
   - Log di errore completo
   - Screenshot se utile

---

**Ultimo aggiornamento**: 2025-11-18
