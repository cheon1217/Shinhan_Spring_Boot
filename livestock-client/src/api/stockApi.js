import axios from 'axios';

const BASE = 'http://localhost:8090/api/stocks';

export const fetchStocks = async ({ page = 0, size = 10, sort = 'id,asc', q = '' } = {}) => {
  const params = { page, size, sort };
  if (q) params.q = q;
  const { data } = await axios.get(BASE, { params, withCredentials: true });
  return data; // Spring Data Page
};

export const fetchHistory = async (id, limit = 30) => {
  const url = `${BASE}/${id}/history`;
  try {
    const { data } = await axios.get(url, { params: { limit }, withCredentials: true });
    return Array.isArray(data) ? data.reverse() : []; // 최신→과거로 왔으면 반전
  } catch (e) {
    // 엔드포인트 없으면 차트 숨김
    return [];
  }
};

// OHLC 데이터 조회
export async function fetchOhlc(stockId) {
  const res = await fetch(`/api/stocks/${stockId}/ohlc`);
  if (!res.ok) throw new Error('Failed to load OHLC data');
  return await res.json(); // [{ time, open, high, low, close }]
};
