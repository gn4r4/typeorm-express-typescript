# API Endpoints Documentation

## 📌 Базовий URL
```
http://localhost:4000/api/v1
```

## 🔐 Аутентифікація
Всі ендпоїнти (крім `/auth`) вимагають JWT токена в заголовку:
```
Authorization: Bearer <token>
```

## 📚 Доступні ендпоїнти

### 1. Authentication (Аутентифікація)
**Base:** `/auth`

```
POST   /auth/login              - Вхід користувача
POST   /auth/register           - Реєстрація користувача
POST   /auth/change-password    - Зміна пароля (потребує JWT)
```

---

### 2. Users (Користувачі)
**Base:** `/users`

```
GET    /users                   - Список користувачів (ADMINISTRATOR)
GET    /users/:id               - Деталі користувача (ADMINISTRATOR або себе)
PATCH  /users/:id               - Редагування користувача (ADMINISTRATOR або себе)
DELETE /users/:id               - Видалення користувача (ADMINISTRATOR)
```

---

### 3. Books (Книги)
**Base:** `/books`

```
GET    /books                   - Список книг
GET    /books/:id               - Деталі книги
POST   /books                   - Створити книгу (ADMINISTRATOR)
PATCH  /books/:id               - Редагувати книгу (ADMINISTRATOR)
DELETE /books/:id               - Видалити книгу (ADMINISTRATOR)
```

**Request Body (POST/PATCH):**
```json
{
  "title": "string (макс 255)",
  "id_category": "number",
  "id_genre": "number",
  "id_author": "number"
}
```

---

### 4. Authors (Автори)
**Base:** `/authors`

```
GET    /authors                 - Список авторів
GET    /authors/:id             - Деталі автора
POST   /authors                 - Створити автора (ADMINISTRATOR)
PATCH  /authors/:id             - Редагувати автора (ADMINISTRATOR)
DELETE /authors/:id             - Видалити автора (ADMINISTRATOR)
```

**Request Body (POST/PATCH):**
```json
{
  "lastname": "string (1-50)",
  "firstname": "string (1-50)",
  "patronymic": "string (опціонально, 1-50)",
  "dateofbirth": "YYYY-MM-DD (опціонально)"
}
```

---

### 5. Categories (Категорії)
**Base:** `/categories`

```
GET    /categories              - Список категорій
GET    /categories/:id          - Деталі категорії
POST   /categories              - Створити категорію (ADMINISTRATOR)
PATCH  /categories/:id          - Редагувати категорію (ADMINISTRATOR)
DELETE /categories/:id          - Видалити категорію (ADMINISTRATOR)
```

**Request Body (POST/PATCH):**
```json
{
  "name": "string (1-100)"
}
```

---

### 6. Genres (Жанри)
**Base:** `/genres`

```
GET    /genres                  - Список жанрів
GET    /genres/:id              - Деталі жанру
POST   /genres                  - Створити жанр (ADMINISTRATOR)
PATCH  /genres/:id              - Редагувати жанр (ADMINISTRATOR)
DELETE /genres/:id              - Видалити жанр (ADMINISTRATOR)
```

**Request Body (POST/PATCH):**
```json
{
  "name": "string (1-100)"
}
```

---

### 7. Publishers (Видавництва) ⭐ НОВИЙ
**Base:** `/publishers`

```
GET    /publishers              - Список видавництв
GET    /publishers/:id          - Деталі видавництва
POST   /publishers              - Створити видавництво (ADMINISTRATOR)
PATCH  /publishers/:id          - Редагувати видавництво (ADMINISTRATOR)
DELETE /publishers/:id          - Видалити видавництво (ADMINISTRATOR)
```

**Request Body (POST/PATCH):**
```json
{
  "name": "string (1-255, обов'язкова)",
  "address": "string (опціонально, 1-255)",
  "contact": "string (опціонально, 1-50)"
}
```

---

### 8. Positions (Посади) ⭐ НОВИЙ
**Base:** `/positions`

```
GET    /positions               - Список посад
GET    /positions/:id           - Деталі посади
POST   /positions               - Створити посаду (ADMINISTRATOR)
PATCH  /positions/:id           - Редагувати посаду (ADMINISTRATOR)
DELETE /positions/:id           - Видалити посаду (ADMINISTRATOR)
```

**Request Body (POST/PATCH):**
```json
{
  "name": "string (1-100, обов'язкова, унікальна)"
}
```

---

### 9. Employees (Працівники) ⭐ НОВИЙ
**Base:** `/employees`

```
GET    /employees               - Список працівників
GET    /employees/:id           - Деталі працівника
POST   /employees               - Створити працівника (ADMINISTRATOR)
PATCH  /employees/:id           - Редагувати працівника (ADMINISTRATOR)
DELETE /employees/:id           - Видалити працівника (ADMINISTRATOR)
```

**Request Body (POST/PATCH):**
```json
{
  "lastname": "string (1-50, обов'язкова)",
  "firstname": "string (1-50, обов'язкова)",
  "patronymic": "string (опціонально, 1-50)",
  "contact": "string (1-50, обов'язкова)",
  "address": "string (1-255, обов'язкова)",
  "id_position": "number (обов'язкова)"
}
```

---

### 10. Cabinets (Кабінети/Шафи) ⭐ НОВИЙ
**Base:** `/cabinets`

```
GET    /cabinets                - Список кабінетів
GET    /cabinets/:id            - Деталі кабінету
POST   /cabinets                - Створити кабінет (ADMINISTRATOR)
PATCH  /cabinets/:id            - Редагувати кабінет (ADMINISTRATOR)
DELETE /cabinets/:id            - Видалити кабінет (ADMINISTRATOR)
```

**Request Body (POST/PATCH):**
```json
{
  "name": "string (1-100, обов'язкова)",
  "description": "string (опціонально, 1-255)"
}
```

---

### 11. Editions (Видання) ⭐ НОВИЙ
**Base:** `/editions`

```
GET    /editions                - Список видань
GET    /editions/:id            - Деталі видання
POST   /editions                - Створити видання (ADMINISTRATOR)
PATCH  /editions/:id            - Редагувати видання (ADMINISTRATOR)
DELETE /editions/:id            - Видалити видання (ADMINISTRATOR)
```

**Request Body (POST/PATCH):**
```json
{
  "id_book": "number (обов'язкова)",
  "id_publisher": "number (обов'язкова)",
  "yearpublication": "YYYY-MM-DD (обов'язкова)"
}
```

---

### 12. Copybooks (Екземпляри книг) ⭐ НОВИЙ
**Base:** `/copybooks`

```
GET    /copybooks               - Список екземплярів
GET    /copybooks/:id           - Деталі екземпляра
POST   /copybooks               - Створити екземпляр (ADMINISTRATOR)
PATCH  /copybooks/:id           - Редагувати екземпляр (ADMINISTRATOR)
DELETE /copybooks/:id           - Видалити екземпляр (ADMINISTRATOR)
```

**Request Body (POST/PATCH):**
```json
{
  "id_edition": "number (обов'язкова)",
  "status": "string (1-50, обов'язкова, допустимі: 'доступний', 'виданий', 'available', 'issued')"
}
```

---

### 13. Shelves (Полиці) ⭐ НОВИЙ
**Base:** `/shelves`

```
GET    /shelves                 - Список полиць
GET    /shelves/:id             - Деталі полиці
POST   /shelves                 - Створити полицю (ADMINISTRATOR)
PATCH  /shelves/:id             - Редагувати полицю (ADMINISTRATOR)
DELETE /shelves/:id             - Видалити полицю (ADMINISTRATOR)
```

**Request Body (POST/PATCH):**
```json
{
  "id_cabinet": "number (обов'язкова)",
  "shelfcode": "string (1-50, обов'язкова)"
}
```

---

### 14. Lendings (Видачі книг) ⭐ НОВИЙ
**Base:** `/lendings`

```
GET    /lendings                - Список видач
GET    /lendings/:id            - Деталі видачі
POST   /lendings                - Створити видачу (ADMINISTRATOR)
PATCH  /lendings/:id            - Редагувати видачу (ADMINISTRATOR)
DELETE /lendings/:id            - Видалити видачу (ADMINISTRATOR)
```

**Request Body (POST/PATCH):**
```json
{
  "id_reader": "number (обов'язкова)",
  "id_employee": "number (обов'язкова)",
  "datelending": "YYYY-MM-DD (обов'язкова)",
  "datereturn": "YYYY-MM-DD (опціонально, має бути >= datelending)"
}
```

---

### 15. Orders (Замовлення) ⭐ НОВИЙ
**Base:** `/orders`

```
GET    /orders                  - Список замовлень
GET    /orders/:id              - Деталі замовлення
POST   /orders                  - Створити замовлення (ADMINISTRATOR)
PATCH  /orders/:id              - Редагувати замовлення (ADMINISTRATOR)
DELETE /orders/:id              - Видалити замовлення (ADMINISTRATOR)
```

**Request Body (POST/PATCH):**
```json
{
  "dateorder": "YYYY-MM-DD (обов'язкова)",
  "status": "string (1-50, обов'язкова, допустимі: 'pending', 'processing', 'completed', 'cancelled', 'очікується', 'в обробці', 'завершено', 'скасовано')"
}
```

---

## 🔑 Приклади запитів

### Вхід користувача
```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Отримання списку видавництв
```bash
curl -X GET http://localhost:4000/api/v1/publishers \
  -H "Authorization: Bearer <token>"
```

### Створення нового видавництва
```bash
curl -X POST http://localhost:4000/api/v1/publishers \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Мегадім",
    "address": "Київ, вул. Шевченка, 1",
    "contact": "+380 44 123-45-67"
  }'
```

### Редагування працівника
```bash
curl -X PATCH http://localhost:4000/api/v1/employees/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "lastname": "Петров",
    "firstname": "Іван",
    "contact": "+380 95 555-55-55",
    "address": "Київ, просп. Миру, 10",
    "id_position": 1
  }'
```

---

## ✅ Статуси відповідей

| Код | Значення |
|-----|----------|
| 200 | OK - успішно |
| 400 | Bad Request - помилка валідації |
| 401 | Unauthorized - потребує аутентифікації |
| 403 | Forbidden - недостатня роль/права |
| 404 | Not Found - сутність не знайдена |
| 500 | Internal Server Error - помилка сервера |

---

## 📊 Статистика ендпоїнтів

| Категорія | Кількість маршрутів | Статус |
|-----------|-------------------|--------|
| Auth | 3 | ✓ Існуючі |
| Users | 4 | ✓ Існуючі |
| Books | 5 | ✓ Існуючі |
| Authors | 5 | ✓ Існуючі |
| Categories | 5 | ✓ Існуючі |
| Genres | 5 | ✓ Існуючі |
| Publishers | 5 | ⭐ НОВІ |
| Positions | 5 | ⭐ НОВІ |
| Employees | 5 | ⭐ НОВІ |
| Cabinets | 5 | ⭐ НОВІ |
| Editions | 5 | ⭐ НОВІ |
| Copybooks | 5 | ⭐ НОВІ |
| Shelves | 5 | ⭐ НОВІ |
| Lendings | 5 | ⭐ НОВІ |
| Orders | 5 | ⭐ НОВІ |
| **ВСЬОГО** | **70** | **✅** |

---

## 🚀 Тестування з Postman

1. **Імпортуйте** колекцію з `/postman/RESTful_API_Boilerplate.postman_collection.json`
2. **Встановіть** змінні оточення з `/postman/RESTful_API_Boilerplate.postman_environment.json`
3. **Добавте** нові запити для нових ендпоїнтів
4. **Тестуйте** кожен ендпоїнт

---

**Документація оновлена:** 17 грудня 2025 р.
