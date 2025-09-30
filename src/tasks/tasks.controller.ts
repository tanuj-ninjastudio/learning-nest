// src/tasks/tasks.controller.ts
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

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post(':userId')
  addTask(
    @Param('userId', ParseIntPipe) userId: number,
    @Body('title') title: string,
  ) {
    return this.tasksService.addTask(userId, title);
  }

  @Get(':userId')
  listTasks(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() query: QueryTaskDto,
  ) {
    return this.tasksService.listTasks(userId, query);
  }

  @Post('complete/:taskId')
  completeTask(@Param('taskId', ParseIntPipe) taskId: number) {
    return this.tasksService.completeTask(taskId);
  }
}
