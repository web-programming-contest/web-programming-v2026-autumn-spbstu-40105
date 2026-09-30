import express from 'express';
import cors from 'cors';
import session from 'express-session';
import { FRONTEND_ORIGIN, SESSION_SECRET } from './config.js';
import { authRouter } from './routes/auth.js';
import { goodsRouter } from './routes/goods.js';
import { ordersRouter } from './routes/orders.js';

export const app = express();

// Фронтенд и бекенд живут на разных портах (3000 и 8080) — с точки зрения
// браузера это разные источники (origin), поэтому по умолчанию fetch с
// credentials (куки сессии) между ними запрещён. cors() с явным origin и
// credentials: true снимает это ограничение именно для нашего фронтенда.
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24, // сутки
    },
  }),
);

app.use(authRouter);
app.use(goodsRouter);
app.use(ordersRouter);

// Единая обработка ошибок: любой next(error) из роутов попадает сюда,
// вместо того чтобы уронить процесс или зависнуть без ответа клиенту.
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: 'Внутренняя ошибка сервера' });
});
