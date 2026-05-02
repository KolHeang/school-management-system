import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Teacher } from './entities/teacher.entity';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private teachersRepository: Repository<Teacher>,
  ) {}

  async create(createTeacherDto: CreateTeacherDto) {
    const teacher = this.teachersRepository.create(createTeacherDto);
    return await this.teachersRepository.save(teacher);
  }

  async findAll() {
    return await this.teachersRepository.find();
  }

  async findOne(id: number) {
    const teacher = await this.teachersRepository.findOne({
      where: { id },
      relations: ['classrooms'],
    });
    if (!teacher) throw new NotFoundException(`Teacher with ID ${id} not found`);
    return teacher;
  }

  async update(id: number, updateTeacherDto: UpdateTeacherDto) {
    const teacher = await this.findOne(id);
    const updated = this.teachersRepository.merge(teacher, updateTeacherDto);
    return await this.teachersRepository.save(updated);
  }

  async remove(id: number) {
    const teacher = await this.findOne(id);
    return await this.teachersRepository.remove(teacher);
  }
}
