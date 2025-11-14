// ============================================
// CPF FIELD KIT JSON VALIDATOR
// Version 1.0 - 2025-01-08
// ============================================

const CPF_SCHEMA_REQUIREMENTS = {
    required_root_fields: [
        'indicator', 'title', 'subtitle', 'category', 'version',
        'description', 'scoring', 'detection_formula', 'data_sources',
        'interdependencies', 'sections', 'validation', 'remediation',
        'risk_scenarios', 'metadata'
    ],
    required_sections: ['quick-assessment', 'client-conversation'],
    indicator_pattern: /^\d{1,2}\.\d{1,2}$/,
    valid_categories: [
        'Authority-Based Vulnerabilities',
        'Temporal Vulnerabilities',
        'Social Influence Vulnerabilities',
        'Affective Vulnerabilities',
        'Cognitive Overload Vulnerabilities',
        'Group Dynamic Vulnerabilities',
        'Stress Response Vulnerabilities',
        'Unconscious Process Vulnerabilities',
        'AI-Specific Bias Vulnerabilities',
        'Critical Convergent States'
    ]
};

function validateCPFJSON(jsonData) {
    const errors = [];
    const warnings = [];

    // Detect Bayesian network schema (used by 9.6-9.10)
    const isBayesianSchema = jsonData.hasOwnProperty('indicator_id') &&
                            jsonData.hasOwnProperty('quick_assessment') &&
                            !jsonData.hasOwnProperty('sections');

    if (isBayesianSchema) {
        // Alternative validation for Bayesian network schema
        const bayesianRequiredFields = ['indicator_id', 'indicator_name', 'category', 'description', 'metadata', 'quick_assessment'];
        bayesianRequiredFields.forEach(field => {
            if (!jsonData.hasOwnProperty(field)) {
                errors.push(`Missing required field: ${field}`);
            }
        });

        // Validate indicator_id format
        if (jsonData.indicator_id && !CPF_SCHEMA_REQUIREMENTS.indicator_pattern.test(jsonData.indicator_id)) {
            errors.push(`Invalid indicator_id format: ${jsonData.indicator_id}. Expected format: X.Y`);
        }

        // Validate category
        if (jsonData.category && !jsonData.category.match(/^\d\.x-[a-z]+$/)) {
            warnings.push(`Category format "${jsonData.category}" doesn't match expected pattern`);
        }

        // Validate quick_assessment structure
        if (jsonData.quick_assessment && jsonData.quick_assessment.questions) {
            const questions = jsonData.quick_assessment.questions;
            const weightSum = Object.values(questions).reduce((sum, q) => sum + (q.weight || 0), 0);
            if (Math.abs(weightSum - 1.0) > 0.01) {
                warnings.push(`Quick assessment question weights sum to ${weightSum.toFixed(3)}, expected ~1.0`);
            }
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            warnings: warnings,
            summary: {
                total_checks: 4,
                errors_found: errors.length,
                warnings_found: warnings.length,
                indicator: jsonData.indicator_id,
                category: jsonData.category,
                schema_type: 'bayesian'
            }
        };
    }

    // 1. Check root fields (standard schema)
    CPF_SCHEMA_REQUIREMENTS.required_root_fields.forEach(field => {
        if (!jsonData.hasOwnProperty(field)) {
            errors.push(`Missing required field: ${field}`);
        }
    });

    // 2. Validate indicator format
    if (jsonData.indicator && !CPF_SCHEMA_REQUIREMENTS.indicator_pattern.test(jsonData.indicator)) {
        errors.push(`Invalid indicator format: ${jsonData.indicator}. Expected format: X.Y`);
    }

    // 3. Validate category
    if (jsonData.category && !CPF_SCHEMA_REQUIREMENTS.valid_categories.includes(jsonData.category)) {
        warnings.push(`Category "${jsonData.category}" not in standard list`);
    }

    // 4. Validate scoring weights
    if (jsonData.scoring && jsonData.scoring.weights) {
        const weights = jsonData.scoring.weights;
        const weightSum = (weights.quick_assessment || 0) +
                         (weights.conversation_depth || 0) +
                         (weights.red_flags || 0);

        if (Math.abs(weightSum - 1.0) > 0.01) {
            errors.push(`Scoring weights must sum to 1.0. Current sum: ${weightSum.toFixed(3)}`);
        }
    }

    // 5. Validate question weights (quick assessment)
    if (jsonData.scoring && jsonData.scoring.question_weights) {
        const qWeights = Object.values(jsonData.scoring.question_weights);
        const qWeightSum = qWeights.reduce((a, b) => a + b, 0);

        if (Math.abs(qWeightSum - 1.0) > 0.01) {
            warnings.push(`Question weights sum to ${qWeightSum.toFixed(3)}, expected ~1.0`);
        }
    }

    // 6. Validate sections
    if (jsonData.sections) {
        const sectionIds = jsonData.sections.map(s => s.id);

        CPF_SCHEMA_REQUIREMENTS.required_sections.forEach(reqId => {
            if (!sectionIds.includes(reqId)) {
                errors.push(`Missing required section: ${reqId}`);
            }
        });

        // Validate quick-assessment
        const quickSection = jsonData.sections.find(s => s.id === 'quick-assessment');
        if (quickSection) {
            if (!quickSection.items || quickSection.items.length < 6) {
                warnings.push(`Quick assessment has only ${quickSection.items?.length || 0} questions. Recommended: 8-12`);
            }
            if (quickSection.items && quickSection.items.length > 15) {
                warnings.push(`Quick assessment has ${quickSection.items.length} questions. Recommended maximum: 12`);
            }

            // Validate each question
            quickSection.items?.forEach((item, idx) => {
                if (!item.id) errors.push(`Quick assessment question ${idx + 1} missing id`);
                if (!item.weight) warnings.push(`Question ${item.id} missing weight`);
                if (!item.options || item.options.length === 0) {
                    errors.push(`Question ${item.id} has no options`);
                }

                // Validate options have scores
                item.options?.forEach(opt => {
                    if (typeof opt.score === 'undefined') {
                        errors.push(`Option "${opt.label}" in ${item.id} missing score`);
                    }
                    if (opt.score < 0 || opt.score > 1) {
                        errors.push(`Option score must be 0-1. Got ${opt.score} in ${item.id}`);
                    }
                });
            });
        }

        // Validate client-conversation
        const convSection = jsonData.sections.find(s => s.id === 'client-conversation');
        if (convSection && convSection.subsections) {
            const hasRedFlags = convSection.subsections.some(sub =>
                sub.title === 'Probing for Red Flags'
            );
            if (!hasRedFlags) {
                warnings.push('Client conversation missing "Probing for Red Flags" subsection');
            }

            // Validate red flags total impact
            const redFlagsSection = convSection.subsections.find(sub =>
                sub.title === 'Probing for Red Flags'
            );
            if (redFlagsSection && redFlagsSection.items) {
                const totalImpact = redFlagsSection.items.reduce((sum, item) =>
                    sum + (item.score_impact || 0), 0
                );
                if (totalImpact > 1.0) {
                    errors.push(`Red flags total score_impact (${totalImpact.toFixed(2)}) exceeds 1.0`);
                }
            }
        }
    }

    // 7. Validate interdependencies
    if (jsonData.interdependencies) {
        const validateIndicatorRef = (ref) => {
            if (!CPF_SCHEMA_REQUIREMENTS.indicator_pattern.test(ref)) {
                errors.push(`Invalid indicator reference: ${ref}`);
            }
        };

        // Support both array format and object format for interdependencies
        const amplifiedBy = jsonData.interdependencies.amplified_by;
        if (amplifiedBy) {
            if (Array.isArray(amplifiedBy)) {
                // Array format (standard)
                amplifiedBy.forEach(dep => {
                    validateIndicatorRef(dep.indicator);
                    if (dep.probability && (dep.probability < 0 || dep.probability > 1)) {
                        errors.push(`Probability must be 0-1. Got ${dep.probability} for ${dep.indicator}`);
                    }
                    if (dep.factor && dep.factor < 1.0) {
                        warnings.push(`Amplification factor < 1.0 for ${dep.indicator}. Expected >= 1.0`);
                    }
                });
            } else if (typeof amplifiedBy === 'object' && amplifiedBy.indicators) {
                // Object format with Bayesian network (advanced format for 9.6-9.10)
                Object.keys(amplifiedBy.indicators).forEach(key => {
                    const indicatorId = key.replace('indicator_', '');
                    validateIndicatorRef(indicatorId);
                });
            }
        }

        const amplifies = jsonData.interdependencies.amplifies;
        if (amplifies) {
            if (Array.isArray(amplifies)) {
                // Array format (standard)
                amplifies.forEach(dep => {
                    validateIndicatorRef(dep.indicator);
                });
            } else if (typeof amplifies === 'object' && amplifies.indicators) {
                // Object format with Bayesian network
                Object.keys(amplifies.indicators).forEach(key => {
                    const indicatorId = key.replace('indicator_', '');
                    validateIndicatorRef(indicatorId);
                });
            }
        }
    }

    // 8. Validate detection formulas syntax
    if (jsonData.detection_formula && jsonData.detection_formula.mathematical_model) {
        const model = jsonData.detection_formula.mathematical_model;

        if (!model.primary) {
            errors.push('Missing primary detection formula');
        }

        if (model.default_weights) {
            const dWeights = Object.values(model.default_weights);
            const dWeightSum = dWeights.reduce((a, b) => a + b, 0);
            if (Math.abs(dWeightSum - 1.0) > 0.01) {
                errors.push(`Detection formula weights sum to ${dWeightSum.toFixed(3)}, expected 1.0`);
            }
        }

        // Check for common placeholder patterns
        const formulaStr = JSON.stringify(model);
        if (formulaStr.includes('[TODO]') || formulaStr.includes('{X}') || formulaStr.includes('[EXAMPLE]')) {
            errors.push('Detection formula contains unresolved placeholders');
        }
    }

    // 9. Validate remediation solutions
    if (jsonData.remediation && jsonData.remediation.solutions) {
        jsonData.remediation.solutions.forEach(sol => {
            if (!sol.id) errors.push('Remediation solution missing id');
            if (!sol.title) errors.push(`Solution ${sol.id} missing title`);
            if (!sol.effort || !['low', 'medium', 'high'].includes(sol.effort)) {
                warnings.push(`Solution ${sol.id} has invalid effort level: ${sol.effort}`);
            }
        });
    }

    // 10. Check for common typos/mistakes
    const jsonStr = JSON.stringify(jsonData);
    const commonTypos = [
        { pattern: /indicatro/gi, correct: 'indicator' },
        { pattern: /assesment/gi, correct: 'assessment' },
        { pattern: /vulnrability/gi, correct: 'vulnerability' },
        { pattern: /organizaton/gi, correct: 'organization' }
    ];

    commonTypos.forEach(typo => {
        if (typo.pattern.test(jsonStr)) {
            warnings.push(`Possible typo detected: "${typo.pattern.source}" (should be "${typo.correct}")`);
        }
    });

    return {
        valid: errors.length === 0,
        errors: errors,
        warnings: warnings,
        summary: {
            total_checks: 10,
            errors_found: errors.length,
            warnings_found: warnings.length,
            indicator: jsonData.indicator,
            category: jsonData.category
        }
    };
}

// Console validation function
function validateJSONFile(jsonData) {
    console.log('🔍 CPF JSON Validator Starting...\n');

    const result = validateCPFJSON(jsonData);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 VALIDATION SUMMARY`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Indicator: ${result.summary.indicator}`);
    console.log(`Category: ${result.summary.category}`);
    console.log(`Status: ${result.valid ? '✅ VALID' : '❌ INVALID'}`);
    console.log(`Errors: ${result.summary.errors_found}`);
    console.log(`Warnings: ${result.summary.warnings_found}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (result.errors.length > 0) {
        console.log('❌ ERRORS:');
        result.errors.forEach((err, idx) => {
            console.log(`  ${idx + 1}. ${err}`);
        });
        console.log('');
    }

    if (result.warnings.length > 0) {
        console.log('⚠️  WARNINGS:');
        result.warnings.forEach((warn, idx) => {
            console.log(`  ${idx + 1}. ${warn}`);
        });
        console.log('');
    }

    if (result.valid && result.warnings.length === 0) {
        console.log('✅ Perfect! JSON is fully valid with no warnings.');
    }

    return result;
}

// Browser usage - integrate into CPF Field Kit Client
if (typeof window !== 'undefined') {
    window.validateCPFJSON = validateCPFJSON;
    window.validateJSONFile = validateJSONFile;
}

// Node.js usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { validateCPFJSON, validateJSONFile };
}
