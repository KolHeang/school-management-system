import { IsString, IsEmail, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateTeacherDto {
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

  @IsArray()
  @IsString({ each: true })
  subjects: string[];

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  photo?: string;
}
