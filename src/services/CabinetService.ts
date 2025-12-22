import { getRepository } from 'typeorm';
import { Cabinet } from '../orm/entities/cabinet/Cabinet';

export class CabinetService {

  private get cabinetRepository() {
    return getRepository(Cabinet);
  }

  private relations = ['shelves'];

  async findAll(): Promise<Cabinet[]> {
    return this.cabinetRepository.find({ relations: this.relations });
  }

  async findOne(id: number): Promise<Cabinet | null> {
    return this.cabinetRepository.findOne({
      where: { id_cabinet: id },
      relations: this.relations,
    });
  }

  async create(data: Partial<Cabinet>): Promise<Cabinet> {
    const cabinet = this.cabinetRepository.create(data);
    return this.cabinetRepository.save(cabinet);
  }

  async update(id: number, data: Partial<Cabinet>): Promise<Cabinet | null> {
    await this.cabinetRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.cabinetRepository.delete(id);
  }
}