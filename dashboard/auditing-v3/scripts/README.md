# CPF Auditing Scripts

Script utili per la gestione e validazione dei Field Kit nella dashboard auditing.

## 📄 Script Disponibili

### `validate-fieldkit.js`

Valida la struttura e correttezza dei Field Kit JSON files.

**Uso:**
```bash
node dashboard/auditing/scripts/validate-fieldkit.js <path-to-json>
```

**Esempio:**
```bash
# Validare un singolo indicator
node dashboard/auditing/scripts/validate-fieldkit.js auditor-field-kit/interactive/en-US/1.x-authority/indicator_1.1.json

# Validare indicator italiano
node dashboard/auditing/scripts/validate-fieldkit.js auditor-field-kit/interactive/it-IT/3.x-social/indicator_3.5.json
```

---

## 🔍 Cosa Valida

Lo script controlla:

### ✅ Campi Obbligatori
- `indicator` - Deve essere presente e in formato X.Y (es: 1.3, 10.5)
- `title` - Titolo dell'indicatore
- `category` - Categoria di appartenenza
- `sections` - Array di sezioni (deve essere array non vuoto)

### ✅ Struttura Sezioni
Per ogni sezione verifica:
- Presenza di `id` (warning se mancante)
- Presenza di `title` (warning se mancante)
- Presenza di `items` array (warning se mancante)

### ✅ Scoring Configuration
- Presenza di `scoring` object
- Presenza di `maturity_levels` (green, yellow, red)
- Warning se mancano i livelli di maturità

### ⚠️ Schema Bayesiano
- Identifica automaticamente schema Bayesiano (indicatori 9.6-9.10)
- Warning: schema non supportato dal client integrato

---

## 📊 Output

Lo script produce output colorato nel terminale:

### ✅ Successo
```
✓ JSON is valid!

Warnings (2):
  1. Section 0 is missing "id" field
  2. No scoring configuration found (required for score calculation)
```

### ❌ Errore
```
✗ JSON has 3 error(s)

Errors:
  1. Missing required field: sections
  2. Invalid indicator format: 11.3 (expected: X.Y, e.g., 1.3)
  3. Field "sections" must be an array
```

---

## 🎨 Colori Output

- **Verde** (`✓`) - Validazione OK
- **Rosso** (`✗`) - Errori trovati
- **Giallo** - Warnings (non bloccanti)
- **Cyan** - Titoli e informazioni

---

## 🔧 Exit Codes

- `0` - Validazione OK (possono esserci warnings)
- `1` - Validazione FALLITA (errori critici trovati)

Questo permette di usare lo script in pipeline CI/CD:

```bash
# Script bash che valida tutti gli indicatori
for file in auditor-field-kit/interactive/en-US/*/*.json; do
  node dashboard/auditing/scripts/validate-fieldkit.js "$file" || exit 1
done
```

---

## 📝 Esempi Pratici

### Validare tutti gli indicatori di una categoria

```bash
# Valida tutti gli indicatori Authority (categoria 1)
for file in auditor-field-kit/interactive/en-US/1.x-authority/*.json; do
  echo "Validating: $file"
  node dashboard/auditing/scripts/validate-fieldkit.js "$file"
done
```

### Validare tutti gli indicatori di una lingua

```bash
# Valida tutti gli indicatori italiani
find auditor-field-kit/interactive/it-IT -name "*.json" -type f | while read file; do
  node dashboard/auditing/scripts/validate-fieldkit.js "$file" || echo "FAILED: $file"
done
```

### Integrare in pre-commit hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Valida Field Kit modificati
git diff --cached --name-only | grep "indicator_.*\.json" | while read file; do
  if [ -f "$file" ]; then
    node dashboard/auditing/scripts/validate-fieldkit.js "$file" || {
      echo "❌ Validation failed for $file"
      exit 1
    }
  fi
done
```

---

## ⚠️ Limitazioni

Lo script **NON** valida:
- ❌ Contenuto semantico delle domande
- ❌ Correttezza dei pesi di scoring
- ❌ Validità delle opzioni di risposta
- ❌ Riferimenti incrociati tra indicatori

Lo script valida **SOLO** la struttura JSON e i campi obbligatori.

---

## 🐛 Troubleshooting

**Problema: "Failed to read or parse JSON"**
- **Causa**: File non esiste o JSON malformato
- **Soluzione**: Verifica il path e la sintassi JSON

**Problema: "Invalid indicator format"**
- **Causa**: Campo `indicator` non in formato X.Y
- **Soluzione**: Usa formato numerico (es: 1.3, 10.5)

**Problema: "Bayesian schema detected"**
- **Causa**: Indicatore usa schema Bayesiano (9.6-9.10)
- **Soluzione**: Questo è solo un warning - il file è valido ma non funzionerà nel client integrato

---

## 🔗 Riferimenti

- **Field Kit Repository**: `/auditor-field-kit/interactive/`
- **Client Integrato**: `/dashboard/auditing/client-integrated.js`
- **Formato JSON**: Vedi esempi in `/auditor-field-kit/interactive/en-US/`

---

**Versione**: 1.0
**Ultima modifica**: 2025-01-15
**Maintainer**: CPF Team
