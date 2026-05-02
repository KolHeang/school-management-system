import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Teacher } from './entities/teacher.entity';
import { Subject } from '../subjects/entities/subject.entity';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private teachersRepository: Repository<Teacher>,
    @InjectRepository(Subject)
    private subjectsRepository: Repository<Subject>,
  ) {}

  async create(createTeacherDto: CreateTeacherDto) {
    const { subjectIds, ...rest } = createTeacherDto;
    const teacher = this.teachersRepository.create(rest);

    if (subjectIds && subjectIds.length > 0) {
      const subjects = await this.subjectsRepository.find({
        where: { id: In(subjectIds) },
      });
      teacher.subjects = subjects;
    }

    return await this.teachersRepository.save(teacher);
  }

  async findAll() {
    return await this.teachersRepository.find({
      relations: ['subjects'],
    });
  }

  async findOne(id: number) {
    const teacher = await this.teachersRepository.findOne({
      where: { id },
      relations: ['classrooms', 'subjects'],
    });
    if (!teacher) throw new NotFoundException(`Teacher with ID ${id} not found`);
    return teacher;
  }

  async update(id: number, updateTeacherDto: UpdateTeacherDto) {
    const teacher = await this.findOne(id);
    const { subjectIds, ...rest } = updateTeacherDto;
    
    const updated = this.teachersRepository.merge(teacher, rest);

    if (subjectIds !== undefined) {
      const subjects = await this.subjectsRepository.find({
        where: { id: In(subjectIds) },
      });
      updated.subjects = subjects;
    }

    return await this.teachersRepository.save(updated);
  }

  async remove(id: number) {
    const teacher = await this.findOne(id);
    return await this.teachersRepository.remove(teacher);
  }
}

