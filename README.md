**Лабораторна-практична робота №4**

**Тема:** Дослідження бойлерплейту бекенд-додатку

**Мета:** Отримати практичні навички розгортання, запуску та перевірки готового контейнеризованого бекенд-проєкту, включаючи роботу з початковими даними та механізмами авторизації

**Хід роботи:**

**1. Запуск проєкту**

Клонуємо репозиторій та, дотримуючись інструкцій з `README.md`, запускаємо проєкт однією з командою через `Docker Compose`.

```bash
npm run docker:dev
```

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/1.png?raw=true>)

Обидва контейнери (додаток та база даних) успішно запустились і працюють без помилок. Відвідуємо `localhost:4000`

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/2.png?raw=true>)

**2. Перевірка бази даних**

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

**3. Тестування API**

Використовуєчи надану в репозиторії `Postman-колекцію`, тестуємо ендпоінти додатку.

Виконуємо запити для реєстрації та/або входу, щоб отримати токен авторизації

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/7.png?raw=true>)

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/8.png?raw=true>)

Використовуємо отриманий токен для надсилання запитів до захищених ендпонітів, щоб перевірити їхню працездатність

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/9.png?raw=true>)

>![placeholder](<https://github.com/gn4r4/typeorm-express-typescript/blob/main/images/10.png?raw=true>)
