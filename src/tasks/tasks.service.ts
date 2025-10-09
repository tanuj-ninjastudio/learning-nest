import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { User } from '../users/user.entity';
import { QueryTaskDto } from './dto/query-task.dto';
import { IApiResponse } from 'src/common/interfaces/api-response.interface';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async addTask(userId: number, title: string): Promise<IApiResponse<Task>> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    const task = this.taskRepo.create({ title, user });
    const savedTask = await this.taskRepo.save(task);

    return {
      status: 201,
      message: 'Task created successfully',
      data: savedTask,
    };
  }

  async listTasks(
    userId: number,
    query: QueryTaskDto,
  ): Promise<IApiResponse<Task[]>> {
    const { completed, skip, take } = query;

    const qb = this.taskRepo
      .createQueryBuilder('task')
      .where('task.userId = :userId', { userId })
      .orderBy('task.createdAt', 'DESC')
      .skip(skip)
      .take(take);

    if (completed !== undefined) {
      qb.andWhere('task.completed = :completed', {
        completed: completed === 'true',
      });
    }

    const tasks = await qb.getMany();

    return {
      status: 200,
      message: `Tasks for user ID ${userId} fetched successfully`,
      data: tasks,
    };
  }

  async completeTask(taskId: number): Promise<IApiResponse<Task>> {
    const task = await this.taskRepo.findOne({ where: { id: taskId } });
    if (!task) throw new NotFoundException(`Task with ID ${taskId} not found`);

    task.completed = true;
    const updatedTask = await this.taskRepo.save(task);

    return {
      status: 200,
      message: `Task with ID ${taskId} marked as completed`,
      data: updatedTask,
    };
  }
}
