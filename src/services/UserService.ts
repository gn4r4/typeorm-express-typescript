import { getRepository } from 'typeorm';
import { User } from '../orm/entities/users/User';

export class UserService {
  private userRepository = getRepository(User);

  // Поля, які безпечно показувати адміністратору
  private readonly secureSelect: (keyof User)[] = [
    'id', 'username', 'name', 'email', 'role', 'language', 'created_at', 'updated_at'
  ];

  async findByEmail(email: string, withPassword = false): Promise<User | null> {
    // Якщо потрібен пароль (для логіну), не обмежуємо select
    if (withPassword) {
        return this.userRepository.findOne({ where: { email } });
    }
    return this.userRepository.findOne({ where: { email }, select: this.secureSelect });
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      select: this.secureSelect,
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: this.secureSelect,
    });
  }

  async create(data: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(data);
    if (data.password) {
      newUser.hashPassword(); // Хешування всередині сервісу
    }
    return this.userRepository.save(newUser);
  }

  async update(id: number, data: Partial<User>): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return null;

    this.userRepository.merge(user, data);
    
    // Якщо оновлюється пароль, треба його хешувати
    if (data.password) {
        user.hashPassword();
    }
    
    return this.userRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}