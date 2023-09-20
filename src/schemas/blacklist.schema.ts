import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Blacklist {
  @ApiProperty({
    description: 'Token ID',
    example: '5f9c5d6f6a4e8b1e4c2d1b8d',
  })
  @Prop({ type: String, required: true, unique: true })
  access_token: string;

  @ApiProperty({
    description: 'Token Description',
    example: 'This is a token description',
  })
  @Prop({ type: String, required: false, default: null })
  description: string;

  @ApiProperty({
    description: 'Token Issued At',
    example: new Date(),
  })
  @Prop({ type: Date, required: true })
  issued_at: Date;

  @ApiProperty({
    description: 'Token Expires At',
    example: new Date(),
  })
  @Prop({ type: Date, required: true })
  expires_at: Date;
}

export type TBlacklistDocument = HydratedDocument<Blacklist>;
export const BlacklistSchema = SchemaFactory.createForClass(Blacklist);
