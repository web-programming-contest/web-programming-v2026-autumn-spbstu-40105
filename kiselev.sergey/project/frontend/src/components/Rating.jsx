import {formatRating} from '../utils/format.js';

export default function Rating({value}) {
  return (
    <p className="rating" aria-label={`Рейтинг ${formatRating(value)} из 5`}>
      <svg
        className="rating-star"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
      </svg>
      {formatRating(value)}
    </p>
  );
}
