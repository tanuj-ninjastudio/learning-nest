import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { QueryTaskDto } from './dto/query-task.dto';
import { IApiResponse } from 'src/common/interfaces/api-response.interface';
import { Task } from './task.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Add a new task for a user' })
  @ApiParam({ name: 'userId', description: 'User ID', type: Number })
  @ApiBody({ schema: { properties: { title: { type: 'string' } } } })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    type: Task,
  })
  addTask(
    @Param('userId', ParseIntPipe) userId: number,
    @Body('title') title: string,
  ): Promise<IApiResponse<Task>> {
    return this.tasksService.addTask(userId, title);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get tasks for a specific user' })
  @ApiParam({ name: 'userId', description: 'User ID', type: Number })
  @ApiQuery({ name: 'completed', required: false, type: String })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Tasks fetched successfully',
    type: [Task],
  })
  listTasks(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() query: QueryTaskDto,
  ): Promise<IApiResponse<Task[]>> {
    return this.tasksService.listTasks(userId, query);
  }

  @Post('complete/:taskId')
  @ApiOperation({ summary: 'Mark a task as completed' })
  @ApiParam({ name: 'taskId', description: 'Task ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Task marked as completed',
    type: Task,
  })
  completeTask(
    @Param('taskId', ParseIntPipe) taskId: number,
  ): Promise<IApiResponse<Task>> {
    return this.tasksService.completeTask(taskId);
  }
}
