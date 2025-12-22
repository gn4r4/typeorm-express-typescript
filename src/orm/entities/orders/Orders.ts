import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrderEdition } from '../order_edition/OrderEdition';

@Entity('orders')
export class Orders {
  @PrimaryGeneratedColumn({ name: 'id_order' }) 
  id_order: number;

  @Column({ type: 'date' })
  dateorder: Date;

  @Column({ length: 50 })
  status: string;

  @OneToMany(() => OrderEdition, (orderEdition) => orderEdition.order)
  orderEditions: OrderEdition[];
}