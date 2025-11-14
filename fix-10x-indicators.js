#!/usr/bin/env node
/**
 * Fix 10.x indicators - add missing items array to section 1
 */

const fs = require('fs');
const path = require('path');

const BASE_PATH = './auditor field kit/interactive';
const LANGUAGES = ['en-US', 'it-IT'];

let fixed = 0;

LANGUAGES.forEach(lang => {
    console.log(`\nFixing ${lang} indicators 10.x...`);

    for (let i = 1; i <= 10; i++) {
        const filePath = path.join(BASE_PATH, lang, '10.x-convergent', `indicator_10.${i}.json`);

        if (!fs.existsSync(filePath)) {
            console.log(`  10.${i}: FILE NOT FOUND`);
            continue;
        }

        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const json = JSON.parse(content);

            if (!json.sections || !Array.isArray(json.sections)) {
                console.log(`  10.${i}: SKIP - no sections`);
                continue;
            }

            let modified = false;

            json.sections.forEach((section, idx) => {
                // Add missing items array
                if (!section.items || !Array.isArray(section.items)) {
                    section.items = [];
                    modified = true;
                }

                // Add missing subsections array
                if (!section.subsections || !Array.isArray(section.subsections)) {
                    section.subsections = [];
                    modified = true;
                }
            });

            if (modified) {
                fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
                console.log(`  10.${i}: ✅ FIXED`);
                fixed++;
            } else {
                console.log(`  10.${i}: ⚪ OK (already valid)`);
            }

        } catch (error) {
            console.log(`  10.${i}: ❌ ERROR - ${error.message}`);
        }
    }
});

console.log(`\n✅ Fixed ${fixed} indicators`);
