import { Copybook } from '../orm/entities/copybook/Copybook';
import { EditionResponseDTO } from './EditionResponseDTO';
import { ShelfResponseDTO } from './ShelfResponseDTO';

export class CopybookResponseDTO {
  id: number;
  status: string;
  edition: EditionResponseDTO | null;
  
  // ОНОВЛЕНО: Тепер тут живе об'єкт ShelfResponseDTO
  location: {
    id: number;              // ID самого місця (CopybookLocation ID)
    shelf: ShelfResponseDTO; // Вся інфо про полицю та шафу
  } | null;

  constructor(copybook: Copybook) {
    this.id = copybook.id_copybook;
    this.status = copybook.status;

    this.edition = copybook.edition ? new EditionResponseDTO(copybook.edition) : null;

    if (copybook.location && copybook.location.shelf) {
      this.location = {
        id: copybook.location.id_location,
        shelf: new ShelfResponseDTO(copybook.location.shelf)
      };
    } else {
      this.location = null;
    }
  }
}