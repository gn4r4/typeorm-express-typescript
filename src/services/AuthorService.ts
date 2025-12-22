import { getRepository } from 'typeorm';
import { Author } from '../orm/entities/author/Author';

export class AuthorService {

  private get authorRepository() {
    return getRepository(Author);
  }

  private relations = ['bookAuthors', 'bookAuthors.book'];

  async findAll(): Promise<Author[]> {
    return this.authorRepository.find({
      relations: this.relations,
    });
  }

  async findOne(id: number): Promise<Author | null> {
    return this.authorRepository.findOne({
      where: { id_author: id },
      relations: this.relations,
    });
  }

  async create(data: Partial<Author>): Promise<Author> {
    const author = this.authorRepository.create(data);
    return this.authorRepository.save(author);
  }

  async update(id: number, data: Partial<Author>): Promise<Author | null> {
    await this.authorRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.authorRepository.delete(id);
  }
}