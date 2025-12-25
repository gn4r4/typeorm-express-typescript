import { getRepository, getConnection } from 'typeorm';
import { User } from '../orm/entities/users/User';
import { Employee } from '../orm/entities/employee/Employee';
import { Reader } from '../orm/entities/reader/Reader';

export class UserService {
  
  private get userRepository() {
    return getRepository(User);
  }

  private get employeeRepository() {
    return getRepository(Employee);
  }

  private get readerRepository() {
    return getRepository(Reader);
  }

  // Поля, які безпечно показувати адміністратору
  private readonly secureSelect: (keyof User)[] = [
    'id', 'username', 'name', 'email', 'role', 'language', 'created_at', 'updated_at'
  ];

  async findByEmail(email: string, withPassword = false): Promise<User | null> {
    if (withPassword) {
        return this.userRepository.findOne({ where: { email } });
    }
    return this.userRepository.findOne({ where: { email }, select: this.secureSelect });
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      select: this.secureSelect,
      relations: ['employee'], // Reader не має зв'язку з User
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: this.secureSelect,
      relations: ['employee'],
    });
  }

  async create(data: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(data);
    if (data.password) {
      await newUser.hashPassword(); 
    }
    return this.userRepository.save(newUser);
  }

  async createUserWithEmployee(
    userData: Partial<User>,
    employeeData: Partial<Employee>
  ): Promise<{ user: User; employee: Employee }> {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.startTransaction();
    try {
      // Create and save User
      const newUser = this.userRepository.create(userData);
      if (userData.password) {
        await newUser.hashPassword();
      }
      const savedUser = await queryRunner.manager.save(User, newUser);

      // Create Employee з id_user (а не user_id)
      const newEmployee = this.employeeRepository.create({
        ...employeeData,
        id_user: savedUser.id,
      });
      const savedEmployee = await queryRunner.manager.save(Employee, newEmployee);

      await queryRunner.commitTransaction();
      return {
        user: savedUser,
        employee: savedEmployee,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, data: Partial<User>): Promise<User | null> {
    const updateData = { ...data };
    
    if (data.password) {
      // Для пароля потрібно отримати об'єкт користувача, хешувати і зберегти
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) return null;
      
      user.password = data.password;
      await user.hashPassword();
      
      // Видаляємо password з updateData, щоб його не передати в update()
      delete updateData.password;
      
      // Спочатку оновлюємо інші поля
      if (Object.keys(updateData).length > 0) {
        await this.userRepository.update(id, updateData);
      }
      
      // Потім зберігаємо хешований пароль
      await this.userRepository.save(user);
    } else {
      await this.userRepository.update(id, updateData);
    }
    
    return this.userRepository.findOne({
      where: { id },
      select: this.secureSelect,
      relations: ['employee'],
    });
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}