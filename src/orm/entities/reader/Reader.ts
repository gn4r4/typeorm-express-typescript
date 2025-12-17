import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Lending } from '../lending/Lending';

@Entity('reader')
export class Reader {
  @PrimaryGeneratedColumn({ name: 'id_reader' })
  id_reader: number;

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

  @OneToMany(() => Lending, (lending) => lending.reader)
  lendings: Lending[];
}