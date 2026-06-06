# Too-Link Billing — Frontend

Панель управления биллинговой системы Starlink + IPTV.

## Стек

| Инструмент | Версия | Назначение |
|---|---|---|
| React | 19.x | UI-фреймворк |
| Vite | 8.x | Сборщик |
| TypeScript | 6.x | Типизация (strict mode) |
| TailwindCSS | 4.x | Стилизация (utility-first) |
| shadcn/ui | 4.x | UI-компоненты (Radix UI + TailwindCSS) |
| TanStack Query | 5.x | Серверное состояние и кэш |
| React Router | 7.x | Клиентский роутинг |
| React Hook Form | 7.x | Формы |
| Zod | 4.x | Валидация схем |
| Recharts | 3.x | Графики |
| Lucide React | latest | Иконки |
| React Compiler | 1.x | Автоматическая мемоизация |

## Архитектура

Проект строго следует **Feature-Sliced Design (FSD)**:

```
src/
├── app/           # Инициализация приложения (провайдеры, роутер, layout)
│   ├── providers/ # QueryProvider, ThemeProvider, AuthGuard
│   └── layouts/   # ProtectedLayout (сайдбар + мобильный бар)
│
├── pages/         # Страничные компоненты-composition root
│   ├── dashboard/
│   ├── login/
│   ├── subscribers/
│   └── create-subscriber/
│
├── widgets/       # Самодостаточные UI-блоки (Header, Sidebar, MetricsGrid...)
│   ├── header/
│   ├── sidebar/
│   ├── metrics-grid/
│   ├── metrics-distribution/
│   ├── system-status/
│   └── subscriber-detail-panel/
│
├── features/      # Пользовательские действия (auth, logout, создание абонента...)
│   ├── auth-by-username/
│   ├── logout/
│   ├── create-subscriber/
│   └── subscriber-filters/
│
├── entities/      # Бизнес-сущности (admin, subscriber, tariff, billing-metrics)
│   ├── admin/     # useAdmin hook, Admin type
│   ├── subscriber/# Subscriber type, queries, mutations, SubscriberStatusBadge
│   ├── tariff/
│   └── billing-metrics/
│
└── shared/        # Переиспользуемый код без бизнес-логики
    ├── api/       # Axios-инстанс с перехватчиком 401
    ├── config/    # Константы роутов (ROUTES)
    ├── lib/       # cn(), formatDate(), useCopyToClipboard()
    └── ui/        # Базовые UI-примитивы (Button, Card, Input, Table...)
```

**Правила FSD:**
- Импорты — только сверху вниз по слоям (`pages` → `widgets` → `features` → `entities` → `shared`)
- Кросс-импорты между слайсами одного уровня **запрещены**
- Каждый слайс экспортирует только через публичный API (`index.ts`)

## Стилизация

Используется **TailwindCSS v4** с плагином `@tailwindcss/vite`.

Дизайн-токены определены в `src/app/styles/index.css` через CSS-переменные:

```css
:root {
  --background: #ffffff;
  --foreground: #09090b;
  --primary: #0284c7;
  /* ... */
}

.dark {
  --background: #09090b;
  --primary: #38bdf8;
  /* ... */
}
```

Темная/светлая тема управляется через `ThemeProvider` (`app/providers/ThemeProvider.tsx`).

## Локальный запуск

```bash
pnpm install
pnpm dev
```

## Сборка

```bash
pnpm build
```

TypeScript-проверка выполняется автоматически (`tsc -b`) перед Vite-сборкой.

## Переменные окружения

| Переменная | Описание |
|---|---|
| `VITE_API_URL` | Базовый URL backend API (в dev используется Vite proxy) |

## Git-workflow

- Защищённые ветки: `main`, `master`, `develop`, `staging` — прямые коммиты **запрещены**
- Формат веток: `feat/TOO-0000`, `fix/TOO-0000`, `refactor/TOO-0000`
- Формат коммитов: `feat(TOO-4203): client dashboard`
- Перед коммитом: `pnpm build` (0 ошибок обязательно)
