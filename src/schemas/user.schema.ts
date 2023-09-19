import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TUserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ type: String, required: true, unique: true })
  tid: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
