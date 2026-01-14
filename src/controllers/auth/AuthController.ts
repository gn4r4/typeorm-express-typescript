import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../services/UserService';
import { ReaderService } from '../../services/ReaderService'; // Переконайтесь, що імпорт коректний
import { CustomError } from '../../utils/response/custom-error/CustomError';
import { createJwtToken } from '../../utils/createJwtToken';
import { UserResponseDTO } from '../../dto/UserResponseDTO';
import { Role } from '../../orm/entities/users/types';

export class AuthController {
  private userService = new UserService();
  private readerService = new ReaderService(); // Ініціалізуємо сервіс читачів

  public login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      const user = await this.userService.findByEmail(email, true);

      if (!user || !(await user.checkIfPasswordMatch(password))) {
        return next(new CustomError(404, 'General', 'Not Found', ['Incorrect email or password']));
      }

      const token = createJwtToken({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as Role,
        created_at: user.created_at,
      });

      res.customSuccess(200, 'Login successful.', { 
          token: `Bearer ${token}`, 
          user: new UserResponseDTO(user) 
      });
    } catch (err) {
      return next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public register = async (req: Request, res: Response, next: NextFunction) => {
    const { 
        email, 
        password, 
        username, 
        name,
        // Додаткові поля
        createReader,
        firstname,
        lastname,
        patronymic,
        contact,
        address 
    } = req.body;
    
    try {
      const existing = await this.userService.findByEmail(email);
      if (existing) {
        return next(new CustomError(400, 'General', 'User already exists', [`Email '${email}' already exists`]));
      }

      // 1. Створюємо користувача
      // Якщо обрано створення читача, генеруємо ім'я з firstname/lastname, якщо воно не передано явно
      let displayName = name;
      if (createReader && firstname && lastname && !displayName) {
          displayName = `${lastname} ${firstname}`;
      }

      const newUser = await this.userService.create({ 
        email, 
        password, 
        username, 
        name: displayName || username // Фолбек на юзернейм
      });

      // 2. Якщо прапорець createReader = true, створюємо профіль читача
      if (createReader) {
          try {
             // Валідація мінімально необхідних полів для читача
             if (!firstname || !lastname) {
                // Якщо якимось чином фронтенд пропустив це
                throw new Error("Firstname and Lastname are required for Reader profile");
             }

             await this.readerService.create({
                 firstname,
                 lastname,
                 patronymic: patronymic || null,
                 contact: contact || '',
                 address: address || ''
             }, newUser.id); // Передаємо ID нового юзера для зв'язку

             // Оновлюємо роль користувача на READER, якщо вона ще не така (за замовчуванням User може мати роль USER або GUEST)
             if (newUser.role !== 'ADMINISTRATOR' && newUser.role !== 'LIBRARIAN') {
                 await this.userService.update(newUser.id, { role: 'READER' as Role });
             }

          } catch (readerError) {
              // Якщо не вдалося створити читача, можна видалити юзера або просто залогівати помилку
              // Для надійності краще використовувати транзакції, але в межах поточної архітектури:
              console.error("Failed to create reader profile:", readerError);
              // Можна повернути Warning, але юзер вже створений
          }
      }
      
      // Повертаємо оновленого юзера (вже з можливим зв'язком reader, якщо ORM встиг оновити, або просто DTO)
      const userWithRelations = await this.userService.findOne(newUser.id);
      
      res.customSuccess(200, 'User successfully created.', new UserResponseDTO(userWithRelations || newUser));
    } catch (err) {
      return next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public changePassword = async (req: Request, res: Response, next: NextFunction) => {
    const { password, passwordNew } = req.body;
    const { id } = req.jwtPayload;

    try {
      const user = await this.userService.findByEmail(req.jwtPayload.email, true);
      if (!user) return next(new CustomError(404, 'General', 'Not Found', ['User not found.']));

      if (!(await user.checkIfPasswordMatch(password))) {
        return next(new CustomError(400, 'General', 'Not Found', ['Incorrect password']));
      }

      await this.userService.update(id, { password: passwordNew });
      res.customSuccess(200, 'Password successfully changed.');
    } catch (err) {
      return next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };
}