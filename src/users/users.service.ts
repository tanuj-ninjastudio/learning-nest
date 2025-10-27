import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { User } from './user.entity';
import { UserExistsException } from 'src/common/exceptions/user-exists.exception';
import { IApiResponse } from 'src/common/interfaces/api-response.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll(): Promise<IApiResponse<User[]>> {
    const users = await this.userRepo.find({ relations: ['tasks'] });
    return {
      status: 200,
      message: 'Users fetched successfully',
      data: users,
    };
  }

  async findOne(id: number): Promise<IApiResponse<User>> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['tasks'],
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    return {
      status: 200,
      message: `User with ID ${id} fetched successfully`,
      data: user,
    };
  }

  async create(dto: CreateUserDto): Promise<IApiResponse<User>> {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) throw new UserExistsException(dto.email);

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({ ...dto, password: hashedPassword });

    const saved = await this.userRepo.save(user);

    return {
      status: 201,
      message: 'User created successfully',
      data: saved,
    };
  }

  async update(id: number, dto: UpdateUserDto): Promise<IApiResponse<User>> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    if (dto.email) {
      const emailExists = await this.userRepo.findOne({
        where: { email: dto.email },
      });
      if (emailExists && emailExists.id !== id) {
        throw new BadRequestException(`Email "${dto.email}" is already in use`);
      }
    }

    if (dto.password) {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(dto.password, salt);
    }

    Object.assign(user, dto);
    const updated = await this.userRepo.save(user);

    return {
      status: 200,
      message: `User with ID ${id} updated successfully`,
      data: updated,
    };
  }

  async delete(id: number): Promise<IApiResponse<null>> {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return {
      status: 200,
      message: `User with ID ${id} deleted successfully`,
      data: null,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async createManyFromCsv(users: CreateUserDto[]): Promise<User[]> {
    const createdUsers: User[] = [];

    for (const dto of users) {
      const existing = await this.userRepo.findOne({
        where: { email: dto.email },
      });
      if (existing) continue;

      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const user = this.userRepo.create({ ...dto, password: hashedPassword });
      const newUsers = await this.userRepo.save(user);
      createdUsers.push(newUsers);
    }

    return createdUsers;
  }
}
