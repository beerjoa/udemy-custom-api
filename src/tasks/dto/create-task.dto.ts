import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

import { ETaskStatus, ETaskType } from '#schemas';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Task Title',
    example: 'This is a task title',
    type: String,
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Task Description',
    example: 'This is a task description',
    type: String,
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Task Status',
    example: ETaskStatus.OPEN,
    enum: ETaskStatus,
  })
  @IsEnum(ETaskStatus)
  status: ETaskStatus;

  @ApiProperty({
    description: 'Task Status',
    example: ETaskType.NONE,
    enum: ETaskType,
  })
  @IsEnum(ETaskType)
  type: ETaskType;
}
