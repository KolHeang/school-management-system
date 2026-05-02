import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Classroom } from '../../classrooms/entities/classroom.entity';
import { Attendance } from '../../attendance/entities/attendance.entity';
import { Province } from '../../address/entities/province.entity';
import { District } from '../../address/entities/district.entity';
import { Commune } from '../../address/entities/commune.entity';
import { Village } from '../../address/entities/village.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  student_code: string;

  @Column({ nullable: true })
  full_name_en: string;

  @Column({ nullable: true })
  full_name_kh: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  dob: string;

  @ManyToOne(() => Province, { nullable: true })
  province: Province;

  @ManyToOne(() => District, { nullable: true })
  district: District;

  @ManyToOne(() => Commune, { nullable: true })
  commune: Commune;

  @ManyToOne(() => Village, { nullable: true })
  village: Village;

  @Column({ nullable: true })
  photo: string;

  @ManyToOne(() => Classroom, (classroom) => classroom.students)
  classroom: Classroom;

  @OneToMany(() => Attendance, (attendance) => attendance.student)
  attendances: Attendance[];
}
