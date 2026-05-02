import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Classroom } from '../../classrooms/entities/classroom.entity';
import { Subject } from '../../subjects/entities/subject.entity';

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  full_name_en: string;

  @Column({ type: 'varchar', nullable: true })
  full_name_kh: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true })
  photo: string;

  @OneToMany(() => Classroom, (classroom) => classroom.teacher)
  classrooms: Classroom[];

  @ManyToMany(() => Subject, subject => subject.teachers)
  @JoinTable({
    name: 'teacher_subjects',
    joinColumn: { name: 'teacher_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'subject_id', referencedColumnName: 'id' }
  })
  subjects: Subject[];
}
