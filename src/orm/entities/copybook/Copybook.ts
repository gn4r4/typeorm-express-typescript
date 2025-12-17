import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Edition } from '../edition/Edition';
import { CopybookLocation } from '../copybook_location/CopybookLocation';
import { LendingCopybook } from '../lending_copybook/LendingCopybook';

@Entity('copybook')
export class Copybook {
  @PrimaryGeneratedColumn({ name: 'id_copybook' })
  id_copybook: number;

  @Column()
  id_edition: number;

  @ManyToOne(() => Edition, (edition) => edition.copybooks)
  @JoinColumn({ name: 'id_edition' })
  edition: Edition;

  @Column({ length: 50 })
  status: string; // наприклад, 'доступний', 'виданий'

  @OneToMany(() => CopybookLocation, (location) => location.copybook)
  locations: CopybookLocation[];

  @OneToMany(() => LendingCopybook, (lendingCopybook) => lendingCopybook.copybook)
  lendingCopybooks: LendingCopybook[];
}