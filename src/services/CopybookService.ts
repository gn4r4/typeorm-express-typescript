import { getRepository } from 'typeorm';
import { Copybook } from '../orm/entities/copybook/Copybook';
import { CopybookLocation } from '../orm/entities/copybook_location/CopybookLocation';

export class CopybookService {

  private get copybookRepository() {
    return getRepository(Copybook);
  }
  
  private get locationRepository() {
    return getRepository(CopybookLocation);
  }

  private relations = ['edition', 'edition.book', 'locations', 'locations.shelf'];

  async findAll(): Promise<Copybook[]> {
    return this.copybookRepository.find({ relations: this.relations });
  }

  async findOne(id: number): Promise<Copybook | null> {
    return this.copybookRepository.findOne({
      where: { id_copybook: id },
      relations: this.relations,
    });
  }

  // При створенні можна одразу вказати id_shelf, щоб створити запис у CopybookLocation
  async create(data: Partial<Copybook> & { initialShelfId?: number }): Promise<Copybook> {
    const { initialShelfId, ...copybookData } = data;

    const copybook = this.copybookRepository.create(copybookData);
    const savedCopybook = await this.copybookRepository.save(copybook);

    if (initialShelfId) {
       const location = this.locationRepository.create({
           id_copybook: savedCopybook.id_copybook,
           id_shelf: initialShelfId
       });
       await this.locationRepository.save(location);
    }

    return this.findOne(savedCopybook.id_copybook) as Promise<Copybook>;
  }

  async update(id: number, data: Partial<Copybook>): Promise<Copybook | null> {
    const copybook = await this.findOne(id);
    if (!copybook) return null;
    this.copybookRepository.merge(copybook, data);
    return this.copybookRepository.save(copybook);
  }

  async delete(id: number): Promise<void> {
    await this.copybookRepository.delete(id);
  }
}