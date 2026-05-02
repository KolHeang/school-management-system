import { IsNumber, IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { AttendanceStatus } from '../entities/attendance.entity';

export class CreateAttendanceDto {
  @IsNumber()
  studentId: number;

  @IsDateString()
  date: string;

  @IsEnum(AttendanceStatus)
  morning_status: AttendanceStatus;

  @IsEnum(AttendanceStatus)
  afternoon_status: AttendanceStatus;

  @IsString()
  @IsOptional()
  remarks?: string;
}
