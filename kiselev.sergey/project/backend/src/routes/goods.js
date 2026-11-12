import {Router} from 'express';

import {readJson} from '../storage.js';

export const goodsRouter = new Router();

goodsRouter.get('/goods', async (req, res) => {
  const goods = await readJson('goods');

  res.json(goods);
});
