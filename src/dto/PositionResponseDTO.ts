import { Position } from '../orm/entities/position/Position';

export class PositionResponseDTO {
  id: number;
  name: string;

  constructor(position: Position) {
    this.id = position.id_position;
    this.name = position.name;
  }
}