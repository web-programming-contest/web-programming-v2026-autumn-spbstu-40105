import {DIRECTION_ARROWS, DIRECTION_NAMES, SORT_OPTIONS} from '../sorting.js';

export function SortBar({sort, onSort}) {
  const activeOption = SORT_OPTIONS.find((option) => option.key === sort.key);
  const status =
    activeOption && sort.direction
      ? `${activeOption.label}, ${DIRECTION_NAMES[sort.direction]} ${DIRECTION_ARROWS[sort.direction]}`
      : 'не задано';

  return (
    <div className="sort-bar">
      <div className="sort-buttons" role="group" aria-label="Сортировка книг">
        {SORT_OPTIONS.map(({key, label}) => {
          const isActive = sort.key === key && sort.direction !== null;
          const arrow = isActive ? DIRECTION_ARROWS[sort.direction] : '';

          return (
            <button
              key={key}
              type="button"
              className={isActive ? 'sort-button is-active' : 'sort-button'}
              aria-pressed={isActive}
              data-testid={`sort-${key}`}
              onClick={() => onSort(key)}
            >
              {label}
              <span className="sort-arrow" aria-hidden="true">
                {arrow}
              </span>
            </button>
          );
        })}
      </div>
      <p
        className="sort-status"
        data-testid="sort-direction"
        aria-live="polite"
      >
        Сортировка: {status}
      </p>
    </div>
  );
}
