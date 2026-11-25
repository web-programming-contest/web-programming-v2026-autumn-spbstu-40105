const category = (label, ...categories) => ({
  label,
  matches: (product) => categories.includes(product.category),
});
const specific = (label, ...ids) => ({
  label,
  matches: (product) => ids.includes(product.id),
});

const charging = category('Подзарядка в пути', 'Внешние аккумуляторы');
const listening = category('Музыка и звонки', 'Наушники и гарнитуры');
const lighting = category('Освещение', 'Умный дом');
const speaker = category('Музыка для компании', 'Портативная акустика');
const microphone = specific('Запись звука на устройство с USB-C', 17);
const loginKey = specific('Подтверждение входа через NFC', 26);

export const scenarios = {
  travel: {
    group: 'Дорога и прогулки',
    name: 'В дорогу',
    roles: [charging, listening],
  },
  luggage: {
    group: 'Дорога и прогулки',
    name: 'В длительную поездку',
    roles: [category('Багаж', 'Электротранспорт'), charging, listening],
  },
  picnic: {
    group: 'Дорога и прогулки',
    name: 'На пикник',
    roles: [speaker, charging],
  },
  sport: {
    group: 'Спорт и самочувствие',
    name: 'На тренировку',
    roles: [
      category('Отслеживание активности', 'Умные часы', 'Фитнес-браслеты'),
      category('Музыка на тренировке', 'Наушники и гарнитуры'),
    ],
  },
  wellness: {
    group: 'Спорт и самочувствие',
    name: 'Для ежедневной активности',
    roles: [
      category('Шаги и активность', 'Фитнес-браслеты'),
      category('Дыхательные упражнения', 'Здоровье'),
    ],
  },
  smartphone: {
    group: 'Связь и работа',
    name: 'Новый смартфон с аксессуарами',
    roles: [category('Смартфон', 'Смартфоны'), listening, charging],
  },
  calls: {
    group: 'Связь и работа',
    name: 'Для удалённой работы',
    roles: [specific('Рабочие звонки', 3, 4), loginKey],
  },
  security: {
    group: 'Связь и работа',
    name: 'Для цифровой безопасности',
    roles: [loginKey, specific('Хранение ключей к цифровым активам', 27)],
  },
  video: {
    group: 'Съёмка и запись',
    name: 'Для записи видео',
    roles: [specific('Съёмка видео', 16), microphone],
  },
  audio: {
    group: 'Съёмка и запись',
    name: 'Для озвучки и подкаста',
    roles: [microphone, specific('Прослушивание готовой записи', 13, 14, 15)],
  },
  home: {
    group: 'Дом и отдых',
    name: 'Для уютного вечера',
    roles: [lighting, speaker],
  },
  vr: {
    group: 'Дом и отдых',
    name: 'Для зоны виртуальной реальности',
    roles: [
      category('Просмотр VR-контента', 'Виртуальная реальность'),
      lighting,
    ],
  },
  gift: {
    group: 'Дом и отдых',
    name: 'Небольшой подарок',
    roles: [
      category('Подарок для подзарядки устройств', 'Внешние аккумуляторы'),
      specific('Чехол с карабином', 18, 19, 20, 21),
    ],
  },
};

export function customScenario(categories) {
  return {roles: categories.map((name) => category(name, name))};
}

export function findBundle(goods, scenario, budget) {
  const candidates = scenario.roles.map((role) => goods.filter(role.matches));
  const selected = [];
  const usedIds = new Set();
  let minimum = Infinity;
  let best = null;

  function visit(roleIndex, total, popularity) {
    if (roleIndex === candidates.length) {
      minimum = Math.min(minimum, total);
      if (
        total <= budget &&
        (!best ||
          popularity > best.popularity ||
          (popularity === best.popularity && total < best.total))
      ) {
        best = {products: [...selected], total, popularity};
      }
      return;
    }

    for (const product of candidates[roleIndex]) {
      if (usedIds.has(product.id)) {
        continue;
      }
      selected.push(product);
      usedIds.add(product.id);
      visit(
        roleIndex + 1,
        total + product.price,
        popularity + product.popularity,
      );
      usedIds.delete(product.id);
      selected.pop();
    }
  }

  visit(0, 0, 0);
  return {best, minimum};
}
