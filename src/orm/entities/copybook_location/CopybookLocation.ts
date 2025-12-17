import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Copybook } from '../copybook/Copybook';
import { Shelf } from '../shelf/Shelf';

@Entity('copybook_location')
export class CopybookLocation {
  @PrimaryGeneratedColumn({ name: 'id_location' })
  id_location: number;

  @Column()
  id_shelf: number;

  @ManyToOne(() => Shelf, (shelf) => shelf.copybookLocations)
  @JoinColumn({ name: 'id_shelf' })
  shelf: Shelf;

  @Column()
  id_copybook: number;

  @ManyToOne(() => Copybook, (copybook) => copybook.locations)
  @JoinColumn({ name: 'id_copybook' })
  copybook: Copybook;
}