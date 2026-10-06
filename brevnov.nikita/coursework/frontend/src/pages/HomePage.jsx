import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { Carousel } from '../components/Carousel.jsx';
import { ProductCard } from '../components/ProductCard.jsx';
import './home.css';

// Главная доступна и неавторизованному пользователю (см. комментарий в
// App.jsx), поэтому товары запрашиваются через обычный GET /goods, а не
// через ручки, защищённые requireAuth.
export function HomePage() {
  const [goods, setGoods] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .getGoods()
      .then(setGoods)
      .catch((requestError) => setError(requestError.message));
  }, []);

  const hits = goods.filter((good) => good.isHit);
  // «Новинки» — самые свежие по дате добавления, а не просто все с флагом
  // isNew подряд: так карусель остаётся актуальной, даже если флаг isNew
  // со временем проставят на большом числе товаров.
  const newArrivals = [...goods]
    .filter((good) => good.isNew)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="page-container home-page">
      {error && <p className="home-error">Не удалось загрузить товары: {error}</p>}

      <Carousel
        title="Хиты продаж"
        items={hits}
        renderItem={(good) => <ProductCard good={good} />}
      />

      <Carousel
        title="Новинки"
        items={newArrivals}
        renderItem={(good) => <ProductCard good={good} />}
      />
    </div>
  );
}
