import { Orders } from '../orm/entities/orders/Orders';
import { EditionResponseDTO } from './EditionResponseDTO';

// Допоміжний інтерфейс для позицій замовлення
interface OrderItem {
  edition: EditionResponseDTO;
  quantity: number;
}

export class OrdersResponseDTO {
  id: number;
  dateOrder: Date;
  status: string;
  items: OrderItem[];

  constructor(order: Orders) {
    this.id = order.id_order;
    this.dateOrder = order.dateorder;
    this.status = order.status;

    // Мапінг позицій замовлення
    if (order.orderEditions && order.orderEditions.length > 0) {
      this.items = order.orderEditions.map(oe => ({
        edition: new EditionResponseDTO(oe.edition),
        quantity: oe.quantity
      }));
    } else {
      this.items = [];
    }
  }
}