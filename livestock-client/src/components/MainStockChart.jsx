import { useEffect, useMemo, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const MainStockChart = ({ symbol, prices = [], type = 'line', height = 120 }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  // 1) 숫자만 사용
  const clean = prices
    .map(v => (typeof v === 'number' ? v : Number(v)))
    .filter(Number.isFinite);

  const { upColor, downColor } = useMemo(
    () => ({ upColor: '#2e7d32', downColor: '#c62828' }),
    []
  );

  const makeGradient = (ctx, h, isUp) => {
    const H = h || ctx.canvas.getBoundingClientRect().height || 160; // ✅ 0 대비
    const g = ctx.createLinearGradient(0, 0, 0, H);
    if (isUp) {
      g.addColorStop(0, 'rgba(46,125,50,0.25)');
      g.addColorStop(1, 'rgba(46,125,50,0.02)');
    } else {
      g.addColorStop(0, 'rgba(198,40,40,0.25)');
      g.addColorStop(1, 'rgba(198,40,40,0.02)');
    }
    return g;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (clean.length < 2) {
      if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
      return;
    }

    const ctx = canvas.getContext('2d');
    const isArea = type === 'area';
    const isUp = clean.at(-1) >= clean[0];
    const bg = isArea ? makeGradient(ctx, canvas.height, isUp) : 'transparent';
    const borderColor = isUp ? upColor : downColor;

    // x,y 포인트 생성
    const points = clean.map((y, x) => ({ x, y }));

    if (!chartRef.current) {
      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          // ✅ labels 없이 datasets만 사용 (parsing:false + x,y)
          datasets: [{
            data: points,
            parsing: false,
            borderColor,
            backgroundColor: bg,
            borderWidth: 2,
            fill: isArea,
            tension: 0.4,
            pointRadius: 0,
            spanGaps: true,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 180 },
          plugins: {
            legend: { display: false },
            tooltip: { enabled: true, intersect: false, mode: 'index' }
          },
          scales: {
            // ✅ 카테고리 → 선형 축으로 변경 (핵심 수정)
            x: { type: 'linear', display: false },
            y: { display: false }
          }
        }
      });
    } else {
      const chart = chartRef.current;
      chart.data.datasets[0].data = points;
      chart.data.datasets[0].borderColor = borderColor;
      chart.data.datasets[0].backgroundColor = bg;
      chart.update();
    }
  }, [clean, type, upColor, downColor]);

  if (clean.length < 2) {
    return (
      <div className="text-center">
        <div className="d-flex align-items-center justify-content-center border rounded-3"
             style={{ width: '100%', height }}>
          <span className="text-muted small">데이터 없음</span>
        </div>
        <div className="text-muted small mt-2">{symbol}</div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div style={{ width: '100%', height }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="text-muted small mt-2">{symbol}</div>
    </div>
  );
};

export default MainStockChart;
