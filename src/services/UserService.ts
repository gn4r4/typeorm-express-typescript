import { getRepository } from 'typeorm';
import { User } from '../orm/entities/users/User';

export class UserService {
  private userRepository = getRepository(User);

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    // Якщо пароль передано, хешуємо його
    if (data.password) {
      user.hashPassword();
    }
    return this.userRepository.save(user);
  }

  async update(id: number, data: Partial<User>): Promise<User | null> {
    const user = await this.findOne(id);
    if (!user) return null;

    this.userRepository.merge(user, data);
    
    // Хешуємо пароль заново, якщо він оновлюється
    if (data.password) {
        user.hashPassword();
    }

    return this.userRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}