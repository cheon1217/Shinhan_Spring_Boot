export default function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;
  const go = (p) => onPage(Math.max(0, Math.min(totalPages - 1, p)));

  const items = [];
  // 현재 페이지 주변 2페이지만 노출 (가독성)
  const start = Math.max(0, page - 2);
  const end = Math.min(totalPages - 1, page + 2);
  for (let i = start; i <= end; i++) {
    items.push(
      <li key={i} className={`page-item ${i === page ? 'active' : ''}`}>
        <button className="page-link" onClick={() => go(i)}>
          {i + 1}
        </button>
      </li>
    );
  }

  return (
    <nav className="d-flex justify-content-center mt-3">
      <ul className="pagination mb-0">
        <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => go(0)}>&laquo;</button>
        </li>
        <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => go(page - 1)}>&lsaquo;</button>
        </li>
        {items}
        <li className={`page-item ${page >= totalPages - 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => go(page + 1)}>&rsaquo;</button>
        </li>
        <li className={`page-item ${page >= totalPages - 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => go(totalPages - 1)}>&raquo;</button>
        </li>
      </ul>
    </nav>
  );
}
