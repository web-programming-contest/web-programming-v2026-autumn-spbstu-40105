const priceFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

export function BookCard({book}) {
  return (
    <article className="book-card" data-testid="book-card">
      <img
        className="book-cover"
        src={book.cover}
        alt={`Обложка книги «${book.title}»`}
        width="360"
        height="520"
      />
      <div className="book-info">
        <h2 className="book-title">{book.title}</h2>
        <p className="book-author">{book.author}</p>
        <p className="book-rating" aria-label={`Рейтинг ${book.rating} из 5`}>
          <span aria-hidden="true">★ </span>
          {book.rating.toFixed(1)}
        </p>
        <p className="book-description">{book.description}</p>
      </div>
      <p className="book-price">{priceFormatter.format(book.price)}</p>
    </article>
  );
}
