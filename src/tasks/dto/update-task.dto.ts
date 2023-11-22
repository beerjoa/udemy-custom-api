import { PartialType } from '@nestjs/swagger';

import { TaskDto } from '#tasks/dto/create-task.dto';

export class UpdateTaskDto extends PartialType(TaskDto) {}
