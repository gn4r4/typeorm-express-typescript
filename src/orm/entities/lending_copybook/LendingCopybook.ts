import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Lending } from '../lending/Lending';
import { Copybook } from '../copybook/Copybook';

@Entity('lending_copybook')
export class LendingCopybook {
  @PrimaryColumn()
  id_lending: number;

  @PrimaryColumn()
  id_copybook: number;

  @ManyToOne(() => Lending, (lending) => lending.lendingCopybooks)
  @JoinColumn({ name: 'id_lending' })
  lending: Lending;

  @ManyToOne(() => Copybook, (copybook) => copybook.lendingCopybooks)
  @JoinColumn({ name: 'id_copybook' })
  copybook: Copybook;
}