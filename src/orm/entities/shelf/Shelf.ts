import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Cabinet } from '../cabinet/Cabinet';
import { CopybookLocation } from '../copybook_location/CopybookLocation';

@Entity('shelf')
export class Shelf {
  @PrimaryGeneratedColumn({ name: 'id_shelf' })
  id_shelf: number;

  @Column()
  id_cabinet: number;

  @ManyToOne(() => Cabinet, (cabinet) => cabinet.shelves)
  @JoinColumn({ name: 'id_cabinet' })
  cabinet: Cabinet;

  @Column({ length: 50 })
  shelfcode: string;

  @OneToMany(() => CopybookLocation, (location) => location.shelf)
  copybookLocations: CopybookLocation[];
}