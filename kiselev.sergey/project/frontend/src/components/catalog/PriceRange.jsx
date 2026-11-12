const STEP = 10;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function PriceRange({min, max, from, to, onChange}) {
  const fromValue = clamp(from === '' ? min : Number(from), min, max);
  const toValue = clamp(to === '' ? max : Number(to), min, max);
  const span = max - min || 1;
  const left = ((Math.min(fromValue, toValue) - min) / span) * 100;
  const right = ((max - Math.max(fromValue, toValue)) / span) * 100;

  function handleFrom(event) {
    const value = Math.min(Number(event.target.value), toValue);
    onChange({priceFrom: value === min ? '' : String(value), priceTo: to});
  }

  function handleTo(event) {
    const value = Math.max(Number(event.target.value), fromValue);
    onChange({priceFrom: from, priceTo: value === max ? '' : String(value)});
  }

  return (
    <div className="price-range">
      <div className="price-range-track">
        <div
          className="price-range-fill"
          style={{left: `${left}%`, right: `${right}%`}}
        />
      </div>
      <input
        type="range"
        className="price-range-input"
        min={min}
        max={max}
        step={STEP}
        value={fromValue}
        aria-label="Минимальная цена"
        onChange={handleFrom}
      />
      <input
        type="range"
        className="price-range-input"
        min={min}
        max={max}
        step={STEP}
        value={toValue}
        aria-label="Максимальная цена"
        onChange={handleTo}
      />
    </div>
  );
}
