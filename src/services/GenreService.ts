import { getRepository } from 'typeorm';
import { Genre } from '../orm/entities/genre/Genre';

export class GenreService {
  private genreRepository = getRepository(Genre);

  async findAll(): Promise<Genre[]> {
    return this.genreRepository.find({ relations: ['books'] });
  }

  async findOne(id: number): Promise<Genre | null> {
    return this.genreRepository.findOne({
      where: { id_genre: id },
      relations: ['books'],
    });
  }

  async create(data: Partial<Genre>): Promise<Genre> {
    const genre = this.genreRepository.create(data);
    return this.genreRepository.save(genre);
  }

  async update(id: number, data: Partial<Genre>): Promise<Genre | null> {
    const genre = await this.findOne(id);
    if (!genre) return null;
    this.genreRepository.merge(genre, data);
    return this.genreRepository.save(genre);
  }

  async delete(id: number): Promise<void> {
    await this.genreRepository.delete(id);
  }
}