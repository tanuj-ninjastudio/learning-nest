// src/tasks/tasks.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { User } from '../users/user.entity';
import { QueryTaskDto } from './dto/query-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async addTask(userId: number, title: string): Promise<Task> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    const task = this.taskRepo.create({ title, user });
    return this.taskRepo.save(task);
  }

  async listTasks(userId: number, query: QueryTaskDto): Promise<Task[]> {
    const { completed, skip, take } = query;

    const qb = this.taskRepo
      .createQueryBuilder('task')
      .where('task.userId = :userId', { userId })
      .orderBy('task.createdAt', 'DESC') // sorting
      .skip(skip)
      .take(take);

    if (completed !== undefined) {
      qb.andWhere('task.completed = :completed', {
        completed: completed === 'true',
      });
    }

    return qb.getMany();
  }

  async completeTask(taskId: number): Promise<Task> {
    const task = await this.taskRepo.findOne({ where: { id: taskId } });
    if (!task) throw new NotFoundException(`Task with ID ${taskId} not found`);

    task.completed = true;
    return this.taskRepo.save(task);
  }
}
