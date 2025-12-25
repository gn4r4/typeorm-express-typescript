import { getRepository, In } from 'typeorm';
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

  async create(data: Partial<Lending> & { id_copybook?: number[] }): Promise<Lending> {
    const { id_copybook: copybookIds, ...lendingData } = data;

    const lending = this.lendingRepository.create(lendingData);
    const savedLending = await this.lendingRepository.save(lending);

    if (copybookIds && copybookIds.length > 0) {
      const links = copybookIds.map(copybookId => 
        this.lendingCopybookRepository.create({ 
            lending: { id_lending: savedLending.id_lending } as any,
            copybook: { id_copybook: copybookId } as any,
            status: 'borrowed' // Встановлюємо початковий статус
        })
      );
      await this.lendingCopybookRepository.save(links);
    }

    return this.findOne(savedLending.id_lending) as Promise<Lending>;
  }

  async update(id: number, data: Partial<Lending> & { id_copybook?: number[] }): Promise<Lending | null> {
    const { id_copybook: activeCopybookIds, ...lendingData } = data;

    await this.lendingRepository.update(id, lendingData);

    if (activeCopybookIds) {
      const existingLinks = await this.lendingCopybookRepository.find({
        where: { id_lending: id }
      });

      for (const link of existingLinks) {
        if (activeCopybookIds.includes(link.id_copybook)) {
          if (link.datereturn_actual !== null) {
            await this.lendingCopybookRepository.update(
              { id_lending: id, id_copybook: link.id_copybook },
              { datereturn_actual: null, status: 'borrowed' }
            );
          }
        } else {
          if (link.datereturn_actual === null) {
            await this.lendingCopybookRepository.update(
              { id_lending: id, id_copybook: link.id_copybook },
              { datereturn_actual: new Date(), status: 'returned' }
            );
          }
        }
      }

      const existingIds = existingLinks.map(l => l.id_copybook);
      const newIds = activeCopybookIds.filter(id => !existingIds.includes(id));

      if (newIds.length > 0) {
        const newLinks = newIds.map(copybookId => 
          this.lendingCopybookRepository.create({ 
            id_lending: id, 
            id_copybook: copybookId,
            status: 'borrowed',
            datereturn_actual: null
          })
        );
        await this.lendingCopybookRepository.save(newLinks);
      }
    }

    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.lendingCopybookRepository.delete({ id_lending: id });
    await this.lendingRepository.delete(id);
  }
}