import { getRepository } from 'typeorm';
import { Position } from '../orm/entities/position/Position';

export class PositionService {

  private get positionRepository() {
    return getRepository(Position);
  }

  private relations = ['employees'];

  async findAll(): Promise<Position[]> {
    return this.positionRepository.find({ relations: this.relations });
  }

  async findOne(id: number): Promise<Position | null> {
    return this.positionRepository.findOne({
      where: { id_position: id },
      relations: this.relations,
    });
  }

  async create(data: Partial<Position>): Promise<Position> {
    const position = this.positionRepository.create(data);
    return this.positionRepository.save(position);
  }

  async update(id: number, data: Partial<Position>): Promise<Position | null> {
    const position = await this.findOne(id);
    if (!position) return null;
    this.positionRepository.merge(position, data);
    return this.positionRepository.save(position);
  }

  async delete(id: number): Promise<void> {
    await this.positionRepository.delete(id);
  }
}