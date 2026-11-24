import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

const MOVIES = [
  {id: 1, title: 'Звёздный десант', genre: 'фантастика', theme: 'stellar'},
  {id: 2, title: 'Тихий океан', genre: 'драма', theme: 'ocean'},
  {id: 3, title: 'Городские тени', genre: 'триллер', theme: 'noir'},
  {id: 4, title: 'Стальная птица', genre: 'боевик', theme: 'steel'},
];

function App() {
  const [selectedMovie, setSelectedMovie] = useState(MOVIES[0]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const nextErrors = {};

    const name = formData.get('name') || '';
    if (name.trim().length < 2) {
      nextErrors.name = 'Имя должно быть не менее 2 символов';
    }

    const email = formData.get('email') || '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Введите корректный email';
    }

    const phone = formData.get('phone') || '';
    if (!/^\+\d+$/.test(phone)) {
      nextErrors.phone = 'Телефон: цифры и символ + в начале';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setIsConfirmed(true);
    }
  };

  const chooseMovie = (movie) => {
    setSelectedMovie(movie);
    setIsConfirmed(false);
  };

  return (
    <div className="app">
      <h1>Бронирование билетов</h1>

      <h2>Выберите фильм</h2>
      <div className="movie-grid">
        {MOVIES.map((movie) => (
          <button
            key={movie.id}
            type="button"
            className={
              selectedMovie.id === movie.id
                ? 'movie-card selected'
                : 'movie-card'
            }
            data-testid="movie-card"
            onClick={() => chooseMovie(movie)}
          >
            <span className={`poster poster-${movie.theme}`}>
              {movie.genre}
            </span>
            <span className="movie-title">{movie.title}</span>
          </button>
        ))}
      </div>

      <h2>Бронирование: {selectedMovie.title}</h2>

      <form
        className="booking-form"
        data-testid="booking-form"
        noValidate
        hidden={isConfirmed}
        onSubmit={handleSubmit}
      >
        <label>
          Имя *
          <input
            type="text"
            name="name"
            placeholder="Иван"
            data-testid="booking-name"
          />
        </label>
        {errors.name ? <p className="error">{errors.name}</p> : null}

        <label>
          Email *
          <input
            type="email"
            name="email"
            placeholder="ivan@example.ru"
            data-testid="booking-email"
          />
        </label>
        {errors.email ? <p className="error">{errors.email}</p> : null}

        <label>
          Телефон *
          <input
            type="tel"
            name="phone"
            placeholder="+79991234567"
            data-testid="booking-phone"
          />
        </label>
        {errors.phone ? <p className="error">{errors.phone}</p> : null}

        <label>
          Дата сеанса
          <input type="date" name="date" />
        </label>

        <label>
          Время
          <input type="time" name="time" />
        </label>

        <label>
          Количество билетов
          <input type="number" name="count" min="1" defaultValue="1" />
        </label>

        <label>
          Тип билета
          <select name="type">
            <option value="standard">Стандартный</option>
            <option value="vip">VIP</option>
          </select>
        </label>

        <button
          type="submit"
          className="primary-btn"
          data-testid="booking-submit"
        >
          Забронировать
        </button>
      </form>

      <div
        className="confirmation"
        data-testid="booking-confirmation"
        hidden={!isConfirmed}
      >
        <p>Билеты на фильм «{selectedMovie.title}» успешно забронированы!</p>
        <button
          type="button"
          className="confirmation-btn"
          onClick={() => setIsConfirmed(false)}
        >
          Новое бронирование
        </button>
      </div>
    </div>
  );
}

const rootElement = document.querySelector('[data-testid="app"]');
createRoot(rootElement).render(<App />);
