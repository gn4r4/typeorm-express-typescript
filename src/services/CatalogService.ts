import { getRepository } from 'typeorm';
import { Edition } from '../orm/entities/edition/Edition';

export class CatalogService {
  private get editionRepository() {
    return getRepository(Edition);
  }
  
  async findAll(search?: string): Promise<Edition[]> {
    const query = this.editionRepository.createQueryBuilder('edition')
      .leftJoinAndSelect('edition.book', 'book')
      .leftJoinAndSelect('book.genre', 'genre')
      .leftJoinAndSelect('book.category', 'category')
      .leftJoinAndSelect('book.bookAuthors', 'bookAuthors')
      .leftJoinAndSelect('bookAuthors.author', 'author')
      .leftJoinAndSelect('edition.publisher', 'publisher')
      .leftJoinAndSelect('edition.copybooks', 'copybooks');

    if (search) {
      query.where('book.title ILIKE :search', { search: `%${search}%` })
           .orWhere('author.lastname ILIKE :search', { search: `%${search}%` });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Edition | null> {
    return this.editionRepository.findOne({
      where: { id_edition: id },
      relations: [
        'book',
        'book.genre',
        'book.category',
        'book.bookAuthors',
        'book.bookAuthors.author',
        'publisher',
        'copybooks'
      ]
    });
  }
}