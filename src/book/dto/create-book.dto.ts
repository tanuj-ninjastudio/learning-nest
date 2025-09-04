import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsNumber()
  year: number;

  @IsString()
  @IsNotEmpty()
  genre: string;
}
