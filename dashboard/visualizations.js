/**
 * CPF Dashboard Visualizations
 *
 * Charts and graphs for SOC vs Human convergence
 */

function renderConvergenceChart(orgData) {
    const canvas = document.getElementById('convergence-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Set canvas size
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = 300;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Aggregate SOC and Human data over time
    const socTimeline = [];
    const humanTimeline = [];

    // Collect all data points
    for (const [id, indicator] of Object.entries(orgData.indicators)) {
        if (indicator.soc_values) {
            indicator.soc_values.forEach(soc => {
                socTimeline.push({
                    timestamp: new Date(soc.timestamp),
                    value: soc.value
                });
            });
        }

        if (indicator.human_values) {
            indicator.human_values.forEach(human => {
                humanTimeline.push({
                    timestamp: new Date(human.timestamp),
                    value: human.value
                });
            });
        }
    }

    // Sort by timestamp
    socTimeline.sort((a, b) => a.timestamp - b.timestamp);
    humanTimeline.sort((a, b) => a.timestamp - b.timestamp);

    // Group by day and average
    const socByDay = groupByDay(socTimeline);
    const humanByDay = groupByDay(humanTimeline);

    // Get all unique dates
    const allDates = [...new Set([...Object.keys(socByDay), ...Object.keys(humanByDay)])].sort();

    if (allDates.length === 0) {
        ctx.fillStyle = '#7f8c8d';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('No data available', canvas.width / 2, canvas.height / 2);
        return;
    }

    // Chart dimensions
    const padding = 50;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;

    // Scales
    const xScale = chartWidth / (allDates.length - 1 || 1);
    const yScale = chartHeight;

    // Draw axes
    ctx.strokeStyle = '#ecf0f1';
    ctx.lineWidth = 2;

    // Y axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.stroke();

    // X axis
    ctx.beginPath();
    ctx.moveTo(padding, padding + chartHeight);
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.stroke();

    // Y axis labels (0%, 50%, 100%)
    ctx.fillStyle = '#7f8c8d';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';

    [0, 0.5, 1].forEach(val => {
        const y = padding + chartHeight - (val * chartHeight);
        ctx.fillText((val * 100).toFixed(0) + '%', padding - 10, y + 4);

        // Grid line
        ctx.strokeStyle = '#ecf0f120';
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + chartWidth, y);
        ctx.stroke();
    });

    // Draw SOC line
    if (Object.keys(socByDay).length > 0) {
        drawLine(ctx, socByDay, allDates, padding, chartHeight, xScale, yScale, '#3498db', 'SOC');
    }

    // Draw Human line
    if (Object.keys(humanByDay).length > 0) {
        drawLine(ctx, humanByDay, allDates, padding, chartHeight, xScale, yScale, '#e94560', 'Human');
    }

    // Legend
    drawLegend(ctx, canvas.width, padding);
}

function groupByDay(timeline) {
    const byDay = {};

    timeline.forEach(point => {
        const dateKey = point.timestamp.toISOString().split('T')[0];

        if (!byDay[dateKey]) {
            byDay[dateKey] = [];
        }
        byDay[dateKey].push(point.value);
    });

    // Average values per day
    const averaged = {};
    for (const [date, values] of Object.entries(byDay)) {
        averaged[date] = values.reduce((a, b) => a + b, 0) / values.length;
    }

    return averaged;
}

function drawLine(ctx, dataByDay, allDates, padding, chartHeight, xScale, yScale, color, label) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();

    let firstPoint = true;

    allDates.forEach((date, i) => {
        const value = dataByDay[date];

        if (value !== undefined) {
            const x = padding + i * xScale;
            const y = padding + chartHeight - (value * yScale);

            if (firstPoint) {
                ctx.moveTo(x, y);
                firstPoint = false;
            } else {
                ctx.lineTo(x, y);
            }

            // Draw point
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    ctx.stroke();
}

function drawLegend(ctx, canvasWidth, padding) {
    const legendX = canvasWidth - 150;
    const legendY = padding + 20;

    // SOC
    ctx.fillStyle = '#3498db';
    ctx.fillRect(legendX, legendY, 20, 3);
    ctx.fillStyle = '#2c3e50';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('SOC (Machine)', legendX + 30, legendY + 4);

    // Human
    ctx.fillStyle = '#e94560';
    ctx.fillRect(legendX, legendY + 25, 20, 3);
    ctx.fillStyle = '#2c3e50';
    ctx.fillText('Human (Auditor)', legendX + 30, legendY + 29);
}

// Redraw chart on window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (currentOrgId && organizationsData) {
            const org = organizationsData.organizations[currentOrgId];
            if (org) {
                renderConvergenceChart(org);
            }
        }
    }, 250);
});
