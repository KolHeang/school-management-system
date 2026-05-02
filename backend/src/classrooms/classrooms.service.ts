import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { Classroom } from './entities/classroom.entity';

@Injectable()
export class ClassroomsService {
  constructor(
    @InjectRepository(Classroom)
    private classroomsRepository: Repository<Classroom>,
  ) {}

  async create(createClassroomDto: CreateClassroomDto) {
    const { teacherId, ...data } = createClassroomDto;
    const classroom = this.classroomsRepository.create({
      ...data,
      teacher: teacherId ? { id: teacherId } : undefined,
    });
    return await this.classroomsRepository.save(classroom);
  }

  async findAll() {
    return await this.classroomsRepository.find({
      relations: ['teacher', 'students'],
    });
  }

  async findOne(id: number) {
    const classroom = await this.classroomsRepository.findOne({
      where: { id },
      relations: ['teacher', 'students'],
    });
    if (!classroom) throw new NotFoundException(`Classroom with ID ${id} not found`);
    return classroom;
  }

  async update(id: number, updateClassroomDto: UpdateClassroomDto) {
    const classroom = await this.findOne(id);
    const { teacherId, ...data } = updateClassroomDto;
    
    const updated = this.classroomsRepository.merge(classroom, {
      ...data,
      teacher: teacherId ? { id: teacherId } : classroom.teacher,
    });
    return await this.classroomsRepository.save(updated);
  }

  async remove(id: number) {
    const classroom = await this.findOne(id);
    return await this.classroomsRepository.remove(classroom);
  }
}
