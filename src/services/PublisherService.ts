import { getRepository } from 'typeorm';
import { Publisher } from '../orm/entities/publisher/Publisher';

export class PublisherService {

  private get publisherRepository() {
    return getRepository(Publisher);
  }

  private relations = ['editions'];

  async findAll(): Promise<Publisher[]> {
    return this.publisherRepository.find({ relations: this.relations });
  }

  async findOne(id: number): Promise<Publisher | null> {
    return this.publisherRepository.findOne({
      where: { id_publisher: id },
      relations: this.relations,
    });
  }

  async create(data: Partial<Publisher>): Promise<Publisher> {
    const publisher = this.publisherRepository.create(data);
    return this.publisherRepository.save(publisher);
  }

  async update(id: number, data: Partial<Publisher>): Promise<Publisher | null> {
    await this.publisherRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.publisherRepository.delete(id);
  }
}