import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// PartialType makes all the fields optional
export class UpdateUserDto extends PartialType(CreateUserDto) {
  name?: string;
  age?: number;
}
