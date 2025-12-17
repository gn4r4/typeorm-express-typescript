import { getRepository } from 'typeorm';
import { Orders } from '../orm/entities/orders/Orders';
import { OrderEdition } from '../orm/entities/order_edition/OrderEdition';

export class OrdersService {

  private get ordersRepository() {
    return getRepository(Orders);
  }

  private get orderEditionRepository() {
    return getRepository(OrderEdition);
  }

  private relations = ['orderEditions', 'orderEditions.edition', 'orderEditions.edition.book'];

  async findAll(): Promise<Orders[]> {
    return this.ordersRepository.find({ relations: this.relations });
  }

  async findOne(id: number): Promise<Orders | null> {
    return this.ordersRepository.findOne({
      where: { id_order: id },
      relations: this.relations,
    });
  }

  // Приймає деталі замовлення: { editionId: 1, quantity: 5 }
  async create(data: Partial<Orders> & { details?: { editionId: number, quantity: number }[] }): Promise<Orders> {
    const { details, ...orderData } = data;

    const order = this.ordersRepository.create(orderData);
    const savedOrder = await this.ordersRepository.save(order);

    if (details && details.length > 0) {
      const items = details.map(item => 
        this.orderEditionRepository.create({ 
            id_order: savedOrder.id_order, 
            id_edition: item.editionId, 
            quantity: item.quantity 
        })
      );
      await this.orderEditionRepository.save(items);
    }

    return this.findOne(savedOrder.id_order) as Promise<Orders>;
  }

  async update(id: number, data: Partial<Orders> & { details?: { editionId: number, quantity: number }[] }): Promise<Orders | null> {
    const order = await this.ordersRepository.findOne({ where: { id_order: id } });
    if (!order) return null;

    const { details, ...orderData } = data;

    this.ordersRepository.merge(order, orderData);
    await this.ordersRepository.save(order);

    if (details) {
      await this.orderEditionRepository.delete({ id_order: id });
      
      if (details.length > 0) {
        const items = details.map(item => 
            this.orderEditionRepository.create({ 
                id_order: id, 
                id_edition: item.editionId, 
                quantity: item.quantity 
            })
        );
        await this.orderEditionRepository.save(items);
      }
    }

    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.orderEditionRepository.delete({ id_order: id });
    await this.ordersRepository.delete(id);
  }
}