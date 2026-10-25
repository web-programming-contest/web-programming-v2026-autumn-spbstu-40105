import {randomUUID} from 'node:crypto';

import {readJson} from './storage.js';

export const SESSION_COOKIE = 'sid';

const sessions = new Map();

export function createSession(userId) {
  const sessionId = randomUUID();
  sessions.set(sessionId, userId);

  return sessionId;
}

export function destroySession(sessionId) {
  sessions.delete(sessionId);
}

export function toPublicUser(user) {
  return {id: user.id, login: user.login, name: user.name};
}

export async function requireAuth(req, res, next) {
  const userId = sessions.get(req.cookies[SESSION_COOKIE]);
  const users = userId === undefined ? [] : await readJson('users');
  const user = users.find((item) => item.id === userId);

  if (!user) {
    res.status(401).json({error: 'Требуется авторизация'});
    return;
  }

  req.user = toPublicUser(user);
  next();
}
