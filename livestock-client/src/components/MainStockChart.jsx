import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const MainStockChart = ({ symbol, prices = [], type = 'line', height = 120 }) => {
  const canvasRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || prices.length < 2) return;
    const ctx = canvasRef.current.getContext('2d');
    if (chartInstance.current) chartInstance.current.destroy();

    const isArea = type === 'area';

    chartInstance.current = new Chart(ctx, {
      type: isArea ? 'line' : type, // area는 line + fill
      data: {
        labels: prices.map((_, i) => i),
        datasets: [{
          data: prices,
          backgroundColor: isArea ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
          borderColor: prices.at(-1) >= prices[0] ? '#4caf50' : '#f44336',
          borderWidth: 2,
          fill: isArea,
          tension: 0.4,
          pointRadius: 0,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        },
        scales: {
          x: { display: false },
          y: { display: false }
        }
      }
    });
  }, [prices, type]);

  return (
    <div className="text-center">
      <div style={{ width: '100%', height }}>
        <canvas ref={canvasRef} />
      </div>
      <div className="text-muted small mt-2">{symbol}</div>
    </div>
  );
};

export default MainStockChart;
