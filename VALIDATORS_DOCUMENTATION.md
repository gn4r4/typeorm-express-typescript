# Валідатори для проєкту TypeORM Express TypeScript

## Огляд проєкту

Проєкт є RESTful API бойлерплейтом, розробленим на TypeScript з використанням:
- **Express.js** - веб-фреймворк
- **TypeORM** - ORM для роботи з PostgreSQL
- **Passport/JWT** - аутентифікація та авторизація
- **Validator.js** - бібліотека для валідації даних

## Структура архітектури

### Основні папки:
```
src/
├── controllers/        # Контролери (обробка запитів)
├── services/          # Бізнес-логіка
├── middleware/        # Middleware функції
│   └── validation/    # Валідатори
├── orm/
│   └── entities/      # Сутності (моделі БД)
├── routes/            # Маршрути
└── utils/             # Утиліти
```

## Створені валідатори

### 1. **Publisher (Видавництво)**
📁 `src/middleware/validation/publisher/`
- Валідація: name (обов'язкова, 1-255 символів), address (опц., 1-255 символів), contact (опц., 1-50 символів)

### 2. **Position (Посада)**
📁 `src/middleware/validation/position/`
- Валідація: name (обов'язкова, 1-100 символів)

### 3. **Employee (Працівник)**
📁 `src/middleware/validation/employee/`
- Валідація: 
  - lastname (обов'язкова, 1-50 символів)
  - firstname (обов'язкова, 1-50 символів)
  - patronymic (опц., 1-50 символів)
  - contact (обов'язкова, 1-50 символів)
  - address (обов'язкова, 1-255 символів)
  - id_position (обов'язкова, integer)

### 4. **Reader (Читач)**
📁 `src/middleware/validation/reader/`
- Валідація:
  - lastname (обов'язкова, 1-50 символів)
  - firstname (обов'язкова, 1-50 символів)
  - patronymic (опц., 1-50 символів)
  - contact (обов'язкова, 1-50 символів)
  - address (обов'язкова, 1-255 символів)

### 5. **Cabinet (Кабінет)**
📁 `src/middleware/validation/cabinet/`
- Валідація: name (обов'язкова, 1-100 символів), description (опц., 1-255 символів)

### 6. **Edition (Видання)**
📁 `src/middleware/validation/edition/`
- Валідація:
  - id_book (обов'язкова, integer)
  - id_publisher (обов'язкова, integer)
  - yearpublication (обов'язкова, valid ISO 8601 date)

### 7. **Copybook (Екземпляр книги)**
📁 `src/middleware/validation/copybook/`
- Валідація:
  - id_edition (обов'язкова, integer)
  - status (обов'язкова, 1-50 символів, допустимі: 'доступний', 'виданий', 'available', 'issued')

### 8. **Shelf (Полиця)**
📁 `src/middleware/validation/shelf/`
- Валідація:
  - id_cabinet (обов'язкова, integer)
  - shelfcode (обов'язкова, 1-50 символів)

### 9. **Lending (Видача книг)**
📁 `src/middleware/validation/lending/`
- Валідація:
  - id_reader (обов'язкова, integer)
  - id_employee (обов'язкова, integer)
  - datelending (обов'язкова, valid ISO 8601 date)
  - datereturn (опц., valid ISO 8601 date, має бути >= datelending)

### 10. **Orders (Замовлення)**
📁 `src/middleware/validation/orders/`
- Валідація:
  - dateorder (обов'язкова, valid ISO 8601 date)
  - status (обов'язкова, 1-50 символів, допустимі: 'pending', 'processing', 'completed', 'cancelled', 'очікується', 'в обробці', 'завершено', 'скасовано')

### 11. **CopybookLocation (Розташування екземпляра)**
📁 `src/middleware/validation/copybook_location/`
- Валідація:
  - id_shelf (обов'язкова, integer)
  - id_copybook (обов'язкова, integer)

### 12. **LendingCopybook (Видані екземпляри)**
📁 `src/middleware/validation/lending_copybook/`
- Валідація:
  - id_lending (обов'язкова, integer)
  - id_copybook (обов'язкова, integer)

### 13. **OrderEdition (Замовлені видання)**
📁 `src/middleware/validation/order_edition/`
- Валідація:
  - id_order (обов'язкова, integer)
  - id_edition (обов'язкова, integer)
  - quantity (обов'язкова, positive integer)

### 14. **BookAuthor (Автор книги)**
📁 `src/middleware/validation/book_author/`
- Валідація:
  - id_book (обов'язкова, integer)
  - id_author (обов'язкова, integer)

### 15. **Author (Авторство)**
📁 `src/middleware/validation/author/` *(оновлено)*
- Валідація:
  - lastname (обов'язкова, 1-50 символів)
  - firstname (обов'язкова, 1-50 символів)
  - patronymic (опц., 1-50 символів)
  - dateofbirth (опц., valid ISO 8601 date)

## Як використовувати валідатори

### Приклад інтеграції в маршрути:

```typescript
import { Router } from 'express';
import { validatorCreatePublisher } from '../../middleware/validation/publisher';
import { checkJwt } from '../../middleware/checkJwt';
import { checkRole } from '../../middleware/checkRole';

const router = Router();

router.post(
  '/',
  [checkJwt, checkRole(['ADMINISTRATOR']), validatorCreatePublisher],
  create
);
```

## Стандартна структура валідатора

Кожен валідатор:
1. Імпортує необхідні залежності (Express типи, validator, CustomError)
2. Экстрагує дані з `req.body`
3. Перевіряє кожне поле з використанням `validator.js` функцій
4. Накопичує помилки в масив
5. Якщо помилки є, повертає `CustomError` з кодом 400
6. Якщо помилок немає, викликає `next()` для продовження обробки

## Обробка помилок

Усі валідатори повертають помилки в наступному форматі:
```json
{
  "code": 400,
  "type": "Validation",
  "message": "Entity validation error",
  "errors": ["Error message 1", "Error message 2"]
}
```

## Перелік всіх файлів валідаторів

```
src/middleware/validation/
├── author/
│   ├── index.ts (оновлено)
│   └── validatorCreateAuthor.ts (оновлено)
├── book/
│   ├── index.ts (існуючий)
│   └── validatorCreateBook.ts (існуючий)
├── book_author/
│   ├── index.ts (новий)
│   └── validatorCreateBookAuthor.ts (новий)
├── cabinet/
│   ├── index.ts (новий)
│   └── validatorCreateCabinet.ts (новий)
├── category/
│   ├── index.ts (існуючий)
│   └── validatorCreateCategory.ts (існуючий)
├── copybook/
│   ├── index.ts (новий)
│   └── validatorCreateCopybook.ts (новий)
├── copybook_location/
│   ├── index.ts (новий)
│   └── validatorCreateCopybookLocation.ts (новий)
├── edition/
│   ├── index.ts (новий)
│   └── validatorCreateEdition.ts (новий)
├── employee/
│   ├── index.ts (новий)
│   └── validatorCreateEmployee.ts (новий)
├── genre/
│   ├── index.ts (існуючий)
│   └── validatorCreateGenre.ts (існуючий)
├── lending/
│   ├── index.ts (новий)
│   └── validatorCreateLending.ts (новий)
├── lending_copybook/
│   ├── index.ts (новий)
│   └── validatorCreateLendingCopybook.ts (новий)
├── order_edition/
│   ├── index.ts (новий)
│   └── validatorCreateOrderEdition.ts (новий)
├── orders/
│   ├── index.ts (новий)
│   └── validatorCreateOrders.ts (новий)
├── position/
│   ├── index.ts (новий)
│   └── validatorCreatePosition.ts (новий)
├── publisher/
│   ├── index.ts (новий)
│   └── validatorCreatePublisher.ts (новий)
├── reader/
│   ├── index.ts (новий)
│   └── validatorCreateReader.ts (новий)
├── users/
│   ├── index.ts (існуючий)
│   └── validatorEdit.ts (існуючий)
└── auth/
    ├── index.ts (існуючий)
    ├── validatorLogin.ts (існуючий)
    ├── validatorRegister.ts (існуючий)
    └── validatorChangePassword.ts (існуючий)
```

## Кількість створених файлів

- **Нових валідаторів**: 14 сутностей
- **Нових папок**: 14
- **Нових файлів**: 28 (14 валідаторів + 14 index.ts)
- **Оновлених файлів**: 1 (Author validator)

## Наступні кроки

1. Інтегрувати валідатори в маршрути (routes)
2. Тестувати валідацію з Postman колекцією
3. При необхідності додати більше правил валідації
4. Налаштувати помилки під вимоги проєкту
