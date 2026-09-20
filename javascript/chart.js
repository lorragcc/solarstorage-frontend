/**
 * Módulo de Gráficos (Chart.js)
 * Projeto: SolarStorage — Gestão Fotovoltaica & Baterias
 */

let meuGrafico = null;

function renderizarGrafico(usinas) {
    const canvas = document.getElementById('graficoUsinas') || document.getElementById('myChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const labels = usinas.map(u => u.nome);
    const dadosPotencia = usinas.map(u => u.potencia_kwp);
    const dadosArmazenamento = usinas.map(u => u.capacidade_util_total_kwh || 0);

    if (meuGrafico) {
        meuGrafico.destroy();
    }

    meuGrafico = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Potência Solar (kWp)',
                    data: dadosPotencia,
                    backgroundColor: 'rgba(245, 158, 11, 0.75)',
                    borderColor: '#f59e0b',
                    borderWidth: 1.5,
                    borderRadius: 6,
                    yAxisID: 'y'
                },
                {
                    label: 'Armazenamento Bateria (kWh)',
                    data: dadosArmazenamento,
                    type: 'line',
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    borderWidth: 3,
                    pointRadius: 5,
                    pointBackgroundColor: '#10b981',
                    fill: false,
                    tension: 0.3,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#9ca3af' }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Potência Solar (kWp)',
                        color: '#f59e0b',
                        font: { weight: 'bold' }
                    },
                    ticks: { color: '#f59e0b' },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Capacidade Bateria (kWh)',
                        color: '#10b981',
                        font: { weight: 'bold' }
                    },
                    ticks: { color: '#10b981' },
                    grid: { drawOnChartArea: false }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#e5e7eb' }
                }
            }
        }
    });
}