import { Router } from 'express';
import { readJson } from '../utils/storage.js';

export const goodsRouter = Router();

// GET /goods — отдаёт полный список товаров, зарегистрированных в системе.
// Фильтрацию, сортировку и пагинацию делает фронтенд над этим массивом —
// это первый из двух вариантов, разрешённых методичкой (раздел 4.4).
goodsRouter.get('/goods', async (req, res, next) => {
  try {
    const goods = await readJson('goods.json');
    res.json(goods);
  } catch (error) {
    next(error);
  }
});
