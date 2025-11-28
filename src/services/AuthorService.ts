import { getRepository } from 'typeorm';
import { Author } from '../orm/entities/author/Author';

export class AuthorService {
  private authorRepository = getRepository(Author);

  async findAll(): Promise<Author[]> {
    return this.authorRepository.find();
  }

  async findOne(id: number): Promise<Author | null> {
    return this.authorRepository.findOne({ where: { id_author: id } });
  }

  async create(data: Partial<Author>): Promise<Author> {
    const author = this.authorRepository.create(data);
    return this.authorRepository.save(author);
  }

  async update(id: number, data: Partial<Author>): Promise<Author | null> {
    const author = await this.findOne(id);
    if (!author) return null;

    this.authorRepository.merge(author, data);
    return this.authorRepository.save(author);
  }

  async delete(id: number): Promise<void> {
    await this.authorRepository.delete(id);
  }
}