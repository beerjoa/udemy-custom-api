import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Task } from '#schemas/task.schema';
import { CreateTaskDto } from '#tasks/dto/create-task.dto';
import { UpdateTaskDto } from '#tasks/dto/update-task.dto';
import { ParseTaskIDPipe } from '#tasks/tasks.pipe';
import { TasksService } from '#tasks/tasks.service';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOkResponse({ type: Task, description: 'Task created successfully' })
  @ApiOperation({ summary: 'Create a new task' })
  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @ApiOkResponse({ type: [Task], description: 'Tasks found successfully' })
  @ApiOperation({ summary: 'Find all tasks' })
  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @ApiOkResponse({ type: Task, description: 'Task found successfully' })
  @ApiOperation({ summary: 'Find a task by ID' })
  @Get(':task_id')
  findOne(@Param('task_id', ParseTaskIDPipe) task_id: string) {
    return this.tasksService.findOne(task_id);
  }

  @ApiOkResponse({ type: Task, description: 'Task updated successfully' })
  @ApiOperation({ summary: 'Update a task by ID' })
  @Put(':task_id')
  update(@Param('task_id', ParseTaskIDPipe) task_id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(task_id, updateTaskDto);
  }

  @ApiOkResponse({ type: Task, description: 'Task removed successfully' })
  @ApiOperation({ summary: 'Remove a task by ID' })
  @Delete(':task_id')
  remove(@Param('task_id', ParseTaskIDPipe) task_id: string) {
    return this.tasksService.remove(task_id);
  }
}
