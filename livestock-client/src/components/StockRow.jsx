import { useEffect, useState } from 'react';
import StockChart from './StockChart';
import WatchlistButton from './WatchlistButton';
import { fetchHistory } from '../api/stockApi';

const fmt = (n) => (n ?? 0).toLocaleString();

export default function StockRow({ item, index }) {
  const [history, setHistory] = useState([]);
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    let alive = true;
    (async () => {
      const h = await fetchHistory(item.id, 30);
      if (alive) setHistory(h);
    })();
    return () => { alive = false; };
  }, [item.id]);

  const change = Number(item.changeRate ?? 0);
  const up = change >= 0;

  return (
    <tr>
      <td className="text-muted">{index + 1}</td>
      <td className="fw-semibold">{item.symbol}</td>
      <td>{item.name}</td>
      <td>{fmt(Number(item.price))}</td>
      <td className={up ? 'text-success' : 'text-danger'}>
        {up ? '▲' : '▼'} {change.toFixed(2)}%
      </td>
      <td>{fmt(item.volume)}</td>
      <td>
        {history.length > 2 ? (
          <div style={{ height: 60 }}>
            <StockChart symbol={item.symbol} priceHistory={history} height={60} mini />
          </div>
        ) : (
          <span className="text-secondary small d-block text-center">히스토리 없음</span>
        )}
      </td>
      <td className="text-center">
        {token ? <WatchlistButton stockId={item.id} initialInWatchlist={false} /> : '-'}
      </td>
    </tr>
  );
}
