// src/tasks/dto/query-task.dto.ts
import { IsOptional, IsBooleanString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryTaskDto {
  @IsOptional()
  @IsBooleanString()
  completed?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  take?: number = 10;
}
