import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { UserExistsException } from 'src/common/exceptions/user-exists.exception';

export interface User {
  id: number;
  name: string;
  age: number;
  email: string;
  password: string;
}

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: 1,
      name: 'Alice',
      age: 22,
      email: 'alice@gmail.com',
      password: 'Test@123',
    },
    {
      id: 2,
      name: 'Bob',
      age: 28,
      email: 'bob@gmail.com',
      password: 'Test@1111',
    },
  ];

  // ✅ GET /users
  findAll(): { status: number; message: string; data: User[] } {
    return {
      status: 200,
      message: 'Users fetched successfully',
      data: this.users,
    };
  }

  // ✅ GET /users/:id
  findOne(id: number): { status: number; message: string; data: User } {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return {
      status: 200,
      message: `User with ID ${id} fetched successfully`,
      data: user,
    };
  }

  create(createUserDto: CreateUserDto): {
    status: number;
    message: string;
    data: User;
  } {
    const existing = this.users.find((u) => u.email === createUserDto.email);
    if (existing) {
      throw new UserExistsException(createUserDto.email);
    }

    const maxId =
      this.users.length > 0 ? Math.max(...this.users.map((u) => u.id)) : 0;

    const newUser: User = {
      id: maxId + 1,
      ...createUserDto,
    };

    this.users.push(newUser);

    return {
      status: 201,
      message: 'User created successfully',
      data: newUser,
    };
  }

  findUser(id: number) {
    const user = this.users.find((user) => user.id === id);
    return user;
  }

  update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): { status: number; message: string; data: User } {
    const user = this.findUser(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto?.email) {
      const emailExists = this.users.some(
        (u) => u.email === updateUserDto.email && u.id !== id,
      );
      if (emailExists) {
        throw new BadRequestException(
          `Email "${updateUserDto.email}" is already in use`,
        );
      }
    }

    Object.assign(user, updateUserDto);

    return {
      status: 200,
      message: `User with ID ${id} updated successfully`,
      data: user,
    };
  }

  delete(id: number): { status: number; message: string; data: null } {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.users.splice(index, 1);

    return {
      status: 200,
      message: `User with ID ${id} deleted successfully`,
      data: null,
    };
  }
}
