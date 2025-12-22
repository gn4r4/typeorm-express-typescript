import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
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

  @Column({ nullable: true})
  id_copybook: number | null;

  @OneToOne(() => Copybook, (copybook) => copybook.location, { 
    nullable: true,
    onDelete: 'SET NULL' 
  })
  @JoinColumn({ name: 'id_copybook' })
  copybook: Copybook | null;
}