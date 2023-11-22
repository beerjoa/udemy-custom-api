import { PickType } from '@nestjs/swagger';

import { Task } from '#schemas';

export class TaskDto extends PickType(Task, ['title', 'description', 'status', 'type', 'result'] as const) {}

export class CreateTaskDto extends TaskDto {}
