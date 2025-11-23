#!/usr/bin/env node
/**
 * CPF Indicator Validator and Auto-Fixer
 * Validates and automatically fixes common issues in indicator JSON files
 */

const fs = require('fs');
const path = require('path');

// Import validator
const { validateCPFJSON } = require('../cpf-detection-engine/validation/cpf-json-validator.js');

// Configuration
const INDICATOR_BASE_PATH = path.join(__dirname, '../../auditor field kit/interactive');
const LANGUAGES = ['en-US', 'it-IT', 'es-ES', 'fr-FR', 'de-DE'];
const CATEGORIES = [
    { id: 1, name: '1.x-authority' },
    { id: 2, name: '2.x-temporal' },
    { id: 3, name: '3.x-social' },
    { id: 4, name: '4.x-affective' },
    { id: 5, name: '5.x-cognitive' },
    { id: 6, name: '6.x-group' },
    { id: 7, name: '7.x-stress' },
    { id: 8, name: '8.x-unconscious' },
    { id: 9, name: '9.x-ai' },
    { id: 10, name: '10.x-convergent' }
];

/**
 * Auto-fix common issues in indicator JSON
 */
function autoFixIndicator(data, indicatorId) {
    const fixed = JSON.parse(JSON.stringify(data)); // Deep clone
    let changes = [];

    // Fix 1: Ensure indicator ID is correct
    if (fixed.indicator !== indicatorId) {
        changes.push(`Fixed indicator ID: ${fixed.indicator} → ${indicatorId}`);
        fixed.indicator = indicatorId;
    }

    // Fix 2: Normalize scoring weights to sum to 1.0
    if (fixed.scoring && fixed.scoring.weights) {
        const weights = fixed.scoring.weights;
        const sum = (weights.quick_assessment || 0) +
                   (weights.conversation_depth || 0) +
                   (weights.red_flags || 0);

        if (Math.abs(sum - 1.0) > 0.01) {
            // Normalize weights
            fixed.scoring.weights.quick_assessment = (weights.quick_assessment || 0) / sum;
            fixed.scoring.weights.conversation_depth = (weights.conversation_depth || 0) / sum;
            fixed.scoring.weights.red_flags = (weights.red_flags || 0) / sum;
            changes.push(`Normalized scoring weights: ${sum.toFixed(3)} → 1.000`);
        }
    }

    // Fix 3: Normalize question weights in quick assessment
    if (fixed.scoring && fixed.scoring.question_weights) {
        const qWeights = Object.values(fixed.scoring.question_weights);
        const qSum = qWeights.reduce((a, b) => a + b, 0);

        if (Math.abs(qSum - 1.0) > 0.01 && qSum > 0) {
            const keys = Object.keys(fixed.scoring.question_weights);
            keys.forEach(key => {
                fixed.scoring.question_weights[key] = fixed.scoring.question_weights[key] / qSum;
            });
            changes.push(`Normalized question weights: ${qSum.toFixed(3)} → 1.000`);
        }
    }

    // Fix 4: Ensure all quick assessment options have scores (0-1)
    const quickSection = fixed.sections?.find(s => s.id === 'quick-assessment');
    if (quickSection && quickSection.items) {
        quickSection.items.forEach(item => {
            item.options?.forEach(opt => {
                if (typeof opt.score === 'undefined') {
                    opt.score = 0.5; // Default to medium risk
                    changes.push(`Added default score (0.5) to option: ${opt.label}`);
                }
                // Clamp scores to 0-1 range
                if (opt.score < 0) {
                    changes.push(`Clamped score ${opt.score} → 0.0 for: ${opt.label}`);
                    opt.score = 0;
                }
                if (opt.score > 1) {
                    changes.push(`Clamped score ${opt.score} → 1.0 for: ${opt.label}`);
                    opt.score = 1;
                }
            });
        });
    }

    // Fix 5: Cap red flags total impact at 1.0
    // Red flags are identified by severity field (works for all languages)
    let redFlagsItems = [];

    // Scan all sections and subsections for items with severity
    fixed.sections?.forEach(section => {
        if (section.items) {
            section.items.forEach(item => {
                if (item.severity) redFlagsItems.push(item);
            });
        }
        if (section.subsections) {
            section.subsections.forEach(sub => {
                if (sub.items) {
                    sub.items.forEach(item => {
                        if (item.severity) redFlagsItems.push(item);
                    });
                }
            });
        }
    });

    if (redFlagsItems.length > 0) {
        const totalImpact = redFlagsItems.reduce((sum, item) => sum + (item.score_impact || item.weight || 0), 0);

        if (totalImpact > 1.0) {
            // Scale down all impacts proportionally
            const scale = 1.0 / totalImpact;
            redFlagsItems.forEach(item => {
                const impactField = item.score_impact !== undefined ? 'score_impact' : 'weight';
                if (item[impactField]) {
                    const oldImpact = item[impactField];
                    item[impactField] = item[impactField] * scale;
                    changes.push(`Scaled red flag "${item.label || item.title}": ${oldImpact.toFixed(3)} → ${item[impactField].toFixed(3)}`);
                }
            });
        }
    }

    // Fix 6: Normalize detection formula weights
    if (fixed.detection_formula?.mathematical_model?.default_weights) {
        const dWeights = Object.values(fixed.detection_formula.mathematical_model.default_weights);
        const dSum = dWeights.reduce((a, b) => a + b, 0);

        if (Math.abs(dSum - 1.0) > 0.01 && dSum > 0) {
            const keys = Object.keys(fixed.detection_formula.mathematical_model.default_weights);
            keys.forEach(key => {
                fixed.detection_formula.mathematical_model.default_weights[key] =
                    fixed.detection_formula.mathematical_model.default_weights[key] / dSum;
            });
            changes.push(`Normalized detection formula weights: ${dSum.toFixed(3)} → 1.000`);
        }
    }

    // Fix 7: Fix common typos
    const typoFixes = [
        { from: /indicatro/gi, to: 'indicator' },
        { from: /assesment/gi, to: 'assessment' },
        { from: /vulnrability/gi, to: 'vulnerability' },
        { from: /organizaton/gi, to: 'organization' }
    ];

    let jsonStr = JSON.stringify(fixed);
    let hadTypos = false;
    typoFixes.forEach(typo => {
        if (typo.from.test(jsonStr)) {
            jsonStr = jsonStr.replace(typo.from, typo.to);
            hadTypos = true;
        }
    });

    if (hadTypos) {
        changes.push('Fixed common typos in text');
        return { fixed: JSON.parse(jsonStr), changes };
    }

    return { fixed, changes };
}

/**
 * Validate and fix a single indicator file
 */
async function processIndicatorFile(filePath, indicatorId, dryRun = false) {
    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        // Validate original
        const validationResult = validateCPFJSON(data);

        // Attempt auto-fix if there are errors
        let fixResult = null;
        if (!validationResult.valid || validationResult.warnings.length > 0) {
            fixResult = autoFixIndicator(data, indicatorId);

            // Validate fixed version
            const fixedValidation = validateCPFJSON(fixResult.fixed);

            if (!dryRun && fixResult.changes.length > 0) {
                // Backup original
                const backupPath = filePath + '.backup';
                fs.copyFileSync(filePath, backupPath);

                // Write fixed version
                fs.writeFileSync(filePath, JSON.stringify(fixResult.fixed, null, 2), 'utf-8');
            }

            return {
                file: filePath,
                indicatorId,
                originalValid: validationResult.valid,
                fixedValid: fixedValidation.valid,
                errors: validationResult.errors,
                warnings: validationResult.warnings,
                fixedErrors: fixedValidation.errors,
                fixedWarnings: fixedValidation.warnings,
                changes: fixResult.changes,
                wasFixed: fixResult.changes.length > 0
            };
        }

        return {
            file: filePath,
            indicatorId,
            originalValid: true,
            errors: [],
            warnings: [],
            changes: [],
            wasFixed: false
        };

    } catch (error) {
        return {
            file: filePath,
            indicatorId,
            error: error.message
        };
    }
}

/**
 * Process all indicators
 */
async function validateAndFixAll(language = 'en-US', dryRun = false) {
    console.log('🔍 CPF Indicator Validator and Auto-Fixer');
    console.log('==========================================\n');
    console.log(`Language: ${language}`);
    console.log(`Mode: ${dryRun ? 'DRY RUN (no changes)' : 'LIVE (will fix files)'}\n`);

    const results = [];

    for (const category of CATEGORIES) {
        for (let ind = 1; ind <= 10; ind++) {
            const indicatorId = `${category.id}.${ind}`;
            const filePath = path.join(
                INDICATOR_BASE_PATH,
                language,
                category.name,
                `indicator_${indicatorId}.json`
            );

            if (fs.existsSync(filePath)) {
                const result = await processIndicatorFile(filePath, indicatorId, dryRun);
                results.push(result);

                // Print result
                if (result.error) {
                    console.log(`❌ ${indicatorId}: ERROR - ${result.error}`);
                } else if (result.wasFixed) {
                    console.log(`🔧 ${indicatorId}: FIXED (${result.changes.length} changes)`);
                    result.changes.forEach(change => {
                        console.log(`   → ${change}`);
                    });
                } else if (!result.originalValid) {
                    console.log(`⚠️  ${indicatorId}: HAS ISSUES (cannot auto-fix)`);
                    result.errors.forEach(err => console.log(`   ❌ ${err}`));
                } else if (result.warnings.length > 0) {
                    console.log(`⚠️  ${indicatorId}: ${result.warnings.length} warnings`);
                } else {
                    console.log(`✅ ${indicatorId}: OK`);
                }
            }
        }
    }

    // Summary
    console.log('\n==========================================');
    console.log('SUMMARY');
    console.log('==========================================');
    console.log(`Total indicators checked: ${results.length}`);
    console.log(`Valid: ${results.filter(r => r.originalValid && !r.error).length}`);
    console.log(`Fixed: ${results.filter(r => r.wasFixed).length}`);
    console.log(`Errors: ${results.filter(r => !r.originalValid || r.error).length}`);
    console.log(`Warnings: ${results.filter(r => r.warnings?.length > 0).length}`);

    return results;
}

// CLI
if (require.main === module) {
    const args = process.argv.slice(2);
    const language = args[0] || 'en-US';
    const dryRun = args.includes('--dry-run') || args.includes('-d');

    validateAndFixAll(language, dryRun).catch(console.error);
}

module.exports = { autoFixIndicator, processIndicatorFile, validateAndFixAll };
