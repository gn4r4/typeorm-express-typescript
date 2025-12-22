import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { Person } from '../person/Person';
import { Position } from '../position/Position';
import { Lending } from '../lending/Lending';
import { User } from '../users/User';

@Entity('employee')
export class Employee extends Person {
  @PrimaryGeneratedColumn({ name: 'id_employee' })
  id_employee: number;

  @Column()
  id_position: number;

  @ManyToOne(() => Position, (position) => position.employees)
  @JoinColumn({ name: 'id_position' })
  position: Position;

  @OneToMany(() => Lending, (lending) => lending.employee)
  lendings: Lending[];

  /**
   * One-to-One relationship with User
   * An Employee can be linked to a User account
   */
  @OneToOne(() => User, (user) => user.employee, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user?: User;
}