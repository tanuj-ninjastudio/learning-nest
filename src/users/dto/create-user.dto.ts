import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  Max,
  IsEmail,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty({ message: 'Name must not be empty' })
  name: string;

  @ApiProperty({
    description: 'Age of the user (must be between 18 and 100)',
    example: 25,
    minimum: 18,
    maximum: 100,
  })
  @IsInt({ message: 'Age must be a valid integer' })
  @Min(18, { message: 'Age must be at least 18' })
  @Max(100, { message: 'Age must not exceed 100' })
  age: number;

  @ApiProperty({
    description: 'Unique email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email must not be empty' })
  email: string;

  @ApiProperty({
    description: 'Password (minimum 6 characters)',
    example: 'secret123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty({ message: 'Password must not be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
