import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({ description: 'Title of the note', example: 'Shopping list' })
  @IsString()
  @IsNotEmpty({ message: 'Title must not be empty' })
  title: string;

  @ApiProperty({
    description: 'Content of the note',
    example: 'Buy milk, eggs, bread',
  })
  @IsString()
  @IsNotEmpty({ message: 'Content must not be empty' })
  content: string;
}
