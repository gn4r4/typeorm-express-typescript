import { Entity, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Person } from '../person/Person';
import { Lending } from '../lending/Lending';
import { User } from '../users/User';

@Entity('reader')
export class Reader extends Person {
  @PrimaryGeneratedColumn({ name: 'id_reader' })
  id_reader: number;

  @OneToMany(() => Lending, (lending) => lending.reader)
  lendings: Lending[];

  /**
   * One-to-One relationship with User
   * A Reader can be linked to a User account
   */
  @OneToOne(() => User, (user) => user.reader, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user?: User;
}