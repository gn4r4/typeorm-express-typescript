import { getRepository, getConnection } from 'typeorm';
import { Reader } from '../orm/entities/reader/Reader';
import { User } from '../orm/entities/users/User';
import { Role } from '../orm/entities/users/types';

export class ReaderService {

  private get readerRepository() {
    return getRepository(Reader);
  }

  private get userRepository() {
    return getRepository(User);
  }

  private relations = ['lendings', 'user'];

  async findAll(): Promise<Reader[]> {
    return this.readerRepository.find({
      relations: this.relations,
    });
  }

  async findOne(id: number): Promise<Reader | null> {
    return this.readerRepository.findOne({
      where: { id_reader: id },
      relations: this.relations,
    });
  }

  async create(data: Partial<Reader>, userId?: number): Promise<Reader> {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const newReader = this.readerRepository.create({
        ...data,
        id_user: userId || null 
      });
      
      const savedReader = await queryRunner.manager.save(Reader, newReader);

      if (userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (user && user.role !== 'ADMINISTRATOR' && user.role !== 'LIBRARIAN') {
          user.role = 'READER' as Role;
          await queryRunner.manager.save(User, user);
        }
      }

      await queryRunner.commitTransaction();
      
      return await this.findOne(savedReader.id_reader) as Reader;

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, data: Partial<Reader>): Promise<Reader | null> {
    await this.readerRepository.update(id, data);
    
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.readerRepository.delete(id);
  }

  async countAll(): Promise<number> {
    return this.readerRepository.count();
  }
}