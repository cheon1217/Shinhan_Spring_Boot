import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { CandlestickController, CandlestickElement, OhlcController, OhlcElement } from 'chartjs-chart-financial';

Chart.register(
  ...registerables,
  CandlestickController,
  CandlestickElement,
  OhlcController,
  OhlcElement
);

const CandleChart = ({ symbol, ohlcData = [] }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || ohlcData.length < 2) return;
    const ctx = canvasRef.current.getContext('2d');
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(ctx, {
      type: 'candlestick',
      data: {
        datasets: [{
          label: symbol,
          data: ohlcData, // [{x, o, h, l, c}]
          borderColor: '#333',
          color: {
            up: '#4caf50',
            down: '#f44336',
            unchanged: '#999',
          }
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            type: 'timeseries',
            time: {
              tooltipFormat: 'MMM d HH:mm'
            }
          },
          y: {
            beginAtZero: false
          }
        }
      }
    });
  }, [ohlcData, symbol]);

  return (
    <div className="text-center">
      <div style={{ width: '100%', height: '180px' }}>
        <canvas ref={canvasRef} />
      </div>
      <div className="text-muted small mt-2">{symbol}</div>
    </div>
  );
};

export default CandleChart;
