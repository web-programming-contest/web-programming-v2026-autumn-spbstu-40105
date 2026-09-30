// Единая точка входа для всех запросов к бекенду.
// credentials: 'include' обязателен — без него браузер не будет ни отправлять,
// ни принимать cookie сессии между localhost:3000 и localhost:8080
// (это две разные "origin" с точки зрения браузера).
const API_BASE_URL = 'http://localhost:8080';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  // 204 No Content (например, /logout) — тела ответа нет, парсить нечего.
  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message || `Ошибка запроса: ${response.status}`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  login: (username, password) =>
    request('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  logout: () => request('/logout', { method: 'POST' }),

  me: () => request('/me'),

  getGoods: () => request('/goods'),

  getOrders: () => request('/orders'),

  createOrder: (items, contact) =>
    request('/orders', {
      method: 'POST',
      body: JSON.stringify({ items, contact }),
    }),
};
