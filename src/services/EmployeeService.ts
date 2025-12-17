import { getRepository } from 'typeorm';
import { Employee } from '../orm/entities/employee/Employee';

export class EmployeeService {

  private get employeeRepository() {
    return getRepository(Employee);
  }

  private relations = ['position', 'lendings'];

  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.find({ relations: this.relations });
  }

  async findOne(id: number): Promise<Employee | null> {
    return this.employeeRepository.findOne({
      where: { id_employee: id },
      relations: this.relations,
    });
  }

  async create(data: Partial<Employee>): Promise<Employee> {
    const employee = this.employeeRepository.create(data);
    return this.employeeRepository.save(employee);
  }

  async update(id: number, data: Partial<Employee>): Promise<Employee | null> {
    const employee = await this.findOne(id);
    if (!employee) return null;
    this.employeeRepository.merge(employee, data);
    return this.employeeRepository.save(employee);
  }

  async delete(id: number): Promise<void> {
    await this.employeeRepository.delete(id);
  }
}