import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Orders } from '../orders/Orders';

@Entity('supplier')
export class Supplier {
    @PrimaryGeneratedColumn({ name: 'id_supplier' })
    id_supplier: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    contact: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    address: string;

    @OneToMany(() => Orders, (order) => order.supplier)
    orders: Orders[];
}
