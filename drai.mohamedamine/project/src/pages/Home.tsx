import { BadgeCheck, Clock3, MapPin, PackageCheck, RotateCcw, Truck } from 'lucide-react'
import { Link } from 'react-router'
import { useProducts } from '@/context/ProductContext'
import { ProductCarousel } from '@/components/ProductCarousel'
import { ErrorState, Loading } from '@/components/Loading'

export default function Home() {
  const { products, loading, error, reload } = useProducts()
  const hits = products.filter((product) => product.is_hit)
  const fresh = products.filter((product) => product.is_new)

  return (
    <>
      <section className="container hero" aria-labelledby="hero-title">
        <div className="hero__copy">
          <span className="hero__eyebrow">Только оригинальная техника</span>
          <h1 id="hero-title">SUPER<br />SALE</h1>
          <p>Скидки до 20% на смартфоны,<br />наушники и умные гаджеты</p>
          <Link to="/catalog" className="button button--pink">Выбрать гаджет</Link>
        </div>
        <div className="hero__product" aria-hidden="true">
          <span className="hero__discount">−20%</span>
          <img src="/images/goods/image_6.png" alt="" />
          <div><strong>43 999 ₽</strong><s>54 999 ₽</s></div>
        </div>
        <span className="hero__ring hero__ring--one" /><span className="hero__ring hero__ring--two" />
      </section>

      <div className="container home-content">
        <section className="home-section" aria-labelledby="hits-title">
          <div className="section-heading">
            <div><h2 id="hits-title">Хиты продаж</h2><p>Тысячи покупателей уже одобрили эти товары. Самые популярные, проверенные и надежные гаджеты!</p></div>
          </div>
          {loading ? <Loading /> : error ? <ErrorState message={error} onRetry={reload} /> : <ProductCarousel products={hits} />}
        </section>

        <section className="home-section" aria-labelledby="new-title">
          <div className="section-heading"><div><h2 id="new-title">Новинки</h2><p>Их только произвели — они уже у нас! Все самое новое и свежее на рынке электроники.</p></div></div>
          {loading ? <Loading /> : error ? <ErrorState message={error} onRetry={reload} /> : <ProductCarousel products={fresh} />}
        </section>

        <section className="home-section benefits" aria-labelledby="benefits-title">
          <h2 id="benefits-title">Покупать у нас удобно</h2>
          <div className="benefits-grid">
            <article><Truck aria-hidden="true" /><h3>Утром заказали, вечером получили</h3><p>Доставим по Санкт-Петербургу в день заказа.</p></article>
            <article><BadgeCheck aria-hidden="true" /><h3>Только оригинальные товары</h3><p>Официальная гарантия и проверка перед отправкой.</p></article>
            <article><RotateCcw aria-hidden="true" /><h3>С товаром что-то не так?</h3><p>Вернем деньги или заменим товар без лишних вопросов.</p></article>
          </div>
        </section>

        <section className="contact-panel" aria-labelledby="contacts-title">
          <div><span className="contact-panel__icon"><Clock3 /></span><h2 id="contacts-title">Работаем 24/7</h2><p>Всегда на связи, если нужна помощь с выбором.</p></div>
          <div className="contact-panel__links"><a href="tel:88006783424">8 (800) 678-34-24</a><a href="mailto:gadget@hub.ru">gadget@hub.ru</a><span><MapPin size={19} />Санкт-Петербург, ул. Барочная, д. 7, корпус 2</span></div>
          <PackageCheck className="contact-panel__mark" aria-hidden="true" />
        </section>
      </div>
    </>
  )
}
