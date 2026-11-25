import {createServer} from 'node:http';
import {randomUUID} from 'node:crypto';
import {readFile, rename, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

const goods = JSON.parse(
  await readFile(new URL('data/goods.json', import.meta.url), 'utf8'),
);
const products = new Map(goods.map((item) => [item.id, item]));
const ordersFile =
  process.env.GADGET_ORDERS_FILE ??
  fileURLToPath(new URL('data/orders.json', import.meta.url));
const account = {
  username: process.env.GADGET_USER ?? 'demo',
  password: process.env.GADGET_PASSWORD ?? 'gadget123',
};
const sessions = new Map();
const sessionSeconds = 86400;
const origins = new Set(['http://127.0.0.1:3000', 'http://localhost:3000']);
let orders = await loadOrders();
let orderWrites = Promise.resolve();

async function loadOrders() {
  try {
    return JSON.parse(await readFile(ordersFile, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

function json(response, status, data) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
  });
  response.end(JSON.stringify(data));
}

async function body(request) {
  if (!request.headers['content-type']?.startsWith('application/json')) {
    throw Object.assign(new Error('Ожидается JSON'), {status: 415});
  }
  const chunks = [];
  let bytes = 0;
  for await (const chunk of request) {
    bytes += chunk.length;
    if (bytes <= 32768) {
      chunks.push(chunk);
    }
  }
  if (bytes > 32768) {
    throw Object.assign(new Error('Запрос слишком большой'), {status: 413});
  }
  const data = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new SyntaxError();
  }
  return data;
}

function sessionCookie(response, token, age) {
  response.setHeader(
    'Set-Cookie',
    `gadget_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${age}`,
  );
}

function validateOrder(data) {
  const {items, delivery, payment, packaging} = data;
  const phone = typeof data.phone === 'string' ? data.phone.trim() : '';
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  const address = typeof data.address === 'string' ? data.address.trim() : '';
  if (
    !/^[+\d() .-]{7,25}$/.test(phone) ||
    phone.replace(/\D/g, '').length < 7 ||
    (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ||
    !['pickup', 'delivery'].includes(delivery) ||
    (delivery === 'delivery' && !address) ||
    !['card', 'cash'].includes(payment) ||
    typeof packaging !== 'boolean' ||
    !Array.isArray(items) ||
    !items.length ||
    items.length > products.size
  ) {
    return null;
  }

  const seen = new Set();
  const lines = [];
  for (const item of items) {
    const product = products.get(item?.id);
    const quantity = item?.quantity;
    if (
      !product ||
      seen.has(product.id) ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 99
    ) {
      return null;
    }
    seen.add(product.id);
    lines.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
    });
  }
  return {
    phone,
    email,
    delivery,
    address: delivery === 'delivery' ? address : '',
    payment,
    packaging,
    items: lines,
    count: lines.reduce((sum, item) => sum + item.quantity, 0),
    total: lines.reduce((sum, item) => sum + item.quantity * item.price, 0),
  };
}

function saveOrder(user, order) {
  const write = orderWrites.then(async () => {
    const previous = orders.at(-1)?.id ?? 0;
    const saved = {
      ...order,
      id: previous + 1,
      user,
      createdAt: new Date().toISOString(),
    };
    const updated = [...orders, saved];
    const temporaryFile = `${ordersFile}.tmp`;
    await writeFile(
      temporaryFile,
      `${JSON.stringify(updated, null, 2)}\n`,
      'utf8',
    );
    await rename(temporaryFile, ordersFile);
    orders = updated;
    return saved;
  });
  orderWrites = write.catch(() => {});
  return write;
}

function summary({id, createdAt, count, total}) {
  return {id, createdAt, count, total};
}

createServer(async (request, response) => {
  const origin = request.headers.origin;
  response.setHeader('Vary', 'Origin');
  response.setHeader('Cache-Control', 'no-store');
  if (origin && !origins.has(origin)) {
    json(response, 403, {message: 'Недопустимый источник запроса'});
    return;
  }
  if (origin) {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  const method = request.method;
  if (method === 'OPTIONS') {
    response
      .writeHead(204, {
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      })
      .end();
    return;
  }
  const path = new URL(request.url, 'http://localhost').pathname;
  const token = request.headers.cookie?.match(
    /(?:^|;\s*)gadget_session=([^;]+)/,
  )?.[1];
  const now = Date.now();
  for (const [key, session] of sessions) {
    if (session.expires <= now) {
      sessions.delete(key);
    }
  }
  const user = sessions.get(token)?.username;

  try {
    if (path === '/login' && method === 'POST') {
      const {username, password} = await body(request);
      if (username !== account.username || password !== account.password) {
        json(response, 401, {
          message: 'Неправильный логин или пароль. Проверьте данные.',
        });
        return;
      }
      sessions.delete(token);
      const newToken = randomUUID();
      sessions.set(newToken, {
        username,
        expires: now + sessionSeconds * 1000,
      });
      sessionCookie(response, newToken, sessionSeconds);
      json(response, 200, {username});
    } else if (path === '/logout' && method === 'POST') {
      sessions.delete(token);
      sessionCookie(response, '', 0);
      response.writeHead(204).end();
    } else if (path === '/session' && method === 'GET') {
      json(response, 200, {username: user ?? null});
    } else if (path === '/featured' && method === 'GET') {
      json(
        response,
        200,
        goods.filter((item) => item.isNew || item.isHit),
      );
    } else if (path === '/goods' && method === 'GET') {
      json(
        response,
        user ? 200 : 401,
        user ? goods : {message: 'Войдите в аккаунт'},
      );
    } else if (path === '/orders' && ['GET', 'POST'].includes(method)) {
      if (!user) {
        json(response, 401, {message: 'Войдите в аккаунт'});
      } else if (method === 'GET') {
        json(
          response,
          200,
          orders
            .filter((order) => order.user === user)
            .map(summary)
            .reverse(),
        );
      } else {
        const order = validateOrder(await body(request));
        if (!order) {
          json(response, 400, {
            message: 'Проверьте состав заказа и данные формы',
          });
          return;
        }
        json(response, 201, summary(await saveOrder(user, order)));
      }
    } else {
      json(response, 404, {message: 'Маршрут не найден'});
    }
  } catch (error) {
    if (error.status || error instanceof SyntaxError) {
      json(response, error.status ?? 400, {
        message: error.status ? error.message : 'Некорректный JSON',
      });
    } else {
      console.error(error);
      json(response, 500, {message: 'Не удалось выполнить запрос'});
    }
  }
}).listen(8080, '127.0.0.1', () =>
  console.warn('Gadget Hub API — http://127.0.0.1:8080'),
);
