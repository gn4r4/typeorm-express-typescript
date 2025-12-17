import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Shelf } from '../shelf/Shelf';

@Entity('cabinet')
export class Cabinet {
  @PrimaryGeneratedColumn({ name: 'id_cabinet' })
  id_cabinet: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 255, nullable: true })
  description: string;

  @OneToMany(() => Shelf, (shelf) => shelf.cabinet)
  shelves: Shelf[];
}