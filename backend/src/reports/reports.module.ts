import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Classroom } from '../classrooms/entities/classroom.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Teacher, Classroom])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
