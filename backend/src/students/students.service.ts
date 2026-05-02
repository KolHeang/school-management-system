import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const { classroomId, province, district, commune, village, ...data } = createStudentDto;
    const student = this.studentsRepository.create({
      ...data,
      classroom: classroomId ? { id: classroomId } : undefined,
      province: province ? { id: province } : undefined,
      district: district ? { id: district } : undefined,
      commune: commune ? { id: commune } : undefined,
      village: village ? { id: village } : undefined,
    });
    return await this.studentsRepository.save(student);
  }

  async findAll(classroomId?: number) {
    const where = classroomId ? { classroom: { id: classroomId } } : {};
    return await this.studentsRepository.find({
      where,
      relations: ['classroom', 'province', 'district', 'commune', 'village'],
    });
  }

  async findOne(id: number) {
    const student = await this.studentsRepository.findOne({
      where: { id },
      relations: ['classroom', 'province', 'district', 'commune', 'village'],
    });
    if (!student) throw new NotFoundException(`Student with ID ${id} not found`);
    return student;
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    const student = await this.findOne(id);
    const { classroomId, province, district, commune, village, ...data } = updateStudentDto;
    
    const updated = this.studentsRepository.merge(student, {
      ...data,
      classroom: classroomId ? { id: classroomId } : student.classroom,
      province: province ? { id: province } : student.province,
      district: district ? { id: district } : student.district,
      commune: commune ? { id: commune } : student.commune,
      village: village ? { id: village } : student.village,
    });
    return await this.studentsRepository.save(updated);
  }

  async remove(id: number) {
    const student = await this.findOne(id);
    return await this.studentsRepository.remove(student);
  }
}
