import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Classroom } from '../../classrooms/entities/classroom.entity';

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

  @Column({ type: 'simple-array', nullable: true })
  subjects: string[];

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true })
  photo: string;

  @OneToMany(() => Classroom, (classroom) => classroom.teacher)
  classrooms: Classroom[];
}
