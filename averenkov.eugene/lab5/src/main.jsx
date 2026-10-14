import {useState} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

import img1984 from '../assets/1984.jpg';
import imgCleanCode from '../assets/cleancode.jpg';
import imgDune from '../assets/dune.jpg';
import imgTanenbaum from '../assets/tanenbaum.jpg';

const books = [
  {
    title: '1984',
    image: img1984,
    rating: 4.7,
    description: 'Антиутопия Джорджа Оруэлла о тоталитарном обществе.',
    price: 500,
    caption: 'Новинка недели',
  },
  {
    title: 'Чистый код',
    image: imgCleanCode,
    rating: 4.8,
    description: 'Книга Роберта Мартина о том, как писать понятный код.',
    price: 1200,
    caption: 'Хит продаж для программистов',
  },
  {
    title: 'Дюна',
    image: imgDune,
    rating: 4.9,
    description:
      'Научно-фантастический роман Фрэнка Герберта о планете Арракис.',
    price: 800,
    caption: 'Классика научной фантастики',
  },
  {
    title: 'Современные операционные системы',
    image: imgTanenbaum,
    rating: 4.6,
    description: 'Учебник Эндрю Таненбаума об устройстве операционных систем.',
    price: 2500,
    caption: 'Выбор студентов',
  },
];

function App() {
  const [current, setCurrent] = useState(0);

  function prev() {
    if (current === 0) {
      setCurrent(books.length - 1);
    } else {
      setCurrent(current - 1);
    }
  }

  function next() {
    if (current === books.length - 1) {
      setCurrent(0);
    } else {
      setCurrent(current + 1);
    }
  }

  const book = books[current];

  return (
    <div>
      <h1>Книжный магазин</h1>

      <div className="slider">
        <div className="card" data-testid="book-slide">
          <img src={book.image} alt={book.title} />
          <div className="info">
            <h2>{book.title}</h2>
            <p className="rating">Рейтинг: {book.rating}</p>
            <p>{book.description}</p>
            <p className="price">{book.price} руб.</p>
          </div>
        </div>

        <p className="caption">{book.caption}</p>

        <div className="controls">
          <button onClick={prev} data-testid="slide-previous">
            Назад
          </button>
          <span className="counter" data-testid="slide-indicator">
            {current + 1}/{books.length}
          </span>
          <button onClick={next} data-testid="slide-next">
            Далее
          </button>
        </div>

        <div className="dots">
          {books.map((item, index) => (
            <span
              key={item.title}
              data-testid="slide-page"
              className={index === current ? 'dot active' : 'dot'}
              onClick={() => setCurrent(index)}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
