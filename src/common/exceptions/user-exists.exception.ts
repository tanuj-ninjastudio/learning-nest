// src/common/exceptions/user-exists.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class UserExistsException extends HttpException {
  constructor(email: string) {
    super(`User with email ${email} already exists`, HttpStatus.BAD_REQUEST);
  }
}
