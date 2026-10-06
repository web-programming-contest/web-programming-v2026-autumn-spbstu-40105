import { Router } from 'express';
import { readJson, writeJson } from '../utils/storage.js';
import { requireAuth } from '../middleware/requireAuth.js';

export const ordersRouter = Router();

// Обе ручки защищены requireAuth — методичка требует, чтобы каталог и корзина
// (а значит и оформление заказа) были доступны только вошедшему пользователю.
ordersRouter.use(requireAuth);

// GET /orders — заказы, ранее оформленные ЭТИМ пользователем.
// Пользователь один на систему, но фильтр по username всё равно есть —
// так код не придётся переписывать, если пользователей станет больше.
ordersRouter.get('/orders', async (req, res, next) => {
  try {
    const orders = await readJson('orders.json');
    const ownOrders = orders.filter(
      (order) => order.username === req.session.user.username,
    );
    res.json(ownOrders);
  } catch (error) {
    next(error);
  }
});

// POST /orders — создаёт новый заказ из содержимого корзины и данных формы
// оформления, присланных фронтендом.
ordersRouter.post('/orders', async (req, res, next) => {
  try {
    const { items, contact } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: 'Корзина пуста' });
      return;
    }
    if (!contact || !contact.phone) {
      res.status(400).json({ message: 'Не указан номер телефона' });
      return;
    }

    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const orders = await readJson('orders.json');
    const nextId =
      orders.length > 0 ? Math.max(...orders.map((order) => order.id)) + 1 : 1;

    const newOrder = {
      id: nextId,
      username: req.session.user.username,
      createdAt: new Date().toISOString(),
      items,
      itemsCount,
      totalPrice,
      contact,
    };

    orders.push(newOrder);
    await writeJson('orders.json', orders);

    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
});
