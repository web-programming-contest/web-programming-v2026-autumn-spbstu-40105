import {Router} from 'express';

import {verifyPassword} from '../passwords.js';
import {
  SESSION_COOKIE,
  createSession,
  destroySession,
  requireAuth,
  toPublicUser,
} from '../sessions.js';
import {readJson} from '../storage.js';

export const authRouter = new Router();

const cookieOptions = {httpOnly: true, sameSite: 'lax', path: '/'};

authRouter.post('/login', async (req, res) => {
  const {login, password} = req.body ?? {};

  if (typeof login !== 'string' || typeof password !== 'string') {
    res.status(400).json({error: 'Укажите логин и пароль'});
    return;
  }

  const users = await readJson('users');
  const user = users.find((item) => item.login === login.trim());
  const isValid =
    user !== undefined &&
    (await verifyPassword(password, user.salt, user.passwordHash));

  if (!isValid) {
    res.status(401).json({
      error:
        'Такого пользователя нет, возможно неправильный логин или пароль - проверьте данные',
    });
    return;
  }

  res.cookie(SESSION_COOKIE, createSession(user.id), cookieOptions);
  res.json(toPublicUser(user));
});

authRouter.post('/logout', (req, res) => {
  destroySession(req.cookies[SESSION_COOKIE]);

  res.clearCookie(SESSION_COOKIE, cookieOptions);
  res.status(204).end();
});

authRouter.get('/me', requireAuth, (req, res) => {
  res.json(req.user);
});
