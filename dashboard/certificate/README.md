# CPF3 PVMS Certificate Generator

Generatore di certificati PDF per il framework **CPF3** (Cybersecurity Psychology Framework) e il sistema **PVMS** (Psychological Vulnerability Management System).

Questo tool è disponibile in due versioni:
- **Python** (`cert-gen.py`) - Versione originale
- **Node.js** (`cert-gen.js`) - Conversione precisa della versione Python

Entrambe le versioni generano certificati PDF identici con pattern esagonale, QR code e logo personalizzato.

---

## 📋 Indice

- [Caratteristiche](#caratteristiche)
- [Prerequisiti](#prerequisiti)
- [Installazione Python](#installazione-python)
- [Installazione Node.js](#installazione-nodejs)
- [Utilizzo](#utilizzo)
- [Personalizzazione](#personalizzazione)
- [Struttura File](#struttura-file)
- [Troubleshooting](#troubleshooting)

---

## ✨ Caratteristiche

- ✅ Generazione certificati PDF in formato A4
- ✅ Pattern esagonale di sfondo
- ✅ Intestazione con box colorato
- ✅ Sezioni per dati del progetto e timestamping
- ✅ QR code integrato
- ✅ Logo personalizzabile (PNG/JPG)
- ✅ Gestione automatica testo multiriga
- ✅ Bordo elegante e layout professionale

---

## 🔧 Prerequisiti

### Per Python
- Python 3.8 o superiore
- pip (gestore pacchetti Python)

### Per Node.js
- Node.js 14.0 o superiore
- npm (incluso con Node.js)

---

## 🐍 Installazione Python

### 1. Verifica Installazione Python

```bash
python3 --version
# oppure
python --version
```

Se Python non è installato:
- **Ubuntu/Debian**: `sudo apt install python3 python3-pip python3-venv`
- **macOS**: `brew install python3`
- **Windows**: Scarica da [python.org](https://www.python.org/downloads/)

### 2. Crea Virtual Environment (Consigliato)

```bash
# Naviga nella cartella del progetto
cd dashboard/certificate

# Crea virtual environment
python3 -m venv venv

# Attiva il virtual environment
# Su Linux/macOS:
source venv/bin/activate

# Su Windows:
venv\Scripts\activate
```

Una volta attivato, vedrai `(venv)` all'inizio del prompt.

### 3. Installa le Dipendenze

```bash
pip install -r requirements.txt
```

Questo installerà:
- `reportlab` - Libreria per generare PDF
- `qrcode[pil]` - Generazione QR code
- `Pillow` - Gestione immagini

### 4. Esegui lo Script Python

```bash
python cert-gen.py
```

Il certificato verrà generato come `cpf3_pvms_certificate.pdf` nella stessa cartella.

### 5. Disattiva Virtual Environment (quando hai finito)

```bash
deactivate
```

---

## 📦 Installazione Node.js

### 1. Verifica Installazione Node.js

```bash
node --version
npm --version
```

Se Node.js non è installato:
- **Ubuntu/Debian**:
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```
- **macOS**: `brew install node`
- **Windows**: Scarica da [nodejs.org](https://nodejs.org/)

### 2. Installa le Dipendenze

```bash
# Naviga nella cartella del progetto
cd dashboard/certificate

# Installa i pacchetti npm
npm install
```

Questo installerà:
- `pdfkit` - Libreria per generare PDF
- `qrcode` - Generazione QR code

### 3. Esegui lo Script Node.js

```bash
node cert-gen.js

# Oppure usando npm script:
npm run generate
# oppure
npm start
```

Il certificato verrà generato come `cpf3_pvms_certificate_node.pdf` nella stessa cartella.

---

## 🚀 Utilizzo

### Esecuzione Rapida

**Python:**
```bash
cd dashboard/certificate
source venv/bin/activate  # Solo se usi virtual environment
python cert-gen.py
```

**Node.js:**
```bash
cd dashboard/certificate
node cert-gen.js
```

### Output

Entrambi gli script generano un file PDF:
- Python: `cpf3_pvms_certificate.pdf`
- Node.js: `cpf3_pvms_certificate_node.pdf`

I PDF sono identici in termini di layout e contenuto.

---

## 🎨 Personalizzazione

### Modificare i Dati del Certificato

Apri il file (`cert-gen.py` o `cert-gen.js`) e modifica i valori alla fine:

**Python (`cert-gen.py`):**
```python
# Linea ~283-295
cert_id = '891a43a8-d0e9-4dc2-9aad-d7aeb8bddc89'
proj_id = 'c6c535ce-cacd-435b-94af-002792817e75'
title = 'CPF3'
author = 'Giuseppe Canale'
content = '1 file + Project cover'
fingerprint = '4fe7b050ae4020d6baf57ee6663f3790465ea6e22efc1f00cf2c0faa8adabbe2'
# ... altri campi
```

**Node.js (`cert-gen.js`):**
```javascript
// Linea ~359-369
const certId = '891a43a8-d0e9-4dc2-9aad-d7aeb8bddc89';
const projId = 'c6c535ce-cacd-435b-94af-002792817e75';
const title = 'CPF3';
const author = 'Giuseppe Canale';
const content = '1 file + Project cover';
const fingerprint = '4fe7b050ae4020d6baf57ee6663f3790465ea6e22efc1f00cf2c0faa8adabbe2';
// ... altri campi
```

### Cambiare Logo

Sostituisci il file `logo_cpf3.png` con la tua immagine, oppure modifica il percorso nello script:

**Python:**
```python
logo_path="tuo_logo.png"
```

**Node.js:**
```javascript
const logoPath = path.join(__dirname, 'tuo_logo.png');
```

### Modificare QR Code

Cambia l'URL del QR code:

**Python:**
```python
qr_url="https://tuo-sito.com"
```

**Node.js:**
```javascript
'https://tuo-sito.com'
```

### Generare Multipli Certificati

Puoi creare un loop per generare più certificati con dati diversi. Esempio in Node.js:

```javascript
const certificates = [
    { id: '123', name: 'Mario Rossi', ... },
    { id: '456', name: 'Luigi Bianchi', ... },
];

for (const cert of certificates) {
    await generator.generateCertificate(
        `certificate_${cert.id}.pdf`,
        cert,
        'https://cpf3.org',
        logoPath
    );
}
```

---

## 📁 Struttura File

```
dashboard/certificate/
├── cert-gen.py              # Script Python
├── cert-gen.js              # Script Node.js
├── package.json             # Dipendenze Node.js
├── requirements.txt         # Dipendenze Python
├── README.md                # Questa guida
├── logo_cpf3.png           # Logo CPF3
├── cpf3_pvms_certificate.pdf        # Output Python
└── cpf3_pvms_certificate_node.pdf   # Output Node.js
```

---

## 🔍 Troubleshooting

### Python

**Errore: `ModuleNotFoundError: No module named 'reportlab'`**
```bash
pip install reportlab qrcode[pil] Pillow
```

**Errore: `Permission denied`**
```bash
# Usa virtual environment o installa con --user
pip install --user -r requirements.txt
```

**Logo non trovato:**
- Verifica che `logo_cpf3.png` sia nella stessa cartella dello script
- Controlla il percorso del file

### Node.js

**Errore: `Cannot find module 'pdfkit'`**
```bash
npm install
```

**Errore: `EACCES: permission denied`**
```bash
# Su Linux/macOS, usa sudo per npm globale, oppure correggi i permessi:
sudo chown -R $USER ~/.npm
npm install
```

**Errore font: `Helvetica-Bold not found`**
- PDFKit include i font standard. Se hai problemi, prova a reinstallare:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Generale

**PDF generato è corrotto:**
- Assicurati che lo script completi senza errori
- Verifica che ci sia spazio su disco
- Controlla i permessi della cartella

**Qualità QR Code bassa:**
- Aumenta il parametro `size` nella funzione `drawQRCode()`
- Modifica l'error correction level (Python: `ERROR_CORRECT_H`, Node.js: `'H'`)

---

## 📊 Confronto Python vs Node.js

| Caratteristica | Python | Node.js |
|----------------|--------|---------|
| Libreria PDF | ReportLab | PDFKit |
| Libreria QR | qrcode | qrcode |
| Velocità | ~2-3 secondi | ~1-2 secondi |
| Dimensione file | Identica | Identica |
| Qualità output | Identica | Identica |
| Setup | Virtual env consigliato | Solo `npm install` |

---

## 📝 Note

- I certificati generati sono identici tra Python e Node.js
- Il logo deve essere in formato PNG o JPG
- Il QR code è opzionale (può essere `null`)
- Il pattern esagonale è decorativo e non influisce sulle prestazioni
- Entrambe le versioni supportano testo multiriga automatico

---

## 🆘 Supporto

Per problemi o domande:
1. Controlla la sezione [Troubleshooting](#troubleshooting)
2. Verifica che tutte le dipendenze siano installate
3. Assicurati di usare versioni aggiornate di Python/Node.js

---

## 📄 Licenza

Parte del progetto CPF3 (Cybersecurity Psychology Framework).

---

**Generato con ❤️ da CPF3 Team**
