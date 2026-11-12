import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import {FRONTEND_ORIGIN} from './config.js';
import {authRouter} from './routes/auth.js';
import {goodsRouter} from './routes/goods.js';
import {ordersRouter} from './routes/orders.js';

export function createApp() {
  const app = express();

  app.use(cors({origin: FRONTEND_ORIGIN, credentials: true}));
  app.use(express.json());
  app.use(cookieParser());

  app.use(authRouter);
  app.use(goodsRouter);
  app.use(ordersRouter);

  app.use((req, res) => {
    res.status(404).json({error: 'Not found'});
  });

  app.use((error, req, res, next) => {
    console.error(error);

    if (res.headersSent) {
      next(error);
      return;
    }

    res.status(500).json({error: 'Internal server error'});
  });

  return app;
}
