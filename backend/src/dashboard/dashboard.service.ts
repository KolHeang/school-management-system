import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Classroom } from '../classrooms/entities/classroom.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
    @InjectRepository(Teacher)
    private teachersRepository: Repository<Teacher>,
    @InjectRepository(Classroom)
    private classroomsRepository: Repository<Classroom>,
  ) {}

  async getStats() {
    const [students, teachers, classrooms] = await Promise.all([
      this.studentsRepository.count(),
      this.teachersRepository.count(),
      this.classroomsRepository.count(),
    ]);

    return {
      totalStudents: students,
      totalTeachers: teachers,
      totalClassrooms: classrooms,
    };
  }
}
