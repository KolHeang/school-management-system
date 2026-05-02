import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './entities/subject.entity';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private subjectsRepository: Repository<Subject>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto) {
    const subject = this.subjectsRepository.create(createSubjectDto);
    return await this.subjectsRepository.save(subject);
  }

  async findAll() {
    return await this.subjectsRepository.find();
  }

  async findOne(id: number) {
    const subject = await this.subjectsRepository.findOne({
      where: { id },
      relations: ['teachers'],
    });
    if (!subject) throw new NotFoundException(`Subject with ID ${id} not found`);
    return subject;
  }

  async update(id: number, updateSubjectDto: UpdateSubjectDto) {
    const subject = await this.findOne(id);
    const updated = this.subjectsRepository.merge(subject, updateSubjectDto);
    return await this.subjectsRepository.save(updated);
  }

  async remove(id: number) {
    const subject = await this.findOne(id);
    return await this.subjectsRepository.remove(subject);
  }
}
