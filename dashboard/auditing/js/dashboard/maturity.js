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
    setText('sectorPercentileValue', mm.sector_benchmark.percentile.toFixed(0) + '%');
    
    // 5. Compliance Table
    const compTable = document.getElementById('complianceTableBody');
    if (compTable && mm.compliance) {
        let html = '';
        Object.entries(mm.compliance).forEach(([key, val]) => {
            const statusIcon = val.status === 'compliant' ? '✅' : val.status === 'at_risk' ? '⚠️' : '❌';
            html += `
                <tr>
                    <td style="padding:12px;"><strong>${key.toUpperCase()}</strong></td>
                    <td style="padding:12px;text-align:center;">${statusIcon} ${val.status}</td>
                    <td style="padding:12px;text-align:center;">Lvl ${val.min_level_required}</td>
                    <td style="padding:12px;text-align:center;">Lvl ${mm.maturity_level}</td>
                </tr>`;
        });
        compTable.innerHTML = html;
    }
}