import { Orders } from '../orm/entities/orders/Orders';
import { EditionResponseDTO } from './EditionResponseDTO';
import { SupplierResponseDTO } from './SupplierResponseDTO';

export class OrdersResponseDTO {
  id: number;
  date: Date;
  status: string;
  supplier: SupplierResponseDTO | null;

  editions: {
    edition: EditionResponseDTO;
    quantity: number;
  }[];

  constructor(order: Orders) {
    this.id = order.id_order;
    this.date = order.dateorder;
    this.status = order.status;
    this.supplier = order.supplier ? new SupplierResponseDTO(order.supplier) : null;

    this.editions = order.orderEditions 
      ? order.orderEditions.map(oe => ({
          edition: new EditionResponseDTO(oe.edition),
          quantity: oe.quantity
        }))
      : [];
  }
}