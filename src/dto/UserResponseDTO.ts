import { User } from '../orm/entities/users/User';
import { Role } from '../orm/entities/users/types';

export class UserResponseDTO {
  id: number;
  email: string;
  username: string;
  name: string;
  role: Role;
  language: string;
  createdAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.username = user.username;
    this.name = user.name;
    // Приводимо до типу Role, якщо в базі це рядок
    this.role = user.role as Role; 
    this.language = user.language;
    this.createdAt = user.created_at;
    // updated_at та password ми не повертаємо
  }
}