FROM node:20-alpine AS frontend
WORKDIR /build
COPY package.json package-lock.json ./
RUN npm ci
COPY index.html vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json tailwind.config.js postcss.config.js eslint.config.js components.json ./
COPY src ./src
COPY public ./public
RUN npm run build

FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt
COPY backend ./backend
COPY --from=frontend /build/dist ./dist
RUN python backend/manage.py collectstatic --noinput
EXPOSE 3000
CMD ["sh", "-c", "python backend/manage.py migrate --noinput && python backend/manage.py seed_demo && gunicorn config.wsgi:application --chdir backend --bind 0.0.0.0:3000 --workers 2 --timeout 60"]
