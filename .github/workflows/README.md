# GitHub Actions - Documentation

This repository uses GitHub Actions to automate PDF generation from source files.

## 📑 Table of Contents

1. [LaTeX to PDF](#-latex-to-pdf) - Compile .tex files to PDF
2. [Markdown to PDF](#-markdown-to-pdf) - Convert .md files to PDF
3. [Required Permissions](#-required-permissions)
4. [Troubleshooting](#-troubleshooting)

---

## 📘 LaTeX to PDF

### Description

The `latex-to-pdf.yml` workflow automatically compiles LaTeX (.tex) files into high-quality PDFs using pdflatex.

### How to Use

#### 1. Go to GitHub Actions
```
https://github.com/xbeat/CPF/actions
```

#### 2. Select "Compile LaTeX to PDF"

#### 3. Click "Run workflow"

#### 4. Enter the parameters:

**Source Folder** (required):
- Folder containing .tex files to compile
- Example: `research`, `cpf-soc-integration/docs/en-US`, `.`
- Default: `.` (repository root)

**Output Folder** (optional):
- Where to save generated PDFs
- If empty: PDFs saved in the same folder as the .tex file
- Example: `output/pdfs`, `build`

#### 5. Click "Run workflow" to start

### Usage Examples

**Example 1: Compile all .tex files in the research folder**
```yaml
Source folder: research
Output folder: (leave empty)
```
Result: `research/paper.tex` → `research/paper.pdf`

**Example 2: Compile and save to a separate folder**
```yaml
Source folder: cpf-soc-integration/docs/en-US
Output folder: pdfs/en-US
```
Result: `docs/en-US/paper.tex` → `pdfs/en-US/paper.pdf`

**Example 3: Compile everything in the repository**
```yaml
Source folder: .
Output folder: (leave empty)
```

### Features

- ✅ Compiles with `pdflatex` (double execution for references)
- ✅ Automatically cleans auxiliary files (.aux, .log, etc.)
- ✅ Handles errors and continues with next files
- ✅ Automatically commits generated PDFs
- ✅ Non-recursive (only files in specified folder)

### Output

PDFs are automatically committed to the repository with message:
```
Add compiled PDFs from [source_folder]
```

---

## 📄 Markdown to PDF

### Description

The `md-to-pdf.yml` workflow automatically converts Markdown (.md) files into professional PDFs using Pandoc with XeLaTeX.

### How to Use

#### 1. Go to GitHub Actions
```
https://github.com/xbeat/CPF/actions
```

#### 2. Select "Convert Markdown to PDF"

#### 3. Click "Run workflow"

#### 4. Enter the parameters:

**Source Folder** (required):
- Folder containing .md files to convert
- Example: `cpf-soc-integration/docs/en-US`, `cpf-soc-integration/docs/it-IT`
- Default: `cpf-soc-integration/docs/en-US`

**Output Folder** (optional):
- Where to save generated PDFs
- If empty: PDFs saved in the same folder as the .md file
- Example: `pdfs/en-US`, `output`

#### 5. Click "Run workflow" to start

### Usage Examples

**Example 1: Convert all English .md files**
```yaml
Source folder: cpf-soc-integration/docs/en-US
Output folder: (leave empty)
```
Result: `docs/en-US/README.md` → `docs/en-US/README.pdf`

**Example 2: Convert all Italian .md files**
```yaml
Source folder: cpf-soc-integration/docs/it-IT
Output folder: (leave empty)
```
Result: `docs/it-IT/README.md` → `docs/it-IT/README.pdf`

**Example 3: Save to a separate folder**
```yaml
Source folder: cpf-soc-integration/docs/en-US
Output folder: pdfs/en-US
```

### Generated PDF Features

PDFs are created with these professional settings:

- **Engine**: XeLaTeX (full Unicode support)
- **Margins**: 1 inch on all sides
- **Font**: 11pt
- **Table of Contents**: Automatically generated (TOC) up to 3 levels
- **Syntax Highlighting**: Tango style for code blocks
- **Layout**: Professional with article document class

### Output

PDFs are automatically committed to the repository with message:
```
docs: Add PDF versions from [source_folder]
```

---

## 🔒 Required Permissions

Both workflows require the following permissions:

### GitHub Actions Settings

1. Go to: `Settings` → `Actions` → `General`
2. Under "Workflow permissions":
   - ✅ Select **"Read and write permissions"**
   - ✅ Enable **"Allow GitHub Actions to create and approve pull requests"**
3. Click "Save"

**⚠️ Important**: Without these permissions, workflows will not be able to commit generated PDFs.

---

## 🔧 Troubleshooting

### Workflow doesn't start

**Problem**: Workflow not available in Actions
- ✅ Verify that `.yml` files are in the `.github/workflows/` folder
- ✅ Check that YAML syntax is correct
- ✅ Push workflow files to the repository

### LaTeX compilation errors

**Problem**: .tex file doesn't compile
- 📋 Check GitHub Actions logs for specific errors
- 📋 Verify that the .tex file is valid
- 📋 Ensure all required LaTeX packages are available
- 💡 The workflow installs `texlive-full` which includes most packages

### Markdown conversion errors

**Problem**: .md file doesn't convert to PDF
- 📋 Check logs for Pandoc errors
- 📋 Verify that markdown is valid
- 📋 Some special characters may require escaping
- 💡 Complex tables may not convert perfectly

### PDFs not committed

**Problem**: PDFs generated but not committed to repository
- 🔐 Verify GitHub Actions permissions (see [Permissions](#-required-permissions) section)
- 📋 Check for errors in "Commit PDFs" step
- 📋 Ensure at least one PDF was generated successfully

### Folder not found

**Problem**: Error: Folder 'xyz' does not exist
- 📁 Verify that the folder exists in the repository
- 📁 Use relative paths from repository root
- 📁 Check case sensitivity in path

### Workflow too slow

**Problem**: Compilation takes too long
- ⏱️ Installing TeX Live Full requires ~2-3 minutes
- ⏱️ Markdown conversion requires ~30-60 seconds
- 💡 Consider limiting the number of files to process

---

## 📊 Workflow Comparison

| Feature | LaTeX to PDF | Markdown to PDF |
|---------|-------------|-----------------|
| **Input Format** | .tex | .md |
| **Engine** | pdflatex | Pandoc + XeLaTeX |
| **Executions** | 2x (for references) | 1x |
| **TOC** | Automatic if present | Always generated |
| **Syntax Highlighting** | ❌ | ✅ (Tango) |
| **Average Time** | ~3-5 min | ~2-3 min |
| **Auxiliary Files** | Automatically removed | N/A |
| **Output folder** | ✅ Supported | ✅ Supported |

---

## 🎯 Best Practices

### 1. File Organization
```
repository/
├── docs/
│   ├── en-US/
│   │   ├── README.md
│   │   └── guide.md
│   └── it-IT/
│       ├── README.md
│       └── guide.md
└── pdfs/           ← Optional output folder
    ├── en-US/
    └── it-IT/
```

### 2. Naming Conventions
- Use descriptive file names without spaces
- Prefer `snake_case` or `kebab-case`
- Avoid special characters in file names

### 3. Testing
- Test first with a single folder
- Verify results before processing everything
- Always check logs for warnings

### 4. Version Control
- Committed PDFs are tracked by Git
- Consider using `.gitignore` if you prefer not to track PDFs
- Use separate Output Folder for better organization

---

## 📚 Useful Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Pandoc Manual](https://pandoc.org/MANUAL.html)
- [LaTeX Documentation](https://www.latex-project.org/help/documentation/)
- [XeLaTeX Guide](https://www.overleaf.com/learn/latex/XeLaTeX)

---

## 🆘 Support

For issues, questions, or suggestions:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Review GitHub Actions logs
3. Create an issue in the repository with:
   - Workflow name
   - Input provided
   - Complete error log
   - Screenshot if helpful

---

**Last updated**: 2025-11-18
