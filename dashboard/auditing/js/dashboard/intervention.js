/**
 * CPIF Intervention Tab - Cybersecurity Psychology Intervention Framework
 *
 * This module implements the CPIF meta-model for designing, implementing,
 * and evaluating interventions targeting psychologically-rooted security vulnerabilities.
 *
 * Based on the paper: "The Cybersecurity Psychology Intervention Framework:
 * A Meta-Model for Addressing Human Vulnerabilities in Security Systems"
 *
 * Features:
 * - Readiness Assessment Dashboard
 * - Vulnerability-Intervention Matching Matrix
 * - Intervention Planner with 6 CPIF Phases
 * - Resistance Tracker
 * - Verification Cycle (Pre/Post Assessment Comparison)
 */

import { getSelectedOrgData, getSelectedOrgId } from './state.js';

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

/**
 * CPIF 6 Phases as defined in the paper
 */
const CPIF_PHASES = {
    1: {
        id: 'readiness',
        name: 'Readiness Assessment',
        icon: '🎯',
        description: 'Evaluate organizational readiness for change across multiple dimensions',
        dimensions: ['change_history', 'leadership_alignment', 'resource_availability', 'competing_priorities', 'psychological_readiness']
    },
    2: {
        id: 'matching',
        name: 'Vulnerability-Intervention Matching',
        icon: '🔗',
        description: 'Link identified vulnerabilities to appropriate intervention classes',
        dimensions: ['vulnerability_analysis', 'intervention_selection', 'approach_design']
    },
    3: {
        id: 'design',
        name: 'Intervention Design',
        icon: '📐',
        description: 'Design context-appropriate interventions with proper scope and intensity',
        dimensions: ['scope', 'intensity', 'phasing', 'integration', 'governance']
    },
    4: {
        id: 'implementation',
        name: 'Implementation',
        icon: '🚀',
        description: 'Execute interventions through pilot programs and phased rollout',
        dimensions: ['communication', 'pilot', 'rollout', 'support', 'adjustment']
    },
    5: {
        id: 'resistance',
        name: 'Resistance Navigation',
        icon: '🧭',
        description: 'Identify, analyze, and respond to organizational resistance',
        dimensions: ['identification', 'analysis', 'response', 'transformation']
    },
    6: {
        id: 'verification',
        name: 'Verification & Integration',
        icon: '✅',
        description: 'Verify intervention effects and integrate into ongoing operations',
        dimensions: ['post_assessment', 'outcome_evaluation', 'process_evaluation', 'integration', 'sustainment']
    }
};

/**
 * Transtheoretical Model Stages (Prochaska & DiClemente)
 * Used for readiness assessment
 */
const READINESS_STAGES = {
    precontemplation: {
        level: 0,
        name: 'Precontemplation',
        description: 'Not considering change',
        color: '#dc2626',
        interventions: ['awareness_building', 'disconfirmation']
    },
    contemplation: {
        level: 1,
        name: 'Contemplation',
        description: 'Considering but not committed',
        color: '#ea580c',
        interventions: ['information_provision', 'decision_support']
    },
    preparation: {
        level: 2,
        name: 'Preparation',
        description: 'Committed and planning',
        color: '#f59e0b',
        interventions: ['action_planning', 'resource_allocation']
    },
    action: {
        level: 3,
        name: 'Action',
        description: 'Actively changing',
        color: '#84cc16',
        interventions: ['implementation_support', 'feedback_systems']
    },
    maintenance: {
        level: 4,
        name: 'Maintenance',
        description: 'Sustaining change',
        color: '#22c55e',
        interventions: ['reinforcement', 'relapse_prevention']
    }
};

/**
 * Intervention Classes by CPF Category
 * Based on Section 4.2 of the CPIF paper
 */
const INTERVENTION_CLASSES = {
    '1': {
        name: 'Authority-Based Vulnerabilities',
        approaches: [
            { id: 'structural_friction', name: 'Structural Friction', desc: 'Introduce verification steps for authority-based requests', effort: 'medium', impact: 'high' },
            { id: 'authority_distribution', name: 'Authority Distribution', desc: 'Distribute authority across multiple parties', effort: 'high', impact: 'high' },
            { id: 'recognition_training', name: 'Recognition Training', desc: 'Train to recognize authority manipulation techniques', effort: 'low', impact: 'medium' },
            { id: 'questioning_culture', name: 'Questioning Culture', desc: 'Legitimize questioning authority and upward reporting', effort: 'high', impact: 'high' }
        ]
    },
    '2': {
        name: 'Temporal Vulnerabilities',
        approaches: [
            { id: 'workload_management', name: 'Workload Management', desc: 'Reduce frequency of time-pressure situations', effort: 'medium', impact: 'high' },
            { id: 'early_security', name: 'Early Security Integration', desc: 'Build security into earlier workflow stages', effort: 'medium', impact: 'high' },
            { id: 'decision_support', name: 'Decision Support Tools', desc: 'Scaffold appropriate response under time pressure', effort: 'low', impact: 'medium' },
            { id: 'deadline_flexibility', name: 'Deadline Flexibility Culture', desc: 'Make it acceptable to request extensions for security', effort: 'medium', impact: 'medium' }
        ]
    },
    '3': {
        name: 'Social Influence Vulnerabilities',
        approaches: [
            { id: 'influence_awareness', name: 'Influence Awareness Training', desc: 'Train on specific influence techniques', effort: 'low', impact: 'medium' },
            { id: 'verification_safeguards', name: 'Verification Safeguards', desc: 'Prevent influence-based requests without verification', effort: 'medium', impact: 'high' },
            { id: 'peer_support', name: 'Peer Support Systems', desc: 'Provide social proof for security-conscious behavior', effort: 'medium', impact: 'high' },
            { id: 'norm_intervention', name: 'Group Norm Intervention', desc: 'Establish security-supporting group norms', effort: 'high', impact: 'high' }
        ]
    },
    '4': {
        name: 'Affective Vulnerabilities',
        approaches: [
            { id: 'stress_management', name: 'Stress Management Programs', desc: 'Reduce frequency and intensity of negative emotional states', effort: 'medium', impact: 'medium' },
            { id: 'cooling_off', name: 'Cooling-Off Periods', desc: 'Delay consequential decisions during high-emotion periods', effort: 'low', impact: 'high' },
            { id: 'emotional_support', name: 'Emotional Support Systems', desc: 'Provide resources during difficult periods', effort: 'medium', impact: 'medium' },
            { id: 'regulation_training', name: 'Emotional Regulation Training', desc: 'Build awareness of emotion-behavior links', effort: 'medium', impact: 'medium' }
        ]
    },
    '5': {
        name: 'Cognitive Overload Vulnerabilities',
        approaches: [
            { id: 'tool_consolidation', name: 'Tool Consolidation', desc: 'Reduce cognitive demands through interface redesign', effort: 'high', impact: 'high' },
            { id: 'workflow_modification', name: 'Workflow Modification', desc: 'Distribute cognitive load more evenly', effort: 'medium', impact: 'high' },
            { id: 'role_redesign', name: 'Role Redesign', desc: 'Align responsibilities with cognitive capabilities', effort: 'high', impact: 'high' },
            { id: 'automation', name: 'Automation', desc: 'Automate routine security decisions', effort: 'high', impact: 'high' }
        ]
    },
    '6': {
        name: 'Group Dynamic Vulnerabilities',
        approaches: [
            { id: 'team_composition', name: 'Team Composition', desc: 'Modify team makeup to disrupt problematic dynamics', effort: 'high', impact: 'high' },
            { id: 'facilitated_processes', name: 'Facilitated Processes', desc: 'Surface unconscious group assumptions', effort: 'medium', impact: 'high' },
            { id: 'leadership_modeling', name: 'Leadership Modeling', desc: 'Leaders model alternative group functioning', effort: 'medium', impact: 'high' },
            { id: 'boundary_changes', name: 'Structural Boundary Changes', desc: 'Modify group boundaries and interaction patterns', effort: 'high', impact: 'medium' }
        ]
    },
    '7': {
        name: 'Stress Response Vulnerabilities',
        approaches: [
            { id: 'source_reduction', name: 'Source Reduction', desc: 'Reduce stress through workload and environmental modification', effort: 'medium', impact: 'high' },
            { id: 'individual_training', name: 'Individual Stress Training', desc: 'Personal stress management skills development', effort: 'low', impact: 'medium' },
            { id: 'degradation_design', name: 'Degradation-Aware Design', desc: 'Account for stress-related capability reduction', effort: 'medium', impact: 'high' },
            { id: 'recovery_support', name: 'Recovery Support', desc: 'Enable effective functioning after stress episodes', effort: 'medium', impact: 'medium' }
        ]
    },
    '8': {
        name: 'Unconscious Process Vulnerabilities',
        approaches: [
            { id: 'org_consultation', name: 'Organizational Consultation', desc: 'Surface unconscious dynamics for examination', effort: 'high', impact: 'high' },
            { id: 'reflective_practice', name: 'Reflective Practices', desc: 'Build awareness of previously unconscious patterns', effort: 'medium', impact: 'medium' },
            { id: 'symbolic_intervention', name: 'Symbolic Environment Modification', desc: 'Modify the symbolic context of unconscious processes', effort: 'medium', impact: 'medium' },
            { id: 'defense_analysis', name: 'Defense Mechanism Analysis', desc: 'Understand and work with psychological defenses', effort: 'high', impact: 'high' }
        ]
    },
    '9': {
        name: 'AI-Specific Vulnerabilities',
        approaches: [
            { id: 'interface_design', name: 'Interface Design', desc: 'Counteract automation bias and inappropriate trust', effort: 'medium', impact: 'high' },
            { id: 'ai_literacy', name: 'AI Literacy Training', desc: 'Train on AI capabilities and limitations', effort: 'low', impact: 'medium' },
            { id: 'verification_requirements', name: 'Human Verification Requirements', desc: 'Require human verification of AI recommendations', effort: 'medium', impact: 'high' },
            { id: 'trust_calibration', name: 'Trust Calibration Systems', desc: 'Reveal AI errors to calibrate trust appropriately', effort: 'medium', impact: 'high' }
        ]
    },
    '10': {
        name: 'Convergent State Vulnerabilities',
        approaches: [
            { id: 'early_disruption', name: 'Early Disruption', desc: 'Address component vulnerabilities before they combine', effort: 'medium', impact: 'high' },
            { id: 'convergence_monitoring', name: 'Convergence Monitoring', desc: 'Monitor for convergence indicators that trigger defenses', effort: 'medium', impact: 'high' },
            { id: 'resilience_building', name: 'Resilience Building', desc: 'Build organizational resilience for convergent events', effort: 'high', impact: 'high' },
            { id: 'crisis_protocols', name: 'Crisis Response Protocols', desc: 'Prepare response procedures for convergent states', effort: 'medium', impact: 'medium' }
        ]
    }
};

/**
 * Resistance Sources (from Section 5 of CPIF paper)
 */
const RESISTANCE_SOURCES = {
    defense_mechanism: {
        name: 'Individual Defense Mechanisms',
        description: 'Psychological protection of existing patterns',
        approach: 'Create psychological safety while gradually introducing disconfirmation',
        signals: ['avoidance', 'rationalization', 'denial', 'projection']
    },
    basic_assumption: {
        name: 'Group Basic Assumptions',
        description: 'Unconscious group-level defensive formations (Bion)',
        approach: 'Offer interpretations that make group dynamics visible',
        signals: ['dependency_behavior', 'fight_flight', 'pairing_fantasies']
    },
    social_defense: {
        name: 'Organizational Social Defenses',
        description: 'Structures serving anxiety-management functions (Menzies Lyth)',
        approach: 'Address underlying anxiety before modifying defensive structures',
        signals: ['rigid_procedures', 'blame_shifting', 'ritual_behavior']
    },
    cultural: {
        name: 'Cultural Assumptions',
        description: 'Deep underlying assumptions being challenged',
        approach: 'Extended engagement with gradual assumption shift',
        signals: ['value_conflicts', 'identity_threats', 'meaning_disruption']
    },
    political: {
        name: 'Political Interests',
        description: 'Power, status, or resource dependencies threatened',
        approach: 'Negotiate interests rather than positions',
        signals: ['coalition_building', 'resource_hoarding', 'information_control']
    }
};

// ============================================================================
// STATE
// ============================================================================

let interventionState = {
    selectedPhase: null,
    selectedCategory: null,
    interventions: [],
    resistanceSignals: [],
    comparisonMode: false
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate overall readiness score based on organization data
 */
function calculateReadinessScore(orgData) {
    if (!orgData || !orgData.aggregates) {
        return { score: 0, stage: 'precontemplation', dimensions: {} };
    }

    const agg = orgData.aggregates;
    const categories = agg.by_category || {};

    // Calculate dimension scores
    const dimensions = {
        change_history: 0.5, // Default - would come from org history
        leadership_alignment: 0.6, // Default - would come from leadership assessment
        resource_availability: 0.5, // Default
        competing_priorities: 0.4, // Default
        psychological_readiness: 0 // Calculated from CPF data
    };

    // Psychological readiness based on assessment completion and scores
    const totalIndicators = 100;
    const assessedCount = Object.keys(orgData.assessments || {}).length;
    const completionRate = assessedCount / totalIndicators;

    // Average vulnerability score (inverted for readiness)
    let avgScore = 0.5;
    let scoreCount = 0;
    Object.values(categories).forEach(cat => {
        if (cat && cat.avg_score !== undefined) {
            avgScore += (1 - cat.avg_score);
            scoreCount++;
        }
    });
    if (scoreCount > 0) avgScore = avgScore / scoreCount;

    dimensions.psychological_readiness = (completionRate * 0.4) + (avgScore * 0.6);

    // Overall score
    const weights = {
        change_history: 0.15,
        leadership_alignment: 0.25,
        resource_availability: 0.20,
        competing_priorities: 0.15,
        psychological_readiness: 0.25
    };

    let overallScore = 0;
    Object.entries(dimensions).forEach(([dim, value]) => {
        overallScore += value * weights[dim];
    });

    // Determine stage
    let stage = 'precontemplation';
    if (overallScore >= 0.8) stage = 'maintenance';
    else if (overallScore >= 0.6) stage = 'action';
    else if (overallScore >= 0.4) stage = 'preparation';
    else if (overallScore >= 0.2) stage = 'contemplation';

    return { score: overallScore, stage, dimensions };
}

/**
 * Calculate intervention matching based on vulnerability scores
 */
function calculateInterventionMatching(orgData) {
    if (!orgData || !orgData.aggregates) return [];

    const categories = orgData.aggregates.by_category || {};
    const matches = [];

    Object.entries(categories).forEach(([catId, catData]) => {
        if (!catData) return;

        const interventionClass = INTERVENTION_CLASSES[catId];
        if (!interventionClass) return;

        const riskLevel = catData.avg_score || 0;
        const priority = riskLevel > 0.66 ? 'critical' : riskLevel > 0.33 ? 'high' : 'normal';

        // Select recommended approaches based on risk level and context
        const recommendedApproaches = interventionClass.approaches
            .filter(a => {
                if (priority === 'critical') return a.impact === 'high';
                if (priority === 'high') return a.impact === 'high' || a.impact === 'medium';
                return true;
            })
            .slice(0, 3);

        matches.push({
            categoryId: catId,
            categoryName: interventionClass.name,
            riskLevel,
            priority,
            completion: catData.completion_percentage || 0,
            confidence: catData.avg_confidence || 0,
            recommendedApproaches,
            allApproaches: interventionClass.approaches
        });
    });

    // Sort by priority
    const priorityOrder = { critical: 0, high: 1, normal: 2 };
    matches.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return matches;
}

/**
 * Detect potential resistance signals from organization data
 */
function detectResistanceSignals(orgData) {
    if (!orgData) return [];

    const signals = [];
    const categories = orgData.aggregates?.by_category || {};

    // Check for assessment gaps (potential avoidance)
    Object.entries(categories).forEach(([catId, catData]) => {
        if (!catData) return;

        if (catData.completion_percentage < 30 && catData.avg_score > 0.5) {
            signals.push({
                type: 'defense_mechanism',
                signal: 'avoidance',
                category: catId,
                description: `Low completion (${catData.completion_percentage.toFixed(0)}%) with elevated risk suggests potential avoidance`,
                severity: 'medium'
            });
        }
    });

    // Check for inconsistent scoring (potential rationalization)
    const scores = Object.values(categories).map(c => c?.avg_score || 0).filter(s => s > 0);
    if (scores.length > 3) {
        const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
        const variance = scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length;

        if (variance > 0.15) {
            signals.push({
                type: 'social_defense',
                signal: 'blame_shifting',
                description: 'High variance across categories may indicate selective focus or blame shifting',
                severity: 'low'
            });
        }
    }

    // Check for convergent vulnerabilities (crisis potential)
    const highRiskCategories = Object.entries(categories)
        .filter(([_, data]) => data && data.avg_score > 0.66)
        .map(([id, _]) => id);

    if (highRiskCategories.length >= 3) {
        signals.push({
            type: 'basic_assumption',
            signal: 'fight_flight',
            description: `${highRiskCategories.length} categories in high-risk state may trigger fight-flight group dynamics`,
            severity: 'high'
        });
    }

    return signals;
}

/**
 * Calculate convergence index for verification
 */
function calculateConvergenceIndex(orgData) {
    if (!orgData || !orgData.aggregates) return 0;

    const categories = orgData.aggregates.by_category || {};
    const highRiskIndicators = [];

    Object.entries(categories).forEach(([catId, catData]) => {
        if (catData && catData.avg_score > 0.5) {
            highRiskIndicators.push(1 + catData.avg_score);
        }
    });

    if (highRiskIndicators.length === 0) return 1;

    return highRiskIndicators.reduce((acc, val) => acc * val, 1);
}

// ============================================================================
// RENDER FUNCTIONS
// ============================================================================

/**
 * Main render function for the Intervention tab
 */
export function renderInterventionTab() {
    const container = document.getElementById('interventionTab');
    if (!container) {
        console.error('❌ interventionTab container not found');
        return;
    }

    const orgData = getSelectedOrgData();

    if (!orgData) {
        container.innerHTML = `
            <div class="intervention-empty-state">
                <div class="empty-state-icon">🩺</div>
                <h3 data-i18n="intervention.empty.title">No Organization Selected</h3>
                <p data-i18n="intervention.empty.subtitle">Select an organization to view intervention planning and recommendations.</p>
            </div>
        `;
        return;
    }

    // Calculate all necessary data
    const readiness = calculateReadinessScore(orgData);
    const matches = calculateInterventionMatching(orgData);
    const resistanceSignals = detectResistanceSignals(orgData);
    const convergenceIndex = calculateConvergenceIndex(orgData);

    container.innerHTML = `
        <!-- CPIF Overview Header -->
        <div class="intervention-header">
            <div class="intervention-header-content">
                <h3 class="matrix-title" data-i18n="intervention.title">🩺 CPIF Intervention Framework</h3>
                <p class="intervention-subtitle" data-i18n="intervention.subtitle">
                    Systematic methodology for designing and implementing psychological security interventions
                </p>
            </div>
            <div class="intervention-header-stats">
                <div class="header-stat">
                    <div class="header-stat-value" style="color: ${READINESS_STAGES[readiness.stage].color}">${(readiness.score * 100).toFixed(0)}%</div>
                    <div class="header-stat-label" data-i18n="intervention.readiness-score">Readiness Score</div>
                </div>
                <div class="header-stat">
                    <div class="header-stat-value">${matches.filter(m => m.priority === 'critical').length}</div>
                    <div class="header-stat-label" data-i18n="intervention.critical-areas">Critical Areas</div>
                </div>
                <div class="header-stat">
                    <div class="header-stat-value" style="color: ${resistanceSignals.length > 2 ? 'var(--danger)' : resistanceSignals.length > 0 ? 'var(--warning)' : 'var(--success)'}">${resistanceSignals.length}</div>
                    <div class="header-stat-label" data-i18n="intervention.resistance-signals">Resistance Signals</div>
                </div>
            </div>
        </div>

        <!-- CPIF Phase Navigation -->
        <div class="cpif-phases-nav">
            ${Object.entries(CPIF_PHASES).map(([num, phase]) => `
                <div class="cpif-phase-card ${interventionState.selectedPhase === phase.id ? 'active' : ''}"
                     data-action="select-cpif-phase" data-phase="${phase.id}">
                    <div class="phase-icon">${phase.icon}</div>
                    <div class="phase-num">Phase ${num}</div>
                    <div class="phase-name">${phase.name}</div>
                </div>
            `).join('')}
        </div>

        <!-- Main Content Grid -->
        <div class="intervention-grid">
            <!-- Left Column: Readiness & Matching -->
            <div class="intervention-column">
                ${renderReadinessSection(readiness, orgData)}
                ${renderMatchingSection(matches)}
            </div>

            <!-- Right Column: Resistance & Verification -->
            <div class="intervention-column">
                ${renderResistanceSection(resistanceSignals)}
                ${renderVerificationSection(orgData, convergenceIndex)}
            </div>
        </div>

        <!-- Intervention Planner (Full Width) -->
        ${renderInterventionPlanner(matches, readiness)}
    `;

    // Re-apply translations if i18n is available
    if (typeof applyTranslations === 'function') {
        applyTranslations();
    }
}

/**
 * Render Readiness Assessment Section
 */
function renderReadinessSection(readiness, orgData) {
    const stage = READINESS_STAGES[readiness.stage];

    const dimensionLabels = {
        change_history: { name: 'Change History', icon: '📜' },
        leadership_alignment: { name: 'Leadership Alignment', icon: '👔' },
        resource_availability: { name: 'Resource Availability', icon: '💰' },
        competing_priorities: { name: 'Competing Priorities', icon: '⚖️' },
        psychological_readiness: { name: 'Psychological Readiness', icon: '🧠' }
    };

    return `
        <div class="intervention-section">
            <div class="section-header-row">
                <h4 class="section-title-intervention">
                    <span class="section-icon">🎯</span>
                    <span data-i18n="intervention.readiness.title">Phase 1: Readiness Assessment</span>
                </h4>
            </div>

            <!-- Stage Badge -->
            <div class="readiness-stage-display">
                <div class="stage-badge" style="background: ${stage.color}">
                    <div class="stage-level">Stage ${stage.level + 1}</div>
                    <div class="stage-name">${stage.name}</div>
                </div>
                <div class="stage-description">
                    <p>${stage.description}</p>
                    <div class="stage-interventions">
                        <strong data-i18n="intervention.readiness.recommended">Recommended:</strong>
                        ${stage.interventions.map(i => `<span class="intervention-tag">${i.replace(/_/g, ' ')}</span>`).join('')}
                    </div>
                </div>
            </div>

            <!-- Dimension Bars -->
            <div class="readiness-dimensions">
                ${Object.entries(readiness.dimensions).map(([dim, value]) => {
                    const dimInfo = dimensionLabels[dim];
                    const barColor = value >= 0.6 ? 'var(--success)' : value >= 0.4 ? 'var(--warning)' : 'var(--danger)';
                    return `
                        <div class="dimension-row">
                            <div class="dimension-label">
                                <span class="dimension-icon">${dimInfo.icon}</span>
                                <span>${dimInfo.name}</span>
                            </div>
                            <div class="dimension-bar-container">
                                <div class="dimension-bar" style="width: ${value * 100}%; background: ${barColor}"></div>
                            </div>
                            <div class="dimension-value">${(value * 100).toFixed(0)}%</div>
                        </div>
                    `;
                }).join('')}
            </div>

            <!-- Readiness Gauge -->
            <div class="readiness-gauge">
                <div class="gauge-track">
                    ${Object.entries(READINESS_STAGES).map(([key, s]) => `
                        <div class="gauge-segment ${readiness.stage === key ? 'active' : ''}"
                             style="background: ${s.color}; opacity: ${readiness.stage === key ? 1 : 0.3}"
                             title="${s.name}: ${s.description}">
                        </div>
                    `).join('')}
                </div>
                <div class="gauge-labels">
                    <span>Pre-contemplation</span>
                    <span>Maintenance</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render Vulnerability-Intervention Matching Section
 */
function renderMatchingSection(matches) {
    const criticalMatches = matches.filter(m => m.priority === 'critical');
    const highMatches = matches.filter(m => m.priority === 'high');

    return `
        <div class="intervention-section">
            <div class="section-header-row">
                <h4 class="section-title-intervention">
                    <span class="section-icon">🔗</span>
                    <span data-i18n="intervention.matching.title">Phase 2: Vulnerability-Intervention Matching</span>
                </h4>
            </div>

            ${criticalMatches.length > 0 ? `
                <div class="matching-priority-group critical">
                    <div class="priority-header">
                        <span class="priority-badge critical">🚨 Critical</span>
                        <span class="priority-count">${criticalMatches.length} ${criticalMatches.length === 1 ? 'area' : 'areas'}</span>
                    </div>
                    ${criticalMatches.map(m => renderMatchCard(m)).join('')}
                </div>
            ` : ''}

            ${highMatches.length > 0 ? `
                <div class="matching-priority-group high">
                    <div class="priority-header">
                        <span class="priority-badge high">⚠️ High Priority</span>
                        <span class="priority-count">${highMatches.length} ${highMatches.length === 1 ? 'area' : 'areas'}</span>
                    </div>
                    ${highMatches.map(m => renderMatchCard(m)).join('')}
                </div>
            ` : ''}

            ${matches.filter(m => m.priority === 'normal').length > 0 ? `
                <div class="matching-priority-group normal">
                    <div class="priority-header">
                        <span class="priority-badge normal">📋 Monitor</span>
                        <span class="priority-count">${matches.filter(m => m.priority === 'normal').length} areas</span>
                    </div>
                    <div class="normal-summary">
                        ${matches.filter(m => m.priority === 'normal').map(m => `
                            <span class="normal-cat" title="${m.categoryName}">${m.categoryId}</span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            ${matches.length === 0 ? `
                <div class="no-data-message">
                    <span>📊</span>
                    <p data-i18n="intervention.matching.no-data">Complete assessments to generate intervention recommendations</p>
                </div>
            ` : ''}
        </div>
    `;
}

/**
 * Render a single match card
 */
function renderMatchCard(match) {
    return `
        <div class="match-card" data-category="${match.categoryId}">
            <div class="match-header">
                <div class="match-cat-badge">${match.categoryId}</div>
                <div class="match-info">
                    <div class="match-name">${match.categoryName}</div>
                    <div class="match-meta">
                        Risk: ${(match.riskLevel * 100).toFixed(0)}% |
                        Completion: ${match.completion.toFixed(0)}%
                    </div>
                </div>
                <div class="match-risk-indicator" style="background: ${match.riskLevel > 0.66 ? 'var(--danger)' : match.riskLevel > 0.33 ? 'var(--warning)' : 'var(--success)'}">
                    ${(match.riskLevel * 100).toFixed(0)}%
                </div>
            </div>
            <div class="match-approaches">
                <div class="approaches-label" data-i18n="intervention.matching.recommended-approaches">Recommended Approaches:</div>
                ${match.recommendedApproaches.map(a => `
                    <div class="approach-item">
                        <span class="approach-name">${a.name}</span>
                        <span class="approach-effort effort-${a.effort}">${a.effort}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * Render Resistance Tracker Section
 */
function renderResistanceSection(signals) {
    return `
        <div class="intervention-section">
            <div class="section-header-row">
                <h4 class="section-title-intervention">
                    <span class="section-icon">🧭</span>
                    <span data-i18n="intervention.resistance.title">Phase 5: Resistance Navigation</span>
                </h4>
            </div>

            ${signals.length > 0 ? `
                <div class="resistance-signals-list">
                    ${signals.map(signal => {
                        const source = RESISTANCE_SOURCES[signal.type];
                        const severityColor = signal.severity === 'high' ? 'var(--danger)' :
                                              signal.severity === 'medium' ? 'var(--warning)' : 'var(--text-light)';
                        return `
                            <div class="resistance-signal-card severity-${signal.severity}">
                                <div class="signal-header">
                                    <span class="signal-type-badge" style="background: ${severityColor}">${signal.signal.replace(/_/g, ' ')}</span>
                                    <span class="signal-severity">${signal.severity}</span>
                                </div>
                                <div class="signal-description">${signal.description}</div>
                                <div class="signal-source">
                                    <strong>Source:</strong> ${source?.name || signal.type}
                                </div>
                                <div class="signal-approach">
                                    <strong data-i18n="intervention.resistance.approach">Approach:</strong>
                                    ${source?.approach || 'Investigate and respond appropriately'}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            ` : `
                <div class="no-resistance-state">
                    <div class="no-resistance-icon">✅</div>
                    <p data-i18n="intervention.resistance.none-detected">No significant resistance signals detected</p>
                    <small data-i18n="intervention.resistance.continue-monitoring">Continue monitoring as interventions proceed</small>
                </div>
            `}

            <!-- Resistance Sources Reference -->
            <div class="resistance-sources-ref">
                <div class="ref-header" data-action="toggle-resistance-sources">
                    <span data-i18n="intervention.resistance.sources-ref">📚 Resistance Sources Reference</span>
                    <span class="toggle-icon">▼</span>
                </div>
                <div class="ref-content" style="display: none;">
                    ${Object.entries(RESISTANCE_SOURCES).map(([key, source]) => `
                        <div class="ref-item">
                            <div class="ref-item-name">${source.name}</div>
                            <div class="ref-item-desc">${source.description}</div>
                            <div class="ref-item-signals">
                                <strong>Signals:</strong> ${source.signals.join(', ')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

/**
 * Render Verification & Integration Section
 */
function renderVerificationSection(orgData, convergenceIndex) {
    const agg = orgData.aggregates || {};
    const cpfScore = agg.maturity_model?.cpf_score || 0;
    const assessmentCount = Object.keys(orgData.assessments || {}).length;

    // Calculate domain distribution
    const categories = agg.by_category || {};
    let greenCount = 0, yellowCount = 0, redCount = 0;
    Object.values(categories).forEach(cat => {
        if (!cat) return;
        if (cat.avg_score < 0.33) greenCount++;
        else if (cat.avg_score < 0.66) yellowCount++;
        else redCount++;
    });

    // Convergence status
    let convergenceStatus = 'excellent';
    let convergenceColor = 'var(--success)';
    if (convergenceIndex > 10) {
        convergenceStatus = 'critical';
        convergenceColor = 'var(--danger)';
    } else if (convergenceIndex > 5) {
        convergenceStatus = 'elevated';
        convergenceColor = 'var(--warning)';
    } else if (convergenceIndex > 2) {
        convergenceStatus = 'moderate';
        convergenceColor = 'var(--warning)';
    }

    return `
        <div class="intervention-section">
            <div class="section-header-row">
                <h4 class="section-title-intervention">
                    <span class="section-icon">✅</span>
                    <span data-i18n="intervention.verification.title">Phase 6: Verification & Integration</span>
                </h4>
            </div>

            <!-- Current State Metrics -->
            <div class="verification-metrics">
                <div class="verification-metric">
                    <div class="metric-label" data-i18n="intervention.verification.cpf-score">CPF Score</div>
                    <div class="metric-value" style="color: var(--primary)">${cpfScore.toFixed(0)}</div>
                    <div class="metric-sublabel">/ 100</div>
                </div>
                <div class="verification-metric">
                    <div class="metric-label" data-i18n="intervention.verification.convergence">Convergence Index</div>
                    <div class="metric-value" style="color: ${convergenceColor}">${convergenceIndex.toFixed(2)}</div>
                    <div class="metric-sublabel">${convergenceStatus}</div>
                </div>
                <div class="verification-metric">
                    <div class="metric-label" data-i18n="intervention.verification.assessments">Assessments</div>
                    <div class="metric-value">${assessmentCount}</div>
                    <div class="metric-sublabel">/ 100</div>
                </div>
            </div>

            <!-- Domain Distribution -->
            <div class="domain-distribution">
                <div class="distribution-header" data-i18n="intervention.verification.domain-distribution">Domain Distribution</div>
                <div class="distribution-bars">
                    <div class="dist-bar green" style="flex: ${greenCount || 0.5}">
                        <span class="dist-count">${greenCount}</span>
                        <span class="dist-label">Green</span>
                    </div>
                    <div class="dist-bar yellow" style="flex: ${yellowCount || 0.5}">
                        <span class="dist-count">${yellowCount}</span>
                        <span class="dist-label">Yellow</span>
                    </div>
                    <div class="dist-bar red" style="flex: ${redCount || 0.5}">
                        <span class="dist-count">${redCount}</span>
                        <span class="dist-label">Red</span>
                    </div>
                </div>
            </div>

            <!-- Verification Cycle -->
            <div class="verification-cycle">
                <div class="cycle-header" data-i18n="intervention.verification.cycle">Diagnostic-Intervention-Verification Cycle</div>
                <div class="cycle-visual">
                    <div class="cycle-step completed">
                        <div class="step-icon">📊</div>
                        <div class="step-name">Diagnose</div>
                        <div class="step-status">✓</div>
                    </div>
                    <div class="cycle-arrow">→</div>
                    <div class="cycle-step ${assessmentCount >= 50 ? 'in-progress' : 'pending'}">
                        <div class="step-icon">🔧</div>
                        <div class="step-name">Intervene</div>
                        <div class="step-status">${assessmentCount >= 50 ? '⏳' : '○'}</div>
                    </div>
                    <div class="cycle-arrow">→</div>
                    <div class="cycle-step pending">
                        <div class="step-icon">✅</div>
                        <div class="step-name">Verify</div>
                        <div class="step-status">○</div>
                    </div>
                    <div class="cycle-arrow">→</div>
                    <div class="cycle-step pending">
                        <div class="step-icon">🔄</div>
                        <div class="step-name">Iterate</div>
                        <div class="step-status">○</div>
                    </div>
                </div>
            </div>

            <!-- Sustainment Checklist -->
            <div class="sustainment-checklist">
                <div class="checklist-header" data-i18n="intervention.verification.sustainment">Sustainment Planning</div>
                <div class="checklist-items">
                    <label class="checklist-item">
                        <input type="checkbox" ${assessmentCount >= 80 ? 'checked' : ''} disabled>
                        <span>Ongoing monitoring established (≥80% coverage)</span>
                    </label>
                    <label class="checklist-item">
                        <input type="checkbox" ${greenCount >= 5 ? 'checked' : ''} disabled>
                        <span>Majority domains in green zone (≥5 categories)</span>
                    </label>
                    <label class="checklist-item">
                        <input type="checkbox" ${convergenceIndex < 3 ? 'checked' : ''} disabled>
                        <span>Convergence index within acceptable range (&lt;3)</span>
                    </label>
                    <label class="checklist-item">
                        <input type="checkbox" disabled>
                        <span>Integration with security operations complete</span>
                    </label>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render Intervention Planner Section
 */
function renderInterventionPlanner(matches, readiness) {
    const criticalCount = matches.filter(m => m.priority === 'critical').length;
    const highCount = matches.filter(m => m.priority === 'high').length;
    const totalInterventions = criticalCount + highCount;

    return `
        <div class="intervention-planner-section">
            <div class="section-header-row">
                <h4 class="section-title-intervention">
                    <span class="section-icon">📋</span>
                    <span data-i18n="intervention.planner.title">Intervention Planner</span>
                </h4>
                <div class="planner-summary">
                    <span class="planner-stat">${totalInterventions} interventions recommended</span>
                </div>
            </div>

            <!-- Planner Timeline -->
            <div class="planner-timeline">
                ${Object.entries(CPIF_PHASES).map(([num, phase]) => {
                    let phaseStatus = 'pending';
                    let statusIcon = '○';

                    // Determine phase status based on data
                    if (num === '1') {
                        phaseStatus = readiness.score > 0.3 ? 'completed' : 'in-progress';
                        statusIcon = readiness.score > 0.3 ? '✓' : '⏳';
                    } else if (num === '2') {
                        phaseStatus = matches.length > 0 ? 'completed' : 'pending';
                        statusIcon = matches.length > 0 ? '✓' : '○';
                    }

                    return `
                        <div class="timeline-phase ${phaseStatus}">
                            <div class="phase-connector ${num === '1' ? 'first' : ''}"></div>
                            <div class="phase-node">
                                <div class="node-icon">${phase.icon}</div>
                                <div class="node-status">${statusIcon}</div>
                            </div>
                            <div class="phase-details">
                                <div class="phase-title">Phase ${num}: ${phase.name}</div>
                                <div class="phase-desc">${phase.description}</div>
                                <div class="phase-dimensions">
                                    ${phase.dimensions.map(d => `<span class="dim-tag">${d.replace(/_/g, ' ')}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <!-- Quick Actions -->
            <div class="planner-actions">
                <button class="btn btn-primary" data-action="generate-intervention-report">
                    📄 Generate Report
                </button>
                <button class="btn btn-secondary" data-action="export-intervention-plan">
                    📤 Export Plan
                </button>
            </div>
        </div>
    `;
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

/**
 * Handle phase selection
 */
export function selectCpifPhase(phaseId) {
    interventionState.selectedPhase = interventionState.selectedPhase === phaseId ? null : phaseId;
    renderInterventionTab();
}

/**
 * Toggle resistance sources reference
 */
export function toggleResistanceSources() {
    const content = document.querySelector('.ref-content');
    const icon = document.querySelector('.toggle-icon');
    if (content && icon) {
        const isVisible = content.style.display !== 'none';
        content.style.display = isVisible ? 'none' : 'block';
        icon.textContent = isVisible ? '▼' : '▲';
    }
}

/**
 * Generate intervention report
 */
export function generateInterventionReport() {
    const orgData = getSelectedOrgData();
    if (!orgData) return;

    const readiness = calculateReadinessScore(orgData);
    const matches = calculateInterventionMatching(orgData);
    const signals = detectResistanceSignals(orgData);

    // Create report content
    let report = `CPIF INTERVENTION REPORT\n`;
    report += `========================\n\n`;
    report += `Organization: ${orgData.name || getSelectedOrgId()}\n`;
    report += `Date: ${new Date().toISOString().split('T')[0]}\n\n`;

    report += `READINESS ASSESSMENT\n`;
    report += `--------------------\n`;
    report += `Overall Score: ${(readiness.score * 100).toFixed(0)}%\n`;
    report += `Stage: ${READINESS_STAGES[readiness.stage].name}\n\n`;

    report += `PRIORITY INTERVENTIONS\n`;
    report += `----------------------\n`;
    matches.filter(m => m.priority !== 'normal').forEach(m => {
        report += `\n[${m.priority.toUpperCase()}] Category ${m.categoryId}: ${m.categoryName}\n`;
        report += `Risk Level: ${(m.riskLevel * 100).toFixed(0)}%\n`;
        report += `Recommended Approaches:\n`;
        m.recommendedApproaches.forEach(a => {
            report += `  - ${a.name}: ${a.desc}\n`;
        });
    });

    report += `\nRESISTANCE SIGNALS\n`;
    report += `------------------\n`;
    if (signals.length > 0) {
        signals.forEach(s => {
            report += `[${s.severity.toUpperCase()}] ${s.signal}: ${s.description}\n`;
        });
    } else {
        report += `No significant resistance signals detected.\n`;
    }

    // Download as text file
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cpif-report-${getSelectedOrgId()}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
    calculateReadinessScore,
    calculateInterventionMatching,
    detectResistanceSignals,
    CPIF_PHASES,
    READINESS_STAGES,
    INTERVENTION_CLASSES,
    RESISTANCE_SOURCES
};
