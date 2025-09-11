import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

// PartialType makes all the fields optional
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    description: 'Updated name of the user',
    example: 'Alice Johnson',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Updated age of the user (18–100)',
    example: 30,
    minimum: 18,
    maximum: 100,
  })
  age?: number;
}
