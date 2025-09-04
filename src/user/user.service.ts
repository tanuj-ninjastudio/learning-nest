import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user-dto';

export interface User {
  id: number;
  name: string;
  age: number;
}

@Injectable()
export class UserService {
  private users = [
    { id: 1, name: 'Alice', age: 22 },
    { id: 2, name: 'Bob', age: 28 },
  ];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  create(createUserDto: CreateUserDto): User {
    const newUser = { id: Date.now(), ...createUserDto };
    this.users.push(newUser);
    return newUser;
  }

  update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): { message: string; user: User } {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    if (updateUserDto?.name) user.name = updateUserDto.name;
    if (updateUserDto?.age) user.age = updateUserDto.age;
    return { message: `User with ID ${id} updated successfully`, user };
  }

  delete(id: number): { message: string } {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.users.splice(index, 1);
    return { message: `User with ID ${id} deleted successfully` };
  }
}
