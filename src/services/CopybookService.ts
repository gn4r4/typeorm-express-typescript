import { getRepository, getConnection } from 'typeorm';
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

  // Наші зв'язки для завантаження повної інформації
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

  async create(data: { id_edition: number; status: string; id_location: number | null }): Promise<Copybook> {
    return await getConnection().transaction(async (transactionalEntityManager) => {
      
      let savedCopybook: Copybook;

      // 1. Спочатку створюємо саму книгу (незалежно від локації)
      const newCopybook = transactionalEntityManager.create(Copybook, {
        id_edition: data.id_edition,
        status: data.status,
      });
      savedCopybook = await transactionalEntityManager.save(newCopybook);

      // 2. Якщо локація передана — перевіряємо і прив'язуємо її
      if (data.id_location) {
        const location = await transactionalEntityManager.findOne(CopybookLocation, {
          where: { id_location: data.id_location },
          relations: ['copybook']
        });

        if (!location) throw new CustomError(404, 'General', 'Location not found');
        if (location.copybook) throw new CustomError(409, 'General', 'Location already occupied');

        // Прив'язка локації (One-to-One)
        location.copybook = savedCopybook;
        location.id_copybook = savedCopybook.id_copybook;
        await transactionalEntityManager.save(location);
      }

      // 3. Повернення результату
      const result = await transactionalEntityManager.findOne(Copybook, {
        where: { id_copybook: savedCopybook.id_copybook },
        relations: this.relations
      });
      return result!;
    });
  }

  async update(id: number, data: { status?: string; id_location?: number | null }): Promise<Copybook | null> {
    return await getConnection().transaction(async (transactionalEntityManager) => {
      
      // 1. Знаходимо книгу разом з поточною локацією
      const copybook = await transactionalEntityManager.findOne(Copybook, {
        where: { id_copybook: id },
        relations: ['location'] 
      });

      if (!copybook) return null; // Книгу не знайдено

      // 2. Оновлюємо статус, якщо він прийшов
      if (data.status) {
        copybook.status = data.status;
      }

      // 3. Логіка зміни локації
      // Ми перевіряємо undefined, щоб знати, чи поле взагалі передавалось у запиті
      if (data.id_location !== undefined) {
        
        // Якщо локація змінилася (або ми хочемо прибрати книгу з полиці, передавши null)
        const currentLocationId = copybook.location ? copybook.location.id_location : null;
        
        if (data.id_location !== currentLocationId) {

          // А. Звільняємо СТАРУ полицю (якщо вона була)
          if (copybook.location) {
            await transactionalEntityManager.update(CopybookLocation, copybook.location.id_location, {
              id_copybook: null as any 
            });
            copybook.location = null as any; // Відв'язуємо в об'єкті
          }

          // Б. Якщо є НОВА полиця — займаємо її
          if (data.id_location) {
            const newLocation = await transactionalEntityManager.findOne(CopybookLocation, {
              where: { id_location: data.id_location },
              relations: ['copybook']
            });

            if (!newLocation) throw new CustomError(404, 'General', 'New location not found');
            
            if (newLocation.copybook && newLocation.copybook.id_copybook !== id) {
              throw new CustomError(409, 'General', 'New location is already occupied');
            }

            // Оновлюємо бік локації
            newLocation.copybook = copybook;
            newLocation.id_copybook = copybook.id_copybook;
            await transactionalEntityManager.save(newLocation);
            
            // Оновлюємо посилання в об'єкті (для коректного повернення)
            copybook.location = newLocation;
          }
        }
      }

      // 4. Зберігаємо зміни в книзі
      await transactionalEntityManager.save(copybook);

      // 5. Повертаємо оновлений об'єкт з повними зв'язками
      return await transactionalEntityManager.findOne(Copybook, {
        where: { id_copybook: id },
        relations: this.relations
      });
    });
  }

  async delete(id: number): Promise<void> {
    await getConnection().transaction(async (transactionalEntityManager) => {
      const copybook = await transactionalEntityManager.findOne(Copybook, {
        where: { id_copybook: id },
        relations: ['location']
      });

      if (!copybook) throw new CustomError(404, 'General', 'Copybook not found');

      // Звільняємо місце перед видаленням
      if (copybook.location) {
        await transactionalEntityManager.update(CopybookLocation, copybook.location.id_location, {
           id_copybook: null as any
        });
      }

      await transactionalEntityManager.remove(copybook);
    });
  }
}