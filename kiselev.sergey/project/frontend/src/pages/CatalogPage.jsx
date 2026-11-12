import {useState} from 'react';

import CatalogFilters from '../components/catalog/CatalogFilters.jsx';
import Pagination from '../components/catalog/Pagination.jsx';
import ProductCard from '../components/catalog/ProductCard.jsx';
import ProductModal from '../components/catalog/ProductModal.jsx';
import {useGoods} from '../hooks/useGoods.js';
import {
  COLOR_LABELS,
  DEFAULT_SORT,
  EMPTY_FILTERS,
  PAGE_SIZE,
  SORT_OPTIONS,
  TYPE_LABELS,
  filterGoods,
  getAvailable,
  getPriceBounds,
  sortGoods,
} from '../utils/catalog.js';

export default function CatalogPage() {
  const {goods, isLoading, error} = useGoods();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [page, setPage] = useState(1);
  const [openedProduct, setOpenedProduct] = useState(null);

  const found = sortGoods(filterGoods(goods, filters), sort);
  const pageCount = Math.max(1, Math.ceil(found.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = found.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function applyFilters(next) {
    setFilters(next);
    setPage(1);
  }

  function changeSort(option) {
    const isSame = option.value === sort.value;

    setSort({
      value: option.value,
      isReversed: isSame && option.isReversible ? !sort.isReversed : false,
    });
    setPage(1);
  }

  function changePage(next) {
    setPage(next);
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  return (
    <div className="container catalog-page">
      <h1 className="page-title">Каталог товаров</h1>

      {isLoading && <p className="home-status">Загружаем товары…</p>}
      {error && (
        <p className="home-status home-status-error">
          Не удалось загрузить товары: {error}
        </p>
      )}
      {!isLoading && !error && (
        <div className="catalog">
          <section className="catalog-results" aria-label="Товары">
            <div className="sort" role="group" aria-label="Сортировка">
              {SORT_OPTIONS.map((option) => {
                const isActive = option.value === sort.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    className={`sort-chip ${isActive ? 'sort-chip-active' : ''}`}
                    aria-pressed={isActive}
                    title={
                      option.isReversible
                        ? 'Нажмите ещё раз, чтобы изменить направление'
                        : undefined
                    }
                    onClick={() => changeSort(option)}
                  >
                    {option.label}
                    {isActive && option.isReversible && (
                      <span className="sort-direction">
                        {sort.isReversed ? ' ↑' : ' ↓'}
                        <span className="visually-hidden">
                          {sort.isReversed ? 'по возрастанию' : 'по убыванию'}
                        </span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {visible.length > 0 ? (
              <ul className="catalog-list">
                {visible.map((product) => (
                  <li key={product.id}>
                    <ProductCard product={product} onOpen={setOpenedProduct} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="catalog-empty">
                Товары по вашему запросу не найдены
              </p>
            )}

            <Pagination
              page={currentPage}
              pageCount={pageCount}
              onChange={changePage}
            />
          </section>

          <CatalogFilters
            bounds={getPriceBounds(goods)}
            types={getAvailable(goods, 'type', TYPE_LABELS)}
            colors={getAvailable(goods, 'color', COLOR_LABELS)}
            onApply={applyFilters}
            onReset={() => applyFilters(EMPTY_FILTERS)}
          />
        </div>
      )}

      <ProductModal
        product={openedProduct}
        onClose={() => setOpenedProduct(null)}
      />
    </div>
  );
}
