import { getRepository } from 'typeorm';
import { Shelf } from '../orm/entities/shelf/Shelf';

export class ShelfService {

  private get shelfRepository() {
    return getRepository(Shelf);
  }

  // Завантажуємо інформацію про шафу та книги, що стоять на полиці
  private relations = ['cabinet', 'copybookLocations'];

  async findAll(): Promise<Shelf[]> {
    return this.shelfRepository.find({ relations: this.relations });
  }

  async findOne(id: number): Promise<Shelf | null> {
    return this.shelfRepository.findOne({
      where: { id_shelf: id },
      relations: this.relations,
    });
  }

  async create(data: Partial<Shelf>): Promise<Shelf> {
    const shelf = this.shelfRepository.create(data);
    return this.shelfRepository.save(shelf);
  }

  async update(id: number, data: Partial<Shelf>): Promise<Shelf | null> {
    const shelf = await this.findOne(id);
    if (!shelf) return null;
    this.shelfRepository.merge(shelf, data);
    return this.shelfRepository.save(shelf);
  }

  async delete(id: number): Promise<void> {
    await this.shelfRepository.delete(id);
  }
}