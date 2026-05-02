import { Controller, Get } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('students')
  getStudentStats() {
    return this.reportsService.getStudentStats();
  }

  @Get('teachers')
  getTeacherStats() {
    return this.reportsService.getTeacherStats();
  }
}
