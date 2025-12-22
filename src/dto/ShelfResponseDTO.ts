import { Shelf } from '../orm/entities/shelf/Shelf';
import { CabinetResponseDTO } from './CabinetResponseDTO';

export class ShelfResponseDTO {
  id: number;
  shelfcode: string;
  cabinet: CabinetResponseDTO | null;

  constructor(shelf: Shelf) {
    this.id = shelf.id_shelf;
    this.shelfcode = shelf.shelfcode;
    
    this.cabinet = shelf.cabinet ? new CabinetResponseDTO(shelf.cabinet) : null;
  }
}