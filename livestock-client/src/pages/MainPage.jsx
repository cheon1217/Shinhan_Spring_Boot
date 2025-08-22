import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchStocks } from '../api/stockApi';
import SearchSortBar from '../components/SearchSortBar';
import Pagination from '../components/Pagination';
import StockRow from '../components/StockRow';
import MainStockChart from '../components/MainStockChart';

export default function MainPage() {
  const [pageData, setPageData] = useState(null);
  const [query, setQuery] = useState({ q: '', size: 10, sort: 'id,asc' });
  const [page, setPage] = useState(0);

  const navigate = useNavigate();
  const token = localStorage.getItem('jwtToken');

  const load = useCallback(async () => {
    const data = await fetchStocks({
      page,
      size: query.size,
      sort: query.sort,
      q: query.q,
    });
    setPageData(data);
  }, [page, query.size, query.sort, query.q]);

  useEffect(() => {
    load();
  }, [load]);

  const onQueryChange = (q) => {
    setQuery(q);
    setPage(0);
  };

  const content = pageData?.content ?? [];
  const totalPages = pageData?.totalPages ?? 0;

  return (
    <div className="container py-4">
      {/* 상단 헤더 */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h3 m-0">📈 전체 종목 시세</h1>
        <div className="d-flex gap-2">
          {token ? (
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
              ⭐ 내 관심 종목 보러가기
            </button>
          ) : (
            <>
              <button className="btn btn-outline-secondary" onClick={() => navigate('/login')}>
                로그인
              </button>
              <button className="btn btn-primary" onClick={() => navigate('/register')}>
                회원가입
              </button>
            </>
          )}
        </div>
      </div>

      {/* 검색 및 정렬 */}
      <SearchSortBar onChange={onQueryChange} initial={query} />

      {/* 종목 테이블 */}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th style={{ width: 60 }}>#</th>
              <th>심볼</th>
              <th>이름</th>
              <th>가격</th>
              <th>변동률</th>
              <th>거래량</th>
              <th style={{ width: 140 }}>차트</th>
              {token && <th className="text-center" style={{ width: 120 }}>관심</th>}
            </tr>
          </thead>
          <tbody>
            {content.length > 0 ? (
              content.map((item, idx) => (
                <StockRow
                  key={item.id}
                  item={item}
                  index={page * query.size + idx}
                />
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 차트 요약 */}
      {content.length > 0 && (
        <div className="mt-5">
          <h4 className="mb-3">📊 종목별 가격 추세 요약</h4>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
            {content.map((stock) => (
              // console.log(stock.symbol, stock.recentPrices);
              <div key={stock.id} className="col">
                <div className="card p-3 shadow-sm border-0 h-100">
                  <h5 className="mb-3">{stock.symbol}</h5>
                  <MainStockChart
                    symbol={stock.symbol}
                    prices={
                      Array.isArray(stock.recentPrices)
                        ? stock.recentPrices.map(p => (typeof p === 'number' ? p : Number(p?.close ?? p)))
                        : []
                    }
                    type="area"
                    height={160}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 페이지네이션 */}
      <Pagination page={page} totalPages={totalPages} onPage={setPage} />
    </div>
  );
}
