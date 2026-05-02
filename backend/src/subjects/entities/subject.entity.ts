import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Teacher } from '../../teachers/entities/teacher.entity';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  code: string;

  @Column({ type: 'varchar' })
  name_en: string;

  @Column({ type: 'varchar' })
  name_kh: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToMany(() => Teacher, teacher => teacher.subjects)
  teachers: Teacher[];
}
