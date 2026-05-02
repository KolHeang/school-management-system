import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Attendance } from './entities/attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto) {
    const { studentId, ...data } = createAttendanceDto;
    const attendance = this.attendanceRepository.create({
      ...data,
      student: { id: studentId },
    });
    return await this.attendanceRepository.save(attendance);
  }

  async findAll() {
    return await this.attendanceRepository.find({
      relations: ['student'],
    });
  }

  async findByClassAndDate(classroomId: number, date: string) {
    return await this.attendanceRepository.find({
      where: {
        date,
        student: {
          classroom: { id: classroomId },
        },
      },
      relations: ['student'],
    });
  }

  async update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
    const attendance = await this.attendanceRepository.findOne({ where: { id } });
    if (!attendance) throw new NotFoundException(`Attendance record ${id} not found`);
    
    const updated = this.attendanceRepository.merge(attendance, updateAttendanceDto);
    return await this.attendanceRepository.save(updated);
  }
}
