#!/usr/bin/env node
/**
 * Find IT indicators with English text
 */

const fs = require('fs');
const path = require('path');

const BASE_PATH = './auditor field kit/interactive/it-IT';
const CATEGORIES = [
    '1.x-authority', '2.x-temporal', '3.x-social', '4.x-affective',
    '5.x-technical', '6.x-cognitive', '7.x-organizational',
    '8.x-environmental', '9.x-ai', '10.x-convergent'
];

// English words that shouldn't appear in Italian text
const ENGLISH_MARKERS = [
    'Quick Assessment', 'Client Conversation', 'question', 'options',
    'green', 'yellow', 'red', 'score', 'Yes', 'No', 'Sometimes',
    'Never', 'Always', 'Usually', 'Rarely', 'Often'
];

function hasEnglishText(text, threshold = 3) {
    if (!text || typeof text !== 'string') return false;

    let count = 0;
    for (const marker of ENGLISH_MARKERS) {
        if (text.includes(marker)) count++;
        if (count >= threshold) return true;
    }
    return false;
}

function checkIndicator(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const json = JSON.parse(content);

        const issues = [];

        // Check title
        if (hasEnglishText(json.title)) {
            issues.push('title');
        }

        // Check subtitle
        if (hasEnglishText(json.subtitle)) {
            issues.push('subtitle');
        }

        // Check sections
        if (json.sections && Array.isArray(json.sections)) {
            json.sections.forEach((section, sIdx) => {
                if (hasEnglishText(section.title)) {
                    issues.push(`section ${sIdx} title`);
                }

                if (section.items && Array.isArray(section.items)) {
                    section.items.forEach((item, iIdx) => {
                        const itemTitle = item.title || item.question;
                        if (hasEnglishText(itemTitle)) {
                            issues.push(`section ${sIdx} item ${iIdx} title`);
                        }

                        if (item.options && Array.isArray(item.options)) {
                            item.options.forEach((opt, oIdx) => {
                                if (hasEnglishText(opt.label)) {
                                    issues.push(`section ${sIdx} item ${iIdx} option ${oIdx}`);
                                }
                            });
                        }
                    });
                }
            });
        }

        return issues;
    } catch (error) {
        return [`ERROR: ${error.message}`];
    }
}

console.log('🔍 Searching for untranslated IT indicators...\n');

const untranslated = [];

CATEGORIES.forEach(category => {
    const catId = category.split('.')[0];
    for (let i = 1; i <= 10; i++) {
        const filePath = path.join(BASE_PATH, category, `indicator_${catId}.${i}.json`);

        if (!fs.existsSync(filePath)) continue;

        const issues = checkIndicator(filePath);
        if (issues.length > 0) {
            untranslated.push({ id: `${catId}.${i}`, issues });
        }
    }
});

if (untranslated.length > 0) {
    console.log(`❌ Found ${untranslated.length} indicators with English text:\n`);
    untranslated.forEach(item => {
        console.log(`  ${item.id}:`);
        item.issues.forEach(issue => console.log(`    - ${issue}`));
    });
} else {
    console.log('✅ All IT indicators appear to be translated!');
}
