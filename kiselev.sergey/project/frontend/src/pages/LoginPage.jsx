import {useState} from 'react';
import {Navigate, useNavigate} from 'react-router-dom';

import Modal from '../components/Modal.jsx';
import TextField, {REQUIRED_MESSAGE} from '../components/TextField.jsx';
import {useAuth} from '../context/AuthContext.jsx';

const INITIAL_VALUES = {login: '', password: ''};

function validate(values) {
  const errors = {};

  if (values.login.trim() === '') {
    errors.login = REQUIRED_MESSAGE;
  }

  if (values.password === '') {
    errors.password = REQUIRED_MESSAGE;
  }

  return errors;
}

export default function LoginPage() {
  const {user, login} = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user && !isSubmitting) {
    return <Navigate to="/" replace />;
  }

  function handleChange(event) {
    const {name, value} = event.target;

    setValues((current) => ({...current, [name]: value}));
    setErrors((current) => ({...current, [name]: undefined}));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login({login: values.login.trim(), password: values.password});
      navigate('/');
    } catch (error) {
      setServerError(error.message);
      setIsSubmitting(false);
    }
  }

  return (
    <section className="login">
      <div className="login-decor" aria-hidden="true">
        <img
          className="login-decor-left"
          src="/images/login/decor-left.png"
          alt=""
          width="755"
          height="940"
        />
        <img
          className="login-decor-right"
          src="/images/login/decor-right.png"
          alt=""
          width="715"
          height="940"
        />
      </div>
      <div className="login-content">
        <h1 className="login-title">Добро пожаловать!</h1>
        <form className="login-form" noValidate onSubmit={handleSubmit}>
          <TextField
            label="Логин"
            name="login"
            autoComplete="username"
            required
            value={values.login}
            error={errors.login}
            onChange={handleChange}
          />
          <TextField
            label="Пароль"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={values.password}
            error={errors.password}
            onChange={handleChange}
          />
          <button type="submit" className="button" disabled={isSubmitting}>
            Войти
          </button>
        </form>
      </div>
      <Modal
        isOpen={serverError !== null}
        label="Ошибка входа"
        className="modal-small"
        onClose={() => setServerError(null)}
      >
        <h2 className="modal-title">Не удалось войти</h2>
        <p className="modal-text">{serverError}</p>
        <button
          type="button"
          className="button"
          onClick={() => setServerError(null)}
        >
          Понятно
        </button>
      </Modal>
    </section>
  );
}
