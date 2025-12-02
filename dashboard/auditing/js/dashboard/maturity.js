import { getSelectedOrgData } from './state.js';

export function renderMaturityTab() {
    const container = document.getElementById('maturityTab');
    if (!container) {
        console.error('❌ maturityTab container not found');
        return;
    }

    const selectedOrgData = getSelectedOrgData();
    console.log('🔍 renderMaturityTab called', selectedOrgData);

    if (!selectedOrgData || !selectedOrgData.aggregates) {
        console.warn('⚠️ No selectedOrgData or aggregates');
        // DON'T overwrite HTML - just show message
        const messageDiv = container.querySelector('.matrix-header') || container;
        const tempMsg = document.createElement('div');
        tempMsg.style.cssText = 'padding:40px;text-align:center;background:white;border-radius:12px;margin:20px 0;';
        tempMsg.innerHTML = '<h3>⚠️ No Maturity Data</h3><p>Complete assessments to generate maturity model data.</p>';
        messageDiv.appendChild(tempMsg);
        return;
    }

    // Try to get maturity_model or compute it on the fly
    let mm = selectedOrgData.aggregates.maturity_model;

    if (!mm) {
        console.warn('⚠️ No maturity_model in aggregates, computing basic model...');
        // Compute basic maturity model from available data
        mm = computeBasicMaturityModel(selectedOrgData);
    }

    console.log('✅ Maturity Model data:', mm);

    // Helper per aggiornare testo
    const setText = (id, text) => { const el = document.getElementById(id); if(el) el.textContent = text; };
    const setClass = (id, cls) => { const el = document.getElementById(id); if(el) el.className = cls; };
    const setStyle = (id, prop, val) => { const el = document.getElementById(id); if(el) el.style[prop] = val; };

    // 1. Badge & Score
    const colors = { 0:'#dc2626', 1:'#ea580c', 2:'#f59e0b', 3:'#eab308', 4:'#84cc16', 5:'#22c55e' };
    setText('maturityLevelBadge', mm.maturity_level);
    setStyle('maturityLevelBadge', 'color', colors[mm.maturity_level]);
    setText('maturityLevelName', mm.level_name);
    setStyle('maturityLevelName', 'color', colors[mm.maturity_level]);
    
    // Description (static map or from server)
    const descs = [
        'Psychological blind spots pervasive.', 'Initial awareness emerging.', 
        'Foundational security culture.', 'Systematic approach.', 
        'Quantitatively managed.', 'Adaptive excellence.'
    ];
    setText('maturityLevelDescription', descs[mm.maturity_level] || '');

    // 2. CPF Score Gauge
    setText('cpfScoreValue', Math.round(mm.cpf_score));
    const circle = document.getElementById('cpfScoreCircle');
    if (circle) {
        const offset = (2 * Math.PI * 80) * (1 - mm.cpf_score / 100);
        circle.style.strokeDashoffset = offset;
        circle.style.stroke = mm.cpf_score >= 80 ? 'var(--success)' : mm.cpf_score >= 60 ? 'var(--warning)' : 'var(--danger)';
    }

    // 3. Progress Next Level
    if (mm.maturity_level < 5) {
        const min = mm.maturity_level * 20;
        const max = (mm.maturity_level + 1) * 20;
        const pct = Math.max(0, Math.min(100, ((mm.cpf_score - min) / (max - min)) * 100));
        
        setStyle('progressBar', 'width', pct + '%');
        setText('progressText', Math.round(pct) + '%');
        setText('nextLevelName', `Level ${mm.maturity_level + 1}`);
        setStyle('progressToNextLevel', 'display', 'block');
    } else {
        setStyle('progressToNextLevel', 'display', 'none');
    }

    // 4. Convergence Index
    setText('convergenceIndexValue', mm.convergence_index.toFixed(2));
    let convStatus = '';
    let convColor = '';
    if (mm.convergence_index < 2) {
        convStatus = '✅ Excellent - Low compound risk';
        convColor = 'var(--success)';
    } else if (mm.convergence_index < 5) {
        convStatus = '⚠️ Moderate - Monitor closely';
        convColor = 'var(--warning)';
    } else if (mm.convergence_index < 10) {
        convStatus = '🔴 High - Remediation needed';
        convColor = 'var(--danger)';
    } else {
        convStatus = '🚨 Critical - Immediate action required';
        convColor = 'var(--danger)';
    }
    setText('convergenceIndexStatus', convStatus);
    setStyle('convergenceIndexStatus', 'color', convColor);

    // 5. Sector Benchmark
    setText('sectorPercentileValue', mm.sector_benchmark?.percentile ? mm.sector_benchmark.percentile.toFixed(0) + '%' : 'N/A');
    if (mm.sector_benchmark?.gap !== undefined) {
        const gap = mm.sector_benchmark.gap;
        const gapText = gap >= 0 ?
            `+${gap.toFixed(1)} points above sector average` :
            `${gap.toFixed(1)} points below sector average`;
        setText('sectorComparison', gapText);
        setStyle('sectorComparison', 'color', gap >= 0 ? 'var(--success)' : 'var(--danger)');
    } else {
        setText('sectorComparison', 'N/A');
    }

    // 6. Domain Distribution (Green/Yellow/Red)
    setText('greenDomainsCount', mm.green_domains_count || 0);
    setText('yellowDomainsCount', mm.yellow_domains_count || 0);
    setText('redDomainsCount', mm.red_domains_count || 0);

    // 7. Regulatory Compliance Table
    const complianceTableBody = document.getElementById('complianceTableBody');
    if (complianceTableBody && mm.compliance) {
        const regulations = [
            { name: 'GDPR Article 32', key: 'gdpr', description: 'Data Protection Regulation' },
            { name: 'NIS2 Directive', key: 'nis2', description: 'Network & Information Security' },
            { name: 'DORA', key: 'dora', description: 'Digital Operational Resilience (Financial)' },
            { name: 'ISO 27001:2022', key: 'iso27001', description: 'Information Security Management' }
        ];

        let complianceHTML = '';
        regulations.forEach(reg => {
            const compliance = mm.compliance[reg.key];
            if (!compliance) return;

            const statusIcon = compliance.status === 'compliant' ? '✅' :
                compliance.status === 'at_risk' ? '⚠️' : '❌';
            const statusText = compliance.status === 'compliant' ? 'Compliant' :
                compliance.status === 'at_risk' ? 'At Risk' : 'Non-Compliant';
            const statusColor = compliance.status === 'compliant' ? 'var(--success)' :
                compliance.status === 'at_risk' ? 'var(--warning)' : 'var(--danger)';

            complianceHTML += `
                <tr style="border-bottom: 1px solid var(--border);">
                    <td style="padding: 12px;">
                        <div style="font-weight: 600;">${reg.name}</div>
                        <div style="font-size: 12px; color: var(--text-light);">${reg.description}</div>
                    </td>
                    <td style="padding: 12px; text-align: center;">
                        <span style="color: ${statusColor}; font-weight: 600;">${statusIcon} ${statusText}</span>
                    </td>
                    <td style="padding: 12px; text-align: center;">Level ${compliance.min_level_required}</td>
                    <td style="padding: 12px; text-align: center;">Level ${compliance.recommended_level}</td>
                    <td style="padding: 12px; text-align: center; font-weight: 600; color: var(--primary);">Level ${mm.maturity_level}</td>
                </tr>
            `;
        });
        complianceTableBody.innerHTML = complianceHTML;
    }

    // 7. Sector Benchmark Visual
    if (mm.sector_benchmark) {
        const yourScore = mm.cpf_score || 0;
        const sectorMean = mm.sector_benchmark.sector_mean || 50;
        const yourScorePercent = (yourScore / 100) * 100;
        const sectorMeanPercent = (sectorMean / 100) * 100;

        setStyle('yourScoreMarker', 'left', yourScorePercent + '%');
        setStyle('sectorMeanMarker', 'left', sectorMeanPercent + '%');
        setStyle('yourScoreLabel', 'left', yourScorePercent + '%');
        setStyle('sectorMeanLabel', 'left', sectorMeanPercent + '%');
        setText('yourScoreLabel', `Your Score: ${Math.round(yourScore)}`);
        setText('sectorMeanLabel', `Sector Mean: ${sectorMean}`);

        // Benchmark Stats
        const statsEl = document.getElementById('benchmarkStats');
        if (statsEl) {
            const selectedOrgData = getSelectedOrgData();
            statsEl.innerHTML = `
                <div style="padding: 10px; background: var(--bg-gray); border-radius: 6px;">
                    <div style="font-size: 12px; color: var(--text-light);">Sector Mean</div>
                    <div style="font-size: 20px; font-weight: 600;">${sectorMean}</div>
                </div>
                <div style="padding: 10px; background: var(--bg-gray); border-radius: 6px;">
                    <div style="font-size: 12px; color: var(--text-light);">Your Score</div>
                    <div style="font-size: 20px; font-weight: 600; color: var(--primary);">${Math.round(yourScore)}</div>
                </div>
                <div style="padding: 10px; background: var(--bg-gray); border-radius: 6px;">
                    <div style="font-size: 12px; color: var(--text-light);">Percentile Rank</div>
                    <div style="font-size: 20px; font-weight: 600;">${mm.sector_benchmark.percentile.toFixed(0)}th</div>
                </div>
                <div style="padding: 10px; background: var(--bg-gray); border-radius: 6px;">
                    <div style="font-size: 12px; color: var(--text-light);">Sector</div>
                    <div style="font-size: 16px; font-weight: 600;">${selectedOrgData.industry || 'N/A'}</div>
                </div>
            `;
        }
    }

    // 8. Certification Path
    const certPath = document.getElementById('certificationPath');
    if (certPath && mm.certification_path) {
        const certifications = [
            { id: 'CPF-F', level: 1, name: 'Foundation', cost: '€500', duration: '2 days' },
            { id: 'CPF-P', level: 2, name: 'Practitioner', cost: '€1,500', duration: '5 days' },
            { id: 'CPF-E', level: 4, name: 'Expert', cost: '€3,500', duration: '10 days' },
            { id: 'CPF-M', level: 5, name: 'Master', cost: 'Invitation only', duration: 'Research required' }
        ];

        let certPathHTML = '';
        // Support both eligible_for (db_json) and eligible (dataManager) structures
        const eligibleList = mm.certification_path.eligible_for || mm.certification_path.eligible || [];

        certifications.forEach(cert => {
            const isEligible = eligibleList.includes(cert.id);
            const isCurrent = mm.certification_path.current_certification === cert.id;

            certPathHTML += `
                <div style="text-align: center; padding: 20px; background: ${isEligible ? 'var(--bg-success)' : 'var(--bg-gray)'}; border-radius: 12px; min-width: 150px; position: relative;">
                    ${isCurrent ? '<div style="position: absolute; top: -10px; right: -10px; background: var(--primary); color: white; padding: 5px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;">CURRENT</div>' : ''}
                    <div style="font-size: 32px; margin-bottom: 10px;">${isEligible ? '🎖️' : '🔒'}</div>
                    <div style="font-size: 18px; font-weight: 700; margin-bottom: 5px;">${cert.id}</div>
                    <div style="font-size: 14px; color: var(--text-light); margin-bottom: 10px;">${cert.name}</div>
                    <div style="font-size: 12px; color: var(--text-light);">Level ${cert.level}+</div>
                    <div style="font-size: 12px; color: var(--text-light); margin-top: 5px;">${cert.cost}</div>
                    <div style="font-size: 11px; color: var(--text-light);">${cert.duration}</div>
                </div>
            `;
        });
        certPath.innerHTML = certPathHTML;
    }

    // 9. ROI Analysis (if next level exists)
    if (mm.maturity_level < 5 && mm.roi_analysis) {
        const roi = mm.roi_analysis;
        const roiContainer = document.getElementById('roiAnalysisContainer');
        if (roiContainer) roiContainer.style.display = 'block';

        setText('roiInvestment', `€${(roi.estimated_investment / 1000).toFixed(0)}k`);
        setText('roiAnnualBenefit', `€${(roi.annual_benefit / 1000).toFixed(0)}k`);
        setText('roiPayback', `${roi.payback_months} months`);
        setText('roiNPV', `€${(roi.npv_5yr / 1000000).toFixed(1)}M`);
    } else {
        const roiContainer = document.getElementById('roiAnalysisContainer');
        if (roiContainer) roiContainer.style.display = 'none';
    }
}

// Compute basic maturity model if backend doesn't provide it
function computeBasicMaturityModel(org) {
    const aggregates = org.aggregates || {};
    const categories = aggregates.by_category || {};

    // Calculate CPF Score (0-100)
    let totalScore = 0;
    let categoryCount = 0;
    let greenCount = 0, yellowCount = 0, redCount = 0;

    Object.values(categories).forEach(cat => {
        if (cat && cat.avg_score !== undefined) {
            totalScore += (1 - cat.avg_score); // Invert: lower vulnerability = higher score
            categoryCount++;

            // Classify domain
            if (cat.avg_score < 0.33) greenCount++;
            else if (cat.avg_score < 0.66) yellowCount++;
            else redCount++;
        }
    });

    const cpfScore = categoryCount > 0 ? (totalScore / categoryCount) * 100 : 0;
    const maturityLevel = cpfScore >= 80 ? 5 : cpfScore >= 60 ? 4 : cpfScore >= 40 ? 3 : cpfScore >= 20 ? 2 : cpfScore >= 10 ? 1 : 0;
    const levelNames = ['Initial', 'Developing', 'Defined', 'Managed', 'Optimizing', 'Adaptive'];

    // Convergence Index (similarity between categories)
    let convergenceIndex = 0;
    if (categoryCount > 1) {
        const avgScore = totalScore / categoryCount;
        let variance = 0;
        Object.values(categories).forEach(cat => {
            if (cat && cat.avg_score !== undefined) {
                const inverted = 1 - cat.avg_score;
                variance += Math.pow(inverted - avgScore, 2);
            }
        });
        variance /= categoryCount;
        const stdDev = Math.sqrt(variance);
        convergenceIndex = Math.max(0, 1 - stdDev);
    }

    // Compliance (mock data)
    const compliance = {
        'gdpr': { status: maturityLevel >= 2 ? 'compliant' : 'not_compliant', min_level_required: 1, recommended_level: 2 },
        'nis2': { status: maturityLevel >= 2 ? 'compliant' : 'not_compliant', min_level_required: 2, recommended_level: 3 },
        'dora': { status: maturityLevel >= 2 ? 'compliant' : 'at_risk', min_level_required: 2, recommended_level: 3 },
        'iso27001': { status: maturityLevel >= 1 ? 'compliant' : 'not_compliant', min_level_required: 1, recommended_level: 2 }
    };

    // Sector Benchmark (mock data)
    const sectorMean = 50;
    const sectorBenchmark = {
        percentile: Math.min(99, Math.max(1, cpfScore * 0.7 + Math.random() * 10)), // Mock percentile
        sector_mean: sectorMean,
        gap: cpfScore - sectorMean,
        sample_size: 'N/A'
    };

    // Certification Path
    const eligibleCerts = [];
    if (maturityLevel >= 1) eligibleCerts.push('CPF-F');
    if (maturityLevel >= 2) eligibleCerts.push('CPF-P');
    if (maturityLevel >= 4) eligibleCerts.push('CPF-E');
    if (maturityLevel >= 5) eligibleCerts.push('CPF-M');

    const certificationPath = {
        eligible_for: eligibleCerts,
        current_certification: eligibleCerts.length > 0 ? eligibleCerts[eligibleCerts.length - 1] : null
    };

    // ROI Analysis (mock data)
    const roiAnalysis = maturityLevel < 5 ? {
        estimated_investment: 50000,
        annual_benefit: 150000,
        payback_months: 4,
        npv_5yr: 500000
    } : null;

    return {
        cpf_score: cpfScore,
        maturity_level: maturityLevel,
        level_name: levelNames[maturityLevel],
        convergence_index: convergenceIndex,
        green_domains_count: greenCount,
        yellow_domains_count: yellowCount,
        red_domains_count: redCount,
        compliance,
        sector_benchmark: sectorBenchmark,
        certification_path: certificationPath,
        roi_analysis: roiAnalysis
    };
}