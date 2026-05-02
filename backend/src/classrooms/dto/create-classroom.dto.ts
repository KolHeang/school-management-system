import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateClassroomDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  grade: string;

  @IsNumber()
  @IsOptional()
  teacherId?: number;
}
