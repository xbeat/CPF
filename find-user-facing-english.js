#!/usr/bin/env node
/**
 * Find IT indicators with English in USER-FACING text (ignore technical fields)
 */

const fs = require('fs');
const path = require('path');

const BASE_PATH = './auditor field kit/interactive/it-IT';
const CATEGORIES = [
    '1.x-authority', '2.x-temporal', '3.x-social', '4.x-affective',
    '5.x-technical', '6.x-cognitive', '7.x-organizational',
    '8.x-environmental', '9.x-ai', '10.x-convergent'
];

// Technical field names that can be in English
const TECHNICAL_FIELDS = [
    'type', 'response_type', 'id', 'value', 'method', 'formula',
    'scoring_method', 'detection_formula', 'bayesian_network'
];

function hasEnglishContent(obj, path = '', key = '') {
    const issues = [];

    // Skip technical fields
    if (TECHNICAL_FIELDS.includes(key)) {
        return issues;
    }

    if (typeof obj === 'string') {
        // Only check user-facing text fields
        const userFacingFields = ['title', 'label', 'description', 'question', 'text', 'subtitle', 'instructions'];
        const isUserFacing = userFacingFields.some(field => path.includes(field));

        if (isUserFacing || key === 'label' || key === 'title' || key === 'description') {
            // Check for English words
            const englishPatterns = [
                /\bQuick Assessment\b/,
                /\bClient Conversation\b/,
                /\bNever\b(?!\s*-)/,  // "Never" not followed by dash
                /\bAlways\b(?!\s*-)/,
                /\bRarely\b(?!\s*\/|\s*-)/,
                /\bSometimes\b(?!\s*-)/,
                /\bOften\b/,
                /\bFrequently\b(?!\s*-)/,
                /\bOccasionally\b/,
                /\bYes\b(?!\s*\/)/,
                /\bNo\b(?!\s*\/|\s*-)/,
                /\bVerification required\b/,
                /\bexecutive\b(?!s)/i,
                /\bpast 12 months\b/,
                /\bsecurity exceptions\b/,
                /\bformal exception\b/,
                /\bregardless of authority\b/,
                /\bdocumented examples\b/,
            ];

            for (const pattern of englishPatterns) {
                if (pattern.test(obj)) {
                    return [[path || key, obj.substring(0, 80) + (obj.length > 80 ? '...' : '')]];
                }
            }
        }
    } else if (Array.isArray(obj)) {
        obj.forEach((item, idx) => {
            issues.push(...hasEnglishContent(item, `${path}[${idx}]`, ''));
        });
    } else if (obj && typeof obj === 'object') {
        Object.entries(obj).forEach(([k, value]) => {
            const newPath = path ? `${path}.${k}` : k;
            issues.push(...hasEnglishContent(value, newPath, k));
        });
    }

    return issues;
}

function checkIndicator(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const json = JSON.parse(content);
        return hasEnglishContent(json);
    } catch (error) {
        return [[`ERROR`, error.message]];
    }
}

console.log('🔍 Finding IT indicators with English in USER-FACING text...\n');

const problematic = [];

CATEGORIES.forEach(category => {
    const catId = category.split('.')[0];

    if (!fs.existsSync(path.join(BASE_PATH, category))) {
        return;
    }

    for (let i = 1; i <= 10; i++) {
        const filePath = path.join(BASE_PATH, category, `indicator_${catId}.${i}.json`);

        if (!fs.existsSync(filePath)) continue;

        const issues = checkIndicator(filePath);
        if (issues.length > 0) {
            problematic.push({
                id: `${catId}.${i}`,
                file: filePath,
                issueCount: issues.length,
                samples: issues.slice(0, 5)
            });
        }
    }
});

if (problematic.length > 0) {
    console.log(`❌ Found ${problematic.length} indicators with English in user-facing text:\n`);
    problematic.forEach(item => {
        console.log(`\n📄 ${item.id} (${item.issueCount} issues):`);
        item.samples.forEach(([path, text]) => {
            console.log(`   ${path}:`);
            console.log(`     "${text}"`);
        });
    });
    console.log(`\n\nTotal: ${problematic.length} indicators need translation`);
} else {
    console.log('✅ All IT indicators have Italian user-facing text!');
}
