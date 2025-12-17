import { Copybook } from '../orm/entities/copybook/Copybook';
import { EditionResponseDTO } from './EditionResponseDTO';
import { ShelfResponseDTO } from './ShelfResponseDTO';

export class CopybookResponseDTO {
  id: number;
  status: string;
  edition: EditionResponseDTO | null;
  location: ShelfResponseDTO | null; // Поточне місцезнаходження

  constructor(copybook: Copybook) {
    this.id = copybook.id_copybook;
    this.status = copybook.status;
    
    this.edition = copybook.edition ? new EditionResponseDTO(copybook.edition) : null;

    // Логіка визначення полиці: беремо першу знайдену локацію зі списку (або останню додану, залежить від сортування)
    // Оскільки CopybookLocation зв'язує книгу з полицею
    if (copybook.locations && copybook.locations.length > 0) {
      // Припускаємо, що нас цікавить актуальна полиця. 
      // Якщо у location є shelf, повертаємо її DTO
      const loc = copybook.locations[0]; 
      this.location = loc.shelf ? new ShelfResponseDTO(loc.shelf) : null;
    } else {
      this.location = null;
    }
  }
}