import {useId} from 'react';

export const REQUIRED_MESSAGE = 'Заполните обязательное поле';

export default function TextField({
  label,
  error,
  required = false,
  className = '',
  ...inputProps
}) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={`field ${error ? 'field-invalid' : ''} ${className}`}>
      <label className="field-label" htmlFor={id}>
        {label}
        {required && <span className="field-required">*</span>}
      </label>
      <input
        id={id}
        className="field-input"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />
      {error && (
        <p id={errorId} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}
