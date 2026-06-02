# Stage 1: Сборка статических файлов React
FROM node:20-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app

# Копируем манифесты для кэширования слоев зависимостей
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Копируем исходный код и собираем продакшн-бандл (dist)
COPY . .
ENV VITE_API_URL=/api/v1
RUN pnpm build

# Stage 2: Раздача статики через Nginx Alpine
FROM nginx:1.25-alpine
# Копируем кастомный конфиг маршрутизации Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Копируем скомпилированный фронтенд из предыдущего шага
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
