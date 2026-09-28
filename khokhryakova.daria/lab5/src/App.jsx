import React, {useState} from 'react';
import {WEATHER_DATA} from './weather.js';

export default function App() {
  const [city, setCity] = useState('Санкт-Петербург');
  const [selectedCity, setSelectedCity] = useState('Санкт-Петербург');
  const [days, setDays] = useState(3);

  const weather = WEATHER_DATA[selectedCity] ?? WEATHER_DATA['Санкт-Петербург'];
  const forecast = weather.forecast.slice(0, days);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = city.trim();

    if (WEATHER_DATA[trimmed]) {
      setSelectedCity(trimmed);
    } else {
      setSelectedCity('Санкт-Петербург');
    }
  };

  return (
    <main data-testid="app">
      <h1>Прогноз погоды</h1>

      <form onSubmit={handleSubmit} className="weather-form">
        <input
          type="text"
          data-testid="weather-city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Введите город"
        />
        <button type="submit" data-testid="weather-submit">
          Показать
        </button>
      </form>

      <section data-testid="weather-current" className="current">
        <h2>Сейчас в городе {selectedCity}</h2>
        <p>Температура {weather.current.temperature}°C</p>
        <p>Состояние {weather.current.condition}</p>
        <p>Влажность {weather.current.humidity}%</p>
        <p>Ветер {weather.current.wind}</p>
      </section>

      <section className="days-switch">
        <button type="button" onClick={() => setDays(1)}>
          1 день
        </button>
        <button type="button" onClick={() => setDays(3)}>
          3 дня
        </button>
        <button type="button" onClick={() => setDays(7)}>
          7 дней
        </button>
      </section>

      <section data-testid="weather-forecast" className="forecast">
        <h2>Прогноз на {days} дней</h2>
        <ul>
          {forecast.map((item) => (
            <li key={item.day}>
              <h3>
                <strong>{item.day}</strong>
              </h3>
              <p>Температура {item.temperature}°C,</p>
              <p>Состояние {item.condition}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
