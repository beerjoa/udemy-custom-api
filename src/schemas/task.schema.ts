import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { HydratedDocument } from 'mongoose';

export enum ETaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
}

@Schema()
export class Task {
  @Exclude()
  @ApiProperty({
    description: 'Task ID',
    example: '5f9c5d6f6a4e8b1e4c2d1b8d',
  })
  _id: string;

  @ApiProperty({
    type: String,
    description: 'Task Title',
    example: 'This is a task title',
  })
  @Expose()
  @Prop({ required: true })
  title: string;

  @ApiProperty({
    type: String,
    description: 'Task Description',
    example: 'This is a task description',
  })
  @Expose()
  @Prop({ required: true })
  description: string;

  @ApiProperty({
    description: 'Task Status',
    example: ETaskStatus.OPEN,
    enum: ETaskStatus,
  })
  @Expose()
  @Prop({ required: true })
  status: ETaskStatus;

  @ApiProperty({
    type: Object,
    description: 'Task Result',
    example: null,
  })
  @Expose()
  @Prop({
    required: false,
    type: Object,
    default: null,
  })
  result: object;

  @ApiProperty({
    type: Date,
    description: 'Task Created At',
    example: new Date(),
  })
  @Expose()
  @Prop({
    required: true,
    type: Date,
    default: Date.now,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: 'Task Updated At',
    example: new Date(),
  })
  @Expose()
  @Prop({
    type: Date,
    default: Date.now,
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Task Deleted At',
    example: null,
  })
  @Expose()
  @Prop({
    type: Date,
    default: null,
  })
  deletedAt: Date;

  @Exclude()
  @ApiProperty({
    description: 'Task Version',
    example: 0,
  })
  __v: number;
}

export type TTaskDocument = HydratedDocument<Task>;
export const TaskSchema = SchemaFactory.createForClass(Task);
