let securityRadarChartInstance = null;

export function renderSecurityRadarChart(org) {
    const canvas = document.getElementById('securityRadarChart');
    const statsDiv = document.getElementById('radarStats');
    if (!canvas) return;

    const categories = org.aggregates?.by_category || {};
    const catNames = { 
        '1':'Authority', '2':'Temporal', '3':'Social', '4':'Affective', 
        '5':'Cognitive', '6':'Group', '7':'Stress', '8':'Unconscious', 
        '9':'AI-Enhanced', '10':'Convergent' 
    };

    const labels = [];
    const riskData = [];
    const confData = [];
    const compData = [];

    for (let i = 1; i <= 10; i++) {
        const key = String(i);
        const d = categories[key];
        labels.push(catNames[key]);
        riskData.push(d ? d.avg_score * 100 : 0);
        confData.push(d ? d.avg_confidence * 100 : 0);
        compData.push(d ? d.completion_percentage : 0);
    }

    if (securityRadarChartInstance) {
        securityRadarChartInstance.destroy();
    }

    const ctx = canvas.getContext('2d');
    securityRadarChartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Risk %',
                    data: riskData,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(255, 99, 132, 1)'
                },
                {
                    label: 'Confidence %',
                    data: confData,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(54, 162, 235, 1)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.2,
            scales: { r: { beginAtZero: true, max: 100 } },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.dataset.label}: ${ctx.raw.toFixed(1)}%`,
                        afterLabel: ctx => `Completion: ${compData[ctx.dataIndex]}%`
                    }
                }
            }
        }
    });

    // Stats
    if (statsDiv) {
        const avgRisk = riskData.reduce((a,b)=>a+b,0) / (riskData.filter(x=>x>0).length || 1);
        const highRiskC = riskData.filter(r => r >= 70).length;
        const medRiskC = riskData.filter(r => r >= 40 && r < 70).length;
        const lowRiskC = riskData.filter(r => r > 0 && r < 40).length;

        statsDiv.innerHTML = `
            <div style="margin-bottom:15px;">
                <div style="font-size:12px;color:var(--text-light);">Average Risk</div>
                <div style="font-size:28px;font-weight:700;">${avgRisk.toFixed(1)}%</div>
            </div>
            <div style="font-size:13px;font-weight:600;margin-bottom:10px;">Risk Distribution</div>
            <div style="display:flex;flex-direction:column;gap:8px;">
                <div style="display:flex;justify-content:space-between;"><span style="color:#ff6b6b">High</span><strong>${highRiskC}</strong></div>
                <div style="display:flex;justify-content:space-between;"><span style="color:#ffd93d">Medium</span><strong>${medRiskC}</strong></div>
                <div style="display:flex;justify-content:space-between;"><span style="color:#6bcf7f">Low</span><strong>${lowRiskC}</strong></div>
            </div>
        `;
    }
}