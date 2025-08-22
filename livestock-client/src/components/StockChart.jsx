import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const StockChart = ({ symbol, priceHistory, height = 80, mini = true }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !priceHistory || priceHistory.length === 0) return;
    const ctx = chartRef.current.getContext('2d');
    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: priceHistory.map((_, i) => i + 1),
        datasets: [
          {
            label: mini ? '' : `${symbol} 가격`,
            data: priceHistory,
            borderWidth: 2,
            fill: false,
            tension: 0.3,
            pointRadius: mini ? 0 : 2
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: !mini },
          tooltip: { enabled: true }
        },
        scales: mini
          ? { x: { display: false }, y: { display: false } }
          : { y: { beginAtZero: false } }
      },
    });
  }, [priceHistory, symbol, mini]);

  return <canvas ref={chartRef} style={{ height }} />;
};

export default StockChart;
