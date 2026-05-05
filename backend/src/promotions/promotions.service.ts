import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PromoteStudentsDto } from './dto/promote-students.dto';
import { PromotionHistory } from './entities/promotion-history.entity';
import { Student } from '../students/entities/student.entity';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(PromotionHistory)
    private promotionHistoryRepository: Repository<PromotionHistory>,
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
  ) {}

  async promote(promoteStudentsDto: PromoteStudentsDto) {
    const { studentIds, classroomId } = promoteStudentsDto;
    
    // 1. Fetch current students with their current classrooms
    const students = await this.studentsRepository.find({
      where: studentIds.map(id => ({ id })),
      relations: ['classroom']
    });

    // 2. Create history records
    const historyRecords = students.map(student => ({
      student: { id: student.id },
      fromClassroom: student.classroom ? { id: student.classroom.id } : null,
      toClassroom: { id: classroomId },
      academicYear: new Date().getFullYear().toString(),
    }));

    // 3. Update students' classrooms
    const studentsToUpdate = studentIds.map(id => ({
      id,
      classroom: { id: classroomId }
    }));

    await this.studentsRepository.save(studentsToUpdate);
    
    // 4. Save history
    return await this.promotionHistoryRepository.save(historyRecords);
  }

  async findAllPromotions() {
    return await this.promotionHistoryRepository.find({
      relations: ['student', 'fromClassroom', 'toClassroom'],
      order: { promotionDate: 'DESC' }
    });
  }
}
