#!/usr/bin/env node
/**
 * Fix 10.x indicators - convert response_type to type for compatibility
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

            let modified = false;

            if (json.sections && Array.isArray(json.sections)) {
                json.sections.forEach(section => {
                    if (section.items && Array.isArray(section.items)) {
                        section.items.forEach(item => {
                            if (item.response_type) {
                                // Map response_type to type
                                if (item.response_type === 'select_one') {
                                    item.type = 'radio-group';
                                } else {
                                    item.type = item.response_type;
                                }
                                delete item.response_type;
                                modified = true;
                            }
                            // Also rename 'question' to 'title' for consistency
                            if (item.question && !item.title) {
                                item.title = item.question;
                                delete item.question;
                                modified = true;
                            }
                        });
                    }
                });
            }

            if (modified) {
                fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
                console.log(`  10.${i}: ✅ FIXED`);
                fixed++;
            } else {
                console.log(`  10.${i}: ⚪ OK`);
            }

        } catch (error) {
            console.log(`  10.${i}: ❌ ERROR - ${error.message}`);
        }
    }
});

console.log(`\n✅ Fixed ${fixed} indicators`);
