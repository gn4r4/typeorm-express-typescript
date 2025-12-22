import { CopybookLocation } from './../orm/entities/copybook_location/CopybookLocation';
import { ShelfResponseDTO } from './ShelfResponseDTO';
import { CopybookResponseDTO } from './CopybookResponseDTO';

export class LocationResponseDTO {
  id: number;
  shelf: ShelfResponseDTO | null;
  copybook: CopybookResponseDTO | null;

  constructor(location: CopybookLocation) {
    this.id = location.id_location;
    this.shelf = location.shelf ? new ShelfResponseDTO(location.shelf) : null;
    
    // Перевіряємо, чи є прив'язана книга
    this.copybook = location.copybook ? new CopybookResponseDTO(location.copybook) : null;
  }
}