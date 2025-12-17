import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Position } from '../position/Position';
import { Lending } from '../lending/Lending';

@Entity('employee')
export class Employee {
  @PrimaryGeneratedColumn({ name: 'id_employee' })
  id_employee: number;

  @Column({ length: 50 })
  lastname: string;

  @Column({ length: 50 })
  firstname: string;

  @Column({ length: 50, nullable: true })
  patronymic: string;

  @Column({ length: 50 })
  contact: string;

  @Column({ length: 255 })
  address: string;

  @Column()
  id_position: number;

  @ManyToOne(() => Position, (position) => position.employees)
  @JoinColumn({ name: 'id_position' })
  position: Position;

  @OneToMany(() => Lending, (lending) => lending.employee)
  lendings: Lending[];
}