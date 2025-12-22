import { getRepository } from 'typeorm';
import { Reader } from '../orm/entities/reader/Reader';

export class ReaderService {

  private get readerRepository() {
    return getRepository(Reader);
  }

  private relations = ['lendings'];

  async findAll(): Promise<Reader[]> {
    return this.readerRepository.find({
      relations: this.relations,
    });
  }

  async findOne(id: number): Promise<Reader | null> {
    return this.readerRepository.findOne({
      where: { id_reader: id },
      relations: this.relations,
    });
  }

  async create(data: Partial<Reader>): Promise<Reader> {
    const newReader = this.readerRepository.create(data);
    const savedReader = await this.readerRepository.save(newReader);
    return this.findOne(savedReader.id_reader) as Promise<Reader>;
  }

  async update(id: number, data: Partial<Reader>): Promise<Reader | null> {
    await this.readerRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.readerRepository.delete(id);
  }
}
