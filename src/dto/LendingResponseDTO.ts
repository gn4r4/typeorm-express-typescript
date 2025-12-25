import { Lending } from '../orm/entities/lending/Lending';
import { ReaderResponseDTO } from './ReaderResponseDTO';
import { EmployeeResponseDTO } from './EmployeeResponseDTO';
import { CopybookResponseDTO } from './CopybookResponseDTO';

export class LendingResponseDTO {
  id: number;
  dateLending: Date;
  dateReturnPlanned: Date | null;
  dateReturn: Date | null;
  reader: ReaderResponseDTO | null;
  employee: EmployeeResponseDTO | null;
  // Змінюємо тип масиву, оскільки ми додаємо нове поле
  copybooks: (CopybookResponseDTO & { dateReturnActual: Date | null })[];  

  constructor(lending: Lending) {
    this.id = lending.id_lending;
    this.dateLending = lending.datelending;
    this.dateReturnPlanned = lending.datereturn_planned || null;
    this.dateReturn = lending.datereturn || null;

    this.reader = lending.reader ? new ReaderResponseDTO(lending.reader) : null;
    this.employee = lending.employee ? new EmployeeResponseDTO(lending.employee) : null;

    if (lending.lendingCopybooks && lending.lendingCopybooks.length > 0) {
      this.copybooks = lending.lendingCopybooks.map(lc => ({
        ...new CopybookResponseDTO(lc.copybook),
        dateReturnActual: lc.datereturn_actual || null
      }));
    } 
    else {
      this.copybooks = [];
    }
  }
}