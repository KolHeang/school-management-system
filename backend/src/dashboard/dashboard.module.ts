import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Classroom } from '../classrooms/entities/classroom.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Teacher, Classroom])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
