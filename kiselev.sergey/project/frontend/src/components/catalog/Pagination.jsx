import {getPageItems} from '../../utils/catalog.js';

export default function Pagination({page, pageCount, onChange}) {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <nav className="pagination" aria-label="Страницы каталога">
      {page > 1 && (
        <button
          type="button"
          className="pagination-button pagination-arrow pagination-arrow-prev"
          aria-label="Предыдущая страница"
          onClick={() => onChange(page - 1)}
        />
      )}
      {getPageItems(page, pageCount).map((item) =>
        typeof item === 'string' ? (
          <span key={item} className="pagination-ellipsis">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={`pagination-button ${item === page ? 'pagination-button-active' : ''}`}
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onChange(item)}
          >
            {item}
          </button>
        ),
      )}
      {page < pageCount && (
        <button
          type="button"
          className="pagination-button pagination-arrow"
          aria-label="Следующая страница"
          onClick={() => onChange(page + 1)}
        />
      )}
    </nav>
  );
}
