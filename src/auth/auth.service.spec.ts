import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { AuthService } from '#auth/auth.service';
import { LoginResponseDto } from '#auth/dto/login.dto';
import { UserPayloadDto } from '#auth/dto/verify.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  const accessToken = 'test-access-token';
  const loginRequestUser = {
    email: 'test@test.com',
    tid: 'test',
  };

  const userPayload: UserPayloadDto = {
    email: expect.any(String),
    tid: expect.any(String),
    iat: expect.any(Number),
    exp: expect.any(Number),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue(accessToken),
          },
        },
        {
          provide: getModelToken('Blacklist'),
          useValue: {
            new: jest.fn().mockResolvedValue({}),
            constructor: jest.fn().mockResolvedValue({}),
            create: jest.fn().mockResolvedValue({}),
            find: jest.fn().mockResolvedValue([{}]),
          },
        },
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: {
            log: jest.fn(),
            debug: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('when login user', () => {
    it('should be defined', () => {
      expect(authService.login).toBeDefined();
    });

    describe('and user is logged in successfully', () => {
      it('should return login response dto', async () => {
        expect(await authService.login(loginRequestUser)).toMatchObject({
          ...loginRequestUser,
          access_token: accessToken,
        } as LoginResponseDto);
      });
    });
  });

  describe('when logout user', () => {
    it('should be defined', () => {
      expect(authService.logout).toBeDefined();
    });

    describe('and user is logged out successfully', () => {
      it('should return user payload dto', async () => {
        expect(await authService.logout(userPayload, accessToken)).toEqual(userPayload);
      });
    });
  });
});
