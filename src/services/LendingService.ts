import { getRepository } from 'typeorm';
import { Lending } from '../orm/entities/lending/Lending';
import { LendingCopybook } from '../orm/entities/lending_copybook/LendingCopybook';

export class LendingService {

  private get lendingRepository() {
    return getRepository(Lending);
  }

  private get lendingCopybookRepository() {
    return getRepository(LendingCopybook);
  }

  private relations = [
    'reader', 
    'employee', 
    'lendingCopybooks', 
    'lendingCopybooks.copybook', 
    'lendingCopybooks.copybook.edition',
    'lendingCopybooks.copybook.edition.book'
  ];

  async findAll(): Promise<Lending[]> {
    return this.lendingRepository.find({ relations: this.relations });
  }

  async findOne(id: number): Promise<Lending | null> {
    return this.lendingRepository.findOne({
      where: { id_lending: id },
      relations: this.relations,
    });
  }

  async create(data: Partial<Lending> & { copybookIds?: number[] }): Promise<Lending> {
    const { copybookIds, ...lendingData } = data;

    const lending = this.lendingRepository.create(lendingData);
    const savedLending = await this.lendingRepository.save(lending);

    if (copybookIds && copybookIds.length > 0) {
      const links = copybookIds.map(copybookId => 
        this.lendingCopybookRepository.create({ id_lending: savedLending.id_lending, id_copybook: copybookId })
      );
      await this.lendingCopybookRepository.save(links);
    }

    return this.findOne(savedLending.id_lending) as Promise<Lending>;
  }

  async update(id: number, data: Partial<Lending> & { copybookIds?: number[] }): Promise<Lending | null> {
    const { copybookIds, ...lendingData } = data;

    await this.lendingRepository.update(id, lendingData);

    if (copybookIds) {
      await this.lendingCopybookRepository.delete({ id_lending: id });
      
      if (copybookIds.length > 0) {
        const links = copybookIds.map(copybookId => 
            this.lendingCopybookRepository.create({ id_lending: id, id_copybook: copybookId })
        );
        await this.lendingCopybookRepository.save(links);
      }
    }

    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.lendingCopybookRepository.delete({ id_lending: id });
    await this.lendingRepository.delete(id);
  }
}