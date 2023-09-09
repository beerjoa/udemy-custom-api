import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { ETaskStatus } from '#schemas/task.schema';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Task Title',
    example: 'This is a task title',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Task Description',
    example: 'This is a task description',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Task Status',
    example: ETaskStatus.OPEN,
  })
  @IsEnum(ETaskStatus)
  status: ETaskStatus;
}
