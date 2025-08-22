import { Client } from '@stomp/stompjs';
import { useState, useEffect } from 'react';
import axios from 'axios';
import StockChart from '../components/StockChart'; 

const API_BASE = 'http://localhost:8090/api/watchlist';

export default function StockDashboard() {
  const [watchlist, setWatchlist] = useState([]);
  const [priceData, setPriceData] = useState({});
  const [priceHistory, setPriceHistory] = useState({}); 
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('jwtToken');

  // 관심 종목 불러오기
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await axios.get(API_BASE, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });

        let parsed = [];

        if (Array.isArray(res.data)) {
          parsed = res.data;
        } else if (Array.isArray(res.data.watchlist)) {
          parsed = res.data.watchlist;
        } else {
          console.warn('서버 응답이 예상된 배열 형식이 아닙니다.', res.data);
        }

        setWatchlist(parsed);
        setLoading(false);
      } catch (err) {
        console.error('관심 종목 불러오기 실패:', err);
        setWatchlist([]);
        setLoading(false);
      }
    };

    if (token) fetchWatchlist();
  }, [token]);

  // WebSocket 연결 및 구독
  useEffect(() => {
    if (!token || watchlist.length === 0) return;

    const client = new Client({
      webSocketFactory: () =>
        new WebSocket(`ws://localhost:8090/ws-stock?token=${token}`),
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('웹소켓 연결 성공');

        watchlist.forEach((stock) => {
          const stockId = stock.stockId || stock.id || (stock.stock?.id);
          if (!stockId) {
            console.warn('stockId 없음:', stock);
            return;
          }

          const topic = `/topic/stocks/${stockId}`;
          client.subscribe(topic, (message) => {
            const data = JSON.parse(message.body);

            setPriceData((prev) => ({
              ...prev,
              [stockId]: data,
            }));

            setPriceHistory((prev) => {
              const existing = prev[stockId] || [];
              const updated = [...existing.slice(-19), parseFloat(data.c)];
              return { ...prev, [stockId]: updated };
            });
          });
        });
      },
      onStompError: (frame) => {
        console.error('STOMP 오류:', frame);
      },
    });

    client.activate();
    return () => client.deactivate();
  }, [token, watchlist]);

  // 렌더링
  return (
    <div>
      <h1>📊 관심 종목 실시간 시세 + 차트</h1>

      {loading ? (
        <p>📡 불러오는 중...</p>
      ) : watchlist.length === 0 ? (
        <p>⭐ 관심 종목이 없습니다. 종목을 추가해주세요!</p>
      ) : (
        watchlist.map((stock) => {
          const stockId = stock.stockId || stock.id || (stock.stock?.id);
          const symbol = stock.symbol || stock.stock?.symbol || 'Unknown';
          const data = priceData[stockId];
          const history = priceHistory[stockId];

          return (
            <div
              key={stockId}
              style={{
                border: '1px solid #ccc',
                margin: '20px 10px',
                padding: '20px',
                borderRadius: '10px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <h3>🪙 {symbol}</h3>
              {data ? (
                <>
                  <p>📈 현재가: {data.c}</p>
                  <p>📉 변동률: {data.P}%</p>
                  <p>💹 거래량: {data.v}</p>
                  <div style={{ height: '200px', marginTop: '10px' }}>
                    <StockChart symbol={symbol} priceHistory={history} />
                  </div>
                </>
              ) : (
                <p>⏳ 데이터 수신 중...</p>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}