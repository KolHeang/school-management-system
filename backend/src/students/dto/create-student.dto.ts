import { IsString, IsEmail, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  student_code: string;

  @IsString()
  @IsNotEmpty()
  full_name_en: string;

  @IsString()
  @IsNotEmpty()
  full_name_kh: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  gender: string;

  @IsString()
  dob: string;

  @IsNumber()
  @IsOptional()
  classroomId?: number;

  @IsNumber()
  @IsOptional()
  province?: number;

  @IsNumber()
  @IsOptional()
  district?: number;

  @IsNumber()
  @IsOptional()
  commune?: number;

  @IsNumber()
  @IsOptional()
  village?: number;

  @IsString()
  @IsOptional()
  photo?: string;
}
