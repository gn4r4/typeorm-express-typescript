import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Employee } from '../employee/Employee';

@Entity('position')
export class Position {
  @PrimaryGeneratedColumn({ name: 'id_position' })
  id_position: number;

  @Column({ length: 100, unique: true })
  name: string;

  @OneToMany(() => Employee, (employee) => employee.position)
  employees: Employee[];
}