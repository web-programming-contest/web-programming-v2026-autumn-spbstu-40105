import {useState} from 'react';

import PreviewCard from './PreviewCard.jsx';

const VISIBLE_COUNT = 3;

export default function Carousel({icon, title, description, products}) {
  const [start, setStart] = useState(0);
  const count = products.length;
  const canScroll = count > VISIBLE_COUNT;
  const visible = Array.from(
    {length: Math.min(VISIBLE_COUNT, count)},
    (_, offset) => products[(start + offset) % count],
  );

  function scroll(step) {
    setStart((current) => (current + step + count) % count);
  }

  return (
    <section className="carousel">
      <div className="carousel-intro">
        <img src={icon} alt="" width="40" height="40" />
        <h2 className="carousel-title">{title}</h2>
        <p className="carousel-description">{description}</p>
      </div>
      <button
        type="button"
        className="carousel-arrow carousel-arrow-prev"
        aria-label={`${title}: назад`}
        disabled={!canScroll}
        onClick={() => scroll(-1)}
      />
      <ul className="carousel-list">
        {visible.map((product) => (
          <li key={product.id}>
            <PreviewCard product={product} />
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="carousel-arrow carousel-arrow-next"
        aria-label={`${title}: вперёд`}
        disabled={!canScroll}
        onClick={() => scroll(1)}
      />
    </section>
  );
}
