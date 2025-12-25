import { Column } from 'typeorm';

/**
 * Abstract base class for Person entities (Employee, Reader)
 * Provides common fields for person data
 * NOTE: This is not a database table, just a base class for inheritance
 */
export abstract class Person {
  @Column({ length: 50 })
  lastname: string;

  @Column({ length: 50 })
  firstname: string;

  @Column({ length: 50, nullable: true })
  patronymic: string;

  @Column({ length: 50 })
  contact: string;

  @Column({ length: 255 })
  address: string;
}
