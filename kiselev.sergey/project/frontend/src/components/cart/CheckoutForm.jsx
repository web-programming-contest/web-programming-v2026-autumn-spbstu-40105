import {useId, useState} from 'react';

import TextField from '../TextField.jsx';
import {
  DELIVERY_OPTIONS,
  INITIAL_CONTACT,
  PAYMENT_OPTIONS,
  validateContact,
} from '../../utils/checkout.js';

function SelectField({label, error, options, value, ...selectProps}) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={`field ${error ? 'field-invalid' : ''}`}>
      <label className="field-label" htmlFor={id}>
        {label}
        <span className="field-required">*</span>
      </label>
      <select
        id={id}
        className={`field-input field-select ${value === '' ? 'field-select-empty' : ''}`}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...selectProps}
      >
        <option value="" disabled>
          Не выбрано
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}

export default function CheckoutForm({onSubmit}) {
  const [contact, setContact] = useState(INITIAL_CONTACT);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const {name, type, value, checked} = event.target;

    setContact((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((current) => ({...current, [name]: undefined}));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateContact(contact);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    await onSubmit({
      ...contact,
      phone: contact.phone.trim(),
      email: contact.email.trim(),
      address: contact.delivery === 'delivery' ? contact.address.trim() : '',
    });
    setIsSubmitting(false);
  }

  return (
    <section className="checkout" aria-labelledby="checkout-title">
      <h2 id="checkout-title" className="checkout-title">
        Оформление заказа
      </h2>
      <form
        className="cart-card checkout-form"
        noValidate
        onSubmit={handleSubmit}
      >
        <div className="checkout-row">
          <TextField
            label="Телефон"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+7 900 000-00-00"
            required
            value={contact.phone}
            error={errors.phone}
            onChange={handleChange}
          />
          <TextField
            label="E-mail"
            name="email"
            type="email"
            autoComplete="email"
            value={contact.email}
            error={errors.email}
            onChange={handleChange}
          />
        </div>

        <fieldset className="checkout-delivery">
          <legend className="visually-hidden">Способ получения</legend>
          {DELIVERY_OPTIONS.map((option) => (
            <label key={option.value} className="checkbox">
              <input
                type="radio"
                name="delivery"
                value={option.value}
                checked={contact.delivery === option.value}
                onChange={handleChange}
              />
              {option.label}
            </label>
          ))}
        </fieldset>

        {contact.delivery === 'delivery' && (
          <TextField
            label="Адрес доставки"
            name="address"
            autoComplete="street-address"
            required
            className="checkout-address"
            value={contact.address}
            error={errors.address}
            onChange={handleChange}
          />
        )}

        <div className="checkout-row">
          <SelectField
            label="Способ оплаты"
            name="payment"
            options={PAYMENT_OPTIONS}
            value={contact.payment}
            error={errors.payment}
            onChange={handleChange}
          />
        </div>

        <label className="checkbox">
          <input
            type="checkbox"
            name="needPackaging"
            checked={contact.needPackaging}
            onChange={handleChange}
          />
          Нужна упаковка
        </label>

        <button
          type="submit"
          className="button checkout-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Оформляем…' : 'Оформить заказ'}
        </button>
      </form>
    </section>
  );
}
