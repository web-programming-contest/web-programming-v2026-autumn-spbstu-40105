import React from 'react';
import {StrictMode, useState} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

const BOOKS_PER_PAGE = 9;

const BASE_BOOKS = [
  {
    id: 1,
    title: 'Мастер и Маргарита',
    author: 'Михаил Булгаков',
    rating: 4.9,
    description: 'Роман о добре и зле, любви и трусости.',
    price: 890,
    color: '#8e44ad',
  },
  {
    id: 2,
    title: 'Преступление и наказание',
    author: 'Фёдор Достоевский',
    rating: 4.8,
    description: 'История бывшего студента Раскольникова.',
    price: 780,
    color: '#c0392b',
  },
  {
    id: 3,
    title: 'Война и мир',
    author: 'Лев Толстой',
    rating: 4.7,
    description: 'Эпопея о России эпохи Наполеоновских войн.',
    price: 1290,
    color: '#2c3e50',
  },
  {
    id: 4,
    title: 'Анна Каренина',
    author: 'Лев Толстой',
    rating: 4.6,
    description: 'Трагическая история любви.',
    price: 950,
    color: '#16a085',
  },
  {
    id: 5,
    title: 'Тихий Дон',
    author: 'Михаил Шолохов',
    rating: 4.5,
    description: 'Судьба донского казачества.',
    price: 1100,
    color: '#d35400',
  },
  {
    id: 6,
    title: 'Евгений Онегин',
    author: 'Александр Пушкин',
    rating: 4.9,
    description: 'Роман в стихах.',
    price: 650,
    color: '#2980b9',
  },
  {
    id: 7,
    title: 'Герой нашего времени',
    author: 'Михаил Лермонтов',
    rating: 4.6,
    description: 'Психологический роман о Печорине.',
    price: 720,
    color: '#7f8c8d',
  },
  {
    id: 8,
    title: 'Мёртвые души',
    author: 'Николай Гоголь',
    rating: 4.5,
    description: 'Похождения Чичикова.',
    price: 690,
    color: '#27ae60',
  },
  {
    id: 9,
    title: 'Отцы и дети',
    author: 'Иван Тургенев',
    rating: 4.4,
    description: 'Конфликт поколений.',
    price: 610,
    color: '#e67e22',
  },
  {
    id: 10,
    title: 'Идиот',
    author: 'Фёдор Достоевский',
    rating: 4.7,
    description: 'Князь Мышкин и петербургское общество.',
    price: 820,
    color: '#34495e',
  },
  {
    id: 11,
    title: 'Братья Карамазовы',
    author: 'Фёдор Достоевский',
    rating: 4.8,
    description: 'Семейная драма и философские искания.',
    price: 1050,
    color: '#8e44ad',
  },
  {
    id: 12,
    title: 'Обломов',
    author: 'Иван Гончаров',
    rating: 4.3,
    description: 'История «лишнего человека».',
    price: 640,
    color: '#e74c3c',
  },
  {
    id: 13,
    title: 'Капитанская дочка',
    author: 'Александр Пушкин',
    rating: 4.6,
    description: 'Пугачёвское восстание глазами юного офицера.',
    price: 520,
    color: '#c0392b',
  },
  {
    id: 14,
    title: 'Ревизор',
    author: 'Николай Гоголь',
    rating: 4.4,
    description: 'Комедия о мнимом ревизоре.',
    price: 480,
    color: '#27ae60',
  },
  {
    id: 15,
    title: 'Гроза',
    author: 'Александр Островский',
    rating: 4.3,
    description: 'Драма о судьбе Катерины.',
    price: 460,
    color: '#16a085',
  },
  {
    id: 16,
    title: 'Горе от ума',
    author: 'Александр Грибоедов',
    rating: 4.5,
    description: 'Комедия о московском обществе.',
    price: 470,
    color: '#d35400',
  },
  {
    id: 17,
    title: 'Доктор Живаго',
    author: 'Борис Пастернак',
    rating: 4.6,
    description: 'Судьба интеллигенции в годы революции.',
    price: 920,
    color: '#2980b9',
  },
  {
    id: 18,
    title: 'Собачье сердце',
    author: 'Михаил Булгаков',
    rating: 4.8,
    description: 'Эксперимент профессора Преображенского.',
    price: 580,
    color: '#8e44ad',
  },
  {
    id: 19,
    title: 'Белая гвардия',
    author: 'Михаил Булгаков',
    rating: 4.5,
    description: 'Семья Турбиных в годы Гражданской войны.',
    price: 730,
    color: '#2c3e50',
  },
  {
    id: 20,
    title: 'Двенадцать стульев',
    author: 'Ильф и Петров',
    rating: 4.7,
    description: 'Похождения Остапа Бендера.',
    price: 660,
    color: '#7f8c8d',
  },
  {
    id: 21,
    title: 'Золотой телёнок',
    author: 'Ильф и Петров',
    rating: 4.6,
    description: 'Продолжение приключений Бендера.',
    price: 680,
    color: '#27ae60',
  },
  {
    id: 22,
    title: 'Мы',
    author: 'Евгений Замятин',
    rating: 4.4,
    description: 'Антиутопия о едином государстве.',
    price: 540,
    color: '#e67e22',
  },
  {
    id: 23,
    title: 'Котлован',
    author: 'Андрей Платонов',
    rating: 4.2,
    description: 'Строительство будущего и его цена.',
    price: 510,
    color: '#34495e',
  },
  {
    id: 24,
    title: 'Чевенгур',
    author: 'Андрей Платонов',
    rating: 4.1,
    description: 'Утопия и её крушение.',
    price: 590,
    color: '#8e44ad',
  },
  {
    id: 25,
    title: 'Лолита',
    author: 'Владимир Набоков',
    rating: 4.3,
    description: 'Спорный роман о запретной страсти.',
    price: 870,
    color: '#e74c3c',
  },
  {
    id: 26,
    title: 'Дар',
    author: 'Владимир Набоков',
    rating: 4.4,
    description: 'Роман о писателе и его пути.',
    price: 790,
    color: '#c0392b',
  },
  {
    id: 27,
    title: 'Архипелаг ГУЛАГ',
    author: 'Александр Солженицын',
    rating: 4.9,
    description: 'Исследование советской лагерной системы.',
    price: 1450,
    color: '#2c3e50',
  },
];

const BOOKS = Array.from({length: 27}, (_, i) => {
  const base = BASE_BOOKS[i % BASE_BOOKS.length];
  return {...base, id: i + 1};
});

function BookCard({book}) {
  return (
    <article className="book-card" data-testid="book-card">
      <div className="book-cover" style={{background: book.color}}>
        <span className="book-cover-letter">{book.title.slice(0, 1)}</span>
      </div>
      <h3 className="book-title">{book.title}</h3>
      <p className="book-author">{book.author}</p>
      <div className="book-rating" aria-label={`Рейтинг ${book.rating}`}>
        {'★'.repeat(Math.round(book.rating))}
        <span className="book-rating-value">{book.rating.toFixed(1)}</span>
      </div>
      <p className="book-description">{book.description}</p>
      <div className="book-price">{book.price} ₽</div>
    </article>
  );
}

function getPageNumbers(current, total, maxVisible = 5) {
  const pages = [];
  let start = Math.max(1, current - Math.floor(maxVisible / 2));
  const end = Math.min(total, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  for (let i = start; i <= end; i += 1) {
    pages.push(i);
  }
  return {pages, start, end};
}

function Pagination({currentPage, totalPages, onChange}) {
  const {pages, start, end} = getPageNumbers(currentPage, totalPages);

  return (
    <nav className="pagination" aria-label="Пагинация">
      <button
        type="button"
        data-testid="page-previous"
        className="page-btn"
        disabled={currentPage === 1}
        onClick={() => onChange(currentPage - 1)}
      >
        ← Назад
      </button>

      {start > 1 && <span className="page-ellipsis">…</span>}

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          data-testid="page-number"
          className={`page-btn page-number${p === currentPage ? ' active' : ''}`}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}

      {end < totalPages && <span className="page-ellipsis">…</span>}

      <button
        type="button"
        data-testid="page-next"
        className="page-btn"
        disabled={currentPage === totalPages}
        onClick={() => onChange(currentPage + 1)}
      >
        Вперёд →
      </button>

      <span data-testid="page-indicator" className="page-indicator">
        Страница {currentPage} из {totalPages}
      </span>
    </nav>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(BOOKS.length / BOOKS_PER_PAGE);

  const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
  const pageBooks = BOOKS.slice(startIndex, startIndex + BOOKS_PER_PAGE);

  const handleChange = (page) => {
    const safe = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(safe);
  };

  return (
    <div className="app">
      <h1 className="app-title">Книжный магазин</h1>

      <section className="book-list" aria-label="Список книг">
        {pageBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </section>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={handleChange}
      />
    </div>
  );
}

const rootElement = document.querySelector('[data-testid="app"]');

if (!rootElement) {
  throw new Error('Корневой элемент приложения не найден.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
