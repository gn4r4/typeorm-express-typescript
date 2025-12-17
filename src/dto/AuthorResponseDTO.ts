import { Author } from '../orm/entities/author/Author';

export class AuthorResponseDTO {
  id: number;
  fullName: string; // Можемо об'єднати ім'я для зручності, або залишити окремо
  lastname: string;
  firstname: string;
  patronymic: string;
  dateofbirth: Date | null;

  constructor(author: Author) {
    this.id = author.id_author;
    this.lastname = author.lastname;
    this.firstname = author.firstname;
    this.patronymic = author.patronymic;
    this.dateofbirth = author.dateofbirth ? author.dateofbirth : null;
    
    // Приклад computed property (обчислюваного поля)
    this.fullName = `${author.lastname} ${author.firstname} ${author.patronymic || ''}`.trim();
  }
}