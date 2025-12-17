import { Cabinet } from '../orm/entities/cabinet/Cabinet';

export class CabinetResponseDTO {
  id: number;
  name: string;
  description: string | null;

  constructor(cabinet: Cabinet) {
    this.id = cabinet.id_cabinet;
    this.name = cabinet.name;
    this.description = cabinet.description || null;
  }
}