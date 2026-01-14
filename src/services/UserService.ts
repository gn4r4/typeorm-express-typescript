import { getRepository } from 'typeorm';
import { User } from '../orm/entities/users/User';
import { Reader } from '../orm/entities/reader/Reader'; // Додано імпорт
import { Employee } from '../orm/entities/employee/Employee'; // Додано імпорт
export class UserService {
  
  private get userRepository() {
    return getRepository(User);
  }

  private readonly secureSelect: (keyof User)[] = [
    'id', 'username', 'name', 'email', 'role', 'language', 'created_at', 'updated_at'
  ];

  private readonly relations = ['employee', 'reader'];

  async findByEmail(email: string, withPassword = false): Promise<User | null> {
    const options: any = {
        where: { email },
        relations: this.relations 
    };

    if (!withPassword) {
        options.select = this.secureSelect;
    }

    return this.userRepository.findOne(options);
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      select: this.secureSelect,
      relations: this.relations, 
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: this.secureSelect,
      relations: this.relations,
    });
  }

  async create(data: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(data);
    if (data.password) {
      await newUser.hashPassword(); 
    }
    return this.userRepository.save(newUser);
  }

  async update(id: number, data: Partial<User>): Promise<User | null> {
    const updateData = { ...data };
    
    if (data.password) {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) return null;
      
      user.password = data.password;
      await user.hashPassword();
      delete updateData.password;
      
      if (Object.keys(updateData).length > 0) {
        await this.userRepository.update(id, updateData);
      }
      await this.userRepository.save(user);
    } else {
      await this.userRepository.update(id, updateData);
    }
    
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {

    const readerRepository = getRepository(Reader);

    await readerRepository.update({ id_user: id }, { id_user: null });

    const employeeRepository = getRepository(Employee);
    await employeeRepository.update({ id_user: id }, { id_user: null });

    await this.userRepository.delete(id);
  }
}