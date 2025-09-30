import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Title of the task',
    example: 'Complete NestJS project',
  })
  @IsString()
  @IsNotEmpty({ message: 'Title must not be empty' })
  title: string;
}
