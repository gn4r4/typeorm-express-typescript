import { Genre } from '../orm/entities/genre/Genre';

export class GenreResponseDTO {
  id: number;
  name: string;

  constructor(genre: Genre) {
    this.id = genre.id_genre;
    this.name = genre.name;
  }
}