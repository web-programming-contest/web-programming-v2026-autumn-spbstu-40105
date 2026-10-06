// Вся настраиваемая конфигурация бекенда в одном месте.
// Задание допускает единственного пользователя в системе — задаём его здесь,
// а не в базе данных.

export const PORT = process.env.PORT || 8081;

// Источник, которому разрешено ходить на бекенд с куки (фронтенд на Vite).
export const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

export const SESSION_SECRET = process.env.SESSION_SECRET || 'gadget-hub-dev-secret';

// Единственный пользователь, которого умеет проверять /login.
export const SINGLE_USER = {
  username: 'brevnov',
  password: 'gadgethub2026',
};
