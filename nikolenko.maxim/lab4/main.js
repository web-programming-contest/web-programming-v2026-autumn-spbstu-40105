import {
  Library,
  getBooksByAuthor,
  getUniqueAuthors,
  getUniqueYears,
  groupBooksByGenre,
} from './model.js';

const STORAGE_KEY = 'libraries-v1';
const DELAY_MS = 500;

let libraries = [];
let current = 0;

const statusEl = document.querySelector('#status');
const selectEl = document.querySelector('#library-select');
const listEl = document.querySelector('[data-testid="entity-list"]');
const emptyEl = document.querySelector('#empty-note');
const booksTitleEl = document.querySelector('#books-title');
const bookForm = document.querySelector('[data-testid="entity-form"]');
const libraryForm = document.querySelector('#library-form');
const authorForm = document.querySelector('#author-form');

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({current, libraries}));
  } catch {
    statusEl.textContent = 'Не удалось сохранить данные в localStorage.';
  }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      libraries = data.libraries.map(
        (item) => new Library(item.name, item.books),
      );
      current = Math.min(Number(data.current) || 0, libraries.length - 1);
    }
  } catch {
    libraries = [];
  }
  if (libraries.length === 0) {
    libraries = [new Library('Моя библиотека')];
    current = 0;
  }
  current = Math.max(current, 0);
}

function delay(action) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(action());
      } catch (error) {
        reject(error);
      }
    }, DELAY_MS);
  });
}

async function runAction(message, action) {
  statusEl.textContent = message;
  try {
    await delay(action);
    save();
    statusEl.textContent = 'Готово.';
  } catch (error) {
    statusEl.textContent = `Ошибка: ${error.message}`;
  }
  render();
}

function createElement(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) {
    node.textContent = text;
  }
  if (className) {
    node.className = className;
  }
  return node;
}

function createCard(library, book) {
  const card = createElement('article', undefined, 'card');
  card.dataset.testid = 'entity-card';

  const remove = createElement('button', 'Удалить', 'button button-danger');
  remove.type = 'button';
  remove.dataset.testid = 'delete-entity';
  remove.addEventListener('click', () => {
    runAction('Удаляем книгу…', () => library.removeBook(book.title));
  });

  card.append(
    createElement('h3', book.title, 'card-title'),
    createElement('p', `Автор: ${book.author}`, 'card-text'),
    createElement('p', `Год: ${book.year || '—'}`, 'card-text'),
    createElement('p', `Жанр: ${book.genre}`, 'card-text'),
    remove,
  );
  return card;
}

function renderSelect() {
  selectEl.replaceChildren(
    ...libraries.map((library, index) => {
      const option = createElement(
        'option',
        `${library.name} (${library.booksCount})`,
      );
      option.value = String(index);
      return option;
    }),
  );
  selectEl.value = String(current);
}

function renderCards() {
  const library = libraries[current];
  booksTitleEl.textContent = `Книги: ${library.name} — ${library.booksCount}`;
  emptyEl.hidden = library.books.length > 0;
  listEl.replaceChildren(
    ...library.books.map((book) => createCard(library, book)),
  );
}

function renderStats() {
  const genres = [...groupBooksByGenre(libraries)].map(
    ([genre, books]) => `${genre || '—'} (${books.length})`,
  );
  document.querySelector('#stat-genres').textContent = genres.join(', ') || '—';
  document.querySelector('#stat-years').textContent =
    getUniqueYears(libraries).filter(Boolean).join(', ') || '—';
  document.querySelector('#stat-authors').textContent =
    getUniqueAuthors(libraries).join(', ') || '—';
}

function render() {
  renderSelect();
  renderCards();
  renderStats();
}

selectEl.addEventListener('change', () => {
  current = Number(selectEl.value);
  save();
  render();
});

libraryForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = new FormData(libraryForm).get('libraryName').trim();
  if (!name) {
    statusEl.textContent = 'Введите название библиотеки.';
    return;
  }
  runAction('Добавляем библиотеку…', () => {
    libraries.push(new Library(name));
    current = libraries.length - 1;
    libraryForm.reset();
  });
});

document.querySelector('#delete-library').addEventListener('click', () => {
  runAction('Удаляем библиотеку…', () => {
    libraries.splice(current, 1);
    if (libraries.length === 0) {
      libraries.push(new Library('Моя библиотека'));
    }
    current = Math.min(current, libraries.length - 1);
  });
});

bookForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(bookForm);
  const book = {
    title: String(data.get('name') ?? '').trim(),
    author: String(data.get('author') ?? '').trim(),
    year: data.get('year') || 0,
    genre: String(data.get('genre') ?? '').trim(),
  };
  if (!book.title) {
    statusEl.textContent = 'Введите название книги.';
    return;
  }
  const library = libraries[current];
  runAction('Добавляем книгу…', () => {
    library.addBook(book);
    bookForm.reset();
  });
});

authorForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const query = new FormData(authorForm).get('authorQuery');
  const found = getBooksByAuthor(libraries, query);
  document.querySelector('#author-result').textContent = found.length
    ? found.map((book) => `${book.title} (${book.year})`).join('; ')
    : 'Ничего не найдено.';
});

window.addEventListener('beforeunload', save);

load();
render();
