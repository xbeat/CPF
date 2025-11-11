const fs = require('fs');
const path = require('path');
const { validateCPFJSON } = require('./validator.js');

const jsonPath = process.argv[2];
if (!jsonPath) {
    console.error('Usage: node test-validator.js <path-to-json-file>');
    process.exit(1);
}

try {
    const jsonContent = fs.readFileSync(jsonPath, 'utf8');
    const jsonData = JSON.parse(jsonContent);

    console.log(`\nValidating: ${path.basename(jsonPath)}`);
    console.log('='.repeat(60));

    const result = validateCPFJSON(jsonData);

    if (result.valid && result.errors.length === 0 && result.warnings.length === 0) {
        console.log('✅ VALIDATION PASSED - No errors, no warnings');
        process.exit(0);
    } else {
        if (result.errors.length > 0) {
            console.log(`\n❌ ERRORS (${result.errors.length}):`);
            result.errors.forEach((err, i) => {
                console.log(`  ${i + 1}. ${err}`);
            });
        }

        if (result.warnings.length > 0) {
            console.log(`\n⚠️  WARNINGS (${result.warnings.length}):`);
            result.warnings.forEach((warn, i) => {
                console.log(`  ${i + 1}. ${warn}`);
            });
        }

        console.log(`\nValid: ${result.valid}`);
        process.exit(result.errors.length > 0 ? 1 : 0);
    }
} catch (error) {
    console.error(`\n❌ ERROR: ${error.message}`);
    process.exit(1);
}
