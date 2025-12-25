import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Book } from '../book/Book';
import { Publisher } from '../publisher/Publisher';
import { Copybook } from '../copybook/Copybook';
import { OrderEdition } from '../order_edition/OrderEdition';

@Entity('edition')
export class Edition {
  @PrimaryGeneratedColumn({ name: 'id_edition' })
  id_edition: number;

  @Column()
  id_book: number;

  @ManyToOne(() => Book)
  @JoinColumn({ name: 'id_book' })
  book: Book;

  @Column()
  id_publisher: number;

  @ManyToOne(() => Publisher, (publisher) => publisher.editions)
  @JoinColumn({ name: 'id_publisher' })
  publisher: Publisher;

  @Column({ type: 'date' })
  yearpublication: Date;

  @Column({ type: 'varchar', length: 20, nullable: true })
  ISBN: string;

  @Column({ type: 'int', nullable: true })
  pages: number;

  @OneToMany(() => Copybook, (copybook) => copybook.edition)
  copybooks: Copybook[];

  @OneToMany(() => OrderEdition, (orderEdition) => orderEdition.edition)
  orderEditions: OrderEdition[];
}