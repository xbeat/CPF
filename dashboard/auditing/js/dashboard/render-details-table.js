export function renderPrioritizationTable(org) {
    const tbody = document.getElementById('prioritizationTableBody');
    if (!tbody) return;

    const categories = org.aggregates?.by_category || {};
    const catNames = { 
        '1':'Authority', '2':'Temporal', '3':'Social', '4':'Affective', 
        '5':'Cognitive', '6':'Group', '7':'Stress', '8':'Unconscious', 
        '9':'AI-Enhanced', '10':'Convergent' 
    };
    const weights = { '1': 1.2, '2': 1.0, '3': 1.1, '4': 1.0, '5': 1.1, '6': 1.0, '7': 1.0, '8': 1.1, '9': 1.3, '10': 1.2 };

    let data = [];
    for (let cat = 1; cat <= 10; cat++) {
        const key = String(cat);
        const cData = categories[key];
        if (cData && cData.total_assessments > 0) {
            const risk = cData.avg_score;
            const completion = cData.completion_percentage / 100;
            const incompleteFactor = (1 - completion) * 0.3;
            const priority = risk * (weights[key]||1) * cData.avg_confidence * (1 + incompleteFactor);
            
            let rec = 'monitor';
            if (risk >= 0.66 || (risk >= 0.5 && completion < 0.5)) rec = 'critical';
            else if (risk >= 0.33) rec = 'review';

            data.push({
                cat: key, name: catNames[key], risk, conf: cData.avg_confidence, 
                comp: cData.completion_percentage, priority, rec
            });
        }
    }

    data.sort((a, b) => b.priority - a.priority);

    let html = '';
    data.forEach((d, i) => {
        const riskClass = d.risk < 0.33 ? 'risk-low' : d.risk < 0.66 ? 'risk-medium' : 'risk-high';
        html += `
            <tr data-action="open-category-modal" data-category-key="${d.cat}" class="priority-table-row clickable-row">
                <td style="font-weight:600;color:var(--text-light);padding:12px;">${i+1}</td>
                <td style="font-weight:600;padding:12px;">${d.cat}. ${d.name}</td>
                <td style="padding:12px;"><span class="stat-value ${riskClass}">${(d.risk*100).toFixed(1)}%</span></td>
                <td style="padding:12px;">${(d.conf*100).toFixed(0)}%</td>
                <td style="padding:12px;">${d.comp}%</td>
                <td style="font-weight:700;color:var(--primary);padding:12px;">${d.priority.toFixed(3)}</td>
                <td style="padding:12px;"><span class="recommendation-badge ${d.rec}">${d.rec}</span></td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}