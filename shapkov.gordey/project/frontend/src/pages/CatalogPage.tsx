import {useEffect, useState, useMemo} from 'react';
import {getGoods} from '../api';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import type {Product} from '../store';

export default function CatalogPage() {
  const [goods, setGoods] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    categories: [] as string[],
    colors: [] as string[],
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [sortType, setSortType] = useState('new');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    getGoods().then((res) => setGoods(res.data));
  }, []);

  const categories = useMemo(
    () => [...new Set(goods.map((g) => g.category || ''))],
    [goods],
  );
  const colors = useMemo(
    () => [...new Set(goods.map((g) => g.color || ''))],
    [goods],
  );

  const filtered = useMemo(() => {
    return goods.filter((g) => {
      if (
        appliedFilters.minPrice &&
        g.price < Number(appliedFilters.minPrice)
      ) {
        return false;
      }
      if (
        appliedFilters.maxPrice &&
        g.price > Number(appliedFilters.maxPrice)
      ) {
        return false;
      }
      if (
        appliedFilters.categories.length &&
        !appliedFilters.categories.includes(g.category || '')
      ) {
        return false;
      }
      if (
        appliedFilters.colors.length &&
        !appliedFilters.colors.includes(g.color || '')
      ) {
        return false;
      }
      return true;
    });
  }, [goods, appliedFilters]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortType === 'priceAsc') {
      arr.sort((a, b) => a.price - b.price);
    }
    if (sortType === 'priceDesc') {
      arr.sort((a, b) => b.price - a.price);
    }
    if (sortType === 'rating') {
      arr.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    if (sortType === 'new') {
      arr.sort((a, b) => b.id - a.id);
    }
    return arr;
  }, [filtered, sortType]);

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const toggleFilter = (key: 'categories' | 'colors', item: string) => {
    setFilters((prev) => {
      const currentList = prev[key];
      const newList = currentList.includes(item)
        ? currentList.filter((i) => i !== item)
        : [...currentList, item];
      return {...prev, [key]: newList};
    });
  };

  const getPageNumbers = () => {
    if (totalPages <= 3) {
      return Array.from({length: totalPages}, (_, i) => i + 1);
    }
    return [1, 2, 3, '...', totalPages];
  };

  return (
    <div>
      <div style={{display: 'flex', gap: '32px'}}>
        <aside
          style={{
            width: '260px',
            flexShrink: 0,
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            height: 'fit-content',
          }}
        >
          <h3 style={{marginBottom: '16px'}}>Фильтры</h3>
          <div style={{marginBottom: '16px'}}>
            <label>Цена от:</label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters({...filters, minPrice: e.target.value})
              }
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '4px',
                borderRadius: '6px',
                border: '1px solid #ccc',
              }}
            />
            <label style={{marginTop: '8px', display: 'block'}}>до:</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters({...filters, maxPrice: e.target.value})
              }
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '4px',
                borderRadius: '6px',
                border: '1px solid #ccc',
              }}
            />
          </div>
          <div style={{marginBottom: '16px'}}>
            <h4>Категория</h4>
            {categories.map((c) => (
              <label key={c} style={{display: 'block', marginTop: '8px'}}>
                <input
                  type="checkbox"
                  checked={filters.categories.includes(c)}
                  onChange={() => toggleFilter('categories', c)}
                />{' '}
                {c}
              </label>
            ))}
          </div>
          <div style={{marginBottom: '16px'}}>
            <h4>Цвет</h4>
            {colors.map((c) => (
              <label key={c} style={{display: 'block', marginTop: '8px'}}>
                <input
                  type="checkbox"
                  checked={filters.colors.includes(c)}
                  onChange={() => toggleFilter('colors', c)}
                />{' '}
                {c}
              </label>
            ))}
          </div>
          <button
            className="btn btn-blue"
            style={{width: '100%', marginBottom: '8px'}}
            onClick={() => {
              setAppliedFilters(filters);
              setCurrentPage(1);
            }}
          >
            Показать
          </button>
          <button
            className="btn btn-outline"
            style={{width: '100%'}}
            onClick={() => {
              const reset = {
                minPrice: '',
                maxPrice: '',
                categories: [] as string[],
                colors: [] as string[],
              };
              setFilters(reset);
              setAppliedFilters(reset);
              setCurrentPage(1);
            }}
          >
            Сбросить
          </button>
        </aside>

        <div style={{flex: 1}}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <h2>Каталог товаров</h2>
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #ccc',
              }}
            >
              <option value="new">Сначала новые</option>
              <option value="priceAsc">По возрастанию цены</option>
              <option value="priceDesc">По убыванию цены</option>
              <option value="rating">По популярности (рейтинг)</option>
            </select>
          </div>

          {paginated.length === 0 ? (
            <p style={{textAlign: 'center', padding: '40px', color: '#666'}}>
              Товары по вашему запросу не найдены.
            </p>
          ) : (
            <div className="catalog-grid">
              {paginated.map((g) => (
                <ProductCard
                  key={g.id}
                  product={g}
                  onClick={() => setSelectedProduct(g)}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                gap: '8px',
                justifyContent: 'center',
                marginTop: '32px',
              }}
            >
              {getPageNumbers().map((p, i) => (
                <button
                  key={i}
                  className={`btn ${currentPage === p ? 'btn-blue' : 'btn-outline'}`}
                  style={{minWidth: '40px'}}
                  onClick={() => {
                    if (typeof p === 'number') {
                      setCurrentPage(p);
                    }
                  }}
                  disabled={p === '...'}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
