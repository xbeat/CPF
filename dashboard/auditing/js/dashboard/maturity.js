import { selectedOrgData } from './state.js';

export function renderMaturityTab() {
    const container = document.getElementById('maturityTab');
    if (!container) return;

    if (!selectedOrgData || !selectedOrgData.aggregates || !selectedOrgData.aggregates.maturity_model) {
        container.innerHTML = '<div style="padding:40px;text-align:center"><h3>⚠️ No Maturity Data</h3><p>Complete assessments to generate.</p></div>';
        return;
    }

    const mm = selectedOrgData.aggregates.maturity_model;

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

    // 4. Convergence & Benchmark
    setText('convergenceIndexValue', mm.convergence_index.toFixed(2));
    const convStatus = mm.convergence_index >= 0.8 ? '✅ Strong alignment' : mm.convergence_index >= 0.5 ? '⚠️ Moderate alignment' : '❌ Weak alignment';
    setText('convergenceIndexStatus', convStatus);

    setText('sectorPercentileValue', mm.sector_benchmark?.percentile ? mm.sector_benchmark.percentile.toFixed(0) + '%' : 'N/A');
    const sectorComp = mm.sector_benchmark?.percentile >= 75 ? '🥇 Top performer' : mm.sector_benchmark?.percentile >= 50 ? '✅ Above average' : '⚠️ Below average';
    setText('sectorComparison', sectorComp);

    // 5. Domain Distribution (Green/Yellow/Red)
    if (mm.domain_distribution) {
        setText('greenDomainsCount', mm.domain_distribution.green || 0);
        setText('yellowDomainsCount', mm.domain_distribution.yellow || 0);
        setText('redDomainsCount', mm.domain_distribution.red || 0);
    }

    // 6. Compliance Table
    const compTable = document.getElementById('complianceTableBody');
    if (compTable && mm.compliance) {
        let html = '';
        Object.entries(mm.compliance).forEach(([key, val]) => {
            const statusIcon = val.status === 'compliant' ? '✅' : val.status === 'at_risk' ? '⚠️' : '❌';
            const statusColor = val.status === 'compliant' ? 'var(--success)' : val.status === 'at_risk' ? 'var(--warning)' : 'var(--danger)';
            html += `
                <tr>
                    <td style="padding:12px;"><strong>${key.toUpperCase()}</strong></td>
                    <td style="padding:12px;text-align:center;color:${statusColor};">${statusIcon} ${val.status.replace('_', ' ')}</td>
                    <td style="padding:12px;text-align:center;">Lvl ${val.min_level_required || 0}</td>
                    <td style="padding:12px;text-align:center;">Lvl ${val.recommended_level || val.min_level_required || 1}</td>
                    <td style="padding:12px;text-align:center;font-weight:bold;">Lvl ${mm.maturity_level}</td>
                </tr>`;
        });
        compTable.innerHTML = html;
    }

    // 7. Sector Benchmark Visual
    if (mm.sector_benchmark) {
        const yourScore = mm.cpf_score || 0;
        const sectorMean = mm.sector_benchmark.mean || 50;
        const yourPosition = Math.min(100, Math.max(0, yourScore));
        const meanPosition = Math.min(100, Math.max(0, sectorMean));

        setStyle('yourScoreMarker', 'left', yourPosition + '%');
        setStyle('sectorMeanMarker', 'left', meanPosition + '%');
        setText('yourScoreLabel', `Your Score: ${yourScore.toFixed(0)}`);
        setText('sectorMeanLabel', `Sector Mean: ${sectorMean.toFixed(0)}`);

        // Benchmark Stats
        const statsEl = document.getElementById('benchmarkStats');
        if (statsEl) {
            statsEl.innerHTML = `
                <div style="padding:10px;background:var(--bg-gray);border-radius:8px;">
                    <strong>Percentile:</strong> ${mm.sector_benchmark.percentile?.toFixed(0) || 'N/A'}%
                </div>
                <div style="padding:10px;background:var(--bg-gray);border-radius:8px;">
                    <strong>Sample Size:</strong> ${mm.sector_benchmark.sample_size || 'N/A'} organizations
                </div>
                <div style="padding:10px;background:var(--bg-gray);border-radius:8px;">
                    <strong>Your Position:</strong> ${yourScore > sectorMean ? 'Above average ⬆️' : yourScore < sectorMean ? 'Below average ⬇️' : 'Average ➡️'}
                </div>
            `;
        }
    }

    // 8. Certification Path
    const certPath = document.getElementById('certificationPath');
    if (certPath && mm.certifications) {
        let html = '';
        ['CPF Foundation', 'CPF Practitioner', 'CPF Advanced', 'CPF Expert', 'CPF Master'].forEach((cert, idx) => {
            const reqLevel = idx + 1;
            const achieved = mm.maturity_level >= reqLevel;
            const color = achieved ? 'var(--success)' : 'var(--text-light)';
            html += `
                <div style="text-align:center;flex:1;min-width:120px;">
                    <div style="width:80px;height:80px;margin:0 auto;border-radius:50%;background:${achieved ? 'var(--success)' : '#e5e7eb'};display:flex;align-items:center;justify-content:center;font-size:32px;color:white;">
                        ${achieved ? '🏆' : '🔒'}
                    </div>
                    <div style="margin-top:10px;font-weight:600;color:${color};">${cert}</div>
                    <div style="font-size:12px;color:var(--text-light);margin-top:5px;">Level ${reqLevel}+</div>
                </div>
            `;
        });
        certPath.innerHTML = html;
    }

    // 9. ROI Analysis (if next level exists)
    if (mm.maturity_level < 5 && mm.roi_analysis) {
        const roiContainer = document.getElementById('roiAnalysisContainer');
        if (roiContainer) roiContainer.style.display = 'block';

        setText('roiInvestment', mm.roi_analysis.investment_required || 'N/A');
        setText('roiAnnualBenefit', mm.roi_analysis.annual_benefit || 'N/A');
        setText('roiPayback', mm.roi_analysis.payback_period || 'N/A');
        setText('roiNPV', mm.roi_analysis.npv_5_year || 'N/A');
    } else {
        const roiContainer = document.getElementById('roiAnalysisContainer');
        if (roiContainer) roiContainer.style.display = 'none';
    }
}