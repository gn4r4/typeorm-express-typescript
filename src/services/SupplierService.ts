import { getRepository } from 'typeorm';
import { Supplier } from '../orm/entities/supplier/Supplier';

export class SupplierService {

  private get supplierRepository() {
    return getRepository(Supplier);
  }

  private relations = ['orders', 'orders.orderEditions', 'orders.orderEditions.edition', 'orders.orderEditions.edition.book'];

  async findAll(): Promise<Supplier[]> {
    return this.supplierRepository.find({
      relations: this.relations,
    });
  }

  async findOne(id: number): Promise<Supplier | null> {
    return this.supplierRepository.findOne({
      where: { id_supplier: id },
      relations: this.relations,
    });
  }

  async create(data: Partial<Supplier>): Promise<Supplier> {
    const supplier = this.supplierRepository.create(data);
    return this.supplierRepository.save(supplier);
  }

  async update(id: number, data: Partial<Supplier>): Promise<Supplier | null> {
    await this.supplierRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.supplierRepository.delete(id);
  }
}
