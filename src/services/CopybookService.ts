import { getRepository } from 'typeorm';
import { Copybook } from '../orm/entities/copybook/Copybook';
import { CopybookLocation } from '../orm/entities/copybook_location/CopybookLocation';
import { CustomError } from '../utils/response/custom-error/CustomError';

export class CopybookService {
  private get copybookRepository() {
    return getRepository(Copybook);
  }

  private get locationRepository() {
    return getRepository(CopybookLocation);
  }

  private relations = ['edition', 'edition.book', 'location', 'location.shelf', 'location.shelf.cabinet'];

  async findAll(): Promise<Copybook[]> {
    return this.copybookRepository.find({ relations: this.relations });
  }

  async findOne(id: number): Promise<Copybook | null> {
    return this.copybookRepository.findOne({
      where: { id_copybook: id },
      relations: this.relations,
    });
  }

  async create(data: Partial<Copybook> & { id_location?: number | null }): Promise<Copybook> {
    const { id_location, ...copybookData } = data;

    // 1. Створюємо копію книги
    const newCopybook = this.copybookRepository.create(copybookData);
    const savedCopybook = await this.copybookRepository.save(newCopybook);

    // 2. Якщо є локація, прив'язуємо
    if (id_location !== null && id_location !== undefined) {
      const location = await this.locationRepository.findOne({
        where: { id_location },
        relations: ['copybook']
      });
      if (!location) throw new CustomError(404, 'General', 'Location not found');
      if (location.copybook) throw new CustomError(409, 'General', 'Location already occupied');
      location.copybook = savedCopybook;
      location.id_copybook = savedCopybook.id_copybook;
      await this.locationRepository.save(location);
    }

    return this.findOne(savedCopybook.id_copybook) as Promise<Copybook>;
  }

  async update(id: number, data: Partial<Copybook> & { id_location?: number | null }): Promise<Copybook | null> {
    const { id_location, ...copybookData } = data;

    // 1. Оновлюємо основні дані
    await this.copybookRepository.update(id, copybookData);

    // 2. Якщо передали id_location, оновлюємо зв'язок
    if (id_location !== undefined) {
      // Знаходимо поточну локацію
      const copybook = await this.copybookRepository.findOne({
        where: { id_copybook: id },
        relations: ['location']
      });
      if (!copybook) return null;

      const currentLocationId = copybook.location ? copybook.location.id_location : null;
      if (id_location !== currentLocationId) {
        // Звільняємо стару локацію
        if (copybook.location) {
          await this.locationRepository.update(copybook.location.id_location, { id_copybook: null });
        }
        // Прив'язуємо нову локацію
        if (id_location) {
          const newLocation = await this.locationRepository.findOne({
            where: { id_location },
            relations: ['copybook']
          });
          if (!newLocation) throw new CustomError(404, 'General', 'New location not found');
          if (newLocation.copybook && newLocation.copybook.id_copybook !== id) {
            throw new CustomError(409, 'General', 'New location is already occupied');
          }
          newLocation.copybook = copybook;
          newLocation.id_copybook = copybook.id_copybook;
          await this.locationRepository.save(newLocation);
        }
      }
    }

    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    // Звільняємо локацію перед видаленням
    const copybook = await this.copybookRepository.findOne({
      where: { id_copybook: id },
      relations: ['location']
    });
    if (copybook && copybook.location) {
      await this.locationRepository.update(copybook.location.id_location, { id_copybook: null });
    }
    await this.copybookRepository.delete(id);
  }
}