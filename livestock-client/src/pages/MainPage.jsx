import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchStocks, fetchOhlc } from '../api/stockApi'; 
import SearchSortBar from '../components/SearchSortBar';
import Pagination from '../components/Pagination';
import StockRow from '../components/StockRow';
import MainStockChart from '../components/MainStockChart';
import CandleChart from '../components/CandleChart'; 

export default function MainPage() {
  const [pageData, setPageData] = useState(null);
  const [query, setQuery] = useState({ q: '', size: 10, sort: 'id,asc' });
  const [page, setPage] = useState(0);
  const [priceData, setPriceData] = useState({});
  const [watchlist, setWatchlist] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem('jwtToken');

  // 전체 종목 목록 불러오기
  const load = useCallback(async () => {
    const data = await fetchStocks({
      page,
      size: query.size,
      sort: query.sort,
      q: query.q,
    });
    setPageData(data);
    setWatchlist(data?.content ?? []);
  }, [page, query.size, query.sort, query.q]);

  useEffect(() => { load(); }, [load]);

  const onQueryChange = (q) => {
    setQuery(q);
    setPage(0);
  };

  const content = pageData?.content ?? [];
  const totalPages = pageData?.totalPages ?? 0;

  // OHLC 데이터 병합
  useEffect(() => {
    if (watchlist.length === 0) return;

    const loadOhlcData = async () => {
      const updates = {};
      for (let stock of watchlist) {
        const stockId = stock.id || stock.stockId || stock.stock?.id;
        try {
          const ohlc = await fetchOhlc(stockId);
          console.log("📈 OHLC 응답 확인:", stockId, ohlc);
          updates[stockId] = ohlc.map((item) => ({
            x: item.time,
            o: item.open,
            h: item.high,
            l: item.low,
            c: item.close,
          }));
        } catch (e) {
          updates[stockId] = [];
          console.warn(`OHLC 데이터 불러오기 실패: ${stockId}`, e);
        }
      }

      setPriceData((prev) => {
        const merged = { ...prev };
        for (const [stockId, ohlc] of Object.entries(updates)) {
          merged[stockId] = { ...(prev[stockId] ?? {}), ohlc };
        }
        return merged;
      });
    };

    loadOhlcData();
  }, [watchlist]);

  return (
    <div className="container py-4">
      {/* 헤더 */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h3 m-0">📈 전체 종목 시세</h1>

        {!token ? (
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary" onClick={() => navigate('/login')}>
              로그인
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/register')}>
              회원가입
            </button>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
            ⭐ 내 관심 종목 보러가기
          </button>
        )}
      </div>

      {/* 검색/정렬바 */}
      <SearchSortBar onChange={onQueryChange} initial={query} />

      {/* 테이블 */}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th style={{width: 60}}>#</th>
              <th>심볼</th>
              <th>이름</th>
              <th>가격</th>
              <th>변동률</th>
              <th>거래량</th>
              <th style={{width: 140}}>차트</th>
              <th className="text-center" style={{width: 120}}>{token ? '관심' : ''}</th>
            </tr>
          </thead>
          <tbody>
            {content.map((it, idx) => (
              <StockRow
                key={it.id}
                item={it}
                index={page * (query.size ?? 10) + idx}
              />
            ))}
            {content.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-4">데이터가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {content.length > 0 && (
        <div className="mt-5">
          <h4 className="mb-3">📊 종목별 가격 추세 요약</h4>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
            {content.map((stock) => {
              const symbol = stock.symbol;
              const recent = stock.recentPrices ?? [];
              const ohlc = priceData[stock.id]?.ohlc ?? [];

              return (
                <div key={stock.id} className="col">
                  <div className="card p-3 shadow-sm border-0">
                    <h5 className="mb-3">{symbol}</h5>
                    <div className="row">
                      <div className="col-6">
                        <MainStockChart
                          symbol={symbol}
                          prices={recent.map(p => p.close)} // 최근 가격 추세
                          type="area"
                          height={150}
                        />
                      </div>
                      <div className="col-6">
                        <CandleChart
                          symbol={symbol}
                          ohlcData={ohlc} // OHLC 캔들차트
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 페이지네이션 */}
      <Pagination page={page} totalPages={totalPages} onPage={setPage} />
    </div>
  );
}
