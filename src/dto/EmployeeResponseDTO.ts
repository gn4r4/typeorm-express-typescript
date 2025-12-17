import { Employee } from '../orm/entities/employee/Employee';
import { PositionResponseDTO } from './PositionResponseDTO';

export class EmployeeResponseDTO {
  id: number;
  fullName: string;
  lastname: string;
  firstname: string;
  patronymic: string | null;
  contact: string;
  address: string;
  position: PositionResponseDTO | null;

  constructor(employee: Employee) {
    this.id = employee.id_employee;
    this.lastname = employee.lastname;
    this.firstname = employee.firstname;
    this.patronymic = employee.patronymic || null;
    this.contact = employee.contact;
    this.address = employee.address;
    
    this.fullName = `${employee.lastname} ${employee.firstname} ${employee.patronymic || ''}`.trim();
    
    this.position = employee.position ? new PositionResponseDTO(employee.position) : null;
  }
}