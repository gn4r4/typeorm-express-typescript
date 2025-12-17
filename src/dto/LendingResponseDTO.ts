import { Lending } from '../orm/entities/lending/Lending';
import { ReaderResponseDTO } from './ReaderResponseDTO';
import { EmployeeResponseDTO } from './EmployeeResponseDTO';
import { CopybookResponseDTO } from './CopybookResponseDTO';

export class LendingResponseDTO {
  id: number;
  dateLending: Date;
  dateReturn: Date | null;
  reader: ReaderResponseDTO | null;
  employee: EmployeeResponseDTO | null;
  items: CopybookResponseDTO[]; // Список конкретних книг, які взяли

  constructor(lending: Lending) {
    this.id = lending.id_lending;
    this.dateLending = lending.datelending;
    this.dateReturn = lending.datereturn || null;

    this.reader = lending.reader ? new ReaderResponseDTO(lending.reader) : null;
    this.employee = lending.employee ? new EmployeeResponseDTO(lending.employee) : null;

    // Мапінг зв'язку many-to-many через проміжну таблицю LendingCopybook
    if (lending.lendingCopybooks && lending.lendingCopybooks.length > 0) {
      this.items = lending.lendingCopybooks.map(lc => new CopybookResponseDTO(lc.copybook));
    } else {
      this.items = [];
    }
  }
}