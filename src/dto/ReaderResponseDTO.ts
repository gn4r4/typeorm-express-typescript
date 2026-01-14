import { Reader } from '../orm/entities/reader/Reader';
// Імпортуємо DTO юзера, щоб не передавати паролі і зайві дані
import { UserResponseDTO } from './UserResponseDTO'; 

export class ReaderResponseDTO {
  id: number;
  fullName: string;
  lastname: string;
  firstname: string;
  patronymic: string | null;
  contact: string;
  address: string;
  id_user?: number | null;
  
  user?: UserResponseDTO;

  constructor(reader: Reader) {
    this.id = reader.id_reader;
    this.lastname = reader.lastname;
    this.firstname = reader.firstname;
    this.patronymic = reader.patronymic || null;
    this.contact = reader.contact;
    this.address = reader.address;
    this.id_user = reader.id_user ?? null;

    this.fullName = `${reader.lastname} ${reader.firstname} ${reader.patronymic || ''}`.trim();

    if (reader.user) {
      this.user = new UserResponseDTO(reader.user);
    }
  }
}