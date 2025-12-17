import { getRepository } from 'typeorm';
import { Reader } from '../orm/entities/reader/Reader';

export class ReaderService {

  private get readerRepository() {
    return getRepository(Reader);
  }

  private relations = ['lendings'];

  async findAll(): Promise<Reader[]> {
    return this.readerRepository.find({ relations: this.relations });
  }

  async findOne(id: number): Promise<Reader | null> {
    return this.readerRepository.findOne({
      where: { id_reader: id },
      relations: this.relations,
    });
  }

  async create(data: Partial<Reader>): Promise<Reader> {
    const reader = this.readerRepository.create(data);
    return this.readerRepository.save(reader);
  }

  async update(id: number, data: Partial<Reader>): Promise<Reader | null> {
    const reader = await this.findOne(id);
    if (!reader) return null;
    this.readerRepository.merge(reader, data);
    return this.readerRepository.save(reader);
  }

  async delete(id: number): Promise<void> {
    await this.readerRepository.delete(id);
  }
}