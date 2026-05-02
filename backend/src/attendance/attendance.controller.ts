import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  @Get()
  findAll() {
    return this.attendanceService.findAll();
  }

  @Get('filter')
  filter(@Query('classroomId') classroomId: string, @Query('date') date: string) {
    return this.attendanceService.findByClassAndDate(+classroomId, date);
  }

  @Get('class/:id/:date')
  findByClass(@Param('id') id: string, @Param('date') date: string) {
    return this.attendanceService.findByClassAndDate(+id, date);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttendanceDto: UpdateAttendanceDto) {
    return this.attendanceService.update(+id, updateAttendanceDto);
  }

  @Get('report')
  getReport(
    @Query('classroomId') classroomId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.attendanceService.getReport(+classroomId, startDate, endDate);
  }
}
