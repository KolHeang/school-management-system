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

  async findByClassAndDate(classroomId: number | undefined, date: string) {
    const where: any = { date };
    if (classroomId) {
      where.student = {
        classroom: { id: classroomId },
      };
    }
    
    return await this.attendanceRepository.find({
      where,
      relations: ['student'],
    });
  }

  async update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
    const attendance = await this.attendanceRepository.findOne({ where: { id } });
    if (!attendance) throw new NotFoundException(`Attendance record ${id} not found`);
    
    const updated = this.attendanceRepository.merge(attendance, updateAttendanceDto);
    return await this.attendanceRepository.save(updated);
  }

  async getReport(classroomId: number, startDate: string, endDate: string) {
    const records = await this.attendanceRepository.find({
      where: {
        student: {
          classroom: { id: classroomId },
        },
      },
      relations: ['student'],
    });

    // Filter by date range manually if needed or use Between from typeorm
    // For simplicity with sqlite strings:
    const filteredRecords = records.filter(r => r.date >= startDate && r.date <= endDate);

    const report: any = {};

    filteredRecords.forEach(record => {
      const studentId = record.student.id;
      if (!report[studentId]) {
        report[studentId] = {
          student: record.student,
          present: 0,
          absent: 0,
          late: 0,
          excused: 0,
          total: 0
        };
      }

      const statuses = [record.morning_status, record.afternoon_status];
      statuses.forEach(status => {
        if (status === 'present') report[studentId].present++;
        else if (status === 'absent') report[studentId].absent++;
        else if (status === 'late') report[studentId].late++;
        else if (status === 'excused') report[studentId].excused++;
      });
      report[studentId].total += 2; // Two sessions per day
    });

    return Object.values(report);
  }
}
