import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { IApiResponse } from 'src/common/interfaces/api-response.interface';
import { UpdateUserDto } from './dto/update-user-dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';

import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import type { Express } from 'express';
import { parse } from 'csv-parse/sync';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users', type: [User] })
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  getAllUsers(): Promise<IApiResponse<User[]>> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: Number })
  findUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IApiResponse<User>> {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IApiResponse<User>> {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiParam({ name: 'id', type: Number })
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IApiResponse<User>> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IApiResponse<null>> {
    return this.usersService.delete(id);
  }

  /**
   * Upload CSV to create multiple users at once
   */
  @Post('upload-csv')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    }),
  )
  async uploadCsv(@UploadedFile() file?: Express.Multer.File) {
    if (!file || !(file.buffer instanceof Buffer)) {
      throw new BadRequestException('CSV file is required');
    }

    let records: Record<string, string>[];

    try {
      let csvText = file.buffer.toString('utf8');

      csvText = csvText.replace(/^\uFEFF/, '').trim();

      csvText = csvText.replace(/\r\n/g, '\n');

      if (!csvText.startsWith('name,')) {
        throw new BadRequestException(
          'CSV must start with a header line like "name,email,password,age,role"',
        );
      }

      const parsed = parse(csvText, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });

      records = parsed as Record<string, string>[];
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Unknown CSV parsing error';
      throw new BadRequestException(`Unable to parse CSV: ${msg}`);
    }

    if (records.length === 0) {
      throw new BadRequestException('CSV file contains no rows');
    }

    const dtoInstances = records.map((r) =>
      plainToInstance(CreateUserDto, {
        name: r.name?.trim(),
        email: r.email?.trim(),
        password: r.password?.trim(),
        age: Number(r.age),
        role: r.role?.trim(),
      }),
    );

    const validationResults = await Promise.all(
      dtoInstances.map((dto) => validate(dto, { whitelist: true })),
    );

    const rowErrors = validationResults
      .map((errors, idx) => {
        if (errors.length > 0) {
          return {
            row: idx + 1,
            errors: errors.flatMap((e) => Object.values(e.constraints ?? {})),
            raw: records[idx],
          };
        }
        return null;
      })
      .filter((e): e is NonNullable<typeof e> => e !== null);

    if (rowErrors.length > 0) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation errors found in CSV rows',
        errors: rowErrors,
      };
    }

    const result = await this.usersService.createManyFromCsv(dtoInstances);

    return {
      statusCode: HttpStatus.OK,
      message: 'CSV processed successfully',
      data: result,
    };
  }
}
