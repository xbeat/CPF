let securityRadarChartInstance = null;

export function renderSecurityRadarChart(org) {
    const canvas = document.getElementById('securityRadarChart');
    const statsDiv = document.getElementById('radarStats');
    if (!canvas) return;

    const categories = org.aggregates?.by_category || {};

    const categoryNames = {
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

    // Prepare data for radar chart
    const labels = [];
    const riskData = [];
    const confidenceData = [];
    const completionData = [];

    for (let cat = 1; cat <= 10; cat++) {
        const catKey = cat.toString();
        const catData = categories[catKey];

        labels.push(categoryNames[catKey]);
        riskData.push(catData ? (catData.avg_score * 100) : 0);
        confidenceData.push(catData ? (catData.avg_confidence * 100) : 0);
        completionData.push(catData ? catData.completion_percentage : 0);
    }

    // Destroy existing chart if it exists
    if (securityRadarChartInstance) {
        securityRadarChartInstance.destroy();
    }

    // Create radar chart
    const ctx = canvas.getContext('2d');
    securityRadarChartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Risk Level (%)',
                    data: riskData,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Confidence (%)',
                    data: confidenceData,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
                    pointRadius: 4,
                    pointHoverRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.2,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 14,
                            weight: '600'
                        },
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.r.toFixed(1)}%`;
                        },
                        afterLabel: function(context) {
                            const catIndex = context.dataIndex;
                            return `Completion: ${completionData[catIndex].toFixed(0)}%`;
                        }
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        font: {
                            size: 11
                        },
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    pointLabels: {
                        font: {
                            size: 12,
                            weight: '600'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            },
            interaction: {
                mode: 'point',
                intersect: true
            }
        }
    });

    // Render quick stats
    const avgRisk = riskData.reduce((a, b) => a + b, 0) / riskData.filter(r => r > 0).length || 0;
    const avgConfidence = confidenceData.reduce((a, b) => a + b, 0) / confidenceData.filter(c => c > 0).length || 0;
    const avgCompletion = completionData.reduce((a, b) => a + b, 0) / 10;

    const highRiskCategories = riskData.filter(r => r >= 70).length;
    const mediumRiskCategories = riskData.filter(r => r >= 40 && r < 70).length;
    const lowRiskCategories = riskData.filter(r => r > 0 && r < 40).length;

    if (statsDiv) {
        statsDiv.innerHTML = `
            <div style="margin-bottom: 15px;">
                <div style="font-size: 12px; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">AVERAGE RISK</div>
                <div style="font-size: 28px; font-weight: 700; color: ${avgRisk >= 70 ? '#ff6b6b' : avgRisk >= 40 ? '#ffd93d' : '#6bcf7f'};">${avgRisk.toFixed(1)}%</div>
            </div>
            <div style="margin-bottom: 15px;">
                <div style="font-size: 12px; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">AVERAGE CONFIDENCE</div>
                <div style="font-size: 28px; font-weight: 700; color: var(--primary);">${avgConfidence.toFixed(1)}%</div>
            </div>
            <div style="margin-bottom: 20px;">
                <div style="font-size: 12px; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">OVERALL COMPLETION</div>
                <div style="font-size: 28px; font-weight: 700; color: var(--primary);">${avgCompletion.toFixed(1)}%</div>
            </div>
            <hr style="border: 0; border-top: 1px solid var(--border); margin: 20px 0;">
            <div style="font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 10px;">Risk Distribution:</div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 13px;">🔴 High Risk (≥70%)</span>
                    <span style="font-weight: 700; color: #ff6b6b;">${highRiskCategories}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 13px;">🟡 Medium Risk (40-69%)</span>
                    <span style="font-weight: 700; color: #ffd93d;">${mediumRiskCategories}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 13px;">🟢 Low Risk (<40%)</span>
                    <span style="font-weight: 700; color: #6bcf7f;">${lowRiskCategories}</span>
                </div>
            </div>
        `;
    }
}
