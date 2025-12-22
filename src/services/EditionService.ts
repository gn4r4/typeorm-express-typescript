import { getRepository } from 'typeorm';
import { Edition } from '../orm/entities/edition/Edition';

export class EditionService {

  private get editionRepository() {
    return getRepository(Edition);
  }

  private relations = ['book', 'publisher', 'copybooks'];

  async findAll(): Promise<Edition[]> {
    return this.editionRepository.find({ relations: this.relations });
  }

  async findOne(id: number): Promise<Edition | null> {
    return this.editionRepository.findOne({
      where: { id_edition: id },
      relations: this.relations,
    });
  }

  async create(data: Partial<Edition>): Promise<Edition> {
    const edition = this.editionRepository.create(data);
    return this.editionRepository.save(edition);
  }

  async update(id: number, data: Partial<Edition>): Promise<Edition | null> {
    await this.editionRepository.update(id, data);

    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.editionRepository.delete(id);
  }
}