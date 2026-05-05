import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Classroom } from '../../classrooms/entities/classroom.entity';

@Entity()
export class PromotionHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  student: Student;

  @ManyToOne(() => Classroom, { nullable: true })
  fromClassroom: Classroom | null;

  @ManyToOne(() => Classroom)
  toClassroom: Classroom;

  @Column({ nullable: true })
  academicYear: string;

  @CreateDateColumn()
  promotionDate: Date;
}
