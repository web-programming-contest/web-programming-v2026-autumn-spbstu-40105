import {Router} from 'express';

import {requireAuth} from '../sessions.js';
import {readJson, updateJson} from '../storage.js';
import {normalizeContact, validateOrder} from '../validation.js';

export const ordersRouter = new Router();

ordersRouter.use('/orders', requireAuth);

function toPublicOrder(order) {
  const publicOrder = {...order};
  delete publicOrder.userId;

  return publicOrder;
}

ordersRouter.get('/orders', async (req, res) => {
  const orders = await readJson('orders');
  const userOrders = orders
    .filter((order) => order.userId === req.user.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(toPublicOrder);

  res.json(userOrders);
});

ordersRouter.post('/orders', async (req, res) => {
  const goods = await readJson('goods');
  const errors = validateOrder(req.body, goods);

  if (errors.length > 0) {
    res.status(400).json({error: errors.join('. '), errors});
    return;
  }

  const goodsById = new Map(goods.map((item) => [item.id, item]));
  const items = req.body.items.map(({id, quantity}) => {
    const {name, price} = goodsById.get(id);

    return {id, name, price, quantity};
  });

  const order = await updateJson('orders', (orders) => {
    const lastId = orders.reduce((max, item) => Math.max(max, item.id), 0);
    const created = {
      id: lastId + 1,
      userId: req.user.id,
      createdAt: new Date().toISOString(),
      items,
      totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ),
      contact: normalizeContact(req.body.contact),
    };

    orders.push(created);

    return created;
  });

  res.status(201).json(toPublicOrder(order));
});
