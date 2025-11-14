#!/usr/bin/env node
/**
 * Find ALL IT indicators with ANY English text
 */

const fs = require('fs');
const path = require('path');

const BASE_PATH = './auditor field kit/interactive/it-IT';
const CATEGORIES = [
    '1.x-authority', '2.x-temporal', '3.x-social', '4.x-affective',
    '5.x-technical', '6.x-cognitive', '7.x-organizational',
    '8.x-environmental', '9.x-ai', '10.x-convergent'
];

function hasEnglishContent(obj, path = '') {
    const issues = [];

    if (typeof obj === 'string') {
        // Check for common English phrases
        const englishPatterns = [
            /\bquestion\b/i,
            /\bQuick Assessment\b/,
            /\bClient Conversation\b/,
            /\bYes\b(?!\s*\/\s*Sì)/,  // "Yes" not followed by "/ Sì"
            /\bNo\b(?!\s*\/\s*No)/,
            /\bSometimes\b/,
            /\bAlways\b/,
            /\bNever\b/,
            /\bUsually\b/,
            /\bRarely\b(?!\/)/,
            /\bOften\b/,
            /\bFrequently\b/,
            /\bOccasionally\b/,
            /\bselect_one\b/,
            /\bresponse_type\b/,
            /\bfollow_up\b/,
            /\boptions\b(?!\s*:)/,  // "options" not followed by colon (field name)
        ];

        for (const pattern of englishPatterns) {
            if (pattern.test(obj)) {
                return [[path, obj.substring(0, 100)]];
            }
        }
    } else if (Array.isArray(obj)) {
        obj.forEach((item, idx) => {
            issues.push(...hasEnglishContent(item, `${path}[${idx}]`));
        });
    } else if (obj && typeof obj === 'object') {
        Object.entries(obj).forEach(([key, value]) => {
            const newPath = path ? `${path}.${key}` : key;
            issues.push(...hasEnglishContent(value, newPath));
        });
    }

    return issues;
}

function checkIndicator(filePath, indicatorId) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const json = JSON.parse(content);

        const issues = hasEnglishContent(json);
        return issues.length > 0 ? issues : null;
    } catch (error) {
        return [[`ERROR`, error.message]];
    }
}

console.log('🔍 Searching for ALL English text in IT indicators...\n');

const problematic = [];

CATEGORIES.forEach(category => {
    const catId = category.split('.')[0];

    if (!fs.existsSync(path.join(BASE_PATH, category))) {
        return;
    }

    for (let i = 1; i <= 10; i++) {
        const filePath = path.join(BASE_PATH, category, `indicator_${catId}.${i}.json`);

        if (!fs.existsSync(filePath)) continue;

        const issues = checkIndicator(filePath, `${catId}.${i}`);
        if (issues) {
            problematic.push({
                id: `${catId}.${i}`,
                file: filePath,
                issueCount: issues.length,
                samples: issues.slice(0, 3)  // Show first 3 issues
            });
        }
    }
});

if (problematic.length > 0) {
    console.log(`❌ Found ${problematic.length} indicators with English text:\n`);
    problematic.forEach(item => {
        console.log(`  ${item.id} (${item.issueCount} issues):`);
        item.samples.forEach(([path, text]) => {
            console.log(`    ${path}: "${text}"`);
        });
        console.log('');
    });
} else {
    console.log('✅ All IT indicators appear to be fully translated!');
}

console.log(`\nTotal problematic indicators: ${problematic.length}`);
