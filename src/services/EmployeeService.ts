import { getRepository, getConnection } from 'typeorm';
import { Employee } from '../orm/entities/employee/Employee';
import { User } from '../orm/entities/users/User';
import { Role } from '../orm/entities/users/types';

export class EmployeeService {

  private get employeeRepository() {
    return getRepository(Employee);
  }

  private get userRepository() {
    return getRepository(User);
  }

  private relations = ['position', 'lendings', 'user'];

  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.find({ relations: this.relations });
  }

  async findOne(id: number): Promise<Employee | null> {
    return this.employeeRepository.findOne({
      where: { id_employee: id },
      relations: this.relations,
    });
  }

  async create(data: Partial<Employee>, userId?: number): Promise<Employee> {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const employee = this.employeeRepository.create({
          ...data,
          id_user: userId || null
      });
      
      const savedEmployee = await queryRunner.manager.save(Employee, employee);

      if (userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (user) {
            if (user.role !== 'ADMINISTRATOR') {
                user.role = 'LIBRARIAN' as Role;
                await queryRunner.manager.save(User, user);
            }
        }
      }

      await queryRunner.commitTransaction();
      
      return this.employeeRepository.findOne({
          where: { id_employee: savedEmployee.id_employee },
          relations: this.relations
      }) as Promise<Employee>;

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, data: Partial<Employee>): Promise<Employee | null> {
    await this.employeeRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.employeeRepository.delete(id);
  }
}