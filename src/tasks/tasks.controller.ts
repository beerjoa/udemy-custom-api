import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from '#auth/guard';
import { CreateTaskDto } from '#tasks/dto/create-task.dto';
import { UpdateTaskDto } from '#tasks/dto/update-task.dto';
import { ParseTaskIDPipe } from '#tasks/tasks.pipe';
import { TasksService } from '#tasks/tasks.service';

import { Task } from '#schemas';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiTags('tasks')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOkResponse({ type: Task, description: 'Task created successfully' })
  @ApiOperation({
    summary: 'Create a new task',
    description: 'It can create a new task.',
    operationId: 'create',
  })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOkResponse({ type: [Task], description: 'Tasks found successfully' })
  @ApiOperation({
    summary: 'Find all tasks',
    description: 'It can find all tasks.',
    operationId: 'findAll',
  })
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':task_id')
  @ApiOkResponse({ type: Task, description: 'Task found successfully' })
  @ApiOperation({
    summary: 'Find a task by ID',
    description: 'It can find a task by ID.',
    operationId: 'findOne',
  })
  findOne(@Param('task_id', ParseTaskIDPipe) task_id: string) {
    return this.tasksService.findOne(task_id);
  }

  @Put(':task_id')
  @ApiOkResponse({ type: Task, description: 'Task updated successfully' })
  @ApiOperation({
    summary: 'Update a task by ID',
    description: 'It can update a task by ID.',
    operationId: 'update',
  })
  update(@Param('task_id', ParseTaskIDPipe) task_id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(task_id, updateTaskDto);
  }

  @Delete(':task_id')
  @ApiOkResponse({ type: Task, description: 'Task removed successfully' })
  @ApiOperation({
    summary: 'Remove a task by ID',
    description: 'It can remove a task by ID.',
    operationId: 'remove',
  })
  remove(@Param('task_id', ParseTaskIDPipe) task_id: string) {
    return this.tasksService.remove(task_id);
  }
}
