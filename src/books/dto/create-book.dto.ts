import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsNumber()
  publishedYear: number;

  @IsOptional() // for optional fields
  @IsString()
  genre?: string;
}
