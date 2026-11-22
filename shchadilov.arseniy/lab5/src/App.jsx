import {useEffect, useState} from 'react';
import {
  fetchWeatherByCity,
  getFallbackWeather,
  shouldUseOfflineMode,
} from './weatherService.js';

const DEFAULT_CITY = 'Санкт-Петербург';
const FORECAST_INTERVALS = [1, 3, 7];
const INTERVAL_LABELS = new Map([
  [1, '1 день'],
  [3, '3 дня'],
  [7, '7 дней'],
]);

function formatDate(isoDate) {
  const parsed = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }

  return parsed.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    weekday: 'short',
  });
}

export default function App() {
  const [cityInput, setCityInput] = useState(DEFAULT_CITY);
  const [daysCount, setDaysCount] = useState(7);
  const [weather, setWeather] = useState(() =>
    getFallbackWeather(DEFAULT_CITY),
  );
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (shouldUseOfflineMode()) {
      return undefined;
    }

    let cancelled = false;
    setLoading(true);

    fetchWeatherByCity(DEFAULT_CITY)
      .then((data) => {
        if (!cancelled) {
          setWeather(data);
          setErrorMessage('');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setWeather(getFallbackWeather(DEFAULT_CITY));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const targetCity = cityInput.trim();
    if (!targetCity) {
      setErrorMessage('Введите название города.');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      const nextWeather = await fetchWeatherByCity(targetCity);
      setWeather(nextWeather);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Ошибка загрузки погоды.',
      );
    } finally {
      setLoading(false);
    }
  }

  const visibleForecast = weather.forecast.slice(0, daysCount);
  const locationLabel = weather.country
    ? `${weather.city}, ${weather.country}`
    : weather.city;

  return (
    <div className="weather-app">
      <header className="weather-header">
        <h1>Прогноз погоды</h1>
        <span className="source-badge">
          {weather.source === 'api' ? 'Open-Meteo API' : 'Локальный режим'}
        </span>
      </header>

      <form className="search-form" onSubmit={handleSubmit}>
        <input
          data-testid="weather-city"
          className="city-input"
          type="text"
          value={cityInput}
          onChange={(event) => setCityInput(event.target.value)}
          placeholder="Введите город (например, Москва)"
          aria-label="Город"
        />
        <button
          data-testid="weather-submit"
          className="submit-btn"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Загрузка...' : 'Показать погоду'}
        </button>
      </form>

      {errorMessage && (
        <p className="error-banner" role="alert">
          {errorMessage}
        </p>
      )}

      <section
        className="current-weather"
        data-testid="weather-current"
        aria-label="Текущая погода"
      >
        <div className="current-main">
          <div>
            <h2 className="city-title">{locationLabel}</h2>
            <p className="condition-text">{weather.current.condition}</p>
          </div>
          <p className="temperature-value">{weather.current.temperature}°C</p>
        </div>

        <dl className="metrics-grid">
          <div className="metric-item">
            <dt>Ощущается как</dt>
            <dd>{weather.current.apparentTemperature}°C</dd>
          </div>
          <div className="metric-item">
            <dt>Влажность</dt>
            <dd>{weather.current.humidity}%</dd>
          </div>
          <div className="metric-item">
            <dt>Ветер</dt>
            <dd>{weather.current.windSpeed} м/с</dd>
          </div>
        </dl>
      </section>

      <section className="forecast-section" aria-label="Прогноз по дням">
        <div className="forecast-header">
          <h2>Прогноз на {daysCount} дн.</h2>
          <div
            className="interval-controls"
            role="group"
            aria-label="Интервал прогноза"
          >
            {FORECAST_INTERVALS.map((interval) => (
              <button
                key={interval}
                type="button"
                className={
                  daysCount === interval
                    ? 'interval-btn is-active'
                    : 'interval-btn'
                }
                onClick={() => setDaysCount(interval)}
              >
                {INTERVAL_LABELS.get(interval)}
              </button>
            ))}
          </div>
        </div>

        <ul className="forecast-list" data-testid="weather-forecast">
          {visibleForecast.map((day) => (
            <li key={day.date} className="forecast-card">
              <span className="forecast-date">{formatDate(day.date)}</span>
              <span className="forecast-condition">{day.condition}</span>
              <span className="forecast-temp">
                {day.tempMin}° … {day.tempMax}°C
              </span>
              <span className="forecast-rain">
                Осадки: {day.precipitationChance}%
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
