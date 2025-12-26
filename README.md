# Лабораторна-практична робота №4

## Тема:

Дослідження бойлерплейту бекенд-додатку 

## Мета: 

Отримати практичні навички розгортання, запуску та перевірки готового контейнеризованого бекенд-проєкту, включаючи роботу з початковими даними та механізмами авторизації

### Хід роботи:

#### 1. Запуск проєкту

Клонуємо репозиторій та, дотримуючись інструкцій з `README.md`, запускаємо проєкт однією з командою через `Docker Compose`.

```bash
npm run docker:dev
```

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/1.png?raw=true>)

Обидва контейнери (додаток та база даних) успішно запустились і працюють без помилок. Відвідуємо `localhost:4000`

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/2.png?raw=true>)

#### 2. Перевірка бази даних

Підключаємось до бази даних, що працює в контейнері (параметри підключення дивимось у конфігураційних файлах проєкту `.env`).

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/3.png?raw=true>)

Створюємо міграції та сід, за допомогою команд:

```bash
docker exec -it be_boilerplate sh -c "npm run migration:run"
```

```bash
docker exec -it be_boilerplate sh -c "npm run seed:run"
```

Переконуємось, що проєкт успішно створив таблиці та наповнив їх початковими даними (сідами)

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/4.png?raw=true>)

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/5.png?raw=true>)

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/6.png?raw=true>)

#### 3. Тестування API

Використовуєчи надану в репозиторії `Postman-колекцію`, тестуємо ендпоінти додатку.

Виконуємо запити для реєстрації та/або входу, щоб отримати токен авторизації

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/7.png?raw=true>)

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/8.png?raw=true>)

Використовуємо отриманий токен для надсилання запитів до захищених ендпонітів, щоб перевірити їхню працездатність

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/9.png?raw=true>)

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/10.png?raw=true>)

# Лабораторна-практична робота №5

## Тема: 

Розширення бекенд-додатку власними сутностями та реалізація REST API

## Мета: 

Розвинути навички проектування та реалізації серверної логіки, інтегрувавши проєкт бази даних з курсової роботи у повноцінний бекенд-додаток. Навчитись створювати пов'язані сутності за допомогою TypeORM, керувати структурою БД через міграції та будувати REST API для роботи з реляційними даними.

## Завдання: 

Базуючись на boilerplate-проєкті, який ви розгорнули на попередньому занятті, вам необхідно розширити його функціонал, ви маєте реалізувати сутності з вашої курсової роботи з проектування баз даних.

## Основні вимоги:

- Реалізувати мінімум дві пов'язані сутності (краще - усі ключові сутності з вашого проекту).
- Результат роботи оформити у вигляді нового власного GitHub-репозиторію.

### Хід роботи:

#### 1. Створення сутностей та зв'язків

У нашому проєкті створюємо класи-сутності (`entities`):

- `Author`
- `Book`
- `Book_Author`
- `Category`
- `Genre`

Описуємо усі необхідні поля, вказавши типи даних та обмеження. Визначаємо між сутностями реляційні зв'язки

`Author.ts`:

```bash
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BookAuthor } from '../book_author/BookAuthor';

@Entity('author') // Назва таблиці в БД
export class Author {
@PrimaryGeneratedColumn({ name: 'id_author' })
id_author: number;

@Column({ length: 50 })
lastname: string;

@Column({ length: 50 })
firstname: string;

@Column({ length: 50, nullable: true })
patronymic: string;

@Column({ type: 'date', nullable: true })
dateofbirth: Date;

// Зв'язок з проміжною таблицею BookAuthor
@OneToMany(() => BookAuthor, (bookAuthor) => bookAuthor.author)
bookAuthors: BookAuthor[];
}
```

`Category.ts`:

```bash
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { Book } from '../book/Book';

@Entity('category')
export class Category {
@PrimaryGeneratedColumn({ name: 'id_category' })
id_category: number;

@Column({ length: 100 })
name: string;

// Одна категорія може мати багато книг
@OneToMany(() => Book, (book) => book.category)
books: Book[];
}
```

`Genre.ts`:

```bash
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Book } from '../book/Book';

@Entity('genre')
export class Genre {
@PrimaryGeneratedColumn({ name: 'id_genre' })
id_genre: number;

@Column({ length: 100 })
name: string;

// Один жанр може мати багато книг
@OneToMany(() => Book, (book) => book.genre)
books: Book[];
}
```

`Book.ts`:

```bash
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Category } from '../category/Category';
import { Genre } from '../genre/Genre';
import { BookAuthor } from '../book_author/BookAuthor';

@Entity('book')
export class Book {
@PrimaryGeneratedColumn({ name: 'id_book' })
id_book: number;

@Column({ length: 255 })
title: string;

// Зовнішній ключ на категорію
@Column()
id_category: number;

@ManyToOne(() => Category, (category) => category.books)
@JoinColumn({ name: 'id_category' }) // Вказуємо, що колонка в БД називається id_category
category: Category;

// Зовнішній ключ на жанр
@Column()
id_genre: number;

@ManyToOne(() => Genre, (genre) => genre.books)
@JoinColumn({ name: 'id_genre' })
genre: Genre;

// Зв'язок з авторами через проміжну таблицю
@OneToMany(() => BookAuthor, (bookAuthor) => bookAuthor.book)
bookAuthors: BookAuthor[];
}
```

`BookAuthor.ts`:


```bash
import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Book } from '../book/Book';
import { Author } from '../author/Author';

@Entity('book_author')
export class BookAuthor {
@PrimaryColumn()
id_book: number;

@PrimaryColumn()
id_author: number;

@ManyToOne(() => Book, (book) => book.bookAuthors)
@JoinColumn({ name: 'id_book' })
book: Book;

@ManyToOne(() => Author, (author) => author.bookAuthors)
@JoinColumn({ name: 'id_author' })
author: Author;
}
```

#### 2. Генерація та застосування міграцій

Генеруємо нові міграції для створених сутностей

```bash
npm run migration:generate Entities
```

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/workshop5/3.png?raw=true>)

Запускаємо міграції, щоб оновити структуру нашої бази даних:

```bash
npm run migration:run
```

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/workshop5/4.png?raw=true>)

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/workshop5/5.png?raw=true>)

#### 3. Реалізація REST API

Створюємо контролер для сутності `Book`. Створюємо нову папку book в `src/controllers`

Кожну окрему функцію виносимо в окремий файл:

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/workshop5/6.png?raw=true>)

Створюємо ендпоінти для `book`, а саме файл `book.ts` в `src/routes/v1`

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/workshop5/7.png?raw=true>)

Повторюємо для інших сутностей

Додані контролери:

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/workshop5/8.png?raw=true>)

Додані ендпоїнти

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/workshop5/9.png?raw=true>)

Підключення ендпоїнтів:

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/workshop5/10.png?raw=true>)

#### 4. Тестування API

Доповнюємо нашу колекцію в `Postman` новими запитами

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/workshop5/11.png?raw=true>)

Отримуємо список книг

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/workshop5/12.png?raw=true>)

Отримуємо список авторів

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/workshop5/13.png?raw=true>)

Додаємо запити для всіх створених CRUD-ендпоінтів.

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/workshop5/14.png?raw=true>)

# Лабораторна-практична робота №6

## Тема:

Впровадження сервісного шару, валідації та DTO

## Мета:

Навчитись проектувати та реалізовувати правильну архітектуру бекенд-додатку за принципом розділення відповідальності (Separation of Concerns). Практично реалізувати сервісний шар, впровадити механізм валідації через middleware та навчитись формувати контрольовані відповіді API за допомогою DTO.

## Завдання:

Провести комплексний рефакторинг, виправити недоліки та привести архітектуру проєкту у відповідність до сучасних практик:
- **Порушення принципу єдиної відповідальності:** Контролер виконує занадто багато завдань - обробляє HTTP-запити, містить бізнес-логіку та працює з базою даних.
- **Незахищеність:** Ваші ендпоінти не перевіряють дані, що надходять від клієнта.
- **Неконтрольованість відповіді:** API повертає повну структуру entity з бази даних, розкриваючи внутрішні поля.

### Хід роботи:

#### 1. Створення та впровадження сервісного шару

Створіть папку `services` у корені `src`. Для кожної сутності створюємо єдиний сервіс-клас. Реалізуємо всю логіку взаємодії для кожного сервісу

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/workshop6/1.png?raw=true>)

Переносимо логіку з `контролера`. Вирізаємо всю логіку взаємодії з репозиторієм (`AppDataSource.getRepository(...)`) з `функцій-контролерів` і переносимо її у відповідні методи новоствореного сервіс-класу.

#### 2. Створення `Middleware-функції` для валідації

Додаємо перевірку вхідних даних, створюючи асинхронні `middleware-функції`.

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/workshop6/2.png?raw=true>)

Створюємо та реалізовуємо `функцію-валідато`р. Експортуємо з нього `async` функцію, що перевіряє `req.body` за допомогою функції з бібліотеки `validator`. У разі помилки функція має викидати new `AppError(…)`.

Підключаємо `middleware` до `роутів`. У файлах лоутингу імпортуємо наші `функції-валідтори` і вставляємо її в ланцюжок обробки запиту перед викликом `функції-контролера`.

#### 3. Формування DTO у контролері

Робимо відповіді нашого `API` контрольованими та безпечними.

Створюємо клас `DTO`. Створюємо файл, що описує публічну структуру відповіді. Його конструктор має приймати об'єкт `entity`.

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/workshop6/3.png?raw=true>)

Використовуємо `DTO` у контролері. У `функціях-контролера`, після отримання `entity` від `сервісу`, створюємо екзепляр нашого `ResponseDTO` і поверніть саме його у відповіді клієнту

# Лабораторна-практична робота №8-9

## Тема: 

Full-stack інтеграція: розробка UI на базі професійного бойлерплейту

## Мета:

Пройти повний, реалістичний цикл розробки: від проєктування інтерфейсу до його інтеграції з REST API, використовуючи професійний набір інструментів. Навчитись керувати серверним станом за допомогою **TanStack Query**, будувати надійні форми з **React Hook Form** та **Zod**, та організовувати навігацію за допомогою **TanStack Router**.

## Завдання:
Створити повноцінний, сучасний та надійний клієнтський додаток на базі бойлерплейту **vite-react-boilerplate**. Не просто змусити UI працювати, а зробити це, використовуючи надані інструменти за їхнім прямим призначенням.

### Хід роботи:

#### 1. Налаштування проєкту та API-клієнта

##### Налаштовуємо змінні оточення:

У корені фронтенд-проєкту створюємо файл `.env `за зразком `.env.example`. Додаємо до нього адресу нашого `API`:

```bash
VITE_API_BASE_URL=<http://localhost:4000/v1>
```

Для базового завдання отримуємо токен доступу через `Postman` та додаємо його у файл: `VITE_API_AUTH_TOKEN="your.jwt.token.here"`.

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/workshop8/1.png?raw=true>)

##### Налаштовуємо `Axios`:

Встановлюємо `Axios`:

```bash
pnpm install axios
```

Створюємо файл для налаштування (`src/lib/axios.ts`). Налаштовуємо інстанс `Axios` з `baseURL` та інтерцептором для обробки помилок.

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/workshop8/2.png?raw=true>)

#### 2. Організація роботи з `API` за допомогою `TanStack Query`

Замість `useState + useEffect` для роботи з даними з сервера ми будемо використовувати `TanStack Query`.

Створюємо хуки для запитів. Для кожної сутності створіть окремий файл з хуками, які інкапсулюють логіку запитів.

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/workshop8/3.png?raw=true>)

#### 3. Налаштування маршрутизації за допомогою `TanStack Router`

Визначаємо маршрути для сторінок нашого додатку. Оскільки бойлерплейт використовує файлову систему для маршрутизації, нам потрібно буде лише додати свої файли роутів у відповідну структуру src/routes

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/workshop8/4.png?raw=true>)

#### 4. Реалізація `UI` для `CRUD-операцій`

Створюємо сторінки, використовуючи заздалегіть підготовлені хуки та інструменти. Для кожної сутності у відповідну структуру `src/features/entity/pages` створюємо три сторінки: `EntityListPage.tsx`; `CreateEntityPage.tsx`; `EditEntityPage.tsx`.

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/workshop8/5.png?raw=true>)

#### 5. Реалізація `UI` для логіну

Створюємо файл `src/store/authStore.ts`. Ми використаємо `middleware persist`, щоб токен зберігався в `localStorage` і не зникав після оновлення сторінки.

Оновлюємо `Axios` (динамічний токен). `Axios` має брати токен не з `.env`, а зі сховища `Zustand`

Створюємо сторінку логіну (`/login`) з формою на базі `React Hook Form`. У відповідну директорію (`src/features/auth/`) створюємо `API` (`api.ts`) та мутацію `useLogin` для надсилання запиту на `/auth/login`. Створюємо файл типів (`types.ts`)

Створюємо сторінку логіну (`pages/LoginPage.tsx`). Додаємо маршрут (`src/routes/login.tsx`).
