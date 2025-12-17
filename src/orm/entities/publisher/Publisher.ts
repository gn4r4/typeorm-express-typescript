import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Edition } from '../edition/Edition';

@Entity('publisher')
export class Publisher {
  @PrimaryGeneratedColumn({ name: 'id_publisher' })
  id_publisher: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, nullable: true })
  address: string;

  @Column({ length: 50, nullable: true })
  contact: string;

  @OneToMany(() => Edition, (edition) => edition.publisher)
  editions: Edition[];
}