import { Shelf } from '../orm/entities/shelf/Shelf';
import { CabinetResponseDTO } from './CabinetResponseDTO';

export class ShelfResponseDTO {
  id: number;
  code: string;
  cabinet: CabinetResponseDTO | null;

  constructor(shelf: Shelf) {
    this.id = shelf.id_shelf;
    this.code = shelf.shelfcode;
    
    this.cabinet = shelf.cabinet ? new CabinetResponseDTO(shelf.cabinet) : null;
  }
}