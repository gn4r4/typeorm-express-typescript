import { User } from '../orm/entities/users/User';
import { Language, Role } from '../orm/entities/users/types';

export class UserResponseDTO {
  id: number;
  email: string;
  username: string;
  name: string;
  role: Role;
  language: Language;
  createdAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.username = user.username;
    this.name = user.name;
    this.role = user.role as Role; 
    this.language = user.language as Language;
    this.createdAt = user.created_at;
  }
}