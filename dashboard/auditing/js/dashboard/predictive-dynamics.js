/**
 * Predictive Dynamics - Synaptic Connectome Visualization
 *
 * This module creates an interactive Force-Directed Graph (D3.js)
 * that visualizes the Bayesian network of 100 security indicators
 * grouped into 10 psychological vulnerability categories.
 *
 * Features:
 * - Force-Directed layout with category hub nodes
 * - Risk-based node coloring (Green/Yellow/Red)
 * - Simulation Mode for "What-If" scenario analysis
 * - Cascade effect animation showing risk propagation
 * - Impact Analysis sidebar panel
 */

import { getSelectedOrgData } from './state.js';

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const CATEGORY_NAMES = {
    '1': 'Authority',
    '2': 'Temporal',
    '3': 'Social',
    '4': 'Affective',
    '5': 'Cognitive',
    '6': 'Group',
    '7': 'Stress',
    '8': 'Unconscious',
    '9': 'AI-Enhanced',
    '10': 'Convergent'
};

const INDICATOR_NAMES = {
    '1.1': 'Unquestioning Compliance',
    '1.2': 'Diffusion of Responsibility',
    '1.3': 'Authority Impersonation',
    '1.4': 'Security Bypass for Superior',
    '1.5': 'Fear-based Compliance',
    '1.6': 'Authority Gradient',
    '1.7': 'Technical Authority Deference',
    '1.8': 'Executive Exception',
    '1.9': 'Authority Social Proof',
    '1.10': 'Crisis Authority Escalation',
    '2.1': 'Urgency-induced Bypass',
    '2.2': 'Time Pressure Degradation',
    '2.3': 'Deadline Risk Acceptance',
    '2.4': 'Present Bias',
    '2.5': 'Hyperbolic Discounting',
    '2.6': 'Temporal Exhaustion',
    '2.7': 'Time-of-day Vulnerability',
    '2.8': 'Weekend/Holiday Lapses',
    '2.9': 'Shift Change Exploitation',
    '2.10': 'Temporal Consistency',
    '3.1': 'Reciprocity Exploitation',
    '3.2': 'Commitment Escalation',
    '3.3': 'Social Proof Manipulation',
    '3.4': 'Liking-based Trust',
    '3.5': 'Scarcity-driven Decisions',
    '3.6': 'Unity Principle',
    '3.7': 'Peer Pressure Compliance',
    '3.8': 'Conformity to Insecure Norms',
    '3.9': 'Social Identity Threats',
    '3.10': 'Reputation Conflicts',
    '4.1': 'Fear Decision Paralysis',
    '4.2': 'Anger-induced Risk Taking',
    '4.3': 'Trust Transference',
    '4.4': 'Legacy System Attachment',
    '4.5': 'Shame-based Hiding',
    '4.6': 'Guilt-driven Overcompliance',
    '4.7': 'Anxiety-triggered Mistakes',
    '4.8': 'Depression Negligence',
    '4.9': 'Euphoria Carelessness',
    '4.10': 'Emotional Contagion',
    '5.1': 'Alert Fatigue',
    '5.2': 'Decision Fatigue',
    '5.3': 'Information Overload',
    '5.4': 'Multitasking Degradation',
    '5.5': 'Context Switching',
    '5.6': 'Cognitive Tunneling',
    '5.7': 'Working Memory Overflow',
    '5.8': 'Attention Residue',
    '5.9': 'Complexity-induced Errors',
    '5.10': 'Mental Model Confusion',
    '6.1': 'Groupthink Blind Spots',
    '6.2': 'Risky Shift',
    '6.3': 'Diffusion of Responsibility',
    '6.4': 'Social Loafing',
    '6.5': 'Bystander Effect',
    '6.6': 'Dependency Assumptions',
    '6.7': 'Fight-flight Postures',
    '6.8': 'Pairing Hope Fantasies',
    '6.9': 'Organizational Splitting',
    '6.10': 'Collective Defense',
    '7.1': 'Acute Stress Impairment',
    '7.2': 'Chronic Stress Burnout',
    '7.3': 'Fight Response',
    '7.4': 'Flight Response',
    '7.5': 'Freeze Response',
    '7.6': 'Fawn Response',
    '7.7': 'Stress Tunnel Vision',
    '7.8': 'Cortisol Memory Impairment',
    '7.9': 'Stress Contagion',
    '7.10': 'Recovery Vulnerability',
    '8.1': 'Shadow Projection',
    '8.2': 'Threat Identification',
    '8.3': 'Repetition Compulsion',
    '8.4': 'Authority Transference',
    '8.5': 'Countertransference',
    '8.6': 'Defense Mechanism',
    '8.7': 'Symbolic Equation',
    '8.8': 'Archetypal Triggers',
    '8.9': 'Collective Unconscious',
    '8.10': 'Dream Logic',
    '9.1': 'AI Anthropomorphization',
    '9.2': 'Automation Bias',
    '9.3': 'Algorithm Aversion',
    '9.4': 'AI Authority Transfer',
    '9.5': 'Uncanny Valley',
    '9.6': 'ML Opacity Trust',
    '9.7': 'AI Hallucination Acceptance',
    '9.8': 'Human-AI Dysfunction',
    '9.9': 'AI Emotional Manipulation',
    '9.10': 'Algorithmic Fairness Blindness',
    '10.1': 'Perfect Storm',
    '10.2': 'Cascade Failure',
    '10.3': 'Tipping Point',
    '10.4': 'Swiss Cheese Alignment',
    '10.5': 'Black Swan Blindness',
    '10.6': 'Gray Rhino Denial',
    '10.7': 'Complexity Catastrophe',
    '10.8': 'Emergence Unpredictability',
    '10.9': 'System Coupling Failures',
    '10.10': 'Hysteresis Gaps'
};

// Bayesian probability weights for risk propagation
// Format: { source: { target: probability } }
const BAYESIAN_WEIGHTS = {
    // Stress amplifies Authority compliance
    '7.1': { '1.1': 0.80, '1.5': 0.75, '5.1': 0.70, '5.2': 0.65 },
    '7.2': { '5.2': 0.75, '4.8': 0.70, '5.1': 0.65 },
    // Temporal pressure increases cognitive overload
    '2.1': { '5.1': 0.70, '5.2': 0.65, '5.4': 0.60 },
    '2.2': { '5.2': 0.75, '5.3': 0.70, '4.7': 0.55 },
    '2.3': { '5.2': 0.65, '6.2': 0.60 },
    // Authority affects group dynamics
    '1.1': { '6.1': 0.65, '6.3': 0.60, '3.7': 0.55 },
    '1.3': { '3.3': 0.70, '4.1': 0.60 },
    // Social influence spreads through network
    '3.3': { '6.1': 0.65, '3.7': 0.70, '3.8': 0.60 },
    '3.7': { '6.4': 0.60, '6.5': 0.55 },
    // Cognitive overload leads to errors
    '5.1': { '5.2': 0.70, '4.7': 0.55, '7.1': 0.50 },
    '5.2': { '5.9': 0.65, '5.10': 0.60 },
    '5.3': { '5.6': 0.70, '5.7': 0.65 },
    // Affective states cascade
    '4.1': { '7.5': 0.70, '5.6': 0.55 },
    '4.2': { '6.2': 0.60, '5.9': 0.50 },
    '4.7': { '5.9': 0.65, '7.1': 0.55 },
    // Group dynamics affect individual behavior
    '6.1': { '1.1': 0.60, '3.8': 0.65, '6.2': 0.55 },
    '6.3': { '6.4': 0.70, '6.5': 0.75 },
    // AI-specific biases
    '9.2': { '5.1': 0.60, '9.7': 0.65 },
    '9.4': { '1.1': 0.55, '9.2': 0.60 },
    // Convergent states (high impact)
    '10.1': { '10.2': 0.85, '10.3': 0.80 },
    '10.2': { '10.7': 0.75, '7.9': 0.70 },
    '10.4': { '10.1': 0.70, '10.2': 0.65 }
};

// OFTLISRV metric descriptions
const OFTLISRV_METRICS = {
    'O': { name: 'Observables', desc: 'Measurable behaviors/patterns' },
    'F': { name: 'Data Sources', desc: 'Origin of observations' },
    'T': { name: 'Temporality', desc: 'Time-based dimensions' },
    'L': { name: 'Detection Logic', desc: 'Mathematical formulas' },
    'I': { name: 'Interdependencies', desc: 'Bayesian relationships' },
    'S': { name: 'Thresholds', desc: 'Alert triggers' },
    'R': { name: 'Responses', desc: 'Escalation protocols' },
    'V': { name: 'Validation', desc: 'Verification methods' }
};

// Colors
const COLORS = {
    low: '#22c55e',      // Green
    medium: '#f59e0b',   // Yellow/Amber
    high: '#ef4444',     // Red
    compromised: '#7c3aed', // Purple (simulation)
    affected: '#f97316',    // Orange (simulation cascade)
    categoryNode: '#1e3a8a', // Primary blue
    link: '#cbd5e1',         // Light gray
    linkActive: '#3b82f6',   // Blue
    linkCascade: '#f97316'   // Orange
};

// ============================================================================
// STATE
// ============================================================================

let svg = null;
let simulation = null;
let zoom = null;
let graphData = { nodes: [], links: [] };
let simulationMode = false;
let compromisedNodes = new Set();
let affectedNodes = new Map(); // nodeId -> riskIncrease
let selectedNode = null;

// ============================================================================
// GRAPH DATA GENERATION
// ============================================================================

function buildGraphData(orgData) {
    const nodes = [];
    const links = [];
    const assessments = orgData?.assessments || {};
    const categoryData = orgData?.aggregates?.by_category || {};

    // Create category nodes (hubs)
    for (let cat = 1; cat <= 10; cat++) {
        const catKey = String(cat);
        const catData = categoryData[catKey];
        const avgRisk = catData ? catData.avg_score : 0.5;

        nodes.push({
            id: `cat-${cat}`,
            type: 'category',
            categoryId: cat,
            name: CATEGORY_NAMES[catKey],
            risk: avgRisk,
            confidence: catData?.avg_confidence || 0,
            completion: catData?.completion_percentage || 0,
            radius: 35,
            fx: null, // Will be set for initial positioning
            fy: null
        });
    }

    // Create indicator nodes
    for (let cat = 1; cat <= 10; cat++) {
        for (let ind = 1; ind <= 10; ind++) {
            const indicatorId = `${cat}.${ind}`;
            const assessment = assessments[indicatorId];
            const risk = assessment?.bayesian_score ?? 0.5;
            const confidence = assessment?.confidence ?? 0;

            nodes.push({
                id: indicatorId,
                type: 'indicator',
                categoryId: cat,
                indicatorNum: ind,
                name: INDICATOR_NAMES[indicatorId] || `Indicator ${indicatorId}`,
                risk: risk,
                confidence: confidence,
                assessed: assessment !== undefined,
                radius: 12
            });

            // Link to parent category
            links.push({
                source: `cat-${cat}`,
                target: indicatorId,
                type: 'hierarchy',
                weight: 1
            });
        }
    }

    // Create Bayesian interdependency links
    Object.entries(BAYESIAN_WEIGHTS).forEach(([sourceId, targets]) => {
        Object.entries(targets).forEach(([targetId, probability]) => {
            // Only create link if both nodes exist
            const sourceExists = nodes.some(n => n.id === sourceId);
            const targetExists = nodes.some(n => n.id === targetId);

            if (sourceExists && targetExists) {
                links.push({
                    source: sourceId,
                    target: targetId,
                    type: 'bayesian',
                    weight: probability
                });
            }
        });
    });

    return { nodes, links };
}

// ============================================================================
// D3 FORCE-DIRECTED GRAPH
// ============================================================================

function initializeGraph() {
    const container = document.getElementById('predictiveGraph');
    if (!container) return;

    // Clear existing
    container.innerHTML = '';

    const width = container.clientWidth;
    const height = container.clientHeight || 600;

    // Create SVG
    svg = d3.select(container)
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');

    // Add defs for gradients and filters
    const defs = svg.append('defs');

    // Glow filter for nodes
    const filter = defs.append('filter')
        .attr('id', 'glow')
        .attr('x', '-50%')
        .attr('y', '-50%')
        .attr('width', '200%')
        .attr('height', '200%');

    filter.append('feGaussianBlur')
        .attr('stdDeviation', '3')
        .attr('result', 'coloredBlur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Pulse animation filter
    const pulseFilter = defs.append('filter')
        .attr('id', 'pulse-glow')
        .attr('x', '-100%')
        .attr('y', '-100%')
        .attr('width', '300%')
        .attr('height', '300%');

    pulseFilter.append('feGaussianBlur')
        .attr('stdDeviation', '4')
        .attr('result', 'coloredBlur');

    const pulseMerge = pulseFilter.append('feMerge');
    pulseMerge.append('feMergeNode').attr('in', 'coloredBlur');
    pulseMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Arrow marker for directed links
    defs.append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '-0 -5 10 10')
        .attr('refX', 20)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .append('path')
        .attr('d', 'M 0,-5 L 10,0 L 0,5')
        .attr('fill', COLORS.link);

    // Cascade arrow marker
    defs.append('marker')
        .attr('id', 'arrowhead-cascade')
        .attr('viewBox', '-0 -5 10 10')
        .attr('refX', 20)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .append('path')
        .attr('d', 'M 0,-5 L 10,0 L 0,5')
        .attr('fill', COLORS.linkCascade);

    // Main group for zoom/pan
    const g = svg.append('g').attr('class', 'graph-group');

    // Zoom behavior
    zoom = d3.zoom()
        .scaleExtent([0.2, 4])
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
        });

    svg.call(zoom);

    // Link group (rendered first, below nodes)
    g.append('g').attr('class', 'links');

    // Node group
    g.append('g').attr('class', 'nodes');

    // Tooltip
    d3.select(container)
        .append('div')
        .attr('class', 'graph-tooltip')
        .style('opacity', 0);
}

function renderGraph() {
    const orgData = getSelectedOrgData();
    if (!orgData) {
        console.log('No organization data available for Predictive Dynamics');
        return;
    }

    const container = document.getElementById('predictiveGraph');
    if (!container || !svg) {
        initializeGraph();
        if (!svg) return;
    }

    const width = container.clientWidth;
    const height = container.clientHeight || 600;

    // Build graph data from organization
    graphData = buildGraphData(orgData);

    // Set initial positions for category nodes in a circle
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    graphData.nodes.forEach((node, i) => {
        if (node.type === 'category') {
            const angle = (node.categoryId - 1) * (2 * Math.PI / 10) - Math.PI / 2;
            node.x = centerX + radius * Math.cos(angle);
            node.y = centerY + radius * Math.sin(angle);
        }
    });

    // Create force simulation
    simulation = d3.forceSimulation(graphData.nodes)
        .force('link', d3.forceLink(graphData.links)
            .id(d => d.id)
            .distance(d => {
                if (d.type === 'hierarchy') return 80;
                return 150;
            })
            .strength(d => {
                if (d.type === 'hierarchy') return 0.8;
                return 0.1;
            }))
        .force('charge', d3.forceManyBody()
            .strength(d => d.type === 'category' ? -400 : -50))
        .force('center', d3.forceCenter(centerX, centerY).strength(0.05))
        .force('collision', d3.forceCollide()
            .radius(d => d.radius + 5))
        .force('radial', d3.forceRadial(
            d => d.type === 'category' ? radius : radius * 0.6,
            centerX,
            centerY
        ).strength(d => d.type === 'category' ? 0.3 : 0.05));

    // Render links
    const linkGroup = svg.select('.links');
    const links = linkGroup.selectAll('.link')
        .data(graphData.links, d => `${d.source.id || d.source}-${d.target.id || d.target}`);

    links.exit().remove();

    const linksEnter = links.enter()
        .append('line')
        .attr('class', d => `link link-${d.type}`)
        .attr('stroke', d => d.type === 'bayesian' ? COLORS.linkActive : COLORS.link)
        .attr('stroke-width', d => d.type === 'bayesian' ? 1.5 : 1)
        .attr('stroke-opacity', d => d.type === 'bayesian' ? 0.4 : 0.3)
        .attr('stroke-dasharray', d => d.type === 'bayesian' ? '4,2' : 'none')
        .attr('marker-end', d => d.type === 'bayesian' ? 'url(#arrowhead)' : null);

    const allLinks = linksEnter.merge(links);

    // Render nodes
    const nodeGroup = svg.select('.nodes');
    const nodes = nodeGroup.selectAll('.node')
        .data(graphData.nodes, d => d.id);

    nodes.exit().remove();

    const nodesEnter = nodes.enter()
        .append('g')
        .attr('class', d => `node node-${d.type}`)
        .call(d3.drag()
            .on('start', dragStarted)
            .on('drag', dragged)
            .on('end', dragEnded))
        .on('click', (event, d) => handleNodeClick(event, d))
        .on('mouseover', (event, d) => handleNodeHover(event, d, true))
        .on('mouseout', (event, d) => handleNodeHover(event, d, false));

    // Category nodes
    nodesEnter.filter(d => d.type === 'category')
        .append('circle')
        .attr('r', d => d.radius)
        .attr('fill', d => getRiskColor(d.risk))
        .attr('stroke', '#fff')
        .attr('stroke-width', 3)
        .attr('filter', 'url(#glow)');

    nodesEnter.filter(d => d.type === 'category')
        .append('text')
        .attr('class', 'node-label')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('fill', '#fff')
        .attr('font-weight', '700')
        .attr('font-size', '12px')
        .text(d => d.categoryId);

    // Indicator nodes
    nodesEnter.filter(d => d.type === 'indicator')
        .append('circle')
        .attr('r', d => d.radius)
        .attr('fill', d => d.assessed ? getRiskColor(d.risk) : '#9ca3af')
        .attr('stroke', '#fff')
        .attr('stroke-width', 2);

    nodesEnter.filter(d => d.type === 'indicator')
        .append('text')
        .attr('class', 'node-label-small')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('fill', '#fff')
        .attr('font-weight', '600')
        .attr('font-size', '8px')
        .text(d => d.indicatorNum);

    const allNodes = nodesEnter.merge(nodes);

    // Update simulation
    simulation.on('tick', () => {
        allLinks
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        allNodes.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    simulation.alpha(1).restart();
}

function getRiskColor(risk) {
    if (risk < 0.33) return COLORS.low;
    if (risk < 0.66) return COLORS.medium;
    return COLORS.high;
}

function getRiskLabel(risk) {
    if (risk < 0.33) return 'Low';
    if (risk < 0.66) return 'Medium';
    return 'High';
}

// ============================================================================
// DRAG HANDLERS
// ============================================================================

function dragStarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragEnded(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    if (d.type !== 'category') {
        d.fx = null;
        d.fy = null;
    }
}

// ============================================================================
// NODE INTERACTION
// ============================================================================

function handleNodeClick(event, node) {
    event.stopPropagation();

    if (simulationMode && node.type === 'indicator') {
        // Toggle compromised state in simulation mode
        if (compromisedNodes.has(node.id)) {
            compromisedNodes.delete(node.id);
        } else {
            compromisedNodes.add(node.id);
        }
        runCascadeSimulation();
    }

    // Select node for details panel
    selectedNode = node;
    updateDetailsPanel(node);
    highlightNode(node);
}

function handleNodeHover(event, node, isHovering) {
    const tooltip = d3.select('.graph-tooltip');

    if (isHovering) {
        const riskPercent = (node.risk * 100).toFixed(1);
        const riskLabel = getRiskLabel(node.risk);

        let content = `<strong>${node.id}</strong><br>${node.name}`;
        content += `<br><span style="color:${getRiskColor(node.risk)}">Risk: ${riskPercent}% (${riskLabel})</span>`;

        if (simulationMode && affectedNodes.has(node.id)) {
            const increase = affectedNodes.get(node.id);
            content += `<br><span style="color:${COLORS.affected}">+${(increase * 100).toFixed(1)}% from cascade</span>`;
        }

        tooltip
            .html(content)
            .style('opacity', 1)
            .style('left', (event.pageX + 15) + 'px')
            .style('top', (event.pageY - 10) + 'px');

        // Highlight connected links
        highlightConnections(node, true);
    } else {
        tooltip.style('opacity', 0);
        highlightConnections(node, false);
    }
}

function highlightNode(node) {
    // Remove previous selection
    svg.selectAll('.node').classed('selected', false);

    // Add selection to current
    svg.selectAll('.node')
        .filter(d => d.id === node.id)
        .classed('selected', true);
}

function highlightConnections(node, highlight) {
    const connectedLinks = graphData.links.filter(
        l => (l.source.id || l.source) === node.id || (l.target.id || l.target) === node.id
    );

    svg.selectAll('.link')
        .attr('stroke-opacity', d => {
            if (!highlight) return d.type === 'bayesian' ? 0.4 : 0.3;
            const isConnected = connectedLinks.some(
                cl => (cl.source.id || cl.source) === (d.source.id || d.source) &&
                      (cl.target.id || cl.target) === (d.target.id || d.target)
            );
            return isConnected ? 0.8 : 0.1;
        })
        .attr('stroke-width', d => {
            if (!highlight) return d.type === 'bayesian' ? 1.5 : 1;
            const isConnected = connectedLinks.some(
                cl => (cl.source.id || cl.source) === (d.source.id || d.source) &&
                      (cl.target.id || cl.target) === (d.target.id || d.target)
            );
            return isConnected ? 3 : d.type === 'bayesian' ? 1.5 : 1;
        });
}

// ============================================================================
// SIMULATION MODE (What-If Scenario)
// ============================================================================

export function toggleSimulationMode(enabled) {
    simulationMode = enabled;

    const indicator = document.getElementById('simulationModeIndicator');
    const resetBtn = document.getElementById('resetSimulationBtn');
    const impactSection = document.getElementById('simulationImpactSection');

    if (indicator) indicator.style.display = enabled ? 'flex' : 'none';
    if (resetBtn) resetBtn.style.display = enabled ? 'inline-flex' : 'none';
    if (impactSection) impactSection.style.display = enabled ? 'block' : 'none';

    if (!enabled) {
        resetSimulation();
    }

    // Update visual feedback on nodes
    svg.selectAll('.node')
        .classed('simulation-mode', enabled);
}

export function resetSimulation() {
    compromisedNodes.clear();
    affectedNodes.clear();

    // Reset node colors to original
    svg.selectAll('.node circle')
        .transition()
        .duration(300)
        .attr('fill', d => {
            if (d.type === 'category') return getRiskColor(d.risk);
            return d.assessed ? getRiskColor(d.risk) : '#9ca3af';
        })
        .attr('filter', d => d.type === 'category' ? 'url(#glow)' : null);

    // Reset links
    svg.selectAll('.link')
        .classed('cascade-link', false)
        .attr('stroke', d => d.type === 'bayesian' ? COLORS.linkActive : COLORS.link)
        .attr('marker-end', d => d.type === 'bayesian' ? 'url(#arrowhead)' : null);

    // Reset impact panel
    updateImpactStats(0, 0, 0);

    if (selectedNode) {
        updateDetailsPanel(selectedNode);
    }
}

function runCascadeSimulation() {
    affectedNodes.clear();

    if (compromisedNodes.size === 0) {
        resetSimulation();
        return;
    }

    // BFS to propagate risk through Bayesian network
    const queue = [...compromisedNodes];
    const visited = new Set(compromisedNodes);
    let depth = 0;
    let maxDepth = 0;

    while (queue.length > 0) {
        const levelSize = queue.length;
        depth++;

        for (let i = 0; i < levelSize; i++) {
            const currentNodeId = queue.shift();
            const weights = BAYESIAN_WEIGHTS[currentNodeId] || {};

            Object.entries(weights).forEach(([targetId, probability]) => {
                if (!visited.has(targetId) && !compromisedNodes.has(targetId)) {
                    // Calculate cumulative probability
                    const existingRisk = affectedNodes.get(targetId) || 0;
                    const newRisk = Math.min(1, existingRisk + probability * (1 - existingRisk));
                    affectedNodes.set(targetId, newRisk);

                    // Continue propagation if probability is significant
                    if (probability > 0.5 && !visited.has(targetId)) {
                        queue.push(targetId);
                        visited.add(targetId);
                        maxDepth = depth;
                    }
                }
            });
        }
    }

    // Update visuals
    animateCascade();

    // Calculate stats
    const avgIncrease = affectedNodes.size > 0
        ? [...affectedNodes.values()].reduce((a, b) => a + b, 0) / affectedNodes.size
        : 0;

    updateImpactStats(affectedNodes.size, avgIncrease, maxDepth);
}

function animateCascade() {
    // Update compromised nodes
    svg.selectAll('.node circle')
        .transition()
        .duration(500)
        .attr('fill', d => {
            if (compromisedNodes.has(d.id)) return COLORS.compromised;
            if (affectedNodes.has(d.id)) {
                const impact = affectedNodes.get(d.id);
                // Blend between original and affected color
                return d3.interpolateRgb(getRiskColor(d.risk), COLORS.affected)(impact);
            }
            if (d.type === 'category') return getRiskColor(d.risk);
            return d.assessed ? getRiskColor(d.risk) : '#9ca3af';
        })
        .attr('filter', d => {
            if (compromisedNodes.has(d.id)) return 'url(#pulse-glow)';
            if (d.type === 'category') return 'url(#glow)';
            return null;
        });

    // Animate cascade links
    svg.selectAll('.link')
        .classed('cascade-link', d => {
            const sourceId = d.source.id || d.source;
            const targetId = d.target.id || d.target;
            return (compromisedNodes.has(sourceId) && affectedNodes.has(targetId)) ||
                   (affectedNodes.has(sourceId) && affectedNodes.has(targetId));
        })
        .attr('stroke', d => {
            const sourceId = d.source.id || d.source;
            const targetId = d.target.id || d.target;
            if ((compromisedNodes.has(sourceId) && affectedNodes.has(targetId)) ||
                (affectedNodes.has(sourceId) && affectedNodes.has(targetId))) {
                return COLORS.linkCascade;
            }
            return d.type === 'bayesian' ? COLORS.linkActive : COLORS.link;
        })
        .attr('marker-end', d => {
            const sourceId = d.source.id || d.source;
            const targetId = d.target.id || d.target;
            if ((compromisedNodes.has(sourceId) && affectedNodes.has(targetId))) {
                return 'url(#arrowhead-cascade)';
            }
            return d.type === 'bayesian' ? 'url(#arrowhead)' : null;
        });
}

function updateImpactStats(affectedCount, avgIncrease, depth) {
    const countEl = document.getElementById('affectedNodesCount');
    const increaseEl = document.getElementById('avgRiskIncrease');
    const depthEl = document.getElementById('cascadeDepth');

    if (countEl) countEl.textContent = affectedCount;
    if (increaseEl) increaseEl.textContent = `+${(avgIncrease * 100).toFixed(1)}%`;
    if (depthEl) depthEl.textContent = depth;

    // Update cascade chain visualization
    updateCascadeChain();
}

function updateCascadeChain() {
    const chainEl = document.getElementById('cascadeChain');
    if (!chainEl) return;

    if (compromisedNodes.size === 0) {
        chainEl.innerHTML = '<div class="cascade-empty">No nodes compromised</div>';
        return;
    }

    // Build cascade chain HTML
    let html = '<div class="cascade-flow">';

    // Compromised nodes
    html += '<div class="cascade-level cascade-level-source">';
    html += '<div class="cascade-level-label">Compromised</div>';
    compromisedNodes.forEach(nodeId => {
        const node = graphData.nodes.find(n => n.id === nodeId);
        if (node) {
            html += `<div class="cascade-node cascade-node-compromised" title="${node.name}">${nodeId}</div>`;
        }
    });
    html += '</div>';

    // Affected nodes (grouped by impact level)
    if (affectedNodes.size > 0) {
        html += '<div class="cascade-arrow">→</div>';
        html += '<div class="cascade-level cascade-level-affected">';
        html += '<div class="cascade-level-label">Affected</div>';

        // Sort by impact
        const sortedAffected = [...affectedNodes.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8); // Show top 8

        sortedAffected.forEach(([nodeId, impact]) => {
            const node = graphData.nodes.find(n => n.id === nodeId);
            if (node) {
                html += `<div class="cascade-node cascade-node-affected" title="${node.name}: +${(impact*100).toFixed(1)}%">${nodeId}</div>`;
            }
        });

        if (affectedNodes.size > 8) {
            html += `<div class="cascade-more">+${affectedNodes.size - 8} more</div>`;
        }
        html += '</div>';
    }

    html += '</div>';
    chainEl.innerHTML = html;
}

// ============================================================================
// DETAILS PANEL
// ============================================================================

function updateDetailsPanel(node) {
    const noSelection = document.getElementById('noNodeSelected');
    const detailsPanel = document.getElementById('nodeDetailsPanel');

    if (!node) {
        if (noSelection) noSelection.style.display = 'block';
        if (detailsPanel) detailsPanel.style.display = 'none';
        return;
    }

    if (noSelection) noSelection.style.display = 'none';
    if (detailsPanel) detailsPanel.style.display = 'block';

    // Update header
    const badge = document.getElementById('selectedNodeBadge');
    const name = document.getElementById('selectedNodeName');
    const category = document.getElementById('selectedNodeCategory');

    if (badge) {
        badge.textContent = node.type === 'category' ? node.categoryId : node.id;
        badge.style.background = getRiskColor(node.risk);
    }
    if (name) name.textContent = node.name;
    if (category) {
        category.textContent = node.type === 'category'
            ? `Category ${node.categoryId}`
            : `Category ${node.categoryId}: ${CATEGORY_NAMES[String(node.categoryId)]}`;
    }

    // Update risk status
    const riskValue = node.risk * 100;
    const riskBar = document.getElementById('riskBar');
    const riskValueEl = document.getElementById('riskValue');
    const riskBadge = document.getElementById('riskBadge');
    const riskCard = document.getElementById('riskStatusCard');

    if (riskBar) {
        riskBar.style.width = `${riskValue}%`;
        riskBar.style.background = getRiskColor(node.risk);
    }
    if (riskValueEl) riskValueEl.textContent = `${riskValue.toFixed(1)}%`;
    if (riskBadge) {
        riskBadge.textContent = getRiskLabel(node.risk);
        riskBadge.className = `risk-badge risk-badge-${getRiskLabel(node.risk).toLowerCase()}`;
    }
    if (riskCard) {
        riskCard.className = `risk-status-card risk-status-${getRiskLabel(node.risk).toLowerCase()}`;
    }

    // Update OFTLISRV metrics
    updateOFTLISRVGrid(node);

    // Update connected risks
    updateConnectedRisks(node);
}

function updateOFTLISRVGrid(node) {
    const grid = document.getElementById('oftlisrvGrid');
    if (!grid) return;

    // Generate mock OFTLISRV values based on node data
    const metrics = Object.entries(OFTLISRV_METRICS).map(([key, info]) => {
        // Generate realistic values based on node properties
        let value = 0;
        switch (key) {
            case 'O': value = node.assessed ? 0.7 + Math.random() * 0.3 : 0.2; break;
            case 'F': value = node.assessed ? 0.6 + Math.random() * 0.3 : 0.3; break;
            case 'T': value = 0.5 + Math.random() * 0.4; break;
            case 'L': value = node.confidence || 0.5; break;
            case 'I': value = Object.keys(BAYESIAN_WEIGHTS[node.id] || {}).length / 5; break;
            case 'S': value = node.risk > 0.66 ? 0.9 : node.risk > 0.33 ? 0.6 : 0.3; break;
            case 'R': value = node.assessed ? 0.8 : 0.4; break;
            case 'V': value = node.confidence || 0.5; break;
        }
        return { key, ...info, value: Math.min(1, value) };
    });

    grid.innerHTML = metrics.map(m => `
        <div class="oftlisrv-item" title="${m.desc}">
            <div class="oftlisrv-key">${m.key}</div>
            <div class="oftlisrv-bar">
                <div class="oftlisrv-bar-fill" style="width: ${m.value * 100}%"></div>
            </div>
            <div class="oftlisrv-value">${(m.value * 100).toFixed(0)}%</div>
        </div>
    `).join('');
}

function updateConnectedRisks(node) {
    const list = document.getElementById('connectedRisksList');
    if (!list) return;

    // Find connected nodes through Bayesian links
    const outgoing = BAYESIAN_WEIGHTS[node.id] || {};
    const incoming = {};

    Object.entries(BAYESIAN_WEIGHTS).forEach(([sourceId, targets]) => {
        if (targets[node.id]) {
            incoming[sourceId] = targets[node.id];
        }
    });

    // Combine and sort by probability
    const connected = [
        ...Object.entries(outgoing).map(([id, prob]) => ({ id, prob, direction: 'out' })),
        ...Object.entries(incoming).map(([id, prob]) => ({ id, prob, direction: 'in' }))
    ].sort((a, b) => b.prob - a.prob).slice(0, 3);

    if (connected.length === 0) {
        list.innerHTML = '<div class="no-connections">No direct Bayesian connections</div>';
        return;
    }

    list.innerHTML = connected.map(conn => {
        const connNode = graphData.nodes.find(n => n.id === conn.id);
        const name = connNode?.name || conn.id;
        const arrow = conn.direction === 'out' ? '→' : '←';
        const label = conn.direction === 'out' ? 'affects' : 'affected by';

        return `
            <div class="connected-risk-item">
                <div class="connected-risk-header">
                    <span class="connected-risk-id" style="background: ${getRiskColor(connNode?.risk || 0.5)}">${conn.id}</span>
                    <span class="connected-risk-arrow">${arrow}</span>
                    <span class="connected-risk-prob">${(conn.prob * 100).toFixed(0)}%</span>
                </div>
                <div class="connected-risk-name">${name}</div>
                <div class="connected-risk-label">${label}</div>
            </div>
        `;
    }).join('');
}

// ============================================================================
// ZOOM CONTROLS
// ============================================================================

export function zoomIn() {
    if (svg && zoom) {
        svg.transition().duration(300).call(zoom.scaleBy, 1.3);
    }
}

export function zoomOut() {
    if (svg && zoom) {
        svg.transition().duration(300).call(zoom.scaleBy, 0.7);
    }
}

export function resetView() {
    if (svg && zoom) {
        svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
    }
}

// ============================================================================
// PUBLIC API
// ============================================================================

export function renderPredictiveTab() {
    initializeGraph();
    renderGraph();
}

// Re-render on window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const predictiveTab = document.getElementById('predictiveTab');
        if (predictiveTab && predictiveTab.classList.contains('active')) {
            renderGraph();
        }
    }, 250);
});
