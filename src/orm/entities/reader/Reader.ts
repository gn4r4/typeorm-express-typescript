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
}