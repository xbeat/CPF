#!/usr/bin/env node
/**
 * Convert Bayesian 9.6-9.10 indicators to standard format
 */

const fs = require('fs');
const path = require('path');

const BASE_PATH = './auditor field kit/interactive';
const LANGUAGES = ['en-US', 'it-IT'];

function convertBayesianToStandard(json) {
    // Convert indicator_id to indicator
    const indicator = json.indicator_id;

    // Create sections array
    const sections = [];

    // Section 1: Quick Assessment
    const quickAssessmentSection = {
        id: "quick-assessment",
        title: `Quick Assessment - ${json.indicator_name}`,
        icon: "🎯",
        time: "15-20",
        items: [],
        subsections: []
    };

    // Convert quick_assessment questions to items
    if (json.quick_assessment && json.quick_assessment.questions) {
        Object.entries(json.quick_assessment.questions).forEach(([key, q]) => {
            const item = {
                type: "radio-group",
                number: `Q${quickAssessmentSection.items.length + 1}`,
                title: q.question,
                options: [
                    {
                        value: "green",
                        label: q.scoring.green,
                        score: 0
                    },
                    {
                        value: "yellow",
                        label: q.scoring.yellow,
                        score: 0.5
                    },
                    {
                        value: "red",
                        label: q.scoring.red,
                        score: 1
                    }
                ]
            };
            quickAssessmentSection.items.push(item);
        });
    }

    sections.push(quickAssessmentSection);

    // Section 2: Client Conversation (placeholder)
    sections.push({
        id: "client-conversation",
        title: "Client Conversation Guide",
        icon: "💬",
        time: "25-35",
        items: [],
        subsections: []
    });

    // Create standard structure
    return {
        indicator: indicator,
        title: `INDICATOR ${indicator} FIELD KIT`,
        subtitle: json.indicator_name,
        category: json.category_name || json.category,
        version: json.metadata?.version || "1.0",
        cpf_reference: `CPF v1.0 - Category ${indicator.split('.')[0]}.x`,
        description: {
            short: json.description.substring(0, 300) + "...",
            context: json.description,
            impact: "See full Bayesian indicator documentation for detailed impact analysis.",
            psychological_basis: "See full Bayesian indicator documentation for psychological foundations."
        },
        scoring: json.scoring || {
            method: "bayesian_weighted",
            weights: {
                quick_assessment: 0.4,
                conversation_depth: 0.35,
                red_flags: 0.25
            }
        },
        sections: sections,
        data_sources: json.data_sources || [],
        validation: json.validation || {},
        remediation: json.remediation || {}
    };
}

let fixed = 0;

LANGUAGES.forEach(lang => {
    console.log(`\nConverting ${lang} Bayesian indicators 9.6-9.10...`);

    for (let i = 6; i <= 10; i++) {
        const filePath = path.join(BASE_PATH, lang, '9.x-ai', `indicator_9.${i}.json`);

        if (!fs.existsSync(filePath)) {
            console.log(`  9.${i}: FILE NOT FOUND`);
            continue;
        }

        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const json = JSON.parse(content);

            // Check if it's Bayesian format
            if (json.indicator_id && json.quick_assessment && !json.sections) {
                const converted = convertBayesianToStandard(json);
                fs.writeFileSync(filePath, JSON.stringify(converted, null, 2), 'utf8');
                console.log(`  9.${i}: ✅ CONVERTED`);
                fixed++;
            } else {
                console.log(`  9.${i}: ⚪ Already standard format`);
            }

        } catch (error) {
            console.log(`  9.${i}: ❌ ERROR - ${error.message}`);
        }
    }
});

console.log(`\n✅ Converted ${fixed} indicators`);
