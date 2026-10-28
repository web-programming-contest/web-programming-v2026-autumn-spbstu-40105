# Gadget Hub

Полный курсовой проект интернет-магазина гаджетов: React + TypeScript + Vite, Django REST Framework и PostgreSQL. Дизайн, изображения товаров, иконки и шрифт Rubik взяты из исходных материалов задания.

## Реализовано

- Главная страница с закольцованными каруселями хитов и новинок, преимуществами и контактами.
- Вход/выход через Django session authentication, защита каталога и корзины, валидация формы.
- Каталог из 32 товаров: фильтры по цене, типу и цвету, четыре сортировки, пагинация по 9 товаров.
- Подробная карточка товара в доступном модальном окне (закрытие кнопкой, фоном и Esc).
- Корзина в `localStorage` отдельно для пользователя, изменение количества, выбор и удаление товаров с подтверждением.
- Оформление заказа с условным адресом доставки, способом оплаты и упаковкой.
- История заказов и состав каждого заказа из PostgreSQL.
- Адаптивная версия для мобильных устройств, состояния загрузки, ошибок и пустых списков.

## Демо-пользователь

- Логин: `demo`
- Пароль: `gadget2024`

Пользователь и каталог создаются командой `python backend/manage.py seed_demo`.

## Запуск с PostgreSQL через Docker

```bash
docker compose up --build
```

Откройте `http://localhost:3000`. Docker Compose запускает PostgreSQL 16, применяет миграции, заполняет каталог и стартует Django/Gunicorn. Данные PostgreSQL сохраняются в volume `postgres_data`.

## Локальная разработка на двух портах

Требуются Node.js 20+, Python 3.12+ и PostgreSQL.

```bash
# 1. Frontend: terminal 1, port 3000
npm install
npm run dev

# 2. Backend: terminal 2, port 8080
python -m pip install -r backend/requirements.txt
export DATABASE_URL=postgresql://gadget:gadget@localhost:5432/gadget_hub
python backend/manage.py migrate
python backend/manage.py seed_demo
python backend/manage.py runserver 8080
```

Vite проксирует `/api` на порт 8080. Для Windows PowerShell задайте переменную через `$env:DATABASE_URL="postgresql://..."`.

Если `DATABASE_URL` не задан, Django использует `backend/db.sqlite3`. Это упрощает автономный preview и первичную проверку; конфигурация Docker Compose всегда использует PostgreSQL.

## Команды проверки

```bash
npm run check
npm run build
python backend/manage.py check
python backend/manage.py test
```

## REST API

| Метод | Endpoint | Назначение |
|---|---|---|
| GET | `/api/csrf/` | Получить CSRF token |
| POST | `/api/login/` | Войти и создать сессию |
| POST | `/api/logout/` | Завершить сессию |
| GET | `/api/me/` | Текущий пользователь |
| GET | `/api/goods/` | Каталог товаров |
| GET | `/api/orders/` | Заказы текущего пользователя |
| POST | `/api/orders/` | Создать заказ |

Цены и итог заказа рассчитываются повторно на сервере. Эндпоинты заказов требуют авторизации.

## Структура

- `src/` — страницы, компоненты, контексты и REST-клиент React.
- `public/` — исходные изображения, иконки и Rubik.
- `backend/config/` — настройки Django, URLs, WSGI/ASGI.
- `backend/store/` — модели, serializers, API, миграции и seed-команда.
- `Dockerfile`, `docker-compose.yml` — production-сборка и PostgreSQL.
