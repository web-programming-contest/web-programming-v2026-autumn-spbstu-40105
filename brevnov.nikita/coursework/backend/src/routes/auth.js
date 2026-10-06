import { Router } from 'express';
import { SINGLE_USER } from '../config.js';

export const authRouter = Router();

// POST /login — проверяет логин/пароль против единственного пользователя
// системы и, если всё верно, записывает пользователя в сессию.
authRouter.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'Введите логин и пароль' });
    return;
  }

  const isValidUser =
    username === SINGLE_USER.username && password === SINGLE_USER.password;

  if (!isValidUser) {
    res.status(401).json({
      message:
        'Такого пользователя нет, возможно неправильный логин или пароль - проверьте данные',
    });
    return;
  }

  // Кладём пользователя в сессию — express-session сам подпишет cookie
  // с идентификатором сессии и отправит её в ответе.
  req.session.user = { username };
  res.json({ username });
});

// POST /logout — уничтожает текущую сессию на сервере.
authRouter.post('/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.status(500).json({ message: 'Не удалось выйти из системы' });
      return;
    }
    res.clearCookie('connect.sid');
    res.status(204).end();
  });
});

// GET /me — узнать, залогинен ли текущий браузер, не пытаясь логиниться.
// Пригодится фронтенду при загрузке страницы, чтобы понять,
// показывать «Войти» или «Выйти» в шапке.
authRouter.get('/me', (req, res) => {
  if (!req.session.user) {
    res.status(401).json({ message: 'Не авторизован' });
    return;
  }
  res.json(req.session.user);
});
