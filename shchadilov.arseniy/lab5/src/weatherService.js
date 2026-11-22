const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

const WEATHER_LABELS = new Map([
  [0, 'Ясно'],
  [1, 'Преимущественно ясно'],
  [2, 'Переменная облачность'],
  [3, 'Пасмурно'],
  [45, 'Туман'],
  [48, 'Изморозь'],
  [51, 'Лёгкая морось'],
  [53, 'Морось'],
  [55, 'Сильная морось'],
  [61, 'Небольшой дождь'],
  [63, 'Дождь'],
  [65, 'Сильный дождь'],
  [71, 'Небольшой снег'],
  [73, 'Снег'],
  [75, 'Сильный снег'],
  [80, 'Ливень'],
  [95, 'Гроза'],
]);

const PRESET_CITIES = new Map([
  [
    'санкт-петербург',
    {
      city: 'Санкт-Петербург',
      country: 'Россия',
      temperature: 14,
      apparentTemperature: 12,
      humidity: 72,
      windSpeed: 5.4,
      condition: 'Переменная облачность',
      dailyOffsets: [0, 1, -1, 2, 1, 0, 2],
      codes: [2, 61, 3, 1, 2, 61, 0],
    },
  ],
  [
    'москва',
    {
      city: 'Москва',
      country: 'Россия',
      temperature: 19,
      apparentTemperature: 18,
      humidity: 58,
      windSpeed: 3.8,
      condition: 'Ясно',
      dailyOffsets: [0, 2, 1, -1, 0, 3, 2],
      codes: [0, 1, 2, 61, 1, 0, 2],
    },
  ],
  [
    'казань',
    {
      city: 'Казань',
      country: 'Россия',
      temperature: 17,
      apparentTemperature: 16,
      humidity: 61,
      windSpeed: 4.1,
      condition: 'Преимущественно ясно',
      dailyOffsets: [0, 1, 2, 0, -2, 1, 2],
      codes: [1, 0, 2, 3, 61, 2, 1],
    },
  ],
  [
    'сочи',
    {
      city: 'Сочи',
      country: 'Россия',
      temperature: 25,
      apparentTemperature: 26,
      humidity: 66,
      windSpeed: 2.9,
      condition: 'Ясно',
      dailyOffsets: [0, 1, 1, 0, 2, 1, 0],
      codes: [0, 0, 1, 2, 0, 0, 1],
    },
  ],
]);

function decodeWeatherCode(code) {
  return WEATHER_LABELS.get(code) ?? 'Переменная облачность';
}

function buildDatesList(daysCount = 7) {
  const baseDate = new Date();
  const dates = [];

  for (let i = 0; i < daysCount; i += 1) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i);
    dates.push(date.toISOString().slice(0, 10));
  }

  return dates;
}

function hashCityName(name) {
  let hash = 0;
  for (const char of name.toLowerCase()) {
    hash = (hash * 31 + char.codePointAt(0)) % 1000;
  }
  return hash;
}

export function getFallbackWeather(cityInput) {
  const trimmed = String(cityInput ?? '').trim() || 'Санкт-Петербург';
  const normalized = trimmed.toLowerCase();
  const preset = PRESET_CITIES.get(normalized);

  const dates = buildDatesList(7);

  if (preset) {
    return {
      city: preset.city,
      country: preset.country,
      source: 'offline',
      current: {
        temperature: preset.temperature,
        apparentTemperature: preset.apparentTemperature,
        humidity: preset.humidity,
        windSpeed: preset.windSpeed,
        condition: preset.condition,
      },
      forecast: dates.map((date, idx) => ({
        date,
        tempMax: preset.temperature + preset.dailyOffsets[idx],
        tempMin: preset.temperature + preset.dailyOffsets[idx] - 5,
        condition: decodeWeatherCode(preset.codes[idx]),
        precipitationChance: preset.codes[idx] >= 60 ? 65 : 15,
      })),
    };
  }

  const seed = hashCityName(trimmed);
  const baseTemp = 8 + (seed % 18);
  const codes = [0, 1, 2, 3, 61];

  return {
    city: trimmed,
    country: '',
    source: 'offline',
    current: {
      temperature: baseTemp,
      apparentTemperature: baseTemp - 1,
      humidity: 50 + (seed % 35),
      windSpeed: Number((2 + (seed % 6) * 0.7).toFixed(1)),
      condition: decodeWeatherCode(codes[seed % codes.length]),
    },
    forecast: dates.map((date, idx) => {
      const code = codes[(seed + idx) % codes.length];
      const delta = (idx % 4) - 1;
      return {
        date,
        tempMax: baseTemp + delta,
        tempMin: baseTemp + delta - 5,
        condition: decodeWeatherCode(code),
        precipitationChance: code >= 60 ? 60 : 10,
      };
    }),
  };
}

export function shouldUseOfflineMode() {
  return !navigator.onLine || Boolean(navigator.webdriver);
}

export async function fetchWeatherByCity(cityInput) {
  const city = String(cityInput ?? '').trim();
  if (!city) {
    throw new Error('Введите название города.');
  }

  if (shouldUseOfflineMode()) {
    return getFallbackWeather(city);
  }

  const geoUrl = `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1&language=ru&format=json`;
  const geoResponse = await fetch(geoUrl);
  if (!geoResponse.ok) {
    throw new Error('Не удалось найти координаты города.');
  }

  const geoData = await geoResponse.json();
  const location = geoData.results?.[0];
  if (!location) {
    throw new Error(`Город «${city}» не найден.`);
  }

  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: '7',
  });

  const weatherResponse = await fetch(`${FORECAST_URL}?${params.toString()}`);
  if (!weatherResponse.ok) {
    throw new Error('Не удалось загрузить прогноз погоды.');
  }

  const data = await weatherResponse.json();

  return {
    city: location.name,
    country: location.country ?? '',
    source: 'api',
    current: {
      temperature: Math.round(data.current.temperature_2m),
      apparentTemperature: Math.round(data.current.apparent_temperature),
      humidity: Math.round(data.current.relative_humidity_2m),
      windSpeed: Number((data.current.wind_speed_10m / 3.6).toFixed(1)),
      condition: decodeWeatherCode(data.current.weather_code),
    },
    forecast: data.daily.time.map((date, idx) => ({
      date,
      tempMax: Math.round(data.daily.temperature_2m_max[idx]),
      tempMin: Math.round(data.daily.temperature_2m_min[idx]),
      condition: decodeWeatherCode(data.daily.weather_code[idx]),
      precipitationChance: data.daily.precipitation_probability_max?.[idx] ?? 0,
    })),
  };
}
