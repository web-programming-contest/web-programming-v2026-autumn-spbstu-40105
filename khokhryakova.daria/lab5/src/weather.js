export const WEATHER_DATA = {
  Москва: {
    current: {
      temperature: 5,
      condition: 'Облачно',
      humidity: 78,
      wind: 4,
    },
    forecast: [
      {day: 'Пн', temperature: 4, condition: 'Облачно'},
      {day: 'Вт', temperature: 6, condition: 'Солнечно'},
      {day: 'Ср', temperature: 3, condition: 'Дождь'},
      {day: 'Чт', temperature: 5, condition: 'Облачно'},
      {day: 'Пт', temperature: 7, condition: 'Солнечно'},
      {day: 'Сб', temperature: 8, condition: 'Солнечно'},
      {day: 'Вс', temperature: 6, condition: 'Облачно'},
    ],
  },
  'Санкт-Петербург': {
    current: {
      temperature: 3,
      condition: 'Дождь',
      humidity: 85,
      wind: 6,
    },
    forecast: [
      {day: 'Пн', temperature: 2, condition: 'Дождь'},
      {day: 'Вт', temperature: 4, condition: 'Облачно'},
      {day: 'Ср', temperature: 3, condition: 'Дождь'},
      {day: 'Чт', temperature: 1, condition: 'Снег'},
      {day: 'Пт', temperature: 2, condition: 'Облачно'},
      {day: 'Сб', temperature: 3, condition: 'Облачно'},
      {day: 'Вс', temperature: 4, condition: 'Солнечно'},
    ],
  },
  Омск: {
    current: {
      temperature: 10,
      condition: 'Туман',
      humidity: 90,
      wind: 3,
    },
    forecast: [
      {day: 'Пн', temperature: 9, condition: 'Туман'},
      {day: 'Вт', temperature: 11, condition: 'Облачно'},
      {day: 'Ср', temperature: 12, condition: 'Дождь'},
      {day: 'Чт', temperature: 10, condition: 'Облачно'},
      {day: 'Пт', temperature: 9, condition: 'Туман'},
      {day: 'Сб', temperature: 11, condition: 'Солнечно'},
      {day: 'Вс', temperature: 13, condition: 'Солнечно'},
    ],
  },
  Новосибирск: {
    current: {
      temperature: 7,
      condition: 'Облачно',
      humidity: 80,
      wind: 6,
    },
    forecast: [
      {day: 'Пн', temperature: 9, condition: 'Дождь'},
      {day: 'Вт', temperature: 11, condition: 'Солнечно'},
      {day: 'Ср', temperature: 12, condition: 'Солнечно'},
      {day: 'Чт', temperature: 10, condition: 'Облачно'},
      {day: 'Пт', temperature: 9, condition: 'Туман'},
      {day: 'Сб', temperature: 11, condition: 'Дождь'},
      {day: 'Вс', temperature: 13, condition: 'Солнечно'},
    ],
  },
};
