import { getRepository } from 'typeorm';
import { CopybookLocation } from '../orm/entities/copybook_location/CopybookLocation';

export class LocationService {
  
  private get locationRepository() {
    return getRepository(CopybookLocation);
  }

  // Завантажуємо полицю, шафу і КНИГУ (щоб знати, чи зайняте місце)
  private relations = [
    'shelf', 
    'shelf.cabinet', 
    'copybook', 
    'copybook.edition',      
    'copybook.edition.book' 
  ];

  public async findAll(): Promise<CopybookLocation[]> {
    return this.locationRepository.find({
      relations: this.relations,
    });
  }

  public async findOne(id: number): Promise<CopybookLocation | null> {
    return this.locationRepository.findOne({
      where: { id_location: id },
      relations: this.relations,
    });
  }

  public async create(data: { id_shelf: number; quantity?: number }): Promise<CopybookLocation[]> {
    const quantity = data.quantity && data.quantity > 0 ? data.quantity : 1;
    const createdLocations: CopybookLocation[] = [];

    // Виконуємо цикл для створення певної кількості місць
    for (let i = 0; i < quantity; i++) {
      const newLocation = this.locationRepository.create({
        id_shelf: data.id_shelf
      });
      const saved = await this.locationRepository.save(newLocation);
      createdLocations.push(saved);
    }

    // Повертаємо масив створених місць
    return createdLocations;
  }

  public async update(id: number, data: Partial<CopybookLocation>): Promise<CopybookLocation | null> {
    await this.locationRepository.update(id, data);
    return this.findOne(id);
  }

  public async delete(id: number): Promise<void> {
    await this.locationRepository.delete(id);
  }
}