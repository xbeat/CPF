#!/usr/bin/env node
// ============================================
// CPF FIELD KIT - FIX MISSING SUBSECTIONS
// Scansiona e corregge schede con subsections mancanti
// ============================================

const fs = require('fs');
const path = require('path');

// Colori per output console
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function findAllIndicatorFiles(baseDir) {
    const files = [];

    function scanDirectory(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                scanDirectory(fullPath);
            } else if (entry.isFile() && entry.name.match(/^indicator_\d+\.\d+\.json$/)) {
                files.push(fullPath);
            }
        }
    }

    scanDirectory(baseDir);
    return files;
}

function validateAndFixJSON(filePath) {
    const issues = [];
    let needsFix = false;
    let jsonData;

    try {
        const content = fs.readFileSync(filePath, 'utf8');
        jsonData = JSON.parse(content);
    } catch (error) {
        return {
            valid: false,
            issues: [`❌ Parse error: ${error.message}`],
            needsFix: false,
            data: null
        };
    }

    // Controlla se ha il campo sections
    if (!jsonData.sections || !Array.isArray(jsonData.sections)) {
        issues.push('❌ Missing or invalid "sections" array');
        return { valid: false, issues, needsFix: false, data: jsonData };
    }

    // Controlla ogni sezione per subsections mancanti
    jsonData.sections.forEach((section, idx) => {
        if (!section.hasOwnProperty('subsections')) {
            issues.push(`⚠️  Section ${idx + 1} (${section.id || 'unknown'}) missing "subsections" field`);
            needsFix = true;

            // FIX: Aggiungi subsections vuoto se items esiste
            if (section.items && Array.isArray(section.items)) {
                section.subsections = [];
            }
        }

        // Controlla se subsections è undefined o null
        if (section.subsections === undefined || section.subsections === null) {
            issues.push(`⚠️  Section ${idx + 1} (${section.id || 'unknown'}) has undefined/null "subsections"`);
            needsFix = true;
            section.subsections = [];
        }

        // Controlla che subsections sia un array
        if (section.subsections && !Array.isArray(section.subsections)) {
            issues.push(`⚠️  Section ${idx + 1} (${section.id || 'unknown'}) "subsections" is not an array`);
            needsFix = true;
            section.subsections = [];
        }
    });

    return {
        valid: issues.length === 0,
        issues,
        needsFix,
        data: jsonData
    };
}

function scanAndReport(baseDir, fix = false) {
    log('\n🔍 CPF FIELD KIT - SUBSECTIONS SCANNER', 'cyan');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');

    const files = findAllIndicatorFiles(baseDir);
    log(`📁 Found ${files.length} indicator files\n`, 'blue');

    const results = {
        total: 0,
        valid: 0,
        invalid: 0,
        fixed: 0,
        errors: 0
    };

    const defectiveFiles = [];

    for (const file of files) {
        results.total++;
        const relativePath = path.relative(baseDir, file);
        const result = validateAndFixJSON(file);

        if (result.valid) {
            results.valid++;
            log(`✅ ${relativePath}`, 'green');
        } else {
            results.invalid++;
            defectiveFiles.push({ path: file, relativePath, result });

            log(`\n❌ ${relativePath}`, 'red');
            result.issues.forEach(issue => {
                log(`   ${issue}`, 'yellow');
            });

            // FIX mode
            if (fix && result.needsFix && result.data) {
                try {
                    const fixedContent = JSON.stringify(result.data, null, 2) + '\n';
                    fs.writeFileSync(file, fixedContent, 'utf8');
                    results.fixed++;
                    log(`   ✓ FIXED: Added missing subsections fields`, 'green');
                } catch (error) {
                    results.errors++;
                    log(`   ✗ ERROR fixing file: ${error.message}`, 'red');
                }
            }
        }
    }

    // Summary
    log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
    log('📊 SCAN SUMMARY', 'cyan');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
    log(`Total files scanned:    ${results.total}`, 'blue');
    log(`Valid files:            ${results.valid}`, 'green');
    log(`Defective files:        ${results.invalid}`, results.invalid > 0 ? 'red' : 'green');

    if (fix) {
        log(`Files fixed:            ${results.fixed}`, results.fixed > 0 ? 'green' : 'yellow');
        log(`Errors during fix:      ${results.errors}`, results.errors > 0 ? 'red' : 'green');
    }

    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');

    // Lista file difettosi
    if (defectiveFiles.length > 0) {
        log('📋 DEFECTIVE FILES LIST:', 'yellow');
        defectiveFiles.forEach(({ relativePath }, idx) => {
            log(`   ${idx + 1}. ${relativePath}`, 'yellow');
        });
        log('');
    }

    if (!fix && results.invalid > 0) {
        log('💡 Run with --fix to automatically correct missing subsections fields\n', 'cyan');
    }

    return results;
}

// Main execution
const args = process.argv.slice(2);
const fixMode = args.includes('--fix');
const baseDir = args.find(arg => !arg.startsWith('--')) || path.join(__dirname, '../auditor field kit/interactive');

if (!fs.existsSync(baseDir)) {
    log(`❌ Directory not found: ${baseDir}`, 'red');
    process.exit(1);
}

const results = scanAndReport(baseDir, fixMode);

// Exit code
process.exit(results.invalid > 0 && !fixMode ? 1 : 0);
