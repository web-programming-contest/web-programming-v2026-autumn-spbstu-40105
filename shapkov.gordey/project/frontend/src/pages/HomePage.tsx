import {useEffect, useState} from 'react';
import {getGoods} from '../api';
import Carousel from '../components/Carousel';
import ProductModal from '../components/ProductModal';
import type {Product} from '../store';

export default function HomePage() {
  const [goods, setGoods] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    getGoods().then((res) => setGoods(res.data));
  }, []);

  const hits = goods.filter((g) => g.labels?.includes('Хит'));
  const news = goods.filter((g) => g.labels?.includes('Новинка'));

  return (
    <div>
      <Carousel
        title="Хиты продаж"
        items={hits}
        onProductClick={setSelectedProduct}
      />
      <Carousel
        title="Новинки"
        items={news}
        onProductClick={setSelectedProduct}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          margin: '40px 0',
        }}
      >
        <div
          style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center',
          }}
        >
          🚚 Доставка в день заказа
        </div>
        <div
          style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center',
          }}
        >
          ✅ Только оригинальные товары
        </div>
        <div
          style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center',
          }}
        >
          🛡️ Гарантия 1 год
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
