import { IsString, IsOptional } from 'class-validator';

export class UpdateBookDto {
  @IsString()
  @IsOptional()
  title?: string; //  updatable

  @IsString()
  @IsOptional()
  genre?: string; //  updatable
}
