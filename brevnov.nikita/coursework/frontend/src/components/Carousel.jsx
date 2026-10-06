import { useRef } from 'react';
import './carousel.css';

// Простая карусель на нативном горизонтальном скролле (scroll-snap) —
// без сторонних библиотек: стрелки просто листают контейнер на ширину
// одной карточки, а не пересчитывают вручную индексы и трансформации.
export function Carousel({ title, items, renderItem }) {
  const trackRef = useRef(null);

  function scrollByCard(direction) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild;
    const step = card ? card.getBoundingClientRect().width + 16 : track.clientWidth;
    track.scrollBy({ left: direction * step, behavior: 'smooth' });
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="carousel">
      <div className="carousel-header">
        <h2 className="carousel-title">{title}</h2>
        <div className="carousel-controls">
          <button
            type="button"
            className="carousel-arrow"
            aria-label="Прокрутить назад"
            onClick={() => scrollByCard(-1)}
          >
            ‹
          </button>
          <button
            type="button"
            className="carousel-arrow"
            aria-label="Прокрутить вперёд"
            onClick={() => scrollByCard(1)}
          >
            ›
          </button>
        </div>
      </div>

      <div className="carousel-track" ref={trackRef}>
        {items.map((item) => (
          <div className="carousel-item" key={item.id}>
            {renderItem(item)}
          </div>
        ))}
      </div>
    </section>
  );
}
