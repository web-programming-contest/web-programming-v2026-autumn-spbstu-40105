import Carousel from '../components/home/Carousel.jsx';
import {useGoods} from '../hooks/useGoods.js';

const ADVANTAGES = [
  {icon: 'rocket', text: 'Утром заказали, вечером получили'},
  {icon: 'refund', text: 'С товаром что-то не так? Вернем деньги'},
  {icon: 'original', text: 'Только оригинальные товары'},
];

const CONTACTS = [
  {icon: 'phone', text: '8 (800) 678-34-24', href: 'tel:88006783424'},
  {icon: 'mail', text: 'gadget@hub.ru', href: 'mailto:gadget@hub.ru'},
  {icon: 'pin', text: 'Санкт-Петербург, ул. Барочная, д.7, корпус 2'},
];

function byPopularity(a, b) {
  return b.popularity - a.popularity;
}

function byNewness(a, b) {
  return b.createdAt.localeCompare(a.createdAt);
}

export default function HomePage() {
  const {goods, isLoading, error} = useGoods();
  const hits = goods.filter((item) => item.isHit).sort(byPopularity);
  const novelties = goods.filter((item) => item.isNew).sort(byNewness);

  return (
    <div className="container home">
      <h1 className="visually-hidden">
        Gadget Hub — магазин надежных гаджетов
      </h1>
      <img
        className="home-banner"
        src="/images/home/banner.jpg"
        alt="Супер распродажа: умный робот-друг Red solution Reddy Air за 27 990 ₽ вместо 31 100 ₽"
        width="1240"
        height="560"
      />

      {isLoading && <p className="home-status">Загружаем товары…</p>}
      {error && (
        <p className="home-status home-status-error">
          Не удалось загрузить товары: {error}
        </p>
      )}
      {!isLoading && !error && (
        <>
          <Carousel
            icon="/images/home/fire.png"
            title="Хиты продаж"
            description="Тысячи покупателей уже одобрили эти товары. Самые популярные, проверенные и надежные гаджеты!"
            products={hits}
          />
          <Carousel
            icon="/images/home/sparkle.png"
            title="Новинки"
            description="Их только произвели - они уже у нас! Все самое новое и свежее на рынке электроники"
            products={novelties}
          />
        </>
      )}

      <section className="home-section">
        <h2 className="home-section-title">Преимущества</h2>
        <ul className="advantages">
          {ADVANTAGES.map((item) => (
            <li key={item.icon} className="advantage">
              <img
                src={`/images/home/${item.icon}.png`}
                alt=""
                width="48"
                height="48"
              />
              <p className="advantage-text">{item.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-section">
        <h2 className="home-section-title">Работаем 24/7</h2>
        <ul className="contacts">
          {CONTACTS.map((item) => (
            <li key={item.icon} className="contact">
              <img
                src={`/images/home/${item.icon}.png`}
                alt=""
                width="24"
                height="24"
              />
              {item.href ? (
                <a className="contact-link" href={item.href}>
                  {item.text}
                </a>
              ) : (
                <address className="contact-text">{item.text}</address>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
