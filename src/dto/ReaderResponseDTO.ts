import { Reader } from '../orm/entities/reader/Reader';

export class ReaderResponseDTO {
  id: number;
  fullName: string;
  lastname: string;
  firstname: string;
  patronymic: string | null;
  contact: string;
  address: string;

  constructor(reader: Reader) {
    this.id = reader.id_reader;
    this.lastname = reader.lastname;
    this.firstname = reader.firstname;
    this.patronymic = reader.patronymic || null;
    this.contact = reader.contact;
    this.address = reader.address;

    this.fullName = `${reader.lastname} ${reader.firstname} ${reader.patronymic || ''}`.trim();
  }
}