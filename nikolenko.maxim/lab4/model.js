export class Library {
  constructor(name, books = []) {
    this.name = name;
    this.books = books.map((book) => ({...book}));
  }

  addBook(book) {
    this.books.push({
      title: book.title,
      author: book.author,
      year: Number(book.year),
      genre: book.genre,
    });
  }

  removeBook(title) {
    this.books = this.books.filter((book) => book.title !== title);
  }

  get booksCount() {
    return this.books.length;
  }
}

function collectBooks(libraries) {
  return libraries.flatMap((library) => library.books);
}

function groupBy(books, key) {
  const groups = new Map();
  for (const book of books) {
    if (!groups.has(book[key])) {
      groups.set(book[key], []);
    }
    groups.get(book[key]).push(book);
  }
  return groups;
}

export function groupBooksByGenre(libraries) {
  return groupBy(collectBooks(libraries), 'genre');
}

export function getUniqueAuthors(libraries) {
  return [...new Set(collectBooks(libraries).map((book) => book.author))];
}

export function groupBooksByYear(libraries) {
  return groupBy(collectBooks(libraries), 'year');
}

export function getUniqueYears(libraries) {
  const years = collectBooks(libraries).map((book) => book.year);
  return [...new Set(years)].sort((a, b) => a - b);
}

export function findBooksByAuthor(libraries, author) {
  const needle = String(author).trim().toLowerCase();
  return collectBooks(libraries).filter(
    (book) => book.author.toLowerCase() === needle,
  );
}

// Обратная совместимость с существующим кодом интерфейса.
export const getBooksByAuthor = findBooksByAuthor;
