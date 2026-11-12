import {useState} from 'react';

import {COLOR_LABELS, EMPTY_FILTERS, TYPE_LABELS} from '../../utils/catalog.js';
import PriceRange from './PriceRange.jsx';

function toggle(list, value) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

function CheckboxGroup({title, values, labels, checked, onToggle}) {
  return (
    <fieldset className="filters-group">
      <legend className="filters-title">{title}</legend>
      {values.map((value) => (
        <label key={value} className="checkbox">
          <input
            type="checkbox"
            checked={checked.includes(value)}
            onChange={() => onToggle(value)}
          />
          {labels[value]}
        </label>
      ))}
    </fieldset>
  );
}

export default function CatalogFilters({
  bounds,
  types,
  colors,
  onApply,
  onReset,
}) {
  const [draft, setDraft] = useState(EMPTY_FILTERS);

  function update(patch) {
    setDraft((current) => ({...current, ...patch}));
  }

  function handlePrice(event) {
    update({[event.target.name]: event.target.value.replace(/\D/g, '')});
  }

  function handleSubmit(event) {
    event.preventDefault();
    onApply(draft);
  }

  function handleReset() {
    setDraft(EMPTY_FILTERS);
    onReset();
  }

  return (
    <form
      className="filters"
      aria-label="Фильтры"
      noValidate
      onSubmit={handleSubmit}
    >
      <fieldset className="filters-group">
        <legend className="filters-title">Цена, ₽</legend>
        <div className="filters-price">
          <label className="field">
            <span className="field-label">От</span>
            <input
              className="field-input"
              name="priceFrom"
              inputMode="numeric"
              placeholder={String(bounds.min)}
              value={draft.priceFrom}
              onChange={handlePrice}
            />
          </label>
          <label className="field">
            <span className="field-label">До</span>
            <input
              className="field-input"
              name="priceTo"
              inputMode="numeric"
              placeholder={String(bounds.max)}
              value={draft.priceTo}
              onChange={handlePrice}
            />
          </label>
        </div>
        <PriceRange
          min={bounds.min}
          max={bounds.max}
          from={draft.priceFrom}
          to={draft.priceTo}
          onChange={update}
        />
      </fieldset>

      <CheckboxGroup
        title="Тип товара"
        values={types}
        labels={TYPE_LABELS}
        checked={draft.types}
        onToggle={(type) => update({types: toggle(draft.types, type)})}
      />
      <CheckboxGroup
        title="Цвет"
        values={colors}
        labels={COLOR_LABELS}
        checked={draft.colors}
        onToggle={(color) => update({colors: toggle(draft.colors, color)})}
      />

      <div className="filters-actions">
        <button type="submit" className="button">
          Показать
        </button>
        <button type="button" className="link-pink" onClick={handleReset}>
          Сбросить
        </button>
      </div>
    </form>
  );
}
