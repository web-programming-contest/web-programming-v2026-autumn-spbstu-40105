import './pagination.css';

// Простая постраничная навигация: «назад», номера страниц, «вперёд».
export function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="pagination" aria-label="Страницы каталога">
      <button
        type="button"
        className="pagination-button"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        ‹
      </button>

      {pages.map((number) => (
        <button
          key={number}
          type="button"
          className={
            number === page
              ? 'pagination-button pagination-button-active'
              : 'pagination-button'
          }
          aria-current={number === page ? 'page' : undefined}
          onClick={() => onChange(number)}
        >
          {number}
        </button>
      ))}

      <button
        type="button"
        className="pagination-button"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        ›
      </button>
    </nav>
  );
}
