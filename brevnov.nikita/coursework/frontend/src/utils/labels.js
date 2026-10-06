// В goods.json типы и цвета хранятся служебными ключами ("fitness-bands",
// "lightblue"), а пользователю нужны человекочитаемые подписи — они живут
// здесь, отдельно от данных.
export const TYPE_LABELS = {
  smartphones: 'Смартфоны',
  headphones: 'Наушники',
  headsets: 'Гарнитуры',
  speakers: 'Акустика',
  powerbanks: 'Внешние аккумуляторы',
  watches: 'Умные часы',
  'fitness-bands': 'Фитнес-браслеты',
  cameras: 'Видеокамеры',
  microphones: 'Микрофоны',
  accessories: 'Аксессуары',
  'smart-home': 'Умный дом',
  security: 'Безопасность',
  vr: 'VR',
  'smart-luggage': 'Умные чемоданы',
  wellness: 'Здоровье',
};

export const COLOR_LABELS = {
  white: 'Белый',
  black: 'Чёрный',
  gray: 'Серый',
  purple: 'Фиолетовый',
  blue: 'Синий',
  lightblue: 'Голубой',
  green: 'Зелёный',
  red: 'Красный',
  yellow: 'Жёлтый',
  beige: 'Бежевый',
};

export function getTypeLabel(type) {
  return TYPE_LABELS[type] ?? type;
}

export function getColorLabel(color) {
  return COLOR_LABELS[color] ?? color;
}
