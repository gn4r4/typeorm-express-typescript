# 🚀 Quick Reference - API Routes

## Base URL
```
http://localhost:4000/api/v1
```

## All Available Routes

### ✓ Existing
```
/auth              - Аутентифікація (login, register, change-password)
/users             - Користувачі
/books             - Книги
/authors           - Автори
/categories        - Категорії
/genres            - Жанри
```

### ⭐ NEW
```
/publishers        - Видавництва
/positions         - Посади
/employees         - Працівники
/cabinets          - Шафи/Кабінети
/editions          - Видання
/copybooks         - Екземпляри книг
/shelves           - Полиці
/lendings          - Видачі книг
/orders            - Замовлення
```

## Standard Operations

Для кожного ресурсу доступні операції:

```
GET    /:resource              - Список
GET    /:resource/:id          - По ID
POST   /:resource              - Створити (ADMIN)
PATCH  /:resource/:id          - Редагувати (ADMIN)
DELETE /:resource/:id          - Видалити (ADMIN)
```

## Examples

### Get all publishers
```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:4000/api/v1/publishers
```

### Create employee
```bash
curl -X POST -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "lastname": "Петров",
    "firstname": "Іван",
    "contact": "+380 95 123-45-67",
    "address": "Київ",
    "id_position": 1
  }' \
  http://localhost:4000/api/v1/employees
```

### Update cabinet
```bash
curl -X PATCH -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Кабінет 101",
    "description": "Основна книгозбірня"
  }' \
  http://localhost:4000/api/v1/cabinets/1
```

### Delete order
```bash
curl -X DELETE -H "Authorization: Bearer TOKEN" \
  http://localhost:4000/api/v1/orders/1
```

## Validation

Всі POST/PATCH запити валідуються. При помилці повертається 400:

```json
{
  "status": 400,
  "type": "Validation",
  "message": "Entity validation error",
  "errors": ["Field is required", "Field must be 1-100 characters"]
}
```

## Authentication

1. Отримати токен: `POST /auth/login`
2. Використовувати в заголовку: `Authorization: Bearer <token>`

## Files Structure

```
routes/v1/
├── index.ts              - Main router (contains all routes)
├── auth.ts              - Authentication
├── users.ts
├── book.ts
├── author.ts
├── category.ts
├── genre.ts
├── publisher.ts         ⭐ NEW
├── position.ts          ⭐ NEW
├── employee.ts          ⭐ NEW
├── cabinet.ts           ⭐ NEW
├── edition.ts           ⭐ NEW
├── copybook.ts          ⭐ NEW
├── shelf.ts             ⭐ NEW
├── lending.ts           ⭐ NEW
└── orders.ts            ⭐ NEW
```

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Validation Error |
| 401 | Unauthorized |
| 403 | Forbidden (Not Admin) |
| 404 | Not Found |
| 500 | Server Error |

---

**Всього маршрутів:** 70+ endpoints  
**CRUD операцій на ресурс:** 5 (GET list, GET by id, POST, PATCH, DELETE)  
**Документація:** ✅ Повна
