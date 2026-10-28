import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {login} from '../api';
import {useStore} from '../store';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{username?: string; password?: string}>(
    {},
  );
  const {login: storeLogin} = useStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: {username?: string; password?: string} = {};

    if (!username) {
      newErrors.username = 'Заполните обязательное поле';
    }
    if (!password) {
      newErrors.password = 'Заполните обязательное поле';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await login(username, password);
      storeLogin(res.data.username, res.data.token);
      navigate('/');
    } catch {
      alert(
        'такого пользователя нет, возможно неправильный логин или пароль - проверьте данные',
      );
    }
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '40px auto',
        background: 'white',
        padding: '32px',
        borderRadius: '12px',
      }}
    >
      <h2 style={{marginBottom: '24px', textAlign: 'center'}}>
        Вход в систему
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom: '16px'}}>
          <label style={{display: 'block', marginBottom: '4px'}}>
            Имя пользователя
          </label>
          <input
            className={errors.username ? 'input-error' : ''}
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setErrors({...errors, username: undefined});
            }}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #ccc',
            }}
          />
          {errors.username && (
            <div className="error-text">{errors.username}</div>
          )}
        </div>
        <div style={{marginBottom: '24px'}}>
          <label style={{display: 'block', marginBottom: '4px'}}>Пароль</label>
          <input
            type="password"
            className={errors.password ? 'input-error' : ''}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors({...errors, password: undefined});
            }}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #ccc',
            }}
          />
          {errors.password && (
            <div className="error-text">{errors.password}</div>
          )}
        </div>
        <button type="submit" className="btn btn-blue" style={{width: '100%'}}>
          Войти
        </button>
      </form>
    </div>
  );
}
