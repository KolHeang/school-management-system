import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Classroom } from '../classrooms/entities/classroom.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
    @InjectRepository(Classroom)
    private classroomRepository: Repository<Classroom>,
  ) {}

  async getStudentStats() {
    const totalStudents = await this.studentRepository.count();
    const maleStudents = await this.studentRepository.count({ where: { gender: 'Male' } });
    const femaleStudents = await this.studentRepository.count({ where: { gender: 'Female' } });

    const studentsByClass = await this.classroomRepository.find({
      relations: ['students'],
    });

    const classStats = studentsByClass.map(c => ({
      className: c.name,
      grade: c.grade,
      count: c.students.length,
    }));

    return {
      total: totalStudents,
      male: maleStudents,
      female: femaleStudents,
      byClass: classStats,
    };
  }

  async getTeacherStats() {
    const totalTeachers = await this.teacherRepository.count();
    const teachersWithClasses = await this.teacherRepository.find({
      relations: ['classrooms', 'subjects'],
    });

    const workload = teachersWithClasses.map(t => ({
      name: t.full_name_en,
      classesCount: t.classrooms.length,
      subjectsCount: t.subjects?.length || 0,
    }));

    return {
      total: totalTeachers,
      workload,
    };
  }
}
