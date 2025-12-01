import { currentData } from './state.js';
import { updateScoreDisplay } from './render.js';

export let currentScore = {
    quick_assessment: 0,
    conversation_depth: 0,
    red_flags: 0,
    final_score: 0,
    maturity_level: 'green',
    details: {}
};

export function resetCurrentScore() {
    currentScore = {
        quick_assessment: 0,
        conversation_depth: 0,
        red_flags: 0,
        final_score: 0,
        maturity_level: 'green',
        details: {}
    };
}

export function calculateIndicatorScore() {
    if (!currentData.fieldKit || !currentData.fieldKit.scoring) {
        console.warn('⚠️ No field kit loaded or scoring configuration missing');
        return;
    }

    const scoring = currentData.fieldKit.scoring;
    const sections = currentData.fieldKit.sections;

    if (!sections || !Array.isArray(sections) || sections.length === 0) {
        console.error('❌ CRITICAL: sections is empty or not an array!');
        return;
    }

    // Reset local score calculation object
    let tempScore = {
        quick_assessment: 0,
        conversation_depth: 0,
        red_flags: 0,
        final_score: 0,
        maturity_level: 'green',
        details: {
            quick_assessment_breakdown: [],
            conversation_breakdown: {
                total_questions: 0,
                answered_questions: 0,
                completion_rate: 0,
                is_informational: true
            },
            red_flags_list: []
        }
    };

    // 1. CALCULATE QUICK ASSESSMENT SCORE
    const quickSection = sections.find(s => s.id === 'quick-assessment');
    if (quickSection && quickSection.items) {
        let totalWeight = 0;
        let weightedScore = 0;

        quickSection.items.forEach((item, idx) => {
            const itemId = item.id || `s0_i${idx}`;
            const response = currentData.responses[itemId];
            
            if (response && item.options) {
                const selectedOption = item.options.find(opt => opt.value === response);
                if (selectedOption && typeof selectedOption.score !== 'undefined') {
                    const weight = scoring.question_weights?.[item.id] || item.weight || (1 / quickSection.items.length);
                    weightedScore += selectedOption.score * weight;
                    totalWeight += weight;
                    
                    tempScore.details.quick_assessment_breakdown.push({
                        question: item.title,
                        response: selectedOption.label,
                        score: selectedOption.score,
                        weight: weight,
                        weighted_score: selectedOption.score * weight
                    });
                }
            }
        });

        tempScore.quick_assessment = totalWeight > 0 ? weightedScore / totalWeight : 0;
    }

    // 2. TRACK CONVERSATION COMPLETENESS
    let convSectionIndex = sections.findIndex(s => s.id === 'client-conversation');
    if (convSectionIndex < 0) convSectionIndex = sections.findIndex(s => s.type === 'conversation');
    
    // ... logic for finding section fallback ...
    if (convSectionIndex < 0) {
         convSectionIndex = sections.findIndex(s =>
            s.title && (s.title.toLowerCase().includes('conversation') || s.title.toLowerCase().includes('client'))
        );
    }

    const convSection = convSectionIndex >= 0 ? sections[convSectionIndex] : null;

    if (convSection) {
        let totalQuestions = 0;
        let answeredQuestions = 0;

        const processItems = (items, baseId) => {
            if (!items || !Array.isArray(items)) return;
            items.forEach((item, iIdx) => {
                if (item.type === 'question') {
                    const itemId = item.id || `${baseId}_i${iIdx}`;
                    const followups = item.followups || item.followup || [];
                    if (Array.isArray(followups) && followups.length > 0) {
                        followups.forEach((followup, fIdx) => {
                            totalQuestions++;
                            const followupId = `${itemId}_f${fIdx}`;
                            const followupResponse = currentData.responses[followupId];
                            if (followupResponse && String(followupResponse).trim().length > 0) {
                                answeredQuestions++;
                            }
                        });
                    }
                }
            });
        };

        if (convSection.subsections) {
            convSection.subsections.forEach((subsection, subIdx) => {
                if (subsection.items) processItems(subsection.items, `s${convSectionIndex}_sub${subIdx}`);
            });
        }
        if (convSection.items) {
            processItems(convSection.items, `s${convSectionIndex}`);
        }

        tempScore.conversation_depth = 0;
        tempScore.details.conversation_breakdown = {
            total_questions: totalQuestions,
            answered_questions: answeredQuestions,
            completion_rate: totalQuestions > 0 ? answeredQuestions / totalQuestions : 0,
            is_informational: true
        };
    }

    // 3. CALCULATE RED FLAGS SCORE
    let redFlagsItems = [];
    sections.forEach((section) => {
        if (section.items) section.items.forEach(item => { if (item.severity) redFlagsItems.push(item); });
        if (section.subsections) section.subsections.forEach(sub => {
            if (sub.items) sub.items.forEach(item => { if (item.severity) redFlagsItems.push(item); });
        });
    });

    if (redFlagsItems.length > 0) {
        let totalRedFlagImpact = 0;
        redFlagsItems.forEach((item) => {
            const itemId = item.id;
            if (!itemId) return;
            const isChecked = currentData.responses[itemId];
            const impact = item.score_impact || item.weight || 0;

            if (isChecked && impact > 0) {
                totalRedFlagImpact += impact;
                tempScore.details.red_flags_list.push({
                    flag: item.label || item.title || item.description,
                    impact: impact
                });
            }
        });
        tempScore.red_flags = Math.min(totalRedFlagImpact, 1);
    }

    // 4. FINAL SCORE
    const QUICK_WEIGHT = 0.70;
    const RED_FLAGS_WEIGHT = 0.30;
    tempScore.final_score = (tempScore.quick_assessment * QUICK_WEIGHT + tempScore.red_flags * RED_FLAGS_WEIGHT);
    
    // Save weights for display
    tempScore.weights_used = { quick_assessment: QUICK_WEIGHT, red_flags: RED_FLAGS_WEIGHT, conversation_depth: 0 };

    // 5. MATURITY LEVEL
    const maturityLevels = scoring.maturity_levels;
    if (tempScore.final_score <= maturityLevels.green.score_range[1]) tempScore.maturity_level = 'green';
    else if (tempScore.final_score <= maturityLevels.yellow.score_range[1]) tempScore.maturity_level = 'yellow';
    else tempScore.maturity_level = 'red';

    // Update global object
    Object.assign(currentScore, tempScore);
    
    // Update UI
    updateScoreDisplay();

    // Save score to currentData
    currentData.score = currentScore;
    
    // Window global per compatibilità backward se necessario
    window.currentScore = currentScore; 
}