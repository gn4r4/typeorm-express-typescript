import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Orders } from '../orders/Orders';
import { Edition } from '../edition/Edition';

@Entity('order_edition')
export class OrderEdition {
  @PrimaryColumn()
  id_order: number;

  @PrimaryColumn()
  id_edition: number;

  @ManyToOne(() => Orders, (order) => order.orderEditions)
  @JoinColumn({ name: 'id_order' })
  order: Orders;

  @ManyToOne(() => Edition, (edition) => edition.orderEditions)
  @JoinColumn({ name: 'id_edition' })
  edition: Edition;

  @Column()
  quantity: number;
}