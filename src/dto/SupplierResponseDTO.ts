import { Supplier } from './../orm/entities/supplier/Supplier';
import { OrdersResponseDTO } from './OrdersResponseDTO';

export class SupplierResponseDTO {
  id: number;
  name: string;
  contact?: string | null;
  address?: string | null;
  orders: OrdersResponseDTO[];

  constructor(supplier: Supplier) {
      this.id = supplier.id_supplier;
      this.name = supplier.name;
      this.contact = supplier.contact || null;
      this.address = supplier.address || null;
      this.orders = supplier.orders ? supplier.orders.map(order => new OrdersResponseDTO(order)) : [];
    }
}
