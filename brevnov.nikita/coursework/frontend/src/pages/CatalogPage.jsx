import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';
import { Pagination } from '../components/Pagination.jsx';
import { ProductCard } from '../components/ProductCard.jsx';
import { ProductModal } from '../components/ProductModal.jsx';
import { COLOR_LABELS, TYPE_LABELS } from '../utils/labels.js';
import './catalog.css';

const PAGE_SIZE = 8;

const SORT_OPTIONS = {
  newest: { label: 'Сначала новые', compare: (a, b) => new Date(b.createdAt) - new Date(a.createdAt) },
  priceAsc: { label: 'Сначала дешёвые', compare: (a, b) => a.price - b.price },
  priceDesc: { label: 'Сначала дорогие', compare: (a, b) => b.price - a.price },
  rating: { label: 'По рейтингу', compare: (a, b) => b.rating - a.rating },
};

const EMPTY_FILTERS = { type: '', color: '', minPrice: '', maxPrice: '', minRating: '' };

// Фильтрация, сортировка и пагинация выполняются на фронтенде над полным
// списком /goods — бэкенд отдаёт товары целиком (см. goods.js).
export function CatalogPage() {
  const [goods, setGoods] = useState([]);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sortKey, setSortKey] = useState('newest');
  const [page, setPage] = useState(1);
  const [openedGood, setOpenedGood] = useState(null);

  useEffect(() => {
    api
      .getGoods()
      .then(setGoods)
      .catch((requestError) => setError(requestError.message));
  }, []);

  // Показываем в фильтрах только те типы и цвета, которые реально есть в данных.
  const availableTypes = useMemo(() => [...new Set(goods.map((good) => good.type))], [goods]);
  const availableColors = useMemo(() => [...new Set(goods.map((good) => good.color))], [goods]);

  const visibleGoods = useMemo(() => {
    const minPrice = filters.minPrice === '' ? null : Number(filters.minPrice);
    const maxPrice = filters.maxPrice === '' ? null : Number(filters.maxPrice);
    const minRating = filters.minRating === '' ? null : Number(filters.minRating);

    return goods
      .filter((good) => !filters.type || good.type === filters.type)
      .filter((good) => !filters.color || good.color === filters.color)
      .filter((good) => minPrice === null || good.price >= minPrice)
      .filter((good) => maxPrice === null || good.price <= maxPrice)
      .filter((good) => minRating === null || good.rating >= minRating)
      .sort(SORT_OPTIONS[sortKey].compare);
  }, [goods, filters, sortKey]);

  const totalPages = Math.max(1, Math.ceil(visibleGoods.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageGoods = visibleGoods.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
    // Набор товаров изменился — возвращаемся на первую страницу.
    setPage(1);
  }

  function resetFilters() {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  }

  return (
    <div className="page-container catalog-page">
      <h1 className="catalog-title">Каталог товаров</h1>

      {error && <p className="catalog-error">Не удалось загрузить товары: {error}</p>}

      <div className="catalog-toolbar">
        <label className="catalog-control">
          <span>Категория</span>
          <select value={filters.type} onChange={(e) => updateFilter('type', e.target.value)}>
            <option value="">Все</option>
            {availableTypes.map((type) => (
              <option key={type} value={type}>
                {TYPE_LABELS[type] ?? type}
              </option>
            ))}
          </select>
        </label>

        <label className="catalog-control">
          <span>Цвет</span>
          <select value={filters.color} onChange={(e) => updateFilter('color', e.target.value)}>
            <option value="">Все</option>
            {availableColors.map((color) => (
              <option key={color} value={color}>
                {COLOR_LABELS[color] ?? color}
              </option>
            ))}
          </select>
        </label>

        <label className="catalog-control">
          <span>Цена от</span>
          <input
            type="number"
            min="0"
            value={filters.minPrice}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
          />
        </label>

        <label className="catalog-control">
          <span>Цена до</span>
          <input
            type="number"
            min="0"
            value={filters.maxPrice}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
          />
        </label>

        <label className="catalog-control">
          <span>Рейтинг от</span>
          <select
            value={filters.minRating}
            onChange={(e) => updateFilter('minRating', e.target.value)}
          >
            <option value="">Любой</option>
            {[5, 4, 3].map((value) => (
              <option key={value} value={value}>
                {'★'.repeat(value)} и выше
              </option>
            ))}
          </select>
        </label>

        <label className="catalog-control">
          <span>Сортировка</span>
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
            {Object.entries(SORT_OPTIONS).map(([key, option]) => (
              <option key={key} value={key}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button type="button" className="catalog-reset" onClick={resetFilters}>
          Сбросить
        </button>
      </div>

      <p className="catalog-count">Найдено товаров: {visibleGoods.length}</p>

      {pageGoods.length > 0 ? (
        <div className="catalog-grid">
          {pageGoods.map((good) => (
            <ProductCard key={good.id} good={good} onOpen={setOpenedGood} />
          ))}
        </div>
      ) : (
        !error && goods.length > 0 && <p className="catalog-empty">По вашему запросу ничего не найдено.</p>
      )}

      <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />

      {openedGood && <ProductModal good={openedGood} onClose={() => setOpenedGood(null)} />}
    </div>
  );
}
