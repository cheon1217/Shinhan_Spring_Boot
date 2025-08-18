import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8090/api/watchlist'; // 포트 수정

export default function StockDashboard() {
  const [priceData, setPriceData] = useState(null);
  const [inWatchlist, setInWatchlist] = useState(false);
  const token = localStorage.getItem('jwtToken');
  const stockId = 1; // BTC/USDT의 stockId라고 가정

  // WebSocket으로 실시간 가격 수신
  useEffect(() => {
    const socket = new SockJS(`http://localhost:8090/ws-stock`);
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onConnect: () => {
        client.subscribe('/topic/stocks', (message) => {
          const data = JSON.parse(message.body);
          setPriceData(data);
        });
      },
      debug: (str) => console.log(str),
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [token]);

  // 관심 종목인지 여부 확인
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await axios.get(`${API_BASE}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        const stockIds = res.data.map((item) => item.stockId);
        setInWatchlist(stockIds.includes(stockId));
      } catch (err) {
        console.error('관심 목록 불러오기 실패:', err);
      }
    };

    if (token) {
      fetchWatchlist();
    }
  }, [token]);

  // 관심 종목 토글 핸들러
  const toggleWatchlist = async () => {
    try {
      if (inWatchlist) {
        await axios.delete(`${API_BASE}/remove/${stockId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
      } else {
        await axios.post(`${API_BASE}/add`, { stockId }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
      }
      setInWatchlist(!inWatchlist);
    } catch (err) {
      console.error('관심 종목 토글 실패:', err);
      alert('로그인 필요 또는 서버 오류입니다.');
    }
  };

  return (
    <div>
      <h1>BTC/USDT 실시간 시세</h1>

      {priceData ? (
        <div>
          <p>📈 현재가: {priceData.c}</p>
          <p>📊 변동률: {priceData.P}%</p>
          <p>💹 거래량: {priceData.v}</p>
        </div>
      ) : (
        <p>📡 데이터 수신 중...</p>
      )}

      <button onClick={toggleWatchlist} style={{ marginTop: '12px' }}>
        {inWatchlist ? '★ 관심 해제' : '☆ 관심 추가'}
      </button>
    </div>
  );
}