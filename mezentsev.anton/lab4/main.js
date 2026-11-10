import {
  Movie,
  groupMoviesByDirector,
  getUniqueActors,
  groupMoviesByCastSize,
  findMoviesByActor,
  getMovieTitles,
} from './model.js';

const storageKey = 'lab4-variant28-movies';
const list = document.querySelector('[data-testid="entity-list"]');
const form = document.querySelector('[data-testid="entity-form"]');
const status = document.querySelector('.status');
const query = document.querySelector('[name="query"]');
const search = document.querySelector('[name="actor-search"]');
const result = document.querySelector('.query-result');
let busy = false;

function loadMovies() {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored === null) {
      return [];
    }
    const data = JSON.parse(stored);
    if (
      !Array.isArray(data) ||
      !data.every(
        (item) =>
          item &&
          typeof item.title === 'string' &&
          typeof item.director === 'string' &&
          Array.isArray(item.actors) &&
          item.actors.every((actor) => typeof actor === 'string'),
      )
    ) {
      throw new Error('Некорректные данные');
    }
    // Восстанавливаем экземпляры класса вместе с методами и геттером.
    return data.map(
      (item) => new Movie(item.title, item.director, item.actors),
    );
  } catch {
    status.textContent =
      'Не удалось прочитать сохранённую коллекцию. Можно создать новую.';
    return [];
  }
}

let movies = loadMovies();

// Пользовательский текст вставляется через textContent, а не HTML.
function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) {
    node.textContent = text;
  }
  if (className) {
    node.className = className;
  }
  return node;
}

function button(text, className, onClick) {
  const node = element('button', text, className);
  node.type = 'button';
  node.addEventListener('click', onClick);
  return node;
}

// Все изменения коллекции выполняются после асинхронной задержки.
async function changeCollection(action, message) {
  if (busy) {
    return false;
  }
  busy = true;
  document.querySelectorAll('button').forEach((node) => {
    node.disabled = true;
  });
  status.textContent = 'Сохраняем изменения…';
  try {
    await new Promise((resolve) => {
      setTimeout(resolve, 300);
    });
    action();
    render();
    try {
      localStorage.setItem(storageKey, JSON.stringify(movies));
      status.textContent = message;
    } catch {
      status.textContent =
        'Изменения применены, но браузер не смог их сохранить.';
    }
    return true;
  } finally {
    busy = false;
    document.querySelectorAll('button').forEach((node) => {
      node.disabled = false;
    });
  }
}

function renderMovie(movie) {
  const card = element('article', undefined, 'movie-card');
  card.dataset.testid = 'entity-card';
  card.append(
    element('h3', movie.title),
    element('p', `Режиссёр: ${movie.director}`, 'director'),
  );
  card.append(element('p', `Актёры: ${movie.castSize}`, 'cast-heading'));
  const actors = element('ul', undefined, 'actor-list');
  for (const name of movie.actors) {
    const row = element('li', undefined, 'actor-row');
    const remove = button('Удалить актёра', 'secondary', () => {
      void changeCollection(() => movie.removeActor(name), 'Актёр удалён.');
    });
    remove.setAttribute('aria-label', `Удалить актёра ${name}`);
    row.append(element('span', name), remove);
    actors.append(row);
  }
  card.append(actors);
  if (movie.castSize === 0) {
    card.append(element('p', 'Актёры пока не добавлены.', 'director'));
  }

  const actorForm = element('form', undefined, 'actor-form');
  const label = element('label', 'Имя актёра');
  const input = element('input');
  input.type = 'text';
  input.name = 'actor';
  input.required = true;
  input.maxLength = 200;
  label.append(input);
  const add = element('button', 'Добавить актёра');
  add.type = 'submit';
  actorForm.append(label, add);
  actorForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = input.value.trim();
    if (!name) {
      status.textContent = 'Введите имя актёра.';
      return;
    }
    if (movie.actors.includes(name)) {
      status.textContent = 'Этот актёр уже добавлен.';
      return;
    }
    void changeCollection(() => movie.addActor(name), 'Актёр добавлен.');
  });
  const removeMovie = button('Удалить фильм', 'secondary delete-movie', () => {
    void changeCollection(() => {
      movies = movies.filter((item) => item !== movie);
    }, 'Фильм удалён.');
  });
  removeMovie.dataset.testid = 'delete-entity';
  card.append(actorForm, removeMovie);
  return card;
}

function showItems(items) {
  if (items.length === 0) {
    result.append(element('p', 'Нет данных для отображения.'));
    return;
  }
  const ul = element('ul');
  for (const item of items) {
    ul.append(element('li', item));
  }
  result.append(ul);
}

function renderQuery() {
  result.replaceChildren();
  search.disabled = query.value !== 'search';
  if (query.value === 'titles') {
    showItems(getMovieTitles(movies));
  }
  if (query.value === 'actors') {
    showItems(getUniqueActors(movies));
  }
  if (query.value === 'search') {
    showItems(getMovieTitles(findMoviesByActor(movies, search.value.trim())));
  }
  if (query.value === 'directors' || query.value === 'sizes') {
    const groups =
      query.value === 'directors'
        ? groupMoviesByDirector(movies)
        : groupMoviesByCastSize(movies);
    if (groups.size === 0) {
      showItems([]);
    }
    for (const [key, items] of groups) {
      result.append(
        element(
          'h3',
          query.value === 'sizes' ? `Количество актёров: ${key}` : key,
        ),
      );
      showItems(getMovieTitles(items));
    }
  }
}

function render() {
  list.replaceChildren(...movies.map(renderMovie));
  if (movies.length === 0) {
    list.append(
      element('p', 'Пока здесь пусто. Добавьте первый фильм выше.', 'empty'),
    );
  }
  document.querySelector('.movie-count').textContent =
    `Всего: ${movies.length}`;
  renderQuery();
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const title = data.get('title').trim();
  const director = data.get('director').trim();
  if (!title || !director) {
    status.textContent = 'Заполните название и режиссёра.';
    return;
  }
  const changed = await changeCollection(() => {
    movies.push(new Movie(title, director));
  }, 'Фильм добавлен.');
  if (changed) {
    form.reset();
  }
});
query.addEventListener('change', renderQuery);
search.addEventListener('input', renderQuery);
render();
