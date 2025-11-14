#!/usr/bin/env node
/**
 * Test ALL indicator JSON files for both IT and EN
 * Checks if they can be loaded and have required fields
 */

const fs = require('fs');
const path = require('path');

const BASE_PATH = './auditor field kit/interactive';
const LANGUAGES = ['en-US', 'it-IT'];
const CATEGORIES = [
    { id: 1, name: '1.x-authority' },
    { id: 2, name: '2.x-temporal' },
    { id: 3, name: '3.x-social' },
    { id: 4, name: '4.x-affective' },
    { id: 5, name: '5.x-technical' },
    { id: 6, name: '6.x-cognitive' },
    { id: 7, name: '7.x-organizational' },
    { id: 8, name: '8.x-environmental' },
    { id: 9, name: '9.x-ai' },
    { id: 10, name: '10.x-convergent' }
];

let totalChecked = 0;
let totalErrors = 0;
let totalWarnings = 0;

console.log('🧪 CPF Indicator Loading Test');
console.log('==========================================\n');

LANGUAGES.forEach(lang => {
    console.log(`\n📋 Testing ${lang}...\n`);

    CATEGORIES.forEach(category => {
        for (let i = 1; i <= 10; i++) {
            const indicatorId = `${category.id}.${i}`;
            const filePath = path.join(BASE_PATH, lang, category.name, `indicator_${indicatorId}.json`);

            if (!fs.existsSync(filePath)) {
                console.log(`⚠️  ${indicatorId}: FILE NOT FOUND`);
                totalWarnings++;
                continue;
            }

            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const json = JSON.parse(content);

                totalChecked++;

                // Detect schema type
                const isStandardSchema = json.hasOwnProperty('sections');
                const isBayesianSchema = json.hasOwnProperty('indicator_id') &&
                                        json.hasOwnProperty('quick_assessment') &&
                                        !json.hasOwnProperty('sections');

                let errors = [];

                if (isStandardSchema) {
                    // Standard schema validation
                    if (!json.indicator) errors.push('Missing: indicator');
                    if (!json.title) errors.push('Missing: title');
                    if (!json.sections || !Array.isArray(json.sections)) {
                        errors.push('Missing or invalid: sections');
                    } else {
                        // Check sections structure
                        json.sections.forEach((section, sIdx) => {
                            if (!section.items || !Array.isArray(section.items)) {
                                errors.push(`Section ${sIdx}: missing items array`);
                            }
                            if (!section.subsections || !Array.isArray(section.subsections)) {
                                errors.push(`Section ${sIdx}: missing subsections array`);
                            }
                        });
                    }

                    if (errors.length > 0) {
                        console.log(`❌ ${indicatorId}: ERRORS (standard schema)`);
                        errors.forEach(err => console.log(`   - ${err}`));
                        totalErrors++;
                    } else {
                        console.log(`✅ ${indicatorId}: OK (standard schema)`);
                    }

                } else if (isBayesianSchema) {
                    // Bayesian schema validation
                    if (!json.indicator_id) errors.push('Missing: indicator_id');
                    if (!json.indicator_name) errors.push('Missing: indicator_name');
                    if (!json.quick_assessment) errors.push('Missing: quick_assessment');

                    if (errors.length > 0) {
                        console.log(`❌ ${indicatorId}: ERRORS (Bayesian schema)`);
                        errors.forEach(err => console.log(`   - ${err}`));
                        totalErrors++;
                    } else {
                        console.log(`⚠️  ${indicatorId}: WARNING - Bayesian schema not supported by client-integrated.js`);
                        totalWarnings++;
                    }

                } else {
                    console.log(`❌ ${indicatorId}: UNKNOWN SCHEMA`);
                    totalErrors++;
                }

            } catch (error) {
                console.log(`❌ ${indicatorId}: PARSE ERROR - ${error.message}`);
                totalErrors++;
            }
        }
    });
});

console.log('\n==========================================');
console.log('SUMMARY');
console.log('==========================================');
console.log(`Total checked: ${totalChecked}`);
console.log(`Errors: ${totalErrors}`);
console.log(`Warnings: ${totalWarnings}`);
console.log(`Valid: ${totalChecked - totalErrors}`);

if (totalErrors > 0) {
    process.exit(1);
}
