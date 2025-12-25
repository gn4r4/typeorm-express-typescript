import bcrypt from 'bcryptjs';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';

import { Role, Language } from './types';
import { Employee } from '../employee/Employee';
import { Reader } from '../reader/Reader';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    length: 40,
    nullable: true,
    unique: true,
  })
  username: string;

  @Column({
    length: 40,
    nullable: true,
  })
  name: string;

  @Column({
    default: 'STANDARD' as Role,
    length: 30,
  })
  role: string;

  @Column({
    default: 'en-US' as Language,
    length: 15,
  })
  language: string;

  @OneToOne(() => Employee, (employee) => employee.user, { nullable: true })
  employee?: Employee;

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Column()
  @UpdateDateColumn()
  updated_at: Date;

  setLanguage(language: Language) {
    this.language = language;
  }

  async hashPassword() {
    this.password = await bcrypt.hashSync(this.password, 8);
  }

  async checkIfPasswordMatch(unencryptedPassword: string): Promise<boolean> {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}