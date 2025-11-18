#!/usr/bin/env node

/**
 * CPF Field Kit JSON Validator
 *
 * Validates Field Kit JSON files for correct structure and required fields.
 *
 * Usage: node dashboard/auditing/scripts/validate-fieldkit.js <path-to-json>
 *
 * Example:
 *   node dashboard/auditing/scripts/validate-fieldkit.js auditor-field-kit/interactive/en-US/1.x-authority/indicator_1.1.json
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

/**
 * Validate Field Kit JSON structure
 */
function validateFieldKit(filePath) {
    const errors = [];
    const warnings = [];

    // Read file
    let data;
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        data = JSON.parse(content);
    } catch (error) {
        errors.push(`Failed to read or parse JSON: ${error.message}`);
        return { valid: false, errors, warnings };
    }

    // Check required top-level fields
    const requiredFields = ['indicator', 'title', 'category', 'sections'];
    requiredFields.forEach(field => {
        if (!data[field]) {
            errors.push(`Missing required field: ${field}`);
        }
    });

    // Validate indicator format (X.Y)
    if (data.indicator && !/^\d{1,2}\.\d{1,2}$/.test(data.indicator)) {
        errors.push(`Invalid indicator format: ${data.indicator} (expected: X.Y, e.g., 1.3)`);
    }

    // Check sections array
    if (data.sections) {
        if (!Array.isArray(data.sections)) {
            errors.push('Field "sections" must be an array');
        } else if (data.sections.length === 0) {
            warnings.push('Sections array is empty');
        } else {
            // Validate each section
            data.sections.forEach((section, idx) => {
                if (!section.id) {
                    warnings.push(`Section ${idx} is missing "id" field`);
                }
                if (!section.title) {
                    warnings.push(`Section ${idx} is missing "title" field`);
                }
                if (!section.items || !Array.isArray(section.items)) {
                    warnings.push(`Section ${idx} is missing "items" array`);
                }
            });
        }
    }

    // Check scoring configuration (if present)
    if (data.scoring) {
        if (!data.scoring.maturity_levels) {
            warnings.push('Scoring configuration exists but missing "maturity_levels"');
        } else {
            const levels = ['green', 'yellow', 'red'];
            levels.forEach(level => {
                if (!data.scoring.maturity_levels[level]) {
                    warnings.push(`Missing maturity level: ${level}`);
                }
            });
        }
    } else {
        warnings.push('No scoring configuration found (required for score calculation)');
    }

    // Check for Bayesian schema (indicators 9.6-9.10)
    if (data.quick_assessment && !data.sections) {
        warnings.push('Bayesian schema detected (not supported by integrated client)');
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * Main execution
 */
function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log(`${colors.cyan}CPF Field Kit JSON Validator${colors.reset}\n`);
        console.log('Usage: node validate-fieldkit.js <path-to-json>\n');
        console.log('Example:');
        console.log('  node validate-fieldkit.js auditor-field-kit/interactive/en-US/1.x-authority/indicator_1.1.json\n');
        process.exit(1);
    }

    const filePath = args[0];

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        console.error(`${colors.red}✗ Error: File not found: ${filePath}${colors.reset}`);
        process.exit(1);
    }

    console.log(`${colors.cyan}Validating: ${colors.reset}${filePath}\n`);

    const result = validateFieldKit(filePath);

    // Display results
    if (result.valid) {
        console.log(`${colors.green}✓ JSON is valid!${colors.reset}\n`);
    } else {
        console.log(`${colors.red}✗ JSON has ${result.errors.length} error(s)${colors.reset}\n`);
    }

    // Display errors
    if (result.errors.length > 0) {
        console.log(`${colors.red}Errors:${colors.reset}`);
        result.errors.forEach((error, idx) => {
            console.log(`  ${idx + 1}. ${error}`);
        });
        console.log('');
    }

    // Display warnings
    if (result.warnings.length > 0) {
        console.log(`${colors.yellow}Warnings (${result.warnings.length}):${colors.reset}`);
        result.warnings.forEach((warning, idx) => {
            console.log(`  ${idx + 1}. ${warning}`);
        });
        console.log('');
    }

    // Exit with appropriate code
    process.exit(result.valid ? 0 : 1);
}

main();
