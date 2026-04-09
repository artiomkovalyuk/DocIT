# Серверна архітектура (src/server)

Цей проект використовує структурований підхід до бекенд-логіки на стороні Next.js (API Routes).

## 📂 Структура каталогів

```text
src/server/
├── repositories/   # Рівень доступу до даних (Prisma-запити)
├── services/       # Бізнес-логіка (об'єднує репозиторії та валідацію)
├── models/         # Опис схем даних та типів домену
└── lib/            # Спільні бібліотеки
    ├── env.ts      # Валідація змінних оточення (Zod)
    ├── prisma.ts   # Singleton для Prisma Client
    └── formData.ts # Хелпер для обробки FormData
```

## 🛠 Ключові принципи

### 1. Валідація оточення (Environment Validation)
Всі змінні `process.env` повинні проходити через `src/server/lib/env.ts` з використанням **Zod**. Використовуйте `env.DATABASE_URL` замість прямого доступу.

### 2. Рівнева архітектура (Layered Architecture)
*   **API Routes (`src/pages/api/`)**: Мають бути максимально тонкими. Тільки отримання параметрів, виклик сервісу та повернення відповіді.
*   **Services**: Місце для складної бізнес-логіки. Вони нічого не знають про HTTP-запити (`req`, `res`).
*   **Repositories**: Тільки робота з БД через Prisma. Не містять складної бізнес-логіки.

### 3. Prisma
*   Завжди використовуйте singleton `prisma` з `src/server/lib/prisma.ts`.
*   Логування запитів у режимі розробки включено автоматично.

### 4. FormData
Для обробки запитів `multipart/form-data` використовуйте хелпер `getFormData` з `src/server/lib/formData.ts`.

## 🔄 Потік даних (Data Flow)

1. `pages/api/` (Next.js Request)
2. `src/server/services/` (Business Rules)
3. `src/server/repositories/` (Database Query)
4. `Prisma` -> `Response`
