import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  name_en: string;

  @IsString()
  @IsNotEmpty()
  name_kh: string;

  @IsString()
  @IsOptional()
  description?: string;
}
