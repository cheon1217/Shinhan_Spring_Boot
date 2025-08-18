import { useState } from 'react';
import { addToWatchlist, removeFromWatchlist } from '../api/watchlistapi';

const WatchlistButton = ({ stockId, initialInWatchlist }) => {
  const [inWatchlist, setInWatchlist] = useState(initialInWatchlist);

  const toggleWatchlist = async () => {
    try {
      if (inWatchlist) {
        await removeFromWatchlist(stockId);
      } else {
        await addToWatchlist(stockId);
      }
      setInWatchlist(!inWatchlist);
    } catch (err) {
      console.error('관심 종목 변경 실패:', err);
      alert('로그인이 필요하거나 오류가 발생했어요.');
    }
  };

  return (
    <button onClick={toggleWatchlist}>
      {inWatchlist ? '★ 관심 해제' : '☆ 관심 추가'}
    </button>
  );
};

export default WatchlistButton;