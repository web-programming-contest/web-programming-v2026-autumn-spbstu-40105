import { useMemo, useState } from 'react'
import { ChevronDown, RotateCcw, SlidersHorizontal } from 'lucide-react'
import { useProducts } from '@/context/ProductContext'
import type { Product } from '@/types/store'
import { ProductCard } from '@/components/ProductCard'
import { ProductModal } from '@/components/ProductModal'
import { ErrorState, Loading } from '@/components/Loading'

interface Filters {
  min: string
  max: string
  categories: string[]
  colors: string[]
}

type Sort = 'new' | 'expensive' | 'cheap' | 'popular'
const EMPTY_FILTERS: Filters = { min: '', max: '', categories: [], colors: [] }
const PAGE_SIZE = 9

export default function Catalog() {
  const { products, loading, error, reload } = useProducts()
  const [draft, setDraft] = useState<Filters>(EMPTY_FILTERS)
  const [applied, setApplied] = useState<Filters>(EMPTY_FILTERS)
  const [sort, setSort] = useState<Sort>('new')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Product | null>(null)

  const categories = useMemo(() => Array.from(new Map(products.map((p) => [p.category, p.category_display])).entries()), [products])
  const colors = useMemo(() => Array.from(new Map(products.map((p) => [p.color, p.color_display])).entries()), [products])
  const priceBounds = useMemo(() => ({
    min: products.length ? Math.floor(Math.min(...products.map((p) => p.price))) : 0,
    max: products.length ? Math.ceil(Math.max(...products.map((p) => p.price))) : 100000,
  }), [products])

  const visibleProducts = useMemo(() => {
    const min = applied.min ? Number(applied.min) : -Infinity
    const max = applied.max ? Number(applied.max) : Infinity
    const filtered = products.filter((product) => {
      const categoryMatch = !applied.categories.length || applied.categories.includes(product.category)
      const colorMatch = !applied.colors.length || applied.colors.includes(product.color)
      return product.price >= min && product.price <= max && categoryMatch && colorMatch
    })
    return [...filtered].sort((a, b) => {
      if (sort === 'cheap') return a.price - b.price
      if (sort === 'expensive') return b.price - a.price
      if (sort === 'popular') return b.rating - a.rating || b.price - a.price
      return Number(b.is_new) - Number(a.is_new) || b.id - a.id
    })
  }, [products, applied, sort])

  const pageCount = Math.max(1, Math.ceil(visibleProducts.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageProducts = visibleProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const toggle = (key: 'categories' | 'colors', value: string) => {
    setDraft((current) => ({
      ...current,
      [key]: current[key].includes(value) ? current[key].filter((item) => item !== value) : [...current[key], value],
    }))
  }

  const applyFilters = () => {
    let next = { ...draft }
    if (next.min && next.max && Number(next.min) > Number(next.max)) {
      next = { ...next, min: next.max, max: next.min }
    }
    setDraft(next)
    setApplied(next)
    setPage(1)
  }

  const resetFilters = () => {
    setDraft(EMPTY_FILTERS)
    setApplied(EMPTY_FILTERS)
    setPage(1)
  }

  const changePage = (nextPage: number) => {
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const pages = Array.from({ length: Math.min(3, pageCount) }, (_, index) => index + 1)

  return (
    <div className="container catalog-page">
      <div className="page-heading"><div><h1>Каталог товаров</h1><p>Выберите технику для работы, дома и развлечений.</p></div><span className="catalog-total">{products.length} товара в каталоге</span></div>
      {loading ? <Loading /> : error ? <ErrorState message={error} onRetry={reload} /> : (
        <div className="catalog-layout">
          <div className="catalog-content">
            <div className="sort-bar" aria-label="Сортировка товаров">
              <span>Сортировать:</span>
              {([['new', 'Новые'], ['expensive', 'Подороже'], ['cheap', 'Подешевле'], ['popular', 'Популярные']] as [Sort, string][]).map(([value, label]) => (
                <button type="button" key={value} className={`chip ${sort === value ? 'chip--active' : ''}`} onClick={() => { setSort(value); setPage(1) }} aria-pressed={sort === value}>{label}</button>
              ))}
            </div>
            <p className="results-count" role="status">Найдено: {visibleProducts.length}</p>
            {pageProducts.length ? (
              <div className="product-grid">{pageProducts.map((product) => <ProductCard key={product.id} product={product} onOpen={setSelected} />)}</div>
            ) : (
              <div className="empty-state"><SlidersHorizontal size={36} /><h2>Товары не найдены</h2><p>По вашему запросу ничего не найдено. Попробуйте изменить или сбросить фильтры.</p><button type="button" className="button button--primary" onClick={resetFilters}>Сбросить фильтры</button></div>
            )}
            {visibleProducts.length > PAGE_SIZE && (
              <nav className="pagination" aria-label="Страницы каталога">
                {pages.map((number) => <button type="button" key={number} className={currentPage === number ? 'active' : ''} onClick={() => changePage(number)} aria-current={currentPage === number ? 'page' : undefined}>{number}</button>)}
                {pageCount > 3 && <><span>…</span><button type="button" className={currentPage === pageCount ? 'active' : ''} onClick={() => changePage(pageCount)} aria-current={currentPage === pageCount ? 'page' : undefined}>{pageCount}</button></>}
              </nav>
            )}
          </div>

          <aside className="filters" aria-labelledby="filters-title">
            <div className="filters__heading"><h2 id="filters-title">Фильтры</h2><button type="button" onClick={resetFilters}><RotateCcw size={16} />Сбросить</button></div>
            <fieldset className="filter-group"><legend>Цена, ₽</legend><div className="price-inputs">
              <label>От<input type="number" min={priceBounds.min} max={priceBounds.max} placeholder={String(priceBounds.min)} value={draft.min} onChange={(event) => setDraft((current) => ({ ...current, min: event.target.value }))} /></label>
              <label>До<input type="number" min={priceBounds.min} max={priceBounds.max} placeholder={String(priceBounds.max)} value={draft.max} onChange={(event) => setDraft((current) => ({ ...current, max: event.target.value }))} /></label>
            </div><div className="range-inputs">
              <input aria-label="Минимальная цена" type="range" min={priceBounds.min} max={priceBounds.max} step={100} value={Number(draft.min || priceBounds.min)} onChange={(event) => setDraft((current) => ({ ...current, min: event.target.value }))} />
              <input aria-label="Максимальная цена" type="range" min={priceBounds.min} max={priceBounds.max} step={100} value={Number(draft.max || priceBounds.max)} onChange={(event) => setDraft((current) => ({ ...current, max: event.target.value }))} />
            </div></fieldset>
            <fieldset className="filter-group"><legend>Тип товара <ChevronDown size={18} /></legend><div className="checkbox-list">{categories.map(([value, label]) => <label key={value} className="check-label"><input type="checkbox" checked={draft.categories.includes(value)} onChange={() => toggle('categories', value)} /><span>{label}</span></label>)}</div></fieldset>
            <fieldset className="filter-group"><legend>Цвет <ChevronDown size={18} /></legend><div className="checkbox-list">{colors.map(([value, label]) => <label key={value} className="check-label"><input type="checkbox" checked={draft.colors.includes(value)} onChange={() => toggle('colors', value)} /><span>{label}</span></label>)}</div></fieldset>
            <button type="button" className="button button--primary button--wide" onClick={applyFilters}>Показать</button>
          </aside>
        </div>
      )}
      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
