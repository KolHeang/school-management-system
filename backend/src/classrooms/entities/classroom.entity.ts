import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Teacher } from '../../teachers/entities/teacher.entity';
import { Student } from '../../students/entities/student.entity';

@Entity()
export class Classroom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  grade: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.classrooms)
  teacher: Teacher;

  @OneToMany(() => Student, (student) => student.classroom)
  students: Student[];
}
