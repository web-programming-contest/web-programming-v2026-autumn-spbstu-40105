import {useMemo, useState} from 'react';
import {BookCard} from './components/BookCard.jsx';
import {SortBar} from './components/SortBar.jsx';
import {BOOKS} from './books.js';
import {INITIAL_SORT, getNextSort, sortBooks} from './sorting.js';

export function App() {
  const [sort, setSort] = useState(INITIAL_SORT);
  const sortedBooks = useMemo(() => sortBooks(BOOKS, sort), [sort]);

  return (
    <div className="shop">
      <header className="shop-header">
        <h1 className="shop-title">Русская классика</h1>
        <SortBar
          sort={sort}
          onSort={(key) => setSort((current) => getNextSort(current, key))}
        />
      </header>
      <section
        className="book-list"
        data-testid="book-list"
        aria-label="Список книг"
      >
        {sortedBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </section>
    </div>
  );
}
