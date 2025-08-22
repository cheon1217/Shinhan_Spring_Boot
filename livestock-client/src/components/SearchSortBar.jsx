import { useState, useEffect } from 'react';

export default function SearchSortBar({ onChange, initial = {} }) {
  const [query, setQuery] = useState(initial.q ?? '');
  const [size, setSize] = useState(initial.size ?? 10);
  const [sort, setSort] = useState(initial.sort ?? 'id,asc');

  useEffect(() => {
    const t = setTimeout(() => onChange({ q: query, size, sort }), 500); // 디바운스 살짝 늘림
    return () => clearTimeout(t);
  }, [query, size, sort, onChange]);

  return (
    <div className="row g-2 mb-3">
      <div className="col-12 col-md-6">
        <div className="input-group">
          <span className="input-group-text">검색</span>
          <input
            className="form-control"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="심볼/이름 (예: BTC, 비트코인)"
          />
        </div>
      </div>
      <div className="col-6 col-md-3">
        <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="id,asc">등록순↑</option>
          <option value="id,desc">등록순↓</option>
          <option value="changeRate,desc">변동률↓</option>
          <option value="changeRate,asc">변동률↑</option>
          <option value="price,desc">가격↓</option>
          <option value="price,asc">가격↑</option>
          <option value="volume,desc">거래량↓</option>
          <option value="volume,asc">거래량↑</option>
        </select>
      </div>
      <div className="col-6 col-md-3">
        <select className="form-select" value={size} onChange={(e) => setSize(Number(e.target.value))}>
          <option value={10}>10개</option>
          <option value={20}>20개</option>
          <option value={50}>50개</option>
        </select>
      </div>
    </div>
  );
}
