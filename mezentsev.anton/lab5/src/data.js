// Учебный каталог: издательства условные, внешние запросы не используются.
export const books = [
  {
    id: 'b1',
    author: 'Александр Пушкин',
    publisher: 'Классика',
    genre: 'Роман в стихах',
    title: 'Евгений Онегин',
  },
  {
    id: 'b2',
    author: 'Александр Пушкин',
    publisher: 'Классика',
    genre: 'Проза',
    title: 'Капитанская дочка',
  },
  {
    id: 'b3',
    author: 'Александр Пушкин',
    publisher: 'Классика',
    genre: 'Проза',
    title: 'Повести Белкина',
  },
  {
    id: 'b4',
    author: 'Александр Пушкин',
    publisher: 'Литера',
    genre: 'Поэма',
    title: 'Руслан и Людмила',
  },
  {
    id: 'b5',
    author: 'Антон Чехов',
    publisher: 'Литера',
    genre: 'Рассказы',
    title: 'Дама с собачкой',
  },
  {
    id: 'b6',
    author: 'Антон Чехов',
    publisher: 'Литера',
    genre: 'Рассказы',
    title: 'Человек в футляре',
  },
  {
    id: 'b7',
    author: 'Антон Чехов',
    publisher: 'Классика',
    genre: 'Драматургия',
    title: 'Вишнёвый сад',
  },
  {
    id: 'b8',
    author: 'Николай Гоголь',
    publisher: 'Классика',
    genre: 'Проза',
    title: 'Мёртвые души',
  },
  {
    id: 'b9',
    author: 'Николай Гоголь',
    publisher: 'Литера',
    genre: 'Повесть',
    title: 'Шинель',
  },
];

// Группировка строится из плоского массива; входные данные не изменяются.
export function buildTree(items, level = 0, path = []) {
  const fields = ['author', 'publisher', 'genre'];
  if (level === fields.length) {
    return items.map((book) => ({id: book.id, label: book.title, count: 1}));
  }
  const groups = new Map();
  for (const book of items) {
    const key = book[fields[level]];
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(book);
  }
  return [...groups].map(([label, group]) => {
    const nextPath = [...path, label];
    return {
      id: JSON.stringify(nextPath),
      label,
      count: group.length,
      children: buildTree(group, level + 1, nextPath),
    };
  });
}

export function getBranchIds(nodes) {
  return nodes.flatMap((node) =>
    node.children ? [node.id, ...getBranchIds(node.children)] : [],
  );
}
