import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from '#auth/auth.controller';
import { AuthService } from '#auth/auth.service';
import { JwtStrategy, LocalStrategy } from '#auth/strategy';
import { UsersService } from '#auth/users.service';
import jwtConfigAsync from '#core/jwt.config';

import { BlacklistSchema, UserSchema } from '#schemas';

@Module({
  imports: [
    PassportModule,
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Blacklist', schema: BlacklistSchema },
    ]),
    JwtModule.registerAsync(jwtConfigAsync),
  ],
  providers: [AuthService, UsersService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
