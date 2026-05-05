import { IsArray, IsNumber } from 'class-validator';

export class PromoteStudentsDto {
  @IsArray()
  @IsNumber({}, { each: true })
  studentIds: number[];

  @IsNumber()
  classroomId: number;
}
