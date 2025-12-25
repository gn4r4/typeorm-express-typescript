import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Supplier } from '../supplier/Supplier';
import { OrderEdition } from '../order_edition/OrderEdition';

@Entity('orders')
export class Orders {
  @PrimaryGeneratedColumn({ name: 'id_order' }) 
  id_order: number;

  @Column({ type: 'date' })
  dateorder: Date;

  @Column({ length: 50 })
  status: string;

  @Column()
  id_supplier: number;

  @ManyToOne(() => Supplier, { nullable: true })
  @JoinColumn({ name: 'id_supplier' })
  supplier: Supplier;

  @OneToMany(() => OrderEdition, (orderEdition) => orderEdition.order)
  orderEditions: OrderEdition[];
}