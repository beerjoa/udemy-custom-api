import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

@Schema()
export class User {
  @Prop({ type: String, required: true, unique: true })
  @ApiProperty({ type: String, description: 'TID of the user', example: 'dummy-tid' })
  tid: string;

  @Prop({ type: String, required: true, unique: true })
  @ApiProperty({ type: String, description: 'email of the user', example: 'test@test.com' })
  email: string;
}

export type TUserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
