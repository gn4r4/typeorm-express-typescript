import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Reader } from '../reader/Reader';
import { Employee } from '../employee/Employee';
import { LendingCopybook } from '../lending_copybook/LendingCopybook';

@Entity('lending')
export class Lending {
  @PrimaryGeneratedColumn({ name: 'id_lending' })
  id_lending: number;

  @Column()
  id_reader: number;

  @ManyToOne(() => Reader, (reader) => reader.lendings)
  @JoinColumn({ name: 'id_reader' })
  reader: Reader;

  @Column()
  id_employee: number;

  @ManyToOne(() => Employee, (employee) => employee.lendings)
  @JoinColumn({ name: 'id_employee' })
  employee: Employee;

  @Column({ type: 'date' })
  datelending: Date;

  @Column({ type: 'date', nullable: true })
  datereturn: Date;

  @OneToMany(() => LendingCopybook, (lendingCopybook) => lendingCopybook.lending)
  lendingCopybooks: LendingCopybook[];
}