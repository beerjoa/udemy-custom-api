import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { HydratedDocument } from 'mongoose';

export enum ETaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
}

export type TTaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Exclude()
  @ApiProperty({
    description: 'Task ID',
    example: '5f9c5d6f6a4e8b1e4c2d1b8d',
  })
  _id: string;

  @ApiProperty({
    description: 'Task Title',
    example: 'This is a task title',
  })
  @Prop({ required: true })
  title: string;

  @ApiProperty({
    description: 'Task Description',
    example: 'This is a task description',
  })
  @Prop({ required: true })
  description: string;

  @ApiProperty({
    description: 'Task Status',
    example: ETaskStatus.OPEN,
    enum: ETaskStatus,
  })
  @Prop({ required: true })
  status: ETaskStatus;

  @ApiProperty({
    description: 'Task Result',
    example: null,
  })
  @Prop({
    required: false,
    type: Object,
    default: null,
  })
  result: object;

  @ApiProperty({
    description: 'Task Created At',
    example: new Date(),
  })
  @Prop({
    required: true,
    type: Date,
    default: Date.now,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Task Updated At',
    example: new Date(),
  })
  @Prop({
    type: Date,
    default: Date.now,
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Task Deleted At',
    example: null,
  })
  @Prop({
    type: Date,
    default: null,
  })
  deletedAt: Date;

  @ApiProperty({
    description: 'Task Version',
    example: 0,
  })
  __v: number;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
